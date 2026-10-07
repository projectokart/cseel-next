'use client';

import React from 'react';
import {
  Wrench,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Image as ImageIcon,
  Tag,
  ListOrdered
} from 'lucide-react';
import { SetupSectionBlock } from '@/types/experiment';

interface SetupSectionEditorProps {
  section: SetupSectionBlock;
  onChange: (updated: SetupSectionBlock) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete?: () => void;
}

export const SetupSectionEditor: React.FC<SetupSectionEditorProps> = ({
  section,
  onChange,
  onMoveUp,
  onMoveDown,
  onDelete,
}) => {
  const handleUpdateField = (field: keyof SetupSectionBlock, val: any) => {
    onChange({ ...section, [field]: val });
  };

  // Setup instructions (preparation steps)
  const handleAddInstruction = () => {
    const list = section.setupInstructions ? [...section.setupInstructions] : [];
    list.push('New setup preparation instruction...');
    handleUpdateField('setupInstructions', list);
  };

  const handleUpdateInstruction = (index: number, val: string) => {
    const list = [...(section.setupInstructions || [])];
    list[index] = val;
    handleUpdateField('setupInstructions', list);
  };

  const handleDeleteInstruction = (index: number) => {
    const list = (section.setupInstructions || []).filter((_, i) => i !== index);
    handleUpdateField('setupInstructions', list);
  };

  // Annotations
  const handleAddAnnotation = () => {
    const list = section.annotations ? [...section.annotations] : [];
    list.push({ label: 'Component / Reagent', description: 'Placement and layer role' });
    handleUpdateField('annotations', list);
  };

  const handleUpdateAnnotation = (
    index: number,
    field: 'label' | 'description',
    val: string
  ) => {
    const list = [...(section.annotations || [])];
    list[index] = { ...list[index], [field]: val };
    handleUpdateField('annotations', list);
  };

  const handleDeleteAnnotation = (index: number) => {
    const list = (section.annotations || []).filter((_, i) => i !== index);
    handleUpdateField('annotations', list);
  };

  const isCollapsed = !!section.isCollapsed;
  const toggleCollapse = () => {
    onChange({ ...section, isCollapsed: !isCollapsed });
  };

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-[18px] shadow-[0_4px_24px_rgba(13,73,121,0.06)] overflow-hidden transition-all hover:border-[#4DB1DA]">
      {/* ── Section Header ── */}
      <div className={`flex items-center justify-between px-5 py-3 bg-[#EDF5FA] ${!isCollapsed ? 'border-b border-[#E2E8F0]' : ''}`}>
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-white text-[#005689] shadow-2xs">
            <Wrench className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={section.title}
            onChange={(e) => handleUpdateField('title', e.target.value)}
            className="font-bold text-sm text-[#11233B] bg-transparent border-b border-transparent hover:border-[#005689] focus:border-[#005689] focus:outline-none px-1"
            placeholder="Section Title (e.g. Experimental Apparatus Setup & Schematic)"
          />
          <span className="text-[10px] font-bold bg-[#005689]/10 text-[#005689] px-2 py-0.5 rounded-full">
            Setup Diagram Block
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
              className="p-1.5 text-[#64748B] hover:text-[#11233B] hover:bg-white rounded-lg transition-colors"
              title="Move Up"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          )}
          {onMoveDown && (
            <button
              type="button"
              onClick={onMoveDown}
              className="p-1.5 text-[#64748B] hover:text-[#11233B] hover:bg-white rounded-lg transition-colors"
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
                : 'text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200'
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
              className="p-1.5 text-[#64748B] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-1"
              title="Delete Section"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {!isCollapsed && (
        <div className="p-5 space-y-4">
        {/* Description Overview */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            Section Overview / Subtitle:
          </label>
          <input
            type="text"
            value={section.description || ''}
            onChange={(e) => handleUpdateField('description', e.target.value)}
            placeholder="e.g. Apparatus configuration, powder layering hierarchy, and ignition fuse placement."
            className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#005689]"
          />
        </div>

        {/* Diagram Image & Caption */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50/70 border border-slate-200 rounded-xl">
          <div>
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1">
              <ImageIcon className="w-3.5 h-3.5 text-[#005689]" />
              <span>Diagram / Schematic Image URL:</span>
            </label>
            <input
              type="text"
              value={section.diagramImage || ''}
              onChange={(e) => handleUpdateField('diagramImage', e.target.value)}
              placeholder="e.g. /images/experiments/microscale-thermite-setup.jpg"
              className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#005689]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Diagram Caption:
            </label>
            <input
              type="text"
              value={section.diagramCaption || ''}
              onChange={(e) => handleUpdateField('diagramCaption', e.target.value)}
              placeholder="e.g. Fig. 1 The prepared setup: fuse, ignition mix and thermite mix in cone"
              className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#005689]"
            />
          </div>
        </div>

        {/* Setup Preparation Steps (Numbered 1, 2, 3...) */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <ListOrdered className="w-3.5 h-3.5 text-[#005689]" />
              <span>Setup Preparation Steps (Assembly Instructions):</span>
            </label>
            <button
              type="button"
              onClick={handleAddInstruction}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#005689] hover:underline"
            >
              <Plus className="w-3 h-3" />
              <span>Add Setup Step</span>
            </button>
          </div>

          <div className="space-y-2">
            {(section.setupInstructions || []).map((instruction, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <input
                  type="text"
                  value={instruction}
                  onChange={(e) => handleUpdateInstruction(idx, e.target.value)}
                  placeholder={`Step ${idx + 1} preparation instruction...`}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#005689]"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteInstruction(idx)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                  title="Remove Step"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Schematic Annotations / Callouts */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-teal-600" />
              <span>Apparatus Callout Annotations:</span>
            </label>
            <button
              type="button"
              onClick={handleAddAnnotation}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-700 hover:underline"
            >
              <Plus className="w-3 h-3" />
              <span>Add Callout</span>
            </button>
          </div>

          <div className="space-y-2">
            {(section.annotations || []).map((ann, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 sm:grid-cols-12 gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg items-center"
              >
                <div className="sm:col-span-4">
                  <input
                    type="text"
                    value={ann.label}
                    onChange={(e) => handleUpdateAnnotation(idx, 'label', e.target.value)}
                    placeholder="Component Label..."
                    className="w-full text-xs font-bold p-1.5 bg-white border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-teal-600"
                  />
                </div>
                <div className="sm:col-span-7">
                  <input
                    type="text"
                    value={ann.description}
                    onChange={(e) =>
                      handleUpdateAnnotation(idx, 'description', e.target.value)
                    }
                    placeholder="Specification / Placement details..."
                    className="w-full text-xs p-1.5 bg-white border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-teal-600"
                  />
                </div>
                <div className="sm:col-span-1 text-right">
                  <button
                    type="button"
                    onClick={() => handleDeleteAnnotation(idx)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded"
                    title="Remove Callout"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default SetupSectionEditor;
