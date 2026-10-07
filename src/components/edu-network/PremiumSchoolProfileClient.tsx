'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Building2, MapPin, Star, ShieldCheck, CheckCircle2,
  Briefcase, Heart, MessageSquare, Share2, Send, Plus,
  ChevronRight, Award, Beaker, Users, Calendar, ArrowLeft,
  ThumbsUp, ExternalLink, Check, X, Sparkles, Navigation,
  Clock, Eye, Camera, BookOpen, Microscope, Laptop, Maximize2,
  Phone, Mail, Globe, Wallet, ChartBar, Wand2, Image as ImageIcon,
  Play, Download, Lock, CheckSquare, HelpCircle, FileText, ChevronDown,
  Scale, Bell, Bookmark, Bot, Video, UserCheck, Key, Copy, CheckCheck,
  Menu as MenuIcon, ChevronLeft, PhoneCall, HelpCircle as HelpIcon,
  CheckCircle, XCircle, AlertCircle, Info, Trophy, GraduationCap
} from 'lucide-react';
import PageTransition from '@/components/shared/PageTransition';
import {
  getOrganizationById, getJobsByOrgId, ALL_ORGANIZATIONS,
  OrganizationItem, EduJobItem
} from '@/lib/eduNetworkData';

interface PremiumSchoolProfileProps {
  orgId?: string;
  overrideOrg?: any;
}

