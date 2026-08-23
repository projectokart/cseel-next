import { NextResponse } from 'next/server';
import { INITIAL_HOMEPAGE_SECTIONS } from '@/features/homepage-cms/data/homepageSeed';
import { HomepageSectionConfig } from '@/features/homepage-cms/types';

// In-memory store initialized with seed
let inMemorySections: HomepageSectionConfig[] = [...INITIAL_HOMEPAGE_SECTIONS];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: inMemorySections,
    count: inMemorySections.length,
  });
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...changes } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Section ID is required' },
        { status: 400 }
      );
    }

    const index = inMemorySections.findIndex((s) => s.id === id);
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Section not found' },
        { status: 404 }
      );
    }

    inMemorySections[index] = {
      ...inMemorySections[index],
      ...changes,
      updated_at: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: `Section ${id} updated successfully`,
      data: inMemorySections[index],
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update section' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.action === 'reset') {
      inMemorySections = [...INITIAL_HOMEPAGE_SECTIONS];
      return NextResponse.json({
        success: true,
        message: 'All homepage sections reset to default initial state',
        data: inMemorySections,
      });
    }

    if (body.action === 'bulk_update' && Array.isArray(body.sections)) {
      inMemorySections = body.sections;
      return NextResponse.json({
        success: true,
        message: 'Bulk homepage sections updated',
        data: inMemorySections,
      });
    }

    return NextResponse.json({
      success: true,
      data: inMemorySections,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to process request' },
      { status: 500 }
    );
  }
}
