'use client';

import React, { useEffect, useRef } from 'react';

interface AdSenseBannerProps {
  slot?: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical';
  responsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * CSEEL Google AdSense Monetisation Component
 * Safely renders AdSense banner blocks and prevents duplicate push errors in Next.js SPA navigation.
 */
export default function AdSenseBanner({
  slot,
  format = 'auto',
  responsive = true,
  className = '',
  style = { display: 'block' },
}: AdSenseBannerProps) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const adRef = useRef<HTMLModElement | null>(null);
  const pushedRef = useRef<boolean>(false);

  useEffect(() => {
    // Only push if client ID exists and haven't already pushed for this mount
    if (clientId && clientId.startsWith('ca-pub-') && !pushedRef.current) {
      try {
        if (typeof window !== 'undefined') {
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
          pushedRef.current = true;
        }
      } catch (err) {
        console.error('AdSense display error:', err);
      }
    }
  }, [clientId]);

  // Don't render empty broken spaces if client ID is not yet configured
  if (!clientId || !clientId.startsWith('ca-pub-')) {
    return null;
  }

  return (
    <div className={`cseel-ad-container my-4 overflow-hidden text-center ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={style}
        data-ad-client={clientId}
        data-ad-slot={slot || undefined}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}
