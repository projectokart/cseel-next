'use client';

import React from 'react';
import {
  History,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Image as ImageIcon,
  User,
  Calendar,
  Sparkles
} from 'lucide-react';
import { HistorySectionBlock, HistoryMilestone } from '@/types/experiment';

interface HistorySectionEditorProps {
  section: HistorySectionBlock;
  onChange: (updated: HistorySectionBlock) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete?: () => void;
}

export const HistorySectionEditor: React.FC<HistorySectionEditorProps> = ({
  section,
  onChange,
  onMoveUp,
  onMoveDown,
  onDelete,
}) => {
  const handleUpdateField = (field: keyof HistorySectionBlock, val: any) => {
    onChange({ ...section, [field]: val });
  };

  const handleAddMilestone = () => {
    const list = section.milestones ? [...section.milestones] : [];
    const newM: HistoryMilestone = {
      year: new Date().getFullYear().toString(),
      scientist: 'Lead Chemist / Pioneer',
      title: 'Major Breakthrough or Patent',
      description: 'Historical significance and technological leap.',
    };
    list.push(newM);
    handleUpdateField('milestones', list);
  };

  const handleUpdateMilestone = (
    index: number,
    field: keyof HistoryMilestone,
    val: string
  ) => {
    const list = [...(section.milestones || [])];
    list[index] = { ...list[index], [field]: val };
    handleUpdateField('milestones', list);
  };

  const handleDeleteMilestone = (index: number) => {
    const list = (section.milestones || []).filter((_, i) => i !== index);
    handleUpdateField('milestones', list);
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
            <History className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={section.title}
            onChange={(e) => handleUpdateField('title', e.target.value)}
            className="font-bold text-sm text-[#11233B] bg-transparent border-b border-transparent hover:border-[#005689] focus:border-[#005689] focus:outline-none px-1"
            placeholder="Section Title (e.g. Historical Discovery & Scientific Genesis)"
          />
          <span className="text-[10px] font-bold bg-[#005689]/10 text-[#005689] px-2 py-0.5 rounded-full">
            History Block
          </span>
          {isCollapsed && (
            <span className="text-[11px] font-medium text-slate-500 italic hidden sm:inline">
              (Collapsed — click Expand to edit)
            </span>
          )}
        </div>

        {/* Section Ordering, Collapse & Delete Controls */}
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
        {/* Discovery Attribution */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50/70 border border-slate-200 rounded-xl">
          <div>
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1">
              <User className="w-3.5 h-3.5 text-[#005689]" />
              <span>Discovered By / Pioneer Scientist:</span>
            </label>
            <input
              type="text"
              value={section.discoveredBy || ''}
              onChange={(e) => handleUpdateField('discoveredBy', e.target.value)}
              placeholder="e.g. Hans Goldschmidt (German Chemist)"
              className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#005689]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1">
              <Calendar className="w-3.5 h-3.5 text-[#005689]" />
              <span>Year / Discovery Era:</span>
            </label>
            <input
              type="text"
              value={section.discoveryYear || ''}
              onChange={(e) => handleUpdateField('discoveryYear', e.target.value)}
              placeholder="e.g. 1893 (Patented 1895)"
              className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#005689]"
            />
          </div>
        </div>

        {/* Historical Context / Summary */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            Historical Summary / Context Highlight:
          </label>
          <input
            type="text"
            value={section.summary || ''}
            onChange={(e) => handleUpdateField('summary', e.target.value)}
            placeholder="e.g. Originally developed to produce carbon-free metals, quickly revolutionizing railway track welding."
            className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#005689]"
          />
        </div>

        {/* Narrative */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            Historical Narrative &amp; Technological Journey:
          </label>
          <textarea
            value={section.narrative || ''}
            onChange={(e) => handleUpdateField('narrative', e.target.value)}
            rows={4}
            placeholder="Detailed historical backstory, serendipitous laboratory moments, and global industrial adoption..."
            className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#005689]"
          />
        </div>

        {/* Archival Image & Caption */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50/70 border border-slate-200 rounded-xl">
          <div>
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1">
              <ImageIcon className="w-3.5 h-3.5 text-[#005689]" />
              <span>Archival / Historical Image URL:</span>
            </label>
            <input
              type="text"
              value={section.image || ''}
              onChange={(e) => handleUpdateField('image', e.target.value)}
              placeholder="e.g. /images/categories/chemistry.jpg"
              className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#005689]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Archival Image Caption:
            </label>
            <input
              type="text"
              value={section.imageCaption || ''}
              onChange={(e) => handleUpdateField('imageCaption', e.target.value)}
              placeholder="e.g. Early 20th century in-situ exothermic railway thermite welding crucible"
              className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#005689]"
            />
          </div>
        </div>

        {/* Timeline Milestones */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Chronological Milestones Timeline:</span>
            </label>
            <button
              type="button"
              onClick={handleAddMilestone}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#005689] hover:underline"
            >
              <Plus className="w-3 h-3" />
              <span>Add Milestone</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {(section.milestones || []).map((m, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={m.year}
                      onChange={(e) => handleUpdateMilestone(idx, 'year', e.target.value)}
                      placeholder="Year (e.g. 1893)"
                      className="w-20 text-xs font-bold p-1.5 bg-white border border-slate-200 rounded"
                    />
                    <input
                      type="text"
                      value={m.title}
                      onChange={(e) => handleUpdateMilestone(idx, 'title', e.target.value)}
                      placeholder="Milestone Title..."
                      className="flex-1 text-xs font-bold p-1.5 bg-white border border-slate-200 rounded"
                    />
                    <input
                      type="text"
                      value={m.scientist}
                      onChange={(e) =>
                        handleUpdateMilestone(idx, 'scientist', e.target.value)
                      }
                      placeholder="Scientist / Lab..."
                      className="w-36 text-xs p-1.5 bg-white border border-slate-200 rounded text-slate-600"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteMilestone(idx)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded"
                    title="Remove Milestone"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <textarea
                  value={m.description}
                  onChange={(e) =>
                    handleUpdateMilestone(idx, 'description', e.target.value)
                  }
                  rows={2}
                  placeholder="Milestone historical description..."
                  className="w-full text-xs p-1.5 bg-white border border-slate-200 rounded text-slate-700"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default HistorySectionEditor;
