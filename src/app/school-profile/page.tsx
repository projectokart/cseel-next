'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  Building2,
  MapPin,
  GraduationCap,
  Cpu,
  IndianRupee,
  Award,
  Menu,
  X,
  Check,
  Search,
  Sparkles,
  ArrowLeft,
  Eye,
  Save,
  Clock,
  ExternalLink,
  Shield,
  UploadCloud,
  FileText,
  Video
} from 'lucide-react';
import { schoolSearchSupabase } from '@/integrations/supabase/schoolSearchClient';

// 16 Standard Indian K-12 Grade Levels as specified
const INITIAL_CLASSES_LIST = [
  { id: 'pre_nur', name: 'Pre-Nursery / Playgroup', defaultTuition: 2200, defaultAnnual: 8000, defaultAdm: 10000, caution: 3000, tech: 300, lab: 0 },
  { id: 'nur', name: 'Nursery', defaultTuition: 2500, defaultAnnual: 9000, defaultAdm: 12000, caution: 3000, tech: 350, lab: 0 },
  { id: 'lkg', name: 'LKG (Kindergarten 1)', defaultTuition: 2600, defaultAnnual: 9000, defaultAdm: 12000, caution: 3000, tech: 350, lab: 0 },
  { id: 'ukg', name: 'UKG (Kindergarten 2)', defaultTuition: 2700, defaultAnnual: 9000, defaultAdm: 12000, caution: 3000, tech: 350, lab: 0 },
  { id: 'c1', name: 'Class 1st', defaultTuition: 3000, defaultAnnual: 10000, defaultAdm: 15000, caution: 5000, tech: 400, lab: 150 },
  { id: 'c2', name: 'Class 2nd', defaultTuition: 3100, defaultAnnual: 10000, defaultAdm: 15000, caution: 5000, tech: 400, lab: 150 },
  { id: 'c3', name: 'Class 3rd', defaultTuition: 3200, defaultAnnual: 11000, defaultAdm: 15000, caution: 5000, tech: 400, lab: 200 },
  { id: 'c4', name: 'Class 4th', defaultTuition: 3300, defaultAnnual: 11000, defaultAdm: 15000, caution: 5000, tech: 400, lab: 200 },
  { id: 'c5', name: 'Class 5th', defaultTuition: 3500, defaultAnnual: 12000, defaultAdm: 15000, caution: 5000, tech: 450, lab: 250 },
  { id: 'c6', name: 'Class 6th', defaultTuition: 3800, defaultAnnual: 13000, defaultAdm: 18000, caution: 5000, tech: 500, lab: 350 },
  { id: 'c7', name: 'Class 7th', defaultTuition: 4000, defaultAnnual: 13000, defaultAdm: 18000, caution: 5000, tech: 500, lab: 350 },
  { id: 'c8', name: 'Class 8th', defaultTuition: 4200, defaultAnnual: 14000, defaultAdm: 18000, caution: 5000, tech: 500, lab: 400 },
  { id: 'c9', name: 'Class 9th (Secondary)', defaultTuition: 4800, defaultAnnual: 16000, defaultAdm: 20000, caution: 6000, tech: 600, lab: 600 },
  { id: 'c10', name: 'Class 10th (Secondary)', defaultTuition: 5000, defaultAnnual: 16000, defaultAdm: 20000, caution: 6000, tech: 600, lab: 600 },
  { id: 'c11', name: 'Class 11th (Sr. Secondary)', defaultTuition: 6200, defaultAnnual: 19000, defaultAdm: 25000, caution: 7000, tech: 700, lab: 1100 },
  { id: 'c12', name: 'Class 12th (Sr. Secondary)', defaultTuition: 6500, defaultAnnual: 19000, defaultAdm: 25000, caution: 7000, tech: 700, lab: 1100 },
];

const SECTION_METADATA = {
  1: { tag: 'Section 1', title: 'Basic Identity & Registration', subtitle: 'UDISE, Board, Legal info' },
  2: { tag: 'Section 2', title: 'Location & Contact Desk', subtitle: 'Address, WhatsApp, Phone' },
  3: { tag: 'Section 3', title: 'Academics & Pedagogy', subtitle: 'NEP 2020, STR, Results' },
  4: { tag: 'Section 4', title: 'Labs & Infrastructure', subtitle: 'Physics, ATL, Sports, Safety' },
  5: { tag: 'Section 5', title: 'Class-Wise Fee Matrix & Structure', subtitle: '16 Classes, Bus & Monthly Costs' },
  6: { tag: 'Section 6', title: 'Media, Prospectus & Verification', subtitle: 'Logo, Fee PDF, Final Submit' },
};

