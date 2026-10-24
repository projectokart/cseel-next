'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Trash2 } from 'lucide-react';
import { RequisitionItemData } from '../types';
import { QuantityStepper } from '@/components/ui/QuantityStepper';

export interface RequisitionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: RequisitionItemData[];
  totalQuantity: number;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onRemove: (id: string) => void;
  onRequestQuotation: () => void;
}

export const RequisitionDrawer: React.FC<RequisitionDrawerProps> = ({
  isOpen,
  onClose,
  items,
  totalQuantity,
  onIncrement,
  onDecrement,
  onRemove,
  onRequestQuotation,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999]">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        />

        {/* M3 Standard Right Drawer (360px max width) */}
        <motion.aside
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="absolute top-0 bottom-0 right-0 w-[88vw] max-w-[360px] bg-white rounded-l-[28px] shadow-[0_12px_36px_rgba(0,0,0,0.24)] z-10 flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-200/80 flex items-center justify-between shrink-0 bg-[#f8fafc]">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#005689]/10 text-[#005689] flex items-center justify-center shrink-0">
                <FileText className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-bold text-[#1f1f1f] truncate">
                  Lab Requisition List
                </h2>
                <p className="text-xs text-[#444746] truncate">
                  {totalQuantity} apparatuses selected
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close requisition list"
              className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-[#444746] hover:text-[#1f1f1f] transition-colors"
            >
              <X size={17} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-2">
            {items.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <FileText className="h-10 w-10 mx-auto mb-2 opacity-30 text-[#005689]" />
                <p className="font-semibold text-gray-600 text-xs">No apparatuses selected</p>
                <p className="text-[11px] mt-1 text-gray-400">
                  Click &quot;Select&quot; on any apparatus to add to your quotation request.
                </p>
              </div>
            ) : (
              items.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2.5 p-2.5 bg-[#f0f4f9] rounded-2xl border border-transparent hover:border-slate-200 transition-all"
                >
                  <span className="w-4 text-center text-[10px] font-bold text-gray-400 shrink-0">
                    {idx + 1}
                  </span>
                  <img
                    src={`/images/materials/physics/${item.id}.jpg`}
                    alt={item.name}
                    className="w-11 h-11 object-contain bg-white rounded-xl p-1 border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-gray-900 truncate">{item.name}</h4>
                    <span className="text-[10px] text-gray-400 block font-mono">
                      SKU: {item.sku || item.id}
                    </span>
                    <span className="text-[10px] text-[#005689] font-medium truncate block">
                      {item.category}
                    </span>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="shrink-0">
                    <QuantityStepper
                      value={item.quantity}
                      onIncrement={() => onIncrement(item.id)}
                      onDecrement={() => onDecrement(item.id)}
                      size="xs"
                      variant="white"
                    />
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => onRemove(item.id)}
                    className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-white transition-colors shrink-0"
                    title="Remove from list"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer CTA */}
          {items.length > 0 && (
            <div className="p-4 border-t border-slate-200/80 bg-white space-y-2.5 shrink-0">
              <p className="text-[11px] text-slate-500 text-center leading-relaxed">
                Official quotation with institutional pricing will be prepared &amp; emailed.
              </p>
              <button
                type="button"
                onClick={onRequestQuotation}
                className="w-full py-3 bg-[#005689] hover:bg-[#003c6e] text-white rounded-full text-xs font-semibold shadow-sm flex items-center justify-center gap-2 transition-all"
              >
                <FileText className="w-4 h-4" />
                <span>Get Quotation ({totalQuantity})</span>
              </button>
            </div>
          )}
        </motion.aside>
      </div>
    </AnimatePresence>
  );
};

export default RequisitionDrawer;
