'use client';

import { useState, useCallback, useEffect } from 'react';
import { HomepageSectionConfig, HomepageSectionId, HomepageVersion } from '../types';
import { INITIAL_HOMEPAGE_SECTIONS } from '../data/homepageSeed';
import { useSmartSWR } from '@/lib/cache/useSmartSWR';

const CACHE_KEY = 'homepage_sections';

interface FetchResponse {
  data: HomepageSectionConfig[];
  versions: HomepageVersion[];
}

export function useHomepageCms() {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [versions, setVersions] = useState<HomepageVersion[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isRollingBack, setIsRollingBack] = useState<boolean>(false);

  const { data: sections, isValidating, mutate } = useSmartSWR<HomepageSectionConfig[]>({
    key: CACHE_KEY,
    initialData: INITIAL_HOMEPAGE_SECTIONS,
    ttlMs: 1000 * 60 * 10, // 10 minutes cache
    fetcher: async () => {
      const res = await fetch('/api/homepage-sections');
      if (!res.ok) throw new Error('Failed to fetch sections');
      const json = await res.json();
      if (json && json.success && Array.isArray(json.data) && json.data.length > 0) {
        if (Array.isArray(json.versions)) {
          setVersions(json.versions);
        }
        return json.data;
      }
      return INITIAL_HOMEPAGE_SECTIONS;
    },
  });

  // Load versions on mount
  useEffect(() => {
    fetch('/api/homepage-sections')
      .then((res) => res.json())
      .then((json) => {
        if (json?.success && Array.isArray(json.versions)) {
          setVersions(json.versions);
        }
      })
      .catch(() => {});
  }, []);

  const isSectionEnabled = useCallback(
    (id: HomepageSectionId): boolean => {
      const sec = sections.find((s) => s.id === id);
      return sec ? sec.enabled : true;
    },
    [sections]
  );

  const getSection = useCallback(
    (id: HomepageSectionId): HomepageSectionConfig | undefined => {
      return sections.find((s) => s.id === id);
    },
    [sections]
  );

  // Instant optimistic update for live on-page preview
  const updateSectionDraft = useCallback(
    (id: HomepageSectionId, changes: Partial<HomepageSectionConfig>) => {
      const updated = sections.map((s) =>
        s.id === id ? { ...s, ...changes, updated_at: new Date().toISOString() } : s
      );
      mutate(updated);
      setHasUnsavedChanges(true);
    },
    [sections, mutate]
  );

  // Toggle visibility (can be saved immediately or in draft)
  const toggleSection = useCallback(
    async (id: HomepageSectionId, autoSave = false) => {
      const target = sections.find((s) => s.id === id);
      const newEnabled = target ? !target.enabled : true;
      const updated = sections.map((s) =>
        s.id === id ? { ...s, enabled: newEnabled, updated_at: new Date().toISOString() } : s
      );

      mutate(updated);

      if (autoSave) {
        try {
          await fetch('/api/homepage-sections', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, enabled: newEnabled }),
          });
        } catch (e) {
          console.error('Failed to sync section toggle to backend:', e);
        }
      } else {
        setHasUnsavedChanges(true);
      }
    },
    [sections, mutate]
  );

  // Standard direct update (used by existing Admin module)
  const updateSection = useCallback(
    async (id: HomepageSectionId, changes: Partial<HomepageSectionConfig>) => {
      const updated = sections.map((s) =>
        s.id === id ? { ...s, ...changes, updated_at: new Date().toISOString() } : s
      );

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
    },
    [sections, mutate]
  );

  // Save current sections to backend & create a version snapshot (Max 10 stored)
  const saveChangesWithVersion = useCallback(
    async (summary = 'Updated homepage content', author = 'Super Admin') => {
      setIsSaving(true);
      try {
        const res = await fetch('/api/homepage-sections', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'save_version',
            sections,
            summary,
            author,
          }),
        });
        const json = await res.json();
        if (json.success) {
          if (Array.isArray(json.versions)) {
            setVersions(json.versions);
          }
          if (Array.isArray(json.data)) {
            mutate(json.data);
          }
          setHasUnsavedChanges(false);
          return { success: true, message: json.message };
        }
        return { success: false, error: json.error || 'Failed to save changes' };
      } catch (err: any) {
        return { success: false, error: err.message || 'Network error while saving' };
      } finally {
        setIsSaving(false);
      }
    },
    [sections, mutate]
  );

  // Rollback to any of the last 10 versions
  const rollbackToVersion = useCallback(
    async (versionId: string, author = 'Super Admin') => {
      setIsRollingBack(true);
      try {
        const res = await fetch('/api/homepage-sections', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'rollback',
            versionId,
            author,
          }),
        });
        const json = await res.json();
        if (json.success) {
          if (Array.isArray(json.data)) {
            mutate(json.data);
          }
          if (Array.isArray(json.versions)) {
            setVersions(json.versions);
          }
          setHasUnsavedChanges(false);
          return { success: true, message: json.message };
        }
        return { success: false, error: json.error || 'Failed to rollback' };
      } catch (err: any) {
        return { success: false, error: err.message || 'Network error during rollback' };
      } finally {
        setIsRollingBack(false);
      }
    },
    [mutate]
  );

  // Discard local unsaved changes & reload from server
  const discardChanges = useCallback(async () => {
    try {
      const res = await fetch('/api/homepage-sections');
      const json = await res.json();
      if (json?.success && Array.isArray(json.data)) {
        mutate(json.data);
        if (Array.isArray(json.versions)) {
          setVersions(json.versions);
        }
      }
      setHasUnsavedChanges(false);
    } catch (e) {
      console.error('Failed to discard changes:', e);
    }
  }, [mutate]);

  return {
    sections,
    versions,
    loading: isValidating,
    isSaving,
    isRollingBack,
    hasUnsavedChanges,
    isSectionEnabled,
    getSection,
    toggleSection,
    updateSection,
    updateSectionDraft,
    saveChangesWithVersion,
    rollbackToVersion,
    discardChanges,
  };
}
