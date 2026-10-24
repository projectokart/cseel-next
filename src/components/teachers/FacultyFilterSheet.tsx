'use client';

import React, { useState } from 'react';
import {
  SlidersHorizontal, X, RotateCcw, Check, ChevronDown, ChevronUp, ChevronLeft,
  GraduationCap, Award, MapPin, Building2, Briefcase, DollarSign,
  Zap, Flame, BookOpen, Layers, CheckCircle2, ShieldCheck, ChevronRight
} from 'lucide-react';

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
  dynamicCounts: {
    designations: Record<string, number>;
    subjects: Record<string, number>;
    boards: Record<string, number>;
    cities: Record<string, number>;
    states: Record<string, number>;
  };
  onResetAll: () => void;
  // Sidebar minimize
  isSidebarMinimized?: boolean;
  setIsSidebarMinimized?: (minimized: boolean) => void;
}

const DESIGNATION_OPTIONS = [
  { id: 'PGT', label: 'PGT (Class 11-12)' },
  { id: 'TGT', label: 'TGT (Class 6-10)' },
  { id: 'PRT', label: 'PRT (Primary 1-5)' },
  { id: 'Lab In-Charge', label: 'Composite Lab In-Charge' },
  { id: 'ATL Mentor', label: 'ATL Tinkering Lab Mentor' },
];

const SUBJECT_OPTIONS = [
  { id: 'Physics', label: 'Physics' },
  { id: 'Chemistry', label: 'Chemistry' },
  { id: 'Biology', label: 'Biology' },
  { id: 'Mathematics', label: 'Mathematics' },
  { id: 'Robotics & AI', label: 'Robotics & AI' },
  { id: 'Computer Science', label: 'Computer Science' },
  { id: 'General Science', label: 'General Science' },
  { id: 'Composite Lab', label: 'Composite Lab' },
];

const BOARD_OPTIONS = [
  { id: 'CBSE', label: 'CBSE' },
  { id: 'ICSE', label: 'ICSE / CISCE' },
  { id: 'Cambridge / IB', label: 'Cambridge / IB' },
];

const JOB_TYPE_OPTIONS = [
  { id: 'Full-Time', label: 'Full Time' },
  { id: 'Part-Time', label: 'Part Time' },
  { id: 'Remote', label: 'Online / Remote' },
  { id: 'On-site', label: 'Offline / On-site' },
];

const PORTAL_OPTIONS = [
  { id: 'Naukri.com', label: 'Naukri.com' },
  { id: 'Indeed', label: 'Indeed' },
  { id: 'LinkedIn', label: 'LinkedIn' },
  { id: 'Direct School Portal', label: 'Direct Portal' },
];

const CITY_OPTIONS = [
  { id: 'Delhi', label: 'Delhi NCR' },
  { id: 'Gurugram', label: 'Gurugram' },
  { id: 'Noida', label: 'Noida' },
  { id: 'Mumbai', label: 'Mumbai' },
  { id: 'Pune', label: 'Pune' },
  { id: 'Bengaluru', label: 'Bengaluru' },
  { id: 'Hyderabad', label: 'Hyderabad' },
  { id: 'Jaipur', label: 'Jaipur' },
  { id: 'Chandigarh', label: 'Chandigarh' },
  { id: 'Kolkata', label: 'Kolkata' },
];

const SALARY_OPTIONS = [
  { value: 0, label: 'Any Package' },
  { value: 600000, label: '₹6+ Lacs PA' },
  { value: 800000, label: '₹8+ Lacs PA' },
  { value: 1000000, label: '₹10+ Lacs PA' },
  { value: 1200000, label: '₹12+ Lacs PA' },
];

