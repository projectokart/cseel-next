'use client';

import React, { useState } from 'react';
import { NodeViewWrapper, NodeViewContent, NodeViewProps } from '@tiptap/react';
import {
  Info, Sparkles, AlertTriangle, BookOpen,
  HelpCircle, CheckCircle2, ChevronDown, Trash2
} from 'lucide-react';
import { CalloutVariant } from '../types';

const CALLOUT_STYLES: Record<CalloutVariant, { label: string; icon: any; border: string; bg: string; text: string; iconColor: string }> = {
  note: {
    label: 'Important Note',
    icon: Info,
    border: 'border-blue-200 dark:border-blue-900/60',
    bg: 'bg-blue-50/70 dark:bg-blue-950/20',
    text: 'text-blue-950 dark:text-blue-200',
    iconColor: 'text-[#006fcc]',
  },
  tip: {
    label: 'Pro Tip',
    icon: Sparkles,
    border: 'border-emerald-200 dark:border-emerald-900/60',
    bg: 'bg-emerald-50/70 dark:bg-emerald-950/20',
    text: 'text-emerald-950 dark:text-emerald-200',
    iconColor: 'text-emerald-600',
  },
  warning: {
    label: 'Precaution & Warning',
    icon: AlertTriangle,
    border: 'border-amber-200 dark:border-amber-900/60',
    bg: 'bg-amber-50/70 dark:bg-amber-950/20',
    text: 'text-amber-950 dark:text-amber-200',
    iconColor: 'text-amber-600',
  },
  definition: {
    label: 'Scientific Definition',
    icon: BookOpen,
    border: 'border-purple-200 dark:border-purple-900/60',
    bg: 'bg-purple-50/70 dark:bg-purple-950/20',
    text: 'text-purple-950 dark:text-purple-200',
    iconColor: 'text-purple-600',
  },
  example: {
    label: 'Practical Example',
    icon: CheckCircle2,
    border: 'border-cyan-200 dark:border-cyan-900/60',
    bg: 'bg-cyan-50/70 dark:bg-cyan-950/20',
    text: 'text-cyan-950 dark:text-cyan-200',
    iconColor: 'text-cyan-600',
  },
  assessment: {
    label: 'Key Takeaway & Assessment',
    icon: HelpCircle,
    border: 'border-indigo-200 dark:border-indigo-900/60',
    bg: 'bg-indigo-50/70 dark:bg-indigo-950/20',
    text: 'text-indigo-950 dark:text-indigo-200',
    iconColor: 'text-indigo-600',
  },
};

export default function CalloutNodeView({ node, updateAttributes, deleteNode, selected }: NodeViewProps) {
  const variant: CalloutVariant = node.attrs.variant || 'note';
  const customTitle = node.attrs.title || '';
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const style = CALLOUT_STYLES[variant] || CALLOUT_STYLES.note;
  const Icon = style.icon;

  return (
    <NodeViewWrapper className="my-3">
      <div
        className={`rounded-2xl border p-4 sm:p-5 transition-all ${style.border} ${style.bg} ${
          selected ? 'ring-2 ring-purple-500/20 shadow-md' : 'shadow-2xs'
        }`}
      >
        {/* Header with icon, type selector & custom title */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-black/5 dark:border-white/5">
          <div className="flex items-center gap-2 relative">
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-black/5 text-xs font-black shadow-2xs hover:bg-white transition-colors"
            >
              <Icon className={`w-3.5 h-3.5 ${style.iconColor}`} />
              <span className="text-slate-800 dark:text-slate-200">{customTitle || style.label}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {/* Type selector menu */}
            {dropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-52 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl py-1 z-30">
                {Object.entries(CALLOUT_STYLES).map(([key, item]) => {
                  const ItemIcon = item.icon;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        updateAttributes({ variant: key as CalloutVariant });
                        setDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                    >
                      <ItemIcon className={`w-3.5 h-3.5 ${item.iconColor}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={deleteNode}
            className="p-1 rounded-lg hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition-colors"
            title="Delete Callout"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Editable Rich Content Container */}
        <NodeViewContent className={`text-xs sm:text-sm leading-relaxed ${style.text} outline-none`} />
      </div>
    </NodeViewWrapper>
  );
}
