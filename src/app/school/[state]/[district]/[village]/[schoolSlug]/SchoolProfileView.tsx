'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  ShieldCheck,
  Lock,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  X,
  Play,
  Home,
  BookOpen,
  Layers,
  Eye,
  GraduationCap,
  Star,
  Phone,
  HelpCircle,
  User as UserIcon,
  LogIn,
  LogOut,
  Edit3,
  Save,
  Check,
  Menu,
  Briefcase
} from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';
import { useOptionalSchoolTemplate } from '@/components/schools/template/SchoolTemplateContext';
import dynamic from 'next/dynamic';
import VerifiedBadge from '@/components/schools/template/VerifiedBadge';
import { cleanBoardName } from '@/integrations/supabase/schoolSearchClient';

// Critical Above-The-Fold Component (Instant Hydration)
import SchoolHeroSection from '@/components/schools/profile/SchoolHeroSection';
import SchoolStatsSection from '@/components/schools/profile/SchoolStatsSection';
import SchoolAboutCardsSection from '@/components/schools/profile/SchoolAboutCardsSection';
import LazySection from '@/components/schools/profile/LazySection';
import SectionVisibilityToggle from '@/components/schools/template/SectionVisibilityToggle';
import EditableImage from '@/components/schools/template/EditableImage';

// Lightweight Loading Skeletons
const SectionSkeleton = ({ height = 'h-72', title }: { height?: string; title?: string }) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full animate-pulse">
    <div className={`w-full ${height} rounded-3xl bg-slate-100/80 border border-slate-200/50 flex flex-col items-center justify-center p-6 text-center`}>
      <div className="w-8 h-8 rounded-full border-2 border-slate-300 border-t-[#005689] animate-spin mb-3" />
      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title || 'Loading content...'}</span>
    </div>
  </div>
);

const TabSkeleton = ({ title }: { title: string }) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full animate-pulse">
    <div className="min-h-[400px] rounded-3xl bg-slate-50 border border-slate-200/60 flex flex-col items-center justify-center p-8 text-center">
      <div className="w-10 h-10 rounded-full border-3 border-slate-200 border-t-[#005689] animate-spin mb-4" />
      <h3 className="text-base font-extrabold text-slate-700 mb-1">{title}</h3>
      <p className="text-xs text-slate-400">Loading verified data...</p>
    </div>
  </div>
);

// Below-The-Fold Home Sections (Dynamic Chunks, Browser-Cached)
const SchoolAboutSection = dynamic(() => import('@/components/schools/profile/SchoolAboutSection'), {
  loading: () => <SectionSkeleton height="h-96" title="About Institution" />
});
const SchoolCampusTourSection = dynamic(() => import('@/components/schools/profile/SchoolCampusTourSection'), {
  loading: () => <SectionSkeleton height="h-80" title="Campus Tour" />
});
const SchoolImportantInfoSection = dynamic(() => import('@/components/schools/profile/SchoolImportantInfoSection'), {
  loading: () => <SectionSkeleton height="h-72" title="Important Information" />
});
const SchoolPrincipalMessageSection = dynamic(() => import('@/components/schools/profile/SchoolPrincipalMessageSection'), {
  loading: () => <SectionSkeleton height="h-80" title="Principal's Desk" />
});
const SchoolManagementMessageSection = dynamic(() => import('@/components/schools/profile/SchoolManagementMessageSection'), {
  loading: () => <SectionSkeleton height="h-80" title="Management Desk" />
});
const SchoolVisionMissionSection = dynamic(() => import('@/components/schools/profile/SchoolVisionMissionSection'), {
  loading: () => <SectionSkeleton height="h-64" title="Vision & Mission" />
});
const SchoolFaqSection = dynamic(() => import('@/components/schools/template/SchoolFaqSection'), {
  loading: () => <SectionSkeleton height="h-96" title="Frequently Asked Questions" />
});

// Dynamic Tab Components (Lazy-loaded upon clicking tab, then cached in memory)
const SchoolAcademicsTab = dynamic(() => import('@/components/schools/profile/SchoolAcademicsTab'), {
  loading: () => <TabSkeleton title="Loading Academics & Results" />
});
const SchoolFacilitiesSection = dynamic(() => import('@/components/schools/profile/SchoolFacilitiesSection'), {
  loading: () => <TabSkeleton title="Loading Campus Facilities" />
});
const SchoolCampusSection = dynamic(() => import('@/components/schools/profile/SchoolCampusSection'), {
  loading: () => <TabSkeleton title="Loading Campus Life & Media" />
});
const SchoolFeeSection = dynamic(() => import('@/components/schools/profile/SchoolFeeSection'), {
  loading: () => <TabSkeleton title="Loading Fee Structure & Admissions" />
});
const SchoolReviewsSection = dynamic(() => import('@/components/schools/profile/SchoolReviewsSection'), {
  loading: () => <TabSkeleton title="Loading Reviews & Ratings" />
});
const SchoolContactDetailSection = dynamic(() => import('@/components/schools/profile/SchoolContactDetailSection'), {
  loading: () => <TabSkeleton title="Loading Contact Desks" />
});
const SchoolCareersTab = dynamic(() => import('@/components/schools/profile/SchoolCareersTab'), {
  loading: () => <TabSkeleton title="Loading Careers & Vacancies" />
});
const SchoolAddressMapSection = dynamic(() => import('@/components/schools/profile/SchoolAddressMapSection'), {
  ssr: false,
  loading: () => (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="h-80 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs uppercase tracking-wider animate-pulse">
        Loading Interactive Campus Map...
      </div>
    </div>
  )
});
const SchoolFooterSection = dynamic(() => import('@/components/schools/profile/SchoolFooterSection'), {
  loading: () => <div className="h-28 bg-slate-900" />
});

