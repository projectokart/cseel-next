import { NextRequest, NextResponse } from 'next/server';
import { supabaseSchoolService } from '@/features/edu-network/db/supabaseSchoolService';
import { ALL_ORGANIZATIONS } from '@/lib/eduNetworkData';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('q') || '';
    const city = searchParams.get('city') || '';
    const board = searchParams.get('board') || '';
    const status = searchParams.get('status') || '';
    const sortBy = searchParams.get('sortBy') || 'newest';

    const schools = await supabaseSchoolService.getSchools({
      search,
      city: city || undefined,
      board: board || undefined,
      admissionStatus: status && status !== 'all' ? status : undefined,
      sortBy,
    });

    const states = Array.from(new Set(schools.map(s => s.state).filter(Boolean)));
    const boards = Array.from(new Set(schools.map(s => s.board).filter(Boolean)));

    return NextResponse.json({
      success: true,
      data: schools,
      total: schools.length,
      states,
      boards
    });
  } catch (error: any) {
    return NextResponse.json({ success: true, data: ALL_ORGANIZATIONS, total: ALL_ORGANIZATIONS.length });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.name || !body.city || !body.state) {
      return NextResponse.json({ success: false, error: 'Missing required fields: name, city, state' }, { status: 400 });
    }

    const created = await supabaseSchoolService.upsertSchool(body);
    return NextResponse.json({ success: true, data: created, message: 'School created successfully in Supabase' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
