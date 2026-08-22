import { NextRequest, NextResponse } from 'next/server';
import { networkRepository } from '@/features/edu-network/db/networkRepository';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('q') || '';
    const statesParam = searchParams.get('states');
    const selectedStates = statesParam ? statesParam.split(',') : [];
    const boardsParam = searchParams.get('boards');
    const selectedBoards = boardsParam ? boardsParam.split(',') : [];
    const status = (searchParams.get('status') as any) || 'all';
    const sortBy = (searchParams.get('sortBy') as any) || 'newest';

    const { items, total, states, boards } = await networkRepository.getAll({
      searchQuery,
      selectedStates,
      selectedBoards,
      status,
      sortBy,
    });

    return NextResponse.json({ success: true, data: items, total, states, boards });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.name || !body.city || !body.state) {
      return NextResponse.json({ success: false, error: 'Missing required fields: name, city, state' }, { status: 400 });
    }
    const created = await networkRepository.create(body);
    return NextResponse.json({ success: true, data: created, message: 'Partner school registered successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
