'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Code, Highlighter,
  List, ListOrdered, Quote,
  AlignLeft, AlignCenter, AlignRight,
  Table as TableIcon,
  FunctionSquare, TrendingUp, Network, Sparkles, Image as ImageIcon,
  Link as LinkIcon, Undo, Redo, Plus, ChevronDown,
  Info, AlertTriangle, Wand2, Type,
  X, Check, ExternalLink, Paperclip,
  RowsIcon, Columns, Trash2, ArrowUp, ArrowDown,
  ArrowLeft, ArrowRight, Minus, ListChecks,
  Upload
} from 'lucide-react';
import { EditorContentType } from '../types';
import { CONTENT_TYPE_CONFIGS } from '../config/editorConfig';

interface EditorToolbarProps {
  editor: any;
  contentType?: EditorContentType;
  onApplyAI?: (action: string) => void;
}

// ── Color palette ──
const TEXT_COLORS = [
  { label: 'Default', value: '' },
  { label: 'Black', value: '#0f172a' },
  { label: 'Dark Gray', value: '#475569' },
  { label: 'Gray', value: '#94a3b8' },
  { label: 'Red', value: '#dc2626' },
  { label: 'Orange', value: '#ea580c' },
  { label: 'Amber', value: '#d97706' },
  { label: 'Green', value: '#16a34a' },
  { label: 'Teal', value: '#0d9488' },
  { label: 'Blue', value: '#2563eb' },
  { label: 'Indigo', value: '#4f46e5' },
  { label: 'Purple', value: '#7c3aed' },
  { label: 'Pink', value: '#db2777' },
  { label: 'Rose', value: '#e11d48' },
];

const HIGHLIGHT_COLORS = [
  { label: 'Yellow', value: '#fef08a' },
  { label: 'Green', value: '#bbf7d0' },
  { label: 'Blue', value: '#bfdbfe' },
  { label: 'Pink', value: '#fbcfe8' },
  { label: 'Purple', value: '#e9d5ff' },
  { label: 'Orange', value: '#fed7aa' },
  { label: 'Red', value: '#fecaca' },
  { label: 'Cyan', value: '#a5f3fc' },
];

