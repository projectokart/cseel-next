import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_PROMOTIONS } from '@/features/marketing/data/marketingSeed';
import { MarketingPromotion } from '@/features/marketing/types';

// In-memory runtime cache for marketing promotions
let promotionsCache: MarketingPromotion[] = [...INITIAL_PROMOTIONS];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');
  const activeOnly = searchParams.get('active') === 'true';

  let results = [...promotionsCache];
  if (type) {
    results = results.filter((p) => p.type === type);
  }
  if (activeOnly) {
    results = results.filter((p) => p.is_active && p.status === 'published');
  }

  return NextResponse.json({
    success: true,
    count: results.length,
    data: results,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newPromo: MarketingPromotion = {
      id: `promo-${Date.now()}`,
      type: body.type || 'announcement',
      title: body.title || 'Untitled Promotion',
      subtitle: body.subtitle || '',
      content: body.content || '',
      cta_text: body.cta_text || 'Learn More',
      cta_link: body.cta_link || '/',
      badge_text: body.badge_text || 'PROMO',
      bg_gradient: body.bg_gradient || 'from-indigo-900 via-purple-900 to-slate-900',
      accent_color: body.accent_color || '#38bdf8',
      image_url: body.image_url || '',
      discount_percentage: body.discount_percentage ? Number(body.discount_percentage) : undefined,
      coupon_code: body.coupon_code || '',
      is_active: body.is_active !== undefined ? body.is_active : true,
      status: body.status || 'published',
      views_count: 0,
      clicks_count: 0,
      sort_order: body.sort_order || promotionsCache.length + 1,
      target_pages: body.target_pages || ['/'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    promotionsCache.unshift(newPromo);

    return NextResponse.json({
      success: true,
      message: 'Marketing promotion created successfully',
      data: newPromo,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Promotion ID is required' }, { status: 400 });
    }

    const index = promotionsCache.findIndex((p) => p.id === id);
    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Promotion not found' }, { status: 404 });
    }

    promotionsCache[index] = {
      ...promotionsCache[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: 'Marketing promotion updated successfully',
      data: promotionsCache[index],
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Promotion ID is required' }, { status: 400 });
    }

    promotionsCache = promotionsCache.filter((p) => p.id !== id);

    return NextResponse.json({
      success: true,
      message: 'Marketing promotion deleted successfully',
      id,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
