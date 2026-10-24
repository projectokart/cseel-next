'use client';

import { useState, useMemo } from 'react';
import { JobOpening, JobEmploymentType } from '../types';

export const JOB_DEPARTMENTS = [
  'All',
  'Experiential Science Faculty',
  'Engineering & Tinkering',
  'Arts & STEAM Studio',
];

export const JOB_TYPES: string[] = [
  'All',
  'Full-Time',
  'Fellowship',
  'Contract',
];

export function useCareersFilter(allJobs: JobOpening[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  const activeFilterCount =
    (selectedDepartment !== 'All' ? 1 : 0) + (selectedType !== 'All' ? 1 : 0);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedDepartment('All');
    setSelectedType('All');
  };

  const filteredJobs = useMemo(() => {
    let list = [...allJobs];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.department.toLowerCase().includes(q) ||
          j.location.toLowerCase().includes(q) ||
          j.skills.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (selectedDepartment !== 'All') {
      list = list.filter((j) => j.department === selectedDepartment);
    }

    if (selectedType !== 'All') {
      list = list.filter((j) => j.type.toLowerCase() === selectedType.toLowerCase());
    }

    return list;
  }, [allJobs, searchQuery, selectedDepartment, selectedType]);

  return {
    searchQuery,
    setSearchQuery,
    selectedDepartment,
    setSelectedDepartment,
    selectedType,
    setSelectedType,
    activeFilterCount,
    resetFilters,
    filteredJobs,
  };
}
