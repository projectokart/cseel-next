import { NextRequest, NextResponse } from 'next/server';
import { JobAggregatorStorage, JobCardExtractor, RawJobInput } from '@/lib/services/jobAggregatorEngine';
import { getActiveFacultyJobs, FacultyJobItem } from '@/data/facultyJobsData';
import { SupabaseJobService } from '@/lib/services/supabaseJobService';

export const dynamic = 'force-dynamic';

/**
 * GET /api/jobs
 * Multi-Portal School Jobs Search & Aggregation API
 *
 * Query Params:
 *  - q: search keyword in role or school
 *  - city: city filter (Delhi, Noida, Gurugram, Mumbai, etc.)
 *  - subject: subject filter (Physics, Chemistry, Mathematics, etc.)
 *  - designation: designation filter (PGT, TGT, PRT, ATL Mentor, etc.)
 *  - source: portal filter (Indeed, LinkedIn, Naukri.com, Apna.co, Foundit, etc.)
 *  - minSalary: minimum salary in LPA numeric (e.g. 500000)
 */
function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q')?.toLowerCase() || '';
    const city = searchParams.get('city')?.toLowerCase() || '';
    const state = searchParams.get('state')?.toLowerCase() || '';
    const district = searchParams.get('district')?.toLowerCase() || '';
    const subject = searchParams.get('subject')?.toLowerCase() || '';
    const designation = searchParams.get('designation')?.toLowerCase() || '';
    const source = searchParams.get('source')?.toLowerCase() || '';
    const minSalaryStr = searchParams.get('minSalary') || '0';
    const minSalary = parseInt(minSalaryStr, 10) || 0;

    const userLat = searchParams.get('lat') ? parseFloat(searchParams.get('lat')!) : null;
    const userLng = searchParams.get('lng') ? parseFloat(searchParams.get('lng')!) : null;
    const radiusKm = searchParams.get('radius') ? parseFloat(searchParams.get('radius')!) : null;
    const sortBy = searchParams.get('sort');

    // Load active, verified vacancies from Supabase directly, fall back to local store
    let allJobs: FacultyJobItem[] = await SupabaseJobService.fetchJobsFromSupabase();
    if (!allJobs || allJobs.length === 0) {
      allJobs = getActiveFacultyJobs();
    }

    let filtered = allJobs.filter((job) => {
      if (q) {
        const text = `${job.jobPostName} ${job.organisationName} ${job.subject || ''} ${job.designation || ''} ${job.city || ''} ${job.state || ''} ${job.district || ''} ${job.address || ''}`.toLowerCase();
        if (!text.includes(q)) return false;
      }
      if (city && !(job.city || '').toLowerCase().includes(city)) return false;
      if (state && !(job.state || '').toLowerCase().includes(state)) return false;
      if (district && !(job.district || job.city || '').toLowerCase().includes(district)) return false;
      if (subject && !(job.subject || '').toLowerCase().includes(subject)) return false;
      if (designation && (job.designation || '').toLowerCase() !== designation) return false;
      if (source && !(job.source || '').toLowerCase().includes(source)) return false;
      if (minSalary > 0 && job.salaryMin && job.salaryMin < minSalary) return false;

      // Distance radius filter if GPS coords and radius provided
      if (userLat !== null && userLng !== null && radiusKm && radiusKm > 0) {
        if (job.coordinates && typeof job.coordinates.lat === 'number' && typeof job.coordinates.lng === 'number') {
          const dist = getDistanceKm(userLat, userLng, job.coordinates.lat, job.coordinates.lng);
          if (dist > radiusKm) return false;
        }
      }

      return true;
    });

    // Attach distanceKm if user coordinates are provided
    if (userLat !== null && userLng !== null) {
      filtered = filtered.map((job) => {
        if (job.coordinates && typeof job.coordinates.lat === 'number' && typeof job.coordinates.lng === 'number') {
          const distanceKm = getDistanceKm(userLat, userLng, job.coordinates.lat, job.coordinates.lng);
          return { ...job, distanceKm };
        }
        return job;
      });

      // Sort by distance ascending if near_me requested
      if (sortBy === 'near_me') {
        filtered.sort((a: any, b: any) => (a.distanceKm ?? 99999) - (b.distanceKm ?? 99999));
      }
    }

    // Portal breakdown statistics
    const portalStats: Record<string, number> = {};
    for (const j of allJobs) {
      portalStats[j.source] = (portalStats[j.source] || 0) + 1;
    }

    // 25-item pagination support
    const pageStr = searchParams.get('page');
    const limitStr = searchParams.get('limit');
    const paginate = searchParams.get('paginate') === 'true' || Boolean(pageStr) || limitStr !== null;

    const limit = limitStr ? Math.max(1, parseInt(limitStr, 10) || 25) : 25;
    const page = pageStr ? Math.max(1, parseInt(pageStr, 10) || 1) : 1;

    let paginatedJobs = filtered;
    let hasMore = false;
    const totalPages = Math.ceil(filtered.length / limit) || 1;

    if (paginate) {
      const startIndex = (page - 1) * limit;
      paginatedJobs = filtered.slice(startIndex, startIndex + limit);
      hasMore = startIndex + limit < filtered.length;
    }

    return NextResponse.json({
      success: true,
      totalCount: allJobs.length,
      matchedCount: filtered.length,
      page,
      limit,
      totalPages,
      hasMore,
      portalBreakdown: portalStats,
      jobs: paginatedJobs,
    });
  } catch (err: any) {
    console.error('[API /api/jobs GET] Error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/jobs
 * Ingest, normalize, and save raw jobs from external crawlers/APIs
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body.action || 'sync';

    if (action === 'ingest_naukri') {
      // Handles raw Naukri v3 search payload: either { jobDetails: [...] } or array directly
      const jobDetails = Array.isArray(body.jobDetails)
        ? body.jobDetails
        : Array.isArray(body.jobs)
        ? body.jobs
        : Array.isArray(body)
        ? body
        : [];

      if (jobDetails.length === 0) {
        return NextResponse.json(
          { success: false, error: 'No jobDetails found in Naukri payload' },
          { status: 400 }
        );
      }

      const cardItems = jobDetails.map((j: any) => JobCardExtractor.fromNaukri(j));
      const result = JobAggregatorStorage.saveAggregatedJobs(cardItems);

      // Also upsert directly to Supabase public.jobs table
      try {
        await SupabaseJobService.upsertJobsToSupabase(cardItems);
      } catch (e) {
        console.warn('[API /api/jobs] Supabase upsert notice:', e);
      }

      const res = NextResponse.json({
        success: true,
        message: `Extracted & normalized ${cardItems.length} Naukri vacancies`,
        added: result.added,
        totalInStore: result.total,
        sample: cardItems.slice(0, 3),
      });
      res.headers.set('Access-Control-Allow-Origin', '*');
      return res;
    }

    if (action === 'ingest_linkedin') {
      const items = Array.isArray(body.jobs) ? body.jobs : Array.isArray(body) ? body : [];
      if (items.length === 0) {
        return NextResponse.json(
          { success: false, error: 'No jobs found in LinkedIn payload' },
          { status: 400 }
        );
      }

      const cardItems = items.map((j: any) => JobCardExtractor.fromLinkedInScraped(j));
      const result = JobAggregatorStorage.saveAggregatedJobs(cardItems);

      return NextResponse.json({
        success: true,
        message: `Extracted & normalized ${cardItems.length} LinkedIn vacancies`,
        added: result.added,
        totalInStore: result.total,
        sample: cardItems.slice(0, 3),
      });
    }

    if (action === 'ingest_app_jobs') {
      const items = Array.isArray(body.jobs) ? body.jobs : [];
      if (items.length === 0) {
        return NextResponse.json(
          { success: false, error: 'No jobs found in payload' },
          { status: 400 }
        );
      }

      // Convert items from desktop app format into FacultyJobItem
      const cardItems = items.map((j: any) => {
        const rawInput: RawJobInput = {
          rawTitle: j.title || 'School Teacher',
          rawSchoolName: j.employer || 'School / Educational Institution',
          rawLocation: j.location || j.city || 'India',
          rawCity: j.city,
          rawState: j.state,
          rawSalary: j.salary_text || j.salary,
          rawDescription: j.description || '',
          rawSourceUrl: j.url || 'https://in.indeed.com',
          portal: 'Indeed',
          postedDateStr: j.date_str || new Date().toISOString().split('T')[0]
        };
        const card = JobCardExtractor.transformToCardItem(rawInput);
        if (j.id) card.id = `job-ind-${j.id}`;
        if (j.city) card.district = j.city;
        return card;
      });

      const result = JobAggregatorStorage.saveAggregatedJobs(cardItems);

      // Concurrently sync to Supabase public.jobs table & enforce 45-day retention policy
      let supabaseSynced = false;
      try {
        const supaRes = await SupabaseJobService.upsertJobsToSupabase(cardItems);
        supabaseSynced = supaRes.success;
        await SupabaseJobService.purgeExpiredJobsFromSupabase(45);
      } catch (sErr) {
        console.warn('[API /api/jobs] Supabase sync warning:', sErr);
      }

      return NextResponse.json({
        success: true,
        message: `Successfully uploaded ${cardItems.length} jobs to database (45-day retention active)`,
        uploadedCount: cardItems.length,
        addedToDatabase: result.added,
        totalInDatabase: result.total,
        supabaseSynced,
        sample: cardItems.slice(0, 3)
      });
    }

    if (action === 'ingest_raw') {
      const rawList: RawJobInput[] = body.rawJobs || [];
      if (!Array.isArray(rawList) || rawList.length === 0) {
        return NextResponse.json(
          { success: false, error: 'No rawJobs array provided' },
          { status: 400 }
        );
      }

      const cardItems = rawList.map((item) => JobCardExtractor.transformToCardItem(item));
      const result = JobAggregatorStorage.saveAggregatedJobs(cardItems);

      return NextResponse.json({
        success: true,
        message: `Extracted & saved ${cardItems.length} verified school jobs`,
        added: result.added,
        totalInStore: result.total,
        sample: cardItems.slice(0, 3),
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action parameter' },
      { status: 400 }
    );
  } catch (err: any) {
    console.error('[API /api/jobs POST] Error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
