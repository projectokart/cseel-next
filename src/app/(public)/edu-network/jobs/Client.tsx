'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MapPin, Briefcase, Building2, Star, CheckCircle2, Bookmark,
  ThumbsDown, Share2, Send, ExternalLink, Filter, ArrowRight, ShieldCheck,
  Check, X, ChevronDown, Clock, Sparkles, Navigation, DollarSign, Heart, Award
} from 'lucide-react';
import PageTransition from '@/components/shared/PageTransition';
import { ALL_JOBS, EduJobItem } from '@/lib/eduNetworkData';

interface JobsClientProps {
  initialJobId?: string;
  isSingleJobPage?: boolean;
}

export default function JobsClient({ initialJobId, isSingleJobPage = false }: JobsClientProps) {
  const router = useRouter();

  // Filters State
  const [searchTitle, setSearchTitle] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedRoleType, setSelectedRoleType] = useState<string>('All');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'salary'>('relevance');

  // Active Selected Job in Split View
  const [selectedJobId, setSelectedJobId] = useState<string>(
    initialJobId || (ALL_JOBS.length > 0 ? ALL_JOBS[0].id : '')
  );

  // Saved / Bookmarked Jobs State
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [dismissedJobIds, setDismissedJobIds] = useState<string[]>([]);

  // Apply Modal State
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applyForm, setApplyForm] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '',
    qualification: '',
    message: '',
  });
  const [applySuccess, setApplySuccess] = useState(false);

  // Synchronize when initialJobId changes
  useEffect(() => {
    if (initialJobId) {
      setSelectedJobId(initialJobId);
    }
  }, [initialJobId]);

  // Filtered & Sorted Jobs
  const filteredJobs = useMemo(() => {
    return ALL_JOBS.filter((job) => {
      if (dismissedJobIds.includes(job.id)) return false;

      const qTitle = searchTitle.toLowerCase().trim();
      const qLoc = searchLocation.toLowerCase().trim();

      const matchTitle =
        !qTitle ||
        job.title.toLowerCase().includes(qTitle) ||
        job.subject.toLowerCase().includes(qTitle) ||
        job.orgName.toLowerCase().includes(qTitle) ||
        job.description.toLowerCase().includes(qTitle);

      const matchLoc =
        !qLoc ||
        job.city.toLowerCase().includes(qLoc) ||
        job.state.toLowerCase().includes(qLoc) ||
        job.pincode.includes(qLoc) ||
        job.address.toLowerCase().includes(qLoc);

      const matchSubject = selectedSubject === 'All' || job.subject === selectedSubject;
      const matchRole = selectedRoleType === 'All' || job.roleType === selectedRoleType;
      const matchCity = selectedCity === 'All' || job.city === selectedCity;

      return matchTitle && matchLoc && matchSubject && matchRole && matchCity;
    }).sort((a, b) => {
      if (sortBy === 'salary') return b.salaryNumMax - a.salaryNumMax;
      if (sortBy === 'date') return a.id.localeCompare(b.id);
      return 0; // relevance
    });
  }, [searchTitle, searchLocation, selectedSubject, selectedRoleType, selectedCity, sortBy, dismissedJobIds]);

  const selectedJob = useMemo(() => {
    return ALL_JOBS.find((j) => j.id === selectedJobId) || filteredJobs[0] || ALL_JOBS[0];
  }, [selectedJobId, filteredJobs]);

  const handleSelectJob = (job: EduJobItem) => {
    setSelectedJobId(job.id);
    if (isSingleJobPage) {
      router.push(`/edu-network/jobs/${job.id}`);
    } else {
      window.history.replaceState(null, '', `/edu-network/jobs?job=${job.id}`);
    }
  };

  const toggleSaveJob = (jobId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedJobIds((prev) =>
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    );
  };

  const handleDismissJob = (jobId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissedJobIds((prev) => [...prev, jobId]);
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApplySuccess(true);
    setTimeout(() => {
      setApplySuccess(false);
      setIsApplyModalOpen(false);
      setApplyForm({ name: '', email: '', phone: '', experience: '', qualification: '', message: '' });
    }, 1800);
  };

  const subjects = ['All', 'Physics', 'Chemistry', 'Biology', 'Mathematics', 'Robotics & AI', 'Computer Science', 'Lab Technology'];
  const cities = ['All', 'New Delhi', 'Bengaluru', 'Bhubaneswar', 'Mumbai', 'Pune', 'Kolkata', 'Hyderabad'];

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#f3f2f1] text-gray-900 pb-20">

        {/* ── TOP SEARCH & FILTER BAR (INDEED STYLE) ────────────────────────── */}
        <section className="bg-white border-b border-gray-200 shadow-2xs pt-4 pb-3 px-4 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto space-y-3">
            
            {/* Search Input Box */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2 bg-gray-50 border border-gray-300 rounded-2xl p-1.5 shadow-xs">
              
              {/* Job Title / Keywords */}
              <div className="md:col-span-6 flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl border border-gray-200">
                <Search className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Job title, keywords, or institution (e.g. Physics, Robotics, DPS)..."
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  className="w-full text-xs md:text-sm font-medium outline-none bg-transparent"
                />
                {searchTitle && (
                  <button onClick={() => setSearchTitle('')} className="text-gray-400 hover:text-gray-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* City / Pincode Location */}
              <div className="md:col-span-4 flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl border border-gray-200">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <input
                  type="text"
                  placeholder="City, state, or pincode (e.g. Delhi, 560001)..."
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full text-xs md:text-sm font-medium outline-none bg-transparent"
                />
                {searchLocation && (
                  <button onClick={() => setSearchLocation('')} className="text-gray-400 hover:text-gray-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Find Jobs Button */}
              <div className="md:col-span-2">
                <button
                  onClick={() => {}}
                  className="w-full h-full py-2 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs md:text-sm font-bold shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Find Jobs</span>
                </button>
              </div>

            </div>

            {/* Filter Pills (Pay, Job type, Subject, City, Experience) */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1 text-xs">
              
              {/* Subject Filter */}
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-3 py-1.5 bg-white border border-gray-300 rounded-full font-bold text-gray-700 outline-none hover:border-gray-400 cursor-pointer shadow-2xs"
              >
                {subjects.map((s) => (
                  <option key={s} value={s}>{s === 'All' ? 'All Subjects' : s}</option>
                ))}
              </select>

              {/* City Filter */}
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-3 py-1.5 bg-white border border-gray-300 rounded-full font-bold text-gray-700 outline-none hover:border-gray-400 cursor-pointer shadow-2xs"
              >
                {cities.map((c) => (
                  <option key={c} value={c}>{c === 'All' ? 'All Locations' : c}</option>
                ))}
              </select>

              {/* Role Type Filter */}
              <select
                value={selectedRoleType}
                onChange={(e) => setSelectedRoleType(e.target.value)}
                className="px-3 py-1.5 bg-white border border-gray-300 rounded-full font-bold text-gray-700 outline-none hover:border-gray-400 cursor-pointer shadow-2xs"
              >
                <option value="All">All Job Types</option>
                <option value="Full-Time">Full-Time</option>
                <option value="Lab Instructor">Lab Instructor</option>
                <option value="Visiting Faculty">Visiting Faculty</option>
              </select>

              {/* Sort by */}
              <div className="ml-auto flex items-center gap-1.5 text-xs text-gray-500 font-bold shrink-0">
                <span>Sort by:</span>
                <button
                  onClick={() => setSortBy('relevance')}
                  className={`underline ${sortBy === 'relevance' ? 'text-primary font-black' : 'text-gray-600'}`}
                >
                  relevance
                </button>
                <span>-</span>
                <button
                  onClick={() => setSortBy('date')}
                  className={`underline ${sortBy === 'date' ? 'text-primary font-black' : 'text-gray-600'}`}
                >
                  date
                </button>
                <span>-</span>
                <button
                  onClick={() => setSortBy('salary')}
                  className={`underline ${sortBy === 'salary' ? 'text-primary font-black' : 'text-gray-600'}`}
                >
                  salary
                </button>
              </div>

            </div>

          </div>
        </section>

        {/* ── 2-COLUMN SPLIT VIEW LAYOUT (LIKE INDEED) ───────────────────────── */}
        <main className="max-w-7xl mx-auto px-4 mt-4">
          
          <div className="flex items-center justify-between mb-3 text-xs text-gray-600 font-semibold">
            <p>
              Showing <strong>{filteredJobs.length}</strong> STEM & Faculty Jobs in India
            </p>
            <div className="flex items-center gap-3">
              <Link href="/edu-network" className="text-primary hover:underline flex items-center gap-1 font-bold">
                <Building2 className="w-3.5 h-3.5" />
                <span>View 100+ Institutions</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

            {/* ── LEFT COLUMN: SCROLLABLE JOBS LIST (42% / 5 Cols) ───────────── */}
            <div className="lg:col-span-5 space-y-3 max-h-[calc(100vh-160px)] overflow-y-auto pr-1">
              {filteredJobs.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center border border-gray-200 space-y-2">
                  <p className="font-bold text-gray-900">No jobs match your search criteria</p>
                  <p className="text-xs text-gray-500">Try clearing your filters or searching for different subjects.</p>
                  <button
                    onClick={() => {
                      setSearchTitle('');
                      setSearchLocation('');
                      setSelectedSubject('All');
                      setSelectedCity('All');
                      setSelectedRoleType('All');
                    }}
                    className="px-4 py-1.5 bg-primary text-white rounded-full text-xs font-bold mt-2"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                filteredJobs.map((job) => {
                  const isSelected = selectedJob?.id === job.id;
                  const isSaved = savedJobIds.includes(job.id);

                  return (
                    <div
                      key={job.id}
                      onClick={() => handleSelectJob(job)}
                      className={`bg-white rounded-2xl p-3 sm:p-4 cursor-pointer transition-all duration-150 border-2 relative ${
                        isSelected
                          ? 'border-primary shadow-md bg-blue-50/20'
                          : 'border-gray-200 hover:border-gray-400 hover:shadow-2xs'
                      }`}
                    >
                      {/* Top Badges */}
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {job.easilyApply && (
                            <span className="text-[10px] sm:text-[11px] font-bold text-primary bg-primary/10 px-1.5 sm:px-2 py-0.5 rounded">
                              Easily apply
                            </span>
                          )}
                          {job.isUrgentlyHiring && (
                            <span className="text-[10px] sm:text-[11px] font-bold text-pink-700 bg-pink-50 px-1.5 sm:px-2 py-0.5 rounded">
                              Urgently hiring
                            </span>
                          )}
                        </div>

                        {/* Actions (Bookmark & Dislike) */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => toggleSaveJob(job.id, e)}
                            className="p-1 text-gray-400 hover:text-primary transition-colors cursor-pointer"
                            title={isSaved ? 'Job Saved' : 'Save Job'}
                          >
                            <Bookmark className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isSaved ? 'fill-primary text-primary' : ''}`} />
                          </button>
                          <button
                            onClick={(e) => handleDismissJob(job.id, e)}
                            className="p-1 text-gray-300 hover:text-gray-600 transition-colors cursor-pointer"
                            title="Not interested"
                          >
                            <ThumbsDown className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Job Title */}
                      <Link
                        href={`/edu-network/jobs/${job.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-sm sm:text-base font-black text-gray-900 hover:text-primary transition-colors block leading-tight underline-offset-2 hover:underline"
                      >
                        {job.title}
                      </Link>

                      {/* Institution Name & Rating */}
                      <div className="flex items-center gap-1 text-[11px] sm:text-xs text-gray-700 font-semibold mt-1">
                        <Link
                          href={`/edu-network/org/${job.orgId}`}
                          onClick={(e) => e.stopPropagation()}
                          className="hover:underline flex items-center gap-1 text-gray-900 font-bold truncate"
                        >
                          <span className="truncate">{job.orgName}</span>
                          <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-400 shrink-0" />
                        </Link>
                        <span className="text-gray-300">•</span>
                        <span className="flex items-center gap-0.5 text-gray-800 font-bold shrink-0">
                          <span>{job.orgRating}</span>
                          <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-500 fill-amber-500" />
                        </span>
                      </div>

                      {/* City & Address */}
                      <p className="text-[10px] sm:text-xs text-gray-500 font-medium mt-0.5">
                        {job.city}, {job.state}
                      </p>

                      {/* Salary & Type Pills */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 bg-gray-100 text-gray-800 text-[11px] sm:text-xs font-black rounded-md sm:rounded-lg">
                          {job.salary}
                        </span>
                        <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] sm:text-xs font-bold rounded-md sm:rounded-lg flex items-center gap-1">
                          <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-600 stroke-[3]" />
                          <span>{job.roleType}</span>
                        </span>
                      </div>

                      {/* Perks Highlights */}
                      <div className="flex flex-wrap items-center gap-1 mt-1.5 text-[10px] sm:text-[11px] text-gray-500">
                        {job.benefits.slice(0, 2).map((b, i) => (
                          <span key={i} className="bg-gray-50 border border-gray-100 px-1.5 sm:px-2 py-0.5 rounded font-medium">
                            {b}
                          </span>
                        ))}
                        {job.benefits.length > 2 && (
                          <span className="text-gray-400 font-bold">+{job.benefits.length - 2}</span>
                        )}
                      </div>

                      {/* Posted Timestamp */}
                      <div className="flex items-center justify-between text-[9px] sm:text-[10px] text-gray-400 font-semibold mt-2.5 pt-1.5 border-t border-gray-100">
                        <span>Posted {job.postedDate}</span>
                        <span className="text-primary font-bold">View details →</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* ── RIGHT COLUMN: STICKY DETAILED JOB VIEW (58% / 7 Cols) ───────── */}
            <div className="lg:col-span-7 sticky top-[120px] max-h-[calc(100vh-140px)] overflow-y-auto bg-white rounded-3xl border border-gray-200 shadow-md p-6 space-y-6">
              {selectedJob ? (
                <>
                  {/* Detailed Header Card */}
                  <div className="space-y-3 pb-5 border-b border-gray-200">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-xl md:text-2xl font-black text-gray-900 leading-tight">
                          {selectedJob.title}
                        </h2>

                        <div className="flex items-center gap-2 text-xs font-bold text-gray-700 mt-1.5 flex-wrap">
                          <Link
                            href={`/edu-network/org/${selectedJob.orgId}`}
                            className="text-primary hover:underline font-black flex items-center gap-1 text-sm"
                          >
                            <span>{selectedJob.orgName}</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          <span className="text-gray-300">•</span>
                          <span className="flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-md">
                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                            <span>{selectedJob.orgRating} Rating</span>
                          </span>
                        </div>

                        <p className="text-xs text-gray-500 font-semibold mt-1">
                          📍 {selectedJob.address}, {selectedJob.city}, {selectedJob.state} - <strong>{selectedJob.pincode}</strong>
                        </p>
                      </div>

                      {/* Org Avatar */}
                      <Link href={`/edu-network/org/${selectedJob.orgId}`} className="w-14 h-14 rounded-2xl border border-gray-200 bg-white p-1.5 shadow-xs shrink-0 block">
                        <img src={selectedJob.orgLogo} alt="" className="w-full h-full object-contain rounded-xl" />
                      </Link>
                    </div>

                    {/* Salary Highlight Box */}
                    <div className="text-base font-black text-gray-900">
                      {selectedJob.salary}
                    </div>

                    {/* Primary Apply CTA Bar */}
                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      <button
                        onClick={() => setIsApplyModalOpen(true)}
                        className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-full text-xs md:text-sm font-black shadow-md flex items-center gap-2 transition-transform hover:scale-105"
                      >
                        <Send className="w-4 h-4" />
                        <span>Apply with CSEEL Profile</span>
                      </button>

                      <button
                        onClick={(e) => toggleSaveJob(selectedJob.id, e)}
                        className={`p-3 rounded-full border transition-colors ${
                          savedJobIds.includes(selectedJob.id)
                            ? 'bg-primary/10 border-primary text-primary'
                            : 'bg-gray-100 hover:bg-gray-200 border-gray-300 text-gray-700'
                        }`}
                        title="Save Job"
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          const url = `${window.location.origin}/edu-network/jobs/${selectedJob.id}`;
                          navigator.clipboard.writeText(url);
                          alert('Job link copied to clipboard!');
                        }}
                        className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 transition-colors"
                        title="Share Job URL"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>

                      <Link
                        href={`/edu-network/jobs/${selectedJob.id}`}
                        className="ml-auto text-xs text-primary font-bold underline flex items-center gap-0.5"
                      >
                        <span>Direct Job URL</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>

                  {/* ── JOB DETAILS SECTION (INDEED FORMAT) ────────────────── */}
                  <div className="space-y-4 text-xs">
                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">
                      Job details
                    </h3>

                    {/* Pay section */}
                    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-1">
                      <div className="flex items-center gap-2 font-black text-gray-900">
                        <DollarSign className="w-4 h-4 text-emerald-600" />
                        <span>Pay</span>
                      </div>
                      <div className="pl-6">
                        <span className="inline-block px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-black text-gray-900 shadow-2xs">
                          {selectedJob.salary}
                        </span>
                      </div>
                    </div>

                    {/* Job Type section */}
                    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-2">
                      <div className="flex items-center gap-2 font-black text-gray-900">
                        <Briefcase className="w-4 h-4 text-primary" />
                        <span>Job type</span>
                      </div>
                      <div className="pl-6 flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-800 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                          <span>{selectedJob.jobTypeCategory}</span>
                        </span>
                        <span className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-800 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                          <span>{selectedJob.roleType}</span>
                        </span>
                      </div>
                    </div>

                    {/* Shift & Schedule */}
                    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-1">
                      <div className="flex items-center gap-2 font-black text-gray-900">
                        <Clock className="w-4 h-4 text-purple-600" />
                        <span>Shift and schedule</span>
                      </div>
                      <p className="pl-6 text-gray-700 font-semibold">{selectedJob.jobShift}</p>
                    </div>

                    {/* Benefits & Perks */}
                    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-2">
                      <div className="flex items-center gap-2 font-black text-gray-900">
                        <Award className="w-4 h-4 text-amber-600" />
                        <span>Benefits & Perks</span>
                      </div>
                      <div className="pl-6 flex flex-wrap gap-2">
                        {selectedJob.benefits.map((b, i) => (
                          <span key={i} className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 shadow-2xs">
                            {b}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Physical Location with Google Maps link */}
                    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-2">
                      <div className="flex items-center gap-2 font-black text-gray-900">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>Location</span>
                      </div>
                      <p className="pl-6 text-gray-700 font-medium">
                        {selectedJob.address}, {selectedJob.city}, {selectedJob.state} ({selectedJob.pincode})
                      </p>
                      <div className="pl-6 pt-1">
                        <a
                          href={`https://maps.google.com/?q=${encodeURIComponent(`${selectedJob.orgName} ${selectedJob.city}`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary font-bold underline flex items-center gap-1"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          <span>Get Directions on Google Maps</span>
                        </a>
                      </div>
                    </div>

                  </div>

                  {/* ── FULL JOB DESCRIPTION ────────────────────────────────── */}
                  <div className="space-y-3 pt-4 border-t border-gray-200 text-xs text-gray-800 leading-relaxed">
                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">
                      Full Job Description
                    </h3>

                    {/<[a-z][\s\S]*>/i.test(selectedJob.description) ? (
                      <div
                        className="prose prose-sm max-w-none text-xs text-gray-800 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: selectedJob.description }}
                      />
                    ) : (
                      <p>{selectedJob.description}</p>
                    )}

                    <div>
                      <h4 className="font-bold text-gray-900 text-xs mb-1.5 uppercase">Key Responsibilities:</h4>
                      <ul className="space-y-1.5 list-disc pl-5 text-gray-700">
                        {selectedJob.responsibilities.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-bold text-gray-900 text-xs mb-1.5 uppercase">Qualifications & Experience:</h4>
                      <ul className="space-y-1.5 list-disc pl-5 text-gray-700">
                        <li><strong>Experience:</strong> {selectedJob.experienceRequired}</li>
                        <li><strong>Education:</strong> {selectedJob.qualifications}</li>
                        {selectedJob.requirements.map((req, i) => (
                          <li key={i}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* ── HIRING INSTITUTION INSIGHTS ──────────────────────────── */}
                  <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 text-xs space-y-2">
                    <h4 className="font-black text-primary uppercase text-[11px]">Hiring Insights:</h4>
                    <p className="text-gray-700">
                      • Hiring <strong>{selectedJob.openings} candidate(s)</strong> for this role.
                    </p>
                    <p className="text-gray-700">
                      • Urgently hiring: Active response rate within 24 hours.
                    </p>
                    <div className="pt-2">
                      <Link
                        href={`/edu-network/org/${selectedJob.orgId}`}
                        className="text-xs font-bold text-primary underline flex items-center gap-1"
                      >
                        <span>View complete {selectedJob.orgName} Campus Profile & Social Feed →</span>
                      </Link>
                    </div>
                  </div>

                  {/* Bottom Apply CTA */}
                  <div className="pt-4 border-t border-gray-200">
                    <button
                      onClick={() => setIsApplyModalOpen(true)}
                      className="w-full py-3.5 bg-primary hover:bg-primary/90 text-white rounded-2xl text-sm font-black shadow-lg transition-transform hover:scale-[1.01] flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Apply Now @ {selectedJob.orgName}</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="py-20 text-center text-gray-500 text-xs">
                  Select a job on the left to view full details
                </div>
              )}
            </div>

          </div>

        </main>

        {/* ── MODAL: 1-CLICK APPLICATION ──────────────────────────────────────── */}
        <AnimatePresence>
          {isApplyModalOpen && selectedJob && (
            <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsApplyModalOpen(false)} />
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">Apply with CSEEL Profile</h3>
                    <p className="text-[11px] text-gray-500">{selectedJob.title} @ {selectedJob.orgName}</p>
                  </div>
                  <button onClick={() => setIsApplyModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
                </div>

                {applySuccess ? (
                  <div className="py-8 text-center flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <Check className="w-6 h-6 stroke-[3]" />
                    </div>
                    <h4 className="font-bold text-gray-900">Application & Resume Submitted!</h4>
                    <p className="text-xs text-gray-500">Your profile and credentials have been forwarded directly to the hiring coordinator at {selectedJob.orgName}.</p>
                  </div>
                ) : (
                  <form onSubmit={handleApplySubmit} className="mt-4 space-y-3">
                    
                    {/* Resume Upload Box */}
                    <div className="bg-primary/5 border-2 border-dashed border-primary/30 rounded-2xl p-4 text-center space-y-1">
                      <p className="text-xs font-bold text-gray-900">Upload Your Resume / CV (.pdf or .docx) *</p>
                      <p className="text-[10px] text-gray-500">Attach your latest academic credentials & lab workshop records</p>
                      
                      <div className="pt-2">
                        {applyForm.experience ? (
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Faculty_STEM_Resume_2026.pdf (1.5 MB)</span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setApplyForm({ ...applyForm, experience: '3+ Years PGT Physics' })}
                            className="px-4 py-1.5 bg-white border border-primary text-primary hover:bg-primary hover:text-white rounded-lg text-xs font-bold transition-colors shadow-2xs"
                          >
                            Choose Resume File (.pdf)
                          </button>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Dr. / Mr. Science Educator"
                        value={applyForm.name}
                        onChange={(e) => setApplyForm({ ...applyForm, name: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-bold text-gray-700 block mb-1">Email Address *</label>
                        <input
                          type="email"
                          required
                          placeholder="educator@cseel.network"
                          value={applyForm.email}
                          onChange={(e) => setApplyForm({ ...applyForm, email: e.target.value })}
                          className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-gray-700 block mb-1">Phone Number *</label>
                        <input
                          type="tel"
                          required
                          placeholder="+91 98765 43210"
                          value={applyForm.phone}
                          onChange={(e) => setApplyForm({ ...applyForm, phone: e.target.value })}
                          className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl outline-none"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-bold text-gray-700 block mb-1">Total Experience</label>
                        <input
                          type="text"
                          placeholder="e.g. 4+ Years PGT"
                          value={applyForm.experience}
                          onChange={(e) => setApplyForm({ ...applyForm, experience: e.target.value })}
                          className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-gray-700 block mb-1">Highest Qualification</label>
                        <input
                          type="text"
                          placeholder="e.g. M.Sc. Physics, B.Ed"
                          value={applyForm.qualification}
                          onChange={(e) => setApplyForm({ ...applyForm, qualification: e.target.value })}
                          className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">Cover Note / Key Lab Apparatus Expertise</label>
                      <textarea
                        rows={2}
                        placeholder="Mention your NEP-2020 teaching experience and hands-on lab projects..."
                        value={applyForm.message}
                        onChange={(e) => setApplyForm({ ...applyForm, message: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-black shadow-lg transition-colors mt-2"
                    >
                      Submit Application Directly to {selectedJob.orgName}
                    </button>
                  </form>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </PageTransition>
  );
}
