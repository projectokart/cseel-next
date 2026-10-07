'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Table,
  ShieldAlert,
  Wrench,
  BookOpen,
  Calculator,
  ListOrdered,
  Beaker,
  History,
  Globe,
  HelpCircle,
  Video,
  Image as ImageIcon,
  Sparkles,
  GripVertical,
  Minus,
  Maximize2,
  X,
  Search,
  Plus,
  Layers,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  ArrowLeftRight
} from 'lucide-react';
import { ExperimentSection } from '@/types/experiment';

interface FloatingSectionToolboxProps {
  onAddSection: (type: ExperimentSection['type']) => void;
  isOpen: boolean;
  onClose: () => void;
}

interface SectionMeta {
  type: ExperimentSection['type'];
  label: string;
  category: 'Apparatus & Safety' | 'Science & Method' | 'Translation & History' | 'Media & Evaluation';
  desc: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  border: string;
}

const ALL_TOOL_SECTIONS: SectionMeta[] = [
  // 1. Apparatus & Safety
  {
    type: 'setup',
    label: 'Setup Diagram',
    category: 'Apparatus & Safety',
    desc: 'Apparatus schematic, layering & assembly steps',
    icon: Wrench,
    color: 'text-[#005689]',
    bg: 'bg-blue-50 hover:bg-blue-100',
    border: 'border-blue-200',
  },
  {
    type: 'materials',
    label: 'Materials Table',
    category: 'Apparatus & Safety',
    desc: 'Reagents, glassware, specifications & buy links',
    icon: Table,
    color: 'text-emerald-700',
    bg: 'bg-emerald-50 hover:bg-emerald-100',
    border: 'border-emerald-200',
  },
  {
    type: 'precautions',
    label: 'Precautions & PPE',
    category: 'Apparatus & Safety',
    desc: 'Hazard callouts, eye protection & safe handling',
    icon: ShieldAlert,
    color: 'text-amber-700',
    bg: 'bg-amber-50 hover:bg-amber-100',
    border: 'border-amber-200',
  },

  // 2. Science & Method
  {
    type: 'theory',
    label: 'Theory & Principle',
    category: 'Science & Method',
    desc: 'Governing laws, chemical mechanisms & concepts',
    icon: BookOpen,
    color: 'text-blue-700',
    bg: 'bg-blue-50 hover:bg-blue-100',
    border: 'border-blue-200',
  },
  {
    type: 'math_formula',
    label: 'Math & Formulas',
    category: 'Science & Method',
    desc: 'KaTeX equations, thermodynamic math & symbols',
    icon: Calculator,
    color: 'text-purple-700',
    bg: 'bg-purple-50 hover:bg-purple-100',
    border: 'border-purple-200',
  },
  {
    type: 'procedure',
    label: 'Step Procedure',
    category: 'Science & Method',
    desc: 'Step-by-step with in-situ safety & expected results',
    icon: ListOrdered,
    color: 'text-indigo-700',
    bg: 'bg-indigo-50 hover:bg-indigo-100',
    border: 'border-indigo-200',
  },
  {
    type: 'observation',
    label: 'Observation & Inference',
    category: 'Science & Method',
    desc: 'Readings table, measured data & scientific deduction',
    icon: Beaker,
    color: 'text-teal-700',
    bg: 'bg-teal-50 hover:bg-teal-100',
    border: 'border-teal-200',
  },

  // 3. Translation & History
  {
    type: 'history',
    label: 'History & Genesis',
    category: 'Translation & History',
    desc: 'Pioneer scientist, era, narrative & milestones',
    icon: History,
    color: 'text-amber-800',
    bg: 'bg-amber-50 hover:bg-amber-100',
    border: 'border-amber-200',
  },
  {
    type: 'applications',
    label: 'Real Applications',
    category: 'Translation & History',
    desc: 'Nested industry subsections, images & external links',
    icon: Globe,
    color: 'text-emerald-800',
    bg: 'bg-emerald-50 hover:bg-emerald-100',
    border: 'border-emerald-200',
  },
  {
    type: 'faq',
    label: 'FAQ Block',
    category: 'Translation & History',
    desc: 'Common questions, misconceptions & conceptual answers',
    icon: HelpCircle,
    color: 'text-[#005689]',
    bg: 'bg-sky-50 hover:bg-sky-100',
    border: 'border-sky-200',
  },

  // 4. Media & Evaluation
  {
    type: 'gallery',
    label: 'Media Gallery',
    category: 'Media & Evaluation',
    desc: 'Slider, grid or single view apparatus photos',
    icon: ImageIcon,
    color: 'text-sky-700',
    bg: 'bg-sky-50 hover:bg-sky-100',
    border: 'border-sky-200',
  },
  {
    type: 'video',
    label: 'Video Demo',
    category: 'Media & Evaluation',
    desc: 'YouTube or MP4 lab recording embed',
    icon: Video,
    color: 'text-rose-700',
    bg: 'bg-rose-50 hover:bg-rose-100',
    border: 'border-rose-200',
  },
  {
    type: 'custom',
    label: 'Custom Notes / Viva',
    category: 'Media & Evaluation',
    desc: 'Viva-voce questions, teacher notes & knowledge checks',
    icon: Sparkles,
    color: 'text-orange-700',
    bg: 'bg-orange-50 hover:bg-orange-100',
    border: 'border-orange-200',
  },
];

