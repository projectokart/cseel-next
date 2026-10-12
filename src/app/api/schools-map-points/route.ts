import { NextResponse } from 'next/server';
import { schoolSearchSupabase } from '@/integrations/supabase/schoolSearchClient';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // 60 seconds cache

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state');
    const district = searchParams.get('district');

    let query = schoolSearchSupabase
      .from('udise_private_schools')
      .select('school_id, school_name, udise_code, latitude, longitude, district_name, state_name, board_10th, management_desc, total_students')
      .not('latitude', 'is', null)
      .not('longitude', 'is', null)
      .order('total_students', { ascending: false, nullsFirst: false })
      .limit(500);

    if (state) {
      query = query.ilike('state_name', `%${state}%`);
    }
    if (district) {
      query = query.ilike('district_name', `%${district}%`);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Map points API error:', error);
      return NextResponse.json({ success: false, points: [], error: error.message }, { status: 500 });
    }

    const points = (data || []).map((s: any) => ({
      id: s.udise_code || s.school_id || s.id,
      school_id: s.school_id,
      udise_code: s.udise_code,
      school_name: s.school_name,
      name: s.school_name,
      lat: Number(s.latitude),
      lng: Number(s.longitude),
      district_name: s.district_name,
      state_name: s.state_name,
      board: s.board_10th || 'CBSE',
      management: s.management_desc || 'Private Unaided',
      total_students: Number(s.total_students) || 0
    }));

    return NextResponse.json({ success: true, count: points.length, points });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
