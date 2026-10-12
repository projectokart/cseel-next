'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Check,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';

/* ============================================================================
 * 1. GOOGLE MATERIAL 3 SIDE DRAWER (Left Navigation / Right Filter & Cart)
 * ========================================================================== */
export interface GoogleSideDrawerProps {
  open: boolean;
  onClose: () => void;
  side?: 'left' | 'right';
  title?: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
  footer?: React.ReactNode;
  widthClass?: string;
  children: React.ReactNode;
}

export function GoogleSideDrawer({
  open,
  onClose,
  side = 'left',
  title,
  subtitle,
  headerAction,
  footer,
  widthClass = 'w-[88vw] max-w-[360px]',
  children,
}: GoogleSideDrawerProps) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1150] flex bg-[#0f172a]/50 backdrop-blur-[2px] animate-in fade-in duration-200"
      style={{ justifyContent: side === 'right' ? 'flex-end' : 'flex-start' }}
      onClick={onClose}
    >
      <aside
        onClick={(e) => e.stopPropagation()}
        className={`relative h-full bg-white text-[#1f1f1f] shadow-[0_12px_36px_rgba(0,0,0,0.24)] flex flex-col overflow-hidden ${widthClass} ${
          side === 'left'
            ? 'rounded-r-[28px] animate-in slide-in-from-left duration-250'
            : 'rounded-l-[28px] animate-in slide-in-from-right duration-250'
        }`}
      >
        {(title || headerAction) && (
          <div className="px-5 py-4 border-b border-slate-200/80 flex items-center justify-between gap-2 shrink-0 bg-white">
            <div className="min-w-0">
              {title && <h2 className="text-base font-bold text-[#1f1f1f] truncate">{title}</h2>}
              {subtitle && <p className="text-xs text-[#444746] truncate mt-0.5">{subtitle}</p>}
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {headerAction}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close drawer"
                className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center text-[#444746] hover:text-[#1f1f1f] transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto overscroll-contain p-5">{children}</div>

        {footer && (
          <div className="p-4 border-t border-slate-200/80 bg-white shrink-0">{footer}</div>
        )}
      </aside>
    </div>
  );
}

/* ============================================================================
 * 2. GOOGLE MATERIAL 3 DRAGGABLE BOTTOM SHEET
 * ========================================================================== */
export interface GoogleBottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  badgeText?: string;
  initialSnap?: 'mini' | 'default' | 'expanded';
  footer?: React.ReactNode;
  children: React.ReactNode;
}

export function GoogleBottomSheet({
  open,
  onClose,
  title,
  badgeText,
  initialSnap = 'default',
  footer,
  children,
}: GoogleBottomSheetProps) {
  const [snap, setSnap] = useState<'mini' | 'default' | 'expanded'>(initialSnap);
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startYRef = useRef<number | null>(null);

  useEffect(() => {
    if (open) {
      setSnap(initialSnap);
      setDragY(0);
    }
  }, [open, initialSnap]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const heightMap = {
    mini: '44dvh',
    default: '82dvh',
    expanded: '95dvh',
  };

  return (
    <div
      className="fixed inset-0 z-[1200] flex flex-col justify-end bg-[#0f172a]/50 backdrop-blur-[2px] animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          height: heightMap[snap],
          maxHeight: '96dvh',
          transform: `translateY(${Math.max(0, dragY)}px)`,
          transition: dragging ? 'none' : 'height 0.25s ease, transform 0.22s ease',
        }}
        className="w-full max-w-[920px] mx-auto bg-white rounded-t-[28px] shadow-[0_-12px_40px_rgba(0,0,0,0.25)] border-t border-slate-200/80 flex flex-col overflow-hidden"
      >
        {/* Drag Handle Header */}
        <div
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            startYRef.current = e.clientY;
            setDragging(true);
          }}
          onPointerMove={(e) => {
            if (!dragging || startYRef.current === null) return;
            setDragY(Math.max(-140, e.clientY - startYRef.current));
          }}
          onPointerUp={(e) => {
            if (!dragging) return;
            e.currentTarget.releasePointerCapture(e.pointerId);
            setDragging(false);
            const delta = dragY;
            startYRef.current = null;
            setDragY(0);
            if (delta < -40) setSnap('expanded');
            else if (delta > 110) onClose();
          }}
          className="px-5 pt-3 pb-2.5 border-b border-slate-200/80 flex flex-col items-center select-none touch-none cursor-grab active:cursor-grabbing shrink-0 bg-white"
        >
          <div className="w-10 h-1.5 rounded-full bg-[#747775]/40 mb-2" />
          <div className="w-full flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              {badgeText && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#e8f0fe] text-[#0b57d0]">
                  {badgeText}
                </span>
              )}
              {title && <h3 className="text-base font-bold text-[#1f1f1f] truncate">{title}</h3>}
            </div>
            <div className="flex items-center gap-1.5" onPointerDown={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => setSnap((s) => (s === 'expanded' ? 'default' : 'expanded'))}
                className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-[#1f1f1f] flex items-center gap-1 cursor-pointer"
              >
                {snap === 'expanded' ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                <span>{snap === 'expanded' ? 'Half' : 'Full'}</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-[#444746] cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain">{children}</div>

        {footer && (
          <div className="p-4 border-t border-slate-200/80 bg-white shrink-0">{footer}</div>
        )}
      </div>
    </div>
  );
}

/* ============================================================================
 * 3. GOOGLE MATERIAL 3 DIALOG / POPUP MODAL (Basic, Alert, Full-screen)
 * ========================================================================== */
export interface GoogleDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  variant?: 'basic' | 'alert' | 'full-screen';
  heroIcon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  size?: 'sm' | 'md' | 'lg';
  footer?: React.ReactNode;
  children?: React.ReactNode;
}

