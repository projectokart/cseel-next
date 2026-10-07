'use client';

import React from 'react';

interface MaterialCircularLoaderProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  strokeWidth?: number;
  multicolor?: boolean;
  color?: string;
  className?: string;
  label?: string;
}

const SIZE_MAP = {
  xs: { px: 16, stroke: 3 },
  sm: { px: 24, stroke: 3.2 },
  md: { px: 40, stroke: 3.6 },
  lg: { px: 56, stroke: 4 },
  xl: { px: 72, stroke: 4.5 },
};

export default function MaterialCircularLoader({
  size = 'md',
  strokeWidth,
  multicolor = true,
  color,
  className = '',
  label,
}: MaterialCircularLoaderProps) {
  const sizeConfig = SIZE_MAP[size] || SIZE_MAP.md;
  const stroke = strokeWidth ?? sizeConfig.stroke;
  const dimension = sizeConfig.px;

  return (
    <div className={`inline-flex flex-col items-center justify-center gap-3 ${className}`}>
      <div
        className="relative flex items-center justify-center"
        style={{ width: dimension, height: dimension }}
      >
        <svg
          viewBox="25 25 50 50"
          className="m3-circular-svg"
          style={{
            width: '100%',
            height: '100%',
            animation: 'm3-rotate 1.4s linear infinite',
            transformOrigin: 'center center',
          }}
        >
          <circle
            cx="50"
            cy="50"
            r="20"
            fill="none"
            strokeWidth={stroke}
            strokeMiterlimit="10"
            strokeLinecap="round"
            className={multicolor && !color ? 'm3-path-multicolor' : 'm3-path-single'}
            style={{
              stroke: color || (multicolor ? undefined : '#1a73e8'),
            }}
          />
        </svg>
      </div>

      {label && (
        <span className="text-xs sm:text-sm font-medium text-[#5f6368] tracking-wide animate-pulse">
          {label}
        </span>
      )}
    </div>
  );
}
