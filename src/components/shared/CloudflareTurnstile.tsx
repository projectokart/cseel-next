'use client';

import React, { useEffect, useRef, useCallback } from 'react';

interface CloudflareTurnstileProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  className?: string;
}

// Cloudflare Turnstile script injection (runs once)
let scriptLoaded = false;
function loadTurnstileScript() {
  if (scriptLoaded || typeof window === 'undefined') return;
  if (document.querySelector('script[src*="turnstile"]')) {
    scriptLoaded = true;
    return;
  }
  const script = document.createElement('script');
  script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
  scriptLoaded = true;
}

export default function CloudflareTurnstile({
  onVerify,
  onExpire,
  className = '',
}: CloudflareTurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  // Site key: use env var or Cloudflare's official "always passes" test key
  const siteKey =
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA';

  const renderWidget = useCallback(() => {
    if (
      !containerRef.current ||
      widgetIdRef.current !== null ||
      typeof window === 'undefined' ||
      !(window as any).turnstile
    )
      return;

    widgetIdRef.current = (window as any).turnstile.render(containerRef.current, {
      sitekey: siteKey,
      callback: (token: string) => {
        onVerify(token);
      },
      'expired-callback': () => {
        widgetIdRef.current = null;
        onExpire?.();
      },
      'error-callback': () => {
        widgetIdRef.current = null;
      },
      theme: 'light',
      language: 'auto',
    });
  }, [siteKey, onVerify, onExpire]);

  useEffect(() => {
    loadTurnstileScript();

    // Poll until turnstile global is available, then render
    let attempts = 0;
    const poll = setInterval(() => {
      attempts++;
      if ((window as any).turnstile) {
        clearInterval(poll);
        renderWidget();
      } else if (attempts > 40) {
        // 4 seconds timeout — stop polling
        clearInterval(poll);
      }
    }, 100);

    return () => {
      clearInterval(poll);
      if (widgetIdRef.current !== null && (window as any).turnstile) {
        try {
          (window as any).turnstile.remove(widgetIdRef.current);
        } catch {
          /* ignore */
        }
        widgetIdRef.current = null;
      }
    };
  }, [renderWidget]);

  return (
    <div className={`flex items-center justify-start py-2 ${className}`}>
      {/* Real Cloudflare Turnstile widget — renders inside this div */}
      <div ref={containerRef} />
    </div>
  );
}
