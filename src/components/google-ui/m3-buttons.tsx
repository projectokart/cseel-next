'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { useM3Ripple } from './m3-tokens';

/**
 * 1. Official M3 Buttons:
 * - Variants: filled, elevated, tonal, outlined, text
 * - Color Schemes: primary, secondary, tertiary, error, success
 * - Icon Layouts: text-only, leading-icon, trailing-icon, both-icons
 * - States: default, hover, focus, pressed, disabled, loading, fullWidth
 */
export type M3ButtonVariant = 'filled' | 'elevated' | 'tonal' | 'outlined' | 'text';
export type M3ButtonColor = 'primary' | 'secondary' | 'tertiary' | 'error' | 'success';

export interface M3ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: M3ButtonVariant;
  color?: M3ButtonColor;
  size?: 'sm' | 'md' | 'lg';
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
  href?: string;
}

export function M3Button({
  variant = 'filled',
  color = 'primary',
  size = 'md',
  leadingIcon,
  trailingIcon,
  loading = false,
  fullWidth = false,
  href,
  className,
  children,
  onMouseDown,
  disabled,
  ...props
}: M3ButtonProps) {
  const { ripples, triggerRipple } = useM3Ripple();
  const isDisabled = disabled || loading;

  const filledColors: Record<M3ButtonColor, string> = {
    primary: 'bg-[#0b57d0] text-white hover:bg-[#0842a0]',
    secondary: 'bg-[#00639b] text-white hover:bg-[#004d7a]',
    tertiary: 'bg-[#146c2e] text-white hover:bg-[#0f5223]',
    error: 'bg-[#b3261e] text-white hover:bg-[#8c1d18]',
    success: 'bg-[#1f9d5c] text-white hover:bg-[#177a47]',
  };

  const tonalColors: Record<M3ButtonColor, string> = {
    primary: 'bg-[#d3e3fd] text-[#041e49] hover:bg-[#c2d7fa]',
    secondary: 'bg-[#c2e7ff] text-[#001d35] hover:bg-[#b1defc]',
    tertiary: 'bg-[#c4eed0] text-[#072711] hover:bg-[#b0e4bf]',
    error: 'bg-[#f9dedc] text-[#410e0b] hover:bg-[#f2c8c5]',
    success: 'bg-[#d1f5e0] text-[#072711] hover:bg-[#bcecd0]',
  };

  const textAndOutlineColors: Record<M3ButtonColor, string> = {
    primary: 'text-[#0b57d0] hover:bg-[#0b57d0]/[0.08]',
    secondary: 'text-[#00639b] hover:bg-[#00639b]/[0.08]',
    tertiary: 'text-[#146c2e] hover:bg-[#146c2e]/[0.08]',
    error: 'text-[#b3261e] hover:bg-[#b3261e]/[0.08]',
    success: 'text-[#1f9d5c] hover:bg-[#1f9d5c]/[0.08]',
  };

  // Official M3 Active + Exact M3 Disabled Specs:
  // Filled/Elevated/Tonal disabled: container = on-surface 12% (#1f1f1f/[0.12]), label = on-surface 38% (#1f1f1f/[0.38]), shadow = 0dp
  // Outlined disabled: border = on-surface 12% (#1f1f1f/[0.12]), label = on-surface 38% (#1f1f1f/[0.38])
  // Text disabled: transparent bg, label = on-surface 38% (#1f1f1f/[0.38])
  const variantClasses: Record<M3ButtonVariant, string> = {
    filled: cn(
      filledColors[color],
      'hover:shadow-[0_1px_2px_rgba(60,64,67,0.3),0_1px_3px_1px_rgba(60,64,67,0.15)] disabled:bg-[#1f1f1f]/[0.12] disabled:text-[#1f1f1f]/[0.38] disabled:shadow-none'
    ),
    elevated: cn(
      'bg-[#f8fafd] shadow-[0_1px_2px_rgba(60,64,67,0.3),0_1px_3px_1px_rgba(60,64,67,0.15)] hover:bg-[#eef3fc] hover:shadow-[0_1px_2px_rgba(60,64,67,0.3),0_2px_6px_2px_rgba(60,64,67,0.15)] disabled:bg-[#1f1f1f]/[0.12] disabled:text-[#1f1f1f]/[0.38] disabled:shadow-none',
      textAndOutlineColors[color]
    ),
    tonal: cn(
      tonalColors[size ? color : 'secondary'],
      'hover:shadow-[0_1px_2px_rgba(60,64,67,0.2)] disabled:bg-[#1f1f1f]/[0.12] disabled:text-[#1f1f1f]/[0.38] disabled:shadow-none'
    ),
    outlined: cn(
      'border border-[#747775] bg-transparent focus-visible:border-current disabled:border-[#1f1f1f]/[0.12] disabled:text-[#1f1f1f]/[0.38] disabled:bg-transparent',
      color === 'error' && 'border-[#b3261e]',
      textAndOutlineColors[color]
    ),
    text: cn(
      'bg-transparent disabled:text-[#1f1f1f]/[0.38] disabled:bg-transparent',
      textAndOutlineColors[color]
    ),
  };

  const sizeClasses = {
    sm: 'h-8 sm:h-9 px-3 sm:px-4 text-xs gap-1.5',
    md: 'h-9 sm:h-10 px-3.5 sm:px-6 text-xs sm:text-sm gap-1.5 sm:gap-2',
    lg: 'h-10 sm:h-12 px-4 sm:px-7 text-xs sm:text-base gap-1.5 sm:gap-2.5',
  };

  const combinedClasses = cn(
    'relative overflow-hidden inline-flex items-center justify-center whitespace-nowrap max-w-full rounded-full font-semibold leading-none transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b57d0] focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:cursor-not-allowed cursor-pointer select-none',
    variantClasses[variant],
    sizeClasses[size],
    (leadingIcon || loading) && size === 'md' && (variant === 'text' ? 'pl-2.5 sm:pl-3 pr-3 sm:pr-4' : 'pl-3 sm:pl-4'),
    trailingIcon && size === 'md' && (variant === 'text' ? 'pl-3 sm:pl-4 pr-2.5 sm:pr-3' : 'pr-3 sm:pr-4'),
    variant === 'text' && !leadingIcon && !trailingIcon && 'px-2.5 sm:px-3',
    fullWidth ? 'w-full min-w-0' : 'shrink-0',
    className
  );

  const innerContent = (
    <>
      {loading ? (
        <svg className="h-[16px] w-[16px] sm:h-[18px] sm:w-[18px] animate-spin shrink-0" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
          <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      ) : (
        leadingIcon && <span className="shrink-0 inline-flex items-center [&_svg]:w-[16px] [&_svg]:h-[16px] sm:[&_svg]:w-[18px] sm:[&_svg]:h-[18px]">{leadingIcon}</span>
      )}
      <span className="whitespace-nowrap truncate leading-none">{children}</span>
      {trailingIcon && <span className="shrink-0 inline-flex items-center [&_svg]:w-[16px] [&_svg]:h-[16px] sm:[&_svg]:w-[18px] sm:[&_svg]:h-[18px]">{trailingIcon}</span>}
      {!isDisabled && (
        <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
          {ripples.map((r) => (
            <span
              key={r.id}
              style={{ left: r.x, top: r.y, width: r.size, height: r.size }}
              className={cn(
                'absolute rounded-full animate-ping opacity-30',
                variant === 'filled' ? 'bg-white' : 'bg-[#0b57d0]'
              )}
            />
          ))}
        </span>
      )}
    </>
  );

  if (href && !isDisabled) {
    return (
      <Link href={href} className={combinedClasses}>
        {innerContent}
      </Link>
    );
  }

  return (
    <button
      type="button"
      disabled={isDisabled}
      onMouseDown={(e) => {
        if (!isDisabled) triggerRipple(e);
        onMouseDown?.(e);
      }}
      className={combinedClasses}
      {...props}
    >
      {innerContent}
    </button>
  );
}

