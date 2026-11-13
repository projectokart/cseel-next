'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const DEFAULT_PUB_ID = 'ca-pub-2314808699584572';
const DEFAULT_DISPLAY_SLOT = '2850854499';
const DEFAULT_INARTICLE_SLOT = '5995892584';
const DEFAULT_INFEED_SLOT = '5609393126';
const DEFAULT_INFEED_LAYOUT_KEY = '-6t+ed+2i-1n-4w';

function useAdSensePush(
  clientId: string,
  slot: string | undefined,
  adRef: React.RefObject<HTMLModElement | null>
) {
  const pushedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!clientId || !clientId.startsWith('ca-pub-') || pushedRef.current) return;
    if (typeof window === 'undefined') return;
    const el = adRef.current;
    if (!el) return;

    if (el.getAttribute('data-adsbygoogle-status')) {
      pushedRef.current = true;
      return;
    }

    // Defer push by one frame so container layout width is guaranteed > 0
    const rafId = window.requestAnimationFrame(() => {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        pushedRef.current = true;
      } catch (err) {
        console.error('AdSense display error:', err);
      }
    });

    return () => window.cancelAnimationFrame(rafId);
  }, [clientId, slot, adRef]);
}

interface AdSenseBannerProps {
  slot?: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical';
  responsive?: boolean;
  plain?: boolean;
  className?: string;
  style?: React.CSSProperties;
  label?: string;
}

/**
 * Standard In-Page AdSense Display Banner Component.
 * Uses a non-flex block wrapper with min-width so AdSense auto-sizing never sees availableWidth=0,
 * and shows a clean CSEEL Education Partner fallback when Google returns unfilled (e.g. localhost/blocked).
 */
