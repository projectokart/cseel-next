'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const ToastProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;

const ToastViewport = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'fixed top-0 z-[1400] flex max-h-screen w-full flex-col-reverse p-4 pointer-events-none sm:bottom-4 sm:right-4 sm:top-auto sm:flex-col md:max-w-[420px]',
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = 'ToastViewport';

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full min-h-[48px] items-center justify-between gap-3 overflow-hidden rounded-[8px] px-4 py-3 text-sm shadow-[0_3px_5px_-1px_rgba(0,0,0,0.2),0_6px_10px_0_rgba(0,0,0,0.14)] transition-all animate-in fade-in slide-in-from-bottom-4 duration-200',
  {
    variants: {
      variant: {
        default: 'bg-[#303030] text-[#f2f2f2] border border-transparent',
        destructive: 'bg-[#b3261e] text-white border border-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface ToastProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toastVariants> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant, open = true, ...props }, ref) => {
    if (!open) return null;
    return <div ref={ref} role="status" className={cn(toastVariants({ variant }), className)} {...props} />;
  }
);
Toast.displayName = 'Toast';

const ToastAction = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { altText?: string }
>(({ className, altText, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    aria-label={altText}
    className={cn(
      'inline-flex h-8 shrink-0 items-center justify-center rounded-full px-3 text-sm font-bold text-[#a8c7fa] hover:bg-white/10 transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-38 cursor-pointer',
      className
    )}
    {...props}
  />
));
ToastAction.displayName = 'ToastAction';

const ToastClose = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    className={cn(
      'rounded-full p-1 text-[#f2f2f2]/80 hover:text-white hover:bg-white/10 transition-colors focus:outline-none cursor-pointer',
      className
    )}
    {...props}
  >
    <X className="h-4 w-4" />
  </button>
));
ToastClose.displayName = 'ToastClose';

const ToastTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('text-sm font-bold text-[#f2f2f2]', className)} {...props} />
));
ToastTitle.displayName = 'ToastTitle';

const ToastDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('text-xs text-[#f2f2f2]/90', className)} {...props} />
));
ToastDescription.displayName = 'ToastDescription';

type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};
