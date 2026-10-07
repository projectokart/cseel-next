'use client';

import React from 'react';
import {
  ShieldAlert,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  AlertTriangle,
  AlertOctagon,
  Info,
  Recycle,
  Check
} from 'lucide-react';
import { PrecautionsSectionBlock, WarningItem, SafetyLevel } from '@/types/experiment';

interface PrecautionsSectionEditorProps {
  section: PrecautionsSectionBlock;
  onChange: (updated: PrecautionsSectionBlock) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete?: () => void;
}

export const PrecautionsSectionEditor: React.FC<PrecautionsSectionEditorProps> = ({
  section,
  onChange,
  onMoveUp,
  onMoveDown,
  onDelete,
}) => {
  const PPE_OPTIONS = [
    'Safety Goggles',
    'Nitrile Gloves',
    'Lab Coat',
    'Ventilated Fume Hood',
    'Face Shield',
    'Heat-Resistant Gloves',
    'Containment Spill Tray',
    'Eyewash Station Access',
  ];

  const handleUpdateTitle = (title: string) => {
    onChange({ ...section, title });
  };

  const handleSafetyLevelChange = (safetyLevel: SafetyLevel) => {
    onChange({ ...section, safetyLevel });
  };

  const togglePPE = (item: string) => {
    const list = section.ppeRequired || [];
    const exists = list.includes(item);
    const updated = exists ? list.filter((p) => p !== item) : [...list, item];
    onChange({ ...section, ppeRequired: updated });
  };

  const handleAddWarning = (type: WarningItem['type']) => {
    const newWarn: WarningItem = {
      id: `warn-${Date.now().toString(36)}`,
      type,
      title: type === 'danger' ? 'Chemical Hazard Warning' : type === 'disposal' ? 'Waste Disposal Protocol' : 'Precautionary Note',
      text: '',
    };
    onChange({ ...section, warnings: [...section.warnings, newWarn] });
  };

  const handleUpdateWarning = (id: string, field: 'title' | 'text' | 'type', val: string) => {
    const updated = section.warnings.map((w) => {
      if (w.id === id) {
        return { ...w, [field]: val };
      }
      return w;
    });
    onChange({ ...section, warnings: updated });
  };

  const handleDeleteWarning = (id: string) => {
    onChange({
      ...section,
      warnings: section.warnings.filter((w) => w.id !== id),
    });
  };

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
            <ShieldAlert className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={section.title}
            onChange={(e) => handleUpdateTitle(e.target.value)}
            className="font-bold text-sm text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#005689] focus:outline-none px-1"
            placeholder="Section Title (e.g. Safety Precautions & Guidelines)"
          />
          <span className="text-[10px] font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
            Safety &amp; PPE Block
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
        {/* Safety Level Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
          <div>
            <span className="text-xs font-bold text-slate-700 block">Overall Experiment Safety Level:</span>
            <span className="text-[11px] text-slate-500">Determines student supervision requirements</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {(['Safe for Home', 'Adult Supervision', 'Lab Environment Required'] as SafetyLevel[]).map((level) => {
              const active = section.safetyLevel === level;
              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => handleSafetyLevelChange(level)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                    active
                      ? level === 'Safe for Home'
                        ? 'bg-emerald-500 text-white border-emerald-600 shadow-xs'
                        : level === 'Adult Supervision'
                        ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                        : 'bg-rose-600 text-white border-rose-700 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {level}
                </button>
              );
            })}
          </div>
        </div>

        {/* PPE Checklist Chips */}
        <div>
          <label className="text-xs font-bold text-slate-700 mb-1.5 block">
            Required Personal Protective Equipment (PPE):
          </label>
          <div className="flex flex-wrap gap-1.5">
            {PPE_OPTIONS.map((item) => {
              const selected = (section.ppeRequired || []).includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => togglePPE(item)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-full border transition-all ${
                    selected
                      ? 'bg-blue-50 border-blue-300 text-[#005689] font-bold shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {selected && <Check className="w-3 h-3 text-[#005689]" />}
                  <span>{item}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Warning Callout Cards List */}
        <div className="space-y-2.5 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Specific Hazard &amp; Precaution Notes:</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleAddWarning('caution')}
                className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded text-xs font-bold transition-colors"
              >
                + Caution
              </button>
              <button
                type="button"
                onClick={() => handleAddWarning('danger')}
                className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded text-xs font-bold transition-colors"
              >
                + Danger
              </button>
              <button
                type="button"
                onClick={() => handleAddWarning('disposal')}
                className="px-2 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded text-xs font-bold transition-colors"
              >
                + Disposal
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {section.warnings.map((w) => {
              const isDanger = w.type === 'danger';
              const isDisposal = w.type === 'disposal';
              const isCaution = w.type === 'caution';

              return (
                <div
                  key={w.id}
                  className={`p-3 rounded-lg border transition-all ${
                    isDanger
                      ? 'bg-rose-50/50 border-rose-200'
                      : isDisposal
                      ? 'bg-teal-50/50 border-teal-200'
                      : 'bg-amber-50/50 border-amber-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5 flex-1">
                      {isDanger ? (
                        <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" />
                      ) : isDisposal ? (
                        <Recycle className="w-4 h-4 text-teal-600 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      )}
                      <input
                        type="text"
                        value={w.title}
                        onChange={(e) => handleUpdateWarning(w.id, 'title', e.target.value)}
                        placeholder="Warning Title..."
                        className="font-bold text-xs bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#005689] focus:outline-none flex-1 text-slate-800"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteWarning(w.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-100 rounded transition-colors"
                      title="Remove Warning"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <textarea
                    value={w.text}
                    onChange={(e) => handleUpdateWarning(w.id, 'text', e.target.value)}
                    placeholder="Enter hazard description, consequences, and containment procedure..."
                    rows={2}
                    className="w-full text-xs p-2 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#005689] text-slate-700"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default PrecautionsSectionEditor;
