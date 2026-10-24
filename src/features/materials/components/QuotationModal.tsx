'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, School } from 'lucide-react';
import { QuotationFormData, RequisitionItemData } from '../types';
import { submitQuotationRequest } from '../services/quotationService';
import { useToast } from '@/hooks/use-toast';

export interface QuotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  items?: RequisitionItemData[];
  singleItem?: {
    name: string;
    sku: string;
    chapter?: string;
    quantity?: string | number;
  };
  onSuccess?: () => void;
}

export const QuotationModal: React.FC<QuotationModalProps> = ({
  isOpen,
  onClose,
  items,
  singleItem,
  onSuccess,
}) => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<QuotationFormData>({
    schoolName: '',
    name: '',
    email: '',
    phone: '',
    city: '',
    quantityRequired: singleItem?.quantity ? `${singleItem.quantity}` : '1 Set',
    notes: '',
  });

  if (!isOpen) return null;

  const totalItemCount = items ? items.reduce((sum, i) => sum + (i.quantity || 1), 0) : 1;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.schoolName || !form.name || !form.email || !form.phone) {
      toast({
        title: 'Incomplete details',
        description: 'Please fill school name, contact person, email, and phone',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    const result = await submitQuotationRequest({
      form,
      items,
      singleItem,
    });
    setSubmitting(false);

    if (result.success) {
      toast({
        title: 'Quotation Request Submitted! 📋',
        description:
          'Our experiential learning team will generate your official quotation and email it to you.',
      });
      onClose();
      if (onSuccess) onSuccess();
    } else {
      toast({
        title: 'Submission Failed',
        description: result.error || 'Could not submit request. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="mb-4">
            <span className="px-2.5 py-0.5 bg-blue-50 text-[#005689] rounded-full text-xs font-bold uppercase">
              Institutional Lab Requisition
            </span>
            <h3 className="text-xl font-black text-[#003c6e] mt-2">
              Request School Lab Quotation
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {singleItem ? (
                <>
                  Apparatus:{' '}
                  <span className="font-bold text-gray-800">{singleItem.name}</span> (SKU:{' '}
                  {singleItem.sku})
                </>
              ) : (
                <>
                  Request formal quotation for{' '}
                  <span className="font-bold text-gray-800">
                    {items?.length || 0} selected apparatuses ({totalItemCount} total units)
                  </span>
                  .
                </>
              )}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                School / Institution Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Modern Public School / Delhi Public School"
                value={form.schoolName}
                onChange={(e) => setForm({ ...form, schoolName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#005689]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Contact Person Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Principal / Lab Incharge"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#005689]"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">City / State *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Palwal, Haryana"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#005689]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Official Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="principal@school.edu.in"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#005689]"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Phone / WhatsApp Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#005689]"
                />
              </div>
            </div>

            {singleItem && (
              <div>
                <label className="block font-bold text-gray-700 mb-1">Quantity Required</label>
                <input
                  type="text"
                  placeholder="e.g. 5 Sets / 10 Sets"
                  value={form.quantityRequired}
                  onChange={(e) => setForm({ ...form, quantityRequired: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#005689]"
                />
              </div>
            )}

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Additional Requirements / Notes
              </label>
              <textarea
                rows={2}
                placeholder="Specify quantities per apparatus, teacher demo, or composite lab needs..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#005689]"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-[#005689] hover:bg-[#003c6e] text-white font-semibold rounded-xl text-xs shadow-md disabled:opacity-50 flex items-center justify-center gap-2 mt-2 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Submitting Request...' : `Get Quotation (${totalItemCount} items)`}</span>
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default QuotationModal;
