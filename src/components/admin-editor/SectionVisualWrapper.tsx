'use client';

import React from 'react';
import { Eye, EyeOff, Edit3, Settings } from 'lucide-react';
import { HomepageSectionId } from '@/features/homepage-cms/types';

interface SectionVisualWrapperProps {
  sectionId: HomepageSectionId;
  sectionName: string;
  isEditMode: boolean;
  enabled: boolean;
  onToggleVisibility: () => void;
  onOpenEdit: () => void;
  children: React.ReactNode;
}

export const SectionVisualWrapper: React.FC<SectionVisualWrapperProps> = ({
  sectionId,
  sectionName,
  isEditMode,
  enabled,
  onToggleVisibility,
  onOpenEdit,
  children,
}) => {
  // If not in visual edit mode:
  // Public visitors only see enabled sections.
  if (!isEditMode) {
    if (!enabled) return null;
    return <>{children}</>;
  }

  // Visual Edit Mode is ON:
  return (
    <div
      data-cms-section={sectionId}
      className={`group/cms-section relative transition-all duration-200 ${
        !enabled
          ? 'opacity-70 grayscale-[35%] bg-amber-50/20 dark:bg-amber-950/10'
          : ''
      }`}
    >
      {/* Visual outline border overlay on hover */}
      <div className="pointer-events-none absolute inset-0 z-40 border-2 border-dashed border-transparent transition-colors group-hover/cms-section:border-[#005689] rounded-2xl" />

      {/* Floating Section Toolbar Badge */}
      <div className="absolute top-3 right-3 sm:top-5 sm:right-6 z-50 flex items-center gap-1.5 opacity-90 group-hover/cms-section:opacity-100 transition-opacity">
        <div className="flex items-center gap-1.5 bg-slate-900/90 text-white backdrop-blur-md px-3 py-1.5 rounded-xl shadow-lg border border-slate-700/60 text-xs">
          <span className="font-semibold text-[11px] text-slate-300 hidden sm:inline">
            {sectionName}
          </span>

          <span className="text-slate-600 hidden sm:inline">•</span>

          {/* Visibility toggle pill */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleVisibility();
            }}
            title={enabled ? 'Click to hide this section from public visitors' : 'Click to show this section to public visitors'}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-bold text-[11px] transition cursor-pointer ${
              enabled
                ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30'
            }`}
          >
            {enabled ? (
              <>
                <Eye className="w-3 h-3" />
                <span>Visible</span>
              </>
            ) : (
              <>
                <EyeOff className="w-3 h-3" />
                <span>Hidden</span>
              </>
            )}
          </button>

          {/* Edit content trigger button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenEdit();
            }}
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md font-bold text-[11px] bg-[#005689] hover:bg-[#003c6e] text-white transition shadow-xs cursor-pointer active:scale-95"
            title="Edit title, copy, images & buttons"
          >
            <Edit3 className="w-3 h-3" />
            <span>Edit</span>
          </button>
        </div>
      </div>

      {/* Hidden banner overlay if disabled */}
      {!enabled && (
        <div className="bg-amber-500/10 border-y border-amber-500/30 py-1.5 px-4 text-center">
          <p className="text-xs font-semibold text-amber-800 dark:text-amber-300 flex items-center justify-center gap-2">
            <EyeOff className="w-3.5 h-3.5" />
            <span>This section is currently <strong>HIDDEN</strong> from public visitors. Only admins can see it in Edit Mode.</span>
            <button
              onClick={onToggleVisibility}
              className="underline font-bold hover:text-amber-950 ml-1 cursor-pointer"
            >
              Show to Public
            </button>
          </p>
        </div>
      )}

      {/* Actual Section Content */}
      <div 
        onDoubleClick={(e) => {
          e.preventDefault();
          onOpenEdit();
        }}
        title="Double click to edit section content"
      >
        {children}
      </div>
    </div>
  );
};