/**
 * 2. Official M3 Icon Buttons:
 * - Variants: standard, filled, tonal, outlined
 * - Toggleable (selected=true/false) & Non-toggleable (selected=undefined)
 * - Sizes: sm (32px), md (40px), lg (48px)
 * - Disabled states per M3 spec
 */
export type M3IconButtonVariant = 'standard' | 'filled' | 'tonal' | 'outlined';

export interface M3IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: M3IconButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  selected?: boolean;
  icon: React.ReactNode;
  selectedIcon?: React.ReactNode;
  label?: string;
  ariaLabel?: string;
}

export function M3IconButton({
  variant = 'standard',
  size = 'md',
  selected,
  icon,
  selectedIcon,
  label,
  ariaLabel,
  disabled,
  className,
  ...props
}: M3IconButtonProps) {
  const isToggled = selected !== undefined;

  const sizeMap = {
    sm: 'h-8 w-8 [&_svg]:w-4 [&_svg]:h-4',
    md: 'h-10 w-10 [&_svg]:w-5 [&_svg]:h-5',
    lg: 'h-12 w-12 [&_svg]:w-6 [&_svg]:h-6',
  };

  const getVariantStyle = () => {
    if (variant === 'filled') {
      if (isToggled && !selected)
        return 'bg-[#e0e2e0] text-[#444746] hover:bg-[#d3d5d3] disabled:bg-[#1f1f1f]/[0.12] disabled:text-[#1f1f1f]/[0.38]';
      return 'bg-[#0b57d0] text-white hover:bg-[#0842a0] disabled:bg-[#1f1f1f]/[0.12] disabled:text-[#1f1f1f]/[0.38]';
    }
    if (variant === 'tonal') {
      if (isToggled && !selected)
        return 'bg-[#e0e2e0] text-[#444746] hover:bg-[#d3d5d3] disabled:bg-[#1f1f1f]/[0.12] disabled:text-[#1f1f1f]/[0.38]';
      return 'bg-[#c2e7ff] text-[#001d35] hover:bg-[#b1defc] disabled:bg-[#1f1f1f]/[0.12] disabled:text-[#1f1f1f]/[0.38]';
    }
    if (variant === 'outlined') {
      if (selected)
        return 'bg-[#1f1f1f] text-white border border-[#1f1f1f] disabled:bg-[#1f1f1f]/[0.12] disabled:text-[#1f1f1f]/[0.38] disabled:border-transparent';
      return 'border border-[#747775] text-[#444746] hover:bg-[#1f1f1f]/[0.08] disabled:border-[#1f1f1f]/[0.12] disabled:text-[#1f1f1f]/[0.38]';
    }
    // standard
    if (selected)
      return 'text-[#0b57d0] bg-[#0b57d0]/[0.12] disabled:bg-transparent disabled:text-[#1f1f1f]/[0.38]';
    return 'text-[#444746] hover:bg-[#1f1f1f]/[0.08] disabled:text-[#1f1f1f]/[0.38]';
  };

  return (
    <button
      type="button"
      disabled={disabled}
      aria-label={ariaLabel ?? label}
      aria-pressed={selected}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b57d0] active:scale-95 disabled:pointer-events-none disabled:cursor-not-allowed cursor-pointer',
        sizeMap[size],
        getVariantStyle(),
        className
      )}
      {...props}
    >
      {selected && selectedIcon ? selectedIcon : icon}
    </button>
  );
}

