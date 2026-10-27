'use client';

import React, { useState, useEffect } from 'react';
import LayoutWrapper, { ContentSubHeader } from '@/components/LayoutWrapper';
import { Card, CardHeader, CardContent } from '@/components/Card';
import {
  X,
  Home,
  Users,
  Award,
  FlaskConical,
  CheckCircle2,
  Calendar,
  FileText,
  Clock,
  Sparkles,
  Download,
  AlertCircle,
  TrendingUp,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ParentDashboardClient() {
  const [activeTab, setActiveTab] = useState<'overview' | 'experiments' | 'reports'>('overview');
  const [rail1Hovered, setRail1Hovered] = useState(false);
  const [rail2Open, setRail2Open] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      setRail2Open(true);
    }
  }, []);
  const [isPageLoading, setIsPageLoading] = useState(false);

  // Parent Context
  const parentName = 'Mrs. Sunita Sharma';
  const childName = 'Aarav Sharma';
  const childClass = 'Class 12 (PCM) - Senior Secondary';
  const schoolName = 'Delhi Public School (R.K. Puram)';

  const handleSelectTab = (tab: 'overview' | 'experiments' | 'reports') => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setRail2Open(false);
    }
    if (activeTab === tab) return;
    setIsPageLoading(true);
    setActiveTab(tab);
    setTimeout(() => setIsPageLoading(false), 200);
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
      portalName={parentName}
      portalBadge={`Child: ${childName}`}
      badgeColor="bg-amber-50 text-amber-800 border-amber-200"
      searchPlaceholder="Search Aarav's lab practicals, scores, faculty feedback..."
      roleIcon="parent"
      onToggleSidebar={() => setRail2Open(prev => !prev)}
      isSidebarOpen={rail2Open}
      isLoading={isPageLoading}
    >
      {/* 2. DUAL-RAIL MAIN AREA */}
      <div className="flex-1 h-[calc(100vh-48px)] max-h-[calc(100vh-48px)] flex overflow-hidden relative">
        
        {/* Fixed placeholder so underlying content never shifts */}
        <div className="portal-rail-placeholder w-[48px] min-w-[48px] max-w-[48px] h-full shrink-0" />

        {/* ═════════════════════════════════════════════════════════════
            1. RAIL 1: SLIM ICON BAR (48px EXPANDABLE TO 220px)
           ═════════════════════════════════════════════════════════════ */}
        <aside
          onMouseEnter={() => setRail1Hovered(true)}
          onMouseLeave={() => setRail1Hovered(false)}
          className={`portal-rail1 absolute top-0 left-0 h-full z-40 transition-all duration-200 ease-out bg-white ${
            rail1Hovered ? 'w-[220px] shadow-xl' : 'w-[48px] shadow-none'
          }`}
        >
        <div className="flex flex-col gap-1 w-full">
          {[
            { id: 'overview', label: 'Home', icon: Home },
            { id: 'experiments', label: 'Lab Practicals', icon: FlaskConical },
            { id: 'reports', label: 'Performance Cards', icon: Award }
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
            onClick={() => handleSelectTab('overview')}
            className={`portal-rail1-btn ${
              activeTab === 'overview'
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
            className="portal-rail1-btn portal-rail1-btn-inactive"
            title="Parent Preferences"
          >
            <div className="portal-rail1-icon-box">
              <Settings className="w-4 h-4 text-[#202124]" />
            </div>
            <span className={`portal-rail1-label transition-all duration-150 ${
              rail1Hovered ? 'opacity-100 max-w-[150px]' : 'opacity-0 max-w-0'
            }`}>
              Settings
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

      {/* ═════════════════════════════════════════════════════════════
          2. RAIL 2: SUB-SIDEBAR (240px COLLAPSIBLE)
         ═════════════════════════════════════════════════════════════ */}
      {rail2Open && (
        <aside className="portal-rail2 h-full z-20">
          <div className="flex-1 overflow-y-auto">
            <div className="px-3 pb-2 border-b border-gray-100 mb-2">
              <h3 className="portal-rail2-header-title">
                Parent Portal
              </h3>
              <p className="portal-rail2-header-sub">{schoolName}</p>
            </div>

            <div className="space-y-0.5 px-2">
              {[
                { id: 'overview', label: 'Academic Progress', icon: Users, badge: 'Live' },
                { id: 'experiments', label: 'Kolb Lab Observations', icon: FlaskConical, badge: '6 Done' },
                { id: 'reports', label: 'NEP 2020 Badges', icon: Award, badge: 'Gold' }
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
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
                      <Icon className="portal-rail2-item-icon text-amber-600" />
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
          3. MAIN CANVAS AREA (HIGH DENSITY PARENT LAYOUT)
         ═════════════════════════════════════════════════════════════ */}
      <main className="flex-1 overflow-y-auto bg-[#f8fafd]">
        <ContentSubHeader
          title={
            activeTab === 'overview'
              ? `Academic Performance & Lab Attendance — ${childName}`
              : activeTab === 'experiments'
              ? "Verified Science Practical Observations & Feedback"
              : "CBSE & NEP 2020 Experiential Lab Competencies"
          }
          subtitle={`${childClass} • ${schoolName}`}
          badge="Verified Student"
          badgeColor="bg-amber-50 text-amber-800 border-amber-200"
          isSidebarOpen={rail2Open}
          onToggleSidebar={() => setRail2Open(!rail2Open)}
          actions={
            <Button
              size="sm"
              variant="outline"
              onClick={() => alert(`Downloading Aarav's verified term transcript...`)}
              className="text-xs h-7.5 px-2.5 border-[#dadce0] text-[#3c4043] hover:bg-gray-50 rounded-md cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 mr-1 text-[#5f6368]" /> Term Progress PDF
            </Button>
          }
        />

        <div className="p-3.5 sm:p-4 space-y-3.5 max-w-6xl mx-auto w-full select-text">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-3.5">
              {/* Summary KPIs */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="bg-white p-3 rounded-lg border border-[#dadce0] shadow-[0_1px_2px_rgba(60,64,67,0.06)]">
                  <span className="text-[11px] font-semibold text-[#5f6368] uppercase">Lab Attendance</span>
                  <p className="text-xl font-semibold text-emerald-600 mt-1">96.4%</p>
                  <p className="text-[10px] text-[#5f6368]">27 of 28 sessions attended</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-[#dadce0] shadow-[0_1px_2px_rgba(60,64,67,0.06)]">
                  <span className="text-[11px] font-semibold text-[#5f6368] uppercase">Average Practical Score</span>
                  <p className="text-xl font-semibold text-[#202124] mt-1">19.2 / 20</p>
                  <p className="text-[10px] text-emerald-700 font-medium">Top 5% in Senior Secondary</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-[#dadce0] shadow-[0_1px_2px_rgba(60,64,67,0.06)]">
                  <span className="text-[11px] font-semibold text-[#5f6368] uppercase">Simulations Mastered</span>
                  <p className="text-xl font-semibold text-[#202124] mt-1">14 Labs</p>
                  <p className="text-[10px] text-[#5f6368]">Physics, Chemistry &amp; ATL</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-[#dadce0] shadow-[0_1px_2px_rgba(60,64,67,0.06)]">
                  <span className="text-[11px] font-semibold text-[#5f6368] uppercase">NEP 2020 Level</span>
                  <p className="text-xl font-semibold text-amber-600 mt-1">Gold</p>
                  <p className="text-[10px] text-[#5f6368]">Experiential Mastery</p>
                </div>
              </div>

              {/* Faculty Evaluation Card */}
              <div className="bg-white p-3.5 sm:p-4 rounded-lg border border-[#dadce0] shadow-[0_1px_2px_rgba(60,64,67,0.06)] space-y-2.5">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <h3 className="text-xs font-semibold text-[#202124] uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    Latest Faculty Remark &amp; Pedagogy Assessment
                  </h3>
                  <span className="text-[10px] font-semibold bg-blue-50 text-blue-800 px-2 py-0.5 rounded-full border border-blue-200">
                    Dr. Ramesh Sharma (PGT Physics)
                  </span>
                </div>
                <p className="text-xs text-[#3c4043] leading-relaxed">
                  "Aarav demonstrates exceptional apparatus precision during the Optical Bench focal length calibration and CRO waveform measurements. His observation journal submissions reflect strong adherence to the Kolb Experiential cycle."
                </p>
              </div>

              {/* Recent Practical Records Table */}
              <div className="bg-white rounded-lg border border-[#dadce0] p-3.5 shadow-[0_1px_2px_rgba(60,64,67,0.06)] space-y-2.5">
                <h3 className="text-xs font-semibold text-[#202124] uppercase tracking-wider">
                  Recent Experiential Practical Records
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-gray-50 border-b border-[#dadce0] text-[11px] text-[#5f6368] font-semibold uppercase">
                      <tr>
                        <th className="py-2 px-3">Subject &amp; Practical</th>
                        <th className="py-2 px-3">Completed Date</th>
                        <th className="py-2 px-3">Kolb Stage</th>
                        <th className="py-2 px-3 text-center">Score</th>
                        <th className="py-2 px-3 text-right">Verification</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {[
                        { practical: "Verification of Ohm's Law & Wire Resistivity", subject: "Physics", date: "22 Oct 2026", stage: "Active Experimentation", score: "19 / 20" },
                        { practical: "Acid-Base Titration: Oxalic Acid vs KMnO4", subject: "Chemistry", date: "15 Oct 2026", stage: "Abstract Conceptualization", score: "20 / 20" },
                        { practical: "Spherometer Radius of Curvature of Spherical Lens", subject: "Physics", date: "08 Oct 2026", stage: "Reflective Observation", score: "18 / 20" }
                      ].map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/80">
                          <td className="py-2.5 px-3 font-semibold text-[#202124]">
                            {item.practical}
                            <span className="ml-2 text-[10px] font-normal text-[#5f6368]">({item.subject})</span>
                          </td>
                          <td className="py-2.5 px-3 text-[#5f6368] text-[11px]">{item.date}</td>
                          <td className="py-2.5 px-3">
                            <span className="text-[10px] font-medium bg-purple-50 text-purple-800 px-1.5 py-0.2 rounded border border-purple-200">
                              {item.stage}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center font-semibold text-emerald-700">{item.score}</td>
                          <td className="py-2.5 px-3 text-right">
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Teacher Verified
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EXPERIMENTS */}
          {activeTab === 'experiments' && (
            <div className="bg-white p-3.5 sm:p-4 rounded-lg border border-[#dadce0] shadow-[0_1px_2px_rgba(60,64,67,0.06)] space-y-3">
              <h3 className="text-xs font-semibold text-[#202124] uppercase tracking-wider">
                Full Academic Science Journal Portfolio
              </h3>
              <p className="text-[11px] text-[#5f6368]">
                Every experiment conducted by Aarav includes real-time instrument telemetry, virtual error analysis, and formula derivations.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-[#f8fafd] rounded-md border border-[#dadce0] space-y-1.5">
                  <p className="font-semibold text-[#202124]">Dual-Trace Cathode Ray Oscilloscope (CRO)</p>
                  <p className="text-[11px] text-[#5f6368]">Frequency calibration: 50 Hz sine waveform, Lissajous figures analysis.</p>
                  <span className="text-[10px] font-semibold text-emerald-700">Graded: 10/10</span>
                </div>
                <div className="p-3 bg-[#f8fafd] rounded-md border border-[#dadce0] space-y-1.5">
                  <p className="font-semibold text-[#202124]">Spectrometer Angle of Minimum Deviation</p>
                  <p className="text-[11px] text-[#5f6368]">Prism index calculation: Angle Dm = 38.4 degrees measured with vernier.</p>
                  <span className="text-[10px] font-semibold text-emerald-700">Graded: 9.5/10</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: REPORTS */}
          {activeTab === 'reports' && (
            <div className="bg-white p-3.5 sm:p-4 rounded-lg border border-[#dadce0] shadow-[0_1px_2px_rgba(60,64,67,0.06)] space-y-3">
              <h3 className="text-xs font-semibold text-[#202124] uppercase tracking-wider">
                NEP 2020 Experiential Practical Credentials &amp; Badges
              </h3>
              <div className="p-3 bg-gradient-to-br from-amber-50 to-orange-50/30 rounded-lg border border-amber-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded">
                    Gold Competency
                  </span>
                  <Award className="w-4 h-4 text-amber-600" />
                </div>
                <p className="font-semibold text-[#202124] text-xs">Senior Secondary Experimental Physics Mastery</p>
                <p className="text-[11px] text-[#5f6368]">Completed 24 core CBSE senior practicals with precision laboratory instrumentation calibration.</p>
                <p className="text-[10px] text-amber-800 font-medium">Credential ID: CSEEL-EXP-2026-9812</p>
              </div>
            </div>
          )}
        </div>
      </main>
      </div>
    </LayoutWrapper>
  );
}
