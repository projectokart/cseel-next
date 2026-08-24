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
  ChevronLeft, Menu as MenuIcon, PhoneCall, ArrowRight, UserPlus
} from 'lucide-react';
import PageTransition from '@/components/shared/PageTransition';
import {
  getOrganizationById, getJobsByOrgId, ALL_ORGANIZATIONS,
  OrganizationItem, EduJobItem
} from '@/lib/eduNetworkData';

interface PremiumSchoolProfileProps {
  orgId: string;
}

export default function PremiumSchoolProfileClient({ orgId }: PremiumSchoolProfileProps) {
  // Find organization or fallback to K.R. Mangalam Global School
  const org = useMemo(() => {
    return getOrganizationById(orgId) || ALL_ORGANIZATIONS[0];
  }, [orgId]);

  // Selected Class in Fee Structure & Top Dropdown
  const [selectedFeeClass, setSelectedFeeClass] = useState('Nursery');
  const [selectedAdmissionSession, setSelectedAdmissionSession] = useState('2027-2028');

  // Carousel banner photo index
  const [currentPhotoIdx, setCurrentPhotoIdx] = useState(0);

  // Mobile Menu Drawer
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Gallery Photos
  const bannerPhotos = useMemo(() => [
    org.bannerImage || "https://images.uniapply.com/uploads/college/image/500/2186/Building_UA_210909_112120.JPG",
    "https://images.uniapply.com/uploads/college/image/500/2186/Activity_room_UA_210909_112055.jpg",
    "https://images.uniapply.com/uploads/college/image/500/2186/Classroom_1_UA_210909_112131.jpg",
    "https://images.uniapply.com/uploads/college/image/500/2186/Library_UA_210909_112346.jpg"
  ], [org]);

  const handlePrevPhoto = () => {
    setCurrentPhotoIdx((prev) => (prev === 0 ? bannerPhotos.length - 1 : prev - 1));
  };
  const handleNextPhoto = () => {
    setCurrentPhotoIdx((prev) => (prev === bannerPhotos.length - 1 ? 0 : prev + 1));
  };

  // Dynamic fee calculation based on class
  const classFeeMultiplier: Record<string, { admission: number; security: number; tuition: number; annual: number; dev: number; transport: number }> = {
    'Nursery': { admission: 80000, security: 100000, tuition: 78000, annual: 24000, dev: 12000, transport: 16500 },
    'LKG': { admission: 80000, security: 100000, tuition: 78000, annual: 24000, dev: 12000, transport: 16500 },
    'UKG': { admission: 80000, security: 100000, tuition: 82000, annual: 26000, dev: 14000, transport: 16500 },
    'Class 1': { admission: 85000, security: 100000, tuition: 85000, annual: 28000, dev: 15000, transport: 18000 },
    'Class 2': { admission: 85000, security: 100000, tuition: 85000, annual: 28000, dev: 15000, transport: 18000 },
    'Class 3': { admission: 85000, security: 100000, tuition: 88000, annual: 30000, dev: 16000, transport: 18000 },
    'Class 4': { admission: 85000, security: 100000, tuition: 88000, annual: 30000, dev: 16000, transport: 18000 },
    'Class 5': { admission: 85000, security: 100000, tuition: 92000, annual: 32000, dev: 18000, transport: 19500 },
    'Class 6': { admission: 90000, security: 100000, tuition: 95000, annual: 34000, dev: 20000, transport: 20000 },
    'Class 7': { admission: 90000, security: 100000, tuition: 95000, annual: 34000, dev: 20000, transport: 20000 },
    'Class 8': { admission: 90000, security: 100000, tuition: 98000, annual: 36000, dev: 22000, transport: 20000 },
    'Class 9': { admission: 95000, security: 100000, tuition: 105000, annual: 40000, dev: 25000, transport: 22000 },
    'Class 10': { admission: 95000, security: 100000, tuition: 110000, annual: 42000, dev: 26000, transport: 22000 },
    'Class 11': { admission: 100000, security: 100000, tuition: 125000, annual: 48000, dev: 30000, transport: 24000 },
    'Class 12': { admission: 100000, security: 100000, tuition: 130000, annual: 50000, dev: 32000, transport: 24000 },
  };

  const currentFee = classFeeMultiplier[selectedFeeClass] || classFeeMultiplier['Nursery'];
  const totalFirstYearCost = 1000 + currentFee.admission + (currentFee.tuition * 4) + currentFee.security + currentFee.annual + currentFee.dev;
  const monthlyCostEstimate = Math.round(((currentFee.tuition * 4) + currentFee.annual + currentFee.dev) / 12);

  // Poll votes state
  const [pollPhone, setPollPhone] = useState('');
  const [pollSubmitted, setPollSubmitted] = useState(false);

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

  // Share Modal state
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

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

  // Lightbox Photo
  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);
  const [isNotified, setIsNotified] = useState(false);

  // Share profile current URL
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

  const handlePollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pollPhone) return;
    setPollSubmitted(true);
    setTimeout(() => {
      setPollSubmitted(false);
      setPollPhone('');
    }, 2500);
  };

  return (
    <PageTransition>
      <div className="bg-[#f8fafc] text-slate-800 font-sans antialiased pb-28 min-h-screen">

        {/* ── MOBILE & DESKTOP TOP HERO BANNER & CAROUSEL (IMAGE 1) ───────────── */}
        <div className="relative bg-slate-900 overflow-hidden">
          {/* Carousel Image Container */}
          <div className="relative h-64 sm:h-80 md:h-96 w-full">
            <img
              src={bannerPhotos[currentPhotoIdx]}
              alt={org.name}
              className="w-full h-full object-cover transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/30"></div>

            {/* Left/Right Carousel Controls */}
            <button
              onClick={handlePrevPhoto}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-xs transition"
              aria-label="Previous Photo"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextPhoto}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-xs transition"
              aria-label="Next Photo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Top Left: Views Badge (46284 views like in screenshot) */}
            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
              <Eye className="w-3.5 h-3.5" />
              <span>46284</span>
            </div>

            {/* Top Right: Share Button (Circular white icon like in screenshot) */}
            <button
              onClick={handleNativeShare}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white text-slate-800 flex items-center justify-center shadow-md hover:bg-slate-100 transition"
              aria-label="Share School Profile"
            >
              <Share2 className="w-4 h-4 text-slate-800" />
            </button>
          </div>

          {/* School Name & Locality Strip (Directly below banner like in Image 1) */}
          <div className="bg-white border-b border-slate-200 p-4 sm:p-5">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <img
                  src={org.logo || "https://images.uniapply.com/uploads/college/image/logo/2186/KRMGS_L_220920_174918.jpg"}
                  alt={org.name}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl border border-slate-200 bg-white p-1 object-contain shadow-2xs shrink-0"
                />
                <div>
                  <h1 className="text-lg sm:text-2xl font-black text-slate-900 leading-tight">
                    {org.name}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-400 font-bold">
                    ({(org as any).shortName || 'KRMGS'})
                  </p>
                  <p className="text-xs text-rose-500 font-bold flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                    <span>{org.locality || 'Greater Kailash 1'}, {org.city}</span>
                  </p>
                </div>
              </div>

              {/* Desktop Rating & Quick Actions */}
              <div className="hidden sm:flex items-center gap-3">
                <div className="text-right">
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs font-black">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{org.rating || '4.8'} / 5</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">{org.reviews || 142} Reviews</p>
                </div>
                <button
                  onClick={() => setIsCallbackModalOpen(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
                >
                  Enquire Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── STICKY TOP ACTION BAR (ADMISSION DROPDOWN + CALL BUTTON) (IMAGE 2 & 3) ── */}
        <div className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs px-3 sm:px-4 py-2">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2.5">
            
            {/* Left: Looking Admission For Dropdown */}
            <div className="flex-1 flex items-center border border-slate-300 rounded-xl bg-white px-2.5 py-1.5 shadow-2xs hover:border-blue-500 transition">
              <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 shrink-0 mr-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">
                  I am looking admission for
                </label>
                <select
                  value={selectedFeeClass}
                  onChange={(e) => setSelectedFeeClass(e.target.value)}
                  className="w-full bg-transparent font-bold text-slate-900 text-xs focus:outline-none cursor-pointer truncate"
                >
                  <option value="Nursery">Nursery</option>
                  <option value="LKG">LKG</option>
                  <option value="UKG">UKG</option>
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
                  <option value="Class 11">Class 11</option>
                  <option value="Class 12">Class 12</option>
                </select>
              </div>
            </div>

            {/* Right: Green Callback Phone Button (Directly matching Image 2 & 3) */}
            <button
              onClick={() => setIsCallbackModalOpen(true)}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#00875a] hover:bg-[#00704a] text-white flex items-center justify-center shadow-xs shrink-0 transition"
              aria-label="Request a Call Back"
            >
              <PhoneCall className="w-5 h-5 fill-white" />
            </button>

          </div>
        </div>

        {/* ── 2-COLUMN MAIN CONTENT (SIDEBAR + SECTIONS) ──────────────────────── */}
        <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start relative">
            
            {/* ── LEFT STICKY SIDEBAR (DESKTOP) ───────────────────────────────── */}
            <aside className="hidden lg:block w-72 shrink-0 sticky top-16 h-[calc(100vh-4.5rem)] overflow-y-auto pr-2 overscroll-contain pb-10 space-y-4 scrollbar-thin scrollbar-thumb-slate-300 hover:scrollbar-thumb-slate-400">
              
              {/* Card 1: CSEEL Verified Campus Card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-4 space-y-3">
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

              {/* Card 2: Active Jobs (Indeed Portal style) */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    ACTIVE JOBS ({jobsList.length})
                  </h4>
                  <Link
                    href="/edu-network/jobs"
                    className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-0.5"
                  >
                    <span>Indeed Portal</span>
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
                    <button
                      onClick={() => setSelectedJobToApply(job)}
                      className="w-full py-1.5 bg-white hover:bg-slate-50 text-blue-600 border border-blue-200 hover:border-blue-400 font-bold text-xs rounded-lg shadow-2xs transition-all text-center"
                    >
                      Apply with Resume
                    </button>
                  </div>
                ))}
              </div>

              {/* Navigation Menu */}
              <nav className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs" id="sidebarMenu">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 mb-2">School Sections</p>
                <ul className="space-y-1 text-xs font-semibold text-slate-600">
                  <li><a href="#school_connect" className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition"><MessageSquare className="w-4 h-4 text-blue-600" /><span>School Connect</span></a></li>
                  <li><a href="#key_stats" className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition"><ChartBar className="w-4 h-4 text-blue-600" /><span>Key School Stats</span></a></li>
                  <li><a href="#poll_opinion" className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition"><ChartBar className="w-4 h-4 text-emerald-600" /><span>Poll & Opinion</span></a></li>
                  <li><a href="#fee_structure" className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition"><Wallet className="w-4 h-4 text-emerald-600" /><span>Fee Structure</span></a></li>
                  <li><a href="#vacancies" className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-rose-50 text-rose-600 font-bold"><Briefcase className="w-4 h-4 text-rose-500" /><span>Vacancies & Careers</span></a></li>
                  <li><a href="#facilities" className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition"><Wand2 className="w-4 h-4 text-sky-600" /><span>Facilities & Labs</span></a></li>
                  <li><a href="#video_gallery" className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-red-50 text-red-600 font-bold"><Video className="w-4 h-4 text-red-600" /><span>Video Tour</span></a></li>
                  <li><a href="#gallery" className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition"><ImageIcon className="w-4 h-4 text-indigo-600" /><span>Photo Gallery</span></a></li>
                  <li><a href="#address" className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition"><MapPin className="w-4 h-4 text-rose-600" /><span>Map & Location</span></a></li>
                </ul>
              </nav>

            </aside>

            {/* ── RIGHT MAIN SECTIONS (MOBILE & DESKTOP MATCHING SCREENSHOTS) ── */}
            <div className="flex-1 min-w-0 space-y-6 w-full">
              
              {/* SECTION 1: School Connect (IMAGE 2) */}
              <section id="school_connect" className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-2xs scroll-mt-20">
                <h2 className="text-sm sm:text-base font-black text-slate-900 mb-3">
                  School Connect
                </h2>
                <div className="p-4 bg-[#f8fafc] border border-slate-200/90 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <p className="text-xs text-slate-600 leading-relaxed max-w-md font-medium">
                    Curious about admissions? Enquire now and get answers straight from the school.
                  </p>
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => setIsNotified(!isNotified)}
                      className={`p-2 sm:px-3 sm:py-2 border rounded-xl font-bold text-xs transition flex items-center gap-1 ${
                        isNotified ? 'bg-blue-50 border-blue-500 text-blue-600' : 'border-blue-400 text-blue-600 hover:bg-blue-50 bg-white'
                      }`}
                      aria-label="Notify Me"
                    >
                      <Bell className={`w-4 h-4 ${isNotified ? 'fill-blue-600' : ''}`} />
                    </button>
                    <button
                      onClick={() => setIsCallbackModalOpen(true)}
                      className="px-4 py-2 border-2 border-rose-500 hover:bg-rose-50 text-rose-600 font-black text-xs rounded-xl bg-white transition shadow-2xs"
                    >
                      Enquire Now
                    </button>
                  </div>
                </div>
              </section>

              {/* SECTION 2: Key School Stats (IMAGE 2) */}
              <section id="key_stats" className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-2xs scroll-mt-20">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <h2 className="text-sm sm:text-base font-black text-slate-900">
                    Key School Stats
                  </h2>
                  <button
                    onClick={() => alert(`Downloading official brochure for ${org.name}...`)}
                    className="px-3 py-1.5 border border-blue-300 text-blue-700 bg-blue-50/50 hover:bg-blue-50 font-black text-xs rounded-xl flex items-center gap-1.5 transition"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-600" />
                    <span>Download Brochure</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs">
                  <div>
                    <span className="text-[11px] text-slate-400 font-medium block">Ownership</span>
                    <span className="text-sm font-black text-slate-900">Private</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 font-medium block">Board</span>
                    <span className="text-sm font-black text-slate-900">{org.board || 'IB'}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 font-medium block">Year of Establishment</span>
                    <span className="text-sm font-black text-slate-900">{org.established || '2018'}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 font-medium block">Co-Ed Status</span>
                    <span className="text-sm font-black text-slate-900">Co-Education</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 font-medium block">Campus Size</span>
                    <span className="text-sm font-black text-slate-900">5 Acres</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 font-medium block">Campus Type</span>
                    <span className="text-sm font-black text-slate-900">Urban</span>
                  </div>
                </div>
              </section>

              {/* SECTION 3: Poll & Opinion (IMAGE 2 & 3) */}
              <section id="poll_opinion" className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-2xs scroll-mt-20">
                <div className="flex items-center gap-2 mb-3">
                  <ChartBar className="w-4 h-4 text-blue-600" />
                  <h2 className="text-sm sm:text-base font-black text-slate-900">
                    Poll & Opinion
                  </h2>
                </div>

                <div className="p-4 bg-[#f8fafc] border border-slate-200/90 rounded-2xl text-center sm:text-left space-y-3">
                  <p className="text-xs text-slate-700 font-medium leading-relaxed">
                    This will help us in keeping you informed about your child's admission.
                  </p>

                  {pollSubmitted ? (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold text-center">
                      ✓ Number registered! You will receive admission updates.
                    </div>
                  ) : (
                    <form onSubmit={handlePollSubmit} className="flex flex-col sm:flex-row gap-2 max-w-sm">
                      <input
                        type="tel"
                        required
                        placeholder="Enter mobile number"
                        value={pollPhone}
                        onChange={(e) => setPollPhone(e.target.value)}
                        className="p-2.5 border border-slate-300 rounded-xl text-xs font-bold bg-white focus:outline-none focus:border-blue-600 flex-1"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2.5 bg-[#1d4ed8] hover:bg-[#1e40af] text-white font-bold text-xs rounded-xl shadow-xs transition"
                      >
                        Add Mobile Number
                      </button>
                    </form>
                  )}
                </div>

                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => alert('Viewing all parent community polls for this school.')}
                    className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <span>View all</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </section>

              {/* SECTION 4: Fee Structure (IMAGE 3) */}
              <section id="fee_structure" className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-2xs scroll-mt-20">
                <h2 className="text-sm sm:text-base font-black text-slate-900 mb-3">
                  Fee Structure
                </h2>

                {/* Class Select Dropdown (Matching Image 3) */}
                <div className="border border-slate-300 rounded-xl bg-white p-2.5 mb-4 flex items-center gap-2.5 shadow-2xs">
                  <Wallet className="w-5 h-5 text-blue-600 shrink-0" />
                  <div className="flex-1">
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">
                      Select Class
                    </label>
                    <select
                      value={selectedFeeClass}
                      onChange={(e) => setSelectedFeeClass(e.target.value)}
                      className="w-full bg-transparent font-bold text-slate-900 text-xs focus:outline-none cursor-pointer"
                    >
                      {Object.keys(classFeeMultiplier).map((cls) => (
                        <option key={cls} value={cls}>{cls}</option>
                      ))}
                    </select>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </div>

                <h3 className="text-xs font-black text-slate-900 border-b-2 border-rose-500 pb-1 inline-block mb-3">
                  Fee Structure for {selectedFeeClass}
                </h3>

                {/* Fee Table (Exact columns: Type, Amount, Frequency from Image 3) */}
                <div className="overflow-x-auto border border-slate-200 rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-[#f8fafc] text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">Type</th>
                        <th className="p-3 text-right">Amount</th>
                        <th className="p-3">Frequency</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      <tr>
                        <td className="p-3 font-semibold text-slate-900">Registration Fees</td>
                        <td className="p-3 text-right font-bold">₹ 1,000</td>
                        <td className="p-3 text-slate-500">Onetime</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-slate-900">Admission Fees</td>
                        <td className="p-3 text-right font-bold">₹ {currentFee.admission.toLocaleString()}</td>
                        <td className="p-3 text-slate-500">Onetime</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-slate-900">Tuition Fees</td>
                        <td className="p-3 text-right font-bold">₹ {currentFee.tuition.toLocaleString()}</td>
                        <td className="p-3 text-slate-500">Quarterly</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-slate-900">Security Fees (Refundable)</td>
                        <td className="p-3 text-right font-bold">₹ {currentFee.security.toLocaleString()}</td>
                        <td className="p-3 text-slate-500">Onetime</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-slate-900">Annual Charges</td>
                        <td className="p-3 text-right font-bold">₹ {currentFee.annual.toLocaleString()}</td>
                        <td className="p-3 text-slate-500">Annually</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-slate-900">Development Fees</td>
                        <td className="p-3 text-right font-bold">₹ {currentFee.dev.toLocaleString()}</td>
                        <td className="p-3 text-slate-500">Annually</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-blue-900 font-medium">
                  <strong>Total Estimated 1st Year Cost:</strong> ₹{totalFirstYearCost.toLocaleString()} (~₹{monthlyCostEstimate.toLocaleString()}/mo)
                </div>
              </section>

              {/* SECTION 5: Institutional Careers & Vacancies */}
              <section id="vacancies" className="bg-white border-2 border-rose-200 rounded-2xl p-4 sm:p-5 shadow-2xs scroll-mt-20">
                <div className="flex items-center justify-between border-b pb-3 mb-4">
                  <div>
                    <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-rose-500" />
                      <span>Institutional Careers & Vacancies</span>
                    </h2>
                    <p className="text-[11px] text-slate-400">Teaching & Non-Teaching Openings</p>
                  </div>
                  <button
                    onClick={() => setIsJobModalOpen(true)}
                    className="px-3 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-2xs hover:bg-emerald-700 transition flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Post a Job</span>
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  {jobsList.map((job) => (
                    <div
                      key={job.id}
                      className="p-3.5 border rounded-xl bg-slate-50 flex flex-col sm:flex-row justify-between sm:items-center gap-2.5 hover:border-rose-300 transition"
                    >
                      <div>
                        <span className="font-black text-slate-900 text-xs sm:text-sm block">{job.title}</span>
                        <p className="text-slate-500 text-[11px] mt-0.5">
                          {job.qualifications} • <strong className="text-emerald-700">{job.salary}</strong>
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedJobToApply(job)}
                        className="px-3.5 py-1.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-lg text-xs self-start sm:self-center transition shrink-0"
                      >
                        Apply Position
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* SECTION 6: Campus Facilities & Labs */}
              <section id="facilities" className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-2xs scroll-mt-20">
                <div className="flex items-center justify-between border-b pb-3 mb-4">
                  <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                    <Wand2 className="w-4 h-4 text-blue-600" />
                    <span>Campus Facilities (36/39 - 93%)</span>
                  </h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                  {[
                    'AC Smart Classrooms', 'Robotics & AI Lab', 'Experiential Science Lab',
                    'High-Speed Tech Lab', 'Swimming Pool', 'Horse Riding Field',
                    'Indoor Shooting Range', 'GPS Monitored Buses', 'Ramp & Elevator Access'
                  ].map((facility, idx) => (
                    <div key={idx} className="p-2.5 bg-[#f8fafc] border rounded-xl flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="font-semibold text-slate-800 text-[11px] truncate">{facility}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* SECTION 7: Video Tour */}
              <section id="video_gallery" className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-2xs scroll-mt-20">
                <div className="flex items-center justify-between border-b pb-3 mb-4">
                  <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                    <Video className="w-4 h-4 text-red-600" />
                    <span>Video Tour & Campus Highlights</span>
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setActiveVideo({ id: 'rJKzHb76LJs', title: 'Official Campus Tour' })}
                    className="relative rounded-xl overflow-hidden bg-black aspect-video cursor-pointer group"
                  >
                    <img src="https://img.youtube.com/vi/rJKzHb76LJs/hqdefault.jpg" alt="Video" className="w-full h-full object-cover group-hover:scale-105 transition" />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg">
                        <Play className="w-5 h-5 fill-white ml-0.5" />
                      </div>
                    </div>
                  </div>
                  <div
                    onClick={() => setActiveVideo({ id: 'a69t-R5jZl0', title: 'Robotics & Experiential Science Lab' })}
                    className="relative rounded-xl overflow-hidden bg-black aspect-video cursor-pointer group"
                  >
                    <img src="https://img.youtube.com/vi/a69t-R5jZl0/hqdefault.jpg" alt="Video" className="w-full h-full object-cover group-hover:scale-105 transition" />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg">
                        <Play className="w-5 h-5 fill-white ml-0.5" />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 8: Photo Gallery */}
              <section id="gallery" className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-2xs scroll-mt-20">
                <h2 className="text-sm sm:text-base font-black text-slate-900 border-b pb-3 mb-4 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-indigo-600" />
                  <span>Campus Photo Gallery</span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {bannerPhotos.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setLightboxPhoto(img)}
                      className="h-24 sm:h-28 rounded-xl overflow-hidden border cursor-pointer hover:opacity-90 transition"
                    >
                      <img src={img} alt="Gallery" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </section>

              {/* SECTION 9: Map & Coordinates */}
              <section id="address" className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-2xs scroll-mt-20">
                <h2 className="text-sm sm:text-base font-black text-slate-900 border-b pb-3 mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-600" />
                  <span>Address & Driving Coordinates</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-2 text-slate-600">
                    <p><strong className="text-slate-900">Campus Address:</strong> {org.address || `${org.locality}, ${org.city}, ${org.state}`} - {org.pincode}</p>
                    <p><strong className="text-slate-900">Email:</strong> <a href={`mailto:${org.email}`} className="text-rose-500 font-bold hover:underline">{org.email}</a></p>
                    <p><strong className="text-slate-900">Helpline:</strong> {org.phone}</p>
                  </div>
                  <div className="h-36 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                    <iframe
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(org.name + ' ' + org.city)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
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

        {/* ── FLOATING MOBILE MENU PILL (DIRECTLY MATCHING SCREENSHOT 2 & 3) ── */}
        <div className="fixed bottom-5 right-4 z-50 lg:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="px-4 py-2.5 bg-black hover:bg-slate-800 text-white font-black text-xs rounded-full shadow-2xl flex items-center gap-2 border border-white/20 transition transform active:scale-95"
            aria-label="Open Section Jump Menu"
          >
            <MenuIcon className="w-4 h-4" />
            <span>Menu</span>
          </button>
        </div>

        {/* ── MOBILE MENU DRAWER SHEET ──────────────────────────────────────── */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center lg:hidden">
            <div className="bg-white rounded-t-3xl w-full max-h-[80vh] overflow-y-auto p-5 space-y-4 animate-in slide-in-from-bottom duration-200">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-black text-sm text-slate-900">Jump to School Section</h3>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-700">
                {[
                  { href: '#school_connect', label: 'School Connect', icon: MessageSquare },
                  { href: '#key_stats', label: 'Key School Stats', icon: ChartBar },
                  { href: '#poll_opinion', label: 'Poll & Opinion', icon: ChartBar },
                  { href: '#fee_structure', label: 'Fee Structure', icon: Wallet },
                  { href: '#vacancies', label: 'Careers & Jobs', icon: Briefcase },
                  { href: '#facilities', label: 'Facilities & Labs', icon: Wand2 },
                  { href: '#video_gallery', label: 'Video Tour', icon: Video },
                  { href: '#gallery', label: 'Photo Gallery', icon: ImageIcon },
                  { href: '#address', label: 'Location Map', icon: MapPin },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={idx}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-3 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 rounded-xl flex items-center gap-2 transition"
                    >
                      <Icon className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </a>
                  );
                })}
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsCallbackModalOpen(true);
                  }}
                  className="w-full py-3 bg-[#00875a] text-white font-black text-xs rounded-xl shadow-xs text-center"
                >
                  Request a Call Back
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── SHARE PROFILE MODAL ──────────────────────────────────────────── */}
        {isShareModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 transition-all">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
              <div className="bg-[#1e3a8a] p-5 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-white" />
                  <div>
                    <h3 className="font-bold text-sm leading-tight">Share School Profile</h3>
                    <p className="text-[11px] text-blue-200">Broadcast to parents & education network</p>
                  </div>
                </div>
                <button onClick={() => setIsShareModalOpen(false)} className="text-white/80 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 space-y-4 text-xs">
                {/* Social Share Grid */}
                <div className="grid grid-cols-3 gap-2.5 font-bold text-center">
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + currentShareUrl)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 flex flex-col items-center justify-center gap-1.5 transition"
                  >
                    <span className="text-lg">💬</span>
                    <span className="text-[11px]">WhatsApp</span>
                  </a>

                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentShareUrl)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 flex flex-col items-center justify-center gap-1.5 transition"
                  >
                    <span className="text-lg">in</span>
                    <span className="text-[11px]">LinkedIn</span>
                  </a>

                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentShareUrl)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-800 flex flex-col items-center justify-center gap-1.5 transition"
                  >
                    <span className="text-lg">f</span>
                    <span className="text-[11px]">Facebook</span>
                  </a>

                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentShareUrl)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-900 flex flex-col items-center justify-center gap-1.5 transition"
                  >
                    <span className="text-lg">𝕏</span>
                    <span className="text-[11px]">X / Twitter</span>
                  </a>

                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent(currentShareUrl)}&text=${encodeURIComponent(shareText)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-2xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 flex flex-col items-center justify-center gap-1.5 transition"
                  >
                    <span className="text-lg">✈️</span>
                    <span className="text-[11px]">Telegram</span>
                  </a>

                  <button
                    onClick={handleCopyLink}
                    className="p-3 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 flex flex-col items-center justify-center gap-1.5 transition"
                  >
                    <span className="text-lg">📷</span>
                    <span className="text-[11px]">Instagram Link</span>
                  </button>
                </div>

                {/* Copy URL Bar */}
                <div className="flex items-center gap-2 p-1.5 bg-slate-50 border rounded-xl">
                  <input
                    type="text"
                    readOnly
                    value={currentShareUrl}
                    className="w-full bg-transparent px-2 text-xs font-mono outline-none select-all truncate"
                  />
                  <button
                    onClick={handleCopyLink}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1 shrink-0 ${
                      copiedLink ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'
                    }`}
                  >
                    {copiedLink ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                  </button>
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
                <button onClick={() => setActiveVideo(null)} className="text-slate-400 hover:text-white">
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

        {/* ── CALLBACK / ENQUIRY MODAL ────────────────────────────────────── */}
        {isCallbackModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden">
              <div className="bg-[#002b4e] p-4 text-white flex items-center justify-between">
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
                <form onSubmit={handleCallbackSubmit} className="p-5 space-y-3 text-xs font-semibold">
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
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#00875a] hover:bg-[#00704a] text-white font-bold text-xs rounded-xl shadow-xs transition mt-2"
                  >
                    Confirm Callback Request
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ── POST A JOB MODAL ────────────────────────────────────────────── */}
        {isJobModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
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
                  <p className="text-xs text-slate-500">The vacancy is live on CSEEL EduNetwork.</p>
                </div>
              ) : (
                <form className="p-5 space-y-3 text-xs font-semibold" onSubmit={handleJobSubmit}>
                  <div>
                    <label className="block text-slate-600 mb-1">Position / Designation *</label>
                    <input
                      type="text"
                      required
                      value={jobModalForm.title}
                      onChange={(e) => setJobModalForm({ ...jobModalForm, title: e.target.value })}
                      placeholder="e.g. Senior Secondary Physics Faculty"
                      className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">Monthly Salary</label>
                    <input
                      type="text"
                      value={jobModalForm.salary}
                      onChange={(e) => setJobModalForm({ ...jobModalForm, salary: e.target.value })}
                      placeholder="e.g. ₹55,000 - ₹75,000 / mo"
                      className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900"
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

        {/* ── LIGHTBOX MODAL ──────────────────────────────────────────────── */}
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
    </PageTransition>
  );
}
