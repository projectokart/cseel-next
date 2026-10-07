import { NextRequest, NextResponse } from 'next/server';
import { supportRepository } from '@/features/support/db/supportRepository';

export async function GET(request: NextRequest) {
  try {
    const { items } = await supportRepository.getAll();

    const headers = ['ID', 'Ticket Number', 'Subject', 'Category', 'Priority', 'Status', 'Requester Name', 'Email', 'School / Org', 'Created At'];
    const rows = items.map((t) => [
      `"${t.id}"`,
      `"${t.ticketNumber}"`,
      `"${t.subject.replace(/"/g, '""')}"`,
      `"${t.category}"`,
      `"${t.priority}"`,
      `"${t.status}"`,
      `"${t.requesterName}"`,
      `"${t.requesterEmail}"`,
      `"${t.schoolOrOrgName || ''}"`,
      `"${t.createdAt}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="cseel_support_tickets_${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
