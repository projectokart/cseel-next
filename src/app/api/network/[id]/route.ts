import { NextRequest, NextResponse } from 'next/server';
import { supabaseSchoolService } from '@/features/edu-network/db/supabaseSchoolService';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const school = await supabaseSchoolService.getSchoolByIdOrSlug(params.id);
    if (!school) {
      return NextResponse.json({ success: false, error: 'School not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: school });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const updated = await supabaseSchoolService.upsertSchool({ ...body, id: params.id });
    return NextResponse.json({ success: true, data: updated, message: 'School updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await supabaseSchoolService.deleteSchool(params.id);
    return NextResponse.json({ success: true, message: 'School deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