/**
 * 3. Official M3 Floating Action Button (FAB):
 * - Sizes: small (40px), regular (56px), large (96px)
 * - Colors: primary, surface, secondary, tertiary
 * - Elevation: default (Level 3 6dp) or lowered (Level 1 1dp)
 */
export interface M3FABProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'small' | 'regular' | 'large' | 'sm' | 'md' | 'lg';
  color?: 'primary' | 'surface' | 'secondary' | 'tertiary';
  variant?: 'primary' | 'surface' | 'secondary' | 'tertiary';
  lowered?: boolean;
  icon: React.ReactNode;
  ariaLabel?: string;
}

export function M3FAB({
  size = 'regular',
  color,
  variant,
  lowered = false,
  icon,
  ariaLabel,
  className,
  ...props
}: M3FABProps) {
  const resolvedSize =
    size === 'sm' ? 'small' : size === 'md' ? 'regular' : size === 'lg' ? 'large' : size;
  const resolvedColor = color ?? variant ?? 'primary';

  const sizeMap = {
    small: 'h-10 w-10 rounded-[12px] [&_svg]:w-5 [&_svg]:h-5',
    regular: 'h-14 w-14 rounded-[16px] [&_svg]:w-6 [&_svg]:h-6',
    large: 'h-20 w-20 rounded-[24px] [&_svg]:w-8 [&_svg]:h-8',
  };

  const colorMap = {
    primary: 'bg-[#d3e3fd] text-[#041e49] hover:bg-[#c3d8fa]',
    surface: 'bg-[#eef3fc] text-[#0b57d0] hover:bg-[#e1eaf8]',
    secondary: 'bg-[#c2e7ff] text-[#001d35] hover:bg-[#b0defc]',
    tertiary: 'bg-[#c4eed0] text-[#072711] hover:bg-[#b1e5c0]',
  };

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={cn(
        'inline-flex shrink-0 items-center justify-center transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b57d0] disabled:bg-[#1f1f1f]/[0.12] disabled:text-[#1f1f1f]/[0.38] disabled:shadow-none disabled:pointer-events-none cursor-pointer',
        lowered
          ? 'shadow-[0_1px_2px_rgba(60,64,67,0.3),0_1px_3px_1px_rgba(60,64,67,0.15)]'
          : 'shadow-[0_1px_3px_rgba(60,64,67,0.3),0_4px_8px_3px_rgba(60,64,67,0.15)] hover:shadow-[0_2px_3px_rgba(60,64,67,0.3),0_6px_10px_4px_rgba(60,64,67,0.15)]',
        sizeMap[resolvedSize],
        colorMap[resolvedColor],
        className
      )}
      {...props}
    >
      {icon}
    </button>
  );
}

