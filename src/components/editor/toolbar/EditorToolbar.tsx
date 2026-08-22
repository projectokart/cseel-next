'use client';

import React, { useState } from 'react';
import {
  Bold, Italic, Underline, Strikethrough, Code, Highlighter,
  Heading1, Heading2, Heading3, List, ListOrdered, Quote,
  AlignLeft, AlignCenter, AlignRight, Table as TableIcon,
  FunctionSquare, TrendingUp, Network, Sparkles, Image as ImageIcon,
  Link as LinkIcon, Undo, Redo, Plus, Check, ChevronDown,
  Info, AlertTriangle, BookOpen, Wand2, Type
} from 'lucide-react';
import { EditorContentType } from '../types';
import { CONTENT_TYPE_CONFIGS } from '../config/editorConfig';

interface EditorToolbarProps {
  editor: any;
  contentType?: EditorContentType;
  onApplyAI?: (action: string) => void;
}

export default function EditorToolbar({ editor, contentType = 'document', onApplyAI }: EditorToolbarProps) {
  const [insertDropdownOpen, setInsertDropdownOpen] = useState(false);
  const [headingDropdownOpen, setHeadingDropdownOpen] = useState(false);
  const [aiDropdownOpen, setAiDropdownOpen] = useState(false);
  const [linkInputOpen, setLinkInputOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  if (!editor) return null;

  const config = CONTENT_TYPE_CONFIGS[contentType] || CONTENT_TYPE_CONFIGS.document;

  const handleSetLink = () => {
    if (!linkUrl) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
    }
    setLinkInputOpen(false);
    setLinkUrl('');
  };

  const handleInsertImage = () => {
    const url = window.prompt('Enter Image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const AI_ACTIONS = [
    { label: 'Fix Grammar & Polish', action: 'fix_grammar' },
    { label: 'Make Professional & Academic', action: 'make_professional' },
    { label: 'Summarize Key Takeaways', action: 'summarize' },
    { label: 'Expand Technical Details', action: 'expand' },
    { label: 'Generate Experiment Procedure', action: 'generate_procedure' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-2 flex items-center justify-between gap-2 flex-wrap text-xs sticky top-0 z-30 select-none">
      
      {/* ── LEFT CONTROLS: Undo/Redo, Heading, Formatting, Alignment, Lists, Insert ── */}
      <div className="flex items-center gap-1 flex-wrap">
        
        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5 border-r border-slate-200 dark:border-slate-800 pr-1.5 mr-0.5">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-30"
            title="Undo (Ctrl+Z)"
          >
            <Undo className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-30"
            title="Redo (Ctrl+Y)"
          >
            <Redo className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Headings & Block Type Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setHeadingDropdownOpen(!headingDropdownOpen)}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs"
          >
            <Type className="w-3.5 h-3.5 text-purple-600" />
            <span className="hidden sm:inline">
              {editor.isActive('heading', { level: 1 })
                ? 'Heading 1'
                : editor.isActive('heading', { level: 2 })
                ? 'Heading 2'
                : editor.isActive('heading', { level: 3 })
                ? 'Heading 3'
                : 'Paragraph'}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {headingDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1 z-40">
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().setParagraph().run();
                  setHeadingDropdownOpen(false);
                }}
                className={`w-full px-3 py-1.5 text-left text-xs font-semibold hover:bg-slate-100 ${
                  editor.isActive('paragraph') ? 'text-purple-600 font-bold bg-purple-50' : 'text-slate-700'
                }`}
              >
                Normal Text
              </button>
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().toggleHeading({ level: 1 }).run();
                  setHeadingDropdownOpen(false);
                }}
                className={`w-full px-3 py-1.5 text-left text-sm font-black hover:bg-slate-100 ${
                  editor.isActive('heading', { level: 1 }) ? 'text-purple-600 bg-purple-50' : 'text-slate-800'
                }`}
              >
                Heading 1
              </button>
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().toggleHeading({ level: 2 }).run();
                  setHeadingDropdownOpen(false);
                }}
                className={`w-full px-3 py-1.5 text-left text-xs font-bold hover:bg-slate-100 ${
                  editor.isActive('heading', { level: 2 }) ? 'text-purple-600 bg-purple-50' : 'text-slate-800'
                }`}
              >
                Heading 2
              </button>
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().toggleHeading({ level: 3 }).run();
                  setHeadingDropdownOpen(false);
                }}
                className={`w-full px-3 py-1.5 text-left text-xs font-medium hover:bg-slate-100 ${
                  editor.isActive('heading', { level: 3 }) ? 'text-purple-600 bg-purple-50' : 'text-slate-800'
                }`}
              >
                Heading 3
              </button>
            </div>
          )}
        </div>

        {/* Text Styling: Bold, Italic, Underline, Strike, Code, Highlight */}
        <div className="flex items-center gap-0.5 border-l border-slate-200 dark:border-slate-800 pl-1.5">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive('bold')
                ? 'bg-purple-100 text-purple-700 font-black'
                : 'hover:bg-slate-100 text-slate-700'
            }`}
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive('italic')
                ? 'bg-purple-100 text-purple-700'
                : 'hover:bg-slate-100 text-slate-700'
            }`}
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive('underline')
                ? 'bg-purple-100 text-purple-700'
                : 'hover:bg-slate-100 text-slate-700'
            }`}
            title="Underline (Ctrl+U)"
          >
            <Underline className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive('strike')
                ? 'bg-purple-100 text-purple-700'
                : 'hover:bg-slate-100 text-slate-700'
            }`}
            title="Strikethrough"
          >
            <Strikethrough className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive('highlight')
                ? 'bg-amber-200 text-amber-900'
                : 'hover:bg-slate-100 text-slate-700'
            }`}
            title="Highlight Text"
          >
            <Highlighter className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive('code')
                ? 'bg-purple-100 text-purple-700'
                : 'hover:bg-slate-100 text-slate-700'
            }`}
            title="Inline Code"
          >
            <Code className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Alignment */}
        <div className="hidden md:flex items-center gap-0.5 border-l border-slate-200 dark:border-slate-800 pl-1.5">
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive({ textAlign: 'left' }) ? 'bg-slate-200 text-slate-900' : 'hover:bg-slate-100 text-slate-600'
            }`}
            title="Align Left"
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive({ textAlign: 'center' }) ? 'bg-slate-200 text-slate-900' : 'hover:bg-slate-100 text-slate-600'
            }`}
            title="Align Center"
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Lists & Quotes */}
        <div className="flex items-center gap-0.5 border-l border-slate-200 dark:border-slate-800 pl-1.5">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive('bulletList') ? 'bg-purple-100 text-purple-700' : 'hover:bg-slate-100 text-slate-700'
            }`}
            title="Bullet List"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive('orderedList') ? 'bg-purple-100 text-purple-700' : 'hover:bg-slate-100 text-slate-700'
            }`}
            title="Numbered List"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive('blockquote') ? 'bg-purple-100 text-purple-700' : 'hover:bg-slate-100 text-slate-700'
            }`}
            title="Blockquote"
          >
            <Quote className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* ── INSERT DROPDOWN (Scientific, Media & Data Blocks) ── */}
        <div className="relative border-l border-slate-200 dark:border-slate-800 pl-1.5">
          <button
            type="button"
            onClick={() => setInsertDropdownOpen(!insertDropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#006fcc] hover:bg-[#005bb8] text-white font-bold text-xs shadow-2xs transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Insert Block</span>
            <ChevronDown className="w-3 h-3 opacity-70" />
          </button>

          {insertDropdownOpen && (
            <div className="absolute top-full left-0 mt-1.5 w-60 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-1.5 z-40 divide-y divide-slate-100 dark:divide-slate-800">
              
              {/* Scientific Tools */}
              {(config.formulas || config.graphs || config.diagrams) && (
                <div className="p-1 space-y-0.5">
                  <p className="px-2 py-0.5 text-[9px] font-black uppercase text-slate-400">Scientific Tools</p>
                  {config.formulas && (
                    <button
                      type="button"
                      onClick={() => {
                        editor.chain().focus().insertContent({ type: 'formula', attrs: { latex: 'V = I \\cdot R' } }).run();
                        setInsertDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-left text-xs font-bold text-slate-700"
                    >
                      <FunctionSquare className="w-3.5 h-3.5 text-purple-600" />
                      <span>LaTeX Formula (V = IR)</span>
                    </button>
                  )}
                  {config.graphs && (
                    <button
                      type="button"
                      onClick={() => {
                        editor.chain().focus().insertContent({ type: 'graph' }).run();
                        setInsertDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-left text-xs font-bold text-slate-700"
                    >
                      <TrendingUp className="w-3.5 h-3.5 text-[#006fcc]" />
                      <span>Interactive Scientific Graph</span>
                    </button>
                  )}
                  {config.diagrams && (
                    <button
                      type="button"
                      onClick={() => {
                        editor.chain().focus().insertContent({ type: 'mermaid' }).run();
                        setInsertDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-left text-xs font-bold text-slate-700"
                    >
                      <Network className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Mermaid Science Diagram</span>
                    </button>
                  )}
                </div>
              )}

              {/* Educational Callouts */}
              {config.callouts && (
                <div className="p-1 space-y-0.5">
                  <p className="px-2 py-0.5 text-[9px] font-black uppercase text-slate-400">Educational Callouts</p>
                  <button
                    type="button"
                    onClick={() => {
                      editor.chain().focus().insertContent({ type: 'callout', attrs: { variant: 'note' }, content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Important note content here...' }] }] }).run();
                      setInsertDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-blue-50 text-left text-xs font-bold text-blue-900"
                  >
                    <Info className="w-3.5 h-3.5 text-[#006fcc]" />
                    <span>Important Note Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      editor.chain().focus().insertContent({ type: 'callout', attrs: { variant: 'tip' }, content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Practical tip content here...' }] }] }).run();
                      setInsertDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-emerald-50 text-left text-xs font-bold text-emerald-900"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Pro Tip Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      editor.chain().focus().insertContent({ type: 'callout', attrs: { variant: 'warning' }, content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Precaution & safety warning...' }] }] }).run();
                      setInsertDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-amber-50 text-left text-xs font-bold text-amber-900"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Warning / Precaution Card</span>
                  </button>
                </div>
              )}

              {/* Data & Tables */}
              {config.tables && (
                <div className="p-1 space-y-0.5">
                  <p className="px-2 py-0.5 text-[9px] font-black uppercase text-slate-400">Data & Media</p>
                  <button
                    type="button"
                    onClick={() => {
                      editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
                      setInsertDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-left text-xs font-bold text-slate-700"
                  >
                    <TableIcon className="w-3.5 h-3.5 text-teal-600" />
                    <span>Observation Table (3x3)</span>
                  </button>
                  {config.images && (
                    <button
                      type="button"
                      onClick={() => {
                        handleInsertImage();
                        setInsertDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-left text-xs font-bold text-slate-700"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                      <span>Insert Image</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

      </div>

      {/* ── RIGHT CONTROLS: AI Assistance & Link Tool ── */}
      <div className="flex items-center gap-1.5">
        
        {/* Link Button */}
        <button
          type="button"
          onClick={() => {
            const previousUrl = editor.getAttributes('link').href;
            const url = window.prompt('URL link:', previousUrl);
            if (url === null) return;
            if (url === '') {
              editor.chain().focus().extendMarkRange('link').unsetLink().run();
              return;
            }
            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
          }}
          className={`p-1.5 rounded-lg transition-colors ${
            editor.isActive('link') ? 'bg-blue-100 text-[#006fcc]' : 'hover:bg-slate-100 text-slate-700'
          }`}
          title="Add / Edit Hyperlink"
        >
          <LinkIcon className="w-3.5 h-3.5" />
        </button>

        {/* AI Assistant Button */}
        {config.aiAssistance && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setAiDropdownOpen(!aiDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs shadow-xs transition-all active:scale-95"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>AI Writing</span>
              <ChevronDown className="w-3 h-3 opacity-70" />
            </button>

            {aiDropdownOpen && (
              <div className="absolute top-full right-0 mt-1.5 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-1.5 z-40">
                <div className="px-3 py-1 text-[10px] font-black uppercase text-purple-600 tracking-wider border-b border-slate-100">
                  AI Editorial Assistant
                </div>
                <div className="py-1 space-y-0.5">
                  {AI_ACTIONS.map((item) => (
                    <button
                      key={item.action}
                      type="button"
                      onClick={() => {
                        onApplyAI?.(item.action);
                        setAiDropdownOpen(false);
                      }}
                      className="w-full px-3 py-1.5 text-left text-xs font-semibold text-slate-700 hover:bg-purple-50 hover:text-purple-900 transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
}
