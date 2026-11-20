'use client';

import React, { useState, useEffect } from 'react';
import {
  Award,
  GraduationCap,
  TrendingUp,
  Users,
  CheckCircle2,
  Calendar,
  Sparkles,
  Plus,
  Trash2,
  FlaskConical,
  Briefcase,
  Palette,
} from 'lucide-react';
import {
  SchoolBoardResultsState,
  BoardExamYearResult,
  Class12BoardExamYearResult,
  StreamExamResult,
} from './SchoolTemplateContext';

interface SchoolBoardResultsSectionProps {
  boardResults?: SchoolBoardResultsState;
  classTo?: string;
  boardName?: string;
  schoolName?: string;
  isEditMode?: boolean;
  onSaveResults?: (newResults: SchoolBoardResultsState) => void;
}

// Helper to determine if school has Senior Secondary classes (Class 11 & 12)
export function isSeniorSecondarySchool(classToStr: string | undefined): boolean {
  if (!classToStr) return true;
  const lower = classToStr.toLowerCase().trim();
  const digits = lower.replace(/\D/g, '');
  const num = parseInt(digits, 10);
  if (!isNaN(num)) {
    return num >= 11;
  }
  return lower.includes('12') || lower.includes('senior') || lower.includes('inter') || lower.includes('higher');
}

// Auto-calculate pass percentage strictly
export function calculatePassRate(passed: number, total: number): number {
  if (!total || total <= 0) return 0;
  const pct = (passed / total) * 100;
  return parseFloat(Math.min(100, Math.max(0, pct)).toFixed(1));
}

export const PREDEFINED_ACADEMIC_YEARS = [
  { value: '2024-25', label: '2024-25 (Latest)' },
  { value: '2023-24', label: '2023-24 (Previous Year)' },
  { value: '2022-23', label: '2022-23 (Last 2nd Year)' },
  { value: '2021-22', label: '2021-22' },
  { value: '2025-26', label: '2025-26 (Upcoming)' },
];

export const getAvailableNextYear = (existingYears: string[]) => {
  const defaults = ['2024-25', '2023-24', '2022-23', '2021-22', '2025-26'];
  for (const y of defaults) {
    if (!existingYears.includes(y)) return y;
  }
  return '2026-27';
};

const DEFAULT_12TH_STREAMS: StreamExamResult[] = [
  { streamName: 'Science', totalStudents: 50, passedStudents: 49, passPercentage: 98, maxScorePercent: 99.2, above90PercentCount: 28 },
  { streamName: 'Commerce', totalStudents: 40, passedStudents: 39, passPercentage: 97.5, maxScorePercent: 97.6, above90PercentCount: 16 },
  { streamName: 'Humanities / Arts', totalStudents: 30, passedStudents: 30, passPercentage: 100, maxScorePercent: 98.0, above90PercentCount: 8 },
];

