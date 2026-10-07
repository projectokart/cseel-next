'use client';

import React from 'react';
import { useSchoolTemplate } from './SchoolTemplateContext';
import { CheckCircle2 } from 'lucide-react';

interface VerifiedBadgeProps {
  fieldKey: string;
  className?: string;
  label?: string;
  size?: 'sm' | 'md';
}

export default function VerifiedBadge({
  fieldKey,
  className = '',
  label = 'Verified by School',
  size = 'sm',
}: VerifiedBadgeProps) {
  const { isEditMode, isFieldVerified, toggleFieldVerified } = useSchoolTemplate();
  const isVerified = isFieldVerified(fieldKey);

  if (!isVerified) {
    if (!isEditMode) return null;
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          toggleFieldVerified(fieldKey);
        }}
        title="Click to mark this institutional information Verified by School"
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 hover:bg-emerald-50 text-amber-800 hover:text-emerald-800 border border-amber-300 hover:border-emerald-300 transition-all cursor-pointer shadow-xs select-none align-middle ${className}`}
      >
        <span className="w-2 h-2 rounded-full border border-amber-500 inline-block" />
        <span>Verify?</span>
      </button>
    );
  }

  return (
    <span
      onClick={(e) => {
        if (isEditMode) {
          e.stopPropagation();
          toggleFieldVerified(fieldKey);
        }
      }}
      title={isEditMode ? 'Verified by School (Click to toggle)' : 'Verified by School Administration (Official Record)'}
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${
        size === 'sm' ? 'text-[10px]' : 'text-xs'
      } font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-xs select-none align-middle ${
        isEditMode ? 'cursor-pointer hover:bg-emerald-100 hover:border-emerald-400' : ''
      } ${className}`}
    >
      <CheckCircle2 className={`${size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} text-emerald-600 fill-emerald-100`} />
      <span className="hidden sm:inline">{label}</span>
      <span className="sm:hidden">Verified</span>
    </span>
  );
}
