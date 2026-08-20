'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Clock, MapPin, Users, Award, CheckCircle2,
  ArrowRight, Share2, Sparkles, BookOpen, ExternalLink,
  ChevronRight, ChevronLeft, X, Check, ShieldCheck, Download,
  Building2, School, FileText, Ticket, Printer, Navigation,
  Radio, Play, ArrowLeft, Send
} from 'lucide-react';
import PageTransition from '@/components/shared/PageTransition';
import { SeminarItem } from '@/lib/seminarsData';

interface Props {
  seminar: SeminarItem;
  allSeminars: SeminarItem[];
}

export default function SeminarDetailClient({ seminar, allSeminars }: Props) {
  // Modals state
  const [showSchoolRegModal, setShowSchoolRegModal] = useState(false);
  const [showIndRegModal, setShowIndRegModal] = useState(false);
  const [showLetterheadModal, setShowLetterheadModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Forms
  const [schoolForm, setSchoolForm] = useState({
    schoolName: '',
    principalName: '',
    email: '',
    phone: '',
    city: seminar.venueDetails.city,
    studentCount: '10',
    teacherCount: '2',
    needsBooth: true,
  });

  const [indForm, setIndForm] = useState({
    name: '',
    email: '',
    phone: '',
    institution: '',
    role: 'Student',
  });

  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const handleSchoolSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSuccess('School delegation pass confirmed! Official pass generated below.');
    setTimeout(() => {
      setShowSchoolRegModal(false);
      setShowLetterheadModal(true);
      setFormSuccess(null);
    }, 1200);
  };

  const handleIndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSuccess('Pass issued successfully! Check your email.');
    setTimeout(() => {
      setShowIndRegModal(false);
      setFormSuccess(null);
    }, 1200);
  };

  const otherSeminars = allSeminars.filter((s) => s.id !== seminar.id);

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#F8FAFC] pb-24 text-gray-800">

        {/* ── BREADCRUMBS & TOP NAV BAR ────────────────────────────────────────── */}
        <div className="bg-[#07172B] border-b border-white/10 text-slate-300 text-xs py-3 px-4">
          <div className="container mx-auto max-w-6xl flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <Link href="/seminars" className="hover:text-white transition-colors">Seminars & Conclaves</Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="text-cyan-300 font-bold truncate max-w-[200px] sm:max-w-xs">
                {seminar.title}
              </span>
            </div>

            <Link
              href="/seminars"
              className="inline-flex items-center gap-1 text-white hover:text-cyan-300 font-bold transition-colors shrink-0 ml-4"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Directory</span>
            </Link>
          </div>
        </div>

        {/* ── HERO BANNER SECTION ─────────────────────────────────────────────── */}
        <section className="relative bg-[#07172B] text-white pt-10 pb-16 md:pt-14 md:pb-20 overflow-hidden">
          {/* Background Photography with Top-Clear Bottom-Gradient */}
          <div className="absolute inset-0 z-0">
            <img
              src={seminar.bannerImage}
              alt={seminar.title}
              className="w-full h-full object-cover object-center scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&auto=format&fit=crop";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#07172B] via-[#07172B]/90 to-[#07172B]/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07172B] via-transparent to-transparent" />
          </div>

          <div className="container mx-auto px-4 max-w-6xl relative z-10 space-y-6">
            
            {/* Status & Category Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border shadow-xs ${
                seminar.status === 'Live Now'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-400/40 animate-pulse'
                  : seminar.status === 'Completed / Recorded'
                  ? 'bg-slate-700/50 text-slate-300 border-slate-600'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
              }`}>
                {seminar.status === 'Live Now' ? '🔴 Live Stream Active' : seminar.status === 'Completed / Recorded' ? '📜 Archive Recording' : `🟢 Upcoming Summit in ${seminar.venueDetails.city}`}
              </span>

              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-xs font-bold">
                {seminar.category}
              </span>

              <span className="px-3 py-1 rounded-full bg-white/10 text-slate-200 border border-white/15 text-xs font-bold">
                {seminar.mode}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight max-w-4xl tracking-tight drop-shadow-md">
              {seminar.title}
            </h1>

            {/* Quick Summary */}
            <p className="text-sm sm:text-base text-slate-200 max-w-3xl leading-relaxed font-normal">
              {seminar.summary}
            </p>

            {/* Key Meta Strip (Date, Time, Venue, Capacity) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl pt-2">
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 space-y-1">
                <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider block flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Date
                </span>
                <span className="text-xs sm:text-sm font-black text-white block truncate">
                  {seminar.date}
                </span>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 space-y-1">
                <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider block flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Time & Duration
                </span>
                <span className="text-xs sm:text-sm font-black text-white block truncate">
                  {seminar.time}
                </span>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 space-y-1">
                <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider block flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Venue Chapter
                </span>
                <span className="text-xs sm:text-sm font-black text-white block truncate">
                  {seminar.venueDetails.city}
                </span>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 space-y-1">
                <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider block flex items-center gap-1">
                  <Users className="w-3 h-3" /> Enrolled
                </span>
                <span className="text-xs sm:text-sm font-black text-white block truncate">
                  {seminar.enrolledSchoolsCount}+ Schools
                </span>
              </div>
            </div>

            {/* Hero Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              {seminar.status === 'Completed / Recorded' ? (
                <button
                  onClick={() => setShowVideoModal(true)}
                  className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-900 rounded-full text-xs font-black shadow-lg transition-all flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Watch Keynote Recording (Full HD)</span>
                </button>
              ) : seminar.status === 'Live Now' ? (
                <>
                  <button
                    onClick={() => setShowVideoModal(true)}
                    className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-full text-xs font-black shadow-lg transition-all flex items-center gap-2 animate-pulse"
                  >
                    <Radio className="w-4 h-4" />
                    <span>Join Live Interactive Stream</span>
                  </button>
                  <button
                    onClick={() => setShowIndRegModal(true)}
                    className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-bold border border-white/20"
                  >
                    <span>Claim Certificate</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowSchoolRegModal(true)}
                    className="px-7 py-3 bg-cyan-400 hover:bg-cyan-300 text-slate-950 rounded-full text-xs font-black shadow-xl hover:shadow-cyan-400/30 transition-all flex items-center gap-2"
                  >
                    <Ticket className="w-4 h-4 text-slate-950" />
                    <span>Register School Delegation (100% Free)</span>
                  </button>
                  <button
                    onClick={() => setShowIndRegModal(true)}
                    className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-bold border border-white/20 transition-colors"
                  >
                    <span>Individual Delegate Pass</span>
                  </button>
                  <button
                    onClick={() => setShowLetterheadModal(true)}
                    className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-bold border border-white/20 transition-colors flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Official Letterhead Pass</span>
                  </button>
                </>
              )}
            </div>

          </div>
        </section>

        {/* ── MAIN CONTENT: 2-COLUMN LAYOUT ───────────────────────────────────── */}
        <section className="container mx-auto px-4 max-w-6xl mt-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ── LEFT COLUMN: MAIN EVENT INFORMATION (8 Cols) ────────────────── */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* 1. Key Objectives & Learning Takeaways */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-sm space-y-5">
                <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-black text-gray-900">Key Outcomes & Takeaways</h2>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {seminar.keyTakeaways.map((takeaway, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <div className="p-1 rounded-full bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 font-bold" />
                      </div>
                      <p className="text-xs sm:text-sm font-medium text-gray-700 leading-relaxed">
                        {takeaway}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Hour-by-Hour Agenda Schedule */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-black text-gray-900">Event Schedule & Agenda</h2>
                  </div>
                  <span className="text-xs font-bold text-gray-500 font-mono">
                    {seminar.duration}
                  </span>
                </div>

                <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-blue-100">
                  {seminar.agenda.map((item, idx) => (
                    <div key={idx} className="relative flex items-start gap-4 pl-8 group">
                      <div className="absolute left-2 top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-primary group-hover:scale-125 transition-transform" />
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex-1 hover:bg-blue-50/50 transition-colors">
                        <span className="text-[11px] font-black text-primary font-mono block mb-1">
                          {item.time}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-gray-900">
                          {item.session}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Distinguished Keynote Speakers */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-sm space-y-5">
                <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
                  <Users className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-black text-gray-900">Keynote Speaker & Session Chairs</h2>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                  <img
                    src={seminar.speaker.avatar}
                    alt={seminar.speaker.name}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-primary/30 shrink-0 shadow-sm"
                  />
                  <div className="space-y-1.5">
                    <h3 className="text-base font-black text-gray-900">{seminar.speaker.name}</h3>
                    <p className="text-xs font-bold text-primary">{seminar.speaker.designation}</p>
                    <p className="text-xs text-gray-600 font-medium">{seminar.speaker.institution}</p>
                    <p className="text-xs text-gray-500 pt-1 leading-relaxed">
                      Leading national researcher delivering interactive keynotes on experimental STEAM pedagogy and modern laboratory standard operating procedures.
                    </p>
                  </div>
                </div>
              </div>

              {/* 4. School Delegation Benefits & Hospitality */}
              <div className="bg-gradient-to-br from-[#091E38] via-[#0E2E55] to-[#07192E] text-white rounded-3xl p-6 sm:p-8 space-y-5 shadow-lg">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <School className="w-5 h-5 text-cyan-300" />
                    <h2 className="text-lg font-black text-white">Institutional Delegation Benefits</h2>
                  </div>
                  <span className="text-[11px] px-2.5 py-1 rounded-md bg-cyan-400/20 text-cyan-300 font-mono font-bold">
                    Code: {seminar.schoolInvitationDetails.invitationCode}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {seminar.schoolInvitationDetails.perksForSchools.map((perk, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 flex items-start gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-cyan-300 shrink-0 mt-0.5" />
                      <span className="text-slate-100 font-medium">{perk}</span>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-white/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div>
                    <p className="font-bold text-white">Delegation Quota per School:</p>
                    <p className="text-slate-300">
                      Up to {seminar.schoolInvitationDetails.maxStudentsPerSchool} Students + {seminar.schoolInvitationDetails.maxTeachersPerSchool} Faculty Mentors ({seminar.schoolInvitationDetails.targetGrades})
                    </p>
                  </div>
                  <button
                    onClick={() => setShowSchoolRegModal(true)}
                    className="px-5 py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black rounded-full transition-all shrink-0"
                  >
                    Claim School Passes
                  </button>
                </div>
              </div>

            </div>

            {/* ── RIGHT COLUMN: STICKY BOOKING & VENUE INFO (4 Cols) ─────────── */}
            <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-20">
              
              {/* Quick Action Pass Card */}
              <div className="bg-white rounded-3xl p-6 border border-gray-200/90 shadow-md space-y-5">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md inline-block">
                    ✓ Official CSEEL Pass Allocation
                  </span>
                  <h3 className="text-base font-black text-gray-900">Pass Registration</h3>
                  <p className="text-xs text-gray-500">
                    Complimentary entry for school delegations, educators, and registered STEM students.
                  </p>
                </div>

                <div className="space-y-2.5">
                  <button
                    onClick={() => setShowSchoolRegModal(true)}
                    className="w-full py-3 bg-primary hover:bg-primary-hover text-white rounded-2xl text-xs font-black shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <School className="w-4 h-4" />
                    <span>Register School Delegation</span>
                  </button>

                  <button
                    onClick={() => setShowIndRegModal(true)}
                    className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-gray-800 rounded-2xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <Ticket className="w-3.5 h-3.5 text-gray-600" />
                    <span>Individual Delegate Pass</span>
                  </button>

                  <button
                    onClick={() => setShowLetterheadModal(true)}
                    className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-gray-700 rounded-2xl text-xs font-bold border border-gray-200/80 transition-colors flex items-center justify-center gap-2"
                  >
                    <Printer className="w-3.5 h-3.5 text-gray-500" />
                    <span>Official Letterhead Pass</span>
                  </button>
                </div>

                <div className="p-3 rounded-2xl bg-blue-50/60 border border-blue-100 text-[11px] text-blue-900 space-y-1">
                  <p className="font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                    <span>Verified Academic Certification</span>
                  </p>
                  <p className="text-blue-800/80 leading-relaxed">
                    All attending educators receive the official <strong>CSEEL STEM Master Educator Certificate</strong>.
                  </p>
                </div>
              </div>

              {/* Physical Venue & Google Maps Card */}
              <div className="bg-white rounded-3xl p-6 border border-gray-200/90 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <MapPin className="w-4 h-4 text-primary" />
                  <h3 className="font-black text-gray-900 text-sm">Venue & Directions</h3>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <h4 className="font-black text-gray-900 text-sm">{seminar.venueDetails.name}</h4>
                    <p className="text-primary font-bold">{seminar.venueDetails.hallName}</p>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {seminar.venueDetails.address}, {seminar.venueDetails.city} - {seminar.venueDetails.pincode}, {seminar.venueDetails.state}
                  </p>
                  <p className="text-gray-500 text-[11px]">
                    <strong>Landmark:</strong> {seminar.venueDetails.landmark}
                  </p>
                  <p className="text-gray-500 text-[11px]">
                    <strong>Auditorium Seating:</strong> {seminar.venueDetails.seatingCapacity} Seats
                  </p>
                </div>

                <a
                  href={seminar.venueDetails.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </div>

              {/* Other Academic Summits (Cross-City Recommender) */}
              <div className="bg-white rounded-3xl p-5 border border-gray-200/90 shadow-sm space-y-3">
                <h3 className="font-black text-gray-900 text-xs uppercase tracking-wider text-gray-500">
                  Other Conclave Chapters
                </h3>
                <div className="space-y-2">
                  {otherSeminars.slice(0, 3).map((item) => (
                    <Link
                      key={item.id}
                      href={`/seminars/${item.id}`}
                      className="p-3 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-slate-100 block transition-all group"
                    >
                      <div className="flex items-center justify-between text-[10px] font-bold text-gray-500 mb-1">
                        <span className="text-primary font-black">📍 {item.venueDetails.city}</span>
                        <span>{item.date}</span>
                      </div>
                      <h4 className="text-xs font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                        {item.title}
                      </h4>
                    </Link>
                  ))}
                </div>
              </div>

            </aside>

          </div>
        </section>

        {/* ── MODAL 1: SCHOOL DELEGATION REGISTRATION ──────────────────────────── */}
        <AnimatePresence>
          {showSchoolRegModal && (
            <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm"
                onClick={() => setShowSchoolRegModal(false)}
              />
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-200 z-10 space-y-4 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div>
                    <h3 className="text-base font-black text-gray-900">School Delegation Registration</h3>
                    <p className="text-xs text-gray-500">{seminar.title} ({seminar.venueDetails.city})</p>
                  </div>
                  <button
                    onClick={() => setShowSchoolRegModal(false)}
                    className="p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-gray-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {formSuccess ? (
                  <div className="p-6 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                    <p className="text-sm font-bold text-emerald-900">{formSuccess}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSchoolSubmit} className="space-y-3 text-xs">
                    <div>
                      <label className="font-bold text-gray-700 block mb-1">School / Institution Name *</label>
                      <input
                        type="text"
                        required
                        value={schoolForm.schoolName}
                        onChange={(e) => setSchoolForm({ ...schoolForm, schoolName: e.target.value })}
                        placeholder="e.g. Delhi Public School / DAV Public School"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-gray-700 block mb-1">Principal / Science HOD Name *</label>
                        <input
                          type="text"
                          required
                          value={schoolForm.principalName}
                          onChange={(e) => setSchoolForm({ ...schoolForm, principalName: e.target.value })}
                          placeholder="Dr. / Mr. / Ms."
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:bg-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-gray-700 block mb-1">Official Email *</label>
                        <input
                          type="email"
                          required
                          value={schoolForm.email}
                          onChange={(e) => setSchoolForm({ ...schoolForm, email: e.target.value })}
                          placeholder="principal@school.edu.in"
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:bg-white outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-gray-700 block mb-1">Contact Phone *</label>
                        <input
                          type="tel"
                          required
                          value={schoolForm.phone}
                          onChange={(e) => setSchoolForm({ ...schoolForm, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:bg-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-gray-700 block mb-1">Students Count</label>
                        <select
                          value={schoolForm.studentCount}
                          onChange={(e) => setSchoolForm({ ...schoolForm, studentCount: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:bg-white outline-none"
                        >
                          <option value="5">5 Students</option>
                          <option value="10">10 Students (Recommended)</option>
                          <option value="15">15 Students</option>
                          <option value="20">20 Students (Max Quota)</option>
                        </select>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-between">
                      <span className="font-bold text-cyan-900">Include Student Exhibition Booth?</span>
                      <input
                        type="checkbox"
                        checked={schoolForm.needsBooth}
                        onChange={(e) => setSchoolForm({ ...schoolForm, needsBooth: e.target.checked })}
                        className="w-4 h-4 text-primary rounded"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-primary hover:bg-primary-hover text-white rounded-2xl font-black text-xs shadow-md transition-all mt-2"
                    >
                      Confirm Free School Delegation Passes (0 INR)
                    </button>
                  </form>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ── MODAL 2: INDIVIDUAL DELEGATE PASS ─────────────────────────────────── */}
        <AnimatePresence>
          {showIndRegModal && (
            <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm"
                onClick={() => setShowIndRegModal(false)}
              />
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200 z-10 space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <h3 className="text-base font-black text-gray-900">Individual Delegate Pass</h3>
                  <button onClick={() => setShowIndRegModal(false)} className="p-1 text-gray-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {formSuccess ? (
                  <div className="p-4 text-center bg-emerald-50 rounded-2xl text-emerald-800 text-xs font-bold">
                    {formSuccess}
                  </div>
                ) : (
                  <form onSubmit={handleIndSubmit} className="space-y-3 text-xs">
                    <div>
                      <label className="font-bold text-gray-700 block mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={indForm.name}
                        onChange={(e) => setIndForm({ ...indForm, name: e.target.value })}
                        placeholder="Your Name"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:bg-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-gray-700 block mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={indForm.email}
                        onChange={(e) => setIndForm({ ...indForm, email: e.target.value })}
                        placeholder="yourname@gmail.com"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:bg-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-gray-700 block mb-1">Role / Designation</label>
                      <select
                        value={indForm.role}
                        onChange={(e) => setIndForm({ ...indForm, role: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:bg-white outline-none"
                      >
                        <option value="Student">Student (School / College)</option>
                        <option value="Science Teacher">Science / Physics / Chemistry Teacher</option>
                        <option value="Principal">School Principal / Administrator</option>
                        <option value="Researcher">Academic Researcher / Enthusiast</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-primary hover:bg-primary-hover text-white rounded-2xl font-black text-xs shadow-md transition-all mt-2"
                    >
                      Issue Free Individual Pass
                    </button>
                  </form>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ── MODAL 3: OFFICIAL PRINTABLE LETTERHEAD PASS ───────────────────────── */}
        <AnimatePresence>
          {showLetterheadModal && (
            <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm"
                onClick={() => setShowLetterheadModal(false)}
              />
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-200 z-10 space-y-5 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Printer className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-black text-gray-900">Official Institutional Invitation Pass</h3>
                  </div>
                  <button onClick={() => setShowLetterheadModal(false)} className="p-1 text-gray-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="border-2 border-slate-900 rounded-2xl p-6 bg-slate-50 font-serif space-y-4">
                  <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3 font-sans">
                    <div>
                      <h2 className="text-base font-black text-primary tracking-wider">CSEEL INDIA ACADEMIC COUNCIL</h2>
                      <p className="text-[10px] text-gray-600 uppercase font-bold tracking-wider">
                        National Science & STEAM Education Conclaves
                      </p>
                    </div>
                    <span className="text-[10px] font-mono font-black px-2.5 py-1 bg-slate-900 text-white rounded">
                      VIP PASS #CSEEL-{seminar.venueDetails.city.toUpperCase()}-2026
                    </span>
                  </div>

                  <div className="text-xs leading-relaxed space-y-2 text-gray-800">
                    <p className="font-bold">To: The Principal & Head of Science Department</p>
                    <p>
                      The CSEEL National Council cordially invites your distinguished institution to participate in <strong>{seminar.title}</strong> scheduled for <strong>{seminar.date}</strong> at <strong>{seminar.venueDetails.name} ({seminar.venueDetails.hallName}), {seminar.venueDetails.city}</strong>.
                    </p>
                    <div className="p-3 bg-white border border-slate-200 rounded-xl font-sans text-[11px] space-y-1">
                      <p><strong>Reporting Time:</strong> {seminar.time}</p>
                      <p><strong>Chief Keynote:</strong> {seminar.speaker.name} ({seminar.speaker.institution})</p>
                      <p><strong>Hospitality:</strong> {seminar.schoolInvitationDetails.hospitalityProvided}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-300 text-[10px] font-sans font-bold text-gray-600">
                    <span>Authorized by National Science Council</span>
                    <span>No Fee Required • Complimentary Delegation</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => window.print()}
                    className="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print / Save PDF</span>
                  </button>
                  <button
                    onClick={() => setShowLetterheadModal(false)}
                    className="px-4 py-2.5 bg-slate-100 text-gray-700 text-xs font-bold rounded-xl"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ── MODAL 4: VIDEO STREAM / RECORDING PLAYER ─────────────────────────── */}
        <AnimatePresence>
          {showVideoModal && (
            <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-md"
                onClick={() => setShowVideoModal(false)}
              />
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative bg-slate-950 text-white rounded-3xl max-w-3xl w-full p-4 sm:p-6 shadow-2xl border border-white/20 z-10 space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <h3 className="text-sm font-bold text-white truncate">{seminar.title}</h3>
                  <button onClick={() => setShowVideoModal(false)} className="p-1 text-slate-400 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="relative aspect-video rounded-2xl bg-black overflow-hidden flex items-center justify-center">
                  <iframe
                    src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1"
                    title={seminar.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </PageTransition>
  );
}
