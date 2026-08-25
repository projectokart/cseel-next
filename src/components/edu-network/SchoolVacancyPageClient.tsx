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
  CheckCircle, XCircle, AlertCircle, Info, Trophy, GraduationCap,
  Timer, DollarSign
} from 'lucide-react';
import PageTransition from '@/components/shared/PageTransition';
import {
  getOrganizationById, getJobsByOrgId, ALL_ORGANIZATIONS,
  OrganizationItem, EduJobItem
} from '@/lib/eduNetworkData';

interface SchoolVacancyPageProps {
  orgId: string;
  backUrl?: string;
}

export default function SchoolVacancyPageClient({ orgId, backUrl }: SchoolVacancyPageProps) {
  // Find organization or fallback
  const org = useMemo(() => {
    return getOrganizationById(orgId) || ALL_ORGANIZATIONS[0];
  }, [orgId]);

  const defaultBackUrl = backUrl || `/edu-network/organisation/school/${org.id}`;

  // Default Jobs for this school with 30-day tracking metadata
  const initialJobs = useMemo(() => {
    const orgJobs = getJobsByOrgId(org.id);
    const baseList = orgJobs.length > 0 ? orgJobs : [
      {
        id: `job-${org.id}-1`,
        orgId: org.id,
        orgName: org.name,
        orgLogo: org.logo,
        orgRating: org.rating,
        title: 'Senior IB DP Physics & STEM Practical Head',
        subject: 'Physics' as const,
        roleType: 'Full-Time' as const,
        jobTypeCategory: 'Teaching Faculty',
        jobShift: 'Day shift (8:00 AM – 3:30 PM)',
        city: org.city,
        state: org.state,
        pincode: org.pincode,
        address: org.address,
        salary: '₹60,000 - ₹95,000 / mo',
        salaryNumMin: 60000,
        salaryNumMax: 95000,
        experienceRequired: '3-6 Years',
        qualifications: 'M.Sc (Physics) / B.Ed with NEP-2020 & IB DP Certification',
        openings: 1,
        postedDate: '2 days ago',
        isUrgentlyHiring: true,
        easilyApply: true,
        benefits: ['Medical Insurance', 'Experiential Lab Allowance', 'Provident Fund (PF)', 'Subsidized Transport'],
        description: 'Lead senior secondary experimental science practicals, design student research inquiry prototypes, and oversee hands-on physics laboratory sessions.',
        responsibilities: [
          'Design and execute experiential physics practical lesson plans.',
          'Supervise state-of-the-art optical bench and laser experimental setups.',
          'Mentor students for National STEM & Space Conclaves.',
          'Maintain lab safety compliance (ISO 14001 standards).'
        ],
        requirements: [
          'Minimum 3 years teaching experience in CBSE/IB curriculum.',
          'Demonstrated expertise in hands-on physics and electronics apparatus.',
          'Strong spoken and written communication skills.'
        ],
        verified: true,
      },
      {
        id: `job-${org.id}-2`,
        orgId: org.id,
        orgName: org.name,
        orgLogo: org.logo,
        orgRating: org.rating,
        title: 'Robotics, IoT & Atal Tinkering Lab (ATL) Mentor',
        subject: 'Robotics & AI' as const,
        roleType: 'Full-Time' as const,
        jobTypeCategory: 'Teaching Faculty',
        jobShift: 'Day shift',
        city: org.city,
        state: org.state,
        pincode: org.pincode,
        address: org.address,
        salary: '₹45,000 - ₹65,000 / mo',
        salaryNumMin: 45000,
        salaryNumMax: 65000,
        experienceRequired: '2-5 Years',
        qualifications: 'B.Tech / B.E (Electronics/CS) with Maker & Robotics Experience',
        openings: 2,
        postedDate: '5 days ago',
        isUrgentlyHiring: true,
        easilyApply: true,
        benefits: ['Performance Incentive', 'Health Insurance', 'Hardware Maker Budget'],
        description: 'Guide middle and senior school cohorts in Arduino, 3D printing, drone mechanics, sensor prototyping, and national robotics leagues.',
        responsibilities: [
          'Manage the school Atal Tinkering Lab equipment and 3D printers.',
          'Conduct weekly hands-on coding and robotics sessions.',
          'Prepare student teams for world robotics olympiads.'
        ],
        requirements: [
          'Hands-on expertise in Arduino, Raspberry Pi, Python & 3D CAD modeling.',
          'Prior experience mentoring school or college robotics teams.'
        ],
        verified: true,
      },
      {
        id: `job-${org.id}-3`,
        orgId: org.id,
        orgName: org.name,
        orgLogo: org.logo,
        orgRating: org.rating,
        title: 'Senior Admission Counselor & Parent Relations Lead',
        subject: 'Robotics & AI' as const,
        roleType: 'Full-Time' as const,
        jobTypeCategory: 'Non-Teaching',
        jobShift: 'Day shift',
        city: org.city,
        state: org.state,
        pincode: org.pincode,
        address: org.address,
        salary: '₹35,000 - ₹50,000 / mo',
        salaryNumMin: 35000,
        salaryNumMax: 50000,
        experienceRequired: '2-4 Years',
        qualifications: 'Graduate with 2+ years Education CRM Counseling',
        openings: 1,
        postedDate: '8 days ago',
        isUrgentlyHiring: false,
        easilyApply: true,
        benefits: ['Annual Admission Bonus', 'Health Insurance'],
        description: 'Coordinate parent inquiries, conduct campus STEM lab walkthroughs, and manage student registration pipelines.',
        responsibilities: [
          'Counsel prospective parents regarding school curriculum and lab infrastructure.',
          'Maintain admission CRM database and callback schedules.'
        ],
        requirements: ['Exceptional interpersonal skills', 'Prior K-12 school counseling experience'],
        verified: true,
      }
    ];

    return baseList.map((job, idx) => ({
      ...job,
      daysRemaining: 30 - (idx * 3 + 2), // 30-day expiration window
      postedOnFormatted: `${idx * 3 + 2} days ago`,
    }));
  }, [org]);

  const [jobsList, setJobsList] = useState(initialJobs);
  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');
  const [selectedDepartment, setSelectedDepartment] = useState('All');

  // Filtered list
  const filteredJobs = useMemo(() => {
    if (selectedDepartment === 'All') return jobsList;
    return jobsList.filter(j => j.jobTypeCategory === selectedDepartment);
  }, [jobsList, selectedDepartment]);

  // Apply Modal state
  const [selectedJobToApply, setSelectedJobToApply] = useState<any | null>(null);
  const [applyModalForm, setApplyModalForm] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '3 Years',
    qualification: '',
    resumeLink: '',
    message: ''
  });
  const [applySuccess, setApplySuccess] = useState(false);

  // Post a Job Modal State (Indeed Portal Linked)
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [postJobForm, setPostJobForm] = useState({
    title: '',
    department: 'Teaching Faculty',
    subject: 'Physics',
    roleType: 'Full-Time',
    salaryMin: '50000',
    salaryMax: '75000',
    experienceRequired: '2-5 Years',
    qualifications: '',
    description: '',
    benefits: 'Health Insurance, Lab Allowance, Provident Fund'
  });
  const [postJobSuccess, setPostJobSuccess] = useState(false);

  // Share Modal state
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : `https://www.cseel.org/edu-network/organisation/school/${org.id}/vacancy`;
  const shareText = `Explore current faculty & staff job openings at ${org.name} (${org.city}) on CSEEL EduNetwork:`;

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApplySuccess(true);
    setTimeout(() => {
      setApplySuccess(false);
      setSelectedJobToApply(null);
      setApplyModalForm({ name: '', email: '', phone: '', experience: '3 Years', qualification: '', resumeLink: '', message: '' });
    }, 2000);
  };

  const handlePostJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postJobForm.title) return;

    const newJob = {
      id: `job-${org.id}-${Date.now()}`,
      orgId: org.id,
      orgName: org.name,
      orgLogo: org.logo,
      orgRating: org.rating,
      title: postJobForm.title,
      subject: (postJobForm.subject as any) || 'Physics',
      roleType: (postJobForm.roleType as any) || 'Full-Time',
      jobTypeCategory: postJobForm.department,
      jobShift: 'Day shift (8:00 AM – 3:30 PM)',
      city: org.city,
      state: org.state,
      pincode: org.pincode,
      address: org.address,
      salary: `₹${parseInt(postJobForm.salaryMin).toLocaleString()} - ₹${parseInt(postJobForm.salaryMax).toLocaleString()} / mo`,
      salaryNumMin: parseInt(postJobForm.salaryMin),
      salaryNumMax: parseInt(postJobForm.salaryMax),
      experienceRequired: postJobForm.experienceRequired || '2-5 Years',
      qualifications: postJobForm.qualifications || 'B.Ed / Relevant Post-Graduate Degree',
      openings: 1,
      postedDate: 'Just now',
      postedOnFormatted: 'Just now',
      daysRemaining: 30, // Fresh 30-day active window
      isUrgentlyHiring: true,
      easilyApply: true,
      benefits: postJobForm.benefits.split(',').map(s => s.trim()),
      description: postJobForm.description || 'Join our verified institutional faculty network.',
      responsibilities: [
        'Design and conduct experiential laboratory curriculum.',
        'Maintain highest academic and practical safety standards.'
      ],
      requirements: [
        postJobForm.qualifications || 'Relevant teaching qualification and experience'
      ],
      verified: true,
    };

    setJobsList([newJob, ...jobsList]);
    setPostJobSuccess(true);
    setTimeout(() => {
      setPostJobSuccess(false);
      setIsPostJobModalOpen(false);
      setPostJobForm({
        title: '',
        department: 'Teaching Faculty',
        subject: 'Physics',
        roleType: 'Full-Time',
        salaryMin: '50000',
        salaryMax: '75000',
        experienceRequired: '2-5 Years',
        qualifications: '',
        description: '',
        benefits: 'Health Insurance, Lab Allowance, Provident Fund'
      });
    }, 2000);
  };

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-slate-100 text-slate-800 font-sans antialiased pb-28">

        {/* ── TOP BREADCRUMB & BACK NAVIGATION ────────────────────────────────── */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <Link href="/edu-network" className="hover:text-blue-600">EduNetwork</Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <Link href={defaultBackUrl} className="hover:text-blue-600 truncate max-w-xs">{org.name}</Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-900 font-bold">Careers & Vacancies</span>
            </div>

            <Link
              href={defaultBackUrl}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-blue-600 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to School Profile</span>
            </Link>
          </div>
        </div>

        {/* ── SCHOOL BRAND BANNER ────────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-[#001f3f] via-[#002b4e] to-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              
              <div className="flex items-center gap-4">
                <img
                  src={org.logo || "https://images.uniapply.com/uploads/college/image/logo/2186/KRMGS_L_220920_174918.jpg"}
                  alt={org.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white p-1.5 object-contain shadow-lg shrink-0 border border-white/20"
                />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl sm:text-2xl font-black text-white">{org.name}</h1>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Verified Institution
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>{org.address || `${org.locality}, ${org.city}, ${org.state}`}</span>
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-300">
                    <span><strong>Board:</strong> {org.board || 'IB / CBSE'}</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-bold">{filteredJobs.length} Active Openings</span>
                    <span>•</span>
                    <span className="text-amber-300 font-medium">30-Day Auto-Expiry Policy</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  onClick={() => setIsPostJobModalOpen(true)}
                  className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl shadow-lg transition flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Post a Vacancy (Indeed Portal)</span>
                </button>
                <Link
                  href="/edu-network/jobs"
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs rounded-xl transition flex items-center gap-1.5"
                >
                  <Briefcase className="w-4 h-4 text-blue-300" />
                  <span>Explore All Teacher Jobs</span>
                </Link>
                <button
                  onClick={() => setIsShareModalOpen(true)}
                  className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition"
                  title="Share Vacancies"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* ── MAIN CONTENT ──────────────────────────────────────────────────── */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* ── LEFT SIDEBAR FILTERS & METADATA ────────────────────────────── */}
            <div className="lg:col-span-1 space-y-4">
              
              {/* Department Filter Box */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                <h3 className="font-black text-xs uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  <span>Department Category</span>
                </h3>
                <div className="space-y-1.5 text-xs font-semibold text-slate-600">
                  {['All', 'Teaching Faculty', 'Non-Teaching', 'Lab Instructor'].map((dept) => (
                    <button
                      key={dept}
                      onClick={() => setSelectedDepartment(dept)}
                      className={`w-full text-left px-3 py-2 rounded-xl transition flex items-center justify-between ${
                        selectedDepartment === dept
                          ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                          : 'hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <span>{dept}</span>
                      <span className="text-[11px] px-2 py-0.5 bg-slate-100 rounded-full text-slate-500">
                        {dept === 'All'
                          ? jobsList.length
                          : jobsList.filter(j => j.jobTypeCategory === dept).length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 30-Day Expiry Notice Card */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-800">
                  <Timer className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>30-Day Job Listing Policy</span>
                </div>
                <p className="text-[11px] text-amber-700 leading-relaxed">
                  All job openings automatically expire after <strong>30 days of posting</strong> to ensure only actively recruiting positions are shown to educators.
                </p>
              </div>

              {/* Linked Indeed Portal Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-bold">
                    in
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">Indeed Career Network</h4>
                    <p className="text-[10px] text-slate-400 font-medium">Synchronized Listings</p>
                  </div>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Vacancies posted on this school portal are automatically broadcasted across CSEEL's national teacher recruitment network.
                </p>
                <Link
                  href="/edu-network/jobs"
                  className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold text-xs rounded-xl transition text-center block"
                >
                  Browse 40+ National Openings →
                </Link>
              </div>

            </div>

            {/* ── RIGHT JOBS LIST ────────────────────────────────────────────── */}
            <div className="lg:col-span-3 space-y-5">
              
              {/* Header with Tabs */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-xs font-bold">
                  <button
                    onClick={() => setActiveTab('active')}
                    className={`pb-1 border-b-2 transition ${
                      activeTab === 'active'
                        ? 'border-rose-600 text-rose-600 font-black'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Active Vacancies ({filteredJobs.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('archived')}
                    className={`pb-1 border-b-2 transition ${
                      activeTab === 'archived'
                        ? 'border-rose-600 text-rose-600 font-black'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Closed / Archived (8)
                  </button>
                </div>

                <div className="text-xs text-slate-500 font-medium">
                  Showing <strong>{filteredJobs.length}</strong> active teaching & administrative roles
                </div>
              </div>

              {/* Active Jobs List */}
              {activeTab === 'active' ? (
                <div className="space-y-4">
                  {filteredJobs.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
                      <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
                      <h4 className="font-bold text-sm text-slate-700">No vacancies in this category</h4>
                      <p className="text-xs text-slate-400">Try selecting another department or post a new job vacancy.</p>
                      <button
                        onClick={() => setSelectedDepartment('All')}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
                      >
                        Reset Filter
                      </button>
                    </div>
                  ) : (
                    filteredJobs.map((job) => (
                      <div
                        key={job.id}
                        className="bg-white rounded-2xl border-2 border-slate-200/80 hover:border-rose-300 transition-all p-6 shadow-xs space-y-4 relative overflow-hidden"
                      >
                        {/* 30-Day Expiry Tag */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200 font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                              {job.jobTypeCategory || 'Teaching Faculty'}
                            </span>
                            <span className="text-[10px] bg-blue-100 text-blue-800 border border-blue-200 font-bold px-2.5 py-0.5 rounded-full">
                              {job.roleType || 'Full-Time'}
                            </span>
                            {job.isUrgentlyHiring && (
                              <span className="text-[10px] bg-rose-100 text-rose-800 border border-rose-200 font-black px-2.5 py-0.5 rounded-full">
                                Urgently Hiring
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 text-xs font-semibold">
                            <span className="text-slate-400 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              <span>Posted {job.postedOnFormatted || job.postedDate}</span>
                            </span>
                            <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 flex items-center gap-1 text-[11px] font-bold">
                              <Timer className="w-3 h-3 text-amber-600" />
                              <span>Expires in {job.daysRemaining || 28} days</span>
                            </span>
                          </div>
                        </div>

                        {/* Title & Salary */}
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div>
                            <h2 className="text-lg font-black text-slate-900 hover:text-rose-600 transition">
                              {job.title}
                            </h2>
                            <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                              <MapPin className="w-3.5 h-3.5 text-rose-500" />
                              <span>{job.city}, {job.state}</span>
                              <span>•</span>
                              <span>{job.jobShift || 'Day shift'}</span>
                            </p>
                          </div>

                          <div className="text-left sm:text-right shrink-0">
                            <div className="text-base sm:text-lg font-black text-emerald-700">
                              {job.salary}
                            </div>
                            <span className="text-[11px] text-slate-400 font-medium">Monthly CTC + Lab Allowances</span>
                          </div>
                        </div>

                        {/* Description & Eligibility */}
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {job.description}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                          <div>
                            <span className="text-slate-400 block text-[11px] font-medium">Experience Required</span>
                            <span className="font-bold text-slate-800">{job.experienceRequired || '2-5 Years'}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[11px] font-medium">Qualifications</span>
                            <span className="font-bold text-slate-800">{job.qualifications || 'B.Ed / Relevant Post Graduate'}</span>
                          </div>
                        </div>

                        {/* Benefits Chips */}
                        {job.benefits && job.benefits.length > 0 && (
                          <div className="flex items-center gap-1.5 flex-wrap text-xs">
                            <span className="text-slate-400 font-bold text-[11px]">Benefits:</span>
                            {job.benefits.map((b, idx) => (
                              <span key={idx} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md text-[11px] font-medium border border-slate-200">
                                ✓ {b}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-between pt-3 border-t border-slate-100 gap-3">
                          <Link
                            href="/edu-network/jobs"
                            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 self-start sm:self-auto"
                          >
                            <span>View on Indeed Portal</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>

                          <div className="flex items-center gap-2 w-full sm:w-auto">
                            <button
                              onClick={() => setSelectedJobToApply(job)}
                              className="w-full sm:w-auto px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl shadow-xs transition text-center"
                            >
                              Apply with Resume
                            </button>
                          </div>
                        </div>

                      </div>
                    ))
                  )}
                </div>
              ) : (
                /* Archived Jobs */
                <div className="space-y-3 text-xs">
                  <div className="p-4 bg-white border border-slate-200 rounded-2xl opacity-70 space-y-1">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-slate-700">TGT English & Literature Faculty</h4>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">Closed on Dec 2025</span>
                    </div>
                    <p className="text-slate-500 text-[11px]">Expired after 30-day active recruitment cycle. Position filled.</p>
                  </div>
                  <div className="p-4 bg-white border border-slate-200 rounded-2xl opacity-70 space-y-1">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-slate-700">Computer Science & Python Instructor</h4>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">Closed on Nov 2025</span>
                    </div>
                    <p className="text-slate-500 text-[11px]">Expired after 30-day active recruitment cycle. Position filled.</p>
                  </div>
                </div>
              )}

            </div>

          </div>
        </main>

        {/* ── APPLY MODAL ────────────────────────────────────────────────────── */}
        {selectedJobToApply && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="bg-[#1e3a8a] p-4 text-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-rose-300 font-bold uppercase tracking-wider">Direct Candidate Application</span>
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
                  <p className="text-xs text-slate-500">The HR and academic directorate of {org.name} has received your profile and resume.</p>
                </div>
              ) : (
                <form onSubmit={handleApplySubmit} className="p-5 space-y-3.5 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={applyModalForm.name}
                      onChange={(e) => setApplyModalForm({ ...applyModalForm, name: e.target.value })}
                      placeholder="e.g. Dr. Ramesh Mukherjee"
                      className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-medium"
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
                        className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-medium"
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
                        className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-medium"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Highest Qualification *</label>
                    <input
                      type="text"
                      required
                      value={applyModalForm.qualification}
                      onChange={(e) => setApplyModalForm({ ...applyModalForm, qualification: e.target.value })}
                      placeholder="e.g. M.Sc Physics + B.Ed / Ph.D"
                      className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-medium"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Resume / Portfolio Link</label>
                    <input
                      type="url"
                      value={applyModalForm.resumeLink}
                      onChange={(e) => setApplyModalForm({ ...applyModalForm, resumeLink: e.target.value })}
                      placeholder="https://drive.google.com/your-resume.pdf"
                      className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-medium"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Cover Note / Practical Teaching Experience</label>
                    <textarea
                      rows={2}
                      value={applyModalForm.message}
                      onChange={(e) => setApplyModalForm({ ...applyModalForm, message: e.target.value })}
                      placeholder="Briefly explain your hands-on lab or classroom background..."
                      className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-medium resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition mt-2"
                  >
                    Submit Job Application
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ── POST A JOB MODAL (INDEED PORTAL INTEGRATION) ──────────────────── */}
        {isPostJobModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
              <div className="bg-[#1e3a8a] p-4 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-white" />
                  <div>
                    <h3 className="font-bold text-sm leading-tight">Post Vacancy on Indeed Portal</h3>
                    <p className="text-[11px] text-blue-200">{org.name} • 30-Day Active Listing</p>
                  </div>
                </div>
                <button onClick={() => setIsPostJobModalOpen(false)} className="text-white/80 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {postJobSuccess ? (
                <div className="p-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-base text-slate-900">Job Successfully Published!</h4>
                  <p className="text-xs text-slate-500">
                    The vacancy is now live on <strong>{org.name} Vacancies</strong> and synchronized with the national <strong>Indeed Job Portal</strong> for the next 30 days.
                  </p>
                </div>
              ) : (
                <form className="p-5 space-y-3 text-xs font-semibold max-h-[75vh] overflow-y-auto" onSubmit={handlePostJobSubmit}>
                  <div>
                    <label className="block text-slate-700 mb-1">Position / Job Designation *</label>
                    <input
                      type="text"
                      required
                      value={postJobForm.title}
                      onChange={(e) => setPostJobForm({ ...postJobForm, title: e.target.value })}
                      placeholder="e.g. PGT Chemistry & Experiential Lab Mentor"
                      className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 text-slate-900 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-700 mb-1">Department Category *</label>
                      <select
                        value={postJobForm.department}
                        onChange={(e) => setPostJobForm({ ...postJobForm, department: e.target.value })}
                        className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 text-slate-800 font-medium"
                      >
                        <option value="Teaching Faculty">Teaching Faculty</option>
                        <option value="Non-Teaching">Non-Teaching</option>
                        <option value="Lab Instructor">Lab Instructor</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1">Role Type *</label>
                      <select
                        value={postJobForm.roleType}
                        onChange={(e) => setPostJobForm({ ...postJobForm, roleType: e.target.value })}
                        className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 text-slate-800 font-medium"
                      >
                        <option value="Full-Time">Full-Time</option>
                        <option value="Part-Time">Part-Time</option>
                        <option value="Visiting Faculty">Visiting Faculty</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-700 mb-1">Min Monthly Salary (₹)</label>
                      <input
                        type="number"
                        value={postJobForm.salaryMin}
                        onChange={(e) => setPostJobForm({ ...postJobForm, salaryMin: e.target.value })}
                        placeholder="50000"
                        className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 text-slate-900 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 mb-1">Max Monthly Salary (₹)</label>
                      <input
                        type="number"
                        value={postJobForm.salaryMax}
                        onChange={(e) => setPostJobForm({ ...postJobForm, salaryMax: e.target.value })}
                        placeholder="80000"
                        className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 text-slate-900 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1">Qualifications & Experience Required *</label>
                    <input
                      type="text"
                      required
                      value={postJobForm.qualifications}
                      onChange={(e) => setPostJobForm({ ...postJobForm, qualifications: e.target.value })}
                      placeholder="e.g. M.Sc with B.Ed, 3+ years experiential teaching experience"
                      className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 text-slate-900 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1">Key Responsibilities & Description *</label>
                    <textarea
                      required
                      rows={3}
                      value={postJobForm.description}
                      onChange={(e) => setPostJobForm({ ...postJobForm, description: e.target.value })}
                      placeholder="Describe the teaching roles, laboratory practicals, and syllabus..."
                      className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 text-slate-900 font-medium resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1">Perks & Benefits (Comma separated)</label>
                    <input
                      type="text"
                      value={postJobForm.benefits}
                      onChange={(e) => setPostJobForm({ ...postJobForm, benefits: e.target.value })}
                      placeholder="Health Insurance, Lab Allowance, Transport"
                      className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 text-slate-900 font-medium"
                    />
                  </div>

                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-[11px] font-medium">
                    ⓘ This post will remain actively listed for <strong>30 days</strong> on this school page and Indeed Teacher Jobs.
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-xs transition"
                  >
                    Publish to Indeed & School Portal
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ── SHARE MODAL ────────────────────────────────────────────────────── */}
        {isShareModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200">
              <div className="bg-[#1e3a8a] p-5 text-white flex items-center justify-between">
                <h3 className="font-bold text-sm">Share School Vacancies</h3>
                <button onClick={() => setIsShareModalOpen(false)} className="text-white/80 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-5 space-y-3 text-xs">
                <div className="flex items-center gap-2 p-1.5 bg-slate-50 border rounded-xl">
                  <input type="text" readOnly value={currentUrl} className="w-full bg-transparent px-2 text-xs font-mono outline-none select-all truncate" />
                  <button onClick={handleCopyLink} className={`px-3 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1 shrink-0 ${copiedLink ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'}`}>
                    {copiedLink ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </PageTransition>
  );
}
