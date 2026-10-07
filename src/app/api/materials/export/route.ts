import { NextRequest, NextResponse } from 'next/server';
import { materialsRepository } from '@/features/materials/db/materialsRepository';

export async function GET(request: NextRequest) {
  try {
    const { items } = await materialsRepository.getAll();

    // Generate CSV
    const headers = [
      'ID',
      'SKU',
      'Name',
      'Category',
      'Price (INR)',
      'Original Price',
      'Stock',
      'Image URL',
      'Rating',
      'Description',
    ];

    const rows = items.map((p) => [
      `"${p.id}"`,
      `"${p.sku}"`,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.category}"`,
      p.price,
      p.original_price,
      p.current_stock,
      `"${p.image_url}"`,
      p.rating,
      `"${p.description.replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="cseel_lab_materials_${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
