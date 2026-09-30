'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Sparkles,
  BookOpen,
  Download,
  Share2,
  Wrench,
  Layers,
  ArrowRight,
  Check,
  Package,
  Printer,
  Compass,
  Lightbulb,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  FlaskConical,
  Atom,
  Dna,
  Calculator,
  Palette,
  Cpu,
  Heart
} from 'lucide-react';
import { SUBJECTS_DATA, findActivityById, ExperimentActivity } from '@/data/subjectActivitiesData';
import { useCart } from '@/contexts/CartContext';
import PrintableLabManual from '@/components/subject/PrintableLabManual';

const CATEGORY_IMAGES: Record<string, string> = {
  chemistry: '/images/categories/chemistry.jpg',
  physics: '/images/categories/physics.jpg',
  biology: '/images/categories/biology.jpg',
  mathematics: '/images/categories/mathematics.jpg',
  art: '/images/categories/art.jpg',
  technology: '/images/categories/technology.jpg',
  engineering: '/images/categories/engineering.jpg',
};

export default function ExperimentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const activityId = params?.id as string;

  const { selectedIds, toggleSelect } = useCart();
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [copiedLink, setCopiedLink] = useState(false);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [shareToastText, setShareToastText] = useState<string | null>(null);
  const horizontalRailRef = useRef<HTMLDivElement>(null);
  const sidebarRailRef = useRef<HTMLDivElement>(null);

  // Load liked experiments from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('cseel_liked_experiments');
      if (stored) setLikedIds(JSON.parse(stored));
    } catch (e) {}
  }, []);

  const toggleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault();
    setLikedIds((prev) => {
      const updated = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      try {
        localStorage.setItem('cseel_liked_experiments', JSON.stringify(updated));
      } catch (err) {}
      return updated;
    });
  };

  const handleShareActivity = async (e: React.MouseEvent, act: ExperimentActivity) => {
    e.stopPropagation();
    e.preventDefault();
    const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/experiments/${act.id}`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${act.title} | CSEEL Experiment Guide`,
          text: act.subtitle || act.description,
          url,
        });
        return;
      } catch (err) {}
    }
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setShareToastText('Link copied to clipboard!');
      setTimeout(() => setShareToastText(null), 3000);
    }
  };

  const scrollRail = (direction: 'left' | 'right', ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      const offset = direction === 'left' ? -300 : 300;
      ref.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // Locate the activity and its parent subject
  const data = useMemo(() => {
    if (!activityId) return null;
    return findActivityById(activityId);
  }, [activityId]);

  if (!data) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-4 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#006fcc] flex items-center justify-center mx-auto">
            <Compass size={28} />
          </div>
          <h2 className="text-xl font-black text-slate-900">Experiment Not Found</h2>
          <p className="text-xs text-slate-500">
            The requested science activity could not be found or has been relocated in the curriculum directory.
          </p>
          <Link
            href="/hands-on-experiments"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#003c6e] text-white font-bold text-xs shadow-md hover:bg-[#002d54] transition-all"
          >
            <ArrowLeft size={14} /> Back to Experiments Hub
          </Link>
        </div>
      </div>
    );
  }

  const { activity, subject } = data;
  const isSelected = selectedIds.includes(activity.id);
  const imageSrc = CATEGORY_IMAGES[subject.slug] || '/images/categories/chemistry.jpg';

  const toggleStep = (idx: number) => {
    setCompletedSteps((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleToggleCart = () => {
    toggleSelect({
      id: activity.id,
      title: activity.title,
      subject: subject.name.replace(' Activities', ''),
      thumbnail_url: imageSrc,
      class: activity.gradeLevel,
    });
  };

  const relatedActivities = subject.activities
    .filter((a) => a.id !== activity.id)
    .slice(0, 3);

  const completionPercent = Math.round((completedSteps.length / activity.steps.length) * 100);

  return (
    <>
      <div className="experiment-page-body min-h-screen bg-[#eef2f6] pb-20 print:hidden">
      
      {/* ─── Breadcrumb & Top Bar ─── */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 overflow-x-auto no-scrollbar whitespace-nowrap">
            <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
            <ChevronRight size={12} className="text-slate-400 shrink-0" />
            <Link href={`/subject/${subject.slug}`} className="hover:text-slate-900 font-semibold transition-colors">
              {subject.name.replace(' Activities', '')}
            </Link>
            <ChevronRight size={12} className="text-slate-400 shrink-0" />
            <span className="text-slate-800 font-bold truncate max-w-[200px] sm:max-w-[360px]">
              {activity.title}
            </span>
          </div>

          <Link
            href={`/subject/${subject.slug}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all shrink-0"
          >
            <ArrowLeft size={13} />
            <span>Back to {subject.name.replace(' Activities', '')}</span>
          </Link>
        </div>
      </div>

      {/* ─── Hero Header ─── */}
      <section className="bg-white border-b border-slate-200/90 py-6 sm:py-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
            
            {/* Left Main Hero Info */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* Badges Row */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-blue-50 text-[#006fcc] border border-blue-200">
                  {activity.category}
                </span>
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  {activity.gradeLevel}
                </span>
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <Clock size={12} /> {activity.duration}
                </span>
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                  {activity.safetyLevel}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                {activity.title}
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
                {activity.subtitle}
              </p>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed pt-1">
                {activity.description}
              </p>

              {/* Concept Tags */}
              {activity.tags && activity.tags.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap pt-2">
                  <span className="text-xs font-bold text-slate-400 mr-1">Concepts:</span>
                  {activity.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#f1f3f4] text-[#3c4043] border border-slate-200 hover:bg-slate-200 transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Action Buttons Bar */}
              <div className="flex flex-wrap items-center gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleToggleCart}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700 ring-2 ring-emerald-600/30'
                      : 'bg-[#003c6e] text-white hover:bg-[#00284d]'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check size={14} strokeWidth={3} /> Selected in My Lab List
                    </>
                  ) : (
                    <>
                      <span>+ Add to My Selections</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer size={14} /> Print Lab Manual
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="px-4 py-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Share2 size={14} /> {copiedLink ? 'Link Copied!' : 'Share'}
                </button>
              </div>

            </div>

            {/* Right Thumbnail & Quick Stats Box */}
            <div className="lg:col-span-4 space-y-4">
              <div className="rounded-3xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm relative">
                <img
                  src={imageSrc}
                  alt={activity.title}
                  className="w-full h-56 sm:h-64 object-cover"
                />
                <div className="p-4 bg-white border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Curriculum:</span>
                    <span className="font-bold text-slate-900">NEP 2020 Hands-on Lab</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Total Steps:</span>
                    <span className="font-bold text-slate-900">{activity.steps.length} Interactive Steps</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Reagents & Tools:</span>
                    <span className="font-bold text-slate-900">{activity.materials.length} Materials</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── Main Content Body (Steps + Science + Materials) ─── */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-8 sm:mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          
          {/* Main Left Column (Steps & Theory) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* 1. Step-by-Step Interactive Guide */}
            <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/90 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#006fcc] flex items-center justify-center font-bold">
                    <Layers size={18} />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900">
                      Step-by-Step Practical Procedure
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      Check off steps as you complete them in the lab
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600">
                    {completedSteps.length}/{activity.steps.length} Done
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                    completionPercent === 100 
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-blue-50 text-[#006fcc] border-blue-200'
                  }`}>
                    {completionPercent}%
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#006fcc] transition-all duration-300 rounded-full"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>

              {/* Steps List */}
              <div className="space-y-3 pt-1">
                {activity.steps.map((step, idx) => {
                  const isDone = completedSteps.includes(idx);
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleStep(idx)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                        isDone
                          ? 'bg-emerald-50/70 border-emerald-300 text-slate-800'
                          : 'bg-white border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 text-slate-900 shadow-2xs'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-black mt-0.5 transition-colors ${
                          isDone ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 border border-slate-300'
                        }`}
                      >
                        {isDone ? <CheckCircle2 size={16} /> : idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                          Step {idx + 1}
                        </span>
                        <p className={`text-xs sm:text-sm leading-relaxed font-medium ${isDone ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                          {step}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Scientific Principle & Core Theory */}
            <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900">
                    Scientific Principle & Theoretical Foundation
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">NEP 2020 Conceptual Clarity</p>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/60 border border-blue-200/70 text-slate-800 leading-relaxed text-xs sm:text-sm">
                <p>{activity.scientificPrinciple}</p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Real-World Industrial & Engineering Applications
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  {activity.realWorldApplication}
                </p>
              </div>
            </div>

            {/* 3. Safety & Lab Environment Protocol */}
            <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                  <ShieldAlert size={18} />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900">
                    Safety & Lab Protocol
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">Essential Precaution Guidelines</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/70 flex items-start gap-3">
                <ShieldAlert className="text-amber-600 shrink-0 mt-0.5" size={20} />
                <div>
                  <h3 className="text-xs font-bold text-amber-900 uppercase">Requirement: {activity.safetyLevel}</h3>
                  <p className="text-xs sm:text-sm text-amber-900/90 mt-1 leading-relaxed">
                    Always wear safety goggles, lab apron/gloves and perform under supervision. In case of spills, neutralize according to MSDS guidelines.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar Right Column (Materials + Physical Kit CTA + Related Activities) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Required Materials Checklist */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Wrench size={16} className="text-[#006fcc]" />
                  <h3 className="text-sm font-black text-slate-900">Required Lab Materials</h3>
                </div>
                <span className="text-[11px] font-bold text-slate-500 px-2 py-0.5 bg-slate-100 rounded-full">
                  {activity.materials.length} Items
                </span>
              </div>

              <div className="space-y-2">
                {activity.materials.map((mat, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center gap-2.5 text-xs text-slate-700 font-medium"
                  >
                    <div className="w-2 h-2 rounded-full bg-[#006fcc] shrink-0" />
                    <span className="truncate">{mat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Physical Kit Card CTA */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-[#0c2340] via-[#123860] to-[#0a467f] text-white space-y-3 shadow-md">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/15 text-white border border-white/20">
                <Package size={11} className="text-amber-300" />
                <span>Projectokart Hardware Lab Kit</span>
              </div>
              <h3 className="text-sm font-black text-white leading-snug">
                Need Physical Reagents & Tools for this Experiment?
              </h3>
              <p className="text-xs text-blue-100/90 leading-relaxed">
                Get the pre-measured chemistry/physics kit delivered to your doorstep with teacher guides.
              </p>
              <Link
                href="/projects"
                className="inline-flex items-center justify-between w-full px-4 py-2.5 rounded-full bg-white text-[#003c6e] font-black text-xs hover:bg-blue-50 transition-all shadow-sm"
              >
                <span>Order DIY Kit on Projectokart</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            {/* Related Experiments in Subject (Horizontal Scroll in Sidebar) */}
            {relatedActivities.length > 0 && (
              <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-black text-slate-900">More in {subject.name.replace(' Activities', '')}</h3>
                    <p className="text-[11px] text-slate-400 font-medium">Scroll to explore</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => scrollRail('left', sidebarRailRef)}
                      aria-label="Scroll Left"
                      className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-all cursor-pointer"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollRail('right', sidebarRailRef)}
                      aria-label="Scroll Right"
                      className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-all cursor-pointer"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>

                {/* Horizontal Scroll Cards Track */}
                <div 
                  ref={sidebarRailRef}
                  className="flex items-stretch gap-3 overflow-x-auto no-scrollbar py-1 snap-x scroll-smooth"
                  style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
                >
                  {relatedActivities.map((rel) => {
                    const isLiked = likedIds.includes(rel.id);
                    return (
                      <div
                        key={rel.id}
                        className="w-[210px] shrink-0 snap-start bg-slate-50/80 hover:bg-white rounded-2xl border border-slate-200/80 hover:border-[#006fcc] hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group select-none"
                      >
                        <Link href={`/experiments/${rel.id}`} className="block">
                          {/* Image Thumbnail */}
                          <div className="w-full h-24 overflow-hidden rounded-t-xl bg-slate-100 relative">
                            <img
                              src={imageSrc}
                              alt={rel.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              loading="lazy"
                            />
                            {/* Duration Badge */}
                            <div className="absolute top-2 left-2">
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-black/60 text-white backdrop-blur-md border border-white/20">
                                {rel.duration}
                              </span>
                            </div>
                            {/* Like Button */}
                            <button
                              type="button"
                              onClick={(e) => toggleLike(e, rel.id)}
                              title={isLiked ? 'Liked' : 'Like experiment'}
                              aria-label="Like experiment"
                              className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center backdrop-blur-md transition-all z-10 cursor-pointer ${
                                isLiked
                                  ? 'bg-rose-500 text-white shadow-xs'
                                  : 'bg-black/40 hover:bg-black/70 text-white/90 border border-white/20'
                              }`}
                            >
                              <Heart size={12} className={isLiked ? 'fill-white' : ''} />
                            </button>
                          </div>

                          {/* Card Content */}
                          <div className="p-2.5 space-y-1">
                            <span className="text-[9.5px] font-medium text-slate-400 block truncate">
                              {rel.category}
                            </span>
                            <h4 className="text-[13px] font-bold text-slate-900 group-hover:text-[#006fcc] transition-colors leading-snug">
                              {rel.title}
                            </h4>
                          </div>
                        </Link>

                        {/* Card Footer */}
                        <div className="px-2.5 pb-2.5 pt-1 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-medium">
                          <span className="truncate">{rel.gradeLevel}</span>
                          <Link
                            href={`/experiments/${rel.id}`}
                            className="text-[#006fcc] font-bold hover:underline flex items-center gap-0.5 shrink-0"
                          >
                            <span>Open</span>
                            <ChevronRight size={11} />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* ─── 4. Full-Width Horizontal Scroll Section: Explore More Subject Labs ─── */}
        {relatedActivities.length > 0 && (
          <section className="mt-12 sm:mt-16 pt-8 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-[#006fcc] border border-blue-100 mb-2">
                  <FlaskConical size={12} />
                  <span>Curriculum Discovery</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  More {subject.name.replace(' Activities', '')} Practicals & Experiments
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                  Handpicked hands-on labs aligned with NEP 2020 curriculum standards
                </p>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <Link
                  href={`/subject/${subject.slug}`}
                  className="px-4 py-2 rounded-full text-xs font-bold text-[#006fcc] bg-blue-50 hover:bg-blue-100/70 border border-blue-200/60 transition-all mr-1"
                >
                  View All ({subject.activities.length})
                </Link>

                <button
                  type="button"
                  onClick={() => scrollRail('left', horizontalRailRef)}
                  aria-label="Previous Experiments"
                  className="w-9 h-9 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center transition-all shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => scrollRail('right', horizontalRailRef)}
                  aria-label="Next Experiments"
                  className="w-9 h-9 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center transition-all shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Full Width Horizontal Track */}
            <div
              ref={horizontalRailRef}
              className="flex items-stretch gap-4 overflow-x-auto no-scrollbar py-2 px-1 snap-x scroll-smooth"
              style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
            >
              {relatedActivities.map((rel) => {
                const isLiked = likedIds.includes(rel.id);
                return (
                  <div
                    key={rel.id}
                    className="w-[270px] sm:w-[295px] shrink-0 snap-start bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between group select-none"
                  >
                    <div>
                      {/* Image Thumbnail */}
                      <div className="w-full h-40 overflow-hidden bg-slate-100 relative">
                        <img
                          src={imageSrc}
                          alt={rel.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        {/* Duration Badge */}
                        <div className="absolute top-2.5 left-2.5">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-black/60 text-white backdrop-blur-md border border-white/20">
                            {rel.duration}
                          </span>
                        </div>

                        {/* Top-Right Action Controls (Like + Share) */}
                        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
                          <button
                            type="button"
                            onClick={(e) => toggleLike(e, rel.id)}
                            title={isLiked ? 'Liked' : 'Like experiment'}
                            aria-label="Like experiment"
                            className={`w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md transition-all cursor-pointer ${
                              isLiked
                                ? 'bg-rose-500 text-white shadow-md'
                                : 'bg-black/40 hover:bg-black/70 text-white/90 border border-white/20'
                            }`}
                          >
                            <Heart size={13} className={isLiked ? 'fill-white' : ''} />
                          </button>

                          <button
                            type="button"
                            onClick={(e) => handleShareActivity(e, rel)}
                            title="Share experiment"
                            aria-label="Share experiment"
                            className="w-7 h-7 rounded-full bg-black/40 hover:bg-black/70 text-white/90 border border-white/20 flex items-center justify-center backdrop-blur-md transition-all cursor-pointer"
                          >
                            <Share2 size={12} />
                          </button>
                        </div>
                      </div>

                      {/* Content Info */}
                      <div className="p-3.5 sm:p-4 space-y-1">
                        <span className="text-[10px] font-medium text-slate-400 block truncate">
                          {rel.category}
                        </span>
                        <Link href={`/experiments/${rel.id}`} className="block">
                          <h3 className="text-[14px] font-bold text-slate-900 group-hover:text-[#006fcc] transition-colors leading-snug">
                            {rel.title}
                          </h3>
                        </Link>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {rel.subtitle || rel.description}
                        </p>

                        {/* Tags */}
                        {rel.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {rel.tags.slice(0, 2).map((t, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600 truncate max-w-[120px]"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-3 sm:p-4 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                        {rel.gradeLevel}
                      </span>
                      <Link
                        href={`/experiments/${rel.id}`}
                        className="inline-flex items-center gap-1 text-xs font-black text-[#006fcc] hover:text-[#004f98] group-hover:translate-x-0.5 transition-transform"
                      >
                        <span>Explore</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>

                  </div>
                );
              })}
            </div>
          </section>
        )}

      </div>

      {/* ─── Floating Toast Notification ─── */}
      {shareToastText && (
        <div className="fixed bottom-6 right-6 z-[1100] bg-slate-900/95 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-2xl border border-slate-700/80 backdrop-blur-md flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Check size={14} className="text-emerald-400 shrink-0" />
          <span>{shareToastText}</span>
        </div>
      )}

      </div>

      {/* ─── Dedicated Clean A4 Printable Lab Manual ─── */}
      <PrintableLabManual activity={activity} subjectName={subject.name} />
    </>
  );
}

