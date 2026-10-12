'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { X, ChevronUp, ChevronDown, FlaskConical, ExternalLink } from 'lucide-react';
import ExperimentTemplateView, {
  buildExperimentTemplateData,
  ExperimentTemplateData,
} from './ExperimentTemplateView';
import { SUBJECTS_DATA } from '@/data/subjectActivitiesData';
import {
  M3Button,
  M3IconButton,
  M3AssistChip,
} from '@/components/google-ui';

export interface ExperimentBottomSheetDrawerProps {
  /** Any experiment object (ExperimentActivity, ExperimentItem, Supabase row, etc.) */
  experiment: any | null;
  /** Called when the user closes or drags down the drawer */
  onClose: () => void;
  /** Optional subject fallback name */
  subjectFallback?: string;
  /** Optional list of experiments to switch between when clicking "More experiments" */
  relatedPool?: any[];
}

export default function ExperimentBottomSheetDrawer({
  experiment,
  onClose,
  subjectFallback,
  relatedPool,
}: ExperimentBottomSheetDrawerProps) {
  const [activeExp, setActiveExp] = useState<any | null>(experiment);
  const [snapState, setSnapState] = useState<'default' | 'expanded'>('default');
  const [dragDeltaY, setDragDeltaY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const dragStartYRef = useRef<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setActiveExp(experiment);
    if (experiment) {
      setSnapState('default');
      setDragDeltaY(0);
      setIsClosing(false);
    }
  }, [experiment]);

  // Lock background scroll & handle Escape key
  useEffect(() => {
    if (!activeExp) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        triggerClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeExp]);

  const triggerClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 220);
  };

  const templateData: ExperimentTemplateData | null = useMemo(() => {
    if (!activeExp) return null;
    return buildExperimentTemplateData(activeExp, subjectFallback);
  }, [activeExp, subjectFallback]);

  if (!activeExp || !templateData) return null;

  const subjectLabel = templateData.crumb?.[1] || subjectFallback || 'Physics';

  // Pointer drag handlers for the top handle bar
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStartYRef.current = e.clientY;
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || dragStartYRef.current === null) return;
    const delta = e.clientY - dragStartYRef.current;
    // Allow dragging upward (negative delta up to -160px) and downward (positive delta)
    setDragDeltaY(Math.max(-160, delta));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    setIsDragging(false);
    const finalDelta = dragDeltaY;
    dragStartYRef.current = null;
    setDragDeltaY(0);

    if (finalDelta < -45) {
      // User dragged upward -> expand to full height
      setSnapState('expanded');
    } else if (finalDelta > 115) {
      // User dragged downward significantly -> if expanded, snap to default or close
      if (snapState === 'expanded' && finalDelta < 240) {
        setSnapState('default');
      } else {
        triggerClose();
      }
    }
  };

  // Handle clicking "More experiments" inside the template without leaving the drawer
  const handleSelectRelated = (relTitle: string) => {
    const cleanTarget = relTitle.toLowerCase().trim();

    // 1. Search in provided relatedPool first
    if (relatedPool && relatedPool.length > 0) {
      const match = relatedPool.find(
        (item) =>
          item.title?.toLowerCase().includes(cleanTarget) ||
          cleanTarget.includes(item.title?.toLowerCase() || '___')
      );
      if (match) {
        setActiveExp(match);
        scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    // 2. Search across all subject activities
    for (const subj of Object.values(SUBJECTS_DATA)) {
      const found = subj.activities.find(
        (act) =>
          act.title.toLowerCase().includes(cleanTarget) ||
          cleanTarget.includes(act.title.toLowerCase())
      );
      if (found) {
        setActiveExp(found);
        scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    // 3. Otherwise synthesize an experiment with that title & current subject
    setActiveExp({
      id: `rel-${Date.now()}`,
      title: relTitle,
      subject: subjectLabel,
      gradeLevel: templateData.meta?.[0] || 'Class 10',
      duration: templateData.meta?.[1] || '30 mins',
      difficulty: templateData.meta?.[2] || 'Intermediate',
      description: `Interactive hands-on investigation of ${relTitle} in ${subjectLabel}.`,
    });
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const baseHeight = snapState === 'expanded' ? '96dvh' : '86dvh';

  return (
    <div
      className={`fixed inset-0 z-[1200] flex flex-col justify-end transition-opacity duration-200 print:static print:bg-transparent ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.55)', backdropFilter: 'blur(4px)' }}
      onClick={triggerClose}
    >
      {/* Official Google M3 Bottom Sheet Container (28px top corners, Surface Container Low #f8fafd) */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          height: baseHeight,
          maxHeight: '97dvh',
          transform: isClosing
            ? 'translateY(100%)'
            : `translateY(${Math.max(0, dragDeltaY)}px)`,
          transition: isDragging
            ? 'none'
            : 'height 0.28s cubic-bezier(0.2, 0, 0, 1), transform 0.25s cubic-bezier(0.2, 0, 0, 1)',
        }}
        className="relative w-full max-w-[920px] mx-auto bg-[#f8fafd] rounded-t-[28px] shadow-[0_-12px_40px_rgba(15,23,42,0.28)] border-t border-x border-[#dde3ea] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300"
      >
        {/* Official M3 Bottom Sheet Drag Handle + Header Bar */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onDoubleClick={() =>
            setSnapState((prev) => (prev === 'expanded' ? 'default' : 'expanded'))
          }
          className="shrink-0 bg-[#f8fafd]/95 backdrop-blur-md border-b border-[#dde3ea] px-4 pt-3 pb-2.5 select-none touch-none cursor-grab active:cursor-grabbing flex flex-col items-center relative z-20"
        >
          {/* Official M3 32x4dp Drag Handle Pill */}
          <div className="w-9 h-1 rounded-full bg-[#747775]/60 hover:bg-[#0b57d0] transition-colors mb-2" />

          <div className="w-full flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <M3AssistChip
                label={subjectLabel}
                icon={<FlaskConical className="w-3.5 h-3.5" />}
              />
              <span className="text-xs font-medium text-[#444746] truncate hidden sm:inline">
                Drag up for full screen • Drag down to close
              </span>
            </div>

            <div
              className="flex items-center gap-2 shrink-0"
              onPointerDown={(e) => e.stopPropagation()}
            >
              <a
                href={activeExp.slug ? `/experiments/${activeExp.slug}` : (activeExp.id ? `/experiments/${activeExp.id}` : '#')}
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 px-2.5 rounded-full border border-[#747775]/40 hover:border-[#0b57d0] bg-white hover:bg-[#0b57d0]/[0.08] text-[#0b57d0] text-xs font-semibold inline-flex items-center gap-1.5 transition-all shadow-xs"
                title="Open dedicated experiment profile page in new tab"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">Visit Page</span>
              </a>

              <M3Button
                variant="tonal"
                size="sm"
                leadingIcon={
                  snapState === 'expanded' ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronUp className="w-4 h-4" />
                  )
                }
                onClick={() =>
                  setSnapState((prev) => (prev === 'expanded' ? 'default' : 'expanded'))
                }
                title={snapState === 'expanded' ? 'Restore size' : 'Expand full height'}
              >
                {snapState === 'expanded' ? 'Half' : 'Full View'}
              </M3Button>

              <M3IconButton
                variant="outlined"
                size="sm"
                icon={<X className="w-4 h-4" />}
                ariaLabel="Close experiment drawer"
                onClick={triggerClose}
              />
            </div>
          </div>
        </div>

        {/* Scrollable Experiment Template Content */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto overflow-x-hidden overscroll-contain"
        >
          <ExperimentTemplateView
            data={templateData}
            isInsideDrawer={true}
            onSelectRelated={handleSelectRelated}
          />
        </div>
      </div>
    </div>
  );
}
