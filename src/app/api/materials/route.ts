import { NextRequest, NextResponse } from 'next/server';
import { materialsRepository } from '@/features/materials/db/materialsRepository';
import { MaterialCategoryKey } from '@/features/materials/types/materialTypes';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('q') || '';
    const categoriesParam = searchParams.get('categories');
    const selectedCategories = categoriesParam ? (categoriesParam.split(',') as MaterialCategoryKey[]) : [];
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : 0;
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : 0;
    const stockStatus = (searchParams.get('stockStatus') as any) || 'all';
    const sortBy = (searchParams.get('sortBy') as any) || 'featured';

    const { items, total } = await materialsRepository.getAll({
      searchQuery,
      selectedCategories,
      minPrice,
      maxPrice,
      stockStatus,
      sortBy,
    });

    const categories = materialsRepository.getCategories();

    return NextResponse.json({
      success: true,
      data: items,
      total,
      categories,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch materials' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.name || !body.category || !body.price) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, category, price' },
        { status: 400 }
      );
    }

    const created = await materialsRepository.create(body);

    return NextResponse.json({
      success: true,
      data: created,
      message: 'Product created successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create material product' },
      { status: 500 }
    );
  }
}
