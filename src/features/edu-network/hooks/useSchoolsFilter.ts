'use client';

import { useState, useMemo } from 'react';
import { PartnerSchool } from '../types';

export const SCHOOL_BOARDS = ['All', 'CBSE', 'ICSE', 'IB', 'Cambridge'];

export const SCHOOL_CITIES = ['All', 'New Delhi', 'Gurugram', 'Rewari', 'Faridabad'];

export function useSchoolsFilter(allSchools: PartnerSchool[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBoard, setSelectedBoard] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All');

  const activeFilterCount =
    (selectedBoard !== 'All' ? 1 : 0) + (selectedCity !== 'All' ? 1 : 0);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedBoard('All');
    setSelectedCity('All');
  };

  const filteredSchools = useMemo(() => {
    let list = [...allSchools];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.code.toLowerCase().includes(q) ||
          s.city.toLowerCase().includes(q) ||
          s.principalName.toLowerCase().includes(q) ||
          s.labsEquipped.some((lab) => lab.toLowerCase().includes(q))
      );
    }

    if (selectedBoard !== 'All') {
      list = list.filter((s) => s.board.toLowerCase() === selectedBoard.toLowerCase());
    }

    if (selectedCity !== 'All') {
      list = list.filter((s) => s.city.toLowerCase() === selectedCity.toLowerCase());
    }

    return list;
  }, [allSchools, searchQuery, selectedBoard, selectedCity]);

  return {
    searchQuery,
    setSearchQuery,
    selectedBoard,
    setSelectedBoard,
    selectedCity,
    setSelectedCity,
    activeFilterCount,
    resetFilters,
    filteredSchools,
  };
}
