'use client';

import React from 'react';
import {
  BookOpen,
  Trash2,
  ChevronUp,
  ChevronDown,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Heading2,
  Heading3,
  Heading4,
  Bold,
  Italic,
  List,
  Sparkles
} from 'lucide-react';
import { TheorySectionBlock } from '@/types/experiment';

interface TheorySectionEditorProps {
  section: TheorySectionBlock;
  onChange: (updated: TheorySectionBlock) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete?: () => void;
}

export const TheorySectionEditor: React.FC<TheorySectionEditorProps> = ({
  section,
  onChange,
  onMoveUp,
  onMoveDown,
  onDelete,
}) => {
  const handleUpdateTitle = (title: string) => {
    onChange({ ...section, title });
  };

  const handleUpdateContent = (content: string) => {
    onChange({ ...section, content });
  };

  const handleHeadingLevel = (headingLevel: 'h2' | 'h3' | 'h4') => {
    onChange({ ...section, headingLevel });
  };

  const handleAlignment = (alignment: 'left' | 'center' | 'right' | 'justify') => {
    onChange({ ...section, alignment });
  };

  const insertSnippet = (prefix: string, suffix: string = '') => {
    const text = section.content || '';
    onChange({
      ...section,
      content: `${text}${text.length > 0 && !text.endsWith('\n') ? '\n' : ''}${prefix}${suffix}`,
    });
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
          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
            <BookOpen className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={section.title}
            onChange={(e) => handleUpdateTitle(e.target.value)}
            className="font-bold text-sm text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#005689] focus:outline-none px-1"
            placeholder="Section Title (e.g. Scientific Principle & Background Theory)"
          />
          <span className="text-[10px] font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
            Theory &amp; Principle
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
        <>

      {/* ── Toolbar: Heading Selection, Text Alignments, Quick Formats ── */}
      <div className="px-4 py-2 bg-slate-50/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
        {/* Heading Level Selection */}
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
          <button
            type="button"
            onClick={() => handleHeadingLevel('h2')}
            className={`px-2 py-1 text-xs font-bold rounded flex items-center gap-1 transition-all ${
              section.headingLevel === 'h2' ? 'bg-[#005689] text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
            title="Large Heading 2"
          >
            <Heading2 className="w-3.5 h-3.5" />
            <span>H2</span>
          </button>
          <button
            type="button"
            onClick={() => handleHeadingLevel('h3')}
            className={`px-2 py-1 text-xs font-bold rounded flex items-center gap-1 transition-all ${
              section.headingLevel === 'h3' ? 'bg-[#005689] text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
            title="Medium Heading 3"
          >
            <Heading3 className="w-3.5 h-3.5" />
            <span>H3</span>
          </button>
          <button
            type="button"
            onClick={() => handleHeadingLevel('h4')}
            className={`px-2 py-1 text-xs font-bold rounded flex items-center gap-1 transition-all ${
              section.headingLevel === 'h4' ? 'bg-[#005689] text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
            title="Subheading 4"
          >
            <Heading4 className="w-3.5 h-3.5" />
            <span>H4</span>
          </button>
        </div>

        {/* Alignment Selection */}
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
          <button
            type="button"
            onClick={() => handleAlignment('left')}
            className={`p-1.5 rounded transition-all ${
              section.alignment === 'left' ? 'bg-[#005689] text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
            title="Align Left"
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleAlignment('center')}
            className={`p-1.5 rounded transition-all ${
              section.alignment === 'center' ? 'bg-[#005689] text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
            title="Align Center"
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleAlignment('right')}
            className={`p-1.5 rounded transition-all ${
              section.alignment === 'right' ? 'bg-[#005689] text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
            title="Align Right"
          >
            <AlignRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleAlignment('justify')}
            className={`p-1.5 rounded transition-all ${
              section.alignment === 'justify' ? 'bg-[#005689] text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
            title="Justify"
          >
            <AlignJustify className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick Format Inserters */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => insertSnippet('**Bold Text**')}
            className="p-1.5 bg-white border border-slate-200 rounded hover:bg-slate-100 text-slate-700 text-xs font-bold"
            title="Bold"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertSnippet('*Italic Note*')}
            className="p-1.5 bg-white border border-slate-200 rounded hover:bg-slate-100 text-slate-700 text-xs"
            title="Italic"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertSnippet('- Key Principle point\n')}
            className="p-1.5 bg-white border border-slate-200 rounded hover:bg-slate-100 text-slate-700 text-xs"
            title="Bullet point"
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── Content Editor Canvas ── */}
      <div className="p-4">
        <textarea
          value={section.content}
          onChange={(e) => handleUpdateContent(e.target.value)}
          rows={7}
          placeholder="Describe the scientific principle, chemical kinetics, physical laws, or biological mechanisms in detail. Supports inline math expressions like $E = mc^2$ and standard markdown paragraphs..."
          style={{ textAlign: section.alignment }}
          className="w-full text-xs sm:text-sm p-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005689] focus:border-transparent text-slate-800 leading-relaxed font-sans"
        />

        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
          <span>Alignment: <strong className="capitalize">{section.alignment}</strong> &bull; Heading: <strong className="uppercase">{section.headingLevel}</strong></span>
          <span>Supports LaTeX ($math$) &bull; {section.content?.length || 0} characters</span>
        </div>
      </div>
      </>
      )}
    </div>
  );
};

export default TheorySectionEditor;
