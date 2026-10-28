import { NextRequest, NextResponse } from 'next/server';
import { SupabaseJobService } from '@/lib/services/supabaseJobService';
import { getActiveFacultyJobs } from '@/data/facultyJobsData';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const MAX_AGE_DAYS = 45;
const TARGET_SIZE_BYTES = 1_000_000; // Strict 1MB

const BOARD_MAP: Record<string, string> = {
  'CBSE': 'C', 'ICSE': 'I', 'Cambridge / IB': 'IB', 'State Board': 'S', 'International': 'INT'
};

const SOURCE_MAP: Record<string, string> = {
  'LinkedIn': 'LI', 'Indeed': 'IN', 'Naukri.com': 'NK', 'Direct School Portal': 'DP',
  'Apna.co': 'AP', 'TeacherON': 'TO', 'TimesJobs': 'TJ', 'Shine.com': 'SH',
  'EducoHire': 'EH', 'Foundit': 'FO', 'KVS / NVS': 'KV', 'DAV CMC': 'DV', 'AWES India': 'AW',
};

const ROLE_MAP: Record<string, string> = {
  'Full-Time': 'F', 'Part-Time': 'P', 'Visiting Faculty': 'V',
  'Lab In-Charge': 'L', 'ATL Mentor': 'A', 'Contractual': 'C',
};

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      // Allow local development or authorized invocation
      const host = req.headers.get('host') || '';
      if (!host.includes('localhost') && !host.includes('127.0.0.1')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    // 1. Purge Supabase records older than 45 days
    let purgedCount = 0;
    try {
      purgedCount = await SupabaseJobService.purgeExpiredJobsFromSupabase(MAX_AGE_DAYS);
    } catch (e) {
      console.warn('[Cron:build-jobs-feed] Purge warning:', e);
    }

    // 2. Fetch fresh active jobs
    let allJobs = await SupabaseJobService.fetchJobsFromSupabase();
    if (!allJobs || allJobs.length === 0) {
      allJobs = getActiveFacultyJobs();
    }

    // Filter < 45 days in memory as safeguard
    const cutoffDate = new Date(Date.now() - MAX_AGE_DAYS * 24 * 60 * 60 * 1000);
    allJobs = allJobs.filter((j) => {
      if (!j.openingDate) return true;
      try {
        const d = new Date(j.openingDate);
        return d >= cutoffDate;
      } catch {
        return true;
      }
    });

    // Sort newest first
    allJobs.sort((a, b) => (b._dateMs || 0) - (a._dateMs || 0));

    // 3. Build Slim Search-Critical Payload (jobs-feed.json)
    const slimList = allJobs.map((j) => {
      const s: Record<string, any> = {};
      const jid = j.slug || j.id;
      if (jid) s.id = jid;
      if (j.organisationName) s.n = j.organisationName.slice(0, 40);
      if (j.jobPostName) s.t = j.jobPostName.slice(0, 50);
      if (j.designation) s.g = j.designation.slice(0, 18);
      if (j.subject) s.s = j.subject.slice(0, 18);
      if (j.board) s.b = BOARD_MAP[j.board] || j.board.slice(0, 8);
      if (j.roleType) s.r = ROLE_MAP[j.roleType] || j.roleType.slice(0, 2);

      const sal = j.salary;
      const skipSal = new Set(['Not Disclosed', 'Not Disclosed (On Merit / Negotiable)', '---', '', 'null', 'None']);
      if (sal && !skipSal.has(sal)) s['$'] = sal.slice(0, 25);

      if (typeof j.salaryMin === 'number' && j.salaryMin > 0) s['$n'] = j.salaryMin;
      if (typeof j.salaryMax === 'number' && j.salaryMax > 0) s['$x'] = j.salaryMax;

      if (j.city) s.c = j.city;
      if (j.state) s.st = j.state;
      if (j.district && j.district !== j.city) s.dt = j.district;

      if (j.coordinates && typeof j.coordinates.lat === 'number' && typeof j.coordinates.lng === 'number') {
        const lat = Math.round(j.coordinates.lat * 10000) / 10000;
        const lng = Math.round(j.coordinates.lng * 10000) / 10000;
        if (lat !== 0 && lng !== 0) s.co = [lat, lng];
      }

      if (j.minExperience) s.x = String(j.minExperience).slice(0, 10);
      if (j.openingDate) s.od = j.openingDate.slice(0, 10);
      if (j.source) s.src = SOURCE_MAP[j.source] || j.source.slice(0, 8);
      const url = j.applyUrl || j.originalUrl;
      if (url) s.u = url.slice(0, 100);
      if (j.verified) s.v = 1;
      if (j.forLady) s.f = 1;

      return s;
    });

    const feedJson = JSON.stringify(slimList);
    const feedBytes = Buffer.byteLength(feedJson, 'utf-8');
    const feedSizeKb = Math.round((feedBytes / 1024) * 10) / 10;

    // Check size limit
    const passedSizeCheck = feedBytes <= TARGET_SIZE_BYTES;

    // 4. Build links lookup map (jobs-links.json)
    const linksMap: Record<string, { u?: string; d?: string }> = {};
    for (const j of allJobs) {
      const id = j.slug || j.id;
      const u = j.applyUrl || j.originalUrl;
      const d = j.shortDescription ? j.shortDescription.slice(0, 120) : undefined;
      const entry: { u?: string; d?: string } = {};
      if (u) entry.u = u.slice(0, 200);
      if (d) entry.d = d;
      if (Object.keys(entry).length > 0) {
        linksMap[id] = entry;
      }
    }
    const linksJson = JSON.stringify(linksMap);
    const linksBytes = Buffer.byteLength(linksJson, 'utf-8');

    // 5. Build top 50 chunk
    const top50 = slimList.slice(0, 50);
    const top50Json = JSON.stringify(top50);
    const top50Bytes = Buffer.byteLength(top50Json, 'utf-8');

    // 6. Build manifest
    const today = new Date().toISOString().split('T')[0];
    const version = `v_${allJobs.length}_${today}`;
    const manifest = {
      version,
      count: allJobs.length,
      generatedAt: new Date().toISOString(),
      feedUrl: '/jobs/jobs-feed.json',
      top50Url: '/jobs/jobs-top50.json',
      linksUrl: '/jobs/jobs-links.json',
      feedSizeKb,
      passedSizeCheck,
    };

    // Save locally if filesystem writable (local dev / build step)
    try {
      const jobsDir = path.join(process.cwd(), 'public', 'jobs');
      if (!fs.existsSync(jobsDir)) fs.mkdirSync(jobsDir, { recursive: true });
      fs.writeFileSync(path.join(jobsDir, 'jobs-feed.json'), feedJson, 'utf-8');
      fs.writeFileSync(path.join(jobsDir, 'jobs-links.json'), linksJson, 'utf-8');
      fs.writeFileSync(path.join(jobsDir, 'jobs-top50.json'), top50Json, 'utf-8');
      fs.writeFileSync(path.join(jobsDir, 'latest.json'), JSON.stringify(manifest, null, 2), 'utf-8');
    } catch (fsErr) {
      console.warn('[Cron:build-jobs-feed] Filesystem write notice (Vercel serverless):', fsErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Jobs feed successfully processed & purged (45-day retention active)',
      purgedCount,
      totalActiveJobs: allJobs.length,
      feedSizeKb,
      passedSizeCheck,
      top50SizeKb: Math.round((top50Bytes / 1024) * 10) / 10,
      linksSizeKb: Math.round((linksBytes / 1024) * 10) / 10,
      version,
    });
  } catch (err: any) {
    console.error('[Cron:build-jobs-feed] Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