export default function EditorToolbar({ editor, contentType = 'document', onApplyAI }: EditorToolbarProps) {
  const [insertDropdownOpen, setInsertDropdownOpen] = useState(false);
  const [headingDropdownOpen, setHeadingDropdownOpen] = useState(false);
  const [aiDropdownOpen, setAiDropdownOpen] = useState(false);
  const [textColorOpen, setTextColorOpen] = useState(false);
  const [highlightColorOpen, setHighlightColorOpen] = useState(false);
  const [linkPopoverOpen, setLinkPopoverOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [tableMenuOpen, setTableMenuOpen] = useState(false);

  const linkInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  if (!editor) return null;

  const config = CONTENT_TYPE_CONFIGS[contentType] || CONTENT_TYPE_CONFIGS.document;

  // ── Close all dropdowns when clicking outside ──
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        setInsertDropdownOpen(false);
        setHeadingDropdownOpen(false);
        setAiDropdownOpen(false);
        setTextColorOpen(false);
        setHighlightColorOpen(false);
        setLinkPopoverOpen(false);
        setImageDialogOpen(false);
        setTableMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ── Link Handler ──
  const handleSetLink = () => {
    if (!linkUrl.trim()) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      let finalUrl = linkUrl.trim();
      if (!/^https?:\/\//i.test(finalUrl) && !finalUrl.startsWith('mailto:') && !finalUrl.startsWith('#')) {
        finalUrl = 'https://' + finalUrl;
      }
      editor.chain().focus().extendMarkRange('link').setLink({ href: finalUrl }).run();
    }
    setLinkPopoverOpen(false);
    setLinkUrl('');
  };

  const openLinkPopover = () => {
    const previousUrl = editor.getAttributes('link').href || '';
    setLinkUrl(previousUrl);
    setLinkPopoverOpen(true);
    setTimeout(() => linkInputRef.current?.focus(), 100);
  };

  // ── Image Upload via File Picker ──
  const handleImageFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      if (dataUrl) {
        editor.chain().focus().setImage({ src: dataUrl, alt: file.name }).run();
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
    setImageDialogOpen(false);
  };

  // ── Image via URL ──
  const handleInsertImageUrl = () => {
    if (imageUrl.trim()) {
      editor.chain().focus().setImage({ src: imageUrl.trim() }).run();
    }
    setImageUrl('');
    setImageDialogOpen(false);
  };

  // ── File/PDF Attachment as Downloadable Link ──
  const handleFileAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      if (dataUrl) {
        const ext = file.name.split('.').pop()?.toLowerCase();
        const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(ext || '');
        if (isImage) {
          editor.chain().focus().setImage({ src: dataUrl, alt: file.name }).run();
        } else {
          editor.chain().focus().insertContent(`
            <p>
              <a href="${dataUrl}" download="${file.name}" class="text-[#006fcc] underline font-semibold">
                📎 ${file.name} (${(file.size / 1024).toFixed(1)} KB)
              </a>
            </p>
          `).run();
        }
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // ── Toolbar Button Component with preventDefault to preserve selection ──
  const ToolBtn = ({ onClick, isActive, title, children, className: extraClass = '' }: {
    onClick: () => void; isActive?: boolean; title: string; children: React.ReactNode; className?: string;
  }) => (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`p-1.5 rounded-lg transition-all duration-150 ${
        isActive
          ? 'bg-purple-100 text-purple-700 font-black shadow-2xs'
          : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
      } ${extraClass}`}
      title={title}
    >
      {children}
    </button>
  );

  const AI_ACTIONS = [
    { label: 'Fix Grammar & Polish', action: 'fix_grammar' },
    { label: 'Make Professional & Academic', action: 'make_professional' },
    { label: 'Summarize Key Takeaways', action: 'summarize' },
    { label: 'Expand Technical Details', action: 'expand' },
    { label: 'Generate Experiment Procedure', action: 'generate_procedure' },
  ];

  return (
    <div ref={toolbarRef} className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-1.5 sm:p-2 flex items-center justify-between gap-1 flex-wrap text-xs sticky top-0 z-30 select-none">
      
      {/* ── LEFT CONTROLS ── */}
      <div className="flex items-center gap-0.5 flex-wrap">
        
        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5 border-r border-slate-200 dark:border-slate-800 pr-1 mr-0.5">
          <ToolBtn onClick={() => editor.chain().focus().undo().run()} title="Undo (Ctrl+Z)">
            <Undo className="w-3.5 h-3.5" />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().redo().run()} title="Redo (Ctrl+Y)">
            <Redo className="w-3.5 h-3.5" />
          </ToolBtn>
        </div>

        {/* Headings Dropdown */}
        <div className="relative">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              setHeadingDropdownOpen(!headingDropdownOpen);
              setInsertDropdownOpen(false);
              setAiDropdownOpen(false);
              setTextColorOpen(false);
              setHighlightColorOpen(false);
            }}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs"
          >
            <Type className="w-3.5 h-3.5 text-purple-600" />
            <span className="hidden sm:inline">
              {editor.isActive('heading', { level: 1 }) ? 'H1'
                : editor.isActive('heading', { level: 2 }) ? 'H2'
                : editor.isActive('heading', { level: 3 }) ? 'H3'
                : 'Text'}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {headingDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1 z-50">
              {[
                { label: 'Normal Text', action: () => editor.chain().focus().setParagraph().run(), check: editor.isActive('paragraph'), style: 'text-sm' },
                { label: 'Heading 1', action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), check: editor.isActive('heading', { level: 1 }), style: 'text-lg font-black' },
                { label: 'Heading 2', action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), check: editor.isActive('heading', { level: 2 }), style: 'text-base font-bold' },
                { label: 'Heading 3', action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), check: editor.isActive('heading', { level: 3 }), style: 'text-sm font-semibold' },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    item.action();
                    setHeadingDropdownOpen(false);
                  }}
                  className={`w-full px-3 py-1.5 text-left hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between ${item.style} ${
                    item.check ? 'text-purple-600 bg-purple-50 dark:bg-purple-950 font-bold' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {item.label}
                  {item.check && <Check className="w-3.5 h-3.5 text-purple-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Text Styling: Bold, Italic, Underline, Strike, Code */}
        <div className="flex items-center gap-0.5 border-l border-slate-200 dark:border-slate-800 pl-1">
          <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Bold (Ctrl+B)">
            <Bold className="w-3.5 h-3.5" />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Italic (Ctrl+I)">
            <Italic className="w-3.5 h-3.5" />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="Underline (Ctrl+U)">
            <UnderlineIcon className="w-3.5 h-3.5" />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} title="Strikethrough">
            <Strikethrough className="w-3.5 h-3.5" />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleCode().run()} isActive={editor.isActive('code')} title="Inline Code (`code`)">
            <Code className="w-3.5 h-3.5" />
          </ToolBtn>
        </div>

        {/* ── Text Color Picker ── */}
        <div className="relative border-l border-slate-200 dark:border-slate-800 pl-1">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              setTextColorOpen(!textColorOpen);
              setHighlightColorOpen(false);
              setInsertDropdownOpen(false);
            }}
            className={`p-1.5 rounded-lg transition-all flex items-center gap-0.5 ${
              editor.isActive('textStyle') ? 'bg-blue-100 text-blue-700' : 'hover:bg-slate-100 text-slate-600 dark:text-slate-400'
            }`}
            title="Text Color"
          >
            <span className="text-xs font-black" style={{ color: editor.getAttributes('textStyle').color || '#0f172a' }}>A</span>
            <div className="w-3.5 h-1 rounded-full" style={{ background: editor.getAttributes('textStyle').color || '#0f172a' }} />
          </button>

          {textColorOpen && (
            <div className="absolute top-full left-0 mt-1 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 w-[180px]">
              <p className="text-[9px] font-bold uppercase text-slate-400 mb-1.5 px-1">Text Color</p>
              <div className="grid grid-cols-7 gap-1">
                {TEXT_COLORS.map((c) => (
                  <button
                    key={c.value || 'default'}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      if (c.value) {
                        editor.chain().focus().setColor(c.value).run();
                      } else {
                        editor.chain().focus().unsetColor().run();
                      }
                      setTextColorOpen(false);
                    }}
                    className="w-5 h-5 rounded-full border-2 border-slate-200 hover:border-purple-500 hover:scale-125 transition-all"
                    style={{ background: c.value || 'linear-gradient(135deg, #000 50%, #fff 50%)' }}
                    title={c.label}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Highlight Color Picker ── */}
        <div className="relative">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              setHighlightColorOpen(!highlightColorOpen);
              setTextColorOpen(false);
              setInsertDropdownOpen(false);
            }}
            className={`p-1.5 rounded-lg transition-all ${
              editor.isActive('highlight') ? 'bg-amber-100 text-amber-800' : 'hover:bg-slate-100 text-slate-600 dark:text-slate-400'
            }`}
            title="Highlight Color"
          >
            <Highlighter className="w-3.5 h-3.5" />
          </button>

          {highlightColorOpen && (
            <div className="absolute top-full left-0 mt-1 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 w-[180px]">
              <p className="text-[9px] font-bold uppercase text-slate-400 mb-1.5 px-1">Highlight Color</p>
              <div className="grid grid-cols-4 gap-1.5">
                {HIGHLIGHT_COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      editor.chain().focus().toggleHighlight({ color: c.value }).run();
                      setHighlightColorOpen(false);
                    }}
                    className="w-8 h-5 rounded-md border border-slate-200 hover:border-purple-500 hover:scale-110 transition-all text-[8px] font-bold text-slate-700"
                    style={{ background: c.value }}
                    title={c.label}
                  >
                    {c.label.slice(0, 2)}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  editor.chain().focus().unsetHighlight().run();
                  setHighlightColorOpen(false);
                }}
                className="w-full mt-1.5 px-2 py-1 text-[10px] font-bold text-slate-500 hover:bg-slate-100 rounded-lg flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Remove Highlight
              </button>
            </div>
          )}
        </div>

        {/* Alignment (desktop only) */}
        <div className="hidden md:flex items-center gap-0.5 border-l border-slate-200 dark:border-slate-800 pl-1">
          <ToolBtn onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} title="Align Left">
            <AlignLeft className="w-3.5 h-3.5" />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} title="Align Center">
            <AlignCenter className="w-3.5 h-3.5" />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} title="Align Right">
            <AlignRight className="w-3.5 h-3.5" />
          </ToolBtn>
        </div>

        {/* Lists & Quotes */}
        <div className="flex items-center gap-0.5 border-l border-slate-200 dark:border-slate-800 pl-1">
          <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Bullet List">
            <List className="w-3.5 h-3.5" />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="Numbered List">
            <ListOrdered className="w-3.5 h-3.5" />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleTaskList().run()} isActive={editor.isActive('taskList')} title="Task / Checklist">
            <ListChecks className="w-3.5 h-3.5" />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} title="Blockquote">
            <Quote className="w-3.5 h-3.5" />
          </ToolBtn>
        </div>

        {/* ── TABLE CONTROLS (shows when cursor is in table) ── */}
        {editor.isActive('table') && (
          <div className="relative border-l border-slate-200 dark:border-slate-800 pl-1">
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                setTableMenuOpen(!tableMenuOpen);
                setInsertDropdownOpen(false);
              }}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold text-xs border border-teal-200"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Table</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {tableMenuOpen && (
              <div className="absolute top-full left-0 mt-1 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1 z-50">
                <p className="px-3 py-1 text-[9px] font-black uppercase text-slate-400">Rows</p>
                <button type="button" onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().addRowBefore().run(); setTableMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100">
                  <ArrowUp className="w-3.5 h-3.5 text-teal-600" /> Add Row Above
                </button>
                <button type="button" onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().addRowAfter().run(); setTableMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100">
                  <ArrowDown className="w-3.5 h-3.5 text-teal-600" /> Add Row Below
                </button>
                <button type="button" onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().deleteRow().run(); setTableMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50">
                  <Trash2 className="w-3.5 h-3.5" /> Delete Row
                </button>

                <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
                <p className="px-3 py-1 text-[9px] font-black uppercase text-slate-400">Columns</p>
                <button type="button" onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().addColumnBefore().run(); setTableMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100">
                  <ArrowLeft className="w-3.5 h-3.5 text-teal-600" /> Add Column Left
                </button>
                <button type="button" onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().addColumnAfter().run(); setTableMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100">
                  <ArrowRight className="w-3.5 h-3.5 text-teal-600" /> Add Column Right
                </button>
                <button type="button" onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().deleteColumn().run(); setTableMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50">
                  <Trash2 className="w-3.5 h-3.5" /> Delete Column
                </button>

                <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
                <p className="px-3 py-1 text-[9px] font-black uppercase text-slate-400">Table</p>
                <button type="button" onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleHeaderRow().run(); setTableMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100">
                  <RowsIcon className="w-3.5 h-3.5 text-indigo-600" /> Toggle Header Row
                </button>
                <button type="button" onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().mergeCells().run(); setTableMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100">
                  <Columns className="w-3.5 h-3.5 text-indigo-600" /> Merge Cells
                </button>
                <button type="button" onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().splitCell().run(); setTableMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100">
                  <Columns className="w-3.5 h-3.5 text-indigo-600" /> Split Cell
                </button>
                <button type="button" onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().deleteTable().run(); setTableMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50">
                  <Trash2 className="w-3.5 h-3.5" /> Delete Table
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── INSERT DROPDOWN ── */}
        <div className="relative border-l border-slate-200 dark:border-slate-800 pl-1">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              setInsertDropdownOpen(!insertDropdownOpen);
              setHeadingDropdownOpen(false);
              setAiDropdownOpen(false);
              setTextColorOpen(false);
              setHighlightColorOpen(false);
            }}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#006fcc] hover:bg-[#005bb8] text-white font-bold text-xs shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Insert</span>
            <ChevronDown className="w-3 h-3 opacity-70" />
          </button>

          {insertDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-1 z-50 max-h-[400px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
              
              {/* Data & Tables */}
              <div className="p-1 space-y-0.5">
                <p className="px-2 py-0.5 text-[9px] font-black uppercase text-slate-400">Data & Media</p>
                {config.tables && (
                  <button type="button" onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(); setInsertDropdownOpen(false); }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-left text-xs font-bold text-slate-700">
                    <TableIcon className="w-3.5 h-3.5 text-teal-600" /> Data Table (3×3)
                  </button>
                )}
                {/* Image Upload */}
                <button type="button" onMouseDown={(e) => { e.preventDefault(); setImageDialogOpen(true); setInsertDropdownOpen(false); }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-left text-xs font-bold text-slate-700">
                  <ImageIcon className="w-3.5 h-3.5 text-blue-600" /> Image (Upload / URL)
                </button>
                {/* File/PDF Attachment */}
                <button type="button" onMouseDown={(e) => { e.preventDefault(); fileInputRef.current?.click(); setInsertDropdownOpen(false); }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-left text-xs font-bold text-slate-700">
                  <Paperclip className="w-3.5 h-3.5 text-orange-600" /> File / PDF Attachment
                </button>
                {/* Horizontal Rule */}
                <button type="button" onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().setHorizontalRule().run(); setInsertDropdownOpen(false); }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-left text-xs font-bold text-slate-700">
                  <Minus className="w-3.5 h-3.5 text-slate-500" /> Horizontal Divider
                </button>
                {/* Code Block */}
                <button type="button" onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleCodeBlock().run(); setInsertDropdownOpen(false); }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-left text-xs font-bold text-slate-700">
                  <Code className="w-3.5 h-3.5 text-rose-600" /> Code Block
                </button>
              </div>

              {/* Scientific Tools */}
              {(config.formulas || config.graphs || config.diagrams) && (
                <div className="p-1 space-y-0.5">
                  <p className="px-2 py-0.5 text-[9px] font-black uppercase text-slate-400">Scientific Tools</p>
                  {config.formulas && (
                    <button type="button" onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().insertContent({ type: 'formula', attrs: { latex: 'V = I \\cdot R' } }).run(); setInsertDropdownOpen(false); }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-left text-xs font-bold text-slate-700">
                      <FunctionSquare className="w-3.5 h-3.5 text-purple-600" /> LaTeX Formula
                    </button>
                  )}
                  {config.graphs && (
                    <button type="button" onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().insertContent({ type: 'graph' }).run(); setInsertDropdownOpen(false); }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-left text-xs font-bold text-slate-700">
                      <TrendingUp className="w-3.5 h-3.5 text-[#006fcc]" /> Interactive Graph
                    </button>
                  )}
                  {config.diagrams && (
                    <button type="button" onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().insertContent({ type: 'mermaid' }).run(); setInsertDropdownOpen(false); }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-left text-xs font-bold text-slate-700">
                      <Network className="w-3.5 h-3.5 text-indigo-600" /> Mermaid Diagram
                    </button>
                  )}
                </div>
              )}

              {/* Callouts */}
              {config.callouts && (
                <div className="p-1 space-y-0.5">
                  <p className="px-2 py-0.5 text-[9px] font-black uppercase text-slate-400">Callout Cards</p>
                  {[
                    { variant: 'note', label: 'Note Card', icon: Info, color: 'blue' },
                    { variant: 'tip', label: 'Pro Tip Card', icon: Sparkles, color: 'emerald' },
                    { variant: 'warning', label: 'Warning Card', icon: AlertTriangle, color: 'amber' },
                  ].map((c) => (
                    <button key={c.variant} type="button" onMouseDown={(e) => {
                      e.preventDefault();
                      editor.chain().focus().insertContent({ type: 'callout', attrs: { variant: c.variant }, content: [{ type: 'paragraph', content: [{ type: 'text', text: `${c.label} content here...` }] }] }).run();
                      setInsertDropdownOpen(false);
                    }}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-${c.color}-50 text-left text-xs font-bold text-${c.color}-900`}>
                      <c.icon className={`w-3.5 h-3.5 text-${c.color}-600`} /> {c.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── RIGHT CONTROLS ── */}
      <div className="flex items-center gap-1">
        
        {/* Link Button with Popover */}
        <div className="relative">
          <ToolBtn onClick={openLinkPopover} isActive={editor.isActive('link')} title="Add Link (Ctrl+K)">
            <LinkIcon className="w-3.5 h-3.5" />
          </ToolBtn>

          {linkPopoverOpen && (
            <div className="absolute top-full right-0 mt-1 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-3 z-50">
              <p className="text-[10px] font-bold uppercase text-slate-400 mb-2">Insert Link</p>
              <input
                ref={linkInputRef}
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSetLink(); } }}
                placeholder="https://example.com"
                className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400 mb-2"
              />
              <div className="flex items-center gap-2">
                <button type="button" onMouseDown={(e) => { e.preventDefault(); handleSetLink(); }}
                  className="flex-1 px-3 py-1.5 bg-[#006fcc] hover:bg-[#005bb8] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1">
                  <ExternalLink className="w-3 h-3" /> Apply Link
                </button>
                {editor.isActive('link') && (
                  <button type="button" onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().unsetLink().run(); setLinkPopoverOpen(false); }}
                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold">
                    Remove
                  </button>
                )}
                <button type="button" onClick={() => setLinkPopoverOpen(false)}
                  className="px-2 py-1.5 hover:bg-slate-100 rounded-lg">
                  <X className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* AI Assistant */}
        {config.aiAssistance && (
          <div className="relative">
            <button type="button" onMouseDown={(e) => {
              e.preventDefault();
              setAiDropdownOpen(!aiDropdownOpen);
              setInsertDropdownOpen(false);
              setHeadingDropdownOpen(false);
            }}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs shadow-xs transition-all active:scale-95">
              <Wand2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">AI</span>
              <ChevronDown className="w-3 h-3 opacity-70" />
            </button>

            {aiDropdownOpen && (
              <div className="absolute top-full right-0 mt-1 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1 z-50">
                <div className="px-3 py-1 text-[10px] font-black uppercase text-purple-600 tracking-wider border-b border-slate-100">
                  AI Writing Assistant
                </div>
                <div className="py-1">
                  {AI_ACTIONS.map((item) => (
                    <button key={item.action} type="button" onMouseDown={(e) => {
                      e.preventDefault();
                      onApplyAI?.(item.action);
                      setAiDropdownOpen(false);
                    }}
                      className="w-full px-3 py-1.5 text-left text-xs font-semibold text-slate-700 hover:bg-purple-50 hover:text-purple-900 transition-colors">
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── IMAGE DIALOG (Upload / URL) ── */}
      {imageDialogOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => setImageDialogOpen(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-5 w-[90%] max-w-md border border-slate-200" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-800">Insert Image</h3>
              <button type="button" onClick={() => setImageDialogOpen(false)} className="p-1 hover:bg-slate-100 rounded-lg">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <button type="button" onClick={() => imageInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-300 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all mb-3 text-sm font-bold text-slate-600">
              <Upload className="w-5 h-5 text-purple-500" />
              Upload from Device
            </button>

            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold mb-3">
              <div className="flex-1 h-px bg-slate-200" /> OR <div className="flex-1 h-px bg-slate-200" />
            </div>

            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleInsertImageUrl(); }}
                placeholder="https://example.com/image.png"
                className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <button type="button" onClick={handleInsertImageUrl}
                className="px-3 py-2 bg-[#006fcc] hover:bg-[#005bb8] text-white rounded-lg text-xs font-bold">
                Insert
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden file inputs */}
      <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageFileSelect} />
      <input ref={fileInputRef} type="file" accept="*/*" className="hidden" onChange={handleFileAttachment} />
    </div>
  );
}
