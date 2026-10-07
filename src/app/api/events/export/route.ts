import { NextRequest, NextResponse } from 'next/server';
import { eventsRepository } from '@/features/events/db/eventsRepository';

export async function GET(request: NextRequest) {
  try {
    const { items } = await eventsRepository.getAll();

    const headers = ['ID', 'Title', 'Type', 'Date', 'Time', 'Venue', 'City', 'Speakers', 'Registered', 'Capacity', 'Status'];
    const rows = items.map((e) => [
      `"${e.id}"`,
      `"${e.title.replace(/"/g, '""')}"`,
      `"${e.type}"`,
      `"${e.date}"`,
      `"${e.time}"`,
      `"${e.venue}"`,
      `"${e.city}"`,
      `"${e.keynoteSpeakers.join('; ')}"`,
      e.registeredCount,
      e.capacity,
      `"${e.status}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="cseel_events_${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
