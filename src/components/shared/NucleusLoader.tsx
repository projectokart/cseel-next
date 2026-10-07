'use client';

import React from 'react';
import CseelAnimatedLoader from './CseelAnimatedLoader';

interface NucleusLoaderProps {
  progress?: number;
  text?: string;
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
}

export default function NucleusLoader({
  progress,
  text,
  fullScreen = false,
  size = 'lg',
}: NucleusLoaderProps) {
  const roundedProgress = progress !== undefined ? Math.min(Math.max(Math.round(progress), 0), 100) : null;

  return (
    <div
      className={`${
        fullScreen
          ? 'fixed inset-0 z-[99999] bg-white/95 dark:bg-slate-950/95 backdrop-blur-md'
          : 'w-full py-12'
      } flex flex-col items-center justify-center select-none font-sans transition-opacity duration-200`}
    >
      {/* ── Official CSEEL Animated SVG Loader (Rotating Atom + 4 Color Glowing Brackets) ── */}
      <CseelAnimatedLoader size={size === 'lg' ? 72 : size} />

      {/* ── Loading Status & Multi-Color Progress Bar ── */}
      <div className="mt-5 flex flex-col items-center gap-2 text-center px-4">
        <p className="text-sm font-semibold text-[#202124] dark:text-slate-100 tracking-tight">
          {text || (roundedProgress !== null ? `Loading... ${roundedProgress}%` : 'Loading CSEEL...')}
        </p>

        {roundedProgress !== null && (
          <div className="w-40 sm:w-52 h-1.5 bg-[#e8eaed] dark:bg-slate-800 rounded-full overflow-hidden p-0.5 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC04] to-[#34A853] rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.max(roundedProgress, 6)}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
