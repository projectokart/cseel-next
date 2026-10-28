import { NextResponse } from 'next/server';
import facetsJson from '@/data/job_filter_facets.json';

export const dynamic = 'force-dynamic';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ukazkxthavxphibdbspd.supabase.co';
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrYXpreHRoYXZ4cGhpYmRic3BkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MTk4MzgsImV4cCI6MjA4OTM5NTgzOH0.Oi47bXRcJ5dAAblFqYUnFvbUx61DS8ABBikC6cIjGlo';

let _cachedVersionInfo: { version: string; count: number; lastChecked: number } | null = null;
const CACHE_TTL_MS = 60 * 1000; // 1 minute in-memory cache

export async function GET() {
  try {
    const now = Date.now();
    if (_cachedVersionInfo && now - _cachedVersionInfo.lastChecked < CACHE_TTL_MS) {
      return NextResponse.json(
        {
          success: true,
          version: _cachedVersionInfo.version,
          count: _cachedVersionInfo.count,
        },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
          },
        }
      );
    }

    const url = `${SUPABASE_URL}/rest/v1/jobs?select=id,posted_at&is_active=eq.true&order=posted_at.desc&limit=1`;
    const res = await fetch(url, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Prefer: 'count=exact',
      },
      signal: AbortSignal.timeout(2000),
    });

    if (res.ok) {
      const contentRange = res.headers.get('content-range') || '';
      const totalCount = parseInt(contentRange.split('/')[1] || '0', 10) || facetsJson.totalVacancies || 2419;
      const data = await res.json();
      const latestJob = data?.[0] || {};
      const latestTimestamp = latestJob.posted_at || facetsJson.lastUpdated || '2026-10-28';
      const latestIdShort = (latestJob.id || 'init').slice(0, 8);

      const version = `v_${totalCount}_${latestTimestamp}_${latestIdShort}`;

      _cachedVersionInfo = {
        version,
        count: totalCount,
        lastChecked: now,
      };

      return NextResponse.json(
        {
          success: true,
          version,
          count: totalCount,
        },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
          },
        }
      );
    }

    // Fallback if Supabase request failed
    const fallbackVersion = `v_${facetsJson.totalVacancies}_${facetsJson.lastUpdated}`;
    return NextResponse.json(
      {
        success: true,
        version: fallbackVersion,
        count: facetsJson.totalVacancies,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (err: any) {
    const fallbackVersion = `v_${facetsJson.totalVacancies}_${facetsJson.lastUpdated}`;
    return NextResponse.json(
      {
        success: true,
        version: fallbackVersion,
        count: facetsJson.totalVacancies,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  }
}
