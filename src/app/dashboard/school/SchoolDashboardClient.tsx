'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LayoutWrapper, { ContentSubHeader } from '@/components/LayoutWrapper';
import {
  X,
  Home,
  Menu,
  PanelLeft,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Search,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Briefcase,
  School,
  Plus,
  Save,
  CheckCircle2,
  Clock,
  Eye,
  Trash2,
  Edit3,
  MapPin,
  Building,
  GraduationCap,
  Users,
  Send,
  AlertCircle,
  HelpCircle,
  Grid3X3,
  LogOut,
  Share2,
  Check,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';

interface SchoolJob {
  id: string;
  title: string;
  subject: string;
  grade: string;
  type: string;
  salary: string;
  experience: string;
  status: 'Pending Admin Review' | 'Live on Portal' | 'Closed';
  applicantsCount: number;
  postedDate: string;
}

export default function SchoolDashboardClient() {
  const router = useRouter();
  const { signOut } = useAuth();

  // Navigation State
  const [activeTab, setActiveTab] = useState<'home' | 'create-job' | 'my-jobs' | 'school-kyc'>('home');
  const [rail1Hovered, setRail1Hovered] = useState(false);
  const [rail2Open, setRail2Open] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      setRail2Open(true);
    }
  }, []);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Dropdown States
  const [createDropdownOpen, setCreateDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const createMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // School Profile Details
  const schoolName = 'Delhi Public School (R.K. Puram)';
  const udiseCode = '07010204803';
  const affiliationCode = 'CBSE Affiliation # 2730017';
  const schoolCity = 'South West Delhi, New Delhi';

  // Job Creation Form State
  const [jobTitle, setJobTitle] = useState('Senior Secondary PGT Physics Faculty');
  const [subject, setSubject] = useState('Physics');
  const [grade, setGrade] = useState('Class 11 - 12 (Senior Secondary)');
  const [employmentType, setEmploymentType] = useState('Full Time Regular');
  const [salaryRange, setSalaryRange] = useState('₹50,000 - ₹70,000 / month');
  const [experienceRequired, setExperienceRequired] = useState('3 - 5 Years');
  const [minQualifications, setMinQualifications] = useState('M.Sc in Physics (First Class) + B.Ed (Mandatory), CTET Paper 2 Qualified.');
  const [labRequirements, setLabRequirements] = useState('Candidate must be adept at handling senior secondary optical benches, spectrometer calibrations, and NEP experiential setups.');
  const [perks, setPerks] = useState('Campus Quarters / HRA, Medical Insurance, PF, Child Tuition Concession for 2 children.');
  const [deadline, setDeadline] = useState('2026-11-15');

  // Active Job Listings
  const [jobListings, setJobListings] = useState<SchoolJob[]>([
    {
      id: 'job-101',
      title: 'Senior Secondary PGT Physics Faculty',
      subject: 'Physics',
      grade: 'Class 11 - 12',
      type: 'Full Time',
      salary: '₹50,000 - ₹70,000 / mo',
      experience: '3 - 5 Years',
      status: 'Live on Portal',
      applicantsCount: 18,
      postedDate: '24 Oct 2026'
    },
    {
      id: 'job-102',
      title: 'Atal Tinkering Lab (ATL) Mentor & Robotics Trainer',
      subject: 'Robotics & AI',
      grade: 'Class 6 - 10',
      type: 'Contractual',
      salary: '₹35,000 - ₹48,000 / mo',
      experience: '1 - 3 Years',
      status: 'Pending Admin Review',
      applicantsCount: 6,
      postedDate: 'Today'
    },
    {
      id: 'job-103',
      title: 'TGT Chemistry & Experiential Science Instructor',
      subject: 'Chemistry',
      grade: 'Class 9 - 10',
      type: 'Full Time',
      salary: '₹42,000 - ₹55,000 / mo',
      experience: '2+ Years',
      status: 'Live on Portal',
      applicantsCount: 24,
      postedDate: '18 Oct 2026'
    }
  ]);

  const handleSelectTab = (tab: 'home' | 'create-job' | 'my-jobs' | 'school-kyc') => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setRail2Open(false);
    }
    if (activeTab === tab) return;
    setIsPageLoading(true);
    setActiveTab(tab);
    setTimeout(() => setIsPageLoading(false), 240);
  };

  const handlePostJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle.trim()) {
      alert('Please provide a job title.');
      return;
    }

    const newJob: SchoolJob = {
      id: `job-${Date.now()}`,
      title: jobTitle,
      subject,
      grade,
      type: employmentType,
      salary: salaryRange,
      experience: experienceRequired,
      status: 'Pending Admin Review',
      applicantsCount: 0,
      postedDate: 'Just now'
    };

    setJobListings([newJob, ...jobListings]);
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      handleSelectTab('my-jobs');
    }, 1200);
  };

  // Keyboard shortcut Ctrl+B for Rail 2 toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setRail2Open(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <LayoutWrapper
      portalName={schoolName}
      portalBadge="CBSE Affiliation # 2730017"
      badgeColor="bg-emerald-50 text-emerald-800 border-emerald-200"
      searchPlaceholder="Search faculty candidates, applicant resumes, physics..."
      roleIcon="school"
      onToggleSidebar={() => setRail2Open(prev => !prev)}
      isSidebarOpen={rail2Open}
      isLoading={isPageLoading}
    >

      {/* ═════════════════════════════════════════════════════════════
          2. DUAL-RAIL MAIN AREA (GA4 ARCHITECTURE)
         ═════════════════════════════════════════════════════════════ */}
      <div className="flex-1 h-[calc(100vh-48px)] max-h-[calc(100vh-48px)] flex overflow-hidden relative">
        
        {/* Fixed placeholder so underlying content never shifts */}
        <div className="portal-rail-placeholder w-[48px] min-w-[48px] max-w-[48px] h-full shrink-0" />

        {/* RAIL 1: ULTRA-COMPACT HOVER SLIDE-OVER RAIL */}
        <aside
          onMouseEnter={() => setRail1Hovered(true)}
          onMouseLeave={() => setRail1Hovered(false)}
          className={`portal-rail1 absolute top-0 left-0 h-full z-40 transition-all duration-200 ease-out bg-white ${
            rail1Hovered ? 'w-[220px] shadow-xl' : 'w-[48px] shadow-none'
          }`}
        >
          <div className="flex flex-col gap-1 w-full">
            {[
              { id: 'home', label: 'Home', icon: Home },
              { id: 'my-jobs', label: 'Active Vacancies', icon: Briefcase },
              { id: 'create-job', label: 'Post Faculty Job', icon: Plus },
              { id: 'school-kyc', label: 'School KYC & Profile', icon: School }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectTab(item.id as any)}
                  className={`portal-rail1-btn ${
                    isActive ? 'portal-rail1-btn-active' : 'portal-rail1-btn-inactive'
                  }`}
                  title={item.label}
                >
                  <div className="portal-rail1-icon-box">
                    <Icon className="portal-rail1-icon" />
                  </div>
                  <span className={`portal-rail1-label transition-all duration-150 ${
                    rail1Hovered ? 'opacity-100 max-w-[150px]' : 'opacity-0 max-w-0'
                  }`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Bottom Rail Items: Tasks + Settings (GA4 bottom-list) */}
          <div className="flex flex-col gap-1 w-full pt-1.5 border-t border-[#dadce0]">
            <button
              type="button"
              onClick={() => handleSelectTab('my-jobs')}
              className={`portal-rail1-btn ${
                activeTab === 'my-jobs'
                  ? 'portal-rail1-btn-active'
                  : 'portal-rail1-btn-inactive'
              }`}
              title="Tasks"
            >
              <div className="portal-rail1-icon-box">
                <CheckCircle2 className="w-4 h-4 fill-[#202124] text-white" />
              </div>
              <span className={`portal-rail1-label transition-all duration-150 ${
                rail1Hovered ? 'opacity-100 max-w-[120px]' : 'opacity-0 max-w-0'
              }`}>
                Tasks
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectTab('school-kyc')}
              className={`portal-rail1-btn ${
                activeTab === 'school-kyc'
                  ? 'portal-rail1-btn-active'
                  : 'portal-rail1-btn-inactive'
              }`}
              title="Settings & KYC"
            >
              <div className="portal-rail1-icon-box">
                <Settings className="w-4 h-4 text-[#202124]" />
              </div>
              <span className={`portal-rail1-label transition-all duration-150 ${
                rail1Hovered ? 'opacity-100 max-w-[150px]' : 'opacity-0 max-w-0'
              }`}>
                Settings &amp; KYC
              </span>
            </button>
          </div>
        </aside>

        {/* RAIL 2 TOGGLE EXPAND BUTTON (when Rail 2 is collapsed - GA4 Exact Tab) */}
        {!rail2Open && (
          <button
            type="button"
            onClick={() => setRail2Open(true)}
            className="portal-rail-expand-btn hidden md:flex"
            title="Expand navigation (Ctrl+B)"
          >
            <ChevronRight className="w-3.5 h-3.5 stroke-[2]" />
          </button>
        )}

        {/* RAIL 2: SUB-SIDEBAR (240px COLLAPSIBLE WITH Ctrl+B) */}
        {rail2Open && (
          <aside className="portal-rail2 h-full z-20">
            <div className="flex-1 overflow-y-auto">
              <div className="px-3 pb-2 border-b border-gray-100 mb-2">
                <h3 className="portal-rail2-header-title">
                  School Recruitment
                </h3>
                <p className="portal-rail2-header-sub">Post &amp; Track Faculty</p>
              </div>

              {/* "+ Create" Pill Button */}
              <div className="px-3 pb-3 relative" ref={createMenuRef}>
                <button
                  type="button"
                  onClick={() => setCreateDropdownOpen(prev => !prev)}
                  className="portal-rail2-create-btn"
                >
                  <div className="flex items-center gap-2">
                    <Plus className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                    <span>Post Opening</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#5f6368]" />
                </button>

                {createDropdownOpen && (
                  <div className="absolute left-2.5 right-2.5 mt-1 bg-white rounded-lg shadow-lg border border-[#dadce0] py-1 z-[800] text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setCreateDropdownOpen(false);
                        handleSelectTab('create-job');
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-emerald-50 flex items-center gap-2 text-[#202124] cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <div>
                        <p className="font-semibold text-xs">Post Faculty Vacancy</p>
                        <p className="text-[10px] text-[#5f6368]">Physics, Chemistry, ATL</p>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCreateDropdownOpen(false);
                        handleSelectTab('my-jobs');
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-emerald-50 flex items-center gap-2 text-[#202124] cursor-pointer"
                    >
                      <Briefcase className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <div>
                        <p className="font-semibold text-xs">Active Vacancies</p>
                        <p className="text-[10px] text-[#5f6368]">Track candidate resumes</p>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* Sub-Tabs */}
              <div className="space-y-0.5 px-2">
                {[
                  { id: 'my-jobs', label: 'Active Vacancies', icon: Briefcase, badge: `${jobListings.length}` },
                  { id: 'create-job', label: 'Post Faculty Job', icon: Plus, badge: 'New' },
                  { id: 'school-kyc', label: 'School KYC & Profile', icon: School, badge: 'CBSE' }
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id || (activeTab === 'home' && item.id === 'my-jobs');
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectTab(item.id as any)}
                      className={`portal-rail2-item ${
                        isActive ? 'portal-rail2-item-active' : 'portal-rail2-item-inactive'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Icon className="portal-rail2-item-icon text-emerald-600" />
                        <span className="truncate">{item.label}</span>
                      </div>
                      <span className="text-[10px] font-semibold bg-gray-100 text-[#5f6368] px-1.5 py-0.2 rounded">
                        {item.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Collapse Button */}
            <div className="p-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setRail2Open(false)}
                className="portal-rail-collapse-btn"
              >
                <ChevronLeft className="w-3.5 h-3.5 shrink-0" />
                <span>Collapse (Ctrl+B)</span>
              </button>
            </div>
          </aside>
        )}

        {/* ═════════════════════════════════════════════════════════════
            3. MAIN CANVAS AREA (HIGH DENSITY GOOGLE STANDARD DESIGN)
           ═════════════════════════════════════════════════════════════ */}
        <main className="flex-1 overflow-y-auto bg-[#f8fafd]">
          
          {/* Reusable Content Sub-Header Bar */}
          <ContentSubHeader
            title={
              activeTab === 'home' || activeTab === 'my-jobs'
                ? 'Active Institutional Vacancies'
                : activeTab === 'create-job'
                ? 'Post School Faculty & STEM Lab Vacancy'
                : 'School Affiliation & Statutory Profile'
            }
            subtitle="Direct faculty hiring portal for CBSE & ICSE schools. All postings undergo verified admin clearance."
            badge={schoolName}
            badgeColor="bg-emerald-50 text-emerald-800 border-emerald-200"
            isSidebarOpen={rail2Open}
            onToggleSidebar={() => setRail2Open(!rail2Open)}
            actions={
              <div className="flex items-center gap-2">
                {submitSuccess && (
                  <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1 animate-in fade-in">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Job posted for verification!
                  </span>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSelectTab('my-jobs')}
                  className="text-xs h-7.5 px-2.5 border-[#dadce0] text-[#3c4043] hover:bg-gray-50 cursor-pointer rounded-md"
                >
                  <Briefcase className="w-3.5 h-3.5 mr-1 text-[#5f6368]" /> View Posted ({jobListings.length})
                </Button>
              </div>
            }
          />

          <div className="p-3.5 sm:p-4 space-y-3.5 max-w-6xl mx-auto w-full select-text">

            {/* TAB 1: CREATE JOB POST */}
            {activeTab === 'create-job' && (
              <form onSubmit={handlePostJob} className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
                
                {/* Left Column: Form Fields (8 Cols) */}
                <div className="lg:col-span-8 space-y-3.5">

                  {/* 1. Job Role & Department */}
                  <div className="bg-white p-3.5 sm:p-4 rounded-lg border border-[#dadce0] shadow-[0_1px_2px_rgba(60,64,67,0.06)] space-y-3">
                    <h3 className="text-[11px] font-semibold text-[#5f6368] uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-2">
                      <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
                      1. Role &amp; Subject Designation
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="sm:col-span-2">
                        <label className="font-medium text-[#3c4043] text-[11px] block mb-1">Job Title / Vacancy Headline</label>
                        <input
                          type="text"
                          value={jobTitle}
                          onChange={(e) => setJobTitle(e.target.value)}
                          placeholder="e.g. Senior Secondary PGT Physics Faculty & Lab Incharge"
                          className="w-full h-8 px-2.5 border border-[#dadce0] rounded-md focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] bg-white font-normal text-xs"
                          required
                        />
                      </div>

                      <div>
                        <label className="font-medium text-[#3c4043] text-[11px] block mb-1">Subject Stream</label>
                        <select
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          className="w-full h-8 px-2 border border-[#dadce0] rounded-md focus:border-[#1a73e8] bg-white text-xs"
                        >
                          <option>Physics</option>
                          <option>Chemistry</option>
                          <option>Biology</option>
                          <option>Mathematics</option>
                          <option>Robotics &amp; AI (ATL)</option>
                          <option>Computer Science / Python</option>
                          <option>General Science (TGT)</option>
                        </select>
                      </div>

                      <div>
                        <label className="font-medium text-[#3c4043] text-[11px] block mb-1">Target Class / Level</label>
                        <select
                          value={grade}
                          onChange={(e) => setGrade(e.target.value)}
                          className="w-full h-8 px-2 border border-[#dadce0] rounded-md focus:border-[#1a73e8] bg-white text-xs"
                        >
                          <option>Class 11 - 12 (Senior Secondary / PGT)</option>
                          <option>Class 9 - 10 (Secondary / TGT)</option>
                          <option>Class 6 - 8 (Middle School / PRT)</option>
                          <option>K-12 STEM &amp; ATL Lab Coordinator</option>
                        </select>
                      </div>

                      <div>
                        <label className="font-medium text-[#3c4043] text-[11px] block mb-1">Employment Type</label>
                        <select
                          value={employmentType}
                          onChange={(e) => setEmploymentType(e.target.value)}
                          className="w-full h-8 px-2 border border-[#dadce0] rounded-md focus:border-[#1a73e8] bg-white text-xs"
                        >
                          <option>Full Time Regular</option>
                          <option>Part Time / Visiting Faculty</option>
                          <option>Annual Contractual (1 Year)</option>
                          <option>Practical Lab Demonstrator</option>
                        </select>
                      </div>

                      <div>
                        <label className="font-medium text-[#3c4043] text-[11px] block mb-1">Monthly Gross Remuneration</label>
                        <input
                          type="text"
                          value={salaryRange}
                          onChange={(e) => setSalaryRange(e.target.value)}
                          placeholder="e.g. ₹50,000 - ₹70,000 / month"
                          className="w-full h-8 px-2.5 border border-[#dadce0] rounded-md focus:border-[#1a73e8] bg-white text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2. Eligibility & Practical Lab Criteria */}
                  <div className="bg-white p-3.5 sm:p-4 rounded-lg border border-[#dadce0] shadow-[0_1px_2px_rgba(60,64,67,0.06)] space-y-3">
                    <h3 className="text-[11px] font-semibold text-[#5f6368] uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-2">
                      <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                      2. Qualifications &amp; Lab Teaching Expectations
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="font-medium text-[#3c4043] text-[11px] block mb-1">Minimum Teaching Experience</label>
                        <select
                          value={experienceRequired}
                          onChange={(e) => setExperienceRequired(e.target.value)}
                          className="w-full h-8 px-2 border border-[#dadce0] rounded-md focus:border-[#1a73e8] bg-white text-xs"
                        >
                          <option>Freshers with CTET &amp; B.Ed</option>
                          <option>1 - 3 Years</option>
                          <option>3 - 5 Years</option>
                          <option>5 - 8 Years</option>
                          <option>10+ Years (Senior Faculty / HOD)</option>
                        </select>
                      </div>

                      <div>
                        <label className="font-medium text-[#3c4043] text-[11px] block mb-1">Application Deadline</label>
                        <input
                          type="date"
                          value={deadline}
                          onChange={(e) => setDeadline(e.target.value)}
                          className="w-full h-8 px-2 border border-[#dadce0] rounded-md focus:border-[#1a73e8] bg-white text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-medium text-[#3c4043] text-[11px] block mb-1">Essential Academic Qualifications</label>
                      <textarea
                        rows={2}
                        value={minQualifications}
                        onChange={(e) => setMinQualifications(e.target.value)}
                        className="w-full p-2 border border-[#dadce0] rounded-md focus:border-[#1a73e8] bg-white text-xs leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="font-medium text-[#3c4043] text-[11px] block mb-1">Lab Apparatus &amp; Practical Demonstration Tasks</label>
                      <textarea
                        rows={2}
                        value={labRequirements}
                        onChange={(e) => setLabRequirements(e.target.value)}
                        className="w-full p-2 border border-[#dadce0] rounded-md focus:border-[#1a73e8] bg-white text-xs leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="font-medium text-[#3c4043] text-[11px] block mb-1">Perks, Allowances &amp; Campus Benefits</label>
                      <input
                        type="text"
                        value={perks}
                        onChange={(e) => setPerks(e.target.value)}
                        className="w-full h-8 px-2.5 border border-[#dadce0] rounded-md focus:border-[#1a73e8] bg-white text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <Button
                      type="submit"
                      className="bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-semibold px-4 h-8 shadow-xs cursor-pointer rounded-md"
                    >
                      <Send className="w-3.5 h-3.5 mr-1.5" />
                      Publish Job for Admin Verification
                    </Button>
                  </div>

                </div>

                {/* Right Column: Institutional Trust & Verification Info (4 Cols) */}
                <div className="lg:col-span-4 space-y-3.5">
                  
                  {/* School KYC Badge Card */}
                  <div className="bg-white p-3.5 sm:p-4 rounded-lg border border-[#dadce0] shadow-[0_1px_2px_rgba(60,64,67,0.06)] space-y-2.5">
                    <div className="flex items-center gap-1.5 text-emerald-700">
                      <School className="w-4 h-4 text-emerald-600" />
                      <h3 className="font-semibold text-xs text-[#202124]">Institutional Profile</h3>
                    </div>
                    <div className="space-y-1 text-xs text-[#5f6368]">
                      <p><strong className="text-[#202124]">School:</strong> {schoolName}</p>
                      <p><strong className="text-[#202124]">UDISE+ Code:</strong> {udiseCode}</p>
                      <p><strong className="text-[#202124]">Affiliation:</strong> {affiliationCode}</p>
                      <p><strong className="text-[#202124]">Location:</strong> {schoolCity}</p>
                    </div>
                    <div className="pt-2 border-t border-gray-100 flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Verified CBSE Learning Hub</span>
                    </div>
                  </div>

                  {/* Verification Process Notice */}
                  <div className="bg-blue-50/60 p-3.5 rounded-lg border border-blue-200/60 text-xs space-y-1.5">
                    <div className="flex items-center gap-1.5 font-semibold text-blue-900 text-xs">
                      <AlertCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>Admin Verification Protocol</span>
                    </div>
                    <p className="text-blue-800 leading-relaxed text-[11px]">
                      To maintain teacher safety and CBSE compliance standards, CSEEL operations verify every institutional job posting before syndication to LinkedIn &amp; Indeed.
                    </p>
                  </div>

                </div>

              </form>
            )}

            {/* TAB 2: ACTIVE VACANCIES & HOME */}
            {(activeTab === 'home' || activeTab === 'my-jobs') && (
              <div className="bg-white p-3.5 sm:p-4 rounded-lg border border-[#dadce0] shadow-[0_1px_2px_rgba(60,64,67,0.06)] space-y-3">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                  <div>
                    <h2 className="text-xs font-semibold text-[#202124]">All Posted Vacancies ({jobListings.length})</h2>
                    <p className="text-[11px] text-[#5f6368]">Track candidates, view verification status, and close filled positions.</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleSelectTab('create-job')}
                    className="bg-[#1a73e8] text-white text-xs h-7.5 px-3 cursor-pointer rounded-md font-medium"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" /> Post Job
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#f8fafd] border-b border-[#dadce0] text-[11px] text-[#5f6368] font-semibold uppercase">
                      <tr>
                        <th className="py-2 px-3">Role / Subject</th>
                        <th className="py-2 px-3">Level &amp; Type</th>
                        <th className="py-2 px-3">Remuneration</th>
                        <th className="py-2 px-3">Status</th>
                        <th className="py-2 px-3 text-center">Applicants</th>
                        <th className="py-2 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {jobListings.map((job) => (
                        <tr key={job.id} className="hover:bg-[#f8fafd] transition-colors">
                          <td className="py-2.5 px-3">
                            <p className="font-semibold text-[#202124] text-xs">{job.title}</p>
                            <p className="text-[#5f6368] text-[11px]">{job.subject} • Posted {job.postedDate}</p>
                          </td>
                          <td className="py-2.5 px-3 text-[#3c4043]">
                            {job.grade} • {job.type}
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-[#202124]">
                            {job.salary}
                          </td>
                          <td className="py-2.5 px-3">
                            {job.status === 'Live on Portal' ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Live
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
                                <Clock className="w-3 h-3 text-amber-600" /> Pending Review
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 text-[11px]">
                              {job.applicantsCount} Resumes
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => alert(`Reviewing ${job.applicantsCount} candidate resumes for ${job.title}`)}
                              className="text-xs font-medium text-[#1a73e8] hover:underline cursor-pointer"
                            >
                              View Applicants &gt;
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: SCHOOL KYC & PROFILE */}
            {activeTab === 'school-kyc' && (
              <div className="bg-white p-3.5 sm:p-4 rounded-lg border border-[#dadce0] shadow-[0_1px_2px_rgba(60,64,67,0.06)] space-y-3">
                <div className="border-b border-gray-100 pb-2">
                  <h2 className="text-xs font-semibold text-[#202124]">School Affiliation &amp; Statutory KYC Verification</h2>
                  <p className="text-[11px] text-[#5f6368]">Government UDISE+ and CBSE affiliation data verified by CSEEL state audit teams.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-[#f8fafd] rounded-lg border border-[#dadce0] space-y-1.5">
                    <p className="font-semibold text-[#202124] text-xs">School Information</p>
                    <p className="text-[#5f6368]"><strong>Name:</strong> {schoolName}</p>
                    <p className="text-[#5f6368]"><strong>UDISE+ Code:</strong> {udiseCode}</p>
                    <p className="text-[#5f6368]"><strong>Board:</strong> Central Board of Secondary Education (CBSE)</p>
                    <p className="text-[#5f6368]"><strong>Affiliation No:</strong> 2730017 (Up to Senior Secondary)</p>
                  </div>

                  <div className="p-3 bg-[#f8fafd] rounded-lg border border-[#dadce0] space-y-1.5">
                    <p className="font-semibold text-[#202124] text-xs">Authorized Contact</p>
                    <p className="text-[#5f6368]"><strong>Principal:</strong> Dr. S. K. Aggarwal</p>
                    <p className="text-[#5f6368]"><strong>Official Email:</strong> principal@dpsrkp.net</p>
                    <p className="text-[#5f6368]"><strong>District / State:</strong> South West Delhi, Delhi</p>
                    <p className="text-emerald-700 font-semibold text-[11px] flex items-center">
                      <Check className="w-3.5 h-3.5 text-emerald-600 mr-1 shrink-0" />
                      Verified by CSEEL Operations Team
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </LayoutWrapper>
  );
}
