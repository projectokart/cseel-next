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
  Scale, Bell, Bookmark
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

  // Selected Class in Fee Structure & Admission Criteria
  const [selectedFeeClass, setSelectedFeeClass] = useState('Nursery');
  const [selectedAdmissionSession, setSelectedAdmissionSession] = useState('2027-2028');

  // Fee calculation dynamically based on selected class
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
  const [pollResponses, setPollResponses] = useState<Record<string, string>>({});
  const [pollCounts, setPollCounts] = useState({
    vfm: 124,
    applyMode: 126,
    transparent: 55,
    likeMost: 29,
  });

  const handleVote = (pollId: string, answer: string) => {
    setPollResponses((prev) => ({ ...prev, [pollId]: answer }));
    if (pollId === 'vfm') setPollCounts((c) => ({ ...c, vfm: c.vfm + 1 }));
    if (pollId === 'applyMode') setPollCounts((c) => ({ ...c, applyMode: c.applyMode + 1 }));
    if (pollId === 'transparent') setPollCounts((c) => ({ ...c, transparent: c.transparent + 1 }));
    if (pollId === 'likeMost') setPollCounts((c) => ({ ...c, likeMost: c.likeMost + 1 }));
  };

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
        title: 'Senior STEM Practical Instructor',
        subject: 'Physics' as const,
        roleType: 'Full-Time' as const,
        jobTypeCategory: 'Teaching Faculty',
        jobShift: 'Day shift (8:00 AM – 3:30 PM)',
        city: org.city,
        state: org.state,
        pincode: org.pincode,
        address: org.address,
        salary: '₹60,000 - ₹95,000 a month',
        salaryNumMin: 60000,
        salaryNumMax: 95000,
        experienceRequired: '2-5 Years',
        qualifications: 'M.Sc / B.Ed with Hands-on Science Lab Experience',
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
        requirements: ['Minimum 2 years teaching experience', 'Strong experimental apparatus mastery'],
        verified: true,
      },
      {
        id: `job-${org.id}-2`,
        orgId: org.id,
        orgName: org.name,
        orgLogo: org.logo,
        orgRating: org.rating,
        title: 'Senior Admission Counselor & Relations Lead',
        subject: 'Robotics & AI' as const,
        roleType: 'Full-Time' as const,
        jobTypeCategory: 'Non-Teaching',
        jobShift: 'Day shift',
        city: org.city,
        state: org.state,
        pincode: org.pincode,
        address: org.address,
        salary: '₹50,000 - ₹75,000 a month',
        salaryNumMin: 50000,
        salaryNumMax: 75000,
        experienceRequired: '2-5 Years',
        qualifications: 'Post-Graduate / MBA with CRM mastery',
        openings: 2,
        postedDate: '5 days ago',
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

  // Modals state
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [jobModalForm, setJobModalForm] = useState({ title: '', department: 'Teaching', requirements: '', salary: '₹60,000 - ₹95,000 a month' });
  const [jobModalSuccess, setJobModalSuccess] = useState(false);

  const [selectedJobToApply, setSelectedJobToApply] = useState<EduJobItem | null>(null);
  const [applyModalForm, setApplyModalForm] = useState({ name: '', email: '', phone: '', experience: '3 Years', message: '' });
  const [applySuccess, setApplySuccess] = useState(false);

  const [isCallbackModalOpen, setIsCallbackModalOpen] = useState(false);
  const [callbackForm, setCallbackForm] = useState({ parentName: '', phone: '', grade: 'Class 9', preferredTime: 'Morning (9 AM - 12 PM)' });
  const [callbackSuccess, setCallbackSuccess] = useState(false);

  const [isVirtualTourModalOpen, setIsVirtualTourModalOpen] = useState(false);
  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);
  const [isShortlisted, setIsShortlisted] = useState(false);
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
      jobTypeCategory: jobModalForm.department === 'Teaching' ? 'Teaching Faculty' : 'Non-Teaching',
      jobShift: 'Day shift',
      city: org.city,
      state: org.state,
      pincode: org.pincode,
      address: org.address,
      salary: jobModalForm.salary,
      salaryNumMin: 60000,
      salaryNumMax: 95000,
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
      setJobModalForm({ title: '', department: 'Teaching', requirements: '', salary: '₹60,000 - ₹95,000 a month' });
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

  // Comparisons List
  const comparisonSchools = [
    { id: '1899', name: 'K.R. Mangalam World School', locality: 'Greater Kailash 2, Delhi', logo: 'https://images.uniapply.com/uploads/college/image/logo/2186/K_R_Manglam_World_School_1899_Logo_1.jpg' },
    { id: '1911', name: 'Don Bosco School', locality: 'Gangotri Enclave, Alaknanda, Delhi', logo: 'https://images.uniapply.com/uploads/college/image/logo/2186/Don_Bosco_School_1911_Logo_1.jpg' },
    { id: '2720', name: 'Paul George Global School', locality: 'Alaknanda, Delhi', logo: 'https://images.uniapply.com/uploads/college/image/logo/2186/Logo_UA_210227_171535.jpg' },
    { id: '5319', name: 'The Ardee School', locality: 'New Friends Colony, Delhi', logo: 'https://images.uniapply.com/uploads/college/image/logo/2186/as_211019_185427.jpg' },
    { id: '1909', name: 'Tagore International School', locality: 'East Of Kailash, Delhi', logo: 'https://images.uniapply.com/uploads/college/image/logo/2186/Tagore_International_School_1909_Logo_1.jpg' },
    { id: '5516', name: 'Apeejay School International', locality: 'Panchsheel Park, Delhi', logo: 'https://images.uniapply.com/uploads/college/image/logo/2184/apeejayintlogo_251118_120240.jpg' }
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
      <div className="bg-slate-50 text-slate-800 font-sans antialiased pb-28">

        {/* ── BREADCRUMB HEADER BANNER ────────────────────────────────────────── */}
        <div
          className="relative bg-cover bg-center text-white"
          style={{ backgroundImage: `url(${org.bannerImage || 'https://cdn.uniapply.com/assets/v1/d/images/main/school-min.7f08d2e34878.jpg'})` }}
        >
          <div className="bg-gradient-to-r from-slate-950/90 via-slate-900/80 to-slate-950/90 py-6 px-4">
            <div className="max-w-7xl mx-auto space-y-4">
              
              {/* Breadcrumb */}
              <nav className="flex items-center gap-1.5 text-xs text-slate-300 flex-wrap">
                <Link href="/" className="hover:text-white transition">Home</Link>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <Link href="/edu-network" className="hover:text-white transition">EduNetwork</Link>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <Link href="/edu-network/organisation/school" className="hover:text-white transition">Organisation</Link>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <Link href={`/edu-network/organisation/school/schools-in-${org.city.toLowerCase()}`} className="hover:text-white transition">{org.city}</Link>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-bold text-white">{org.name}, {org.locality || org.city}</span>
              </nav>

              {/* School Highlight Card in Banner */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  <div className="w-24 h-24 rounded-2xl bg-white p-2 border-2 border-white/20 shadow-xl shrink-0 flex items-center justify-center">
                    <img
                      src={org.logo || "https://images.uniapply.com/uploads/college/image/logo/2186/KRMGS_L_220920_174918.jpg"}
                      alt={org.name}
                      className="w-full h-full object-contain rounded-xl"
                    />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
                      {org.name} <small className="text-slate-300 text-lg font-bold">({org.board})</small>, {org.locality || org.city}
                    </h1>
                    <div className="flex items-center gap-3 mt-2 flex-wrap text-xs text-slate-300">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>{org.address || `${org.locality}, ${org.city}, ${org.state}`} - {org.pincode}</span>
                      </span>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(org.name + ' ' + org.city)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold border border-white/20 flex items-center gap-1 transition"
                      >
                        <Navigation className="w-3 h-3" />
                        <span>Show on map</span>
                      </a>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Eye className="w-3.5 h-3.5" />
                        <span>46,284 views</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Verified Badge Header Box */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div className="px-3.5 py-1.5 bg-emerald-500/20 border border-emerald-400/30 rounded-xl text-emerald-300 text-xs font-black flex items-center gap-1.5 shadow-sm">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Verified Entity by Authority</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 text-sm font-black flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400" />
                      <span>{org.rating} / 5</span>
                    </span>
                    <span className="text-xs text-slate-400 font-medium">({org.reviews} reviews)</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ── STICKY QUICK ACTION BAR (Dropdown, Call Back, Compare, Notify) ── */}
        <div className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs px-4 py-2.5">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="font-bold text-slate-500 hidden md:inline">Admission For:</span>
              <select
                value={selectedFeeClass}
                onChange={(e) => setSelectedFeeClass(e.target.value)}
                className="p-2 border border-slate-300 rounded-xl bg-slate-50 font-bold text-slate-800 text-xs focus:outline-none focus:border-blue-600"
              >
                {Object.keys(classFeeMultiplier).map((cls) => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
              <span className="text-emerald-700 font-black px-2 py-0.5 bg-emerald-50 border border-emerald-200 rounded-lg">
                Admission 2027-2028 Active
              </span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
              <button
                onClick={() => setIsCallbackModalOpen(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Request a Call Back</span>
              </button>

              <button
                onClick={() => setIsShortlisted(!isShortlisted)}
                className={`px-3 py-2 border rounded-xl font-bold flex items-center gap-1.5 transition ${
                  isShortlisted ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isShortlisted ? 'fill-rose-600' : ''}`} />
                <span>{isShortlisted ? 'Shortlisted' : 'Shortlist'}</span>
              </button>

              <button
                onClick={() => setIsNotified(!isNotified)}
                className={`px-3 py-2 border rounded-xl font-bold flex items-center gap-1.5 transition ${
                  isNotified ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Bell className={`w-3.5 h-3.5 ${isNotified ? 'fill-blue-600' : ''}`} />
                <span>{isNotified ? 'Notified' : 'Notify Me'}</span>
              </button>

              <button
                onClick={() => setIsJobModalOpen(true)}
                className="px-3.5 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl shadow-xs flex items-center gap-1 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Post a Job</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── 2-COLUMN MAIN CONTENT (STICKY NAV + ALL DETAILED SECTIONS) ──────── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* ── LEFT STICKY QUICK NAVIGATION & VERIFICATION WIDGETS ── */}
            <aside className="w-full lg:w-72 shrink-0 lg:sticky lg:top-20 space-y-5">
              
              {/* ── USER REQUESTED WIDGET 1: CSEEL VERIFIED CAMPUS CARD ── */}
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600 shrink-0 shadow-2xs">
                    <ShieldCheck className="w-5 h-5 text-cyan-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 leading-tight">CSEEL VERIFIED CAMPUS</h4>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">Government & Board Certified</p>
                  </div>
                </div>

                <hr className="border-slate-100" />

                <div className="space-y-2.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2.5">
                    <Globe className="w-4 h-4 text-cyan-600 shrink-0" />
                    <a
                      href={org.website || "https://greenwoodhighinternational-campus56.edu"}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-700 font-bold hover:underline truncate block"
                    >
                      {org.website || "https://greenwoodhighinternational-campus56.edu"}
                    </a>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                    <a href={`mailto:${org.email}`} className="text-slate-600 hover:text-slate-900 truncate block">
                      {org.email || "contact.campus56@greenwoodhighinternational.edu"}
                    </a>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-purple-600 shrink-0" />
                    <a href={`tel:${org.phone}`} className="text-slate-700 font-bold">
                      {org.phone || "+91 80 2981056"}
                    </a>
                  </div>
                </div>

                <button
                  onClick={() => setIsCallbackModalOpen(true)}
                  className="w-full py-3 bg-[#002b4e] hover:bg-[#003b6d] text-white font-black text-xs rounded-xl shadow-xs transition-all text-center block"
                >
                  Send Official Inquiry
                </button>
              </div>

              {/* ── USER REQUESTED WIDGET 2: ACTIVE JOBS (INDEED PORTAL STYLE) ── */}
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-5 space-y-3">
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

                {jobsList.slice(0, 2).map((job) => (
                  <div key={job.id} className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl space-y-2">
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
                      className="w-full py-2 bg-white hover:bg-slate-50 text-blue-600 border border-blue-200 hover:border-blue-400 font-bold text-xs rounded-xl shadow-2xs transition-all text-center"
                    >
                      Apply with Resume
                    </button>
                  </div>
                ))}
              </div>

              {/* ── SECTIONS NAVIGATION NAV ── */}
              <nav className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs" id="mainNav">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">Sections</p>
                <ul className="space-y-1 text-xs font-semibold text-slate-600">
                  <li>
                    <a href="#online_application_form_tab" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-blue-50 hover:text-blue-700 transition">
                      <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                      <span>School Connect</span>
                    </a>
                  </li>
                  <li>
                    <a href="#key_school_stats_tab" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-blue-50 hover:text-blue-700 transition">
                      <ChartBar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Key School Stats</span>
                    </a>
                  </li>
                  <li>
                    <a href="#tuition_and_cost_tab" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-blue-50 hover:text-blue-700 transition">
                      <Wallet className="w-3.5 h-3.5 text-slate-400" />
                      <span>Fee Structure</span>
                    </a>
                  </li>
                  <li>
                    <a href="#virtual_tour_tab" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-blue-50 hover:text-blue-700 transition">
                      <Play className="w-3.5 h-3.5 text-slate-400" />
                      <span>Campus Tour</span>
                    </a>
                  </li>
                  <li>
                    <a href="#academics_stats_tab" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-blue-50 hover:text-blue-700 transition">
                      <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                      <span>Academic Stats</span>
                    </a>
                  </li>
                  <li>
                    <a href="#admission_timeline_tab" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-blue-50 hover:text-blue-700 transition">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Admission Dates</span>
                    </a>
                  </li>
                  <li>
                    <a href="#admission_detail_and_eigibility_tab" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-blue-50 hover:text-blue-700 transition">
                      <CheckSquare className="w-3.5 h-3.5 text-slate-400" />
                      <span>Criteria & Eligibility</span>
                    </a>
                  </li>
                  <li>
                    <a href="#hall_of_fame_tab" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-blue-50 hover:text-blue-700 transition">
                      <Award className="w-3.5 h-3.5 text-slate-400" />
                      <span>Hall of Fame</span>
                    </a>
                  </li>
                  <li>
                    <a href="#facilities_tab" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-blue-50 hover:text-blue-700 transition">
                      <Wand2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Facilities & Labs</span>
                    </a>
                  </li>
                  <li>
                    <a href="#vacancies_section" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition text-rose-600 font-bold">
                      <Briefcase className="w-3.5 h-3.5 text-rose-500" />
                      <span>Careers & Vacancies</span>
                    </a>
                  </li>
                  <li>
                    <a href="#popular_comparison" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-blue-50 hover:text-blue-700 transition">
                      <Scale className="w-3.5 h-3.5 text-slate-400" />
                      <span>Comparisons</span>
                    </a>
                  </li>
                  <li>
                    <a href="#galary_tab" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-blue-50 hover:text-blue-700 transition">
                      <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                      <span>Media Gallery</span>
                    </a>
                  </li>
                  <li>
                    <a href="#address_tab" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-blue-50 hover:text-blue-700 transition">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>Address & Contact</span>
                    </a>
                  </li>
                </ul>
              </nav>
            </aside>

            {/* ── RIGHT MAIN CONTENT SECTIONS ── */}
            <div className="flex-1 space-y-8 w-full min-w-0">
              
              {/* SECTION 1: School Connect */}
              <section id="online_application_form_tab" className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs scroll-mt-20">
                <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                    <span>School Connect</span>
                  </div>
                </h2>
                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <p className="text-xs text-slate-600 max-w-md leading-relaxed">
                    Curious about admissions? Enquire now and get answers straight from {org.name}'s admission desk.
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsCallbackModalOpen(true)}
                      className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow-xs transition"
                    >
                      Enquire Now
                    </button>
                    <button
                      onClick={() => setIsCallbackModalOpen(true)}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Callback</span>
                    </button>
                  </div>
                </div>
              </section>

              {/* SECTION 2: Key School Stats */}
              <section id="key_school_stats_tab" className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs scroll-mt-20">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <ChartBar className="w-4 h-4 text-blue-600" />
                    <span>Key School Stats</span>
                  </h2>
                  <button
                    onClick={() => alert(`Downloading official brochure of ${org.name}...`)}
                    className="px-3 py-1.5 border border-blue-200 text-blue-700 hover:bg-blue-50 font-bold text-xs rounded-xl flex items-center gap-1 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Brochure</span>
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 border border-slate-200/80 rounded-xl bg-slate-50/50">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wide">Ownership</span>
                    <span className="font-bold text-slate-900 text-sm">Private</span>
                  </div>
                  <div className="p-3 border border-slate-200/80 rounded-xl bg-slate-50/50">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wide">Board</span>
                    <span className="font-bold text-slate-900 text-sm">{org.board || 'IB'}</span>
                  </div>
                  <div className="p-3 border border-slate-200/80 rounded-xl bg-slate-50/50">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wide">Year of Establishment</span>
                    <span className="font-bold text-slate-900 text-sm">{org.established || '2018'}</span>
                  </div>
                  <div className="p-3 border border-slate-200/80 rounded-xl bg-slate-50/50">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wide">Co-Ed Status</span>
                    <span className="font-bold text-slate-900 text-sm">Co-Education</span>
                  </div>
                  <div className="p-3 border border-slate-200/80 rounded-xl bg-slate-50/50">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wide">Campus Size</span>
                    <span className="font-bold text-slate-900 text-sm">5 Acres</span>
                  </div>
                  <div className="p-3 border border-slate-200/80 rounded-xl bg-slate-50/50">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wide">Campus Type</span>
                    <span className="font-bold text-slate-900 text-sm">Urban</span>
                  </div>
                </div>
              </section>

              {/* POLL 1: Poll & Opinion */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ChartBar className="w-3.5 h-3.5 text-blue-600" />
                  <span>Poll & Opinion</span>
                </h3>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
                  <div className="space-y-2 text-center md:text-left">
                    <h4 className="font-black text-slate-900 text-sm">Do you think admissions here are value for money?</h4>
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                      {['Yes', 'No', 'Not Sure'].map((opt) => (
                        <button
                          key={opt}
                          onClick={() => handleVote('vfm', opt)}
                          className={`px-3.5 py-1.5 rounded-xl font-bold border transition ${
                            pollResponses['vfm'] === opt
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-400">Submit your response to view opinions of other parents.</p>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-center shrink-0">
                    <span className="text-xl font-black text-blue-700">{pollCounts.vfm}</span>
                    <p className="text-[10px] text-slate-600 font-medium">Parents shared their opinion</p>
                  </div>
                </div>
              </div>

              {/* SECTION 3: Detailed Fee Breakup (UniApply Table & Calculators) */}
              <section id="tuition_and_cost_tab" className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs scroll-mt-20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 mb-4 gap-2">
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-blue-600" />
                    <span>Fee Structure</span>
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-bold">Select Class:</span>
                    <select
                      value={selectedFeeClass}
                      onChange={(e) => setSelectedFeeClass(e.target.value)}
                      className="p-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                    >
                      {Object.keys(classFeeMultiplier).map((cls) => (
                        <option key={cls} value={cls}>{cls}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Left Summary Box */}
                  <div className="md:col-span-5 space-y-4">
                    <div className="p-4 border border-slate-200 rounded-2xl bg-slate-50 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Cost for a New Admission</span>
                      <div className="text-2xl font-black text-slate-900">
                        ₹{totalFirstYearCost.toLocaleString()}
                      </div>
                      <small className="text-slate-500 font-medium text-[11px] block">for first year (Class: {selectedFeeClass})</small>
                    </div>

                    <div className="p-4 border border-slate-200 rounded-2xl bg-slate-50 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Estimated Monthly Cost</span>
                      <div className="text-2xl font-black text-slate-900">
                        ₹{monthlyCostEstimate.toLocaleString()}
                      </div>
                      <small className="text-slate-500 font-medium text-[11px] block">Monthly rough estimate throughout the year</small>
                    </div>

                    {/* Cost Indexing */}
                    <div className="p-4 border border-slate-200 rounded-2xl bg-slate-50 space-y-2 text-xs">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Cost Indexing (Delhi Region)</span>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-500">Delhi Average:</span>
                          <span className="font-bold text-slate-900">₹4,377 / mo</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div className="bg-cyan-500 h-full w-[25%]"></div>
                        </div>
                        <div className="flex justify-between text-[11px] pt-1">
                          <span className="text-slate-500">This School:</span>
                          <span className="font-black text-blue-700">₹{monthlyCostEstimate.toLocaleString()} / mo</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div className="bg-blue-600 h-full w-[90%]"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Detailed Table */}
                  <div className="md:col-span-7">
                    <h3 className="text-xs font-bold text-slate-700 mb-2">
                      Fee Structure Breakdown for <span className="text-rose-500 font-black">{selectedFeeClass}</span>
                    </h3>
                    <div className="overflow-x-auto border border-slate-200 rounded-2xl overflow-hidden text-xs">
                      <table className="w-full text-left">
                        <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px]">
                          <tr>
                            <th className="p-3">Type</th>
                            <th className="p-3 text-right">Amount</th>
                            <th className="p-3">Frequency</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                          <tr>
                            <td className="p-2.5 font-bold text-slate-900">Registration Fees</td>
                            <td className="p-2.5 text-right font-bold">₹1,000</td>
                            <td className="p-2.5 text-slate-500">Onetime</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-bold text-slate-900">Admission Fees</td>
                            <td className="p-2.5 text-right font-bold">₹{currentFee.admission.toLocaleString()}</td>
                            <td className="p-2.5 text-slate-500">Onetime</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-bold text-slate-900">Tuition Fees</td>
                            <td className="p-2.5 text-right font-bold">₹{currentFee.tuition.toLocaleString()}</td>
                            <td className="p-2.5 text-slate-500">Quarterly</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-bold text-slate-900">Security Fees (Refundable)</td>
                            <td className="p-2.5 text-right font-bold">₹{currentFee.security.toLocaleString()}</td>
                            <td className="p-2.5 text-slate-500">Onetime</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-bold text-slate-900">Annual Fees</td>
                            <td className="p-2.5 text-right font-bold">₹{currentFee.annual.toLocaleString()}</td>
                            <td className="p-2.5 text-slate-500">Annually</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-bold text-slate-900">Development Fees</td>
                            <td className="p-2.5 text-right font-bold">₹{currentFee.dev.toLocaleString()}</td>
                            <td className="p-2.5 text-slate-500">Annually</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-bold text-slate-900">Transportation Fees</td>
                            <td className="p-2.5 text-right font-bold">₹{currentFee.transport.toLocaleString()}</td>
                            <td className="p-2.5 text-slate-500">Quarterly</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl mt-3 text-[11px] text-blue-900 space-y-1">
                      <strong className="font-bold block">Notes:</strong>
                      <p>• In 11th and 12th grade, Stream 1 refers to Diploma Programme and Stream 2 refers to Career Programme.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 4: Virtual Tour */}
              <section id="virtual_tour_tab" className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs scroll-mt-20">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl">
                  <div className="space-y-1">
                    <h2 className="text-base sm:text-lg font-black">Campus Video Walkthrough & Tour</h2>
                    <p className="text-xs text-slate-300">Explore the experiential STEM science laboratory and campus from the comfort of your home.</p>
                  </div>
                  <button
                    onClick={() => setIsVirtualTourModalOpen(true)}
                    className="px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 shrink-0 transition"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Watch Virtual Tour</span>
                  </button>
                </div>
              </section>

              {/* SECTION 5: Academic Stats */}
              <section id="academics_stats_tab" className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs scroll-mt-20">
                <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span>Academic Stats</span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 border border-slate-200/80 rounded-xl bg-slate-50/50">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wide">Classes Offered</span>
                    <span className="font-bold text-slate-900 text-sm">{org.classesOffered || 'Nursery - Class 12'}</span>
                  </div>
                  <div className="p-3 border border-slate-200/80 rounded-xl bg-slate-50/50">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wide">Language of Instruction</span>
                    <span className="font-bold text-slate-900 text-sm">English</span>
                  </div>
                  <div className="p-3 border border-slate-200/80 rounded-xl bg-slate-50/50">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wide">Academic Session</span>
                    <span className="font-bold text-slate-900 text-sm">April to March</span>
                  </div>
                  <div className="p-3 border border-slate-200/80 rounded-xl bg-slate-50/50">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wide">Student-Faculty Ratio</span>
                    <span className="font-bold text-blue-700 text-sm">{org.studentFacultyRatio || '12:1'}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Delhi City Ratio: 22:1</span>
                  </div>
                  <div className="p-3 border border-slate-200/80 rounded-xl bg-slate-50/50">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wide">Total Faculty</span>
                    <span className="font-bold text-slate-900 text-sm">17 Specialized Instructors</span>
                  </div>
                  <div className="p-3 border border-slate-200/80 rounded-xl bg-slate-50/50">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wide">School Format</span>
                    <span className="font-bold text-slate-900 text-sm">Day School</span>
                  </div>
                </div>
              </section>

              {/* SECTION 6: Admission Timeline & Dates */}
              <section id="admission_timeline_tab" className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs scroll-mt-20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 mb-4 gap-2">
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span>Admission Dates & Timeline</span>
                  </h2>
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedAdmissionSession}
                      onChange={(e) => setSelectedAdmissionSession(e.target.value)}
                      className="p-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
                    >
                      <option value="2027-2028">Session 2027-2028</option>
                      <option value="2026-2027">Session 2026-2027</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="font-black text-emerald-800 text-sm">Active Online Admissions Window</span>
                      <p className="text-slate-600 text-xs mt-0.5">Registration open for {selectedFeeClass} for academic session {selectedAdmissionSession}.</p>
                    </div>
                    <button
                      onClick={() => setIsCallbackModalOpen(true)}
                      className="px-3.5 py-1.5 bg-emerald-600 text-white font-bold rounded-xl shadow-xs text-xs"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              </section>

              {/* SECTION 7: Admission Criteria & Eligibility */}
              <section id="admission_detail_and_eigibility_tab" className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs scroll-mt-20">
                <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-blue-600" />
                  <span>Admission Criteria & Eligibility</span>
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs mb-6">
                  <div className="p-3 border border-slate-200/80 rounded-xl bg-slate-50">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Age Qualification</span>
                    <span className="font-bold text-slate-900">3 to 4 Years (as on 31 March)</span>
                  </div>
                  <div className="p-3 border border-slate-200/80 rounded-xl bg-slate-50">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Total Seats</span>
                    <span className="font-bold text-slate-900">90 Seats</span>
                  </div>
                  <div className="p-3 border border-slate-200/80 rounded-xl bg-slate-50">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Written Test</span>
                    <span className="font-bold text-slate-900">No (Interview Only)</span>
                  </div>
                  <div className="p-3 border border-slate-200/80 rounded-xl bg-slate-50">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Student Interaction</span>
                    <span className="font-bold text-emerald-700">Yes (Informal)</span>
                  </div>
                  <div className="p-3 border border-slate-200/80 rounded-xl bg-slate-50">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Parents Interaction</span>
                    <span className="font-bold text-emerald-700">Yes</span>
                  </div>
                  <div className="p-3 border border-slate-200/80 rounded-xl bg-slate-50">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">School Timings</span>
                    <span className="font-bold text-slate-900">08:00 AM – 01:00 PM</span>
                  </div>
                </div>

                {/* Documents Checklist */}
                <div>
                  <h3 className="text-xs font-bold text-slate-800 mb-2">Documents Required at Time of Application:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {[
                      'Transfer Certificate', 'Birth Certificate (Original & Copy)', 'Residence Proof (Electricity/Water bill)',
                      'Photograph - Child (4 passport size)', 'Photograph - Parents/Guardian', 'Marksheet/Report card of previous class',
                      'Medical Reports & Blood Group', 'Valid Passport / Aadhar Card - Child', 'Aadhar Card - Parents'
                    ].map((doc, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200/60 rounded-xl">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="text-slate-700">{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* SECTION 8: Hall of Fame & Awards */}
              <section id="hall_of_fame_tab" className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs scroll-mt-20">
                <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                  <Award className="w-4 h-4 text-blue-600" />
                  <span>Hall of Fame & Institutional Rankings</span>
                </h2>

                <div className="space-y-4 text-xs">
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Awards:</h3>
                    <div className="space-y-2">
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
                        <Award className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-slate-900 block">British Council International School Award (ISA)</span>
                          <p className="text-slate-500">Recognized for global experiential science curriculum integration by British Council.</p>
                        </div>
                      </div>
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
                        <Award className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-slate-900 block">CBSE Sports Excellence Award</span>
                          <p className="text-slate-500">Outstanding sports achievements in skating, swimming & martial arts.</p>
                        </div>
                      </div>
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
                        <Award className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-slate-900 block">Green School Award</span>
                          <p className="text-slate-500">Awarded for eco-friendly campus initiatives by TERI (The Energy and Resources Institute).</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Rankings:</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="p-3 bg-amber-50/50 border border-amber-200 rounded-xl">
                        <span className="font-black text-slate-900 block">Ranked No. 2 in Top IB Schools Delhi</span>
                        <p className="text-slate-500 text-[11px]">Times School Survey 2021</p>
                      </div>
                      <div className="p-3 bg-amber-50/50 border border-amber-200 rounded-xl">
                        <span className="font-black text-slate-900 block">Top 10 Schools in South Delhi</span>
                        <p className="text-slate-500 text-[11px]">Times of India Education 2023</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 9: Comprehensive Categorized Facilities (39 Facilities) */}
              <section id="facilities_tab" className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs scroll-mt-20">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Wand2 className="w-4 h-4 text-blue-600" />
                    <span>Campus Facilities (36/39 Available - 93%)</span>
                  </h2>
                  <div className="flex items-center gap-3 text-[11px] font-bold text-slate-500">
                    <span className="flex items-center gap-1 text-emerald-600"><CheckCircle2 className="w-3.5 h-3.5" /> Available</span>
                    <span className="flex items-center gap-1 text-rose-500"><X className="w-3.5 h-3.5" /> Not Available</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* Classroom */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                    <h4 className="font-black text-slate-900 flex items-center justify-between">
                      <span>Classrooms</span>
                      <span className="text-emerald-700 text-[10px]">100%</span>
                    </h4>
                    <ul className="space-y-1 text-slate-600">
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> AC Smart Classrooms</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Interactive Touch Boards</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> High-Speed Wi-Fi</li>
                    </ul>
                  </div>

                  {/* Labs */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                    <h4 className="font-black text-slate-900 flex items-center justify-between">
                      <span>Labs & Tech</span>
                      <span className="text-emerald-700 text-[10px]">100%</span>
                    </h4>
                    <ul className="space-y-1 text-slate-600">
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Experiential Science Lab</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Robotics & AI Tinkering Lab</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> High-Tech Computer Lab</li>
                    </ul>
                  </div>

                  {/* Safety */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                    <h4 className="font-black text-slate-900 flex items-center justify-between">
                      <span>Safety & Security</span>
                      <span className="text-emerald-700 text-[10px]">100%</span>
                    </h4>
                    <ul className="space-y-1 text-slate-600">
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 24x7 CCTV Surveillance</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> GPS Bus Fleet Tracking</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Student Gate Attendance App</li>
                    </ul>
                  </div>

                  {/* Sports */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                    <h4 className="font-black text-slate-900 flex items-center justify-between">
                      <span>Sports & Fitness</span>
                      <span className="text-emerald-700 text-[10px]">89%</span>
                    </h4>
                    <ul className="space-y-1 text-slate-600">
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Swimming Pool Block</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Skating Rink & Horse Riding</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Indoor Sports Arena & Gym</li>
                    </ul>
                  </div>

                  {/* Infrastructure */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                    <h4 className="font-black text-slate-900 flex items-center justify-between">
                      <span>Infrastructure</span>
                      <span className="text-emerald-700 text-[10px]">100%</span>
                    </h4>
                    <ul className="space-y-1 text-slate-600">
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Central Auditorium (500 pax)</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Modern Cafeteria / Canteen</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 10,000+ Volumes Library</li>
                    </ul>
                  </div>

                  {/* Disabled Friendly */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                    <h4 className="font-black text-slate-900 flex items-center justify-between">
                      <span>Inclusivity & Access</span>
                      <span className="text-emerald-700 text-[10px]">100%</span>
                    </h4>
                    <ul className="space-y-1 text-slate-600">
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Wheelchair Ramps</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Accessible Washrooms</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Campus Elevators</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* SECTION 10: Institutional Vacancies & Careers */}
              <section id="vacancies_section" className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs scroll-mt-20">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-3 mb-4 gap-2">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-rose-500" />
                      <span>Institutional Careers & Vacancies</span>
                    </h2>
                    <p className="text-[11px] text-slate-400">Filter through current teaching and administrative roles</p>
                  </div>
                  <button
                    onClick={() => setIsJobModalOpen(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl transition shadow-xs flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Post a Job</span>
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  {jobsList.map((job) => (
                    <div
                      key={job.id}
                      className="p-4 border border-slate-200/80 rounded-2xl bg-slate-50/40 hover:border-rose-200 transition flex flex-col sm:flex-row justify-between sm:items-center gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-900 text-sm">{job.title}</span>
                          <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-100 uppercase tracking-wide">
                            {job.jobTypeCategory || 'Teaching'}
                          </span>
                        </div>
                        <p className="text-slate-500 text-[11px]">
                          {job.description || `Required: ${job.qualifications}. Experience: ${job.experienceRequired}.`}
                        </p>
                        <p className="text-slate-700 font-bold text-[11px]">
                          Salary: <span className="text-emerald-700">{job.salary}</span>
                        </p>
                      </div>

                      <button
                        onClick={() => setSelectedJobToApply(job)}
                        className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-4 py-2 rounded-xl shadow-xs self-start sm:self-center transition shrink-0"
                      >
                        Apply Position
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* SECTION 11: Popular Comparisons */}
              <section id="popular_comparison" className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs scroll-mt-20">
                <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-blue-600" />
                  <span>Popular Comparisons with {org.name}</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  {comparisonSchools.map((cs) => (
                    <div
                      key={cs.id}
                      className="p-3 border border-slate-200 rounded-xl bg-slate-50 flex items-center gap-3 hover:shadow-xs transition"
                    >
                      <img src={cs.logo} alt={cs.name} className="w-10 h-10 object-contain rounded-lg border border-slate-200 bg-white p-1 shrink-0" />
                      <div className="min-w-0">
                        <span className="font-bold text-slate-900 block truncate">{cs.name}</span>
                        <span className="text-slate-500 text-[10px] block truncate">{cs.locality}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* SECTION 12: Media Gallery Block */}
              <section id="galary_tab" className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs scroll-mt-20">
                <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-blue-600" />
                  <span>Media Gallery Block</span>
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

              {/* SECTION 13: Address, Contact Desk & Driving Coordinates */}
              <section id="address_tab" className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs scroll-mt-20">
                <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>Address, Contact Desk & Driving Coordinates</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  <div className="space-y-3 text-slate-600">
                    <p>
                      <strong className="text-slate-900">Campus Address:</strong> {org.address || `${org.locality}, ${org.city}, ${org.state}`} - {org.pincode}
                    </p>
                    <p>
                      <strong className="text-slate-900">Official Email Desk:</strong>{' '}
                      <a href={`mailto:${org.email}`} className="text-rose-500 font-semibold hover:underline">
                        {org.email}
                      </a>
                    </p>
                    <p>
                      <strong className="text-slate-900">Official Portal:</strong>{' '}
                      <a href={org.website} target="_blank" rel="noreferrer" className="text-rose-500 font-semibold hover:underline">
                        {org.website}
                      </a>
                    </p>
                    <p>
                      <strong className="text-slate-900">Telephone / Helpdesk:</strong> {org.phone}
                    </p>
                  </div>
                  <div className="h-44 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner">
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
        </div>

        {/* ── VIRTUAL TOUR MODAL ────────────────────────────────────────────── */}
        {isVirtualTourModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between text-white">
                <span className="font-bold text-sm flex items-center gap-2">
                  <Play className="w-4 h-4 text-rose-500 fill-rose-500" />
                  <span>Campus Tour: {org.name}</span>
                </span>
                <button onClick={() => setIsVirtualTourModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="aspect-video w-full">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/rJKzHb76LJs?autoplay=1"
                  title="School Tour"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        )}

        {/* ── POST A JOB MODAL ──────────────────────────────────────────────── */}
        {isJobModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden">
              <div className="bg-[#002b4e] p-4 text-white flex items-center justify-between">
                <h3 className="font-bold text-sm flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-rose-400" />
                  <span>Submit New School Vacancy</span>
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
                  <h4 className="font-bold text-base text-slate-900">Vacancy Published!</h4>
                  <p className="text-xs text-slate-500">Your school job listing is now live on the CSEEL Career Portal.</p>
                </div>
              ) : (
                <form onSubmit={handleJobSubmit} className="p-5 space-y-3 text-xs font-semibold">
                  <div>
                    <label className="block text-slate-500 mb-1">Vacancy Designation / Post Title *</label>
                    <input
                      type="text"
                      required
                      value={jobModalForm.title}
                      onChange={(e) => setJobModalForm({ ...jobModalForm, title: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-500 font-medium text-slate-900 bg-slate-50"
                      placeholder="e.g. Senior Secondary Physics Faculty"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">Department Classification *</label>
                    <select
                      value={jobModalForm.department}
                      onChange={(e) => setJobModalForm({ ...jobModalForm, department: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-500 font-medium text-slate-800 bg-slate-50"
                    >
                      <option value="Teaching">Teaching Faculty Stream</option>
                      <option value="Non-Teaching">Non-Teaching / Administrative Stream</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">Offered Salary Bracket</label>
                    <input
                      type="text"
                      value={jobModalForm.salary}
                      onChange={(e) => setJobModalForm({ ...jobModalForm, salary: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-500 font-medium text-slate-900 bg-slate-50"
                      placeholder="e.g. ₹60,000 - ₹95,000 a month"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">Core Job Eligibility / Mandate Requirements *</label>
                    <textarea
                      required
                      rows={3}
                      value={jobModalForm.requirements}
                      onChange={(e) => setJobModalForm({ ...jobModalForm, requirements: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-500 font-medium text-slate-900 bg-slate-50 resize-none"
                      placeholder="Enter academic limits, experience metrics etc..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl shadow-xs transition mt-2"
                  >
                    Publish Vacancy Listing
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ── APPLY POSITION MODAL ──────────────────────────────────────────── */}
        {selectedJobToApply && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden">
              <div className="bg-[#002b4e] p-4 text-white flex items-center justify-between">
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
