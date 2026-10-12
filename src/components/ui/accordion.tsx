'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccordionContextValue {
  openValues: string[];
  toggleValue: (val: string) => void;
}

const AccordionContext = React.createContext<AccordionContextValue>({
  openValues: [],
  toggleValue: () => {},
});

const AccordionItemContext = React.createContext<string>('');

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: 'single' | 'multiple';
  collapsible?: boolean;
  defaultValue?: string | string[];
  value?: string | string[];
  onValueChange?: (val: any) => void;
}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ type = 'single', defaultValue, value, onValueChange, className, children, ...props }, ref) => {
    const [internalValues, setInternalValues] = React.useState<string[]>(() => {
      if (!defaultValue) return [];
      return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
    });

    const openValues =
      value !== undefined ? (Array.isArray(value) ? value : value ? [value] : []) : internalValues;

    const toggleValue = React.useCallback(
      (val: string) => {
        const isOpen = openValues.includes(val);
        let next: string[];
        if (type === 'multiple') {
          next = isOpen ? openValues.filter((v) => v !== val) : [...openValues, val];
        } else {
          next = isOpen ? [] : [val];
        }
        if (value === undefined) setInternalValues(next);
        onValueChange?.(type === 'multiple' ? next : next[0] || '');
      },
      [openValues, type, value, onValueChange]
    );

    return (
      <AccordionContext.Provider value={{ openValues, toggleValue }}>
        <div ref={ref} className={cn('divide-y divide-[#c4c7c5]/60', className)} {...props}>
          {children}
        </div>
      </AccordionContext.Provider>
    );
  }
);
Accordion.displayName = 'Accordion';

const AccordionItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, value, children, ...props }, ref) => (
  <AccordionItemContext.Provider value={value}>
    <div ref={ref} className={cn('border-b border-[#c4c7c5]/60', className)} {...props}>
      {children}
    </div>
  </AccordionItemContext.Provider>
));
AccordionItem.displayName = 'AccordionItem';

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, onClick, ...props }, ref) => {
  const { openValues, toggleValue } = React.useContext(AccordionContext);
  const itemValue = React.useContext(AccordionItemContext);
  const isOpen = openValues.includes(itemValue);

  return (
    <div className="flex">
      <button
        ref={ref}
        type="button"
        aria-expanded={isOpen}
        data-state={isOpen ? 'open' : 'closed'}
        onClick={(e) => {
          toggleValue(itemValue);
          onClick?.(e);
        }}
        className={cn(
          'flex flex-1 items-center justify-between py-4 text-left font-semibold text-[#1f1f1f] transition-all hover:text-[#0b57d0] cursor-pointer',
          className
        )}
        {...props}
      >
        {children}
        <ChevronDown
          className={cn(
            'h-5 w-5 shrink-0 text-[#444746] transition-transform duration-200',
            isOpen && 'rotate-180 text-[#0b57d0]'
          )}
        />
      </button>
    </div>
  );
});
AccordionTrigger.displayName = 'AccordionTrigger';

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { openValues } = React.useContext(AccordionContext);
  const itemValue = React.useContext(AccordionItemContext);
  const isOpen = openValues.includes(itemValue);

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      data-state="open"
      className="overflow-hidden text-sm text-[#444746] transition-all"
      {...props}
    >
      <div className={cn('pb-4 pt-0 leading-relaxed', className)}>{children}</div>
    </div>
  );
});
AccordionContent.displayName = 'AccordionContent';

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
