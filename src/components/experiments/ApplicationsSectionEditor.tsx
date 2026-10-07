'use client';

import React from 'react';
import {
  Globe,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Image as ImageIcon,
  ExternalLink,
  CornerDownRight,
  Sparkles
} from 'lucide-react';
import { ApplicationsSectionBlock, ApplicationSubItem } from '@/types/experiment';

interface ApplicationsSectionEditorProps {
  section: ApplicationsSectionBlock;
  onChange: (updated: ApplicationsSectionBlock) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete?: () => void;
}

// Recursive Item Editor Component
const SubItemEditor: React.FC<{
  item: ApplicationSubItem;
  level: number;
  onUpdate: (updated: ApplicationSubItem) => void;
  onDelete: () => void;
}> = ({ item, level, onUpdate, onDelete }) => {
  const handleFieldChange = (field: keyof ApplicationSubItem, val: any) => {
    onUpdate({ ...item, [field]: val });
  };

  const handleAddChild = () => {
    const list = item.subsections ? [...item.subsections] : [];
    const newChild: ApplicationSubItem = {
      id: `app-sub-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
      title: 'New Sub-Application Branch',
      content: 'Describe specific industrial use case, deployment method, or real-world example.',
    };
    list.push(newChild);
    onUpdate({ ...item, subsections: list });
  };

  const handleUpdateChild = (idx: number, updatedChild: ApplicationSubItem) => {
    const list = [...(item.subsections || [])];
    list[idx] = updatedChild;
    onUpdate({ ...item, subsections: list });
  };

  const handleDeleteChild = (idx: number) => {
    const list = (item.subsections || []).filter((_, i) => i !== idx);
    onUpdate({ ...item, subsections: list });
  };

  return (
    <div
      className={`p-3.5 bg-white border border-slate-200 rounded-xl space-y-3 transition-all hover:border-[#005689]/40 ${
        level > 0 ? 'ml-4 sm:ml-6 border-l-4 border-l-[#005689]/50 bg-slate-50/50' : 'shadow-2xs'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1">
          {level > 0 && <CornerDownRight className="w-3.5 h-3.5 text-[#005689] shrink-0" />}
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
            Level {level + 1}
          </span>
          <input
            type="text"
            value={item.title}
            onChange={(e) => handleFieldChange('title', e.target.value)}
            placeholder="Application Domain / System Name..."
            className="flex-1 text-xs font-bold text-slate-800 p-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#005689]"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleAddChild}
            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-[#005689] hover:bg-blue-100 rounded-lg text-[11px] font-bold transition-colors"
            title="Add Nested Subsection inside this branch"
          >
            <Plus className="w-3 h-3" />
            <span>Add Sub-branch</span>
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
            title="Remove Application"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Content description */}
      <div>
        <textarea
          value={item.content}
          onChange={(e) => handleFieldChange('content', e.target.value)}
          rows={2}
          placeholder="Application technical details, industrial scale, significance..."
          className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#005689]"
        />
      </div>

      {/* Image & Caption */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
          <ImageIcon className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          <input
            type="text"
            value={item.image || ''}
            onChange={(e) => handleFieldChange('image', e.target.value)}
            placeholder="Optional Image URL..."
            className="text-xs bg-transparent w-full focus:outline-none text-slate-700"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
          <input
            type="text"
            value={item.imageCaption || ''}
            onChange={(e) => handleFieldChange('imageCaption', e.target.value)}
            placeholder="Image caption..."
            className="text-xs bg-transparent w-full focus:outline-none text-slate-600"
          />
        </div>
      </div>

      {/* External Link & Text */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
          <ExternalLink className="w-3.5 h-3.5 text-teal-600 shrink-0" />
          <input
            type="text"
            value={item.externalLink || ''}
            onChange={(e) => handleFieldChange('externalLink', e.target.value)}
            placeholder="External reference / research paper link URL..."
            className="text-xs bg-transparent w-full focus:outline-none text-slate-700"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
          <input
            type="text"
            value={item.linkText || ''}
            onChange={(e) => handleFieldChange('linkText', e.target.value)}
            placeholder="Link button label (e.g. Read Industrial Standard)..."
            className="text-xs bg-transparent w-full focus:outline-none text-slate-600"
          />
        </div>
      </div>

      {/* Recursive Subsections Stream */}
      {item.subsections && item.subsections.length > 0 && (
        <div className="pt-2 border-t border-slate-100 space-y-2.5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
            Sub-applications ({item.subsections.length}):
          </span>
          {item.subsections.map((child, cIdx) => (
            <SubItemEditor
              key={child.id || cIdx}
              item={child}
              level={level + 1}
              onUpdate={(updatedChild) => handleUpdateChild(cIdx, updatedChild)}
              onDelete={() => handleDeleteChild(cIdx)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const ApplicationsSectionEditor: React.FC<ApplicationsSectionEditorProps> = ({
  section,
  onChange,
  onMoveUp,
  onMoveDown,
  onDelete,
}) => {
  const handleUpdateField = (field: keyof ApplicationsSectionBlock, val: any) => {
    onChange({ ...section, [field]: val });
  };

  const handleAddTopLevelApp = () => {
    const list = section.applications ? [...section.applications] : [];
    const newApp: ApplicationSubItem = {
      id: `app-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
      title: 'New Real-World Application Domain',
      content: 'Explain how this chemical reaction or physical principle is utilized in modern industry or aerospace.',
    };
    list.push(newApp);
    handleUpdateField('applications', list);
  };

  const handleUpdateApp = (index: number, updated: ApplicationSubItem) => {
    const list = [...(section.applications || [])];
    list[index] = updated;
    handleUpdateField('applications', list);
  };

  const handleDeleteApp = (index: number) => {
    const list = (section.applications || []).filter((_, i) => i !== index);
    handleUpdateField('applications', list);
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
            <Globe className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={section.title}
            onChange={(e) => handleUpdateField('title', e.target.value)}
            className="font-bold text-sm text-[#11233B] bg-transparent border-b border-transparent hover:border-[#005689] focus:border-[#005689] focus:outline-none px-1"
            placeholder="Section Title (e.g. Real-World Applications & Translational Technologies)"
          />
          <span className="text-[10px] font-bold bg-[#005689]/10 text-[#005689] px-2 py-0.5 rounded-full">
            Applications Block
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
            Section Overview / Description:
          </label>
          <input
            type="text"
            value={section.description || ''}
            onChange={(e) => handleUpdateField('description', e.target.value)}
            placeholder="e.g. Translational industrial engineering, railway metallurgy, pyrotechnics, and defense applications."
            className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#005689]"
          />
        </div>

        {/* Application Cards List */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#005689]" />
              <span>Application Domains (Supports Multi-level Nested Subsections):</span>
            </label>
            <button
              type="button"
              onClick={handleAddTopLevelApp}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#005689] hover:bg-[#003c6e] text-white rounded-lg text-xs font-bold shadow-2xs transition-all"
            >
              <Plus className="w-3 h-3" />
              <span>Add Main Application</span>
            </button>
          </div>

          <div className="space-y-3">
            {(section.applications || []).map((app, idx) => (
              <SubItemEditor
                key={app.id || idx}
                item={app}
                level={0}
                onUpdate={(updated) => handleUpdateApp(idx, updated)}
                onDelete={() => handleDeleteApp(idx)}
              />
            ))}
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default ApplicationsSectionEditor;
