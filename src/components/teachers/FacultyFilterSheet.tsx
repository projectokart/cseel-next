'use client';

import React, { useState, useMemo } from 'react';
import {
  SlidersHorizontal, X, RotateCcw, Check, ChevronDown, ChevronUp, ChevronLeft,
  GraduationCap, Award, MapPin, Building2, Briefcase, DollarSign,
  Zap, Flame, BookOpen, Layers, CheckCircle2, ShieldCheck, ChevronRight, Search
} from 'lucide-react';
import { DEFAULT_JOB_FACETS, JobFilterFacetsData } from '@/data/jobFilterFacets';

export interface FacultyFilterSheetProps {
  mode: 'sidebar' | 'sheet';
  isOpen?: boolean;
  onClose?: () => void;
  activeTab: 'jobs' | 'faculty';
  totalCount: number;
  filteredCount: number;
  // Filter States
  selectedDesignations: string[];
  toggleDesignation: (val: string) => void;
  selectedSubjects: string[];
  toggleSubject: (val: string) => void;
  selectedBoards: string[];
  toggleBoard: (val: string) => void;
  selectedCities: string[];
  toggleCity: (val: string) => void;
  selectedStates: string[];
  toggleState: (val: string) => void;
  selectedJobTypes?: string[];
  toggleJobType?: (val: string) => void;
  selectedPortals?: string[];
  togglePortal?: (val: string) => void;
  minSalaryFilter: number;
  setMinSalaryFilter: (val: number) => void;
  urgentOnly: boolean;
  setUrgentOnly: (val: boolean) => void;
  forLadyOnly?: boolean;
  setForLadyOnly?: (val: boolean) => void;
  dynamicCounts: {
    designations: Record<string, number>;
    subjects: Record<string, number>;
    boards: Record<string, number>;
    cities: Record<string, number>;
    states: Record<string, number>;
    portals?: Record<string, number>;
    forLady?: number;
  };
  onResetAll: () => void;
  // Sidebar minimize
  isSidebarMinimized?: boolean;
  setIsSidebarMinimized?: (minimized: boolean) => void;
  availableFacets?: JobFilterFacetsData;
  distanceRadiusFilter?: number;
  setDistanceRadiusFilter?: (val: number) => void;
  userCoords?: { lat: number; lng: number } | null;
  onRequestUserLocation?: () => void;
}

const JOB_TYPE_OPTIONS = [
  { id: 'Full-Time', label: 'Full Time' },
  { id: 'Part-Time', label: 'Part Time' },
  { id: 'Remote', label: 'Online / Remote' },
  { id: 'On-site', label: 'Offline / On-site' },
];

const SALARY_OPTIONS = [
  { value: 0, label: 'Any Package' },
  { value: 300000, label: '₹3+ Lakhs PA' },
  { value: 500000, label: '₹5+ Lakhs PA' },
  { value: 800000, label: '₹8+ Lakhs PA' },
  { value: 1000000, label: '₹10+ Lakhs PA' },
  { value: 1200000, label: '₹12+ Lakhs PA' },
];