/**
 * 4. Official M3 Extended FAB:
 * - Icon + Label, Label-Only (icon optional), or Collapsed (expanded=false)
 * - Elevated or Lowered
 */
export interface M3ExtendedFABProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  label: string;
  expanded?: boolean;
  lowered?: boolean;
  color?: 'primary' | 'surface' | 'secondary' | 'tertiary';
}

export function M3ExtendedFAB({
  icon,
  label,
  expanded = true,
  lowered = false,
  color = 'primary',
  className,
  ...props
}: M3ExtendedFABProps) {
  const colorMap = {
    primary: 'bg-[#d3e3fd] text-[#041e49] hover:bg-[#c3d8fa]',
    surface: 'bg-[#eef3fc] text-[#0b57d0] hover:bg-[#e1eaf8]',
    secondary: 'bg-[#c2e7ff] text-[#001d35] hover:bg-[#b0defc]',
    tertiary: 'bg-[#c4eed0] text-[#072711] hover:bg-[#b1e5c0]',
  };

  return (
    <button
      type="button"
      className={cn(
        'inline-flex shrink-0 h-14 items-center justify-center rounded-[16px] font-semibold text-sm transition-all duration-200 active:scale-[0.98] disabled:bg-[#1f1f1f]/[0.12] disabled:text-[#1f1f1f]/[0.38] disabled:shadow-none disabled:pointer-events-none cursor-pointer [&_svg]:w-6 [&_svg]:h-6',
        lowered
          ? 'shadow-[0_1px_2px_rgba(60,64,67,0.3),0_1px_3px_1px_rgba(60,64,67,0.15)]'
          : 'shadow-[0_1px_3px_rgba(60,64,67,0.3),0_4px_8px_3px_rgba(60,64,67,0.15)] hover:shadow-[0_2px_3px_rgba(60,64,67,0.3),0_6px_10px_4px_rgba(60,64,67,0.15)]',
        expanded ? (icon ? 'pl-4 pr-6 gap-3' : 'px-6') : 'w-14 px-0',
        colorMap[color],
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {expanded && <span className="whitespace-nowrap">{label}</span>}
    </button>
  );
}

/**
 * 5. Official M3 Segmented Buttons:
 * - Single-select & Multi-select
 * - Label-only, Icon-only, Icon + Label
 * - Density: default (40px), compact (36px), comfortable (44px)
 * - Disabled segments
 */
export interface M3SegmentItem {
  value: string;
  label?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface M3SegmentedButtonProps {
  options: M3SegmentItem[];
  value: string | string[];
  onChange: (val: any) => void;
  multiSelect?: boolean;
  showCheckmark?: boolean;
  density?: 'compact' | 'default' | 'comfortable';
  disabled?: boolean;
  className?: string;
}

export function M3SegmentedButton({
  options,
  value,
  onChange,
  multiSelect = false,
  showCheckmark = true,
  density = 'default',
  disabled = false,
  className,
}: M3SegmentedButtonProps) {
  const isSelected = (v: string) =>
    Array.isArray(value) ? value.includes(v) : value === v;

  const handleToggle = (v: string) => {
    if (disabled) return;
    if (multiSelect && Array.isArray(value)) {
      if (value.includes(v)) {
        onChange(value.filter((item) => item !== v));
      } else {
        onChange([...value, v]);
      }
    } else {
      onChange(v);
    }
  };

  const densityHeight = {
    compact: 'h-9',
    default: 'h-10',
    comfortable: 'h-11',
  };

  return (
    <div
      role="group"
      className={cn(
        'inline-flex max-w-full rounded-full border overflow-hidden divide-x bg-white',
        disabled
          ? 'border-[#1f1f1f]/[0.12] divide-[#1f1f1f]/[0.12]'
          : 'border-[#747775] divide-[#747775]',
        densityHeight[density],
        className
      )}
    >
      {options.map((opt) => {
        const active = isSelected(opt.value);
        const isSegDisabled = disabled || opt.disabled;
        return (
          <button
            key={opt.value}
            type="button"
            disabled={isSegDisabled}
            onClick={() => handleToggle(opt.value)}
            className={cn(
              'inline-flex shrink-0 whitespace-nowrap items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 text-xs sm:text-sm font-semibold transition-colors cursor-pointer select-none disabled:pointer-events-none disabled:text-[#1f1f1f]/[0.38] [&_svg]:w-[16px] [&_svg]:h-[16px] sm:[&_svg]:w-[18px] sm:[&_svg]:h-[18px]',
              active
                ? isSegDisabled
                  ? 'bg-[#1f1f1f]/[0.12] text-[#1f1f1f]/[0.38]'
                  : 'bg-[#c2e7ff] text-[#001d35]'
                : 'bg-transparent text-[#1f1f1f] hover:bg-[#1f1f1f]/[0.08]'
            )}
          >
            {active && showCheckmark ? (
              <Check className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] shrink-0" />
            ) : (
              opt.icon
            )}
            {opt.label && <span className="whitespace-nowrap">{opt.label}</span>}
          </button>
        );
      })}
    </div>
  );
}

/**
 * 6. Official @material/web Branded FAB (<md-branded-fab>)
 * Uses a 36px (or 48px on large) multi-color brand icon on Surface Container High,
 * supporting icon-only, extended with label, and lowered elevation.
 */
export interface M3BrandedFABProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'regular' | 'large';
  label?: string;
  lowered?: boolean;
  icon?: React.ReactNode;
}

export function GoogleFourColorPlusIcon({ className = 'w-9 h-9' }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" className={className} fill="none">
      <path fill="#34A853" d="M16 16v14h4V20z" />
      <path fill="#4285F4" d="M30 16H20l-4 4h14z" />
      <path fill="#FBBC05" d="M6 16v4h10l4-4z" />
      <path fill="#EA4335" d="M20 16V6h-4v14z" />
      <path fill="none" d="M0 0h36v36H0z" />
    </svg>
  );
}