export const FloatingSectionToolbox: React.FC<FloatingSectionToolboxProps> = ({
  onAddSection,
  isOpen,
  onClose,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [width, setWidth] = useState<number>(340);
  const [isResizing, setIsResizing] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Hover state for tooltip in Icon-Rail Mode
  const [hoveredTool, setHoveredTool] = useState<{
    tool: SectionMeta;
    top: number;
    left: number;
  } | null>(null);

  // Position state (defaults to top right)
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hasCustomPosition, setHasCustomPosition] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const dragRef = useRef<{
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
  }>({ startX: 0, startY: 0, initialX: 0, initialY: 0 });

  const panelRef = useRef<HTMLDivElement>(null);

  // Derive whether panel is in slim Icon-Rail mode (width <= 90)
  const isIconRail = width <= 90;

  // Initialize position on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const defaultX = Math.max(16, window.innerWidth - (isIconRail ? 80 : 360));
      const defaultY = 110;
      setPosition({ x: defaultX, y: defaultY });
    }
  }, []);

  // Handle Dragging via Header
  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button, input')) return;

    e.preventDefault();
    setIsDragging(true);

    const currentX = hasCustomPosition ? position.x : Math.max(16, window.innerWidth - width - 20);
    const currentY = hasCustomPosition ? position.y : 110;

    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: currentX,
      initialY: currentY,
    };

    const handlePointerMove = (moveEvt: PointerEvent) => {
      const deltaX = moveEvt.clientX - dragRef.current.startX;
      const deltaY = moveEvt.clientY - dragRef.current.startY;

      const maxX = Math.max(0, window.innerWidth - width - 10);
      const maxY = Math.max(0, window.innerHeight - 80);

      const nextX = Math.min(maxX, Math.max(10, dragRef.current.initialX + deltaX));
      const nextY = Math.min(maxY, Math.max(10, dragRef.current.initialY + deltaY));

      setPosition({ x: nextX, y: nextY });
      setHasCustomPosition(true);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  // Handle Resizing via Left Edge Handle
  const handleResizePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);

    const startX = e.clientX;
    const startWidth = width;

    const handlePointerMove = (moveEvt: PointerEvent) => {
      // Dragging left (moveEvt.clientX < startX) increases width; dragging right decreases width
      const delta = startX - moveEvt.clientX;
      const calculatedWidth = startWidth + delta;

      if (calculatedWidth < 120) {
        // Snap to slim Icon Rail mode
        setWidth(62);
      } else {
        setWidth(Math.min(500, Math.max(160, calculatedWidth)));
      }
    };

    const handlePointerUp = () => {
      setIsResizing(false);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  // Toggle between Icon Rail mode (62px) and Full Card mode (340px)
  const toggleIconRailMode = () => {
    if (isIconRail) {
      setWidth(340);
    } else {
      setWidth(62);
    }
  };

  if (!isOpen) return null;

  // Filter sections
  const filteredTools = ALL_TOOL_SECTIONS.filter((tool) => {
    const matchQuery =
      tool.label.toLowerCase().includes(searchFilter.toLowerCase()) ||
      tool.desc.toLowerCase().includes(searchFilter.toLowerCase());
    const matchCat = selectedCategory === 'all' || tool.category === selectedCategory;
    return matchQuery && matchCat;
  });

  const categories = ['all', 'Apparatus & Safety', 'Science & Method', 'Translation & History', 'Media & Evaluation'];

  // Minimized Floating Pill View
  if (isMinimized) {
    return (
      <div
        ref={panelRef}
        style={{
          position: 'fixed',
          left: `${position.x}px`,
          top: `${position.y}px`,
          zIndex: 60,
        }}
        className="animate-in fade-in zoom-in-95 cursor-move"
        onPointerDown={handlePointerDown}
      >
        <div className="flex items-center gap-2 bg-[#001d35] text-white px-3.5 py-2 rounded-full shadow-2xl border border-blue-400/40 hover:border-blue-300 transition-all backdrop-blur-md">
          <GripVertical className="w-4 h-4 text-blue-300 cursor-grab active:cursor-grabbing" />
          <button
            type="button"
            onClick={() => setIsMinimized(false)}
            className="flex items-center gap-2 text-xs font-bold hover:text-blue-200 transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>+ Add Section (13 Blocks)</span>
            <Maximize2 className="w-3 h-3 text-slate-400 ml-1" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:text-rose-400 rounded-full transition-colors ml-1"
            title="Close Floating Panel"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        ref={panelRef}
        style={{
          position: 'fixed',
          left: `${position.x}px`,
          top: `${position.y}px`,
          zIndex: 60,
          width: `${width}px`,
          maxHeight: 'calc(100vh - 120px)',
        }}
        className={`bg-white/98 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-300/80 flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-2 select-none transition-shadow ${
          isDragging ? 'shadow-[0_20px_50px_rgba(0,0,0,0.35)] ring-2 ring-[#005689]' : ''
        } ${isResizing ? 'ring-2 ring-emerald-500 shadow-xl' : ''}`}
      >
        {/* ── Resize Handle on Left Edge ── */}
        <div
          onPointerDown={handleResizePointerDown}
          className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize group hover:bg-[#005689]/20 transition-colors z-30"
          title="Drag left/right to resize width (drag right to shrink to icon-only dock)"
        >
          <div className="w-0.5 h-8 bg-slate-300 group-hover:bg-[#005689] rounded-full mx-auto my-auto relative top-1/2 -translate-y-1/2 transition-colors" />
        </div>

        {/* ── 1. Header Bar (Drag Handle + Width Toggle + Minimize + Close) ── */}
        <div
          onPointerDown={handlePointerDown}
          className={`flex items-center justify-between bg-gradient-to-r from-[#002244] via-[#003c6e] to-[#005689] text-white cursor-grab active:cursor-grabbing shrink-0 ${
            isIconRail ? 'p-2 flex-col gap-2' : 'px-3.5 py-2.5'
          }`}
          title="Drag from here to move panel anywhere on screen"
        >
          {isIconRail ? (
            /* Icon Rail Compact Header */
            <div className="flex flex-col items-center gap-1.5 w-full">
              <GripVertical className="w-4 h-4 text-blue-200 opacity-70" />
              <button
                type="button"
                onClick={toggleIconRailMode}
                className="p-1 text-blue-200 hover:text-white hover:bg-white/10 rounded transition-colors"
                title="Expand to full section cards"
              >
                <PanelLeftOpen className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsMinimized(true)}
                className="p-1 text-blue-200 hover:text-white hover:bg-white/10 rounded transition-colors"
                title="Minimize to floating pill"
              >
                <Minus className="w-3 h-3" />
              </button>
            </div>
          ) : (
            /* Full Width Header */
            <>
              <div className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-blue-200 opacity-70 shrink-0" />
                <div>
                  <h4 className="text-xs font-black tracking-tight text-white flex items-center gap-1.5">
                    <span>Section Studio Palette</span>
                    <span className="bg-white/20 text-[10px] font-bold px-1.5 py-0.2 rounded-sm text-blue-100">
                      13
                    </span>
                  </h4>
                  <p className="text-[10px] text-blue-200/80 font-medium truncate max-w-[180px]">
                    Drag to move • Resize width on edge
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {/* 1-Click Width Mode Switch */}
                <button
                  type="button"
                  onClick={toggleIconRailMode}
                  className="p-1 text-blue-200 hover:text-white hover:bg-white/10 rounded transition-colors"
                  title="Collapse to slim Icon-Only rail"
                >
                  <PanelLeftClose className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsMinimized(true)}
                  className="p-1 text-blue-200 hover:text-white hover:bg-white/10 rounded transition-colors"
                  title="Minimize to floating pill"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1 text-blue-200 hover:text-rose-300 hover:bg-white/10 rounded transition-colors"
                  title="Close toolbox"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          )}
        </div>

        {/* ── 2. MODE A: SLIM ICON-ONLY RAIL (width <= 90) ── */}
        {isIconRail ? (
          <div className="py-2 px-1 flex flex-col items-center gap-1.5 overflow-y-auto max-h-[420px] no-scrollbar">
            {ALL_TOOL_SECTIONS.map((tool) => {
              const IconComp = tool.icon;
              return (
                <button
                  key={tool.type}
                  type="button"
                  onClick={() => onAddSection(tool.type)}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setHoveredTool({
                      tool,
                      top: rect.top,
                      left: rect.left,
                    });
                  }}
                  onMouseLeave={() => setHoveredTool(null)}
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${tool.bg} ${tool.border} hover:scale-110 hover:shadow-md active:scale-95 group relative`}
                >
                  <IconComp className={`w-5 h-5 ${tool.color} transition-transform group-hover:scale-110`} />
                </button>
              );
            })}
          </div>
        ) : (
          /* ── 2. MODE B: FULL EXPANDED CARDS VIEW (width > 90) ── */
          <>
            {/* Search & Category Filters */}
            <div className="p-2.5 bg-slate-50 border-b border-slate-200 space-y-2 shrink-0">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Search blocks (e.g. setup, formula, video)..."
                  className="w-full text-xs pl-8 pr-7 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#005689]"
                />
                {searchFilter && (
                  <button
                    type="button"
                    onClick={() => setSearchFilter('')}
                    className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-0.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap transition-colors ${
                      selectedCategory === cat
                        ? 'bg-[#005689] text-white'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {cat === 'all' ? 'All (13)' : cat.split('&')[0].trim()}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable List of Section Blocks */}
            <div className="p-2.5 overflow-y-auto max-h-[380px] space-y-2">
              {filteredTools.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400">
                  No section blocks match &quot;{searchFilter}&quot;
                </div>
              ) : (
                filteredTools.map((tool) => {
                  const IconComp = tool.icon;
                  return (
                    <button
                      key={tool.type}
                      type="button"
                      onClick={() => onAddSection(tool.type)}
                      className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start gap-2.5 group ${tool.bg} ${tool.border} hover:shadow-2xs active:scale-[0.99]`}
                    >
                      <div
                        className={`p-2 rounded-lg bg-white shadow-2xs ${tool.color} shrink-0 group-hover:scale-105 transition-transform`}
                      >
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold text-slate-900 group-hover:text-[#005689] transition-colors truncate">
                            {tool.label}
                          </span>
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-[#005689] flex items-center shrink-0">
                            <span>+ Insert</span>
                            <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 line-clamp-1 leading-snug">
                          {tool.desc}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Bottom Footer */}
            <div className="p-2 bg-slate-50 border-t border-slate-200 text-center shrink-0 flex items-center justify-between px-3">
              <span className="text-[10px] text-slate-400 font-medium">
                💡 Drag left border to resize
              </span>
              <button
                type="button"
                onClick={toggleIconRailMode}
                className="text-[10px] font-bold text-[#005689] hover:underline flex items-center gap-1"
              >
                <span>Slim Icon Rail</span>
                <PanelLeftClose className="w-3 h-3" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* ── 3. High-Clarity Fixed Flyout Tooltip in Icon-Rail Mode ── */}
      {hoveredTool && isIconRail && (
        <div
          style={{
            position: 'fixed',
            top: `${Math.max(10, Math.min(window.innerHeight - 150, hoveredTool.top - 10))}px`,
            left: `${Math.max(10, hoveredTool.left - 260)}px`,
            zIndex: 100,
            width: '240px',
          }}
          className="bg-[#001d35] text-white p-3 rounded-xl shadow-2xl border border-blue-400/40 pointer-events-none animate-in fade-in zoom-in-95"
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1 rounded-md bg-white/10 text-blue-300">
              <hoveredTool.tool.icon className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-extrabold uppercase tracking-wider text-blue-300 bg-white/10 px-1.5 py-0.5 rounded">
              {hoveredTool.tool.category}
            </span>
          </div>

          <div className="text-xs font-bold text-white mb-0.5">
            {hoveredTool.tool.label}
          </div>
          <div className="text-[11px] text-slate-300 leading-snug">
            {hoveredTool.tool.desc}
          </div>

          <div className="mt-2 pt-1.5 border-t border-white/10 flex items-center justify-between text-[10px] text-blue-300 font-bold">
            <span>Click icon to append section</span>
            <span className="text-emerald-400">+ Add</span>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingSectionToolbox;
