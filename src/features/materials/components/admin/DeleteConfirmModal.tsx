'use client';

import React from 'react';
import { MaterialProduct } from '../../types/materialTypes';
import { Trash2, AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  product?: MaterialProduct | null;
  isDeleting?: boolean;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  product,
  isDeleting,
}: DeleteConfirmModalProps) {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in-50 duration-100">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-md p-6 space-y-4">
        
        <div className="flex items-start gap-3">
          <div className="p-3 bg-red-100 dark:bg-red-950/60 text-red-600 rounded-2xl shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-black text-base text-slate-900 dark:text-white">
              Delete Lab Equipment / Kit?
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Are you sure you want to remove <span className="font-bold text-slate-800 dark:text-slate-200">{product.name}</span> from the inventory? This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-100 dark:border-slate-800 text-xs flex items-center gap-3">
          <img src={product.image_url} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
          <div className="min-w-0 flex-1">
            <p className="font-bold text-slate-800 truncate">{product.name}</p>
            <p className="text-[11px] text-slate-500 font-mono">SKU: {product.sku} • ₹{product.price}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-xl shadow-xs transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isDeleting ? 'Deleting...' : 'Delete Item'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
