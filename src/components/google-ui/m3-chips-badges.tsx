'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Check, X, ChevronDown } from 'lucide-react';

/**
 * Official Material Design 3 (M3) Chips:
 * - Assist Chip (outlined, elevated, leadingIcon, disabled)
 * - Filter Chip (outlined, elevated, unselected, selected with ✓, trailing dropdown ▾, disabled)
 * - Input Chip (outlined, selected, avatar 24px, leadingIcon, trailing remove ×, disabled)
 * - Suggestion Chip (outlined, elevated, selected, leadingIcon, disabled)
 */
export type M3ChipVariant = 'assist' | 'filter' | 'input' | 'suggestion';

export interface M3ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: M3ChipVariant;
  elevated?: boolean;
  selected?: boolean;
  leadingIcon?: React.ReactNode;
  icon?: React.ReactNode;
  avatar?: React.ReactNode;
  hasDropdown?: boolean;
  onRemove?: (e: React.MouseEvent) => void;
  label: string;
}

export function M3Chip({
  variant = 'assist',
  elevated = false,
  selected = false,
  leadingIcon,
  icon,
  avatar,
  hasDropdown = false,
  onRemove,
  disabled = false,
  label,
  className,
  ...props
}: M3ChipProps) {
  const resolvedIcon = leadingIcon ?? icon;
  const baseClasses =
    'inline-flex shrink-0 whitespace-nowrap h-8 items-center justify-center gap-1.5 sm:gap-2 rounded-[8px] px-2.5 sm:px-3 text-xs sm:text-sm font-medium leading-none transition-all duration-150 select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b57d0] active:scale-[0.98] disabled:pointer-events-none disabled:cursor-not-allowed [&_svg]:w-[16px] [&_svg]:h-[16px] sm:[&_svg]:w-[18px] sm:[&_svg]:h-[18px]';

  // Official M3 Chip Disabled Specs:
  // Outlined disabled: border = on-surface 12%, text = on-surface 38%
  // Elevated/Selected disabled: bg = on-surface 12%, text = on-surface 38%, shadow = none
  const surfaceClasses = disabled
    ? selected || elevated
      ? 'bg-[#1f1f1f]/[0.12] text-[#1f1f1f]/[0.38] border border-transparent shadow-none'
      : 'bg-transparent text-[#1f1f1f]/[0.38] border border-[#1f1f1f]/[0.12] shadow-none'
    : selected
    ? elevated
      ? 'bg-[#c2e7ff] text-[#001d35] shadow-[0_1px_2px_rgba(60,64,67,0.3),0_1px_3px_1px_rgba(60,64,67,0.15)] border border-transparent hover:bg-[#b1defc]'
      : 'bg-[#c2e7ff] text-[#001d35] border border-transparent hover:bg-[#b1defc]'
    : elevated
    ? 'bg-[#f8fafd] text-[#1f1f1f] shadow-[0_1px_2px_rgba(60,64,67,0.3),0_1px_3px_1px_rgba(60,64,67,0.15)] border border-transparent hover:bg-[#eef3fc]'
    : 'bg-transparent text-[#444746] border border-[#747775] hover:bg-[#1f1f1f]/[0.08]';

  return (
    <button
      type="button"
      disabled={disabled}
      className={cn(
        baseClasses,
        surfaceClasses,
        avatar && 'pl-1 rounded-full',
        onRemove && 'pr-2',
        className
      )}
      {...props}
    >
      {avatar && (
        <span
          className={cn(
            'h-6 w-6 rounded-full overflow-hidden shrink-0 flex items-center justify-center text-xs font-bold',
            disabled ? 'bg-[#1f1f1f]/[0.12] text-[#1f1f1f]/[0.38]' : 'bg-[#0b57d0] text-white'
          )}
        >
          {avatar}
        </span>
      )}
      {!avatar && variant === 'filter' && selected ? (
        <Check className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] shrink-0" />
      ) : (
        !avatar &&
        resolvedIcon && (
          <span className={cn('shrink-0 inline-flex items-center', !disabled && !selected && 'text-[#0b57d0]')}>
            {resolvedIcon}
          </span>
        )
      )}
      <span className="whitespace-nowrap leading-none">{label}</span>
      {hasDropdown && <ChevronDown className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] shrink-0 opacity-75" />}
      {onRemove && (
        <span
          role="button"
          tabIndex={disabled ? -1 : 0}
          onClick={(e) => {
            if (disabled) return;
            e.stopPropagation();
            onRemove(e);
          }}
          className="ml-0.5 shrink-0 rounded-full p-0.5 hover:bg-black/10 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </span>
      )}
    </button>
  );
}

export const M3AssistChip = (props: Omit<M3ChipProps, 'variant'>) => (
  <M3Chip {...props} variant="assist" />
);
export const M3FilterChip = (props: Omit<M3ChipProps, 'variant'>) => (
  <M3Chip {...props} variant="filter" />
);
export const M3InputChip = (props: Omit<M3ChipProps, 'variant'>) => (
  <M3Chip {...props} variant="input" />
);
export const M3SuggestionChip = (props: Omit<M3ChipProps, 'variant'>) => (
  <M3Chip {...props} variant="suggestion" />
);

/**
 * Official @material/web Chip Set (<md-chip-set>)
 * Groups chips with accessible toolbar/listbox semantics and wrap or single-line scroll layout.
 */
export interface M3ChipSetProps extends React.HTMLAttributes<HTMLDivElement> {
  scrollable?: boolean;
}

export function M3ChipSet({
  scrollable = false,
  className,
  children,
  ...props
}: M3ChipSetProps) {
  return (
    <div
      role="toolbar"
      className={cn(
        'flex items-center gap-2',
        scrollable ? 'overflow-x-auto no-scrollbar py-1' : 'flex-wrap',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}


/**
 * Official Material Design 3 (M3) Badges:
 * - Small dot (6x6px)
 * - Large badge with count (16px height pill, e.g. "3", "99+", "NEW")
 */
export interface M3BadgeProps {
  variant?: 'dot' | 'large';
  count?: number | string;
  max?: number;
  color?: 'error' | 'primary' | 'success' | 'warning';
  children?: React.ReactNode;
  className?: string;
}

export function M3Badge({
  variant = 'large',
  count,
  max = 99,
  color = 'error',
  children,
  className,
}: M3BadgeProps) {
  const colorClasses = {
    error: 'bg-[#b3261e] text-white',
    primary: 'bg-[#0b57d0] text-white',
    success: 'bg-[#1f9d5c] text-white',
    warning: 'bg-[#e37400] text-white',
  };

  const formattedCount =
    typeof count === 'number' && count > max ? `${max}+` : count;

  const badgeEl =
    variant === 'dot' ? (
      <span
        className={cn(
          'inline-block h-1.5 w-1.5 rounded-full ring-2 ring-white',
          colorClasses[color],
          className
        )}
      />
    ) : (
      <span
        className={cn(
          'inline-flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[11px] font-bold leading-none ring-2 ring-white',
          colorClasses[color],
          className
        )}
      >
        {formattedCount}
      </span>
    );

  if (!children) return badgeEl;

  return (
    <span className="relative inline-flex">
      {children}
      <span
        className={cn(
          'absolute',
          variant === 'dot' ? '-top-0.5 -right-0.5' : '-top-1.5 -right-2'
        )}
      >
        {badgeEl}
      </span>
    </span>
  );
}
