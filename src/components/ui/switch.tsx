'use client';

import * as React from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SwitchProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  withIcons?: boolean;
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      className,
      checked: controlledChecked,
      defaultChecked = false,
      onCheckedChange,
      withIcons = true,
      disabled,
      onClick,
      ...props
    },
    ref
  ) => {
    const [uncontrolled, setUncontrolled] = React.useState(defaultChecked);
    const isChecked =
      controlledChecked !== undefined ? controlledChecked : uncontrolled;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      const next = !isChecked;
      if (controlledChecked === undefined) setUncontrolled(next);
      onCheckedChange?.(next);
      onClick?.(e);
    };

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={isChecked}
        disabled={disabled}
        onClick={handleClick}
        className={cn(
          'relative inline-flex h-8 w-[52px] shrink-0 items-center rounded-full border-2 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b57d0] cursor-pointer disabled:pointer-events-none disabled:cursor-not-allowed',
          isChecked
            ? 'border-transparent bg-[#0b57d0] disabled:bg-[#1f1f1f]/[0.12]'
            : 'border-[#747775] bg-[#e0e2e0] disabled:border-[#1f1f1f]/[0.12] disabled:bg-[#e0e2e0]/40',
          className
        )}
        {...props}
      >
        <span
          className={cn(
            'inline-flex items-center justify-center rounded-full transition-all duration-200 shadow-xs',
            isChecked
              ? 'h-6 w-6 translate-x-[22px] bg-white text-[#0b57d0]'
              : withIcons
              ? 'h-6 w-6 translate-x-0.5 bg-[#747775] text-white'
              : 'h-4 w-4 translate-x-1.5 bg-[#747775] text-white',
            disabled &&
              (isChecked
                ? 'bg-white text-[#1f1f1f]/[0.38]'
                : 'bg-[#1f1f1f]/[0.38] text-white')
          )}
        >
          {withIcons &&
            (isChecked ? (
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            ) : (
              <X className="w-3.5 h-3.5 stroke-[3]" />
            ))}
        </span>
      </button>
    );
  }
);
Switch.displayName = 'Switch';

export { Switch };
