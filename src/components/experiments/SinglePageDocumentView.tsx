'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Printer,
  Share2,
  ExternalLink,
  Clock,
  Shield,
  GraduationCap,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Table,
  CheckCircle2,
  FileCheck,
  AlertTriangle,
  AlertOctagon,
  Recycle,
  FlaskConical,
  Atom,
  Dna,
  Calculator,
  Cpu,
  Palette,
  Lightbulb,
  HelpCircle,
  FileText,
  Compass,
  Award,
  BookOpen,
  ArrowRight,
  Info,
  Check,
  Download,
  Microscope,
  Layers,
  Bookmark,
  Package,
  History,
  X,
  ZoomIn,
  Eye
} from 'lucide-react';
import {
  ExperimentItem,
  GallerySectionBlock,
  VideoSectionBlock,
  CustomSectionBlock,
  FaqSectionBlock,
  MaterialsSectionBlock,
  PrecautionsSectionBlock,
  ProcedureSectionBlock,
  ObservationSectionBlock,
  MathFormulaSectionBlock,
  TheorySectionBlock,
  HistorySectionBlock,
  ApplicationsSectionBlock,
  ApplicationSubItem,
  SetupSectionBlock
} from '@/types/experiment';
import KatexRenderer from './KatexRenderer';
import { SUBJECTS_DATA, ExperimentActivity, slugifyExperimentTitle } from '@/data/subjectActivitiesData';

interface SinglePageDocumentViewProps {
  experiment: ExperimentItem;
  onEdit?: () => void;
  isStandalone?: boolean;
  relatedActivities?: ExperimentActivity[];
}

const ICON_MAP: Record<string, any> = {
  Sparkles,
  FlaskConical,
  Atom,
  Dna,
  Calculator,
  Cpu,
  Palette,
  Lightbulb,
  HelpCircle,
  FileText,
  Compass,
  Award,
  History,
  Layers
};

function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

const DEFAULT_FAQS = [
  {
    q: 'How does this practical align with NEP 2020 experiential learning goals?',
    a: 'Replaces rote theoretical memorization with hands-on inquiry, structured hypothesis testing, quantitative data recording, and error analysis aligned with NEP 2020, CBSE, and ICSE curriculum benchmarks.'
  },
  {
    q: 'Can this experiment be conducted in school laboratories safely?',
    a: 'Yes. All required reagents and apparatus are mapped to standard secondary school inventory levels with clear PPE protocols and safe neutralization procedures.'
  },
  {
    q: 'How should students record and report observational findings?',
    a: 'Students use the embedded observation table to log multiple trials, calculate percentage error relative to theoretical constants, and synthesize a formal scientific conclusion.'
  },
  {
    q: 'What prior conceptual knowledge is recommended before starting?',
    a: 'Learners should be familiar with the foundational principles outlined in the Concept section, basic lab measurement tools, and standard safety precautions.'
  }
];

// Helper to parse inline math ($...$) and bold (**...**)
function renderInlineMathAndBold(text: string): React.ReactNode {
  if (!text) return null;
  const regex = /(\$[^$]+\$|\*\*[^*]+\*\*)/g;
  const parts = text.split(regex);
  return parts.map((part, i) => {
    if (part.startsWith('$') && part.endsWith('$')) {
      const latex = part.slice(1, -1);
      return (
        <span key={i} className="inline-block mx-0.5 align-baseline font-serif">
          <KatexRenderer latex={latex} displayMode={false} />
        </span>
      );
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      const boldText = part.slice(2, -2);
      return (
        <strong key={i} className="font-bold text-slate-900">
          {boldText}
        </strong>
      );
    }
    return part;
  });
}

