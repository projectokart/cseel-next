'use client';

import * as React from 'react';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectContextValue {
  open: boolean;
  setOpen: (v: boolean) => void;
  value: string;
  onValueChange: (val: string, label?: React.ReactNode) => void;
  selectedLabel: React.ReactNode;
  registerLabel: (val: string, label: React.ReactNode) => void;
}

const SelectContext = React.createContext<SelectContextValue>({
  open: false,
  setOpen: () => {},
  value: '',
  onValueChange: () => {},
  selectedLabel: null,
  registerLabel: () => {},
});

export interface SelectProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (val: string) => void;
  disabled?: boolean;
  children: React.ReactNode;
}

const Select = ({
  value: controlledValue,
  defaultValue = '',
  onValueChange,
  children,
}: SelectProps) => {
  const [open, setOpen] = React.useState(false);
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
  const [labelsMap, setLabelsMap] = React.useState<Record<string, React.ReactNode>>({});
  const containerRef = React.useRef<HTMLDivElement>(null);

  const value = controlledValue !== undefined ? controlledValue : uncontrolledValue;

  const registerLabel = React.useCallback((val: string, label: React.ReactNode) => {
    setLabelsMap((prev) => (prev[val] === label ? prev : { ...prev, [val]: label }));
  }, []);

  const handleSelect = React.useCallback(
    (val: string, label?: React.ReactNode) => {
      if (controlledValue === undefined) setUncontrolledValue(val);
      if (label !== undefined) {
        setLabelsMap((prev) => ({ ...prev, [val]: label }));
      }
      onValueChange?.(val);
      setOpen(false);
    },
    [controlledValue, onValueChange]
  );

  React.useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  return (
    <SelectContext.Provider
      value={{
        open,
        setOpen,
        value,
        onValueChange: handleSelect,
        selectedLabel: labelsMap[value] ?? value,
        registerLabel,
      }}
    >
      <div ref={containerRef} className="relative w-full">
        {children}
      </div>
    </SelectContext.Provider>
  );
};

const SelectGroup = ({ children, className }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('py-1', className)}>{children}</div>
);

const SelectValue = ({ placeholder }: { placeholder?: string }) => {
  const { value, selectedLabel } = React.useContext(SelectContext);
  return <span>{value ? selectedLabel : placeholder || 'Select...'}</span>;
};

const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, disabled, onClick, ...props }, ref) => {
  const { open, setOpen } = React.useContext(SelectContext);
  return (
    <button
      ref={ref}
      type="button"
      disabled={disabled}
      onClick={(e) => {
        if (!disabled) setOpen(!open);
        onClick?.(e);
      }}
      className={cn(
        'flex h-12 w-full items-center justify-between rounded-[8px] border border-[#747775] bg-white px-4 py-2 text-sm font-medium text-[#1f1f1f] transition-all hover:border-[#1f1f1f] focus:outline-none focus:border-2 focus:border-[#0b57d0] disabled:cursor-not-allowed disabled:pointer-events-none disabled:border-[#1f1f1f]/[0.12] disabled:text-[#1f1f1f]/[0.38] [&>span]:line-clamp-1 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown
        className={cn('h-4 w-4 text-[#444746] transition-transform', open && 'rotate-180')}
      />
    </button>
  );
});
SelectTrigger.displayName = 'SelectTrigger';

const SelectScrollUpButton = () => <ChevronUp className="h-4 w-4 mx-auto my-1" />;
const SelectScrollDownButton = () => <ChevronDown className="h-4 w-4 mx-auto my-1" />;

const SelectContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { position?: string }
>(({ className, children, ...props }, ref) => {
  const { open } = React.useContext(SelectContext);
  return (
    <div
      ref={ref}
      className={cn(
        'absolute left-0 right-0 top-full mt-1.5 z-[1350] max-h-80 min-w-[8rem] overflow-y-auto rounded-[12px] border border-[#e0e2e0] bg-[#eef3fc] p-1.5 text-[#1f1f1f] shadow-[0_2px_6px_2px_rgba(60,64,67,0.15),0_1px_2px_rgba(60,64,67,0.3)]',
        !open && 'hidden',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
SelectContent.displayName = 'SelectContent';

const SelectLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('py-1.5 pl-8 pr-2 text-xs font-bold uppercase tracking-wider text-[#444746]', className)}
    {...props}
  />
));
SelectLabel.displayName = 'SelectLabel';

const SelectItem = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }
>(({ className, children, value: itemVal, disabled, ...props }, ref) => {
  const { value, onValueChange, registerLabel } = React.useContext(SelectContext);
  const isSelected = value === itemVal;

  React.useEffect(() => {
    registerLabel(itemVal, children);
  }, [itemVal, children, registerLabel]);

  return (
    <button
      ref={ref}
      type="button"
      disabled={disabled}
      onClick={() => onValueChange(itemVal, children)}
      className={cn(
        'relative flex w-full cursor-pointer select-none items-center rounded-[8px] py-2.5 pl-8 pr-3 text-sm font-medium outline-none transition-colors disabled:pointer-events-none disabled:text-[#1f1f1f]/[0.38]',
        isSelected
          ? 'bg-[#c2e7ff] text-[#001d35] font-semibold'
          : 'text-[#1f1f1f] hover:bg-[#1f1f1f]/[0.08]',
        className
      )}
      {...props}
    >
      <span className="absolute left-2.5 flex h-4 w-4 items-center justify-center text-[#001d35]">
        {isSelected && <Check className="h-4 w-4" />}
      </span>
      <span>{children}</span>
    </button>
  );
});
SelectItem.displayName = 'SelectItem';

const SelectSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('-mx-1 my-1 h-px bg-[#c4c7c5]', className)} {...props} />
));
SelectSeparator.displayName = 'SelectSeparator';

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
