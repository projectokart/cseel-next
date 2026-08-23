'use client';

import { useState, useEffect } from 'react';
import { HomepageSectionConfig, HomepageSectionId } from '../types';
import { INITIAL_HOMEPAGE_SECTIONS } from '../data/homepageSeed';

const STORAGE_KEY = 'cseel_homepage_sections_cms';

export function useHomepageCms() {
  const [sections, setSections] = useState<HomepageSectionConfig[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {}
    }
    return INITIAL_HOMEPAGE_SECTIONS;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/homepage-sections')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && Array.isArray(data.data) && data.data.length > 0) {
          setSections(data.data);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data.data));
          } catch {}
        }
      })
      .catch(() => {});
  }, []);

  const isSectionEnabled = (id: HomepageSectionId): boolean => {
    const sec = sections.find((s) => s.id === id);
    return sec ? sec.enabled : true;
  };

  const getSection = (id: HomepageSectionId): HomepageSectionConfig | undefined => {
    return sections.find((s) => s.id === id);
  };

  const toggleSection = async (id: HomepageSectionId) => {
    const updated = sections.map((s) => (s.id === id ? { ...s, enabled: !s.enabled, updated_at: new Date().toISOString() } : s));
    setSections(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}

    try {
      await fetch('/api/homepage-sections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, enabled: !sections.find((s) => s.id === id)?.enabled }),
      });
    } catch {}
  };

  const updateSection = async (id: HomepageSectionId, changes: Partial<HomepageSectionConfig>) => {
    const updated = sections.map((s) =>
      s.id === id ? { ...s, ...changes, updated_at: new Date().toISOString() } : s
    );
    setSections(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}

    try {
      await fetch('/api/homepage-sections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...changes }),
      });
    } catch {}
  };

  return {
    sections,
    loading,
    isSectionEnabled,
    getSection,
    toggleSection,
    updateSection,
  };
}
