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
  User,
  Briefcase,
  GraduationCap,
  Award,
  FileText,
  Printer,
  Save,
  CheckCircle2,
  Clock,
  MapPin,
  Mail,
  Phone,
  Plus,
  Trash2,
  Eye,
  ExternalLink,
  ShieldCheck,
  School,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Grid3X3,
  LogOut,
  Download,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';

export default function TeacherDashboardClient() {
  const router = useRouter();
  const { signOut } = useAuth();

  // Navigation State
  const [activeTab, setActiveTab] = useState<'home' | 'resume-builder' | 'credentials' | 'preview-cv' | 'matched-jobs'>('home');
  const [rail1Hovered, setRail1Hovered] = useState(false);
  const [rail2Open, setRail2Open] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      setRail2Open(true);
    }
  }, []);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Dropdown States
  const [createDropdownOpen, setCreateDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const createMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Teacher Resume Form State
  const [fullName, setFullName] = useState('Dr. Ramesh Sharma');
  const [email, setEmail] = useState('ramesh.sharma@cseel.edu');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [city, setCity] = useState('Noida');
  const [state, setState] = useState('Uttar Pradesh');
  const [headline, setHeadline] = useState('Senior Secondary PGT Physics Faculty & Experiential Lab Mentor');
  const [aboutBio, setAboutBio] = useState('Dedicated Physics educator with 12+ years of experiential laboratory pedagogy, specializing in CBSE senior secondary curriculum, optics apparatus calibration, and Atal Tinkering Lab (ATL) robotics integration.');
  
  const [targetSubject, setTargetSubject] = useState('Senior Secondary Physics (Class 11 - 12)');
  const [experienceYears, setExperienceYears] = useState('12 Years');
  const [expectedCtc, setExpectedCtc] = useState('₹65,000 - ₹80,000 / month');
  const [noticePeriod, setNoticePeriod] = useState('15 Days (Immediate)');

  // Academic Qualifications
  const [qualifications, setQualifications] = useState([
    { degree: 'Ph.D in Applied Physics', institution: 'Delhi Technological University (DTU)', year: '2016', score: 'First Division with Distinction' },
    { degree: 'M.Sc Physics (Electronics)', institution: 'University of Delhi (Hindu College)', year: '2011', score: '78.5%' },
    { degree: 'Bachelor of Education (B.Ed)', institution: 'Jamia Millia Islamia', year: '2013', score: '82.0%' }
  ]);

  // Certifications & Eligibility Tests
  const [ctetQualified, setCtetQualified] = useState(true);
  const [ctetRollNo, setCtetRollNo] = useState('CTET2019-8834921');
  const [ctetScore, setCtetScore] = useState('Paper 2: 122 / 150 (Qualified)');
  const [otherCerts, setOtherCerts] = useState('CBSE NEP 2020 Master Educator, ATL Tinkering Mentor Level 2');

  // Teaching Experience
  const [workHistory, setWorkHistory] = useState([
    { school: 'Delhi Public School, Noida', role: 'PGT Physics & Lab Incharge', tenure: '2018 - Present', achievements: 'Mentored 180+ Class 12 board students with a 94.2% practical distinction rate. Set up state-of-the-art optical bench and dual-trace oscilloscope setups.' },
    { school: 'Apeejay School, Pitampura', role: 'TGT Science & ATL Coordinator', tenure: '2014 - 2018', achievements: 'Led National Science Exhibition team to 2nd prize at CBSE Zonal. Coordinated daily STEM and experiential tinkering practicals.' }
  ]);

  // Lab & Practical Skills
  const [labSkills, setLabSkills] = useState('Optical Bench, Cathode Ray Oscilloscope, Spherometer, Kolb Cycle, Atal Tinkering Lab (ATL), Arduino / Sensors');

  const handleSelectTab = (tab: 'home' | 'resume-builder' | 'credentials' | 'preview-cv' | 'matched-jobs') => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setRail2Open(false);
    }
    if (activeTab === tab) return;
    setIsPageLoading(true);
    setActiveTab(tab);
    setTimeout(() => setIsPageLoading(false), 240);
  };

  const handleSaveResume = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const addQualification = () => {
    setQualifications([
      ...qualifications,
      { degree: 'B.Sc (Hons) Physics', institution: 'State Central University', year: '2009', score: '74%' }
    ]);
  };

  const removeQualification = (idx: number) => {
    setQualifications(qualifications.filter((_, i) => i !== idx));
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
      portalName={fullName}
      portalBadge="Verified PGT Faculty"
      badgeColor="bg-emerald-50 text-emerald-800 border-emerald-200"
      searchPlaceholder="Search school teaching jobs, lab roles, CBSE vacancies..."
      roleIcon="teacher"
      onToggleSidebar={() => setRail2Open(prev => !prev)}
      isSidebarOpen={rail2Open}
      isLoading={isPageLoading}
    >

      {/* ═════════════════════════════════════════════════════════════
          2. DUAL-RAIL MAIN AREA (GA4 ARCHITECTURE)
         ═════════════════════════════════════════════════════════════ */}
      <div className="flex-1 h-[calc(100vh-48px)] max-h-[calc(100vh-48px)] flex overflow-hidden relative">
        
        {/* Fixed placeholder so underlying content never shifts */}
        <div className="portal-rail-placeholder hidden md:block w-[48px] min-w-[48px] max-w-[48px] h-full shrink-0" />

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
              { id: 'resume-builder', label: 'Resume Builder', icon: FileText },
              { id: 'credentials', label: 'Degrees & CTET Vault', icon: GraduationCap },
              { id: 'preview-cv', label: 'Print A4 CV', icon: Printer },
              { id: 'matched-jobs', label: 'Matching School Jobs', icon: Briefcase }
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
              onClick={() => handleSelectTab('matched-jobs')}
              className={`portal-rail1-btn ${
                activeTab === 'matched-jobs'
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
              onClick={() => handleSelectTab('credentials')}
              className={`portal-rail1-btn ${
                activeTab === 'credentials'
                  ? 'portal-rail1-btn-active'
                  : 'portal-rail1-btn-inactive'
              }`}
              title="Settings & Credentials"
            >
              <div className="portal-rail1-icon-box">
                <Settings className="w-4 h-4 text-[#202124]" />
              </div>
              <span className={`portal-rail1-label transition-all duration-150 ${
                rail1Hovered ? 'opacity-100 max-w-[150px]' : 'opacity-0 max-w-0'
              }`}>
                Settings &amp; CTET
              </span>
            </button>
          </div>
        </aside>

        {/* RAIL 2 TOGGLE EXPAND BUTTON (when Rail 2 is collapsed - GA4 Exact Tab) */}
        {!rail2Open && (
          <button
            type="button"
            onClick={() => setRail2Open(true)}
            className="portal-rail-expand-btn"
            title="Expand navigation (Ctrl+B)"
          >
            <ChevronRight className="w-3.5 h-3.5 stroke-[2]" />
          </button>
        )}

        {/* RAIL 2: SUB-SIDEBAR (240px COLLAPSIBLE WITH Ctrl+B) */}
        {rail2Open && (
          <aside className="portal-rail2 h-full z-20">
            <div className="flex-1 overflow-y-auto">
              <div className="px-3 pb-2 border-b border-gray-100 mb-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setRail2Open(false)}
                  className="md:hidden p-1 text-gray-500 hover:text-gray-900 rounded-md hover:bg-gray-100 order-last"
                  title="Close navigation"
                >
                  <X className="w-4 h-4" />
                </button>
                <div>
                  <h3 className="portal-rail2-header-title">
                    Teacher Faculty Hub
                  </h3>
                  <p className="portal-rail2-header-sub">Academic CV &amp; Jobs</p>
                </div>
                <span className="text-[10px] font-semibold bg-blue-50 text-blue-800 px-1.5 py-0.5 rounded border border-blue-200 flex items-center gap-1">
                  <Check className="w-3 h-3 text-blue-600" />
                  CTET
                </span>
              </div>

              {/* "+ Create" Pill Button */}
              <div className="px-3 pb-3 relative" ref={createMenuRef}>
                <button
                  type="button"
                  onClick={() => setCreateDropdownOpen(prev => !prev)}
                  className="portal-rail2-create-btn"
                >
                  <div className="flex items-center gap-2">
                    <Plus className="w-3.5 h-3.5 text-blue-600 stroke-[2.5]" />
                    <span>Add Item</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#5f6368]" />
                </button>

                {createDropdownOpen && (
                  <div className="absolute left-3 right-3 mt-1.5 bg-white rounded-xl shadow-xl border border-gray-200 py-1.5 z-[800] text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setCreateDropdownOpen(false);
                        addQualification();
                        handleSelectTab('resume-builder');
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-blue-50 flex items-center gap-2 text-gray-800 cursor-pointer"
                    >
                      <GraduationCap className="w-4 h-4 text-blue-600 shrink-0" />
                      <div>
                        <p className="font-semibold text-xs">Add Academic Degree</p>
                        <p className="text-[10px] text-gray-500">M.Sc, B.Ed, Ph.D</p>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCreateDropdownOpen(false);
                        handleSelectTab('preview-cv');
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-blue-50 flex items-center gap-2 text-gray-800 cursor-pointer"
                    >
                      <Printer className="w-4 h-4 text-indigo-600 shrink-0" />
                      <div>
                        <p className="font-semibold text-xs">Print A4 CV</p>
                        <p className="text-[10px] text-gray-500">Download PDF</p>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* Sub-Tabs */}
              <div className="space-y-0.5 px-2">
                {[
                  { id: 'resume-builder', label: 'Resume Builder', icon: FileText, badge: 'Edit' },
                  { id: 'credentials', label: 'Degrees & CTET Vault', icon: GraduationCap, badge: 'Verified' },
                  { id: 'preview-cv', label: 'Print A4 CV', icon: Printer, badge: 'PDF' },
                  { id: 'matched-jobs', label: 'Matching School Jobs', icon: Briefcase, badge: '14' }
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id || (activeTab === 'home' && item.id === 'resume-builder');
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
                        <Icon className="portal-rail2-item-icon text-blue-600" />
                        <span className="truncate">{item.label}</span>
                      </div>
                      <span className="text-[10px] font-semibold bg-gray-100 text-gray-600 px-1.5 py-0.2 rounded">
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
              activeTab === 'home' || activeTab === 'resume-builder'
                ? 'Faculty Academic Profile & CV Builder'
                : activeTab === 'credentials'
                ? 'CTET Scores & Verified Credentials Vault'
                : activeTab === 'preview-cv'
                ? 'Live Printable Academic CV (A4 Layout)'
                : 'Recommended School Vacancies for Your Subject'
            }
            subtitle="Build your verified teaching resume, showcase CTET and practical STEM skills, and apply directly to CBSE schools."
            badge={fullName}
            badgeColor="bg-blue-50 text-blue-800 border-blue-200"
            isSidebarOpen={rail2Open}
            onToggleSidebar={() => setRail2Open(!rail2Open)}
            actions={
              <div className="flex items-center gap-2">
                {saveSuccess && (
                  <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1 animate-in fade-in">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Resume updated successfully!
                  </span>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSelectTab('preview-cv')}
                  className="text-xs h-8 px-2.5 border-[#dadce0] rounded-md hover:bg-gray-50 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 mr-1" /> View &amp; Print CV
                </Button>
              </div>
            }
          />

          <div className="p-3.5 sm:p-4 space-y-3.5 max-w-6xl mx-auto w-full select-text">

            {/* TAB 1: RESUME BUILDER & HOME */}
            {(activeTab === 'home' || activeTab === 'resume-builder') && (
              <div className="space-y-3.5">

                {/* 1. Personal & Contact Info */}
                <div className="bg-white p-3.5 sm:p-4 rounded-lg border border-[#dadce0] shadow-[0_1px_2px_rgba(60,64,67,0.06)] space-y-3">
                  <h3 className="text-[11px] font-semibold text-[#5f6368] uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-1.5">
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    1. Personal &amp; Contact Details
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="text-[11px] font-medium text-[#3c4043] block mb-1">Full Legal Name</label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full h-8 px-2.5 text-xs text-[#202124] border border-[#dadce0] rounded-md focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] bg-white"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-[#3c4043] block mb-1">Email Address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-8 px-2.5 text-xs text-[#202124] border border-[#dadce0] rounded-md focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] bg-white"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-[#3c4043] block mb-1">Mobile / WhatsApp</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full h-8 px-2.5 text-xs text-[#202124] border border-[#dadce0] rounded-md focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] bg-white"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-[#3c4043] block mb-1">Current City</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full h-8 px-2.5 text-xs text-[#202124] border border-[#dadce0] rounded-md focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] bg-white"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-[#3c4043] block mb-1">State / UT</label>
                      <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full h-8 px-2.5 text-xs text-[#202124] border border-[#dadce0] rounded-md focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] bg-white"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-[#3c4043] block mb-1">Notice Period</label>
                      <input
                        type="text"
                        value={noticePeriod}
                        onChange={(e) => setNoticePeriod(e.target.value)}
                        className="w-full h-8 px-2.5 text-xs text-[#202124] border border-[#dadce0] rounded-md focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] bg-white"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="text-[11px] font-medium text-[#3c4043] block mb-1">Professional Headline / Specialization</label>
                      <input
                        type="text"
                        value={headline}
                        onChange={(e) => setHeadline(e.target.value)}
                        className="w-full h-8 px-2.5 text-xs text-[#202124] border border-[#dadce0] rounded-md focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] bg-white"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="text-[11px] font-medium text-[#3c4043] block mb-1">Executive Pedagogy Summary / Bio</label>
                      <textarea
                        rows={2}
                        value={aboutBio}
                        onChange={(e) => setAboutBio(e.target.value)}
                        className="w-full p-2 text-xs text-[#202124] border border-[#dadce0] rounded-md focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] bg-white leading-relaxed"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Teaching Qualifications */}
                <div className="bg-white p-3.5 sm:p-4 rounded-lg border border-[#dadce0] shadow-[0_1px_2px_rgba(60,64,67,0.06)] space-y-3">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-1.5">
                    <h3 className="text-[11px] font-semibold text-[#5f6368] uppercase tracking-wider flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                      2. Academic Degrees &amp; Teacher Certifications
                    </h3>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={addQualification}
                      className="text-xs h-7 px-2 border-dashed border-blue-400 text-blue-600 hover:bg-blue-50 rounded-md cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" /> Add Degree
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {qualifications.map((q, idx) => (
                      <div key={idx} className="p-2.5 bg-[#f8fafd] rounded-md border border-[#dadce0] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                        <div className="space-y-0.5">
                          <p className="font-semibold text-[#202124]">{q.degree}</p>
                          <p className="text-[#5f6368] text-[11px]">{q.institution} • <span className="font-medium text-blue-700">{q.score}</span></p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-medium text-[#5f6368] bg-white px-2 py-0.5 rounded border border-[#dadce0]">
                            {q.year}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeQualification(idx)}
                            className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-[11px] font-medium text-[#3c4043] block mb-1">CTET Paper 2 Qualification</label>
                      <input
                        type="text"
                        value={ctetScore}
                        onChange={(e) => setCtetScore(e.target.value)}
                        className="w-full h-8 px-2.5 text-xs text-[#202124] border border-[#dadce0] rounded-md focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-[#3c4043] block mb-1">CTET Roll Number</label>
                      <input
                        type="text"
                        value={ctetRollNo}
                        onChange={(e) => setCtetRollNo(e.target.value)}
                        className="w-full h-8 px-2.5 text-xs text-[#202124] border border-[#dadce0] rounded-md focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Teaching History */}
                <div className="bg-white p-3.5 sm:p-4 rounded-lg border border-[#dadce0] shadow-[0_1px_2px_rgba(60,64,67,0.06)] space-y-3">
                  <h3 className="text-[11px] font-semibold text-[#5f6368] uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
                    3. Professional Teaching Experience
                  </h3>

                  <div className="space-y-2">
                    {workHistory.map((work, idx) => (
                      <div key={idx} className="p-2.5 bg-[#f8fafd] rounded-md border border-[#dadce0] space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-[#202124]">{work.role} — {work.school}</p>
                          <span className="text-[10px] font-medium text-[#5f6368] bg-white px-2 py-0.5 rounded border border-[#dadce0]">
                            {work.tenure}
                          </span>
                        </div>
                        <p className="text-[#5f6368] text-[11px] leading-relaxed">{work.achievements}</p>
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-[#3c4043] block mb-1">Experiential Lab Apparatus Mastery &amp; STEM Skills</label>
                    <textarea
                      rows={2}
                      value={labSkills}
                      onChange={(e) => setLabSkills(e.target.value)}
                      className="w-full p-2 text-xs text-[#202124] border border-[#dadce0] rounded-md focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] bg-white leading-relaxed"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-1">
                  <Button
                    onClick={handleSaveResume}
                    className="bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-semibold px-4 h-8 rounded-md shadow-2xs cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5 mr-1.5" /> Save Academic Profile
                  </Button>
                </div>

              </div>
            )}

            {/* TAB 2: CREDENTIALS VAULT */}
            {activeTab === 'credentials' && (
              <div className="bg-white p-3.5 sm:p-4 rounded-lg border border-[#dadce0] shadow-[0_1px_2px_rgba(60,64,67,0.06)] space-y-3.5">
                <div className="border-b border-gray-100 pb-2 flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-semibold text-[#202124]">Verified Teaching Credentials Vault</h2>
                    <p className="text-[11px] text-[#5f6368]">Government CTET scores and university marksheet verification status.</p>
                  </div>
                  <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> CSEEL Verified Faculty
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-[#f8fafd] rounded-md border border-[#dadce0] space-y-1.5">
                    <p className="font-semibold text-[#202124]">CTET Qualification</p>
                    <p className="text-[#3c4043] text-[11px]"><strong>Exam:</strong> Central Teacher Eligibility Test (CTET)</p>
                    <p className="text-[#3c4043] text-[11px]"><strong>Roll Number:</strong> {ctetRollNo}</p>
                    <p className="text-[#3c4043] text-[11px]"><strong>Score:</strong> {ctetScore}</p>
                    <p className="text-emerald-700 font-semibold text-[11px] pt-1 flex items-center">
                      <Check className="w-3.5 h-3.5 text-emerald-600 mr-1 shrink-0" />
                      Digilocker CBSE Data Verified
                    </p>
                  </div>

                  <div className="p-3 bg-[#f8fafd] rounded-md border border-[#dadce0] space-y-1.5">
                    <p className="font-semibold text-[#202124]">Highest Academic Qualification</p>
                    <p className="text-[#3c4043] text-[11px]"><strong>Degree:</strong> Ph.D in Applied Physics</p>
                    <p className="text-[#3c4043] text-[11px]"><strong>Institution:</strong> Delhi Technological University (DTU)</p>
                    <p className="text-[#3c4043] text-[11px]"><strong>Year of Passing:</strong> 2016 (First Division)</p>
                    <p className="text-emerald-700 font-semibold text-[11px] pt-1 flex items-center">
                      <Check className="w-3.5 h-3.5 text-emerald-600 mr-1 shrink-0" />
                      University Transcript Verified
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: LIVE PRINT CV */}
            {activeTab === 'preview-cv' && (
              <div className="space-y-3.5">
                <div className="flex items-center justify-between bg-white p-3.5 rounded-lg border border-[#dadce0] shadow-[0_1px_2px_rgba(60,64,67,0.06)]">
                  <div>
                    <p className="text-xs font-semibold text-[#202124]">Standard A4 Academic Curriculum Vitae</p>
                    <p className="text-[11px] text-[#5f6368]">Formally styled for CBSE School Principal &amp; Selection Committee review.</p>
                  </div>
                  <Button
                    onClick={() => window.print()}
                    className="bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-semibold h-8 px-3 rounded-md cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 mr-1" /> Print / Save PDF
                  </Button>
                </div>

                {/* Printable A4 CV Paper */}
                <div className="bg-white p-6 sm:p-10 rounded-lg border border-[#dadce0] shadow-sm max-w-4xl mx-auto space-y-5 text-gray-900 font-serif">
                  {/* Header */}
                  <div className="border-b-2 border-gray-900 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{fullName}</h2>
                      <p className="text-xs font-sans text-gray-700 font-medium mt-0.5">{headline}</p>
                      <p className="text-[11px] font-sans text-[#5f6368] mt-1">
                        {city}, {state} • {email} • {phone}
                      </p>
                    </div>
                    <div className="text-right font-sans text-xs shrink-0">
                      <span className="font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 block text-center text-[11px]">
                        Verified CTET Faculty
                      </span>
                      <p className="text-[10px] text-[#5f6368] mt-1">Roll: {ctetRollNo}</p>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="space-y-1 font-sans">
                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-gray-900 border-b border-gray-200 pb-1">
                      Professional Pedagogy Profile
                    </h4>
                    <p className="text-xs text-gray-700 leading-relaxed">{aboutBio}</p>
                  </div>

                  {/* Education */}
                  <div className="space-y-1.5 font-sans">
                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-gray-900 border-b border-gray-200 pb-1">
                      Academic Qualifications
                    </h4>
                    <div className="space-y-1.5 text-xs">
                      {qualifications.map((q, idx) => (
                        <div key={idx} className="flex justify-between items-baseline">
                          <div>
                            <strong>{q.degree}</strong> — {q.institution}
                          </div>
                          <span className="text-gray-600 font-sans text-[11px]">{q.score} ({q.year})</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="space-y-2 font-sans">
                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-gray-900 border-b border-gray-200 pb-1">
                      Teaching Experience &amp; Lab Incharge
                    </h4>
                    <div className="space-y-2 text-xs">
                      {workHistory.map((work, idx) => (
                        <div key={idx} className="space-y-0.5">
                          <div className="flex justify-between items-center">
                            <strong>{work.role} — {work.school}</strong>
                            <span className="text-gray-500 text-[11px]">{work.tenure}</span>
                          </div>
                          <p className="text-gray-700 text-xs leading-relaxed">{work.achievements}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="space-y-1.5 font-sans">
                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-gray-900 border-b border-gray-200 pb-1">
                      Experiential Lab &amp; Practical Competencies
                    </h4>
                    <p className="text-xs text-gray-700 leading-relaxed">{labSkills}</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: RECOMMENDED JOBS */}
            {activeTab === 'matched-jobs' && (
              <div className="bg-white p-3.5 sm:p-4 rounded-lg border border-[#dadce0] shadow-[0_1px_2px_rgba(60,64,67,0.06)] space-y-3">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <div>
                    <h2 className="text-sm font-semibold text-[#202124]">Recommended School Vacancies for Your Subject</h2>
                    <p className="text-[11px] text-[#5f6368]">Matching: Senior Secondary Physics &amp; Experiential Lab Roles in Delhi NCR</p>
                  </div>
                  <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                    14 Active Openings
                  </span>
                </div>

                <div className="space-y-2">
                  {[
                    { title: 'Senior Secondary PGT Physics Faculty', school: 'Delhi Public School (R.K. Puram)', location: 'New Delhi', salary: '₹50,000 - ₹70,000 / mo', type: 'Full Time', source: 'CSEEL Direct' },
                    { title: 'Atal Tinkering Lab (ATL) Mentor & Robotics Trainer', school: 'Kendriya Vidyalaya No. 1', location: 'Kanpur, UP', salary: '₹35,000 - ₹48,000 / mo', type: 'Contractual', source: 'CSEEL Direct' },
                    { title: 'PGT Chemistry & Senior Lab Instructor', school: 'St. Kabir Public School', location: 'Chandigarh', salary: '₹45,000 - ₹60,000 / mo', type: 'Full Time', source: 'LinkedIn Jobs' },
                    { title: 'TGT Science & STEM Lab Incharge', school: 'Ryan International School', location: 'Gurugram, HR', salary: '₹38,000 - ₹52,000 / mo', type: 'Full Time', source: 'Indeed Education' }
                  ].map((job, idx) => (
                    <div key={idx} className="p-3 bg-[#f8fafd] rounded-md border border-[#dadce0] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-[#202124] text-xs">{job.title}</p>
                          <span className="text-[10px] font-medium bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded">
                            {job.source}
                          </span>
                        </div>
                        <p className="text-[#5f6368] text-[11px]">{job.school} • <span>{job.location}</span></p>
                        <p className="text-blue-700 font-medium text-[11px]">{job.salary} • {job.type}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          size="sm"
                          onClick={() => alert(`Application sent to ${job.school} with your verified CSEEL resume!`)}
                          className="bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-semibold h-7 px-3 rounded-md cursor-pointer"
                        >
                          Apply with 1-Click
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </LayoutWrapper>
  );
}
