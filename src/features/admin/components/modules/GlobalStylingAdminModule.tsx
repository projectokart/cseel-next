'use client';

import React, { useState, useEffect } from 'react';
import { 
  Palette, 
  Sparkles, 
  Save, 
  RotateCcw, 
  ExternalLink, 
  CheckCircle2, 
  Layers, 
  Sliders, 
  Code, 
  Eye, 
  Check, 
  ShieldCheck, 
  ArrowRight,
  RefreshCw,
  Copy
} from 'lucide-react';
import { GlobalThemeConfig, ButtonShapeVariant } from '@/features/theme-system/types';
import { DEFAULT_CSEEL_THEME, GOOGLE_PRESET_THEME } from '@/features/theme-system/defaultTheme';
import { applyThemeToDom, THEME_STORAGE_KEY, THEME_EVENT_NAME } from '@/features/theme-system/GlobalThemeSync';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

const COLOR_PRESETS = [
  { name: 'CSEEL Blue', primary: '#006FCC', hover: '#005499', secBg: '#EDF5FA', secText: '#006FCC' },
  { name: 'Google Blue', primary: '#1A73E8', hover: '#1557B0', secBg: '#F1F3F4', secText: '#1A73E8' },
  { name: 'Navy Royal', primary: '#0D4979', hover: '#003C6E', secBg: '#EDF5FA', secText: '#0D4979' },
  { name: 'Emerald STEM', primary: '#0F9D58', hover: '#0B8043', secBg: '#E6F4EA', secText: '#0F9D58' },
  { name: 'Vibrant Indigo', primary: '#4F46E5', hover: '#4338CA', secBg: '#EEF2FF', secText: '#4F46E5' },
  { name: 'Coral Crimson', primary: '#EA4335', hover: '#D93025', secBg: '#FCE8E6', secText: '#EA4335' },
];

