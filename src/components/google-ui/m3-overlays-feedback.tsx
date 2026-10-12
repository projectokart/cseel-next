'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { X, ChevronDown, ChevronRight, Check } from 'lucide-react';

/**
 * 1. Official Material Design 3 (M3) Progress Indicators (@material/web/progress):
 * - Linear (<md-linear-progress>): determinate, indeterminate, buffer, fourColor
 * - Circular (<md-circular-progress>): determinate, indeterminate, fourColor, with percentage label
 */
export interface M3LinearProgressProps {
  value?: number;
  bufferValue?: number;
  indeterminate?: boolean;
  fourColor?: boolean;
  className?: string;
}

export function M3LinearProgress({
  value = 60,
  bufferValue,
  indeterminate = false,
  fourColor = false,
  className,
}: M3LinearProgressProps) {
  return (
    <div
      role="progressbar"
      aria-valuenow={indeterminate ? undefined : value}
      className={cn(
        'relative h-1.5 w-full overflow-hidden rounded-full bg-[#d3e3fd]',
        className
      )}
    >
      {bufferValue !== undefined && !indeterminate && (
        <div
          style={{ width: `${Math.min(100, Math.max(0, bufferValue))}%` }}
          className="absolute inset-y-0 left-0 rounded-full bg-[#a8c7fa] transition-all duration-300"
        />
      )}
      <div
        style={
          indeterminate
            ? { width: '55%' }
            : { width: `${Math.min(100, Math.max(0, value))}%` }
        }
        className={cn(
          'relative z-10 h-full rounded-full transition-all duration-300',
          fourColor
            ? 'bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC05] to-[#34A853]'
            : 'bg-[#0b57d0]',
          indeterminate && 'animate-pulse'
        )}
      />
    </div>
  );
}

export interface M3CircularProgressProps {
  value?: number;
  indeterminate?: boolean;
  fourColor?: boolean;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  className?: string;
}

export function M3CircularProgress({
  value = 70,
  indeterminate = true,
  fourColor = false,
  size = 44,
  strokeWidth = 4,
  showLabel = false,
  className,
}: M3CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset =
    circumference - ((indeterminate ? 70 : value) / 100) * circumference;
  const gradId = React.useId();

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className={cn(indeterminate && 'animate-spin')}
      >
        {fourColor && (
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4285F4" />
              <stop offset="35%" stopColor="#EA4335" />
              <stop offset="70%" stopColor="#FBBC05" />
              <stop offset="100%" stopColor="#34A853" />
            </linearGradient>
          </defs>
        )}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#d3e3fd"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={fourColor ? `url(#${gradId})` : '#0b57d0'}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      {showLabel && !indeterminate && (
        <span className="absolute text-[10px] font-bold text-[#0b57d0]">
          {Math.round(value)}%
        </span>
      )}
    </div>
  );
}

/**
 * 2. Official Material Design 3 (M3) Menus & Submenus (@material/web/menu & @material/web/select):
 * - Dropdown Menu (<md-menu> + <md-menu-item>)
 * - Cascading Nested Sub-Menu (<md-sub-menu> via subItems)
 * - Exposed Dropdown Select (<md-filled-select> & <md-outlined-select>)
 * - Contextual Menu
 */
export interface M3MenuItem {
  id: string;
  label: string;
  leadingIcon?: React.ReactNode;
  trailingText?: string;
  dividerAfter?: boolean;
  disabled?: boolean;
  subItems?: M3MenuItem[];
}

