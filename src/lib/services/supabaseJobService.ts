import { FacultyJobItem, getActiveFacultyJobs } from '@/data/facultyJobsData';
import { maskPhonesInText } from '@/lib/jobCardUtils';
import { GoogleGeocodingService } from './googleGeocodingService';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ukazkxthavxphibdbspd.supabase.co';
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrYXpreHRoYXZ4cGhpYmRic3BkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MTk4MzgsImV4cCI6MjA4OTM5NTgzOH0.Oi47bXRcJ5dAAblFqYUnFvbUx61DS8ABBikC6cIjGlo';

/**
 * Supabase Jobs Database Sync Service
 * Directly reads & writes to Supabase public.jobs table.
 */
let _cachedJobs: FacultyJobItem[] | null = null;
let _lastJobsFetchTime = 0;
const JOBS_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache

export class SupabaseJobService {
  /**
   * Fetches active school faculty jobs from Supabase with in-memory caching & timeout protection
   */
  static async fetchJobsFromSupabase(): Promise<FacultyJobItem[]> {
    // Return from in-memory cache if fresh
    if (_cachedJobs && _cachedJobs.length > 0 && Date.now() - _lastJobsFetchTime < JOBS_CACHE_TTL_MS) {
      return _cachedJobs;
    }

    if (!SUPABASE_KEY) {
      console.warn("[SupabaseJobService] No API key available");
      return _cachedJobs || [];
    }

    try {
      // 1-batch query with a strict 3-second timeout to never block page rendering
      const url = `${SUPABASE_URL}/rest/v1/jobs?is_active=eq.true&order=posted_at.desc&limit=500`;
      const res = await fetch(url, {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
        signal: AbortSignal.timeout(800),
      });

      if (!res.ok) {
        console.error(`[SupabaseJobService] Failed to fetch: status ${res.status}`);
        return _cachedJobs || [];
      }

      const rows: any[] = await res.json();
      if (Array.isArray(rows) && rows.length > 0) {
        const mapped = rows.map((r) => this.mapRowToJobItem(r));
        _cachedJobs = mapped;
        _lastJobsFetchTime = Date.now();
        return mapped;
      }

      return (_cachedJobs && _cachedJobs.length > 0) ? _cachedJobs : getActiveFacultyJobs();
    } catch (err: any) {
      console.warn("[SupabaseJobService] Supabase fetch timed out or error (falling back to cache/local data):", err?.message || err);
      return (_cachedJobs && _cachedJobs.length > 0) ? _cachedJobs : getActiveFacultyJobs();
    }
  }

