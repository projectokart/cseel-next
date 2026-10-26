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
  FlaskConical,
  Award,
  FileText,
  Save,
  CheckCircle2,
  Clock,
  Play,
  Check,
  Plus,
  BookOpen,
  HelpCircle,
  Grid3X3,
  LogOut,
  Sparkles,
  ArrowRight,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';

export default function StudentDashboardClient() {
  const router = useRouter();
  const { signOut } = useAuth();

  // Navigation State
  const [activeTab, setActiveTab] = useState<'home' | 'my-experiments' | 'simulations' | 'submissions' | 'certificates'>('home');
  const [rail1Hovered, setRail1Hovered] = useState(false);
  const [rail2Open, setRail2Open] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      setRail2Open(true);
    }
  }, []);
  const [isPageLoading, setIsPageLoading] = useState(false);

  // Dropdown States
  const [createDropdownOpen, setCreateDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const createMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Student Profile
  const studentName = 'Aarav Sharma';
  const studentGrade = 'Class 12 - Senior Secondary (PCM)';
  const schoolName = 'Delhi Public School (R.K. Puram)';

  const handleSelectTab = (tab: 'home' | 'my-experiments' | 'simulations' | 'submissions' | 'certificates') => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setRail2Open(false);
    }
    if (activeTab === tab) return;
    setIsPageLoading(true);
    setActiveTab(tab);
    setTimeout(() => setIsPageLoading(false), 240);
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
      portalName={studentName}
      portalBadge="Class 12 - Senior Secondary (PCM)"
      badgeColor="bg-purple-50 text-purple-800 border-purple-200"
      searchPlaceholder="Search practical simulations, formulas, lab assignments..."
      roleIcon="student"
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
              { id: 'my-experiments', label: 'My Experiments', icon: FlaskConical },
              { id: 'simulations', label: 'Interactive Simulations', icon: Play },
              { id: 'submissions', label: 'Lab Submissions', icon: FileText },
              { id: 'certificates', label: 'NEP Certifications', icon: Award }
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
              onClick={() => handleSelectTab('submissions')}
              className={`portal-rail1-btn ${
                activeTab === 'submissions'
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
              onClick={() => handleSelectTab('certificates')}
              className={`portal-rail1-btn ${
                activeTab === 'certificates'
                  ? 'portal-rail1-btn-active'
                  : 'portal-rail1-btn-inactive'
              }`}
              title="Settings & Badges"
            >
              <div className="portal-rail1-icon-box">
                <Settings className="w-4 h-4 text-[#202124]" />
              </div>
              <span className={`portal-rail1-label transition-all duration-150 ${
                rail1Hovered ? 'opacity-100 max-w-[150px]' : 'opacity-0 max-w-0'
              }`}>
                Settings &amp; Profile
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
                    Student Lab Portal
                  </h3>
                  <p className="portal-rail2-header-sub">NEP Experiential Learning</p>
                </div>
                <span className="text-[10px] font-bold bg-purple-50 text-purple-800 px-1.5 py-0.5 rounded border border-purple-200">
                  Class 12
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
                    <Plus className="w-3.5 h-3.5 text-purple-600 stroke-[2.5]" />
                    <span>New Activity</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#5f6368]" />
                </button>

                {createDropdownOpen && (
                  <div className="absolute left-3 right-3 mt-1.5 bg-white rounded-xl shadow-xl border border-gray-200 py-1.5 z-[800] text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setCreateDropdownOpen(false);
                        handleSelectTab('my-experiments');
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-purple-50 flex items-center gap-2 text-gray-800 cursor-pointer"
                    >
                      <FlaskConical className="w-4 h-4 text-blue-600 shrink-0" />
                      <div>
                        <p className="font-semibold text-xs">Start Lab Practical</p>
                        <p className="text-[10px] text-gray-500">Physics &amp; Chemistry</p>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCreateDropdownOpen(false);
                        handleSelectTab('submissions');
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-purple-50 flex items-center gap-2 text-gray-800 cursor-pointer"
                    >
                      <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <p className="font-semibold text-xs">Submit Observations</p>
                        <p className="text-[10px] text-gray-500">Upload lab journal</p>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* Sub-Tabs */}
              <div className="space-y-0.5 px-2">
                {[
                  { id: 'my-experiments', label: 'My Experiments', icon: FlaskConical, badge: '8 Active' },
                  { id: 'simulations', label: 'Interactive Simulations', icon: Play, badge: '12 Live' },
                  { id: 'submissions', label: 'Lab Submissions', icon: FileText, badge: '3 Graded' },
                  { id: 'certificates', label: 'NEP Certifications', icon: Award, badge: '2 Earned' }
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id || (activeTab === 'home' && item.id === 'my-experiments');
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
                        <Icon className="portal-rail2-item-icon text-purple-600" />
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
              activeTab === 'home' || activeTab === 'my-experiments'
                ? 'My Science Laboratory Practicals'
                : activeTab === 'simulations'
                ? 'Interactive Virtual Science Labs'
                : activeTab === 'submissions'
                ? 'Observation Journal & Lab Submissions'
                : 'NEP 2020 Verified Competency Badges'
            }
            subtitle="Hands-on experiential science learning following the Kolb Experiential Cycle and NEP 2020 pedagogy."
            badge={studentGrade}
            badgeColor="bg-purple-50 text-purple-800 border-purple-200"
            isSidebarOpen={rail2Open}
            onToggleSidebar={() => setRail2Open(!rail2Open)}
            actions={
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => handleSelectTab('simulations')}
                  className="bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs h-8 px-2.5 rounded-md cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 mr-1" /> Launch 3D Simulation
                </Button>
              </div>
            }
          />

          <div className="p-3.5 sm:p-4 space-y-3.5 max-w-6xl mx-auto w-full select-text">

            {/* TAB 1: MY EXPERIMENTS & HOME */}
            {(activeTab === 'home' || activeTab === 'my-experiments') && (
              <div className="space-y-3.5">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    { title: "Verification of Ohm's Law & Wire Resistivity", subject: "Physics", level: "Senior Secondary", progress: 85, stage: "Active Experimentation" },
                    { title: "Acid-Base Titration: Oxalic Acid vs KMnO4", subject: "Chemistry", level: "Senior Secondary", progress: 60, stage: "Abstract Conceptualization" },
                    { title: "Study of Osmosis in Potato Cells", subject: "Biology", level: "Senior Secondary", progress: 100, stage: "Completed" },
                    { title: "Focal Length of Convex Lens using Optical Bench", subject: "Physics", level: "Senior Secondary", progress: 40, stage: "Reflective Observation" },
                    { title: "Spherometer Radius of Curvature of Spherical Surface", subject: "Physics", level: "Secondary", progress: 100, stage: "Completed" },
                    { title: "Robotics Ultrasonic Sensor Calibration (ATL)", subject: "Robotics", level: "STEM Lab", progress: 75, stage: "Active Experimentation" }
                  ].map((exp, idx) => (
                    <div key={idx} className="bg-white p-3.5 rounded-lg border border-[#dadce0] shadow-[0_1px_2px_rgba(60,64,67,0.06)] space-y-2.5 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-semibold bg-blue-50 text-blue-800 px-1.5 py-0.2 rounded border border-blue-200">
                            {exp.subject}
                          </span>
                          <span className="text-[10px] font-normal text-[#5f6368]">
                            {exp.level}
                          </span>
                        </div>
                        <h3 className="font-semibold text-[#202124] text-xs leading-snug">
                          {exp.title}
                        </h3>
                        <p className="text-[11px] text-purple-700 font-medium flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Kolb: {exp.stage}
                        </p>
                      </div>

                      <div className="space-y-1.5 pt-2 border-t border-gray-100">
                        <div className="flex justify-between text-[11px] text-[#5f6368]">
                          <span>Completion</span>
                          <span className="font-medium text-[#202124]">{exp.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-[#1a73e8] h-full rounded-full" style={{ width: `${exp.progress}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: INTERACTIVE SIMULATIONS */}
            {activeTab === 'simulations' && (
              <div className="bg-white p-3.5 sm:p-4 rounded-lg border border-[#dadce0] shadow-[0_1px_2px_rgba(60,64,67,0.06)] space-y-3">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <div>
                    <h2 className="text-sm font-semibold text-[#202124]">Virtual 3D Laboratory Simulators</h2>
                    <p className="text-[11px] text-[#5f6368]">Hands-on apparatus simulation with real-time error propagation and formula verification.</p>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    HTML5 / Canvas Live
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-[#f8fafd] rounded-md border border-[#dadce0] space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-[#202124] text-xs">Dual-Trace Cathode Ray Oscilloscope (CRO)</p>
                      <span className="text-[10px] font-medium bg-blue-50 text-blue-800 px-1.5 py-0.2 rounded border border-blue-200">Physics</span>
                    </div>
                    <p className="text-[#5f6368] text-[11px]">Simulate AC sine wave frequency, peak voltage Vp, and Lissajous figures with virtual knob dials.</p>
                    <Button size="sm" className="bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs h-7 px-2.5 rounded-md cursor-pointer">
                      <Play className="w-3 h-3 mr-1" /> Open Simulation
                    </Button>
                  </div>

                  <div className="p-3 bg-[#f8fafd] rounded-md border border-[#dadce0] space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-[#202124] text-xs">Optical Bench &amp; Spectrometer Prism Setup</p>
                      <span className="text-[10px] font-medium bg-emerald-50 text-emerald-800 px-1.5 py-0.2 rounded border border-emerald-200">Optics</span>
                    </div>
                    <p className="text-[#5f6368] text-[11px]">Measure angle of minimum deviation Dm using virtual collimator, telescope crosswire, and vernier scale.</p>
                    <Button size="sm" className="bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs h-7 px-2.5 rounded-md cursor-pointer">
                      <Play className="w-3 h-3 mr-1" /> Open Simulation
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: SUBMISSIONS */}
            {activeTab === 'submissions' && (
              <div className="bg-white p-3.5 sm:p-4 rounded-lg border border-[#dadce0] shadow-[0_1px_2px_rgba(60,64,67,0.06)] space-y-3">
                <div className="border-b border-gray-100 pb-2">
                  <h2 className="text-sm font-semibold text-[#202124]">Lab Journal Submissions &amp; Teacher Grading</h2>
                  <p className="text-[11px] text-[#5f6368]">Track practical observation records verified by senior secondary school faculty.</p>
                </div>

                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-[#dadce0] text-[11px] text-[#5f6368] font-semibold uppercase">
                      <tr>
                        <th className="py-2 px-3">Experiment</th>
                        <th className="py-2 px-3">Submitted On</th>
                        <th className="py-2 px-3">Evaluator</th>
                        <th className="py-2 px-3 text-center">Score</th>
                        <th className="py-2 px-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {[
                        { title: "Verification of Ohm's Law", date: "22 Oct 2026", teacher: "Dr. Ramesh Sharma (PGT Physics)", score: "19 / 20", status: "Verified & Graded" },
                        { title: "Oxalic Acid Titration", date: "15 Oct 2026", teacher: "Mrs. Meenakshi Sundaram (PGT Chem)", score: "20 / 20", status: "Verified & Graded" },
                        { title: "Spherometer Radius", date: "08 Oct 2026", teacher: "Dr. Ramesh Sharma (PGT Physics)", score: "18 / 20", status: "Verified & Graded" }
                      ].map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/80">
                          <td className="py-2.5 px-3 font-semibold text-[#202124]">{item.title}</td>
                          <td className="py-2.5 px-3 text-[#5f6368] text-[11px]">{item.date}</td>
                          <td className="py-2.5 px-3 text-[#3c4043] text-[11px]">{item.teacher}</td>
                          <td className="py-2.5 px-3 text-center font-semibold text-emerald-700 text-xs">{item.score}</td>
                          <td className="py-2.5 px-3 text-right">
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 4: CERTIFICATES */}
            {activeTab === 'certificates' && (
              <div className="bg-white p-3.5 sm:p-4 rounded-lg border border-[#dadce0] shadow-[0_1px_2px_rgba(60,64,67,0.06)] space-y-3.5">
                <div className="border-b border-gray-100 pb-2">
                  <h2 className="text-sm font-semibold text-[#202124]">NEP 2020 Experiential Practical Credentials</h2>
                  <p className="text-[11px] text-[#5f6368]">Government recognized STEM laboratory skills certificates authenticated by CSEEL National Directorate.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 bg-gradient-to-br from-amber-50 to-orange-50/30 rounded-lg border border-amber-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded">
                        Gold Competency
                      </span>
                      <Award className="w-4 h-4 text-amber-600" />
                    </div>
                    <p className="font-semibold text-[#202124] text-xs">Senior Secondary Experimental Physics Mastery</p>
                    <p className="text-[#5f6368] text-[11px] leading-relaxed">Completed 24 core CBSE senior practicals with precision laboratory instrumentation calibration.</p>
                    <p className="text-[10px] text-amber-800 font-medium">Cred: CSEEL-EXP-2026-9812</p>
                  </div>

                  <div className="p-3.5 bg-gradient-to-br from-blue-50 to-indigo-50/30 rounded-lg border border-blue-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold bg-blue-200 text-blue-900 px-1.5 py-0.2 rounded">
                        STEM ATL Innovator
                      </span>
                      <Award className="w-4 h-4 text-blue-600" />
                    </div>
                    <p className="font-semibold text-[#202124] text-xs">Robotics &amp; Sensor Interfacing Certification</p>
                    <p className="text-[#5f6368] text-[11px] leading-relaxed">Certified in Arduino microcontrollers, ultrasonic echo rangefinding, and IoT breadboard circuits.</p>
                    <p className="text-[10px] text-blue-800 font-medium">Cred: CSEEL-ATL-2026-4401</p>
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
