'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useOptionalSchoolTemplate } from './SchoolTemplateContext';
import { CheckCircle2 } from 'lucide-react';

interface EditableTextProps {
  value?: string | number;
  fieldKey?: string;
  contentKey?: string;
  className?: string;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  maxLength?: number;
  showCounter?: boolean;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  showVerificationBadge?: boolean;
  formatDisplay?: (val: string) => string;
}

export default function EditableText({
  value = '',
  fieldKey,
  contentKey,
  className = '',
  placeholder = 'Click to enter text...',
  multiline = false,
  maxLength,
  showCounter = true,
  tag = 'span',
  showVerificationBadge = false,
  formatDisplay,
}: EditableTextProps) {
  const ctx = useOptionalSchoolTemplate();
  const isEditMode = ctx?.isEditMode ?? false;
  const updateField = ctx?.updateField || (() => {});
  const updateContentOverride = ctx?.updateContentOverride || (() => {});
  const getContent = ctx?.getContent || ((_k: string, fb: string) => fb);
  const isFieldVerified = ctx?.isFieldVerified || (() => false);
  const toggleFieldVerified = ctx?.toggleFieldVerified || (() => {});

  const isVerified = fieldKey ? isFieldVerified(fieldKey) : false;
  const elementRef = useRef<HTMLElement | null>(null);

  const effectiveValue = contentKey
    ? getContent(contentKey, String(value ?? ''))
    : String(value ?? '');

  const displayValue = formatDisplay ? formatDisplay(effectiveValue) : effectiveValue;
  const [charCount, setCharCount] = useState<number>(effectiveValue.length);

  useEffect(() => {
    setCharCount(effectiveValue.length);
  }, [effectiveValue]);

  // Sync DOM with external state updates when the user is not actively typing inside
  useEffect(() => {
    if (elementRef.current && document.activeElement !== elementRef.current) {
      const currentText = elementRef.current.innerText;
      const targetText = displayValue || '';
      if (currentText !== targetText) {
        elementRef.current.innerText = targetText;
        setCharCount(targetText.length);
      }
    }
  }, [displayValue]);

  // Auto-save on blur (switching to next paragraph/field saves automatically)
  const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    let newText = e.currentTarget.innerText || '';
    if (maxLength && newText.length > maxLength) {
      newText = newText.slice(0, maxLength);
      e.currentTarget.innerText = newText;
    }
    setCharCount(newText.length);
    const trimmed = newText.trim();
    if (trimmed !== effectiveValue) {
      if (contentKey) {
        updateContentOverride(contentKey, trimmed);
      } else if (fieldKey) {
        updateField(fieldKey as any, trimmed);
      }
    }
  };

  const handleInput = (e: React.FormEvent<HTMLElement>) => {
    const text = e.currentTarget.innerText || '';
    setCharCount(text.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    // Single-line fields exit and auto-save on Enter
    if (!multiline && e.key === 'Enter') {
      e.preventDefault();
      e.currentTarget.blur();
    }
    // Prevent typing if max length exceeded
    if (maxLength && e.currentTarget.innerText.length >= maxLength && e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
    }
  };

  const TagComponent = tag as any;

  // Visitor or Preview Mode: Pure visitor markup with zero edit artifacts or layout shift
  if (!isEditMode) {
    return (
      <TagComponent className={className}>
        {displayValue || placeholder}
      </TagComponent>
    );
  }

  // True WYSIWYG In-Place Edit Mode:
  const editableElement = (
    <TagComponent
      ref={elementRef}
      contentEditable={true}
      suppressContentEditableWarning={true}
      onBlur={handleBlur}
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      data-placeholder={placeholder}
      className={`${className} outline-none cursor-text transition-all rounded-none border border-dashed border-[#005689]/40 hover:border-[#005689] focus:border-solid focus:border-[#005689] focus:ring-1 focus:ring-[#005689]/30 focus:bg-[#005689]/[0.02]`}
    >
      {displayValue || ''}
    </TagComponent>
  );

  const counterElement = isEditMode && maxLength && showCounter ? (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10.5px] font-mono font-bold select-none shrink-0 transition-colors ${
        charCount >= maxLength
          ? 'bg-rose-100 text-rose-800 border border-rose-300'
          : charCount >= maxLength * 0.85
          ? 'bg-amber-100 text-amber-800 border border-amber-300'
          : 'bg-slate-100 text-slate-600 border border-slate-200'
      }`}
      title={`आपने ${charCount} कैरेक्टर लिख दिए हैं (अधिकतम ${maxLength} अलाउड हैं)`}
    >
      <span>{charCount}/{maxLength}</span>
    </span>
  ) : null;

  if (!showVerificationBadge && !counterElement) {
    return editableElement;
  }

  return (
    <span className="relative inline-flex flex-wrap items-center gap-1.5 max-w-full">
      {editableElement}
      {counterElement}

      {/* Field Verification Toggle if requested */}
      {showVerificationBadge && (
        <span
          onClick={(e) => {
            e.stopPropagation();
            toggleFieldVerified(fieldKey);
          }}
          className="shrink-0 select-none cursor-pointer"
        >
          {isVerified ? (
            <span
              title="Verified by School (Click to toggle)"
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold tracking-tight bg-emerald-50 text-emerald-800 border border-emerald-400"
            >
              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
              <span>Verified</span>
            </span>
          ) : (
            <span
              title="Click to mark verified by school"
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-300"
            >
              <span>Verify?</span>
            </span>
          )}
        </span>
      )}
    </span>
  );
}