export default function SchoolBoardResultsSection({
  boardResults,
  classTo = 'Class 12th',
  boardName = 'CBSE',
  schoolName = 'School',
  isEditMode = false,
  onSaveResults,
}: SchoolBoardResultsSectionProps) {
  const isSeniorSec = isSeniorSecondarySchool(classTo);

  // Active internal state
  const [internalBoardResults, setInternalBoardResults] = useState<SchoolBoardResultsState>(() => {
    let c10 = boardResults?.class10Results || [];
    let c12 = boardResults?.class12Results || [];

    // Pre-populate 10th default row in edit mode if empty
    if (isEditMode && c10.length === 0) {
      c10 = [
        {
          year: '2024-25',
          totalStudents: 100,
          passedStudents: 98,
          passPercentage: 98,
          maxScorePercent: 98.4,
          above90PercentCount: 35,
        },
      ];
    }

    // Pre-populate 12th default row with Science, Commerce, and Humanities / Arts in edit mode if empty
    if (isEditMode && c12.length === 0) {
      c12 = [
        {
          year: '2024-25',
          totalStudents: 120,
          passedStudents: 118,
          passPercentage: 98.3,
          maxScorePercent: 99.2,
          above90PercentCount: 52,
          streams: DEFAULT_12TH_STREAMS,
        },
      ];
    }

    return { class10Results: c10, class12Results: c12 };
  });

  useEffect(() => {
    if (boardResults) {
      let c10 = boardResults.class10Results || [];
      let c12 = boardResults.class12Results || [];
      if (isEditMode && c10.length === 0) {
        c10 = [
          {
            year: '2024-25',
            totalStudents: 100,
            passedStudents: 98,
            passPercentage: 98,
            maxScorePercent: 98.4,
            above90PercentCount: 35,
          },
        ];
      }
      if (isEditMode && c12.length === 0) {
        c12 = [
          {
            year: '2024-25',
            totalStudents: 120,
            passedStudents: 118,
            passPercentage: 98.3,
            maxScorePercent: 99.2,
            above90PercentCount: 52,
            streams: DEFAULT_12TH_STREAMS,
          },
        ];
      }
      setInternalBoardResults({ class10Results: c10, class12Results: c12 });
    }
  }, [boardResults, isEditMode]);

  const c10Data: BoardExamYearResult[] = internalBoardResults.class10Results || [];
  const c12Data: Class12BoardExamYearResult[] = internalBoardResults.class12Results || [];

  // Active Class 12 Year
  const active12thObj = c12Data[0] || {
    year: '2024-25',
    totalStudents: 120,
    passedStudents: 118,
    passPercentage: 98.3,
    maxScorePercent: 99.2,
    above90PercentCount: 52,
    streams: DEFAULT_12TH_STREAMS,
  };

  const syncState = (next: SchoolBoardResultsState) => {
    setInternalBoardResults(next);
    if (onSaveResults) onSaveResults(next);
  };

  // Class 10 Handlers (Direct Table Editing)
  const update10thCell = (idx: number, field: keyof BoardExamYearResult, val: any) => {
    const updated = [...c10Data];
    updated[idx] = { ...updated[idx], [field]: val };
    const total = Number(updated[idx].totalStudents) || 0;
    const passed = Number(updated[idx].passedStudents) || 0;
    updated[idx].passPercentage = calculatePassRate(passed, total);
    syncState({ class10Results: updated, class12Results: c12Data });
  };

  const add10thRow = () => {
    if (c10Data.length >= 5) return;
    const existingYears = c10Data.map((r) => r.year);
    const nextYear = getAvailableNextYear(existingYears);
    const updated = [
      ...c10Data,
      {
        year: nextYear,
        totalStudents: 100,
        passedStudents: 98,
        passPercentage: 98,
        maxScorePercent: 98.4,
        above90PercentCount: 32,
      },
    ];
    syncState({ class10Results: updated, class12Results: c12Data });
  };

  const remove10thRow = (idx: number) => {
    const updated = c10Data.filter((_, i) => i !== idx);
    syncState({ class10Results: updated, class12Results: c12Data });
  };

  // Class 12 Stream Table Handlers
  const streamsList: StreamExamResult[] =
    Array.isArray(active12thObj.streams) && active12thObj.streams.length > 0
      ? active12thObj.streams
      : DEFAULT_12TH_STREAMS;

  const update12thYear = (newYear: string) => {
    const updated12 = [...c12Data];
    if (updated12.length === 0) {
      updated12.push({ ...active12thObj, year: newYear });
    } else {
      updated12[0] = { ...updated12[0], year: newYear };
    }
    syncState({ class10Results: c10Data, class12Results: updated12 });
  };

  const updateStreamCell = (sIdx: number, field: keyof StreamExamResult, val: any) => {
    const updatedStreams = [...streamsList];
    updatedStreams[sIdx] = { ...updatedStreams[sIdx], [field]: val };
    const total = Number(updatedStreams[sIdx].totalStudents) || 0;
    const passed = Number(updatedStreams[sIdx].passedStudents) || 0;
    updatedStreams[sIdx].passPercentage = calculatePassRate(passed, total);

    // Compute aggregate for Class 12
    const aggTotal = updatedStreams.reduce((acc, s) => acc + (Number(s.totalStudents) || 0), 0);
    const aggPassed = updatedStreams.reduce((acc, s) => acc + (Number(s.passedStudents) || 0), 0);
    const aggAbove90 = updatedStreams.reduce((acc, s) => acc + (Number(s.above90PercentCount) || 0), 0);
    const aggMaxScore = Math.max(...updatedStreams.map((s) => Number(s.maxScorePercent) || 0), 0);

    const updated12 = [...c12Data];
    const newObj: Class12BoardExamYearResult = {
      ...active12thObj,
      totalStudents: aggTotal,
      passedStudents: aggPassed,
      passPercentage: calculatePassRate(aggPassed, aggTotal),
      above90PercentCount: aggAbove90,
      maxScorePercent: aggMaxScore,
      streams: updatedStreams,
    };
    if (updated12.length === 0) {
      updated12.push(newObj);
    } else {
      updated12[0] = newObj;
    }
    syncState({ class10Results: c10Data, class12Results: updated12 });
  };

  const addStreamRow = () => {
    const newStream: StreamExamResult = {
      streamName: 'Vocational / Other',
      totalStudents: 30,
      passedStudents: 29,
      passPercentage: 96.7,
      maxScorePercent: 97.5,
      above90PercentCount: 8,
    };
    const updatedStreams = [...streamsList, newStream];
    const updated12 = [...c12Data];
    if (updated12.length === 0) {
      updated12.push({ ...active12thObj, streams: updatedStreams });
    } else {
      updated12[0] = { ...updated12[0], streams: updatedStreams };
    }
    syncState({ class10Results: c10Data, class12Results: updated12 });
  };

  const removeStreamRow = (sIdx: number) => {
    const updatedStreams = streamsList.filter((_, i) => i !== sIdx);
    const updated12 = [...c12Data];
    if (updated12.length === 0) {
      updated12.push({ ...active12thObj, streams: updatedStreams });
    } else {
      updated12[0] = { ...updated12[0], streams: updatedStreams };
    }
    syncState({ class10Results: c10Data, class12Results: updated12 });
  };

  return (
    <section id="results" className="py-5 sm:py-8 bg-white border-b border-[#DCE2E8] relative">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase text-[#006FCC] bg-[#EDF5FA] border border-[#D0E4F5] px-2.5 py-0.5 rounded-full mb-1.5 font-['Montserrat',sans-serif]">
              <Award className="w-3.5 h-3.5 text-[#006FCC]" />
              <span>ACADEMIC EXCELLENCE &amp; BOARD PERFORMANCE</span>
            </div>
            <h3 className="text-[19px] sm:text-2xl font-bold font-['Montserrat',sans-serif] text-[#003C6E] tracking-tight leading-snug">
              Official Board Examination Performance ({boardName})
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl font-normal">
              Direct official examination metrics for Class 10th and Class 12th graduating batches of {schoolName}.
            </p>
          </div>
        </div>

        {/* ========================================================= */}
        {/* TABLE 1: CLASS 10TH BOARD EXAMINATION RESULTS            */}
        {/* ========================================================= */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-5 py-3.5 bg-gradient-to-r from-[#002B49] via-[#005689] to-[#004168] text-white flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                <GraduationCap className="w-4 h-4 text-amber-300" />
              </div>
              <h4 className="font-bold text-sm sm:text-base tracking-wide flex items-center gap-2 m-0 text-white">
                <span>Class 10th Result</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 uppercase">
                  10th Board
                </span>
              </h4>
            </div>

            {isEditMode && (
              <button
                type="button"
                onClick={add10thRow}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-blue-50 text-[#005689] text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Row Direct in Table</span>
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3 px-4 font-extrabold text-slate-900">Academic Year</th>
                  <th className="py-3 px-4">Total Appeared</th>
                  <th className="py-3 px-4">Students Passed</th>
                  <th className="py-3 px-4 text-center">Pass Percentage</th>
                  <th className="py-3 px-4 text-center">School Top Score</th>
                  <th className="py-3 px-4 text-right">90%+ Scorers</th>
                  {isEditMode && <th className="py-3 px-3 text-center w-12">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {c10Data.length === 0 ? (
                  <tr>
                    <td colSpan={isEditMode ? 7 : 6} className="py-8 px-4 text-center text-slate-500 text-xs">
                      Official class 10th examination records to be published by the institution.
                    </td>
                  </tr>
                ) : (
                  c10Data.map((row, idx) => {
                    const passRate = calculatePassRate(row.passedStudents, row.totalStudents);
                    return (
                      <tr key={idx} className="hover:bg-blue-50/40 transition-colors">
                        {/* Year (Free-Text Input) */}
                        <td className="py-2.5 px-4 font-bold text-slate-950">
                          {isEditMode ? (
                            <input
                              type="text"
                              value={row.year}
                              onChange={(e) => update10thCell(idx, 'year', e.target.value)}
                              placeholder="e.g. 2024-25"
                              className="w-28 px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:border-[#005689]"
                            />
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-[#006FCC]" />
                              <span className="text-sm font-bold">{row.year}</span>
                            </div>
                          )}
                        </td>

                        {/* Total Appeared */}
                        <td className="py-2.5 px-4 font-semibold text-slate-700">
                          {isEditMode ? (
                            <input
                              type="number"
                              value={row.totalStudents || ''}
                              onChange={(e) => update10thCell(idx, 'totalStudents', parseInt(e.target.value, 10) || 0)}
                              placeholder="Total"
                              className="w-24 px-2 py-1 text-xs font-bold rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:border-[#005689]"
                            />
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <Users className="w-4 h-4 text-slate-400" />
                              <span>{row.totalStudents}</span>
                            </div>
                          )}
                        </td>

                        {/* Passed */}
                        <td className="py-2.5 px-4 font-semibold text-slate-700">
                          {isEditMode ? (
                            <input
                              type="number"
                              value={row.passedStudents || ''}
                              onChange={(e) => update10thCell(idx, 'passedStudents', parseInt(e.target.value, 10) || 0)}
                              placeholder="Passed"
                              className="w-24 px-2 py-1 text-xs font-bold rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:border-[#005689]"
                            />
                          ) : (
                            <div className="flex items-center gap-1.5 text-emerald-700">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span>{row.passedStudents}</span>
                            </div>
                          )}
                        </td>

                        {/* Pass Percentage */}
                        <td className="py-2.5 px-4 text-center">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-200">
                            <TrendingUp className="w-3 h-3" />
                            <span>{passRate}%</span>
                          </span>
                        </td>

                        {/* Top Score */}
                        <td className="py-2.5 px-4 text-center">
                          {isEditMode ? (
                            <input
                              type="number"
                              step="0.1"
                              value={row.maxScorePercent || ''}
                              onChange={(e) => update10thCell(idx, 'maxScorePercent', parseFloat(e.target.value) || 0)}
                              placeholder="Topper %"
                              className="w-20 px-2 py-1 text-xs font-bold rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:border-[#005689] text-center"
                            />
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 font-bold text-xs">
                              <Award className="w-3.5 h-3.5 text-amber-500" />
                              <span>{row.maxScorePercent}%</span>
                            </span>
                          )}
                        </td>

                        {/* 90%+ Scorers */}
                        <td className={`py-2.5 px-4 ${isEditMode ? 'text-center' : 'text-right'}`}>
                          {isEditMode ? (
                            <input
                              type="number"
                              value={row.above90PercentCount || ''}
                              onChange={(e) => update10thCell(idx, 'above90PercentCount', parseInt(e.target.value, 10) || 0)}
                              placeholder="90%+ Count"
                              className="w-20 px-2 py-1 text-xs font-bold rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:border-[#005689] text-center"
                            />
                          ) : (
                            <span className="font-bold text-slate-900 text-xs">{row.above90PercentCount}</span>
                          )}
                        </td>

                        {isEditMode && (
                          <td className="py-2.5 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => remove10thRow(idx)}
                              className="p-1 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                              title="Delete row"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ========================================================= */}
        {/* TABLE 2: CLASS 12TH CONSOLIDATED STREAM-WISE RESULTS      */}
        {/* Single unified table with Science, Commerce & Humanities */}
        {/* ========================================================= */}
        {isSeniorSec && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-3.5 bg-gradient-to-r from-emerald-950 via-[#0A4D68] to-slate-900 text-white flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                  <Award className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base tracking-wide flex items-center gap-2 m-0 text-white">
                    <span>Class 12th Stream Results</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950 uppercase">
                      12th Board
                    </span>
                  </h4>
                </div>
              </div>

              {/* Academic Year Free-Text Input */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-200">Academic Year:</span>
                {isEditMode ? (
                  <input
                    type="text"
                    value={active12thObj.year}
                    onChange={(e) => update12thYear(e.target.value)}
                    placeholder="e.g. 2024-25"
                    className="w-28 px-2.5 py-1 text-xs font-bold rounded-lg border border-white/30 bg-white/10 text-white placeholder-emerald-200 focus:outline-none focus:bg-white focus:text-slate-900"
                  />
                ) : (
                  <span className="px-2.5 py-0.5 rounded-lg bg-white/15 text-white font-bold text-xs">
                    {active12thObj.year}
                  </span>
                )}
                {isEditMode && (
                  <button
                    type="button"
                    onClick={addStreamRow}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-900 text-xs font-bold transition-all shadow-xs cursor-pointer ml-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Stream Row</span>
                  </button>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                    <th className="py-3 px-4 font-extrabold text-slate-900">Academic Stream</th>
                    <th className="py-3 px-4">Students Appeared</th>
                    <th className="py-3 px-4">Students Passed</th>
                    <th className="py-3 px-4 text-center">Stream Pass %</th>
                    <th className="py-3 px-4 text-center">Stream Topper %</th>
                    <th className="py-3 px-4 text-right">90%+ Students</th>
                    {isEditMode && <th className="py-3 px-3 text-center w-12">Action</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {streamsList.map((st, sIdx) => {
                    const stPass = calculatePassRate(st.passedStudents, st.totalStudents);
                    return (
                      <tr key={sIdx} className="hover:bg-emerald-50/30 transition-colors">
                        {/* Stream Name */}
                        <td className="py-2.5 px-4 font-bold text-slate-950">
                          {isEditMode ? (
                            <input
                              type="text"
                              value={st.streamName}
                              onChange={(e) => updateStreamCell(sIdx, 'streamName', e.target.value)}
                              placeholder="Stream name"
                              className="w-40 px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:border-emerald-600"
                            />
                          ) : (
                            <div className="flex items-center gap-2">
                              {sIdx === 0 ? (
                                <FlaskConical className="w-4 h-4 text-blue-600" />
                              ) : sIdx === 1 ? (
                                <Briefcase className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <Palette className="w-4 h-4 text-purple-600" />
                              )}
                              <span className="font-bold text-slate-900 text-xs sm:text-sm">{st.streamName}</span>
                            </div>
                          )}
                        </td>

                        {/* Appeared */}
                        <td className="py-2.5 px-4 font-semibold text-slate-700">
                          {isEditMode ? (
                            <input
                              type="number"
                              value={st.totalStudents || ''}
                              onChange={(e) => updateStreamCell(sIdx, 'totalStudents', parseInt(e.target.value, 10) || 0)}
                              placeholder="Appeared"
                              className="w-24 px-2 py-1 text-xs font-bold rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:border-emerald-600"
                            />
                          ) : (
                            <span>{st.totalStudents}</span>
                          )}
                        </td>

                        {/* Passed */}
                        <td className="py-2.5 px-4 font-semibold text-slate-700">
                          {isEditMode ? (
                            <input
                              type="number"
                              value={st.passedStudents || ''}
                              onChange={(e) => updateStreamCell(sIdx, 'passedStudents', parseInt(e.target.value, 10) || 0)}
                              placeholder="Passed"
                              className="w-24 px-2 py-1 text-xs font-bold rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:border-emerald-600"
                            />
                          ) : (
                            <span className="text-emerald-700 font-bold">{st.passedStudents}</span>
                          )}
                        </td>

                        {/* Pass % */}
                        <td className="py-2.5 px-4 text-center">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                            <TrendingUp className="w-3 h-3" />
                            <span>{stPass}%</span>
                          </span>
                        </td>

                        {/* Topper % */}
                        <td className="py-2.5 px-4 text-center">
                          {isEditMode ? (
                            <input
                              type="number"
                              step="0.1"
                              value={st.maxScorePercent || ''}
                              onChange={(e) => updateStreamCell(sIdx, 'maxScorePercent', parseFloat(e.target.value) || 0)}
                              placeholder="Topper %"
                              className="w-20 px-2 py-1 text-xs font-bold rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:border-emerald-600 text-center"
                            />
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 font-bold text-xs">
                              <Award className="w-3.5 h-3.5 text-amber-500" />
                              <span>{st.maxScorePercent}%</span>
                            </span>
                          )}
                        </td>

                        {/* 90%+ Scorers */}
                        <td className={`py-2.5 px-4 ${isEditMode ? 'text-center' : 'text-right'}`}>
                          {isEditMode ? (
                            <input
                              type="number"
                              value={st.above90PercentCount || ''}
                              onChange={(e) => updateStreamCell(sIdx, 'above90PercentCount', parseInt(e.target.value, 10) || 0)}
                              placeholder="90%+ Count"
                              className="w-20 px-2 py-1 text-xs font-bold rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:border-emerald-600 text-center"
                            />
                          ) : (
                            <span className="font-bold text-slate-900 text-xs">{st.above90PercentCount}</span>
                          )}
                        </td>

                        {isEditMode && (
                          <td className="py-2.5 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => removeStreamRow(sIdx)}
                              className="p-1 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                              title="Delete stream"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
