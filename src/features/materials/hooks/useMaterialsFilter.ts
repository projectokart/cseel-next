'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { ApparatusItem, MaterialSortOption } from '../types';

export const PAGE_SIZE = 25;

export const SORT_OPTIONS: { label: string; value: MaterialSortOption }[] = [
  { label: 'Default Order', value: 'default' },
  { label: 'Name: A to Z', value: 'name-asc' },
  { label: 'Name: Z to A', value: 'name-desc' },
  { label: 'SKU / Code', value: 'sku' },
];

export function useMaterialsFilter(allProducts: ApparatusItem[]) {
  const [search, setSearch] = useState('');
  const [activeChapter, setActiveChapter] = useState('All');
  const [activeSort, setActiveSort] = useState<MaterialSortOption>('default');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Distinct Chapters with count
  const chapterListWithCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allProducts.forEach((p) => {
      const ch = p.cbse_chapter || 'Laboratory Hardware & Measurement Essentials';
      counts[ch] = (counts[ch] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [allProducts]);

  // Top 8 chapters for horizontal quick pills
  const quickChapters = useMemo(() => {
    return chapterListWithCounts.slice(0, 8);
  }, [chapterListWithCounts]);

  // Filtered and sorted products
  const filtered = useMemo(() => {
    let arr = allProducts.filter((p) => {
      if (activeChapter !== 'All' && p.cbse_chapter !== activeChapter) {
        return false;
      }
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        (p.name || '').toLowerCase().includes(q) ||
        (p.sku || '').toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q) ||
        (p.cbse_chapter || '').toLowerCase().includes(q)
      );
    });

    if (activeSort === 'name-asc') {
      return [...arr].sort((a, b) => a.name.localeCompare(b.name));
    }
    if (activeSort === 'name-desc') {
      return [...arr].sort((a, b) => b.name.localeCompare(a.name));
    }
    if (activeSort === 'sku') {
      return [...arr].sort((a, b) => a.sku.localeCompare(b.sku));
    }
    return arr;
  }, [allProducts, search, activeChapter, activeSort]);

  // Reset pagination on filter or search changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [search, activeChapter, activeSort]);

  // Infinite scroll observer
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && visibleCount < filtered.length) {
          setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filtered.length));
        }
      },
      { rootMargin: '400px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [visibleCount, filtered.length]);

  const displayed = useMemo(() => {
    return filtered.slice(0, visibleCount);
  }, [filtered, visibleCount]);

  const hasMore = visibleCount < filtered.length;

  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filtered.length));
  };

  return {
    search,
    setSearch,
    activeChapter,
    setActiveChapter,
    activeSort,
    setActiveSort,
    chapterListWithCounts,
    quickChapters,
    filtered,
    displayed,
    hasMore,
    sentinelRef,
    loadMore,
    visibleCount,
  };
}
