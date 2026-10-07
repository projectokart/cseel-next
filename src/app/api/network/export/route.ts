import { NextRequest, NextResponse } from 'next/server';
import { networkRepository } from '@/features/edu-network/db/networkRepository';

export async function GET(request: NextRequest) {
  try {
    const { items } = await networkRepository.getAll();

    const headers = ['ID', 'Code', 'School Name', 'Type', 'Board', 'City', 'State', 'Students', 'Faculty', 'Principal', 'Email', 'Status', 'Accreditation'];
    const rows = items.map((s) => [
      `"${s.id}"`,
      `"${s.code}"`,
      `"${s.name.replace(/"/g, '""')}"`,
      `"${s.type}"`,
      `"${s.board}"`,
      `"${s.city}"`,
      `"${s.state}"`,
      s.studentCount,
      s.facultyCount,
      `"${s.principalName}"`,
      `"${s.email}"`,
      `"${s.status}"`,
      `"${s.accreditationLevel}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="cseel_partner_schools_${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
