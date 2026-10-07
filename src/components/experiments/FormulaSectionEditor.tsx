'use client';

import React, { useState } from 'react';
import {
  Calculator,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { MathFormulaSectionBlock, FormulaItem } from '@/types/experiment';
import MathFormulaPicker from './MathFormulaPicker';

interface FormulaSectionEditorProps {
  section: MathFormulaSectionBlock;
  onChange: (updated: MathFormulaSectionBlock) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete?: () => void;
}

export const FormulaSectionEditor: React.FC<FormulaSectionEditorProps> = ({
  section,
  onChange,
  onMoveUp,
  onMoveDown,
  onDelete,
}) => {
  const [activeFormulaId, setActiveFormulaId] = useState<string | null>(
    section.formulas.length > 0 ? section.formulas[0].id : null
  );

  const handleUpdateTitle = (title: string) => {
    onChange({ ...section, title });
  };

  const handleAddFormula = () => {
    const newId = `form-${Date.now().toString(36)}`;
    const newFormula: FormulaItem = {
      id: newId,
      label: `Equation ${section.formulas.length + 1}`,
      latex: 'E = m \\cdot c^2',
      explanation: '',
    };
    onChange({
      ...section,
      formulas: [...section.formulas, newFormula],
    });
    setActiveFormulaId(newId);
  };

  const handleUpdateFormula = (id: string, field: 'label' | 'latex' | 'explanation', val: string) => {
    const updated = section.formulas.map((f) => {
      if (f.id === id) {
        return { ...f, [field]: val };
      }
      return f;
    });
    onChange({ ...section, formulas: updated });
  };

  const handleDeleteFormula = (id: string) => {
    const updated = section.formulas.filter((f) => f.id !== id);
    onChange({ ...section, formulas: updated });
    if (activeFormulaId === id) {
      setActiveFormulaId(updated.length > 0 ? updated[0].id : null);
    }
  };

  const isCollapsed = !!section.isCollapsed;
  const toggleCollapse = () => {
    onChange({ ...section, isCollapsed: !isCollapsed });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden transition-all hover:border-slate-300">
      {/* ── Section Header ── */}
      <div className={`flex items-center justify-between px-4 py-2.5 bg-slate-50 ${!isCollapsed ? 'border-b border-slate-200' : ''}`}>
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-50 text-purple-700">
            <Calculator className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={section.title}
            onChange={(e) => handleUpdateTitle(e.target.value)}
            className="font-bold text-sm text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#005689] focus:outline-none px-1"
            placeholder="Section Title (e.g. Mathematical Formulations & Chemical Equations)"
          />
          <span className="text-[10px] font-semibold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
            KaTeX &amp; Symbols Block
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
        {/* Formula Cards */}
        <div className="space-y-3">
          {section.formulas.map((item, idx) => (
            <div
              key={item.id}
              className="p-3 bg-slate-50/80 border border-slate-200 rounded-xl space-y-2.5 transition-all"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1">
                  <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => handleUpdateFormula(item.id, 'label', e.target.value)}
                    placeholder="Equation Label (e.g. Governing Force Equation)..."
                    className="text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded px-2 py-1 flex-1 focus:outline-none focus:ring-1 focus:ring-[#005689]"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteFormula(item.id)}
                  className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                  title="Remove Equation"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Equation symbol picker and input */}
              <MathFormulaPicker
                currentLatex={item.latex}
                onChange={(newLatex) => handleUpdateFormula(item.id, 'latex', newLatex)}
                label={`Equation ${idx + 1} LaTeX Code`}
              />

              {/* Explanation Note */}
              <input
                type="text"
                value={item.explanation || ''}
                onChange={(e) => handleUpdateFormula(item.id, 'explanation', e.target.value)}
                placeholder="Variable definitions, thermodynamic constants, or kinetic explanations..."
                className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg text-slate-600 focus:outline-none focus:ring-1 focus:ring-[#005689]"
              />
            </div>
          ))}
        </div>

        {/* Add Formula Button */}
        <button
          type="button"
          onClick={handleAddFormula}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 rounded-lg text-xs font-bold transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Formula / Equation</span>
        </button>
      </div>
      )}
    </div>
  );
};

export default FormulaSectionEditor;
