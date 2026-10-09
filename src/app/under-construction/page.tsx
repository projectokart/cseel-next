'use client';

import React from 'react';

export default function UnderConstructionPage() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-8 bg-[#EDF5FA] select-none">
      {/* ── ONLY CSEEL LOGO ── */}
      <div className="mb-6 sm:mb-8 flex items-center justify-center">
        <img
          src="/images/cseel-logo.png"
          alt="CSEEL"
          className="h-12 sm:h-16 w-auto object-contain"
          onError={(e) => {
            // fallback if /images/cseel-logo.png is not found
            (e.target as HTMLImageElement).src = '/cseel-logo.png';
          }}
        />
      </div>

      {/* ── ONLY ANIMATED CONSTRUCTION SVG (call dev.svg) ── */}
      <div className="w-full max-w-[480px] sm:max-w-[520px] flex items-center justify-center">
        <object
          data="/images/under-construction.svg"
          type="image/svg+xml"
          aria-label="CSEEL Under Construction"
          className="w-full aspect-square object-contain block pointer-events-auto"
        >
          <img
            src="/images/under-construction.svg"
            alt="CSEEL Under Construction"
            className="w-full aspect-square object-contain block"
          />
        </object>
      </div>
    </main>
  );
}
