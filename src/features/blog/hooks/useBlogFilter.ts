'use client';

import { useState, useMemo } from 'react';
import { BlogPost, BlogSortOption } from '../types';

export const BLOG_CATEGORIES = [
  'All',
  'Pedagogy & NEP 2020',
  'Science & Experiments',
  'Atal Tinkering Labs (ATL)',
  'Mathematics in Practice',
  'EdTech & Future Skills',
];

export const BLOG_SORT_OPTIONS: { label: string; value: BlogSortOption }[] = [
  { label: 'Latest First', value: 'newest' },
  { label: 'Oldest First', value: 'oldest' },
  { label: 'Shortest Read', value: 'read_time' },
];

export function useBlogFilter(allPosts: BlogPost[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTag, setSelectedTag] = useState('All');
  const [selectedSort, setSelectedSort] = useState<BlogSortOption>('newest');

  const activeFilterCount =
    (selectedCategory !== 'All' ? 1 : 0) + (selectedTag !== 'All' ? 1 : 0);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedTag('All');
    setSelectedSort('newest');
  };

  const allTags = useMemo(() => {
    const set = new Set<string>();
    allPosts.forEach((p) => p.tags?.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [allPosts]);

  const filteredPosts = useMemo(() => {
    let list = [...allPosts];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.summary.toLowerCase().includes(q) ||
          p.author.name.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (selectedCategory !== 'All') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (selectedTag !== 'All') {
      list = list.filter((p) => p.tags.includes(selectedTag));
    }

    if (selectedSort === 'newest') {
      // Keep defined order or sort by date
    } else if (selectedSort === 'oldest') {
      list.reverse();
    } else if (selectedSort === 'read_time') {
      list.sort((a, b) => a.readTimeMinutes - b.readTimeMinutes);
    }

    return list;
  }, [allPosts, searchQuery, selectedCategory, selectedTag, selectedSort]);

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedTag,
    setSelectedTag,
    selectedSort,
    setSelectedSort,
    activeFilterCount,
    resetFilters,
    allTags,
    filteredPosts,
  };
}