export function M3BrandedFAB({
  size = 'regular',
  label,
  lowered = false,
  icon,
  className,
  ...props
}: M3BrandedFABProps) {
  const isLarge = size === 'large';

  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center justify-center bg-[#eef3fc] text-[#1f1f1f] hover:bg-[#e1eaf8] font-semibold text-sm transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b57d0] disabled:bg-[#1f1f1f]/[0.12] disabled:text-[#1f1f1f]/[0.38] disabled:shadow-none disabled:pointer-events-none cursor-pointer',
        lowered
          ? 'shadow-[0_1px_2px_rgba(60,64,67,0.3),0_1px_3px_1px_rgba(60,64,67,0.15)]'
          : 'shadow-[0_1px_3px_rgba(60,64,67,0.3),0_4px_8px_3px_rgba(60,64,67,0.15)] hover:shadow-[0_2px_3px_rgba(60,64,67,0.3),0_6px_10px_4px_rgba(60,64,67,0.15)]',
        label
          ? 'h-14 rounded-[16px] pl-4 pr-6 gap-3'
          : isLarge
          ? 'h-24 w-24 rounded-[28px]'
          : 'h-14 w-14 rounded-[16px]',
        className
      )}
      {...props}
    >
      <span className="shrink-0">
        {icon || <GoogleFourColorPlusIcon className={isLarge ? 'w-12 h-12' : 'w-9 h-9'} />}
      </span>
      {label && <span className="whitespace-nowrap">{label}</span>}
    </button>
  );
}

