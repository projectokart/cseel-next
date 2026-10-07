import { NextRequest, NextResponse } from 'next/server';
import { trainingRepository } from '@/features/training/db/trainingRepository';

export async function GET(request: NextRequest) {
  try {
    const { items } = await trainingRepository.getAll();

    const headers = ['ID', 'Title', 'Category', 'Format', 'Level', 'Duration (Hours)', 'Batch Size', 'Enrolled', 'Lead Trainer', 'Certification', 'Start Date', 'Fee (INR)', 'Status'];
    const rows = items.map((p) => [
      `"${p.id}"`,
      `"${p.title.replace(/"/g, '""')}"`,
      `"${p.category}"`,
      `"${p.format}"`,
      `"${p.level}"`,
      p.durationHours,
      p.batchSize,
      p.enrolledCount,
      `"${p.leadTrainer}"`,
      `"${p.certificationOffered}"`,
      `"${p.startDate}"`,
      p.feeInr,
      `"${p.status}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="cseel_training_programs_${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
