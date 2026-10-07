'use client';

import React from 'react';
import { MaterialOrder } from '../../types/materialTypes';
import {
  X, CheckCircle2, Clock, Truck, Package, ShieldCheck,
  MapPin, Calendar, Receipt
} from 'lucide-react';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: MaterialOrder | null;
}

export default function OrderTrackingModal({
  isOpen,
  onClose,
  order,
}: OrderTrackingModalProps) {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in-50 duration-150 select-none">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg overflow-hidden my-auto text-xs">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-teal-50/60 dark:bg-teal-950/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-teal-600 text-white">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base text-slate-900 dark:text-white">
                  Order Tracking & Delivery Status
                </h3>
              </div>
              <p className="text-[11px] font-mono text-teal-800 dark:text-teal-300 font-bold">
                Order #{order.orderNumber}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Status banner */}
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase text-emerald-800 dark:text-emerald-300">Status</p>
              <p className="text-sm font-black text-emerald-900 dark:text-white capitalize">{order.status}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black uppercase text-emerald-800 dark:text-emerald-300">Est. Arrival</p>
              <p className="text-xs font-bold text-emerald-900 dark:text-white font-mono">{order.estimatedDelivery}</p>
            </div>
          </div>

          {/* ── TIMELINE TRACKER ── */}
          <div className="space-y-4 pt-1">
            <p className="font-black text-slate-800 dark:text-slate-200 uppercase text-[10px] tracking-wider">
              Shipment Progress
            </p>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              {order.trackingHistory.map((step, idx) => (
                <div key={idx} className="relative flex items-start justify-between gap-3">
                  {/* Step icon dot */}
                  <div
                    className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                      step.completed
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                    }`}
                  >
                    {step.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                  </div>

                  <div>
                    <h5 className={`font-bold ${step.completed ? 'text-slate-900 dark:text-white font-black' : 'text-slate-400'}`}>
                      {step.label}
                    </h5>
                    {step.location && (
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{step.location}</span>
                      </p>
                    )}
                  </div>

                  <span className="text-[10px] text-slate-400 font-mono shrink-0">{step.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ordered Items Summary */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <p className="font-black text-slate-800 dark:text-slate-200 uppercase text-[10px] tracking-wider">
              Package Contents ({order.items.length})
            </p>
            <div className="space-y-1.5">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs py-1">
                  <span className="truncate max-w-[260px] text-slate-700 dark:text-slate-300">
                    {item.quantity}x {item.product.name}
                  </span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px]">
            <Receipt className="w-3.5 h-3.5 text-teal-600" />
            <span>Total Paid: ₹{order.totalAmount.toLocaleString('en-IN')}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-xs"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
