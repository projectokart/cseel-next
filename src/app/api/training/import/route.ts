import { NextRequest, NextResponse } from 'next/server';
import { trainingRepository } from '@/features/training/db/trainingRepository';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const items = Array.isArray(body) ? body : body.items;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: 'No items provided for import' }, { status: 400 });
    }

    const imported = await trainingRepository.bulkInsert(items);

    return NextResponse.json({
      success: true,
      importedCount: imported.length,
      data: imported,
      message: `Successfully imported ${imported.length} training programs`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
