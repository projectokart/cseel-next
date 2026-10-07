'use client';

import React, { useState } from 'react';
import {
  Table,
  Plus,
  Trash2,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  Image as ImageIcon,
  Columns3,
  X
} from 'lucide-react';
import { MaterialsSectionBlock, TableColumn, MaterialRow } from '@/types/experiment';

interface MaterialSectionEditorProps {
  section: MaterialsSectionBlock;
  onChange: (updated: MaterialsSectionBlock) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete?: () => void;
}

export const MaterialSectionEditor: React.FC<MaterialSectionEditorProps> = ({
  section,
  onChange,
  onMoveUp,
  onMoveDown,
  onDelete,
}) => {
  const [newColTitle, setNewColTitle] = useState('');
  const [showAddCol, setShowAddCol] = useState(false);

  // Update Section Title or Description
  const handleUpdateMeta = (field: 'title' | 'description', val: string) => {
    onChange({ ...section, [field]: val });
  };

  // Cell change
  const handleCellChange = (rowId: string, colKey: string, val: string) => {
    const updatedRows = section.rows.map((row) => {
      if (row.id === rowId) {
        return { ...row, [colKey]: val };
      }
      return row;
    });
    onChange({ ...section, rows: updatedRows });
  };

  // Add Row
  const handleAddRow = () => {
    const newRowId = `row-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`;
    const newRow: MaterialRow = {
      id: newRowId,
      name: '',
      image: '',
      buyLink: '',
      quantity: '',
      spec: '',
    };
    // Ensure all custom columns have default empty values
    section.columns.forEach((col) => {
      if (!(col.key in newRow)) {
        newRow[col.key] = '';
      }
    });
    onChange({ ...section, rows: [...section.rows, newRow] });
  };

  // Delete Row
  const handleDeleteRow = (rowId: string) => {
    onChange({
      ...section,
      rows: section.rows.filter((r) => r.id !== rowId),
    });
  };

  // Add Column
  const handleAddColumn = () => {
    if (!newColTitle.trim()) return;
    const colKey = `col_${Date.now().toString(36)}`;
    const newCol: TableColumn = {
      id: colKey,
      key: colKey,
      label: newColTitle.trim(),
      type: 'text',
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

  // Delete Column
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
      {/* ── Section Header Strip ── */}
      <div className={`flex items-center justify-between px-4 py-2.5 bg-slate-50 ${!isCollapsed ? 'border-b border-slate-200' : ''}`}>
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
            <Table className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={section.title}
            onChange={(e) => handleUpdateMeta('title', e.target.value)}
            className="font-bold text-sm text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#005689] focus:outline-none px-1"
            placeholder="Section Title (e.g. Materials & Apparatus Required)"
          />
          <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
            Table Block
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
              title="Move Section Up"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          )}
          {onMoveDown && (
            <button
              type="button"
              onClick={onMoveDown}
              className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded transition-colors"
              title="Move Section Down"
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
              title="Delete Materials Section"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {!isCollapsed && (
        <>
        {/* ── Description Note ── */}
        <div className="p-4 pb-2">
        <input
          type="text"
          value={section.description || ''}
          onChange={(e) => handleUpdateMeta('description', e.target.value)}
          placeholder="Optional guidelines (e.g. Pre-measure all chemicals before beginning practical)..."
          className="w-full text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-[#005689]"
        />
      </div>

      {/* ── Interactive Table Canvas ── */}
      <div className="p-4 pt-2 overflow-x-auto">
        <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
              <th className="p-2.5 w-10 text-center text-slate-400">#</th>
              {section.columns.map((col) => (
                <th key={col.key} className="p-2.5 min-w-[140px] group relative">
                  <div className="flex items-center justify-between gap-1">
                    <span>{col.label}</span>
                    {section.columns.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteColumn(col.key)}
                        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 p-0.5 rounded transition-all"
                        title="Remove Column"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </th>
              ))}
              <th className="p-2.5 w-12 text-center text-slate-400">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {section.rows.map((row, idx) => (
              <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="p-2 text-center text-slate-400 font-mono text-[11px]">
                  {idx + 1}
                </td>

                {section.columns.map((col) => {
                  const val = row[col.key] || '';

                  // Special render for image or buy link column hints
                  if (col.key === 'buyLink') {
                    return (
                      <td key={col.key} className="p-2">
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={val}
                            onChange={(e) => handleCellChange(row.id, col.key, e.target.value)}
                            placeholder="https://..."
                            className="w-full text-xs p-1.5 bg-white border border-slate-200 rounded focus:border-[#005689] focus:outline-none font-mono"
                          />
                          {val && (
                            <a
                              href={val}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 hover:text-blue-800 p-1 shrink-0"
                              title="Test link"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </td>
                    );
                  }

                  if (col.key === 'image') {
                    return (
                      <td key={col.key} className="p-2">
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={val}
                            onChange={(e) => handleCellChange(row.id, col.key, e.target.value)}
                            placeholder="Image URL or /images/..."
                            className="w-full text-xs p-1.5 bg-white border border-slate-200 rounded focus:border-[#005689] focus:outline-none"
                          />
                          {val && (
                            <img
                              src={val}
                              alt="thumb"
                              className="w-6 h-6 rounded object-cover border border-slate-300 shrink-0"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          )}
                        </div>
                      </td>
                    );
                  }

                  return (
                    <td key={col.key} className="p-2">
                      <input
                        type="text"
                        value={val}
                        onChange={(e) => handleCellChange(row.id, col.key, e.target.value)}
                        placeholder={`Enter ${col.label.toLowerCase()}...`}
                        className="w-full text-xs p-1.5 bg-white border border-slate-200 rounded focus:border-[#005689] focus:outline-none"
                      />
                    </td>
                  );
                })}

                <td className="p-2 text-center">
                  <button
                    type="button"
                    onClick={() => handleDeleteRow(row.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                    title="Delete Row"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ── Table Action Buttons (+ Row, + Column) ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-2 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddRow}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Material Row</span>
            </button>

            {!showAddCol ? (
              <button
                type="button"
                onClick={() => setShowAddCol(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border border-slate-300 transition-colors"
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
                  placeholder="Column Header Name..."
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

          <span className="text-[11px] text-slate-400">
            {section.rows.length} rows &bull; {section.columns.length} columns
          </span>
        </div>
      </div>
      </>
      )}
    </div>
  );
};

export default MaterialSectionEditor;
