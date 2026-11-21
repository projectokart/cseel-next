'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { SchoolTemplateProvider, PLACEHOLDER_EMPTY_IMAGE } from '@/components/schools/template/SchoolTemplateContext';
import { parseSchoolJsonToState } from '@/components/schools/template/SchoolJsonSchemaHelper';
import SchoolProfileView from '@/app/(public)/edu-network/school/[state]/[district]/[...slug]/SchoolProfileView';
import {
  Loader2,
  ShieldCheck,
  KeyRound,
  Lock,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Search,
  School,
  Database
} from 'lucide-react';

/**
 * DashboardSchoolProfileClient
 * 
 * Production Claimed School Profile Dashboard.
 * - Mandatory UDISE verification & access key.
 * - Directly synced with Supabase (vvdnsmrtockscarkybtf).
 * - Verified against school_claims & school_profiles tables in Supabase.
 * - Saves updates exclusively to school_profiles (the claimed profile table).
 * - Locks the dashboard until a valid UDISE and key are validated via API.
 */

function toSlug(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}
export default function DashboardSchoolProfileClient() {
  const router = useRouter();
  const { user } = useAuth();

  // Verification & Form State
  const [targetUdise, setTargetUdise] = useState<string>('');
  const [inputUdise, setInputUdise] = useState<string>('');
  const [accessCode, setAccessCode] = useState<string>('');
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(true);
  const [codeError, setCodeError] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authRole, setAuthRole] = useState<'admin' | 'owner' | 'magic_link' | null>(null);

  // School Data State
  const [schoolData, setSchoolData] = useState<any>(null);
  const [isLoadingSchool, setIsLoadingSchool] = useState(false);

  // Save State
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [saveErrorMsg, setSaveErrorMsg] = useState<string | null>(null);

  // 1. Check local session for previously verified code
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const udiseParam = params.get('udise')?.replace(/\D/g, '');
    const codeParam = params.get('key') || params.get('code');
    
    if (udiseParam && udiseParam.length >= 6) {
      setTargetUdise(udiseParam);
      setInputUdise(udiseParam);
    }
    if (codeParam) {
      setAccessCode(codeParam);
    }

    // BUG-10: Use sessionStorage only — localStorage persists across tabs and is XSS-accessible
    const savedCode = sessionStorage.getItem('cseel_admin_access_code');
    const savedUdise = sessionStorage.getItem('cseel_admin_target_udise') || udiseParam || '';
    const effectiveCode = codeParam || savedCode || '';

    if (effectiveCode && udiseParam && udiseParam.length >= 6) {
      verifyCode(effectiveCode, udiseParam);
      setIsCodeModalOpen(false);
    } else {
      setIsCodeModalOpen(true);
    }
  }, []);

  // 2. Fetch School Data from Supabase
  const loadSchoolFromSupabase = async (udise: string) => {
    setIsLoadingSchool(true);
    try {
      // Priority 1: Check if this school has a saved claimed profile in Supabase school_profiles table
      const savedRes = await fetch(`/api/school-profile-save?udise=${udise}`);
      const savedJson = await savedRes.json().catch(() => null);

      if (savedJson?.success && savedJson?.found && savedJson?.profileData) {
        const fallback = {};
        const merged = { ...fallback, ...savedJson.profileData };
        setSchoolData(merged);
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(`cseel_school_draft_${udise}`, JSON.stringify(merged));
            localStorage.setItem('cseel_school_template_draft', JSON.stringify(merged));
            localStorage.setItem('cseel_school_template_draft_v1', JSON.stringify(merged));
          } catch {}
        }
        return;
      }

      // Priority 2: Fall back to standard government/synthetic profile
      const res = await fetch(`/api/udise/standard-profile?code=${udise}`);
      const json = await res.json().catch(() => null);
      const raw = json?.data || json?.heroSection ? json.data || json : null;

      if (raw) {
        const parsed = parseSchoolJsonToState(raw);
        if (parsed.success && parsed.state) {
          setSchoolData(parsed.state);
          return;
        }
      }

      // Default fallback if loading fails — show empty state
      setSchoolData(null);
    } catch {
      setSchoolData(null);
    } finally {
      setIsLoadingSchool(false);
    }
  };

  // 3. Verify UDISE & Access Code against Supabase backend
  const verifyCode = async (codeToTest: string, udiseToTest: string) => {
    setCodeError('');
    const cleanUdise = udiseToTest.replace(/\D/g, '').trim();
    const cleanCode = codeToTest.trim();

    if (!cleanUdise || cleanUdise.length < 6) {
      setCodeError('Please enter a valid School UDISE Number (at least 6-11 digits).');
      return;
    }
    if (!cleanCode) {
      setCodeError('Please enter your Verification Key / Code.');
      return;
    }

    setIsVerifying(true);

    try {
      // Query backend auth-status which verifies against Supabase school_claims and school_profiles
      const res = await fetch(`/api/school-claim/auth-status?udise=${cleanUdise}&magicKey=${encodeURIComponent(cleanCode)}`);
      const auth = await res.json();

      if (auth.canEditCurrentSchool) {
        setIsAuthorized(true);
        setAuthRole(auth.role || 'magic_link');
        setTargetUdise(cleanUdise);
        setAccessCode(cleanCode);
        setIsCodeModalOpen(false);

        try {
          // BUG-10: sessionStorage only — expires when tab closes, never persists across sessions
          sessionStorage.setItem('cseel_admin_access_code', cleanCode);
          sessionStorage.setItem('cseel_admin_target_udise', cleanUdise);
        } catch {}

        await loadSchoolFromSupabase(cleanUdise);
      } else {
        setCodeError('Invalid Verification Key for this UDISE. Please check your key and try again.');
      }
    } catch {
      // Always fail on network error — do NOT grant access when API is unreachable
      setCodeError('Network error during verification. Please check your connection and try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verifyCode(accessCode, inputUdise);
  };

  // 4. Save updates directly to Supabase claimed school_profiles table
  const handleSaveToDatabase = async () => {
    if (!isAuthorized || !accessCode) {
      setIsCodeModalOpen(true);
      setSaveErrorMsg('Cannot save without entering the verification code!');
      return;
    }

    setIsSaving(true);
    setSaveSuccessMsg(null);
    setSaveErrorMsg(null);

    try {
      // Gather current state from localStorage draft or in-memory
      let currentDraft = schoolData || {};
      if (typeof window !== 'undefined') {
        const cached =
          localStorage.getItem(`cseel_school_draft_${targetUdise}`) ||
          localStorage.getItem('cseel_school_template_draft') ||
          localStorage.getItem('cseel_school_template_draft_v1');
        if (cached) {
          try {
            currentDraft = { ...currentDraft, ...JSON.parse(cached) };
          } catch {}
        }
      }

      const res = await fetch('/api/school-profile-save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          udiseCode: targetUdise,
          magicKey: accessCode,
          data: currentDraft,
        }),
      });

      const result = await res.json();

      if (result.success) {
        setSchoolData(currentDraft);
        setSaveSuccessMsg(`Successfully saved to Supabase claimed profiles table (vvdnsmrtockscarkybtf)!`);
        setTimeout(() => setSaveSuccessMsg(null), 5000);
      } else {
        setSaveErrorMsg(result.message || 'Save failed. Check access permissions.');
      }
    } catch {
      setSaveErrorMsg('Network error while saving to database.');
    } finally {
      setIsSaving(false);
    }
  };

  const currentSchool = schoolData || getCseelGlobalEducationTemplate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* ── Top Dashboard Admin Control Bar ── */}
      <div className="bg-[#003B5C] text-white px-4 py-3 sticky top-0 z-40 shadow-md border-b border-[#00273D]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* School Name & Badge */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-bold text-sky-300">
              {isAuthorized ? <ShieldCheck className="w-4 h-4 text-emerald-400" /> : <Lock className="w-4 h-4 text-amber-400" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-white tracking-tight">
                  {currentSchool.schoolName || 'CSEEL Global Education'}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-200 border border-sky-800">
                  UDISE: {targetUdise}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <Database className="w-2.5 h-2.5" />
                  Claimed Profiles Table
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                {isAuthorized ? 'Edit Mode Unlocked • Real-Time Database Sync' : 'Dashboard Locked • Verification Required'}
              </p>
            </div>
          </div>

          {/* UDISE Switcher & Action Buttons */}
          <div className="flex items-center gap-2">
            {!isAuthorized ? (
              <button
                type="button"
                onClick={() => setIsCodeModalOpen(true)}
                className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow transition-all cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Verify UDISE & Unlock</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs text-emerald-300 font-semibold flex items-center gap-1 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-800">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Key: {accessCode}
                </span>

                <button
                  type="button"
                  onClick={() => setIsCodeModalOpen(true)}
                  className="px-2.5 py-1 rounded text-xs bg-white/10 hover:bg-white/20 text-sky-200 font-medium border border-white/10"
                  title="Switch School UDISE"
                >
                  Switch School
                </button>

                {/* Save to Database Button */}
                <button
                  type="button"
                  id="save-database-btn"
                  onClick={handleSaveToDatabase}
                  disabled={isSaving}
                  className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving to Supabase...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Updates to Database</span>
                    </>
                  )}
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => router.push(`/edu-network/school/delhi/west-b/janakpuri/${targetUdise}/cseel-global-education`)}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center gap-1 border border-white/20"
              title="Open Public Claimed View"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Public View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {saveSuccessMsg && (
        <div id="save-success-msg" className="bg-emerald-600 text-white px-4 py-2 text-center text-xs font-bold flex items-center justify-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}
      {saveErrorMsg && (
        <div id="save-error-msg" className="bg-rose-600 text-white px-4 py-2 text-center text-xs font-bold flex items-center justify-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4" />
          <span>{saveErrorMsg}</span>
        </div>
      )}

      {/* ── Main School Profile Editor Component ── */}
      <div className="flex-1">
        {isLoadingSchool ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#005689] mb-2" />
            <p className="text-xs font-bold text-slate-600">Loading School Profile from Supabase Database...</p>
          </div>
        ) : (
          <SchoolTemplateProvider
            initialData={currentSchool}
            initialEditMode={isAuthorized}
            canEdit={isAuthorized}
            authRole={isAuthorized ? 'admin' : 'unauthorized'}
          >
            <SchoolProfileView
              isTemplate={isAuthorized}
              isPublicClaimed={!isAuthorized}
              schoolName={currentSchool.schoolName}
              schoolSlug={toSlug(currentSchool.schoolName || '') || 'school-profile'}
              state={currentSchool.state || ''}
              district={currentSchool.district || ''}
              blockName={currentSchool.blockName || ''}
              village={currentSchool.village || ''}
              pincode={currentSchool.pincode || ''}
              udiseCode={targetUdise}
              board={currentSchool.board || ''}
              affiliationNumber={currentSchool.affiliationNumber || ''}
              medium={currentSchool.medium || ''}
              management={currentSchool.management || ''}
              establishedYear={currentSchool.establishedYear || ''}
              schoolCategory={currentSchool.schoolCategory || ''}
              classFrom={currentSchool.classFrom || ''}
              classTo={currentSchool.classTo || ''}
              genderType={currentSchool.genderType || ''}
              ruralUrban={currentSchool.ruralUrban || ''}
              totalStudents={currentSchool.totalStudents || 0}
              totalBoys={currentSchool.totalBoys || 0}
              totalGirls={currentSchool.totalGirls || 0}
              totalTeachers={currentSchool.totalTeachers || 0}
              maleTeachers={currentSchool.maleTeachers || 0}
              femaleTeachers={currentSchool.femaleTeachers || 0}
              classroomsCount={currentSchool.classroomsCount || 0}
              workingSmartBoards={currentSchool.workingSmartBoards || 0}
              computerIctLab={currentSchool.computerIctLab || ''}
              atalStemLab={currentSchool.atalStemLab || ''}
              playgroundAvailable={currentSchool.playgroundAvailable || ''}
              principalName={currentSchool.principalName || ''}
              rawPhone={currentSchool.phone || ''}
              rawEmail={currentSchool.email || ''}
              website={currentSchool.website || ''}
              rawAddress={currentSchool.address || ''}
              imageUrl={currentSchool.heroImage || PLACEHOLDER_EMPTY_IMAGE}
              lat={currentSchool.lat || 0}
              lng={currentSchool.lng || 0}
              clusterSchools={[]}
              districtSchools={[]}
            />
          </SchoolTemplateProvider>
        )}
      </div>

      {/* ── MANDATORY UDISE & KEY VERIFICATION MODAL ── */}
      {isCodeModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="bg-[#003B5C] text-white p-5 text-center relative">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-2 text-sky-300">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold tracking-tight">
                School Profile Dashboard Verification
              </h3>
              <p className="text-xs text-sky-200 mt-1">
                Enter your School UDISE Number & Verification Key to unlock the editor.
              </p>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>School UDISE Number (Compulsory)</span>
                  <span className="text-[10px] text-slate-400 font-normal">11 Digits</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="modal-udise-input"
                    autoFocus
                    placeholder="e.g. 07070399999"
                    value={inputUdise}
                    maxLength={11}
                    onChange={(e) => {
                      setInputUdise(e.target.value.replace(/\D/g, ''));
                      setCodeError('');
                    }}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-mono text-base tracking-wider focus:ring-2 focus:ring-[#005689] focus:border-[#005689] outline-hidden"
                  />
                  <School className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Verification Key / Number</span>
                  <span className="text-[10px] text-slate-400 font-normal">Your secret key</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="modal-key-input"
                    placeholder="Enter your Verification Key"
                    value={accessCode}
                    onChange={(e) => {
                      setAccessCode(e.target.value);
                      setCodeError('');
                    }}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-mono text-base tracking-widest focus:ring-2 focus:ring-[#005689] focus:border-[#005689] outline-hidden"
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              {codeError && (
                <div className="text-rose-600 text-xs font-semibold flex items-center gap-1.5 p-2 bg-rose-50 rounded-lg border border-rose-200">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{codeError}</span>
                </div>
              )}

              <div className="bg-sky-50 border border-sky-100 rounded-xl p-3 text-[11px] text-sky-900">
                <p className="font-semibold text-sky-950 mb-0.5">🔒 Secure Access</p>
                <p>Enter your school&apos;s UDISE code and the verification key provided during school claim approval.</p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="submit"
                  id="modal-verify-btn"
                  disabled={isVerifying}
                  className="flex-1 py-3 rounded-xl bg-[#005689] hover:bg-[#004168] active:scale-98 text-white font-bold text-sm shadow transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying against Supabase...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Verify & Unlock Editor</span>
                    </>
                  )}
                </button>
                {isAuthorized && (
                  <button
                    type="button"
                    onClick={() => setIsCodeModalOpen(false)}
                    className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs"
                  >
                    Close
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function getCseelGlobalEducationTemplate(): any {
  return {
    schoolName: 'CSEEL Global Education',
    legalName: 'CSEEL Global Education Private Limited',
    udiseCode: '07070399999',
    board: 'CBSE',
    affiliationNumber: '2130001',
    medium: 'English',
    management: 'Private Unaided',
    establishedYear: '2020',
    schoolCategory: 'Grades Nursery to 12th',
    classFrom: 'Nursery',
    classTo: 'Class 12th',
    genderType: 'Co-Educational',
    ruralUrban: 'Urban',
    totalStudents: 1450,
    totalBoys: 750,
    totalGirls: 700,
    totalTeachers: 85,
    maleTeachers: 35,
    femaleTeachers: 50,
    classroomsCount: 48,
    workingSmartBoards: 48,
    principalName: 'Dr. Devender Kaushik',
    phone: '+91 98765 43210',
    email: 'admissions@cseel.org',
    website: 'https://www.cseel.org',
    address: 'B-1 Block, Janakpuri, New Delhi, Delhi - 110058',
    heroImage: '/images/hero/students-doing-chemistry-lab-experiment.webp',
    state: 'Delhi',
    district: 'West B',
    blockName: 'Janakpuri',
    village: 'B-1 Janakpuri',
    pincode: '110058',
    aboutText: 'CSEEL Global Education is a premier institution affiliated with CBSE, championing experiential pedagogy and state-of-the-art STEM laboratories.',
    visionText: 'Empowering curious minds to lead global scientific and technological advancements with ethical integrity.',
    missionText: 'To deliver experiential, holistic, and transdisciplinary education that blends academic mastery with practical inquiry.',
    facilities: [
      { id: 'stem_lab', name: 'Atal STEM Composite Lab', description: 'Advanced robotics, IoT workstations, 3D printers, and digital sensors', category: 'Laboratories' },
      { id: 'smart_class', name: 'Interactive Smart Classrooms', description: '4K touch-enabled smart panels and high-speed campus WiFi', category: 'Academic' },
      { id: 'library', name: 'Digital Hybrid Library', description: '15,000+ volumes, Kindle stations, and international research journals', category: 'Academic' },
      { id: 'sports', name: 'Multi-Sport Complex', description: 'FIFA-standard turf, indoor badminton courts, and Olympic-length track', category: 'Sports' }
    ],
    feeTableData: {
      headers: ['Grade Level', 'Quarterly Tuition', 'Annual Composite Fee'],
      rows: [
        ['Pre-Primary (Nursery - KG)', '₹ 18,500', '₹ 74,000'],
        ['Primary (Grades 1 - 5)', '₹ 22,000', '₹ 88,000'],
        ['Middle School (Grades 6 - 8)', '₹ 26,500', '₹ 1,06,000'],
        ['Senior Secondary (Grades 9 - 12)', '₹ 32,000', '₹ 1,28,000']
      ]
    },
    boardResults: {
      class10: { year: '2025', passPercentage: '100%', averageScore: '89.4%', topScore: '98.8%' },
      class12: { year: '2025', passPercentage: '100%', averageScore: '91.2%', topScore: '99.2%' }
    },
    faqs: [
      { question: 'What curriculum and board affiliation does the school follow?', answer: 'CSEEL Global Education is fully affiliated with CBSE (Affiliation No. 2130001), New Delhi.' },
      { question: 'What is the student-to-teacher ratio?', answer: 'The school maintains an optimal student-to-teacher ratio of 17:1 to ensure personalized mentoring.' }
    ]
  };
}
