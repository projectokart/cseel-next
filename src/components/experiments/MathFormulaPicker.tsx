'use client';

import React, { useState } from 'react';
import { Sparkles, Check, Copy } from 'lucide-react';
import KatexRenderer from './KatexRenderer';

interface MathFormulaPickerProps {
  currentLatex: string;
  onChange: (latex: string) => void;
  label?: string;
}

export const MathFormulaPicker: React.FC<MathFormulaPickerProps> = ({
  currentLatex,
  onChange,
  label = 'LaTeX Formula',
}) => {
  const [activeTab, setActiveTab] = useState<'symbols' | 'greek' | 'chemistry' | 'templates'>('symbols');
  const [copied, setCopied] = useState(false);

  const insertSnippet = (snippet: string) => {
    onChange(currentLatex ? `${currentLatex} ${snippet}` : snippet);
  };

  const SYMBOLS = [
    { label: '±', latex: '\\pm' },
    { label: '×', latex: '\\times' },
    { label: '÷', latex: '\\div' },
    { label: '≈', latex: '\\approx' },
    { label: '≠', latex: '\\neq' },
    { label: '≤', latex: '\\le' },
    { label: '≥', latex: '\\ge' },
    { label: '∞', latex: '\\infty' },
    { label: '√x', latex: '\\sqrt{x}' },
    { label: 'a/b', latex: '\\frac{a}{b}' },
    { label: 'x²', latex: 'x^2' },
    { label: 'xᵢ', latex: 'x_i' },
    { label: '∑', latex: '\\sum_{i=1}^{n}' },
    { label: '∫', latex: '\\int_{a}^{b}' },
    { label: '∂', latex: '\\partial' },
    { label: '∇', latex: '\\nabla' },
    { label: '·', latex: '\\cdot' },
    { label: '°', latex: '^\\circ' },
  ];

  const GREEK = [
    { label: 'α', latex: '\\alpha' },
    { label: 'β', latex: '\\beta' },
    { label: 'γ', latex: '\\gamma' },
    { label: 'δ', latex: '\\delta' },
    { label: 'Δ', latex: '\\Delta' },
    { label: 'ε', latex: '\\epsilon' },
    { label: 'θ', latex: '\\theta' },
    { label: 'λ', latex: '\\lambda' },
    { label: 'μ', latex: '\\mu' },
    { label: 'π', latex: '\\pi' },
    { label: 'ρ', latex: '\\rho' },
    { label: 'σ', latex: '\\sigma' },
    { label: 'τ', latex: '\\tau' },
    { label: 'φ', latex: '\\phi' },
    { label: 'ω', latex: '\\omega' },
    { label: 'Ω', latex: '\\Omega' },
  ];

  const CHEMISTRY = [
    { label: '→', latex: '\\rightarrow' },
    { label: '⇌', latex: '\\rightleftharpoons' },
    { label: '↑', latex: '\\uparrow' },
    { label: '↓', latex: '\\downarrow' },
    { label: 'ΔH', latex: '\\Delta H' },
    { label: 'H₂O', latex: '\\text{H}_2\\text{O}' },
    { label: 'CO₂', latex: '\\text{CO}_2' },
    { label: 'O₂', latex: '\\text{O}_2' },
    { label: 'H⁺', latex: '\\text{H}^+' },
    { label: 'OH⁻', latex: '\\text{OH}^-' },
    { label: 'aq', latex: '(\\text{aq})' },
    { label: 's', latex: '(\\text{s})' },
    { label: 'l', latex: '(\\text{l})' },
    { label: 'g', latex: '(\\text{g})' },
  ];

  const TEMPLATES = [
    { name: 'Einstein Mass-Energy', latex: 'E = m \\cdot c^2' },
    { name: 'Ohm’s Law', latex: 'V = I \\cdot R' },
    { name: 'Newton’s 2nd Law', latex: 'F = m \\cdot a' },
    { name: 'Simple Pendulum Period', latex: 'T = 2\\pi \\sqrt{\\frac{L}{g}}' },
    { name: 'Arrhenius Equation', latex: 'k = A \\cdot e^{-\\frac{E_a}{R \\cdot T}}' },
    { name: 'Elephant Toothpaste Cat.', latex: '2H_2O_2 (aq) \\xrightarrow{I^-} 2H_2O (l) + O_2 (g)' },
    { name: 'Quadratic Equation', latex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}' },
    { name: 'Kinetic Energy', latex: 'E_k = \\frac{1}{2}m v^2' },
  ];

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>{label}</span>
        </label>

        {/* Category Tabs */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('symbols')}
            className={`px-2 py-0.5 rounded-md font-medium transition-all ${
              activeTab === 'symbols' ? 'bg-[#005689] text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Symbols
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('greek')}
            className={`px-2 py-0.5 rounded-md font-medium transition-all ${
              activeTab === 'greek' ? 'bg-[#005689] text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Greek
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('chemistry')}
            className={`px-2 py-0.5 rounded-md font-medium transition-all ${
              activeTab === 'chemistry' ? 'bg-[#005689] text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Chemistry
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('templates')}
            className={`px-2 py-0.5 rounded-md font-medium transition-all ${
              activeTab === 'templates' ? 'bg-[#005689] text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Equations
          </button>
        </div>
      </div>

      {/* Symbol Tray */}
      <div className="bg-white rounded-lg p-2 border border-slate-200 min-h-[44px]">
        {activeTab === 'symbols' && (
          <div className="flex flex-wrap gap-1">
            {SYMBOLS.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => insertSnippet(s.latex)}
                className="px-2.5 py-1 text-xs font-mono font-bold bg-slate-100 hover:bg-[#c2e7ff] hover:text-[#001d35] rounded transition-colors"
                title={`Insert ${s.latex}`}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}

        {activeTab === 'greek' && (
          <div className="flex flex-wrap gap-1">
            {GREEK.map((g, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => insertSnippet(g.latex)}
                className="px-2.5 py-1 text-xs font-mono font-bold bg-slate-100 hover:bg-[#c2e7ff] hover:text-[#001d35] rounded transition-colors"
                title={`Insert ${g.latex}`}
              >
                {g.label}
              </button>
            ))}
          </div>
        )}

        {activeTab === 'chemistry' && (
          <div className="flex flex-wrap gap-1">
            {CHEMISTRY.map((c, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => insertSnippet(c.latex)}
                className="px-2.5 py-1 text-xs font-mono font-bold bg-slate-100 hover:bg-[#c2e7ff] hover:text-[#001d35] rounded transition-colors"
                title={`Insert ${c.latex}`}
              >
                {c.label}
              </button>
            ))}
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="grid grid-cols-2 gap-1.5">
            {TEMPLATES.map((t, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onChange(t.latex)}
                className="p-1.5 text-left text-xs bg-slate-50 hover:bg-[#e8f0fe] border border-slate-200 rounded transition-colors"
              >
                <div className="font-semibold text-slate-800 truncate">{t.name}</div>
                <div className="text-[11px] font-mono text-slate-500 truncate">{t.latex}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input Code Textarea */}
      <div>
        <div className="relative">
          <textarea
            value={currentLatex}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Type LaTeX formula (e.g. E = m c^2, \Delta H = -98.2 \text{ kJ/mol})"
            rows={2}
            className="w-full font-mono text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005689] focus:border-transparent resize-y"
          />
        </div>
      </div>

      {/* Live Equation Render Output */}
      {currentLatex && currentLatex.trim() && (
        <div className="bg-white rounded-lg p-3 border border-blue-200/80 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
            Live Equation Preview:
          </span>
          <div className="py-1 text-center overflow-x-auto text-slate-900">
            <KatexRenderer latex={currentLatex} displayMode={true} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MathFormulaPicker;
