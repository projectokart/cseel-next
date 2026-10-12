'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full border px-3 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#0b57d0] focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-[#e8f0fe] text-[#0b57d0] hover:bg-[#d2e3fc]',
        secondary: 'border-transparent bg-[#f1f3f4] text-[#444746] hover:bg-[#e8eaed]',
        destructive: 'border-transparent bg-[#fce8e6] text-[#c5221f] hover:bg-[#fad2cf]',
        outline: 'border-[#747775]/50 text-[#444746] bg-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
