'use client';

import React, { useState } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, X, Check, RotateCcw } from 'lucide-react';
import { MathSortOption } from '../types';
import { MATH_SORT_OPTIONS, MATH_CLASS_OPTIONS } from '../hooks/useMathFilter';
import {
  M3Button,
  M3IconButton,
  M3FilterChip,
  M3InputChip,
  M3Badge,
} from '@/components/google-ui';

export interface MathFilterBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedClass: string;
  onSelectClass: (cls: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  categories: string[];
  selectedSort: MathSortOption;
  onApplySort: (sort: MathSortOption) => void;
  onOpenFilterDrawer: () => void;
  activeFilterCount: number;
  totalCount: number;
  filteredCount: number;
  onResetFilters: () => void;
}

export const MathFilterBar: React.FC<MathFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedClass,
  onSelectClass,
  selectedCategory,
  onSelectCategory,
  categories,
  selectedSort,
  onApplySort,
  onOpenFilterDrawer,
  activeFilterCount,
  totalCount,
  filteredCount,
  onResetFilters,
}) => {
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-5 sm:mt-7 w-full max-w-full">
      <div className="w-full bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-[#dadce0] shadow-[0_2px_14px_rgba(0,0,0,0.04)] transition-all space-y-2.5 box-border">
        {/* Search Bar Row */}
        <div className="flex items-center gap-2.5 w-full">
          <div className="flex items-center gap-2.5 flex-1 min-w-0 h-12 bg-[#f5f3ff] hover:bg-[#ede9fe] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#8b5cf6] border border-[#dadce0] focus-within:border-[#8b5cf6] rounded-full px-4 transition-all">
            <Search size={18} className="text-[#656773] shrink-0" />

            <input
              type="text"
              placeholder="Search math experiments, conic sections, coordinate visualizers, calculus..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm font-medium text-[#16171A] placeholder-[#656773] outline-none min-w-0 font-['Google_Sans',Roboto,sans-serif]"
            />

            {searchQuery && (
              <M3IconButton
                variant="standard"
                size="sm"
                ariaLabel="Clear search"
                icon={<X size={15} />}
                onClick={() => onSearchChange('')}
              />
            )}
          </div>
        </div>

        {/* Action Buttons & Chips Row */}
        <div className="flex items-center gap-2 w-full select-none">
          <div className="flex items-center gap-1.5 shrink-0 relative">
            <div className="relative">
              <M3IconButton
                variant={activeFilterCount > 0 ? 'filled' : 'tonal'}
                size="sm"
                selected={activeFilterCount > 0}
                ariaLabel="Open filters"
                icon={<SlidersHorizontal size={15} strokeWidth={2.2} />}
                onClick={onOpenFilterDrawer}
              />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 pointer-events-none">
                  <M3Badge count={activeFilterCount} />
                </span>
              )}
            </div>

            <div className="relative shrink-0">
              <M3IconButton
                variant={selectedSort !== 'popularity' || isSortMenuOpen ? 'tonal' : 'outlined'}
                size="sm"
                selected={selectedSort !== 'popularity' || isSortMenuOpen}
                ariaLabel="Open sort menu"
                icon={<ArrowUpDown size={15} strokeWidth={2.2} />}
                onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
              />

              {isSortMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsSortMenuOpen(false)} />
                  <div className="absolute top-full left-0 mt-2 w-56 bg-[#f8fafd] rounded-2xl shadow-2xl border border-[#dadce0] py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 origin-top-left overflow-hidden">
                    <div className="px-3 py-1.5 text-[10px] font-bold text-[#656773] uppercase tracking-wider border-b border-[#dadce0] flex items-center justify-between">
                      <span>Sort Activities</span>
                      {selectedSort !== 'popularity' && (
                        <button
                          type="button"
                          onClick={() => {
                            onApplySort('popularity');
                            setIsSortMenuOpen(false);
                          }}
                          className="text-[10px] text-[#8b5cf6] hover:underline font-bold"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                    <div className="p-1 space-y-0.5">
                      {MATH_SORT_OPTIONS.map((opt) => {
                        const isActive = selectedSort === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                              onApplySort(opt.value);
                              setIsSortMenuOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-full text-xs transition-colors text-left cursor-pointer ${
                              isActive
                                ? 'bg-purple-100 text-purple-900 font-bold'
                                : 'text-[#16171A] hover:bg-[#f5f3ff] font-medium'
                            }`}
                          >
                            <span>{opt.label}</span>
                            {isActive && <Check size={14} strokeWidth={2.5} className="text-[#8b5cf6] shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="h-5 w-px bg-[#c4c7c5] shrink-0 mx-0.5" />

          {/* Chips */}
          <div
            className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 flex-1 min-w-0"
            style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
          >
            <M3FilterChip
              label="All Categories"
              selected={selectedCategory === 'All'}
              onClick={() => onSelectCategory('All')}
            />
            {categories.map((cat) => (
              <M3FilterChip
                key={cat}
                label={cat}
                selected={selectedCategory === cat}
                onClick={() => onSelectCategory(selectedCategory === cat ? 'All' : cat)}
              />
            ))}

            <div className="h-4 w-px bg-slate-200 shrink-0 mx-1" />

            {MATH_CLASS_OPTIONS.filter((c) => c.value !== 'All').map((cls) => (
              <M3FilterChip
                key={cls.value}
                label={cls.label}
                selected={selectedClass === cls.value}
                onClick={() => onSelectClass(selectedClass === cls.value ? 'All' : cls.value)}
              />
            ))}
          </div>
        </div>

        {/* Active Filters */}
        {(activeFilterCount > 0 || searchQuery) && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#dadce0]">
            <span className="text-[10px] font-bold text-[#656773] uppercase tracking-wider mr-1">Active:</span>

            {searchQuery && (
              <M3InputChip label={`"${searchQuery}"`} selected onRemove={() => onSearchChange('')} />
            )}

            {selectedCategory !== 'All' && (
              <M3InputChip label={selectedCategory} selected onRemove={() => onSelectCategory('All')} />
            )}

            {selectedClass !== 'All' && (
              <M3InputChip label={selectedClass} selected onRemove={() => onSelectClass('All')} />
            )}

            <div className="ml-auto">
              <M3Button
                variant="text"
                size="sm"
                leadingIcon={<RotateCcw size={13} />}
                onClick={onResetFilters}
              >
                Clear All
              </M3Button>
            </div>
          </div>
        )}
      </div>

      {/* Header Bar */}
      <div className="mt-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 pb-3 border-b border-[#dadce0]">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#16171A] tracking-tight font-['Google_Sans',Roboto,sans-serif]">
            Experiential Mathematics &amp; Modeling
          </h2>
          <p className="text-xs text-[#656773] mt-0.5 font-normal font-['Google_Sans',Roboto,sans-serif]">
            Showing <span className="text-[#8b5cf6] font-bold">{filteredCount}</span> of {totalCount} tactile mathematical proofs &bull; CBSE Class 6th &ndash; 12th
          </p>
        </div>
        <span className="text-xs text-[#656773] font-medium hidden sm:inline font-['Google_Sans',Roboto,sans-serif]">
          NEP 2020 Experiential &bull; Tactile Math Lab Norms
        </span>
      </div>
    </section>
  );
};

export default MathFilterBar;
