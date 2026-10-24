'use client';

/**
 * CSEEL Unified GTM Event Dispatcher
 * - All tracking (Google Analytics 4, Microsoft Clarity, Ads, etc.) is managed 100% via Google Tag Manager (GTM-59C7X2VD).
 * - This component serves as the client-side event bus for custom interactive events.
 */
export default function AnalyticsScripts() {
  // All script tags are now delegated strictly to Google Tag Manager in layout.tsx
  return null;
}

/**
 * Utility helper to fire custom conversion & tracking events from any component
 * Pushes clean event objects directly into GTM's dataLayer.
 */
export function trackCseelEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window !== 'undefined') {
    // 1. Send to GTM dataLayer
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      event: eventName,
      ...(params || {}),
    });

    // 2. Fallback to gtag if GTM loaded Google Tag
    if ((window as any).gtag) {
      (window as any).gtag('event', eventName, params || {});
    }
  }
}