const STATE_OPTIONS = [
  { id: 'Delhi NCR', label: 'Delhi NCR' },
  { id: 'Uttar Pradesh', label: 'Uttar Pradesh' },
  { id: 'Haryana', label: 'Haryana' },
  { id: 'Maharashtra', label: 'Maharashtra' },
  { id: 'Rajasthan', label: 'Rajasthan' },
  { id: 'Punjab', label: 'Punjab' },
  { id: 'Karnataka', label: 'Karnataka' },
  { id: 'Tamil Nadu', label: 'Tamil Nadu' },
  { id: 'Telangana', label: 'Telangana' },
  { id: 'Madhya Pradesh', label: 'Madhya Pradesh' },
  { id: 'Gujarat', label: 'Gujarat' },
  { id: 'West Bengal', label: 'West Bengal' },
  { id: 'Uttarakhand', label: 'Uttarakhand' },
  { id: 'Bihar', label: 'Bihar' },
  { id: 'Kerala', label: 'Kerala' },
  { id: 'Odisha', label: 'Odisha' },
  { id: 'Chandigarh', label: 'Chandigarh' },
  { id: 'Andhra Pradesh', label: 'Andhra Pradesh' },
  { id: 'Jharkhand', label: 'Jharkhand' },
  { id: 'Himachal Pradesh', label: 'Himachal Pradesh' },
  { id: 'Assam', label: 'Assam' },
  { id: 'Goa', label: 'Goa' },
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
  dynamicCounts,
  onResetAll,
  isSidebarMinimized = false,
  setIsSidebarMinimized,
}: FacultyFilterSheetProps) {

  // Collapsible section states (Naukri style)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    designation: true,
    subject: true,
    board: true,
    jobType: true,
    portal: true,
    salary: true,
    city: true,
    state: true,
  });

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
    urgentOnly;

  const scrollToSection = (id: string, sectionKey?: string) => {
    if (sectionKey) {
      setOpenSections((prev) => ({ ...prev, [sectionKey]: true }));
    }
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
  };

  const filterContent = (
    <div className="flex flex-col h-full bg-white rounded-none md:border-r md:border-b md:border-slate-200 shadow-none overflow-hidden">
      
      {/* Header */}
      <div className="p-3.5 sm:p-4 border-b border-slate-200 flex items-center justify-between bg-white shrink-0 sticky top-0 z-10 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-blue-50 text-[#005689] flex items-center justify-center shrink-0">
            <SlidersHorizontal size={15} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                Filters
              </span>
              {hasAnyFilter && (
                <span className="text-[10px] font-semibold text-[#005689] bg-[#EDF5FA] px-2 py-0.5 rounded-full border border-[#DDF0FC]">
                  Active
                </span>
              )}
            </div>
            <p className="text-[11px] text-gray-500 font-medium">
              {filteredCount} of {totalCount} opportunities match
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasAnyFilter && (
            <button
              type="button"
              onClick={onResetAll}
              className="px-2.5 py-1 rounded-full text-xs font-semibold text-[#005689] hover:bg-[#EDF5FA] border border-[#005689]/30 transition cursor-pointer"
              title="Reset all active filters"
            >
              Reset
            </button>
          )}

          {mode === 'sidebar' && setIsSidebarMinimized && (
            <button
              type="button"
              onClick={() => setIsSidebarMinimized(true)}
              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition cursor-pointer"
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
      <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs divide-y divide-slate-100 custom-scrollbar">

        {/* 1. Designation / Teaching Level */}
        <div id="filter-designation" className="space-y-2.5 scroll-mt-3">
          <button
            type="button"
            onClick={() => toggleSection('designation')}
            className="w-full flex items-center justify-between text-left font-bold text-slate-900 text-sm hover:text-[#005689] transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <span>Teaching Level</span>
              {selectedDesignations.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-blue-600" />
              )}
            </span>
            {openSections.designation ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {openSections.designation && (
            <div className="space-y-2 pt-1 animate-in fade-in duration-150">
              {DESIGNATION_OPTIONS.map((opt) => {
                const count = dynamicCounts.designations[opt.id] || 0;
                const isChecked = selectedDesignations.includes(opt.id);
                return (
                  <label
                    key={opt.id}
                    className="flex items-center justify-between group cursor-pointer text-slate-700 hover:text-slate-900 select-none py-0.5"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleDesignation(opt.id)}
                        className="w-4 h-4 rounded border-slate-300 text-[#005689] focus:ring-[#005689] cursor-pointer"
                      />
                      <span className={`truncate text-xs ${isChecked ? 'font-bold text-slate-900' : 'font-medium'}`}>
                        {opt.label}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono shrink-0 ml-2">
                      ({count})
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* 2. Subject Specialization */}
        <div id="filter-subject" className="pt-4 space-y-2.5 scroll-mt-3">
          <button
            type="button"
            onClick={() => toggleSection('subject')}
            className="w-full flex items-center justify-between text-left font-bold text-slate-900 text-sm hover:text-[#005689] transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <span>Subject Discipline</span>
              {selectedSubjects.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-blue-600" />
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
              {SUBJECT_OPTIONS.map((opt) => {
                const count = dynamicCounts.subjects[opt.id] || 0;
                const isChecked = selectedSubjects.includes(opt.id);
                return (
                  <label
                    key={opt.id}
                    className="flex items-center justify-between group cursor-pointer text-slate-700 hover:text-slate-900 select-none py-0.5"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleSubject(opt.id)}
                        className="w-4 h-4 rounded border-slate-300 text-[#005689] focus:ring-[#005689] cursor-pointer"
                      />
                      <span className={`truncate text-xs ${isChecked ? 'font-bold text-slate-900' : 'font-medium'}`}>
                        {opt.label}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono shrink-0 ml-2">
                      ({count})
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* 3. Curriculum Board */}
        <div id="filter-board" className="pt-4 space-y-2.5 scroll-mt-3">
          <button
            type="button"
            onClick={() => toggleSection('board')}
            className="w-full flex items-center justify-between text-left font-bold text-slate-900 text-sm hover:text-[#005689] transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <span>Curriculum Board</span>
              {selectedBoards.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-blue-600" />
              )}
            </span>
            {openSections.board ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {openSections.board && (
            <div className="space-y-2 pt-1 animate-in fade-in duration-150">
              {BOARD_OPTIONS.map((opt) => {
                const count = dynamicCounts.boards[opt.id] || 0;
                const isChecked = selectedBoards.includes(opt.id);
                return (
                  <label
                    key={opt.id}
                    className="flex items-center justify-between group cursor-pointer text-slate-700 hover:text-slate-900 select-none py-0.5"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleBoard(opt.id)}
                        className="w-4 h-4 rounded border-slate-300 text-[#005689] focus:ring-[#005689] cursor-pointer"
                      />
                      <span className={`truncate text-xs ${isChecked ? 'font-bold text-slate-900' : 'font-medium'}`}>
                        {opt.label}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono shrink-0 ml-2">
                      ({count})
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* 4. Employment / Job Type (Full Time, Part Time, Remote/Online, Offline) */}
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
              <div className="space-y-2 pt-1 animate-in fade-in duration-150">
                {JOB_TYPE_OPTIONS.map((opt) => {
                  const isChecked = selectedJobTypes.includes(opt.id);
                  return (
                    <label
                      key={opt.id}
                      className="flex items-center justify-between group cursor-pointer text-slate-700 hover:text-slate-900 select-none py-0.5"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleJobType(opt.id)}
                          className="w-4 h-4 rounded border-slate-300 text-[#005689] focus:ring-[#005689] cursor-pointer"
                        />
                        <span className={`truncate text-xs ${isChecked ? 'font-bold text-slate-900' : 'font-medium'}`}>
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

        {/* 5. Source Portal (Naukri, Indeed, LinkedIn, Direct Portal) */}
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
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                )}
              </span>
              {openSections.portal ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {openSections.portal && (
              <div className="space-y-2 pt-1 animate-in fade-in duration-150">
                {PORTAL_OPTIONS.map((opt) => {
                  const isChecked = selectedPortals.includes(opt.id);
                  return (
                    <label
                      key={opt.id}
                      className="flex items-center justify-between group cursor-pointer text-slate-700 hover:text-slate-900 select-none py-0.5"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => togglePortal(opt.id)}
                          className="w-4 h-4 rounded border-slate-300 text-[#005689] focus:ring-[#005689] cursor-pointer"
                        />
                        <span className={`truncate text-xs ${isChecked ? 'font-bold text-slate-900' : 'font-medium'}`}>
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

        {/* 4. Salary / Compensation */}
        {activeTab === 'jobs' && (
          <div id="filter-salary" className="pt-4 space-y-2.5 scroll-mt-3">
            <button
              type="button"
              onClick={() => toggleSection('salary')}
              className="w-full flex items-center justify-between text-left font-bold text-slate-900 text-sm hover:text-[#005689] transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <span>Salary Bracket</span>
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
                    <label
                      key={opt.value}
                      className="flex items-center justify-between group cursor-pointer text-slate-700 hover:text-slate-900 select-none py-0.5"
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="salaryFilter"
                          checked={isChecked}
                          onChange={() => setMinSalaryFilter(opt.value)}
                          className="w-4 h-4 border-slate-300 text-[#005689] focus:ring-[#005689] cursor-pointer"
                        />
                        <span className={`text-xs ${isChecked ? 'font-bold text-slate-900' : 'font-medium'}`}>
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

        {/* 5. City / Metro Location */}
        <div id="filter-city" className="pt-4 space-y-2.5 scroll-mt-3">
          <button
            type="button"
            onClick={() => toggleSection('city')}
            className="w-full flex items-center justify-between text-left font-bold text-slate-900 text-sm hover:text-[#005689] transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <span>Location</span>
              {selectedCities.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-blue-600" />
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
              {CITY_OPTIONS.map((opt) => {
                const count = dynamicCounts.cities[opt.id] || 0;
                const isChecked = selectedCities.includes(opt.id);
                return (
                  <label
                    key={opt.id}
                    className="flex items-center justify-between group cursor-pointer text-slate-700 hover:text-slate-900 select-none py-0.5"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleCity(opt.id)}
                        className="w-4 h-4 rounded border-slate-300 text-[#005689] focus:ring-[#005689] cursor-pointer"
                      />
                      <span className={`truncate text-xs ${isChecked ? 'font-bold text-slate-900' : 'font-medium'}`}>
                        {opt.label}
                      </span>
                    </div>
                    {count > 0 && (
                      <span className="text-[11px] text-slate-400 font-mono shrink-0 ml-2">
                        ({count})
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* 6. Indian States & Union Territories Filter */}
        <div id="filter-state" className="pt-4 space-y-2.5 scroll-mt-3">
          <button
            type="button"
            onClick={() => toggleSection('state')}
            className="w-full flex items-center justify-between text-left font-bold text-slate-900 text-sm hover:text-[#005689] transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <span>State / UT</span>
              {selectedStates.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-blue-600" />
              )}
            </span>
            {openSections.state ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {openSections.state && (
            <div className="space-y-2 pt-1 max-h-56 overflow-y-auto custom-scrollbar pr-1 animate-in fade-in duration-150">
              {STATE_OPTIONS.map((opt) => {
                const count = dynamicCounts.states[opt.id] || 0;
                const isChecked = selectedStates.includes(opt.id);
                return (
                  <label
                    key={opt.id}
                    className="flex items-center justify-between group cursor-pointer text-slate-700 hover:text-slate-900 select-none py-0.5"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleState(opt.id)}
                        className="w-4 h-4 rounded border-slate-300 text-[#005689] focus:ring-[#005689] cursor-pointer"
                      />
                      <span className={`truncate text-xs ${isChecked ? 'font-bold text-slate-900' : 'font-medium'}`}>
                        {opt.label}
                      </span>
                    </div>
                    {count > 0 && (
                      <span className="text-[11px] text-slate-400 font-mono shrink-0 ml-2">
                        ({count})
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* 7. Urgency Tag */}
        <div id="filter-urgent" className="pt-4 scroll-mt-3">
          <label className="flex items-center gap-2.5 group cursor-pointer select-none">
            <input
              type="checkbox"
              checked={urgentOnly}
              onChange={(e) => setUrgentOnly(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-red-600 focus:ring-red-600 cursor-pointer"
            />
            <span className="text-xs font-bold text-red-700">⚡ Urgently Hiring Only</span>
          </label>
        </div>

      </div>

      {/* Sheet bottom button on mobile */}
      {mode === 'sheet' && onClose && (
        <div className="p-3.5 bg-white border-t border-slate-200 flex items-center gap-2.5 shrink-0 shadow-lg">
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
        {/* Backdrop overlay (tap to close) */}
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity cursor-pointer"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Left-Side Drawer: occupies ~72% width ("half se thoda jada") */}
        <div className="relative z-10 w-[72vw] max-w-[340px] min-w-[270px] h-full bg-white shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-left duration-300">
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
