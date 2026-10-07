'use client';

import React from 'react';
import {
  Bold, Italic, Underline, List, ListOrdered, Highlighter,
  Palette, Link2, Paperclip, Sparkles
} from 'lucide-react';

interface RichTextToolbarProps {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  textValue: string;
  setTextValue: (val: string) => void;
  onAddAttachment?: () => void;
}

export default function RichTextToolbar({
  textareaRef,
  textValue,
  setTextValue,
  onAddAttachment,
}: RichTextToolbarProps) {
  const insertFormatting = (prefix: string, suffix: string = '') => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = textValue.substring(start, end) || 'text';
    const before = textValue.substring(0, start);
    const after = textValue.substring(end);

    const newText = `${before}${prefix}${selected}${suffix}${after}`;
    setTextValue(newText);

    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 50);
  };

  const insertHighlight = (colorName: string) => {
    insertFormatting(`[highlight=${colorName}]`, `[/highlight]`);
  };

  const insertTextColor = (colorHex: string) => {
    insertFormatting(`[color=${colorHex}]`, `[/color]`);
  };

  return (
    <div className="flex flex-wrap items-center gap-1 p-1.5 bg-gray-100/90 border border-gray-200 rounded-xl text-xs">
      
      {/* Bold */}
      <button
        type="button"
        onClick={() => insertFormatting('**', '**')}
        className="p-1.5 rounded-lg hover:bg-white hover:shadow-2xs text-gray-700 font-bold transition-all"
        title="Bold (**text**)"
      >
        <Bold className="w-3.5 h-3.5" />
      </button>

      {/* Italic */}
      <button
        type="button"
        onClick={() => insertFormatting('*', '*')}
        className="p-1.5 rounded-lg hover:bg-white hover:shadow-2xs text-gray-700 italic transition-all"
        title="Italic (*text*)"
      >
        <Italic className="w-3.5 h-3.5" />
      </button>

      {/* Underline */}
      <button
        type="button"
        onClick={() => insertFormatting('<u>', '</u>')}
        className="p-1.5 rounded-lg hover:bg-white hover:shadow-2xs text-gray-700 underline transition-all"
        title="Underline"
      >
        <Underline className="w-3.5 h-3.5" />
      </button>

      <div className="h-4 w-px bg-gray-300 mx-0.5" />

      {/* Highlights (Yellow, Cyan, Emerald, Orange, Purple) */}
      <div className="flex items-center gap-1 px-1 bg-white rounded-lg border border-gray-200 py-0.5">
        <Highlighter className="w-3 h-3 text-amber-500 shrink-0" />
        <button
          type="button"
          onClick={() => insertHighlight('yellow')}
          className="w-3.5 h-3.5 rounded-full bg-yellow-300 hover:scale-125 transition-transform"
          title="Highlight Yellow"
        />
        <button
          type="button"
          onClick={() => insertHighlight('cyan')}
          className="w-3.5 h-3.5 rounded-full bg-cyan-300 hover:scale-125 transition-transform"
          title="Highlight Cyan"
        />
        <button
          type="button"
          onClick={() => insertHighlight('green')}
          className="w-3.5 h-3.5 rounded-full bg-emerald-300 hover:scale-125 transition-transform"
          title="Highlight Green"
        />
        <button
          type="button"
          onClick={() => insertHighlight('orange')}
          className="w-3.5 h-3.5 rounded-full bg-orange-300 hover:scale-125 transition-transform"
          title="Highlight Orange"
        />
        <button
          type="button"
          onClick={() => insertHighlight('purple')}
          className="w-3.5 h-3.5 rounded-full bg-purple-300 hover:scale-125 transition-transform"
          title="Highlight Purple"
        />
      </div>

      {/* Text Colors */}
      <div className="flex items-center gap-1 px-1 bg-white rounded-lg border border-gray-200 py-0.5">
        <Palette className="w-3 h-3 text-indigo-500 shrink-0" />
        <button
          type="button"
          onClick={() => insertTextColor('#0284c7')}
          className="w-3.5 h-3.5 rounded-full bg-sky-600 hover:scale-125 transition-transform"
          title="Sky Blue Text"
        />
        <button
          type="button"
          onClick={() => insertTextColor('#dc2626')}
          className="w-3.5 h-3.5 rounded-full bg-red-600 hover:scale-125 transition-transform"
          title="Crimson Red Text"
        />
        <button
          type="button"
          onClick={() => insertTextColor('#059669')}
          className="w-3.5 h-3.5 rounded-full bg-emerald-600 hover:scale-125 transition-transform"
          title="Emerald Green Text"
        />
        <button
          type="button"
          onClick={() => insertTextColor('#7c3aed')}
          className="w-3.5 h-3.5 rounded-full bg-violet-600 hover:scale-125 transition-transform"
          title="Purple Text"
        />
      </div>

      <div className="h-4 w-px bg-gray-300 mx-0.5" />

      {/* Bullet List */}
      <button
        type="button"
        onClick={() => insertFormatting('\n• ')}
        className="p-1.5 rounded-lg hover:bg-white hover:shadow-2xs text-gray-700 transition-all"
        title="Bullet Point"
      >
        <List className="w-3.5 h-3.5" />
      </button>

      {/* Numbered List */}
      <button
        type="button"
        onClick={() => insertFormatting('\n1. ')}
        className="p-1.5 rounded-lg hover:bg-white hover:shadow-2xs text-gray-700 transition-all"
        title="Numbered List"
      >
        <ListOrdered className="w-3.5 h-3.5" />
      </button>

      {onAddAttachment && (
        <button
          type="button"
          onClick={onAddAttachment}
          className="ml-auto p-1.5 rounded-lg bg-white border border-gray-200 hover:border-primary text-gray-700 hover:text-primary transition-all flex items-center gap-1 font-bold text-[11px]"
          title="Attach PDF or Document"
        >
          <Paperclip className="w-3.5 h-3.5 text-primary" />
          <span>Attach File</span>
        </button>
      )}

    </div>
  );
}

