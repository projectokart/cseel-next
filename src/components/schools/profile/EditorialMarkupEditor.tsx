'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  BookOpen,
  Heading1,
  Heading2,
  Highlighter,
  Tag,
  Bold,
  List,
  Eye,
  Edit3,
  RotateCcw,
  Check,
} from 'lucide-react';
import EditorialMarkupRenderer from '@/components/schools/profile/EditorialMarkupRenderer';

export interface EditorialMarkupEditorProps {
  title: string;
  initialValue: string;
  defaultValue: string;
  placeholder?: string;
  rows?: number;
  onSave: (value: string) => void;
}

/**
 * Reusable rich-markup chapter editor for school admins.
 * Supports one-click insertion of headings (**), subheadings (##), highlights (==),
 * pill tags ([Tag]), bold text (**word**), and bullet lists (- item).
 */
export default function EditorialMarkupEditor({
  title,
  initialValue,
  defaultValue,
  placeholder = 'Write content using ** Heading, ## Subheading, ==highlight==, [Tag], or - bullet...',
  rows = 10,
  onSave,
}: EditorialMarkupEditorProps) {
  const [draft, setDraft] = useState<string>(initialValue);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [justSaved, setJustSaved] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    setDraft(initialValue);
  }, [initialValue]);

  const handlePersist = (nextVal: string) => {
    onSave(nextVal);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 1800);
  };

  const applyFormatToken = (prefix: string, suffix: string, sample: string, lineStart = false) => {
    const el = textareaRef.current;
    if (!el) {
      setDraft((prev) => `${prev}${prev.endsWith('\n') || !prev ? '' : '\n'}${prefix}${sample}${suffix}`);
      return;
    }
    const start = el.selectionStart ?? draft.length;
    const end = el.selectionEnd ?? draft.length;
    const selected = draft.slice(start, end);
    const inner = selected || sample;
    const leadingNewline = lineStart && start > 0 && draft[start - 1] !== '\n' ? '\n' : '';
    const insertion = `${leadingNewline}${prefix}${inner}${suffix}`;
    const updated = draft.slice(0, start) + insertion + draft.slice(end);
    setDraft(updated);

    requestAnimationFrame(() => {
      el.focus();
      const cursorEnd = start + insertion.length;
      el.setSelectionRange(cursorEnd, cursorEnd);
    });
  };

  return (
    <div className="bg-[#F8FAFC] rounded-2xl border border-[#CBD5E1] p-3.5 sm:p-5 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#006FCC]" />
          <span className="text-xs sm:text-sm font-bold text-[#003C6E]">{title}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowPreview((v) => !v)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border border-slate-200 bg-white text-slate-700 hover:border-[#006FCC] hover:text-[#006FCC] cursor-pointer"
          >
            {showPreview ? <Edit3 className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            <span>{showPreview ? 'Edit Text' : 'Preview'}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setDraft(defaultValue);
              handlePersist('');
            }}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border border-slate-200 bg-white text-slate-600 hover:text-amber-700 cursor-pointer"
            title="Reset to default draft"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
          <button
            type="button"
            onClick={() => handlePersist(draft)}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-[11px] font-bold bg-[#006FCC] hover:bg-[#005399] text-white cursor-pointer"
          >
            <Check className="w-3 h-3" />
            <span>{justSaved ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      {!showPreview ? (
        <>
          <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
            <button
              type="button"
              onClick={() => applyFormatToken('** ', '', 'Section Heading', true)}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold bg-white border border-slate-200 hover:border-[#006FCC] text-slate-700 cursor-pointer"
            >
              <Heading1 className="w-3 h-3 text-[#006FCC]" />
              <span>Heading (**)</span>
            </button>
            <button
              type="button"
              onClick={() => applyFormatToken('## ', '', 'Subheading', true)}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold bg-white border border-slate-200 hover:border-[#006FCC] text-slate-700 cursor-pointer"
            >
              <Heading2 className="w-3 h-3 text-[#006FCC]" />
              <span>Subheading (##)</span>
            </button>
            <button
              type="button"
              onClick={() => applyFormatToken('==', '==', 'highlighted text')}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold bg-white border border-slate-200 hover:border-amber-500 text-slate-700 cursor-pointer"
            >
              <Highlighter className="w-3 h-3 text-amber-600" />
              <span>Highlight (==)</span>
            </button>
            <button
              type="button"
              onClick={() => applyFormatToken('[', ']', 'Tag')}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold bg-white border border-slate-200 hover:border-[#006FCC] text-slate-700 cursor-pointer"
            >
              <Tag className="w-3 h-3 text-[#006FCC]" />
              <span>Tag ([])</span>
            </button>
            <button
              type="button"
              onClick={() => applyFormatToken('**', '**', 'bold text')}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold bg-white border border-slate-200 hover:border-slate-400 text-slate-700 cursor-pointer"
            >
              <Bold className="w-3 h-3" />
              <span>Bold</span>
            </button>
            <button
              type="button"
              onClick={() => applyFormatToken('- ', '', 'List item', true)}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold bg-white border border-slate-200 hover:border-slate-400 text-slate-700 cursor-pointer"
            >
              <List className="w-3 h-3" />
              <span>Bullet (-)</span>
            </button>
          </div>

          <textarea
            ref={textareaRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={() => handlePersist(draft)}
            rows={rows}
            placeholder={placeholder}
            className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs sm:text-sm text-slate-800 leading-relaxed font-mono focus:outline-none focus:ring-2 focus:ring-[#006FCC]/30 focus:border-[#006FCC]"
          />

          <p className="mt-2 text-[11px] text-slate-500 leading-snug m-0">
            Formatting guide: <code className="bg-slate-200/70 px-1 rounded">** Heading</code> ·{' '}
            <code className="bg-slate-200/70 px-1 rounded">## Subheading</code> ·{' '}
            <code className="bg-slate-200/70 px-1 rounded">==Highlight==</code> ·{' '}
            <code className="bg-slate-200/70 px-1 rounded">[Tag]</code> ·{' '}
            <code className="bg-slate-200/70 px-1 rounded">- Bullet</code> (hidden on public page).
          </p>
        </>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
          <EditorialMarkupRenderer content={draft} />
        </div>
      )}
    </div>
  );
}
