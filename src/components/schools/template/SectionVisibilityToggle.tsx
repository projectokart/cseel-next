'use client';

import React, { useState } from 'react';
import { useOptionalSchoolTemplate } from './SchoolTemplateContext';
import { Eye, EyeOff } from 'lucide-react';

interface SectionVisibilityToggleProps {
  sectionId: string;
  sectionTitle?: string;
  className?: string;
  isPreviewing?: boolean;
  onTogglePreview?: () => void;
}

export default function SectionVisibilityToggle({
  sectionId,
  sectionTitle,
  className = '',
  isPreviewing: controlledIsPreviewing,
  onTogglePreview,
}: SectionVisibilityToggleProps) {
  const ctx = useOptionalSchoolTemplate();
  const [internalIsPreviewing, setInternalIsPreviewing] = useState(false);

  // Only visible in Edit Mode - Zero extra gap or buttons when published
  if (!ctx || !ctx.isEditMode) {
    return null;
  }

  const isVisible = ctx.data.sectionVisibility?.[sectionId] !== false;
  const isPreviewing = controlledIsPreviewing !== undefined ? controlledIsPreviewing : internalIsPreviewing;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    ctx.toggleSectionVisibility(sectionId);
  };

  const handleTogglePreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onTogglePreview) {
      onTogglePreview();
    } else {
      const next = !internalIsPreviewing;
      setInternalIsPreviewing(next);
      const parentSection = (e.currentTarget as HTMLElement).closest('.group\\/sect, [class*="group/sect"], section');
      if (parentSection) {
        if (next) {
          parentSection.classList.add('section-preview-active');
        } else {
          parentSection.classList.remove('section-preview-active');
        }
      }
    }
  };

  return (
    <div
      className={`w-full my-0 px-4 py-2 sm:px-6 bg-[#005689] text-white rounded-none border-y border-[#004168] shadow-sm flex flex-wrap items-center justify-between gap-2.5 select-none relative z-20 ${className}`}
    >
      <div className="flex items-center gap-2 min-w-0">
        <span className="w-2 h-2 rounded-full bg-[#38BDF8] shrink-0 animate-pulse" />
        <span className="text-xs font-bold font-['Montserrat',sans-serif] tracking-wider uppercase text-white truncate">
          {sectionTitle || sectionId}
        </span>
        <span className="text-[10px] text-sky-200/80 font-mono hidden md:inline shrink-0">
          (Section Controls)
        </span>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        {/* Per-Section Preview Button */}
        <button
          type="button"
          onClick={handleTogglePreview}
          className={`px-3 py-1 rounded-none text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95 ${
            isPreviewing
              ? 'bg-amber-400 text-slate-950 hover:bg-amber-300 ring-2 ring-white font-black'
              : 'bg-white/15 hover:bg-white/25 text-white border border-white/30'
          }`}
          title={isPreviewing ? 'Exit preview mode and return to editing' : `Preview this section as real public visitors see it`}
        >
          {isPreviewing ? (
            <>
              <EyeOff className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />
              <span>Exit Preview</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5 text-amber-300" />
              <span>Preview Section</span>
            </>
          )}
        </button>

        <span className="w-px h-4 bg-white/20 shrink-0" />

        {/* Section Visibility Status */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold text-white/90">
            {isVisible ? (
              <span className="text-emerald-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                <span className="text-[11px] font-bold">Visible</span>
              </span>
            ) : (
              <span className="text-rose-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 inline-block" />
                <span className="text-[11px] font-bold">Hidden</span>
              </span>
            )}
          </span>

          {/* Toggle Switch */}
          <button
            type="button"
            onClick={handleToggle}
            className={`w-8 h-4.5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors duration-200 ${
              isVisible ? 'bg-emerald-400 hover:bg-emerald-300' : 'bg-slate-500/80 hover:bg-slate-400'
            }`}
            aria-label={isVisible ? 'Hide from Public' : 'Show to Public'}
            title={isVisible ? 'Click to hide this section from visitors' : 'Click to show this section to visitors'}
          >
            <div
              className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform duration-200 ${
                isVisible ? 'translate-x-3.5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
