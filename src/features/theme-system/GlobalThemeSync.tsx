'use client';

import { useEffect } from 'react';
import { GlobalThemeConfig } from './types';
import { DEFAULT_CSEEL_THEME } from './defaultTheme';

export const THEME_STORAGE_KEY = 'cseel_global_theme_config';
export const THEME_EVENT_NAME = 'cseel:theme-change';

export function applyThemeToDom(theme: GlobalThemeConfig) {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  
  // Set primary colors
  root.style.setProperty('--brand-primary', theme.primaryColor || '#006FCC');
  root.style.setProperty('--brand-primary-hover', theme.primaryHoverColor || '#005499');
  root.style.setProperty('--primary', theme.primaryColor || '#006FCC');
  
  // Set secondary colors
  root.style.setProperty('--brand-secondary-bg', theme.secondaryBgColor || '#EDF5FA');
  root.style.setProperty('--brand-secondary-text', theme.secondaryTextColor || '#006FCC');
  root.style.setProperty('--brand-secondary-border', theme.secondaryBorderColor || '#D6EDFF');

  // Set button radius & shadow
  const radius = theme.buttonVariant === 'google' 
    ? '9999px' 
    : theme.buttonVariant === 'cseel' 
      ? '12px' 
      : (theme.buttonRadius || '12px');

  root.style.setProperty('--btn-radius', radius);
  root.setAttribute('data-button-style', theme.buttonVariant || 'cseel');

  if (theme.buttonShadow === 'material') {
    root.style.setProperty('--btn-shadow', '0 1px 3px rgba(60,64,67,0.3), 0 4px 8px 3px rgba(60,64,67,0.15)');
  } else if (theme.buttonShadow === 'none') {
    root.style.setProperty('--btn-shadow', 'none');
  } else {
    root.style.setProperty('--btn-shadow', '0 4px 14px rgba(0, 111, 204, 0.35)');
  }

  // Set card radius
  root.style.setProperty('--card-radius', theme.cardRadius || '16px');

  // Custom CSS injection
  let styleEl = document.getElementById('cseel-custom-theme-style') as HTMLStyleElement | null;
  if (theme.customCssOverrides && theme.customCssOverrides.trim().length > 0) {
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'cseel-custom-theme-style';
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = theme.customCssOverrides;
  } else if (styleEl) {
    styleEl.textContent = '';
  }
}

export default function GlobalThemeSync() {
  useEffect(() => {
    // 1. Check local storage first for instant load
    let initialTheme = DEFAULT_CSEEL_THEME;
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          initialTheme = { ...DEFAULT_CSEEL_THEME, ...parsed };
        }
      }
    } catch {}

    applyThemeToDom(initialTheme);

    // 2. Fetch latest config from server API in background
    fetch('/api/theme-settings')
      .then((res) => res.json())
      .then((json) => {
        if (json?.success && json?.data) {
          applyThemeToDom(json.data);
          try {
            localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(json.data));
          } catch {}
        }
      })
      .catch(() => {});

    // 3. Listen for theme updates across tabs / admin module
    const handleThemeChange = (e: any) => {
      if (e?.detail) {
        applyThemeToDom(e.detail);
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === THEME_STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          applyThemeToDom(parsed);
        } catch {}
      }
    };

    window.addEventListener(THEME_EVENT_NAME, handleThemeChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener(THEME_EVENT_NAME, handleThemeChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return null;
}
