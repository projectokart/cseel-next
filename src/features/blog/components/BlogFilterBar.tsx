'use client';

import React from 'react';
import { Search, X, RotateCcw } from 'lucide-react';
import { BlogSortOption } from '../types';
import { BLOG_CATEGORIES } from '../hooks/useBlogFilter';
import { M3IconButton, M3FilterChip, M3InputChip, M3Button } from '@/components/google-ui';

export interface BlogFilterBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  activeFilterCount: number;
  totalCount: number;
  filteredCount: number;
  onResetFilters: () => void;
}

export const BlogFilterBar: React.FC<BlogFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  activeFilterCount,
  totalCount,
  filteredCount,
  onResetFilters,
}) => {
  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-5 sm:mt-7 w-full max-w-full">
      <div className="w-full bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-[#dadce0] shadow-[0_2px_14px_rgba(0,0,0,0.04)] transition-all space-y-2.5 box-border">
        {/* Search */}
        <div className="flex items-center gap-2.5 w-full">
          <div className="flex items-center gap-2.5 flex-1 min-w-0 h-12 bg-[#eef3fc] hover:bg-[#e3ecf8] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#1a73e8] border border-[#dadce0] focus-within:border-[#1a73e8] rounded-full px-4 transition-all">
            <Search size={18} className="text-[#656773] shrink-0" />

            <input
              type="text"
              placeholder="Search pedagogy articles, NEP 2020 guidelines, ATL setup guides, math insights..."
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

        {/* Category Chips */}
        <div
          className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 select-none"
          style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
        >
          {BLOG_CATEGORIES.map((cat) => (
            <M3FilterChip
              key={cat}
              label={cat === 'All' ? 'All Articles' : cat}
              selected={selectedCategory === cat}
              onClick={() => onSelectCategory(cat)}
            />
          ))}
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

            <div className="ml-auto">
              <M3Button variant="text" size="sm" leadingIcon={<RotateCcw size={13} />} onClick={onResetFilters}>
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
            CSEEL Pedagogical Insights &amp; STEM Articles
          </h2>
          <p className="text-xs text-[#656773] mt-0.5 font-normal font-['Google_Sans',Roboto,sans-serif]">
            Showing <span className="text-[#1a73e8] font-bold">{filteredCount}</span> of {totalCount} published articles &bull; NEP 2020 &amp; CBSE Best Practices
          </p>
        </div>
        <span className="text-xs text-[#656773] font-medium hidden sm:inline font-['Google_Sans',Roboto,sans-serif]">
          Research-Backed Experiential Pedagogy
        </span>
      </div>
    </section>
  );
};

export default BlogFilterBar;
