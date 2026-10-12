'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        'flex min-h-[104px] w-full rounded-[8px] border border-[#747775] bg-white px-4 py-3 text-sm text-[#1f1f1f] transition-all placeholder:text-[#444746]/70 hover:border-[#1f1f1f] focus-visible:outline-none focus-visible:border-2 focus-visible:border-[#0b57d0] disabled:cursor-not-allowed disabled:pointer-events-none disabled:border-[#1f1f1f]/[0.12] disabled:bg-transparent disabled:text-[#1f1f1f]/[0.38] disabled:placeholder:text-[#1f1f1f]/[0.38]',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = 'Textarea';

export { Textarea };
