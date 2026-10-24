'use client';

import { useState, useMemo } from 'react';
import { ScienceExperiment, ScienceSortOption } from '../types';

export const CLASS_OPTIONS = [
  { label: 'All Classes', value: 'All' },
  { label: 'Class 6th', value: 'Class 6th' },
  { label: 'Class 7th', value: 'Class 7th' },
  { label: 'Class 8th', value: 'Class 8th' },
  { label: 'Class 9th', value: 'Class 9th' },
  { label: 'Class 10th', value: 'Class 10th' },
  { label: 'Class 11th', value: 'Class 11th' },
  { label: 'Class 12th', value: 'Class 12th' },
];

export const DIFFICULTY_OPTIONS = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export const DURATION_OPTIONS = [
  { label: 'All Durations', value: 'All' },
  { label: 'Quick (< 25 min)', value: 'quick' },
  { label: 'Standard (25-45 min)', value: 'standard' },
  { label: 'Extended (45+ min)', value: 'extended' },
];

export const SAFETY_OPTIONS = [
  { label: 'All Environments', value: 'All' },
  { label: 'Safe for Home', value: 'Safe for Home' },
  { label: 'Adult Supervision', value: 'Adult Supervision' },
  { label: 'Lab Required', value: 'Lab Environment Required' },
];

export const SORT_OPTIONS: { label: string; value: ScienceSortOption }[] = [
  { label: 'Most Popular', value: 'popularity' },
  { label: 'Title: A → Z', value: 'az' },
  { label: 'Title: Z → A', value: 'za' },
  { label: 'Duration: Shortest', value: 'duration_asc' },
  { label: 'Duration: Longest', value: 'duration_desc' },
  { label: 'Difficulty: Beginner First', value: 'diff_asc' },
];

export function useScienceFilter(allExperiments: ScienceExperiment[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<'all' | 'physics' | 'chemistry' | 'biology'>('all');
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedDuration, setSelectedDuration] = useState('All');
  const [selectedSafety, setSelectedSafety] = useState('All');
  const [selectedSort, setSelectedSort] = useState<ScienceSortOption>('popularity');

  const activeFilterCount =
    (selectedSubject !== 'all' ? 1 : 0) +
    (selectedClass !== 'All' ? 1 : 0) +
    (selectedDifficulty !== 'All' ? 1 : 0) +
    (selectedDuration !== 'All' ? 1 : 0) +
    (selectedSafety !== 'All' ? 1 : 0);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedSubject('all');
    setSelectedClass('All');
    setSelectedDifficulty('All');
    setSelectedDuration('All');
    setSelectedSafety('All');
    setSelectedSort('popularity');
  };

  const filteredExperiments = useMemo(() => {
    let list = [...allExperiments];

    // Subject Filter
    if (selectedSubject !== 'all') {
      list = list.filter((exp) => exp.subject === selectedSubject);
    }

    // Search Query
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

    // Class Filter
    if (selectedClass !== 'All') {
      list = list.filter((exp) => exp.gradeLevel.toLowerCase().includes(selectedClass.toLowerCase()));
    }

    // Difficulty
    if (selectedDifficulty !== 'All') {
      list = list.filter((exp) => exp.difficulty.toLowerCase() === selectedDifficulty.toLowerCase());
    }

    // Duration
    if (selectedDuration !== 'All') {
      list = list.filter((exp) => {
        const mins = parseInt(exp.duration) || 30;
        if (selectedDuration === 'quick') return mins < 25;
        if (selectedDuration === 'standard') return mins >= 25 && mins <= 45;
        if (selectedDuration === 'extended') return mins > 45;
        return true;
      });
    }

    // Safety
    if (selectedSafety !== 'All') {
      list = list.filter((exp) => exp.safetyLevel === selectedSafety);
    }

    // Sorting
    if (selectedSort === 'az') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (selectedSort === 'za') {
      list.sort((a, b) => b.title.localeCompare(a.title));
    } else if (selectedSort === 'duration_asc') {
      list.sort((a, b) => (parseInt(a.duration) || 30) - (parseInt(b.duration) || 30));
    } else if (selectedSort === 'duration_desc') {
      list.sort((a, b) => (parseInt(b.duration) || 30) - (parseInt(a.duration) || 30));
    } else if (selectedSort === 'diff_asc') {
      const order: Record<string, number> = { Beginner: 1, Intermediate: 2, Advanced: 3 };
      list.sort((a, b) => (order[a.difficulty] || 0) - (order[b.difficulty] || 0));
    }

    return list;
  }, [
    allExperiments,
    selectedSubject,
    searchQuery,
    selectedClass,
    selectedDifficulty,
    selectedDuration,
    selectedSafety,
    selectedSort,
  ]);

  return {
    searchQuery,
    setSearchQuery,
    selectedSubject,
    setSelectedSubject,
    selectedClass,
    setSelectedClass,
    selectedDifficulty,
    setSelectedDifficulty,
    selectedDuration,
    setSelectedDuration,
    selectedSafety,
    setSelectedSafety,
    selectedSort,
    setSelectedSort,
    activeFilterCount,
    resetFilters,
    filteredExperiments,
  };
}
