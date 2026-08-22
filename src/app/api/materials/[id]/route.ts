import { NextRequest, NextResponse } from 'next/server';
import { materialsRepository } from '@/features/materials/db/materialsRepository';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const item = await materialsRepository.getById(id);
    if (!item) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: item });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updates = await request.json();
    const updated = await materialsRepository.update(id, updates);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Product not found to update' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated, message: 'Updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await materialsRepository.delete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Product not found to delete' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
