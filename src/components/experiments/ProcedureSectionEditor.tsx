'use client';

import React from 'react';
import {
  ListOrdered,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Clock,
  Lightbulb,
  Image as ImageIcon,
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';
import { ProcedureSectionBlock, ProcedureStep } from '@/types/experiment';

interface ProcedureSectionEditorProps {
  section: ProcedureSectionBlock;
  onChange: (updated: ProcedureSectionBlock) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete?: () => void;
}

export const ProcedureSectionEditor: React.FC<ProcedureSectionEditorProps> = ({
  section,
  onChange,
  onMoveUp,
  onMoveDown,
  onDelete,
}) => {
  const handleUpdateTitle = (title: string) => {
    onChange({ ...section, title });
  };

  const handleAddStep = () => {
    const newStepNum = section.steps.length + 1;
    const newStep: ProcedureStep = {
      id: `step-${Date.now().toString(36)}`,
      stepNumber: newStepNum,
      title: `Step ${newStepNum}`,
      instruction: '',
      duration: '5 Mins',
      tip: '',
    };
    onChange({
      ...section,
      steps: [...section.steps, newStep],
    });
  };

  const handleUpdateStep = (id: string, field: keyof ProcedureStep, val: any) => {
    const updated = section.steps.map((st) => {
      if (st.id === id) {
        return { ...st, [field]: val };
      }
      return st;
    });
    onChange({ ...section, steps: updated });
  };

  const handleDeleteStep = (id: string) => {
    const filtered = section.steps.filter((s) => s.id !== id);
    const renumbered = filtered.map((s, idx) => ({
      ...s,
      stepNumber: idx + 1,
    }));
    onChange({ ...section, steps: renumbered });
  };

  const handleMoveStep = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= section.steps.length) return;

    const copy = [...section.steps];
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;

    const renumbered = copy.map((s, idx) => ({
      ...s,
      stepNumber: idx + 1,
    }));
    onChange({ ...section, steps: renumbered });
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
          <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
            <ListOrdered className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={section.title}
            onChange={(e) => handleUpdateTitle(e.target.value)}
            className="font-bold text-sm text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#005689] focus:outline-none px-1"
            placeholder="Section Title (e.g. Step-by-Step Experimental Procedure)"
          />
          <span className="text-[10px] font-semibold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
            Procedure Block
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
        <div className="p-4 space-y-3">
        {section.steps.map((st, idx) => (
          <div
            key={st.id}
            className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5 transition-all hover:bg-white hover:shadow-2xs"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-1">
                <span className="w-6 h-6 rounded-full bg-[#005689] text-white text-xs font-bold flex items-center justify-center shrink-0">
                  {st.stepNumber}
                </span>
                <input
                  type="text"
                  value={st.title || ''}
                  onChange={(e) => handleUpdateStep(st.id, 'title', e.target.value)}
                  placeholder="Step Headline / Action (e.g. Dispense reagents into flask)..."
                  className="text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded px-2.5 py-1.5 flex-1 focus:outline-none focus:ring-1 focus:ring-[#005689]"
                />
              </div>

              {/* Step Controls (Up, Down, Delete) */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => handleMoveStep(idx, 'up')}
                  className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded"
                  title="Move step up"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={idx === section.steps.length - 1}
                  onClick={() => handleMoveStep(idx, 'down')}
                  className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded"
                  title="Move step down"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteStep(st.id)}
                  className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                  title="Delete step"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Instruction description */}
            <textarea
              value={st.instruction}
              onChange={(e) => handleUpdateStep(st.id, 'instruction', e.target.value)}
              placeholder="Detailed step instruction for student execution..."
              rows={2}
              className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#005689]"
            />

            {/* Meta row: duration, tip, image */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2 py-1">
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={st.duration || ''}
                  onChange={(e) => handleUpdateStep(st.id, 'duration', e.target.value)}
                  placeholder="Duration (e.g. 5 Mins)"
                  className="text-xs bg-transparent w-full focus:outline-none text-slate-700"
                />
              </div>

              <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2 py-1">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <input
                  type="text"
                  value={st.tip || ''}
                  onChange={(e) => handleUpdateStep(st.id, 'tip', e.target.value)}
                  placeholder="Practical Tip or caution..."
                  className="text-xs bg-transparent w-full focus:outline-none text-slate-700"
                />
              </div>

              <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2 py-1">
                <ImageIcon className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <input
                  type="text"
                  value={st.image || ''}
                  onChange={(e) => handleUpdateStep(st.id, 'image', e.target.value)}
                  placeholder="Optional Step Image URL"
                  className="text-xs bg-transparent w-full focus:outline-none text-slate-700"
                />
              </div>
            </div>

            {/* In-situ Safety & Expected Intermediate Result */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-slate-100">
              <div className="flex items-center gap-1.5 bg-amber-50/60 border border-amber-200/80 rounded-lg px-2.5 py-1">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <input
                  type="text"
                  value={st.safety || ''}
                  onChange={(e) => handleUpdateStep(st.id, 'safety', e.target.value)}
                  placeholder="Step Safety Rule (e.g. Keep students 4m back, use Shade-9 filter)..."
                  className="text-xs bg-transparent w-full focus:outline-none text-amber-900 placeholder:text-amber-700/50"
                />
              </div>

              <div className="flex items-center gap-1.5 bg-emerald-50/60 border border-emerald-200/80 rounded-lg px-2.5 py-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <input
                  type="text"
                  value={st.expectedResult || ''}
                  onChange={(e) => handleUpdateStep(st.id, 'expectedResult', e.target.value)}
                  placeholder="Observed Result (e.g. Glowing white-hot melt, sparks subside)..."
                  className="text-xs bg-transparent w-full focus:outline-none text-emerald-900 placeholder:text-emerald-700/50"
                />
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddStep}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 rounded-lg text-xs font-bold transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Step</span>
        </button>
      </div>
      )}
    </div>
  );
};

export default ProcedureSectionEditor;
