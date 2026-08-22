'use client';

import React, { useState, useEffect, useRef } from 'react';
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { Edit2, Copy, Check, FunctionSquare, Trash2, Eye } from 'lucide-react';

export default function FormulaNodeView({ node, updateAttributes, deleteNode, selected }: NodeViewProps) {
  const latex = node.attrs.latex || 'V = IR';
  const displayMode = node.attrs.displayMode !== false;
  const [isEditing, setIsEditing] = useState(false);
  const [currentLatex, setCurrentLatex] = useState(latex);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formulaRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Render LaTeX using KaTeX
  useEffect(() => {
    if (formulaRef.current) {
      try {
        katex.render(latex, formulaRef.current, {
          displayMode: displayMode,
          throwOnError: false,
          output: 'htmlAndMathml',
        });
        setError(null);
      } catch (err: any) {
        setError(err?.message || 'Formula render error');
      }
    }
  }, [latex, displayMode]);

  // Live preview when editing
  useEffect(() => {
    if (isEditing && previewRef.current) {
      try {
        katex.render(currentLatex || ' ', previewRef.current, {
          displayMode: true,
          throwOnError: false,
        });
      } catch {}
    }
  }, [currentLatex, isEditing]);

  const handleCopy = () => {
    navigator.clipboard.writeText(latex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    updateAttributes({ latex: currentLatex });
    setIsEditing(false);
  };

  const QUICK_FORMULAS = [
    { label: "Ohm's Law", tex: 'V = I \\cdot R' },
    { label: 'Einstein Energy', tex: 'E = m c^2' },
    { label: 'Kinetic Energy', tex: 'K = \\frac{1}{2} m v^2' },
    { label: 'Newton Gravitation', tex: 'F = G \\frac{m_1 m_2}{r^2}' },
    { label: 'Quadratic Formula', tex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}' },
    { label: 'Wave Equation', tex: 'v = f \\cdot \\lambda' },
  ];

  return (
    <NodeViewWrapper className="my-3">
      <div
        className={`relative group rounded-2xl border transition-all duration-200 ${
          selected
            ? 'border-purple-500 ring-2 ring-purple-500/20 bg-purple-50/20 dark:bg-purple-950/20'
            : 'border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 hover:border-slate-300'
        } p-4`}
      >
        {/* Top Control Bar (Visible on Hover / Focus) */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/80 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-1.5 text-purple-700 dark:text-purple-400 font-bold">
            <FunctionSquare className="w-4 h-4" />
            <span className="text-[11px] uppercase tracking-wider font-black">Mathematical Formula</span>
          </div>

          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={handleCopy}
              className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              title="Copy LaTeX formula"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={() => {
                setCurrentLatex(latex);
                setIsEditing(!isEditing);
              }}
              className="px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-purple-600 text-[11px] font-bold transition-colors flex items-center gap-1 shadow-2xs"
            >
              <Edit2 className="w-3 h-3" />
              <span>{isEditing ? 'Close' : 'Edit Equation'}</span>
            </button>

            <button
              type="button"
              onClick={deleteNode}
              className="p-1.5 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-950/40 text-slate-400 hover:text-rose-600 transition-colors"
              title="Delete Formula"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Formula Render Container */}
        {!isEditing ? (
          <div
            ref={formulaRef}
            className="py-3 px-2 text-center overflow-x-auto text-base sm:text-lg font-serif text-slate-900 dark:text-slate-100 min-h-[44px] flex items-center justify-center cursor-pointer"
            onClick={() => setIsEditing(true)}
            title="Click to edit formula"
          />
        ) : (
          /* Live Formula Editor Interface */
          <div className="space-y-3 pt-1">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                Enter LaTeX Equation Code:
              </label>
              <input
                type="text"
                value={currentLatex}
                onChange={(e) => setCurrentLatex(e.target.value)}
                placeholder="e.g. \\int_{a}^{b} f(x)dx = F(b) - F(a)"
                className="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-purple-300 dark:border-purple-700 rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-purple-500/20"
                autoFocus
              />
            </div>

            {/* Quick Math Presets */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-bold text-slate-400">Presets:</span>
              {QUICK_FORMULAS.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setCurrentLatex(item.tex)}
                  className="px-2 py-0.5 rounded-md bg-slate-200/70 dark:bg-slate-800 text-[10px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-purple-100 dark:hover:bg-purple-900/40 hover:text-purple-700 transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Live Preview Box */}
            <div className="p-3 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-center min-h-[48px] flex items-center justify-center">
              <div ref={previewRef} />
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95"
              >
                Save Equation
              </button>
            </div>
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
}
