'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

export interface RequisitionItem {
  id: string;
  slug: string;
  name: string;
  sku: string;
  category: string;
  image_url: string;
  quantity: number;
}

interface MaterialsRequisitionContextType {
  items: RequisitionItem[];
  totalUnique: number;
  totalQuantity: number;
  getItemQty: (id: string) => number;
  isSelected: (id: string) => boolean;
  selectItem: (item: Omit<RequisitionItem, 'quantity'>, qty?: number) => void;
  incrementQty: (id: string, fallback?: Omit<RequisitionItem, 'quantity'>) => void;
  decrementQty: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
  clearAll: () => void;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
}

const STORAGE_KEY = 'cseel_materials_requisition';

const MaterialsRequisitionContext = createContext<MaterialsRequisitionContextType | undefined>(undefined);

export function MaterialsRequisitionProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<RequisitionItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed.filter(i => i && i.id && typeof i.quantity === 'number' && i.quantity > 0));
        }
      }
    } catch (err) {
      console.warn('Failed to parse saved materials requisition:', err);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.warn('Failed to persist materials requisition:', err);
    }
  }, [items, isHydrated]);

  const getItemQty = useCallback((id: string) => {
    const found = items.find(i => i.id === id);
    return found ? found.quantity : 0;
  }, [items]);

  const isSelected = useCallback((id: string) => {
    return items.some(i => i.id === id && i.quantity > 0);
  }, [items]);

  const selectItem = useCallback((item: Omit<RequisitionItem, 'quantity'>, qty: number = 1) => {
    setItems(prev => {
      const idx = prev.findIndex(i => i.id === item.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], ...item, quantity: Math.max(1, qty) };
        return copy;
      }
      return [...prev, { ...item, quantity: Math.max(1, qty) }];
    });
  }, []);

  const incrementQty = useCallback((id: string, fallback?: Omit<RequisitionItem, 'quantity'>) => {
    setItems(prev => {
      const idx = prev.findIndex(i => i.id === id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + 1 };
        return copy;
      }
      if (fallback) {
        return [...prev, { ...fallback, quantity: 1 }];
      }
      return prev;
    });
  }, []);

  const decrementQty = useCallback((id: string) => {
    setItems(prev => {
      const idx = prev.findIndex(i => i.id === id);
      if (idx < 0) return prev;
      const current = prev[idx];
      if (current.quantity <= 1) {
        return prev.filter(i => i.id !== id);
      }
      const copy = [...prev];
      copy[idx] = { ...current, quantity: current.quantity - 1 };
      return copy;
    });
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setItems(prev => {
      if (qty <= 0) {
        return prev.filter(i => i.id !== id);
      }
      const idx = prev.findIndex(i => i.id === id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], quantity: qty };
        return copy;
      }
      return prev;
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setItems([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  const totalUnique = items.length;
  const totalQuantity = items.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <MaterialsRequisitionContext.Provider
      value={{
        items,
        totalUnique,
        totalQuantity,
        getItemQty,
        isSelected,
        selectItem,
        incrementQty,
        decrementQty,
        setQty,
        removeItem,
        clearAll,
        drawerOpen,
        setDrawerOpen,
      }}
    >
      {children}
    </MaterialsRequisitionContext.Provider>
  );
}

export function useMaterialsRequisition() {
  const ctx = useContext(MaterialsRequisitionContext);
  if (!ctx) {
    throw new Error('useMaterialsRequisition must be used within MaterialsRequisitionProvider');
  }
  return ctx;
}
