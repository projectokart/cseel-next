import { NextRequest, NextResponse } from 'next/server';
import {
  INITIAL_PROMOTIONS,
  INITIAL_SLOT_SETTINGS,
} from '@/features/marketing/data/marketingSeed';
import { AD_SLOTS_REGISTRY } from '@/features/marketing/types';

// In-memory server store seeded with INITIAL_PROMOTIONS & INITIAL_SLOT_SETTINGS
let serverPromotions = [...INITIAL_PROMOTIONS];
let serverSlotSettings = { ...INITIAL_SLOT_SETTINGS };

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slotId = searchParams.get('slotId');

  if (slotId) {
    const items = serverPromotions
      .filter(
        (p) =>
          p.is_active &&
          p.status === 'published' &&
          (p.slot_id || 'slot_after_hero') === slotId
      )
      .sort((a, b) => (a.sort_order ?? 99) - (b.sort_order ?? 99));

    const settings = serverSlotSettings[slotId] || {
      slot_id: slotId,
      slides_per_view: 2,
      autoplay: true,
      autoplay_delay: 4500,
      show_arrows: true,
      show_dots: true,
      show_section_header: true,
      section_title: 'Special Offers & Featured Programs',
      section_badge: 'Featured Highlights & Offers',
    };

    return NextResponse.json({
      ok: true,
      slot_id: slotId,
      dom_target_id: `cseel-ad-slot-${slotId}`,
      count: items.length,
      settings,
      items,
    });
  }

  return NextResponse.json({
    ok: true,
    slots: AD_SLOTS_REGISTRY,
    settings: serverSlotSettings,
    promotions: serverPromotions,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (Array.isArray(body.promotions)) {
      serverPromotions = body.promotions;
    }
    if (body.slotSettings && typeof body.slotSettings === 'object') {
      serverSlotSettings = { ...serverSlotSettings, ...body.slotSettings };
    }
    return NextResponse.json({
      ok: true,
      updated_at: new Date().toISOString(),
      total_promotions: serverPromotions.length,
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || 'Invalid JSON payload' },
      { status: 400 }
    );
  }
}
