'use client';

import { HomepageSectionConfig, HomepageSectionId } from '../types';
import { INITIAL_HOMEPAGE_SECTIONS } from '../data/homepageSeed';
import { useSmartSWR } from '@/lib/cache/useSmartSWR';

const CACHE_KEY = 'homepage_sections';

export function useHomepageCms() {
  const { data: sections, isValidating, mutate } = useSmartSWR<HomepageSectionConfig[]>({
    key: CACHE_KEY,
    initialData: INITIAL_HOMEPAGE_SECTIONS,
    ttlMs: 1000 * 60 * 10, // 10 minutes cache
    fetcher: async () => {
      const res = await fetch('/api/homepage-sections');
      if (!res.ok) throw new Error('Failed to fetch sections');
      const json = await res.json();
      if (json && json.success && Array.isArray(json.data) && json.data.length > 0) {
        return json.data;
      }
      return INITIAL_HOMEPAGE_SECTIONS;
    },
  });

  const isSectionEnabled = (id: HomepageSectionId): boolean => {
    const sec = sections.find((s) => s.id === id);
    return sec ? sec.enabled : true;
  };

  const getSection = (id: HomepageSectionId): HomepageSectionConfig | undefined => {
    return sections.find((s) => s.id === id);
  };

  const toggleSection = async (id: HomepageSectionId) => {
    const target = sections.find((s) => s.id === id);
    const newEnabled = target ? !target.enabled : true;
    const updated = sections.map((s) =>
      s.id === id ? { ...s, enabled: newEnabled, updated_at: new Date().toISOString() } : s
    );
    
    // Instant optimistic mutate in cache
    mutate(updated);

    try {
      await fetch('/api/homepage-sections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, enabled: newEnabled }),
      });
    } catch (e) {
      console.error('Failed to sync section toggle to backend:', e);
    }
  };

  const updateSection = async (id: HomepageSectionId, changes: Partial<HomepageSectionConfig>) => {
    const updated = sections.map((s) =>
      s.id === id ? { ...s, ...changes, updated_at: new Date().toISOString() } : s
    );

    // Instant optimistic mutate in cache
    mutate(updated);

    try {
      await fetch('/api/homepage-sections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...changes }),
      });
    } catch (e) {
      console.error('Failed to sync section update to backend:', e);
    }
  };

  return {
    sections,
    loading: isValidating,
    isSectionEnabled,
    getSection,
    toggleSection,
    updateSection,
  };
}
