'use client';

import React from 'react';
import { Plus, Minus } from 'lucide-react';

export interface QuantityStepperProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'white' | 'outline' | 'google';
  showLabel?: boolean;
  label?: string;
  min?: number;
  max?: number;
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
}

export const QuantityStepper: React.FC<QuantityStepperProps> = ({
  value,
  onIncrement,
  onDecrement,
  size = 'md',
  variant = 'primary',
  showLabel = false,
  label = 'Qty:',
  min = 0,
  max = 999,
  className = '',
  disabled = false,
  ariaLabel = 'Quantity stepper',
}) => {
  const isMin = value <= min;
  const isMax = value >= max;

  // Size styling maps
  const sizeConfig = {
    xs: {
      container: 'h-6 px-1 text-[10px] gap-1 rounded-lg',
      btn: 'w-4 h-4 rounded text-[9px]',
      icon: 'w-2.5 h-2.5 stroke-[2.5]',
      num: 'min-w-[14px]',
    },
    sm: {
      container: 'h-[29px] px-1.5 text-[11px] gap-1 rounded-xl',
      btn: 'w-5 h-5 rounded text-[10px]',
      icon: 'w-3 h-3 stroke-[2.5]',
      num: 'min-w-[16px]',
    },
    md: {
      container: 'h-10 px-2.5 text-xs gap-2 rounded-xl',
      btn: 'w-7 h-7 rounded-lg text-xs',
      icon: 'w-3.5 h-3.5 stroke-[2.5]',
      num: 'min-w-[20px]',
    },
    lg: {
      container: 'h-12 px-3 text-sm gap-2.5 rounded-xl',
      btn: 'w-9 h-9 rounded-lg text-sm',
      icon: 'w-4 h-4 stroke-[2.5]',
      num: 'min-w-[24px]',
    },
  }[size];

  // Variant styling maps
  const variantConfig = {
    primary: {
      container: 'bg-[#005689] text-white shadow-sm',
      btn: 'hover:bg-white/20 active:scale-90 text-white',
      num: 'text-white font-bold',
      labelText: 'text-blue-100 font-normal text-[11px]',
    },
    white: {
      container: 'bg-white text-gray-900 border border-slate-200 shadow-xs',
      btn: 'text-gray-600 hover:bg-slate-100 active:scale-90',
      num: 'text-gray-900 font-bold',
      labelText: 'text-gray-400 font-normal text-[11px]',
    },
    outline: {
      container: 'bg-transparent text-[#005689] border border-[#005689]',
      btn: 'hover:bg-[#005689]/10 active:scale-90 text-[#005689]',
      num: 'text-[#005689] font-bold',
      labelText: 'text-gray-500 font-normal text-[11px]',
    },
    google: {
      container: 'bg-[#1a73e8] text-white shadow-xs',
      btn: 'hover:bg-white/20 active:scale-90 text-white',
      num: 'text-white font-bold',
      labelText: 'text-blue-100 font-normal text-[11px]',
    },
  }[variant];

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={`inline-flex items-center justify-between select-none font-semibold transition-all ${sizeConfig.container} ${variantConfig.container} ${
        disabled ? 'opacity-50 pointer-events-none' : ''
      } ${className}`}
    >
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!isMin && !disabled) onDecrement();
        }}
        disabled={isMin || disabled}
        aria-label="Decrease quantity"
        className={`flex items-center justify-center transition-transform disabled:opacity-30 disabled:cursor-not-allowed ${sizeConfig.btn} ${variantConfig.btn}`}
      >
        <Minus className={sizeConfig.icon} />
      </button>

      <div className="flex items-center gap-1 text-center">
        {showLabel && <span className={variantConfig.labelText}>{label}</span>}
        <span className={`text-center font-bold ${sizeConfig.num} ${variantConfig.num}`}>
          {value}
        </span>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!isMax && !disabled) onIncrement();
        }}
        disabled={isMax || disabled}
        aria-label="Increase quantity"
        className={`flex items-center justify-center transition-transform disabled:opacity-30 disabled:cursor-not-allowed ${sizeConfig.btn} ${variantConfig.btn}`}
      >
        <Plus className={sizeConfig.icon} />
      </button>
    </div>
  );
};

export default QuantityStepper;
