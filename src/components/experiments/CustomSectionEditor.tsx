'use client';

import React from 'react';
import {
  Sparkles,
  Trash2,
  ChevronUp,
  ChevronDown,
  FlaskConical,
  Atom,
  Dna,
  Calculator,
  Lightbulb,
  HelpCircle,
  FileText,
  Cpu,
  Palette,
  Compass,
  Award
} from 'lucide-react';
import { CustomSectionBlock } from '@/types/experiment';

interface CustomSectionEditorProps {
  section: CustomSectionBlock;
  onChange: (updated: CustomSectionBlock) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete?: () => void;
}

const SCIENCE_ICONS: { name: string; icon: any; label: string }[] = [
  { name: 'Sparkles', icon: Sparkles, label: 'Sparkles' },
  { name: 'FlaskConical', icon: FlaskConical, label: 'Chemistry' },
  { name: 'Atom', icon: Atom, label: 'Physics' },
  { name: 'Dna', icon: Dna, label: 'Biology' },
  { name: 'Calculator', icon: Calculator, label: 'Math' },
  { name: 'Cpu', icon: Cpu, label: 'Tech' },
  { name: 'Palette', icon: Palette, label: 'Art' },
  { name: 'Lightbulb', icon: Lightbulb, label: 'Idea' },
  { name: 'HelpCircle', icon: HelpCircle, label: 'Viva Qs' },
  { name: 'FileText', icon: FileText, label: 'Notes' },
  { name: 'Compass', icon: Compass, label: 'Explore' },
  { name: 'Award', icon: Award, label: 'NEP Merit' },
];

export const CustomSectionEditor: React.FC<CustomSectionEditorProps> = ({
  section,
  onChange,
  onMoveUp,
  onMoveDown,
  onDelete,
}) => {
  const handleUpdate = (field: keyof CustomSectionBlock, val: any) => {
    onChange({ ...section, [field]: val });
  };

  const SelectedIconComp =
    SCIENCE_ICONS.find((i) => i.name === section.icon)?.icon || Sparkles;

  const isCollapsed = !!section.isCollapsed;
  const toggleCollapse = () => {
    onChange({ ...section, isCollapsed: !isCollapsed });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden transition-all hover:border-slate-300">
      {/* ── Header ── */}
      <div className={`flex items-center justify-between px-4 py-2.5 bg-slate-50 ${!isCollapsed ? 'border-b border-slate-200' : ''}`}>
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
            <SelectedIconComp className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={section.title}
            onChange={(e) => handleUpdate('title', e.target.value)}
            className="font-bold text-sm text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#005689] focus:outline-none px-1"
            placeholder="Custom Section Title (e.g. Viva Voce & Interview Questions)"
          />
          <span className="text-[10px] font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
            Custom Block
          </span>
          {isCollapsed && (
            <span className="text-[11px] font-medium text-slate-400 italic hidden sm:inline">
              (Collapsed — click Expand to edit)
            </span>
          )}
        </div>

        {/* Section Ordering & Delete Controls */}
        <div className="flex items-center gap-1.5">
          {onMoveUp && (
            <button
              type="button"
              onClick={onMoveUp}
              className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded transition-colors"
              title="Move Up"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          )}
          {onMoveDown && (
            <button
              type="button"
              onClick={onMoveDown}
              className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded transition-colors"
              title="Move Down"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          )}

          {/* Collapse / Expand Toggle */}
          <button
            type="button"
            onClick={toggleCollapse}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              isCollapsed
                ? 'bg-[#005689] text-white hover:bg-[#003c6e] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-200 border border-slate-200'
            }`}
            title={isCollapsed ? 'Expand this section' : 'Collapse this section'}
          >
            {isCollapsed ? (
              <>
                <ChevronDown className="w-3.5 h-3.5 text-cyan-200" />
                <span>Expand</span>
              </>
            ) : (
              <>
                <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
                <span>Collapse</span>
              </>
            )}
          </button>

          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors ml-1"
              title="Delete Section"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {!isCollapsed && (
        <div className="p-4 space-y-4">
        {/* Science Icon Selector */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1.5">
            Select Science / Academic Section Icon:
          </label>
          <div className="flex flex-wrap gap-1.5">
            {SCIENCE_ICONS.map((ic) => {
              const IconItem = ic.icon;
              const isSelected = section.icon === ic.name;
              return (
                <button
                  key={ic.name}
                  type="button"
                  onClick={() => handleUpdate('icon', ic.name)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                    isSelected
                      ? 'bg-[#005689] text-white border-[#005689] shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <IconItem className="w-3.5 h-3.5" />
                  <span>{ic.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Box */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            Section Content (Markdown &amp; Text):
          </label>
          <textarea
            value={section.content}
            onChange={(e) => handleUpdate('content', e.target.value)}
            rows={6}
            placeholder="Write custom section content. Supports markdown headings (###), bullet lists, and paragraphs..."
            className="w-full text-xs p-3 bg-white border border-slate-200 rounded-lg text-slate-800 leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#005689]"
          />
        </div>
      </div>
      )}
    </div>
  );
};

export default CustomSectionEditor;
