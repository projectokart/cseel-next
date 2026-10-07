'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap, MapPin, Building2, Star, CheckCircle2, ShieldCheck,
  Award, Mail, Phone, Calendar, Download, Send, Share2, ArrowRight,
  Sparkles, BookOpen, Beaker, Check, ChevronLeft, ExternalLink, X,
  MessageSquare, UserCheck, Clock, FileText, CheckSquare, Settings,
  Globe, Users, Lock, Layers, Code, Database, Plus, Upload
} from 'lucide-react';
import PageTransition from '@/components/shared/PageTransition';
import { TeacherItem, ALL_TEACHERS, getTeacherById, TeacherResourceItem } from '@/lib/eduNetworkData';

interface TeacherProfileClientProps {
  teacherId: string;
}

export default function TeacherProfileClient({ teacherId }: TeacherProfileClientProps) {
  const initialTeacher = getTeacherById(teacherId) || ALL_TEACHERS[0];

  const defaultResources: TeacherResourceItem[] = [
    {
      id: 'res-1',
      title: `${initialTeacher.subject} Hands-on Laboratory Practical Guide (NEP-2020)`,
      type: 'Lab Manual',
      subject: initialTeacher.subject,
      size: '4.8 MB',
      visibility: 'public',
      downloadsCount: 320,
    },
    {
      id: 'res-2',
      title: `Senior Secondary Optics & Experiment Apparatus Blueprint`,
      type: 'Lesson Plan',
      subject: initialTeacher.subject,
      size: '2.1 MB',
      visibility: 'public',
      downloadsCount: 195,
    },
    {
      id: 'res-3',
      title: `Olympiad & Competitive Science Question Bank (2026 Edition)`,
      type: 'Worksheet',
      subject: initialTeacher.subject,
      size: '8.4 MB',
      visibility: 'followers',
      downloadsCount: 84,
    },
    {
      id: 'res-4',
      title: `Peer-Reviewed Paper: Experiential Learning in Indian High Schools`,
      type: 'Research Paper',
      subject: initialTeacher.subject,
      size: '1.5 MB',
      visibility: 'private',
      downloadsCount: 12,
    },
  ];

  const [teacher, setTeacher] = useState<TeacherItem>(initialTeacher);
  const [resources, setResources] = useState<TeacherResourceItem[]>(
    initialTeacher.resources || defaultResources
  );
  const [profileVisibility, setProfileVisibility] = useState<'public' | 'private' | 'followers'>('public');
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeToast, setActiveToast] = useState<string | null>(null);

  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [connectForm, setConnectForm] = useState({
    name: '',
    email: '',
    phone: '',
    orgName: '',
    roleNeeded: 'Full-Time Faculty',
    message: '',
  });
  const [connectSuccess, setConnectSuccess] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const showToast = (message: string) => {
    setActiveToast(message);
    setTimeout(() => {
      setActiveToast(null);
    }, 3000);
  };

  const handleProfileVisibilityChange = (newVisibility: 'public' | 'private' | 'followers') => {
    setProfileVisibility(newVisibility);
    showToast(`Faculty profile visibility updated to "${newVisibility.toUpperCase()}"!`);
  };

  const handleResourceVisibilityChange = (resourceId: string, newVisibility: 'public' | 'private' | 'followers') => {
    setResources((prev) =>
      prev.map((res) => (res.id === resourceId ? { ...res, visibility: newVisibility } : res))
    );
    showToast(`Resource permissions changed to: ${newVisibility.toUpperCase()}`);
  };

  const handleConnectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConnectSuccess(true);
    setTimeout(() => {
      setConnectSuccess(false);
      setIsConnectModalOpen(false);
      setConnectForm({ name: '', email: '', phone: '', orgName: '', roleNeeded: 'Full-Time Faculty', message: '' });
    }, 1800);
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      if (navigator.share) {
        navigator.share({
          title: `${teacher.name} - Verified ${teacher.subject} Faculty`,
          url: window.location.href,
        });
      } else {
        navigator.clipboard.writeText(window.location.href);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#F8FAFC] pb-24 text-gray-800">
        
        {/* ── TOAST NOTIFICATION ──────────────────────────────────────────────── */}
        <AnimatePresence>
          {activeToast && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-4 right-4 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>{activeToast}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── BREADCRUMB ──────────────────────────────────────────────────────── */}
        <div className="bg-white border-b border-gray-200/90 py-3 px-4 sticky top-0 z-20 shadow-2xs">
          <div className="container mx-auto max-w-6xl flex items-center justify-between text-xs">
            <Link
              href="/edu-network?tab=teachers"
              className="inline-flex items-center gap-1.5 text-gray-600 hover:text-primary font-bold transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Verified Faculty Directory</span>
            </Link>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-gray-700 font-bold rounded-lg transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{isCopied ? 'Link Copied!' : 'Share Profile'}</span>
            </button>
          </div>
        </div>

        {/* ── TEACHER HERO PROFILE CARD & PRIVACY CONTROLS ─────────────────────── */}
        <section className="container mx-auto px-4 max-w-6xl mt-6">
          <div className="bg-white rounded-3xl border border-gray-200/90 shadow-sm p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-purple-100/50 via-teal-50/40 to-transparent pointer-events-none rounded-bl-full" />

            <div className="flex flex-col md:flex-row items-start gap-6 relative z-10">
              
              {/* Profile Avatar */}
              <div className="relative shrink-0 mx-auto md:mx-0">
                <img
                  src={teacher.avatar}
                  alt={teacher.name}
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover border-4 border-white shadow-md"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop";
                  }}
                />
                {teacher.verified && (
                  <div className="absolute -bottom-2 -right-2 bg-cyan-600 text-white p-1.5 rounded-full border-2 border-white shadow-xs" title="CSEEL Verified Faculty">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                )}
              </div>

              {/* Profile Details */}
              <div className="flex-1 space-y-3 text-center md:text-left">
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-black uppercase rounded-full">
                    {teacher.subject}
                  </span>
                  {teacher.nepCertified && (
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 text-[11px] font-bold rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>NEP-2020 Certified</span>
                    </span>
                  )}
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-300 text-[11px] font-black rounded-full flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{teacher.rating} ({teacher.reviewsCount} Reviews)</span>
                  </span>
                </div>

                <div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 leading-tight">
                    {teacher.name}
                  </h1>
                  <p className="text-xs sm:text-sm font-bold text-gray-600 mt-1 flex flex-wrap items-center justify-center md:justify-start gap-2">
                    <span className="text-purple-900">{teacher.qualification}</span>
                    <span>•</span>
                    <span>{teacher.experienceYears}+ Years Practical Experience</span>
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs text-gray-600 pt-1">
                  <span className="flex items-center gap-1 font-semibold">
                    <Building2 className="w-3.5 h-3.5 text-purple-700" />
                    <span>{teacher.currentInstitute}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{teacher.city}, {teacher.state} ({teacher.pincode})</span>
                  </span>
                  <span>•</span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Exp. Salary: {teacher.expectedSalary}
                  </span>
                </div>

                {/* ── 72-HOUR FLASH JOB SEEKING STATUS PILL ─────────────────────── */}
                <div className="p-3 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border border-emerald-300 rounded-2xl flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
                    <span className="font-black text-emerald-950">
                      ⚡ Actively Seeking Teaching Role (Immediate Joiner)
                    </span>
                    <span className="text-[10px] bg-emerald-600 text-white font-black px-2 py-0.5 rounded-full">
                      Active for next {teacher.jobSeekingExpiresInHours || 52} Hours
                    </span>
                  </div>
                  <button
                    onClick={() => showToast('72-Hour Flash Job Seeking status renewed for another 3 days!')}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black rounded-xl shadow-xs transition-colors"
                  >
                    ⚡ Renew 72h Flash Status
                  </button>
                </div>

                {/* ── PRIVACY SETTINGS BANNER FOR TEACHER ─────────────────────── */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 sm:p-4 text-xs space-y-2 mt-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-black text-gray-800 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                      <Settings className="w-3.5 h-3.5 text-purple-700" />
                      <span>Profile & Resource Visibility Control</span>
                    </span>

                    {/* Profile Visibility Switcher */}
                    <div className="inline-flex items-center bg-white border border-gray-200 rounded-xl p-0.5 shadow-2xs">
                      <button
                        onClick={() => handleProfileVisibilityChange('public')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${
                          profileVisibility === 'public'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <Globe className="w-3 h-3" />
                        <span>Public</span>
                      </button>
                      <button
                        onClick={() => handleProfileVisibilityChange('followers')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${
                          profileVisibility === 'followers'
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <Users className="w-3 h-3" />
                        <span>Followers Only</span>
                      </button>
                      <button
                        onClick={() => handleProfileVisibilityChange('private')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${
                          profileVisibility === 'private'
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <Lock className="w-3 h-3" />
                        <span>Private</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200/60 text-[11px] text-gray-600">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showContactInfo}
                        onChange={() => {
                          setShowContactInfo(!showContactInfo);
                          showToast(
                            !showContactInfo
                              ? 'Contact details are now visible to verified institutions!'
                              : 'Contact details hidden from public view.'
                          );
                        }}
                        className="w-3.5 h-3.5 text-purple-600 rounded"
                      />
                      <span>Display official direct phone & email to verified schools</span>
                    </label>

                    <span className="text-[10px] text-gray-400 font-medium">
                      Status: {profileVisibility.toUpperCase()} • Direct Contact: {showContactInfo ? 'Visible' : 'Hidden'}
                    </span>
                  </div>
                </div>

                {/* Profile CTAs */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                  <button
                    onClick={() => setIsConnectModalOpen(true)}
                    className="px-6 py-2.5 bg-purple-700 hover:bg-purple-600 text-white rounded-xl text-xs font-black shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Hire / Message Faculty</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsFollowing(!isFollowing);
                      showToast(isFollowing ? 'Unfollowed educator' : 'Following educator! Exclusive worksheets & lab manuals unlocked.');
                    }}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                      isFollowing
                        ? 'bg-slate-200 text-gray-800'
                        : 'bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>{isFollowing ? 'Following' : '+ Follow Faculty'}</span>
                  </button>
                </div>

              </div>

            </div>

          </div>
        </section>

        {/* ── MAIN CONTENT GRID ────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 max-w-6xl mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Content Area (8 Cols) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* 1. Teaching Resources & Lab Manual Vault with Granular Privacy */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/90 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-purple-700" />
                      <span>Teaching Material & Lab Manual Vault ({resources.length})</span>
                    </h2>
                    <p className="text-xs text-gray-500">
                      Curated lesson plans, experiment demonstrations, and question banks with customizable privacy access.
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {resources.map((res) => (
                    <div
                      key={res.id}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-gray-200/80 hover:bg-slate-100/80 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center font-bold text-xs shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 truncate">
                            {res.title}
                          </p>
                          <p className="text-[10px] text-gray-500">
                            {res.type} • {res.size} • {res.downloadsCount} Downloads
                          </p>
                        </div>
                      </div>

                      {/* File-level visibility selector */}
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                        <select
                          value={res.visibility}
                          onChange={(e) => handleResourceVisibilityChange(res.id, e.target.value as any)}
                          aria-label={`Visibility for ${res.title}`}
                          className={`px-2.5 py-1 rounded-xl text-[11px] font-black outline-none border cursor-pointer ${
                            res.visibility === 'public'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : res.visibility === 'followers'
                              ? 'bg-purple-50 text-purple-800 border-purple-300'
                              : 'bg-rose-50 text-rose-800 border-rose-300'
                          }`}
                        >
                          <option value="public">🌐 Public</option>
                          <option value="followers">👥 Followers</option>
                          <option value="private">🔒 Private</option>
                        </select>

                        {res.visibility === 'followers' && !isFollowing ? (
                          <button
                            onClick={() => {
                              setIsFollowing(true);
                              showToast('Followed educator! Download unlocked.');
                            }}
                            className="px-2.5 py-1 bg-purple-100 hover:bg-purple-200 text-purple-900 rounded-xl text-[11px] font-bold transition-colors flex items-center gap-1"
                          >
                            <Lock className="w-3 h-3" />
                            <span>Unlock</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => showToast(`Downloaded "${res.title}"`)}
                            className="px-2.5 py-1 bg-white hover:bg-slate-200 text-gray-800 border border-gray-200 rounded-xl text-[11px] font-bold transition-colors flex items-center gap-1 shadow-2xs"
                          >
                            <Download className="w-3 h-3 text-gray-600" />
                            <span>Download</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Biography & Pedagogy */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/90 shadow-sm space-y-4">
                <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-purple-700" />
                  <span>Educator Biography & Teaching Philosophy</span>
                </h2>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                  {teacher.bio}
                </p>
                <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 text-xs text-purple-950 space-y-1.5">
                  <span className="font-bold block flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-700" />
                    <span>Hands-on NEP-2020 Methodology:</span>
                  </span>
                  <p className="text-purple-900 leading-relaxed text-[11px]">
                    Focuses on transforming textbook theory into tangible physical experiments, guided inquiry questioning, and hardware project mentorship for national science competitions.
                  </p>
                </div>
              </div>

              {/* 3. Skills & Competencies */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/90 shadow-sm space-y-4">
                <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
                  <Beaker className="w-4 h-4 text-emerald-700" />
                  <span>Subject Expertise & Laboratory Skills</span>
                </h2>
                <div className="flex flex-wrap gap-2">
                  {teacher.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-gray-800 text-xs font-bold rounded-xl border border-gray-200 transition-colors flex items-center gap-1.5"
                    >
                      <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>{skill}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* 4. Availability Modes */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/90 shadow-sm space-y-4">
                <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>Available Engagement Models</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {teacher.availableFor.map((mode, i) => (
                    <div key={i} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-purple-700 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-gray-900">{mode}</p>
                        <p className="text-[10px] text-gray-500">Open for immediate institutional hiring</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Verified Reviews */}
              <div id="reviews" className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/90 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span>Peer & Student Reviews ({teacher.reviewsCount})</span>
                  </h2>
                  <span className="text-xs font-bold text-gray-500">
                    Rating: {teacher.rating} / 5.0
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-gray-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-purple-200 text-purple-900 font-black text-xs flex items-center justify-center">
                          P
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">Principal, DPS Chapter</p>
                          <p className="text-[10px] text-gray-500">Institutional Review</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 text-amber-500">
                        {[...Array(5)].map((_, idx) => (
                          <Star key={idx} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      "Outstanding pedagogy and genuine passion for hands-on student lab demonstrations. Students led by this faculty achieved top honors in the national science symposium."
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Sidebar (4 Cols) */}
            <aside className="lg:col-span-4 space-y-5 lg:sticky lg:top-20">
              
              {/* Quick Institutional Hiring Card */}
              <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 shadow-md space-y-4">
                <div className="flex items-center gap-2 text-xs font-black uppercase text-purple-300">
                  <UserCheck className="w-4 h-4" />
                  <span>Verified Faculty Profile</span>
                </div>

                <h3 className="text-lg font-black leading-snug">
                  Looking to hire {teacher.name}?
                </h3>

                <p className="text-xs text-purple-100 leading-relaxed">
                  Send an official recruitment enquiry or invite for a visiting lecture at your school/college.
                </p>

                <button
                  onClick={() => setIsConnectModalOpen(true)}
                  className="w-full py-3 bg-white text-purple-950 font-black text-xs rounded-2xl hover:bg-purple-50 transition-colors shadow-xs flex items-center justify-center gap-2"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send Direct Invitation</span>
                </button>
              </div>

              {/* CSEEL Verification Badge Box */}
              <div className="bg-white rounded-3xl p-5 border border-gray-200/90 shadow-2xs space-y-3 text-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-600" />
                  <h4 className="font-bold text-gray-900">CSEEL Trust & Verification</h4>
                </div>
                <ul className="space-y-2 text-[11px] text-gray-600">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Degree & Academic Credentials Verified</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>NEP-2020 Hands-on Teaching Audit Passed</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Zero Disciplinary Flag Record</span>
                  </li>
                </ul>
              </div>

            </aside>

          </div>
        </section>

        {/* ── MODAL: CONNECT / RECRUIT FACULTY ─────────────────────────────────── */}
        <AnimatePresence>
          {isConnectModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 relative"
              >
                <button
                  onClick={() => setIsConnectModalOpen(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="space-y-1 mb-4">
                  <span className="text-[10px] font-black uppercase text-purple-700 tracking-wider">
                    Institutional Connect
                  </span>
                  <h3 className="text-lg font-black text-gray-900">
                    Connect with {teacher.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Submit your school's invitation or job opportunity. The faculty will respond within 24 hours.
                  </p>
                </div>

                {connectSuccess ? (
                  <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                    <h4 className="text-sm font-black text-emerald-900">Invitation Sent Successfully!</h4>
                    <p className="text-xs text-emerald-700">
                      Your enquiry has been delivered to {teacher.name}.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleConnectSubmit} className="space-y-3 text-xs">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Your Name / Principal Name</label>
                      <input
                        type="text"
                        required
                        value={connectForm.name}
                        onChange={(e) => setConnectForm({ ...connectForm, name: e.target.value })}
                        placeholder="e.g. Dr. K. S. Verma"
                        className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl outline-none focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">School / Institution Name</label>
                      <input
                        type="text"
                        required
                        value={connectForm.orgName}
                        onChange={(e) => setConnectForm({ ...connectForm, orgName: e.target.value })}
                        placeholder="e.g. Delhi Public School"
                        className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl outline-none focus:bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">Official Email</label>
                        <input
                          type="email"
                          required
                          value={connectForm.email}
                          onChange={(e) => setConnectForm({ ...connectForm, email: e.target.value })}
                          placeholder="principal@school.edu.in"
                          className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl outline-none focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          required
                          value={connectForm.phone}
                          onChange={(e) => setConnectForm({ ...connectForm, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl outline-none focus:bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Message / Opportunity Brief</label>
                      <textarea
                        rows={3}
                        required
                        value={connectForm.message}
                        onChange={(e) => setConnectForm({ ...connectForm, message: e.target.value })}
                        placeholder="Briefly describe the role, compensation, and school location..."
                        className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl outline-none focus:bg-white resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-purple-700 hover:bg-purple-600 text-white font-black rounded-xl text-xs shadow-md transition-all mt-2"
                    >
                      Send Message & Contact Request
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
