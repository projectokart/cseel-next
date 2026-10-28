'use client';

import { useEffect, useRef } from 'react';

export default function Loading() {
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Lock body scroll on mount & restore on unmount
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalTouchAction = document.body.style.touchAction;

    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.touchAction = originalTouchAction;
    };
  }, []);

  // 2. Trap keyboard focus so Tab cannot reach background elements
  useEffect(() => {
    containerRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        containerRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      ref={containerRef}
      tabIndex={-1}
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="outline-none"
    >
      {/* ── Thin Top Progress Bar with Google-Color Gradient (scaleX animation) ── */}
      <div
        className="fixed top-0 left-0 right-0 z-[999999] pointer-events-none h-[2.5px] overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="h-full w-full origin-left motion-safe:animate-[progress_1.4s_ease-in-out_infinite]"
          style={{
            background:
              'linear-gradient(to right, #4285f4, #ea4335, #fbbc04, #34a853)',
          }}
        />
      </div>

      {/* ── Full-Screen Blocking Loading Overlay (Fade-in after 200ms delay to avoid flicker) ── */}
      <div
        className="fixed inset-0 z-[999998] pointer-events-auto cursor-wait select-none touch-none flex flex-col items-center justify-center backdrop-blur-[6px] bg-white/40 opacity-0 motion-safe:animate-[fadeIn_150ms_200ms_forwards] motion-reduce:opacity-100"
        aria-hidden="true"
        onWheel={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onTouchMove={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        {/* Centered Glassmorphic Loading Card */}
        <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/85 shadow-lg border border-slate-200/60 backdrop-blur-md">
          {/* Animated Spinner Ring */}
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-full border-[3px] border-[#023858]/15" />
            <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[#023858] border-r-[#0b57d0] motion-safe:animate-spin" />
            <div className="absolute inset-0 m-auto w-2.5 h-2.5 rounded-full bg-[#023858] motion-safe:animate-pulse" />
          </div>
          <span className="mt-2.5 text-[11px] font-semibold tracking-wide text-[#023858]/90">
            Loading...
          </span>
        </div>
      </div>

      {/* Screen-reader announcement */}
      <span className="sr-only">Loading content, please wait...</span>
    </div>
  );
}