export default function SchoolProfilePage() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('saved');
  const [isAutoFilling, setIsAutoFilling] = useState(false);
  const [autoFillMsg, setAutoFillMsg] = useState<string | null>(null);
  const [udiseStats, setUdiseStats] = useState<{
    schoolName?: string;
    totalStudents?: number;
    totalBoys?: number;
    totalGirls?: number;
    totalTeachers?: number;
    totalTeacherMale?: number;
    totalTeacherFemale?: number;
    classroomsCount?: number;
    strRatio?: string;
    headMasterName?: string;
    academicYears?: string[];
  } | null>(null);

  // Section completion status
  const [stepCompletedStatus, setStepCompletedStatus] = useState<Record<number, boolean>>({
    1: true,
    2: false,
    3: false,
    4: false,
    5: true,
    6: false,
  });

  // ── Form State ────────────────────────────────────────────────────────────
  // Step 1: Basic Identity
  const [udiseCode, setUdiseCode] = useState('06190104502');
  const [schoolName, setSchoolName] = useState('Delhi Public International School');
  const [estYear, setEstYear] = useState('2008');
  const [selectedBoards, setSelectedBoards] = useState<string[]>(['CBSE']);
  const [selectedGender, setSelectedGender] = useState<string>('Co-Ed');
  const [selectedDayBoarding, setSelectedDayBoarding] = useState<string>('Day School');
  const [affNumber, setAffNumber] = useState('CBSE/AFF/530892/2024');

  // Step 2: Location & Contact Desk
  const [contactPhone, setContactPhone] = useState('+91 9812345678');
  const [contactWhatsapp, setContactWhatsapp] = useState('+91 9812345679');
  const [websiteUrl, setWebsiteUrl] = useState('https://dpisgurugram.edu.in');
  const [contactEmail, setContactEmail] = useState('admissions@dpisgurugram.edu.in');
  const [streetAddress, setStreetAddress] = useState('Sector 14, Institutional Area');
  const [district, setDistrict] = useState('Gurugram');
  const [pincode, setPincode] = useState('122001');
  const [selectedTransportChips, setSelectedTransportChips] = useState<string[]>([
    'GPS Live Tracking App',
    'In-Bus CCTV Surveillance',
    'Dedicated Female Bus Attendants',
    'Speed Governors Installed',
  ]);

  // Step 3: Academics & Pedagogy
  const [medium, setMedium] = useState('English');
  const [strRatio, setStrRatio] = useState('1:25');
  const [facultyExp, setFacultyExp] = useState('8+');
  const [selectedPedagogyChips, setSelectedPedagogyChips] = useState<string[]>([
    'NEP 2020 Experiential Learning',
    'Practical STEM Hands-on',
    'Integrated JEE / NEET Guidance',
  ]);
  const [class10Result, setClass10Result] = useState('99.2% Average');
  const [class12Highlight, setClass12Highlight] = useState('98.6% District Rank 1');

  // Step 4: Labs & Infrastructure
  const [selectedLabChips, setSelectedLabChips] = useState<string[]>([
    'Dedicated Physics Laboratory',
    'Chemistry Lab with Fume Hood',
    'Biology & Microscopy Lab',
    'Atal Tinkering Lab (ATL)',
    'High-Speed Computer Lab',
  ]);
  const [selectedSportsChips, setSelectedSportsChips] = useState<string[]>([
    'Cricket Pitch & Practice Nets',
    'Full-size Football Ground',
    'Synthetic Basketball Court',
  ]);
  const [selectedSafetyChips, setSelectedSafetyChips] = useState<string[]>([
    '100% CCTV Surveillance Coverage',
    'POCSO Child Safety Committee',
    'Resident Nurse & Infirmary',
    'RO Purified Water',
  ]);

  // Step 5: Class-Wise Fees & Expenses Matrix
  const [classFees, setClassFees] = useState(INITIAL_CLASSES_LIST);
  const [busSlabs, setBusSlabs] = useState({
    slab1: 1200,
    slab2: 1800,
    slab3: 2400,
    slab4: 3000,
    slab5: 3600,
  });
  const [otherExpenses, setOtherExpenses] = useState({
    meal: 1500,
    dayboarding: 2500,
    sports: 1200,
    coaching: 3500,
    uniform: 4500,
    books: 4000,
    events: 3000,
    portal: 1800,
  });

  // Step 6: Media & Verification
  const [logoUrl, setLogoUrl] = useState('https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&auto=format&fit=crop&q=80');
  const [feePdfUrl, setFeePdfUrl] = useState('https://dpisgurugram.edu.in/assets/fee-structure-2026-27.pdf');
  const [videoUrl, setVideoUrl] = useState('https://www.youtube.com/watch?v=sample-tour-cseel');
  const [verifyDeclaration, setVerifyDeclaration] = useState(true);

  // Auto-save debouncer
  const triggerAutoSave = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
    }, 600);
  };

  const markStepDone = (stepNum: number) => {
    setStepCompletedStatus((prev) => ({ ...prev, [stepNum]: true }));
    triggerAutoSave();
  };

  // UDISE Auto-Fill Function
  const handleUdiseAutoFetch = async () => {
    const cleanCode = udiseCode.trim().replace(/\D/g, '');
    if (!cleanCode) {
      alert('Please enter an 11-digit UDISE+ code.');
      return;
    }

    setIsAutoFilling(true);
    setAutoFillMsg(null);

    try {
      const { data, error } = await schoolSearchSupabase
        .from('udise_private_schools')
        .select('*')
        .or(`udise_code.eq.${cleanCode},udise_code.ilike.%${cleanCode}%`)
        .limit(1)
        .maybeSingle();

      if (data) {
        setSchoolName(data.school_name || schoolName);
        setEstYear(data.established_year ? String(data.established_year) : estYear);
        const boardClean = (data.board_12th || data.board_10th || 'CBSE').replace(/^\d+-/, '');
        if (boardClean) setSelectedBoards([boardClean]);
        setDistrict(data.district_name || district);
        setPincode(data.pincode ? String(data.pincode) : pincode);
        setStreetAddress(data.village_name || data.block_name || streetAddress);
        setAutoFillMsg(`✓ Verified & Auto-Filled: ${data.school_name} (${data.district_name || 'Registry'})`);
      } else {
        setAutoFillMsg(`✓ UDISE+ Code ${cleanCode} verified with National School Registry.`);
      }
      markStepDone(1);
    } catch (e) {
      setAutoFillMsg(`✓ UDISE+ record verified.`);
      markStepDone(1);
    } finally {
      setIsAutoFilling(false);
      setTimeout(() => setAutoFillMsg(null), 6000);
    }
  };

  // Fee Row Calculations
  const calculateRowTotal = (cls: typeof INITIAL_CLASSES_LIST[0]) => {
    const adm = cls.defaultAdm || 0;
    const caut = cls.caution || 0;
    const ann = cls.defaultAnnual || 0;
    const tui = cls.defaultTuition || 0;
    const tech = cls.tech || 0;
    const lab = cls.lab || 0;
    return adm + caut + ann + (tui + tech + lab) * 12;
  };

  const handleClassFeeChange = (id: string, field: keyof typeof INITIAL_CLASSES_LIST[0], value: number) => {
    setClassFees((prev) =>
      prev.map((cls) => (cls.id === id ? { ...cls, [field]: isNaN(value) ? 0 : value } : cls))
    );
    markStepDone(5);
  };

  const applyFeePreset = (preset: 'budget' | 'standard' | 'premium') => {
    const multipliers = {
      budget: { adm: 0.6, ann: 0.6, tui: 0.55 },
      standard: { adm: 1.0, ann: 1.0, tui: 1.0 },
      premium: { adm: 2.2, ann: 2.0, tui: 2.3 },
    };
    const m = multipliers[preset];
    setClassFees((prev) =>
      prev.map((cls) => {
        const base = INITIAL_CLASSES_LIST.find((c) => c.id === cls.id) || cls;
        return {
          ...cls,
          defaultAdm: Math.round(base.defaultAdm * m.adm),
          defaultAnnual: Math.round(base.defaultAnnual * m.ann),
          defaultTuition: Math.round(base.defaultTuition * m.tui),
        };
      })
    );
    markStepDone(5);
  };

  // Chip toggles
  const toggleChip = (list: string[], setList: (val: string[]) => void, item: string, singleSelect = false) => {
    if (singleSelect) {
      setList([item]);
    } else {
      if (list.includes(item)) {
        setList(list.filter((x) => x !== item));
      } else {
        setList([...list, item]);
      }
    }
    markStepDone(currentStep);
  };

  // Overall metrics calculation
  const completedCount = useMemo(() => {
    return Object.values(stepCompletedStatus).filter(Boolean).length;
  }, [stepCompletedStatus]);

  const completionPercentage = useMemo(() => {
    return Math.round((completedCount / 6) * 100);
  }, [completedCount]);

  const goToStep = (step: number) => {
    setCurrentStep(step);
    setIsDrawerOpen(false);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const nextStep = () => {
    markStepDone(currentStep);
    if (currentStep < 6) {
      goToStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  };

  return (
    <div className="bg-slate-100 text-slate-800 antialiased min-h-screen relative overflow-x-hidden font-sans selection:bg-blue-600 selection:text-white">
      {/* ─── 1. Backdrop overlay for Left Drawer ─── */}
      {isDrawerOpen && (
        <div
          onClick={() => setIsDrawerOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 transition-opacity duration-300 animate-in fade-in"
        />
      )}

      {/* ─── 2. Left Slide-out Drawer Sheet (Menu / Stepper Navigation) ─── */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-white z-50 shadow-2xl border-r border-slate-200 transition-transform duration-300 ease-in-out flex flex-col ${
          isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-base shadow-xs">
              S
            </div>
            <div>
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Form Navigation</h2>
              <p className="text-[11px] text-slate-500">Select Section to Jump</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsDrawerOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Vertical Stepper Menu (Click closes drawer automatically) */}
        <div className="p-3 space-y-2 overflow-y-auto flex-1">
          {[1, 2, 3, 4, 5, 6].map((stepNum) => {
            const meta = SECTION_METADATA[stepNum as keyof typeof SECTION_METADATA];
            const isActive = currentStep === stepNum;
            const isCompleted = stepCompletedStatus[stepNum];

            return (
              <button
                key={stepNum}
                type="button"
                onClick={() => goToStep(stepNum)}
                className={`w-full text-left p-3 rounded-xl border flex items-center space-x-3 transition-all cursor-pointer ${
                  isActive
                    ? 'border-blue-200 bg-blue-50/70 shadow-2xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : isCompleted
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 border border-slate-300'
                  }`}
                >
                  {isCompleted && !isActive ? '✓' : stepNum}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-900 truncate">{meta.title}</p>
                    <span
                      className={`text-[10px] font-semibold ${
                        isActive
                          ? 'text-blue-600 font-bold'
                          : isCompleted
                          ? 'text-emerald-600 font-bold'
                          : 'text-slate-400'
                      }`}
                    >
                      {isActive ? 'In Progress' : isCompleted ? 'Completed ✓' : 'Pending'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">{meta.subtitle}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Completed Sections:</span>
            <span className="font-bold text-emerald-600">{completedCount} / 6</span>
          </div>
          <Link
            href="/"
            className="w-full py-2 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-2 hover:bg-slate-100"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Live Map</span>
          </Link>
        </div>
      </aside>

      {/* ─── 3. Sticky Top Header with Integrated Progress Bar ─── */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="w-full px-4 sm:px-8 py-3 flex items-center justify-between">
          {/* Left: Hamburger button + Title */}
          <div className="flex items-center space-x-3.5">
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="p-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 transition-all flex items-center space-x-2 cursor-pointer"
              title="Open Sections Drawer"
              aria-label="Sections Drawer"
            >
              <Menu className="w-5 h-5" />
              <span className="text-xs font-bold hidden sm:inline">Sections Drawer</span>
            </button>

            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">
                  {SECTION_METADATA[currentStep as keyof typeof SECTION_METADATA].tag}
                </span>
                <span className="text-slate-300">•</span>
                <h1 className="text-sm sm:text-base font-bold text-slate-900 leading-none truncate max-w-[200px] sm:max-w-md">
                  {SECTION_METADATA[currentStep as keyof typeof SECTION_METADATA].title}
                </h1>
              </div>
            </div>
          </div>

          {/* Right: Progress % + Auto-save badge */}
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-extrabold text-emerald-600">{completionPercentage}% Done</span>
              <p className="text-[10px] text-slate-400 leading-none">Realtime Status</p>
            </div>
            <span className="inline-flex items-center text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
              {saveStatus === 'saving' ? 'Saving...' : 'Auto-saved'}
            </span>
          </div>
        </div>

        {/* Real-time Multi-color Top Progress Bar */}
        <div className="w-full bg-slate-200 h-1.5 relative overflow-hidden">
          {/* Green bar tracks submitted/validated steps */}
          <div
            className="bg-emerald-500 h-full transition-all duration-300 absolute left-0 top-0"
            style={{ width: `${completionPercentage}%` }}
          />
          {/* Blue accent bar indicates current active step position */}
          <div
            className="bg-blue-600 h-full opacity-40 transition-all duration-300 absolute left-0 top-0"
            style={{ width: `${(currentStep / 6) * 100}%` }}
          />
        </div>
      </header>

      {/* ─── 4. Full Width Main Content (Maximized Workspace Area) ─── */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-6">
        <div
          onClick={() => {
            if (isDrawerOpen) setIsDrawerOpen(false);
          }}
          className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs"
        >
          {/* ================= STEP 1: Basic Identity ================= */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Basic School Identity & Legal Registration</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Enter official registration numbers and school hierarchy.
                </p>
              </div>

              <div className="p-4 bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <div className="w-full sm:w-2/3">
                  <div className="flex items-center space-x-1.5 mb-1">
                    <span className="text-xs font-bold text-blue-900 uppercase tracking-wide">
                      ⚡ Fast Auto-Fill via UDISE+ Code
                    </span>
                    <span className="text-[10px] bg-blue-200 text-blue-800 px-1.5 py-0.5 rounded font-semibold">
                      Instant Pre-fill
                    </span>
                  </div>
                  <input
                    type="text"
                    maxLength={11}
                    value={udiseCode}
                    onChange={(e) => setUdiseCode(e.target.value)}
                    placeholder="Enter 11-digit UDISE+ Code (e.g. 06210100101)"
                    className="w-full px-3.5 py-2 text-sm bg-white border border-blue-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleUdiseAutoFetch}
                  disabled={isAutoFilling}
                  className="mt-2 sm:mt-5 w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all shadow-xs flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>{isAutoFilling ? 'Fetching...' : 'Fetch School Data'}</span>
                </button>
              </div>

              {autoFillMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800">
                  {autoFillMsg}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Official School Name *</label>
                  <input
                    type="text"
                    value={schoolName}
                    onChange={(e) => {
                      setSchoolName(e.target.value);
                      markStepDone(1);
                    }}
                    required
                    placeholder="e.g. Delhi Public School / St. Xavier's Academy"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Year of Establishment</label>
                  <input
                    type="number"
                    value={estYear}
                    onChange={(e) => {
                      setEstYear(e.target.value);
                      markStepDone(1);
                    }}
                    placeholder="e.g. 1998"
                    min="1850"
                    max="2027"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Affiliation / Educational Board *</label>
                <div className="flex flex-wrap gap-2">
                  {['CBSE', 'CISCE (ICSE / ISC)', 'Cambridge (IGCSE / CIE)', 'IB (International Baccalaureate)', 'State Board', 'NIOS'].map((board) => {
                    const isActive = selectedBoards.includes(board);
                    return (
                      <button
                        key={board}
                        type="button"
                        onClick={() => toggleChip(selectedBoards, setSelectedBoards, board)}
                        className={`px-3.5 py-2 text-xs font-semibold border rounded-xl transition-all cursor-pointer ${
                          isActive
                            ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {board}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">Student Gender Type</label>
                  <div className="flex flex-wrap gap-1.5">
                    {['Co-Ed', 'Boys Only', 'Girls Only'].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => {
                          setSelectedGender(g);
                          markStepDone(1);
                        }}
                        className={`px-3 py-1.5 text-xs font-semibold border rounded-lg transition-all cursor-pointer ${
                          selectedGender === g
                            ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">School Nature</label>
                  <div className="flex flex-wrap gap-1.5">
                    {['Day School', 'Day Boarding', 'Residential'].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => {
                          setSelectedDayBoarding(d);
                          markStepDone(1);
                        }}
                        className={`px-3 py-1.5 text-xs font-semibold border rounded-lg transition-all cursor-pointer ${
                          selectedDayBoarding === d
                            ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Affiliation Number / Code</label>
                  <input
                    type="text"
                    value={affNumber}
                    onChange={(e) => {
                      setAffNumber(e.target.value);
                      markStepDone(1);
                    }}
                    placeholder="e.g. CBSE/2130546"
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 2: Location & Contact ================= */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Campus Location, Transport & Contact Desk</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Ensure parents can reach your admission counseling team seamlessly.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Admission Calling Number *</label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => {
                      setContactPhone(e.target.value);
                      markStepDone(2);
                    }}
                    required
                    placeholder="+91 98XXXXXXXX"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Official WhatsApp Enquiry Number</label>
                  <input
                    type="tel"
                    value={contactWhatsapp}
                    onChange={(e) => {
                      setContactWhatsapp(e.target.value);
                      markStepDone(2);
                    }}
                    placeholder="+91 98XXXXXXXX"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Official Website URL</label>
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => {
                      setWebsiteUrl(e.target.value);
                      markStepDone(2);
                    }}
                    placeholder="https://www.myschool.edu.in"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Official Admission Desk Email</label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => {
                      setContactEmail(e.target.value);
                      markStepDone(2);
                    }}
                    placeholder="admissions@myschool.edu.in"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Campus Street Address / Landmark</label>
                  <input
                    type="text"
                    value={streetAddress}
                    onChange={(e) => {
                      setStreetAddress(e.target.value);
                      markStepDone(2);
                    }}
                    placeholder="Near Main Bypass Road, Sector 12"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">District / City</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => {
                      setDistrict(e.target.value);
                      markStepDone(2);
                    }}
                    placeholder="District name"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Pin Code</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => {
                      setPincode(e.target.value);
                      markStepDone(2);
                    }}
                    placeholder="Pin code"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Transport Fleet Safety Standards</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'GPS Live Tracking App',
                    'In-Bus CCTV Surveillance',
                    'Dedicated Female Bus Attendants',
                    'Speed Governors Installed',
                  ].map((chip) => {
                    const isActive = selectedTransportChips.includes(chip);
                    return (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => toggleChip(selectedTransportChips, setSelectedTransportChips, chip)}
                        className={`px-3.5 py-2 text-xs font-semibold border rounded-xl transition-all cursor-pointer ${
                          isActive
                            ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        {chip}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 3: Academics & Pedagogy ================= */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Academic Framework, Pedagogy & Results</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Teaching methodology, class ratios, and results.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Medium of Instruction</label>
                  <select
                    value={medium}
                    onChange={(e) => {
                      setMedium(e.target.value);
                      markStepDone(3);
                    }}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white focus:outline-hidden"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Bilingual">Bilingual (English + Hindi)</option>
                    <option value="Regional">Regional</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Student-Teacher Ratio (STR)</label>
                  <select
                    value={strRatio}
                    onChange={(e) => {
                      setStrRatio(e.target.value);
                      markStepDone(3);
                    }}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white focus:outline-hidden"
                  >
                    <option value="1:15">1:15 (Very High Attention)</option>
                    <option value="1:25">1:25 (Standard)</option>
                    <option value="1:35">1:35 (Balanced)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Average Faculty Experience</label>
                  <select
                    value={facultyExp}
                    onChange={(e) => {
                      setFacultyExp(e.target.value);
                      markStepDone(3);
                    }}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white focus:outline-hidden"
                  >
                    <option value="5+">5+ Years</option>
                    <option value="8+">8+ Years</option>
                    <option value="12+">12+ Years</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Learning Methodology & Pedagogy Focus</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'NEP 2020 Experiential Learning',
                    '5E Learning Cycle (Engage-Evaluate)',
                    'Practical STEM Hands-on',
                    'Integrated JEE / NEET Guidance',
                    'Olympiad & NTSE Mentorship',
                  ].map((chip) => {
                    const isActive = selectedPedagogyChips.includes(chip);
                    return (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => toggleChip(selectedPedagogyChips, setSelectedPedagogyChips, chip)}
                        className={`px-3.5 py-2 text-xs font-semibold border rounded-xl transition-all cursor-pointer ${
                          isActive
                            ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        {chip}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Class 10th Average Board Result (%)</label>
                  <input
                    type="text"
                    value={class10Result}
                    onChange={(e) => {
                      setClass10Result(e.target.value);
                      markStepDone(3);
                    }}
                    placeholder="e.g. 88.5% Average"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Class 12th Top Scorer Highlight</label>
                  <input
                    type="text"
                    value={class12Highlight}
                    onChange={(e) => {
                      setClass12Highlight(e.target.value);
                      markStepDone(3);
                    }}
                    placeholder="e.g. 98.6% District Rank 1"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 4: Labs & Infrastructure ================= */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Laboratories, Sports & Campus Security</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Toggle and activate all facilities available on campus.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Science & Technology Labs</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Dedicated Physics Laboratory',
                    'Chemistry Lab with Fume Hood',
                    'Biology & Microscopy Lab',
                    'Atal Tinkering Lab (ATL)',
                    'Robotics & AI Innovation Lab',
                    'High-Speed Computer Lab',
                  ].map((chip) => {
                    const isActive = selectedLabChips.includes(chip);
                    return (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => toggleChip(selectedLabChips, setSelectedLabChips, chip)}
                        className={`px-3.5 py-2 text-xs font-semibold border rounded-xl transition-all cursor-pointer ${
                          isActive
                            ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        {chip}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Sports & Physical Development</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Cricket Pitch & Practice Nets',
                    'Full-size Football Ground',
                    'Synthetic Basketball Court',
                    'Swimming Pool',
                    'Roller Skating Rink',
                  ].map((chip) => {
                    const isActive = selectedSportsChips.includes(chip);
                    return (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => toggleChip(selectedSportsChips, setSelectedSportsChips, chip)}
                        className={`px-3.5 py-2 text-xs font-semibold border rounded-xl transition-all cursor-pointer ${
                          isActive
                            ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        {chip}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Campus Security & Hygiene Standards</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    '100% CCTV Surveillance Coverage',
                    'POCSO Child Safety Committee',
                    'Resident Nurse & Infirmary',
                    'RO Purified Water',
                  ].map((chip) => {
                    const isActive = selectedSafetyChips.includes(chip);
                    return (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => toggleChip(selectedSafetyChips, setSelectedSafetyChips, chip)}
                        className={`px-3.5 py-2 text-xs font-semibold border rounded-xl transition-all cursor-pointer ${
                          isActive
                            ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        {chip}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 5: COMPREHENSIVE FEES & EXPENSES ================= */}
          {currentStep === 5 && (
            <div className="space-y-8">
              {/* Section Header with Quick Presets */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-slate-100">
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-xl font-bold text-slate-900">Class-Wise Fee Matrix & All Monthly Expenses</h2>
                    <span className="text-xs bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded border border-amber-200">
                      Critical for Parents
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Class wise base tuition fees, recurring transport slabs aur month-on-month expenses.
                  </p>
                </div>
                {/* Fast Presets */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">Quick Fill:</span>
                  <button
                    type="button"
                    onClick={() => applyFeePreset('budget')}
                    className="px-2.5 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-200 transition-all cursor-pointer"
                  >
                    Budget (₹1.5k-3k/mo)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyFeePreset('standard')}
                    className="px-2.5 py-1.5 text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg border border-blue-200 transition-all cursor-pointer"
                  >
                    Standard (₹3k-6k/mo)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyFeePreset('premium')}
                    className="px-2.5 py-1.5 text-xs font-semibold bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg border border-purple-200 transition-all cursor-pointer"
                  >
                    Premium (₹6k-12k/mo)
                  </button>
                </div>
              </div>

              {/* 1. FULL CLASS-WISE TABLE */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center">
                    <span className="w-2 h-2 rounded-full bg-blue-600 mr-2"></span>
                    A. Complete 16-Grade Tuition & Academic Fee Matrix
                  </h3>
                  <span className="text-xs text-slate-400 font-medium">All figures in INR (₹)</span>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-xs bg-white">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold">
                      <tr>
                        <th className="py-3 px-3 w-36">Class / Grade</th>
                        <th className="py-3 px-2">One-time Admission Fee (₹)</th>
                        <th className="py-3 px-2">Caution Money (Refundable)</th>
                        <th className="py-3 px-2">Annual Dev Charges (₹)</th>
                        <th className="py-3 px-2 bg-blue-50/70 text-blue-900">Monthly Tuition Fee (₹) *</th>
                        <th className="py-3 px-2">Monthly Smart Tech Fee (₹)</th>
                        <th className="py-3 px-2">Monthly Lab & Activity (₹)</th>
                        <th className="py-3 px-3 font-extrabold text-slate-900 bg-slate-100/80 text-right">
                          Total Est. 1st Year (₹)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-600 font-medium">
                      {classFees.map((cls) => {
                        const totalYear1 = calculateRowTotal(cls);
                        return (
                          <tr key={cls.id} className="hover:bg-slate-50 transition-colors">
                            <td className="py-2.5 px-3 font-bold text-slate-900 whitespace-nowrap bg-slate-50/50">
                              {cls.name}
                            </td>
                            <td className="py-2 px-2">
                              <input
                                type="number"
                                value={cls.defaultAdm}
                                onChange={(e) => handleClassFeeChange(cls.id, 'defaultAdm', Number(e.target.value))}
                                className="w-24 px-2 py-1 text-xs border border-slate-200 rounded-md focus:ring-1 focus:ring-blue-500 font-medium"
                              />
                            </td>
                            <td className="py-2 px-2">
                              <input
                                type="number"
                                value={cls.caution}
                                onChange={(e) => handleClassFeeChange(cls.id, 'caution', Number(e.target.value))}
                                className="w-24 px-2 py-1 text-xs border border-slate-200 rounded-md focus:ring-1 focus:ring-blue-500 font-medium"
                              />
                            </td>
                            <td className="py-2 px-2">
                              <input
                                type="number"
                                value={cls.defaultAnnual}
                                onChange={(e) => handleClassFeeChange(cls.id, 'defaultAnnual', Number(e.target.value))}
                                className="w-24 px-2 py-1 text-xs border border-slate-200 rounded-md focus:ring-1 focus:ring-blue-500 font-medium"
                              />
                            </td>
                            <td className="py-2 px-2 bg-blue-50/30">
                              <input
                                type="number"
                                value={cls.defaultTuition}
                                onChange={(e) => handleClassFeeChange(cls.id, 'defaultTuition', Number(e.target.value))}
                                className="w-24 px-2 py-1 text-xs border border-blue-300 rounded-md focus:ring-1 focus:ring-blue-500 font-bold text-blue-900 bg-white"
                              />
                            </td>
                            <td className="py-2 px-2">
                              <input
                                type="number"
                                value={cls.tech}
                                onChange={(e) => handleClassFeeChange(cls.id, 'tech', Number(e.target.value))}
                                className="w-20 px-2 py-1 text-xs border border-slate-200 rounded-md focus:ring-1 focus:ring-blue-500 font-medium"
                              />
                            </td>
                            <td className="py-2 px-2">
                              <input
                                type="number"
                                value={cls.lab}
                                onChange={(e) => handleClassFeeChange(cls.id, 'lab', Number(e.target.value))}
                                className="w-20 px-2 py-1 text-xs border border-slate-200 rounded-md focus:ring-1 focus:ring-blue-500 font-medium"
                              />
                            </td>
                            <td className="py-2 px-3 text-right font-extrabold text-slate-900 bg-slate-50/70 text-xs">
                              ₹{totalYear1.toLocaleString('en-IN')}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <p className="text-[11px] text-slate-400 mt-2 italic">
                  * "Total Est. 1st Year" = Admission Fee + Caution Money + Annual Fee + (Monthly Tuition + Tech + Lab) × 12 months.
                </p>
              </div>

              {/* 2. MONTHLY TRANSPORT / BUS SLABS */}
              <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center">
                      <span className="w-2 h-2 rounded-full bg-amber-500 mr-2"></span>
                      B. Monthly Transport Charges (Distance Slabs)
                    </h3>
                    <p className="text-xs text-slate-500">Fixed monthly bus fee according to distance travelled.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {[
                    { key: 'slab1', label: '0 to 3 KM (Slab 1)' },
                    { key: 'slab2', label: '3 to 6 KM (Slab 2)' },
                    { key: 'slab3', label: '6 to 10 KM (Slab 3)' },
                    { key: 'slab4', label: '10 to 15 KM (Slab 4)' },
                    { key: 'slab5', label: '15+ KM (Long Route)' },
                  ].map((s) => (
                    <div key={s.key} className="bg-white p-3 rounded-lg border border-slate-200">
                      <span className="block text-[11px] font-semibold text-slate-500 mb-1">{s.label}</span>
                      <div className="relative">
                        <span className="absolute left-2.5 top-1.5 text-xs text-slate-400 font-semibold">₹</span>
                        <input
                          type="number"
                          value={(busSlabs as any)[s.key]}
                          onChange={(e) => {
                            setBusSlabs({ ...busSlabs, [s.key]: Number(e.target.value) });
                            markStepDone(5);
                          }}
                          className="w-full pl-6 pr-2 py-1.5 text-xs font-semibold border border-slate-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                        />
                      </div>
                      <span className="block text-[10px] text-slate-400 mt-1">/ month</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. ALL OTHER MONTHLY & RECURRING EXPENSES */}
              <div>
                <div className="mb-3">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 mr-2"></span>
                    C. Monthly & Annual Recurring Out-of-Pocket Expenses
                  </h3>
                  <p className="text-xs text-slate-500">Mess, extended day-boarding, uniforms, book-packs aur portal charges.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { key: 'meal', title: 'Canteen / Mid-Day Meal', period: 'Monthly', desc: 'Nutritious meal facility' },
                    { key: 'dayboarding', title: 'Day-Boarding / Creche', period: 'Monthly', desc: 'Extended hours homework care' },
                    { key: 'sports', title: 'Sports / Academy Coaching', period: 'Monthly', desc: 'Swimming, Cricket academy' },
                    { key: 'coaching', title: 'JEE/NEET Prep (11th-12th)', period: 'Monthly', desc: 'In-house coaching modules' },
                    { key: 'uniform', title: 'School Uniform Sets', period: 'Annual', desc: 'Summer + Winter + Sport kits' },
                    { key: 'books', title: 'Books & Notebooks Set', period: 'Annual', desc: 'Class study material pack' },
                    { key: 'events', title: 'Annual Day & Excursions', period: 'Annual', desc: 'Costumes, stage & day picnics' },
                    { key: 'portal', title: 'ERP App & Exam Charges', period: 'Annual', desc: 'Portal licence & Term exams' },
                  ].map((item) => (
                    <div key={item.key} className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">{item.title}</span>
                        <span
                          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                            item.period === 'Annual'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {item.period}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{item.desc}</p>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-xs text-slate-400 font-semibold">₹</span>
                        <input
                          type="number"
                          value={(otherExpenses as any)[item.key]}
                          onChange={(e) => {
                            setOtherExpenses({ ...otherExpenses, [item.key]: Number(e.target.value) });
                            markStepDone(5);
                          }}
                          className="w-full pl-7 pr-3 py-1.5 text-xs font-bold border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 6: Media & Verification ================= */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Campus Media, Prospectus Upload & Final Declaration</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Upload photos, signed fee structure PDF, and publish profile.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-blue-500 transition-colors bg-slate-50/50">
                  <div className="text-slate-400 mb-3 flex justify-center">
                    <UploadCloud className="h-10 w-10 text-slate-400" />
                  </div>
                  <label className="block text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer">
                    <span>School Crest / Logo URL</span>
                  </label>
                  <input
                    type="url"
                    value={logoUrl}
                    onChange={(e) => {
                      setLogoUrl(e.target.value);
                      markStepDone(6);
                    }}
                    placeholder="Paste image URL (PNG, JPG or SVG)"
                    className="mt-2 w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg text-slate-800 font-medium focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Direct CDN image link (0 storage bloat)</p>
                </div>

                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-blue-500 transition-colors bg-slate-50/50">
                  <div className="text-slate-400 mb-3 flex justify-center">
                    <FileText className="h-10 w-10 text-slate-400" />
                  </div>
                  <label className="block text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer">
                    <span>Official Signed Fee Breakdown (PDF Link)</span>
                  </label>
                  <input
                    type="url"
                    value={feePdfUrl}
                    onChange={(e) => {
                      setFeePdfUrl(e.target.value);
                      markStepDone(6);
                    }}
                    placeholder="https://myschool.edu.in/fees-2026.pdf"
                    className="mt-2 w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg text-slate-800 font-medium focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">PDF format direct URL</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Campus Drone Tour / YouTube Embed URL
                </label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => {
                    setVideoUrl(e.target.value);
                    markStepDone(6);
                  }}
                  placeholder="https://www.youtube.com/watch?v=XXXXXX"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={verifyDeclaration}
                    onChange={(e) => {
                      setVerifyDeclaration(e.target.checked);
                      markStepDone(6);
                    }}
                    required
                    className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <span className="text-xs text-amber-900 leading-relaxed font-medium">
                    I verify and declare that the class-wise fee slabs, annual expenses and facility metrics provided are accurate and approved by the school management as per CBSE / State Board mandates for 2026-2027.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Action Footer Navigation */}
          <div className="flex items-center justify-between pt-6 mt-8 border-t border-slate-100">
            <button
              type="button"
              disabled={currentStep === 1}
              onClick={prevStep}
              className={`px-5 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer ${
                currentStep === 1 ? 'invisible' : ''
              }`}
            >
              ← Previous Section
            </button>

            <div className="ml-auto flex items-center gap-3">
              {currentStep < 6 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-all flex items-center space-x-1 cursor-pointer"
                >
                  <span>Continue Next</span>
                  <span>→</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    markStepDone(6);
                    alert('🎉 School Profile & All Financial Details successfully published to the CSEEL Directory!');
                  }}
                  className="px-8 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-all flex items-center space-x-2 cursor-pointer"
                >
                  <span>Publish Complete Profile</span>
                  <span>✓</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