// Robust helper to parse markdown content into isolated semantic blocks
function parseContentBlocks(content: string): string[] {
  if (!content) return [];
  const text = content.replace(/\r\n/g, '\n');
  
  // Ensure '### ' always starts on a fresh double newline
  let prepared = text.replace(/([^\n])\n(#{2,4}\s+)/g, '$1\n\n$2');
  // Ensure text after heading starts on double newline
  prepared = prepared.replace(/(#{2,4}\s+[^\n]+)\n([^\n#])/g, '$1\n\n$2');

  // Ensure '$$' is isolated with double newlines
  prepared = prepared.replace(/([^\n])\n(\$\$)/g, '$1\n\n$2');
  prepared = prepared.replace(/(\$\$[^\n]*\$\$)\n([^\n])/g, '$1\n\n$2');
  prepared = prepared.replace(/(\$\$)\n([^\n])/g, '$1\n\n$2');
  
  return prepared.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
}

// Helper to render rich scientific blocks with Deep Blue subheadings and KaTeX display math
function renderRichContent(content: string) {
  if (!content) return null;
  const blocks = parseContentBlocks(content);

  return (
    <div className="space-y-3.5 text-xs sm:text-sm text-slate-700 leading-relaxed text-left">
      {blocks.map((block, idx) => {
        // 1. Subheading starting with ### or ##
        if (block.startsWith('###') || block.startsWith('##')) {
          const headingText = block.replace(/^#{2,4}\s+/, '').trim();
          return (
            <h3
              key={idx}
              style={{ color: '#003c6e' }}
              className="font-serif text-base sm:text-lg lg:text-xl font-bold mt-4 pt-1 mb-2 flex items-center gap-2 border-b border-slate-200/80 pb-1.5"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#005689] shrink-0" />
              <span>{headingText}</span>
            </h3>
          );
        }

        // 2. Display math formula starting with $$ and ending with $$
        if (block.startsWith('$$')) {
          const latex = block.replace(/^\$\$\s*/, '').replace(/\s*\$\$$/, '').trim();
          return (
            <div
              key={idx}
              className="my-3 p-3.5 sm:p-4 bg-blue-50/70 border border-blue-200/90 rounded-xl shadow-2xs text-center overflow-x-auto text-slate-900"
            >
              <KatexRenderer latex={latex} displayMode={true} />
            </div>
          );
        }

        // 3. Numbered list block (lines starting with 1. , 2. )
        if (/^\d+\.\s+\*\*/.test(block) || /^\d+\.\s+/.test(block)) {
          const lines = block.split('\n');
          return (
            <div key={idx} className="space-y-2.5 my-3">
              {lines.map((line, lIdx) => {
                const match = line.match(/^(\d+)\.\s+(.*)/);
                if (match) {
                  return (
                    <div
                      key={lIdx}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50/90 border border-slate-200 shadow-2xs text-xs sm:text-sm"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#005689] text-white flex items-center justify-center text-[10px] font-bold shrink-0 font-mono mt-0.5">
                        {match[1]}
                      </span>
                      <div className="text-slate-700 leading-relaxed flex-1">
                        {renderInlineMathAndBold(match[2])}
                      </div>
                    </div>
                  );
                }
                return <p key={lIdx}>{renderInlineMathAndBold(line)}</p>;
              })}
            </div>
          );
        }

        // 4. Bullet list block (lines starting with • or -)
        if (block.startsWith('•') || block.startsWith('-')) {
          const lines = block.split('\n');
          return (
            <ul key={idx} className="space-y-1.5 my-2 pl-1">
              {lines.map((l, lIdx) => (
                <li key={lIdx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                  <span className="text-[#005689] font-bold mt-0.5">•</span>
                  <span>{renderInlineMathAndBold(l.replace(/^[•-]\s*/, ''))}</span>
                </li>
              ))}
            </ul>
          );
        }

        // 5. Regular paragraph
        return (
          <p key={idx} className="leading-relaxed">
            {renderInlineMathAndBold(block)}
          </p>
        );
      })}
    </div>
  );
}

// Recursive Application Subsection Component (Supports Arbitrary Nesting Depth)
const ApplicationSubsectionCard: React.FC<{
  item: ApplicationSubItem;
  level?: number;
  onPreviewImage: (img: { url: string; title: string; spec?: string }) => void;
}> = ({ item, level = 0, onPreviewImage }) => {
  return (
    <div
      className={`rounded-2xl border transition-all text-left overflow-hidden ${
        level === 0
          ? 'p-5 sm:p-6 bg-white border-slate-200/90 shadow-2xs space-y-4'
          : level === 1
          ? 'p-4 sm:p-5 bg-slate-50/70 border-slate-200 space-y-3'
          : 'p-3.5 bg-white border-slate-200 space-y-2.5'
      }`}
    >
      <div className="flex flex-col sm:flex-row gap-5 items-start">
        {item.image && (
          <div className="w-full sm:w-44 md:w-52 shrink-0 space-y-1.5">
            <div
              onClick={() => onPreviewImage({ url: item.image!, title: item.title, spec: item.imageCaption })}
              className="aspect-16/10 rounded-xl overflow-hidden border border-slate-200 bg-slate-950 cursor-zoom-in group relative shadow-2xs"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-bold gap-1 backdrop-blur-2xs">
                <ZoomIn className="w-3.5 h-3.5" />
                <span>Zoom Photo</span>
              </div>
            </div>
            {item.imageCaption && (
              <p className="text-[11px] font-mono text-slate-500 text-center leading-snug">{item.imageCaption}</p>
            )}
          </div>
        )}

        <div className="flex-1 space-y-2 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4
              className={`font-serif font-bold text-slate-900 ${
                level === 0 ? 'text-lg sm:text-xl' : level === 1 ? 'text-base sm:text-lg text-[#005689]' : 'text-sm font-semibold'
              }`}
            >
              {item.title}
            </h4>
            {item.externalLink && (
              <a
                href={item.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#005689] hover:underline"
              >
                <span>{item.linkText || 'Research Documentation'}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {item.content}
          </p>
        </div>
      </div>

      {/* Recursive Nested Subsections */}
      {item.subsections && item.subsections.length > 0 && (
        <div className="pt-3 pl-0 sm:pl-4 border-t sm:border-t-0 sm:border-l-2 border-slate-200 space-y-3">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
            Sub-Disciplines &amp; Specialized Technologies
          </span>
          <div className="space-y-3">
            {item.subsections.map((sub) => (
              <ApplicationSubsectionCard
                key={sub.id}
                item={sub}
                level={level + 1}
                onPreviewImage={onPreviewImage}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const SinglePageDocumentView: React.FC<SinglePageDocumentViewProps> = ({
  experiment,
  onEdit,
  isStandalone = false,
  relatedActivities,
}) => {
  const [sliderIndex, setSliderIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string; spec?: string } | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex((prev) => (prev === idx ? null : idx));
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      const expSlug =
        experiment.slug ||
        experiment.title
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .trim()
          .replace(/[\s_-]+/g, '-');
      const shareUrl = `${window.location.origin}/experiments/${expSlug}`;
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Extract typed sections
  const theorySection = experiment.sections.find((s) => s.type === 'theory') as TheorySectionBlock | undefined;
  const historySection = experiment.sections.find((s) => s.type === 'history') as HistorySectionBlock | undefined;
  const materialsSection = experiment.sections.find((s) => s.type === 'materials') as MaterialsSectionBlock | undefined;
  const setupSection = experiment.sections.find((s) => s.type === 'setup') as SetupSectionBlock | undefined;
  const precautionsSection = experiment.sections.find((s) => s.type === 'precautions') as PrecautionsSectionBlock | undefined;
  const procedureSection = experiment.sections.find((s) => s.type === 'procedure') as ProcedureSectionBlock | undefined;
  const observationSection = experiment.sections.find((s) => s.type === 'observation') as ObservationSectionBlock | undefined;
  const formulaSection = experiment.sections.find((s) => s.type === 'math_formula') as MathFormulaSectionBlock | undefined;
  const applicationsSection = experiment.sections.find((s) => s.type === 'applications') as ApplicationsSectionBlock | undefined;
  const videoSection = experiment.sections.find((s) => s.type === 'video') as VideoSectionBlock | undefined;
  const gallerySection = experiment.sections.find((s) => s.type === 'gallery') as GallerySectionBlock | undefined;
  const faqSection = experiment.sections.find((s) => s.type === 'faq') as FaqSectionBlock | undefined;
  const customSections = experiment.sections.filter((s) => s.type === 'custom') as CustomSectionBlock[];

  const faqs = faqSection?.faqs?.length ? faqSection.faqs : DEFAULT_FAQS;

  // Split theory content: if "### Teaching Goal" exists, put it in the right column under the photo
  const [leftTheoryContent, rightTheoryContent] = useMemo(() => {
    if (!theorySection?.content) return ['', ''];
    const splitToken = '### Teaching Goal';
    if (theorySection.content.includes(splitToken)) {
      const idx = theorySection.content.indexOf(splitToken);
      const left = theorySection.content.slice(0, idx).trim();
      const right = theorySection.content.slice(idx).trim();
      return [left, right];
    }
    return [theorySection.content, ''];
  }, [theorySection?.content]);

  // Resolve related activities for recommendations
  const relatedList = useMemo(() => {
    if (relatedActivities && relatedActivities.length > 0) {
      return relatedActivities.filter((a) => a.id !== experiment.id).slice(0, 4);
    }
    const subData = SUBJECTS_DATA[experiment.subjectSlug as keyof typeof SUBJECTS_DATA];
    if (subData?.activities) {
      return subData.activities
        .filter(
          (a) =>
            a.id !== experiment.id &&
            slugifyExperimentTitle(a.title) !== slugifyExperimentTitle(experiment.title)
        )
        .slice(0, 4);
    }
    return [];
  }, [relatedActivities, experiment]);

  return (
    <div className="single-page-experiment-experience w-full bg-white font-sans antialiased text-slate-800">
      
      {/* ═════════════════════════════════════════════════════════════════
          1. CINEMATIC RESEARCH LAB HERO BANNER
         ═════════════════════════════════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden bg-slate-950 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-85 scale-105 transition-transform duration-1000"
          style={{
            backgroundImage: `url('${experiment.heroImage || '/images/experiments/red-chemiluminescence.jpg'}')`,
          }}
        />
        {/* Soft cinematic vignette overlay allowing the background laboratory image to be clearly visible */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/45 to-slate-950/35" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-8 py-20 sm:py-28 lg:py-32 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-950/70 backdrop-blur-md border border-white/25 text-xs font-mono tracking-widest uppercase text-cyan-300 shadow-md">
            <span>CSEEL RESEARCH ARCHIVES</span>
            <span>•</span>
            <span className="truncate max-w-[280px] sm:max-w-[450px]">{experiment.title}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-[56px] font-bold text-white tracking-tight leading-[1.15] max-w-4xl mx-auto drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
            {experiment.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-100 font-medium leading-relaxed max-w-3xl mx-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
            {experiment.subtitle ? (
              <span>{experiment.subtitle}</span>
            ) : (
              "Our research lab is dedicated to advancing empirical knowledge and experimental inquiry through structured scientific methodology."
            )}
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3 print:hidden">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-slate-950 hover:bg-slate-100 text-xs sm:text-sm font-bold shadow-md transition-all active:scale-98 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#005689]" />
              <span>Print Lab Manual</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/20 text-xs sm:text-sm font-bold backdrop-blur-md transition-all active:scale-98 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>{copiedLink ? 'Link Copied!' : 'Share Protocol'}</span>
            </button>

            {onEdit && (
              <button
                type="button"
                onClick={onEdit}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#005689]/80 hover:bg-[#005689] text-white border border-cyan-400/40 text-xs sm:text-sm font-bold backdrop-blur-md transition-all cursor-pointer"
              >
                <span>Edit in Studio</span>
              </button>
            )}
          </div>

          <div className="pt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5 text-cyan-200">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{experiment.gradeLevel}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5" />
              <span>{experiment.duration}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-amber-300">
              <Shield className="w-3.5 h-3.5" />
              <span>{experiment.safetyLevel}</span>
            </span>
            <span>•</span>
            <span className="text-slate-300">Curriculum: NEP 2020 • CBSE • ICSE</span>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════
          2. EXPERIMENT CONCEPT & THEORY (2-Column Grid Aligned from Top)
         ═════════════════════════════════════════════════════════════════ */}
      <section id="concept" className="py-8 sm:py-12 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Title, Subtitle, Quote & Theory Content */}
            <div className="lg:col-span-7 space-y-4 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 text-[#005689] text-xs font-mono font-bold tracking-wider uppercase border border-blue-200">
                <span>EXPERIMENT CONCEPT &amp; THEORY</span>
                <span>•</span>
                <span>{experiment.category}</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
                {experiment.title}
              </h2>

              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Fundamental scientific principles, chemical reaction mechanisms, and quantum energy transitions governing this empirical investigation.
              </p>

              {experiment.subtitle && (
                <blockquote className="font-serif italic text-slate-700 border-l-4 border-[#005689] pl-3.5 py-2 bg-slate-50 rounded-r-xl text-xs sm:text-sm leading-relaxed shadow-2xs">
                  “{experiment.subtitle}”
                </blockquote>
              )}

              {leftTheoryContent ? (
                renderRichContent(leftTheoryContent)
              ) : (
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  This empirical laboratory investigation explores the foundational chemical and physical mechanisms of electronic excitation, molecular collisions, and observable radiative energy dissipation under controlled darkroom conditions.
                </p>
              )}

              {formulaSection && formulaSection.formulas && formulaSection.formulas.length > 0 && (
                <div className="pt-2 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <Atom className="w-4 h-4 text-[#005689]" />
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                      Governing Chemical &amp; Quantum Formulations
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    {formulaSection.formulas.map((form) => (
                      <div
                        key={form.id}
                        className="p-3.5 sm:p-4 bg-slate-50/80 border border-slate-200/90 rounded-xl space-y-1.5 shadow-2xs"
                      >
                        <div className="text-xs font-bold text-[#005689] font-mono tracking-wide">
                          {form.label}
                        </div>
                        <div className="py-1 text-slate-900 overflow-x-auto text-xs sm:text-sm">
                          <KatexRenderer latex={form.latex} displayMode={true} />
                        </div>
                        {form.explanation && (
                          <p className="text-[11px] text-slate-500 italic pt-0.5">{form.explanation}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Top-Aligned Photograph + Right Column Content filling empty space */}
            <div className="lg:col-span-5 space-y-4 text-left self-start">
              <div className="space-y-2">
                <div
                  onClick={() => setPreviewImage({ url: experiment.heroImage || '/images/experiments/red-chemiluminescence.jpg', title: experiment.title, spec: 'Observation of 634 nm crimson chemiluminescence' })}
                  className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 shadow-xs cursor-zoom-in group relative"
                >
                  <img
                    src={experiment.heroImage || '/images/experiments/red-chemiluminescence.jpg'}
                    alt={experiment.title}
                    className="w-full aspect-[4/3] object-cover max-h-[300px] group-hover:scale-103 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>Click to expand</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 font-mono text-center pt-0.5 tracking-wide">
                  Fig-1: Experiment setup &amp; observation
                </p>
              </div>

              {/* Text filling the empty space under the image */}
              {rightTheoryContent && (
                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
                  {renderRichContent(rightTheoryContent)}
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════
          3. HISTORICAL DISCOVERY & SCIENTIFIC GENESIS SECTION
         ═════════════════════════════════════════════════════════════════ */}
      {historySection && (
        <section id="history" className="py-8 sm:py-12 border-b border-slate-200 bg-slate-50/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
            
            <div className="mb-6 space-y-2 text-left">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#005689] uppercase tracking-wider">
                <History className="w-4 h-4" />
                <span>HISTORICAL GENESIS • DISCOVERY CHRONOLOGY</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">
                {historySection.title || 'Historical Discovery & Scientific Genesis'}
              </h2>
              {historySection.discoveredBy && (
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-600 font-medium">
                  <span>Discovered &amp; Proven By:</span>
                  <span className="font-mono font-bold text-slate-900 bg-white px-2.5 py-0.5 rounded border border-slate-200 shadow-2xs">
                    {historySection.discoveredBy}
                  </span>
                  {historySection.discoveryYear && (
                    <span className="font-mono text-[#005689] font-bold bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                      Era: {historySection.discoveryYear}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
              
              {/* Left Column: Detailed Historical Narrative */}
              <div className="lg:col-span-7 space-y-4 text-left">
                {historySection.summary && (
                  <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 text-xs sm:text-sm text-blue-950 leading-relaxed font-medium">
                    📖 <strong className="text-[#005689]">Historical Context:</strong> {historySection.summary}
                  </div>
                )}

                <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 whitespace-pre-line">
                  {historySection.narrative}
                </div>
              </div>

              {/* Right Column: Historical Illustration & Milestones Timeline */}
              <div className="lg:col-span-5 space-y-4 text-left">
                {historySection.image && (
                  <div className="space-y-1.5">
                    <div
                      onClick={() => setPreviewImage({ url: historySection.image!, title: 'Historical Discovery Apparatus', spec: historySection.imageCaption })}
                      className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 aspect-16/10 cursor-zoom-in group relative shadow-2xs"
                    >
                      <img
                        src={historySection.image}
                        alt="Historical Discovery"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                        <ZoomIn className="w-3.5 h-3.5" />
                        <span>Enlarge Schematic</span>
                      </div>
                    </div>
                    {historySection.imageCaption && (
                      <p className="text-[11px] font-mono text-slate-500 text-center">{historySection.imageCaption}</p>
                    )}
                  </div>
                )}

                {/* Milestone Timeline Cards */}
                {historySection.milestones && historySection.milestones.length > 0 && (
                  <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-700 block border-b border-slate-100 pb-1.5">
                      Chronological Scientific Milestones
                    </span>
                    <div className="space-y-2.5">
                      {historySection.milestones.map((m, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs">
                          <span className="font-mono font-bold text-[#005689] bg-blue-50 px-2 py-0.5 rounded border border-blue-200 shrink-0 mt-0.5">
                            {m.year}
                          </span>
                          <div className="space-y-0.5">
                            <strong className="text-slate-900 block font-semibold">
                              {m.scientist} — {m.title}
                            </strong>
                            <p className="text-slate-600 text-[11px] leading-snug">{m.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>
        </section>
      )}

      {/* ═════════════════════════════════════════════════════════════════
          4. MATERIALS USED (COMPACT IMAGES WITH CLICK-TO-PREVIEW)
         ═════════════════════════════════════════════════════════════════ */}
      {materialsSection && (
        <section id="materials" className="py-8 sm:py-12 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
            
            <div className="mb-6 space-y-2 text-left">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#005689] uppercase tracking-wider">
                <Package className="w-4 h-4" />
                <span>SECTION II • APPARATUS &amp; REAGENTS</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">
                {materialsSection.title || 'Materials Used in this Experiment'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Analytical-grade chemical reagents, laboratory glassware, and precision measurement equipment required. Click on any item image to preview full-size.
              </p>
            </div>

            {/* Materials Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-2xs bg-white">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-900 font-bold">
                    <th className="p-3 w-10 text-center border-r border-slate-200 font-mono">#</th>
                    <th className="p-3 border-r border-slate-200">Item / Reagent Name</th>
                    {materialsSection.columns.some((c) => c.key === 'buyLink') && (
                      <th className="p-3 border-r border-slate-200">Procurement Source</th>
                    )}
                    <th className="p-3 border-r border-slate-200">Quantity Required</th>
                    <th className="p-3">Specification / Purity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {materialsSection.rows.map((row, idx) => (
                    <tr key={row.id || idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3 text-center text-slate-400 font-mono text-xs border-r border-slate-200">
                        {idx + 1}
                      </td>
                      <td className="p-3 border-r border-slate-200 font-medium text-slate-900">
                        <div className="flex items-center gap-2.5">
                          {row.image ? (
                            <button
                              type="button"
                              onClick={() => setPreviewImage({ url: row.image!, title: row.name, spec: row.spec })}
                              title="Click to view product image"
                              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-slate-200 overflow-hidden shrink-0 cursor-zoom-in hover:ring-2 hover:ring-[#005689] hover:scale-105 transition-all shadow-2xs relative group"
                            >
                              <img
                                src={row.image}
                                alt={row.name}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Eye className="w-3 h-3 text-white" />
                              </div>
                            </button>
                          ) : (
                            <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 text-[10px] shrink-0">
                              ⚗️
                            </div>
                          )}
                          <span className="leading-snug">{row.name}</span>
                        </div>
                      </td>
                      {materialsSection.columns.some((c) => c.key === 'buyLink') && (
                        <td className="p-3 border-r border-slate-200 text-slate-700">
                          {row.buyLink ? (
                            <a
                              href={row.buyLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[#005689] hover:underline font-semibold"
                            >
                              <span>Supplier Catalog</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-slate-400 italic text-xs">Standard Lab Supply</span>
                          )}
                        </td>
                      )}
                      <td className="p-3 border-r border-slate-200 text-slate-700 font-mono text-xs">
                        {row.quantity || '1 Unit'}
                      </td>
                      <td className="p-3 text-slate-700 text-xs">
                        {row.spec || 'Standard Grade'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </section>
      )}

      {/* ═════════════════════════════════════════════════════════════════
          4.5 EXPERIMENT SETUP & SCHEMATIC DIAGRAM
         ═════════════════════════════════════════════════════════════════ */}
      {setupSection && (
        <section id="setup" className="py-8 sm:py-12 border-b border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
            
            <div className="mb-6 space-y-2 text-left">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#005689] uppercase tracking-wider">
                <Layers className="w-4 h-4" />
                <span>SECTION III • EXPERIMENTAL APPARATUS &amp; ASSEMBLY SETUP</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">
                {setupSection.title || 'Experimental Apparatus Setup & Schematic'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                {setupSection.description || 'Apparatus configuration, powder layering hierarchy, and ignition fuse placement. Click diagram to expand.'}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              
              {/* Left Column: Schematic Diagram with Lightbox */}
              <div className="lg:col-span-6 space-y-2.5">
                <div
                  onClick={() =>
                    setPreviewImage({
                      url: setupSection.diagramImage,
                      title: setupSection.title || 'Experimental Setup Diagram',
                      spec: setupSection.diagramCaption || 'Apparatus & Layering Assembly'
                    })
                  }
                  className="rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden cursor-zoom-in group relative shadow-2xs transition-all hover:border-[#005689]/40 flex items-center justify-center p-2 sm:p-4"
                >
                  <img
                    src={setupSection.diagramImage}
                    alt={setupSection.diagramCaption || 'Experiment Setup'}
                    className="w-full max-h-[460px] object-contain rounded-xl group-hover:scale-[1.01] transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5 backdrop-blur-2xs rounded-2xl">
                    <ZoomIn className="w-4 h-4" />
                    <span>Click to Zoom Schematic</span>
                  </div>
                </div>
                {setupSection.diagramCaption && (
                  <p className="text-xs font-mono text-slate-500 text-center leading-snug">
                    {setupSection.diagramCaption}
                  </p>
                )}
              </div>

              {/* Right Column: Setup Steps & Structural Callouts */}
              <div className="lg:col-span-6 space-y-4">
                {setupSection.setupInstructions && setupSection.setupInstructions.length > 0 && (
                  <div className="p-5 sm:p-6 bg-slate-50/80 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4 text-left">
                    <h3 className="font-serif font-bold text-base sm:text-lg text-slate-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#005689]" />
                      <span>Apparatus Preparation &amp; Layering Hierarchy</span>
                    </h3>
                    <ol className="space-y-3">
                      {setupSection.setupInstructions.map((instruction, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
                          <span className="w-6 h-6 rounded-full bg-[#005689] text-white flex items-center justify-center text-xs font-bold shrink-0 font-mono">
                            {idx + 1}
                          </span>
                          <span className="pt-0.5">{instruction}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {setupSection.annotations && setupSection.annotations.length > 0 && (
                  <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3 text-left">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
                      Key Structural Components &amp; Roles
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {setupSection.annotations.map((ann, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                          <strong className="text-slate-900 block font-semibold mb-0.5">{ann.label}</strong>
                          <span className="text-slate-600 text-[11px] leading-snug">{ann.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>
        </section>
      )}

      {/* ═════════════════════════════════════════════════════════════════
          5. PROCEDURE (COMPACT WITH IN-SITU SAFETY & EXPECTED RESULTS)
         ═════════════════════════════════════════════════════════════════ */}
      {procedureSection && procedureSection.steps && procedureSection.steps.length > 0 && (
        <section id="procedure" className="py-8 sm:py-12 border-b border-slate-200 bg-slate-50/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
            
            <div className="mb-6 space-y-2 text-left">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#005689] uppercase tracking-wider">
                <FileCheck className="w-4 h-4" />
                <span>SECTION III • PRACTICAL PROTOCOL</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">
                {procedureSection.title || 'Step-by-Step Experimental Procedure'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Sequential real-world laboratory workflow. Each step includes its mandatory in-situ safety precaution and immediate intermediate observation.
              </p>
            </div>

            {/* Compact 2-Column Responsive Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {procedureSection.steps.map((st, idx) => (
                <div
                  key={st.id || idx}
                  className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs hover:border-[#005689]/40 transition-all flex flex-col justify-between space-y-2.5 text-left"
                >
                  <div className="space-y-2.5">
                    {/* Header: Step Number, Title & Duration */}
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-6 h-6 rounded-md bg-[#005689] text-white text-[11px] font-mono font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <h4 className="font-serif text-sm sm:text-base font-bold text-slate-900 truncate">
                          {st.title || `Step ${idx + 1}`}
                        </h4>
                      </div>
                      {st.duration && (
                        <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 shrink-0">
                          ⏱ {st.duration}
                        </span>
                      )}
                    </div>

                    {/* Instruction Text */}
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {st.instruction}
                    </p>

                    {/* In-situ Safety Precaution (Small font, light amber color) */}
                    {st.safety && (
                      <div className="flex items-start gap-1.5 p-2 rounded-lg bg-amber-50/70 border border-amber-200/70 text-[11px] text-amber-900 leading-relaxed font-normal">
                        <Shield className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="font-semibold text-amber-800">Safety: </strong>
                          <span>{st.safety}</span>
                        </div>
                      </div>
                    )}

                    {/* In-situ Expected Observation / Result (Small font, light emerald color) */}
                    {st.expectedResult && (
                      <div className="flex items-start gap-1.5 p-2 rounded-lg bg-emerald-50/70 border border-emerald-200/70 text-[11px] text-emerald-950 leading-relaxed font-normal">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="font-semibold text-emerald-800">Observed Result: </strong>
                          <span>{st.expectedResult}</span>
                        </div>
                      </div>
                    )}

                    {/* Technical Tip */}
                    {st.tip && (
                      <div className="p-2 rounded-lg bg-blue-50/60 border border-blue-100/70 text-[11px] text-blue-900 leading-relaxed font-normal">
                        💡 <strong className="text-[#005689] font-semibold">Tip:</strong> {st.tip}
                      </div>
                    )}
                  </div>

                  {/* Optional Step Image Thumbnail */}
                  {st.image && (
                    <div className="pt-1">
                      <img
                        src={st.image}
                        alt={st.title || `Step ${idx + 1}`}
                        className="h-24 w-full rounded-xl border border-slate-200 object-cover cursor-zoom-in"
                        onClick={() => setPreviewImage({ url: st.image!, title: st.title || `Step ${idx + 1}` })}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* ═════════════════════════════════════════════════════════════════
          6. OBSERVATION & DATA RECORDING
         ═════════════════════════════════════════════════════════════════ */}
      <section id="observation" className="py-8 sm:py-12 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          
          <div className="mb-6 space-y-2 text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#005689] uppercase tracking-wider">
              <Table className="w-4 h-4" />
              <span>SECTION IV • OBSERVATION &amp; RESULTS</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">
              {observationSection?.title || 'Observation & Quantitative Data Recording'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Empirical data matrix, measured spectral values, and comparative laboratory observations across repeated trials.
            </p>
          </div>

          {/* Observation Table */}
          {observationSection && observationSection.rows && observationSection.rows.length > 0 && (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-2xs bg-white mb-6">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-900 font-bold">
                    <th className="p-3 w-10 text-center border-r border-slate-200 font-mono">#</th>
                    {observationSection.columns.map((col) => (
                      <th key={col.id} className="p-3 border-r border-slate-200 last:border-r-0">
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {observationSection.rows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3 text-center text-slate-400 font-mono text-xs border-r border-slate-200">
                        {idx + 1}
                      </td>
                      {observationSection.columns.map((col) => (
                        <td
                          key={col.id}
                          className="p-3 border-r border-slate-200 last:border-r-0 text-slate-700 font-mono text-xs"
                        >
                          {row[col.key] || '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Scientific Inference / Conclusion */}
          {observationSection?.inference && (
            <div className="p-4 sm:p-5 bg-emerald-50/80 border border-emerald-200 rounded-2xl text-xs sm:text-sm text-emerald-950 flex items-start gap-3 text-left">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="font-bold text-emerald-900 block font-serif">
                  Scientific Inference &amp; Deductive Conclusion:
                </strong>
                <p className="leading-relaxed text-slate-700">{observationSection.inference}</p>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════
          7. SAFETY PROTOCOL & BIOSAFETY
         ═════════════════════════════════════════════════════════════════ */}
      {precautionsSection && (
        <section id="safety" className="py-8 sm:py-12 border-b border-slate-200 bg-slate-50/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
            
            <div className="mb-6 space-y-2 text-left">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-rose-600 uppercase tracking-wider">
                <Shield className="w-4 h-4" />
                <span>SECTION V • BIOSAFETY &amp; RISK MITIGATION</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">
                {precautionsSection.title || 'Laboratory Safety Protocol & Precautionary Rules'}
              </h2>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs text-slate-600">Designated Biosafety Level:</span>
                <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded font-mono font-bold text-xs">
                  {precautionsSection.safetyLevel || experiment.safetyLevel}
                </span>
              </div>
            </div>

            {/* PPE Required Badges */}
            {precautionsSection.ppeRequired && precautionsSection.ppeRequired.length > 0 && (
              <div className="mb-5 p-3.5 sm:p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2 text-left">
                <span className="text-xs font-bold text-slate-700 block uppercase tracking-wider font-mono">
                  Mandatory Personal Protective Equipment (PPE):
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {precautionsSection.ppeRequired.map((ppe, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-semibold border border-slate-200"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{ppe}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Warning Advisories */}
            {precautionsSection.warnings && precautionsSection.warnings.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                {precautionsSection.warnings.map((warn) => (
                  <div
                    key={warn.id}
                    className={`p-4 rounded-2xl border text-xs sm:text-sm space-y-1.5 ${
                      warn.type === 'danger'
                        ? 'bg-rose-50/80 border-rose-200 text-rose-950'
                        : warn.type === 'caution'
                        ? 'bg-amber-50/80 border-amber-200 text-amber-950'
                        : warn.type === 'disposal'
                        ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                        : 'bg-blue-50/80 border-blue-200 text-blue-950'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1.5">
                      {warn.type === 'danger' && <AlertOctagon className="w-4 h-4 text-rose-600" />}
                      {warn.type === 'caution' && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                      {warn.type === 'disposal' && <Recycle className="w-4 h-4 text-emerald-600" />}
                      {warn.type === 'info' && <Info className="w-4 h-4 text-blue-600" />}
                      <span>{warn.title}</span>
                    </div>
                    <p className="leading-relaxed opacity-90">{warn.text}</p>
                  </div>
                ))}
              </div>
            )}

          </div>
        </section>
      )}

      {/* ═════════════════════════════════════════════════════════════════
          8. REAL-WORLD APPLICATIONS (WITH NESTED SUBSECTIONS & EXTERNAL LINKS)
         ═════════════════════════════════════════════════════════════════ */}
      {applicationsSection && applicationsSection.applications && applicationsSection.applications.length > 0 && (
        <section id="applications" className="py-8 sm:py-12 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 text-left">
            
            <div className="mb-6 space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#005689] uppercase tracking-wider">
                <Layers className="w-4 h-4" />
                <span>SECTION VI • TRANSLATIONAL TECHNOLOGIES</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">
                {applicationsSection.title || 'Real-World Applications & Translational Technologies'}
              </h2>
              {applicationsSection.description && (
                <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
                  {applicationsSection.description}
                </p>
              )}
            </div>

            {/* List of Applications with Recursive Nested Subsections */}
            <div className="space-y-5">
              {applicationsSection.applications.map((app) => (
                <ApplicationSubsectionCard
                  key={app.id}
                  item={app}
                  level={0}
                  onPreviewImage={setPreviewImage}
                />
              ))}
            </div>

          </div>
        </section>
      )}

      {/* ═════════════════════════════════════════════════════════════════
          9. VIDEO DEMONSTRATION & VISUAL ATLAS (IF CONFIGURED)
         ═════════════════════════════════════════════════════════════════ */}
      {videoSection && videoSection.videoUrl && (
        <section className="py-8 sm:py-12 border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-8 space-y-5 text-left">
            <div className="space-y-1.5">
              <span className="text-xs font-mono font-bold text-[#005689] uppercase tracking-wider block">
                VIDEO DEMONSTRATION
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
                {videoSection.title}
              </h2>
            </div>
            
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 shadow-md">
              {getYouTubeEmbedUrl(videoSection.videoUrl) ? (
                <iframe
                  src={getYouTubeEmbedUrl(videoSection.videoUrl)!}
                  title={videoSection.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video src={videoSection.videoUrl} controls className="w-full h-full object-contain" />
              )}
            </div>
            {videoSection.caption && (
              <p className="text-xs text-slate-500 italic text-center">{videoSection.caption}</p>
            )}
          </div>
        </section>
      )}

      {gallerySection && gallerySection.images && gallerySection.images.length > 0 && (
        <section className="py-8 sm:py-12 border-b border-slate-200 bg-slate-50/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 space-y-5 text-left">
            <div className="space-y-1.5">
              <span className="text-xs font-mono font-bold text-[#005689] uppercase tracking-wider block">
                VISUAL ATLAS
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
                {gallerySection.title}
              </h2>
            </div>

            {gallerySection.displayMode === 'slider' ? (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900">
                <div className="aspect-16/9 w-full">
                  <img
                    src={gallerySection.images[sliderIndex]?.url}
                    alt={gallerySection.images[sliderIndex]?.title || 'Atlas photo'}
                    className="w-full h-full object-contain cursor-zoom-in"
                    onClick={() => setPreviewImage({ url: gallerySection.images[sliderIndex]?.url, title: gallerySection.images[sliderIndex]?.title || 'Visual Atlas Image' })}
                  />
                </div>
                {gallerySection.images.length > 1 && (
                  <div className="absolute inset-0 flex items-center justify-between p-4 pointer-events-none">
                    <button
                      type="button"
                      onClick={() =>
                        setSliderIndex((prev) =>
                          prev === 0 ? gallerySection.images.length - 1 : prev - 1
                        )
                      }
                      className="pointer-events-auto p-2.5 rounded-full bg-black/60 text-white hover:bg-black transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setSliderIndex((prev) =>
                          prev === gallerySection.images.length - 1 ? 0 : prev + 1
                        )
                      }
                      className="pointer-events-auto p-2.5 rounded-full bg-black/60 text-white hover:bg-black transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
                <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                  <span className="font-bold text-slate-800">
                    {gallerySection.images[sliderIndex]?.title}
                  </span>
                  <span>
                    {sliderIndex + 1} / {gallerySection.images.length}
                  </span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {gallerySection.images.map((img) => (
                  <div
                    key={img.id}
                    onClick={() => setPreviewImage({ url: img.url, title: img.title || 'Visual Atlas Image', spec: img.caption })}
                    className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-2xs cursor-zoom-in group"
                  >
                    <div className="aspect-4/3 w-full bg-slate-950 overflow-hidden relative">
                      <img src={img.url} alt={img.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                        <ZoomIn className="w-3.5 h-3.5" />
                        <span>Enlarge</span>
                      </div>
                    </div>
                    {img.title && (
                      <div className="p-3 text-xs text-left">
                        <div className="font-bold text-slate-800">{img.title}</div>
                        {img.caption && <p className="text-slate-500 text-[11px] pt-0.5">{img.caption}</p>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Custom Sections (If Present) ── */}
      {customSections.map((cSec) => {
        const IconComp = ICON_MAP[cSec.icon] || Sparkles;
        return (
          <section key={cSec.id} className="py-8 sm:py-12 border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 text-left space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#EDF5FA] text-[#005689]">
                  <IconComp className="w-4 h-4" />
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 m-0">
                  {cSec.title}
                </h2>
              </div>
              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2.5 whitespace-pre-line">
                {cSec.content}
              </div>
            </div>
          </section>
        );
      })}

      {/* ═════════════════════════════════════════════════════════════════
          10. FREQUENTLY ASKED QUESTIONS (COLLAPSIBLE ACCORDION)
         ═════════════════════════════════════════════════════════════════ */}
      <section id="faq" className="py-8 sm:py-12 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 text-left">
          
          <div className="mb-6 space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#005689] uppercase tracking-wider">
              <HelpCircle className="w-4 h-4" />
              <span>FREQUENTLY ASKED QUESTIONS</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">
              Questions &amp; Laboratory Clarifications
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Click any question below to expand the verified scientific answer and procedural guidance.
            </p>
          </div>

          <div className="max-w-4xl space-y-3">
            {faqs.map((f, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs transition-all"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors cursor-pointer select-none"
                    aria-expanded={isOpen}
                  >
                    <span className="font-serif text-base sm:text-lg font-bold text-slate-900 leading-snug">
                      Q{idx + 1}: {f.q}
                    </span>
                    <span className={`p-1.5 rounded-full bg-slate-100 text-slate-500 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 bg-blue-50 text-[#005689]' : ''}`}>
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 pt-2 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100 bg-slate-50/50 animate-in fade-in duration-200">
                      {f.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════
          11. SIMILAR EXPERIMENTS & RELATED RESEARCH SECTION
         ═════════════════════════════════════════════════════════════════ */}
      {relatedList && relatedList.length > 0 && (
        <section id="related-experiments" className="py-8 sm:py-12 border-b border-slate-200 bg-slate-50/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 text-left">
            
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#005689] uppercase tracking-wider">
                  <Compass className="w-4 h-4" />
                  <span>CONTINUE SCIENTIFIC INQUIRY</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">
                  Similar Experiments &amp; Related Labs
                </h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  Explore complementary experiential laboratory modules in {experiment.subjectName}.
                </p>
              </div>

              <Link
                href={`/subject/${experiment.subjectSlug}`}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#005689] hover:underline"
              >
                <span>View All {experiment.subjectName} Modules</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {relatedList.map((rel) => {
                const relSlug = slugifyExperimentTitle(rel.title);
                return (
                  <Link
                    key={rel.id}
                    href={`/experiments/${relSlug}`}
                    className="group bg-white rounded-2xl border border-slate-200 hover:border-[#005689] hover:shadow-md transition-all flex flex-col justify-between overflow-hidden text-left"
                  >
                    <div>
                      <div className="aspect-16/10 w-full overflow-hidden bg-slate-100 relative">
                        <img
                          src={`/images/categories/${experiment.subjectSlug}.jpg`}
                          alt={rel.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/categories/chemistry.jpg';
                          }}
                        />
                        <div className="absolute top-2 left-2">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-black/65 text-white backdrop-blur-md border border-white/20">
                            {rel.duration}
                          </span>
                        </div>
                      </div>

                      <div className="p-3.5 space-y-1">
                        <span className="text-[10px] font-bold text-[#005689] uppercase tracking-wider block">
                          {rel.category}
                        </span>
                        <h4 className="font-serif text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#005689] transition-colors leading-snug line-clamp-2">
                          {rel.title}
                        </h4>
                        {rel.subtitle && (
                          <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                            {rel.subtitle}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="px-3.5 pb-3.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                      <span>{rel.gradeLevel}</span>
                      <span className="text-[#005689] font-bold inline-flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                        Explore <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>

          </div>
        </section>
      )}

      {/* ═════════════════════════════════════════════════════════════════
          12. ACADEMIC CITATION & JOURNAL SIGNATURE
         ═════════════════════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-8 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-slate-500 font-medium text-left">
        <div>
          <span className="font-bold text-slate-900 block sm:inline">
            Centre for Science Education &amp; Experiential Learning (CSEEL)
          </span>
          <span className="block text-slate-400 text-xs mt-0.5">
            Academic Research &amp; Experiential Laboratory Publication Series • NEP 2020 Benchmark
          </span>
        </div>
        <div className="text-left sm:text-right">
          <span>Official Portal: </span>
          <strong className="text-[#005689]">https://cseel.org</strong>
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════════
          13. IMAGE LIGHTBOX MODAL (FOR MATERIAL & APPLICATION ZOOM)
         ═════════════════════════════════════════════════════════════════ */}
      {previewImage && (
        <div
          className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 text-left my-auto animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="pr-4">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#005689] block">
                  High-Resolution Laboratory Visual
                </span>
                <h3 className="font-serif text-base sm:text-lg font-bold text-slate-900">
                  {previewImage.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="w-8 h-8 rounded-full bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Image Container */}
            <div className="max-h-[65vh] w-full bg-slate-950 flex items-center justify-center p-2 sm:p-4 overflow-hidden">
              <img
                src={previewImage.url}
                alt={previewImage.title}
                className="max-h-[60vh] max-w-full object-contain rounded-xl shadow-lg"
              />
            </div>

            {/* Caption / Specification Footer */}
            {previewImage.spec && (
              <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-100 text-xs text-slate-600 flex items-center justify-between">
                <span><strong>Specification / Description:</strong> {previewImage.spec}</span>
                <button
                  type="button"
                  onClick={() => setPreviewImage(null)}
                  className="px-3 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors cursor-pointer ml-3 shrink-0"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default SinglePageDocumentView;
