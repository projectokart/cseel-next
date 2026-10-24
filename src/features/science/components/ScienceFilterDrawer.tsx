'use client';

import React, { useEffect } from 'react';
import { X, GraduationCap, Shield, Clock, Flame } from 'lucide-react';
import {
  CLASS_OPTIONS,
  DIFFICULTY_OPTIONS,
  DURATION_OPTIONS,
  SAFETY_OPTIONS,
} from '../hooks/useScienceFilter';
import { M3Button, M3IconButton, M3Badge } from '@/components/google-ui';

export interface ScienceFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedClass: string;
  onSelectClass: (cls: string) => void;
  selectedDifficulty: string;
  onSelectDifficulty: (diff: string) => void;
  selectedDuration: string;
  onSelectDuration: (dur: string) => void;
  selectedSafety: string;
  onSelectSafety: (safe: string) => void;
  activeFilterCount: number;
  onResetFilters: () => void;
  filteredCount: number;
}

export const ScienceFilterDrawer: React.FC<ScienceFilterDrawerProps> = ({
  isOpen,
  onClose,
  selectedClass,
  onSelectClass,
  selectedDifficulty,
  onSelectDifficulty,
  selectedDuration,
  onSelectDuration,
  selectedSafety,
  onSelectSafety,
  activeFilterCount,
  onResetFilters,
  filteredCount,
}) => {
  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Prevent background scroll
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
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/50 backdrop-blur-2xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Sheet Container: Above Header with z-[9999] */}
      <div className="fixed inset-y-0 left-0 right-auto w-[85vw] xs:w-[280px] sm:w-[320px] md:w-[350px] max-w-[88vw] h-full bg-white shadow-2xl flex flex-col z-[9999] rounded-r-2xl border-r border-slate-200 overflow-hidden box-border animate-in slide-in-from-left duration-300">
        {/* Header */}
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

        {/* Filter Facets Body */}
        <div className="flex-1 overflow-y-auto px-3 py-2.5 space-y-4 no-scrollbar divide-y divide-slate-100">
          {/* 1. Class / Grade Level */}
          <div className="pt-1 first:pt-0 space-y-1.5">
            <div className="flex items-center justify-between py-1">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <GraduationCap size={13} className="text-[#006fcc]" /> Class / Grade
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
              {CLASS_OPTIONS.map((cls) => {
                const isActive = selectedClass === cls.value;
                return (
                  <button
                    key={cls.value}
                    type="button"
                    onClick={() => onSelectClass(cls.value)}
                    className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-colors text-left truncate flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-blue-50 text-[#006fcc] font-bold border border-blue-200'
                        : 'text-slate-700 hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <span
                      className={`w-3 h-3 rounded-full flex items-center justify-center border shrink-0 ${
                        isActive ? 'border-[#006fcc] bg-[#006fcc]' : 'border-slate-300 bg-white'
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

          {/* 2. Difficulty Level */}
          <div className="pt-3 space-y-1.5">
            <div className="flex items-center justify-between py-1">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Flame size={13} className="text-[#006fcc]" /> Difficulty Level
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
              {DIFFICULTY_OPTIONS.map((diff) => {
                const isActive = selectedDifficulty === diff;
                return (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => onSelectDifficulty(diff)}
                    className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs transition-colors text-left ${
                      isActive
                        ? 'bg-blue-50/80 text-[#006fcc] font-bold'
                        : 'text-slate-700 hover:bg-slate-50 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border transition-all ${
                          isActive ? 'border-[#006fcc] bg-[#006fcc]' : 'border-slate-300 bg-white'
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

          {/* 3. Duration */}
          <div className="pt-3 space-y-1.5">
            <div className="flex items-center justify-between py-1">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Clock size={13} className="text-[#006fcc]" /> Lab Duration
              </span>
              {selectedDuration !== 'All' && (
                <button
                  type="button"
                  onClick={() => onSelectDuration('All')}
                  className="text-[10px] text-slate-400 hover:text-red-500 font-medium"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="space-y-0.5">
              {DURATION_OPTIONS.map((dur) => {
                const isActive = selectedDuration === dur.value;
                return (
                  <button
                    key={dur.value}
                    type="button"
                    onClick={() => onSelectDuration(dur.value)}
                    className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs transition-colors text-left ${
                      isActive
                        ? 'bg-blue-50/80 text-[#006fcc] font-bold'
                        : 'text-slate-700 hover:bg-slate-50 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border transition-all ${
                          isActive ? 'border-[#006fcc] bg-[#006fcc]' : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </span>
                      <span className="truncate">{dur.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Safety Level */}
          <div className="pt-3 space-y-1.5">
            <div className="flex items-center justify-between py-1">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Shield size={13} className="text-[#006fcc]" /> Lab Safety & Environment
              </span>
              {selectedSafety !== 'All' && (
                <button
                  type="button"
                  onClick={() => onSelectSafety('All')}
                  className="text-[10px] text-slate-400 hover:text-red-500 font-medium"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="space-y-0.5">
              {SAFETY_OPTIONS.map((safe) => {
                const isActive = selectedSafety === safe.value;
                return (
                  <button
                    key={safe.value}
                    type="button"
                    onClick={() => onSelectSafety(safe.value)}
                    className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs transition-colors text-left ${
                      isActive
                        ? 'bg-blue-50/80 text-[#006fcc] font-bold'
                        : 'text-slate-700 hover:bg-slate-50 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border transition-all ${
                          isActive ? 'border-[#006fcc] bg-[#006fcc]' : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </span>
                      <span className="truncate">{safe.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="p-3 border-t border-[#dadce0] bg-[#f8fafd] shrink-0">
          <M3Button variant="filled" size="md" fullWidth onClick={onClose}>
            Show Results ({filteredCount})
          </M3Button>
        </div>
      </div>
    </div>
  );
};

export default ScienceFilterDrawer;