export default function PremiumSchoolProfileClient({ orgId, overrideOrg }: PremiumSchoolProfileProps) {
  // Find organization or fallback to K.R. Mangalam Global School or use overrideOrg
  const org = useMemo(() => {
    if (overrideOrg) return overrideOrg;
    return (orgId ? getOrganizationById(orgId) : null) || ALL_ORGANIZATIONS[0];
  }, [orgId, overrideOrg]);

  // Selected Class in Fee Structure (Individual classes: Nursery through Class 12)
  const [selectedFeeClass, setSelectedFeeClass] = useState('nursery');
  const [selectedAdmissionSession, setSelectedAdmissionSession] = useState('2027-2028');
  const [selectedEligibilityGrade, setSelectedEligibilityGrade] = useState('Pre-K');

  // Share Modal & Mobile Menu state
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const currentShareUrl = typeof window !== 'undefined'
    ? window.location.href
    : `https://www.cseel.org/edu-network/organisation/school/${org.id}`;

  const shareText = `Check out ${org.name} (${org.city}) on CSEEL EduNetwork. Verified ${org.board} School with ${org.stemLabsCount} Experiential Science Labs & Admissions 2026-27:`;

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && (navigator as any).share) {
      try {
        await (navigator as any).share({
          title: `${org.name} - Profile & Admissions`,
          text: shareText,
          url: currentShareUrl,
        });
      } catch (err) {
        setIsShareModalOpen(true);
      }
    } else {
      setIsShareModalOpen(true);
    }
  };

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(currentShareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Fee calculation dynamically based on individual class selection
  const classFeeBreakdown: Record<string, {
    label: string;
    admission: number;
    security: number;
    tuitionQuarterly: number;
    annual: number;
    dev: number;
    totalFirstYear: number;
    monthlyAvg: number;
  }> = {
    'nursery': { label: 'Nursery', admission: 80000, security: 100000, tuitionQuarterly: 78000, annual: 24000, dev: 12000, totalFirstYear: 529000, monthlyAvg: 29000 },
    'lkg': { label: 'LKG', admission: 80000, security: 100000, tuitionQuarterly: 78000, annual: 24000, dev: 12000, totalFirstYear: 529000, monthlyAvg: 29000 },
    'ukg': { label: 'UKG', admission: 80000, security: 100000, tuitionQuarterly: 82000, annual: 26000, dev: 14000, totalFirstYear: 549000, monthlyAvg: 30600 },
    'class-1': { label: 'Class 1', admission: 85000, security: 100000, tuitionQuarterly: 85000, annual: 28000, dev: 15000, totalFirstYear: 569000, monthlyAvg: 32000 },
    'class-2': { label: 'Class 2', admission: 85000, security: 100000, tuitionQuarterly: 85000, annual: 28000, dev: 15000, totalFirstYear: 569000, monthlyAvg: 32000 },
    'class-3': { label: 'Class 3', admission: 85000, security: 100000, tuitionQuarterly: 88000, annual: 28000, dev: 15000, totalFirstYear: 581000, monthlyAvg: 32900 },
    'class-4': { label: 'Class 4', admission: 85000, security: 100000, tuitionQuarterly: 88000, annual: 28000, dev: 15000, totalFirstYear: 581000, monthlyAvg: 32900 },
    'class-5': { label: 'Class 5', admission: 85000, security: 100000, tuitionQuarterly: 88000, annual: 28000, dev: 15000, totalFirstYear: 581000, monthlyAvg: 32900 },
    'class-6': { label: 'Class 6', admission: 90000, security: 100000, tuitionQuarterly: 95000, annual: 34000, dev: 20000, totalFirstYear: 625000, monthlyAvg: 36100 },
    'class-7': { label: 'Class 7', admission: 90000, security: 100000, tuitionQuarterly: 95000, annual: 34000, dev: 20000, totalFirstYear: 625000, monthlyAvg: 36100 },
    'class-8': { label: 'Class 8', admission: 90000, security: 100000, tuitionQuarterly: 95000, annual: 34000, dev: 20000, totalFirstYear: 625000, monthlyAvg: 36100 },
    'class-9': { label: 'Class 9', admission: 95000, security: 100000, tuitionQuarterly: 105000, annual: 40000, dev: 25000, totalFirstYear: 681000, monthlyAvg: 40400 },
    'class-10': { label: 'Class 10', admission: 95000, security: 100000, tuitionQuarterly: 105000, annual: 40000, dev: 25000, totalFirstYear: 681000, monthlyAvg: 40400 },
    'class-11': { label: 'Class 11', admission: 100000, security: 100000, tuitionQuarterly: 125000, annual: 48000, dev: 30000, totalFirstYear: 779000, monthlyAvg: 48100 },
    'class-12': { label: 'Class 12', admission: 100000, security: 100000, tuitionQuarterly: 125000, annual: 48000, dev: 30000, totalFirstYear: 779000, monthlyAvg: 48100 },
  };

  const currentFee = classFeeBreakdown[selectedFeeClass] || classFeeBreakdown['nursery'];

  // Careers & Jobs state
  const initialJobs: EduJobItem[] = useMemo(() => {
    const orgJobs = getJobsByOrgId(org.id);
    if (orgJobs.length > 0) return orgJobs;
    return [
      {
        id: `job-${org.id}-1`,
        orgId: org.id,
        orgName: org.name,
        orgLogo: org.logo,
        orgRating: org.rating,
        title: 'IB DP High School Physics & Mathematics Head',
        subject: 'Physics' as const,
        roleType: 'Full-Time' as const,
        jobTypeCategory: 'Teaching Faculty',
        jobShift: 'Day shift (8:00 AM – 3:30 PM)',
        city: org.city,
        state: org.state,
        pincode: org.pincode,
        address: org.address,
        salary: '₹55,000 - ₹75,000 / mo',
        salaryNumMin: 55000,
        salaryNumMax: 75000,
        experienceRequired: '3-6 Years',
        qualifications: 'M.Sc / B.Ed with IB Certification',
        openings: 1,
        postedDate: '1 day ago',
        isUrgentlyHiring: true,
        easilyApply: true,
        benefits: ['Health Insurance', 'Lab Allowance', 'Provident Fund', 'Subsidized Transport'],
        description: 'Lead senior secondary experiential science practicals, supervise scientific inquiry prototypes, and oversee hands-on experiments.',
        responsibilities: [
          'Design hands-on experimental practical lesson plans.',
          'Manage internal lab assessments and safety standards.',
          'Mentor students for National Science Conclaves.'
        ],
        requirements: ['Minimum 3 years teaching experience', 'Strong experimental apparatus mastery'],
        verified: true,
      },
      {
        id: `job-${org.id}-2`,
        orgId: org.id,
        orgName: org.name,
        orgLogo: org.logo,
        orgRating: org.rating,
        title: 'Senior Admission Counselor & Front-Office Lead',
        subject: 'Robotics & AI' as const,
        roleType: 'Full-Time' as const,
        jobTypeCategory: 'Non-Teaching',
        jobShift: 'Day shift',
        city: org.city,
        state: org.state,
        pincode: org.pincode,
        address: org.address,
        salary: '₹35,000 - ₹45,000 / mo',
        salaryNumMin: 35000,
        salaryNumMax: 45000,
        experienceRequired: '2-5 Years',
        qualifications: 'Graduate + 2 yrs CRM Experience',
        openings: 2,
        postedDate: '3 days ago',
        isUrgentlyHiring: false,
        easilyApply: true,
        benefits: ['Annual Performance Bonus', 'Health Insurance'],
        description: 'Coordinate parent admission inquiries, conduct campus STEM laboratory walk-throughs, and manage student registration workflows.',
        responsibilities: ['Parent consultations', 'Campus tours', 'Counseling CRM oversight'],
        requirements: ['Exceptional communication skills', 'Prior school admissions background'],
        verified: true,
      }
    ];
  }, [org]);

  const [jobsList, setJobsList] = useState<EduJobItem[]>(initialJobs);
  const [activeJobTab, setActiveJobTab] = useState<'current' | 'past'>('current');

  // Video Gallery modal state
  const [activeVideo, setActiveVideo] = useState<{ id: string; title: string } | null>(null);

  // Auth modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authType, setAuthType] = useState<'signin' | 'signup'>('signin');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authSuccess, setAuthSuccess] = useState(false);

  // Job Modal state
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [jobModalForm, setJobModalForm] = useState({ title: '', department: 'Teaching Faculty', requirements: '', salary: '₹55,000 - ₹75,000 / mo' });
  const [jobModalSuccess, setJobModalSuccess] = useState(false);

  // Apply Modal state
  const [selectedJobToApply, setSelectedJobToApply] = useState<EduJobItem | null>(null);
  const [applyModalForm, setApplyModalForm] = useState({ name: '', email: '', phone: '', experience: '3 Years', message: '' });
  const [applySuccess, setApplySuccess] = useState(false);

  // Callback / Enquire Modal state
  const [isCallbackModalOpen, setIsCallbackModalOpen] = useState(false);
  const [callbackForm, setCallbackForm] = useState({ parentName: '', phone: '', grade: 'Class 9', preferredTime: 'Morning (9 AM - 12 PM)' });
  const [callbackSuccess, setCallbackSuccess] = useState(false);

  // Academic Results & Banner states
  const [selectedResultClass, setSelectedResultClass] = useState<'10' | '12'>('12');
  const [isResultsArchiveOpen, setIsResultsArchiveOpen] = useState(false);
  const [isUploadBannerModalOpen, setIsUploadBannerModalOpen] = useState(false);
  const [uploadBannerSuccess, setUploadBannerSuccess] = useState(false);
  const [uploadBannerForm, setUploadBannerForm] = useState({
    academicYear: '2025-26',
    targetClass: 'Class 12th',
    bannerUrl: '',
    topperName: '',
    score: '',
    stream: 'Science'
  });

  // Lightbox Photo
  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);
  const [isNotified, setIsNotified] = useState(false);

  // Handlers
  const handleJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobModalForm.title) return;

    const newJob: EduJobItem = {
      id: `job-custom-${Date.now()}`,
      orgId: org.id,
      orgName: org.name,
      orgLogo: org.logo,
      orgRating: org.rating,
      title: jobModalForm.title,
      subject: 'Physics',
      roleType: 'Full-Time',
      jobTypeCategory: jobModalForm.department === 'Teaching Faculty' ? 'Teaching Faculty' : 'Non-Teaching',
      jobShift: 'Day shift',
      city: org.city,
      state: org.state,
      pincode: org.pincode,
      address: org.address,
      salary: jobModalForm.salary,
      salaryNumMin: 55000,
      salaryNumMax: 75000,
      experienceRequired: '2-5 Years',
      qualifications: 'B.Ed / Post-Graduate / Relevant Certification',
      openings: 1,
      postedDate: 'Just now',
      isUrgentlyHiring: true,
      easilyApply: true,
      benefits: ['Health Insurance', 'Lab allowance'],
      description: jobModalForm.requirements || 'Join our verified institutional faculty network.',
      responsibilities: ['Execute academic practical curriculum', 'Maintain lab safety standards'],
      requirements: [jobModalForm.requirements || 'Relevant degree and teaching experience'],
      verified: true,
    };

    setJobsList([newJob, ...jobsList]);
    setJobModalSuccess(true);
    setTimeout(() => {
      setJobModalSuccess(false);
      setIsJobModalOpen(false);
      setJobModalForm({ title: '', department: 'Teaching Faculty', requirements: '', salary: '₹55,000 - ₹75,000 / mo' });
    }, 1800);
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApplySuccess(true);
    setTimeout(() => {
      setApplySuccess(false);
      setSelectedJobToApply(null);
      setApplyModalForm({ name: '', email: '', phone: '', experience: '3 Years', message: '' });
    }, 1800);
  };

  const handleCallbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCallbackSuccess(true);
    setTimeout(() => {
      setCallbackSuccess(false);
      setIsCallbackModalOpen(false);
      setCallbackForm({ parentName: '', phone: '', grade: 'Class 9', preferredTime: 'Morning (9 AM - 12 PM)' });
    }, 1800);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthSuccess(true);
    setTimeout(() => {
      setAuthSuccess(false);
      setIsAuthModalOpen(false);
    }, 1500);
  };

  // Video Gallery Items
  const videoItems = (org as any).videosList && (org as any).videosList.length > 0
    ? (org as any).videosList.map((v: any, idx: number) => ({
        id: v.id || `video-${idx}`,
        title: v.title || 'Campus Video Tour',
        subtitle: v.description || 'Virtual Tour • Academic Blocks',
        duration: '03:45',
        thumb: v.url && v.url.includes('youtube.com/embed/')
          ? `https://img.youtube.com/vi/${v.url.split('/embed/')[1]?.split('?')[0] || 'dQw4w9WgXcQ'}/hqdefault.jpg`
          : 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80'
      }))
    : [
        {
          id: 'rJKzHb76LJs',
          title: 'Campus Walkthrough & Infrastructure',
          subtitle: 'Virtual Tour • Academic Blocks',
          duration: '03:45',
          thumb: 'https://img.youtube.com/vi/rJKzHb76LJs/hqdefault.jpg'
        },
        {
          id: 'a69t-R5jZl0',
          title: 'Robotics & Experiential Science Labs',
          subtitle: 'STEM Highlights • Innovation',
          duration: '04:12',
          thumb: 'https://img.youtube.com/vi/a69t-R5jZl0/hqdefault.jpg'
        },
        {
          id: 'fZoVdoZ3Khk',
          title: 'Sports Arena, Pool & Athletics Day',
          subtitle: 'Extracurricular • Fitness',
          duration: '02:50',
          thumb: 'https://img.youtube.com/vi/fZoVdoZ3Khk/hqdefault.jpg'
        }
      ];

  // Gallery with Titles and Labels
  const galleryPhotos = (org as any).galleryPhotos && (org as any).galleryPhotos.length > 0
    ? (org as any).galleryPhotos
    : [
        {
          url: "https://images.uniapply.com/uploads/college/image/500/2186/Medical_room_UA_210909_112215.JPG",
          title: "Medical Room / Infirmary",
          category: "Health Care"
        },
        {
          url: "https://images.uniapply.com/uploads/college/image/500/2186/Activity_room_UA_210909_112055.jpg",
          title: "Activity & Play Room",
          category: "Early Years"
        },
        {
          url: "https://images.uniapply.com/uploads/college/image/500/2186/Classroom_1_UA_210909_112131.jpg",
          title: "Smart Classroom",
          category: "Academics"
        },
        {
          url: "https://images.uniapply.com/uploads/college/image/500/2186/Library_UA_210909_112346.jpg",
          title: "Library & Reading Corner",
          category: "Learning Hub"
        },
        {
          url: org.bannerImage || "https://images.uniapply.com/uploads/college/image/500/2186/Building_UA_210909_112120.JPG",
          title: "Main Campus Building",
          category: "Infrastructure"
        },
        {
          url: "https://images.unsplash.com/photo-1576671081837-49000212a370?auto=format&fit=crop&w=600&q=80",
          title: "Science & Innovation Lab",
          category: "STEM Labs"
        },
        {
          url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80",
          title: "Robotics & AI Studio",
          category: "Tech Suite"
        },
        {
          url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80",
          title: "Sports Arena & Gym",
          category: "Fitness"
        }
      ];

  return (
    <PageTransition>
      <div className="bg-slate-100 text-slate-800 font-sans antialiased pb-28">



        {/* ── HERO BANNER WITH OVERLAPPING SCHOOL CARD ────────────────────────── */}
        <div className="relative bg-slate-900 text-white">
          <div className="h-60 sm:h-72 w-full overflow-hidden relative">
            <div className="absolute top-3 left-3 z-20 bg-black/60 backdrop-blur-xs text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-xs">
              <Eye className="w-3.5 h-3.5" />
              <span>46284 Views</span>
            </div>
            <button
              onClick={handleNativeShare}
              className="lg:hidden absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/90 text-slate-800 flex items-center justify-center shadow-md"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <img
              src={org.bannerImage || "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1600&q=80"}
              alt="Campus Banner"
              className="w-full h-full object-cover opacity-35"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/30"></div>
          </div>

          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="relative -mt-16 sm:-mt-20 bg-white text-slate-800 rounded-2xl sm:rounded-3xl shadow-xl border border-slate-200 p-4 sm:p-7 max-w-full overflow-hidden">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                
                {/* Left School Info */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 sm:gap-5 min-w-0 flex-1">
                  <img
                    src={org.logo || "https://images.uniapply.com/uploads/college/image/logo/2186/KRMGS_L_220920_174918.jpg"}
                    alt={org.name}
                    className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl border-2 border-slate-100 bg-white p-1 object-contain shadow-xs shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-slate-900 break-words leading-tight">
                        {org.name} <span className="text-slate-400 font-normal text-sm sm:text-lg">({(org as any).shortName || 'KRMGS'})</span>
                      </h1>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
                        <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" /> Verified Institution
                      </span>
                    </div>
                    <p className="text-slate-500 text-xs sm:text-sm mt-1 flex items-center gap-1.5 flex-wrap font-medium break-words">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span className="break-words">{org.address || `${(org as any).villageTownCity || org.city}${(org as any).block ? `, Block: ${(org as any).block}` : ''}${(org as any).district ? `, Dist: ${(org as any).district}` : ''}, ${org.state} - ${org.pincode}`}</span>
                    </p>
                    
                    {/* Quick Metadata Chips */}
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2.5 text-[10px] sm:text-xs font-medium">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md border border-slate-200 font-semibold">
                        <strong>Board:</strong> {org.board || 'IB (International Baccalaureate)'}
                      </span>
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md border border-slate-200 font-semibold">
                        <strong>UDISE Code:</strong> {(org as any).udiseCode || '07090300124'}
                      </span>
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md border border-slate-200">
                        <strong>Format:</strong> Day School (Co-Ed)
                      </span>
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md border border-slate-200">
                        <strong>Session:</strong> {(org as any).admissionStatus ? '2026-2027 ' + (org as any).admissionStatus : '2027-2028 Admissions Open'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Ratings & Actions */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-3.5 border-t lg:border-t-0 pt-3.5 lg:pt-0 border-slate-100 w-full lg:w-auto">
                  <div className="flex items-center gap-2.5">
                    <div className="bg-amber-500 text-white font-extrabold text-sm sm:text-base px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-2xs">
                      <span>{org.rating || '4.8'}</span>
                      <Star className="w-3.5 h-3.5 fill-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-slate-800">{org.reviews || 142} Reviews</p>
                      <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium">Ranked #2 in City</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <Link
                      href={`/edu-network/organisation/school/${org.id}/vacancy`}
                      className="flex-1 sm:flex-initial px-3 py-2 bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                      <Briefcase className="w-3.5 h-3.5 text-rose-600" />
                      <span>Careers ({jobsList.length})</span>
                    </Link>
                    <button
                      onClick={handleNativeShare}
                      className="px-3 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                    >
                      <Share2 className="w-3.5 h-3.5 text-blue-600" />
                      <span>Share</span>
                    </button>
                    <button
                      onClick={() => setIsNotified(!isNotified)}
                      className={`px-3 py-2 border rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                        isNotified ? 'bg-blue-50 border-blue-200 text-blue-600' : 'border-slate-300 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <Bell className={`w-3.5 h-3.5 ${isNotified ? 'fill-blue-600' : ''}`} />
                      <span>{isNotified ? 'Notified' : 'Notify'}</span>
                    </button>
                    <button
                      onClick={() => setIsCallbackModalOpen(true)}
                      className="flex-1 sm:flex-initial px-4 py-2 bg-[#1e3a8a] hover:bg-blue-900 text-white rounded-xl text-xs font-black transition shadow-md text-center"
                    >
                      Enquire Now
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* ── 2-COLUMN MAIN CONTENT (SIDEBAR + SECTIONS) ──────────────────────── */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            
            {/* ── LEFT SIDEBAR (EXACT UNiAPPLY NAVIGATION & WIDGETS) ──────────── */}
            <aside className="lg:col-span-1 space-y-4 lg:sticky lg:top-20 lg:max-h-[calc(100vh-5.5rem)] lg:overflow-y-auto lg:pr-1.5 lg:overscroll-contain pb-8 scrollbar-thin scrollbar-thumb-slate-300 hover:scrollbar-thumb-slate-400">
              
              {/* ── USER REQUESTED WIDGET 1: CSEEL VERIFIED CAMPUS CARD ── */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-3.5">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600 shrink-0">
                    <ShieldCheck className="w-4 h-4 text-cyan-600" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 leading-tight">CSEEL VERIFIED CAMPUS</h4>
                    <p className="text-[10px] text-slate-400 font-medium">Government & Board Certified</p>
                  </div>
                </div>

                <hr className="border-slate-100" />

                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                    <a
                      href={org.website || "https://greenwoodhighinternational-campus56.edu"}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-700 font-bold hover:underline truncate block text-[11px]"
                    >
                      {org.website || "https://greenwoodhighinternational-campus56.edu"}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <a href={`mailto:${org.email}`} className="text-slate-600 hover:text-slate-900 truncate block text-[11px]">
                      {org.email || "contact.campus56@greenwoodhighinternational.edu"}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    <a href={`tel:${org.phone}`} className="text-slate-700 font-bold text-[11px]">
                      {org.phone || "+91 80 2981056"}
                    </a>
                  </div>
                </div>

                <button
                  onClick={() => setIsCallbackModalOpen(true)}
                  className="w-full py-2.5 bg-[#002b4e] hover:bg-[#003b6d] text-white font-black text-xs rounded-xl shadow-xs transition-all text-center block"
                >
                  Send Official Inquiry
                </button>
              </div>

              {/* ── USER REQUESTED WIDGET 2: ACTIVE JOBS (INDEED PORTAL STYLE) ── */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    ACTIVE JOBS ({jobsList.length})
                  </h4>
                  <Link
                    href={`/edu-network/organisation/school/${org.id}/vacancy`}
                    className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-0.5"
                  >
                    <span>View All ({jobsList.length})</span>
                    <span>→</span>
                  </Link>
                </div>

                {jobsList.slice(0, 1).map((job) => (
                  <div key={job.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                    <div>
                      <h5 className="font-black text-xs text-slate-900 leading-snug">
                        {job.title}
                      </h5>
                      <p className="text-[11px] font-black text-emerald-600 mt-0.5">
                        {job.salary}
                      </p>
                    </div>
                    <Link
                      href={`/edu-network/organisation/school/${org.id}/vacancy`}
                      className="w-full py-1.5 bg-white hover:bg-slate-50 text-blue-600 border border-blue-200 hover:border-blue-400 font-bold text-xs rounded-lg shadow-2xs transition-all text-center block"
                    >
                      Apply on Indeed Portal →
                    </Link>
                  </div>
                ))}
              </div>

              {/* ── EXACT UNiAPPLY SECTIONS NAVIGATION MENU (IMAGE 2) ── */}
              <nav className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs" id="sidebarMenu">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-3 mb-2">School Sections</p>
                <ul className="space-y-1 text-xs font-semibold text-slate-600">
                  
                  <li>
                    <a href="#key_stats_tab" className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-[#1e3a8a] transition">
                      <ChartBar className="w-4 h-4 text-blue-600" />
                      <span>Key School Stats</span>
                    </a>
                  </li>
                  <li>
                    <a href="#fee_structure_tab" className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-[#1e3a8a] transition">
                      <Wallet className="w-4 h-4 text-emerald-600" />
                      <span>Fee Structure</span>
                    </a>
                  </li>
                  <li>
                    <a href="#academic_stats_tab" className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-[#1e3a8a] transition">
                      <GraduationCap className="w-4 h-4 text-indigo-600" />
                      <span>Academic Stats</span>
                    </a>
                  </li>
                  <li>
                    <a href="#admission_dates_tab" className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-[#1e3a8a] transition">
                      <Calendar className="w-4 h-4 text-amber-600" />
                      <span>Admission Dates</span>
                    </a>
                  </li>
                  <li>
                    <a href="#admission_criteria_tab" className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-[#1e3a8a] transition">
                      <FileText className="w-4 h-4 text-rose-600" />
                      <span>Admission Criteria & Eligibility</span>
                    </a>
                  </li>
                  <li>
                    <a href="#school_results_tab" className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-[#1e3a8a] transition">
                      <Trophy className="w-4 h-4 text-amber-500" />
                      <span>School Results</span>
                    </a>
                  </li>
                  <li>
                    <Link
                      href={`/edu-network/organisation/school/${org.id}/vacancy`}
                      className="flex items-center justify-between px-3 py-2 rounded-lg bg-rose-50 text-rose-700 font-bold hover:bg-rose-100 transition border border-rose-200"
                    >
                      <span className="flex items-center gap-2.5">
                        <Briefcase className="w-4 h-4 text-rose-600" />
                        <span>Careers & Vacancies</span>
                      </span>
                      <span className="text-[10px] bg-rose-600 text-white font-black px-1.5 py-0.5 rounded-full">
                        {jobsList.length} Open
                      </span>
                    </Link>
                  </li>
                  <li>
                    <a href="#stem_live_labs_tab" className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-cyan-50 text-cyan-800 font-bold border border-cyan-200">
                      <Microscope className="w-4 h-4 text-cyan-600" />
                      <span>STEM Live Labs & Innovation</span>
                    </a>
                  </li>
                  <li>
                    <a href="#facilities_tab" className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-[#1e3a8a] transition">
                      <Wand2 className="w-4 h-4 text-sky-600" />
                      <span>Facilities Matrix</span>
                    </a>
                  </li>
                  <li>
                    <a href="#insights_locked_tab" className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-[#1e3a8a] transition">
                      <span className="flex items-center gap-2.5">
                        <Lock className="w-4 h-4 text-amber-500" />
                        <span>Insights</span>
                      </span>
                      <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">Lock</span>
                    </a>
                  </li>
                  <li>
                    <a href="#gallery_tab" className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-[#1e3a8a] transition">
                      <ImageIcon className="w-4 h-4 text-indigo-600" />
                      <span>Gallery</span>
                    </a>
                  </li>
                  <li>
                    <a href="#video_gallery_tab" className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-red-50 text-red-600 font-bold">
                      <Video className="w-4 h-4 text-red-600" />
                      <span>Videos</span>
                    </a>
                  </li>
                  <li>
                    <a href="#address_tab" className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-[#1e3a8a] transition">
                      <MapPin className="w-4 h-4 text-rose-600" />
                      <span>Address & Contact</span>
                    </a>
                  </li>
                </ul>
              </nav>

              {/* ── FROM PRINCIPAL'S DESK ── */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs text-xs">
                <p className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-2">From Principal's Desk</p>
                <div className="flex items-center gap-2.5 mb-2">
                  <img
                    src={(org as any).principalPhoto || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80"} alt="Principal"
                    className="w-10 h-10 rounded-full object-cover border border-rose-400"
                  />
                  <div>
                    <p className="font-bold text-slate-800">{(org as any).principalName || 'Dr. Sunita Kapoor'}</p>
   <p className="text-[10px] text-slate-400 font-medium">{(org as any).principalDesignation || 'Principal (Ph.D, M.Ed)'}</p>
                  </div>
                </div>
                <p className="text-slate-600 italic leading-relaxed text-[11px] border-l-2 border-rose-500 pl-2">
                  "{(org as any).principalMessage || 'We inspire holistic global education by instilling critical inquiries, creativity, and empathy in every learner.'}"
                </p>
              </div>

            </aside>

            {/* ── RIGHT MAIN CONTENT ──────────────────────────────────────────── */}
            <div className="lg:col-span-3 space-y-8 min-w-0">
              
              

              {/* SECTION 2: Key Institutional Stats */}
              <section id="key_stats_tab" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs scroll-mt-20">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <ChartBar className="w-4 h-4 text-[#1e3a8a]" />
                    <span>Key School Stats</span>
                  </h2>
                  <button
                    onClick={() => alert(`Downloading official brochure of ${org.name}...`)}
                    className="text-xs font-bold text-[#1e3a8a] hover:underline flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Brochure</span>
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-3.5 bg-slate-50 border rounded-xl">
                    <span className="text-slate-400 block font-medium">Ownership</span>
                    <span className="text-sm font-bold text-slate-900">Private School</span>
                  </div>
                  <div className="p-3.5 bg-slate-50 border rounded-xl">
                    <span className="text-slate-400 block font-medium">Affiliated Board</span>
                    <span className="text-sm font-bold text-slate-900">{org.board || 'IB (International Baccalaureate)'}</span>
                  </div>
                  <div className="p-3.5 bg-slate-50 border rounded-xl">
                    <span className="text-slate-400 block font-medium">Year Established</span>
                    <span className="text-sm font-bold text-slate-900">{org.established || '2018'}</span>
                  </div>
                  <div className="p-3.5 bg-slate-50 border rounded-xl">
                    <span className="text-slate-400 block font-medium">Co-Ed Format</span>
                    <span className="text-sm font-bold text-slate-900">Co-Education</span>
                  </div>
                  <div className="p-3.5 bg-slate-50 border rounded-xl">
                    <span className="text-slate-400 block font-medium">Campus Area</span>
                    <span className="text-sm font-bold text-slate-900">{(org as any).campusAcreage || '5.0 Acres (Urban)'}</span>
                  </div>
                  <div className="p-3.5 bg-slate-50 border rounded-xl">
                    <span className="text-slate-400 block font-medium">Student-Faculty Ratio</span>
                    <span className="text-sm font-bold text-slate-900">{(org as any).studentFacultyRatio || '12 : 1'} (Delhi Avg: 22:1)</span>
                  </div>
                </div>
              </section>

              {/* SECTION 3: Fee Structure Details (INDIVIDUAL CLASSES) */}
              <section id="fee_structure_tab" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs scroll-mt-20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 mb-5 gap-3">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-[#1e3a8a]" />
                      <span>Fee Structure</span>
                    </h2>
                    <p className="text-xs text-slate-400">Individual class-wise breakdown for active session 2027-2028</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-slate-500">Select Class:</label>
                    <select
                      value={selectedFeeClass}
                      onChange={(e) => setSelectedFeeClass(e.target.value)}
                      className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-[#1e3a8a] outline-none"
                    >
                      <option value="nursery">Nursery</option>
                      <option value="lkg">LKG</option>
                      <option value="ukg">UKG</option>
                      <option value="class-1">Class 1</option>
                      <option value="class-2">Class 2</option>
                      <option value="class-3">Class 3</option>
                      <option value="class-4">Class 4</option>
                      <option value="class-5">Class 5</option>
                      <option value="class-6">Class 6</option>
                      <option value="class-7">Class 7</option>
                      <option value="class-8">Class 8</option>
                      <option value="class-9">Class 9</option>
                      <option value="class-10">Class 10</option>
                      <option value="class-11">Class 11</option>
                      <option value="class-12">Class 12</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5 text-xs">
                  <div className="p-4 border rounded-xl bg-slate-50/70">
                    <span className="text-slate-400 block uppercase font-bold tracking-wider text-[11px]">Total Cost for Fresh Admission</span>
                    <div className="text-2xl font-black text-slate-900 mt-0.5">
                      ₹{currentFee.totalFirstYear.toLocaleString()} <span className="text-xs text-slate-400 font-normal">/ first year</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Includes Registration, Admission, Tuition, Refundable Security & Annual Charges.</p>
                  </div>
                  <div className="p-4 border rounded-xl bg-slate-50/70">
                    <span className="text-slate-400 block uppercase font-bold tracking-wider text-[11px]">Estimated Monthly Average</span>
                    <div className="text-2xl font-black text-slate-900 mt-0.5">
                      ₹{currentFee.monthlyAvg.toLocaleString()} <span className="text-xs text-slate-400 font-normal">/ month basis</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Calculated without one-time non-recurring admission deposits.</p>
                  </div>
                </div>

                <div className="overflow-x-auto border rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-100 text-slate-800 uppercase font-bold">
                      <tr>
                        <th className="p-3">Fee Type</th>
                        <th className="p-3 text-right">Amount</th>
                        <th className="p-3">Frequency</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y text-slate-700">
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-semibold text-slate-900">Registration Fees</td>
                        <td className="p-3 text-right font-bold">₹1,000</td>
                        <td className="p-3 text-slate-500">One-time</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-semibold text-slate-900">Admission Fees</td>
                        <td className="p-3 text-right font-bold">₹{currentFee.admission.toLocaleString()}</td>
                        <td className="p-3 text-slate-500">One-time</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-semibold text-slate-900">Tuition Fees</td>
                        <td className="p-3 text-right font-bold">₹{currentFee.tuitionQuarterly.toLocaleString()}</td>
                        <td className="p-3 text-slate-500">Quarterly (x 4)</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-semibold text-slate-900">Security Deposit (Refundable)</td>
                        <td className="p-3 text-right font-bold">₹{currentFee.security.toLocaleString()}</td>
                        <td className="p-3 text-slate-500">One-time</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-semibold text-slate-900">Annual Academic Logistics</td>
                        <td className="p-3 text-right font-bold">₹{currentFee.annual.toLocaleString()}</td>
                        <td className="p-3 text-slate-500">Annually</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-semibold text-slate-900">Development Fund</td>
                        <td className="p-3 text-right font-bold">₹{currentFee.dev.toLocaleString()}</td>
                        <td className="p-3 text-slate-500">Annually</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* SECTION 4: Academic Stats (IMAGE 4) */}
              <section id="academic_stats_tab" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs scroll-mt-20">
                <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 mb-5 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-[#1e3a8a]" />
                  <span>Academic Stats</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs mb-6">
                  <div>
                    <span className="text-slate-400 block font-medium">Classes Offered</span>
                    <span className="text-base font-extrabold text-slate-900">Pre-K - K2 / Nursery to 12</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Language of Instruction</span>
                    <span className="text-base font-extrabold text-slate-900">English</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Academic Session</span>
                    <span className="text-base font-extrabold text-slate-900">April to March</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs pt-4 border-t border-slate-100">
                  <div>
                    <span className="text-slate-400 block font-medium">Student Faculty Ratio ⓘ</span>
                    <span className="text-2xl font-black text-slate-900">13:1</span>
                    <p className="text-[11px] text-slate-500 mt-0.5">Delhi NCR Ratio : <span className="text-rose-500 font-bold">20:1</span></p>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium mb-1">Total Faculty ⓘ</span>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-slate-600">
                        <span>City Average</span>
                        <span className="font-bold">25</span>
                      </div>
                      <div className="h-1.5 bg-emerald-500 rounded-full w-full"></div>
                      <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1">
                        <span>This School</span>
                        <span className="font-bold text-amber-600">27</span>
                      </div>
                      <div className="h-1.5 bg-amber-500 rounded-full w-[95%]"></div>
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">School Format</span>
                    <span className="text-base font-extrabold text-slate-900">Day School</span>
                  </div>
                </div>
              </section>

              {/* SECTION 5: Admission Dates */}
              <section id="admission_dates_tab" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs scroll-mt-20">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#1e3a8a]" />
                    <span>Admission Dates & Schedule</span>
                  </h2>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                    Active Session 2027-2028
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-3.5 bg-slate-50 border rounded-xl">
                    <span className="text-slate-400 block font-medium">Registration Start Date</span>
                    <span className="text-sm font-bold text-slate-900">{(org as any).admissionFormStartDate || '15 November 2026'}</span>
                  </div>
                  <div className="p-3.5 bg-slate-50 border rounded-xl">
                    <span className="text-slate-400 block font-medium">Registration Last Date</span>
                    <span className="text-sm font-bold text-slate-900">{(org as any).admissionFormEndDate || '31 January 2027'}</span>
                  </div>
                  <div className="p-3.5 bg-slate-50 border rounded-xl">
                    <span className="text-slate-400 block font-medium">Merit List Announcement</span>
                    <span className="text-sm font-bold text-slate-900">{(org as any).meritListDate || '15 February 2027'}</span>
                  </div>
                </div>
              </section>

              {/* SECTION 6: Admission Criteria & Eligibility (IMAGE 3) */}
              <section id="admission_criteria_tab" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs scroll-mt-20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 mb-4 gap-3">
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#1e3a8a]" />
                    <span>Admission Criteria & Eligibility</span>
                  </h2>
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedAdmissionSession}
                      onChange={(e) => setSelectedAdmissionSession(e.target.value)}
                      className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 outline-none"
                    >
                      <option value="2027-2028">2027-2028</option>
                      <option value="2026-2027">2026-2027</option>
                    </select>
                    <select
                      value={selectedEligibilityGrade}
                      onChange={(e) => setSelectedEligibilityGrade(e.target.value)}
                      className="text-xs font-semibold bg-[#1e3a8a] text-white rounded-lg p-2 outline-none"
                    >
                      <option value="Pre-K">Pre-K</option>
                      <option value="K1">K1</option>
                      <option value="K2">K2</option>
                    </select>
                  </div>
                </div>

                <p className="text-xs font-bold text-slate-700 mb-3">Documents required at the time of application/admission</p>

                {/* Exact 12 Documents with Checkmarks matching Image 3 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-6 text-xs text-slate-700 mb-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Transfer Certificate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Birth Certificate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Photograph - Child</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Photograph - Parents/Guardian</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Marksheet/Report card (if applicable)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Medical Reports</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Character Certificate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Valid Passport</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Aadhar Card - Child</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Achievement Certificates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Immunization Certificate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Pancard - Parents</span>
                  </div>
                </div>

                {/* Additional Notes matching Image 3 */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
                  <p className="font-bold text-slate-800 mb-1">Additional Notes</p>
                  <p>Mandatory Documents required:</p>
                  <p>• One recent passport size photograph</p>
                  <p>• Copy of Birth Certificate</p>
                  <p>• Academic records/transcripts for the last 1 or 2 years (for Grades K1 & K2)</p>
                  <p>• Copy of visa/permit (if the student is not a citizen of India)</p>
                  <p>• Copy of Immunization Record</p>
                  <p>• Documentation needed in case of any special needs.</p>
                </div>
              </section>

              {/* SECTION 7: School Academic Results & Board Performance */}
              <section id="school_results_tab" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs scroll-mt-20 space-y-6">
                
                {/* Header & Upload Banner Action */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                      <Trophy className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-base font-black text-slate-900 leading-tight">
                        School Academic Results &amp; Board Performance
                      </h2>
                      <p className="text-xs text-slate-500">
                        Class 10th &amp; Class 12th Board Toppers, State Percentiles &amp; Academic Honors
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsUploadBannerModalOpen(true)}
                    className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-amber-700" />
                    <span>Upload Result Banner</span>
                  </button>
                </div>

                {/* Key Summary Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-center">
                  <div className="p-4 border border-slate-100 rounded-2xl bg-slate-50/80">
                    <span className="text-slate-400 block font-medium">Board Pass Rate</span>
                    <span className="text-2xl font-black text-emerald-600">100%</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">Consecutive 5 Years</p>
                  </div>
                  <div className="p-4 border border-slate-100 rounded-2xl bg-slate-50/80">
                    <span className="text-slate-400 block font-medium">Top High Score</span>
                    <span className="text-2xl font-black text-slate-900">99.2%</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">IB DP / CBSE Class 12</p>
                  </div>
                  <div className="p-4 border border-slate-100 rounded-2xl bg-slate-50/80">
                    <span className="text-slate-400 block font-medium">School Batch Average</span>
                    <span className="text-2xl font-black text-blue-600">88.6%</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">National Percentile: Top 2%</p>
                  </div>
                </div>

                {/* ── CURRENT YEAR RESULT BANNER (2025-26) ── */}
                <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-5 sm:p-6 text-white shadow-md relative overflow-hidden space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/15 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-amber-400 text-slate-950 text-[10px] font-black uppercase rounded-full tracking-wider">
                        Current Year • 2025-26
                      </span>
                      <h3 className="font-black text-sm sm:text-base text-white">
                        Outstanding Board Achievers &amp; Top Scorers
                      </h3>
                    </div>
                    
                    {/* Class Selector Tabs */}
                    <div className="flex items-center gap-1.5 bg-white/10 p-1 rounded-xl">
                      <button
                        onClick={() => setSelectedResultClass('12')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                          selectedResultClass === '12'
                            ? 'bg-white text-blue-950 font-black shadow-xs'
                            : 'text-white/80 hover:text-white'
                        }`}
                      >
                        Class 12th (Senior Secondary)
                      </button>
                      <button
                        onClick={() => setSelectedResultClass('10')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                          selectedResultClass === '10'
                            ? 'bg-white text-blue-950 font-black shadow-xs'
                            : 'text-white/80 hover:text-white'
                        }`}
                      >
                        Class 10th (Secondary)
                      </button>
                    </div>
                  </div>

                  {/* Toppers Cards Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    {(selectedResultClass === '12' ? [
                      { name: 'Ananya Sharma', score: '99.2%', stream: 'Science (PCM + CS)', rank: 'School Topper / 1st Rank', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80' },
                      { name: 'Kabir Malhotra', score: '98.8%', stream: 'Commerce with Math', rank: 'Commerce Topper', photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&h=200&q=80' },
                      { name: 'Rhea Sen', score: '98.4%', stream: 'Humanities & Psychology', rank: 'Arts Topper', photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&h=200&q=80' },
                      { name: 'Aarav Patel', score: '97.6%', stream: 'Science (PCB + Biotech)', rank: 'Biology Topper', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80' }
                    ] : [
                      { name: 'Diya Verma', score: '99.4%', stream: 'All Subjects (Science+Math)', rank: '10th Board Overall Topper', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80' },
                      { name: 'Rohan Mehra', score: '98.6%', stream: 'All Subjects', rank: '2nd Position', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80' },
                      { name: 'Ishita Gupta', score: '98.2%', stream: 'All Subjects', rank: '3rd Position', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&h=200&q=80' },
                      { name: 'Advait Joshi', score: '97.8%', stream: 'All Subjects', rank: '4th Position', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&h=200&q=80' }
                    ]).map((student, idx) => (
                      <div key={idx} className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15 text-center space-y-2 group hover:bg-white/20 transition">
                        <div className="relative w-16 h-16 mx-auto">
                          <img
                            src={student.photo}
                            alt={student.name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-amber-400 shadow-md group-hover:scale-105 transition-transform"
                          />
                          <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] flex items-center justify-center shadow">
                            #{idx + 1}
                          </span>
                        </div>
                        <div>
                          <div className="text-base font-black text-amber-300">
                            {student.score}
                          </div>
                          <h4 className="font-bold text-xs text-white truncate">{student.name}</h4>
                          <p className="text-[10px] text-blue-200 line-clamp-1">{student.stream}</p>
                          <span className="inline-block text-[9px] bg-white/20 text-white font-medium px-2 py-0.5 rounded-full mt-1">
                            {student.rank}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── COLLAPSIBLE YEAR-WISE RESULTS ARCHIVE ── */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setIsResultsArchiveOpen(!isResultsArchiveOpen)}
                    className="w-full p-4 bg-slate-50 hover:bg-slate-100 transition flex items-center justify-between text-xs font-black text-slate-800"
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span>View Year-Wise Results Archive (2024-25, 2023-24, 2022-23)</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">
                        3 Past Sessions
                      </span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isResultsArchiveOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isResultsArchiveOpen && (
                    <div className="p-5 bg-white space-y-4 border-t border-slate-200 animate-in fade-in duration-200">
                      {[
                        { year: '2024 - 2025', pass: '100%', top12: '99.0% (Science)', top10: '99.2% (CBSE)', toppers: ['Meera Nair (99.0%)', 'Varun Kapoor (98.6%)', 'Tara Sen (98.2%)'] },
                        { year: '2023 - 2024', pass: '100%', top12: '98.8% (Commerce)', top10: '98.8% (CBSE)', toppers: ['Siddharth Rao (98.8%)', 'Kriti Jain (98.4%)', 'Kunal Shah (98.0%)'] },
                        { year: '2022 - 2023', pass: '99.8%', top12: '98.4% (Science)', top10: '98.5% (CBSE)', toppers: ['Aryaman Roy (98.4%)', 'Pooja Hegde (98.1%)', 'Nikhil Garg (97.9%)'] }
                      ].map((item, idx) => (
                        <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2.5 text-xs">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <span className="font-black text-slate-900 text-sm">{item.year} Academic Session</span>
                            <div className="flex items-center gap-2">
                              <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[11px]">Pass Rate: {item.pass}</span>
                              <span className="bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded text-[11px]">Class 12th Top: {item.top12}</span>
                              <span className="bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded text-[11px]">Class 10th Top: {item.top10}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap pt-1 text-[11px] text-slate-600">
                            <span className="font-bold text-slate-400">Featured Toppers:</span>
                            {item.toppers.map((top, tIdx) => (
                              <span key={tIdx} className="bg-white border border-slate-200 px-2 py-0.5 rounded-md font-semibold text-slate-800">
                                🎖 {top}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </section>

              


              {/* ── USER REQUESTED SPECIAL SECTION: STEM LIVE LAB & INNOVATION ── */}
              <section id="stem_live_labs_tab" className="bg-gradient-to-br from-slate-50 via-sky-50/40 to-slate-100 text-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200/80 scroll-mt-20 relative overflow-hidden">
                {/* Subtle ambient decorative glow */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

                {/* Header Area */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 mb-5 gap-3 relative z-10">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="w-8 h-8 rounded-xl bg-cyan-100/70 border border-cyan-300 flex items-center justify-center text-cyan-700">
                        <Microscope className="w-4 h-4" />
                      </div>
                      <h2 className="text-base sm:text-lg font-black tracking-tight text-slate-900">
                        STEM Live Lab &amp; Innovation Ecosystem
                      </h2>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        CSEEL Live Practical Ready
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Advanced experiential infrastructure for hands-on learning, scientific prototyping, and experiential learning.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-cyan-100/60 border border-cyan-200 text-cyan-800">
                      12 Specialized Labs
                    </span>
                  </div>
                </div>

                {/* Grid Cards (Compact & Light) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 relative z-10 text-xs">
                  
                  {/* 1. Science Experiential Lab */}
                  <div className="p-3 rounded-xl bg-white border border-emerald-300 shadow-2xs hover:shadow-xs transition space-y-1 relative group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-emerald-500 text-white flex items-center justify-center font-bold">
                          <Beaker className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 px-1.5 py-0.5 rounded uppercase">
                          Active Verified
                        </span>
                      </div>
                      <span className="text-slate-400 p-1 rounded-md" title="NEP-2020 Hands-on">
                        <Info className="w-3.5 h-3.5 text-emerald-600" />
                      </span>
                    </div>
                    <h3 className="font-bold text-xs text-slate-900 pt-0.5">Science Experiential Lab</h3>
                    <p className="text-[11px] text-slate-600 leading-snug line-clamp-2">
                      NEP 2020 experiential practical kits with DIY apparatus for hands-on inquiry and concept mastery.
                    </p>
                  </div>

                  {/* 2. Composite Science Lab */}
                  <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-cyan-400 hover:shadow-xs transition space-y-1 relative group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold border border-cyan-200">
                          <Microscope className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[9px] font-semibold text-emerald-700 flex items-center gap-0.5">
                          <CheckCircle2 className="w-2.5 h-2.5" /> Available
                        </span>
                      </div>
                    </div>
                    <h3 className="font-bold text-xs text-slate-900 pt-0.5">Composite Science Lab</h3>
                    <p className="text-[11px] text-slate-600 leading-snug line-clamp-2">
                      Integrated Physics, Chemistry &amp; Biology laboratory stations with certified safety hoods.
                    </p>
                  </div>

                  {/* 3. Atal Tinkering Lab (ATL) */}
                  <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-amber-400 hover:shadow-xs transition space-y-1 relative group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center font-bold border border-amber-200">
                          <Sparkles className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[9px] font-semibold text-emerald-700 flex items-center gap-0.5">
                          <CheckCircle2 className="w-2.5 h-2.5" /> Available
                        </span>
                      </div>
                    </div>
                    <h3 className="font-bold text-xs text-slate-900 pt-0.5">Atal Tinkering Lab (ATL)</h3>
                    <p className="text-[11px] text-slate-600 leading-snug line-clamp-2">
                      NITI Aayog aligned design-thinking hub for inventing, tinkering, and building prototypes.
                    </p>
                  </div>

                  {/* 4. Robotics & IoT Lab */}
                  <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-purple-400 hover:shadow-xs transition space-y-1 relative group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-purple-100 text-purple-700 flex items-center justify-center font-bold border border-purple-200">
                          <Bot className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[9px] font-semibold text-emerald-700 flex items-center gap-0.5">
                          <CheckCircle2 className="w-2.5 h-2.5" /> Available
                        </span>
                      </div>
                    </div>
                    <h3 className="font-bold text-xs text-slate-900 pt-0.5">Robotics &amp; IoT Lab</h3>
                    <p className="text-[11px] text-slate-600 leading-snug line-clamp-2">
                      Programmable microcontrollers, sensor kits, drone mechanics, and automated robotics arena.
                    </p>
                  </div>

                  {/* 5. AI & Machine Learning Lab */}
                  <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-blue-400 hover:shadow-xs transition space-y-1 relative group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center font-bold border border-blue-200">
                          <Laptop className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[9px] font-semibold text-emerald-700 flex items-center gap-0.5">
                          <CheckCircle2 className="w-2.5 h-2.5" /> Available
                        </span>
                      </div>
                    </div>
                    <h3 className="font-bold text-xs text-slate-900 pt-0.5">AI &amp; Machine Learning Lab</h3>
                    <p className="text-[11px] text-slate-600 leading-snug line-clamp-2">
                      High-performance computational workstations with Python, Computer Vision, and Neural Nets.
                    </p>
                  </div>

                  {/* 6. AR / VR Immersive Pods */}
                  <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-rose-400 hover:shadow-xs transition space-y-1 relative group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-rose-100 text-rose-700 flex items-center justify-center font-bold border border-rose-200">
                          <Maximize2 className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[9px] font-semibold text-emerald-700 flex items-center gap-0.5">
                          <CheckCircle2 className="w-2.5 h-2.5" /> Available
                        </span>
                      </div>
                    </div>
                    <h3 className="font-bold text-xs text-slate-900 pt-0.5">AR / VR Immersive Pods</h3>
                    <p className="text-[11px] text-slate-600 leading-snug line-clamp-2">
                      3D holographic headsets for virtual biology dissections, planetary walks, and molecular dives.
                    </p>
                  </div>

                  {/* 7. Language & Phonetics Lab */}
                  <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-sky-400 hover:shadow-xs transition space-y-1 relative group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-sky-100 text-sky-700 flex items-center justify-center font-bold border border-sky-200">
                          <BookOpen className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[9px] font-semibold text-emerald-700 flex items-center gap-0.5">
                          <CheckCircle2 className="w-2.5 h-2.5" /> Available
                        </span>
                      </div>
                    </div>
                    <h3 className="font-bold text-xs text-slate-900 pt-0.5">Language &amp; Phonetics Lab</h3>
                    <p className="text-[11px] text-slate-600 leading-snug line-clamp-2">
                      Acoustic headphone stations for English accent mastery, French, German &amp; Spanish phonology.
                    </p>
                  </div>

                  {/* 8. Astronomy & Space Observatory */}
                  <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-indigo-400 hover:shadow-xs transition space-y-1 relative group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold border border-indigo-200">
                          <Eye className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[9px] font-semibold text-emerald-700 flex items-center gap-0.5">
                          <CheckCircle2 className="w-2.5 h-2.5" /> Available
                        </span>
                      </div>
                    </div>
                    <h3 className="font-bold text-xs text-slate-900 pt-0.5">Astronomy &amp; Space Observatory</h3>
                    <p className="text-[11px] text-slate-600 leading-snug line-clamp-2">
                      Rooftop motorized astronomical telescopes for celestial tracking, lunar phases, and astrophysics.
                    </p>
                  </div>

                  {/* 9. Mathematics Activity Lab */}
                  <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-amber-400 hover:shadow-xs transition space-y-1 relative group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center font-bold border border-amber-200">
                          <Scale className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[9px] font-semibold text-emerald-700 flex items-center gap-0.5">
                          <CheckCircle2 className="w-2.5 h-2.5" /> Available
                        </span>
                      </div>
                    </div>
                    <h3 className="font-bold text-xs text-slate-900 pt-0.5">Mathematics Activity Lab</h3>
                    <p className="text-[11px] text-slate-600 leading-snug line-clamp-2">
                      Tactile 3D geometrical manipulatives, Vedic math apparatus, and probability experimental tools.
                    </p>
                  </div>

                  {/* 10. 3D Printing & CAD Studio */}
                  <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-teal-400 hover:shadow-xs transition space-y-1 relative group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-teal-100 text-teal-700 flex items-center justify-center font-bold border border-teal-200">
                          <Wand2 className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[9px] font-semibold text-emerald-700 flex items-center gap-0.5">
                          <CheckCircle2 className="w-2.5 h-2.5" /> Available
                        </span>
                      </div>
                    </div>
                    <h3 className="font-bold text-xs text-slate-900 pt-0.5">3D Printing &amp; CAD Studio</h3>
                    <p className="text-[11px] text-slate-600 leading-snug line-clamp-2">
                      Dual-extruder filament 3D printers, laser engravers, and solid modeling engineering suites.
                    </p>
                  </div>

                  {/* 11. Bio-Tech & Hydroponics Unit */}
                  <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-lime-500 hover:shadow-xs transition space-y-1 relative group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-lime-100 text-lime-800 flex items-center justify-center font-bold border border-lime-300">
                          <Sparkles className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[9px] font-semibold text-emerald-700 flex items-center gap-0.5">
                          <CheckCircle2 className="w-2.5 h-2.5" /> Available
                        </span>
                      </div>
                    </div>
                    <h3 className="font-bold text-xs text-slate-900 pt-0.5">Bio-Tech &amp; Hydroponics Unit</h3>
                    <p className="text-[11px] text-slate-600 leading-snug line-clamp-2">
                      Soil-less plant nutrition chambers, microbial culture stations, and DNA extraction toolkits.
                    </p>
                  </div>

                  {/* 12. Coding & Cyber-Security Suite */}
                  <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-orange-400 hover:shadow-xs transition space-y-1 relative group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-orange-100 text-orange-700 flex items-center justify-center font-bold border border-orange-200">
                          <ShieldCheck className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[9px] font-semibold text-emerald-700 flex items-center gap-0.5">
                          <CheckCircle2 className="w-2.5 h-2.5" /> Available
                        </span>
                      </div>
                    </div>
                    <h3 className="font-bold text-xs text-slate-900 pt-0.5">Coding &amp; Cyber-Security Suite</h3>
                    <p className="text-[11px] text-slate-600 leading-snug line-clamp-2">
                      Linux sandboxes, network simulation racks, cloud containers, and algorithmic challenge decks.
                    </p>
                  </div>

                </div>
              </section>

              {/* SECTION 9: Facilities Matrix Breakdown (EXACT IMAGE 1) */}
              <section id="facilities_tab" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs scroll-mt-20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 mb-6 gap-3">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Wand2 className="w-5 h-5 text-[#1e3a8a]" />
                    <span>Facilities</span>
                  </h2>
                  
                  {/* Legend matching Image 1 */}
                  <div className="flex items-center gap-4 text-xs font-semibold">
                    <span className="text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Available
                    </span>
                    <span className="text-rose-600 flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5 text-rose-500" /> Not Available
                    </span>
                    <span className="text-slate-500 flex items-center gap-1">
                      <HelpIcon className="w-3.5 h-3.5 text-slate-400" /> Information Not Available
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 text-xs">
                  
                  {/* Left Column: Progress Bars matching Image 1 */}
                  <div className="lg:col-span-1 space-y-4 border-r border-slate-100 pr-4">
                    <div>
                      <div className="flex justify-between text-[11px] font-bold text-slate-700">
                        <span>STEM Live Labs (12/12)</span>
                        <span className="text-emerald-600 font-black">100%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] font-bold text-slate-700">
                        <span>All Facilities (34/51)</span>
                        <span>57%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-purple-600 rounded-full" style={{ width: '57%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] font-bold text-slate-700">
                        <span>Class (2/3)</span>
                        <span className="text-rose-500">67%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-rose-500 rounded-full" style={{ width: '67%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] font-bold text-slate-700">
                        <span>Boarding (0/2)</span>
                        <span className="text-blue-500">0%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: '0%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] font-bold text-slate-700">
                        <span>Infrastructure (3/4)</span>
                        <span className="text-emerald-600">75%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] font-bold text-slate-700">
                        <span>Safety and Security (3/3)</span>
                        <span className="text-amber-500">100%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] font-bold text-slate-700">
                        <span>Advanced Facilities (3/5)</span>
                        <span className="text-purple-600">60%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] font-bold text-slate-700">
                        <span>Extra Curricular (6/7)</span>
                        <span className="text-orange-500">86%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-orange-500 rounded-full" style={{ width: '86%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] font-bold text-slate-700">
                        <span>Sports and Fitness (2/9)</span>
                        <span className="text-blue-700">23%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-blue-700 rounded-full" style={{ width: '23%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] font-bold text-slate-700">
                        <span>Lab (1/3)</span>
                        <span className="text-sky-500">34%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-sky-500 rounded-full" style={{ width: '34%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] font-bold text-slate-700">
                        <span>Disabled Friendly (2/3)</span>
                        <span className="text-teal-600">67%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-teal-500 rounded-full" style={{ width: '67%' }}></div>
                      </div>
                    </div>
                  </div>

                  {/* Right 3 Columns: Categorical Checklists matching Image 1 */}
                  <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
                    
                    {/* Column 1 */}
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-black text-slate-900 mb-2.5">Class</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-slate-700"><XCircle className="w-4 h-4 text-rose-500 shrink-0" /><span>AC Classes</span></div>
                          <div className="flex items-center gap-2 text-slate-700"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /><span>Smart Classes</span></div>
                          <div className="flex items-center gap-2 text-slate-700"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /><span>Wifi</span></div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-black text-slate-900 mb-2.5">Advanced Facilities</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-slate-700"><XCircle className="w-4 h-4 text-rose-500 shrink-0" /><span>Alumni Association</span></div>
                          <div className="flex items-center gap-2 text-slate-700"><XCircle className="w-4 h-4 text-rose-500 shrink-0" /><span>Day care</span></div>
                          <div className="flex items-center gap-2 text-slate-700"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /><span>Meals</span></div>
                          <div className="flex items-center gap-2 text-slate-700"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /><span>Medical Room</span></div>
                          <div className="flex items-center gap-2 text-slate-700"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /><span>Transportation</span></div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-black text-slate-900 mb-2.5">Disabled Friendly</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-slate-700"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /><span>Ramps</span></div>
                          <div className="flex items-center gap-2 text-slate-700"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /><span>Washrooms</span></div>
                          <div className="flex items-center gap-2 text-slate-700"><XCircle className="w-4 h-4 text-rose-500 shrink-0" /><span>Elevators</span></div>
                        </div>
                      </div>
                    </div>

                    {/* Column 2 */}
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-black text-slate-900 mb-2.5">Boarding</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-slate-700"><XCircle className="w-4 h-4 text-rose-500 shrink-0" /><span>Boys Hostel</span></div>
                          <div className="flex items-center gap-2 text-slate-700"><XCircle className="w-4 h-4 text-rose-500 shrink-0" /><span>Girls Hostel</span></div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-black text-slate-900 mb-2.5">Extra Curricular</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-slate-700"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /><span>Art and Craft</span></div>
                          <div className="flex items-center gap-2 text-slate-700"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /><span>Dance</span></div>
                          <div className="flex items-center gap-2 text-slate-700"><XCircle className="w-4 h-4 text-rose-500 shrink-0" /><span>Debate</span></div>
                          <div className="flex items-center gap-2 text-slate-700"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /><span>Drama</span></div>
                          <div className="flex items-center gap-2 text-slate-700"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /><span>Gardening</span></div>
                          <div className="flex items-center gap-2 text-slate-700"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /><span>Music</span></div>
                          <div className="flex items-center gap-2 text-slate-700"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /><span>Picnics and excursion</span></div>
                        </div>
                      </div>
                    </div>

                    {/* Column 3 */}
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-black text-slate-900 mb-2.5">Infrastructure</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-slate-700"><XCircle className="w-4 h-4 text-rose-500 shrink-0" /><span>Auditorium/Media Room</span></div>
                          <div className="flex items-center gap-2 text-slate-700"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /><span>Cafeteria/Canteen</span></div>
                          <div className="flex items-center gap-2 text-slate-700"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /><span>Library/Reading Room</span></div>
                          <div className="flex items-center gap-2 text-slate-700"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /><span>Playground</span></div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-black text-slate-900 mb-2.5">Safety and Security</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-slate-700"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /><span>CCTV</span></div>
                          <div className="flex items-center gap-2 text-slate-700"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /><span>GPS Bus Tracking App</span></div>
                          <div className="flex items-center gap-2 text-slate-700"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /><span>Student Tracking App</span></div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-black text-slate-900 mb-2.5">Sports and Fitness</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-slate-700"><XCircle className="w-4 h-4 text-rose-500 shrink-0" /><span>Skating</span></div>
                          <div className="flex items-center gap-2 text-slate-700"><XCircle className="w-4 h-4 text-rose-500 shrink-0" /><span>Horse Riding</span></div>
                          <div className="flex items-center gap-2 text-slate-700"><XCircle className="w-4 h-4 text-rose-500 shrink-0" /><span>Gym</span></div>
                          <div className="flex items-center gap-2 text-slate-700"><XCircle className="w-4 h-4 text-rose-500 shrink-0" /><span>Indoor Sports</span></div>
                          <div className="flex items-center gap-2 text-slate-700"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /><span>Outdoor Sports</span></div>
                          <div className="flex items-center gap-2 text-slate-700"><XCircle className="w-4 h-4 text-rose-500 shrink-0" /><span>Swimming Pool</span></div>
                          <div className="flex items-center gap-2 text-slate-700"><XCircle className="w-4 h-4 text-rose-500 shrink-0" /><span>Karate</span></div>
                          <div className="flex items-center gap-2 text-slate-700"><XCircle className="w-4 h-4 text-rose-500 shrink-0" /><span>Taekwondo</span></div>
                          <div className="flex items-center gap-2 text-slate-700"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /><span>Yoga</span></div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-black text-slate-900 mb-2.5">Lab & Innovation Hubs</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-slate-700"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /><span>Science Experiential Lab</span></div>
                          <div className="flex items-center gap-2 text-slate-700"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /><span>Composite Science Lab</span></div>
                          <div className="flex items-center gap-2 text-slate-700"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /><span>Atal Tinkering Lab (ATL)</span></div>
                          <div className="flex items-center gap-2 text-slate-700"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /><span>Robotics & IoT Lab</span></div>
                          <div className="flex items-center gap-2 text-slate-700"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /><span>AI & Machine Learning Lab</span></div>
                          <div className="flex items-center gap-2 text-slate-700"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /><span>AR / VR Immersive Pods</span></div>
                          <div className="flex items-center gap-2 text-slate-700"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /><span>Language & Phonetics Lab</span></div>
                          <div className="flex items-center gap-2 text-slate-700"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /><span>Astronomy & Space Observatory</span></div>
                          <div className="flex items-center gap-2 text-slate-700"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /><span>3D Printing & CAD Studio</span></div>
                          <div className="flex items-center gap-2 text-slate-700"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /><span>Mathematics Activity Lab</span></div>
                        </div>
                      </div>

                    </div>

                  </div>
                </div>
              </section>

              {/* SECTION 10: Parent Insights & Salary Trends (Locked Member Only Data) */}
              <section id="insights_locked_tab" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs relative overflow-hidden scroll-mt-20">
                <div className="flex items-center justify-between border-b pb-3 mb-4">
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <ChartBar className="w-4 h-4 text-[#1e3a8a]" />
                    <span>Insights & Salary Trends</span>
                  </h2>
                  <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" /> Member Only Data
                  </span>
                </div>

                <div className="blur-xs select-none pointer-events-none grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 border rounded-xl bg-slate-50">
                    <p className="font-bold text-slate-800 mb-2">Parent Salary Bracket</p>
                    <div className="space-y-2">
                      <div className="h-4 bg-blue-200 rounded w-3/4"></div>
                      <div className="h-4 bg-blue-300 rounded w-1/2"></div>
                      <div className="h-4 bg-blue-400 rounded w-5/6"></div>
                    </div>
                  </div>
                  <div className="p-4 border rounded-xl bg-slate-50">
                    <p className="font-bold text-slate-800 mb-2">Shortlisted Ratio</p>
                    <p className="text-2xl font-bold text-slate-900">452 Parents</p>
                    <p className="text-slate-400">Comparing with South Delhi IB Schools</p>
                  </div>
                </div>

                <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center p-4">
                  <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 max-w-sm text-center">
                    <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 mx-auto flex items-center justify-center text-xl mb-3">
                      <Lock className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm">Unlock Complete Parent Insights</h3>
                    <p className="text-xs text-slate-500 mt-1 mb-4 leading-relaxed">
                      Sign in to view salary brackets, admission transparency ratings, and poll stats from verified parents.
                    </p>
                    <button
                      onClick={() => {
                        setAuthType('signin');
                        setIsAuthModalOpen(true);
                      }}
                      className="w-full py-2.5 bg-[#1e3a8a] hover:bg-[#11224d] text-white font-bold text-xs rounded-xl shadow-xs transition"
                    >
                      Sign In to Unlock
                    </button>
                  </div>
                </div>
              </section>

              {/* SECTION 11: Photo Gallery with Labels */}
              <section id="gallery_tab" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs scroll-mt-20">
                <div className="flex items-center justify-between border-b pb-3 mb-5">
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#1e3a8a]" />
                    <span>Campus Gallery</span>
                  </h2>
                  <span className="text-xs text-slate-400 font-medium">Click to view full preview</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {galleryPhotos.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => setLightboxPhoto(item.url)}
                      className="group cursor-pointer bg-slate-50 rounded-xl overflow-hidden border border-slate-200 hover:border-blue-400 transition-all shadow-2xs hover:shadow-md flex flex-col"
                    >
                      <div className="h-32 sm:h-36 overflow-hidden relative">
                        <img
                          src={item.url}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          alt={item.title}
                        />
                        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                          <Maximize2 className="w-5 h-5" />
                        </div>
                        <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                          {item.category}
                        </span>
                      </div>
                      <div className="p-2.5 bg-white border-t border-slate-100">
                        <h4 className="font-bold text-xs text-slate-800 truncate group-hover:text-blue-600 transition">
                          {item.title}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* SECTION 12: Video Gallery & Virtual Tours */}
              <section id="video_gallery_tab" className="bg-white border-2 border-red-100 rounded-2xl p-6 shadow-xs scroll-mt-20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 mb-5 gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Video className="w-4 h-4 text-red-600" />
                        <span>Videos</span>
                      </h2>
                      <span className="text-[10px] bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">HD Media</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">Explore virtual campus walkthroughs, annual functions, and academic showcases</p>
                  </div>
                  <button
                    onClick={() => setActiveVideo({ id: 'rJKzHb76LJs', title: `Official 360° Virtual Campus Tour - ${org.name}` })}
                    className="bg-[#1e3a8a] hover:bg-[#11224d] text-white text-xs font-bold px-3.5 py-2 rounded-lg transition shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Full 360° Tour</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {videoItems.map((video) => (
                    <div
                      key={video.id}
                      onClick={() => setActiveVideo({ id: video.id, title: video.title })}
                      className="group relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shadow-xs cursor-pointer"
                    >
                      <div className="h-36 overflow-hidden relative">
                        <img
                          src={video.thumb}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300 opacity-90"
                        />
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-11 h-11 rounded-full bg-red-600/90 text-white flex items-center justify-center text-lg shadow-lg group-hover:scale-110 group-hover:bg-red-600 transition">
                            <Play className="w-5 h-5 fill-white ml-0.5" />
                          </div>
                        </div>
                        <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                          {video.duration}
                        </span>
                      </div>
                      <div className="p-3 bg-white">
                        <h4 className="font-bold text-xs text-slate-900 line-clamp-1 group-hover:text-red-600 transition">
                          {video.title}
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-0.5 font-medium">{video.subtitle}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* SECTION 13: Address & Contact */}
              <section id="address_tab" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs scroll-mt-20">
                <h2 className="text-base font-bold text-slate-900 border-b pb-3 mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#1e3a8a]" />
                  <span>Address, Location & Geographic Hierarchy</span>
                </h2>

                {/* 4-Box Geographic Hierarchy Summary */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">State</span>
                    <p className="font-black text-slate-900 text-sm mt-0.5">{org.state || 'Delhi NCR'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">District</span>
                    <p className="font-black text-slate-900 text-sm mt-0.5">{(org as any).district || (org as any).city || 'South Delhi'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Block / Tehsil</span>
                    <p className="font-black text-slate-900 text-sm mt-0.5">{(org as any).block || 'Urban Central Block'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Village / City / Town</span>
                    <p className="font-black text-slate-900 text-sm mt-0.5">{(org as any).villageTownCity || org.city || 'New Delhi'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  <div className="space-y-3 text-slate-600">
                    <p><strong className="text-slate-900">Campus Physical Address:</strong> {org.address || `${org.locality ? `${org.locality}, ` : ''}${(org as any).villageTownCity || org.city}, ${(org as any).district || org.city}, ${org.state} - ${org.pincode}`}</p>
                    <p><strong className="text-slate-900">Locality & Pincode:</strong> {org.locality || 'Campus Area'}, PIN: {org.pincode || '110048'}</p>
                    <p>
                      <strong className="text-slate-900">Email Desk:</strong>{' '}
                      <a href={`mailto:${org.email}`} className="text-rose-500 font-bold hover:underline">
                        {org.email || 'info@krmangalam.global'}
                      </a>
                    </p>
                    <p>
                      <strong className="text-slate-900">Official Web Portal:</strong>{' '}
                      <a href={org.website || 'https://krmangalam.global/'} target="_blank" rel="noreferrer" className="text-rose-500 font-bold hover:underline">
                        {org.website || 'https://krmangalam.global/'}
                      </a>
                    </p>
                    <p><strong className="text-slate-900">Direct Helpline:</strong> {org.phone || '+91 98109 56654'}</p>
                  </div>
                  <div className="h-48 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner">
                    <iframe
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(org.name + ' ' + (org.address || org.city))}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                      className="w-full h-full border-0"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                </div>
              </section>

            </div>

          </div>
        </main>

        {/* ── FLOATING MOBILE MENU PILL ── */}
        <div className="fixed bottom-5 right-4 z-50 lg:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="px-4 py-2.5 bg-black hover:bg-slate-800 text-white font-black text-xs rounded-full shadow-2xl flex items-center gap-2 border border-white/20 transition transform active:scale-95"
          >
            <MenuIcon className="w-4 h-4" />
            <span>Menu</span>
          </button>
        </div>

        {/* ── MOBILE MENU DRAWER ── */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center lg:hidden">
            <div className="bg-white rounded-t-3xl w-full max-h-[80vh] overflow-y-auto p-5 space-y-4 animate-in slide-in-from-bottom duration-200">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-black text-sm text-slate-900">School Sections</h3>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 rounded-full bg-slate-100 text-slate-500"><X className="w-5 h-5" /></button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-700">
                
                <a href="#key_stats_tab" onClick={() => setIsMobileMenuOpen(false)} className="p-3 bg-slate-50 border rounded-xl flex items-center gap-2"><ChartBar className="w-4 h-4 text-blue-600" /><span>Key Stats</span></a>
                <a href="#fee_structure_tab" onClick={() => setIsMobileMenuOpen(false)} className="p-3 bg-slate-50 border rounded-xl flex items-center gap-2"><Wallet className="w-4 h-4 text-emerald-600" /><span>Fee Structure</span></a>
                <a href="#academic_stats_tab" onClick={() => setIsMobileMenuOpen(false)} className="p-3 bg-slate-50 border rounded-xl flex items-center gap-2"><GraduationCap className="w-4 h-4 text-indigo-600" /><span>Academic Stats</span></a>
                <a href="#admission_criteria_tab" onClick={() => setIsMobileMenuOpen(false)} className="p-3 bg-slate-50 border rounded-xl flex items-center gap-2"><FileText className="w-4 h-4 text-rose-600" /><span>Eligibility</span></a>
                <Link href={`/edu-network/organisation/school/${org.id}/vacancy`} onClick={() => setIsMobileMenuOpen(false)} className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 font-bold"><Briefcase className="w-4 h-4 text-rose-600" /><span>Vacancies & Careers</span></Link>
                <a href="#facilities_tab" onClick={() => setIsMobileMenuOpen(false)} className="p-3 bg-slate-50 border rounded-xl flex items-center gap-2"><Wand2 className="w-4 h-4 text-sky-600" /><span>Facilities</span></a>
                <a href="#video_gallery_tab" onClick={() => setIsMobileMenuOpen(false)} className="p-3 bg-slate-50 border rounded-xl flex items-center gap-2"><Video className="w-4 h-4 text-red-600" /><span>Video Tour</span></a>
                <a href="#gallery_tab" onClick={() => setIsMobileMenuOpen(false)} className="p-3 bg-slate-50 border rounded-xl flex items-center gap-2"><ImageIcon className="w-4 h-4 text-indigo-600" /><span>Gallery</span></a>
                <a href="#address_tab" onClick={() => setIsMobileMenuOpen(false)} className="p-3 bg-slate-50 border rounded-xl flex items-center gap-2"><MapPin className="w-4 h-4 text-rose-600" /><span>Address & Contact</span></a>
              </div>
              <button onClick={() => { setIsMobileMenuOpen(false); setIsCallbackModalOpen(true); }} className="w-full py-3 bg-[#00875a] text-white font-black text-xs rounded-xl shadow-xs text-center">Request Callback</button>
            </div>
          </div>
        )}

        {/* ── SHARE PROFILE MODAL ── */}
        {isShareModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 transition-all">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
              <div className="bg-[#1e3a8a] p-5 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-white" />
                  <div>
                    <h3 className="font-bold text-sm leading-tight">Share School Profile</h3>
                    <p className="text-[11px] text-blue-200">Broadcast to parents & education networks</p>
                  </div>
                </div>
                <button onClick={() => setIsShareModalOpen(false)} className="text-white/80 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-5 space-y-4 text-xs">
                <div className="grid grid-cols-3 gap-2.5 font-bold text-center">
                  <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + currentShareUrl)}`} target="_blank" rel="noreferrer" className="p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 flex flex-col items-center justify-center gap-1.5 transition"><span className="text-lg">💬</span><span className="text-[11px]">WhatsApp</span></a>
                  <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentShareUrl)}`} target="_blank" rel="noreferrer" className="p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 flex flex-col items-center justify-center gap-1.5 transition"><span className="text-lg">in</span><span className="text-[11px]">LinkedIn</span></a>
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentShareUrl)}`} target="_blank" rel="noreferrer" className="p-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-800 flex flex-col items-center justify-center gap-1.5 transition"><span className="text-lg">f</span><span className="text-[11px]">Facebook</span></a>
                  <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentShareUrl)}`} target="_blank" rel="noreferrer" className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-900 flex flex-col items-center justify-center gap-1.5 transition"><span className="text-lg">𝕏</span><span className="text-[11px]">X (Twitter)</span></a>
                  <a href={`https://t.me/share/url?url=${encodeURIComponent(currentShareUrl)}&text=${encodeURIComponent(shareText)}`} target="_blank" rel="noreferrer" className="p-3 rounded-2xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 flex flex-col items-center justify-center gap-1.5 transition"><span className="text-lg">✈️</span><span className="text-[11px]">Telegram</span></a>
                  <button onClick={handleCopyLink} className="p-3 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 flex flex-col items-center justify-center gap-1.5 transition"><span className="text-lg">📷</span><span className="text-[11px]">Instagram</span></button>
                </div>
                <div className="flex items-center gap-2 p-1.5 bg-slate-50 border rounded-xl">
                  <input type="text" readOnly value={currentShareUrl} className="w-full bg-transparent px-2 text-xs font-mono outline-none select-all truncate" />
                  <button onClick={handleCopyLink} className={`px-3 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1 shrink-0 ${copiedLink ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'}`}>{copiedLink ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}<span>{copiedLink ? 'Copied' : 'Copy'}</span></button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── VIDEO PLAYER MODAL ──────────────────────────────────────────── */}
        {activeVideo && (
          <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 transition-all">
            <div className="bg-black rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden relative border border-slate-800">
              <div className="bg-slate-900 px-4 py-3 text-white flex items-center justify-between border-b border-slate-800">
                <h3 className="font-bold text-xs sm:text-sm text-slate-200 truncate pr-4">{activeVideo.title}</h3>
                <button onClick={() => setActiveVideo(null)} className="text-slate-400 hover:text-white text-xl">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="relative w-full pb-[56.25%] bg-black">
                <iframe
                  className="absolute inset-0 w-full h-full border-0"
                  src={`https://www.youtube.com/embed/${activeVideo.id}?autoplay=1`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        )}

        {/* ── AUTH MODAL (SIGN IN / SIGN UP) ────────────────────────────────── */}
        {isAuthModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 transition-all">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col md:flex-row relative">
              
              <button onClick={() => setIsAuthModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 z-20">
                <X className="w-5 h-5" />
              </button>

              <div className="w-full md:w-5/12 bg-blue-600 text-white p-6 sm:p-8 flex flex-col justify-between">
                <div className="space-y-6">
                  <div className="flex items-start gap-3.5">
                    <div className="text-xl shrink-0 mt-0.5"><Sparkles className="w-5 h-5" /></div>
                    <p className="text-xs sm:text-sm font-medium leading-snug">Explore schools around your neighbourhood</p>
                  </div>
                  <div className="flex items-start gap-3.5">
                    <div className="text-xl shrink-0 mt-0.5"><Bell className="w-5 h-5" /></div>
                    <p className="text-xs sm:text-sm font-medium leading-snug">Manage your Admissions interests and alerts</p>
                  </div>
                  <div className="flex items-start gap-3.5">
                    <div className="text-xl shrink-0 mt-0.5"><Laptop className="w-5 h-5" /></div>
                    <p className="text-xs sm:text-sm font-medium leading-snug">Get school recommendations and key insights</p>
                  </div>
                  <div className="flex items-start gap-3.5">
                    <div className="text-xl shrink-0 mt-0.5"><FileText className="w-5 h-5" /></div>
                    <p className="text-xs sm:text-sm font-medium leading-snug">A single form for all school admissions</p>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-blue-400/40 text-[11px] text-blue-100">
                  Trusted by over 50,000+ parents across India.
                </div>
              </div>

              <div className="w-full md:w-7/12 bg-white p-6 sm:p-8 flex flex-col justify-center">
                <div className="flex justify-center items-center gap-8 mb-6 font-bold text-sm">
                  <button
                    onClick={() => setAuthType('signup')}
                    className={`pb-1 transition ${authType === 'signup' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    Sign Up
                  </button>
                  <button
                    onClick={() => setAuthType('signin')}
                    className={`pb-1 transition ${authType === 'signin' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    Sign In
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleAuthSubmit({ preventDefault: () => {} } as any)}
                  className="w-full py-2.5 px-4 border border-slate-300 rounded-lg hover:bg-slate-50 transition flex items-center justify-center gap-2 text-xs font-semibold text-slate-700 shadow-xs"
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4" alt="Google" />
                  <span>Continue with Google</span>
                </button>

                <div className="flex items-center my-4">
                  <hr className="flex-1 border-slate-200" />
                  <span className="px-3 text-[11px] text-slate-400">or use email</span>
                  <hr className="flex-1 border-slate-200" />
                </div>

                {authSuccess ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-1">
                    <p className="font-bold text-emerald-800 text-xs">Authentication Successful!</p>
                    <p className="text-[11px] text-emerald-600">Member insights and features unlocked.</p>
                  </div>
                ) : (
                  <form onSubmit={handleAuthSubmit} className="space-y-3.5 text-xs">
                    <div>
                      <input
                        type="text"
                        required
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        placeholder="Email / Mobile Number"
                        className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 text-slate-900"
                      />
                    </div>
                    <div>
                      <input
                        type="password"
                        required
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 text-slate-900"
                      />
                    </div>
                    <div className="text-right">
                      <a href="#" className="text-[11px] text-blue-600 font-semibold hover:underline">Forgot Password?</a>
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-xs transition uppercase tracking-wider text-xs"
                    >
                      {authType === 'signup' ? 'SIGN UP' : 'SIGN IN'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── POST A JOB MODAL ──────────────────────────────────────────────── */}
        {isJobModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 transition-all">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="bg-[#1e3a8a] p-4 text-white flex items-center justify-between">
                <h3 className="font-bold text-sm flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  <span>Post School Job Vacancy</span>
                </h3>
                <button onClick={() => setIsJobModalOpen(false)} className="text-white/80 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {jobModalSuccess ? (
                <div className="p-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-base text-slate-900">Job Vacancy Published!</h4>
                  <p className="text-xs text-slate-500">The vacancy is live and candidate applications will route directly to your desk.</p>
                </div>
              ) : (
                <form className="p-5 space-y-4 text-xs font-semibold" onSubmit={handleJobSubmit}>
                  <div>
                    <label className="block text-slate-600 mb-1">Position / Designation *</label>
                    <input
                      type="text"
                      required
                      value={jobModalForm.title}
                      onChange={(e) => setJobModalForm({ ...jobModalForm, title: e.target.value })}
                      placeholder="e.g. PGT Biology / Head Librarian"
                      className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-rose-500 text-slate-900 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">Department Category *</label>
                    <select
                      value={jobModalForm.department}
                      onChange={(e) => setJobModalForm({ ...jobModalForm, department: e.target.value })}
                      className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-rose-500 text-slate-800 font-medium"
                    >
                      <option value="Teaching Faculty">Teaching Faculty</option>
                      <option value="Non-Teaching / Operations">Non-Teaching / Operations</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">Offered Monthly Remuneration</label>
                    <input
                      type="text"
                      value={jobModalForm.salary}
                      onChange={(e) => setJobModalForm({ ...jobModalForm, salary: e.target.value })}
                      placeholder="e.g. ₹55,000 - ₹75,000 / mo"
                      className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-rose-500 text-slate-900 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">Eligibility Criteria & Description *</label>
                    <textarea
                      required
                      rows={3}
                      value={jobModalForm.requirements}
                      onChange={(e) => setJobModalForm({ ...jobModalForm, requirements: e.target.value })}
                      placeholder="Provide qualification details, experience required, and monthly pay scale..."
                      className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-rose-500 text-slate-900 font-medium resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-lg shadow-xs transition"
                  >
                    Publish Vacancy
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ── APPLY POSITION MODAL ──────────────────────────────────────────── */}
        {selectedJobToApply && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden">
              <div className="bg-[#1e3a8a] p-4 text-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-rose-300 font-bold uppercase">Apply for Vacancy</span>
                  <h3 className="font-bold text-sm text-white">{selectedJobToApply.title}</h3>
                </div>
                <button onClick={() => setSelectedJobToApply(null)} className="text-white/80 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {applySuccess ? (
                <div className="p-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-base text-slate-900">Application Submitted!</h4>
                  <p className="text-xs text-slate-500">The HR and academic recruitment desk of {org.name} has received your profile.</p>
                </div>
              ) : (
                <form onSubmit={handleApplySubmit} className="p-5 space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={applyModalForm.name}
                      onChange={(e) => setApplyModalForm({ ...applyModalForm, name: e.target.value })}
                      placeholder="e.g. Dr. Ramesh Mukherjee"
                      className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Phone *</label>
                      <input
                        type="tel"
                        required
                        value={applyModalForm.phone}
                        onChange={(e) => setApplyModalForm({ ...applyModalForm, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Email *</label>
                      <input
                        type="email"
                        required
                        value={applyModalForm.email}
                        onChange={(e) => setApplyModalForm({ ...applyModalForm, email: e.target.value })}
                        placeholder="teacher@example.com"
                        className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Experience Summary</label>
                    <textarea
                      rows={3}
                      value={applyModalForm.message}
                      onChange={(e) => setApplyModalForm({ ...applyModalForm, message: e.target.value })}
                      placeholder="M.Sc Physics with 5+ years experiential lab teaching..."
                      className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow-xs transition mt-2"
                  >
                    Submit Job Application
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ── CALLBACK / ENQUIRY MODAL ──────────────────────────────────────── */}
        {isCallbackModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden">
              <div className="bg-[#1e3a8a] p-4 text-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-emerald-300 font-bold uppercase">Admission & Callback Desk</span>
                  <h3 className="font-bold text-sm text-white">{org.name}</h3>
                </div>
                <button onClick={() => setIsCallbackModalOpen(false)} className="text-white/80 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {callbackSuccess ? (
                <div className="p-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-base text-slate-900">Request Registered!</h4>
                  <p className="text-xs text-slate-500">The admission team will call you back during your preferred time window.</p>
                </div>
              ) : (
                <form onSubmit={handleCallbackSubmit} className="p-5 space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Parent / Guardian Name *</label>
                    <input
                      type="text"
                      required
                      value={callbackForm.parentName}
                      onChange={(e) => setCallbackForm({ ...callbackForm, parentName: e.target.value })}
                      placeholder="e.g. Sunil Verma"
                      className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Contact Phone *</label>
                      <input
                        type="tel"
                        required
                        value={callbackForm.phone}
                        onChange={(e) => setCallbackForm({ ...callbackForm, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Applying Grade</label>
                      <select
                        value={callbackForm.grade}
                        onChange={(e) => setCallbackForm({ ...callbackForm, grade: e.target.value })}
                        className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-bold"
                      >
                        <option value="Nursery">Nursery / KG</option>
                        <option value="Class 1-5">Primary (1-5)</option>
                        <option value="Class 6-8">Middle (6-8)</option>
                        <option value="Class 9-10">Secondary (9-10)</option>
                        <option value="Class 11-12">Sr. Secondary (11-12)</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Preferred Callback Window</label>
                    <select
                      value={callbackForm.preferredTime}
                      onChange={(e) => setCallbackForm({ ...callbackForm, preferredTime: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50"
                    >
                      <option value="Morning (9 AM - 12 PM)">Morning (9 AM - 12 PM)</option>
                      <option value="Afternoon (12 PM - 4 PM)">Afternoon (12 PM - 4 PM)</option>
                      <option value="Evening (4 PM - 7 PM)">Evening (4 PM - 7 PM)</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition mt-2"
                  >
                    Confirm Callback Request
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ── LIGHTBOX MODAL ────────────────────────────────────────────────── */}
        {lightboxPhoto && (
          <div
            onClick={() => setLightboxPhoto(null)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl">
              <img src={lightboxPhoto} alt="Campus Full" className="w-full h-full object-contain" />
              <button
                onClick={() => setLightboxPhoto(null)}
                className="absolute top-3 right-3 p-2 bg-black/50 text-white rounded-full hover:bg-black/80 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

      </div>
    
        {/* ── UPLOAD RESULT BANNER MODAL ── */}
        {isUploadBannerModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="bg-[#1e3a8a] p-4 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  <div>
                    <h3 className="font-bold text-sm leading-tight">Upload School Result Banner</h3>
                    <p className="text-[11px] text-blue-200">Class 10th &amp; 12th Board Toppers</p>
                  </div>
                </div>
                <button onClick={() => setIsUploadBannerModalOpen(false)} className="text-white/80 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {uploadBannerSuccess ? (
                <div className="p-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-base text-slate-900">Result Banner Updated!</h4>
                  <p className="text-xs text-slate-500">
                    The academic result banner for {uploadBannerForm.academicYear} has been verified and published to your institutional profile.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setUploadBannerSuccess(true);
                    setTimeout(() => {
                      setUploadBannerSuccess(false);
                      setIsUploadBannerModalOpen(false);
                    }, 1800);
                  }}
                  className="p-5 space-y-3 text-xs font-semibold"
                >
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-700 mb-1">Academic Session *</label>
                      <select
                        value={uploadBannerForm.academicYear}
                        onChange={(e) => setUploadBannerForm({ ...uploadBannerForm, academicYear: e.target.value })}
                        className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 text-slate-900"
                      >
                        <option value="2026-27">2026 - 2027</option>
                        <option value="2025-26">2025 - 2026</option>
                        <option value="2024-25">2024 - 2025</option>
                        <option value="2023-24">2023 - 2024</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1">Class Level *</label>
                      <select
                        value={uploadBannerForm.targetClass}
                        onChange={(e) => setUploadBannerForm({ ...uploadBannerForm, targetClass: e.target.value })}
                        className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 text-slate-900"
                      >
                        <option value="Class 12th">Class 12th (Senior Secondary)</option>
                        <option value="Class 10th">Class 10th (Secondary)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1">Banner Image / Poster URL *</label>
                    <input
                      type="url"
                      required
                      value={uploadBannerForm.bannerUrl}
                      onChange={(e) => setUploadBannerForm({ ...uploadBannerForm, bannerUrl: e.target.value })}
                      placeholder="https://example.com/class-12-topper-banner.jpg"
                      className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 text-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-700 mb-1">Top Student Name</label>
                      <input
                        type="text"
                        value={uploadBannerForm.topperName}
                        onChange={(e) => setUploadBannerForm({ ...uploadBannerForm, topperName: e.target.value })}
                        placeholder="e.g. Diya Sharma"
                        className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 mb-1">Score Percentage (%)</label>
                      <input
                        type="text"
                        value={uploadBannerForm.score}
                        onChange={(e) => setUploadBannerForm({ ...uploadBannerForm, score: e.target.value })}
                        placeholder="e.g. 99.4%"
                        className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-blue-800 text-[11px]">
                    ℹ️ Uploaded result posters will automatically be organized in the year-wise collapsible archive and showcased to prospective parents.
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl shadow-xs transition"
                  >
                    Save &amp; Publish Result Banner
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

    </PageTransition>
  );
}
