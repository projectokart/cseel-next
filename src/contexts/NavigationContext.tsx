'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DEFAULT_NAV_3STAGE_DATA, NavStage1Category, NavStage2Column, NavStage3Item } from '@/lib/navigationData';
import { smartCache } from '@/lib/cache/smartCache';

const CACHE_KEY = 'navigation_3stage_settings';

interface NavigationContextType {
  navCategories: NavStage1Category[];
  isLoading: boolean;
  saveAllNav: (data: NavStage1Category[]) => void;
  resetToDefault: () => void;
  
  // Stage 1: Category CRUD
  addCategory: (cat: Partial<NavStage1Category>) => void;
  updateCategory: (id: string, updates: Partial<NavStage1Category>) => void;
  deleteCategory: (id: string) => void;
  toggleCategory: (id: string, enabled: boolean) => void;

  // Stage 2: Column / Section CRUD
  addColumn: (categoryId: string, col: Partial<NavStage2Column>) => void;
  updateColumn: (categoryId: string, columnId: string, updates: Partial<NavStage2Column>) => void;
  deleteColumn: (categoryId: string, columnId: string) => void;

  // Stage 3: Item CRUD
  addItem: (categoryId: string, columnId: string, item: Partial<NavStage3Item>) => void;
  updateItem: (categoryId: string, columnId: string, itemId: string, updates: Partial<NavStage3Item>) => void;
  deleteItem: (categoryId: string, columnId: string, itemId: string) => void;

