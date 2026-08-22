import { NextRequest, NextResponse } from 'next/server';
import { careersRepository } from '@/features/careers/db/careersRepository';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('q') || '';
    const deptParam = searchParams.get('departments');
    const selectedDepartments = deptParam ? deptParam.split(',') : [];
    const typeParam = searchParams.get('types');
    const selectedTypes = typeParam ? (typeParam.split(',') as any) : [];
    const status = (searchParams.get('status') as any) || 'all';
    const sortBy = (searchParams.get('sortBy') as any) || 'newest';

    const { items, total, departments } = await careersRepository.getAll({
      searchQuery,
      selectedDepartments,
      selectedTypes,
      status,
      sortBy,
    });

    return NextResponse.json({
      success: true,
      data: items,
      total,
      departments,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.title || !body.department) {
      return NextResponse.json({ success: false, error: 'Missing required fields: title, department' }, { status: 400 });
    }

    const created = await careersRepository.create(body);

    return NextResponse.json({
      success: true,
      data: created,
      message: 'Job opening posted successfully',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
