'use client';

import { useState, useMemo } from 'react';
import { MediaItem, MediaType, GalleryCategory } from '../types';

export const MEDIA_TYPES: { label: string; value: string }[] = [
  { label: 'All Media', value: 'all' },
  { label: 'Photos', value: 'photo' },
  { label: 'Videos', value: 'video' },
  { label: '360° Virtual Tours', value: 'virtual_tour_360' },
  { label: 'Press Releases', value: 'press_release' },
];

export const GALLERY_CATEGORIES: string[] = [
  'All',
  'Composite Science Lab',
  'Atal Tinkering Lab (ATL)',
  'Experiential Math Studio',
  'Creative STEAM Studio',
  'Student Hackathons',
];

export function useGalleryFilter(allItems: MediaItem[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const activeFilterCount =
    (selectedType !== 'all' ? 1 : 0) + (selectedCategory !== 'All' ? 1 : 0);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSelectedCategory('All');
  };

  const filteredItems = useMemo(() => {
    let list = [...allItems];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.schoolName?.toLowerCase().includes(q) ||
          item.location?.toLowerCase().includes(q) ||
          item.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (selectedType !== 'all') {
      list = list.filter((item) => item.type === selectedType);
    }

    if (selectedCategory !== 'All') {
      list = list.filter((item) => item.category === selectedCategory);
    }

    return list;
  }, [allItems, searchQuery, selectedType, selectedCategory]);

  return {
    searchQuery,
    setSearchQuery,
    selectedType,
    setSelectedType,
    selectedCategory,
    setSelectedCategory,
    activeFilterCount,
    resetFilters,
    filteredItems,
  };
}
