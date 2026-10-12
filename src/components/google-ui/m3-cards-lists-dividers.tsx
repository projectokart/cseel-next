'use client';

import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, ChevronDown, Check } from 'lucide-react';

/**
 * 1. Official Material Design 3 (M3) Cards:
 * - Surface Variants: elevated, filled, outlined
 * - Layouts: vertical, horizontal
 * - Header: avatar + headerTitle + headerSubtitle + headerAction
 * - States: static, interactive, selected, draggable, disabled
 */
export type M3CardVariant = 'elevated' | 'filled' | 'outlined';

export interface M3CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: M3CardVariant;
  orientation?: 'vertical' | 'horizontal';
  interactive?: boolean;
  selected?: boolean;
  draggableCard?: boolean;
  disabled?: boolean;
  headerAvatar?: React.ReactNode;
  headerTitle?: string;
  headerSubtitle?: string;
  headerAction?: React.ReactNode;
  mediaUrl?: string;
  mediaAlt?: string;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function M3Card({
  variant = 'elevated',
  orientation = 'vertical',
  interactive = false,
  selected = false,
  draggableCard = false,
  disabled = false,
  headerAvatar,
  headerTitle,
  headerSubtitle,
  headerAction,
  mediaUrl,
  mediaAlt,
  title,
  subtitle,
  actions,
  className,
  children,
  ...props
}: M3CardProps) {
  const variantStyles: Record<M3CardVariant, string> = {
    elevated:
      'bg-[#f8fafd] border border-transparent shadow-[0_1px_2px_rgba(60,64,67,0.3),0_1px_3px_1px_rgba(60,64,67,0.15)]',
    filled: 'bg-[#e9eef6] border border-transparent shadow-none',
    outlined: 'bg-white border border-[#c4c7c5] shadow-none',
  };

  const interactiveStyles: Record<M3CardVariant, string> = {
    elevated:
      'cursor-pointer hover:bg-[#eef3fc] hover:shadow-[0_1px_3px_rgba(60,64,67,0.3),0_4px_8px_3px_rgba(60,64,67,0.15)] active:scale-[0.99]',
    filled: 'cursor-pointer hover:bg-[#dfe6f2] active:scale-[0.99]',
    outlined:
      'cursor-pointer hover:bg-[#1f1f1f]/[0.04] hover:border-[#747775] active:scale-[0.99]',
  };

  if (orientation === 'horizontal') {
    return (
      <div
        className={cn(
          'relative flex items-center justify-between gap-4 rounded-[16px] overflow-hidden p-3 sm:p-4 text-[#1f1f1f] transition-all duration-200',
          variantStyles[variant],
          interactive && !disabled && interactiveStyles[variant],
          selected && 'ring-2 ring-[#0b57d0] bg-[#d3e3fd]/40',
          draggableCard &&
            'cursor-grab active:cursor-grabbing shadow-[0_2px_3px_rgba(60,64,67,0.3),0_6px_10px_4px_rgba(60,64,67,0.15)]',
          disabled &&
            'pointer-events-none bg-[#1f1f1f]/[0.08] text-[#1f1f1f]/[0.38] border-[#1f1f1f]/[0.12] shadow-none opacity-60',
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-3.5 min-w-0 flex-1">
          {headerAvatar && (
            <div className="h-10 w-10 rounded-full bg-[#c2e7ff] text-[#001d35] font-bold flex items-center justify-center shrink-0">
              {headerAvatar}
            </div>
          )}
          <div className="min-w-0 flex-1">
            {title && (
              <h3 className="text-sm sm:text-base font-bold text-[#1f1f1f] truncate">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-[#444746] truncate mt-0.5">{subtitle}</p>
            )}
            {children}
          </div>
        </div>
        {mediaUrl && (
          <img
            src={mediaUrl}
            alt={mediaAlt || title || 'Card thumbnail'}
            className="h-20 w-20 rounded-[12px] object-cover shrink-0 bg-[#e9eef6]"
          />
        )}
        {actions && <div className="shrink-0">{actions}</div>}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative rounded-[16px] overflow-hidden text-[#1f1f1f] transition-all duration-200',
        variantStyles[variant],
        interactive && !disabled && interactiveStyles[variant],
        selected && 'ring-2 ring-[#0b57d0] bg-[#d3e3fd]/35',
        draggableCard &&
          'cursor-grab active:cursor-grabbing shadow-[0_2px_3px_rgba(60,64,67,0.3),0_6px_10px_4px_rgba(60,64,67,0.15)]',
        disabled &&
          'pointer-events-none bg-[#1f1f1f]/[0.08] text-[#1f1f1f]/[0.38] border-[#1f1f1f]/[0.12] shadow-none opacity-60',
        className
      )}
      {...props}
    >
      {selected && (
        <span className="absolute top-3 right-3 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-[#0b57d0] text-white shadow-sm">
          <Check className="w-3.5 h-3.5 stroke-[3]" />
        </span>
      )}

      {(headerAvatar || headerTitle || headerSubtitle || headerAction) && (
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3 min-w-0">
            {headerAvatar && (
              <div className="h-10 w-10 rounded-full bg-[#0b57d0] text-white text-sm font-bold flex items-center justify-center shrink-0">
                {headerAvatar}
              </div>
            )}
            <div className="min-w-0">
              {headerTitle && (
                <div className="text-sm font-bold text-[#1f1f1f] truncate">
                  {headerTitle}
                </div>
              )}
              {headerSubtitle && (
                <div className="text-xs text-[#444746] truncate">
                  {headerSubtitle}
                </div>
              )}
            </div>
          </div>
          {headerAction && <div className="shrink-0">{headerAction}</div>}
        </div>
      )}

      {mediaUrl && (
        <div className="relative h-44 w-full overflow-hidden bg-[#e9eef6]">
          <img
            src={mediaUrl}
            alt={mediaAlt || title || 'Card media'}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {(title || subtitle || children || actions) && (
        <div className="p-4 sm:p-5">
          {title && (
            <h3 className="text-base sm:text-lg font-bold text-[#1f1f1f] leading-snug">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-xs sm:text-sm text-[#444746] mt-0.5">{subtitle}</p>
          )}
          {children && (
            <div className={cn((title || subtitle) && 'mt-3')}>{children}</div>
          )}
          {actions && (
            <div className="mt-4 flex items-center justify-end gap-2">
              {actions}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * 2. Official Material Design 3 (M3) Carousels:
 * - multi-browse (varying card widths: Large, Medium, Small peek)
 * - hero (large primary slide + small peek card)
 * - uncontained (equal-width horizontal snap)
 * - full-screen (single full-width slide with pagination dots)
 */
export interface M3CarouselItem {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  badge?: string;
  content?: React.ReactNode;
}

export interface M3CarouselProps {
  variant?: 'multi-browse' | 'hero' | 'uncontained' | 'full-screen';
  items: M3CarouselItem[];
  className?: string;
}

export function M3Carousel({
  variant = 'multi-browse',
  items,
  className,
}: M3CarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const nextIdx =
      dir === 'left'
        ? Math.max(0, activeIdx - 1)
        : Math.min(items.length - 1, activeIdx + 1);
    setActiveIdx(nextIdx);
    scrollRef.current.scrollBy({
      left: dir === 'left' ? -320 : 320,
      behavior: 'smooth',
    });
  };

  return (
    <div className={cn('relative group', className)}>
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 no-scrollbar scroll-smooth"
      >
        {items.map((item, idx) => {
          const widthClass =
            variant === 'full-screen'
              ? 'min-w-full'
              : variant === 'hero'
              ? idx === 0
                ? 'min-w-[82%] sm:min-w-[70%]'
                : 'min-w-[45%] sm:min-w-[26%]'
              : variant === 'multi-browse'
              ? idx % 3 === 0
                ? 'min-w-[260px] sm:min-w-[300px]'
                : idx % 3 === 1
                ? 'min-w-[200px] sm:min-w-[220px]'
                : 'min-w-[140px] sm:min-w-[160px]'
              : 'min-w-[240px] sm:min-w-[260px]';

          return (
            <div
              key={item.id}
              className={cn(
                'snap-start shrink-0 rounded-[28px] overflow-hidden relative h-52 bg-gradient-to-br from-[#0b57d0] to-[#003c6e] text-white p-5 flex flex-col justify-end shadow-sm transition-all duration-300',
                widthClass
              )}
            >
              {item.image && (
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 h-full w-full object-cover opacity-55"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
              <div className="relative z-10">
                {item.badge && (
                  <span className="inline-block rounded-full bg-white/20 backdrop-blur-md px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider mb-1.5">
                    {item.badge}
                  </span>
                )}
                <h4 className="text-base font-bold leading-tight text-white line-clamp-1">
                  {item.title}
                </h4>
                {item.subtitle && (
                  <p className="text-xs text-white/85 mt-0.5 line-clamp-1">
                    {item.subtitle}
                  </p>
                )}
                {item.content}
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => scroll('left')}
        className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#1f1f1f] shadow-md hover:bg-white cursor-pointer z-20"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={() => scroll('right')}
        className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#1f1f1f] shadow-md hover:bg-white cursor-pointer z-20"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {variant === 'full-screen' && (
        <div className="mt-2 flex justify-center gap-1.5">
          {items.map((it, i) => (
            <span
              key={it.id}
              className={cn(
                'h-2 rounded-full transition-all',
                i === activeIdx ? 'w-6 bg-[#0b57d0]' : 'w-2 bg-[#c4c7c5]'
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * 3. Official Material Design 3 (M3) Lists:
 * - One-line (56px), Two-line (72px), Three-line (88px)
 * - Leading: icon, avatar, image thumbnail (56x56), video thumbnail (114x64)
 * - Trailing: text, icon, switch, checkbox
 * - Expandable accordion item & Disabled state
 */
export interface M3ListItemProps extends React.HTMLAttributes<HTMLDivElement> {
  headline: string;
  overline?: string;
  supportingText?: string;
  lines?: 1 | 2 | 3;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  selected?: boolean;
  disabled?: boolean;
  interactive?: boolean;
  expandableContent?: React.ReactNode;
}

export function M3ListItem({
  headline,
  overline,
  supportingText,
  lines = 1,
  leading,
  trailing,
  selected = false,
  disabled = false,
  interactive = true,
  expandableContent,
  className,
  onClick,
  ...props
}: M3ListItemProps) {
  const [expanded, setExpanded] = useState(false);

  const heightMap = {
    1: 'min-h-[56px] py-2',
    2: 'min-h-[72px] py-3',
    3: 'min-h-[88px] py-3.5 items-start',
  };

  return (
    <div>
      <div
        onClick={(e) => {
          if (disabled) return;
          if (expandableContent) setExpanded(!expanded);
          onClick?.(e);
        }}
        className={cn(
          'flex items-center justify-between gap-4 px-4 transition-colors',
          heightMap[lines],
          selected ? 'bg-[#e8f0fe] text-[#001d35]' : 'bg-white text-[#1f1f1f]',
          interactive && !disabled && 'cursor-pointer hover:bg-[#1f1f1f]/[0.06]',
          disabled && 'opacity-38 pointer-events-none select-none',
          className
        )}
        {...props}
      >
        {leading && <div className="shrink-0 flex items-center">{leading}</div>}
        <div className="min-w-0 flex-1">
          {overline && (
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#444746]">
              {overline}
            </div>
          )}
          <div className="text-sm sm:text-base font-medium text-[#1f1f1f] truncate">
            {headline}
          </div>
          {supportingText && (
            <div
              className={cn(
                'text-xs sm:text-sm text-[#444746] mt-0.5',
                lines === 2 ? 'line-clamp-1' : 'line-clamp-2'
              )}
            >
              {supportingText}
            </div>
          )}
        </div>
        {(trailing || expandableContent) && (
          <div className="shrink-0 flex items-center gap-2 text-xs text-[#444746]">
            {trailing}
            {expandableContent && (
              <ChevronDown
                className={cn(
                  'w-5 h-5 transition-transform duration-200',
                  expanded && 'rotate-180'
                )}
              />
            )}
          </div>
        )}
      </div>
      {expandableContent && expanded && (
        <div className="bg-[#f8fafd] px-5 py-3 text-xs sm:text-sm text-[#444746] border-t border-[#e0e2e0]">
          {expandableContent}
        </div>
      )}
    </div>
  );
}

export function M3List({
  children,
  divided = false,
  className,
}: {
  children: React.ReactNode;
  divided?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'rounded-[16px] overflow-hidden border border-[#e0e2e0] bg-white',
        divided && 'divide-y divide-[#e0e2e0]',
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * 4. Official Material Design 3 (M3) Dividers:
 * - full-width
 * - inset (16px left margin)
 * - middle-inset (16px left & right margin)
 * - vertical
 */
export interface M3DividerProps {
  variant?: 'full-width' | 'inset' | 'middle-inset' | 'vertical';
  subhead?: string;
  className?: string;
}

export function M3Divider({
  variant = 'full-width',
  subhead,
  className,
}: M3DividerProps) {
  if (variant === 'vertical') {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={cn('w-[1px] self-stretch bg-[#c4c7c5]', className)}
      />
    );
  }

  return (
    <div className={cn('w-full', className)}>
      <div
        role="separator"
        className={cn(
          'h-[1px] bg-[#c4c7c5]',
          variant === 'inset' && 'ml-4',
          variant === 'middle-inset' && 'mx-4'
        )}
      />
      {subhead && (
        <div className="px-4 pt-2 pb-1 text-xs font-semibold text-[#444746]">
          {subhead}
        </div>
      )}
    </div>
  );
}
