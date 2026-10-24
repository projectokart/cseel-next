'use client';

import React, { useEffect } from 'react';
import { X, GraduationCap, Flame, Palette } from 'lucide-react';
import {
  ART_CLASS_OPTIONS,
  ART_CATEGORIES,
  ART_DIFFICULTIES,
} from '../hooks/useArtFilter';
import { M3Button, M3IconButton, M3Badge } from '@/components/google-ui';

export interface ArtFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedClass: string;
  onSelectClass: (cls: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedDifficulty: string;
  onSelectDifficulty: (diff: string) => void;
  activeFilterCount: number;
  onResetFilters: () => void;
  filteredCount: number;
}

export const ArtFilterDrawer: React.FC<ArtFilterDrawerProps> = ({
  isOpen,
  onClose,
  selectedClass,
  onSelectClass,
  selectedCategory,
  onSelectCategory,
  selectedDifficulty,
  onSelectDifficulty,
  activeFilterCount,
  onResetFilters,
  filteredCount,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

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

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden">
      <div
        className="fixed inset-0 bg-slate-950/50 backdrop-blur-2xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 left-0 right-auto w-[85vw] xs:w-[280px] sm:w-[320px] md:w-[350px] max-w-[88vw] h-full bg-white shadow-2xl flex flex-col z-[9999] rounded-r-2xl border-r border-slate-200 overflow-hidden box-border animate-in slide-in-from-left duration-300">
        <div className="px-3.5 py-3 border-b border-[#dadce0] flex items-center justify-between shrink-0 bg-[#f8fafd]">
          <div className="flex items-center gap-2 min-w-0">
            <h2 className="text-sm sm:text-base font-semibold text-[#16171A] tracking-tight truncate font-['Google_Sans',Roboto,sans-serif]">
              Refine results
            </h2>
            {activeFilterCount > 0 && <M3Badge count={activeFilterCount} />}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {activeFilterCount > 0 && (
              <M3Button variant="text" size="sm" onClick={onResetFilters}>
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

        <div className="flex-1 overflow-y-auto px-3 py-2.5 space-y-4 no-scrollbar divide-y divide-slate-100">
          {/* Class */}
          <div className="pt-1 first:pt-0 space-y-1.5">
            <div className="flex items-center justify-between py-1">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <GraduationCap size={13} className="text-[#e11d48]" /> Class / Grade
              </span>
              {selectedClass !== 'All' && (
                <button
                  type="button"
                  onClick={() => onSelectClass('All')}
                  className="text-[10px] text-slate-400 hover:text-red-500 font-medium"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-1">
              {ART_CLASS_OPTIONS.map((cls) => {
                const isActive = selectedClass === cls.value;
                return (
                  <button
                    key={cls.value}
                    type="button"
                    onClick={() => onSelectClass(cls.value)}
                    className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-colors text-left truncate flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-rose-50 text-[#e11d48] font-bold border border-rose-200'
                        : 'text-slate-700 hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <span
                      className={`w-3 h-3 rounded-full flex items-center justify-center border shrink-0 ${
                        isActive ? 'border-[#e11d48] bg-[#e11d48]' : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isActive && <span className="w-1 h-1 rounded-full bg-white" />}
                    </span>
                    <span className="truncate">{cls.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category */}
          <div className="pt-3 space-y-1.5">
            <div className="flex items-center justify-between py-1">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Palette size={13} className="text-[#e11d48]" /> Creative Discipline
              </span>
              {selectedCategory !== 'All' && (
                <button
                  type="button"
                  onClick={() => onSelectCategory('All')}
                  className="text-[10px] text-slate-400 hover:text-red-500 font-medium"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="space-y-0.5">
              {ART_CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => onSelectCategory(cat)}
                    className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs transition-colors text-left ${
                      isActive
                        ? 'bg-rose-50 text-[#e11d48] font-bold'
                        : 'text-slate-700 hover:bg-slate-50 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border transition-all ${
                          isActive ? 'border-[#e11d48] bg-[#e11d48]' : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </span>
                      <span className="truncate">{cat === 'All' ? 'All STEAM Disciplines' : cat}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Difficulty */}
          <div className="pt-3 space-y-1.5">
            <div className="flex items-center justify-between py-1">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Flame size={13} className="text-[#e11d48]" /> Difficulty
              </span>
              {selectedDifficulty !== 'All' && (
                <button
                  type="button"
                  onClick={() => onSelectDifficulty('All')}
                  className="text-[10px] text-slate-400 hover:text-red-500 font-medium"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="space-y-0.5">
              {ART_DIFFICULTIES.map((diff) => {
                const isActive = selectedDifficulty === diff;
                return (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => onSelectDifficulty(diff)}
                    className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs transition-colors text-left ${
                      isActive
                        ? 'bg-rose-50 text-[#e11d48] font-bold'
                        : 'text-slate-700 hover:bg-slate-50 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border transition-all ${
                          isActive ? 'border-[#e11d48] bg-[#e11d48]' : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </span>
                      <span className="truncate">{diff}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-3 border-t border-[#dadce0] bg-[#f8fafd] shrink-0">
          <M3Button variant="filled" size="md" fullWidth onClick={onClose}>
            Show Results ({filteredCount})
          </M3Button>
        </div>
      </div>
    </div>
  );
};

export default ArtFilterDrawer;
