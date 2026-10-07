'use client';

import React from 'react';
import MaterialCircularLoader from './MaterialCircularLoader';
import CseelLogoEmblem from './CseelLogoEmblem';

interface CseelAnimatedLoaderProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  label?: string;
  className?: string;
}

const SIZE_MAP = {
  xs: { ring: 'xs', emblem: 16 },
  sm: { ring: 'sm', emblem: 22 },
  md: { ring: 'md', emblem: 34 },
  lg: { ring: 'lg', emblem: 48 },
  xl: { ring: 'xl', emblem: 64 },
};

export default function CseelAnimatedLoader({
  size = 'md',
  label,
  className = '',
}: CseelAnimatedLoaderProps) {
  const isNamedSize = typeof size === 'string' && (size in SIZE_MAP);
  const ringSize = isNamedSize ? (SIZE_MAP[size as keyof typeof SIZE_MAP].ring as any) : 'lg';
  const emblemPx = isNamedSize ? SIZE_MAP[size as keyof typeof SIZE_MAP].emblem : (typeof size === 'number' ? Math.round(size * 0.7) : 48);

  return (
    <div className={`inline-flex flex-col items-center justify-center gap-3.5 select-none ${className}`}>
      {/* ── Outer 4-Color Circular Rotating Arc + Inner CSEEL Emblem ── */}
      <div className="relative flex items-center justify-center">
        {/* 4-Color Material Progress Arc */}
        <MaterialCircularLoader size={ringSize} multicolor={true} />

        {/* Center CSEEL 4-Color Emblem with Smooth Gentle Pulse */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="rounded-full bg-white/95 p-1 flex items-center justify-center shadow-xs">
            <CseelLogoEmblem size={emblemPx} animated={true} />
          </div>
        </div>
      </div>

      {label && (
        <span className="text-xs sm:text-sm font-semibold text-[#202124] dark:text-slate-200 tracking-tight animate-pulse">
          {label}
        </span>
      )}
    </div>
  );
}
