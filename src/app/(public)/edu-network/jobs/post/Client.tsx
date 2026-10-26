'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Building2,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Calendar,
  DollarSign,
  Tag,
  CheckCircle2,
  ShieldCheck,
  Eye,
  ArrowLeft,
  X,
  Printer,
  Sparkles,
  Heading2,
  ListOrdered,
  List,
  AlignLeft,
  AlignCenter,
  AlignRight,
  BookOpen,
  Award,
  Users,
  CheckSquare,
  AlertCircle,
  Layers
} from 'lucide-react';
import { INDIAN_STATES_DISTRICTS, INDIA_STATES_LIST, CORE_TEACHING_SUBJECTS } from '@/data/indiaLocations';
import { useAuth } from '@/contexts/AuthContext';
import { ALL_ORGANIZATIONS, slugify } from '@/lib/eduNetworkData';

// Predefined Job Designation Options
const TEACHING_LEVELS = [
  'PGT',
  'TGT',
  'PRT',
  'Pre-Primary / Nursery (NTT)',
  'Activity / Sports Teacher',
  'HOD / Academic Coordinator',
  'Principal / Vice Principal',
  'Other'
];

const NON_TEACHING_ROLES = [
  'Lab Assistant (Physics / Chem / Bio)',
  'ATL Tinkering Lab Mentor',
  'Computer Lab Technician',
  'Accountant / Fee Incharge',
  'Librarian / Asst. Librarian',
  'Admission Counselor',
  'Front Desk / Receptionist',
  'Administrative Officer / PRO',
  'Transport Supervisor',
  'School Nurse / Medical Attendant',
  'Hostel Warden',
  'Security / Facility Supervisor',
  'Other'
];

const NON_TEACHING_DEPARTMENTS = [
  'Laboratory & STEM Practical',
  'Administration & Accounts',
  'Library & Information',
  'Admissions & Parent Relations',
  'IT, Robotics & Systems',
  'Student Welfare & Hostel',
  'Transport & Logistics'
];

const TEACHING_SALARY_RANGES = [
  '₹25,000 - ₹35,000 / mo',
  '₹35,000 - ₹50,000 / mo',
  '₹50,000 - ₹75,000 / mo',
  '₹75,000 - ₹1,00,000 / mo',
  '₹1,00,000+ / mo',
  'Negotiable / Best in Industry'
];

const NON_TEACHING_SALARY_RANGES = [
  '₹15,000 - ₹25,000 / mo',
  '₹25,000 - ₹35,000 / mo',
  '₹35,000 - ₹50,000 / mo',
  '₹50,000+ / mo',
  'Negotiable'
];

const EXPERIENCE_OPTIONS = [
  'Fresher (0-1 Yr)',
  '1-3 Years',
  '3-5 Years',
  '5-8 Years',
  '8+ Years'
];

const BOARDS_LIST = ['CBSE', 'ICSE', 'State Board', 'IB DP / Cambridge', 'Other'];

