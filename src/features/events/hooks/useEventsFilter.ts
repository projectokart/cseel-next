'use client';

import { useState, useMemo } from 'react';
import { CseelEvent, EventType } from '../types';

export const EVENT_TYPES: EventType[] = [
  'All',
  'Science Hackathon',
  'National Symposium',
  'Webinar',
  'Exhibition',
];

export function useEventsFilter(allEvents: CseelEvent[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'upcoming' | 'completed'>('all');

  const activeFilterCount = (selectedType !== 'All' ? 1 : 0) + (selectedStatus !== 'all' ? 1 : 0);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedType('All');
    setSelectedStatus('all');
  };

  const filteredEvents = useMemo(() => {
    let list = [...allEvents];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.agendaSummary.toLowerCase().includes(q) ||
          e.city.toLowerCase().includes(q) ||
          e.venue.toLowerCase().includes(q)
      );
    }

    if (selectedType !== 'All') {
      list = list.filter((e) => e.type === selectedType);
    }

    if (selectedStatus !== 'all') {
      list = list.filter((e) => e.status === selectedStatus);
    }

    return list;
  }, [allEvents, searchQuery, selectedType, selectedStatus]);

  return {
    searchQuery,
    setSearchQuery,
    selectedType,
    setSelectedType,
    selectedStatus,
    setSelectedStatus,
    activeFilterCount,
    resetFilters,
    filteredEvents,
  };
}
