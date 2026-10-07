'use client';

import React from 'react';

interface CseelLogoEmblemProps {
  size?: number | string;
  className?: string;
  animated?: boolean;
}

export default function CseelLogoEmblem({
  size = 40,
  className = '',
  animated = false,
}: CseelLogoEmblemProps) {
  const dimension = typeof size === 'number' ? `${size}px` : size;

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: dimension, height: dimension }}
    >
      <img
        src="/images/cseel-emblem.svg?v=20261003-gold"
        alt="CSEEL Emblem"
        className={`w-full h-full object-contain ${
          animated ? 'animate-pulse hover:rotate-6 transition-transform duration-300' : ''
        }`}
        loading="eager"
      />
    </div>
  );
}
