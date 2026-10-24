'use client';

import { useState, useMemo } from 'react';
import { MathExperiment, MathSortOption } from '../types';

export const MATH_CLASS_OPTIONS = [
  { label: 'All Classes', value: 'All' },
  { label: 'Class 6th', value: 'Class 6th' },
  { label: 'Class 7th', value: 'Class 7th' },
  { label: 'Class 8th', value: 'Class 8th' },
  { label: 'Class 9th', value: 'Class 9th' },
  { label: 'Class 10th', value: 'Class 10th' },
  { label: 'Class 11th', value: 'Class 11th' },
  { label: 'Class 12th', value: 'Class 12th' },
];

export const MATH_DIFFICULTY_OPTIONS = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export const MATH_SORT_OPTIONS: { label: string; value: MathSortOption }[] = [
  { label: 'Most Popular', value: 'popularity' },
  { label: 'Title: A → Z', value: 'az' },
  { label: 'Title: Z → A', value: 'za' },
  { label: 'Duration: Shortest', value: 'duration_asc' },
  { label: 'Difficulty: Beginner First', value: 'diff_asc' },
];

export function useMathFilter(allExperiments: MathExperiment[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedSort, setSelectedSort] = useState<MathSortOption>('popularity');

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

  const categories = useMemo(() => {
    const set = new Set<string>();
    allExperiments.forEach((exp) => {
      if (exp.category) set.add(exp.category);
    });
    return Array.from(set);
  }, [allExperiments]);

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
    categories,
    filteredExperiments,
  };
}
