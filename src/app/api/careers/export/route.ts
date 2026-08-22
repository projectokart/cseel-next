import { NextRequest, NextResponse } from 'next/server';
import { careersRepository } from '@/features/careers/db/careersRepository';

export async function GET(request: NextRequest) {
  try {
    const { items } = await careersRepository.getAll();

    const headers = ['ID', 'Title', 'Department', 'Location', 'Type', 'Experience', 'Salary', 'Skills', 'Deadline', 'Applicants', 'Status'];
    const rows = items.map((j) => [
      `"${j.id}"`,
      `"${j.title.replace(/"/g, '""')}"`,
      `"${j.department}"`,
      `"${j.location}"`,
      `"${j.type}"`,
      `"${j.experience}"`,
      `"${j.salary}"`,
      `"${j.skills.join('; ')}"`,
      `"${j.deadline}"`,
      j.applicantsCount,
      `"${j.status}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="cseel_careers_vacancies_${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
