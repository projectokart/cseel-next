'use client';

import React, { useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  X,
  Check,
  RotateCcw,
  BookmarkCheck,
} from 'lucide-react';
import { MaterialSortOption } from '../types';
import { SORT_OPTIONS } from '../hooks/useMaterialsFilter';
import {
  M3Button,
  M3IconButton,
  M3FilterChip,
  M3InputChip,
  M3Badge,
} from '@/components/google-ui';

export interface MaterialsFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  activeChapter: string;
  onSelectChapter: (chapter: string) => void;
  quickChapters: [string, number][];
  totalProductsCount: number;
  filteredCount: number;
  displayedCount?: number;
  activeSort: MaterialSortOption;
  onApplySort: (sort: MaterialSortOption) => void;
  onOpenFilterDrawer: () => void;
  selectedCount: number;
  onOpenRequisitionDrawer: () => void;
}

export const MaterialsFilterBar: React.FC<MaterialsFilterBarProps> = ({
  search,
  onSearchChange,
  activeChapter,
  onSelectChapter,
  quickChapters,
  totalProductsCount,
  filteredCount,
  displayedCount,
  activeSort,
  onApplySort,
  onOpenFilterDrawer,
  selectedCount,
  onOpenRequisitionDrawer,
}) => {
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const isFilterActive = activeChapter !== 'All';
  const isSortActive = activeSort !== 'default';
  const activeFilterCount = (isFilterActive ? 1 : 0) + (isSortActive ? 1 : 0);

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-5 sm:mt-7 w-full max-w-full">
      <div className="w-full bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-[#dadce0] shadow-[0_2px_14px_rgba(0,0,0,0.04)] transition-all space-y-2.5 box-border">
        {/* Search Bar Row: Search Pill + Standalone Requisition Bookmark Button */}
        <div className="flex items-center gap-2.5 w-full">
          {/* Official Google M3 Search Bar (52px pill, #eef3fc Surface Container High) */}
          <div className="flex items-center gap-2.5 flex-1 min-w-0 h-12 bg-[#eef3fc] hover:bg-[#e3ecf8] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#1a73e8] border border-[#dadce0] focus-within:border-[#1a73e8] rounded-full px-4 transition-all">
            <Search size={18} className="text-[#656773] shrink-0" />

            <input
              type="text"
              placeholder="Search 950+ physics apparatuses by name, SKU (e.g. PH10036), or CBSE chapter..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm font-medium text-[#16171A] placeholder-[#656773] outline-none min-w-0 font-['Google_Sans',Roboto,sans-serif]"
            />

            {search && (
              <M3IconButton
                variant="standard"
                size="sm"
                ariaLabel="Clear search"
                icon={<X size={15} />}
                onClick={() => onSearchChange('')}
              />
            )}
          </div>

          {/* Standalone Selected Items Button Outside Search Bar */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={onOpenRequisitionDrawer}
              aria-label="View Selected Apparatuses"
              title="View Selected Apparatuses"
              className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xs active:scale-95 ${
                selectedCount > 0
                  ? 'bg-[#1a73e8] text-white hover:bg-[#1557b0] ring-2 ring-[#1a73e8]/20'
                  : 'bg-[#eef3fc] text-[#16171A] hover:bg-[#d3e3fd] border border-[#dadce0]'
              }`}
            >
              <BookmarkCheck size={20} strokeWidth={2.4} />

              {selectedCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 bg-[#b3261e] text-white text-[11px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-xs animate-in zoom-in-75 duration-150">
                  {selectedCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Quick Action & Chapter Chips Row (Official M3 IconButtons + M3 FilterChips) */}
        <div className="flex items-center gap-2 w-full select-none">
          {/* Static Action Buttons: Filter Trigger + Sort Trigger */}
          <div className="flex items-center gap-1.5 shrink-0 relative">
            {/* Filter Icon Trigger */}
            <div className="relative">
              <M3IconButton
                variant={isFilterActive ? 'filled' : 'tonal'}
                size="sm"
                selected={isFilterActive}
                ariaLabel="Open filters"
                icon={<SlidersHorizontal size={15} strokeWidth={2.2} />}
                onClick={onOpenFilterDrawer}
              />
              {isFilterActive && (
                <span className="absolute -top-1 -right-1 pointer-events-none">
                  <M3Badge count={1} />
                </span>
              )}
            </div>

            {/* Sort Icon Dropdown Trigger */}
            <div className="relative shrink-0">
              <M3IconButton
                variant={isSortActive || isSortMenuOpen ? 'tonal' : 'outlined'}
                size="sm"
                selected={isSortActive || isSortMenuOpen}
                ariaLabel="Open sort menu"
                icon={<ArrowUpDown size={15} strokeWidth={2.2} />}
                onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
              />

              {/* Floating Google Dropdown Menu */}
              {isSortMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsSortMenuOpen(false)} />
                  <div className="absolute top-full left-0 mt-2 w-56 bg-[#f8fafd] rounded-2xl shadow-2xl border border-[#dde3ea] py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 origin-top-left overflow-hidden">
                    <div className="px-3 py-1.5 text-[10px] font-bold text-[#444746] uppercase tracking-wider border-b border-[#dde3ea] flex items-center justify-between">
                      <span>Sort Apparatuses</span>
                      {isSortActive && (
                        <button
                          type="button"
                          onClick={() => {
                            onApplySort('default');
                            setIsSortMenuOpen(false);
                          }}
                          className="text-[10px] text-[#0b57d0] hover:underline font-bold"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                    <div className="p-1 space-y-0.5">
                      {SORT_OPTIONS.map((opt) => {
                        const isActive = activeSort === opt.value;
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
                                ? 'bg-[#c2e7ff] text-[#001d35] font-bold'
                                : 'text-[#1f1f1f] hover:bg-[#eef3fc] font-medium'
                            }`}
                          >
                            <span>{opt.label}</span>
                            {isActive && (
                              <Check
                                size={14}
                                strokeWidth={2.5}
                                className="text-[#0b57d0] shrink-0"
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Small Divider */}
          <div className="h-5 w-px bg-[#c4c7c5] shrink-0 mx-0.5" />

          {/* Scrollable Official M3 FilterChips Container for Chapters */}
          <div
            className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 flex-1 min-w-0"
            style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
          >
            <M3FilterChip
              label={`All (${totalProductsCount})`}
              selected={activeChapter === 'All'}
              onClick={() => onSelectChapter('All')}
            />
            {quickChapters.map(([ch, count]) => {
              const isActive = activeChapter === ch;
              return (
                <M3FilterChip
                  key={ch}
                  label={`${ch} (${count})`}
                  selected={isActive}
                  onClick={() => onSelectChapter(ch)}
                />
              );
            })}
          </div>
        </div>

        {/* Active Filters using Official M3 InputChips */}
        {(isFilterActive || search) && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#dde3ea]">
            <span className="text-[10px] font-bold text-[#444746] uppercase tracking-wider mr-1">
              Active:
            </span>

            {search && (
              <M3InputChip label={`"${search}"`} selected onRemove={() => onSearchChange('')} />
            )}

            {isFilterActive && (
              <M3InputChip
                label={activeChapter}
                selected
                onRemove={() => onSelectChapter('All')}
              />
            )}

            <div className="ml-auto">
              <M3Button
                variant="text"
                size="sm"
                leadingIcon={<RotateCcw size={13} />}
                onClick={() => {
                  onSearchChange('');
                  onSelectChapter('All');
                  onApplySort('default');
                }}
              >
                Clear All
              </M3Button>
            </div>
          </div>
        )}
      </div>

      {/* Google Shopping Style Heading (Matching Image 3) */}
      <div className="mt-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 pb-3 border-b border-[#dadce0]">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#16171A] tracking-tight font-['Google_Sans',Roboto,sans-serif]">
            Popular Physics Apparatuses
          </h2>
          <p className="text-xs text-[#656773] mt-0.5 font-normal font-['Google_Sans',Roboto,sans-serif]">
            Showing{' '}
            <span className="text-[#1a73e8] font-bold">
              {displayedCount !== undefined ? displayedCount : filteredCount}
            </span>{' '}
            of {filteredCount} scientific instruments &bull; CBSE &amp; NCERT Syllabus
          </p>
        </div>
        <span className="text-xs text-[#656773] font-medium hidden sm:inline font-['Google_Sans',Roboto,sans-serif]">
          NEP 2020 Lab Standards &bull; Experiential Learning
        </span>
      </div>
    </section>
  );
};

export default MaterialsFilterBar;
