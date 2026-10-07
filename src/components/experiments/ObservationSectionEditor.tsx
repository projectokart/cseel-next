'use client';

import React, { useState } from 'react';
import {
  Beaker,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Columns3,
  X,
  FileCheck
} from 'lucide-react';
import { ObservationSectionBlock, TableColumn } from '@/types/experiment';

interface ObservationSectionEditorProps {
  section: ObservationSectionBlock;
  onChange: (updated: ObservationSectionBlock) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete?: () => void;
}

export const ObservationSectionEditor: React.FC<ObservationSectionEditorProps> = ({
  section,
  onChange,
  onMoveUp,
  onMoveDown,
  onDelete,
}) => {
  const [newColTitle, setNewColTitle] = useState('');
  const [showAddCol, setShowAddCol] = useState(false);

  const handleUpdateTitle = (title: string) => {
    onChange({ ...section, title });
  };

  const handleUpdateDescription = (description: string) => {
    onChange({ ...section, description });
  };

  const handleUpdateInference = (inference: string) => {
    onChange({ ...section, inference });
  };

  const handleCellChange = (rowIndex: number, colKey: string, val: string) => {
    const updatedRows = [...section.rows];
    updatedRows[rowIndex] = {
      ...updatedRows[rowIndex],
      [colKey]: val,
    };
    onChange({ ...section, rows: updatedRows });
  };

  const handleAddRow = () => {
    const newRow: Record<string, string> = {};
    section.columns.forEach((col) => {
      newRow[col.key] = '';
    });
    onChange({ ...section, rows: [...section.rows, newRow] });
  };

  const handleDeleteRow = (rowIndex: number) => {
    const updated = section.rows.filter((_, idx) => idx !== rowIndex);
    onChange({ ...section, rows: updated });
  };

  const handleAddColumn = () => {
    if (!newColTitle.trim()) return;
    const colKey = `obs_${Date.now().toString(36)}`;
    const newCol: TableColumn = {
      id: colKey,
      key: colKey,
      label: newColTitle.trim(),
    };
    const updatedRows = section.rows.map((row) => ({
      ...row,
      [colKey]: '',
    }));
    onChange({
      ...section,
      columns: [...section.columns, newCol],
      rows: updatedRows,
    });
    setNewColTitle('');
    setShowAddCol(false);
  };

  const handleDeleteColumn = (colKey: string) => {
    if (section.columns.length <= 1) return;
    const updatedCols = section.columns.filter((c) => c.key !== colKey);
    const updatedRows = section.rows.map((row) => {
      const copy = { ...row };
      delete copy[colKey];
      return copy;
    });
    onChange({ ...section, columns: updatedCols, rows: updatedRows });
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
          <div className="p-1.5 rounded-lg bg-teal-50 text-teal-700">
            <Beaker className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={section.title}
            onChange={(e) => handleUpdateTitle(e.target.value)}
            className="font-bold text-sm text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#005689] focus:outline-none px-1"
            placeholder="Section Title (e.g. Observations & Experimental Data)"
          />
          <span className="text-[10px] font-semibold bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full">
            Observation &amp; Result Block
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
        {/* Description */}
        <input
          type="text"
          value={section.description || ''}
          onChange={(e) => handleUpdateDescription(e.target.value)}
          placeholder="Guidance for data capture (e.g. Record readings across minimum 3 repeated trials)..."
          className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 focus:outline-none focus:ring-1 focus:ring-[#005689]"
        />

        {/* Observation Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                <th className="p-2.5 w-10 text-center text-slate-400">#</th>
                {section.columns.map((col) => (
                  <th key={col.key} className="p-2.5 min-w-[130px] group relative">
                    <div className="flex items-center justify-between gap-1">
                      <span>{col.label}</span>
                      {section.columns.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteColumn(col.key)}
                          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 p-0.5 rounded transition-all"
                          title="Delete column"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </th>
                ))}
                <th className="p-2.5 w-12 text-center text-slate-400">Del</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {section.rows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-2 text-center text-slate-400 font-mono text-[11px]">
                    {rIdx + 1}
                  </td>
                  {section.columns.map((col) => (
                    <td key={col.key} className="p-2">
                      <input
                        type="text"
                        value={row[col.key] || ''}
                        onChange={(e) => handleCellChange(rIdx, col.key, e.target.value)}
                        placeholder="Value..."
                        className="w-full text-xs p-1.5 bg-white border border-slate-200 rounded focus:border-[#005689] focus:outline-none"
                      />
                    </td>
                  ))}
                  <td className="p-2 text-center">
                    <button
                      type="button"
                      onClick={() => handleDeleteRow(rIdx)}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Table Action Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2 mt-2 pt-2 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAddRow}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold rounded-lg border border-teal-200 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Data Row</span>
              </button>

              {!showAddCol ? (
                <button
                  type="button"
                  onClick={() => setShowAddCol(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border border-slate-300 transition-colors"
                >
                  <Columns3 className="w-3.5 h-3.5 text-slate-600" />
                  <span>Add Column</span>
                </button>
              ) : (
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-300">
                  <input
                    type="text"
                    value={newColTitle}
                    onChange={(e) => setNewColTitle(e.target.value)}
                    placeholder="New Column Title..."
                    className="text-xs p-1 px-2 bg-white border border-slate-300 rounded focus:outline-none"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddColumn();
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddColumn}
                    className="px-2 py-1 bg-[#005689] text-white text-xs font-bold rounded hover:bg-[#003c6e]"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddCol(false)}
                    className="p-1 text-slate-500 hover:text-slate-800"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Inference / Conclusion Section */}
        <div className="pt-2">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1">
            <FileCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Result Inference &amp; Scientific Conclusion:</span>
          </label>
          <textarea
            value={section.inference || ''}
            onChange={(e) => handleUpdateInference(e.target.value)}
            rows={3}
            placeholder="Summarize the experimental outcome, verified hypothesis, calculated percentage error, and qualitative deductions..."
            className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#005689]"
          />
        </div>
      </div>
      )}
    </div>
  );
};

export default ObservationSectionEditor;
