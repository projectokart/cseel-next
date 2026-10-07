'use client';

import React from 'react';
import {
  HelpCircle,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { FaqSectionBlock, FaqItem } from '@/types/experiment';

interface FaqSectionEditorProps {
  section: FaqSectionBlock;
  onChange: (updated: FaqSectionBlock) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete?: () => void;
}

export const FaqSectionEditor: React.FC<FaqSectionEditorProps> = ({
  section,
  onChange,
  onMoveUp,
  onMoveDown,
  onDelete,
}) => {
  const handleUpdateTitle = (title: string) => {
    onChange({ ...section, title });
  };

  const handleAddFaq = () => {
    const newFaq: FaqItem = {
      id: `faq-${Date.now().toString(36)}`,
      q: 'Common student question or conceptual query?',
      a: 'Provide a clear, scientifically accurate explanation or pedagogical troubleshooting note.',
    };
    onChange({ ...section, faqs: [...section.faqs, newFaq] });
  };

  const handleUpdateFaq = (id: string, field: 'q' | 'a', val: string) => {
    const updated = section.faqs.map((f) => {
      if (f.id === id) {
        return { ...f, [field]: val };
      }
      return f;
    });
    onChange({ ...section, faqs: updated });
  };

  const handleDeleteFaq = (id: string) => {
    onChange({
      ...section,
      faqs: section.faqs.filter((f) => f.id !== id),
    });
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
            <HelpCircle className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={section.title}
            onChange={(e) => handleUpdateTitle(e.target.value)}
            className="font-bold text-sm text-[#11233B] bg-transparent border-b border-transparent hover:border-[#005689] focus:border-[#005689] focus:outline-none px-1"
            placeholder="Section Title (e.g. Frequently Asked Questions)"
          />
          <span className="text-[10px] font-bold bg-[#005689]/10 text-[#005689] px-2 py-0.5 rounded-full">
            FAQ Block
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
              className="p-1.5 text-slate-400 hover:text-[#D71F27] hover:bg-rose-50 rounded-lg transition-colors ml-1"
              title="Delete Section"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {!isCollapsed && (
        <div className="p-5 space-y-3.5">
        {section.faqs.map((f, idx) => (
          <div
            key={f.id}
            className="p-4 bg-white border border-[#E2E8F0] rounded-xl space-y-2.5 transition-all hover:border-[#4DB1DA]"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-1">
                <span className="w-5 h-5 rounded-full bg-[#005689] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                  Q{idx + 1}
                </span>
                <input
                  type="text"
                  value={f.q}
                  onChange={(e) => handleUpdateFaq(f.id, 'q', e.target.value)}
                  placeholder="Question statement..."
                  className="text-xs font-bold text-[#11233B] p-2 bg-[#EDF5FA] border border-[#E2E8F0] rounded-lg w-full focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#005689]"
                />
              </div>

              <button
                type="button"
                onClick={() => handleDeleteFaq(f.id)}
                className="p-1 text-slate-400 hover:text-[#D71F27] hover:bg-rose-50 rounded"
                title="Remove question"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <textarea
              value={f.a}
              onChange={(e) => handleUpdateFaq(f.id, 'a', e.target.value)}
              placeholder="Detailed answer or conceptual resolution..."
              rows={2}
              className="w-full text-xs p-2.5 bg-white border border-[#E2E8F0] rounded-lg text-[#334155] focus:outline-none focus:ring-1 focus:ring-[#005689]"
            />
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddFaq}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#EDF5FA] hover:bg-[#D5E9F0] text-[#005689] border border-[#E2E8F0] rounded-lg text-xs font-bold transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add FAQ Item</span>
        </button>
      </div>
      )}
    </div>
  );
};

export default FaqSectionEditor;
