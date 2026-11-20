import { NextResponse } from 'next/server';

const UKAZ_SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_DIRECTORY_URL ||
  process.env.SUPABASE_DIRECTORY_URL ||
  'https://vvdnsmrtockscarkybtf.supabase.co';
const UKAZ_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_DIRECTORY_ANON_KEY ||
  process.env.SUPABASE_DIRECTORY_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  '';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const stateParam = searchParams.get('state');
    const districtParam = searchParams.get('district');

    const headers = {
      apikey: UKAZ_ANON_KEY,
      Authorization: `Bearer ${UKAZ_ANON_KEY}`,
    };

    // 1. If District is specified, fetch Block/Village-level compiled stats
    if (districtParam) {
      const url = `${UKAZ_SUPABASE_URL}/rest/v1/mv_school_block_analytics?district_name=ilike.*${encodeURIComponent(districtParam)}*&order=total_schools.desc`;
      const res = await fetch(url, { headers, cache: 'no-store' });
      if (res.ok) {
        const blocks = await res.json();
        return NextResponse.json({
          success: true,
          level: 'district',
          district: districtParam,
          state: stateParam || null,
          blocks,
        });
      }
    }

    // 2. If State is specified, fetch District-level compiled stats
    if (stateParam) {
      const url = `${UKAZ_SUPABASE_URL}/rest/v1/mv_school_district_analytics?state_name=ilike.*${encodeURIComponent(stateParam)}*&order=total_schools.desc`;
      const res = await fetch(url, { headers, cache: 'no-store' });
      if (res.ok) {
        const districts = await res.json();
        return NextResponse.json({
          success: true,
          level: 'state',
          state: stateParam,
          districts,
        });
      }
    }

    // 3. Otherwise return All-India State-wise compiled stats
    const url = `${UKAZ_SUPABASE_URL}/rest/v1/mv_school_state_analytics?order=total_schools.desc`;
    const res = await fetch(url, { headers, cache: 'no-store' });
    if (res.ok) {
      const states = await res.json();
      return NextResponse.json({
        success: true,
        level: 'national',
        states,
      });
    }

    return NextResponse.json({ success: false, error: 'Failed to retrieve compiled stats' }, { status: 500 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
