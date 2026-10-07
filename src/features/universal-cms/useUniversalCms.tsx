'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { UniversalPageData, CmsVersion } from './types';

interface UniversalCmsContextType {
  pageKey: string;
  data: UniversalPageData | null;
  loading: boolean;
  isSaving: boolean;
  isRollingBack: boolean;
  hasUnsavedChanges: boolean;
  versions: CmsVersion[];
  isEditMode: boolean;
  isAdminLoggedIn: boolean;
  toggleEditMode: () => void;
  updateField: (field: keyof UniversalPageData | string, value: any) => void;
  updateSection: (sectionKey: string, sectionData: any) => void;
  saveChanges: (summary?: string) => Promise<{ success: boolean; message?: string }>;
  rollbackToVersion: (versionId: string) => Promise<{ success: boolean; message?: string }>;
  discardChanges: () => void;
  openEditorForField: (fieldKey: string, label: string, currentValue: any) => void;
}

const UniversalCmsContext = createContext<UniversalCmsContextType | undefined>(undefined);

function normalizePathToPageKey(pathname: string): string {
  if (!pathname || pathname === '/') return 'page:home';
  const clean = pathname.replace(/^\/+|\/+$/g, '');
  return clean.replace(/\//g, ':');
}

export const UniversalCmsProvider: React.FC<{ children: React.ReactNode; initialPageKey?: string }> = ({
  children,
  initialPageKey,
}) => {
  const pathname = usePathname();
  const pageKey = initialPageKey || normalizePathToPageKey(pathname);

  const [data, setData] = useState<UniversalPageData | null>(null);
  const [originalData, setOriginalData] = useState<UniversalPageData | null>(null);
  const [versions, setVersions] = useState<CmsVersion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isRollingBack, setIsRollingBack] = useState<boolean>(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);

  // Check admin auth state strictly from localStorage
  useEffect(() => {
    try {
      const auth = localStorage.getItem('cseel_admin_auth');
      const isAuthed = auth === 'true';
      setIsAdminLoggedIn(isAuthed);
      if (!isAuthed) {
        setIsEditMode(false);
      } else {
        if (typeof window !== 'undefined') {
          const p = new URLSearchParams(window.location.search);
          if (p.get('edit') === 'true' || p.get('editMode') === 'true') {
            setIsEditMode(true);
          }
        }
      }
    } catch {
      setIsAdminLoggedIn(false);
      setIsEditMode(false);
    }
  }, []);

  // Fetch page content & versions from API
  const fetchPageData = useCallback(async (key: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/cms?page=${encodeURIComponent(key)}`);
      const json = await res.json();
      if (json?.success && json.data) {
        setData(json.data);
        setOriginalData(json.data);
        setVersions(json.versions || []);
      }
    } catch (err) {
      console.error('Failed to load page CMS data:', err);
    } finally {
      setLoading(false);
      setHasUnsavedChanges(false);
    }
  }, []);

  useEffect(() => {
    fetchPageData(pageKey);
  }, [pageKey, fetchPageData]);

  // Update specific field in memory (optimistic live preview)
  const updateField = useCallback((field: string, value: any) => {
    setData((prev) => {
      if (!prev) return { pageKey, [field]: value };
      return { ...prev, [field]: value };
    });
    setHasUnsavedChanges(true);
  }, [pageKey]);

  // Update a sub-section
  const updateSection = useCallback((sectionKey: string, sectionData: any) => {
    setData((prev) => {
      if (!prev) return { pageKey, sections: { [sectionKey]: sectionData } };
      return {
        ...prev,
        sections: {
          ...(prev.sections || {}),
          [sectionKey]: sectionData,
        },
      };
    });
    setHasUnsavedChanges(true);
  }, [pageKey]);

  // Save changes to backend API & create version snapshot (Max 10)
  const saveChanges = useCallback(
    async (summary = 'Updated content from on-page editor') => {
      if (!data) return { success: false, error: 'No data to save' };
      setIsSaving(true);
      try {
        const res = await fetch('/api/cms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'save_version',
            pageKey,
            data,
            summary,
            author: 'Super Admin',
          }),
        });
        const json = await res.json();
        if (json?.success) {
          setData(json.data);
          setOriginalData(json.data);
          setVersions(json.versions || []);
          setHasUnsavedChanges(false);
          return { success: true, message: json.message };
        }
        return { success: false, message: json?.error || 'Failed to save' };
      } catch (err: any) {
        return { success: false, message: err.message || 'Network error' };
      } finally {
        setIsSaving(false);
      }
    },
    [data, pageKey]
  );

  // Rollback to any of the 10 versions
  const rollbackToVersion = useCallback(
    async (versionId: string) => {
      setIsRollingBack(true);
      try {
        const res = await fetch('/api/cms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'rollback',
            pageKey,
            versionId,
            author: 'Super Admin',
          }),
        });
        const json = await res.json();
        if (json?.success) {
          setData(json.data);
          setOriginalData(json.data);
          setVersions(json.versions || []);
          setHasUnsavedChanges(false);
          return { success: true, message: json.message };
        }
        return { success: false, message: json?.error || 'Rollback failed' };
      } catch (err: any) {
        return { success: false, message: err.message || 'Network error' };
      } finally {
        setIsRollingBack(false);
      }
    },
    [pageKey]
  );

  // Discard draft changes
  const discardChanges = useCallback(() => {
    if (originalData) {
      setData(originalData);
    }
    setHasUnsavedChanges(false);
  }, [originalData]);

  const toggleEditMode = useCallback(() => {
    setIsEditMode((prev) => {
      const authed = typeof window !== 'undefined' && localStorage.getItem('cseel_admin_auth') === 'true';
      if (!authed) return false;
      return !prev;
    });
  }, []);

  const openEditorForField = useCallback((_fieldKey: string, _label: string, _currentValue: any) => {
    // Popover / inline drawer trigger
  }, []);

  return (
    <UniversalCmsContext.Provider
      value={{
        pageKey,
        data,
        loading,
        isSaving,
        isRollingBack,
        hasUnsavedChanges,
        versions,
        isEditMode,
        isAdminLoggedIn,
        toggleEditMode,
        updateField,
        updateSection,
        saveChanges,
        rollbackToVersion,
        discardChanges,
        openEditorForField,
      }}
    >
      {children}
    </UniversalCmsContext.Provider>
  );
};

export function useUniversalCms(): UniversalCmsContextType {
  const context = useContext(UniversalCmsContext);
  if (!context) {
    return {
      pageKey: 'page:fallback',
      data: null,
      loading: false,
      isSaving: false,
      isRollingBack: false,
      hasUnsavedChanges: false,
      versions: [],
      isEditMode: false,
      isAdminLoggedIn: false,
      toggleEditMode: () => {},
      updateField: () => {},
      updateSection: () => {},
      saveChanges: async () => ({ success: false }),
      rollbackToVersion: async () => ({ success: false }),
      discardChanges: () => {},
      openEditorForField: () => {},
    };
  }
  return context;
}