// Heavy Modals (Loaded strictly on user demand, ssr: false)
const ClaimSchoolModal = dynamic(() => import('@/components/schools/ClaimSchoolModal'), { ssr: false });
const AddCardModal = dynamic(() => import('@/components/schools/template/AddCardModal'), { ssr: false });
const FacultyModal = dynamic(() => import('@/components/schools/template/FacultyModal'), { ssr: false });
const GalleryModal = dynamic(() => import('@/components/schools/template/GalleryModal'), { ssr: false });
const AwardModal = dynamic(() => import('@/components/schools/template/AwardModal'), { ssr: false });

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
  | 'results'
  | 'facilities'
  | 'gallery'
  | 'admissions'
  | 'reviews'
  | 'careers'
  | 'faq'
  | 'contact';

const navTabs: { id: TabType; label: string; shortLabel: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'home', label: 'Home', shortLabel: 'Home', icon: Home },
  { id: 'academics', label: 'Academic & Results', shortLabel: 'Academics', icon: BookOpen },
  { id: 'facilities', label: 'Facilities', shortLabel: 'Facilities', icon: Layers },
  { id: 'gallery', label: 'Campus Gallery', shortLabel: 'Gallery', icon: Eye },
  { id: 'admissions', label: 'Admissions & Fees', shortLabel: 'Admissions', icon: GraduationCap },
  { id: 'careers', label: 'Careers & Faculty', shortLabel: 'Careers', icon: Briefcase },
  { id: 'reviews', label: 'Reviews & Ratings', shortLabel: 'Reviews', icon: Star },
  { id: 'faq', label: 'Frequently Asked Questions', shortLabel: 'FAQ', icon: HelpCircle },
  { id: 'contact', label: 'Contact Us', shortLabel: 'Contact', icon: Phone }
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
      columns: ['Class', 'Admission Fee (One Time)', 'Tuition Fee (Monthly)', 'Dev / Building Fee (Monthly)', 'Activity Fee (Monthly)', 'Total Annual (Est.)'],
      rows: [
        ['Pre (Nursery)', '', '', '', '', ''],
        ['LKG', '', '', '', '', ''],
        ['UKG', '', '', '', '', ''],
        ['Class 1', '', '', '', '', ''],
        ['Class 2', '', '', '', '', ''],
        ['Class 3', '', '', '', '', ''],
        ['Class 4', '', '', '', '', ''],
        ['Class 5', '', '', '', '', ''],
        ['Class 6', '', '', '', '', ''],
        ['Class 7', '', '', '', '', ''],
        ['Class 8', '', '', '', '', ''],
        ['Class 9', '', '', '', '', ''],
        ['Class 10', '', '', '', '', ''],
        ['Class 11', '', '', '', '', ''],
        ['Class 12', '', '', '', '', ''],
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

  // Interactive Live Template Context
  const templateCtx = useOptionalSchoolTemplate();
  const templateData = templateCtx?.data || initialProfileData || null;
  const isLiveTemplate = (isTemplate && !!templateCtx) || Boolean(initialProfileData);
  const isAdmissionsOpen = Boolean(templateData?.admissionsOpen);
  const isEditMode = templateCtx ? templateCtx.isEditMode : false;

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
  const handleTabSwitch = (tab: TabType) => {
    setIsMobileMenuOpen(false);
    if (tab === 'about') {
      setActiveTab('home');
      setTimeout(() => {
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
      }, 60);
      return;
    }
    setActiveTab(tab);
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

      const isStrictEdgeSwipe = startX <= 30 && diffX > 40;
      if (isStrictEdgeSwipe) {
        setIsMobileMenuOpen(true);
      } else if (diffX < -50 && Math.abs(diffX) > Math.abs(diffY)) {
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

  // Display texts matching institutional records
  const displayName = isLiveTemplate
    ? (templateData?.schoolName || 'School Name')
    : (isTemplate
      ? 'School Name'
      : ((!schoolName || /^\d+$/.test(schoolName.trim()))
        ? 'School Profile'
        : schoolName));

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

  const displayDistrict = isLiveTemplate
    ? (templateData?.district || district || 'District')
    : (district || 'Campus');

  const displayState = isLiveTemplate
    ? (templateData?.state || state || 'State')
    : (state || 'State');

  const displayClassFrom = isLiveTemplate
    ? (templateData?.classFrom || classFrom || '')
    : (classFrom || '');

  const displayClassTo = isLiveTemplate
    ? (templateData?.classTo || classTo || '')
    : (classTo || '');

  const displayClasses = (displayClassFrom && displayClassTo)
    ? `${displayClassFrom} to ${displayClassTo}`
    : (displayClassFrom || displayClassTo || '—');

  const mgmtVal = isLiveTemplate ? (templateData?.management || management || '') : (management || '');
  const isGovt = mgmtVal.toLowerCase().includes('govt') ||
                 mgmtVal.toLowerCase().includes('department') ||
                 mgmtVal.toLowerCase().includes('aided') ||
                 mgmtVal.toLowerCase().includes('kendriya');

  const displayManagementLabel = isLiveTemplate
    ? (templateData?.management || (isGovt ? 'Dept. of School Education, Govt.' : (management || 'Private Unaided (Recognized)')))
    : (management || (isGovt ? 'Dept. of School Education, Govt.' : 'Private Unaided (Recognized)'));

  const rawBoardStr = isLiveTemplate ? (templateData?.board || displayBoard) : (board || displayBoard);
  const boardsList = rawBoardStr
    ? rawBoardStr.split(/[,/|•]+/).map((b: string) => cleanBoardName(b.trim())).filter(Boolean)
    : [displayBoard];

  const rawMediumStr = isLiveTemplate ? (templateData?.medium || medium) : medium;
  const mediumsList = rawMediumStr
    ? rawMediumStr.split(/[,/|•]+/).map((m: string) => m.trim()).filter(Boolean)
    : (medium ? [medium] : ['English', 'Hindi']);
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
    <div className="min-h-screen bg-white font-sans text-gray-900 antialiased selection:bg-blue-100 selection:text-blue-900 overflow-x-clip">
      

      {/* 1. CONTAINER 1: TOP BRANDING & ACTION BAR (Deep Navy Background • School Name & Actions) */}
      <div id="school-top-bar" className="w-full bg-[#005689] border-b border-[#004770] text-white z-40 relative">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-2.5 flex items-center justify-between gap-3 sm:gap-4">
          
          {/* School Brand / Logo + Name & Location */}
          <div className="flex items-center gap-2.5 sm:gap-3 group min-w-0 text-left shrink-0">
            {/* School Logo */}
            {isLiveTemplate ? (
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl overflow-hidden bg-white border border-white/20 shadow-xs flex items-center justify-center shrink-0">
                <EditableImage
                  imageKey="school_logo"
                  alt={displayName}
                  defaultSrc="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%23003c6e'/><text x='50' y='62' font-size='42' font-family='sans-serif' font-weight='900' fill='white' text-anchor='middle'>S</text></svg>"
                  src={actualSchoolLogo}
                  className="w-full h-full object-cover"
                  containerClassName="w-full h-full"
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => handleTabSwitch('home')}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl overflow-hidden bg-white border border-white/20 shadow-xs flex items-center justify-center shrink-0 cursor-pointer hover:scale-105 active:scale-95 transition-all"
                title="Go to Home"
              >
                {actualSchoolLogo ? (
                  <img
                    src={actualSchoolLogo}
                    alt={displayName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%23003c6e'/><text x='50' y='62' font-size='42' font-family='sans-serif' font-weight='900' fill='white' text-anchor='middle'>S</text></svg>";
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#003c6e] to-[#005689] text-white font-black text-sm sm:text-base flex items-center justify-center">
                    {displayName ? displayName.charAt(0).toUpperCase() : 'S'}
                  </div>
                )}
              </button>
            )}

            {/* School Title & District/State (Lowercase school name, clean white font, balanced size) */}
            <div className="flex flex-col min-w-0 flex-1 justify-center max-w-[210px] xs:max-w-[280px] sm:max-w-md md:max-w-lg lg:max-w-xl">
              {/* Row 1: School Name in Lowercase + Verified Badge */}
              <div className="flex items-center gap-1.5 flex-nowrap min-w-0">
                {isLiveTemplate && isEditMode ? (
                  <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                    <span className="text-xs sm:text-sm font-bold tracking-tight text-white truncate lowercase">
                      {(templateData?.schoolName || displayName)?.toLowerCase()}
                    </span>
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 text-amber-900 border border-amber-300 select-none shadow-2xs shrink-0" title="Official School Name is locked to Government UDISE+ record">
                      <Lock className="w-2.5 h-2.5 text-amber-800" />
                      Locked
                    </span>
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white fill-[#38bdf8] shrink-0 drop-shadow-2xs" />
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span
                      onClick={() => handleTabSwitch('home')}
                      className="text-xs sm:text-sm font-bold tracking-tight text-white truncate cursor-pointer hover:text-blue-200 transition-colors inline lowercase"
                      title={displayName}
                    >
                      {displayName?.toLowerCase()}
                    </span>
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white fill-[#38bdf8] shrink-0 drop-shadow-2xs" />
                  </div>
                )}
              </div>

              {/* Row 2: Location (District, State) */}
              <div className="text-[10px] sm:text-[11px] font-medium text-blue-100/90 mt-0.5 flex items-center gap-1.5 flex-nowrap truncate leading-none">
                <span className="font-semibold text-blue-100 truncate text-[10px] sm:text-[11px]">
                  {displayDistrict}, {displayState}
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Actions (Hidden on Mobile View): Claim School, Admission, Login/User, Update */}
          <div className="hidden md:flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Small Update Button (in edit mode) */}
            {isEditMode && (
              <button
                type="button"
                onClick={handleSaveUpdates}
                disabled={isUpdating}
                className={`inline-flex items-center justify-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-black transition-all cursor-pointer shadow-xs active:scale-95 whitespace-nowrap ${
                  updateSuccess
                    ? 'bg-emerald-600 text-white'
                    : isUpdating
                    ? 'bg-slate-400 text-white cursor-wait'
                    : 'bg-[#FBBC04] hover:bg-amber-400 text-slate-950'
                }`}
                title="Save changes to school profile"
              >
                {updateSuccess ? (
                  <>
                    <Check className="w-3 h-3 stroke-[3]" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3 h-3" />
                    <span>{isUpdating ? 'Saving...' : 'Update'}</span>
                  </>
                )}
              </button>
            )}

            {/* Claim School Pill Button */}
            {!isTemplate && !isEditMode && (
              <button
                type="button"
                onClick={() => setIsClaimModalOpen(true)}
                className="inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold text-white bg-emerald-600/90 hover:bg-emerald-600 border border-emerald-400/50 shadow-2xs transition-all cursor-pointer whitespace-nowrap active:scale-95"
                title="Official Representative? Claim this school profile."
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-200 stroke-[2.4]" />
                <span>Claim School</span>
              </button>
            )}

            {/* Admission Status Button (Apply Now / Inactive - Click Inactive to Activate) */}
            <button
              type="button"
              onClick={() => {
                if (isAdmissionsOpen) {
                  setIsApplyModalOpen(true);
                } else {
                  setIsAdmissionConfigModalOpen(true);
                }
              }}
              className={`inline-flex items-center justify-center gap-1.5 font-bold px-3.5 sm:px-4 py-1.5 rounded-full text-xs transition-all duration-200 shrink-0 whitespace-nowrap cursor-pointer active:scale-95 ${
                isAdmissionsOpen
                  ? 'bg-white hover:bg-blue-50 text-[#005689] shadow-xs hover:-translate-y-0.5'
                  : 'bg-slate-900 hover:bg-slate-950 text-white border border-white/20 shadow-xs hover:border-amber-400'
              }`}
              title={isAdmissionsOpen ? 'Apply for admission now' : 'Click to configure and activate admissions'}
            >
              <span>{isAdmissionsOpen ? 'Apply Now' : 'Inactive (Activate)'}</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.4]" />
            </button>

            {/* Small Circular Login / User Avatar Icon */}
            {user ? (
              <div 
                ref={userMenuRef}
                className="relative ml-0.5"
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsUserMenuOpen(prev => !prev);
                  }}
                  className="w-8 h-8 rounded-full bg-white text-[#005689] border-2 border-white shadow-sm flex items-center justify-center text-xs font-black transition-transform cursor-pointer hover:scale-105 active:scale-95"
                  title={user.email || 'My Account'}
                >
                  {(user.email?.charAt(0) || 'U').toUpperCase()}
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-56 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2 px-2.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-2 py-1.5 border-b border-slate-100 mb-1.5">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {user.user_metadata?.full_name || 'Signed In'}
                      </p>
                      <p className="text-[10px] text-slate-500 font-mono truncate">
                        {user.email}
                      </p>
                    </div>

                    {/* Edit Mode Toggle Switch */}
                    <div className="px-2 py-1.5 bg-[#FEFBF3] border border-[#F4EBD9] rounded-xl flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <Edit3 className="w-3.5 h-3.5 text-[#005689]" />
                        <span className="text-xs font-bold text-slate-800">Edit Mode</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (templateCtx) {
                            templateCtx.setIsEditMode(!isEditMode);
                          }
                        }}
                        className={`w-10 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors duration-200 ${
                          isEditMode ? 'bg-[#005689]' : 'bg-slate-300'
                        }`}
                        title={isEditMode ? 'Disable Edit Mode' : 'Enable Edit Mode'}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                            isEditMode ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Log Out Button */}
                    <button
                      type="button"
                      onClick={async () => {
                        await signOut();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full px-2 py-1.5 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href={typeof window !== 'undefined' ? `/login?returnUrl=${encodeURIComponent(window.location.pathname)}` : '/login'}
                className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/30 shadow-2xs hover:shadow flex items-center justify-center transition-all cursor-pointer shrink-0 hover:scale-105 active:scale-95 ml-0.5"
                title="Login to CSEEL"
              >
                <LogIn className="w-3.5 h-3.5 text-white" />
              </Link>
            )}
          </div>

          {/* Mobile Actions: Clean Hamburger Menu Button (Buttons move to Side Drawer) */}
          <div className="flex md:hidden items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 text-white border border-white/20 transition-all cursor-pointer flex items-center justify-center shadow-xs"
              aria-label="Open mobile navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

        </div>
      </div>

      {/* 2. CONTAINER 2: DEDICATED STICKY NAVIGATION TAB BAR (Sticks to top on scroll) */}
      <nav 
        id="school-tab-navigation-bar" 
        className={`sticky ${Boolean(isTemplate && templateCtx) ? 'top-[52px]' : 'top-0'} z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-md transition-all`}
        aria-label="School sections navigation"
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-1.5 sm:py-2">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth touch-pan-x">
            {effectiveNavTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabSwitch(tab.id)}
                  className={`inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-bold transition-all duration-150 shrink-0 cursor-pointer select-none ${
                    isActive
                      ? 'text-white bg-[#005689] shadow-xs'
                      : 'text-slate-600 hover:text-[#005689] hover:bg-[#EDF5FA] border border-slate-200/80 bg-white'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="whitespace-nowrap leading-none text-xs">
                    {/* Short Name on Mobile (e.g. FAQ, Gallery, Academics), Full Name on Desktop */}
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
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Claim School Button */}
            {!isTemplate && !isEditMode && (
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

            {/* Save Profile Updates Button (if in edit mode) */}
            {isEditMode && (
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleSaveUpdates();
                }}
                disabled={isUpdating}
                className="w-full py-2.5 px-3 rounded-xl text-xs font-black bg-[#FBBC04] hover:bg-amber-400 text-slate-950 flex items-center justify-between shadow-xs transition-all cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  <span>{isUpdating ? 'Saving Changes...' : 'Save Profile Updates'}</span>
                </span>
                <Check className="w-3.5 h-3.5" />
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

              {/* Edit Mode Toggle Switch */}
              <div className="p-2 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5 text-[#005689]" />
                  Edit Mode
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (templateCtx) {
                      templateCtx.setIsEditMode(!isEditMode);
                    }
                  }}
                  className={`w-9 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors ${
                    isEditMode ? 'bg-[#005689]' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      isEditMode ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

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
          ) : (
            <Link
              href={typeof window !== 'undefined' ? `/login?returnUrl=${encodeURIComponent(window.location.pathname)}` : '/login'}
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-2.5 px-3 rounded-xl bg-[#005689] hover:bg-[#004168] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Login to School Portal</span>
            </Link>
          )}
        </div>
      </aside>

      {/* ========================================================= */}
      {/* 2. MAIN CONTENT BODY (SECTION-WISE MODULAR ROUTING)       */}
      {/* ========================================================= */}

      {/* ─── TAB 1: HOME ─── */}
      {activeTab === 'home' && (
        <div key="tab-home" className="animate-fade-in transition-opacity duration-300 space-y-0">
          {/* 1. HERO SECTION (INSTANT, ABOVE THE FOLD) */}
          {isSectionVisible('hero') && (
            <SchoolHeroSection
              displayName={displayName}
              displayBoard={displayBoard}
              displayUdise={displayUdise}
              isAdmissionsOpen={isAdmissionsOpen}
              isLiveTemplate={isLiveTemplate}
              isEditMode={isEditMode}
              templateData={templateData}
              totalStudents={totalStudents}
              totalTeachers={totalTeachers}
              classroomsCount={classroomsCount}
              schoolCategory={schoolCategory}
              classFrom={classFrom}
              classTo={classTo}
              imageUrl={imageUrl}
              actualSchoolLogo={actualSchoolLogo}
              flipbookSlides={flipbookSlides}
              residentialSchool={residentialSchool}
              onApplyClick={() => setIsApplyModalOpen(true)}
              onTourClick={() => {
                const el = document.getElementById('campus-tour');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                } else {
                  setIsTourModalOpen(true);
                }
              }}
              onExploreClick={() => handleTabSwitch('academics')}
              onTabSwitch={handleTabSwitch}
            />
          )}

          {/* 1.5. DEDICATED STATISTICAL CARDS SECTION (BELOW HERO SECTION) */}
          {isSectionVisible('stats') && (
            <div className="relative group/sect">
              <SectionVisibilityToggle sectionId="stats" sectionTitle="Key Statistics" />
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
              />
            </div>
          )}

          {/* 2. ABOUT SECTION (LAZY VIEWPORT) */}
          {isSectionVisible('about') && (
            <div className="relative group/sect">
              <SectionVisibilityToggle sectionId="about" sectionTitle="About Institution" />
              <LazySection id="about" minHeight="420px">
                <SchoolAboutSection
                  displayName={displayName}
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
              </LazySection>
            </div>
          )}

          {/* 2.5. DEDICATED ABOUT CARDS SECTION (4 FLOATING 3D CARDS) */}
          {isSectionVisible('about') && isSectionVisible('about_cards') && (
            <div className="relative group/sect">
              <SectionVisibilityToggle sectionId="about_cards" sectionTitle="Heritage Cards" />
              <SchoolAboutCardsSection
                displayName={displayName}
                isLiveTemplate={isLiveTemplate}
                isEditMode={isEditMode}
                templateData={templateData}
                displayEstablished={displayEstablished}
                displayStudents={displayStudents}
                displayTeachers={displayTeachers}
                displayCampusArea={displayCampusArea}
              />
            </div>
          )}

          {/* 3. CAMPUS TOUR SECTION (LAZY VIEWPORT) */}
          {isSectionVisible('campus_tour') && (
            <div className="relative group/sect">
              <SectionVisibilityToggle sectionId="campus_tour" sectionTitle="Campus Tour Video" />
              <LazySection id="campus-tour" minHeight="450px">
                <SchoolCampusTourSection
                  displayName={displayName}
                  videoUrl={campusVideoUrl}
                  isEditMode={isEditMode}
                  onUpdateVideoUrl={(url) => {
                    templateCtx?.updateField('campusVideoUrl' as any, url);
                  }}
                />
              </LazySection>
            </div>
          )}

          {/* 4. IMPORTANT INFO SECTION (LAZY VIEWPORT) */}
          {isSectionVisible('important_info') && (
            <div className="relative group/sect">
              <SectionVisibilityToggle sectionId="important_info" sectionTitle="Important Information" />
              <LazySection id="important-info" minHeight="380px">
                <SchoolImportantInfoSection
                  isLiveTemplate={isLiveTemplate}
                  isEditMode={isEditMode}
                  templateData={templateData}
                  displayBoard={displayBoard}
                  boardsList={boardsList}
                  displayAffiliationNo={displayAffiliationNo}
                  displayUdise={displayUdise}
                  displayManagementLabel={displayManagementLabel}
                  displayMedium={displayMedium}
                  mediumsList={mediumsList}
                  classFrom={displayClassFrom}
                  classTo={displayClassTo}
                  displayClasses={displayClasses}
                />
              </LazySection>
            </div>
          )}

          {/* 5. PRINCIPAL MESSAGE SECTION (LAZY VIEWPORT) */}
          {isSectionVisible('principal') && (
            <div className="relative group/sect">
              <SectionVisibilityToggle sectionId="principal" sectionTitle="Principal Message" />
              <LazySection id="principal-message" minHeight="420px">
                <SchoolPrincipalMessageSection
                  displayName={displayName}
                  displayPrincipal={displayPrincipal}
                  displayUdise={displayUdise}
                  isLiveTemplate={isLiveTemplate}
                  isEditMode={isEditMode}
                  templateData={templateData}
                  initialProfileData={initialProfileData}
                />
              </LazySection>
            </div>
          )}

          {/* 6. MANAGEMENT MESSAGE SECTION (LAZY VIEWPORT) */}
          {isSectionVisible('management') && (
            <div className="relative group/sect">
              <SectionVisibilityToggle sectionId="management" sectionTitle="Management Message" />
              <LazySection id="management-message" minHeight="420px">
                <SchoolManagementMessageSection
                  displayName={displayName}
                  displayManagementLabel={displayManagementLabel}
                  displayUdise={displayUdise}
                  isLiveTemplate={isLiveTemplate}
                  isEditMode={isEditMode}
                  templateData={templateData}
                  initialProfileData={initialProfileData}
                />
              </LazySection>
            </div>
          )}

          {/* 7. VISION & MISSION SECTION (LAZY VIEWPORT) */}
          {isSectionVisible('vision_mission') && (
            <div className="relative group/sect">
              <SectionVisibilityToggle sectionId="vision_mission" sectionTitle="Vision & Mission" />
              <LazySection id="vision-mission" minHeight="360px">
                <SchoolVisionMissionSection
                  isLiveTemplate={isLiveTemplate}
                  isEditMode={isEditMode}
                  templateData={templateData}
                  initialProfileData={initialProfileData}
                />
              </LazySection>
            </div>
          )}

          {/* 8. FAQ SECTION (LAZY VIEWPORT) */}
          {isSectionVisible('faqs') && (
            <div className="relative group/sect">
              <SectionVisibilityToggle sectionId="faqs" sectionTitle="Frequently Asked Questions" />
              <LazySection id="home-faq" minHeight="480px">
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

      {/* ─── TAB 3: FACILITIES ─── */}
      {activeTab === 'facilities' && (
        <div key="tab-facilities" className="relative group/sect animate-fade-in transition-opacity duration-300">
          <SectionVisibilityToggle sectionId="facilities" sectionTitle="School Facilities" />
          <SchoolFacilitiesSection
            isEditMode={isEditMode}
            effectiveFacilities={effectiveFacilities}
            templateCtx={templateCtx}
          />
        </div>
      )}

      {/* ─── TAB 4: GALLERY / CAMPUS ─── */}
      {activeTab === 'gallery' && (
        <div key="tab-gallery" className="relative group/sect animate-fade-in transition-opacity duration-300">
          <SectionVisibilityToggle sectionId="gallery" sectionTitle="Campus Gallery" />
          <SchoolCampusSection
            displayName={displayName}
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

      {/* ─── TAB 5: ADMISSIONS & FEES ─── */}
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

      {/* ─── TAB: CAREERS & FACULTY VACANCIES ─── */}
      {activeTab === 'careers' && (
        <div key="tab-careers" className="relative group/sect animate-fade-in transition-opacity duration-300">
          <SectionVisibilityToggle sectionId="careers" sectionTitle="Careers & Vacancies" />
          <SchoolCareersTab
            displayName={displayName}
            isLiveTemplate={isLiveTemplate}
            isEditMode={isEditMode}
            templateData={templateData}
            careersData={templateData?.careers || initialProfileData?.careers}
          />
        </div>
      )}

      {/* ─── TAB: FREQUENTLY ASKED QUESTIONS (FAQS) ─── */}
      {activeTab === 'faq' && (
        <div key="tab-faq" className="relative group/sect animate-fade-in transition-opacity duration-300">
          <SectionVisibilityToggle sectionId="faqs" sectionTitle="Frequently Asked Questions" />
          <SchoolFaqSection
            id="faq-tab"
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
        </div>
      )}

      {/* ─── TAB 7: CONTACT DETAILS & ADDRESS MAP ─── */}
      {activeTab === 'contact' && (
        <div key="tab-contact" className="relative group/sect animate-fade-in transition-opacity duration-300 space-y-12">
          <SectionVisibilityToggle sectionId="contact" sectionTitle="Contact Information" />
          <SchoolContactDetailSection
            displayName={displayName}
            isLiveTemplate={isLiveTemplate}
            isEditMode={isEditMode}
            templateData={templateData}
            displayGeneralPhone={displayGeneralPhone}
            displayGeneralEmail={displayGeneralEmail}
            displayAdmissionsPhone={displayAdmissionsPhone}
            displayAdmissionsEmail={displayAdmissionsEmail}
            displayPrincipalPhone={displayPrincipalPhone}
            displayPrincipalEmail={displayPrincipalEmail}
            displayCareersPhone={displayCareersPhone}
            displayCareersEmail={displayCareersEmail}
          />
          <SchoolAddressMapSection
            displayName={displayName}
            displayAddress={displayAddress}
            displayWebsiteUrl={website}
            lat={lat}
            lng={lng}
          />
        </div>
      )}

      {/* FOOTER SECTION (LAZY VIEWPORT) */}
      <LazySection minHeight="240px">
        <SchoolFooterSection
          displayName={displayName}
          actualSchoolLogo={actualSchoolLogo}
          templateData={templateData}
          displayAddress={displayAddress}
          displayPhone={displayPhone}
          displayEmail={displayEmail}
          onTabSwitch={handleTabSwitch}
        />
      </LazySection>

      {/* ========================================================= */}
      {/* 3. MODALS (APPLY, TOUR, CLAIM, LIVE EDIT)                 */}
      {/* ========================================================= */}

      {/* Admission Application Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-gray-100">
            <button
              onClick={() => setIsApplyModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {isSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-gray-950">Application Received!</h3>
                <p className="text-sm text-gray-600">
                  Our admissions counselor will contact you at <strong>{applicantPhone}</strong> within 24 hours.
                </p>
              </div>
            ) : (
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#005689] mb-1">
                  <span className="w-4 h-1 bg-[#FBBC04] rounded-full inline-block" />
                  <span>ADMISSION DESK 2026-27</span>
                </div>

                <h3 className="text-2xl font-black text-gray-950">Apply for Admission</h3>
                <p className="text-xs text-gray-500 mt-1 mb-4">
                  {displayName} • UDISE: {displayUdise || 'Verified'}
                </p>

                {!isAdmissionsOpen && (
                  <div className="mb-5 p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
                    <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-amber-900">Online Admissions Currently Inactive</div>
                      <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                        Online application submissions for this school are presently inactive. You may contact the admissions office directly or revisit during the next enrollment window.
                      </p>
                    </div>
                  </div>
                )}

                <form onSubmit={isAdmissionsOpen ? handleApplySubmit : (e) => e.preventDefault()} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Student / Parent Name *
                    </label>
                    <input
                      type="text"
                      required={isAdmissionsOpen}
                      disabled={!isAdmissionsOpen}
                      placeholder="e.g. Rahul Sharma"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none ${
                        !isAdmissionsOpen ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' : 'focus:ring-2 focus:ring-blue-500'
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required={isAdmissionsOpen}
                        disabled={!isAdmissionsOpen}
                        placeholder="+91 98765 43210"
                        value={applicantPhone}
                        onChange={(e) => setApplicantPhone(e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none ${
                          !isAdmissionsOpen ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' : 'focus:ring-2 focus:ring-blue-500'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                        Class Applying For *
                      </label>
                      <select
                        value={applicantClass}
                        disabled={!isAdmissionsOpen}
                        onChange={(e) => setApplicantClass(e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none bg-white ${
                          !isAdmissionsOpen ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' : 'focus:ring-2 focus:ring-blue-500'
                        }`}
                      >
                        <option value="Nursery">Nursery / Pre-Primary</option>
                        <option value="KG">Kindergarten (KG)</option>
                        <option value="Class 1">Class 1</option>
                        <option value="Class 2">Class 2</option>
                        <option value="Class 3">Class 3</option>
                        <option value="Class 4">Class 4</option>
                        <option value="Class 5">Class 5</option>
                        <option value="Class 6">Class 6</option>
                        <option value="Class 7">Class 7</option>
                        <option value="Class 8">Class 8</option>
                        <option value="Class 9">Class 9</option>
                        <option value="Class 10">Class 10</option>
                        <option value="Class 11">Class 11 (Senior Secondary)</option>
                        <option value="Class 12">Class 12 (Senior Secondary)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      disabled={!isAdmissionsOpen}
                      placeholder="parent@example.com"
                      value={applicantEmail}
                      onChange={(e) => setApplicantEmail(e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none ${
                        !isAdmissionsOpen ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' : 'focus:ring-2 focus:ring-blue-500'
                      }`}
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={!isAdmissionsOpen || isSubmittingEnquiry}
                      className={`w-full font-bold py-3.5 rounded-xl text-sm transition-all shadow-md ${
                        isAdmissionsOpen
                          ? 'bg-[#005689] hover:bg-[#003c6e] text-white hover:shadow-lg active:scale-[0.99] cursor-pointer'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {isSubmittingEnquiry ? 'Sending Inquiry to School...' : isAdmissionsOpen ? 'Submit Application' : 'Admissions Currently Inactive'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ADMISSION ACTIVATION & CONTACT CONFIGURATION MODAL */}
      {isAdmissionConfigModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-slate-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsAdmissionConfigModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors z-10 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {configSuccessMessage ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-7 h-7 stroke-[3]" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Admissions Activated!</h4>
                <p className="text-xs text-gray-600 leading-relaxed">{configSuccessMessage}</p>
              </div>
            ) : (
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-[#005689] mb-1">
                  <span className="w-4 h-1 bg-amber-400 rounded-full inline-block" />
                  <span>INSTITUTIONAL ADMISSION SETUP</span>
                </div>

                <h3 className="text-2xl font-black text-gray-950">Activate Online Admissions</h3>
                <p className="text-xs text-gray-500 mt-1 mb-6 leading-relaxed">
                  Enter official admission contact details for <strong>{displayName}</strong>. When parents submit inquiries, an email alert with applicant data will be sent directly to this address and stored in the database.
                </p>

                <form onSubmit={handleSaveAdmissionConfig} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Admission Contact Person / Desk *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Admissions Coordinator / Principal Desk"
                      value={admissionContactPerson}
                      onChange={(e) => setAdmissionContactPerson(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#005689]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Admissions Email (Where inquiries will be sent) *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. admissions@school.edu.in or principal@school.com"
                      value={admissionEmail}
                      onChange={(e) => setAdmissionEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#005689]"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      All new student admission applications &amp; phone contacts will be emailed directly here.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Admissions Helpline Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={admissionPhone}
                      onChange={(e) => setAdmissionPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#005689]"
                    />
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={isConfiguringAdmissions}
                      className="w-full font-bold py-3.5 rounded-xl text-sm bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-md hover:shadow-lg active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4 stroke-[2.5]" />
                      <span>{isConfiguringAdmissions ? 'Activating Admissions...' : 'Activate Admissions & Save Contact'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Campus Video Tour Modal */}
      {isTourModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsTourModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-xl font-bold text-gray-950 mb-4 flex items-center gap-2">
              <Play className="w-5 h-5 text-blue-600 fill-current" />
              <span>{displayName} Campus Walkthrough</span>
            </h3>

            {campusVideoUrl ? (
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black relative flex items-center justify-center">
                <iframe
                  className="w-full h-full"
                  src={campusVideoUrl.includes('watch?v=') ? `https://www.youtube.com/embed/${campusVideoUrl.split('watch?v=')[1]?.split('&')[0]}` : campusVideoUrl}
                  title="School Campus Walkthrough"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="aspect-video w-full rounded-2xl bg-slate-900 flex flex-col items-center justify-center text-center p-6 text-white">
                <Play className="w-12 h-12 text-[#38BDF8] mb-3 opacity-80" />
                <h4 className="text-lg font-bold">Campus Video Walkthrough</h4>
                <p className="text-xs text-slate-300 max-w-md mt-1.5">
                  Official video tour for this school is being recorded and will be published once verified by the school administration.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Live Template WYSIWYG Editor Modals */}
      {isLiveTemplate && (
        <>
          <AddCardModal
            isOpen={isAddFacilityModalOpen}
            onClose={() => {
              setIsAddFacilityModalOpen(false);
              setEditingFacility(null);
            }}
            cardType="facility"
            initialData={editingFacility ? {
              title: editingFacility.title || editingFacility.name || '',
              desc: editingFacility.desc || editingFacility.details || '',
              points: editingFacility.points || editingFacility._raw?.points || [],
              icon: editingFacility.iconName || editingFacility._raw?.icon || (typeof editingFacility.icon === 'string' ? editingFacility.icon : 'TestTubes'),
              illustration: editingFacility.illustration || editingFacility._raw?.illustration,
              badge: editingFacility.badge || editingFacility.category
            } : undefined}
            onSave={(card) => {
              const facilityPayload = {
                title: card.title,
                desc: card.desc || card.criteria || 'Standard school facility',
                points: card.points,
                icon: card.icon,
                illustration: card.illustration,
                badge: card.badge
              };
              if (editingFacility) {
                templateCtx?.updateFacilityCard(editingFacility.id, facilityPayload);
              } else {
                templateCtx?.addFacilityCard(facilityPayload);
              }
            }}
          />

          <AddCardModal
            isOpen={isAddAdmissionModalOpen}
            onClose={() => {
              setIsAddAdmissionModalOpen(false);
              setEditingAdmission(null);
            }}
            cardType="admission"
            initialData={editingAdmission ? {
              title: editingAdmission.title || '',
              criteria: editingAdmission.criteria || editingAdmission.desc || '',
              points: editingAdmission.points || editingAdmission._raw?.points || [],
              fees: editingAdmission.fees,
              icon: editingAdmission.icon || 'GraduationCap',
              illustration: editingAdmission.illustration,
              badge: editingAdmission.badge
            } : undefined}
            onSave={(card) => {
              const admissionPayload = {
                title: card.title,
                criteria: card.criteria || card.desc || 'Standard admission criteria',
                points: card.points,
                fees: card.fees,
                icon: card.icon,
                illustration: card.illustration,
                badge: card.badge
              };
              if (editingAdmission) {
                templateCtx?.updateAdmissionCard(editingAdmission.id, admissionPayload);
              } else {
                templateCtx?.addAdmissionCard(admissionPayload);
              }
            }}
          />

          <FacultyModal
            isOpen={isFacultyModalOpen}
            onClose={() => {
              setIsFacultyModalOpen(false);
              setEditingFaculty(null);
            }}
            initialData={editingFaculty}
            onSave={(member) => {
              if (editingFaculty) {
                templateCtx?.updateFacultyCard(editingFaculty.id, member);
              } else {
                templateCtx?.addFacultyCard(member);
              }
            }}
          />

          <GalleryModal
            isOpen={isGalleryModalOpen}
            onClose={() => setIsGalleryModalOpen(false)}
            onSave={(item) => {
              templateCtx?.addGalleryItem(item);
            }}
          />

          <AwardModal
            isOpen={isAwardModalOpen}
            onClose={() => {
              setIsAwardModalOpen(false);
              setEditingAward(null);
            }}
            initialData={editingAward}
            onSave={(award) => {
              if (editingAward) {
                templateCtx?.updateAwardCard(editingAward.id, award);
              } else {
                templateCtx?.addAwardCard(award);
              }
            }}
          />
        </>
      )}

      {/* Claim This School Modal */}
      <ClaimSchoolModal
        isOpen={isClaimModalOpen}
        onClose={() => setIsClaimModalOpen(false)}
        schoolName={displayName}
        udiseCode={displayUdise}
      />

    </div>
  );
}
