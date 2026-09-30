'use client';

import React from 'react';
import { ExperimentActivity } from '@/data/subjectActivitiesData';

interface PrintableLabManualProps {
  activity: ExperimentActivity;
  subjectName?: string;
}

export default function PrintableLabManual({ activity, subjectName = 'Science' }: PrintableLabManualProps) {
  if (!activity) return null;

  return (
    <div className="printable-lab-manual hidden print:block text-slate-900 bg-white font-sans text-xs leading-normal max-w-[210mm] mx-auto">
      {/* ─── Header: Official CSEEL Emblem & Portal Info ─── */}
      <div className="flex items-center justify-between border-b-2 border-[#003c6e] pb-2.5 mb-3">
        <div className="flex items-center gap-3">
          <img
            src="/favicon-32x32.png"
            alt="CSEEL Official Emblem"
            className="w-10 h-10 object-contain rounded-md border border-slate-200"
          />
          <div>
            <h1 className="text-sm font-black text-[#003c6e] tracking-tight uppercase">
              Centre for Science Education & Experiential Learning
            </h1>
            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">
              CSEEL Hands-On STEM Laboratory Practical Manual • NEP 2020 Aligned
            </p>
          </div>
        </div>

        <div className="text-right text-[10px] text-slate-500 font-mono">
          <div className="font-bold text-[#003c6e]">LAB ID: {activity.id.toUpperCase()}</div>
          <div className="text-slate-600 font-semibold">https://cseel.org</div>
        </div>
      </div>

      {/* ─── Experiment Title & Metadata Card ─── */}
      <div className="bg-slate-50/90 border border-slate-300 rounded-lg p-3 mb-3">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-[11px] font-black text-[#006fcc] uppercase tracking-wide">
            {activity.category}
          </span>
          <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-800">
            <span className="bg-white px-2 py-0.5 rounded border border-slate-300">
              Grade: {activity.gradeLevel}
            </span>
            <span className="bg-white px-2 py-0.5 rounded border border-slate-300">
              Est. Time: {activity.duration}
            </span>
            <span className="bg-white px-2 py-0.5 rounded border border-slate-300">
              Safety: {activity.safetyLevel}
            </span>
          </div>
        </div>

        <h2 className="text-base font-black text-slate-900 leading-tight">
          {activity.title}
        </h2>
        {activity.subtitle && (
          <p className="text-[11px] text-slate-700 mt-0.5 font-medium leading-normal">
            {activity.subtitle}
          </p>
        )}

        {activity.tags && activity.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1 mt-1.5 text-[9px] text-slate-600 font-semibold">
            <span className="font-bold text-slate-700">Concepts:</span>
            {activity.tags.map((tag) => (
              <span key={tag} className="bg-white px-1.5 py-0.5 rounded border border-slate-200">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ─── 1. Required Materials & Glassware ─── */}
      <div className="mb-3">
        <h3 className="text-[11px] font-black uppercase tracking-wider text-[#003c6e] border-b border-slate-300 pb-0.5 mb-1.5 flex items-center justify-between">
          <span>1. Required Reagents, Apparatus & Glassware</span>
          <span className="text-[9px] font-normal text-slate-500">({activity.materials.length} Items)</span>
        </h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] text-slate-800">
          {activity.materials.map((item, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#006fcc] shrink-0" />
              <span className="font-medium">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── 2. Step-by-Step Procedure ─── */}
      <div className="mb-3">
        <h3 className="text-[11px] font-black uppercase tracking-wider text-[#003c6e] border-b border-slate-300 pb-0.5 mb-1.5 flex items-center justify-between">
          <span>2. Standard Laboratory Procedure (Step-by-Step)</span>
          <span className="text-[9px] font-normal text-slate-500">({activity.steps.length} Steps)</span>
        </h3>
        <div className="space-y-1.5 text-[10px] text-slate-900">
          {activity.steps.map((step, idx) => (
            <div key={idx} className="flex items-start gap-2 p-1.5 rounded border border-slate-200 bg-white">
              <div className="w-4 h-4 rounded border border-slate-400 bg-slate-100 flex items-center justify-center shrink-0 text-[9px] font-black text-slate-700 mt-0.5">
                {idx + 1}
              </div>
              <p className="leading-relaxed flex-1 font-medium">{step}</p>
              <div className="w-3.5 h-3.5 border border-slate-300 rounded shrink-0 mt-0.5" title="Check when done" />
            </div>
          ))}
        </div>
      </div>

      {/* ─── 3. Scientific Principle & Core Theory ─── */}
      <div className="mb-3">
        <h3 className="text-[11px] font-black uppercase tracking-wider text-[#003c6e] border-b border-slate-300 pb-0.5 mb-1 flex items-center gap-1">
          <span>3. Scientific Principle & Theoretical Foundation</span>
        </h3>
        <p className="text-[10px] text-slate-800 leading-relaxed bg-blue-50/60 p-2 rounded border border-blue-200/80">
          {activity.scientificPrinciple}
        </p>
      </div>

      {/* ─── 4. Safety Guidelines & Industrial Application ─── */}
      <div className="grid grid-cols-2 gap-2.5 mb-3">
        <div className="p-2 rounded border border-amber-300 bg-amber-50/60">
          <h4 className="text-[9px] font-black uppercase text-amber-900 mb-0.5">Safety & Lab Hygiene Protocol</h4>
          <p className="text-[9px] text-amber-950 leading-relaxed">
            Standard: <strong>{activity.safetyLevel}</strong>. Wear safety goggles & aprons. Wash hands and neutralize reagents as per MSDS.
          </p>
        </div>
        <div className="p-2 rounded border border-slate-300 bg-slate-50/80">
          <h4 className="text-[9px] font-black uppercase text-slate-800 mb-0.5">Real-World Industrial Application</h4>
          <p className="text-[9px] text-slate-700 leading-relaxed">
            {activity.realWorldApplication}
          </p>
        </div>
      </div>

      {/* ─── 5. Student Observation / Measurement Box ─── */}
      <div className="border border-dashed border-slate-400 p-2 rounded bg-white mb-3">
        <div className="flex items-center justify-between text-[9px] font-bold text-slate-700 mb-1">
          <span>Student Lab Observations & Measurement Notes:</span>
          <span>Date: _________________ | Teacher Sign: _________________</span>
        </div>
        <div className="h-9 border-b border-slate-200"></div>
      </div>

      {/* ─── Official Printable Footer (Clear, crisp, no clipping) ─── */}
      <div className="pt-2 border-t-2 border-[#003c6e] flex items-center justify-between text-[9px] text-slate-600 font-medium">
        <div>
          <strong className="text-slate-900">Centre for Science Education & Experiential Learning (CSEEL)</strong>
          <span className="mx-1">•</span>
          <span>Quality Hands-On STEM Curriculum</span>
        </div>
        <div>
          Official Portal: <strong className="text-[#006fcc]">https://cseel.org</strong>
        </div>
      </div>
    </div>
  );
}
