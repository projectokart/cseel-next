'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSchoolTemplate } from './SchoolTemplateContext';
import { Edit2, Check, X } from 'lucide-react';

interface EditableTextProps {
  value: string;
  fieldKey: string;
  className?: string;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
}

export default function EditableText({
  value,
  fieldKey,
  className = '',
  placeholder = 'Click to enter text...',
  multiline = false,
  rows = 3,
  tag = 'span',
}: EditableTextProps) {
  const { isEditMode, updateField } = useSchoolTemplate();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [tempValue, setTempValue] = useState<string>(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    updateField(fieldKey as any, tempValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!multiline && e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  // Preview Mode: render pure content without editing decorations
  if (!isEditMode) {
    const TagComponent = tag as any;
    return <TagComponent className={className}>{value || placeholder}</TagComponent>;
  }

  // Active Inline Editing state
  if (isEditing) {
    return (
      <div className="relative inline-block w-full max-w-full my-1 z-30" onClick={(e) => e.stopPropagation()}>
        {multiline ? (
          <textarea
            ref={inputRef as any}
            rows={rows}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full p-2.5 text-sm rounded-xl border-2 border-[#006FCC] bg-white text-slate-900 shadow-xl focus:outline-none focus:ring-2 focus:ring-[#006FCC]/30 transition-all"
          />
        ) : (
          <input
            ref={inputRef as any}
            type="text"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full p-2 text-sm rounded-lg border-2 border-[#006FCC] bg-white text-slate-900 shadow-xl focus:outline-none focus:ring-2 focus:ring-[#006FCC]/30 transition-all"
          />
        )}
        <div className="flex items-center gap-1.5 mt-1.5">
          <button
            type="button"
            onClick={handleSave}
            className="px-2.5 py-1 bg-[#006FCC] hover:bg-[#005499] text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer shadow-xs active:scale-95"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Save</span>
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </button>
        </div>
      </div>
    );
  }

  // In Edit Mode, not currently editing: show editable highlight with hover indicator
  const TagComponent = tag as any;
  return (
    <TagComponent
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        setIsEditing(true);
      }}
      title="Click to edit this text"
      className={`group/editable relative inline-block cursor-pointer transition-all rounded px-1 -mx-1 hover:bg-blue-50/70 hover:outline hover:outline-1 hover:outline-dashed hover:outline-[#006FCC] ${className}`}
    >
      <span>{value || <span className="italic text-slate-400">{placeholder}</span>}</span>
      <span className="opacity-0 group-hover/editable:opacity-100 transition-opacity ml-1.5 inline-flex items-center gap-0.5 text-[10px] font-bold bg-[#006FCC] text-white px-1.5 py-0.5 rounded shadow-xs align-middle">
        <Edit2 className="w-2.5 h-2.5" />
        <span>Edit</span>
      </span>
    </TagComponent>
  );
}