export interface M3MenuProps {
  variant?: 'dropdown' | 'exposed-dropdown' | 'contextual';
  fieldStyle?: 'outlined' | 'filled';
  label?: string;
  supportingText?: string;
  required?: boolean;
  error?: boolean;
  disabled?: boolean;
  items: M3MenuItem[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  className?: string;
}

export function M3Menu({
  variant = 'dropdown',
  fieldStyle = 'outlined',
  label = 'Choose option',
  supportingText,
  required = false,
  error = false,
  disabled = false,
  items,
  selectedId,
  onSelect,
  className,
}: M3MenuProps) {
  const [open, setOpen] = useState(false);
  const [activeSubMenuId, setActiveSubMenuId] = useState<string | null>(null);
  const selectedItem = items.find((i) => i.id === selectedId);

  return (
    <div className={cn('relative inline-block w-full max-w-[260px]', className)}>
      {variant === 'exposed-dropdown' ? (
        <div>
          <button
            type="button"
            disabled={disabled}
            onClick={() => !disabled && setOpen(!open)}
            className={cn(
              'flex h-14 w-full items-center justify-between px-4 text-left transition-colors cursor-pointer disabled:pointer-events-none disabled:cursor-not-allowed',
              disabled
                ? fieldStyle === 'filled'
                  ? 'rounded-t-[8px] bg-[#1f1f1f]/[0.04] border-b border-[#1f1f1f]/[0.38] text-[#1f1f1f]/[0.38]'
                  : 'rounded-[8px] border border-[#1f1f1f]/[0.12] bg-transparent text-[#1f1f1f]/[0.38]'
                : fieldStyle === 'filled'
                ? cn(
                    'rounded-t-[8px] bg-[#e9eef6] border-b-2',
                    error ? 'border-[#b3261e]' : 'border-[#444746] focus:border-[#0b57d0]'
                  )
                : cn(
                    'rounded-[8px] border bg-white hover:border-[#1f1f1f] focus:border-2',
                    error
                      ? 'border-[#b3261e] focus:border-[#b3261e]'
                      : 'border-[#747775] focus:border-[#0b57d0]'
                  )
            )}
          >
            <div>
              <div
                className={cn(
                  'text-[11px] font-medium',
                  disabled
                    ? 'text-[#1f1f1f]/[0.38]'
                    : error
                    ? 'text-[#b3261e]'
                    : 'text-[#444746]'
                )}
              >
                {label}
                {required && ' *'}
              </div>
              <div
                className={cn(
                  'text-sm font-medium',
                  disabled ? 'text-[#1f1f1f]/[0.38]' : 'text-[#1f1f1f]'
                )}
              >
                {selectedItem ? selectedItem.label : 'Select...'}
              </div>
            </div>
            <ChevronDown
              className={cn(
                'w-5 h-5 transition-transform',
                disabled ? 'text-[#1f1f1f]/[0.38]' : error ? 'text-[#b3261e]' : 'text-[#444746]',
                open && 'rotate-180'
              )}
            />
          </button>
          {supportingText && (
            <p
              className={cn(
                'mt-1 px-4 text-xs',
                disabled
                  ? 'text-[#1f1f1f]/[0.38]'
                  : error
                  ? 'text-[#b3261e]'
                  : 'text-[#444746]'
              )}
            >
              {supportingText}
            </p>
          )}
        </div>
      ) : (
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setOpen(!open)}
          className="inline-flex h-10 items-center gap-2 rounded-full border border-[#747775] bg-white px-4 text-sm font-semibold text-[#0b57d0] hover:bg-[#0b57d0]/[0.08] disabled:border-[#1f1f1f]/[0.12] disabled:text-[#1f1f1f]/[0.38] disabled:pointer-events-none cursor-pointer"
        >
          <span>{label}</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      )}

      {open && (
        <div className="mt-1.5 w-full rounded-[12px] bg-[#eef3fc] py-2 shadow-[0_2px_6px_2px_rgba(60,64,67,0.15),0_1px_2px_rgba(60,64,67,0.3)] border border-[#e0e2e0] z-50">
          {items.map((item) => {
            const active = item.id === selectedId;
            const hasSubMenu = Boolean(item.subItems && item.subItems.length > 0);
            const subOpen = activeSubMenuId === item.id;

            return (
              <div
                key={item.id}
                className="relative"
                onMouseEnter={() => hasSubMenu && setActiveSubMenuId(item.id)}
                onMouseLeave={() => hasSubMenu && setActiveSubMenuId(null)}
              >
                <button
                  type="button"
                  disabled={item.disabled}
                  onClick={() => {
                    if (hasSubMenu) {
                      setActiveSubMenuId(subOpen ? null : item.id);
                      return;
                    }
                    onSelect?.(item.id);
                    setOpen(false);
                  }}
                  className={cn(
                    'flex h-11 w-full items-center justify-between px-4 text-sm transition-colors cursor-pointer disabled:text-[#1f1f1f]/[0.38] disabled:pointer-events-none [&_svg]:w-[18px] [&_svg]:h-[18px]',
                    active
                      ? 'bg-[#c2e7ff] font-semibold text-[#001d35]'
                      : 'text-[#1f1f1f] hover:bg-[#1f1f1f]/[0.08]'
                  )}
                >
                  <span className="flex items-center gap-3">
                    {item.leadingIcon}
                    <span>{item.label}</span>
                  </span>
                  <span className="flex items-center gap-2 text-xs text-[#444746]">
                    {item.trailingText}
                    {active && <Check className="w-4 h-4 text-[#001d35]" />}
                    {hasSubMenu && <ChevronRight className="w-4 h-4 text-[#444746]" />}
                  </span>
                </button>

                {/* @material/web <md-sub-menu> cascading nested submenu */}
                {hasSubMenu && subOpen && (
                  <div className="mt-0.5 mx-2 rounded-[10px] bg-[#e3e9f4] py-1.5 shadow-md border border-[#c4c7c5]">
                    {item.subItems!.map((sub) => (
                      <button
                        key={sub.id}
                        type="button"
                        disabled={sub.disabled}
                        onClick={() => {
                          onSelect?.(sub.id);
                          setActiveSubMenuId(null);
                          setOpen(false);
                        }}
                        className="flex h-9 w-full items-center justify-between px-3.5 text-xs font-medium text-[#1f1f1f] hover:bg-[#0b57d0]/[0.1] rounded-md cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          {sub.leadingIcon}
                          <span>{sub.label}</span>
                        </span>
                        {sub.trailingText && (
                          <span className="text-[11px] text-[#444746]">{sub.trailingText}</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {item.dividerAfter && <div className="my-1 h-[1px] bg-[#c4c7c5]" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/**
 * Official @material/web Select (<md-filled-select> & <md-outlined-select>)
 */
export function M3Select(
  props: Omit<M3MenuProps, 'variant'> & { variant?: 'filled' | 'outlined' }
) {
  const { variant = 'outlined', ...rest } = props;
  return <M3Menu {...rest} variant="exposed-dropdown" fieldStyle={variant} />;
}


/**
 * 3. Official Material Design 3 (M3) Tooltips:
 * - Plain Tooltip (compact dark pill)
 * - Rich Tooltip (surface container card with title, body & action)
 */
export interface M3TooltipProps {
  variant?: 'plain' | 'rich';
  title?: string;
  text: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function M3TooltipPreview({
  variant = 'plain',
  title,
  text,
  actionLabel,
  onAction,
  className,
}: M3TooltipProps) {
  if (variant === 'plain') {
    return (
      <div
        className={cn(
          'inline-flex items-center rounded-[6px] bg-[#303030] px-2.5 py-1 text-xs font-medium text-[#f2f2f2] shadow-sm',
          className
        )}
      >
        {text}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'max-w-[312px] rounded-[12px] bg-[#eef3fc] p-4 text-[#1f1f1f] shadow-[0_2px_6px_2px_rgba(60,64,67,0.15),0_1px_2px_rgba(60,64,67,0.3)] border border-[#e0e2e0]',
        className
      )}
    >
      {title && (
        <div className="text-sm font-bold text-[#444746] mb-1">{title}</div>
      )}
      <p className="text-xs leading-relaxed text-[#444746]">{text}</p>
      {actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className="mt-2.5 text-xs font-bold text-[#0b57d0] hover:underline cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

/**
 * 4. Official Material Design 3 (M3) Snackbars:
 * - Single-line
 * - Two-line
 * - With action & close icon
 */
export interface M3SnackbarBoxProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  showClose?: boolean;
  onClose?: () => void;
  twoLine?: boolean;
  className?: string;
}

export function M3SnackbarBox({
  message,
  actionLabel,
  onAction,
  showClose = false,
  onClose,
  twoLine = false,
  className,
}: M3SnackbarBoxProps) {
  return (
    <div
      role="status"
      className={cn(
        'flex w-full max-w-[420px] items-center justify-between gap-3 rounded-[8px] bg-[#303030] px-4 text-sm text-[#f2f2f2] shadow-[0_3px_5px_-1px_rgba(0,0,0,0.2),0_6px_10px_0_rgba(0,0,0,0.14)]',
        twoLine ? 'min-h-[68px] py-3' : 'min-h-[48px] py-2',
        className
      )}
    >
      <span className={cn('flex-1', twoLine ? 'line-clamp-2' : 'truncate')}>
        {message}
      </span>
      <div className="flex items-center gap-2 shrink-0">
        {actionLabel && (
          <button
            type="button"
            onClick={onAction}
            className="px-2 py-1 text-sm font-bold text-[#a8c7fa] hover:bg-white/10 rounded cursor-pointer"
          >
            {actionLabel}
          </button>
        )}
        {showClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[#f2f2f2]/80 hover:text-white rounded-full hover:bg-white/10 cursor-pointer"
            aria-label="Close snackbar"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * 5. Official Material Design 3 (M3) Unified Sheets & Drawers:
 * - side: 'left' | 'right' | 'top' | 'bottom'
 * - mode: 'modal' (scrim overlay) | 'standard' (coplanar inline surface)
 * - detached: floating 16px from edge with all 4 corners rounded-[28px]
 */
export interface M3SheetProps {
  side?: 'left' | 'right' | 'top' | 'bottom';
  mode?: 'modal' | 'standard';
  detached?: boolean;
  open?: boolean;
  onClose?: () => void;
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function M3Sheet({
  side = 'right',
  mode = 'modal',
  detached = false,
  open = true,
  onClose,
  title,
  subtitle,
  footer,
  children,
  className,
}: M3SheetProps) {
  if (!open) return null;

  const sideClasses = {
    left: detached
      ? 'm3-sheet rounded-[28px] m-4 w-[88vw] max-w-[360px] h-[calc(100%-2rem)] border border-[#c4c7c5]'
      : 'm3-sheet m3-sheet--left w-[88vw] max-w-[360px] h-full border-r border-[#c4c7c5]',
    right: detached
      ? 'm3-sheet rounded-[28px] m-4 w-[88vw] max-w-[380px] h-[calc(100%-2rem)] border border-[#c4c7c5]'
      : 'm3-sheet m3-sheet--right w-[88vw] max-w-[380px] h-full border-l border-[#c4c7c5]',
    top: detached
      ? 'm3-sheet rounded-[28px] m-4 w-[calc(100%-2rem)] max-w-[920px] mx-auto border border-[#c4c7c5]'
      : 'm3-sheet m3-sheet--top w-full max-w-[920px] mx-auto border-b border-[#c4c7c5]',
    bottom: detached
      ? 'm3-sheet rounded-[28px] m-4 w-[calc(100%-2rem)] max-w-[920px] mx-auto border border-[#c4c7c5]'
      : 'm3-sheet m3-sheet--bottom w-full max-w-[920px] mx-auto border-t border-[#c4c7c5]',
  };

  const sheetSurface = (
    <div
      onClick={(e) => e.stopPropagation()}
      className={cn(
        'flex flex-col overflow-hidden bg-[#f8fafd] text-[#1f1f1f]',
        sideClasses[side],
        className
      )}
    >
      {(side === 'bottom' || side === 'top') && (
        <div className="flex justify-center pt-3 pb-1">
          <div className="h-1 w-9 rounded-full bg-[#747775]/40" />
        </div>
      )}
      {(title || onClose) && (
        <div className="flex items-center justify-between gap-2 border-b border-[#e0e2e0] px-5 py-3.5">
          <div>
            {title && <h3 className="text-base font-bold text-[#1f1f1f]">{title}</h3>}
            {subtitle && <p className="text-xs text-[#444746] mt-0.5">{subtitle}</p>}
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full text-[#444746] hover:bg-black/10 cursor-pointer"
              aria-label="Close sheet"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
      <div className="flex-1 overflow-y-auto p-5">{children}</div>
      {footer && <div className="border-t border-[#e0e2e0] p-4 bg-white">{footer}</div>}
    </div>
  );

  if (mode === 'standard') {
    return sheetSurface;
  }

  const alignClass =
    side === 'left'
      ? 'justify-start items-stretch'
      : side === 'right'
      ? 'justify-end items-stretch'
      : side === 'top'
      ? 'flex-col justify-start'
      : 'flex-col justify-end';

  return (
    <div
      onClick={onClose}
      className={cn(
        'fixed inset-0 z-[1250] flex bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-200',
        alignClass
      )}
    >
      {sheetSurface}
    </div>
  );
}

export const M3LeftDrawer = (props: Omit<M3SheetProps, 'side'>) => (
  <M3Sheet {...props} side="left" />
);
export const M3RightSheet = (props: Omit<M3SheetProps, 'side'>) => (
  <M3Sheet {...props} side="right" />
);
export const M3TopSheet = (props: Omit<M3SheetProps, 'side'>) => (
  <M3Sheet {...props} side="top" />
);
export const M3BottomSheet = (props: Omit<M3SheetProps, 'side'>) => (
  <M3Sheet {...props} side="bottom" />
);