export default function AdSenseBanner({
  slot,
  format = 'auto',
  responsive = true,
  plain = false,
  className = '',
  style = { display: 'block', width: '100%', minWidth: '250px' },
  label = 'Sponsored',
}: AdSenseBannerProps) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || DEFAULT_PUB_ID;
  const resolvedSlot = slot || process.env.NEXT_PUBLIC_ADSENSE_DISPLAY_SLOT || DEFAULT_DISPLAY_SLOT;
  const adRef = useRef<HTMLModElement | null>(null);
  // 'google' = Google AdSense filled & rendered; 'fallback' = no Google ad present -> show CSEEL house ad
  const [adState, setAdState] = useState<'loading' | 'google' | 'fallback'>('loading');

  useAdSensePush(clientId, resolvedSlot, adRef);

  useEffect(() => {
    const el = adRef.current;
    if (!el || typeof window === 'undefined') return;

    const inspectSlot = (): 'filled' | 'unfilled' | 'pending' => {
      const status = el.getAttribute('data-ad-status');
      const iframe = el.querySelector('iframe');
      const iframeVisible = Boolean(iframe && iframe.getBoundingClientRect().height > 10);
      if (status === 'filled' || iframeVisible) {
        return 'filled';
      }
      if (status === 'unfilled') {
        return 'unfilled';
      }
      return 'pending';
    };

    const syncState = () => {
      const result = inspectSlot();
      if (result === 'filled') {
        setAdState('google');
      } else if (result === 'unfilled') {
        setAdState('fallback');
      }
    };

    syncState();
    const observer = new MutationObserver(syncState);
    observer.observe(el, {
      attributes: true,
      attributeFilter: ['data-ad-status', 'style'],
      childList: true,
      subtree: true,
    });

    // Fallback to CSEEL house ad if Google AdSense fails to fill (e.g. localhost, blocked, or no inventory)
    const timer = window.setTimeout(() => {
      const result = inspectSlot();
      if (result === 'filled') {
        setAdState('google');
      } else {
        setAdState('fallback');
      }
    }, 2500);

    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [clientId, resolvedSlot]);

  if (!clientId || !clientId.startsWith('ca-pub-')) {
    return null;
  }

  const showFallbackAd = adState === 'fallback';

  const adIns = (
    <div className="w-full min-w-0 block overflow-hidden">
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={
          showFallbackAd
            ? { display: 'none' }
            : { display: 'block', width: '100%', minWidth: '250px', minHeight: '90px', ...style }
        }
        data-ad-client={clientId}
        data-ad-slot={resolvedSlot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
      {showFallbackAd && (
        <Link
          href="/steam-lab"
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl bg-gradient-to-r from-[#002B4D] via-[#00447A] to-[#005B9E] px-4 py-3.5 sm:px-5 sm:py-4 text-left shadow-sm border border-[#003C6E] hover:brightness-105 transition"
        >
          <div className="min-w-0">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#BAE6FD]">
              CSEEL STEM &amp; ATL Infrastructure
            </div>
            <div className="text-[14px] sm:text-[15px] font-semibold text-white leading-snug mt-0.5">
              Setup NEP-2020 Composite Skill, Robotics &amp; Science Labs for Your Campus
            </div>
          </div>
          <span className="shrink-0 inline-flex items-center px-3.5 py-1.5 rounded-lg bg-white text-[#002B4D] text-xs font-bold whitespace-nowrap shadow-2xs">
            Explore Labs &rarr;
          </span>
        </Link>
      )}
    </div>
  );

  if (plain) {
    return (
      <div className={`cseel-ad-plain w-full max-w-full overflow-hidden text-center ${className || 'my-2'}`}>
        {adIns}
      </div>
    );
  }

  return (
    <div className={`cseel-ad-container w-full max-w-full overflow-hidden rounded-2xl border border-[#DCE2E8] bg-[#F8FAFC] p-3 sm:p-4 shadow-2xs ${className || 'my-4'}`}>
      {label && (
        <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-[#E2E8F0]">
          <span className="text-[10.5px] font-bold tracking-wider text-[#334155] uppercase">
            {label}
          </span>
          <span className="text-[10px] font-semibold text-[#475569]">
            {showFallbackAd ? 'Partner Program' : 'Google Ad'}
          </span>
        </div>
      )}
      {adIns}
    </div>
  );
}

/**
 * In-Feed Card AdSense Component
 * Specially styled to seamlessly match Job & School cards in grid lists
 */
export function AdSenseInFeedCard({
  slot,
  layoutKey,
  className = '',
  cardType = 'job',
}: {
  slot?: string;
  layoutKey?: string;
  className?: string;
  cardType?: 'job' | 'school';
}) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || DEFAULT_PUB_ID;
  const resolvedLayoutKey =
    layoutKey || process.env.NEXT_PUBLIC_ADSENSE_INFEED_LAYOUT_KEY || DEFAULT_INFEED_LAYOUT_KEY;
  const resolvedSlot =
    slot ||
    (resolvedLayoutKey ? process.env.NEXT_PUBLIC_ADSENSE_INFEED_SLOT || DEFAULT_INFEED_SLOT : undefined) ||
    process.env.NEXT_PUBLIC_ADSENSE_DISPLAY_SLOT ||
    DEFAULT_DISPLAY_SLOT;
  const adRef = useRef<HTMLModElement | null>(null);

  useAdSensePush(clientId, resolvedSlot, adRef);

  if (!clientId || !clientId.startsWith('ca-pub-')) {
    return null;
  }

  return (
    <div
      data-card-type={cardType}
      className={`w-full max-w-full overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/20 border border-slate-200 hover:border-blue-300 rounded-2xl p-3 sm:p-5 transition-all duration-200 shadow-xs flex flex-col justify-between gap-3 group relative min-h-[220px] sm:min-h-[260px] ${className}`}
    >
      {/* Header Badge */}
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 font-bold text-[10px] tracking-wider uppercase border border-slate-200">
          Advertisement
        </span>
        <span className="text-[10px] text-slate-400 font-medium">Sponsored Partner</span>
      </div>

      {/* Ad Area */}
      <div className="flex-1 flex items-center justify-center w-full max-w-full overflow-hidden min-h-[140px]">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '100%' }}
          data-ad-client={clientId}
          data-ad-slot={resolvedSlot}
          data-ad-format={resolvedLayoutKey ? 'fluid' : 'auto'}
          data-ad-layout-key={resolvedLayoutKey}
          data-full-width-responsive={resolvedLayoutKey ? undefined : 'false'}
        />
      </div>

      {/* Card Footer */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>Relevant Education & Career Services</span>
        <span className="text-blue-600 font-semibold text-[10px]">Learn More &rarr;</span>
      </div>
    </div>
  );
}

/**
 * In-Article Fluid AdSense Component
 * Dedicated slot for Blog posts, Guides & Article reading views
 */
export function AdSenseInArticle({
  slot,
  className = '',
  label = 'Sponsored',
}: {
  slot?: string;
  className?: string;
  label?: string;
}) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || DEFAULT_PUB_ID;
  const resolvedSlot = slot || process.env.NEXT_PUBLIC_ADSENSE_INARTICLE_SLOT || DEFAULT_INARTICLE_SLOT;
  const adRef = useRef<HTMLModElement | null>(null);

  useAdSensePush(clientId, resolvedSlot, adRef);

  if (!clientId || !clientId.startsWith('ca-pub-')) {
    return null;
  }

  return (
    <div className={`cseel-inarticle-ad w-full max-w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-50/40 p-2.5 sm:p-4 ${className || 'my-6'}`}>
      {label && (
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/60">
          <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
            {label}
          </span>
          <span className="text-[9px] text-slate-400">Google Ad</span>
        </div>
      )}
      <div className="w-full max-w-full overflow-hidden">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', textAlign: 'center', width: '100%' }}
          data-ad-layout="in-article"
          data-ad-format="fluid"
          data-ad-client={clientId}
          data-ad-slot={resolvedSlot}
        />
      </div>
    </div>
  );
}
