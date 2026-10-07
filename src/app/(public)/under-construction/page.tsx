'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Construction,
  Hammer,
  Clock,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Compass,
  Home,
  Mail,
  ShieldCheck,
  ExternalLink,
  Layers,
  Cpu,
  GraduationCap
} from 'lucide-react';

function UnderConstructionContent() {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page') || searchParams.get('module') || '';
  
  // Format readable title from query if present
  const formatTitle = (slug: string) => {
    if (!slug) return '';
    const clean = slug.replace(/^\//, '').split('/').pop() || '';
    return clean
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  const moduleTitle = formatTitle(pageParam);

  return (
    <div className="min-h-[85vh] bg-gradient-to-b from-slate-50 via-white to-sky-50/30 flex flex-col justify-center items-center px-4 py-16 text-slate-800">
      <div className="max-w-2xl w-full mx-auto text-center">
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-900 text-xs md:text-sm font-semibold mb-6 animate-pulse">
          <Construction className="w-4 h-4 text-amber-600" />
          <span>Active Development • NEP 2020 Rollout</span>
        </div>

        {/* Central Graphic / Emblem */}
        <div className="relative w-28 h-28 mx-auto mb-8">
          <div className="absolute inset-0 bg-[#0A4B69]/10 rounded-3xl blur-xl animate-pulse" />
          <div className="relative w-full h-full bg-white rounded-3xl border border-slate-200 shadow-xl flex items-center justify-center p-4">
            <img 
              src="/favicon.svg" 
              alt="CSEEL Directorate Emblem" 
              className="w-16 h-16 object-contain animate-spin-slow"
              style={{ animationDuration: '20s' }}
            />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-amber-500 text-white p-2 rounded-xl shadow-md">
            <Hammer className="w-4 h-4" />
          </div>
        </div>

        {/* Headings */}
        <h1 
          className="text-3xl md:text-5xl font-black tracking-tight mb-4"
          style={{ color: '#0A4B69' }}
        >
          {moduleTitle ? `${moduleTitle}` : 'Page Under Active Construction'}
        </h1>

        <p className="text-base md:text-lg text-slate-600 mb-8 max-w-xl mx-auto leading-relaxed">
          {moduleTitle ? (
            <>
              The curriculum, equipment BOQ, and interactive modules for <strong className="text-slate-900 font-semibold">{moduleTitle}</strong> are currently being curated and benchmarked by our STEM Directorate.
            </>
          ) : (
            'Our academic and engineering team is actively building this experiential module. It will be live very shortly with complete interactive lab simulations and curriculum.'
          )}
        </p>

        {/* Progress Card */}
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 mb-8 text-left shadow-sm">
          <div className="flex items-center justify-between mb-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>Development Milestones</span>
            <span className="text-[#0A4B69]">Phase 2 in Progress</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="text-slate-700">Curriculum & NEP 2020 Pedagogical Mapping</span>
              <span className="ml-auto text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Completed</span>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="text-slate-700">Lab Hardware Specifications & BOQ Norms</span>
              <span className="ml-auto text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Completed</span>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <Clock className="w-4 h-4 text-amber-600 flex-shrink-0 animate-spin-slow" />
              <span className="text-slate-900 font-medium">Interactive 3D Simulation & Student Software</span>
              <span className="ml-auto text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">80% Ready</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0A4B69] text-white font-semibold text-sm hover:bg-[#07364c] transition-all shadow-md hover:shadow-lg"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <Link
            href="/virtual-lab"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-200 text-[#0A4B69] font-semibold text-sm hover:bg-slate-50 transition-all shadow-sm"
          >
            <Compass className="w-4 h-4 text-[#F8A130]" />
            <span>Explore 3D Virtual Labs</span>
          </Link>

          <Link
            href="/composite-lab"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-all shadow-sm"
          >
            <Layers className="w-4 h-4" />
            <span>Composite Science Lab</span>
          </Link>
        </div>

        {/* Assistance Note */}
        <div className="text-xs text-slate-500 flex items-center justify-center gap-4">
          <span>Need institutional assistance or turnkey setup?</span>
          <Link 
            href="/contact-us" 
            className="text-[#0A4B69] font-semibold hover:underline inline-flex items-center gap-1"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Contact Directorate</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function UnderConstructionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0A4B69]" />
      </div>
    }>
      <UnderConstructionContent />
    </Suspense>
  );
}
