'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Save,
  Eye,
  FileSpreadsheet,
  FileCode,
  Printer,
  Upload,
  Plus,
  Beaker,
  ShieldAlert,
  BookOpen,
  Calculator,
  ListOrdered,
  Table,
  Video,
  Image as ImageIcon,
  Sparkles,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Wrench,
  History,
  Globe,
  Layers,
  LayoutGrid,
  ArrowLeft,
  MoreHorizontal,
  Maximize2,
  Check
} from 'lucide-react';
import { ExperimentSection } from '@/types/experiment';
import FloatingSectionToolbox from './FloatingSectionToolbox';

interface WordToolbarProps {
  onAddSection: (type: ExperimentSection['type']) => void;
  onSave: () => void;
  onTogglePreview: () => void;
  isPreviewMode: boolean;
  onExportExcel: () => void;
  onExportJson: () => void;
  onImportJson: () => void;
  onPrint: () => void;
  isSaving?: boolean;
  onBack?: () => void;
  activeId?: string;
  autoSaveStatus?: 'saved' | 'saving' | 'idle';
}

interface DropdownItem {
  type: ExperimentSection['type'];
  label: string;
  category: string;
  icon: React.ElementType;
  color: string;
}

const CATEGORIZED_SECTIONS: { category: string; items: DropdownItem[] }[] = [
  {
    category: 'Apparatus & Safety',
    items: [
      { type: 'setup', label: 'Setup Schematic & Diagram', category: 'Apparatus & Safety', icon: Wrench, color: 'text-[#005689]' },
      { type: 'materials', label: 'Materials & Apparatus Table', category: 'Apparatus & Safety', icon: Table, color: 'text-emerald-600' },
      { type: 'precautions', label: 'Precautions & Lab Safety PPE', category: 'Apparatus & Safety', icon: ShieldAlert, color: 'text-amber-600' },
    ],
  },
  {
    category: 'Scientific Method & Logic',
    items: [
      { type: 'theory', label: 'Scientific Principle & Theory', category: 'Scientific Method', icon: BookOpen, color: 'text-blue-600' },
      { type: 'math_formula', label: 'KaTeX Math & Chemical Formulas', category: 'Scientific Method', icon: Calculator, color: 'text-purple-600' },
      { type: 'procedure', label: 'Step Procedure with In-situ Safety', category: 'Scientific Method', icon: ListOrdered, color: 'text-indigo-600' },
      { type: 'observation', label: 'Observation Data & Inference', category: 'Scientific Method', icon: Beaker, color: 'text-teal-600' },
    ],
  },
  {
    category: 'Translational Impact & Genesis',
    items: [
      { type: 'history', label: 'Historical Discovery & Milestones', category: 'Translational', icon: History, color: 'text-amber-700' },
      { type: 'applications', label: 'Real-World Applications (Nested)', category: 'Translational', icon: Globe, color: 'text-emerald-700' },
      { type: 'faq', label: 'FAQ Block & Conceptual Queries', category: 'Translational', icon: HelpCircle, color: 'text-[#005689]' },
    ],
  },
  {
    category: 'Visual Media & Assessment',
    items: [
      { type: 'gallery', label: 'Visual Media Gallery', category: 'Media', icon: ImageIcon, color: 'text-sky-600' },
      { type: 'video', label: 'Demonstration Video Embed', category: 'Media', icon: Video, color: 'text-rose-600' },
      { type: 'custom', label: 'Viva Voce & Knowledge Notes', category: 'Media', icon: Sparkles, color: 'text-amber-500' },
    ],
  },
];

