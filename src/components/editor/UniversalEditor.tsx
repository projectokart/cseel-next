'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Image } from '@tiptap/extension-image';
import { Link } from '@tiptap/extension-link';
import { TextAlign } from '@tiptap/extension-text-align';
import { Underline } from '@tiptap/extension-underline';
import { Highlight } from '@tiptap/extension-highlight';

import { UniversalEditorProps, UniversalEditorValue } from './types';
import { CONTENT_TYPE_CONFIGS } from './config/editorConfig';
import { FormulaExtension } from './extensions/formulaExtension';
import { GraphExtension } from './extensions/graphExtension';
import { MermaidExtension } from './extensions/mermaidExtension';
import { CalloutExtension } from './extensions/calloutExtension';
import EditorToolbar from './toolbar/EditorToolbar';
import SlashCommandMenu from './toolbar/SlashCommandMenu';
import { Check, Clock, Sparkles } from 'lucide-react';

export default function UniversalEditor({
  contentType = 'document',
  initialContent,
  value,
  onChange,
  onSave,
  placeholder,
  readOnly = false,
  minHeight = '320px',
  maxHeight,
  className = '',
  autoFocus = false,
  showWordCount = true,
}: UniversalEditorProps) {
  const config = CONTENT_TYPE_CONFIGS[contentType] || CONTENT_TYPE_CONFIGS.document;

  // Slash command popup states
  const [slashMenuOpen, setSlashMenuOpen] = useState(false);
  const [slashQuery, setSlashQuery] = useState('');
  const [slashPosition, setSlashPosition] = useState({ top: 0, left: 0 });

  // Auto-save indicator states
  const [lastSaved, setLastSaved] = useState<string>('All changes saved');
  const [isSaving, setIsSaving] = useState(false);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Tiptap
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: {
          HTMLAttributes: {
            class: 'rounded-2xl bg-slate-950 text-slate-100 p-4 font-mono text-xs my-3',
          },
        },
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse table-auto w-full my-4 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden text-xs',
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: 'bg-slate-100 dark:bg-slate-800 font-bold p-2.5 text-left border border-slate-200 dark:border-slate-700',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'p-2.5 border border-slate-200 dark:border-slate-800',
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: false,
        HTMLAttributes: {
          class: 'rounded-2xl max-w-full h-auto my-3 shadow-md border border-slate-200',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[#006fcc] underline font-bold hover:text-blue-700',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      Highlight.configure({
        multicolor: true,
      }),
      FormulaExtension,
      GraphExtension,
      MermaidExtension,
      CalloutExtension,
    ],
    content: initialContent || (typeof value === 'string' ? value : value?.json || value?.html || ''),
    editable: !readOnly,
    autofocus: autoFocus,
    editorProps: {
      attributes: {
        class: `prose prose-slate max-w-none focus:outline-none px-4 sm:px-8 py-5 min-h-[${minHeight}] text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed`,
      },
      handleKeyDown: (view, event) => {
        // Trigger slash commands on '/'
        if (event.key === '/' && config.slashCommands) {
          const coords = view.coordsAtPos(view.state.selection.from);
          setSlashPosition({ top: coords.bottom + 6, left: Math.min(coords.left, window.innerWidth - 320) });
          setSlashMenuOpen(true);
          setSlashQuery('');
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      const html = editor.getHTML();
      const text = editor.getText();

      // Check slash query if open
      if (slashMenuOpen) {
        const sel = editor.state.selection;
        const textBefore = editor.state.doc.textBetween(Math.max(0, sel.from - 20), sel.from, '\n');
        const slashIdx = textBefore.lastIndexOf('/');
        if (slashIdx !== -1) {
          setSlashQuery(textBefore.slice(slashIdx + 1));
        } else {
          setSlashMenuOpen(false);
        }
      }

      const editorVal: UniversalEditorValue = { json, html, text };
      onChange?.(editorVal);

      // Debounced auto-save (800ms)
      setIsSaving(true);
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = setTimeout(() => {
        setIsSaving(false);
        setLastSaved(`Saved at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
        onSave?.(editorVal);
      }, 800);
    },
  });

  // AI Assistant Action Handlers
  const handleApplyAI = useCallback(
    (action: string) => {
      if (!editor) return;
      const { from, to } = editor.state.selection;
      const selectedText = editor.state.doc.textBetween(from, to, ' ');

      if (action === 'fix_grammar') {
        if (selectedText) {
          editor.commands.insertContentAt({ from, to }, selectedText.trim() + ' [Polished]');
        }
      } else if (action === 'make_professional') {
        if (selectedText) {
          editor.commands.insertContentAt({ from, to }, `Comprehensive pedagogical analysis demonstrates that ${selectedText.toLowerCase()}`);
        }
      } else if (action === 'summarize') {
        editor.commands.insertContent({
          type: 'callout',
          attrs: { variant: 'note' },
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'Executive Summary: Key findings, rigorous scientific observations, and verified conclusions.' }],
            },
          ],
        });
      } else if (action === 'generate_procedure') {
        editor.commands.insertContent([
          { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Step-by-Step Procedure' }] },
          {
            type: 'orderedList',
            content: [
              { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Clean and inspect all connecting wires for zero contact resistance.' }] }] },
              { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Connect voltmeter in parallel across resistor and ammeter in series with the battery.' }] }] },
              { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Vary the rheostat slider in uniform increments and tabulate voltage (V) vs current (I).' }] }] },
            ],
          },
        ]);
      }
    },
    [editor]
  );

  // Sync external value updates if changed
  useEffect(() => {
    if (editor && value && !editor.isFocused) {
      const currentHTML = editor.getHTML();
      const nextHTML = typeof value === 'string' ? value : value?.html || '';
      if (nextHTML && nextHTML !== currentHTML) {
        editor.commands.setContent(nextHTML);
      }
    }
  }, [value, editor]);

  return (
    <div
      className={`universal-content-editor flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm transition-all focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-500/10 ${className}`}
    >
      {/* ── TOP NOTION-STYLE TOOLBAR ── */}
      {!readOnly && (
        <EditorToolbar
          editor={editor}
          contentType={contentType}
          onApplyAI={handleApplyAI}
        />
      )}

      {/* ── DOCUMENT EDITING AREA ── */}
      <div
        className="flex-1 overflow-y-auto bg-white dark:bg-slate-900 relative"
        style={{ minHeight, maxHeight: maxHeight || 'auto' }}
      >
        <EditorContent editor={editor} />

        {/* Floating Slash Command Menu */}
        {slashMenuOpen && (
          <SlashCommandMenu
            editor={editor}
            isOpen={slashMenuOpen}
            onClose={() => setSlashMenuOpen(false)}
            query={slashQuery}
            position={slashPosition}
            contentType={contentType}
          />
        )}
      </div>

      {/* ── FOOTER STATUS BAR ── */}
      <div className="bg-slate-50/80 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800 px-4 py-2 flex items-center justify-between text-[11px] text-slate-500 select-none">
        <div className="flex items-center gap-2 font-medium">
          <span className="capitalize px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-bold border border-purple-200/60">
            {contentType} Editor
          </span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="hidden sm:inline">Type <code className="font-mono text-purple-600 bg-purple-50 px-1 rounded">/</code> for block commands</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Word Count */}
          {showWordCount && editor && (
            <span className="hidden xs:inline text-slate-400">
              {editor.getText().trim() ? editor.getText().trim().split(/\s+/).length : 0} words
            </span>
          )}

          {/* Auto-save status */}
          <div className="flex items-center gap-1.5 text-slate-500 font-bold">
            {isSaving ? (
              <>
                <Clock className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>{lastSaved}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
