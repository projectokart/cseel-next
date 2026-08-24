'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Building2, MapPin, Star, ShieldCheck, CheckCircle2,
  Briefcase, Heart, MessageSquare, Share2, Send, Plus,
  ChevronRight, Award, Beaker, Users, Calendar, ArrowLeft,
  ThumbsUp, ExternalLink, Check, X, Sparkles, Navigation,
  Clock, Eye, Camera, BookOpen, Microscope, Laptop, Maximize2,
  Phone, Mail, Globe, Wallet, ChartBar, Wand2, Image as ImageIcon
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
  // Find organization or fallback
  const org = useMemo(() => {
    return getOrganizationById(orgId) || ALL_ORGANIZATIONS[0];
  }, [orgId]);

  // Initial jobs for this school
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
        jobTypeCategory: 'Full-Time',
        jobShift: 'Day shift (8:00 AM – 3:30 PM)',
        city: org.city,
        state: org.state,
        pincode: org.pincode,
        address: org.address,
        salary: '₹75,000 - ₹1,10,000 / month',
        salaryNumMin: 75000,
        salaryNumMax: 110000,
        experienceRequired: '3-6 Years',
        qualifications: 'M.Sc Physics / B.Ed with IB Certification',
        openings: 1,
        postedDate: '2 days ago',
        isUrgentlyHiring: true,
        easilyApply: true,
        benefits: ['Health Insurance', 'Lab Allowance', 'Provident Fund', 'Subsidized Transport'],
        description: 'Lead the senior secondary IB physics practical curriculum, supervise student scientific inquiry projects, and oversee live laboratory demonstrations.',
        responsibilities: [
          'Design hands-on experimental practical lesson plans.',
          'Manage internal lab assessments and safety standards.',
          'Mentor students for National Science Conclaves.'
        ],
        requirements: ['Minimum 3 years IB/CBSE senior secondary experience', 'Strong experimental apparatus mastery'],
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
        jobTypeCategory: 'Full-Time',
        jobShift: 'Day shift',
        city: org.city,
        state: org.state,
        pincode: org.pincode,
        address: org.address,
        salary: '₹50,000 - ₹75,000 / month',
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

  // Job Modal State (Post a Job)
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [jobModalForm, setJobModalForm] = useState({
    title: '',
    department: 'Teaching',
    requirements: '',
    salary: '₹60,000 - ₹90,000 / month',
  });
  const [jobModalSuccess, setJobModalSuccess] = useState(false);

  // Apply Modal State
  const [selectedJobToApply, setSelectedJobToApply] = useState<EduJobItem | null>(null);
  const [applyModalForm, setApplyModalForm] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '3 Years',
    message: '',
  });
  const [applySuccess, setApplySuccess] = useState(false);

  // Callback / Admission Enquiry Modal State
  const [isCallbackModalOpen, setIsCallbackModalOpen] = useState(false);
  const [callbackForm, setCallbackForm] = useState({
    parentName: '',
    phone: '',
    grade: 'Class 9',
    preferredTime: 'Morning (9 AM - 12 PM)',
  });
  const [callbackSuccess, setCallbackSuccess] = useState(false);

  // Lightbox Photo
  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);

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
      salaryNumMax: 90000,
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
      setJobModalForm({ title: '', department: 'Teaching', requirements: '', salary: '₹60,000 - ₹90,000 / month' });
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

  // Gallery Photos
  const galleryPhotos = [
    org.bannerImage || "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1562774053-701939374585?w=600&auto=format&fit=crop"
  ];

  return (
    <PageTransition>
      <div className="bg-slate-50 text-slate-800 font-sans antialiased pb-28">

        {/* ── TOP SECONDARY HEADER BAR ───────────────────────────────────────── */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link href="/edu-network/organisation/school" className="text-xl font-black tracking-tight text-[#002b4e] flex items-center gap-1.5">
                <Building2 className="w-5 h-5 text-rose-500" />
                <span>CSEEL<span className="text-rose-500">.EDU</span></span>
              </Link>
            </div>
            <div className="flex items-center space-x-3 sm:space-x-4">
              <a href="#vacancies_section" className="text-xs sm:text-sm font-bold text-slate-600 hover:text-rose-500 transition">
                Careers
              </a>
              <button
                onClick={() => setIsJobModalOpen(true)}
                className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl shadow-xs transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Post a Job</span>
              </button>
            </div>
          </div>
        </header>

        {/* ── HERO COVER BANNER ──────────────────────────────────────────────── */}
        <div className="relative bg-[#002b4e] text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <img
            src={org.bannerImage || "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=80"}
            alt={org.name}
            className="w-full h-56 sm:h-72 object-cover"
          />
          <div className="absolute inset-0 z-20 bg-gradient-to-t from-slate-900 via-transparent to-black/20"></div>
        </div>

        {/* ── FLOATING INSTITUTION CARD (-mt-20) ─────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-30 -mt-20">
          <div className="bg-white text-slate-800 rounded-3xl shadow-xl border border-slate-200/80 p-5 sm:p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              
              {/* Logo & School Title */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
                <div className="w-20 h-20 rounded-2xl border-2 border-slate-100 bg-white p-1.5 object-contain shadow-sm shrink-0 flex items-center justify-center">
                  <img
                    src={org.logo || "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=200&auto=format&fit=crop"}
                    alt={org.name}
                    className="w-full h-full object-contain rounded-xl"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
                      {org.name}
                    </h1>
                    <span className="bg-emerald-100 text-emerald-800 text-[11px] px-2.5 py-0.5 rounded-full font-bold border border-emerald-200 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Verified Entity</span>
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
                    <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>{org.locality ? `${org.locality}, ` : ''}{org.city}, {org.state} - {org.pincode}</span>
                  </p>
                </div>
              </div>

              {/* Rating & CTA */}
              <div className="flex items-center gap-4 justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Overall Rating</span>
                  <span className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-1 justify-end">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span>{org.rating}</span>
                    <span className="text-xs font-medium text-slate-400">/ 5</span>
                  </span>
                </div>
                <button
                  onClick={() => setIsCallbackModalOpen(true)}
                  className="bg-[#002b4e] hover:bg-[#003c6e] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all shrink-0"
                >
                  Enquire Admission
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* ── 2-COLUMN MAIN CONTENT (STICKY NAV + DETAILED SECTIONS) ─────────── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* ── LEFT STICKY QUICK NAVIGATION ── */}
            <aside className="w-full lg:w-64 shrink-0 lg:sticky lg:top-20 space-y-4">
              <nav className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs" id="mainNav">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">Quick Navigation</p>
                <ul className="space-y-1 text-xs sm:text-sm font-semibold text-slate-600">
                  <li>
                    <a href="#school_connect_section" className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 hover:text-[#002b4e] transition text-[#002b4e] bg-blue-50/70">
                      <MessageSquare className="w-4 h-4 text-blue-600" />
                      <span>School Connect</span>
                    </a>
                  </li>
                  <li>
                    <a href="#key_school_stats_tab" className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 hover:text-[#002b4e] transition">
                      <ChartBar className="w-4 h-4 text-slate-400" />
                      <span>Key School Stats</span>
                    </a>
                  </li>
                  <li>
                    <a href="#tuition_and_cost_tab" className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 hover:text-[#002b4e] transition">
                      <Wallet className="w-4 h-4 text-slate-400" />
                      <span>Fee Structure</span>
                    </a>
                  </li>
                  <li>
                    <a href="#academics_stats_tab" className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 hover:text-[#002b4e] transition">
                      <BookOpen className="w-4 h-4 text-slate-400" />
                      <span>Academic Profile</span>
                    </a>
                  </li>
                  <li>
                    <a href="#facilities_tab" className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 hover:text-[#002b4e] transition">
                      <Wand2 className="w-4 h-4 text-slate-400" />
                      <span>Facilities & Labs</span>
                    </a>
                  </li>
                  <li>
                    <a href="#vacancies_section" className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 hover:text-[#002b4e] transition text-rose-600">
                      <Briefcase className="w-4 h-4 text-rose-500" />
                      <span>Vacancies & Careers</span>
                    </a>
                  </li>
                  <li>
                    <a href="#galary_tab" className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 hover:text-[#002b4e] transition">
                      <ImageIcon className="w-4 h-4 text-slate-400" />
                      <span>Media Gallery</span>
                    </a>
                  </li>
                  <li>
                    <a href="#address_tab" className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 hover:text-[#002b4e] transition">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span>Contact & Map</span>
                    </a>
                  </li>
                </ul>
              </nav>

              {/* Admissions Callout Box */}
              <div className="bg-gradient-to-br from-[#002b4e] to-slate-900 text-white p-4 rounded-2xl shadow-sm text-xs space-y-2">
                <span className="bg-rose-500/30 text-rose-300 font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wide">
                  Admissions 2026-2027
                </span>
                <p className="font-bold text-sm text-white">
                  {org.board || 'CBSE & STEM'} Integrated Curriculum
                </p>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Admissions currently active for {org.classesOffered || 'Nursery - 12th'}. Verified student-faculty proportion {org.studentFacultyRatio || '20:1'}.
                </p>
                <button
                  onClick={() => setIsCallbackModalOpen(true)}
                  className="w-full py-2 bg-rose-500 hover:bg-rose-600 text-white font-black text-xs rounded-xl shadow-xs transition-all mt-2"
                >
                  Instant Callback Desk
                </button>
              </div>
            </aside>

            {/* ── RIGHT MAIN CONTENT SECTIONS ── */}
            <div className="flex-1 space-y-8 w-full min-w-0">
              
              {/* SECTION 1: School Connect Hub */}
              <section id="school_connect_section" className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs scroll-mt-20">
                <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#002b4e]" />
                  <span>School Connect Hub</span>
                </h2>
                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <p className="text-xs text-slate-600 max-w-md leading-relaxed">
                    Curious about the {org.board || 'CBSE'} syllabus, STEM laboratory tour, or fee structures? Submit an interactive callback request directly to {org.name}'s admission representatives.
                  </p>
                  <button
                    onClick={() => setIsCallbackModalOpen(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-xs shrink-0 flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Request a Call Back</span>
                  </button>
                </div>
              </section>

              {/* SECTION 2: Key School Stats */}
              <section id="key_school_stats_tab" className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs scroll-mt-20">
                <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                  <ChartBar className="w-4 h-4 text-[#002b4e]" />
                  <span>Key School Stats</span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 border border-slate-200/80 rounded-xl bg-slate-50/50">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wide">Ownership</span>
                    <span className="font-bold text-slate-900 text-sm">Private Institution</span>
                  </div>
                  <div className="p-3 border border-slate-200/80 rounded-xl bg-slate-50/50">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wide">Board Affiliation</span>
                    <span className="font-bold text-slate-900 text-sm">{org.board || 'CBSE Board'}</span>
                  </div>
                  <div className="p-3 border border-slate-200/80 rounded-xl bg-slate-50/50">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wide">Estd. Year</span>
                    <span className="font-bold text-slate-900 text-sm">{org.established || '2015'} Campus</span>
                  </div>
                  <div className="p-3 border border-slate-200/80 rounded-xl bg-slate-50/50">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wide">Co-Ed Status</span>
                    <span className="font-bold text-slate-900 text-sm">Co-Education Format</span>
                  </div>
                  <div className="p-3 border border-slate-200/80 rounded-xl bg-slate-50/50">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wide">Campus Size</span>
                    <span className="font-bold text-slate-900 text-sm">5 Acres Urban Built</span>
                  </div>
                  <div className="p-3 border border-slate-200/80 rounded-xl bg-slate-50/50">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wide">UDISE Registry</span>
                    <span className="font-bold text-slate-900 text-sm">070104XXX09</span>
                  </div>
                </div>
              </section>

              {/* SECTION 3: Detailed Fee Breakup */}
              <section id="tuition_and_cost_tab" className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs scroll-mt-20">
                <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-[#002b4e]" />
                  <span>Detailed Fee Breakup (Annual & Monthly Tier)</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 text-xs">
                  <div className="p-4 border border-slate-200/80 rounded-2xl bg-slate-50">
                    <span className="text-slate-400 block uppercase font-bold tracking-wider text-[10px]">Total Admission Entry Cost</span>
                    <span className="text-2xl font-black text-slate-900">
                      ₹{((org.monthlyFeesNum || 12000) * 12 + 25000).toLocaleString()}
                    </span>
                  </div>
                  <div className="p-4 border border-slate-200/80 rounded-2xl bg-slate-50">
                    <span className="text-slate-400 block uppercase font-bold tracking-wider text-[10px]">Estimated Monthly Trend</span>
                    <span className="text-2xl font-black text-slate-900">
                      {org.monthlyFees || '₹12,000 / mo'}
                    </span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600 border border-slate-200 rounded-xl overflow-hidden">
                    <thead className="bg-slate-100 text-slate-800 uppercase font-bold text-[10px]">
                      <tr>
                        <th className="p-3">Fee Stream</th>
                        <th className="p-3 text-right">Amount</th>
                        <th className="p-3">Cycle</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      <tr>
                        <td className="p-3 font-semibold text-slate-900">Admission Component</td>
                        <td className="p-3 text-right font-bold">₹25,000</td>
                        <td className="p-3">One-time</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-slate-900">Security Vault (Refundable)</td>
                        <td className="p-3 text-right font-bold">₹30,000</td>
                        <td className="p-3">One-time</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-slate-900">Quarterly Tuition Component</td>
                        <td className="p-3 text-right font-bold">
                          ₹{((org.monthlyFeesNum || 12000) * 3).toLocaleString()}
                        </td>
                        <td className="p-3">Quarterly</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-slate-900">Annual STEM & Lab Logistics</td>
                        <td className="p-3 text-right font-bold">₹15,000</td>
                        <td className="p-3">Annually</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* SECTION 4: Academic Profile Metrics */}
              <section id="academics_stats_tab" className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs scroll-mt-20">
                <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#002b4e]" />
                  <span>Academic Profile Metrics</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center justify-between p-3 border border-slate-200/80 rounded-xl bg-slate-50/40">
                    <span className="text-slate-600 font-medium">Classes Handled</span>
                    <span className="font-bold text-slate-900">{org.classesOffered || 'Nursery - Class 12'}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-slate-200/80 rounded-xl bg-slate-50/40">
                    <span className="text-slate-600 font-medium">Student-Faculty Proportion</span>
                    <span className="font-bold text-slate-900">{org.studentFacultyRatio || '20 : 1'} Ratio</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-slate-200/80 rounded-xl bg-slate-50/40">
                    <span className="text-slate-600 font-medium">Total Specialized Faculty</span>
                    <span className="font-bold text-slate-900">45 Active Core Instructors</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-slate-200/80 rounded-xl bg-slate-50/40">
                    <span className="text-slate-600 font-medium">Instruction Medium</span>
                    <span className="font-bold text-slate-900">English Standard</span>
                  </div>
                </div>
              </section>

              {/* SECTION 5: Facilities & Labs */}
              <section id="facilities_tab" className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs scroll-mt-20">
                <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                  <Microscope className="w-4 h-4 text-[#002b4e]" />
                  <span>Infrastructure, Specialized Labs & Playgrounds</span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="p-2.5 border border-slate-200/80 rounded-xl bg-slate-50 flex items-center gap-2">
                    <Laptop className="w-4 h-4 text-sky-500 shrink-0" />
                    <span>AC Smart Classrooms</span>
                  </div>
                  <div className="p-2.5 border border-slate-200/80 rounded-xl bg-slate-50 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>Campus High-Speed Wi-Fi</span>
                  </div>
                  <div className="p-2.5 border border-slate-200/80 rounded-xl bg-slate-50 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-500 shrink-0" />
                    <span>Robotics & AI Lab</span>
                  </div>
                  <div className="p-2.5 border border-slate-200/80 rounded-xl bg-slate-50 flex items-center gap-2">
                    <Microscope className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Advanced Physics & Chemistry Lab</span>
                  </div>
                  <div className="p-2.5 border border-slate-200/80 rounded-xl bg-slate-50 flex items-center gap-2">
                    <Laptop className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>Computer Tech & Coding Lab</span>
                  </div>
                  <div className="p-2.5 border border-slate-200/80 rounded-xl bg-slate-50 flex items-center gap-2">
                    <Award className="w-4 h-4 text-cyan-500 shrink-0" />
                    <span>Swimming Pool Block</span>
                  </div>
                  <div className="p-2.5 border border-slate-200/80 rounded-xl bg-slate-50 flex items-center gap-2">
                    <Users className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>Sports Turf & Football Ground</span>
                  </div>
                  <div className="p-2.5 border border-slate-200/80 rounded-xl bg-slate-50 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>Indoor Shooting & Archery</span>
                  </div>
                  <div className="p-2.5 border border-slate-200/80 rounded-xl bg-slate-50 flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-orange-500 shrink-0" />
                    <span>GPS Monitored Fleets</span>
                  </div>
                </div>
              </section>

              {/* SECTION 6: Vacancies & Careers */}
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

                <div className="flex border-b border-slate-100 text-xs font-bold mb-4 gap-4">
                  <button
                    onClick={() => setActiveJobTab('current')}
                    className={`pb-2 border-b-2 transition ${
                      activeJobTab === 'current' ? 'border-rose-500 text-rose-600' : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Current Openings ({jobsList.length})
                  </button>
                  <button
                    onClick={() => setActiveJobTab('past')}
                    className={`pb-2 border-b-2 transition ${
                      activeJobTab === 'past' ? 'border-rose-500 text-rose-600' : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Past / Closed Openings (0)
                  </button>
                </div>

                {activeJobTab === 'current' ? (
                  <div className="space-y-3 text-xs">
                    {jobsList.map((job) => (
                      <div
                        key={job.id}
                        className="p-4 border border-slate-200/80 rounded-2xl bg-slate-50/40 hover:border-rose-200 transition flex flex-col sm:flex-row justify-between sm:items-center gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-slate-900 text-sm">{job.title}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wide ${
                              job.roleType === 'Full-Time'
                                ? 'bg-blue-50 text-blue-700 border-blue-100'
                                : 'bg-amber-50 text-amber-700 border-amber-100'
                            }`}>
                              {job.jobTypeCategory || 'Teaching'}
                            </span>
                          </div>
                          <p className="text-slate-500 text-[11px] leading-relaxed">
                            {job.description || `Required: ${job.qualifications}. Experience: ${job.experienceRequired}.`}
                          </p>
                          <p className="text-slate-700 font-bold text-[11px]">
                            Salary: <span className="text-emerald-700">{job.salary}</span>
                          </p>
                        </div>

                        <button
                          onClick={() => setSelectedJobToApply(job)}
                          className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-4 py-2 rounded-xl shadow-xs self-start sm:self-center transition-all shrink-0"
                        >
                          Apply Position
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 text-center py-6">No closed vacancies recorded.</p>
                )}
              </section>

              {/* SECTION 7: Media Gallery Block */}
              <section id="galary_tab" className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs scroll-mt-20">
                <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#002b4e]" />
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

              {/* SECTION 8: Address, Contact Desk & Driving Coordinates */}
              <section id="address_tab" className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs scroll-mt-20">
                <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#002b4e]" />
                  <span>Address, Contact Desk & Driving Coordinates</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  <div className="space-y-3 text-slate-600">
                    <p>
                      <strong className="text-slate-900">Campus Address:</strong> {org.address}, {org.locality ? `${org.locality}, ` : ''}{org.city}, {org.state} - {org.pincode}
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
                      src="https://maps.google.com/maps?q=Delhi+Public+School+New+Delhi&t=&z=13&ie=UTF8&iwloc=&output=embed"
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

        {/* ── POST A JOB MODAL ──────────────────────────────────────────────── */}
        {isJobModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in-50">
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
                      placeholder="e.g. ₹60,000 - ₹90,000 / month"
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
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in-50">
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
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in-50">
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