export const GlobalStylingAdminModule: React.FC = () => {
  const { addAuditLog } = useAdminAuth();
  const [theme, setTheme] = useState<GlobalThemeConfig>({ ...DEFAULT_CSEEL_THEME });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedCss, setCopiedCss] = useState(false);
  const [activeTab, setActiveTab] = useState<'buttons' | 'colors' | 'inspector'>('buttons');

  // Load current theme from API or local storage on mount
  useEffect(() => {
    fetch('/api/theme-settings')
      .then((res) => res.json())
      .then((json) => {
        if (json?.success && json?.data) {
          setTheme(json.data);
        } else {
          try {
            const local = localStorage.getItem(THEME_STORAGE_KEY);
            if (local) setTheme(JSON.parse(local));
          } catch {}
        }
      })
      .catch(() => {
        try {
          const local = localStorage.getItem(THEME_STORAGE_KEY);
          if (local) setTheme(JSON.parse(local));
        } catch {}
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Update theme state and preview on current page
  const handleUpdate = (updates: Partial<GlobalThemeConfig>) => {
    const updated = { ...theme, ...updates };
    setTheme(updated);
    applyThemeToDom(updated);
  };

  // Save changes to database API & broadcast to whole website
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/theme-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(theme),
      });
      const json = await res.json();
      if (json?.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        try {
          localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(theme));
          window.dispatchEvent(new CustomEvent(THEME_EVENT_NAME, { detail: theme }));
        } catch {}
        addAuditLog?.('THEME_UPDATE', 'global_styling', 'Updated global design system styling & button variation tokens');
      }
    } catch (err) {
      console.error('Error saving theme settings:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDefaults = () => {
    if (confirm('Kya aap global CSS styling ko default CSEEL standard par reset karna chahte hain?')) {
      handleUpdate(DEFAULT_CSEEL_THEME);
    }
  };

  const handleApplyPreset = (preset: typeof COLOR_PRESETS[0]) => {
    handleUpdate({
      primaryColor: preset.primary,
      primaryHoverColor: preset.hover,
      secondaryBgColor: preset.secBg,
      secondaryTextColor: preset.secText,
    });
  };

  const generatedCss = `:root {
  --brand-primary: ${theme.primaryColor};
  --brand-primary-hover: ${theme.primaryHoverColor};
  --brand-secondary-bg: ${theme.secondaryBgColor};
  --brand-secondary-text: ${theme.secondaryTextColor};
  --btn-radius: ${theme.buttonVariant === 'google' ? '9999px' : (theme.buttonVariant === 'cseel' ? '12px' : theme.buttonRadius)};
  --btn-shadow: ${theme.buttonShadow === 'material' ? '0 1px 3px rgba(60,64,67,0.3)' : (theme.buttonShadow === 'none' ? 'none' : '0 4px 14px rgba(0, 111, 204, 0.35)')};
  --card-radius: ${theme.cardRadius};
}`;

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full pb-16 font-sans">
      {/* ── 1. HEADER ROW ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#dadce0]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#006FCC] bg-[#EDF5FA] px-2.5 py-0.5 rounded-md border border-[#D6EDFF]">
              <Palette className="w-3.5 h-3.5" />
              Global Design System &amp; CSS Sheet
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Live Synchronized
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#202124] tracking-tight">
            Website Global Styling Controller
          </h1>
          <p className="text-xs sm:text-sm text-[#5f6368] mt-0.5">
            Admin panel se live website ke button shapes (CSEEL 12px vs Google Pill), colors, aur global CSS rules change karein.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl border border-[#D6EDFF] bg-[#EDF5FA] hover:bg-[#D6EDFF] text-[#006FCC] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Live Site Preview</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-[#006FCC] hover:bg-[#005499] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isSaving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : saveSuccess ? (
              <Check className="w-4 h-4 text-emerald-300" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saveSuccess ? 'Changes Applied!' : 'Save & Apply to Website'}</span>
          </button>
        </div>
      </div>

      {/* ── 2. TABS NAVIGATOR ── */}
      <div className="flex items-center gap-2 border-b border-[#dadce0] pb-2">
        <button
          onClick={() => setActiveTab('buttons')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'buttons'
              ? 'bg-[#006FCC] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Button Shape &amp; Variations</span>
        </button>

        <button
          onClick={() => setActiveTab('colors')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'colors'
              ? 'bg-[#006FCC] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Brand Colors &amp; Radii</span>
        </button>

        <button
          onClick={() => setActiveTab('inspector')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'inspector'
              ? 'bg-[#006FCC] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Code className="w-4 h-4" />
          <span>Global CSS Sheet &amp; Overrides</span>
        </button>
      </div>

      {/* ── 3. TAB 1: BUTTON SHAPE & VARIATIONS ── */}
      {activeTab === 'buttons' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* VARIATION 1: CSEEL SIGNATURE STYLE */}
            <div 
              onClick={() => handleUpdate({ 
                buttonVariant: 'cseel', 
                buttonRadius: '12px', 
                buttonShadow: 'glow',
                primaryColor: '#006FCC',
                primaryHoverColor: '#005499'
              })}
              className={`p-6 rounded-2xl border-2 transition-all cursor-pointer relative bg-white ${
                theme.buttonVariant === 'cseel' 
                  ? 'border-[#006FCC] shadow-md ring-2 ring-[#006FCC]/20' 
                  : 'border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              {theme.buttonVariant === 'cseel' && (
                <span className="absolute top-4 right-4 bg-[#006FCC] text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs">
                  <Check className="w-3 h-3" /> Active on Website
                </span>
              )}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#006FCC]/10 flex items-center justify-center text-[#006FCC] font-bold">
                  CS
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">1. CSEEL Signature Modern Shape</h3>
                  <p className="text-xs text-slate-500">12px border radius, bold typography, soft glow shadow</p>
                </div>
              </div>

              <div className="mt-5 p-5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Preview Buttons</span>
                <div className="flex flex-wrap gap-3 items-center">
                  <button className="button_cseel">
                    CSEEL Primary
                  </button>
                  <button className="button_secondary">
                    CSEEL Secondary
                  </button>
                  <button className="button_outline">
                    CSEEL Outline
                  </button>
                </div>
              </div>

              <div className="mt-4 text-xs text-slate-600 space-y-1">
                <p>• <strong>Radius:</strong> 12px (crisp, modern edtech standard)</p>
                <p>• <strong>Glow Elevation:</strong> 0 4px 14px rgba(0, 111, 204, 0.35)</p>
                <p>• <strong>CSS Class:</strong> <code className="bg-slate-100 px-1.5 py-0.5 rounded text-blue-700">.button_cseel</code> / <code className="bg-slate-100 px-1.5 py-0.5 rounded text-blue-700">.btn-cseel</code></p>
              </div>
            </div>

            {/* VARIATION 2: GOOGLE MATERIAL PILL STYLE */}
            <div 
              onClick={() => handleUpdate({ 
                buttonVariant: 'google', 
                buttonRadius: '9999px', 
                buttonShadow: 'material',
                primaryColor: '#1A73E8',
                primaryHoverColor: '#1557B0'
              })}
              className={`p-6 rounded-2xl border-2 transition-all cursor-pointer relative bg-white ${
                theme.buttonVariant === 'google' 
                  ? 'border-[#1A73E8] shadow-md ring-2 ring-[#1A73E8]/20' 
                  : 'border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              {theme.buttonVariant === 'google' && (
                <span className="absolute top-4 right-4 bg-[#1A73E8] text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs">
                  <Check className="w-3 h-3" /> Active on Website
                </span>
              )}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[#1A73E8]/10 flex items-center justify-center text-[#1A73E8] font-bold">
                  G
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">2. Google Material Pill Shape</h3>
                  <p className="text-xs text-slate-500">Pill (full-rounded 9999px), Google Sans font, Material elevation</p>
                </div>
              </div>

              <div className="mt-5 p-5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Preview Buttons</span>
                <div className="flex flex-wrap gap-3 items-center">
                  <button className="button_google">
                    Google Primary
                  </button>
                  <button className="px-5 py-2.5 rounded-full bg-[#F1F3F4] text-[#1A73E8] font-medium text-sm hover:bg-[#E8EAED] transition-all">
                    Google Secondary
                  </button>
                  <button className="px-5 py-2.5 rounded-full border border-[#DADCE0] text-[#1A73E8] font-medium text-sm hover:bg-[#F8FAFD] transition-all">
                    Google Outline
                  </button>
                </div>
              </div>

              <div className="mt-4 text-xs text-slate-600 space-y-1">
                <p>• <strong>Radius:</strong> 9999px (clean Google Material pill)</p>
                <p>• <strong>Elevation:</strong> 0 1px 3px rgba(60,64,67,0.3)</p>
                <p>• <strong>CSS Class:</strong> <code className="bg-slate-100 px-1.5 py-0.5 rounded text-blue-700">.button_google</code> / <code className="bg-slate-100 px-1.5 py-0.5 rounded text-blue-700">.btn-google</code></p>
              </div>
            </div>

          </div>

          {/* CUSTOM RADIUS SLIDER */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="font-bold text-sm text-slate-900 mb-2">Custom Border Radius Tuning</h3>
            <p className="text-xs text-slate-500 mb-4">
              Agar aapko exact custom radius chahiye, toh yahan se slider adjust karein:
            </p>
            <div className="flex items-center gap-4 max-w-lg">
              <span className="text-xs font-semibold text-slate-600 w-16">
                {theme.buttonRadius === '9999px' ? 'Pill (Full)' : theme.buttonRadius}
              </span>
              <input 
                type="range"
                min="0"
                max="32"
                step="2"
                value={theme.buttonRadius === '9999px' ? 32 : parseInt(theme.buttonRadius || '12')}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val >= 32) {
                    handleUpdate({ buttonVariant: 'google', buttonRadius: '9999px' });
                  } else {
                    handleUpdate({ buttonVariant: 'custom', buttonRadius: `${val}px` });
                  }
                }}
                className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#006FCC]"
              />
              <span className="text-xs text-slate-400">0px (Square) to Pill (Full)</span>
            </div>
          </div>
        </div>
      )}

      {/* ── 4. TAB 2: BRAND COLORS & RADII ── */}
      {activeTab === 'colors' && (
        <div className="space-y-6">
          {/* COLOR PRESETS */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="font-bold text-sm text-slate-900 mb-2">Instant Color Palette Presets</h3>
            <p className="text-xs text-slate-500 mb-4">Ek click se poori website ki primary &amp; tonal palette change karein:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {COLOR_PRESETS.map((p) => {
                const isSelected = theme.primaryColor.toLowerCase() === p.primary.toLowerCase();
                return (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => handleApplyPreset(p)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-2 ${
                      isSelected ? 'border-[#006FCC] ring-2 ring-[#006FCC]/20 bg-blue-50/30' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full shadow-xs" style={{ backgroundColor: p.primary }} />
                      <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: p.secBg }} />
                    </div>
                    <span className="text-xs font-bold text-slate-800">{p.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{p.primary}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CUSTOM COLOR PICKERS */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Primary Color */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Primary Brand Color</label>
              <div className="flex items-center gap-2">
                <input 
                  type="color" 
                  value={theme.primaryColor}
                  onChange={(e) => handleUpdate({ primaryColor: e.target.value })}
                  className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200"
                />
                <input 
                  type="text" 
                  value={theme.primaryColor}
                  onChange={(e) => handleUpdate({ primaryColor: e.target.value })}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono"
                />
              </div>
              <p className="text-[11px] text-slate-500">CTA buttons, brand headings, and interactive states</p>
            </div>

            {/* Hover Color */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Primary Hover Color</label>
              <div className="flex items-center gap-2">
                <input 
                  type="color" 
                  value={theme.primaryHoverColor}
                  onChange={(e) => handleUpdate({ primaryHoverColor: e.target.value })}
                  className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200"
                />
                <input 
                  type="text" 
                  value={theme.primaryHoverColor}
                  onChange={(e) => handleUpdate({ primaryHoverColor: e.target.value })}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono"
                />
              </div>
              <p className="text-[11px] text-slate-500">Color shown on button mouse hover</p>
            </div>

            {/* Secondary Tonal Background */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Secondary Background (Tonal)</label>
              <div className="flex items-center gap-2">
                <input 
                  type="color" 
                  value={theme.secondaryBgColor}
                  onChange={(e) => handleUpdate({ secondaryBgColor: e.target.value })}
                  className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200"
                />
                <input 
                  type="text" 
                  value={theme.secondaryBgColor}
                  onChange={(e) => handleUpdate({ secondaryBgColor: e.target.value })}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono"
                />
              </div>
              <p className="text-[11px] text-slate-500">Light background for secondary buttons and tags</p>
            </div>

            {/* Card Border Radius */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Card Border Radius</label>
              <select 
                value={theme.cardRadius}
                onChange={(e) => handleUpdate({ cardRadius: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold"
              >
                <option value="8px">8px (Compact)</option>
                <option value="12px">12px (Standard)</option>
                <option value="16px">16px (Comfortable - Recommended)</option>
                <option value="24px">24px (Soft Curved)</option>
              </select>
              <p className="text-[11px] text-slate-500">Corner rounding for cards and modal sheets</p>
            </div>

            {/* Button Shadow Style */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Button Elevation Shadow</label>
              <select 
                value={theme.buttonShadow}
                onChange={(e) => handleUpdate({ buttonShadow: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold"
              >
                <option value="glow">Soft Glow Shadow (CSEEL Style)</option>
                <option value="material">Material Subtle Shadow (Google Style)</option>
                <option value="none">Flat (No Shadow)</option>
              </select>
              <p className="text-[11px] text-slate-500">Drop shadow elevation behind primary CTA buttons</p>
            </div>

          </div>
        </div>
      )}

      {/* ── 5. TAB 3: GLOBAL CSS SHEET & RAW OVERRIDES ── */}
      {activeTab === 'inspector' && (
        <div className="space-y-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Computed Global CSS Variables (:root)</h3>
                <p className="text-xs text-slate-500">Ye variables automatically har page par inject hote hain:</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(generatedCss);
                  setCopiedCss(true);
                  setTimeout(() => setCopiedCss(false), 2000);
                }}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
              >
                {copiedCss ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCss ? 'Copied!' : 'Copy CSS'}</span>
              </button>
            </div>

            <pre className="p-4 bg-slate-900 text-sky-300 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">
              {generatedCss}
            </pre>
          </div>

          {/* CUSTOM RAW CSS OVERRIDES */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-slate-900">Admin Custom CSS Overrides Sheet</h3>
            <p className="text-xs text-slate-500">
              Aap yahan custom CSS rules likh sakte hain jo poori website par live render honge (e.g. font tweaks, specific button styles):
            </p>
            <textarea
              rows={6}
              value={theme.customCssOverrides || ''}
              onChange={(e) => handleUpdate({ customCssOverrides: e.target.value })}
              placeholder="/* Example: */&#10;.button_primary { letter-spacing: 0.3px; }&#10;h1 { font-family: var(--font-google-sans); }"
              className="w-full p-3 font-mono text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006FCC] bg-slate-50"
            />
            <p className="text-[11px] text-slate-400">
              Note: Ye CSS sidhe head mein <code className="bg-slate-100 px-1 rounded">&lt;style id=&quot;cseel-custom-theme-style&quot;&gt;</code> mein inject hota hai.
            </p>
          </div>
        </div>
      )}

      {/* ── 6. LIVE COMPONENT PREVIEW BARRIER ── */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#006FCC]" />
            <h3 className="font-bold text-sm text-slate-900">Live Website Components Sandbox</h3>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Active Mode: <strong className="text-[#006FCC] uppercase">{theme.buttonVariant}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* 1. Primary Buttons */}
          <div className="space-y-3 p-4 bg-slate-50/80 rounded-xl border border-slate-200/60">
            <span className="text-xs font-bold text-slate-600 block">Primary CTA Buttons</span>
            <div className="flex flex-col gap-2.5">
              <button className="button_primary w-full">
                <span>Active Website Primary</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button className="button_cseel w-full">
                <span>Explicit CSEEL Style</span>
              </button>
              <button className="button_google w-full">
                <span>Explicit Google Style</span>
              </button>
            </div>
          </div>

          {/* 2. Secondary & Outline */}
          <div className="space-y-3 p-4 bg-slate-50/80 rounded-xl border border-slate-200/60">
            <span className="text-xs font-bold text-slate-600 block">Secondary &amp; Outline</span>
            <div className="flex flex-col gap-2.5">
              <button className="button_secondary w-full">
                <span>Secondary Tonal Button</span>
              </button>
              <button className="button_outline w-full">
                <span>Outline Border Button</span>
              </button>
            </div>
          </div>

          {/* 3. Cards & Badges */}
          <div className="space-y-3 p-4 bg-slate-50/80 rounded-xl border border-slate-200/60">
            <span className="text-xs font-bold text-slate-600 block">Interactive Card Surface</span>
            <div className="p-4 bg-white rounded-[var(--card-radius,16px)] border border-slate-200 shadow-sm flex flex-col gap-2">
              <span className="inline-block text-[11px] font-bold text-[#006FCC] bg-[#EDF5FA] px-2 py-0.5 rounded-full w-fit">
                STEM Practical
              </span>
              <h4 className="text-sm font-bold text-slate-800">Spectrophotometry Lab</h4>
              <p className="text-xs text-slate-500">Interactive live virtual simulation</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default GlobalStylingAdminModule;
