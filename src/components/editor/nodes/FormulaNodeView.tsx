'use client';

import React, { useState, useEffect, useRef } from 'react';
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { Edit2, Copy, Check, FunctionSquare, Trash2, Eye, HelpCircle } from 'lucide-react';

export default function FormulaNodeView({ node, updateAttributes, deleteNode, selected }: NodeViewProps) {
  const latex = node.attrs.latex || 'V = I \\cdot R';
  const displayMode = node.attrs.displayMode !== false;
  const [isEditing, setIsEditing] = useState(false);
  const [currentLatex, setCurrentLatex] = useState(latex);
  const [currentDisplayMode, setCurrentDisplayMode] = useState(displayMode);
  const [presetCategory, setPresetCategory] = useState<'physics' | 'math' | 'chemistry'>('physics');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formulaRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
          displayMode: currentDisplayMode,
          throwOnError: false,
        });
      } catch {}
    }
  }, [currentLatex, currentDisplayMode, isEditing]);

  const handleCopy = () => {
    navigator.clipboard.writeText(latex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    updateAttributes({ latex: currentLatex, displayMode: currentDisplayMode });
    setIsEditing(false);
  };

  const insertSymbol = (texSymbol: string) => {
    setCurrentLatex(prev => prev + ' ' + texSymbol);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const PRESETS = {
    physics: [
      { label: "Ohm's Law", tex: 'V = I \\cdot R' },
      { label: 'Mass-Energy', tex: 'E = m c^2' },
      { label: 'Gravitation', tex: 'F = G \\frac{m_1 m_2}{r^2}' },
      { label: 'Kinetic Energy', tex: 'K = \\frac{1}{2} m v^2' },
      { label: 'Wave Equation', tex: 'v = f \\cdot \\lambda' },
      { label: "Coulomb's Law", tex: 'F = \\frac{1}{4\\pi \\varepsilon_0} \\frac{q_1 q_2}{r^2}' },
      { label: 'Schrödinger Eq', tex: 'i\\hbar \\frac{\\partial}{\\partial t} \\Psi = \\hat{H} \\Psi' },
    ],
    math: [
      { label: 'Quadratic Formula', tex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}' },
      { label: 'Definite Integral', tex: '\\int_{a}^{b} f(x)\\,dx = F(b) - F(a)' },
      { label: 'Summation Series', tex: '\\sum_{k=1}^{n} k^2 = \\frac{n(n+1)(2n+1)}{6}' },
      { label: "Euler's Identity", tex: 'e^{i\\pi} + 1 = 0' },
      { label: 'Limit at Zero', tex: '\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1' },
      { label: '2x2 Matrix', tex: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}' },
    ],
    chemistry: [
      { label: 'Ideal Gas Law', tex: 'P V = n R T' },
      { label: 'Arrhenius Equation', tex: 'k = A e^{-\\frac{E_a}{R T}}' },
      { label: 'Gibbs Free Energy', tex: '\\Delta G = \\Delta H - T \\Delta S' },
      { label: 'Nernst Equation', tex: 'E = E^0 - \\frac{R T}{n F} \\ln Q' },
      { label: 'Equilibrium Constant', tex: 'K_{c} = \\frac{[C]^c [D]^d}{[A]^a [B]^b}' },
    ],
  };

  const SYMBOLS = [
    { label: 'Fraction', tex: '\\frac{a}{b}' },
    { label: 'Sqrt', tex: '\\sqrt{x}' },
    { label: 'Integral', tex: '\\int_{0}^{\\infty}' },
    { label: 'Sum', tex: '\\sum_{i=1}^{n}' },
    { label: 'x^2', tex: '^{2}' },
    { label: 'x_i', tex: '_{i}' },
    { label: '±', tex: '\\pm' },
    { label: '×', tex: '\\times' },
    { label: '÷', tex: '\\div' },
    { label: '≠', tex: '\\neq' },
    { label: '≤', tex: '\\leq' },
    { label: '≥', tex: '\\geq' },
    { label: 'α', tex: '\\alpha' },
    { label: 'β', tex: '\\beta' },
    { label: 'θ', tex: '\\theta' },
    { label: 'λ', tex: '\\lambda' },
    { label: 'π', tex: '\\pi' },
    { label: 'Δ', tex: '\\Delta' },
    { label: '∞', tex: '\\infty' },
    { label: '∂', tex: '\\partial' },
  ];

  return (
    <NodeViewWrapper className="my-3">
      <div
        className={`relative group rounded-2xl border transition-all duration-200 ${
          selected
            ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/20'
            : 'border-slate-200 dark:border-slate-800 bg-[#f8fafd] hover:border-blue-300'
        } p-4`}
      >
        {/* Top Control Bar */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 text-xs">
          <div className="flex items-center gap-1.5 text-blue-700 font-bold">
            <FunctionSquare className="w-4 h-4" />
            <span className="text-[11px] uppercase tracking-wider font-black">LaTeX Scientific Equation</span>
          </div>

          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={handleCopy}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors"
              title="Copy LaTeX formula"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={() => {
                setCurrentLatex(latex);
                setCurrentDisplayMode(displayMode);
                setIsEditing(!isEditing);
              }}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-blue-600 text-[11px] font-bold transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
            >
              <Edit2 className="w-3 h-3" />
              <span>{isEditing ? 'Close' : 'Edit LaTeX'}</span>
            </button>

            <button
              type="button"
              onClick={deleteNode}
              className="p-1.5 rounded-lg hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
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
            className="py-3 px-2 text-center overflow-x-auto text-base sm:text-lg font-serif text-slate-900 min-h-[48px] flex items-center justify-center cursor-pointer hover:bg-blue-50/50 rounded-xl transition-colors"
            onClick={() => setIsEditing(true)}
            title="Click to edit LaTeX formula"
          />
        ) : (
          /* Live Formula Editor Interface */
          <div className="space-y-3 pt-1">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-700">
                  LaTeX Code:
                </label>
                <div className="flex items-center gap-2">
                  <label className="text-[10px] text-slate-500 font-medium flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentDisplayMode}
                      onChange={(e) => setCurrentDisplayMode(e.target.checked)}
                      className="rounded text-blue-600 w-3 h-3 cursor-pointer"
                    />
                    <span>Centered Block Display</span>
                  </label>
                </div>
              </div>

              <input
                ref={inputRef}
                type="text"
                value={currentLatex}
                onChange={(e) => setCurrentLatex(e.target.value)}
                placeholder="e.g. \\int_{a}^{b} f(x)dx = F(b) - F(a)"
                className="w-full px-3.5 py-2 bg-white border border-blue-300 rounded-xl text-xs font-mono text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
                autoFocus
              />
            </div>

            {/* Quick Symbols Palette */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quick Math Symbols:</span>
              <div className="flex items-center gap-1 flex-wrap">
                {SYMBOLS.map((sym) => (
                  <button
                    key={sym.label}
                    type="button"
                    onClick={() => insertSymbol(sym.tex)}
                    className="px-2 py-0.5 rounded bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-[11px] font-medium text-slate-700 transition-colors cursor-pointer"
                    title={sym.tex}
                  >
                    {sym.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Scientific Discipline Presets */}
            <div className="space-y-1 pt-1 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Presets:</span>
                <div className="flex items-center gap-1">
                  {(['physics', 'math', 'chemistry'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setPresetCategory(cat)}
                      className={`text-[10px] px-2 py-0.5 rounded capitalize font-semibold cursor-pointer ${
                        presetCategory === cat ? 'bg-blue-100 text-blue-800' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                {PRESETS[presetCategory].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setCurrentLatex(item.tex)}
                    className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-medium text-slate-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors cursor-pointer"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Live KaTeX Render Preview */}
            <div className="p-3 bg-white rounded-xl border border-slate-200 text-center min-h-[52px] flex items-center justify-center shadow-2xs">
              <div ref={previewRef} />
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200/50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
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