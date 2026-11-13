'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  ShieldCheck,
  Lock,
  ArrowRight,
  ChevronRight,
  X,
  Home,
  BookOpen,
  Layers,
  GraduationCap,
  Star,
  Phone,
  Mail,
  User as UserIcon,
  LogIn,
  LogOut,
  Edit3,
  Save,
  Check,
  Menu,
  Briefcase,
  PlusCircle,
  Clock,
  MapPin,
  Compass
} from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';
import { useOptionalSchoolTemplate } from '@/components/schools/template/SchoolTemplateContext';
import AdSenseBanner from '@/components/ads/AdSenseBanner';
import dynamic from 'next/dynamic';
import VerifiedBadge from '@/components/schools/template/VerifiedBadge';
import { cleanBoardName } from '@/integrations/supabase/schoolSearchClient';

// Critical Above-The-Fold & Core Eager Components
import SchoolStatsSection from '@/components/schools/profile/SchoolStatsSection';
import SchoolAboutSection from '@/components/schools/profile/SchoolAboutSection';
import SchoolFooterSection from '@/components/schools/profile/SchoolFooterSection';
import SchoolProfileModals from '@/components/schools/profile/SchoolProfileModals';
import LazySection from '@/components/schools/profile/LazySection';
import SectionVisibilityToggle from '@/components/schools/template/SectionVisibilityToggle';
import EditableImage from '@/components/schools/template/EditableImage';

const SectionSkeleton = ({ height = 'h-60', title }: { height?: string; title?: string }) => (
  <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-5 w-full animate-pulse">
    <div className={`w-full ${height} rounded-2xl bg-slate-100/80 border border-slate-200/50 flex flex-col items-center justify-center p-4 text-center`}>
      <div className="w-7 h-7 rounded-full border-2 border-slate-300 border-t-[#005689] animate-spin mb-2" />
      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{title || 'Loading...'}</span>
    </div>
  </div>
);

const TabSkeleton = ({ title }: { title: string }) => (
  <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-8 w-full animate-pulse">
    <div className="min-h-[280px] rounded-2xl bg-slate-50 border border-slate-200/60 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-[#005689] animate-spin mb-3" />
      <h3 className="text-sm font-extrabold text-slate-700 mb-1">{title}</h3>
      <p className="text-xs text-slate-400">Loading verified data...</p>
    </div>
  </div>
);

// Home Sections (Below the fold)
const SchoolCampusSection = dynamic(() => import('@/components/schools/profile/SchoolCampusSection'), {
  loading: () => <SectionSkeleton height="h-72" title="Virtual Campus Tour & Gallery" />
});
const SchoolFacilitiesSection = dynamic(() => import('@/components/schools/profile/SchoolFacilitiesSection'), {
  loading: () => <SectionSkeleton height="h-56" title="Campus Facilities" />
});
const SchoolFaqSection = dynamic(() => import('@/components/schools/template/SchoolFaqSection'), {
  loading: () => <SectionSkeleton height="h-64" title="Frequently Asked Questions" />
});

// Dynamic Tab Components (Lazy-loaded on tab click)
const SchoolAcademicsTab = dynamic(() => import('@/components/schools/profile/SchoolAcademicsTab'), {
  loading: () => <TabSkeleton title="Loading Academics & Results" />
});
const SchoolFeeSection = dynamic(() => import('@/components/schools/profile/SchoolFeeSection'), {
  loading: () => <TabSkeleton title="Loading Fee Structure & Admissions" />
});
const SchoolReviewsSection = dynamic(() => import('@/components/schools/profile/SchoolReviewsSection'), {
  loading: () => <TabSkeleton title="Loading Reviews & Ratings" />
});

export interface SchoolProfileViewProps {
  state: string;
  district: string;
  blockName: string;
  village: string;
  schoolName: string;
  schoolSlug: string;
  udiseCode: string;
  pincode: string;
  management: string;
  board: string;
  medium: string;
  establishedYear: string;
  totalStudents: number;
  totalBoys: number;
  totalGirls: number;
  totalTeachers: number;
  maleTeachers: number;
  femaleTeachers: number;
  classroomsCount: number;
  classFrom: string;
  classTo: string;
  schoolCategory: string;
  genderType?: string;
  ruralUrban: string;
  workingSmartBoards?: number;
  computerIctLab?: string;
  atalStemLab?: string;
  playgroundAvailable?: string;
  principalName: string;
  rawPhone: string;
  rawEmail: string;
  website: string;
  rawAddress: string;
  imageUrl?: string;
  logoUrl?: string;
  affiliationNumber?: string;
  lat: number;
  lng: number;
  clusterSchools?: any[];
  districtSchools?: any[];
  isTemplate?: boolean;
  initialProfileData?: any;
  flipbookSlides?: any[];
  residentialSchool?: string;
}

export type TabType =
  | 'home'
  | 'about'
  | 'academics'
  | 'admissions'
  | 'reviews';

const navTabs: { id: TabType; label: string; shortLabel: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'home', label: 'Home', shortLabel: 'Home', icon: Home },
  { id: 'academics', label: 'Academic & Results', shortLabel: 'Academics', icon: BookOpen },
  { id: 'admissions', label: 'Admissions & Fees', shortLabel: 'Admissions', icon: GraduationCap },
  { id: 'reviews', label: 'Reviews & Ratings', shortLabel: 'Reviews', icon: Star },
];

