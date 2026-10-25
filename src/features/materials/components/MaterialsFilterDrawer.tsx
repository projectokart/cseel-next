'use client';

import React, { useState, useEffect } from 'react';
import { X, Search, ArrowUpDown, Atom } from 'lucide-react';
import { MaterialSortOption } from '../types';
import { SORT_OPTIONS } from '../hooks/useMaterialsFilter';
import {
  M3Button,
  M3IconButton,
  M3Badge,
} from '@/components/google-ui';

export interface MaterialsFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeChapter: string;
  onApplyChapter: (chapter: string) => void;
  activeSort?: MaterialSortOption;
  onApplySort?: (sort: MaterialSortOption) => void;
  chapterListWithCounts: [string, number][];
  filteredCount: number;
}

export const MaterialsFilterDrawer: React.FC<MaterialsFilterDrawerProps> = ({
  isOpen,
  onClose,
  activeChapter,
  onApplyChapter,
  chapterListWithCounts,
  filteredCount,
}) => {
  const [tempChapter, setTempChapter] = useState(activeChapter);
  const [chapterSearch, setChapterSearch] = useState('');

  // Sync state when drawer opens
  useEffect(() => {
    if (isOpen) {
      setTempChapter(activeChapter);
      setChapterSearch('');
    }
  }, [isOpen, activeChapter]);

  // Close filter sheet on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Prevent background scroll when filter sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isFilterActive = tempChapter !== 'All';
  const activeCount = tempChapter !== 'All' ? 1 : 0;

  const filteredChapters = chapterListWithCounts.filter(([ch]) =>
    ch.toLowerCase().includes(chapterSearch.toLowerCase())
  );

  const handleApply = () => {
    onApplyChapter(tempChapter);
    onClose();
  };

  const handleClear = () => {
    setTempChapter('All');
    setChapterSearch('');
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/50 backdrop-blur-2xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Sheet Container: Same exact Google panel on tablet/desktop */}
      <div className="fixed inset-y-0 left-0 right-auto w-[85vw] xs:w-[280px] sm:w-[320px] md:w-[350px] max-w-[88vw] h-full bg-white shadow-2xl flex flex-col z-[9999] rounded-r-2xl border-r border-slate-200 overflow-hidden box-border animate-in slide-in-from-left duration-300">
        {/* Google Refine Results Header */}
        <div className="px-3.5 py-3 border-b border-[#dadce0] flex items-center justify-between shrink-0 bg-[#f8fafd]">
          <div className="flex items-center gap-2 min-w-0">
            <h2 className="text-sm sm:text-base font-semibold text-[#16171A] tracking-tight truncate font-['Google_Sans',Roboto,sans-serif]">
              Refine results
            </h2>
            {activeCount > 0 && <M3Badge count={activeCount} />}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {isFilterActive && (
              <M3Button variant="text" size="sm" onClick={handleClear}>
                Clear
              </M3Button>
            )}
            <M3IconButton
              variant="standard"
              size="sm"
              ariaLabel="Close refine results"
              icon={<X size={15} />}
              onClick={onClose}
            />
          </div>
        </div>

        {/* Google Refine Results Body Scrollable */}
        <div className="flex-1 overflow-y-auto px-3 py-2.5 space-y-4 no-scrollbar divide-y divide-slate-100">
          {/* 1. Physics Chapter / Unit Group */}
          <div className="pt-1 first:pt-0 space-y-2">
            <div className="flex items-center justify-between py-1">
              <span className="text-xs font-bold text-slate-900">
                Physics Chapters
              </span>
              {tempChapter !== 'All' && (
                <button
                  type="button"
                  onClick={() => setTempChapter('All')}
                  className="text-[10px] text-slate-400 hover:text-red-500 font-medium"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Chapter search input */}
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search chapters..."
                value={chapterSearch}
                onChange={(e) => setChapterSearch(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-[#006fcc] focus:bg-white transition-all"
              />
              {chapterSearch && (
                <button
                  type="button"
                  onClick={() => setChapterSearch('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  &times;
                </button>
              )}
            </div>

            <div className="space-y-0.5 pb-4">
              {/* All option */}
              <button
                type="button"
                onClick={() => setTempChapter('All')}
                className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs transition-colors text-left ${
                  tempChapter === 'All'
                    ? 'bg-blue-50/80 text-[#006fcc] font-bold'
                    : 'text-slate-700 hover:bg-slate-50 font-medium'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border transition-all ${
                      tempChapter === 'All'
                        ? 'border-[#006fcc] bg-[#006fcc]'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {tempChapter === 'All' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </span>
                  <span className="truncate">All Physics Chapters</span>
                </div>
              </button>

              {filteredChapters.map(([ch, count]) => {
                const isActive = tempChapter === ch;
                return (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => setTempChapter(ch)}
                    className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs transition-colors text-left ${
                      isActive
                        ? 'bg-blue-50/80 text-[#006fcc] font-bold'
                        : 'text-slate-700 hover:bg-slate-50 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span
                        className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border transition-all shrink-0 ${
                          isActive ? 'border-[#006fcc] bg-[#006fcc]' : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </span>
                      <span className="truncate">{ch}</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500 font-mono shrink-0 ml-1">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Google Refine Results Sticky Footer */}
        <div className="p-3 border-t border-[#dadce0] bg-[#f8fafd] shrink-0">
          <M3Button variant="filled" size="md" fullWidth onClick={handleApply}>
            Apply ({filteredCount})
          </M3Button>
        </div>
      </div>
    </div>
  );
};

export default MaterialsFilterDrawer;
