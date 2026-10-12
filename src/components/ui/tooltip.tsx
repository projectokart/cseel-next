'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

const TooltipContext = React.createContext<{
  open: boolean;
  setOpen: (v: boolean) => void;
}>({ open: false, setOpen: () => {} });

const TooltipProvider = ({ children }: { children: React.ReactNode; delayDuration?: number }) => (
  <>{children}</>
);

const Tooltip = ({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
}: {
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}) => {
  const [uncontrolled, setUncontrolled] = React.useState(defaultOpen);
  const open = controlledOpen !== undefined ? controlledOpen : uncontrolled;
  const setOpen = (v: boolean) => {
    if (controlledOpen === undefined) setUncontrolled(v);
    onOpenChange?.(v);
  };
  return (
    <TooltipContext.Provider value={{ open, setOpen }}>
      <span className="relative inline-flex">{children}</span>
    </TooltipContext.Provider>
  );
};

const TooltipTrigger = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & { asChild?: boolean }
>(({ children, asChild, onMouseEnter, onMouseLeave, ...props }, ref) => {
  const { setOpen } = React.useContext(TooltipContext);
  return (
    <span
      ref={ref as any}
      onMouseEnter={(e) => {
        setOpen(true);
        onMouseEnter?.(e as any);
      }}
      onMouseLeave={(e) => {
        setOpen(false);
        onMouseLeave?.(e as any);
      }}
      className="inline-flex"
      {...props}
    >
      {children}
    </span>
  );
});
TooltipTrigger.displayName = 'TooltipTrigger';

const TooltipContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { sideOffset?: number; side?: string }
>(({ className, children, ...props }, ref) => {
  const { open } = React.useContext(TooltipContext);
  if (!open) return null;
  return (
    <div
      ref={ref}
      role="tooltip"
      className={cn(
        'absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-[1400] whitespace-nowrap rounded-[6px] bg-[#303030] px-2.5 py-1 text-xs font-medium text-[#f2f2f2] shadow-[0_2px_6px_rgba(0,0,0,0.25)] pointer-events-none',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
TooltipContent.displayName = 'TooltipContent';

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
