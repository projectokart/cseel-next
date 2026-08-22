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
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { TaskList } from '@tiptap/extension-task-list';
import { TaskItem } from '@tiptap/extension-task-item';
import { Placeholder } from '@tiptap/extension-placeholder';

import { UniversalEditorProps, UniversalEditorValue } from './types';
import { CONTENT_TYPE_CONFIGS } from './config/editorConfig';
import { FormulaExtension } from './extensions/formulaExtension';
import { GraphExtension } from './extensions/graphExtension';
import { MermaidExtension } from './extensions/mermaidExtension';
import { CalloutExtension } from './extensions/calloutExtension';
import EditorToolbar from './toolbar/EditorToolbar';
import SlashCommandMenu from './toolbar/SlashCommandMenu';
import { Check, Clock } from 'lucide-react';

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
  const resolvedPlaceholder = placeholder || config.placeholder || 'Start writing... (Type / for commands)';

  const [slashMenuOpen, setSlashMenuOpen] = useState(false);
  const [slashQuery, setSlashQuery] = useState('');
  const [slashPosition, setSlashPosition] = useState({ top: 0, left: 0 });
  const [lastSaved, setLastSaved] = useState<string>('All changes saved');
  const [isSaving, setIsSaving] = useState(false);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        code: {
          HTMLAttributes: {
            class: 'bg-slate-100 dark:bg-slate-800 text-rose-600 dark:text-rose-400 px-1.5 py-0.5 rounded-md font-mono text-[0.85em] border border-slate-200 dark:border-slate-700',
          },
        },
        codeBlock: {
          HTMLAttributes: {
            class: 'bg-slate-950 text-slate-100 p-4 rounded-2xl font-mono text-xs my-3 overflow-x-auto border border-slate-800 leading-relaxed',
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc pl-6 space-y-1 my-2',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal pl-6 space-y-1 my-2',
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: 'border-l-4 border-purple-400 pl-4 py-1 my-3 text-slate-600 dark:text-slate-400 italic bg-purple-50/30 dark:bg-purple-950/20 rounded-r-xl',
          },
        },
        horizontalRule: {
          HTMLAttributes: {
            class: 'border-t-2 border-slate-200 dark:border-slate-700 my-6',
          },
        },
      }),
      TextStyle,
      Color,
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'editor-table border-collapse w-full my-4 text-xs',
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: 'border-b border-slate-200 dark:border-slate-700',
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: 'bg-slate-100 dark:bg-slate-800 font-bold p-2.5 text-left text-xs border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'p-2.5 border border-slate-200 dark:border-slate-700 text-xs',
        },
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-2xl max-w-full h-auto my-3 shadow-md border border-slate-200',
        },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          class: 'text-[#006fcc] underline decoration-[#006fcc]/40 font-semibold hover:text-blue-800 hover:decoration-blue-800 cursor-pointer transition-colors',
          target: '_blank',
          rel: 'noopener noreferrer nofollow',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      Highlight.configure({
        multicolor: true,
        HTMLAttributes: {
          class: 'rounded px-0.5',
        },
      }),
      TaskList.configure({
        HTMLAttributes: {
          class: 'not-prose pl-2 my-2 space-y-1',
        },
      }),
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: 'flex items-start gap-2',
        },
      }),
      Placeholder.configure({
        placeholder: resolvedPlaceholder,
        emptyEditorClass: 'is-editor-empty',
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
        class: 'prose prose-slate dark:prose-invert max-w-none focus:outline-none px-5 sm:px-8 py-5 text-sm leading-relaxed',
        style: `min-height: ${minHeight}`,
      },
      handleKeyDown: (view, event) => {
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

      setIsSaving(true);
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = setTimeout(() => {
        setIsSaving(false);
        setLastSaved(`Saved at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
        onSave?.(editorVal);
      }, 800);
    },
  });

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
            { type: 'paragraph', content: [{ type: 'text', text: 'Executive Summary: Key findings, rigorous scientific observations, and verified conclusions from the preceding analysis.' }] },
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
      {!readOnly && (
        <EditorToolbar
          editor={editor}
          contentType={contentType}
          onApplyAI={handleApplyAI}
        />
      )}

      <div
        className="flex-1 overflow-y-auto bg-white dark:bg-slate-900 relative"
        style={{ minHeight, maxHeight: maxHeight || 'auto' }}
      >
        <EditorContent editor={editor} />

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

      <div className="bg-slate-50/80 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800 px-4 py-2 flex items-center justify-between text-[11px] text-slate-500 select-none">
        <div className="flex items-center gap-2 font-medium">
          <span className="capitalize px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-bold border border-purple-200/60">
            {contentType}
          </span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="hidden sm:inline">Type <code className="font-mono text-purple-600 bg-purple-50 px-1 rounded">/</code> for commands</span>
        </div>

        <div className="flex items-center gap-3">
          {showWordCount && editor && (
            <span className="hidden xs:inline text-slate-400">
              {editor.getText().trim() ? editor.getText().trim().split(/\s+/).length : 0} words
            </span>
          )}

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

      {/* ── Editor CSS: Tables, Placeholder, Lists, Task Items ── */}
      <style jsx global>{`
        /* Placeholder */
        .is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #94a3b8;
          pointer-events: none;
          height: 0;
          font-style: italic;
        }
        /* Table styling */
        .editor-table {
          border-collapse: collapse;
          width: 100%;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid #e2e8f0;
        }
        .editor-table th,
        .editor-table td {
          border: 1px solid #e2e8f0;
          padding: 8px 12px;
          text-align: left;
          font-size: 13px;
          min-width: 80px;
          vertical-align: top;
        }
        .editor-table th {
          background: #f1f5f9;
          font-weight: 700;
          color: #334155;
          text-transform: uppercase;
          font-size: 11px;
          letter-spacing: 0.03em;
        }
        .editor-table tr:nth-child(even) td {
          background: #f8fafc;
        }
        .editor-table tr:hover td {
          background: #eff6ff;
        }
        /* Selected cell */
        .ProseMirror .selectedCell {
          background: #dbeafe !important;
          outline: 2px solid #3b82f6;
        }
        /* Column resize handle */
        .ProseMirror .column-resize-handle {
          position: absolute;
          right: -2px;
          top: 0;
          bottom: 0;
          width: 4px;
          background: #6366f1;
          cursor: col-resize;
          z-index: 20;
        }
        .ProseMirror table {
          margin: 16px 0;
        }
        /* Ordered & Unordered List styling */
        .ProseMirror ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
        }
        .ProseMirror ol ol { list-style-type: lower-alpha; }
        .ProseMirror ol ol ol { list-style-type: lower-roman; }
        .ProseMirror ul {
          list-style-type: disc;
          padding-left: 1.5rem;
        }
        .ProseMirror ul ul { list-style-type: circle; }
        .ProseMirror ul ul ul { list-style-type: square; }
        .ProseMirror li {
          margin: 2px 0;
        }
        .ProseMirror li p {
          margin: 0;
        }
        /* Inline code */
        .ProseMirror code {
          background: #f1f5f9;
          color: #e11d48;
          padding: 2px 6px;
          border-radius: 5px;
          font-family: ui-monospace, 'Cascadia Code', 'Fira Code', monospace;
          font-size: 0.85em;
          border: 1px solid #e2e8f0;
        }
        /* Code block */
        .ProseMirror pre {
          background: #020617;
          color: #e2e8f0;
          padding: 16px 20px;
          border-radius: 14px;
          font-family: ui-monospace, 'Cascadia Code', monospace;
          font-size: 13px;
          line-height: 1.65;
          overflow-x: auto;
          margin: 12px 0;
          border: 1px solid #1e293b;
        }
        .ProseMirror pre code {
          background: none;
          color: inherit;
          padding: 0;
          border: none;
          border-radius: 0;
          font-size: inherit;
        }
        /* Blockquote */
        .ProseMirror blockquote {
          border-left: 4px solid #a78bfa;
          padding-left: 16px;
          padding-top: 4px;
          padding-bottom: 4px;
          margin: 12px 0;
          color: #64748b;
          font-style: italic;
          background: rgba(139, 92, 246, 0.04);
          border-radius: 0 12px 12px 0;
        }
        /* Headings */
        .ProseMirror h1 { font-size: 1.75em; font-weight: 900; margin: 20px 0 8px; color: #0f172a; line-height: 1.2; }
        .ProseMirror h2 { font-size: 1.35em; font-weight: 800; margin: 16px 0 6px; color: #1e293b; line-height: 1.25; }
        .ProseMirror h3 { font-size: 1.1em; font-weight: 700; margin: 12px 0 4px; color: #334155; line-height: 1.3; }
        /* Horizontal rule */
        .ProseMirror hr {
          border: none;
          border-top: 2px solid #e2e8f0;
          margin: 24px 0;
        }
        /* Link styling */
        .ProseMirror a {
          color: #006fcc;
          text-decoration: underline;
          text-decoration-color: rgba(0, 111, 204, 0.35);
          font-weight: 600;
          cursor: pointer;
        }
        .ProseMirror a:hover {
          color: #1d4ed8;
          text-decoration-color: #1d4ed8;
        }
        /* Task list */
        .ProseMirror ul[data-type="taskList"] {
          list-style: none;
          padding-left: 4px;
        }
        .ProseMirror ul[data-type="taskList"] li {
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }
        .ProseMirror ul[data-type="taskList"] li label {
          margin-top: 3px;
        }
        .ProseMirror ul[data-type="taskList"] li label input[type="checkbox"] {
          accent-color: #7c3aed;
          width: 16px;
          height: 16px;
          cursor: pointer;
        }
        /* Image */
        .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 12px;
          margin: 12px 0;
        }
        .ProseMirror img.ProseMirror-selectednode {
          outline: 3px solid #7c3aed;
          outline-offset: 2px;
        }
        /* Highlight colors */
        .ProseMirror mark {
          border-radius: 3px;
          padding: 1px 3px;
        }
      `}</style>
    </div>
  );
}
