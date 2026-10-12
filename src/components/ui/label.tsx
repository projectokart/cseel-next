'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      'text-xs font-semibold tracking-wide text-[#444746] leading-none peer-disabled:cursor-not-allowed peer-disabled:text-[#1f1f1f]/[0.38]',
      className
    )}
    {...props}
  />
));
Label.displayName = 'Label';

export { Label };