export default function PostJobClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  // ── Pre-fill School Details from Auth or Directory ──────────────────────────
  const schoolIdParam = searchParams.get('schoolId');

  const defaultOrg = useMemo(() => {
    if (schoolIdParam) {
      const match = ALL_ORGANIZATIONS.find(o => o.id === schoolIdParam || o.slug === schoolIdParam);
      if (match) return match;
    }
    return ALL_ORGANIZATIONS[0] || null;
  }, [schoolIdParam]);

  // Auth metadata school check
  const meta = (user?.user_metadata || {}) as Record<string, any>;
  const authSchoolName = meta.org_name || meta.school_name || meta.institutionName || meta.displayName || '';

  // School Information Fields
  const [schoolName, setSchoolName] = useState(authSchoolName || defaultOrg?.name || 'Delhi Public School');
  const [schoolLogo, setSchoolLogo] = useState(defaultOrg?.logo || '/images/default-school-placeholder.png');
  const [schoolEmail, setSchoolEmail] = useState(user?.email || defaultOrg?.email || 'hr@school.edu.in');
  const [schoolPhone, setSchoolPhone] = useState(meta.phone || defaultOrg?.phone || '+91 98765 43210');
  const [localAddress, setLocalAddress] = useState(defaultOrg?.address || 'Sector 14, Main Campus');
  const [state, setState] = useState(defaultOrg?.state || 'Haryana');
  const [district, setDistrict] = useState(defaultOrg?.city || 'Rewari');
  const [pincode, setPincode] = useState(defaultOrg?.pincode || '123401');
  const [showEditSchoolDetails, setShowEditSchoolDetails] = useState(false);

  // ── Category: Teaching vs Non-Teaching ──────────────────────────────────────
  const [category, setCategory] = useState<'teaching' | 'non-teaching'>('teaching');

  // ── Teaching Specific States ────────────────────────────────────────────────
  const [teachingLevel, setTeachingLevel] = useState('PGT');
  const [customTeachingLevel, setCustomTeachingLevel] = useState('');
  const [subject, setSubject] = useState('Physics');
  const [customSubject, setCustomSubject] = useState('');
  const [board, setBoard] = useState('CBSE');

  // ── Non-Teaching Specific States ────────────────────────────────────────────
  const [nonTeachingRole, setNonTeachingRole] = useState(NON_TEACHING_ROLES[0]);
  const [customNonTeachingRole, setCustomNonTeachingRole] = useState('');
  const [department, setDepartment] = useState(NON_TEACHING_DEPARTMENTS[0]);

  // ── Shared Job Specific States ──────────────────────────────────────────────
  const [experience, setExperience] = useState('1-3 Years');
  const [salaryRange, setSalaryRange] = useState(TEACHING_SALARY_RANGES[1]);
  const [roleType, setRoleType] = useState('Full-Time');
  const [openings, setOpenings] = useState('1');

  // Effective Role & Subject strings
  const effectiveDesignation = category === 'teaching'
    ? (teachingLevel === 'Other' ? (customTeachingLevel || 'Teacher') : teachingLevel)
    : (nonTeachingRole === 'Other' ? (customNonTeachingRole || 'Staff') : nonTeachingRole);

  const effectiveSubject = category === 'teaching'
    ? (subject === 'Other' ? (customSubject || 'General') : subject)
    : department;

  const effectiveJobTitle = category === 'teaching'
    ? `${effectiveDesignation} ${effectiveSubject}`
    : `${effectiveDesignation}`;

  // ── Description Editor & Toolbar ────────────────────────────────────────────
  const initialJobDescHtml = `<h3>Role Overview & Responsibilities</h3><p>We are seeking a dedicated and passionate professional to join our academic and laboratory team. The candidate will drive hands-on learning, laboratory practicals, and student mentorship.</p><ol><li>Conduct regular curriculum-aligned experimental sessions and practical assessments.</li><li>Maintain state-of-the-art laboratory safety standards and equipment inventory.</li><li>Support student cohorts in science competitions, exhibitions, and ATL tinkering projects.</li></ol><h3>Eligibility & Qualifications</h3><p>Relevant academic degree with proven classroom or laboratory management experience. Strong interpersonal and communication skills are required.</p><h3>Perks & Benefits</h3><p>Competitive salary as per institutional norms, PF, gratuity, medical insurance, and professional development support.</p>`;

  const [descHtml, setDescHtml] = useState<string>(initialJobDescHtml);
  const [editorTab, setEditorTab] = useState<'write' | 'preview'>('write');
  const [isHeaderActive, setIsHeaderActive] = useState(false);
  const [listMode, setListMode] = useState<'none' | 'ordered' | 'unordered'>('none');
  const [alignMode, setAlignMode] = useState<'left' | 'center' | 'right'>('left');
  const editorRef = useRef<HTMLDivElement>(null);

  // Sync contentEditable on mount and tab switch
  useEffect(() => {
    if (editorRef.current && (!editorRef.current.innerHTML || editorRef.current.innerHTML === '<br>')) {
      editorRef.current.innerHTML = descHtml;
    }
  }, []);

  useEffect(() => {
    if (editorTab === 'write' && editorRef.current) {
      if (editorRef.current.innerHTML !== descHtml) {
        editorRef.current.innerHTML = descHtml;
      }
      setTimeout(updateActiveStates, 50);
    }
  }, [editorTab]);

  const handleEditorInput = () => {
    if (editorRef.current) {
      setDescHtml(editorRef.current.innerHTML);
    }
  };

  const updateActiveStates = () => {
    if (typeof window === 'undefined') return;
    const sel = window.getSelection();
    if (!sel || !sel.anchorNode || !editorRef.current) return;
    let node: Node | null = sel.anchorNode;
    let isH3 = false;
    let isOL = false;
    let isUL = false;

    while (node && node !== editorRef.current) {
      if (node.nodeName === 'H3' || node.nodeName === 'H2' || node.nodeName === 'H1') isH3 = true;
      if (node.nodeName === 'OL') isOL = true;
      if (node.nodeName === 'UL') isUL = true;
      node = node.parentNode;
    }

    setIsHeaderActive(isH3);
    if (isOL) setListMode('ordered');
    else if (isUL) setListMode('unordered');
    else setListMode('none');

    try {
      if (document.queryCommandState('justifyCenter')) setAlignMode('center');
      else if (document.queryCommandState('justifyRight')) setAlignMode('right');
      else setAlignMode('left');
    } catch (e) {}
  };

  const toggleHeader = () => {
    if (editorRef.current) editorRef.current.focus();
    if (isHeaderActive) {
      try {
        document.execCommand('formatBlock', false, '<p>');
      } catch (e) {}
      setIsHeaderActive(false);
    } else {
      try {
        document.execCommand('formatBlock', false, '<h3>');
      } catch (e) {}
      setIsHeaderActive(true);
    }
    if (editorRef.current) {
      setDescHtml(editorRef.current.innerHTML);
    }
  };

  const toggleNumbering = () => {
    if (editorRef.current) editorRef.current.focus();
    if (listMode === 'ordered') {
      try {
        document.execCommand('insertOrderedList', false);
      } catch (e) {}
      setListMode('none');
    } else {
      if (listMode === 'unordered') {
        try {
          document.execCommand('insertUnorderedList', false);
        } catch (e) {}
      }
      try {
        document.execCommand('insertOrderedList', false);
      } catch (e) {}
      setListMode('ordered');
    }
    if (editorRef.current) {
      setDescHtml(editorRef.current.innerHTML);
    }
  };

  const toggleBullets = () => {
    if (editorRef.current) editorRef.current.focus();
    if (listMode === 'unordered') {
      try {
        document.execCommand('insertUnorderedList', false);
      } catch (e) {}
      setListMode('none');
    } else {
      if (listMode === 'ordered') {
        try {
          document.execCommand('insertOrderedList', false);
        } catch (e) {}
      }
      try {
        document.execCommand('insertUnorderedList', false);
      } catch (e) {}
      setListMode('unordered');
    }
    if (editorRef.current) {
      setDescHtml(editorRef.current.innerHTML);
    }
  };

  const applyAlign = (alignment: 'left' | 'center' | 'right') => {
    if (editorRef.current) editorRef.current.focus();
    try {
      if (alignment === 'left') document.execCommand('justifyLeft', false);
      else if (alignment === 'center') document.execCommand('justifyCenter', false);
      else if (alignment === 'right') document.execCommand('justifyRight', false);
    } catch (e) {}
    setAlignMode(alignment);
    if (editorRef.current) {
      setDescHtml(editorRef.current.innerHTML);
    }
  };

  // ── AI Markdown Parser & Paste Handler ──────────────────────────────────────
  const formatInlineMarkdown = (str: string): string => {
    return str
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/__(.*?)__/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/_(.*?)_/g, '<em>$1</em>');
  };

  const convertMarkdownToHtml = (text: string): string => {
    const lines = text.split(/\r?\n/);
    let html = '';
    let inUl = false;
    let inOl = false;

    const closeLists = () => {
      if (inUl) { html += '</ul>'; inUl = false; }
      if (inOl) { html += '</ol>'; inOl = false; }
    };

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) {
        closeLists();
        continue;
      }

      // Heading: ### Header or ## Header
      const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
      if (headingMatch && trimmed.startsWith('###')) {
        closeLists();
        html += `<h3>${formatInlineMarkdown(headingMatch[2])}</h3>`;
        continue;
      }

      // Numbered List: 1., 2) or "## " as requested
      const olMatch = trimmed.match(/^(\d+[\.\)]|##\s*)\s*(.+)$/);
      if (olMatch && !trimmed.startsWith('###')) {
        if (inUl) { html += '</ul>'; inUl = false; }
        if (!inOl) { html += '<ol>'; inOl = true; }
        html += `<li>${formatInlineMarkdown(olMatch[2])}</li>`;
        continue;
      }

      // Bullet List: *, -, +, •, ***
      const ulMatch = trimmed.match(/^([\*\-\+•]|\*{3})\s+(.+)$/);
      if (ulMatch) {
        if (inOl) { html += '</ol>'; inOl = false; }
        if (!inUl) { html += '<ul>'; inUl = true; }
        html += `<li>${formatInlineMarkdown(ulMatch[2])}</li>`;
        continue;
      }

      // Regular paragraph
      closeLists();
      html += `<p>${formatInlineMarkdown(trimmed)}</p>`;
    }

    closeLists();
    return html;
  };

  const handleEditorPaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const pasteText = e.clipboardData.getData('text/plain');
    if (pasteText && (/^#{1,6}\s/m.test(pasteText) || /^[\*\-\+•]\s/m.test(pasteText) || /^\d+[\.\)]\s/m.test(pasteText) || /\*\*/.test(pasteText) || /^##\s/m.test(pasteText))) {
      e.preventDefault();
      const formattedHtml = convertMarkdownToHtml(pasteText);
      try {
        document.execCommand('insertHTML', false, formattedHtml);
      } catch (err) {
        if (editorRef.current) {
          editorRef.current.innerHTML += formattedHtml;
        }
      }
      handleEditorInput();
      updateActiveStates();
    }
  };

  const handleEditorKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
    updateActiveStates();
    // On-the-fly typing shortcut detection:
    if (e.key === ' ' || e.key === 'Enter') {
      const sel = window.getSelection();
      if (!sel || !sel.anchorNode) return;
      const text = sel.anchorNode.textContent || '';
      
      // ### at start of heading
      if (text.startsWith('### ') && sel.anchorNode.parentElement?.nodeName !== 'H3') {
        const cleaned = text.replace(/^###\s+/, '');
        if (sel.anchorNode.parentElement) {
          try {
            document.execCommand('formatBlock', false, '<h3>');
            if (sel.anchorNode.parentElement) sel.anchorNode.parentElement.textContent = cleaned;
            setIsHeaderActive(true);
          } catch (err) {}
        }
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && isHeaderActive) {
      setTimeout(() => {
        try {
          document.execCommand('formatBlock', false, '<h3>');
        } catch (err) {}
        updateActiveStates();
      }, 0);
    }
  };

  // Quick Template Injectors
  const appendTemplate = (title: string, items: string[]) => {
    const templateHtml = `<h3>${title}</h3><ol>${items.map(it => `<li>${it}</li>`).join('')}</ol>`;
    if (editorRef.current) {
      editorRef.current.innerHTML += templateHtml;
      setDescHtml(editorRef.current.innerHTML);
    }
  };

  // ── Preview & Publish States ────────────────────────────────────────────────
  const [showFullPreviewModal, setShowFullPreviewModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSubmitVacancy = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newJobItem = {
      id: `custom-job-${Date.now()}`,
      orgId: defaultOrg?.id || slugify(schoolName),
      orgName: schoolName,
      orgLogo: schoolLogo,
      orgRating: defaultOrg?.rating || 4.8,
      title: effectiveJobTitle,
      subject: effectiveSubject,
      roleType: roleType as any,
      jobTypeCategory: category === 'teaching' ? 'Teaching Faculty' : 'Non-Teaching',
      jobShift: 'Day shift',
      city: district,
      state: state,
      pincode: pincode,
      address: `${localAddress}, ${district}, ${state} - ${pincode}`,
      salary: salaryRange,
      experienceRequired: experience,
      qualifications: category === 'teaching' ? `Relevant ${effectiveSubject} Degree & Certification` : 'Relevant Diploma / Degree',
      openings: parseInt(openings) || 1,
      postedDate: 'Just now',
      isUrgentlyHiring: true,
      easilyApply: true,
      description: descHtml,
      benefits: ['Medical Insurance', 'Provident Fund (PF)', 'Annual Bonus', 'Transport Allowance'],
      verified: true,
      contactEmail: schoolEmail,
      contactPhone: schoolPhone,
      postedAt: new Date().toISOString()
    };

    try {
      const existing = localStorage.getItem('cseel_custom_jobs');
      const jobsList = existing ? JSON.parse(existing) : [];
      jobsList.unshift(newJobItem);
      localStorage.setItem('cseel_custom_jobs', JSON.stringify(jobsList));
    } catch (err) {
      console.error('Error saving custom job to localStorage', err);
    }

    setToastMessage('Vacancy published successfully! Redirecting...');
    setTimeout(() => {
      setIsSubmitting(false);
      router.push(`/edu-network/teachers?tab=jobs&city=${encodeURIComponent(district)}`);
    }, 1200);
  };

  return (
    <div className={`min-h-screen bg-slate-100/70 text-slate-800 py-6 sm:py-10 px-3 sm:px-6 font-sans ${showFullPreviewModal ? 'print:p-0 print:m-0 print:bg-white print:min-h-0' : ''}`}>
      {/* ── Toast Notification ────────────────────────────────────────────────── */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-[99999] bg-[#003c6e] text-white px-4 py-3 rounded-2xl shadow-xl border border-blue-400/40 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 print:hidden">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── Top Bar / Navigation ──────────────────────────────────────────────── */}
      <div className={`max-w-4xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-3 ${showFullPreviewModal ? 'print:hidden' : ''}`}>
        <Link
          href="/edu-network/teachers?tab=jobs"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#005689] hover:text-[#003c6e] bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Vacancies</span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Manage All Vacancies Link */}
          <Link
            href="/edu-network/jobs/manage"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-300 shadow-xs transition cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-[#005689]" />
            <span>Manage All Vacancies</span>
          </Link>

          {/* Full Vacancy Preview Button */}
          <button
            type="button"
            onClick={() => setShowFullPreviewModal(true)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-300 shadow-xs transition cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-[#005689]" />
            <span>Full Vacancy Preview</span>
          </button>
        </div>
      </div>

      {/* ── Main Container ────────────────────────────────────────────────────── */}
      <div className={`max-w-4xl mx-auto bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-lg overflow-hidden ${showFullPreviewModal ? 'print:hidden' : ''}`}>
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#005689] via-[#0077b6] to-[#0F9D58] p-5 sm:p-6 text-white">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full">
              Verified Institution
            </span>
            <span className="text-emerald-200 text-xs font-semibold">• Active 30-Day Listing</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
            Post a School Vacancy
          </h1>
          <p className="text-blue-100 text-xs mt-1">
            Recruit qualified educators and non-teaching personnel for your institution across India.
          </p>
        </div>

        <form onSubmit={handleSubmitVacancy} className="p-6 sm:p-10 space-y-8 sm:space-y-10">

          {/* ══════════════════════════════════════════════════════════════════════
              SECTION 1: SCHOOL INFORMATION (PRE-FILLED)
             ══════════════════════════════════════════════════════════════════════ */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#005689]/10 flex items-center justify-center text-[#005689]">
                  <Building2 className="w-4 h-4" />
                </div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900" style={{ color: '#003c6e' }}>
                  1. School Profile
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowEditSchoolDetails(!showEditSchoolDetails)}
                className="text-xs font-semibold text-[#005689] hover:underline"
              >
                {showEditSchoolDetails ? 'Hide School Edit' : 'Edit School Info'}
              </button>
            </div>

            {/* School Profile Card (Default View) */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center shadow-2xs">
                  {schoolLogo ? (
                    <img src={schoolLogo} alt="School Logo" className="w-full h-full object-cover" />
                  ) : (
                    <Building2 className="w-6 h-6 text-slate-400" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 truncate">{schoolName}</h3>
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-0.5">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{district}, {state} ({pincode})</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{schoolEmail}</span>
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-bold text-[#005689] bg-blue-50 border border-blue-200 px-3 py-1 rounded-full shrink-0">
                Pre-Filled Profile
              </span>
            </div>

            {/* Editable School Fields (Optional Drawer) */}
            {showEditSchoolDetails && (
              <div className="p-4 rounded-2xl border border-blue-200 bg-blue-50/40 space-y-3 animate-in fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">School / Institution Name *</label>
                    <input
                      type="text"
                      required
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      className="w-full p-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-[#005689]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">School Logo URL (Optional)</label>
                    <input
                      type="text"
                      value={schoolLogo}
                      onChange={(e) => setSchoolLogo(e.target.value)}
                      placeholder="/images/default-school-placeholder.png"
                      className="w-full p-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-[#005689]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">State *</label>
                    <select
                      value={state}
                      onChange={(e) => {
                        const st = e.target.value;
                        const dists = INDIAN_STATES_DISTRICTS[st] || [];
                        setState(st);
                        setDistrict(dists[0] || '');
                      }}
                      className="w-full p-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-[#005689]"
                    >
                      {INDIA_STATES_LIST.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">District / City *</label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full p-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-[#005689]"
                    >
                      {(INDIAN_STATES_DISTRICTS[state] || [district]).map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Pincode *</label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full p-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-[#005689]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Contact Phone *</label>
                    <input
                      type="text"
                      value={schoolPhone}
                      onChange={(e) => setSchoolPhone(e.target.value)}
                      className="w-full p-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-[#005689]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Campus Local Address *</label>
                  <input
                    type="text"
                    value={localAddress}
                    onChange={(e) => setLocalAddress(e.target.value)}
                    className="w-full p-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-[#005689]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* ══════════════════════════════════════════════════════════════════════
              SECTION 2: CATEGORY TOGGLE (TEACHING VS NON-TEACHING)
             ══════════════════════════════════════════════════════════════════════ */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-200 pb-3">
              <div className="w-7 h-7 rounded-lg bg-[#005689]/10 flex items-center justify-center text-[#005689]">
                <Tag className="w-4 h-4" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900" style={{ color: '#003c6e' }}>
                2. Vacancy Category
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Teaching Radio Card */}
              <label
                onClick={() => setCategory('teaching')}
                className={`flex items-start gap-3.5 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  category === 'teaching'
                    ? 'border-[#005689] bg-[#005689]/5 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="vacancy_category"
                  checked={category === 'teaching'}
                  onChange={() => setCategory('teaching')}
                  className="mt-1 w-4 h-4 text-[#005689] focus:ring-[#005689]"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-[#005689]" />
                    <span className="font-bold text-sm text-slate-900">Teaching Faculty</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    PGT, TGT, PRT, Academic Coordinators, HODs, and subject matter educators.
                  </p>
                </div>
              </label>

              {/* Non-Teaching Radio Card */}
              <label
                onClick={() => setCategory('non-teaching')}
                className={`flex items-start gap-3.5 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  category === 'non-teaching'
                    ? 'border-[#005689] bg-[#005689]/5 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="vacancy_category"
                  checked={category === 'non-teaching'}
                  onChange={() => setCategory('non-teaching')}
                  className="mt-1 w-4 h-4 text-[#005689] focus:ring-[#005689]"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-[#005689]" />
                    <span className="font-bold text-sm text-slate-900">Non-Teaching Staff</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Lab Assistants, ATL Mentors, Accountants, Librarians, Counselors, and Admin staff.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════════
              SECTION 3: ROLE DETAILS (DYNAMIC TEACHING VS NON-TEACHING)
             ══════════════════════════════════════════════════════════════════════ */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-200 pb-3">
              <div className="w-7 h-7 rounded-lg bg-[#005689]/10 flex items-center justify-center text-[#005689]">
                <Briefcase className="w-4 h-4" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900" style={{ color: '#003c6e' }}>
                3. Role & Compensation
              </h2>
            </div>

            {category === 'teaching' ? (
              /* Teaching Specific Fields */
              <div className="space-y-4 animate-in fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Designation / Level */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Post / Designation *</label>
                    <select
                      value={teachingLevel}
                      onChange={(e) => setTeachingLevel(e.target.value)}
                      className="w-full p-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689]"
                    >
                      {TEACHING_LEVELS.map((lvl) => (
                        <option key={lvl} value={lvl}>{lvl}</option>
                      ))}
                    </select>
                    {teachingLevel === 'Other' && (
                      <input
                        type="text"
                        required
                        autoFocus
                        value={customTeachingLevel}
                        onChange={(e) => setCustomTeachingLevel(e.target.value)}
                        placeholder="Enter Designation (e.g. Cambridge Faculty)"
                        className="mt-2 w-full p-2 text-xs sm:text-sm bg-white border border-[#005689] rounded-xl focus:outline-none"
                      />
                    )}
                  </div>

                  {/* Subject Teaching */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Subject Teaching *</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full p-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689]"
                    >
                      {CORE_TEACHING_SUBJECTS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    {subject === 'Other' && (
                      <input
                        type="text"
                        required
                        autoFocus
                        value={customSubject}
                        onChange={(e) => setCustomSubject(e.target.value)}
                        placeholder="Enter Subject (e.g. French, Psychology)"
                        className="mt-2 w-full p-2 text-xs sm:text-sm bg-white border border-[#005689] rounded-xl focus:outline-none"
                      />
                    )}
                  </div>

                  {/* Board / Curriculum */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Curriculum / Board *</label>
                    <select
                      value={board}
                      onChange={(e) => setBoard(e.target.value)}
                      className="w-full p-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689]"
                    >
                      {BOARDS_LIST.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  {/* Experience */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Experience Required *</label>
                    <select
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="w-full p-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689]"
                    >
                      {EXPERIENCE_OPTIONS.map((exp) => (
                        <option key={exp} value={exp}>{exp}</option>
                      ))}
                    </select>
                  </div>

                  {/* Salary Range */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Salary Range *</label>
                    <select
                      value={salaryRange}
                      onChange={(e) => setSalaryRange(e.target.value)}
                      className="w-full p-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689]"
                    >
                      {TEACHING_SALARY_RANGES.map((sal) => (
                        <option key={sal} value={sal}>{sal}</option>
                      ))}
                    </select>
                  </div>

                  {/* Role Type */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Employment Type *</label>
                    <select
                      value={roleType}
                      onChange={(e) => setRoleType(e.target.value)}
                      className="w-full p-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689]"
                    >
                      <option value="Full-Time">Full-Time</option>
                      <option value="Part-Time">Part-Time</option>
                      <option value="Visiting Faculty">Visiting Faculty</option>
                    </select>
                  </div>

                  {/* Openings */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Openings *</label>
                    <select
                      value={openings}
                      onChange={(e) => setOpenings(e.target.value)}
                      className="w-full p-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689]"
                    >
                      <option value="1">1 Opening</option>
                      <option value="2">2 Openings</option>
                      <option value="3">3 Openings</option>
                      <option value="5">5+ Openings</option>
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              /* Non-Teaching Specific Fields */
              <div className="space-y-4 animate-in fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Non-Teaching Role */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Staff Role / Post *</label>
                    <select
                      value={nonTeachingRole}
                      onChange={(e) => setNonTeachingRole(e.target.value)}
                      className="w-full p-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689]"
                    >
                      {NON_TEACHING_ROLES.map((role) => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                    {nonTeachingRole === 'Other' && (
                      <input
                        type="text"
                        required
                        autoFocus
                        value={customNonTeachingRole}
                        onChange={(e) => setCustomNonTeachingRole(e.target.value)}
                        placeholder="Enter Staff Role (e.g. Robotics Lab In-Charge)"
                        className="mt-2 w-full p-2 text-xs sm:text-sm bg-white border border-[#005689] rounded-xl focus:outline-none"
                      />
                    )}
                  </div>

                  {/* Department */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Department / Branch *</label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full p-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689]"
                    >
                      {NON_TEACHING_DEPARTMENTS.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Experience */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Experience Required *</label>
                    <select
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="w-full p-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689]"
                    >
                      {EXPERIENCE_OPTIONS.map((exp) => (
                        <option key={exp} value={exp}>{exp}</option>
                      ))}
                    </select>
                  </div>

                  {/* Salary Range */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Salary Range *</label>
                    <select
                      value={salaryRange}
                      onChange={(e) => setSalaryRange(e.target.value)}
                      className="w-full p-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689]"
                    >
                      {NON_TEACHING_SALARY_RANGES.map((sal) => (
                        <option key={sal} value={sal}>{sal}</option>
                      ))}
                    </select>
                  </div>

                  {/* Openings */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Openings *</label>
                    <select
                      value={openings}
                      onChange={(e) => setOpenings(e.target.value)}
                      className="w-full p-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689]"
                    >
                      <option value="1">1 Opening</option>
                      <option value="2">2 Openings</option>
                      <option value="3">3 Openings</option>
                      <option value="5">5+ Openings</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ══════════════════════════════════════════════════════════════════════
              SECTION 4: RICH DESCRIPTION EDITOR (WITH AI MARKDOWN SHORTCUTS)
             ══════════════════════════════════════════════════════════════════════ */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#005689]/10 flex items-center justify-center text-[#005689]">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900" style={{ color: '#003c6e' }}>
                  4. Job Description & Responsibilities
                </h2>
              </div>

              {/* Tabs: Write vs Preview */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setEditorTab('write')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                    editorTab === 'write' ? 'bg-white text-[#005689] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Write
                </button>
                <button
                  type="button"
                  onClick={() => setEditorTab('preview')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                    editorTab === 'preview' ? 'bg-white text-[#005689] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Preview
                </button>
              </div>
            </div>

            {/* Quick Template Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => appendTemplate('Key Responsibilities', [
                  'Plan and conduct curriculum-mapped laboratory experiments and practical inquiries.',
                  'Supervise students to adhere to strict laboratory safety standards and SOPs.',
                  'Maintain student progress records, laboratory logs, and practical assessments.'
                ])}
                className="text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg border border-slate-200 transition"
              >
                + Add Responsibilities
              </button>
              <button
                type="button"
                onClick={() => appendTemplate('Candidate Requirements', [
                  'Relevant graduation or master degree with B.Ed or subject certification.',
                  'Minimum 2 years of proven teaching/lab experience in reputed schools.',
                  'Fluent English communication and modern classroom tech fluency.'
                ])}
                className="text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg border border-slate-200 transition"
              >
                + Add Requirements
              </button>
              <button
                type="button"
                onClick={() => appendTemplate('Perks & Facilities', [
                  'Free semi-furnished campus accommodation or HRA allowance.',
                  'Subsidized school transport and children education concession.',
                  'Medical coverage, EPF, and annual performance incentive.'
                ])}
                className="text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg border border-slate-200 transition"
              >
                + Add Perks
              </button>
            </div>

            {/* Editor Toolbar */}
            <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-2xl">
              {/* Header Toggle */}
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={toggleHeader}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  isHeaderActive
                    ? 'bg-[#003c6e] text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
                title="Toggle Section Header (Auto Bold & Large)"
              >
                <Heading2 className="w-3.5 h-3.5" />
                <span>Header</span>
              </button>

              <div className="h-5 w-px bg-slate-300 mx-1 hidden sm:block" />

              {/* Numbering Toggle */}
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={toggleNumbering}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  listMode === 'ordered'
                    ? 'bg-[#003c6e] text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
                title="Numbered List"
              >
                <ListOrdered className="w-3.5 h-3.5" />
                <span>Numbering</span>
              </button>

              {/* Bullet Toggle */}
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={toggleBullets}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  listMode === 'unordered'
                    ? 'bg-[#003c6e] text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
                title="Bullet Points"
              >
                <List className="w-3.5 h-3.5" />
                <span>Bullets</span>
              </button>

              <div className="h-5 w-px bg-slate-300 mx-1 hidden sm:block" />

              {/* Alignment Controls */}
              <div className="flex items-center gap-1 bg-white p-0.5 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => applyAlign('left')}
                  className={`p-1.5 rounded-lg transition cursor-pointer ${
                    alignMode === 'left' ? 'bg-[#003c6e] text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                  title="Align Left"
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => applyAlign('center')}
                  className={`p-1.5 rounded-lg transition cursor-pointer ${
                    alignMode === 'center' ? 'bg-[#003c6e] text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                  title="Align Center"
                >
                  <AlignCenter className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => applyAlign('right')}
                  className={`p-1.5 rounded-lg transition cursor-pointer ${
                    alignMode === 'right' ? 'bg-[#003c6e] text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                  title="Align Right"
                >
                  <AlignRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* AI & Markdown In-Box Instruction Helper */}
            <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] text-slate-500 bg-slate-50/90 px-3 py-1.5 rounded-xl border border-slate-200/80">
              <span className="flex items-center gap-1.5">
                <span className="font-bold text-[#005689]">AI & Markdown:</span>
                <span>Type/Paste <code>###</code> for Header, <code>1.</code> or <code>##</code> for Numbers, <code>*</code> for Bullets, <code>**bold**</code></span>
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60 hidden sm:inline-block">Auto-Formatted</span>
            </div>

            {/* Editor Surface */}
            {editorTab === 'write' ? (
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onPaste={handleEditorPaste}
                onInput={() => {
                  handleEditorInput();
                  updateActiveStates();
                }}
                onKeyUp={handleEditorKeyUp}
                onMouseUp={updateActiveStates}
                onKeyDown={handleKeyDown}
                className="p-4 sm:p-5 min-h-[220px] max-h-[500px] overflow-y-auto bg-white border border-slate-200 rounded-2xl focus:outline-none focus:border-[#005689] focus:ring-2 focus:ring-[#005689]/10 text-xs sm:text-sm text-slate-800 leading-relaxed font-sans shadow-2xs
                  [&_h3]:text-base [&_h3]:sm:text-lg [&_h3]:font-bold [&_h3]:text-[#003c6e] [&_h3]:mt-3.5 [&_h3]:mb-1.5 [&_h3]:first:mt-0
                  [&_p]:text-xs [&_p]:sm:text-sm [&_p]:text-slate-700 [&_p]:leading-relaxed [&_p]:mb-2.5
                  [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:space-y-1.5 [&_ol]:my-2
                  [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:space-y-1.5 [&_ul]:my-2
                  [&_li]:text-xs [&_li]:sm:text-sm [&_li]:text-slate-700"
              />
            ) : (
              <div
                className="p-5 sm:p-6 rounded-2xl border border-slate-200 bg-slate-50/70 text-slate-700 text-xs sm:text-sm leading-relaxed
                  [&_h3]:text-base [&_h3]:sm:text-lg [&_h3]:font-bold [&_h3]:text-[#003c6e] [&_h3]:mt-3.5 [&_h3]:mb-1.5 [&_h3]:first:mt-0
                  [&_p]:text-xs [&_p]:sm:text-sm [&_p]:text-slate-700 [&_p]:leading-relaxed [&_p]:mb-2.5
                  [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:space-y-1.5 [&_ol]:my-2
                  [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:space-y-1.5 [&_ul]:my-2
                  [&_li]:text-xs [&_li]:sm:text-sm [&_li]:text-slate-700"
                dangerouslySetInnerHTML={{ __html: descHtml }}
              />
            )}
          </div>

          {/* ══════════════════════════════════════════════════════════════════════
              SUBMIT & PREVIEW ACTION BUTTONS
             ══════════════════════════════════════════════════════════════════════ */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setShowFullPreviewModal(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
            >
              <Eye className="w-4 h-4 text-[#005689]" />
              <span>Full Vacancy Preview</span>
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#005689] hover:bg-[#003c6e] shadow-md hover:shadow-lg transition cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Publishing Vacancy...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Publish School Vacancy →</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════
          FULL VACANCY PREVIEW MODAL
         ══════════════════════════════════════════════════════════════════════════ */}
      {showFullPreviewModal && (
        <div className="fixed inset-0 z-[999999] bg-black/70 backdrop-blur-xs overflow-y-auto p-3 sm:p-6 flex items-start justify-center animate-in fade-in print:static print:p-0 print:m-0 print:bg-white print:overflow-visible print:block">
          <div className="bg-white rounded-3xl max-w-4xl w-full my-6 border border-slate-200 shadow-2xl overflow-hidden relative print:border-none print:shadow-none print:rounded-none print:m-0 print:p-0 print:max-w-none print:w-full">

            {/* Modal Controls Bar */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-50 print:hidden">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-xs sm:text-sm">Full Vacancy Preview</span>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5 text-blue-100" />
                  <span>Print (A4)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowFullPreviewModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition cursor-pointer"
                >
                  Close Preview
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    setShowFullPreviewModal(false);
                    handleSubmitVacancy(e);
                  }}
                  className="px-4 py-1.5 rounded-lg bg-[#0F9D58] hover:bg-emerald-600 text-xs font-bold text-white transition cursor-pointer shadow-sm"
                >
                  Publish Now →
                </button>
              </div>
            </div>

            {/* Vacancy Document Paper View */}
            <div className="p-6 sm:p-10 space-y-6 print:p-0 print:m-0 print:space-y-4">

              {/* 1. School Header & Vacancy Title */}
              <div className="border-b border-slate-200 pb-6 print:pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 print:break-inside-avoid">
                <div className="space-y-2.5 flex-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified School Vacancy</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#003c6e] tracking-tight">
                    {effectiveJobTitle}
                  </h2>
                  <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
                    <Building2 className="w-4 h-4 text-[#005689]" />
                    <span>{schoolName}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-600 text-xs">{category === 'teaching' ? `${board} Curriculum` : department}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 text-xs sm:text-sm">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{localAddress}, {district}, {state} - {pincode}</span>
                  </div>
                </div>

                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-50 shrink-0 flex items-center justify-center p-2">
                  {schoolLogo ? (
                    <img src={schoolLogo} alt="School Logo" className="w-full h-full object-contain" />
                  ) : (
                    <Building2 className="w-10 h-10 text-slate-400" />
                  )}
                </div>
              </div>

              {/* 2. Key Job Highlights Pill Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 print:break-inside-avoid">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Salary Range</span>
                  <span className="text-xs sm:text-sm font-extrabold text-[#0F9D58]">{salaryRange}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Experience</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-800">{experience}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Job Type</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-800">{roleType}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Openings</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-800">{openings} Position(s)</span>
                </div>
              </div>

              {/* 3. Description & Responsibilities */}
              <div className="space-y-3 pt-2 print:pt-1 print:break-inside-avoid">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#005689]" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#003c6e]">
                    Job Description & Role Details
                  </h3>
                </div>

                <div
                  className="p-5 print:p-3 rounded-xl border border-slate-200 bg-slate-50/70 text-slate-700 text-xs sm:text-sm print:text-[9.5pt] leading-relaxed
                    [&_h3]:text-base [&_h3]:sm:text-lg [&_h3]:font-bold [&_h3]:text-[#003c6e] [&_h3]:mt-3.5 [&_h3]:mb-1.5 [&_h3]:first:mt-0
                    [&_p]:text-xs [&_p]:sm:text-sm [&_p]:text-slate-700 [&_p]:leading-relaxed [&_p]:mb-2.5
                    [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:space-y-1.5 [&_ol]:my-2
                    [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:space-y-1.5 [&_ul]:my-2
                    [&_li]:text-xs [&_li]:sm:text-sm [&_li]:text-slate-700"
                  dangerouslySetInnerHTML={{ __html: descHtml }}
                />
              </div>

              {/* 4. Contact & Application Details */}
              <div className="space-y-2 print:space-y-1 print:break-inside-avoid">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#005689]" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#003c6e]">
                    Direct Application Contact
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs print:text-[9pt]">
                  <div className="p-3 print:p-2 rounded-xl border border-slate-200 bg-white">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Official HR Email</span>
                    <span className="font-semibold text-slate-800">{schoolEmail}</span>
                  </div>
                  <div className="p-3 print:p-2 rounded-xl border border-slate-200 bg-white">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Campus Contact</span>
                    <span className="font-semibold text-slate-800">{schoolPhone}</span>
                  </div>
                </div>
              </div>

              {/* Running Print Footer */}
              <div className="hidden print:flex items-center justify-between border-t border-slate-300 pt-2.5 mt-4 text-[8.5pt] text-slate-500 print:break-inside-avoid">
                <span>CSEEL Verified School Vacancy • www.cseel.org</span>
                <span>Official Institutional Document</span>
              </div>

            </div>

            {/* Bottom Modal Actions */}
            <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between gap-3 print:hidden">
              <button
                type="button"
                onClick={() => setShowFullPreviewModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-200 transition cursor-pointer"
              >
                ← Back to Editing
              </button>

              <button
                type="button"
                onClick={(e) => {
                  setShowFullPreviewModal(false);
                  handleSubmitVacancy(e);
                }}
                className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-[#005689] hover:bg-[#003c6e] transition shadow-sm cursor-pointer"
              >
                Looks Great - Publish Live Vacancy →
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
