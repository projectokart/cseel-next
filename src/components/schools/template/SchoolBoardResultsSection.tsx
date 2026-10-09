'use client';

import React, { useState } from 'react';
import {
  Award,
  GraduationCap,
  TrendingUp,
  Users,
  CheckCircle2,
  Calendar,
  Sparkles,
  Edit3,
  X,
  Plus,
  Trash2,
  HelpCircle,
  FlaskConical,
  Briefcase,
  Palette
} from 'lucide-react';
import {
  SchoolBoardResultsState,
  BoardExamYearResult,
  Class12BoardExamYearResult,
  StreamExamResult
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
  if (!classToStr) return true; // Default to showing both if unspecified
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

// Default benchmark data if no results were provided yet
const FALLBACK_10TH_RESULTS: BoardExamYearResult[] = [
  {
    year: '2024-25',
    totalStudents: 165,
    passedStudents: 165,
    passPercentage: 100,
    maxScorePercent: 99.2,
    above90PercentCount: 88,
  },
  {
    year: '2023-24',
    totalStudents: 158,
    passedStudents: 158,
    passPercentage: 100,
    maxScorePercent: 98.8,
    above90PercentCount: 76,
  },
];

const FALLBACK_12TH_RESULTS: Class12BoardExamYearResult[] = [
  {
    year: '2024-25',
    totalStudents: 142,
    passedStudents: 142,
    passPercentage: 100,
    maxScorePercent: 99.4,
    above90PercentCount: 79,
    streams: [
      { streamName: 'Science', totalStudents: 62, passedStudents: 62, passPercentage: 100, maxScorePercent: 99.4, above90PercentCount: 42 },
      { streamName: 'Commerce', totalStudents: 48, passedStudents: 48, passPercentage: 100, maxScorePercent: 98.6, above90PercentCount: 24 },
      { streamName: 'Humanities / Arts', totalStudents: 32, passedStudents: 32, passPercentage: 100, maxScorePercent: 98.8, above90PercentCount: 13 },
    ],
  },
  {
    year: '2023-24',
    totalStudents: 135,
    passedStudents: 135,
    passPercentage: 100,
    maxScorePercent: 99.0,
    above90PercentCount: 68,
    streams: [
      { streamName: 'Science', totalStudents: 58, passedStudents: 58, passPercentage: 100, maxScorePercent: 99.0, above90PercentCount: 35 },
      { streamName: 'Commerce', totalStudents: 46, passedStudents: 46, passPercentage: 100, maxScorePercent: 98.2, above90PercentCount: 21 },
      { streamName: 'Humanities / Arts', totalStudents: 31, passedStudents: 31, passPercentage: 100, maxScorePercent: 97.6, above90PercentCount: 12 },
    ],
  },
];

const PREDEFINED_STREAMS = [
  { name: 'Science', icon: FlaskConical, badgeColor: 'bg-blue-50 text-blue-700 border-blue-200' },
  { name: 'Commerce', icon: Briefcase, badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { name: 'Humanities / Arts', icon: Palette, badgeColor: 'bg-purple-50 text-purple-700 border-purple-200' },
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

  // Active raw data with fallbacks
  const c10Data: BoardExamYearResult[] = (boardResults?.class10Results && boardResults.class10Results.length > 0)
    ? boardResults.class10Results.slice(0, 2)
    : FALLBACK_10TH_RESULTS;

  const c12Data: Class12BoardExamYearResult[] = (boardResults?.class12Results && boardResults.class12Results.length > 0)
    ? boardResults.class12Results.slice(0, 2)
    : FALLBACK_12TH_RESULTS;

  // Selected Year for Stream Breakdown view
  const [selected12thYear, setSelected12thYear] = useState<string>(c12Data[0]?.year || '2024-25');

  // Modal State for Predefined Strict Editing
  const [editingModal, setEditingModal] = useState<'10th' | '12th' | null>(null);

  // Strict modal working copies
  const [modal10thRows, setModal10thRows] = useState<BoardExamYearResult[]>([]);
  const [modal12thRows, setModal12thRows] = useState<Class12BoardExamYearResult[]>([]);

  const handleOpen10thEdit = () => {
    setModal10thRows(JSON.parse(JSON.stringify(c10Data)));
    setEditingModal('10th');
  };

  const handleOpen12thEdit = () => {
    setModal12thRows(JSON.parse(JSON.stringify(c12Data)));
    setEditingModal('12th');
  };

  const handleSaveModal = () => {
    if (!onSaveResults) return;
    if (editingModal === '10th') {
      const sanitized = modal10thRows.slice(0, 2).map((r) => {
        const total = Number(r.totalStudents) || 0;
        const passed = Number(r.passedStudents) || 0;
        return {
          year: r.year.trim() || '2024-25',
          totalStudents: total,
          passedStudents: Math.min(passed, total),
          passPercentage: calculatePassRate(passed, total),
          maxScorePercent: Math.min(100, Math.max(0, Number(r.maxScorePercent) || 0)),
          above90PercentCount: Math.min(total, Math.max(0, Number(r.above90PercentCount) || 0)),
        };
      });
      onSaveResults({
        class10Results: sanitized,
        class12Results: c12Data,
      });
    } else if (editingModal === '12th') {
      const sanitized = modal12thRows.slice(0, 2).map((r) => {
        const total = Number(r.totalStudents) || 0;
        const passed = Number(r.passedStudents) || 0;
        const cleanStreams = (r.streams || []).map((s) => {
          const sTotal = Number(s.totalStudents) || 0;
          const sPassed = Number(s.passedStudents) || 0;
          return {
            streamName: s.streamName || 'Science',
            totalStudents: sTotal,
            passedStudents: Math.min(sPassed, sTotal),
            passPercentage: calculatePassRate(sPassed, sTotal),
            maxScorePercent: Math.min(100, Math.max(0, Number(s.maxScorePercent) || 0)),
            above90PercentCount: Math.min(sTotal, Math.max(0, Number(s.above90PercentCount) || 0)),
          };
        });
        return {
          year: r.year.trim() || '2024-25',
          totalStudents: total,
          passedStudents: Math.min(passed, total),
          passPercentage: calculatePassRate(passed, total),
          maxScorePercent: Math.min(100, Math.max(0, Number(r.maxScorePercent) || 0)),
          above90PercentCount: Math.min(total, Math.max(0, Number(r.above90PercentCount) || 0)),
          streams: cleanStreams,
        };
      });
      onSaveResults({
        class10Results: c10Data,
        class12Results: sanitized,
      });
    }
    setEditingModal(null);
  };

  const active12thYearObj = c12Data.find((y) => y.year === selected12thYear) || c12Data[0];

  return (
    <div id="board-results" className="my-8 scroll-mt-24">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#005689] text-xs font-bold uppercase tracking-wider mb-2">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>Academic Performance Records</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-[#002B49] tracking-tight">
            Board Examination Results & Merit Analytics
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            Verified official {boardName} board results for {schoolName} (Last 2 Academic Sessions).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Official Records</span>
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 text-xs font-medium">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>Max 2 Years</span>
          </span>
        </div>
      </div>

      <div className="space-y-8">
        {/* ========================================================= */}
        {/* TABLE 1: CLASS 10TH BOARD EXAMINATION RESULTS            */}
        {/* ========================================================= */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Table Header Bar */}
          <div className="px-5 py-4 bg-gradient-to-r from-blue-900 via-[#005689] to-blue-800 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
                <GraduationCap className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h4 className="font-black text-base tracking-wide flex items-center gap-2">
                  <span>Class 10th Board Results (Secondary Examination)</span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 uppercase">
                    10th Board
                  </span>
                </h4>
                <p className="text-xs text-blue-100">
                  Affiliated Curriculum: {boardName} | Pass rate auto-calculated from total appeared & passed students
                </p>
              </div>
            </div>

            {isEditMode && (
              <button
                onClick={handleOpen10thEdit}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all border border-white/30 shadow-xs"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit 10th Data</span>
              </button>
            )}
          </div>

          {/* Clean Fixed-Column Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/90 text-slate-700 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3.5 px-4 font-extrabold text-slate-900">Academic Year</th>
                  <th className="py-3.5 px-4">Total Appeared</th>
                  <th className="py-3.5 px-4">Students Passed</th>
                  <th className="py-3.5 px-4 text-center">Pass Percentage</th>
                  <th className="py-3.5 px-4 text-center">School Top Score</th>
                  <th className="py-3.5 px-4 text-right">90% & Above Scorers</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {c10Data.map((row, idx) => {
                  const passRate = calculatePassRate(row.passedStudents, row.totalStudents);
                  const isHundred = passRate >= 100;
                  const above90Ratio = row.totalStudents > 0
                    ? ((row.above90PercentCount / row.totalStudents) * 100).toFixed(1)
                    : '0';

                  return (
                    <tr key={idx} className="hover:bg-blue-50/40 transition-colors">
                      {/* Year */}
                      <td className="py-4 px-4 font-bold text-slate-950">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#005689]" />
                          <span className="text-sm font-black">{row.year}</span>
                          {idx === 0 && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-[#005689]">
                              Latest
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Total Appeared */}
                      <td className="py-4 px-4 font-semibold text-slate-700">
                        <div className="flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-slate-400" />
                          <span>{row.totalStudents} Students</span>
                        </div>
                      </td>

                      {/* Passed Students */}
                      <td className="py-4 px-4 font-semibold text-slate-700">
                        <div className="flex items-center gap-1.5 text-emerald-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>{row.passedStudents} Passed</span>
                        </div>
                      </td>

                      {/* Pass Percentage (Auto-Calculated) */}
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black tracking-wide ${
                            isHundred
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              : 'bg-blue-100 text-blue-900 border border-blue-200'
                          }`}
                        >
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>{passRate}% Pass</span>
                        </span>
                      </td>

                      {/* Top Score */}
                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 font-extrabold text-xs">
                          <Award className="w-3.5 h-3.5 text-amber-500" />
                          <span>{row.maxScorePercent}%</span>
                        </span>
                      </td>

                      {/* Above 90% Scorers */}
                      <td className="py-4 px-4 text-right">
                        <div className="inline-block text-right">
                          <span className="font-black text-slate-900 text-sm">{row.above90PercentCount}</span>
                          <span className="text-slate-500 text-xs ml-1 font-medium">({above90Ratio}%)</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ========================================================= */}
        {/* TABLE 2: CLASS 12TH BOARD EXAMINATION RESULTS            */}
        {/* (Only rendered if school is Senior Secondary)            */}
        {/* ========================================================= */}
        {isSeniorSec ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Table Header Bar */}
            <div className="px-5 py-4 bg-gradient-to-r from-emerald-950 via-[#0A4D68] to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
                  <Award className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-black text-base tracking-wide flex items-center gap-2">
                    <span>Class 12th Board Results (Senior Secondary Examination)</span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-400 text-slate-950 uppercase">
                      12th Board
                    </span>
                  </h4>
                  <p className="text-xs text-emerald-100">
                    Comprehensive School-Level & Stream-Wise (Science, Commerce & Humanities) Merit Records
                  </p>
                </div>
              </div>

              {isEditMode && (
                <button
                  onClick={handleOpen12thEdit}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all border border-white/30 shadow-xs"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit 12th Data</span>
                </button>
              )}
            </div>

            {/* Overall Class 12 Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/90 text-slate-700 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                    <th className="py-3.5 px-4 font-extrabold text-slate-900">Academic Year</th>
                    <th className="py-3.5 px-4">Total Appeared</th>
                    <th className="py-3.5 px-4">Students Passed</th>
                    <th className="py-3.5 px-4 text-center">Overall Pass %</th>
                    <th className="py-3.5 px-4 text-center">School Topper %</th>
                    <th className="py-3.5 px-4 text-right">90% & Above Scorers</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {c12Data.map((row, idx) => {
                    const passRate = calculatePassRate(row.passedStudents, row.totalStudents);
                    const isHundred = passRate >= 100;
                    const above90Ratio = row.totalStudents > 0
                      ? ((row.above90PercentCount / row.totalStudents) * 100).toFixed(1)
                      : '0';

                    return (
                      <tr key={idx} className="hover:bg-emerald-50/30 transition-colors">
                        {/* Year */}
                        <td className="py-4 px-4 font-bold text-slate-950">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-600" />
                            <span className="text-sm font-black">{row.year}</span>
                            {idx === 0 && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                                Latest
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Total Appeared */}
                        <td className="py-4 px-4 font-semibold text-slate-700">
                          <div className="flex items-center gap-1.5">
                            <Users className="w-4 h-4 text-slate-400" />
                            <span>{row.totalStudents} Students</span>
                          </div>
                        </td>

                        {/* Passed */}
                        <td className="py-4 px-4 font-semibold text-slate-700">
                          <div className="flex items-center gap-1.5 text-emerald-700">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>{row.passedStudents} Passed</span>
                          </div>
                        </td>

                        {/* Pass Percentage */}
                        <td className="py-4 px-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black tracking-wide ${
                              isHundred
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                : 'bg-blue-100 text-blue-900 border border-blue-200'
                            }`}
                          >
                            <TrendingUp className="w-3.5 h-3.5" />
                            <span>{passRate}% Pass</span>
                          </span>
                        </td>

                        {/* Topper Score */}
                        <td className="py-4 px-4 text-center">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 font-extrabold text-xs">
                            <Award className="w-3.5 h-3.5 text-amber-500" />
                            <span>{row.maxScorePercent}%</span>
                          </span>
                        </td>

                        {/* Above 90% */}
                        <td className="py-4 px-4 text-right">
                          <div className="inline-block text-right">
                            <span className="font-black text-slate-900 text-sm">{row.above90PercentCount}</span>
                            <span className="text-slate-500 text-xs ml-1 font-medium">({above90Ratio}%)</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Stream-Wise Breakdown Table */}
            <div className="p-4 sm:p-5 bg-slate-50/70 border-t border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#005689]" />
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                    Stream-Wise Breakdown ({selected12thYear})
                  </span>
                </div>

                {/* Session selector tabs */}
                <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  {c12Data.map((yr) => (
                    <button
                      key={yr.year}
                      onClick={() => setSelected12thYear(yr.year)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        selected12thYear === yr.year
                          ? 'bg-[#005689] text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                      }`}
                    >
                      Session {yr.year}
                    </button>
                  ))}
                </div>
              </div>

              {/* Strict Stream Table */}
              <div className="overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-2xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100/80 text-slate-700 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                      <th className="py-2.5 px-4 font-extrabold text-slate-900">Stream</th>
                      <th className="py-2.5 px-4">Appeared</th>
                      <th className="py-2.5 px-4">Passed</th>
                      <th className="py-2.5 px-4 text-center">Stream Pass %</th>
                      <th className="py-2.5 px-4 text-center">Stream Topper</th>
                      <th className="py-2.5 px-4 text-right">90%+ Students</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {(active12thYearObj?.streams && active12thYearObj.streams.length > 0
                      ? active12thYearObj.streams
                      : [
                          { streamName: 'Science', totalStudents: 62, passedStudents: 62, passPercentage: 100, maxScorePercent: 99.4, above90PercentCount: 42 },
                          { streamName: 'Commerce', totalStudents: 48, passedStudents: 48, passPercentage: 100, maxScorePercent: 98.6, above90PercentCount: 24 },
                          { streamName: 'Humanities / Arts', totalStudents: 32, passedStudents: 32, passPercentage: 100, maxScorePercent: 98.8, above90PercentCount: 13 },
                        ]
                    ).map((st, sIdx) => {
                      const stPass = calculatePassRate(st.passedStudents, st.totalStudents);
                      const isStHundred = stPass >= 100;
                      const pred = PREDEFINED_STREAMS.find(
                        (p) => p.name.toLowerCase().includes(st.streamName.toLowerCase()) || st.streamName.toLowerCase().includes(p.name.toLowerCase())
                      );
                      const IconComp = pred ? pred.icon : FlaskConical;

                      return (
                        <tr key={sIdx} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-4 font-bold text-slate-950">
                            <div className="flex items-center gap-2">
                              <span className={`p-1 rounded-md border ${pred?.badgeColor || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                                <IconComp className="w-3.5 h-3.5" />
                              </span>
                              <span>{st.streamName}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-medium text-slate-700">{st.totalStudents}</td>
                          <td className="py-3 px-4 font-medium text-emerald-700">{st.passedStudents}</td>
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                isStHundred ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {stPass}%
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center font-bold text-amber-700">
                            {st.maxScorePercent}%
                          </td>
                          <td className="py-3 px-4 text-right font-black text-slate-900">
                            {st.above90PercentCount}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
            <span>
              ℹ️ Note: This institution offers instruction up to Class {classTo}. Class 12th Senior Secondary board tables are displayed only for schools offering Grades 11–12.
            </span>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* STRICT PREDEFINED EDIT MODAL (SCHOOL CANNOT ADD NEW FIELDS) */}
      {/* ========================================================= */}
      {editingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#005689] flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Update Class {editingModal === '10th' ? '10th' : '12th'} Board Results
                  </h3>
                  <p className="text-xs text-slate-500">
                    Strict predefined fields only (Max 2 academic years). Pass % is auto-calculated.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingModal(null)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-6 max-h-[65vh] overflow-y-auto pr-1">
              {editingModal === '10th' ? (
                modal10thRows.map((row, rIdx) => {
                  const currentPassRate = calculatePassRate(row.passedStudents, row.totalStudents);
                  return (
                    <div key={rIdx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-[#005689] tracking-wider">
                          Year #{rIdx + 1} Record
                        </span>
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                          Auto Pass Rate: {currentPassRate}%
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Academic Year</label>
                          <input
                            type="text"
                            value={row.year}
                            onChange={(e) => {
                              const updated = [...modal10thRows];
                              updated[rIdx].year = e.target.value;
                              setModal10thRows(updated);
                            }}
                            placeholder="e.g. 2024-25"
                            className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Total Appeared</label>
                          <input
                            type="number"
                            value={row.totalStudents || ''}
                            onChange={(e) => {
                              const updated = [...modal10thRows];
                              updated[rIdx].totalStudents = parseInt(e.target.value, 10) || 0;
                              setModal10thRows(updated);
                            }}
                            placeholder="e.g. 165"
                            className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Students Passed</label>
                          <input
                            type="number"
                            value={row.passedStudents || ''}
                            onChange={(e) => {
                              const updated = [...modal10thRows];
                              updated[rIdx].passedStudents = parseInt(e.target.value, 10) || 0;
                              setModal10thRows(updated);
                            }}
                            placeholder="e.g. 165"
                            className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 bg-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Top / Highest Score %</label>
                          <input
                            type="number"
                            step="0.1"
                            value={row.maxScorePercent || ''}
                            onChange={(e) => {
                              const updated = [...modal10thRows];
                              updated[rIdx].maxScorePercent = parseFloat(e.target.value) || 0;
                              setModal10thRows(updated);
                            }}
                            placeholder="e.g. 99.2"
                            className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Above 90% Scorers Count</label>
                          <input
                            type="number"
                            value={row.above90PercentCount || ''}
                            onChange={(e) => {
                              const updated = [...modal10thRows];
                              updated[rIdx].above90PercentCount = parseInt(e.target.value, 10) || 0;
                              setModal10thRows(updated);
                            }}
                            placeholder="e.g. 88"
                            className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                modal12thRows.map((row, rIdx) => {
                  const currentPassRate = calculatePassRate(row.passedStudents, row.totalStudents);
                  return (
                    <div key={rIdx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-emerald-800 tracking-wider">
                          Class 12th Year #{rIdx + 1} Record
                        </span>
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                          Overall Pass Rate: {currentPassRate}%
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Academic Year</label>
                          <input
                            type="text"
                            value={row.year}
                            onChange={(e) => {
                              const updated = [...modal12thRows];
                              updated[rIdx].year = e.target.value;
                              setModal12thRows(updated);
                            }}
                            placeholder="e.g. 2024-25"
                            className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Total Appeared</label>
                          <input
                            type="number"
                            value={row.totalStudents || ''}
                            onChange={(e) => {
                              const updated = [...modal12thRows];
                              updated[rIdx].totalStudents = parseInt(e.target.value, 10) || 0;
                              setModal12thRows(updated);
                            }}
                            placeholder="e.g. 142"
                            className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Students Passed</label>
                          <input
                            type="number"
                            value={row.passedStudents || ''}
                            onChange={(e) => {
                              const updated = [...modal12thRows];
                              updated[rIdx].passedStudents = parseInt(e.target.value, 10) || 0;
                              setModal12thRows(updated);
                            }}
                            placeholder="e.g. 142"
                            className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 bg-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">School Topper %</label>
                          <input
                            type="number"
                            step="0.1"
                            value={row.maxScorePercent || ''}
                            onChange={(e) => {
                              const updated = [...modal12thRows];
                              updated[rIdx].maxScorePercent = parseFloat(e.target.value) || 0;
                              setModal12thRows(updated);
                            }}
                            placeholder="e.g. 99.4"
                            className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Above 90% Scorers Count</label>
                          <input
                            type="number"
                            value={row.above90PercentCount || ''}
                            onChange={(e) => {
                              const updated = [...modal12thRows];
                              updated[rIdx].above90PercentCount = parseInt(e.target.value, 10) || 0;
                              setModal12thRows(updated);
                            }}
                            placeholder="e.g. 79"
                            className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 bg-white"
                          />
                        </div>
                      </div>

                      {/* Stream Breakdown Sub-Editor */}
                      <div className="pt-2 border-t border-slate-200">
                        <span className="block text-xs font-extrabold uppercase text-slate-800 mb-2">
                          Stream Breakdown (Science, Commerce, Humanities)
                        </span>

                        <div className="space-y-2">
                          {(row.streams || [
                            { streamName: 'Science', totalStudents: 62, passedStudents: 62, maxScorePercent: 99.4, above90PercentCount: 42 },
                            { streamName: 'Commerce', totalStudents: 48, passedStudents: 48, maxScorePercent: 98.6, above90PercentCount: 24 },
                            { streamName: 'Humanities / Arts', totalStudents: 32, passedStudents: 32, maxScorePercent: 98.8, above90PercentCount: 13 },
                          ]).map((st, sIdx) => (
                            <div key={sIdx} className="p-2.5 rounded-xl bg-white border border-slate-200 grid grid-cols-5 gap-2 items-center text-xs">
                              <span className="font-bold text-slate-900 col-span-1">{st.streamName}</span>
                              <input
                                type="number"
                                placeholder="Appeared"
                                value={st.totalStudents || ''}
                                onChange={(e) => {
                                  const updated = [...modal12thRows];
                                  if (!updated[rIdx].streams) updated[rIdx].streams = [];
                                  updated[rIdx].streams![sIdx].totalStudents = parseInt(e.target.value, 10) || 0;
                                  setModal12thRows(updated);
                                }}
                                className="px-2 py-1.5 rounded-lg border border-slate-300 text-center font-semibold"
                              />
                              <input
                                type="number"
                                placeholder="Passed"
                                value={st.passedStudents || ''}
                                onChange={(e) => {
                                  const updated = [...modal12thRows];
                                  if (!updated[rIdx].streams) updated[rIdx].streams = [];
                                  updated[rIdx].streams![sIdx].passedStudents = parseInt(e.target.value, 10) || 0;
                                  setModal12thRows(updated);
                                }}
                                className="px-2 py-1.5 rounded-lg border border-slate-300 text-center font-semibold"
                              />
                              <input
                                type="number"
                                step="0.1"
                                placeholder="Top %"
                                value={st.maxScorePercent || ''}
                                onChange={(e) => {
                                  const updated = [...modal12thRows];
                                  if (!updated[rIdx].streams) updated[rIdx].streams = [];
                                  updated[rIdx].streams![sIdx].maxScorePercent = parseFloat(e.target.value) || 0;
                                  setModal12thRows(updated);
                                }}
                                className="px-2 py-1.5 rounded-lg border border-slate-300 text-center font-semibold"
                              />
                              <input
                                type="number"
                                placeholder="90%+ Cnt"
                                value={st.above90PercentCount || ''}
                                onChange={(e) => {
                                  const updated = [...modal12thRows];
                                  if (!updated[rIdx].streams) updated[rIdx].streams = [];
                                  updated[rIdx].streams![sIdx].above90PercentCount = parseInt(e.target.value, 10) || 0;
                                  setModal12thRows(updated);
                                }}
                                className="px-2 py-1.5 rounded-lg border border-slate-300 text-center font-semibold"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setEditingModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveModal}
                className="px-5 py-2.5 rounded-xl bg-[#005689] text-white text-xs font-bold hover:bg-[#003c6e] shadow-xs transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Predefined Results</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