  /**
   * Upserts a batch of FacultyJobItem into Supabase public.jobs table
   */
  static async upsertJobsToSupabase(jobs: FacultyJobItem[]): Promise<{ success: boolean; count: number; error?: string }> {
    if (!SUPABASE_KEY) {
      return { success: false, count: 0, error: 'No SUPABASE_SERVICE_ROLE_KEY configured' };
    }

    try {
      const payload = jobs.map((j) => this.mapJobItemToRow(j));
      const url = `${SUPABASE_URL}/rest/v1/jobs?on_conflict=slug`;

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates,return=minimal',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error('[SupabaseJobService] Upsert error:', res.status, errText);
        return { success: false, count: 0, error: errText };
      }

      return { success: true, count: jobs.length };
    } catch (err: any) {
      console.error('[SupabaseJobService] Network error during upsert:', err);
      return { success: false, count: 0, error: err.message };
    }
  }

  /**
   * Purges jobs older than 45 days from Supabase table
   */
  static async purgeExpiredJobsFromSupabase(maxDays: number = 45): Promise<number> {
    if (!SUPABASE_KEY) return 0;

    try {
      const cutoffDate = new Date(Date.now() - maxDays * 24 * 60 * 60 * 1000).toISOString();
      const url = `${SUPABASE_URL}/rest/v1/jobs?posted_at=lt.${cutoffDate}`;

      const res = await fetch(url, {
        method: 'DELETE',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          Prefer: 'return=representation',
        },
      });

      if (res.ok) {
        const deleted: any[] = await res.json();
        return deleted.length;
      }
      return 0;
    } catch (e) {
      console.error('[SupabaseJobService] Purge error:', e);
      return 0;
    }
  }

  /**
   * Maps a Supabase row to a clean FacultyJobItem
   */
  static mapRowToJobItem(r: any): FacultyJobItem {
    // Parse metadata from requirements text[]
    const meta: Record<string, string> = {};
    if (Array.isArray(r.requirements)) {
      for (const item of r.requirements) {
        const idx = item.indexOf(':');
        if (idx > -1) {
          const k = item.slice(0, idx).trim();
          const v = item.slice(idx + 1).trim();
          meta[k] = v;
        }
      }
    }

    let lat = meta.lat ? parseFloat(meta.lat) : NaN;
    let lng = meta.lng ? parseFloat(meta.lng) : NaN;

    if (isNaN(lat) || isNaN(lng) || (lat === 0 && lng === 0)) {
      const geo = GoogleGeocodingService.resolveSync({
        schoolName: r.institute_name,
        city: r.city,
        state: r.state,
        address: meta.address,
        district: meta.district,
      });
      lat = geo.lat;
      lng = geo.lng;
    }

    const sMin = meta.salary_min ? parseInt(meta.salary_min, 10) : undefined;
    const sMax = meta.salary_max ? parseInt(meta.salary_max, 10) : undefined;

    return {
      id: r.slug || r.id,
      organisationName: r.institute_name || 'Educational Institution',
      organisationLogo: meta.logo || undefined,
      image_url: r.image_url || meta.image_url || undefined,
      jobPostName: r.title,
      designation: meta.designation || undefined,
      subject: r.department && r.department !== 'Faculty' ? r.department : (meta.subject || undefined),
      board: meta.board || undefined,
      roleType: r.job_type || 'Full-Time',
      salary: r.salary_range || '---',
      salaryMin: sMin,
      salaryMax: sMax,
      shortDescription: maskPhonesInText(r.description || `${r.institute_name} is hiring for ${r.title} in ${r.city}, ${r.state}.`),
      address: meta.address || `${r.city || ''}, ${r.state || 'India'}`,
      city: r.city || 'India',
      state: r.state || 'India',
      district: meta.district || r.city,
      coordinates: { lat, lng },
      minExperience: r.experience_required || undefined,
      openingDate: meta.opening_date || (r.posted_at ? r.posted_at.split('T')[0] : undefined),
      lastDate: r.deadline || undefined, // ONLY if real deadline was provided
      source: meta.source || 'Direct School Portal',
      originalUrl: meta.url || 'https://www.cseel.org/edu-network/teachers',
      applyUrl: meta.apply_url || undefined,
      verified: true,
      badge: meta.source ? `${meta.source} Verified` : undefined,
    };
  }

  /**
   * Maps a FacultyJobItem to Supabase row format
   */
  static mapJobItemToRow(j: FacultyJobItem): any {
    const slug = j.id.startsWith('job-') || j.id.startsWith('li-') || j.id.startsWith('nk-')
      ? j.id
      : `job-${j.id}`;

    // Pack extended metadata cleanly into requirements array
    const reqs: string[] = [];
    if (j.source) reqs.push(`source:${j.source}`);
    if (j.originalUrl) reqs.push(`url:${j.originalUrl}`);
    if (j.applyUrl) reqs.push(`apply_url:${j.applyUrl}`);
    if (j.coordinates) {
      reqs.push(`lat:${j.coordinates.lat}`);
      reqs.push(`lng:${j.coordinates.lng}`);
    }
    if (j.district) reqs.push(`district:${j.district}`);
    if (j.address) reqs.push(`address:${j.address}`);
    if (j.designation) reqs.push(`designation:${j.designation}`);
    if (j.subject) reqs.push(`subject:${j.subject}`);
    if (j.board) reqs.push(`board:${j.board}`);
    if (j.organisationLogo) reqs.push(`logo:${j.organisationLogo}`);
    if (j.image_url) reqs.push(`image_url:${j.image_url}`);
    if (j.salaryMin) reqs.push(`salary_min:${j.salaryMin}`);
    if (j.salaryMax) reqs.push(`salary_max:${j.salaryMax}`);
    if (j.openingDate) reqs.push(`opening_date:${j.openingDate}`);

    return {
      title: j.jobPostName,
      slug: slug,
      department: j.subject || 'Faculty',
      institute_name: j.organisationName,
      city: j.city || 'India',
      state: j.state || 'India',
      salary_range: j.salary || '---',
      experience_required: j.minExperience || null,
      job_type: j.roleType || 'Full-time',
      description: j.shortDescription,
      image_url: j.image_url || null,
      requirements: reqs,
      benefits: j.facilities || [],
      is_active: true,
      deadline: j.lastDate || null, // ONLY real deadline
      posted_at: j.openingDate ? new Date(j.openingDate).toISOString() : new Date().toISOString(),
    };
  }
}
