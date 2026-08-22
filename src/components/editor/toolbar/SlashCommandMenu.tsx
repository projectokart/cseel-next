'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Heading1, Heading2, Heading3, List, ListOrdered, CheckSquare,
  Quote, Code2, Table, FunctionSquare, TrendingUp, Network,
  AlertTriangle, Sparkles, BookOpen, Info, Image, Video, FileText,
  FlaskConical, Wrench, Search
} from 'lucide-react';
import { EditorContentType } from '../types';
import { CONTENT_TYPE_CONFIGS } from '../config/editorConfig';

export interface SlashCommandItem {
  id: string;
  title: string;
  description: string;
  icon: any;
  category: 'Text' | 'Scientific' | 'Callouts' | 'Media & Data' | 'Templates';
  action: (editor: any) => void;
}

interface SlashCommandMenuProps {
  editor: any;
  isOpen: boolean;
  onClose: () => void;
  query: string;
  position: { top: number; left: number };
  contentType?: EditorContentType;
}

export default function SlashCommandMenu({
  editor,
  isOpen,
  onClose,
  query,
  position,
  contentType = 'document',
}: SlashCommandMenuProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const config = CONTENT_TYPE_CONFIGS[contentType] || CONTENT_TYPE_CONFIGS.document;

  const ALL_COMMANDS: SlashCommandItem[] = [
    // ── TEXT BLOCKS ──
    {
      id: 'h1',
      title: 'Heading 1',
      description: 'Top-level document title or major section',
      icon: Heading1,
      category: 'Text',
      action: (ed) => ed.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      id: 'h2',
      title: 'Heading 2',
      description: 'Section subtitle or concept heading',
      icon: Heading2,
      category: 'Text',
      action: (ed) => ed.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      id: 'h3',
      title: 'Heading 3',
      description: 'Sub-section or topic heading',
      icon: Heading3,
      category: 'Text',
      action: (ed) => ed.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
      id: 'bullet_list',
      title: 'Bullet List',
      description: 'Create an unordered bulleted list',
      icon: List,
      category: 'Text',
      action: (ed) => ed.chain().focus().toggleBulletList().run(),
    },
    {
      id: 'ordered_list',
      title: 'Numbered List',
      description: 'Create an ordered sequence or procedure list',
      icon: ListOrdered,
      category: 'Text',
      action: (ed) => ed.chain().focus().toggleOrderedList().run(),
    },
    {
      id: 'quote',
      title: 'Quote',
      description: 'Capture a notable scientific quote or citation',
      icon: Quote,
      category: 'Text',
      action: (ed) => ed.chain().focus().toggleBlockquote().run(),
    },

    // ── SCIENTIFIC BLOCKS (Conditional on config) ──
    ...(config.formulas
      ? [
          {
            id: 'formula',
            title: 'Math / Science Formula',
            description: 'Insert interactive LaTeX equation (V = IR, E = mc²)',
            icon: FunctionSquare,
            category: 'Scientific' as const,
            action: (ed: any) => ed.chain().focus().insertContent({ type: 'formula', attrs: { latex: 'V = I \\cdot R' } }).run(),
          },
        ]
      : []),

    ...(config.graphs
      ? [
          {
            id: 'graph',
            title: 'Interactive Scientific Graph',
            description: "Plot Ohm's law, scatter/line/bar with data table",
            icon: TrendingUp,
            category: 'Scientific' as const,
            action: (ed: any) =>
              ed
                .chain()
                .focus()
                .insertContent({
                  type: 'graph',
                  attrs: {
                    title: "Ohm's Law: Voltage vs Current",
                    graphType: 'line',
                    xLabel: 'Current',
                    yLabel: 'Voltage',
                    xUnit: 'A',
                    yUnit: 'V',
                  },
                })
                .run(),
          },
        ]
      : []),

    ...(config.code
      ? [
          {
            id: 'code_block',
            title: 'Code Block',
            description: 'Syntax-highlighted code block (Python, C++, JS, Arduino)',
            icon: Code2,
            category: 'Scientific' as const,
            action: (ed: any) => ed.chain().focus().toggleCodeBlock().run(),
          },
        ]
      : []),

    ...(config.diagrams
      ? [
          {
            id: 'mermaid',
            title: 'Mermaid Science Diagram',
            description: 'Flowchart, circuit logic, sequence diagrams',
            icon: Network,
            category: 'Scientific' as const,
            action: (ed: any) =>
              ed
                .chain()
                .focus()
                .insertContent({
                  type: 'mermaid',
                  attrs: {
                    code: 'flowchart TD\n  A[Start Experiment] --> B[Connect Resistor]\n  B --> C[Measure Voltage & Current]\n  C --> D[Plot V vs I Curve]',
                  },
                })
                .run(),
          },
        ]
      : []),

    // ── CALLOUT CARDS ──
    ...(config.callouts
      ? [
          {
            id: 'callout_note',
            title: 'Important Note',
            description: 'Blue highlighted educational note card',
            icon: Info,
            category: 'Callouts' as const,
            action: (ed: any) =>
              ed.chain().focus().insertContent({ type: 'callout', attrs: { variant: 'note' }, content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Important: Always verify connections before applying DC voltage.' }] }] }).run(),
          },
          {
            id: 'callout_tip',
            title: 'Pro Tip',
            description: 'Green practical experimental tip card',
            icon: Sparkles,
            category: 'Callouts' as const,
            action: (ed: any) =>
              ed.chain().focus().insertContent({ type: 'callout', attrs: { variant: 'tip' }, content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Pro Tip: Tap rheostat gently to avoid zero-error resistance drift.' }] }] }).run(),
          },
          {
            id: 'callout_warning',
            title: 'Precaution & Warning',
            description: 'Amber safety precaution callout card',
            icon: AlertTriangle,
            category: 'Callouts' as const,
            action: (ed: any) =>
              ed.chain().focus().insertContent({ type: 'callout', attrs: { variant: 'warning' }, content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Precaution: Do not exceed 5V across sensitive microcontrollers.' }] }] }).run(),
          },
          {
            id: 'callout_definition',
            title: 'Scientific Definition',
            description: 'Purple conceptual definition box',
            icon: BookOpen,
            category: 'Callouts' as const,
            action: (ed: any) =>
              ed.chain().focus().insertContent({ type: 'callout', attrs: { variant: 'definition' }, content: [{ type: 'paragraph', content: [{ type: 'text', text: "Ohm's Law states that electric current through a conductor is directly proportional to the potential difference across its terminals at constant temperature." }] }] }).run(),
          },
        ]
      : []),

    // ── MEDIA & DATA ──
    ...(config.tables
      ? [
          {
            id: 'table',
            title: 'Data Table',
            description: 'Insert 3x3 structured scientific observations table',
            icon: Table,
            category: 'Media & Data' as const,
            action: (ed: any) => ed.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
          },
        ]
      : []),

    // ── TEMPLATES ──
    ...(config.experimentBlocks
      ? [
          {
            id: 'experiment_template',
            title: 'Complete Experiment Template',
            description: 'Objective, Materials, Procedure, Observation & Result',
            icon: FlaskConical,
            category: 'Templates' as const,
            action: (ed: any) =>
              ed
                .chain()
                .focus()
                .insertContent([
                  { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: "1. Experiment Objective" }] },
                  { type: 'paragraph', content: [{ type: 'text', text: "To determine the resistance per unit length of a given wire by plotting a graph of potential difference versus current." }] },
                  { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: "2. Apparatus & Materials Required" }] },
                  { type: 'bulletList', content: [
                    { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: "A resistance wire of unknown resistance" }] }] },
                    { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: "DC Regulated Power Supply (0-12V)" }] }] },
                    { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: "Digital Multimeter & Connecting Wires" }] }] },
                  ]},
                  { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: "3. Formula Used" }] },
                  { type: 'formula', attrs: { latex: "R = \\frac{V}{I}" } },
                  { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: "4. Experimental Observations" }] },
                  { type: 'graph', attrs: { title: "Voltage vs Current Curve", graphType: "line", xLabel: "Current", yLabel: "Voltage", xUnit: "A", yUnit: "V" } },
                ])
                .run(),
          },
        ]
      : []),
  ];

  const filteredCommands = ALL_COMMANDS.filter(
    (c) =>
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.description.toLowerCase().includes(query.toLowerCase()) ||
      c.category.toLowerCase().includes(query.toLowerCase())
  );

  const executeCommand = (cmd: SlashCommandItem) => {
    // Delete the preceding '/' and any typed search characters
    const sel = editor.state.selection;
    const textBefore = editor.state.doc.textBetween(Math.max(0, sel.from - 30), sel.from, '\n');
    const slashIdx = textBefore.lastIndexOf('/');
    if (slashIdx !== -1) {
      const charsToDelete = textBefore.length - slashIdx;
      editor.chain().focus().deleteRange({ from: sel.from - charsToDelete, to: sel.from }).run();
    }
    cmd.action(editor);
    onClose();
  };

  // Keyboard navigation listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(filteredCommands.length, 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % Math.max(filteredCommands.length, 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          executeCommand(filteredCommands[selectedIndex]);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, editor, onClose]);

  if (!isOpen || filteredCommands.length === 0) return null;

  return (
    <div
      ref={menuRef}
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
      className="fixed z-50 w-72 sm:w-80 max-h-80 overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-1.5 animate-in fade-in-50 zoom-in-95 duration-100"
    >
      <div className="px-2.5 py-1.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-400">
        <span>Insert Content Block</span>
        <span>{filteredCommands.length} Options</span>
      </div>

      <div className="py-1 space-y-0.5">
        {filteredCommands.map((cmd, idx) => {
          const Icon = cmd.icon;
          const isSelected = selectedIndex === idx;

          return (
            <button
              key={cmd.id}
              type="button"
              onClick={() => {
                executeCommand(cmd);
              }}
              onMouseEnter={() => setSelectedIndex(idx)}
              className={`w-full flex items-start gap-2.5 px-3 py-2 rounded-xl text-left transition-colors ${
                isSelected
                  ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 font-bold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <div
                className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold truncate">{cmd.title}</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate leading-snug">
                  {cmd.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
