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
  Scale, Bell, Bookmark, Bot, Video, UserCheck, Key
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

  // Selected Class in Fee Structure
  const [selectedFeeClass, setSelectedFeeClass] = useState('nursery');

  // Fee calculation dynamically based on selected class
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
    'nursery': {
      label: 'Nursery',
      admission: 80000,
      security: 100000,
      tuitionQuarterly: 78000,
      annual: 24000,
      dev: 12000,
      totalFirstYear: 529000,
      monthlyAvg: 29000,
    },
    'lkg': {
      label: 'LKG',
      admission: 80000,
      security: 100000,
      tuitionQuarterly: 78000,
      annual: 24000,
      dev: 12000,
      totalFirstYear: 529000,
      monthlyAvg: 29000,
    },
    'ukg': {
      label: 'UKG',
      admission: 80000,
      security: 100000,
      tuitionQuarterly: 82000,
      annual: 26000,
      dev: 14000,
      totalFirstYear: 549000,
      monthlyAvg: 30600,
    },
    'c1': {
      label: 'Class 1 to 5',
      admission: 85000,
      security: 100000,
      tuitionQuarterly: 88000,
      annual: 28000,
      dev: 15000,
      totalFirstYear: 581000,
      monthlyAvg: 32900,
    },
    'c6': {
      label: 'Class 6 to 8',
      admission: 90000,
      security: 100000,
      tuitionQuarterly: 95000,
      annual: 34000,
      dev: 20000,
      totalFirstYear: 625000,
      monthlyAvg: 36100,
    },
    'c9': {
      label: 'Class 9 & 10',
      admission: 95000,
      security: 100000,
      tuitionQuarterly: 105000,
      annual: 40000,
      dev: 25000,
      totalFirstYear: 681000,
      monthlyAvg: 40400,
    },
    'c11': {
      label: 'Class 11 & 12 (IB DP)',
      admission: 100000,
      security: 100000,
      tuitionQuarterly: 125000,
      annual: 48000,
      dev: 30000,
      totalFirstYear: 779000,
      monthlyAvg: 48100,
    },
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
  const videoItems = [
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

  // Gallery
  const galleryPhotos = [
    org.bannerImage || "https://images.uniapply.com/uploads/college/image/500/2186/Building_UA_210909_112120.JPG",
    "https://images.uniapply.com/uploads/college/image/500/2186/Activity_room_UA_210909_112055.jpg",
    "https://images.uniapply.com/uploads/college/image/500/2186/Classroom_1_UA_210909_112131.jpg",
    "https://images.uniapply.com/uploads/college/image/500/2186/Library_UA_210909_112346.jpg"
  ];

  return (
    <PageTransition>
      <div className="bg-slate-100 text-slate-800 font-sans antialiased pb-28">

        {/* ── TOP SUB-HEADER BAR ──────────────────────────────────────────────── */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/edu-network" className="text-2xl font-black tracking-tight text-[#1e3a8a]">
                CSEEL<span className="text-rose-500">.EDU</span>
              </Link>
              <span className="hidden md:inline-flex items-center text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md font-medium border border-slate-200">
                <MapPin className="w-3.5 h-3.5 text-rose-500 mr-1" />
                <span>{org.locality || org.city}, {org.state}</span>
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <a
                href="#vacancies_tab"
                className="hidden sm:inline-flex items-center text-xs font-bold text-slate-600 hover:text-rose-500 transition gap-1"
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Careers ({jobsList.length} Openings)</span>
              </a>
              <button
                onClick={() => setIsJobModalOpen(true)}
                className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-xs transition flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Post a Job</span>
              </button>
              <button
                onClick={() => {
                  setAuthType('signin');
                  setIsAuthModalOpen(true);
                }}
                className="border border-[#1e40af] text-[#1e40af] hover:bg-blue-50 text-xs font-bold px-4 py-2 rounded-lg transition"
              >
                Sign In
              </button>
            </div>
          </div>
        </header>

        {/* ── HERO BANNER WITH OVERLAPPING SCHOOL CARD ────────────────────────── */}
        <div className="relative bg-slate-900 text-white">
          <div className="h-60 sm:h-72 w-full overflow-hidden relative">
            <img
              src={org.bannerImage || "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1600&q=80"}
              alt="Campus Banner"
              className="w-full h-full object-cover opacity-35"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/30"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative -mt-20 bg-white text-slate-800 rounded-2xl shadow-xl border border-slate-200 p-5 sm:p-7">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                
                {/* Left School Info */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  <img
                    src={org.logo || "https://images.uniapply.com/uploads/college/image/logo/2186/KRMGS_L_220920_174918.jpg"}
                    alt={org.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl border-2 border-slate-100 bg-white p-1 object-contain shadow-xs shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                        {org.name} <span className="text-slate-400 font-normal text-lg sm:text-xl">({(org as any).shortName || 'KRMGS'})</span>
                      </h1>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Verified Institution
                      </span>
                    </div>
                    <p className="text-slate-500 text-xs sm:text-sm mt-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span>{org.address || `${org.locality}, ${org.city}, ${org.state}`} - {org.pincode}</span>
                    </p>
                    
                    {/* Quick Metadata Chips */}
                    <div className="flex flex-wrap gap-2 mt-3 text-xs font-medium">
                      <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200 font-semibold">
                        <strong>Board:</strong> {org.board || 'IB (International Baccalaureate)'}
                      </span>
                      <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200 font-semibold">
                        <strong>UDISE Code:</strong> 07090300124
                      </span>
                      <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200">
                        <strong>Format:</strong> Day School (Co-Ed)
                      </span>
                      <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200">
                        <strong>Session:</strong> 2027-2028 Admissions Open
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Ratings & Actions */}
                <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-4 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100 shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="bg-amber-500 text-white font-extrabold text-base px-3 py-1 rounded-lg flex items-center gap-1">
                      <span>{org.rating || '4.8'}</span>
                      <Star className="w-3.5 h-3.5 fill-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-slate-800">{org.reviews || 142} Reviews</p>
                      <p className="text-[11px] text-slate-400 font-medium">Ranked #2 IB in Delhi</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsNotified(!isNotified)}
                      className={`px-3.5 py-2 border rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                        isNotified ? 'bg-blue-50 border-blue-200 text-blue-600' : 'border-slate-300 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <Bell className={`w-3.5 h-3.5 ${isNotified ? 'fill-blue-600' : ''}`} />
                      <span>{isNotified ? 'Notified' : 'Notify Me'}</span>
                    </button>
                    <button
                      onClick={() => setIsCallbackModalOpen(true)}
                      className="px-4 py-2 bg-[#1e3a8a] hover:bg-[#11224d] text-white rounded-lg text-xs font-bold transition shadow-xs"
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
            
            {/* ── LEFT SIDEBAR ────────────────────────────────────────────────── */}
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

              {/* ── SECTIONS NAVIGATION MENU ── */}
              <nav className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs" id="sidebarMenu">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-3 mb-2">School Sections</p>
                <ul className="space-y-1 text-xs font-semibold text-slate-600">
                  <li>
                    <a href="#school_connect_tab" className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-[#1e3a8a] transition">
                      <MessageSquare className="w-4 h-4 text-rose-500" />
                      <span>School Connect</span>
                    </a>
                  </li>
                  <li>
                    <a href="#key_stats_tab" className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-[#1e3a8a] transition">
                      <ChartBar className="w-4 h-4 text-blue-600" />
                      <span>Key School Stats</span>
                    </a>
                  </li>
                  <li>
                    <a href="#fee_structure_tab" className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-[#1e3a8a] transition">
                      <Wallet className="w-4 h-4 text-emerald-600" />
                      <span>Class-wise Fees</span>
                    </a>
                  </li>
                  <li>
                    <a href="#vacancies_tab" className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-rose-50 text-rose-600 font-bold">
                      <Briefcase className="w-4 h-4 text-rose-500" />
                      <span>Vacancies & Careers</span>
                    </a>
                  </li>
                  <li>
                    <a href="#insights_locked_tab" className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-[#1e3a8a] transition">
                      <span className="flex items-center gap-2.5">
                        <Lock className="w-4 h-4 text-amber-500" />
                        <span>Parent Insights</span>
                      </span>
                      <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">Lock</span>
                    </a>
                  </li>
                  <li>
                    <a href="#facilities_tab" className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-[#1e3a8a] transition">
                      <Wand2 className="w-4 h-4 text-sky-600" />
                      <span>Labs & Facilities</span>
                    </a>
                  </li>
                  <li>
                    <a href="#video_gallery_tab" className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-red-50 text-red-600 font-bold">
                      <Video className="w-4 h-4 text-red-600" />
                      <span>Video Gallery & Tour</span>
                    </a>
                  </li>
                  <li>
                    <a href="#gallery_tab" className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-[#1e3a8a] transition">
                      <ImageIcon className="w-4 h-4 text-indigo-600" />
                      <span>Photo Gallery</span>
                    </a>
                  </li>
                  <li>
                    <a href="#address_tab" className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-[#1e3a8a] transition">
                      <MapPin className="w-4 h-4 text-rose-600" />
                      <span>Map & Contact</span>
                    </a>
                  </li>
                </ul>
              </nav>

              {/* ── FROM PRINCIPAL'S DESK ── */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs text-xs">
                <p className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-2">From Principal's Desk</p>
                <div className="flex items-center gap-2.5 mb-2">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80"
                    alt="Principal"
                    className="w-10 h-10 rounded-full object-cover border border-rose-400"
                  />
                  <div>
                    <p className="font-bold text-slate-800">Dr. Sunita Kapoor</p>
                    <p className="text-[10px] text-slate-400 font-medium">Principal (Ph.D, M.Ed)</p>
                  </div>
                </div>
                <p className="text-slate-600 italic leading-relaxed text-[11px] border-l-2 border-rose-500 pl-2">
                  "We inspire holistic global education by instilling critical inquiries, creativity, and empathy in every learner."
                </p>
              </div>

            </aside>

            {/* ── RIGHT MAIN CONTENT ──────────────────────────────────────────── */}
            <div className="lg:col-span-3 space-y-8 min-w-0">
              
              {/* SECTION 1: School Connect & Enquiry */}
              <section id="school_connect_tab" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs scroll-mt-20">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#1e3a8a]" />
                    <span>School Connect & Enquiry</span>
                  </h2>
                  <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Quick Response Available
                  </span>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
                    Curious about 2027-2028 admission batches, seat eligibility, or IB fee concessions? Submit an enquiry to connect directly with the admissions directorate.
                  </p>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => setIsNotified(!isNotified)}
                      className="px-3.5 py-2 border border-slate-300 hover:bg-white text-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1"
                    >
                      <Bell className="w-3.5 h-3.5" />
                      <span>Notify</span>
                    </button>
                    <button
                      onClick={() => setIsCallbackModalOpen(true)}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition shadow-xs"
                    >
                      Enquire Now
                    </button>
                  </div>
                </div>
              </section>

              {/* SECTION 2: Key Institutional Stats */}
              <section id="key_stats_tab" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs scroll-mt-20">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <ChartBar className="w-4 h-4 text-[#1e3a8a]" />
                    <span>Key Institutional Stats</span>
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
                    <span className="text-sm font-bold text-slate-900">5.0 Acres (Urban)</span>
                  </div>
                  <div className="p-3.5 bg-slate-50 border rounded-xl">
                    <span className="text-slate-400 block font-medium">Student-Faculty Ratio</span>
                    <span className="text-sm font-bold text-slate-900">12 : 1 (Delhi Avg: 22:1)</span>
                  </div>
                </div>
              </section>

              {/* SECTION 3: Fee Structure Details */}
              <section id="fee_structure_tab" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs scroll-mt-20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 mb-5 gap-3">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-[#1e3a8a]" />
                      <span>Fee Structure Details</span>
                    </h2>
                    <p className="text-xs text-slate-400">Class-wise breakdown for active session 2027-2028</p>
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
                      <option value="c1">Class 1 to 5</option>
                      <option value="c6">Class 6 to 8</option>
                      <option value="c9">Class 9 & 10</option>
                      <option value="c11">Class 11 & 12 (IB DP)</option>
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

              {/* SECTION 4: School Careers & Job Vacancies */}
              <section id="vacancies_tab" className="bg-white border-2 border-rose-200 rounded-2xl p-6 shadow-xs scroll-mt-20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 mb-5 gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-rose-500" />
                        <span>School Careers & Job Vacancies</span>
                      </h2>
                      <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-full">Recruiting</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">Explore open positions for Teaching Faculty and Non-Teaching Administration</p>
                  </div>
                  
                  <button
                    onClick={() => setIsJobModalOpen(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Post a Job</span>
                  </button>
                </div>

                <div className="flex border-b border-slate-200 text-xs font-bold mb-5 gap-6">
                  <button
                    onClick={() => setActiveJobTab('current')}
                    className={`pb-2.5 border-b-2 transition ${
                      activeJobTab === 'current' ? 'border-rose-500 text-rose-500' : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Current Vacancies ({jobsList.length} Active)
                  </button>
                  <button
                    onClick={() => setActiveJobTab('past')}
                    className={`pb-2.5 border-b-2 transition ${
                      activeJobTab === 'past' ? 'border-rose-500 text-rose-500' : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Past / Closed Positions (8 Archived)
                  </button>
                </div>

                {activeJobTab === 'current' ? (
                  <div className="space-y-3.5 text-xs">
                    {jobsList.map((job) => (
                      <div
                        key={job.id}
                        className="p-4 border rounded-xl bg-slate-50 hover:border-rose-300 transition"
                      >
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-extrabold text-slate-900 text-sm">{job.title}</h3>
                              <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2.5 py-0.5 rounded border border-blue-200 uppercase">
                                {job.jobTypeCategory || 'Teaching'}
                              </span>
                            </div>
                            <p className="text-slate-500 mt-1">
                              <Clock className="w-3 h-3 inline mr-1" /> {job.roleType || 'Full-Time'} |{' '}
                              <Award className="w-3 h-3 inline mr-1" /> {job.qualifications || 'M.Sc / B.Ed with IB Certification'} |{' '}
                              <span className="font-bold text-slate-700">{job.salary}</span>
                            </p>
                          </div>
                          <button
                            onClick={() => setSelectedJobToApply(job)}
                            className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-4 py-2 rounded-lg shadow-xs transition self-start sm:self-center shrink-0"
                          >
                            Apply Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3 text-xs">
                    <div className="p-3.5 border rounded-xl bg-slate-100/70 opacity-75">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-bold text-slate-700">TGT English & Literature Faculty</h4>
                          <p className="text-slate-400 text-[11px] mt-0.5">Closed on: Dec 2025 • Teaching Role</p>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-600">Position Filled</span>
                      </div>
                    </div>
                  </div>
                )}
              </section>

              {/* SECTION 5: Parent Insights & Salary Trends (Locked Member Only Data) */}
              <section id="insights_locked_tab" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs relative overflow-hidden scroll-mt-20">
                <div className="flex items-center justify-between border-b pb-3 mb-4">
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <ChartBar className="w-4 h-4 text-[#1e3a8a]" />
                    <span>Parent Insights & Salary Trends</span>
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

              {/* SECTION 6: Labs & Facilities */}
              <section id="facilities_tab" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs scroll-mt-20">
                <h2 className="text-base font-bold text-slate-900 border-b pb-3 mb-5 flex items-center gap-2">
                  <Wand2 className="w-4 h-4 text-[#1e3a8a]" />
                  <span>Infrastructure, Specialized Labs & Sports</span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 border rounded-xl bg-slate-50 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-sky-500 shrink-0" />
                    <span>AC Smart Classrooms</span>
                  </div>
                  <div className="p-3 border rounded-xl bg-slate-50 flex items-center gap-2">
                    <Bot className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>Robotics & AI Labs</span>
                  </div>
                  <div className="p-3 border rounded-xl bg-slate-50 flex items-center gap-2">
                    <Microscope className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Integrated Science Lab</span>
                  </div>
                  <div className="p-3 border rounded-xl bg-slate-50 flex items-center gap-2">
                    <Laptop className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>High-Speed Tech Lab</span>
                  </div>
                  <div className="p-3 border rounded-xl bg-slate-50 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0" />
                    <span>All-Weather Pool</span>
                  </div>
                  <div className="p-3 border rounded-xl bg-slate-50 flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>Horse Riding Field</span>
                  </div>
                  <div className="p-3 border rounded-xl bg-slate-50 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                    <span>Indoor Shooting Range</span>
                  </div>
                  <div className="p-3 border rounded-xl bg-slate-50 flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-orange-500 shrink-0" />
                    <span>GPS Monitored Buses</span>
                  </div>
                  <div className="p-3 border rounded-xl bg-slate-50 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>Ramp & Elevator Access</span>
                  </div>
                </div>
              </section>

              {/* SECTION 7: Video Gallery & Virtual Tours */}
              <section id="video_gallery_tab" className="bg-white border-2 border-red-100 rounded-2xl p-6 shadow-xs scroll-mt-20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 mb-5 gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Video className="w-4 h-4 text-red-600" />
                        <span>Video Gallery & Virtual Tours</span>
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

              {/* SECTION 8: Campus Photo Gallery */}
              <section id="gallery_tab" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs scroll-mt-20">
                <h2 className="text-base font-bold text-slate-900 border-b pb-3 mb-4 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#1e3a8a]" />
                  <span>Campus Photo Gallery</span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {galleryPhotos.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setLightboxPhoto(img)}
                      className="h-28 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 cursor-pointer group relative"
                    >
                      <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" alt="Campus Photo" />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                        <Maximize2 className="w-4 h-4" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* SECTION 9: Campus Location & Driving Coordinates */}
              <section id="address_tab" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs scroll-mt-20">
                <h2 className="text-base font-bold text-slate-900 border-b pb-3 mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#1e3a8a]" />
                  <span>Campus Location & Driving Coordinates</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  <div className="space-y-3 text-slate-600">
                    <p><strong className="text-slate-900">Campus Address:</strong> {org.address || `${org.locality}, ${org.city}, ${org.state}`} - {org.pincode}</p>
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
                  <div className="h-40 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner">
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

        {/* ── VIDEO PLAYER MODAL ────────────────────────────────────────────── */}
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
    </PageTransition>
  );
}
