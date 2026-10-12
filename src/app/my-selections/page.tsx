'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import {
  BookmarkCheck,
  Plus,
  Minus,
  Trash2,
  Download,
  Share2,
  ArrowLeft,
  FileSpreadsheet,
  Printer,
  ExternalLink,
  FlaskConical,
} from 'lucide-react';
import {
  M3Button,
  M3IconButton,
  M3Card,
  M3AssistChip,
} from '@/components/google-ui';

export default function MySelectionsPage() {
  const {
    selectedExperiments,
    selectedIds,
    totalSelectedQuantity,
    updateSelectionQty,
    removeSelection,
    clearSelected,
  } = useCart();

  // Export as CSV with quantities, IDs, subjects
  const handleExportCSV = () => {
    if (selectedExperiments.length === 0) return;

    const headers = ['S.No', 'Experiment Title', 'Subject', 'Class', 'Quantity', 'Link'];
    const rows = selectedExperiments.map((exp, idx) => [
      idx + 1,
      `"${(exp.title || '').replace(/"/g, '""')}"`,
      `"${exp.subject || 'Science'}"`,
      `"${exp.class || 'N/A'}"`,
      exp.quantity || 1,
      `https://www.cseel.org/experiments/${exp.id}`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CSEEL_Selected_Experiments_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#f8fafd] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Top Breadcrumb & Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/subject/physics"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0b57d0] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Experiments</span>
          </Link>

          {selectedExperiments.length > 0 && (
            <div className="flex items-center gap-2">
              <M3Button
                variant="outlined"
                size="sm"
                leadingIcon={<Printer className="w-4 h-4" />}
                onClick={handlePrint}
              >
                Print List
              </M3Button>
              <M3Button
                variant="filled"
                size="sm"
                leadingIcon={<Download className="w-4 h-4" />}
                onClick={handleExportCSV}
              >
                Export CSV
              </M3Button>
            </div>
          )}
        </div>

        {/* Page Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#dde3ea] shadow-xs mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#c2e7ff] text-[#001d35] flex items-center justify-center shrink-0">
              <BookmarkCheck className="w-7 h-7 text-[#0b57d0]" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1f1f1f] tracking-tight m-0">
                My Selected Experiments
              </h1>
              <p className="text-sm text-[#444746] mt-1 m-0">
                Manage your chosen practicals, set customized lab quantities, and export for curriculum planning.
              </p>
            </div>
          </div>

          {selectedExperiments.length > 0 && (
            <div className="flex items-center gap-3 shrink-0 bg-[#eef3fc] px-4 py-2 rounded-2xl border border-[#d3e3fd]">
              <div className="text-right">
                <div className="text-[11px] font-bold text-[#0b57d0] uppercase tracking-wider">Total Quantity</div>
                <div className="text-xl font-black text-[#1f1f1f]">{totalSelectedQuantity} Units</div>
              </div>
            </div>
          )}
        </div>

        {/* Selected List */}
        {selectedExperiments.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#dde3ea] shadow-xs space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#f0f4f9] text-[#747775] flex items-center justify-center mx-auto">
              <BookmarkCheck className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-[#1f1f1f] m-0">No experiments selected yet</h2>
            <p className="text-sm text-[#444746] max-w-md mx-auto m-0">
              Go to any subject practical page (Physics, Chemistry, Biology, etc.) and tap the &quot;+&quot; button to select experiments with your required quantities.
            </p>
            <div className="pt-2">
              <Link href="/subject/physics">
                <M3Button variant="filled" size="md">
                  Browse Experiments
                </M3Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-[#444746] uppercase px-2">
              <span>{selectedExperiments.length} Experiment{selectedExperiments.length > 1 ? 's' : ''} in your list</span>
              <button
                type="button"
                onClick={clearSelected}
                className="text-rose-600 hover:underline cursor-pointer"
              >
                Clear all
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {selectedExperiments.map((exp, idx) => {
                const qty = exp.quantity || 1;
                return (
                  <div
                    key={exp.id || idx}
                    className="bg-white rounded-2xl p-4 border border-[#dde3ea] shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 transition-all hover:border-[#0b57d0]/40"
                  >
                    {/* Left: Thumbnail & Details */}
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      {exp.thumbnail_url ? (
                        <img
                          src={exp.thumbnail_url}
                          alt={exp.title}
                          className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                          <FlaskConical className="w-6 h-6" />
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold text-[#0b57d0] bg-[#eef3fc] px-2 py-0.5 rounded-full border border-[#d3e3fd]">
                            {exp.subject || 'Practical'}
                          </span>
                          {exp.class && (
                            <span className="text-[10px] font-medium text-slate-500">
                              {exp.class}
                            </span>
                          )}
                        </div>

                        <h3 className="text-sm sm:text-base font-bold text-[#1f1f1f] truncate m-0">
                          {exp.title}
                        </h3>

                        <a
                          href={`/experiments/${exp.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-[#0b57d0] hover:underline mt-1"
                        >
                          <span>Open details page</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>

                    {/* Right: Quantity Stepper & Remove */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      {/* Quantity Controller (+ and -) */}
                      <div className="flex items-center gap-2 bg-[#f0f4f9] rounded-xl p-1 border border-[#dde3ea]">
                        <M3IconButton
                          variant="standard"
                          size="sm"
                          icon={<Minus className="w-3.5 h-3.5" />}
                          ariaLabel="Decrease quantity"
                          onClick={() => updateSelectionQty(exp.id, -1)}
                        />
                        <span className="w-8 text-center text-xs font-bold text-[#1f1f1f]">
                          {qty}
                        </span>
                        <M3IconButton
                          variant="standard"
                          size="sm"
                          icon={<Plus className="w-3.5 h-3.5" />}
                          ariaLabel="Increase quantity"
                          onClick={() => updateSelectionQty(exp.id, 1)}
                        />
                      </div>

                      {/* Remove Button */}
                      <M3IconButton
                        variant="standard"
                        size="sm"
                        icon={<Trash2 className="w-4 h-4 text-rose-600" />}
                        ariaLabel="Remove experiment"
                        onClick={() => removeSelection(exp.id)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
