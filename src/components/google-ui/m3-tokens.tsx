'use client';

import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

/**
 * Official Material Design 3 (M3) Elevation Levels (0 to 5)
 * Combines tonal surface container colors with M3 ambient + key shadows.
 */
export type M3ElevationLevel = 0 | 1 | 2 | 3 | 4 | 5;

export const M3_ELEVATION_STYLES: Record<
  M3ElevationLevel,
  { surface: string; shadow: string; label: string; dp: string }
> = {
  0: {
    surface: 'bg-[#ffffff]',
    shadow: 'shadow-none',
    label: 'Level 0 (Surface)',
    dp: '0dp',
  },
  1: {
    surface: 'bg-[#f8fafd]',
    shadow: 'shadow-[0_1px_2px_rgba(60,64,67,0.3),0_1px_3px_1px_rgba(60,64,67,0.15)]',
    label: 'Level 1 (Surface Low)',
    dp: '1dp',
  },
  2: {
    surface: 'bg-[#f3f6fc]',
    shadow: 'shadow-[0_1px_2px_rgba(60,64,67,0.3),0_2px_6px_2px_rgba(60,64,67,0.15)]',
    label: 'Level 2 (Surface Container)',
    dp: '3dp',
  },
  3: {
    surface: 'bg-[#eef3fc]',
    shadow: 'shadow-[0_1px_3px_rgba(60,64,67,0.3),0_4px_8px_3px_rgba(60,64,67,0.15)]',
    label: 'Level 3 (Surface High)',
    dp: '6dp',
  },
  4: {
    surface: 'bg-[#e9eef6]',
    shadow: 'shadow-[0_2px_3px_rgba(60,64,67,0.3),0_6px_10px_4px_rgba(60,64,67,0.15)]',
    label: 'Level 4 (Surface Higher)',
    dp: '8dp',
  },
  5: {
    surface: 'bg-[#e3e9f4]',
    shadow: 'shadow-[0_4px_4px_rgba(60,64,67,0.3),0_8px_12px_6px_rgba(60,64,67,0.15)]',
    label: 'Level 5 (Surface Highest)',
    dp: '12dp',
  },
};

export interface M3SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  level?: M3ElevationLevel;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const ROUNDED_MAP = {
  none: 'rounded-none',
  sm: 'rounded-[8px]',
  md: 'rounded-[12px]',
  lg: 'rounded-[16px]',
  xl: 'rounded-[28px]',
  full: 'rounded-full',
};

export function M3Surface({
  level = 1,
  rounded = 'lg',
  className,
  children,
  ...props
}: M3SurfaceProps) {
  const token = M3_ELEVATION_STYLES[level];
  return (
    <div
      className={cn(
        token.surface,
        token.shadow,
        ROUNDED_MAP[rounded],
        'text-[#1f1f1f] transition-all duration-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Official Material Design 3 (M3) Ripple & State Layer
 * State layer opacities: Hover 8%, Focus 12%, Pressed 12%, Dragged 16%
 */
interface RipplePoint {
  id: number;
  x: number;
  y: number;
  size: number;
}

export function useM3Ripple() {
  const [ripples, setRipples] = useState<RipplePoint[]>([]);

  const triggerRipple = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    const id = Date.now() + Math.random();

    setRipples((prev) => [...prev, { id, x, y, size }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 550);
  }, []);

  return { ripples, triggerRipple };
}

export interface M3StateLayerProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: 'primary' | 'on-primary' | 'surface' | 'error';
  disabled?: boolean;
}

export function M3StateLayer({
  color = 'primary',
  disabled = false,
  className,
  children,
  onMouseDown,
  ...props
}: M3StateLayerProps) {
  const { ripples, triggerRipple } = useM3Ripple();

  const stateColorMap = {
    primary:
      'hover:after:bg-[#0b57d0]/[0.08] focus-visible:after:bg-[#0b57d0]/[0.12] active:after:bg-[#0b57d0]/[0.12]',
    'on-primary':
      'hover:after:bg-white/[0.08] focus-visible:after:bg-white/[0.12] active:after:bg-white/[0.12]',
    surface:
      'hover:after:bg-[#1f1f1f]/[0.08] focus-visible:after:bg-[#1f1f1f]/[0.12] active:after:bg-[#1f1f1f]/[0.12]',
    error:
      'hover:after:bg-[#b3261e]/[0.08] focus-visible:after:bg-[#b3261e]/[0.12] active:after:bg-[#b3261e]/[0.12]',
  };

  const rippleFillMap = {
    primary: 'bg-[#0b57d0]/20',
    'on-primary': 'bg-white/25',
    surface: 'bg-[#1f1f1f]/15',
    error: 'bg-[#b3261e]/20',
  };

  return (
    <div
      onMouseDown={(e) => {
        if (!disabled) triggerRipple(e);
        onMouseDown?.(e);
      }}
      className={cn(
        'relative overflow-hidden select-none cursor-pointer after:pointer-events-none after:absolute after:inset-0 after:transition-colors after:duration-150',
        !disabled && stateColorMap[color],
        disabled && 'opacity-38 pointer-events-none',
        className
      )}
      {...props}
    >
      {children}
      <span className="pointer-events-none absolute inset-0 overflow-hidden">
        {ripples.map((r) => (
          <span
            key={r.id}
            style={{
              left: r.x,
              top: r.y,
              width: r.size,
              height: r.size,
            }}
            className={cn(
              'absolute rounded-full animate-ping opacity-40',
              rippleFillMap[color]
            )}
          />
        ))}
      </span>
    </div>
  );
}

/**
 * Official @material/web Focus Ring (<md-focus-ring>)
 * Accessible 3px keyboard focus outline with outward (2px offset) or inward (-3px offset) placement.
 */
export interface M3FocusRingProps {
  inward?: boolean;
  visible?: boolean;
  shapeClass?: string;
  colorClass?: string;
}

export function M3FocusRing({
  inward = false,
  visible = false,
  shapeClass = 'rounded-full',
  colorClass = 'ring-[#0b57d0]',
}: M3FocusRingProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 transition-all duration-150',
        shapeClass,
        inward ? 'ring-inset ring-[3px]' : 'ring-[3px] ring-offset-2',
        colorClass,
        visible
          ? 'opacity-100 scale-100'
          : 'opacity-0 scale-95 group-focus-visible:opacity-100 group-focus-visible:scale-100 peer-focus-visible:opacity-100 peer-focus-visible:scale-100'
      )}
    />
  );
}

/**
 * Official @material/web Elevation (<md-elevation>)
 * Declarative shadow surface overlay matching --md-elevation-level (0..5)
 */
export function M3Elevation({ level = 1, className }: { level?: M3ElevationLevel; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 rounded-[inherit] transition-shadow duration-200',
        M3_ELEVATION_STYLES[level].shadow,
        className
      )}
    />
  );
}

