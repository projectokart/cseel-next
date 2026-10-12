'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Check,
  Minus,
  Search,
  X,
  Calendar as CalendarIcon,
  Clock,
  Keyboard,
  AlertCircle,
} from 'lucide-react';

/**
 * 1. Official Material Design 3 (M3) Text Fields:
 * - Variants: filled, outlined
 * - Single-line & Multiline (textarea)
 * - Prefix text (e.g. ₹) & Suffix text (e.g. kg)
 * - Clearable button, Error state (with AlertCircle), Disabled state (4% fill / 12% outline, 38% text)
 */
export interface M3TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'filled' | 'outlined';
  label: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  prefixText?: string;
  suffixText?: string;
  clearable?: boolean;
  multiline?: boolean;
  rows?: number;
  supportingText?: string;
  error?: boolean;
  errorText?: string;
  maxLength?: number;
  showCounter?: boolean;
}

export function M3TextField({
  variant = 'outlined',
  label,
  leadingIcon,
  trailingIcon,
  prefixText,
  suffixText,
  clearable = false,
  multiline = false,
  rows = 3,
  supportingText,
  error = false,
  errorText,
  maxLength,
  showCounter = false,
  disabled = false,
  value,
  defaultValue,
  onChange,
  className,
  ...props
}: M3TextFieldProps) {
  const [internalVal, setInternalVal] = useState(
    String(value ?? defaultValue ?? '')
  );
  const currentVal = value !== undefined ? String(value) : internalVal;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setInternalVal(e.target.value);
    onChange?.(e as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <div className={cn('w-full', className)}>
      <div
        className={cn(
          'group relative flex w-full transition-all',
          multiline ? 'min-h-[88px] items-start py-2.5' : 'h-14 items-center',
          disabled && 'pointer-events-none select-none',
          variant === 'filled'
            ? cn(
                'rounded-t-[8px] border-b-2 px-4',
                disabled
                  ? 'bg-[#1f1f1f]/[0.04] border-[#1f1f1f]/[0.38]'
                  : error
                  ? 'bg-[#e9eef6] border-[#b3261e] focus-within:border-[#b3261e]'
                  : 'bg-[#e9eef6] border-[#444746] focus-within:border-[#0b57d0]'
              )
            : cn(
                'rounded-[8px] border px-3.5',
                disabled
                  ? 'bg-transparent border-[#1f1f1f]/[0.12]'
                  : error
                  ? 'bg-white border-[#b3261e] focus-within:border-2 focus-within:border-[#b3261e]'
                  : 'bg-white border-[#747775] focus-within:border-2 focus-within:border-[#0b57d0]'
              )
        )}
      >
        {leadingIcon && (
          <span
            className={cn(
              'mr-3 shrink-0 [&_svg]:w-5 [&_svg]:h-5',
              disabled ? 'text-[#1f1f1f]/[0.38]' : 'text-[#444746]'
            )}
          >
            {leadingIcon}
          </span>
        )}
        <div className="relative flex-1 h-full flex flex-col justify-center">
          <span
            className={cn(
              'text-[11px] font-medium leading-none transition-colors',
              disabled
                ? 'text-[#1f1f1f]/[0.38]'
                : error
                ? 'text-[#b3261e]'
                : 'text-[#444746] group-focus-within:text-[#0b57d0]'
            )}
          >
            {label}
          </span>
          <div className="flex items-center gap-1 pt-1">
            {prefixText && (
              <span
                className={cn(
                  'text-sm font-medium select-none',
                  disabled ? 'text-[#1f1f1f]/[0.38]' : 'text-[#444746]'
                )}
              >
                {prefixText}
              </span>
            )}
            {multiline ? (
              <textarea
                rows={rows}
                disabled={disabled}
                value={currentVal}
                maxLength={maxLength}
                onChange={handleChange}
                className={cn(
                  'w-full bg-transparent text-sm focus:outline-none resize-none placeholder:text-[#747775]/70',
                  disabled ? 'text-[#1f1f1f]/[0.38]' : 'text-[#1f1f1f]'
                )}
                placeholder={props.placeholder}
              />
            ) : (
              <input
                disabled={disabled}
                value={currentVal}
                maxLength={maxLength}
                onChange={handleChange}
                className={cn(
                  'w-full bg-transparent text-sm focus:outline-none placeholder:text-[#747775]/70',
                  disabled ? 'text-[#1f1f1f]/[0.38]' : 'text-[#1f1f1f]'
                )}
                {...props}
              />
            )}
            {suffixText && (
              <span
                className={cn(
                  'text-sm font-medium select-none',
                  disabled ? 'text-[#1f1f1f]/[0.38]' : 'text-[#444746]'
                )}
              >
                {suffixText}
              </span>
            )}
          </div>
        </div>
        {clearable && currentVal && !disabled && (
          <button
            type="button"
            onClick={() => setInternalVal('')}
            className="ml-2 rounded-full p-1 text-[#444746] hover:bg-black/10 cursor-pointer"
            aria-label="Clear input"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        {error && !trailingIcon ? (
          <span className="ml-2 shrink-0 text-[#b3261e]">
            <AlertCircle className="w-5 h-5" />
          </span>
        ) : (
          trailingIcon && (
            <span
              className={cn(
                'ml-2 shrink-0 [&_svg]:w-5 [&_svg]:h-5',
                disabled
                  ? 'text-[#1f1f1f]/[0.38]'
                  : error
                  ? 'text-[#b3261e]'
                  : 'text-[#444746]'
              )}
            >
              {trailingIcon}
            </span>
          )
        )}
      </div>

      {(supportingText || errorText || showCounter) && (
        <div className="mt-1 flex items-center justify-between px-4 text-xs">
          <span
            className={
              disabled
                ? 'text-[#1f1f1f]/[0.38]'
                : error
                ? 'text-[#b3261e]'
                : 'text-[#444746]'
            }
          >
            {error && errorText ? errorText : supportingText}
          </span>
          {showCounter && maxLength && (
            <span className={disabled ? 'text-[#1f1f1f]/[0.38]' : 'text-[#444746]'}>
              {currentVal.length}/{maxLength}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * 2. Official Material Design 3 (M3) Search (Search Bar + Search View)
 */
export interface M3SearchProps {
  placeholder?: string;
  value?: string;
  onChange?: (val: string) => void;
  suggestions?: string[];
  avatar?: React.ReactNode;
  variant?: 'bar' | 'view';
  disabled?: boolean;
  className?: string;
}

export function M3Search({
  placeholder = 'Search experiments, labs, schools...',
  value: controlledValue,
  onChange,
  suggestions = [
    'Acid-Base Titration Lab',
    'Ohm’s Law Simulation',
    'Composite Skill Lab CBSE',
    'Atal Tinkering Lab 3D',
  ],
  avatar,
  variant = 'bar',
  disabled = false,
  className,
}: M3SearchProps) {
  const [query, setQuery] = useState(controlledValue || '');
  const [expanded, setExpanded] = useState(variant === 'view');

  const val = controlledValue !== undefined ? controlledValue : query;
  const setVal = (v: string) => {
    setQuery(v);
    onChange?.(v);
  };

  const filtered = suggestions.filter((s) =>
    s.toLowerCase().includes(val.toLowerCase())
  );

  return (
    <div className={cn('relative w-full', className)}>
      <div
        onClick={() => !disabled && setExpanded(true)}
        className={cn(
          'flex h-14 w-full items-center gap-3 bg-[#eef3fc] px-4 transition-all',
          disabled && 'opacity-38 pointer-events-none',
          expanded
            ? 'rounded-t-[28px] border-b border-[#c4c7c5] shadow-md'
            : 'rounded-full shadow-[0_1px_2px_rgba(60,64,67,0.2)] hover:bg-[#e5ecf9]'
        )}
      >
        <Search className="w-5 h-5 text-[#444746] shrink-0" />
        <input
          type="text"
          disabled={disabled}
          value={val}
          onChange={(e) => setVal(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm text-[#1f1f1f] placeholder:text-[#444746] focus:outline-none"
        />
        {val && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setVal('');
            }}
            className="rounded-full p-1 text-[#444746] hover:bg-black/10 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        {avatar && (
          <span className="h-8 w-8 rounded-full bg-[#0b57d0] text-white text-xs font-bold flex items-center justify-center shrink-0">
            {avatar}
          </span>
        )}
      </div>

      {expanded && !disabled && (
        <div className="rounded-b-[28px] bg-[#eef3fc] px-2 pb-3 pt-1 shadow-md border-t border-[#e0e2e0]">
          <div className="px-3 py-1.5 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-[#444746]">
            <span>Suggested Searches</span>
            {variant === 'bar' && (
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="text-[#0b57d0] hover:underline cursor-pointer"
              >
                Close
              </button>
            )}
          </div>
          {filtered.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setVal(item);
                if (variant === 'bar') setExpanded(false);
              }}
              className="flex w-full items-center gap-3 rounded-full px-3 py-2 text-left text-sm text-[#1f1f1f] hover:bg-[#1f1f1f]/[0.08] cursor-pointer"
            >
              <Clock className="w-4 h-4 text-[#444746]" />
              <span>{item}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * 3. Official Material Design 3 (M3) Checkboxes:
 * - States: unchecked, checked, indeterminate
 * - Validation: normal, error
 * - Disabled: unchecked disabled, checked disabled, indeterminate disabled (38% #1f1f1f)
 */
export interface M3CheckboxProps {
  checked?: boolean | 'indeterminate';
  onChange?: (checked: boolean) => void;
  label?: string;
  error?: boolean;
  disabled?: boolean;
}

export function M3Checkbox({
  checked = false,
  onChange,
  label,
  error = false,
  disabled = false,
}: M3CheckboxProps) {
  const isActive = checked === true || checked === 'indeterminate';

  return (
    <label
      className={cn(
        'inline-flex items-center gap-2 cursor-pointer select-none',
        disabled && 'pointer-events-none cursor-not-allowed'
      )}
    >
      <button
        type="button"
        role="checkbox"
        aria-checked={checked === 'indeterminate' ? 'mixed' : checked}
        disabled={disabled}
        onClick={() => onChange?.(checked !== true)}
        className="group relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-[#0b57d0]/[0.08] transition-colors cursor-pointer"
      >
        <span
          className={cn(
            'flex h-[18px] w-[18px] items-center justify-center rounded-[2px] border-2 transition-all',
            disabled
              ? isActive
                ? 'bg-[#1f1f1f]/[0.38] border-transparent text-white'
                : 'border-[#1f1f1f]/[0.38] bg-transparent'
              : error
              ? isActive
                ? 'bg-[#b3261e] border-[#b3261e] text-white'
                : 'border-[#b3261e] bg-transparent'
              : isActive
              ? 'bg-[#0b57d0] border-[#0b57d0] text-white'
              : 'border-[#444746] bg-transparent'
          )}
        >
          {checked === true && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          {checked === 'indeterminate' && <Minus className="w-3.5 h-3.5 stroke-[3]" />}
        </span>
      </button>
      {label && (
        <span
          className={cn(
            'text-sm font-medium',
            disabled
              ? 'text-[#1f1f1f]/[0.38]'
              : error
              ? 'text-[#b3261e]'
              : 'text-[#1f1f1f]'
          )}
        >
          {label}
        </span>
      )}
    </label>
  );
}

/**
 * 4. Official Material Design 3 (M3) Radio Buttons:
 * - unselected, selected, disabled, error
 */
export interface M3RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface M3RadioGroupProps {
  options: M3RadioOption[];
  value: string;
  onChange: (val: string) => void;
  row?: boolean;
  disabled?: boolean;
  error?: boolean;
}

export function M3RadioGroup({
  options,
  value,
  onChange,
  row = false,
  disabled = false,
  error = false,
}: M3RadioGroupProps) {
  return (
    <div className={cn('flex gap-2', row ? 'flex-row flex-wrap' : 'flex-col')}>
      {options.map((opt) => {
        const selected = opt.value === value;
        const isOptDisabled = disabled || opt.disabled;
        return (
          <label
            key={opt.value}
            onClick={() => !isOptDisabled && onChange(opt.value)}
            className={cn(
              'inline-flex items-center gap-1.5 cursor-pointer select-none',
              isOptDisabled && 'pointer-events-none cursor-not-allowed'
            )}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-[#0b57d0]/[0.08] transition-colors">
              <span
                className={cn(
                  'flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors',
                  isOptDisabled
                    ? 'border-[#1f1f1f]/[0.38]'
                    : error
                    ? 'border-[#b3261e]'
                    : selected
                    ? 'border-[#0b57d0]'
                    : 'border-[#444746]'
                )}
              >
                {selected && (
                  <span
                    className={cn(
                      'h-2.5 w-2.5 rounded-full',
                      isOptDisabled
                        ? 'bg-[#1f1f1f]/[0.38]'
                        : error
                        ? 'bg-[#b3261e]'
                        : 'bg-[#0b57d0]'
                    )}
                  />
                )}
              </span>
            </span>
            <span
              className={cn(
                'text-sm font-medium',
                isOptDisabled
                  ? 'text-[#1f1f1f]/[0.38]'
                  : error
                  ? 'text-[#b3261e]'
                  : 'text-[#1f1f1f]'
              )}
            >
              {opt.label}
            </span>
          </label>
        );
      })}
    </div>
  );
}

/**
 * 5. Official Material Design 3 (M3) Switches:
 * - Unselected without icon (16px thumb) / with × icon (24px thumb)
 * - Selected without icon (24px thumb) / with ✓ icon (24px thumb)
 * - Disabled unselected & Disabled selected (12% track, 38% thumb)
 */
export interface M3SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  withIcons?: boolean;
  label?: string;
  disabled?: boolean;
}

export function M3Switch({
  checked,
  onChange,
  withIcons = true,
  label,
  disabled = false,
}: M3SwitchProps) {
  return (
    <label
      className={cn(
        'inline-flex items-center gap-3 cursor-pointer select-none',
        disabled && 'pointer-events-none cursor-not-allowed'
      )}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          'relative inline-flex h-8 w-[52px] shrink-0 items-center rounded-full border-2 transition-colors duration-200 cursor-pointer',
          disabled
            ? checked
              ? 'bg-[#1f1f1f]/[0.12] border-transparent'
              : 'bg-[#e0e2e0]/50 border-[#1f1f1f]/[0.12]'
            : checked
            ? 'bg-[#0b57d0] border-[#0b57d0]'
            : 'bg-[#e0e2e0] border-[#747775]'
        )}
      >
        <span
          className={cn(
            'flex items-center justify-center rounded-full transition-all duration-200 shadow-sm',
            checked
              ? disabled
                ? 'translate-x-[22px] h-6 w-6 bg-white text-[#1f1f1f]/[0.38]'
                : 'translate-x-[22px] h-6 w-6 bg-white text-[#0b57d0]'
              : withIcons
              ? disabled
                ? 'translate-x-[2px] h-6 w-6 bg-[#1f1f1f]/[0.38] text-white'
                : 'translate-x-[2px] h-6 w-6 bg-[#747775] text-white'
              : disabled
              ? 'translate-x-[6px] h-4 w-4 bg-[#1f1f1f]/[0.38]'
              : 'translate-x-[6px] h-4 w-4 bg-[#747775]'
          )}
        >
          {withIcons &&
            (checked ? (
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            ) : (
              <X className="w-3.5 h-3.5 stroke-[3]" />
            ))}
        </span>
      </button>
      {label && (
        <span
          className={cn(
            'text-sm font-medium',
            disabled ? 'text-[#1f1f1f]/[0.38]' : 'text-[#1f1f1f]'
          )}
        >
          {label}
        </span>
      )}
    </label>
  );
}

/**
 * 6. Official Material Design 3 (M3) Sliders:
 * - Single-thumb: continuous, discrete (with ticks), centered (zero-point in middle), disabled
 * - Range Slider (M3RangeSlider): dual-thumb [minVal, maxVal] with dual value bubbles
 */
export interface M3SliderProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  discrete?: boolean;
  centered?: boolean;
  disabled?: boolean;
  showValueLabel?: boolean;
  onChange: (val: number) => void;
  className?: string;
}

export function M3Slider({
  value,
  min = 0,
  max = 100,
  step = 1,
  discrete = false,
  centered = false,
  disabled = false,
  showValueLabel = true,
  onChange,
  className,
}: M3SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;
  const ticks = discrete
    ? Array.from({ length: Math.floor((max - min) / step) + 1 }, (_, i) => min + i * step)
    : [];

  const centerPct = 50;
  const barLeft = centered ? Math.min(centerPct, pct) : 0;
  const barWidth = centered ? Math.abs(pct - centerPct) : pct;

  return (
    <div
      className={cn(
        'relative w-full pt-7 pb-2',
        disabled && 'pointer-events-none select-none',
        className
      )}
    >
      {showValueLabel && (
        <div
          style={{ left: `calc(${pct}% - 18px)` }}
          className={cn(
            'absolute top-0 flex h-7 w-9 items-center justify-center rounded-full text-[11px] font-bold text-white shadow-sm transition-all',
            disabled ? 'bg-[#1f1f1f]/[0.38]' : 'bg-[#0b57d0]'
          )}
        >
          {value}
        </div>
      )}
      <div className="relative flex h-4 w-full items-center">
        <div
          className={cn(
            'relative h-1.5 w-full rounded-full overflow-hidden',
            disabled ? 'bg-[#1f1f1f]/[0.12]' : 'bg-[#c2e7ff]'
          )}
        >
          <div
            style={{ left: `${barLeft}%`, width: `${barWidth}%` }}
            className={cn(
              'absolute h-full rounded-full',
              disabled ? 'bg-[#1f1f1f]/[0.38]' : 'bg-[#0b57d0]'
            )}
          />
        </div>
        {discrete &&
          ticks.map((t) => {
            const tPct = ((t - min) / (max - min)) * 100;
            return (
              <span
                key={t}
                style={{ left: `${tPct}%` }}
                className={cn(
                  'pointer-events-none absolute h-1 w-1 -translate-x-1/2 rounded-full',
                  t <= value ? 'bg-white/80' : 'bg-[#0b57d0]/60'
                )}
              />
            );
          })}
        <input
          type="range"
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
        />
        <span
          style={{ left: `calc(${pct}% - 10px)` }}
          className={cn(
            'pointer-events-none absolute h-5 w-5 rounded-full shadow-md transition-all',
            disabled
              ? 'bg-[#1f1f1f]/[0.38]'
              : 'bg-[#0b57d0] ring-4 ring-[#0b57d0]/15'
          )}
        />
      </div>
    </div>
  );
}

export interface M3RangeSliderProps {
  value: [number, number];
  min?: number;
  max?: number;
  step?: number;
  onChange: (val: [number, number]) => void;
  className?: string;
}

export function M3RangeSlider({
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  className,
}: M3RangeSliderProps) {
  const [minVal, maxVal] = value;
  const minPct = ((minVal - min) / (max - min)) * 100;
  const maxPct = ((maxVal - min) / (max - min)) * 100;

  return (
    <div className={cn('relative w-full pt-7 pb-2', className)}>
      <div
        style={{ left: `calc(${minPct}% - 18px)` }}
        className="absolute top-0 flex h-7 w-9 items-center justify-center rounded-full bg-[#0b57d0] text-[11px] font-bold text-white shadow-sm"
      >
        {minVal}
      </div>
      <div
        style={{ left: `calc(${maxPct}% - 18px)` }}
        className="absolute top-0 flex h-7 w-9 items-center justify-center rounded-full bg-[#0b57d0] text-[11px] font-bold text-white shadow-sm"
      >
        {maxVal}
      </div>

      <div className="relative flex h-4 w-full items-center">
        <div className="relative h-1.5 w-full rounded-full bg-[#c2e7ff] overflow-hidden">
          <div
            style={{ left: `${minPct}%`, width: `${maxPct - minPct}%` }}
            className="absolute h-full bg-[#0b57d0] rounded-full"
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minVal}
          onChange={(e) => {
            const v = Math.min(Number(e.target.value), maxVal - step);
            onChange([v, maxVal]);
          }}
          className="pointer-events-none absolute inset-0 w-full opacity-0 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:cursor-pointer"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxVal}
          onChange={(e) => {
            const v = Math.max(Number(e.target.value), minVal + step);
            onChange([minVal, v]);
          }}
          className="pointer-events-none absolute inset-0 w-full opacity-0 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:cursor-pointer"
        />
        <span
          style={{ left: `calc(${minPct}% - 10px)` }}
          className="pointer-events-none absolute h-5 w-5 rounded-full bg-[#0b57d0] shadow-md ring-4 ring-[#0b57d0]/15"
        />
        <span
          style={{ left: `calc(${maxPct}% - 10px)` }}
          className="pointer-events-none absolute h-5 w-5 rounded-full bg-[#0b57d0] shadow-md ring-4 ring-[#0b57d0]/15"
        />
      </div>
    </div>
  );
}

/**
 * 7. Official Material Design 3 (M3) Date Picker:
 * - docked (single date calendar)
 * - range (start → end date range calendar with highlighted strip)
 * - input (keyboard date entry)
 */
export interface M3DatePickerProps {
  value?: string;
  onChange?: (date: string) => void;
  variant?: 'docked' | 'range' | 'input';
  className?: string;
}

export function M3DatePicker({
  value = '2026-10-12',
  onChange,
  variant = 'docked',
  className,
}: M3DatePickerProps) {
  const [selectedDay, setSelectedDay] = useState(12);
  const [rangeStart, setRangeStart] = useState(10);
  const [rangeEnd, setRangeEnd] = useState(18);
  const [mode, setMode] = useState<'calendar' | 'range' | 'input'>(
    variant === 'input' ? 'input' : variant === 'range' ? 'range' : 'calendar'
  );

  return (
    <div
      className={cn(
        'w-full max-w-[328px] rounded-[28px] bg-[#eef3fc] p-5 text-[#1f1f1f] shadow-[0_2px_8px_rgba(60,64,67,0.2)]',
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-[#c4c7c5] pb-3">
        <div>
          <div className="text-xs font-medium text-[#444746]">
            {mode === 'range' ? 'Select date range' : 'Select date'}
          </div>
          <div className="mt-1 text-xl font-semibold text-[#1f1f1f]">
            {mode === 'range'
              ? `Oct ${rangeStart} – Oct ${rangeEnd}`
              : `Mon, Oct ${selectedDay}`}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() =>
              setMode(
                mode === 'calendar'
                  ? 'range'
                  : mode === 'range'
                  ? 'input'
                  : 'calendar'
              )
            }
            className="h-9 px-2.5 rounded-full text-xs font-semibold text-[#0b57d0] hover:bg-[#0b57d0]/10 cursor-pointer flex items-center gap-1"
          >
            {mode === 'input' ? (
              <CalendarIcon className="w-4 h-4" />
            ) : (
              <Keyboard className="w-4 h-4" />
            )}
            <span>{mode === 'calendar' ? 'Range' : mode === 'range' ? 'Input' : 'Grid'}</span>
          </button>
        </div>
      </div>

      {mode === 'input' ? (
        <div className="py-4">
          <M3TextField
            label="Date (YYYY-MM-DD)"
            defaultValue={value}
            onChange={(e) => onChange?.(e.target.value)}
          />
        </div>
      ) : (
        <div className="mt-3">
          <div className="text-xs font-semibold text-[#444746] mb-2 px-1">
            October 2026
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs text-[#444746] mb-1">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <span key={i} className="py-1 font-semibold">
                {d}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-y-1 text-center text-xs">
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
              const isRangeStart = mode === 'range' && day === rangeStart;
              const isRangeEnd = mode === 'range' && day === rangeEnd;
              const isInRange =
                mode === 'range' && day > rangeStart && day < rangeEnd;
              const active =
                mode === 'calendar'
                  ? day === selectedDay
                  : isRangeStart || isRangeEnd;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => {
                    if (mode === 'range') {
                      if (day < rangeStart || (rangeStart && rangeEnd)) {
                        setRangeStart(day);
                        setRangeEnd(Math.min(31, day + 4));
                      } else {
                        setRangeEnd(day);
                      }
                    } else {
                      setSelectedDay(day);
                      onChange?.(`2026-10-${String(day).padStart(2, '0')}`);
                    }
                  }}
                  className={cn(
                    'h-9 w-full flex items-center justify-center transition-colors cursor-pointer',
                    active
                      ? 'rounded-full bg-[#0b57d0] text-white font-bold'
                      : isInRange
                      ? 'bg-[#c2e7ff] text-[#001d35] font-semibold'
                      : day === 12
                      ? 'rounded-full border border-[#0b57d0] text-[#0b57d0] font-semibold'
                      : 'rounded-full text-[#1f1f1f] hover:bg-[#0b57d0]/10'
                  )}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * 8. Official Material Design 3 (M3) Time Picker:
 * - 12h Dial (with AM/PM)
 * - 24h Dial (00–23)
 * - Input-only compact mode
 */
export interface M3TimePickerProps {
  defaultHour?: number;
  defaultMinute?: number;
  use24Hour?: boolean;
  className?: string;
}

export function M3TimePicker({
  defaultHour = 9,
  defaultMinute = 30,
  use24Hour = false,
  className,
}: M3TimePickerProps) {
  const [hour, setHour] = useState(defaultHour);
  const [minute, setMinute] = useState(defaultMinute);
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM');
  const [is24h, setIs24h] = useState(use24Hour);
  const [inputOnly, setInputOnly] = useState(false);

  return (
    <div
      className={cn(
        'w-full max-w-[328px] rounded-[28px] bg-[#eef3fc] p-5 text-[#1f1f1f] shadow-[0_2px_8px_rgba(60,64,67,0.2)]',
        className
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-[#444746]">
          {inputOnly ? 'Enter time' : `Select time (${is24h ? '24h' : '12h'})`}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIs24h(!is24h)}
            className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#c2e7ff] text-[#001d35] cursor-pointer"
          >
            {is24h ? '24H' : '12H'}
          </button>
          <button
            type="button"
            onClick={() => setInputOnly(!inputOnly)}
            className="h-7 w-7 rounded-full flex items-center justify-center text-[#444746] hover:bg-black/10 cursor-pointer"
            aria-label="Toggle dial or keyboard time mode"
          >
            {inputOnly ? <Clock className="w-4 h-4" /> : <Keyboard className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2">
        <input
          type="number"
          min={is24h ? 0 : 1}
          max={is24h ? 23 : 12}
          value={String(hour).padStart(2, '0')}
          onChange={(e) =>
            setHour(
              Math.min(
                is24h ? 23 : 12,
                Math.max(is24h ? 0 : 1, Number(e.target.value) || 0)
              )
            )
          }
          className="h-16 w-20 rounded-[12px] bg-[#c2e7ff] text-center text-3xl font-bold text-[#001d35] focus:outline-none focus:ring-2 focus:ring-[#0b57d0]"
        />
        <span className="text-3xl font-bold text-[#1f1f1f]">:</span>
        <input
          type="number"
          min={0}
          max={59}
          value={String(minute).padStart(2, '0')}
          onChange={(e) =>
            setMinute(Math.min(59, Math.max(0, Number(e.target.value) || 0)))
          }
          className="h-16 w-20 rounded-[12px] bg-[#e0e2e0] text-center text-3xl font-bold text-[#1f1f1f] focus:outline-none focus:ring-2 focus:ring-[#0b57d0]"
        />
        {!is24h && (
          <div className="flex flex-col overflow-hidden rounded-[10px] border border-[#747775]">
            {(['AM', 'PM'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={cn(
                  'px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer',
                  period === p
                    ? 'bg-[#c2e7ff] text-[#001d35]'
                    : 'bg-transparent text-[#444746]'
                )}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      {!inputOnly && (
        <div className="mt-4 mx-auto relative h-44 w-44 rounded-full bg-[#e0e6f2] flex items-center justify-center">
          {(is24h ? [0, 6, 12, 18] : [12, 3, 6, 9]).map((h, i) => {
            const pos =
              i === 0
                ? 'top-2 left-1/2 -translate-x-1/2'
                : i === 1
                ? 'right-2 top-1/2 -translate-y-1/2'
                : i === 2
                ? 'bottom-2 left-1/2 -translate-x-1/2'
                : 'left-2 top-1/2 -translate-y-1/2';
            const active = hour === h;
            return (
              <button
                key={h}
                type="button"
                onClick={() => setHour(h)}
                className={cn(
                  'absolute h-8 w-8 rounded-full text-xs font-bold flex items-center justify-center cursor-pointer transition-colors',
                  pos,
                  active
                    ? 'bg-[#0b57d0] text-white'
                    : 'text-[#1f1f1f] hover:bg-black/10'
                )}
              >
                {is24h ? String(h).padStart(2, '0') : h}
              </button>
            );
          })}
          <div className="h-2.5 w-2.5 rounded-full bg-[#0b57d0]" />
        </div>
      )}
    </div>
  );
}
