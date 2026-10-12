'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useM3Ripple } from '@/components/google-ui/m3-tokens';

const buttonVariants = cva(
  'm3-btn relative overflow-hidden inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b57d0] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:size-[18px] [&_svg]:shrink-0 cursor-pointer select-none',
  {
    variants: {
      variant: {
        // Official M3 Variants: Filled, Elevated, Tonal, Outlined, Text (+ Official M3 Disabled Specs)
        filled:
          'bg-[#0b57d0] text-white hover:bg-[#0842a0] hover:shadow-[0_1px_2px_rgba(60,64,67,0.3),0_1px_3px_1px_rgba(60,64,67,0.15)] border-none disabled:bg-[#1f1f1f]/[0.12] disabled:text-[#1f1f1f]/[0.38] disabled:shadow-none',
        elevated:
          'bg-[#f8fafd] text-[#0b57d0] shadow-[0_1px_2px_rgba(60,64,67,0.3),0_1px_3px_1px_rgba(60,64,67,0.15)] hover:bg-[#eef3fc] hover:shadow-[0_1px_2px_rgba(60,64,67,0.3),0_2px_6px_2px_rgba(60,64,67,0.15)] border-none disabled:bg-[#1f1f1f]/[0.12] disabled:text-[#1f1f1f]/[0.38] disabled:shadow-none',
        tonal:
          'bg-[#c2e7ff] text-[#001d35] hover:bg-[#b1defc] hover:shadow-[0_1px_2px_rgba(60,64,67,0.2)] border-none font-semibold disabled:bg-[#1f1f1f]/[0.12] disabled:text-[#1f1f1f]/[0.38] disabled:shadow-none',
        outlined:
          'border border-[#747775] bg-transparent text-[#0b57d0] hover:bg-[#0b57d0]/[0.08] focus-visible:border-[#0b57d0] disabled:border-[#1f1f1f]/[0.12] disabled:text-[#1f1f1f]/[0.38] disabled:bg-transparent',
        text:
          'bg-transparent text-[#0b57d0] hover:bg-[#0b57d0]/[0.08] px-3 disabled:text-[#1f1f1f]/[0.38] disabled:bg-transparent',
        // Aliases mapped 100% to Official M3 Variants
        default:
          'bg-[#0b57d0] text-white hover:bg-[#0842a0] hover:shadow-[0_1px_2px_rgba(60,64,67,0.3),0_1px_3px_1px_rgba(60,64,67,0.15)] border-none disabled:bg-[#1f1f1f]/[0.12] disabled:text-[#1f1f1f]/[0.38] disabled:shadow-none',
        cseel:
          'rounded-full bg-[#005689] text-white hover:bg-[#003c6e] shadow-[0_1px_3px_rgba(0,86,137,0.3)] hover:shadow-[0_4px_12px_rgba(0,86,137,0.35)] border-none font-bold disabled:bg-[#1f1f1f]/[0.12] disabled:text-[#1f1f1f]/[0.38] disabled:shadow-none',
        google:
          'rounded-full bg-[#0b57d0] text-white hover:bg-[#0842a0] shadow-[0_1px_2px_rgba(60,64,67,0.3)] hover:shadow-[0_2px_6px_rgba(60,64,67,0.25)] border-none font-semibold disabled:bg-[#1f1f1f]/[0.12] disabled:text-[#1f1f1f]/[0.38] disabled:shadow-none',
        destructive:
          'rounded-full bg-[#b3261e] text-white hover:bg-[#8c1d18] shadow-xs disabled:bg-[#1f1f1f]/[0.12] disabled:text-[#1f1f1f]/[0.38] disabled:shadow-none',
        outline:
          'rounded-full border border-[#747775] bg-transparent text-[#0b57d0] hover:bg-[#0b57d0]/[0.08] focus-visible:border-[#0b57d0] disabled:border-[#1f1f1f]/[0.12] disabled:text-[#1f1f1f]/[0.38] disabled:bg-transparent',
        secondary:
          'rounded-full bg-[#c2e7ff] text-[#001d35] hover:bg-[#b1defc] border-none font-semibold disabled:bg-[#1f1f1f]/[0.12] disabled:text-[#1f1f1f]/[0.38] disabled:shadow-none',
        ghost:
          'rounded-full bg-transparent text-[#0b57d0] hover:bg-[#0b57d0]/[0.08] disabled:text-[#1f1f1f]/[0.38] disabled:bg-transparent',
        link: 'text-[#0b57d0] underline-offset-4 hover:underline font-semibold p-0 h-auto disabled:text-[#1f1f1f]/[0.38]',
      },
      size: {
        default: 'h-10 px-6 py-2.5 rounded-full',
        sm: 'h-9 rounded-full px-4 text-xs',
        lg: 'h-12 rounded-full px-7 text-base',
        icon: 'h-10 w-10 rounded-full p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, onMouseDown, disabled, children, ...props }, ref) => {
    const { ripples, triggerRipple } = useM3Ripple();

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, {
        className: cn(buttonVariants({ variant, size, className }), (children.props as any)?.className),
      });
    }

    return (
      <button
        ref={ref}
        disabled={disabled}
        onMouseDown={(e) => {
          if (!disabled) triggerRipple(e);
          onMouseDown?.(e);
        }}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {children}
        {!disabled && (
          <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
            {ripples.map((r) => (
              <span
                key={r.id}
                style={{ left: r.x, top: r.y, width: r.size, height: r.size }}
                className={cn(
                  'absolute rounded-full animate-ping opacity-30',
                  variant === 'default' || variant === 'filled' || variant === 'cseel' || variant === 'google' || variant === 'destructive'
                    ? 'bg-white'
                    : 'bg-[#0b57d0]'
                )}
              />
            ))}
          </span>
        )}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
