'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DEFAULT_NAV_SETTINGS, NavItemConfig } from '@/app/api/admin/navigation-settings/route';
import { smartCache } from '@/lib/cache/smartCache';

const CACHE_KEY = 'navigation_settings';

interface NavigationContextType {
  navSettings: NavItemConfig[];
  isLoading: boolean;
  toggleNavSection: (sectionId: string, enabled: boolean) => void;
  toggleSubItem: (sectionId: string, subItemId: string, enabled: boolean) => void;
  resetToDefault: () => void;
  isNavEnabled: (id: string) => boolean;
  isRouteAllowed: (routePath: string) => boolean;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [navSettings, setNavSettings] = useState<NavItemConfig[]>(() => {
    return smartCache.getInstant<NavItemConfig[]>(CACHE_KEY, DEFAULT_NAV_SETTINGS);
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Sync from server in background with SWR
  useEffect(() => {
    const unsub = smartCache.subscribe<NavItemConfig[]>(CACHE_KEY, (fresh) => {
      if (fresh && Array.isArray(fresh)) {
        setNavSettings(fresh);
      }
    });

    smartCache.fetchSWR<NavItemConfig[]>({
      key: CACHE_KEY,
      ttlMs: 1000 * 60 * 10,
      fetcher: async () => {
        const res = await fetch('/api/admin/navigation-settings');
        if (res.ok) {
          const data = await res.json();
          if (data.settings && Array.isArray(data.settings)) {
            return data.settings;
          }
        }
        return DEFAULT_NAV_SETTINGS;
      },
      onUpdate: (fresh) => {
        setNavSettings(fresh);
      },
    }).catch(() => {});

    return () => unsub();
  }, []);

  const saveSettings = useCallback((newSettings: NavItemConfig[]) => {
    setNavSettings(newSettings);
    smartCache.mutate(CACHE_KEY, newSettings);
    try {
      fetch('/api/admin/navigation-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: newSettings }),
      }).catch(() => {});
    } catch {}
  }, []);

  const toggleNavSection = (sectionId: string, enabled: boolean) => {
    const updated = navSettings.map((section) => {
      if (section.id === sectionId) {
        return {
          ...section,
          enabled,
          children: section.children?.map((c) => ({ ...c, enabled: enabled ? c.enabled : false })),
        };
      }
      return section;
    });
    saveSettings(updated);
  };

  const toggleSubItem = (sectionId: string, subItemId: string, enabled: boolean) => {
    const updated = navSettings.map((section) => {
      if (section.id === sectionId) {
        return {
          ...section,
          children: section.children?.map((c) => (c.id === subItemId ? { ...c, enabled } : c)),
        };
      }
      return section;
    });
    saveSettings(updated);
  };

  const resetToDefault = () => {
    saveSettings(DEFAULT_NAV_SETTINGS);
  };

  const isNavEnabled = (id: string): boolean => {
    const section = navSettings.find((s) => s.id === id);
    if (section) return section.enabled;
    for (const s of navSettings) {
      const child = s.children?.find((c) => c.id === id);
      if (child) return s.enabled && child.enabled;
    }
    return true;
  };

  const isRouteAllowed = (routePath: string): boolean => {
    if (!routePath || routePath === '/' || routePath === '/login' || routePath.startsWith('/admin')) {
      return true;
    }
    const cleanPath = routePath.split('?')[0].toLowerCase();
    
    // Check all sections & sub-items
    for (const section of navSettings) {
      if (section.route.toLowerCase() === cleanPath) {
        if (!section.enabled) return false;
      }
      if (section.children) {
        for (const child of section.children) {
          if (child.route.toLowerCase() === cleanPath) {
            if (!section.enabled || !child.enabled) return false;
          }
        }
      }
    }
    return true;
  };

  return (
    <NavigationContext.Provider
      value={{
        navSettings,
        isLoading,
        toggleNavSection,
        toggleSubItem,
        resetToDefault,
        isNavEnabled,
        isRouteAllowed,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavVisibility = () => {
  const ctx = useContext(NavigationContext);
  if (!ctx) {
    return {
      navSettings: DEFAULT_NAV_SETTINGS,
      isLoading: false,
      toggleNavSection: () => {},
      toggleSubItem: () => {},
      resetToDefault: () => {},
      isNavEnabled: () => true,
      isRouteAllowed: () => true,
    };
  }
  return ctx;
};
