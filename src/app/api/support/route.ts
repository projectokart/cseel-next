import { NextRequest, NextResponse } from 'next/server';
import { supportRepository } from '@/features/support/db/supportRepository';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('q') || '';
    const status = (searchParams.get('status') as any) || 'all';

    const { items, total } = await supportRepository.getAll({
      searchQuery,
      status,
    });

    return NextResponse.json({ success: true, data: items, total });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.subject || !body.requesterEmail) {
      return NextResponse.json({ success: false, error: 'Missing required fields: subject, requesterEmail' }, { status: 400 });
    }
    const created = await supportRepository.create(body);
    return NextResponse.json({ success: true, data: created, message: 'Ticket opened successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
