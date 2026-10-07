import { NextRequest, NextResponse } from 'next/server';
import { loadAllExperiments, saveAllExperiments } from '../route';
import { ExperimentItem } from '@/types/experiment';

function findExperiment(idOrSlug: string, items: ExperimentItem[]): ExperimentItem | null {
  const query = decodeURIComponent(idOrSlug).toLowerCase().trim();

  // 1. Exact ID or slug match
  const exact = items.find((item) => {
    const itemSlug = (
      item.slug ||
      item.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/[\s_-]+/g, '-')
    ).toLowerCase();
    return item.id.toLowerCase() === query || itemSlug === query;
  });
  if (exact) return exact;

  // 2. StartsWith match
  const starts = items.find((item) => {
    const itemSlug = (
      item.slug ||
      item.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/[\s_-]+/g, '-')
    ).toLowerCase();
    return query.startsWith(itemSlug) || itemSlug.startsWith(query);
  });
  if (starts) return starts;

  // 3. Keyword matching for common experiments
  if (query.includes('thermite')) {
    const thermite = items.find(
      (item) => item.slug?.includes('thermite') || item.tags?.some((t) => t.toLowerCase().includes('thermite'))
    );
    if (thermite) return thermite;
  }
  if (query.includes('elephant')) {
    const elephant = items.find((item) => item.slug?.includes('elephant') || item.title?.toLowerCase().includes('elephant'));
    if (elephant) return elephant;
  }
  if (query.includes('pendulum')) {
    const pendulum = items.find((item) => item.slug?.includes('pendulum') || item.title?.toLowerCase().includes('pendulum'));
    if (pendulum) return pendulum;
  }
  if (query.includes('oxygen')) {
    const oxygen = items.find((item) => item.slug?.includes('oxygen') || item.title?.toLowerCase().includes('oxygen'));
    if (oxygen) return oxygen;
  }

  return null;
}

/**
 * GET /api/experiments/[id]
 * Fetches experiment by ID, slug, or keyword
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const items = loadAllExperiments();
    const found = findExperiment(id, items);

    if (!found) {
      return NextResponse.json(
        {
          success: false,
          error: `Experiment with id/slug '${id}' not found`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: found,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch experiment' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/experiments/[id]
 * Updates experiment details
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const items = loadAllExperiments();
    const existingIndex = items.findIndex(
      (item) => item.id.toLowerCase() === id.toLowerCase() || item.slug?.toLowerCase() === id.toLowerCase()
    );

    if (existingIndex < 0) {
      return NextResponse.json(
        { success: false, error: `Experiment '${id}' not found to update` },
        { status: 404 }
      );
    }

    const updatedItem: ExperimentItem = {
      ...items[existingIndex],
      ...body,
      id: items[existingIndex].id, // preserve id
      updatedAt: new Date().toISOString(),
    };

    items[existingIndex] = updatedItem;
    saveAllExperiments(items);

    return NextResponse.json({
      success: true,
      data: updatedItem,
      message: 'Experiment updated successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update experiment' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/experiments/[id]
 * Deletes experiment
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const items = loadAllExperiments();
    const filtered = items.filter(
      (item) => item.id.toLowerCase() !== id.toLowerCase() && item.slug?.toLowerCase() !== id.toLowerCase()
    );

    if (filtered.length === items.length) {
      return NextResponse.json(
        { success: false, error: `Experiment '${id}' not found` },
        { status: 404 }
      );
    }

    saveAllExperiments(filtered);

    return NextResponse.json({
      success: true,
      message: `Experiment '${id}' deleted successfully`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete experiment' },
      { status: 500 }
    );
  }
}
