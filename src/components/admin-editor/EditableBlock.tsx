'use client';

import React, { useState } from 'react';
import { useUniversalCms } from '@/features/universal-cms/useUniversalCms';
import { Edit3, Check, X, Image as ImageIcon } from 'lucide-react';

interface EditableBlockProps {
  fieldKey: string;
  label?: string;
  type?: 'text' | 'textarea' | 'image';
  defaultValue?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const EditableBlock: React.FC<EditableBlockProps> = ({
  fieldKey,
  label,
  type = 'text',
  defaultValue = '',
  as: Component = 'div',
  className = '',
  style,
  children,
}) => {
  const { data, updateField, isEditMode } = useUniversalCms();
  const [isEditing, setIsEditing] = useState(false);

  // Read current value from API data or fallback
  const currentValue = data?.[fieldKey as keyof typeof data] !== undefined
    ? String(data[fieldKey as keyof typeof data])
    : (defaultValue || '');

  const [tempValue, setTempValue] = useState(currentValue);

  // If edit mode is OFF, render plain component without any editing wrappers
  if (!isEditMode) {
    if (children) return <Component className={className} style={style}>{children}</Component>;
    return (
      <Component className={className} style={style}>
        {currentValue}
      </Component>
    );
  }

  const handleSave = () => {
    updateField(fieldKey, tempValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(currentValue);
    setIsEditing(false);
  };

  return (
    <div className="relative group/editable inline-block w-full">
      {/* Content wrapper with hover indicator */}
      <div
        onClick={() => {
          setTempValue(currentValue);
          setIsEditing(true);
        }}
        className={`cursor-pointer transition-all rounded-lg ${
          isEditing 
            ? 'ring-2 ring-[#005689] bg-blue-50/20' 
            : 'hover:outline-2 hover:outline-dashed hover:outline-[#005689]/70 hover:bg-[#005689]/5'
        }`}
        title={`Click to edit ${label || fieldKey}`}
      >
        {children ? (
          children
        ) : (
          <Component className={className} style={style}>
            {currentValue}
          </Component>
        )}

        {/* Small floating edit badge on hover */}
        {!isEditing && (
          <span className="opacity-0 group-hover/editable:opacity-100 transition-opacity absolute -top-3 -right-2 z-30 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#005689] text-white shadow-sm pointer-events-none">
            <Edit3 className="w-2.5 h-2.5" />
            <span>Edit</span>
          </span>
        )}
      </div>

      {/* Inline Quick Edit Popover */}
      {isEditing && (
        <div 
          className="absolute z-50 top-full left-0 mt-2 w-full min-w-[280px] max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-3 space-y-2 animate-in fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>Edit {label || fieldKey}</span>
            <button onClick={handleCancel} className="text-slate-400 hover:text-slate-600">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {type === 'textarea' ? (
            <textarea
              autoFocus
              rows={3}
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005689]"
            />
          ) : (
            <input
              type="text"
              autoFocus
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005689]"
            />
          )}

          <div className="flex items-center justify-end gap-1.5 pt-1">
            <button
              type="button"
              onClick={handleCancel}
              className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1 px-3 py-1 text-[11px] font-bold text-white bg-[#005689] hover:bg-[#003c6e] rounded shadow-xs transition"
            >
              <Check className="w-3 h-3" />
              <span>Apply</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