export const WordToolbar: React.FC<WordToolbarProps> = ({
  onAddSection,
  onSave,
  onTogglePreview,
  isPreviewMode,
  onExportExcel,
  onExportJson,
  onImportJson,
  onPrint,
  isSaving = false,
  onBack,
  activeId,
  autoSaveStatus = 'idle',
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [isToolboxOpen, setIsToolboxOpen] = useState(false);
  const [isZenMode, setIsZenMode] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setMoreMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelectItem = (type: ExperimentSection['type']) => {
    onAddSection(type);
    setDropdownOpen(false);
    setMoreMenuOpen(false);
  };

  // Google Docs Compact / Zen Mode (Minimalist 28px pill)
  if (isZenMode) {
    return (
      <>
        <div className="sticky -top-4 sm:-top-6 lg:-top-8 -mx-4 sm:-mx-6 lg:-mx-8 z-40 select-none mb-3 transition-all">
          <div className="bg-[#003c6e] text-white px-3 py-1 flex items-center justify-between border-b border-[#002b4e] shadow-md backdrop-blur-md">
            <div className="flex items-center gap-2">
              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="p-1 hover:bg-white/10 rounded text-blue-200 hover:text-white"
                  title="Back to Catalog"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              )}
              <span className="text-[11px] font-bold text-blue-100 flex items-center gap-1.5">
                <span className="bg-white/20 px-1.5 py-0.2 rounded text-[10px]">CSEEL</span>
                <span className="hidden sm:inline">Zen Writing Mode</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Auto-save status in Zen Mode */}
              {autoSaveStatus === 'saving' && (
                <span className="text-[10px] text-amber-200 hidden sm:inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  Auto-saving...
                </span>
              )}
              {autoSaveStatus === 'saved' && (
                <span className="text-[10px] text-emerald-300 hidden sm:inline-flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-400" />
                  Saved
                </span>
              )}

              {/* Quick Add Section Button */}
              <button
                type="button"
                onClick={() => handleSelectItem('procedure')}
                className="px-2 py-0.5 rounded text-[11px] font-semibold bg-white/10 hover:bg-white/20 text-white"
              >
                + Step
              </button>
              <button
                type="button"
                onClick={onSave}
                disabled={isSaving}
                className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                {isSaving ? '...' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => setIsZenMode(false)}
                className="p-1 hover:bg-white/15 text-cyan-300 rounded flex items-center gap-1 text-[11px] font-bold"
                title="Expand Full Google-Style Toolbar"
              >
                <span>Expand</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        <FloatingSectionToolbox
          isOpen={isToolboxOpen}
          onClose={() => setIsToolboxOpen(false)}
          onAddSection={onAddSection}
        />
      </>
    );
  }

  // Google Docs Inspired Slim Unified Single-Row Action Bar (~42px high)
  return (
    <>
      <div className="sticky -top-4 sm:-top-6 lg:-top-8 -mx-4 sm:-mx-6 lg:-mx-8 z-40 select-none mb-4 transition-all shadow-md">
        <div className="bg-[#003c6e] text-white px-3 sm:px-5 h-11 flex items-center justify-between gap-2 border-b border-[#002a4a]">
          {/* ── 1. Left Cluster: Back, Brand, and "+ Add Section" Dropdown ── */}
          <div className="flex items-center gap-2 shrink-0">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Return to experiments catalog"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}

            <div className="flex items-center gap-1 px-2 py-0.5 bg-white/15 text-white rounded text-[11px] font-black tracking-wide border border-white/20 mr-1">
              <span>CSEEL</span>
              <span className="text-cyan-300 text-[10px]">STUDIO</span>
            </div>

            {/* "+ Add Section" Main Dropdown Button */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0080ff] hover:bg-[#0070e0] text-white rounded-lg text-xs font-bold shadow-xs transition-all active:scale-98"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Add Section</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Categorized Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute left-0 top-full mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#005689]" />
                      <span>Select Component Block to Add</span>
                    </span>
                    <span className="text-[10px] font-bold text-[#005689] bg-blue-50 px-2 py-0.5 rounded-full">
                      13 Modules
                    </span>
                  </div>

                  <div className="max-h-[360px] overflow-y-auto space-y-3 pr-1">
                    {CATEGORIZED_SECTIONS.map((catGroup) => (
                      <div key={catGroup.category} className="space-y-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block px-1">
                          {catGroup.category}
                        </span>
                        <div className="grid grid-cols-1 gap-1">
                          {catGroup.items.map((item) => {
                            const ItemIcon = item.icon;
                            return (
                              <button
                                key={item.type}
                                type="button"
                                onClick={() => handleSelectItem(item.type)}
                                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-100 flex items-center gap-2.5 text-xs text-slate-700 hover:text-[#005689] transition-colors group"
                              >
                                <ItemIcon className={`w-4 h-4 ${item.color} group-hover:scale-110 transition-transform shrink-0`} />
                                <span className="font-semibold">{item.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Or use the floating draggable toolbox</span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsToolboxOpen(true);
                        setDropdownOpen(false);
                      }}
                      className="font-bold text-[#005689] hover:underline"
                    >
                      Open Floating Toolbox
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── 2. Middle Cluster: Google Docs Style Compact 1-Click Quick Chips ── */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
            <div className="h-4 w-px bg-white/20 mx-1 shrink-0" />

            <button
              type="button"
              onClick={() => onAddSection('setup')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-white/90 hover:text-white hover:bg-white/10 transition-colors shrink-0"
              title="Add Apparatus Setup Schematic & Diagram"
            >
              <Wrench className="w-3.5 h-3.5 text-cyan-300" />
              <span className="hidden sm:inline">Setup</span>
            </button>

            <button
              type="button"
              onClick={() => onAddSection('procedure')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-white/90 hover:text-white hover:bg-white/10 transition-colors shrink-0"
              title="Add Step Procedure with In-situ Safety"
            >
              <ListOrdered className="w-3.5 h-3.5 text-indigo-300" />
              <span className="hidden sm:inline">Procedure</span>
            </button>

            <button
              type="button"
              onClick={() => onAddSection('history')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-white/90 hover:text-white hover:bg-white/10 transition-colors shrink-0"
              title="Add Historical Discovery & Milestones"
            >
              <History className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden md:inline">History</span>
            </button>

            <button
              type="button"
              onClick={() => onAddSection('applications')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-white/90 hover:text-white hover:bg-white/10 transition-colors shrink-0"
              title="Add Real-World Applications (Nested Subsections)"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-300" />
              <span className="hidden md:inline">Applications</span>
            </button>

            <button
              type="button"
              onClick={() => onAddSection('materials')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-white/90 hover:text-white hover:bg-white/10 transition-colors shrink-0"
              title="Add Materials Table"
            >
              <Table className="w-3.5 h-3.5 text-emerald-300" />
              <span className="hidden lg:inline">Materials</span>
            </button>

            <button
              type="button"
              onClick={() => onAddSection('math_formula')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-white/90 hover:text-white hover:bg-white/10 transition-colors shrink-0"
              title="Add KaTeX Math Formula"
            >
              <Calculator className="w-3.5 h-3.5 text-purple-300" />
              <span className="hidden lg:inline">Math</span>
            </button>

            {/* "··· More" Options Menu (Media, Observation, FAQ, Export) */}
            <div className="relative shrink-0" ref={moreMenuRef}>
              <button
                type="button"
                onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                className="p-1 hover:bg-white/15 text-white/90 hover:text-white rounded-md transition-colors"
                title="More Sections, Media & Data Tools"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

              {moreMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white text-slate-800 border border-slate-200 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block px-2 py-0.5">
                    More Sections
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSelectItem('observation')}
                    className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-100 flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-[#005689]"
                  >
                    <Beaker className="w-3.5 h-3.5 text-teal-600" />
                    <span>Observation Table</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectItem('video')}
                    className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-100 flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-[#005689]"
                  >
                    <Video className="w-3.5 h-3.5 text-rose-600" />
                    <span>Video Demonstration</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectItem('gallery')}
                    className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-100 flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-[#005689]"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-sky-600" />
                    <span>Photo Gallery</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectItem('faq')}
                    className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-100 flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-[#005689]"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-[#005689]" />
                    <span>FAQ Section</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectItem('custom')}
                    className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-100 flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-[#005689]"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Viva Voce & Notes</span>
                  </button>

                  <div className="pt-1 border-t border-slate-100">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block px-2 py-0.5">
                      Export & Data
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        onExportExcel();
                        setMoreMenuOpen(false);
                      }}
                      className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-100 flex items-center gap-2 text-xs font-medium text-slate-700"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Export Excel</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onExportJson();
                        setMoreMenuOpen(false);
                      }}
                      className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-100 flex items-center gap-2 text-xs font-medium text-slate-700"
                    >
                      <FileCode className="w-3.5 h-3.5 text-blue-600" />
                      <span>Export JSON</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onImportJson();
                        setMoreMenuOpen(false);
                      }}
                      className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-100 flex items-center gap-2 text-xs font-medium text-slate-700"
                    >
                      <Upload className="w-3.5 h-3.5 text-purple-600" />
                      <span>Import JSON</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onPrint();
                        setMoreMenuOpen(false);
                      }}
                      className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-100 flex items-center gap-2 text-xs font-medium text-slate-700"
                    >
                      <Printer className="w-3.5 h-3.5 text-slate-600" />
                      <span>Print Document</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── 3. Right Cluster: Toolbox + Preview + Save + Zen Collapse ── */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Floating Toolbox Toggle */}
            <button
              type="button"
              onClick={() => setIsToolboxOpen(!isToolboxOpen)}
              className={`p-1.5 sm:px-2 sm:py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1 ${
                isToolboxOpen
                  ? 'bg-white/20 text-cyan-200 border border-cyan-400/40'
                  : 'text-white/80 hover:bg-white/10'
              }`}
              title="Toggle Draggable Floating Toolbox"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-cyan-300" />
              <span className="hidden xl:inline">Toolbox</span>
              {isToolboxOpen && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              )}
            </button>

            {/* Document View Preview */}
            <button
              type="button"
              onClick={onTogglePreview}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold transition-all border ${
                isPreviewMode
                  ? 'bg-amber-400 text-slate-900 border-amber-300'
                  : 'bg-white/15 text-white hover:bg-white/25 border-white/20'
              }`}
              title="Toggle Document View Preview"
            >
              <Eye className="w-3.5 h-3.5 text-cyan-200" />
              <span className="hidden sm:inline">{isPreviewMode ? 'Edit' : 'Preview'}</span>
            </button>

            {/* Auto-save status in Standard Bar */}
            {autoSaveStatus === 'saving' && (
              <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-medium text-amber-200 bg-amber-900/40 px-2 py-0.5 rounded border border-amber-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                Auto-saving...
              </span>
            )}
            {autoSaveStatus === 'saved' && (
              <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-medium text-emerald-200 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/30" title="All edits saved to drafts">
                <Check className="w-3 h-3 text-emerald-300" />
                Draft saved
              </span>
            )}

            {/* Save Button */}
            <button
              type="button"
              onClick={onSave}
              disabled={isSaving}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-black text-white bg-emerald-600 hover:bg-emerald-500 shadow-xs transition-all active:scale-98 disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? '...' : 'Save'}</span>
            </button>

            {/* Google Docs Style "Hide menus" Zen Toggle */}
            <button
              type="button"
              onClick={() => setIsZenMode(true)}
              className="p-1 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors ml-0.5"
              title="Hide toolbar / Compact Zen mode (Maximize writing space)"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Section Toolbox (Can be placed anywhere on screen) */}
      <FloatingSectionToolbox
        isOpen={isToolboxOpen}
        onClose={() => setIsToolboxOpen(false)}
        onAddSection={onAddSection}
      />
    </>
  );
};

export default WordToolbar;
