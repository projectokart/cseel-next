'use client';

import React, { useState } from 'react';
import { CartItem, MaterialOrder, OrderShippingAddress } from '../../types/materialTypes';
import { materialsApi } from '../../api/materialsApiClient';
import {
  ShoppingBag, X, Plus, Minus, Trash2, ArrowRight,
  ShieldCheck, Truck, Check, CreditCard, QrCode, Sparkles
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onOrderSuccess?: (order: MaterialOrder) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderSuccess,
}: CartDrawerProps) {
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'shipping' | 'payment'>('cart');
  const [isProcessing, setIsProcessing] = useState(false);

  // Shipping Form State
  const [shippingAddress, setShippingAddress] = useState<OrderShippingAddress>({
    fullName: '',
    schoolOrOrgName: '',
    addressLine1: '',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110001',
    phoneNumber: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'Institutional PO' | 'COD'>('UPI');

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.18);
  const shippingFee = subtotal > 999 || items.length === 0 ? 0 : 79;
  const totalAmount = subtotal + tax + shippingFee;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingAddress.fullName || !shippingAddress.addressLine1 || !shippingAddress.phoneNumber) {
      alert('Please fill all required shipping fields');
      return;
    }

    setIsProcessing(true);
    try {
      const order = await materialsApi.createOrder({
        items,
        shippingAddress,
        paymentMethod,
        subtotal,
        tax,
        totalAmount,
      });

      onClearCart();
      onClose();
      setCheckoutStep('cart');
      onOrderSuccess?.(order);
    } catch (err: any) {
      alert('Order failed: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[600] flex justify-end bg-slate-950/60 backdrop-blur-xs animate-in fade-in-50 duration-150 select-none">
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* ── HEADER ── */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-700">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm text-slate-900 dark:text-white">
                {checkoutStep === 'cart' ? 'Lab Cart & Equipment Bag' : checkoutStep === 'shipping' ? 'Institutional Shipping' : 'Payment Method'}
              </h3>
              <p className="text-[10px] text-slate-400 font-bold">{items.length} items selected</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── BODY ── */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          
          {checkoutStep === 'cart' ? (
            items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <ShoppingBag className="w-12 h-12 text-slate-300" />
                <h4 className="font-black text-slate-700">Your Lab Cart is Empty</h4>
                <p className="text-slate-400 text-xs">Explore glassware, sensors, and robotics kits to place an order.</p>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-teal-600 text-white font-bold rounded-xl text-xs"
                >
                  Browse Lab Catalog
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex gap-3 items-center"
                  >
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-14 h-14 rounded-xl object-cover shrink-0"
                    />

                    <div className="min-w-0 flex-1 space-y-1">
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 truncate">{item.product.name}</h4>
                      <p className="text-[11px] font-black text-teal-700 dark:text-teal-400">
                        ₹{item.product.price.toLocaleString('en-IN')}
                      </p>

                      {/* Quantity counter */}
                      <div className="flex items-center gap-2 pt-1">
                        <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                            className="p-1 hover:bg-slate-100 text-slate-500"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 font-mono font-bold text-xs">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 hover:bg-slate-100 text-slate-500"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.product.id)}
                          className="p-1 text-slate-400 hover:text-red-600 transition-colors ml-auto"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : checkoutStep === 'shipping' ? (
            <form id="shipping-form" className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Name / Contact Person *</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.fullName}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                  placeholder="e.g. Dr. Rajesh Kumar"
                  className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">School / Institution Name</label>
                <input
                  type="text"
                  value={shippingAddress.schoolOrOrgName}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, schoolOrOrgName: e.target.value })}
                  placeholder="e.g. Delhi Public School STEM Lab"
                  className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Delivery Address *</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.addressLine1}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine1: e.target.value })}
                  placeholder="Lab Room 204, Science Block, Sector 4"
                  className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">PIN Code *</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.pincode}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, pincode: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-800 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={shippingAddress.phoneNumber}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, phoneNumber: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-800"
                />
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              <p className="font-bold text-slate-700">Select Payment Method</p>
              {[
                { id: 'UPI', label: 'Instant UPI / QR Code (Zero Surcharge)', icon: QrCode },
                { id: 'Card', label: 'Credit / Debit Card / NetBanking', icon: CreditCard },
                { id: 'Institutional PO', label: 'Institutional Purchase Order (PO / Invoice 30-Day)', icon: ShieldCheck },
                { id: 'COD', label: 'Cash / Pay on Delivery', icon: Truck },
              ].map((m) => (
                <label
                  key={m.id}
                  className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === m.id
                      ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/40 text-teal-900 font-bold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === m.id}
                    onChange={() => setPaymentMethod(m.id as any)}
                    className="text-teal-600 accent-teal-600"
                  />
                  <m.icon className="w-4 h-4 text-teal-600" />
                  <span className="text-xs">{m.label}</span>
                </label>
              ))}
            </div>
          )}

        </div>

        {/* ── FOOTER ORDER SUMMARY & ACTIONS ── */}
        {items.length > 0 && (
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 space-y-3 text-xs">
            
            {/* Price Breakdown */}
            <div className="space-y-1 text-slate-500">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (18%)</span>
                <span className="font-mono">₹{tax.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Standard Delivery</span>
                <span>{shippingFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `₹${shippingFee}`}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200 text-sm font-black text-slate-900 dark:text-white">
                <span>Total Amount</span>
                <span className="text-teal-700 font-mono">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Navigation buttons */}
            {checkoutStep === 'cart' ? (
              <button
                type="button"
                onClick={() => setCheckoutStep('shipping')}
                className="w-full py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-black text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Proceed to Shipping</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : checkoutStep === 'shipping' ? (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCheckoutStep('cart')}
                  className="px-3 py-2 bg-slate-200 font-bold rounded-xl"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setCheckoutStep('payment')}
                  className="flex-1 py-2 bg-teal-600 text-white font-bold rounded-xl flex items-center justify-center gap-1.5"
                >
                  <span>Select Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCheckoutStep('shipping')}
                  className="px-3 py-2 bg-slate-200 font-bold rounded-xl"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{isProcessing ? 'Confirming Order...' : `Place Order (₹${totalAmount.toLocaleString('en-IN')})`}</span>
                </button>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