  // Compatibility helpers
  isRouteAllowed: (routePath: string) => boolean;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [navCategories, setNavCategories] = useState<NavStage1Category[]>(() => {
    return smartCache.getInstant<NavStage1Category[]>(CACHE_KEY, DEFAULT_NAV_3STAGE_DATA);
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Sync from server SWR
  useEffect(() => {
    const unsub = smartCache.subscribe<NavStage1Category[]>(CACHE_KEY, (fresh) => {
      if (fresh && Array.isArray(fresh) && fresh.length > 0) {
        setNavCategories(fresh);
      }
    });

    smartCache.fetchSWR<NavStage1Category[]>({
      key: CACHE_KEY,
      ttlMs: 1000 * 60 * 10,
      fetcher: async () => {
        const res = await fetch('/api/admin/navigation-settings');
        if (res.ok) {
          const data = await res.json();
          if (data.settings && Array.isArray(data.settings) && data.settings.length > 0) {
            return data.settings;
          }
        }
        return DEFAULT_NAV_3STAGE_DATA;
      },
      onUpdate: (fresh) => {
        if (fresh && Array.isArray(fresh) && fresh.length > 0) {
          setNavCategories(fresh);
        }
      },
    }).catch(() => {});

    return () => unsub();
  }, []);

  const saveAllNav = useCallback((newSettings: NavStage1Category[]) => {
    setNavCategories(newSettings);
    smartCache.mutate(CACHE_KEY, newSettings);
    try {
      fetch('/api/admin/navigation-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: newSettings }),
      }).catch((err) => console.error('Error syncing nav settings:', err));
    } catch {}
  }, []);

  // Stage 1: Category CRUD
  const addCategory = (cat: Partial<NavStage1Category>) => {
    const id = cat.id || `cat-${Date.now()}`;
    const newCat: NavStage1Category = {
      id,
      label: cat.label || 'New Category',
      to: cat.to || '/page/new-category',
      enabled: cat.enabled ?? true,
      hasDropdown: cat.hasDropdown ?? true,
      columns: cat.columns || [],
      featuredPanel: cat.featuredPanel,
    };
    saveAllNav([...navCategories, newCat]);
  };

  const updateCategory = (id: string, updates: Partial<NavStage1Category>) => {
    const updated = navCategories.map((c) => (c.id === id ? { ...c, ...updates } : c));
    saveAllNav(updated);
  };

  const deleteCategory = (id: string) => {
    saveAllNav(navCategories.filter((c) => c.id !== id));
  };

  const toggleCategory = (id: string, enabled: boolean) => {
    updateCategory(id, { enabled });
  };

  // Stage 2: Column CRUD
  const addColumn = (categoryId: string, col: Partial<NavStage2Column>) => {
    const columnId = col.id || `col-${Date.now()}`;
    const newCol: NavStage2Column = {
      id: columnId,
      categoryTitle: col.categoryTitle || 'New Section',
      to: col.to || '',
      enabled: col.enabled ?? true,
      items: col.items || [],
    };

    const updated = navCategories.map((cat) => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          columns: [...(cat.columns || []), newCol],
        };
      }
      return cat;
    });
    saveAllNav(updated);
  };

  const updateColumn = (categoryId: string, columnId: string, updates: Partial<NavStage2Column>) => {
    const updated = navCategories.map((cat) => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          columns: cat.columns?.map((col) => (col.id === columnId ? { ...col, ...updates } : col)),
        };
      }
      return cat;
    });
    saveAllNav(updated);
  };

  const deleteColumn = (categoryId: string, columnId: string) => {
    const updated = navCategories.map((cat) => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          columns: cat.columns?.filter((col) => col.id !== columnId),
        };
      }
      return cat;
    });
    saveAllNav(updated);
  };

  // Stage 3: Item CRUD
  const addItem = (categoryId: string, columnId: string, item: Partial<NavStage3Item>) => {
    const itemId = item.id || `item-${Date.now()}`;
    const newItem: NavStage3Item = {
      id: itemId,
      label: item.label || 'New Menu Link',
      to: item.to || '/page/new-item',
      desc: item.desc || '',
      badge: item.badge,
      enabled: item.enabled ?? true,
      subItems: item.subItems || [],
    };

    const updated = navCategories.map((cat) => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          columns: cat.columns?.map((col) => {
            if (col.id === columnId) {
              return {
                ...col,
                items: [...(col.items || []), newItem],
              };
            }
            return col;
          }),
        };
      }
      return cat;
    });
    saveAllNav(updated);
  };

  const updateItem = (categoryId: string, columnId: string, itemId: string, updates: Partial<NavStage3Item>) => {
    const updated = navCategories.map((cat) => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          columns: cat.columns?.map((col) => {
            if (col.id === columnId) {
              return {
                ...col,
                items: col.items?.map((it) => (it.id === itemId ? { ...it, ...updates } : it)),
              };
            }
            return col;
          }),
        };
      }
      return cat;
    });
    saveAllNav(updated);
  };

  const deleteItem = (categoryId: string, columnId: string, itemId: string) => {
    const updated = navCategories.map((cat) => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          columns: cat.columns?.map((col) => {
            if (col.id === columnId) {
              return {
                ...col,
                items: col.items?.filter((it) => it.id !== itemId),
              };
            }
            return col;
          }),
        };
      }
      return cat;
    });
    saveAllNav(updated);
  };

  const resetToDefault = () => {
    saveAllNav(JSON.parse(JSON.stringify(DEFAULT_NAV_3STAGE_DATA)));
  };

  const isRouteAllowed = (routePath: string): boolean => {
    if (!routePath || routePath === '/' || routePath === '/login' || routePath.startsWith('/admin')) {
      return true;
    }
    const cleanPath = routePath.split('?')[0].toLowerCase();
    
    for (const cat of navCategories) {
      if (cat.to && cat.to.toLowerCase() === cleanPath && !cat.enabled) return false;
      if (cat.columns) {
        for (const col of cat.columns) {
          if (col.to && col.to.toLowerCase() === cleanPath && col.enabled === false) return false;
          if (col.items) {
            for (const it of col.items) {
              if (it.to.toLowerCase() === cleanPath && it.enabled === false) return false;
            }
          }
        }
      }
    }
    return true;
  };

  return (
    <NavigationContext.Provider
      value={{
        navCategories,
        isLoading,
        saveAllNav,
        resetToDefault,
        addCategory,
        updateCategory,
        deleteCategory,
        toggleCategory,
        addColumn,
        updateColumn,
        deleteColumn,
        addItem,
        updateItem,
        deleteItem,
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
      navCategories: DEFAULT_NAV_3STAGE_DATA,
      isLoading: false,
      saveAllNav: () => {},
      resetToDefault: () => {},
      addCategory: () => {},
      updateCategory: () => {},
      deleteCategory: () => {},
      toggleCategory: () => {},
      addColumn: () => {},
      updateColumn: () => {},
      deleteColumn: () => {},
      addItem: () => {},
      updateItem: () => {},
      deleteItem: () => {},
      isRouteAllowed: () => true,
    };
  }
  return ctx;
};