// ─── HELPER TO RENDER FORMATTED TEXT (HIGHLIGHTS, COLORS, BOLD) ───────────────
export function renderFormattedContent(rawText: string) {
  if (!rawText) return null;

  // Split lines
  const lines = rawText.split('\n');

  return (
    <div className="space-y-1.5 leading-relaxed">
      {lines.map((line, idx) => {
        let processed = line;

        // Replace bold **text**
        const boldRegex = /\*\*(.*?)\*\*/g;
        // Replace highlight [highlight=color]text[/highlight]
        const highlightRegex = /\[highlight=([a-z]+)\](.*?)\[\/highlight\]/g;
        // Replace color [color=#hex]text[/color]
        const colorRegex = /\[color=([^\]]+)\](.*?)\[\/color\]/g;

        return (
          <p key={idx} className="text-xs md:text-sm text-gray-800">
            {line.split(/(\[highlight=[a-z]+\][\s\S]*?\[\/highlight\]|\[color=[^\]]+\][\s\S]*?\[\/color\]|\*\*[\s\S]*?\*\*)/g).map((chunk, cIdx) => {
              if (chunk.startsWith('[highlight=') && chunk.endsWith('[/highlight]')) {
                const color = chunk.match(/\[highlight=([a-z]+)\]/)?.[1] || 'yellow';
                const text = chunk.replace(/\[highlight=[a-z]+\]/, '').replace('[/highlight]', '');
                const bgClasses: { [key: string]: string } = {
                  yellow: 'bg-yellow-200 text-yellow-950 font-bold px-1.5 py-0.5 rounded',
                  cyan: 'bg-cyan-200 text-cyan-950 font-bold px-1.5 py-0.5 rounded',
                  green: 'bg-emerald-200 text-emerald-950 font-bold px-1.5 py-0.5 rounded',
                  orange: 'bg-orange-200 text-orange-950 font-bold px-1.5 py-0.5 rounded',
                  purple: 'bg-purple-200 text-purple-950 font-bold px-1.5 py-0.5 rounded',
                };
                return (
                  <span key={cIdx} className={bgClasses[color] || bgClasses.yellow}>
                    {text}
                  </span>
                );
              }

              if (chunk.startsWith('[color=') && chunk.endsWith('[/color]')) {
                const color = chunk.match(/\[color=([^\]]+)\]/)?.[1] || '#000';
                const text = chunk.replace(/\[color=[^\]]+\]/, '').replace('[/color]', '');
                return (
                  <span key={cIdx} style={{ color }} className="font-bold">
                    {text}
                  </span>
                );
              }

              if (chunk.startsWith('**') && chunk.endsWith('**')) {
                return (
                  <strong key={cIdx} className="font-bold text-gray-900">
                    {chunk.slice(2, -2)}
                  </strong>
                );
              }

              return <span key={cIdx}>{chunk}</span>;
            })}
          </p>
        );
      })}
    </div>
  );
}
