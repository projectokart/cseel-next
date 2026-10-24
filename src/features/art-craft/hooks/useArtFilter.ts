'use client';

import { useState, useMemo } from 'react';
import { ArtExperiment, ArtSortOption } from '../types';

export const ART_CLASS_OPTIONS = [
  { label: 'All Classes', value: 'All' },
  { label: 'Class 6th', value: 'Class 6th' },
  { label: 'Class 7th', value: 'Class 7th' },
  { label: 'Class 8th', value: 'Class 8th' },
  { label: 'Class 9th', value: 'Class 9th' },
  { label: 'Class 10th', value: 'Class 10th' },
  { label: 'Class 11th', value: 'Class 11th' },
  { label: 'Class 12th', value: 'Class 12th' },
];

export const ART_CATEGORIES = [
  'All',
  'Color Physics',
  'Photochemistry',
  'Natural Pigments',
  'Paper Engineering & Origami',
  'Design Thinking',
];

export const ART_DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export const ART_SORT_OPTIONS: { label: string; value: ArtSortOption }[] = [
  { label: 'Most Popular', value: 'popularity' },
  { label: 'Title: A → Z', value: 'az' },
  { label: 'Title: Z → A', value: 'za' },
  { label: 'Duration: Shortest', value: 'duration_asc' },
  { label: 'Difficulty: Beginner First', value: 'diff_asc' },
];

export function useArtFilter(allExperiments: ArtExperiment[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedSort, setSelectedSort] = useState<ArtSortOption>('popularity');

  const activeFilterCount =
    (selectedClass !== 'All' ? 1 : 0) +
    (selectedCategory !== 'All' ? 1 : 0) +
    (selectedDifficulty !== 'All' ? 1 : 0);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedClass('All');
    setSelectedCategory('All');
    setSelectedDifficulty('All');
    setSelectedSort('popularity');
  };

  const filteredExperiments = useMemo(() => {
    let list = [...allExperiments];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (exp) =>
          exp.title.toLowerCase().includes(q) ||
          exp.subtitle.toLowerCase().includes(q) ||
          exp.description.toLowerCase().includes(q) ||
          exp.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (selectedClass !== 'All') {
      list = list.filter((exp) => exp.gradeLevel.toLowerCase().includes(selectedClass.toLowerCase()));
    }

    if (selectedCategory !== 'All') {
      list = list.filter((exp) => exp.category === selectedCategory);
    }

    if (selectedDifficulty !== 'All') {
      list = list.filter((exp) => exp.difficulty.toLowerCase() === selectedDifficulty.toLowerCase());
    }

    if (selectedSort === 'az') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (selectedSort === 'za') {
      list.sort((a, b) => b.title.localeCompare(a.title));
    } else if (selectedSort === 'duration_asc') {
      list.sort((a, b) => (parseInt(a.duration) || 30) - (parseInt(b.duration) || 30));
    } else if (selectedSort === 'diff_asc') {
      const order: Record<string, number> = { Beginner: 1, Intermediate: 2, Advanced: 3 };
      list.sort((a, b) => (order[a.difficulty] || 0) - (order[b.difficulty] || 0));
    }

    return list;
  }, [allExperiments, searchQuery, selectedClass, selectedCategory, selectedDifficulty, selectedSort]);

  return {
    searchQuery,
    setSearchQuery,
    selectedClass,
    setSelectedClass,
    selectedCategory,
    setSelectedCategory,
    selectedDifficulty,
    setSelectedDifficulty,
    selectedSort,
    setSelectedSort,
    activeFilterCount,
    resetFilters,
    filteredExperiments,
  };
}
