'use client';

import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    CSEELAdSDK?: {
      copyCode: (code: string, btnEl?: HTMLElement | null) => void;
      openVideoModal: (videoUrl: string, title?: string) => void;
      fetchSlotPayload: (slotId: string) => Promise<any>;
      injectHtmlIntoSlot: (slotDomId: string, rawHtml: string) => void;
    };
  }
}

/**
 * Registers the global window.CSEELAdSDK so any injected HTML/JS card
 * can call `window.CSEELAdSDK.copyCode('KIDS50', this)` or `window.CSEELAdSDK.openVideoModal(...)`
 */
export function ensureCSEELAdSDK() {
  if (typeof window === 'undefined') return;
  if (window.CSEELAdSDK) return;

  window.CSEELAdSDK = {
    copyCode: (code: string, btnEl?: HTMLElement | null) => {
      if (!code) return;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(code).catch(() => {});
      }
      if (btnEl) {
        const originalHtml = btnEl.getAttribute('data-orig-html') || btnEl.innerHTML;
        if (!btnEl.getAttribute('data-orig-html')) {
          btnEl.setAttribute('data-orig-html', originalHtml);
        }
        btnEl.innerHTML = `✓ COPIED: ${code}`;
        setTimeout(() => {
          btnEl.innerHTML = originalHtml;
        }, 2000);
      }
    },

    openVideoModal: (videoUrl: string, title?: string) => {
      const existing = document.getElementById('cseel-sdk-video-modal');
      if (existing) existing.remove();

      const overlay = document.createElement('div');
      overlay.id = 'cseel-sdk-video-modal';
      overlay.style.cssText =
        'position:fixed;inset:0;z-index:999999;background:rgba(2,6,23,0.82);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:16px;';
      overlay.onclick = (e) => {
        if (e.target === overlay) overlay.remove();
      };

      const isYoutube =
        videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');

      overlay.innerHTML = `
        <div style="position:relative;width:100%;max-width:780px;background:#0f172a;border-radius:20px;overflow:hidden;border:1px solid rgba(255,255,255,0.18);box-shadow:0 25px 60px rgba(0,0,0,0.5);">
          <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 18px;border-bottom:1px solid rgba(255,255,255,0.1);color:#fff;font-family:sans-serif;">
            <span style="font-size:13px;font-weight:700;">${title || 'CSEEL Interactive Video Preview'}</span>
            <button onclick="document.getElementById('cseel-sdk-video-modal').remove()" style="background:rgba(255,255,255,0.12);color:#fff;border:none;border-radius:999px;width:28px;height:28px;cursor:pointer;font-weight:700;">✕</button>
          </div>
          <div style="aspect-ratio:16/9;width:100%;background:#000;">
            ${
              isYoutube
                ? `<iframe src="${videoUrl}" style="width:100%;height:100%;border:0;" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`
                : `<video src="${videoUrl}" controls autoplay playsinline style="width:100%;height:100%;object-fit:cover;"></video>`
            }
          </div>
        </div>
      `;
      document.body.appendChild(overlay);
    },

    fetchSlotPayload: async (slotId: string) => {
      const res = await fetch(`/api/ad-slots?slotId=${encodeURIComponent(slotId)}`);
      return res.json();
    },

    injectHtmlIntoSlot: (slotDomId: string, rawHtml: string) => {
      const container = document.getElementById(slotDomId);
      if (!container) return;
      container.innerHTML = '';
      const range = document.createRange();
      range.selectNode(container);
      const fragment = range.createContextualFragment(rawHtml);
      container.appendChild(fragment);
    },
  };
}

interface CSEELHtmlJsInjectorProps {
  html: string;
  couponCode?: string;
  promoId?: string;
  className?: string;
}

/**
 * Smooth DOM + Script Injector component:
 * Injects HTML + CSS + executes embedded <script> tags safely inside the target slot container,
 * and replaces dynamic tokens like {{COUPON_CODE}} and {{PROMO_ID}}.
 */
export const CSEELHtmlJsInjector: React.FC<CSEELHtmlJsInjectorProps> = ({
  html,
  couponCode = '',
  promoId = '',
  className = 'w-full h-full flex justify-center',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureCSEELAdSDK();
    const el = containerRef.current;
    if (!el) return;

    const processedHtml = html
      .replace(/\{\{COUPON_CODE\}\}/g, couponCode)
      .replace(/\{\{PROMO_ID\}\}/g, promoId);

    el.innerHTML = '';
    try {
      const range = document.createRange();
      range.selectNode(el);
      const fragment = range.createContextualFragment(processedHtml);
      el.appendChild(fragment);
    } catch {
      el.innerHTML = processedHtml;
    }
  }, [html, couponCode, promoId]);

  return <div ref={containerRef} className={className} />;
};
