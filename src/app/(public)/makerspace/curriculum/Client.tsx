'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  MAKERSPACE_GRADES, 
  CurriculumGradeItem 
} from '@/data/makerspaceCurriculumGrades';

export default function MakerspaceCurriculumClient() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | number>('all');
  const [activePreviewGrade, setActivePreviewGrade] = useState<CurriculumGradeItem | null>(null);

  const filteredGrades = selectedFilter === 'all' 
    ? MAKERSPACE_GRADES 
    : MAKERSPACE_GRADES.filter(g => g.gradeNumber === selectedFilter);

  const grade1 = MAKERSPACE_GRADES.find(g => g.gradeNumber === 1);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
      {/* 2. HERO SECTION */}
      <div className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 pt-10 pb-12 sm:pt-14 sm:pb-16 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider mb-4 border border-blue-200 dark:border-blue-800">
            <span>✨</span> NEP 2020 Aligned • Progressive STEM Tinkering Framework
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight max-w-4xl">
            Makerspace &amp; STEM Curriculum
          </h1>
          
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
            A comprehensive, standard-wise practical learning curriculum covering <strong className="text-slate-900 dark:text-white">Grades 1 to 8</strong>. Each grade features 30+ interactive engineering chapters, hands-on maker challenges, safe DIY experiments, and design-thinking logs tailored for Indian schools and Atal Tinkering Labs.
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 max-w-3xl">
            <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-2xl font-black text-blue-600 dark:text-blue-400">8 Grades</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Foundational to Middle</div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-2xl font-black text-amber-500">240+ Labs</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Hands-on Experiments</div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-2xl font-black text-emerald-500">NEP 2020</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Experiential Learning</div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-2xl font-black text-purple-500">ATL Ready</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Turnkey Lab Compatible</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. FEATURED GRADE 1 SPOTLIGHT CARD */}
      {grade1 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-1 shadow-xl">
            <div className="relative rounded-[22px] bg-white dark:bg-slate-900 p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="max-w-2xl">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-bold">
                    Grade 1 • 30 Chapters
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium">
                    {grade1.ageGroup}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {grade1.title}
                </h2>
                <p className="text-sm sm:text-base text-orange-600 dark:text-orange-400 font-semibold mt-1">
                  {grade1.subtitle}
                </p>

                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {grade1.description}
                </p>

                <div className="flex flex-wrap gap-2 mt-4">
                  {grade1.highlights.map((h, i) => (
                    <span key={i} className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      ✓ {h}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button to Open Standalone Book Without Header/Footer */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 flex-shrink-0">
                <a
                  href="/makerspace/curriculum/grade-1"
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-base shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all text-center"
                >
                  <span className="text-xl">📖</span>
                  <span>Open Grade-1 Interactive Book</span>
                  <span className="text-lg">→</span>
                </a>
                
                <span className="text-center text-xs text-slate-500 dark:text-slate-400">
                  Full standalone book reader (Zero header/footer distraction)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. GRADE MATRIX & FILTER BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Complete Grade Curriculum Line (Grades 1 – 8)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Select any grade to explore curriculum topics, learning outcomes, and practical modules.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedFilter === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-blue-400'
              }`}
            >
              All Grades (8)
            </button>
            {MAKERSPACE_GRADES.map((g) => (
              <button
                key={g.gradeNumber}
                onClick={() => setSelectedFilter(g.gradeNumber)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                  selectedFilter === g.gradeNumber
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-blue-400'
                }`}
              >
                <span>Grade {g.gradeNumber}</span>
                {g.status === 'active' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 5. GRADES LIST / LINE */}
        <div className="space-y-4">
          {filteredGrades.map((grade) => {
            const isActive = grade.status === 'active';
            return (
              <div
                key={grade.gradeNumber}
                className={`relative rounded-2xl border transition-all duration-200 ${
                  isActive
                    ? 'bg-white dark:bg-slate-900 border-orange-300 dark:border-orange-500/40 shadow-md hover:shadow-lg'
                    : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                } p-5 sm:p-6`}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                  {/* Left: Grade Badge & Core Info */}
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-black flex-shrink-0 shadow-sm ${
                        isActive
                          ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-orange-500/20'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider opacity-90">Grade</span>
                      <span className="text-2xl leading-none">{grade.gradeNumber}</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                          {grade.title}
                        </h3>
                        {isActive ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
                            ● Active &amp; Ready
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[11px] font-semibold">
                            Upcoming Module
                          </span>
                        )}
                        <span className="text-xs text-slate-400 dark:text-slate-500">•</span>
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          {grade.ageGroup}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400">
                        {grade.subtitle}
                      </p>

                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 max-w-3xl">
                        {grade.description}
                      </p>

                      {/* Highlights */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
                        <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase">
                          Topics:
                        </span>
                        {grade.highlights.map((h, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300"
                          >
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: Action Buttons */}
                  <div className="flex items-center gap-2.5 flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                    {isActive ? (
                      <a
                        href={grade.bookUrl || `/makerspace/curriculum/${grade.gradeSlug}`}
                        className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm shadow-md shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-center"
                      >
                        <span>📖 Open Book</span>
                        <span>→</span>
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setActivePreviewGrade(grade)}
                        className="w-full md:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors"
                      >
                        <span>ℹ️</span>
                        <span>Preview Scope</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. MODAL FOR FUTURE GRADE PREVIEW */}
      {activePreviewGrade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs font-bold mb-1">
                  Grade {activePreviewGrade.gradeNumber} Syllabus Scope
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {activePreviewGrade.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {activePreviewGrade.ageGroup} • {activePreviewGrade.chaptersCount || 30} Proposed Chapters
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActivePreviewGrade(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
              {activePreviewGrade.description}
            </p>

            <div className="space-y-2 mb-6">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Key Learning Modules:
              </div>
              <div className="space-y-1.5">
                {activePreviewGrade.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3 text-xs text-amber-800 dark:text-amber-300 mb-5">
              💡 <strong>Integration Note:</strong> This grade slot is registered in <code className="font-mono text-[11px] bg-white/60 dark:bg-slate-900 px-1 py-0.5 rounded">src/data/makerspaceCurriculumGrades.ts</code>. You can drop the corresponding HTML book (e.g. <code className="font-mono text-[11px] bg-white/60 dark:bg-slate-900 px-1 py-0.5 rounded">Grade-{activePreviewGrade.gradeNumber}.html</code>) to activate this module.
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setActivePreviewGrade(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. BOTTOM BANNER FOR LAB INTEGRATION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-8 sm:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">
              School Setup Support
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Bring CSEEL Makerspace &amp; ATL Curriculum to Your School
            </h3>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              We provide turnkey lab setup, 325+ standard-wise materials, printed teacher guides, and faculty training workshops aligned with NEP 2020.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link
              href="/makerspace"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-slate-900 hover:bg-blue-50 font-bold text-sm shadow-md transition-all text-center"
            >
              <span>🛠️</span>
              <span>View 325+ Materials</span>
            </Link>
            <Link
              href="/contact-us"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md transition-all text-center"
            >
              <span>📞</span>
              <span>Request Consultation</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