export function GoogleDialog({
  open,
  onClose,
  title,
  description,
  variant = 'basic',
  heroIcon,
  actionLabel = 'Save',
  onAction,
  size = 'md',
  footer,
  children,
}: GoogleDialogProps) {
  if (!open) return null;

  if (variant === 'full-screen') {
    return (
      <div className="fixed inset-0 z-[1300] flex flex-col bg-[#f8fafd] text-[#1f1f1f] animate-in slide-in-from-bottom-4 duration-200">
        <header className="flex h-16 items-center justify-between border-b border-[#e0e2e0] px-4 bg-[#eef3fc]">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-10 w-10 rounded-full hover:bg-black/10 flex items-center justify-center text-[#1f1f1f] cursor-pointer"
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-bold text-[#1f1f1f]">{title}</h2>
          </div>
          <button
            type="button"
            onClick={() => {
              onAction?.();
              onClose();
            }}
            className="rounded-full bg-[#0b57d0] px-5 py-2 text-sm font-semibold text-white hover:bg-[#0842a0] cursor-pointer"
          >
            {actionLabel}
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    );
  }

  const maxW =
    size === 'sm' ? 'max-w-[400px]' : size === 'lg' ? 'max-w-[840px]' : 'max-w-[520px]';

  return (
    <div
      className="fixed inset-0 z-[1300] flex items-center justify-center p-4 bg-[#0f172a]/50 backdrop-blur-[2px] animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full ${maxW} rounded-[28px] bg-[#eef3fc] p-6 text-[#1f1f1f] shadow-[0_12px_36px_rgba(0,0,0,0.24)] border border-[#e0e2e0] animate-in zoom-in-95 duration-200`}
      >
        {heroIcon && (
          <div className="mb-3 flex justify-center text-[#0b57d0] [&_svg]:w-7 [&_svg]:h-7">
            {heroIcon}
          </div>
        )}
        <div
          className={`flex items-start justify-between gap-3 mb-3 ${
            heroIcon ? 'text-center flex-col items-center' : ''
          }`}
        >
          <div className="w-full">
            <h2 className="text-xl font-bold text-[#1f1f1f]">{title}</h2>
            {description && <p className="text-sm text-[#444746] mt-1.5">{description}</p>}
          </div>
          {!heroIcon && variant !== 'alert' && (
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full hover:bg-black/10 flex items-center justify-center text-[#444746] shrink-0 cursor-pointer"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {children && <div className="my-3">{children}</div>}

        {footer && <div className="flex items-center justify-end gap-2 pt-3">{footer}</div>}
      </div>
    </div>
  );
}

/* ============================================================================
 * 4. GOOGLE MATERIAL 3 SNACKBAR / TOAST NOTIFICATION
 * ========================================================================== */
export interface GoogleSnackbarProps {
  message: string | null;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
  actionLabel?: string;
  onAction?: () => void;
  onClose?: () => void;
}

export function GoogleSnackbar({
  message,
  variant = 'default',
  actionLabel,
  onAction,
  onClose,
}: GoogleSnackbarProps) {
  if (!message) return null;

  const iconMap = {
    default: <Check size={16} className="text-[#a8c7fa]" />,
    success: <CheckCircle2 size={16} className="text-emerald-400" />,
    error: <AlertCircle size={16} className="text-rose-400" />,
    warning: <AlertTriangle size={16} className="text-amber-400" />,
    info: <Info size={16} className="text-sky-400" />,
  };

  return (
    <div className="fixed bottom-6 right-6 z-[1400] max-w-md bg-[#303030] text-[#f2f2f2] px-4 py-3 rounded-2xl shadow-[0_6px_20px_rgba(0,0,0,0.3)] flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
      {iconMap[variant]}
      <span className="text-xs sm:text-sm font-semibold leading-snug">{message}</span>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="ml-2 text-xs font-bold text-[#a8c7fa] hover:underline shrink-0 cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="ml-1 text-[#c4c7c5] hover:text-white cursor-pointer"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}
