'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  MarketingPromotion,
  SlotSwiperSettings,
  AdSlotId,
} from './types';
import {
  INITIAL_PROMOTIONS,
  INITIAL_SLOT_SETTINGS,
} from './data/marketingSeed';

const PROMOS_STORAGE_KEY = 'cseel_marketing_promotions_v6';
const SLOTS_STORAGE_KEY = 'cseel_marketing_slot_settings_v6';
const SYNC_EVENT_NAME = 'cseel-marketing-sync';

function readStoredPromotions(): MarketingPromotion[] {
  if (typeof window === 'undefined') return INITIAL_PROMOTIONS;
  try {
    const raw = localStorage.getItem(PROMOS_STORAGE_KEY);
    if (!raw) return INITIAL_PROMOTIONS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch {}
  return INITIAL_PROMOTIONS;
}

function readStoredSlotSettings(): Record<string, SlotSwiperSettings> {
  if (typeof window === 'undefined') return INITIAL_SLOT_SETTINGS;
  try {
    const raw = localStorage.getItem(SLOTS_STORAGE_KEY);
    if (!raw) return INITIAL_SLOT_SETTINGS;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      return { ...INITIAL_SLOT_SETTINGS, ...parsed };
    }
  } catch {}
  return INITIAL_SLOT_SETTINGS;
}

export function useMarketingCampaigns() {
  const [promotions, setPromotionsState] = useState<MarketingPromotion[]>(INITIAL_PROMOTIONS);
  const [slotSettings, setSlotSettingsState] =
    useState<Record<string, SlotSwiperSettings>>(INITIAL_SLOT_SETTINGS);
  const [hydrated, setHydrated] = useState(false);

  const syncFromStorage = useCallback(() => {
    setPromotionsState(readStoredPromotions());
    setSlotSettingsState(readStoredSlotSettings());
  }, []);

  useEffect(() => {
    syncFromStorage();
    setHydrated(true);

    const handleCustomSync = () => syncFromStorage();
    const handleStorage = (e: StorageEvent) => {
      if (e.key === PROMOS_STORAGE_KEY || e.key === SLOTS_STORAGE_KEY) {
        syncFromStorage();
      }
    };

    window.addEventListener(SYNC_EVENT_NAME, handleCustomSync);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener(SYNC_EVENT_NAME, handleCustomSync);
      window.removeEventListener('storage', handleStorage);
    };
  }, [syncFromStorage]);

  const savePromotions = useCallback((next: MarketingPromotion[]) => {
    setPromotionsState(next);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(PROMOS_STORAGE_KEY, JSON.stringify(next));
        window.dispatchEvent(new CustomEvent(SYNC_EVENT_NAME));
        fetch('/api/ad-slots', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ promotions: next }),
        }).catch(() => {});
      } catch {}
    }
  }, []);

  const updateSlotSetting = useCallback(
    (slotId: AdSlotId, patch: Partial<SlotSwiperSettings>) => {
      const current = readStoredSlotSettings();
      const existing = current[slotId] || INITIAL_SLOT_SETTINGS[slotId];
      const next = {
        ...current,
        [slotId]: {
          ...existing,
          ...patch,
          slot_id: slotId,
        },
      };
      setSlotSettingsState(next);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(SLOTS_STORAGE_KEY, JSON.stringify(next));
          window.dispatchEvent(new CustomEvent(SYNC_EVENT_NAME));
          fetch('/api/ad-slots', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ slotSettings: next }),
          }).catch(() => {});
        } catch {}
      }
    },
    []
  );

  const swapPromotionOrder = useCallback(
    (id: string, direction: 'up' | 'down') => {
      const current = [...readStoredPromotions()].sort(
        (a, b) => (a.sort_order || 0) - (b.sort_order || 0)
      );
      const idx = current.findIndex((p) => p.id === id);
      if (idx === -1) return;
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= current.length) return;

      const temp = current[idx];
      current[idx] = current[targetIdx];
      current[targetIdx] = temp;

      const normalized = current.map((item, i) => ({
        ...item,
        sort_order: i + 1,
        updated_at: new Date().toISOString(),
      }));
      savePromotions(normalized);
    },
    [savePromotions]
  );

  return {
    promotions,
    slotSettings,
    hydrated,
    savePromotions,
    updateSlotSetting,
    swapPromotionOrder,
  };
}
