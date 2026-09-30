'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, CheckCircle2, Clock, ShieldAlert, Sparkles, BookOpen, Download, Share2, Wrench, Layers, ArrowRight, ExternalLink, Printer } from 'lucide-react';
import { ExperimentActivity } from '@/data/subjectActivitiesData';
import PrintableLabManual from './PrintableLabManual';

interface Props {
  activity: ExperimentActivity | null;
  onClose: () => void;
  accentColor: string;
}

export default function ExperimentDetailModal({ activity, onClose, accentColor }: Props) {
  const [activeTab, setActiveTab] = useState<'steps' | 'materials' | 'science' | 'safety'>('steps');
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  if (!activity) return null;

  const toggleStep = (index: number) => {
    setCompletedSteps((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const subjectSlug = activity.id.startsWith('chem') ? 'chemistry' :
    activity.id.startsWith('phys') ? 'physics' :
    activity.id.startsWith('bio') ? 'biology' :
    activity.id.startsWith('math') ? 'mathematics' :
    activity.id.startsWith('art') ? 'art' :
    activity.id.startsWith('tech') ? 'technology' : 'engineering';

  return (
    <>
      <div 
        className="fixed inset-0 z-[1000] flex items-center justify-center p-2.5 sm:p-4 md:p-6 overflow-y-auto bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200 box-border print:hidden"
        onClick={onClose}
      >
      <div
        className="relative w-full max-w-3xl bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden text-slate-900 my-auto max-h-[94vh] sm:max-h-[90vh] flex flex-col z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-6 md:p-7 bg-gradient-to-b from-blue-50/80 to-white border-b border-slate-200 relative">
          <div className="absolute top-4 right-4 flex items-center gap-1.5">
            <Link
              href={`/experiments/${activity.id}`}
              onClick={onClose}
              title="Open full page"
              className="p-2 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-[#006fcc] text-slate-600 transition-colors flex items-center gap-1 text-xs font-bold"
            >
              <ExternalLink size={15} />
              <span className="hidden sm:inline">Full Page</span>
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X size={17} />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 mb-2 pr-20 sm:pr-28">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-white border border-slate-300 text-slate-700 shadow-2xs">
              {activity.category}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
              {activity.gradeLevel}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-mono text-[#006fcc] bg-blue-100 border border-blue-300 flex items-center gap-1 font-bold">
              <Clock size={11} /> {activity.duration}
            </span>
          </div>

          <h2 className="text-lg sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-snug pr-8 sm:pr-0">
            {activity.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">{activity.subtitle}</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50/80 px-6 overflow-x-auto">
          {[
            { id: 'steps', label: 'Step-by-Step Guide', icon: Layers },
            { id: 'materials', label: 'Materials Needed', icon: Wrench },
            { id: 'science', label: 'Scientific Principle', icon: BookOpen },
            { id: 'safety', label: 'Safety & Real World', icon: ShieldAlert },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3.5 px-4 text-xs font-bold whitespace-nowrap flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                  isActive
                    ? 'border-[#006fcc] text-[#003c6e] bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon size={14} style={{ color: isActive ? accentColor : undefined }} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6 bg-white">
          {/* TAB 1: STEPS */}
          {activeTab === 'steps' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs text-slate-600 font-semibold">
                <span>Interactive Step Checklist ({completedSteps.length}/{activity.steps.length} completed)</span>
                <span className="font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {Math.round((completedSteps.length / activity.steps.length) * 100)}% Completed
                </span>
              </div>

              <div className="space-y-3">
                {activity.steps.map((step, idx) => {
                  const isDone = completedSteps.includes(idx);
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleStep(idx)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                        isDone
                          ? 'bg-emerald-50/70 border-emerald-300 text-slate-800'
                          : 'bg-white border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-slate-900 shadow-2xs'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold mt-0.5 transition-colors ${
                          isDone ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 border border-slate-300'
                        }`}
                      >
                        {isDone ? <CheckCircle2 size={16} /> : idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className={`text-xs sm:text-sm leading-relaxed font-medium ${isDone ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                          {step}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: MATERIALS */}
          {activeTab === 'materials' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 font-medium">Everything required to conduct this hands-on lab experiment:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activity.materials.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3"
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-[#006fcc] shrink-0" />
                    <span className="text-xs font-semibold text-slate-800">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SCIENCE */}
          {activeTab === 'science' && (
            <div className="space-y-5">
              <div className="p-5 bg-blue-50/80 border border-blue-200 rounded-2xl">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#003c6e] flex items-center gap-1.5 mb-2">
                  <Sparkles size={14} className="text-[#006fcc]" /> Fundamental Scientific Theory
                </h4>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans">
                  {activity.scientificPrinciple}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Curriculum Tags & Concepts</h4>
                <div className="flex flex-wrap gap-2">
                  {activity.tags.map((tag) => (
                    <span key={tag} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SAFETY & REAL WORLD */}
          {activeTab === 'safety' && (
            <div className="space-y-5">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
                <ShieldAlert className="text-amber-600 shrink-0 mt-0.5" size={20} />
                <div>
                  <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wide">Safety Guideline</h4>
                  <p className="text-xs sm:text-sm font-bold text-amber-950 mt-0.5">{activity.safetyLevel}</p>
                  <p className="text-xs text-amber-800 mt-1">
                    Always wear laboratory safety goggles, gloves and adhere to standard science lab hygiene protocols.
                  </p>
                </div>
              </div>

              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Real-World Industry & Research Application
                </h4>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                  {activity.realWorldApplication}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3.5 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={`/experiments/${activity.id}`}
              onClick={onClose}
              className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-[#006fcc] text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <span>Full Page View</span>
              <ExternalLink size={13} />
            </Link>

            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <Download size={13} /> Download PDF / Print
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 bg-[#006fcc] hover:bg-[#005bb8] text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>

    {/* Dedicated A4 Lab Manual for Print & PDF Export */}
    <PrintableLabManual activity={activity} />
  </>
  );
}