export default function SchoolProfileView({
  state,
  district,
  blockName,
  village,
  schoolName,
  schoolSlug,
  udiseCode,
  pincode,
  management,
  board,
  medium,
  establishedYear,
  totalStudents,
  totalTeachers,
  classroomsCount,
  classFrom,
  classTo,
  schoolCategory,
  genderType,
  ruralUrban,
  workingSmartBoards,
  computerIctLab,
  atalStemLab,
  playgroundAvailable,
  totalBoys,
  totalGirls,
  principalName,
  rawPhone,
  rawEmail,
  website,
  rawAddress,
  lat = 28.1885,
  lng = 76.6215,
  imageUrl,
  logoUrl,
  affiliationNumber,
  clusterSchools = [],
  districtSchools = [],
  isTemplate = false,
  initialProfileData,
  flipbookSlides,
  residentialSchool,
}: SchoolProfileViewProps) {
  // Navigation State
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modal States
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isAdmissionConfigModalOpen, setIsAdmissionConfigModalOpen] = useState(false);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [isTourModalOpen, setIsTourModalOpen] = useState(false);

  // Admission application form state
  const [applicantName, setApplicantName] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantClass, setApplicantClass] = useState('Nursery');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [isSubmittingEnquiry, setIsSubmittingEnquiry] = useState(false);
  const [enquirySuccessMessage, setEnquirySuccessMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Dynamic Admissions Contact & Configure State
  const [admissionPhone, setAdmissionPhone] = useState(rawPhone || '');
  const [admissionEmail, setAdmissionEmail] = useState(rawEmail || '');
  const [admissionContactPerson, setAdmissionContactPerson] = useState(principalName || '');
  const [isConfiguringAdmissions, setIsConfiguringAdmissions] = useState(false);
  const [configSuccessMessage, setConfigSuccessMessage] = useState('');

  const normalizeFeeTable = (rawTable: any): { columns: string[]; rows: string[][] } | null => {
    if (!rawTable || !rawTable.rows || !Array.isArray(rawTable.rows) || rawTable.rows.length === 0) return null;
    const cols: string[] = Array.isArray(rawTable.columns) && rawTable.columns.length > 0
      ? rawTable.columns.map((c: any) => String(c ?? ''))
      : ['Grade Level', 'Monthly Tuition Fee', 'Quarterly Fee', 'Annualized Fee'];

    const rows: string[][] = rawTable.rows.map((r: any) => {
      if (Array.isArray(r)) {
        return r.map((c: any) => String(c ?? ''));
      }
      if (typeof r === 'object' && r !== null) {
        const mapped = cols.map((colName) => {
          const cn = colName.toLowerCase();
          if (cn.includes('grade') || cn.includes('class')) return r.grade || r.class || r.className || r.name || '';
          if (cn.includes('month')) return r.monthly || r.monthlyFee || '';
          if (cn.includes('qtr') || cn.includes('quarter')) return r.quarterly || r.quarterlyFee || '';
          if (cn.includes('annual') || cn.includes('year') || cn.includes('total')) return r.annual || r.totalAnnual || r.annualizedFee || '';
          return r[colName] || '';
        });
        if (mapped.every(v => !v)) {
          return Object.values(r).map(v => String(v ?? ''));
        }
        return mapped;
      }
      return Array(cols.length).fill('');
    });

    return { columns: cols, rows };
  };

  const [feesTable, setFeesTable] = useState(() => {
    const custom = initialProfileData?.feeTableData || initialProfileData?.feeTable;
    const normalized = normalizeFeeTable(custom);
    if (normalized) return normalized;
    return {
      columns: ['Class / Grade', 'Admission Fee (One Time)', 'Tuition Fee (Monthly)', 'Annual Charges (One Time)', 'Total Annual (Est.)'],
      rows: [
        ['Pre (Nursery)', '', '', '', ''],
        ['LKG', '', '', '', ''],
        ['UKG', '', '', '', ''],
        ['Class 1', '', '', '', ''],
        ['Class 2', '', '', '', ''],
        ['Class 3', '', '', '', ''],
        ['Class 4', '', '', '', ''],
        ['Class 5', '', '', '', ''],
        ['Class 6', '', '', '', ''],
        ['Class 7', '', '', '', ''],
        ['Class 8', '', '', '', ''],
        ['Class 9', '', '', '', ''],
        ['Class 10', '', '', '', ''],
        ['Class 11', '', '', '', ''],
        ['Class 12', '', '', '', ''],
      ]
    };
  });

  const [extraChargesTable, setExtraChargesTable] = useState(() => {
    const customExtra = initialProfileData?.extraChargesTable;
    const normalized = normalizeFeeTable(customExtra);
    if (normalized) return normalized;
    return {
      columns: ['Charge Type', 'Amount (Monthly)', 'Notes / Applicable To', 'Total Annual'],
      rows: []
    };
  });

  useEffect(() => {
    const customFees = initialProfileData?.feeTableData || initialProfileData?.feeTable;
    const normFees = normalizeFeeTable(customFees);
    if (normFees) {
      setFeesTable(normFees);
    }
    const customExtra = initialProfileData?.extraChargesTable;
    const normExtra = normalizeFeeTable(customExtra);
    if (normExtra) {
      setExtraChargesTable(normExtra);
    }
  }, [initialProfileData?.feeTableData, initialProfileData?.feeTable, initialProfileData?.extraChargesTable]);

  // Auth Context & User State
  const { user, signOut } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);

  // School Authorization & RBAC State (Zero-Bypass)
  const userEmailClean = user?.email?.toLowerCase().trim() || '';
  const isSuperAdminUser = Boolean(
    userEmailClean && (
      userEmailClean === 'ptdevkaushik101@gmail.com' ||
      userEmailClean === 'ptdevkaushik104@gmail.com' ||
      userEmailClean.endsWith('@cseel.org')
    )
  );

  const [canEditSchool, setCanEditSchool] = useState(isSuperAdminUser);
  const [authRole, setAuthRole] = useState<'admin' | 'owner' | 'magic_link' | 'unauthorized'>(
    isSuperAdminUser ? 'admin' : 'unauthorized'
  );
  const [userSchoolClaim, setUserSchoolClaim] = useState<any | null>(null);
  const [isAddSchoolModalOpen, setIsAddSchoolModalOpen] = useState(false);

  // Interactive Live Template Context
  const templateCtx = useOptionalSchoolTemplate();
  const templateData = templateCtx?.data || initialProfileData || null;
  const isLiveTemplate = (isTemplate && !!templateCtx) || Boolean(initialProfileData);
  const isAdmissionsOpen = Boolean(templateData?.admissionsOpen);
  const isEditMode = false;

  useEffect(() => {
    let isCancelled = false;

    // Super Admin gets instant full editing privileges
    if (isSuperAdminUser) {
      setCanEditSchool(true);
      setAuthRole('admin');
      const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
      if (searchParams?.get('edit') === 'true' && templateCtx) {
        templateCtx.setIsEditMode(true);
      }
    }

    async function checkAuthorization() {
      try {
        const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
        const magicKey = searchParams?.get('magicKey') || searchParams?.get('token') || '';
        const cleanUdise = String(udiseCode || '').replace(/\D/g, '');

        const queryParams = new URLSearchParams({
          udise: cleanUdise,
          user_id: user?.id || '',
          email: user?.email || '',
          magicKey: magicKey,
        });

        const res = await fetch(`/api/school-claim/auth-status?${queryParams.toString()}`);
        if (!res.ok) throw new Error('Auth check failed');
        const authData = await res.json();

        if (!isCancelled) {
          const isAllowed = isSuperAdminUser || Boolean(authData.canEditCurrentSchool);
          setCanEditSchool(isAllowed);
          setAuthRole(isSuperAdminUser ? 'admin' : (authData.role || 'unauthorized'));
          setUserSchoolClaim(authData.primarySchool || null);

          // If authorized and URL has edit=true, auto-enable edit mode
          if (isAllowed && searchParams?.get('edit') === 'true' && templateCtx) {
            templateCtx.setIsEditMode(true);
          } else if (!isAllowed && templateCtx && templateCtx.isEditMode) {
            // Strictly enforce lock down if user is unauthorized
            templateCtx.setIsEditMode(false);
          }
        }
      } catch (err) {
        if (!isCancelled) {
          if (isSuperAdminUser) {
            setCanEditSchool(true);
            setAuthRole('admin');
          } else {
            setCanEditSchool(false);
            setAuthRole('unauthorized');
            if (templateCtx && templateCtx.isEditMode) {
              templateCtx.setIsEditMode(false);
            }
          }
        }
      }
    }

    checkAuthorization();

    return () => {
      isCancelled = true;
    };
  }, [user?.id, user?.email, udiseCode, isSuperAdminUser]);

  const handleSaveDraft = () => {
    if (templateCtx) {
      try {
        localStorage.setItem(`cseel_school_draft_${udiseCode}`, JSON.stringify(templateCtx.data));
      } catch (_) {}
      setDraftSaved(true);
      setTimeout(() => setDraftSaved(false), 2500);
    }
  };

  const handleSaveUpdates = async () => {
    setIsUpdating(true);
    try {
      if (templateCtx?.publishToSupabase) {
        await templateCtx.publishToSupabase();
      }
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 2500);
    } catch (err) {
      console.error('Update failed:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  // Add Card Modals for Facilities, Admissions, Faculty, Gallery, Awards
  const [isAddFacilityModalOpen, setIsAddFacilityModalOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState<any | null>(null);
  const [isAddAdmissionModalOpen, setIsAddAdmissionModalOpen] = useState(false);
  const [editingAdmission, setEditingAdmission] = useState<any | null>(null);
  const [isFacultyModalOpen, setIsFacultyModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<any | null>(null);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [isAwardModalOpen, setIsAwardModalOpen] = useState(false);
  const [editingAward, setEditingAward] = useState<any | null>(null);

  // Tab Switching
  const handleTabSwitch = (tab: TabType | 'contact' | 'gallery' | 'facilities') => {
    setIsMobileMenuOpen(false);
    if (tab === 'contact') {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (tab === 'about' || tab === 'gallery' || tab === 'facilities') {
      setActiveTab('home');
      const targetId = tab === 'gallery' ? 'campus-tour' : tab === 'facilities' ? 'facilities' : 'about';
      setTimeout(() => {
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
      }, 60);
      return;
    }
    setActiveTab(tab as TabType);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sectionVisibility = templateData?.sectionVisibility || initialProfileData?.sectionVisibility || {};
  const isSectionVisible = (id: string, fallback = true): boolean => {
    // In live edit mode, keep sections visible to the editor so they can edit content and toggle visibility back on
    if (isLiveTemplate && isEditMode) {
      return true;
    }
    if (sectionVisibility[id] !== undefined) return Boolean(sectionVisibility[id]);
    if (templateData?.tabVisibility?.[id] !== undefined) return Boolean(templateData.tabVisibility[id]);
    return fallback;
  };

  const effectiveNavTabs = navTabs.filter((tab) => {
    if (tab.id === 'home') return true;
    if (isLiveTemplate && isEditMode) return true;
    if (sectionVisibility[tab.id] === false) return false;
    if (tab.id === 'admissions' && sectionVisibility['admissions'] === false && sectionVisibility['fees'] === false) return false;
    if (isLiveTemplate && !isEditMode) {
      return templateData?.tabVisibility?.[tab.id] !== false;
    }
    return true;
  });

  // Strict left edge mobile swipe gesture
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let startX = 0;
    let startY = 0;
    let startTime = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      startTime = Date.now();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const diffX = endX - startX;
      const diffY = endY - startY;
      const elapsed = Date.now() - startTime;

      if (elapsed > 600) return;
      if (Math.abs(diffY) > 60) return;

      if (diffX < -50 && Math.abs(diffX) > Math.abs(diffY)) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  const formatTitleCaseLabel = (raw: string): string => {
    const text = String(raw || '').trim();
    if (!text) return '';
    const letters = text.replace(/[^a-zA-Z]/g, '');
    const upperCount = (text.match(/[A-Z]/g) || []).length;
    if (!letters || upperCount / letters.length < 0.7) return text;
    const preserveUpper = new Set(['CBSE', 'ICSE', 'ISC', 'IB', 'IGCSE', 'DAV', 'DPS', 'KV', 'KVS', 'JNV', 'NVS', 'PM', 'II', 'III', 'IV']);
    const minorWords = new Set(['of', 'and', 'in', 'at', 'for', 'the', 'to', 'by', 'on']);
    return text
      .split(/\s+/)
      .map((word, idx) => {
        const cleanUpper = word.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        if (preserveUpper.has(cleanUpper)) return word.toUpperCase();
        const lower = word.toLowerCase();
        if (idx > 0 && minorWords.has(lower)) return lower;
        return lower.charAt(0).toUpperCase() + lower.slice(1);
      })
      .join(' ');
  };

  // Display texts matching institutional records
  const rawDisplayName = isLiveTemplate
    ? (templateData?.schoolName || 'School Name')
    : (isTemplate
      ? 'School Name'
      : ((!schoolName || /^\d+$/.test(schoolName.trim()) || (/^\d+[a-z0-9_-]*$/i.test(schoolName.trim()) && schoolName.trim().length <= 15 && /\d{5}/.test(schoolName)))
        ? 'School Profile'
        : schoolName));
  const displayName = formatTitleCaseLabel(rawDisplayName);

  const actualSchoolLogo = isLiveTemplate
    ? (templateData?.logoImage || templateData?.imageOverrides?.['school_logo'] || imageUrl || '')
    : (imageUrl || '');

  const renderHeaderVerifiedSchoolName = (name: string) => {
    const raw = (name || '').trim();
    if (!raw) return null;
    const parts = raw.split(/\s+/);
    const lastWord = parts.pop() || '';
    const leadingWords = parts.join(' ');

    return (
      <span className="inline">
        {leadingWords ? `${leadingWords} ` : ''}
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap align-middle">
          <span>{lastWord}</span>
          <span className="relative group/verified inline-flex items-center justify-center shrink-0 cursor-help" title="CSEEL Verified School">
            <CheckCircle2 className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-white fill-blue-600 drop-shadow-xs" />
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/verified:flex flex-col items-center z-50 pointer-events-none transition-all">
              <span className="bg-slate-900/95 text-white text-[10.5px] font-semibold px-2.5 py-1 rounded-md shadow-xl whitespace-nowrap leading-tight text-center border border-slate-700/50 flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-blue-400 fill-blue-900" />
                <span>Officially Verified Institution by CSEEL</span>
              </span>
              <span className="w-1.5 h-1.5 bg-slate-900/95 rotate-45 -mt-0.5 border-r border-b border-slate-700/50"></span>
            </span>
          </span>
        </span>
      </span>
    );
  };

  const displayEstablished = isLiveTemplate
    ? (templateData?.establishedYear || establishedYear || '')
    : (establishedYear || '');

  const displayStudents = isLiveTemplate
    ? `${templateData?.totalStudents !== undefined && Number(templateData.totalStudents) > 0 ? Number(templateData.totalStudents).toLocaleString() : (totalStudents > 0 ? totalStudents.toLocaleString() : '')}`
    : (totalStudents > 0 ? `${totalStudents.toLocaleString()}` : '');

  const displayTeachers = isLiveTemplate
    ? `${templateData?.totalTeachers !== undefined && Number(templateData.totalTeachers) > 0 ? String(templateData.totalTeachers) : (totalTeachers > 0 ? String(totalTeachers) : '')}`
    : (totalTeachers > 0 ? `${totalTeachers}` : '');

  const displayCampusArea = isLiveTemplate
    ? (templateData?.campusArea || initialProfileData?.campusArea || initialProfileData?.schoolIdentity?.campusArea || '')
    : (initialProfileData?.campusArea || initialProfileData?.schoolIdentity?.campusArea || '');

  const displayPrincipal = isLiveTemplate
    ? (templateData?.principalName || 'Principal Desk')
    : (isTemplate
      ? 'Principal Desk'
      : (principalName || 'Principal Desk'));

  const displayAddress = isLiveTemplate
    ? (templateData?.address || (rawAddress || 'Campus Address'))
    : (isTemplate
      ? (rawAddress || 'Campus Address')
      : (rawAddress || 'Campus Address'));

  const displayPhone = isLiveTemplate
    ? (templateData?.phone || rawPhone || '')
    : (isTemplate
      ? (rawPhone || '')
      : (rawPhone || ''));

  const displayEmail = isLiveTemplate
    ? (templateData?.email || rawEmail || '')
    : (isTemplate
      ? (rawEmail || '')
      : (rawEmail || ''));

  const displayGeneralPhone = isLiveTemplate ? (templateData?.generalPhone || templateData?.phone || rawPhone || '') : (rawPhone || '');
  const displayGeneralEmail = isLiveTemplate ? (templateData?.generalEmail || templateData?.email || rawEmail || '') : (rawEmail || '');
  const displayAdmissionsPhone = isLiveTemplate ? (templateData?.admissionsPhone || templateData?.phone || rawPhone || '') : (rawPhone || '');
  const displayAdmissionsEmail = isLiveTemplate ? (templateData?.admissionsEmail || templateData?.email || rawEmail || '') : (rawEmail || '');
  const displayPrincipalPhone = isLiveTemplate ? (templateData?.principalPhone || '') : '';
  const displayPrincipalEmail = isLiveTemplate ? (templateData?.principalEmail || '') : '';
  const displayCareersPhone = isLiveTemplate ? (templateData?.careersPhone || '') : '';
  const displayCareersEmail = isLiveTemplate ? (templateData?.careersEmail || '') : '';

  const displayUdise = isLiveTemplate
    ? (templateData?.udiseCode || udiseCode || '')
    : (udiseCode || '');

  const rawBoard = isLiveTemplate
    ? (templateData?.board || board || 'CBSE')
    : (board || 'CBSE');

  const displayBoard = cleanBoardName(rawBoard) || 'CBSE';

  const realAffiliationNo = templateData?.affiliationNumber || (templateData as any)?.affiliation_number || affiliationNumber || '';
  const displayAffiliationNo = realAffiliationNo ? String(realAffiliationNo).trim() : '';

  const displayDistrict = formatTitleCaseLabel(
    isLiveTemplate
      ? (templateData?.district || district || 'District')
      : (district || 'Campus')
  );

  const displayState = formatTitleCaseLabel(
    isLiveTemplate
      ? (templateData?.state || state || 'State')
      : (state || 'State')
  );

  const displayClassFrom = isLiveTemplate
    ? (templateData?.classFrom || classFrom || '')
    : (classFrom || '');

  const displayClassTo = isLiveTemplate
    ? (templateData?.classTo || classTo || '')
    : (classTo || '');

  const displayClasses = (displayClassFrom && displayClassTo)
    ? `${displayClassFrom} to ${displayClassTo}`
    : (displayClassFrom || displayClassTo || '—');

  const rawMgmt = isLiveTemplate ? (templateData?.management || management || '') : (management || '');
  const mgmtVal = typeof rawMgmt === 'string'
    ? rawMgmt
    : (rawMgmt && typeof rawMgmt === 'object'
        ? ((rawMgmt as any).management_type || (rawMgmt as any).name || (rawMgmt as any).title || (rawMgmt as any).society_trust_name || '')
        : String(rawMgmt || ''));
  const lowerMgmt = mgmtVal.toLowerCase();
  const isGovt = lowerMgmt.includes('govt') ||
                 lowerMgmt.includes('department') ||
                 lowerMgmt.includes('aided') ||
                 lowerMgmt.includes('kendriya');

  const displayManagementLabel = typeof templateData?.management === 'string' && templateData.management
    ? (lowerMgmt.includes('govt') ? 'Govt' : lowerMgmt.includes('private') ? 'Private' : templateData.management)
    : (typeof management === 'string' && management
        ? (lowerMgmt.includes('govt') ? 'Govt' : lowerMgmt.includes('private') ? 'Private' : management)
        : (isGovt ? 'Govt' : 'Private'));

  const rawBoardStr = isLiveTemplate ? (templateData?.board || displayBoard) : (board || displayBoard);
  const boardStr = typeof rawBoardStr === 'string' ? rawBoardStr : (typeof displayBoard === 'string' ? displayBoard : 'CBSE');
  const boardsList = boardStr
    ? boardStr.split(/[,/|•]+/).map((b: string) => cleanBoardName(b.trim())).filter(Boolean)
    : [displayBoard];

  const rawMediumStr = isLiveTemplate ? (templateData?.medium || medium) : medium;
  const mediumStr = typeof rawMediumStr === 'string' ? rawMediumStr : (typeof medium === 'string' ? medium : '');
  const mediumsList = mediumStr
    ? mediumStr.split(/[,/|•]+/).map((m: string) => m.trim()).filter(Boolean)
    : (medium ? [String(medium)] : ['English', 'Hindi']);
  const displayMedium = mediumsList.join(', ');

  // Authentic Facilities List (Zero fake entries)
  const rawFacilitiesList: any[] = (Array.isArray(templateData?.facilities) && templateData.facilities.length > 0)
    ? templateData.facilities
    : (Array.isArray((templateData?.facilities as any)?.facilities_list) && (templateData?.facilities as any).facilities_list.length > 0)
      ? (templateData?.facilities as any).facilities_list
      : (Array.isArray((templateData?.facilities as any)?.items) && (templateData?.facilities as any).items.length > 0)
        ? (templateData?.facilities as any).items
        : (Array.isArray(initialProfileData?.facilities) && initialProfileData.facilities.length > 0
          ? initialProfileData.facilities
          : (Array.isArray(initialProfileData?.facilities?.facilities_list) ? initialProfileData.facilities.facilities_list : []));

  const effectiveFacilities = rawFacilitiesList
    .filter((f: any) => f && f.selected !== false)
    .map((f: any) => ({
      id: f.id || f.name,
      name: f.title || f.name,
      desc: f.desc || f.description || '',
      category: f.badge || f.category || 'School Facility',
      icon: f.icon,
      _raw: f,
    }));

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim() || !applicantPhone.trim()) return;

    setIsSubmittingEnquiry(true);
    setEnquirySuccessMessage('');

    try {
      const res = await fetch('/api/school-admissions-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          udiseCode: displayUdise,
          schoolSlug,
          schoolName: displayName,
          applicantName: applicantName.trim(),
          phoneNumber: applicantPhone.trim(),
          applyingClass: applicantClass,
          email: applicantEmail.trim(),
          schoolTargetEmail: admissionEmail || rawEmail || 'ptdevkaushik104@gmail.com',
          schoolTargetPhone: admissionPhone || rawPhone || '',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsSubmitted(true);
        setEnquirySuccessMessage('Your admission inquiry has been delivered directly to the school administration and admissions desk email.');
        setTimeout(() => {
          setIsSubmitted(false);
          setIsApplyModalOpen(false);
          setApplicantName('');
          setApplicantPhone('');
          setApplicantEmail('');
          setEnquirySuccessMessage('');
        }, 3000);
      } else {
        alert(data.message || 'Submission failed. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting enquiry:', err);
      // Fallback success
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setIsApplyModalOpen(false);
      }, 2000);
    } finally {
      setIsSubmittingEnquiry(false);
    }
  };

  const handleSaveAdmissionConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConfiguringAdmissions(true);
    try {
      if (templateCtx) {
        templateCtx.updateField('admissionsOpen', true);
        templateCtx.updateField('admissionsEmail', admissionEmail);
        templateCtx.updateField('admissionsPhone', admissionPhone);
        if (templateCtx.publishToSupabase) {
          await templateCtx.publishToSupabase();
        }
      }
      setConfigSuccessMessage('Admissions are now ACTIVE! Prospective parents can now apply directly.');
      setTimeout(() => {
        setConfigSuccessMessage('');
        setIsAdmissionConfigModalOpen(false);
      }, 2000);
    } catch (err) {
      console.error('Error updating admission status:', err);
    } finally {
      setIsConfiguringAdmissions(false);
    }
  };

  const campusVideoUrl = templateData?.campusVideoUrl || initialProfileData?.campusVideoUrl;

  return (
    <div id="school-profile-app" className="min-h-screen bg-white text-gray-900 antialiased selection:bg-blue-100 selection:text-blue-900 overflow-x-clip">
      
      {/* 1. CONTAINER 1: SLIM LIGHT CSEEL TOP STRIP (School Logo/Name/Menu bar removed) */}
      <div id="school-top-bar" className="w-full bg-white border-b border-slate-200 z-40 relative font-['Hanken_Grotesk',sans-serif]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between gap-2">
          <Link
            href="/"
            className="inline-flex items-center hover:opacity-90 transition-opacity shrink-0"
            title="CSEEL Home"
          >
            <img
              src="/images/cseel-logo.svg"
              alt="CSEEL"
              className="h-5 sm:h-[22px] w-auto object-contain shrink-0"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/images/cseel-logo.png';
              }}
            />
          </Link>

          <Link
            href="/schools"
            className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#EDF5FA] hover:bg-[#D6EDFF] border border-[#006FCC]/25 text-[10.5px] sm:text-xs font-bold text-[#005689] transition-all active:scale-95 whitespace-nowrap shrink-0"
          >
            See More School
          </Link>
        </div>
      </div>

      {/* 2. CONTAINER 2: DEDICATED STICKY NAVIGATION TAB BAR (Labster Design System) */}
      <nav 
        id="school-tab-navigation-bar" 
        className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-[#E8E9E9] shadow-xs transition-all"
        aria-label="School sections navigation"
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-1 sm:py-1.5">
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [touch-action:pan-x_pan-y]">
            {effectiveNavTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabSwitch(tab.id)}
                  className={`inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 rounded-xl text-[11px] sm:text-xs font-bold font-['Montserrat',sans-serif] transition-all duration-150 shrink-0 cursor-pointer select-none active:scale-[0.98] ${
                    isActive
                      ? 'text-white bg-[#006FCC] hover:bg-[#005399] shadow-xs'
                      : 'text-[#1B1F23] hover:text-[#006FCC] hover:bg-[#F7F8F8] border border-[#E8E9E9] bg-white'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="whitespace-nowrap leading-none text-[11px] sm:text-xs">
                    {/* Short Name on Mobile, Full Name on Desktop */}
                    <span className="inline md:hidden">{tab.shortLabel}</span>
                    <span className="hidden md:inline">{tab.label}</span>
                    {isLiveTemplate && isEditMode && templateData?.tabVisibility?.[tab.id] === false && (
                      <span className="ml-1 text-[9px] text-amber-500 font-bold" title="Tab is set to Private">🔒</span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* MOBILE SIDE MENU DRAWER (Action buttons & Section tabs for Mobile View) */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-[800] bg-black/60 backdrop-blur-xs transition-opacity md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-label="Close menu backdrop"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 right-0 z-[850] w-[290px] sm:w-[320px] h-[100dvh] max-h-[100dvh] bg-white shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-out md:hidden select-none ${
          isMobileMenuOpen ? 'translate-x-0 pointer-events-auto' : 'translate-x-full pointer-events-none'
        }`}
      >
        {/* Drawer Top Header (Deep Navy) */}
        <div className="bg-[#005689] p-4 text-white flex items-center justify-between border-b border-[#004770] shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 overflow-hidden">
              {actualSchoolLogo ? (
                <img src={actualSchoolLogo} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-white font-black text-xs">
                  {displayName ? displayName.charAt(0).toUpperCase() : 'S'}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-white truncate lowercase">
                {(templateData?.schoolName || displayName)?.toLowerCase()}
              </h4>
              <p className="text-[10px] text-blue-100 truncate">
                {displayDistrict}, {displayState}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Scrollable Body: Quick Actions + Section Tabs */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-3.5 space-y-4">
          {/* Quick Actions Section */}
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block px-1">
              Quick Actions
            </span>

            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-2.5 rounded-xl text-[11px] font-bold bg-[#001C33] text-white hover:bg-[#002B4F] flex items-center justify-center gap-1.5 shadow-2xs transition-all"
              >
                <Home className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
                <span className="truncate">CSEEL Home</span>
              </Link>
              <Link
                href="/schools"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-2.5 rounded-xl text-[11px] font-bold bg-[#EDF5FA] text-[#005689] border border-[#D6EDFF] hover:bg-[#D6EDFF] flex items-center justify-center gap-1.5 shadow-2xs transition-all"
              >
                <Compass className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">More Schools</span>
              </Link>
            </div>

            {/* Admission Status Button */}
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                if (isAdmissionsOpen) {
                  setIsApplyModalOpen(true);
                } else {
                  setIsAdmissionConfigModalOpen(true);
                }
              }}
              className={`w-full py-2.5 px-3 rounded-xl text-xs font-black flex items-center justify-between shadow-xs transition-all cursor-pointer ${
                isAdmissionsOpen
                  ? 'bg-[#005689] text-white hover:bg-[#004168]'
                  : 'bg-slate-800 text-white hover:bg-slate-900 border border-amber-400/40'
              }`}
            >
              <span className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-amber-300" />
                <span>{isAdmissionsOpen ? 'Apply for Admission' : 'Admissions: Inactive (Activate)'}</span>
              </span>
              
            </button>

            {/* Super Admin Add School Button in Quick Actions */}
            {isSuperAdminUser && (
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsAddSchoolModalOpen(true);
                }}
                className="w-full py-2.5 px-3 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-between shadow-xs transition-all cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <PlusCircle className="w-4 h-4 text-emerald-100 stroke-[2.4]" />
                  <span>+ Add New School Profile</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-emerald-100" />
              </button>
            )}

            {/* Claim School Button */}
            {!isTemplate && !isEditMode && !canEditSchool && !isSuperAdminUser && (
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsClaimModalOpen(true);
                }}
                className="w-full py-2.5 px-3 rounded-xl text-xs font-black bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 flex items-center justify-between shadow-2xs transition-all cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 stroke-[2.4]" />
                  <span>Claim School Profile</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-emerald-600" />
              </button>
            )}
          </div>

          {/* Navigation Tabs Section */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block px-1 mb-1">
              Campus Sections
            </span>
            {effectiveNavTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    handleTabSwitch(tab.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#EDF5FA] text-[#005689] border border-[#D6EDFF] shadow-2xs font-extrabold'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#005689]' : 'text-slate-400'}`} />
                    <span>{tab.shortLabel}</span>
                  </span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#005689]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Drawer Footer (User Account / Login) */}
        <div className="p-3.5 border-t border-slate-200 bg-slate-50 shrink-0">
          {user ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 px-1">
                <div className="w-8 h-8 rounded-full bg-[#005689] text-white flex items-center justify-center font-black text-xs shrink-0">
                  {(user.email?.charAt(0) || 'U').toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {user.user_metadata?.full_name || 'Signed In'}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono truncate">
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Role Badge for Authorized School Owner or Super Admin */}
              {(canEditSchool || isSuperAdminUser) && (
                <div className="px-1">
                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    authRole === 'admin' || isSuperAdminUser
                      ? 'text-amber-800 bg-amber-50 border border-amber-300'
                      : 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                  }`}>
                    <CheckCircle2 className="w-2.5 h-2.5 text-amber-600" />
                    <span>{authRole === 'admin' || isSuperAdminUser ? 'Verified Super Admin' : 'Verified School Owner'}</span>
                  </span>
                </div>
              )}

              {/* Dynamic Button: Super Admin can always add school; owners can view status */}
              {isSuperAdminUser ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsAddSchoolModalOpen(true);
                  }}
                  className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <PlusCircle className="w-3.5 h-3.5 text-emerald-700" />
                    <span>+ Add New School Profile</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-700" />
                </button>
              ) : userSchoolClaim && userSchoolClaim.status === 'pending' ? (
                <div className="p-2.5 text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="truncate text-xs font-black">Registration Pending Approval</p>
                    <p className="text-[10px] font-medium text-amber-700 truncate">{userSchoolClaim.school_name || 'Admin verification in progress'}</p>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsAddSchoolModalOpen(true);
                  }}
                  className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <PlusCircle className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Add Your School Profile</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-700" />
                </button>
              )}

              {/* Log Out Button */}
              <button
                type="button"
                onClick={async () => {
                  await signOut();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2 px-3 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : null}
        </div>
      </aside>

      {/* ========================================================= */}
      {/* 2. MAIN CONTENT BODY (SECTION-WISE MODULAR ROUTING)       */}
      {/* ========================================================= */}

      {/* ─── TAB 1: HOME ─── */}
      {activeTab === 'home' && (
        <div key="tab-home" className="animate-fade-in transition-opacity duration-300 space-y-0">
          {/* 1. ABOUT OUR INSTITUTION (ABOVE-THE-FOLD REPLACING HERO SECTION) */}
          {isSectionVisible('about') && (
            <div className="relative group/sect">
              <SectionVisibilityToggle sectionId="about" sectionTitle="About Institution" />
              <SchoolAboutSection
                displayName={displayName}
                displayUdise={displayUdise}
                displayBoard={displayBoard}
                isLiveTemplate={isLiveTemplate}
                isEditMode={isEditMode}
                templateData={templateData}
                initialProfileData={initialProfileData}
                imageUrl={imageUrl}
                displayEstablished={displayEstablished}
                displayStudents={displayStudents}
                displayTeachers={displayTeachers}
                displayCampusArea={displayCampusArea}
                onApplyClick={() => setIsApplyModalOpen(true)}
              />
            </div>
          )}

          {/* 1.5. DEDICATED STATISTICAL CARDS SECTION (SINGLE SOURCE OF TRUTH) */}
          {isSectionVisible('stats') && (
            <div className="relative group/sect">
              <SectionVisibilityToggle sectionId="stats" sectionTitle="Key Statistics" />
              <LazySection id="stats" minHeight="160px">
                <SchoolStatsSection
                  displayBoard={displayBoard}
                  displayUdise={displayUdise}
                  totalStudents={totalStudents}
                  totalTeachers={totalTeachers}
                  classroomsCount={classroomsCount}
                  schoolCategory={schoolCategory}
                  classFrom={classFrom}
                  classTo={classTo}
                  templateData={templateData}
                  residentialSchool={residentialSchool}
                  schoolType={management}
                  medium={medium}
                  genderType={genderType}
                  establishedYear={displayEstablished}
                  campusArea={displayCampusArea}
                  affiliationNumber={displayAffiliationNo}
                />
              </LazySection>
            </div>
          )}

          {/* AdSense In-Profile Sponsor Banner */}
          <div className="bg-white border-b border-[#E8EAED] py-3 sm:py-4">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
              <AdSenseBanner label="Sponsored Education Partner" responsive={true} />
            </div>
          </div>

          {/* 3. VIRTUAL CAMPUS TOUR & GALLERY UNIFIED SECTION */}
          {(isSectionVisible('campus_tour') || isSectionVisible('gallery')) && (
            <div id="campus-tour" className="relative group/sect">
              <SectionVisibilityToggle sectionId="campus_tour" sectionTitle="Virtual Campus Tour & Gallery" />
              <SchoolCampusSection
                displayName={displayName}
                videoUrl={campusVideoUrl}
                onUpdateVideoUrl={(url) => {
                  templateCtx?.updateField('campusVideoUrl' as any, url);
                }}
                isLiveTemplate={isLiveTemplate}
                isEditMode={isEditMode}
                templateData={templateData}
                templateCtx={templateCtx}
                onAddMediaClick={() => setIsGalleryModalOpen(true)}
                onTourClick={() => setIsTourModalOpen(true)}
                onApplyClick={() => setIsApplyModalOpen(true)}
              />
            </div>
          )}

          {/* 4. CAMPUS FACILITIES SECTION (ONE-SCREEN GLANCE INSIDE HOME TAB BEFORE FAQ) */}
          {isSectionVisible('facilities') && (
            <div id="facilities" className="relative group/sect">
              <SectionVisibilityToggle sectionId="facilities" sectionTitle="School Facilities" />
              <SchoolFacilitiesSection
                isEditMode={isEditMode}
                effectiveFacilities={effectiveFacilities}
                templateCtx={templateCtx}
              />
            </div>
          )}

          {/* 5. FAQ SECTION (COMPACT MAX 5 QUESTIONS) */}
          {isSectionVisible('faqs') && (
            <div className="relative group/sect">
              <SectionVisibilityToggle sectionId="faqs" sectionTitle="Frequently Asked Questions" />
              <LazySection id="home-faq" minHeight="320px">
                <SchoolFaqSection
                  id="home-faq"
                  schoolName={displayName}
                  board={displayBoard}
                  udiseCode={displayUdise}
                  address={displayAddress}
                  state={state}
                  district={district}
                  village={village}
                  pincode={pincode}
                  classFrom={displayClassFrom}
                  classTo={displayClassTo}
                  schoolCategory={schoolCategory}
                  management={displayManagementLabel}
                  medium={displayMedium}
                  genderType={genderType}
                  totalStudents={totalStudents}
                  totalTeachers={totalTeachers}
                  workingSmartBoards={workingSmartBoards}
                  computerIctLab={computerIctLab}
                  atalStemLab={atalStemLab}
                  playgroundAvailable={playgroundAvailable}
                />
              </LazySection>
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 2: ACADEMICS & RESULTS ─── */}
      {activeTab === 'academics' && (
        <div key="tab-academics" className="relative group/sect animate-fade-in transition-opacity duration-300">
          <SectionVisibilityToggle sectionId="academics" sectionTitle="Academics & Curriculum" />
          <SchoolAcademicsTab
            displayName={displayName}
            displayClassFrom={displayClassFrom}
            displayClassTo={displayClassTo}
            board={displayBoard}
            isEditMode={isEditMode}
            templateData={templateData}
            initialProfileData={initialProfileData}
            templateCtx={templateCtx}
          />
        </div>
      )}

      {/* ─── TAB 3: ADMISSIONS & FEES ─── */}
      {activeTab === 'admissions' && (
        <div key="tab-admissions" className="relative group/sect animate-fade-in transition-opacity duration-300">
          <SectionVisibilityToggle sectionId="admissions" sectionTitle="Admissions & Fees" />
          <SchoolFeeSection
            displayName={displayName}
            displayBoard={displayBoard}
            displayUdise={displayUdise}
            displayAddress={displayAddress}
            state={state}
            district={district}
            village={village}
            pincode={pincode}
            classFrom={classFrom}
            classTo={classTo}
            schoolCategory={schoolCategory}
            totalStudents={totalStudents}
            totalTeachers={totalTeachers}
            isEditMode={isEditMode}
            templateData={templateData}
            initialProfileData={initialProfileData}
            admissionPhone={admissionPhone}
            setAdmissionPhone={setAdmissionPhone}
            admissionEmail={admissionEmail}
            setAdmissionEmail={setAdmissionEmail}
            feesTable={feesTable}
            setFeesTable={setFeesTable}
            extraChargesTable={extraChargesTable}
            setExtraChargesTable={setExtraChargesTable}
            templateCtx={templateCtx}
          />
        </div>
      )}

      {/* ─── TAB 6: REVIEWS & RATINGS ─── */}
      {activeTab === 'reviews' && (
        <div key="tab-reviews" className="relative group/sect animate-fade-in transition-opacity duration-300">
          <SectionVisibilityToggle sectionId="reviews" sectionTitle="Reviews & Ratings" />
          <SchoolReviewsSection displayName={displayName} udiseCode={displayUdise} />
        </div>
      )}

      {/* NEARBY LOCATION-BASED SCHOOLS MINI-CARDS & STRUCTURED CSEEL NAVIGATION (ABOVE FOOTER) */}
      {(() => {
        const toSlug = (val: string, fallback: string) =>
          (val || fallback)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '') || fallback;

        const rawNearby = [...(districtSchools || []), ...(clusterSchools || [])];
        const seenCodes = new Set<string>();
        const nearbyList = rawNearby.filter((s: any) => {
          const name = String(s?.school_name || s?.name || '').trim();
          const code = String(s?.udise_code || s?.school_id || '').trim();
          if (!name) return false;
          if (code && displayUdise && code === displayUdise) return false;
          if (name.toLowerCase() === displayName.toLowerCase()) return false;
          const key = code || name.toLowerCase();
          if (seenCodes.has(key)) return false;
          seenCodes.add(key);
          return true;
        }).slice(0, 10);

        const districtDirectorySlug = displayDistrict && displayDistrict.toLowerCase() !== 'district'
          ? toSlug(displayDistrict, '')
          : '';
        const districtListingHref = districtDirectorySlug
          ? `/schools/schools-in-${districtDirectorySlug}`
          : '/schools';

        return (
          <section
            aria-label="Nearby Schools & CSEEL Directory Navigation"
            className="bg-white border-b border-[#E8EAED] py-4 sm:py-5"
          >
            <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 space-y-3.5">
              {/* Compact Heading + Directory / Home Links */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 min-w-0">
                  <MapPin className="w-3.5 h-3.5 text-[#006FCC] shrink-0" />
                  <h3 className="!text-xs sm:!text-sm !font-medium !text-slate-700 truncate m-0">
                    Nearby Schools{displayDistrict && displayDistrict.toLowerCase() !== 'district' ? ` in ${displayDistrict}` : (displayState ? ` in ${displayState}` : '')}
                  </h3>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href="/schools"
                    className="inline-flex items-center gap-1 text-[10.5px] sm:text-xs font-bold text-[#006FCC] hover:underline whitespace-nowrap"
                  >
                    <span>Visit School Listing</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                  <span className="text-slate-300 text-[10px]">|</span>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-1 text-[10.5px] sm:text-xs font-bold text-slate-700 hover:text-[#006FCC] whitespace-nowrap"
                  >
                    <Home className="w-3 h-3 text-[#006FCC]" />
                    <span>CSEEL Home</span>
                  </Link>
                </div>
              </div>

              {/* Single Horizontal Swipeable Row: Image at Top, Text Below */}
              {nearbyList.length > 0 && (
                <div className="flex flex-nowrap gap-2.5 overflow-x-auto overflow-y-hidden pb-2 custom-scrollbar snap-x snap-proximity w-full [touch-action:pan-x_pan-y] overscroll-x-contain">
                  {nearbyList.map((s: any, idx: number) => {
                    const sName = String(s.school_name || s.name || 'School').trim();
                    const sState = String(s.state_name || displayState || 'delhi').trim();
                    const sDist = String(s.district_name || displayDistrict || 'delhi').trim();
                    const sVill = String(s.village_name || village || 'main').trim();
                    const sCode = String(s.udise_code || s.school_id || '').trim();
                    const sBoard = cleanBoardName(String(s.board_10th || '')) || 'School';
                    const sImg = String(s.image_url || s.image || '').trim() || '/images/default-school-placeholder.png?v=3';
                    const nameSlug = toSlug(sName, 'school');
                    const href = sCode
                      ? `/school/${toSlug(sState, 'delhi')}/${toSlug(sDist, 'delhi')}/${toSlug(sVill, 'main')}/${encodeURIComponent(sCode)}/${nameSlug}`
                      : `/school/${toSlug(sState, 'delhi')}/${toSlug(sDist, 'delhi')}/${toSlug(sVill, 'main')}/${nameSlug}`;

                    return (
                      <Link
                        key={sCode || `${nameSlug}-${idx}`}
                        href={href}
                        className="group w-[138px] sm:w-[162px] shrink-0 snap-start rounded-xl border border-slate-200/90 bg-white hover:border-[#006FCC] shadow-2xs transition-all overflow-hidden flex flex-col"
                        title={`${sName} — ${sVill}, ${sDist}`}
                      >
                        <div className="relative w-full h-[78px] sm:h-[90px] bg-slate-100 overflow-hidden shrink-0">
                          <img
                            src={sImg}
                            alt={sName}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = '/images/default-school-placeholder.png?v=3';
                            }}
                          />
                        </div>
                        <div className="p-2 sm:p-2.5 flex flex-col justify-between flex-1 gap-1.5">
                          <p className="!text-[11px] sm:!text-xs !font-medium !text-slate-700 group-hover:!text-[#006FCC] !leading-snug line-clamp-2 m-0">
                            {sName}
                          </p>
                          <div className="flex items-center justify-between gap-1 pt-0.5">
                            <span className="text-[9px] sm:text-[10px] text-slate-500 font-normal truncate">
                              {sVill && sVill.toLowerCase() !== 'village' ? sVill : sDist}
                            </span>
                            <span className="text-[8.5px] font-medium uppercase tracking-tight text-[#005689] bg-[#EDF5FA] px-1.5 py-0.5 rounded shrink-0">
                              {sBoard}
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* Structured Step-by-Step Website Links Strip */}
              <div className="pt-2.5 border-t border-slate-200/70 flex flex-wrap items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px]">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[9px] mr-1">
                  Explore CSEEL:
                </span>
                <Link
                  href="/"
                  className="px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-[#006FCC] text-slate-700 hover:text-[#006FCC] font-semibold transition"
                >
                  CSEEL Official Home
                </Link>
                <Link
                  href="/schools"
                  className="px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-[#006FCC] text-slate-700 hover:text-[#006FCC] font-semibold transition"
                >
                  All Schools Listing
                </Link>
                {districtDirectorySlug && (
                  <Link
                    href={districtListingHref}
                    className="px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-[#006FCC] text-slate-700 hover:text-[#006FCC] font-semibold transition"
                  >
                    {displayDistrict} Schools
                  </Link>
                )}
                <Link
                  href="/domain/science"
                  className="px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-[#006FCC] text-slate-700 hover:text-[#006FCC] font-semibold transition"
                >
                  Science Labs
                </Link>
                <Link
                  href="/materials"
                  className="px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-[#006FCC] text-slate-700 hover:text-[#006FCC] font-semibold transition"
                >
                  Lab Materials
                </Link>
                <Link
                  href="/edu-network/teachers"
                  className="px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-[#006FCC] text-slate-700 hover:text-[#006FCC] font-semibold transition"
                >
                  Teaching Jobs
                </Link>
              </div>
            </div>
          </section>
        );
      })()}

      {/* UNIFIED CONTACT, CAMPUS MAP & FOOTER SECTION (EAGERLY RENDERED FOR SSR & INSTANT ACCESS) */}
      <SchoolFooterSection
        displayName={displayName}
        templateData={templateData}
        displayAddress={displayAddress}
        displayState={displayState}
        displayDistrict={displayDistrict}
        village={village}
        pincode={pincode}
        displayPhone={displayPhone}
        displayEmail={displayEmail}
        displayGeneralPhone={displayGeneralPhone}
        displayGeneralEmail={displayGeneralEmail}
        displayAdmissionsPhone={displayAdmissionsPhone}
        displayAdmissionsEmail={displayAdmissionsEmail}
        displayPrincipalPhone={displayPrincipalPhone}
        displayPrincipalEmail={displayPrincipalEmail}
        displayCareersPhone={displayCareersPhone}
        displayCareersEmail={displayCareersEmail}
        website={website}
        lat={lat}
        lng={lng}
        onTabSwitch={handleTabSwitch}
      />

      {/* ========================================================= */}
      {/* 3. MODALS (APPLY, TOUR, CLAIM, LIVE EDIT)                 */}
      {/* ========================================================= */}

      <SchoolProfileModals
        displayName={displayName}
        displayUdise={displayUdise}
        campusVideoUrl={campusVideoUrl}
        isAdmissionsOpen={isAdmissionsOpen}
        isLiveTemplate={isLiveTemplate}
        templateCtx={templateCtx}
        isApplyModalOpen={isApplyModalOpen}
        setIsApplyModalOpen={setIsApplyModalOpen}
        isSubmitted={isSubmitted}
        applicantName={applicantName}
        setApplicantName={setApplicantName}
        applicantPhone={applicantPhone}
        setApplicantPhone={setApplicantPhone}
        applicantClass={applicantClass}
        setApplicantClass={setApplicantClass}
        applicantEmail={applicantEmail}
        setApplicantEmail={setApplicantEmail}
        isSubmittingEnquiry={isSubmittingEnquiry}
        handleApplySubmit={handleApplySubmit}
        isAdmissionConfigModalOpen={isAdmissionConfigModalOpen}
        setIsAdmissionConfigModalOpen={setIsAdmissionConfigModalOpen}
        configSuccessMessage={configSuccessMessage}
        admissionContactPerson={admissionContactPerson}
        setAdmissionContactPerson={setAdmissionContactPerson}
        admissionEmail={admissionEmail}
        setAdmissionEmail={setAdmissionEmail}
        admissionPhone={admissionPhone}
        setAdmissionPhone={setAdmissionPhone}
        isConfiguringAdmissions={isConfiguringAdmissions}
        handleSaveAdmissionConfig={handleSaveAdmissionConfig}
        isTourModalOpen={isTourModalOpen}
        setIsTourModalOpen={setIsTourModalOpen}
        isAddFacilityModalOpen={isAddFacilityModalOpen}
        setIsAddFacilityModalOpen={setIsAddFacilityModalOpen}
        editingFacility={editingFacility}
        setEditingFacility={setEditingFacility}
        isAddAdmissionModalOpen={isAddAdmissionModalOpen}
        setIsAddAdmissionModalOpen={setIsAddAdmissionModalOpen}
        editingAdmission={editingAdmission}
        setEditingAdmission={setEditingAdmission}
        isFacultyModalOpen={isFacultyModalOpen}
        setIsFacultyModalOpen={setIsFacultyModalOpen}
        editingFaculty={editingFaculty}
        setEditingFaculty={setEditingFaculty}
        isGalleryModalOpen={isGalleryModalOpen}
        setIsGalleryModalOpen={setIsGalleryModalOpen}
        isAwardModalOpen={isAwardModalOpen}
        setIsAwardModalOpen={setIsAwardModalOpen}
        editingAward={editingAward}
        setEditingAward={setEditingAward}
        isClaimModalOpen={isClaimModalOpen}
        setIsClaimModalOpen={setIsClaimModalOpen}
        isAddSchoolModalOpen={isAddSchoolModalOpen}
        setIsAddSchoolModalOpen={setIsAddSchoolModalOpen}
      />

      {/* ─── STICKY FLOATING ACTION BAR (Call Icon + WhatsApp + Mail + Claim Profile) ─── */}
      <div className="fixed bottom-0 inset-x-0 z-50 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800 px-3 py-2 shadow-2xl safe-bottom">
        <div className="flex items-center justify-center gap-2 max-w-lg mx-auto">
          {displayPhone ? (
            <a
              href={`tel:${displayPhone.replace(/[^0-9+]/g, '')}`}
              aria-label="Call School"
              title={`Call School: ${displayPhone}`}
              className="w-10 h-10 shrink-0 inline-flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 active:scale-95 transition-all"
            >
              <Phone className="w-4 h-4" />
            </a>
          ) : (
            <a
              href="#contact"
              aria-label="Contact School"
              title="Contact School"
              className="w-10 h-10 shrink-0 inline-flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 active:scale-95 transition-all"
            >
              <Phone className="w-4 h-4" />
            </a>
          )}

          {/* WhatsApp Support Button (9050778830) */}
          <a
            href="https://wa.me/919050778830?text=Hi%20CSEEL%2C%20I%20have%20an%20inquiry%20regarding%20school%20profile"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            title="Chat on WhatsApp: 9050778830"
            className="w-10 h-10 shrink-0 inline-flex items-center justify-center rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/40 active:scale-95 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 20.15C10.57 20.15 9.12 19.76 7.85 19L7.55 18.82L4.43 19.64L5.26 16.6L5.06 16.29C4.24 14.99 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.68 12.05 3.68C14.25 3.68 16.31 4.54 17.87 6.1C19.42 7.66 20.28 9.72 20.28 11.92C20.28 16.46 16.59 20.15 12.05 20.15ZM16.57 14.36C16.32 14.23 15.1 13.63 14.88 13.55C14.65 13.47 14.49 13.43 14.32 13.68C14.16 13.93 13.68 14.49 13.53 14.66C13.39 14.82 13.24 14.84 12.99 14.72C12.75 14.59 11.95 14.33 11 13.49C10.26 12.83 9.76 12.02 9.61 11.77C9.47 11.53 9.6 11.39 9.72 11.27C9.83 11.16 9.97 10.98 10.1 10.83C10.22 10.68 10.26 10.58 10.34 10.41C10.43 10.25 10.38 10.1 10.32 9.98C10.26 9.85 9.77 8.65 9.56 8.16C9.36 7.68 9.16 7.74 9.01 7.73C8.87 7.73 8.71 7.72 8.54 7.72C8.38 7.72 8.11 7.78 7.89 8.03C7.66 8.27 7.02 8.87 7.02 10.1C7.02 11.32 7.91 12.5 8.03 12.67C8.16 12.83 9.78 15.34 12.27 16.41C12.86 16.67 13.32 16.82 13.68 16.94C14.28 17.13 14.82 17.1 15.26 17.04C15.75 16.97 16.76 16.42 16.97 15.83C17.18 15.24 17.18 14.74 17.11 14.63C17.05 14.52 16.82 14.48 16.57 14.36Z" />
            </svg>
          </a>

          {/* Mail Button (update@mailer.cseel.org) */}
          <a
            href="mailto:update@mailer.cseel.org?subject=School%20Profile%20Update%20Inquiry"
            aria-label="Email Us"
            title="Email: update@mailer.cseel.org"
            className="w-10 h-10 shrink-0 inline-flex items-center justify-center rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 border border-sky-500/40 active:scale-95 transition-all"
          >
            <Mail className="w-4 h-4" />
          </a>

          <button
            type="button"
            onClick={() => setIsClaimModalOpen(true)}
            className="flex-1 py-2.5 px-3.5 rounded-xl bg-[#006FCC] hover:bg-[#005499] text-white text-xs font-bold shadow-lg shadow-blue-900/30 active:scale-95 transition-all whitespace-nowrap inline-flex items-center justify-center gap-1.5 cursor-pointer font-['Montserrat',sans-serif]"
          >
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Claim Profile</span>
          </button>
        </div>
      </div>

    </div>
  );
}