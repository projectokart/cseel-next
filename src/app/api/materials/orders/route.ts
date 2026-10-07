import { NextRequest, NextResponse } from 'next/server';
import { MaterialOrder, TrackingStep } from '@/features/materials/types/materialTypes';

// In-memory orders store (pluggable with separate DB)
const ORDERS_DB: MaterialOrder[] = [];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('id');

    if (orderId) {
      const order = ORDERS_DB.find((o) => o.id === orderId || o.orderNumber === orderId);
      if (!order) {
        return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: order });
    }

    return NextResponse.json({ success: true, data: ORDERS_DB });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, shippingAddress, paymentMethod, subtotal, tax, totalAmount, customerName, customerEmail } = body;

    if (!items || items.length === 0 || !shippingAddress) {
      return NextResponse.json({ success: false, error: 'Invalid order payload' }, { status: 400 });
    }

    const orderId = `ord-${Date.now()}`;
    const orderNumber = `CSE-${Math.floor(100000 + Math.random() * 900000)}`;

    const trackingHistory: TrackingStep[] = [
      { status: 'placed', label: 'Order Placed & Confirmed', date: 'Just now', completed: true, location: 'CSEEL Fulfillment Hub' },
      { status: 'dispatched', label: 'Packed & Dispatched', date: 'Estimated Tomorrow', completed: false, location: 'Central Logistics Center' },
      { status: 'in_transit', label: 'In Transit', date: 'In 2 Days', completed: false, location: 'Regional Courier Hub' },
      { status: 'out_for_delivery', label: 'Out for Delivery', date: 'In 3 Days', completed: false, location: `${shippingAddress.city} Courier Center` },
      { status: 'delivered', label: 'Delivered', date: 'In 3-4 Days', completed: false, location: shippingAddress.addressLine1 },
    ];

    const newOrder: MaterialOrder = {
      id: orderId,
      orderNumber,
      userId: body.userId || 'guest-user',
      customerName: customerName || shippingAddress.fullName,
      customerEmail: customerEmail || 'customer@cseel.org',
      items,
      subtotal: subtotal || 0,
      tax: tax || 0,
      shippingFee: totalAmount > 999 ? 0 : 79,
      discount: body.discount || 0,
      totalAmount: totalAmount || subtotal,
      shippingAddress,
      status: 'placed',
      createdAt: new Date().toISOString(),
      estimatedDelivery: '3-4 Business Days',
      trackingHistory,
      paymentMethod: paymentMethod || 'UPI',
      paymentStatus: paymentMethod === 'COD' ? 'pending' : 'paid',
    };

    ORDERS_DB.unshift(newOrder);

    return NextResponse.json({
      success: true,
      data: newOrder,
      message: 'Order created successfully',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