export default function FacultyFilterSheet({
  mode,
  isOpen = false,
  onClose,
  activeTab,
  totalCount,
  filteredCount,
  selectedDesignations,
  toggleDesignation,
  selectedSubjects,
  toggleSubject,
  selectedBoards,
  toggleBoard,
  selectedCities,
  toggleCity,
  selectedStates,
  toggleState,
  selectedJobTypes = [],
  toggleJobType,
  selectedPortals = [],
  togglePortal,
  minSalaryFilter,
  setMinSalaryFilter,
  urgentOnly,
  setUrgentOnly,
  forLadyOnly = false,
  setForLadyOnly,
  dynamicCounts,
  onResetAll,
  isSidebarMinimized = false,
  setIsSidebarMinimized,
  availableFacets = DEFAULT_JOB_FACETS,
}: FacultyFilterSheetProps) {

  // Collapsible section states (Naukri style)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    subject: true,
    designation: true,
    board: true,
    jobType: true,
    portal: true,
    salary: true,
    city: true,
    state: false,
  });

  // Local filter search states
  const [subjectQuery, setSubjectQuery] = useState('');
  const [cityQuery, setCityQuery] = useState('');

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const hasAnyFilter =
    selectedDesignations.length > 0 ||
    selectedSubjects.length > 0 ||
    selectedBoards.length > 0 ||
    selectedCities.length > 0 ||
    selectedStates.length > 0 ||
    selectedJobTypes.length > 0 ||
    selectedPortals.length > 0 ||
    minSalaryFilter > 0 ||
    urgentOnly ||
    forLadyOnly;

  // Stably ordered subjects (fixed sequence prevents items jumping on selection)
  const dynamicSubjects = useMemo(() => {
    const list = availableFacets.subjects.map((s) => ({
      ...s,
      currentCount: (dynamicCounts?.subjects && dynamicCounts.subjects[s.id] !== undefined) ? dynamicCounts.subjects[s.id] : 0,
    }));

    if (subjectQuery.trim()) {
      const q = subjectQuery.toLowerCase().trim();
      return list.filter((s) => s.label.toLowerCase().includes(q));
    }

    return list;
  }, [availableFacets.subjects, dynamicCounts?.subjects, subjectQuery]);

  // Stably ordered designations (fixed sequence prevents items jumping on selection)
  const dynamicDesignations = useMemo(() => {
    return availableFacets.designations.map((d) => ({
      ...d,
      currentCount: (dynamicCounts?.designations && dynamicCounts.designations[d.id] !== undefined) ? dynamicCounts.designations[d.id] : 0,
    }));
  }, [availableFacets.designations, dynamicCounts?.designations]);

  // Stably ordered boards (fixed sequence)
  const dynamicBoards = useMemo(() => {
    return availableFacets.boards.map((b) => ({
      ...b,
      currentCount: (dynamicCounts?.boards && dynamicCounts.boards[b.id] !== undefined) ? dynamicCounts.boards[b.id] : 0,
    }));
  }, [availableFacets.boards, dynamicCounts?.boards]);

  // Stably ordered cities (fixed sequence prevents jumping on selection)
  const dynamicCities = useMemo(() => {
    let list = availableFacets.cities.map((c) => ({
      ...c,
      currentCount: (dynamicCounts?.cities && dynamicCounts.cities[c.id] !== undefined) ? dynamicCounts.cities[c.id] : 0,
    }));

    if (cityQuery.trim()) {
      const q = cityQuery.toLowerCase().trim();
      return list.filter((c) => c.label.toLowerCase().includes(q));
    }

    return list;
  }, [availableFacets.cities, dynamicCounts?.cities, cityQuery]);

  // Stably ordered states (fixed sequence prevents jumping on selection)
  const dynamicStates = useMemo(() => {
    return availableFacets.states.map((st) => ({
      ...st,
      currentCount: (dynamicCounts?.states && dynamicCounts.states[st.id] !== undefined) ? dynamicCounts.states[st.id] : 0,
    }));
  }, [availableFacets.states, dynamicCounts?.states]);

  // Stably ordered portals (fixed sequence)
  const dynamicPortals = useMemo(() => {
    return availableFacets.portals
      .filter((p) => p.id !== 'Direct School Portal' && !p.id.toLowerCase().includes('direct school'))
      .map((p) => ({
        ...p,
        currentCount: (dynamicCounts?.portals && dynamicCounts.portals[p.id] !== undefined) ? dynamicCounts.portals[p.id] : 0,
      }));
  }, [availableFacets.portals, dynamicCounts?.portals]);

  const filterContent = (
    <div className="flex flex-col h-full min-h-full min-h-0 flex-1 bg-white rounded-none md:border-r md:border-b md:border-slate-200 shadow-none overflow-hidden">
      
      {/* Header */}
      <div className="p-3 sm:p-3.5 border-b border-slate-200 flex items-start justify-between bg-white shrink-0 sticky top-0 z-10 shadow-2xs gap-2">
        <div className="flex items-start gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-full bg-blue-50 text-[#005689] flex items-center justify-center shrink-0 mt-0.5">
            <SlidersHorizontal size={14} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                Filters
              </span>
              {hasAnyFilter && (
                <span className="text-[10px] font-semibold text-[#005689] bg-[#EDF5FA] px-1.5 py-0.2 rounded-full border border-[#DDF0FC]">
                  Active
                </span>
              )}
            </div>
            <p className="text-[11px] text-gray-500 font-medium truncate">
              {filteredCount} of {totalCount} results
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {hasAnyFilter && (
            <button
              type="button"
              onClick={onResetAll}
              className="px-2 py-0.5 rounded-full text-[11px] font-semibold text-[#005689] hover:bg-[#EDF5FA] border border-[#005689]/30 transition cursor-pointer"
              title="Reset all active filters"
            >
              Reset
            </button>
          )}

          {mode === 'sidebar' && setIsSidebarMinimized && (
            <button
              type="button"
              onClick={() => setIsSidebarMinimized(true)}
              className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition cursor-pointer"
              title="Minimise Filters"
            >
              <ChevronLeft size={16} />
            </button>
          )}

          {mode === 'sheet' && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition cursor-pointer"
              title="Close Filters"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Accordion List Body */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-5 text-xs divide-y divide-slate-100 custom-scrollbar">

        {/* 1. Subject Discipline (DYNAMIC & SEARCHABLE) */}
        <div id="filter-subject" className="space-y-2.5 scroll-mt-3">
          <button
            type="button"
            onClick={() => toggleSection('subject')}
            className="w-full flex items-center justify-between text-left font-bold text-slate-900 text-sm hover:text-[#005689] transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <span>Subject Discipline</span>
              {selectedSubjects.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-[#005689] text-white text-[10px] font-bold">
                  {selectedSubjects.length}
                </span>
              )}
            </span>
            {openSections.subject ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {openSections.subject && (
            <div className="space-y-2 pt-1 animate-in fade-in duration-150">
              {/* Quick Search in Subjects */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={subjectQuery}
                  onChange={(e) => setSubjectQuery(e.target.value)}
                  placeholder="Search subject (e.g. Physics, Math)..."
                  className="w-full pl-8 pr-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:border-[#005689] focus:outline-none"
                />
              </div>

              {/* Scrollable Subjects List */}
              <div className="max-h-56 overflow-y-auto custom-scrollbar pr-1 space-y-1">
                {dynamicSubjects.map((opt) => {
                  const count = opt.currentCount;
                  const isChecked = selectedSubjects.includes(opt.id);
                  const isZero = count === 0 && !isChecked;

                  return (
                    <label
                      key={opt.id}
                      className={`flex items-center justify-between select-none py-1 px-1.5 rounded-lg transition-colors ${
                        isChecked ? 'bg-blue-50/70 font-semibold text-[#005689]' : ''
                      } ${
                        isZero
                          ? 'opacity-30 cursor-not-allowed text-slate-400 bg-slate-50/40'
                          : 'group cursor-pointer text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          disabled={isZero}
                          onChange={() => !isZero && toggleSubject(opt.id)}
                          className={`w-3.5 h-3.5 rounded border-slate-300 text-[#005689] focus:ring-[#005689] ${
                            isZero ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'
                          }`}
                        />
                        <span className={`truncate text-xs ${isChecked ? 'font-bold text-[#005689]' : isZero ? 'text-slate-400' : 'text-slate-800'}`}>
                          {opt.label}
                        </span>
                      </div>
                      <span className={`text-[11px] font-mono shrink-0 ml-2 ${isChecked ? 'font-bold text-[#005689]' : 'text-slate-400'}`}>
                        ({count})
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 2. Designation / Teaching Level (DYNAMIC) */}
        <div id="filter-designation" className="pt-4 space-y-2.5 scroll-mt-3">
          <button
            type="button"
            onClick={() => toggleSection('designation')}
            className="w-full flex items-center justify-between text-left font-bold text-slate-900 text-sm hover:text-[#005689] transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <span>Teaching Level</span>
              {selectedDesignations.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-[#005689] text-white text-[10px] font-bold">
                  {selectedDesignations.length}
                </span>
              )}
            </span>
            {openSections.designation ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {openSections.designation && (
            <div className="space-y-1 pt-1 animate-in fade-in duration-150">
              {dynamicDesignations.map((opt) => {
                const count = opt.currentCount;
                const isChecked = selectedDesignations.includes(opt.id);
                const isZero = count === 0 && !isChecked;

                return (
                  <label
                    key={opt.id}
                    className={`flex items-center justify-between select-none py-1 px-1.5 rounded-lg transition-colors ${
                      isChecked ? 'bg-blue-50/70 font-semibold text-[#005689]' : ''
                    } ${
                      isZero
                        ? 'opacity-30 cursor-not-allowed text-slate-400 bg-slate-50/40'
                        : 'group cursor-pointer text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        disabled={isZero}
                        onChange={() => !isZero && (() => toggleDesignation(opt.id))()}
                        className={`w-3.5 h-3.5 rounded border-slate-300 text-[#005689] focus:ring-[#005689] ${
                          isZero ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'
                        }`}
                      />
                      <span className={`truncate text-xs ${isChecked ? 'font-bold text-[#005689]' : isZero ? 'text-slate-400' : 'text-slate-800'}`}>
                        {opt.label}
                      </span>
                    </div>
                    <span className={`text-[11px] font-mono shrink-0 ml-2 ${isChecked ? 'font-bold text-[#005689]' : 'text-slate-400'}`}>
                      ({count})
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* 3. Curriculum Board (DYNAMIC) */}
        <div id="filter-board" className="pt-4 space-y-2.5 scroll-mt-3">
          <button
            type="button"
            onClick={() => toggleSection('board')}
            className="w-full flex items-center justify-between text-left font-bold text-slate-900 text-sm hover:text-[#005689] transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <span>Curriculum Board</span>
              {selectedBoards.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-[#005689] text-white text-[10px] font-bold">
                  {selectedBoards.length}
                </span>
              )}
            </span>
            {openSections.board ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {openSections.board && (
            <div className="space-y-1 pt-1 animate-in fade-in duration-150">
              {dynamicBoards.map((opt) => {
                const count = opt.currentCount;
                const isChecked = selectedBoards.includes(opt.id);
                const isZero = count === 0 && !isChecked;

                return (
                  <label
                    key={opt.id}
                    className={`flex items-center justify-between select-none py-1 px-1.5 rounded-lg transition-colors ${
                      isChecked ? 'bg-blue-50/70 font-semibold text-[#005689]' : ''
                    } ${
                      isZero
                        ? 'opacity-30 cursor-not-allowed text-slate-400 bg-slate-50/40'
                        : 'group cursor-pointer text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        disabled={isZero}
                        onChange={() => !isZero && (() => toggleBoard(opt.id))()}
                        className={`w-3.5 h-3.5 rounded border-slate-300 text-[#005689] focus:ring-[#005689] ${
                          isZero ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'
                        }`}
                      />
                      <span className={`truncate text-xs ${isChecked ? 'font-bold text-[#005689]' : isZero ? 'text-slate-400' : 'text-slate-800'}`}>
                        {opt.label}
                      </span>
                    </div>
                    <span className={`text-[11px] font-mono shrink-0 ml-2 ${isChecked ? 'font-bold text-[#005689]' : 'text-slate-400'}`}>
                      ({count})
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* 4. Employment / Job Type (Full Time, Part Time, Remote, On-site) */}
        {toggleJobType && (
          <div id="filter-jobtype" className="pt-4 space-y-2.5 scroll-mt-3">
            <button
              type="button"
              onClick={() => toggleSection('jobType')}
              className="w-full flex items-center justify-between text-left font-bold text-slate-900 text-sm hover:text-[#005689] transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <span>Job Type / Work Mode</span>
                {selectedJobTypes.length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                )}
              </span>
              {openSections.jobType ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {openSections.jobType && (
              <div className="space-y-1 pt-1 animate-in fade-in duration-150">
                {JOB_TYPE_OPTIONS.map((opt) => {
                  const isChecked = selectedJobTypes.includes(opt.id);
                  return (
                    <label
                      key={opt.id}
                      className="flex items-center justify-between group cursor-pointer text-slate-700 hover:text-slate-900 select-none py-1 px-1.5 rounded-lg"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleJobType(opt.id)}
                          className="w-3.5 h-3.5 rounded border-slate-300 text-[#005689] focus:ring-[#005689] cursor-pointer"
                        />
                        <span className={`truncate text-xs ${isChecked ? 'font-bold text-[#005689]' : 'text-slate-800'}`}>
                          {opt.label}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 5. Source Portal (DYNAMIC) */}
        {togglePortal && (
          <div id="filter-portal" className="pt-4 space-y-2.5 scroll-mt-3">
            <button
              type="button"
              onClick={() => toggleSection('portal')}
              className="w-full flex items-center justify-between text-left font-bold text-slate-900 text-sm hover:text-[#005689] transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <span>Source Portal</span>
                {selectedPortals.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-[#005689] text-white text-[10px] font-bold">
                    {selectedPortals.length}
                  </span>
                )}
              </span>
              {openSections.portal ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {openSections.portal && (
              <div className="space-y-1 pt-1 animate-in fade-in duration-150">
                {dynamicPortals.map((opt) => {
                  const count = opt.currentCount;
                  const isChecked = selectedPortals.includes(opt.id);
                  const isZero = count === 0 && !isChecked;

                  return (
                    <label
                      key={opt.id}
                      className={`flex items-center justify-between select-none py-1 px-1.5 rounded-lg transition-colors ${
                        isChecked ? 'bg-blue-50/70 font-semibold text-[#005689]' : ''
                      } ${
                        isZero
                          ? 'opacity-30 cursor-not-allowed text-slate-400 bg-slate-50/40'
                          : 'group cursor-pointer text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          disabled={isZero}
                          onChange={() => !isZero && togglePortal(opt.id)}
                          className={`w-3.5 h-3.5 rounded border-slate-300 text-[#005689] focus:ring-[#005689] ${
                            isZero ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'
                          }`}
                        />
                        <span className={`truncate text-xs ${isChecked ? 'font-bold text-[#005689]' : isZero ? 'text-slate-400' : 'text-slate-800'}`}>
                          {opt.label}
                        </span>
                      </div>
                      <span className={`text-[11px] font-mono shrink-0 ml-2 ${isChecked ? 'font-bold text-[#005689]' : 'text-slate-400'}`}>
                        ({count})
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 6. Salary / Compensation */}
        {activeTab === 'jobs' && (
          <div id="filter-salary" className="pt-4 space-y-2.5 scroll-mt-3">
            <button
              type="button"
              onClick={() => toggleSection('salary')}
              className="w-full flex items-center justify-between text-left font-bold text-slate-900 text-sm hover:text-[#005689] transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <span>Minimum Package</span>
                {minSalaryFilter > 0 && (
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                )}
              </span>
              {openSections.salary ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {openSections.salary && (
              <div className="space-y-1.5 pt-1 animate-in fade-in duration-150">
                {SALARY_OPTIONS.map((opt) => {
                  const isChecked = minSalaryFilter === opt.value;
                  return (
                    <button
                      type="button"
                      key={opt.value}
                      onClick={() => setMinSalaryFilter(isChecked ? 0 : opt.value)}
                      className={`w-full flex items-center justify-between group cursor-pointer select-none py-1.5 px-2 rounded-lg transition-colors text-left ${
                        isChecked ? 'bg-blue-50/70 font-semibold text-[#005689]' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                            isChecked
                              ? 'border-[#005689] bg-white shadow-2xs'
                              : 'border-slate-400 bg-white group-hover:border-slate-500'
                          }`}
                        >
                          {isChecked && (
                            <div className="w-2 h-2 rounded-full bg-[#005689]" />
                          )}
                        </div>
                        <span className={`text-xs transition-colors ${isChecked ? 'font-bold text-[#005689]' : 'text-slate-800'}`}>
                          {opt.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 7. City / Location (DYNAMIC & SEARCHABLE) */}
        <div id="filter-city" className="pt-4 space-y-2.5 scroll-mt-3">
          <button
            type="button"
            onClick={() => toggleSection('city')}
            className="w-full flex items-center justify-between text-left font-bold text-slate-900 text-sm hover:text-[#005689] transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <span>City / Metro Hub</span>
              {selectedCities.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-[#005689] text-white text-[10px] font-bold">
                  {selectedCities.length}
                </span>
              )}
            </span>
            {openSections.city ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {openSections.city && (
            <div className="space-y-2 pt-1 animate-in fade-in duration-150">
              {/* City quick search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={cityQuery}
                  onChange={(e) => setCityQuery(e.target.value)}
                  placeholder="Search city (e.g. Delhi, Mumbai)..."
                  className="w-full pl-8 pr-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:border-[#005689] focus:outline-none"
                />
              </div>

              <div className="max-h-56 overflow-y-auto custom-scrollbar pr-1 space-y-1">
                {dynamicCities.map((opt) => {
                  const count = opt.currentCount;
                  const isChecked = selectedCities.includes(opt.id);
                  const isZero = count === 0 && !isChecked;

                  return (
                    <label
                      key={opt.id}
                      className={`flex items-center justify-between select-none py-1 px-1.5 rounded-lg transition-colors ${
                        isChecked ? 'bg-blue-50/70 font-semibold text-[#005689]' : ''
                      } ${
                        isZero
                          ? 'opacity-30 cursor-not-allowed text-slate-400 bg-slate-50/40'
                          : 'group cursor-pointer text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          disabled={isZero}
                          onChange={() => !isZero && toggleCity(opt.id)}
                          className={`w-3.5 h-3.5 rounded border-slate-300 text-[#005689] focus:ring-[#005689] ${
                            isZero ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'
                          }`}
                        />
                        <span className={`truncate text-xs ${isChecked ? 'font-bold text-[#005689]' : isZero ? 'text-slate-400' : 'text-slate-800'}`}>
                          {opt.label}
                        </span>
                      </div>
                      <span className={`text-[11px] font-mono shrink-0 ml-2 ${isChecked ? 'font-bold text-[#005689]' : 'text-slate-400'}`}>
                        ({count})
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 8. State / UT (DYNAMIC) */}
        <div id="filter-state" className="pt-4 space-y-2.5 scroll-mt-3">
          <button
            type="button"
            onClick={() => toggleSection('state')}
            className="w-full flex items-center justify-between text-left font-bold text-slate-900 text-sm hover:text-[#005689] transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <span>State / UT</span>
              {selectedStates.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-[#005689] text-white text-[10px] font-bold">
                  {selectedStates.length}
                </span>
              )}
            </span>
            {openSections.state ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {openSections.state && (
            <div className="space-y-1 pt-1 max-h-56 overflow-y-auto custom-scrollbar pr-1 animate-in fade-in duration-150">
              {dynamicStates.map((opt) => {
                const count = opt.currentCount;
                const isChecked = selectedStates.includes(opt.id);
                const isZero = count === 0 && !isChecked;

                return (
                  <label
                    key={opt.id}
                    className={`flex items-center justify-between select-none py-1 px-1.5 rounded-lg transition-colors ${
                      isChecked ? 'bg-blue-50/70 font-semibold text-[#005689]' : ''
                    } ${
                      isZero
                        ? 'opacity-30 cursor-not-allowed text-slate-400 bg-slate-50/40'
                        : 'group cursor-pointer text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        disabled={isZero}
                        onChange={() => !isZero && (() => toggleState(opt.id))()}
                        className={`w-3.5 h-3.5 rounded border-slate-300 text-[#005689] focus:ring-[#005689] ${
                          isZero ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'
                        }`}
                      />
                      <span className={`truncate text-xs ${isChecked ? 'font-bold text-[#005689]' : isZero ? 'text-slate-400' : 'text-slate-800'}`}>
                        {opt.label}
                      </span>
                    </div>
                    <span className={`text-[11px] font-mono shrink-0 ml-2 ${isChecked ? 'font-bold text-[#005689]' : 'text-slate-400'}`}>
                      ({count})
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* 9. Urgency Hiring */}
        <div id="filter-urgent" className="pt-4 scroll-mt-3">
          <label className="flex items-center gap-2.5 group cursor-pointer select-none py-1 px-1.5 rounded-lg hover:bg-red-50/50 transition-colors">
            <input
              type="checkbox"
              checked={urgentOnly}
              onChange={(e) => setUrgentOnly(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-red-600 focus:ring-red-600 cursor-pointer"
            />
            <span className="text-xs font-bold text-red-700 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-red-600 fill-red-600" />
              <span>Urgently Hiring Only</span>
            </span>
          </label>
        </div>

        {/* 10. For Lady / Women Only */}
        <div id="filter-lady" className="pt-2 scroll-mt-3">
          <label className="flex items-center justify-between group cursor-pointer select-none py-1.5 px-2 rounded-lg hover:bg-rose-50 border border-rose-100 bg-rose-50/30 transition-colors">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={forLadyOnly}
                onChange={(e) => setForLadyOnly?.(e.target.checked)}
                className="w-4 h-4 rounded border-rose-300 text-rose-600 focus:ring-rose-600 cursor-pointer"
              />
              <span className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                <span>For Lady / Women Only</span>
              </span>
            </div>
            <span className="text-[11px] font-mono font-bold text-rose-700 bg-rose-100/80 px-1.5 py-0.2 rounded-full">
              {dynamicCounts.forLady ?? 28}
            </span>
          </label>
        </div>

      </div>

      {/* Sheet bottom button on mobile */}
      {mode === 'sheet' && onClose && (
        <div className="p-3.5 bg-white border-t border-slate-200 flex items-center gap-2.5 shrink-0 shadow-lg mt-auto">
          {hasAnyFilter && (
            <button
              type="button"
              onClick={onResetAll}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition cursor-pointer shrink-0"
            >
              Clear All
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 bg-[#005689] hover:bg-[#003c6e] text-white rounded-xl text-xs font-bold shadow-md active:scale-[0.98] transition cursor-pointer text-center"
          >
            Show {filteredCount} Results
          </button>
        </div>
      )}

    </div>
  );

  if (mode === 'sheet') {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-[99990] flex animate-in fade-in duration-200">
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity cursor-pointer"
          onClick={onClose}
          aria-hidden="true"
        />
        <div className="relative z-10 w-[82vw] max-w-[340px] min-w-[280px] h-full min-h-full max-h-[100dvh] bg-white shadow-2xl flex flex-col min-h-0 overflow-hidden animate-in slide-in-from-left duration-300">
          {filterContent}
        </div>
      </div>
    );
  }

  return (
    <aside
      className={`
        hidden md:flex flex-col md:fixed md:left-0 md:w-64 lg:w-72 md:z-30 md:translate-x-0 md:bg-white md:shadow-none directory-sidebar-fixed rounded-none transition-all duration-300
        ${isSidebarMinimized ? 'md:hidden' : ''}
      `}
    >
      <div className="flex-1 overflow-y-auto overflow-x-hidden bg-white rounded-none md:border-r md:border-b md:border-gray-200 md:shadow-xs p-0 flex flex-col custom-scrollbar h-full">
        {filterContent}
      </div>
    </aside>
  );
}
