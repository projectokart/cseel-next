import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_COUPONS } from '@/features/marketing/data/marketingSeed';
import { CouponVoucher } from '@/features/marketing/types';

let couponsCache: CouponVoucher[] = [...INITIAL_COUPONS];

export async function GET() {
  return NextResponse.json({
    success: true,
    count: couponsCache.length,
    data: couponsCache,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newCoupon: CouponVoucher = {
      id: `coup-${Date.now()}`,
      code: (body.code || 'PROMO').toUpperCase().trim(),
      description: body.description || '',
      discount_type: body.discount_type || 'percentage',
      discount_value: Number(body.discount_value) || 10,
      min_order_value: body.min_order_value ? Number(body.min_order_value) : undefined,
      max_discount_amount: body.max_discount_amount ? Number(body.max_discount_amount) : undefined,
      usage_limit: body.usage_limit ? Number(body.usage_limit) : 500,
      used_count: 0,
      valid_until: body.valid_until || '2026-12-31',
      is_active: body.is_active !== undefined ? body.is_active : true,
      applicable_category: body.applicable_category || 'All Categories',
      created_at: new Date().toISOString(),
    };

    couponsCache.unshift(newCoupon);

    return NextResponse.json({
      success: true,
      message: 'Coupon created successfully',
      data: newCoupon,
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
      return NextResponse.json({ success: false, error: 'Coupon ID is required' }, { status: 400 });
    }

    const index = couponsCache.findIndex((c) => c.id === id);
    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Coupon not found' }, { status: 404 });
    }

    couponsCache[index] = {
      ...couponsCache[index],
      ...updates,
    };

    return NextResponse.json({
      success: true,
      message: 'Coupon updated successfully',
      data: couponsCache[index],
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
      return NextResponse.json({ success: false, error: 'Coupon ID is required' }, { status: 400 });
    }

    couponsCache = couponsCache.filter((c) => c.id !== id);

    return NextResponse.json({
      success: true,
      message: 'Coupon deleted successfully',
      id,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
