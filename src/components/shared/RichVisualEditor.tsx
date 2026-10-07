'use client';

import React, { useRef, useState, useEffect } from 'react';
import {
  Bold, Italic, Underline, List, ListOrdered, Highlighter,
  Palette, Link2, Eye, Edit3, Sparkles, Paperclip, X, RemoveFormatting
} from 'lucide-react';

interface RichVisualEditorProps {
  initialHtml?: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export default function RichVisualEditor({
  initialHtml = '',
  onChange,
  placeholder = 'Type and format your content here. Select text and click color/highlight to decorate...',
  minHeight = '140px',
}: RichVisualEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [htmlContent, setHtmlContent] = useState(initialHtml);
  const [linkInputOpen, setLinkInputOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  useEffect(() => {
    if (editorRef.current && initialHtml && !editorRef.current.innerHTML) {
      editorRef.current.innerHTML = initialHtml;
    }
  }, [initialHtml]);

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      setHtmlContent(html);
      onChange(html);
    }
  };

  const executeCommand = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
      handleInput();
    }
  };

  const applyHighlight = (color: string) => {
    // Some browsers use hiliteColor, others use backColor
    try {
      if (!document.execCommand('hiliteColor', false, color)) {
        document.execCommand('backColor', false, color);
      }
    } catch {
      document.execCommand('backColor', false, color);
    }
    if (editorRef.current) {
      editorRef.current.focus();
      handleInput();
    }
  };

  const applyTextColor = (color: string) => {
    document.execCommand('foreColor', false, color);
    if (editorRef.current) {
      editorRef.current.focus();
      handleInput();
    }
  };

  const applyLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkUrl.trim()) return;
    let url = linkUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`;
    }
    document.execCommand('createLink', false, url);
    setLinkUrl('');
    setLinkInputOpen(false);
    if (editorRef.current) {
      editorRef.current.focus();
      handleInput();
    }
  };

  return (
    <div className="border border-gray-300 rounded-2xl overflow-hidden bg-white shadow-2xs focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary transition-all">
      
      {/* ── TOP TOOLBAR ──────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 p-2 bg-gray-50 border-b border-gray-200 text-xs">
        
        {/* Left: Formatting Actions */}
        <div className="flex flex-wrap items-center gap-1">
          
          {/* Bold */}
          <button
            type="button"
            onClick={() => executeCommand('bold')}
            className="p-1.5 rounded-lg hover:bg-white hover:shadow-2xs text-gray-700 font-black transition-all"
            title="Bold"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>

          {/* Italic */}
          <button
            type="button"
            onClick={() => executeCommand('italic')}
            className="p-1.5 rounded-lg hover:bg-white hover:shadow-2xs text-gray-700 italic transition-all"
            title="Italic"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>

          {/* Underline */}
          <button
            type="button"
            onClick={() => executeCommand('underline')}
            className="p-1.5 rounded-lg hover:bg-white hover:shadow-2xs text-gray-700 underline transition-all"
            title="Underline"
          >
            <Underline className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-gray-300 mx-0.5" />

          {/* Highlight Color Palette */}
          <div className="flex items-center gap-1 px-1.5 py-1 bg-white rounded-lg border border-gray-200 shadow-2xs" title="Text Highlight Color">
            <Highlighter className="w-3 h-3 text-amber-500 shrink-0" />
            <button
              type="button"
              onClick={() => applyHighlight('#fef08a')}
              className="w-4 h-4 rounded-full bg-yellow-300 border border-yellow-400 hover:scale-125 transition-transform"
              title="Yellow Highlight"
            />
            <button
              type="button"
              onClick={() => applyHighlight('#a5f3fc')}
              className="w-4 h-4 rounded-full bg-cyan-300 border border-cyan-400 hover:scale-125 transition-transform"
              title="Cyan Highlight"
            />
            <button
              type="button"
              onClick={() => applyHighlight('#bbf7d0')}
              className="w-4 h-4 rounded-full bg-emerald-300 border border-emerald-400 hover:scale-125 transition-transform"
              title="Green Highlight"
            />
            <button
              type="button"
              onClick={() => applyHighlight('#fed7aa')}
              className="w-4 h-4 rounded-full bg-orange-300 border border-orange-400 hover:scale-125 transition-transform"
              title="Orange Highlight"
            />
            <button
              type="button"
              onClick={() => applyHighlight('#e9d5ff')}
              className="w-4 h-4 rounded-full bg-purple-300 border border-purple-400 hover:scale-125 transition-transform"
              title="Purple Highlight"
            />
            <button
              type="button"
              onClick={() => applyHighlight('transparent')}
              className="text-[10px] text-gray-400 hover:text-gray-700 px-1 font-bold"
              title="Clear Highlight"
            >
              ✕
            </button>
          </div>

          {/* Font Colors */}
          <div className="flex items-center gap-1 px-1.5 py-1 bg-white rounded-lg border border-gray-200 shadow-2xs" title="Text Font Color">
            <Palette className="w-3 h-3 text-indigo-500 shrink-0" />
            <button
              type="button"
              onClick={() => applyTextColor('#0284c7')}
              className="w-4 h-4 rounded-full bg-sky-600 hover:scale-125 transition-transform"
              title="Sky Blue Text"
            />
            <button
              type="button"
              onClick={() => applyTextColor('#dc2626')}
              className="w-4 h-4 rounded-full bg-red-600 hover:scale-125 transition-transform"
              title="Crimson Red Text"
            />
            <button
              type="button"
              onClick={() => applyTextColor('#059669')}
              className="w-4 h-4 rounded-full bg-emerald-600 hover:scale-125 transition-transform"
              title="Emerald Green Text"
            />
            <button
              type="button"
              onClick={() => applyTextColor('#7c3aed')}
              className="w-4 h-4 rounded-full bg-violet-600 hover:scale-125 transition-transform"
              title="Violet Purple Text"
            />
            <button
              type="button"
              onClick={() => applyTextColor('#111827')}
              className="w-4 h-4 rounded-full bg-gray-900 hover:scale-125 transition-transform"
              title="Dark Charcoal Text"
            />
          </div>

          <div className="h-4 w-px bg-gray-300 mx-0.5" />

          {/* Bullet List */}
          <button
            type="button"
            onClick={() => executeCommand('insertUnorderedList')}
            className="p-1.5 rounded-lg hover:bg-white hover:shadow-2xs text-gray-700 transition-all"
            title="Bullet Points"
          >
            <List className="w-3.5 h-3.5" />
          </button>

          {/* Numbered List */}
          <button
            type="button"
            onClick={() => executeCommand('insertOrderedList')}
            className="p-1.5 rounded-lg hover:bg-white hover:shadow-2xs text-gray-700 transition-all"
            title="Numbered List"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>

          {/* Hyperlink */}
          <button
            type="button"
            onClick={() => setLinkInputOpen(!linkInputOpen)}
            className="p-1.5 rounded-lg hover:bg-white hover:shadow-2xs text-gray-700 hover:text-primary transition-all"
            title="Insert Link"
          >
            <Link2 className="w-3.5 h-3.5" />
          </button>

          {/* Clear Formatting */}
          <button
            type="button"
            onClick={() => executeCommand('removeFormat')}
            className="p-1.5 rounded-lg hover:bg-white hover:shadow-2xs text-gray-400 hover:text-gray-700 transition-all"
            title="Remove Formatting"
          >
            <RemoveFormatting className="w-3.5 h-3.5" />
          </button>

        </div>

        {/* Right: Write vs Live Preview Toggle */}
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-0.5 shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all ${
              activeTab === 'edit'
                ? 'bg-primary text-white shadow-2xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Edit3 className="w-3 h-3" />
            <span>Visual Editor</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all ${
              activeTab === 'preview'
                ? 'bg-primary text-white shadow-2xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>Live Preview</span>
          </button>
        </div>

      </div>

      {/* Link Input Bar */}
      {linkInputOpen && (
        <form onSubmit={applyLink} className="flex items-center gap-2 p-2 bg-cyan-50 border-b border-cyan-200 text-xs">
          <Link2 className="w-3.5 h-3.5 text-cyan-700 shrink-0" />
          <input
            type="text"
            placeholder="Paste or enter URL (e.g. https://cseel.org/science-fair)..."
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="flex-1 px-2.5 py-1 bg-white border border-cyan-300 rounded-lg text-xs outline-none"
            autoFocus
          />
          <button
            type="submit"
            className="px-3 py-1 bg-cyan-700 text-white rounded-lg font-bold text-[11px] hover:bg-cyan-800"
          >
            Apply Link
          </button>
          <button
            type="button"
            onClick={() => setLinkInputOpen(false)}
            className="p-1 text-gray-400 hover:text-gray-700"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </form>
      )}

      {/* ── CONTENT AREA ────────────────────────────────────────────────────── */}
      {activeTab === 'edit' ? (
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onBlur={handleInput}
          data-placeholder={placeholder}
          style={{ minHeight }}
          className="p-3.5 text-xs md:text-sm text-gray-900 outline-none leading-relaxed prose prose-sm max-w-none focus:outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 empty:before:pointer-events-none"
        />
      ) : (
        <div
          style={{ minHeight }}
          className="p-3.5 text-xs md:text-sm text-gray-900 leading-relaxed bg-gray-50/70 border-t border-gray-100 prose prose-sm max-w-none"
        >
          {htmlContent ? (
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          ) : (
            <p className="text-gray-400 italic text-xs">No content to preview yet. Switch back to Visual Editor to compose.</p>
          )}
        </div>
      )}

    </div>
  );
}
