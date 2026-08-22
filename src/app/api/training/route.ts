import { NextRequest, NextResponse } from 'next/server';
import { trainingRepository } from '@/features/training/db/trainingRepository';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('q') || '';
    const catParam = searchParams.get('categories');
    const selectedCategories = catParam ? catParam.split(',') : [];
    const formatParam = searchParams.get('formats');
    const selectedFormats = formatParam ? (formatParam.split(',') as any) : [];
    const status = (searchParams.get('status') as any) || 'all';
    const sortBy = (searchParams.get('sortBy') as any) || 'startDate';

    const { items, total, categories } = await trainingRepository.getAll({
      searchQuery,
      selectedCategories,
      selectedFormats,
      status,
      sortBy,
    });

    return NextResponse.json({ success: true, data: items, total, categories });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.title || !body.category) {
      return NextResponse.json({ success: false, error: 'Missing required fields: title, category' }, { status: 400 });
    }
    const created = await trainingRepository.create(body);
    return NextResponse.json({ success: true, data: created, message: 'Training program registered successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
