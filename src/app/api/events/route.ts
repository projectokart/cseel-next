import { NextRequest, NextResponse } from 'next/server';
import { eventsRepository } from '@/features/events/db/eventsRepository';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('q') || '';
    const typeParam = searchParams.get('types');
    const selectedTypes = typeParam ? (typeParam.split(',') as any) : [];
    const status = (searchParams.get('status') as any) || 'all';
    const sortBy = (searchParams.get('sortBy') as any) || 'date';

    const { items, total, types } = await eventsRepository.getAll({
      searchQuery,
      selectedTypes,
      status,
      sortBy,
    });

    return NextResponse.json({ success: true, data: items, total, types });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.title || !body.date) {
      return NextResponse.json({ success: false, error: 'Missing required fields: title, date' }, { status: 400 });
    }
    const created = await eventsRepository.create(body);
    return NextResponse.json({ success: true, data: created, message: 'Event created successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
