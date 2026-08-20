'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Clock, MapPin, Users, Video, Award, CheckCircle2,
  Search, ArrowRight, Share2, Sparkles, BookOpen, ExternalLink,
  ChevronRight, ChevronLeft, X, Check, ShieldCheck, Download, Filter, PlayCircle,
  Building2, School, FileText, Ticket, Printer, Navigation, HelpCircle,
  Radio, Camera, Play, CheckCircle
} from 'lucide-react';
import PageTransition from '@/components/shared/PageTransition';
import ShareButton from '@/components/shared/ShareButton';
import { ALL_SEMINARS, SeminarItem } from '@/lib/seminarsData';

export default function SeminarsClient() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'live' | 'past'>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  
  // Modals
  const [selectedSeminarForSchoolReg, setSelectedSeminarForSchoolReg] = useState<SeminarItem | null>(null);
  const [selectedSeminarForIndReg, setSelectedSeminarForIndReg] = useState<SeminarItem | null>(null);
  const [selectedSeminarDetails, setSelectedSeminarDetails] = useState<SeminarItem | null>(null);
  const [selectedVideoModal, setSelectedVideoModal] = useState<{ title: string; url: string } | null>(null);
  
  // Generated Pass Modal State
  const [selectedInvitationPass, setSelectedInvitationPass] = useState<{
    seminar: SeminarItem;
    schoolName: string;
    coordinator: string;
    teachersCount: number;
    studentsCount: number;
    hasBooth: boolean;
    passId: string;
  } | null>(null);

  // School Delegation Registration Form State
  const [schoolForm, setSchoolForm] = useState({
    schoolName: '',
    board: 'CBSE',
    affiliationCode: '',
    city: '',
    state: '',
    pincode: '',
    coordinatorName: '',
    coordinatorRole: 'Principal' as 'Principal' | 'Vice Principal' | 'Science HOD' | 'ATL Lab Incharge',
    email: '',
    phone: '',
    teachersCount: '3',
    studentsCount: '15',
    needsBooth: true,
  });
  const [schoolRegSuccess, setSchoolRegSuccess] = useState(false);

  // Individual Delegate Form State
  const [indForm, setIndForm] = useState({
    name: '',
    email: '',
    phone: '',
    institution: '',
    role: 'Student' as 'Student' | 'Teacher' | 'Principal / HOD' | 'Researcher',
  });
  const [indRegSuccess, setIndRegSuccess] = useState(false);

  const categories = [
    'All',
    'Space Sciences',
    'Quantum Physics',
    'Green Chemistry',
    'Genomics & Bio-Tech',
    'Robotics & AI',
    'NEP-2020 Pedagogy',
  ];

  const cities = ['All', 'New Delhi', 'Bengaluru', 'Bhubaneswar', 'Mumbai', 'Pune', 'Online / Virtual'];

  // Filter based on active tab + search + category + city
  const filteredSeminars = useMemo(() => {
    return ALL_SEMINARS.filter((s) => {
      // Tab matching
      if (activeTab === 'upcoming' && s.status !== 'Upcoming') return false;
      if (activeTab === 'live' && s.status !== 'Live Now') return false;
      if (activeTab === 'past' && s.status !== 'Completed / Recorded') return false;

      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        s.title.toLowerCase().includes(q) ||
        s.topic.toLowerCase().includes(q) ||
        s.venueDetails.name.toLowerCase().includes(q) ||
        s.venueDetails.city.toLowerCase().includes(q) ||
        s.speaker.name.toLowerCase().includes(q);

      const matchCategory = selectedCategory === 'All' || s.category === selectedCategory;
      const matchCity = selectedCity === 'All' || s.venueDetails.city.toLowerCase().includes(selectedCity.toLowerCase());
      return matchSearch && matchCategory && matchCity;
    });
  }, [activeTab, searchQuery, selectedCategory, selectedCity]);

  // Featured multi-post list & interactive slider index
  const [featuredIndex, setFeaturedIndex] = useState(0);

  const featuredList = useMemo(() => {
    if (activeTab === 'live') {
      return ALL_SEMINARS.filter(s => s.status === 'Live Now');
    }
    if (activeTab === 'past') {
      return ALL_SEMINARS.filter(s => s.status === 'Completed / Recorded');
    }
    return ALL_SEMINARS.filter(s => s.status === 'Upcoming');
  }, [activeTab]);

  const featuredSeminar = featuredList[featuredIndex] || featuredList[0] || ALL_SEMINARS[0];

  const handleSchoolSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSeminarForSchoolReg) return;

    const passData = {
      seminar: selectedSeminarForSchoolReg,
      schoolName: schoolForm.schoolName,
      coordinator: schoolForm.coordinatorName,
      teachersCount: parseInt(schoolForm.teachersCount) || 2,
      studentsCount: parseInt(schoolForm.studentsCount) || 10,
      hasBooth: schoolForm.needsBooth,
      passId: `CSEEL-${Date.now().toString().slice(-6)}`,
    };

    setSchoolRegSuccess(true);
    setTimeout(() => {
      setSchoolRegSuccess(false);
      setSelectedSeminarForSchoolReg(null);
      setSelectedInvitationPass(passData);
      setSchoolForm({
        schoolName: '',
        board: 'CBSE',
        affiliationCode: '',
        city: '',
        state: '',
        pincode: '',
        coordinatorName: '',
        coordinatorRole: 'Principal',
        email: '',
        phone: '',
        teachersCount: '3',
        studentsCount: '15',
        needsBooth: true,
      });
    }, 1200);
  };

  const handleIndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIndRegSuccess(true);
    setTimeout(() => {
      setIndRegSuccess(false);
      setSelectedSeminarForIndReg(null);
      setIndForm({ name: '', email: '', phone: '', institution: '', role: 'Student' });
    }, 1200);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#F8FAFC] pb-24 text-gray-800">

        {/* ── HIGH-IMPACT EXECUTIVE HERO BANNER ───────────────────────────────── */}
        <section className="relative overflow-hidden bg-[#07172B] text-white min-h-[460px] md:min-h-[520px] flex flex-col justify-end pb-16 md:pb-20 pt-24 md:pt-32 px-4">
          {/* Background Photography with Natural Balanced Lighting */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://sc0.blr1.digitaloceanspaces.com/inline/827643-dgxdopizaz-1487753907.JPG"
              alt="Indian Science Students in Hands-on Laboratory"
              className="w-full h-full object-cover object-top"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1600&auto=format&fit=crop";
              }}
            />
            {/* Smooth Top-to-Bottom Professional Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#07172B]/30 via-[#07172B]/75 to-[#07172B]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#07172B]/80 via-transparent to-[#07172B]/80" />
          </div>

          {/* Text positioned on the deep bottom gradient for crystal clear contrast */}
          <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-cyan-400/30 text-cyan-300 text-xs font-black shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Pan-India School & Institutional Education Meets 2026</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight drop-shadow-2xl">
              National Science Seminars & <span className="bg-gradient-to-r from-cyan-300 via-teal-200 to-emerald-300 bg-clip-text text-transparent">Events</span>
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-slate-100 max-w-3xl mx-auto leading-relaxed font-medium drop-shadow-lg">
              Empowering India's leading school leaders, STEAM educators, and student innovators through experiential summits across <strong className="text-white underline decoration-cyan-400">New Delhi, Bengaluru, Mumbai, Bhubaneswar & Pune</strong> with distinguished scientists.
            </p>

            {/* Value Pillars Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2 text-xs font-bold text-white">
              <span className="flex items-center gap-1.5 px-3.5 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-white/20 shadow-lg">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Free School Delegation Passes</span>
              </span>
              <span className="flex items-center gap-1.5 px-3.5 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-white/20 shadow-lg">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-300" />
                <span>Official Letterhead Passes</span>
              </span>
              <span className="flex items-center gap-1.5 px-3.5 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-white/20 shadow-lg">
                <Award className="w-3.5 h-3.5 text-amber-300" />
                <span>Complimentary Exhibition Booths</span>
              </span>
            </div>

          </div>
        </section>

        {/* ── EVENT LIFECYCLE TABS (Upcoming, Live, Past) ────────────────────────── */}
        <section className="container mx-auto px-4 max-w-6xl -mt-8 relative z-20">
          <div className="bg-white p-2 rounded-2xl border border-gray-200/90 shadow-lg flex items-center justify-center gap-2 max-w-xl mx-auto">
            
            <button
              onClick={() => { setActiveTab('upcoming'); setFeaturedIndex(0); }}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                activeTab === 'upcoming'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-slate-50'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Upcoming Summits ({ALL_SEMINARS.filter(s => s.status === 'Upcoming').length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('live'); setFeaturedIndex(0); }}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                activeTab === 'live'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-slate-50'
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              <span>Live & Active ({ALL_SEMINARS.filter(s => s.status === 'Live Now').length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('past'); setFeaturedIndex(0); }}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                activeTab === 'past'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-slate-50'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Past Archives ({ALL_SEMINARS.filter(s => s.status === 'Completed / Recorded').length})</span>
            </button>

          </div>
        </section>

        {/* ── FEATURED GRAND EVENT POSTER ────────────────────────────────────────── */}
        {featuredSeminar && (
          <section className="container mx-auto px-4 max-w-6xl mt-8">
            {/* Main Featured Showcase Card */}
            <div className={`rounded-3xl border-2 shadow-xl overflow-hidden transition-all duration-300 ${
              activeTab === 'upcoming'
                ? 'bg-gradient-to-br from-[#0B2546] via-[#0E3563] to-[#07182D] text-white border-cyan-400/40'
                : activeTab === 'live'
                ? 'bg-gradient-to-br from-rose-950 via-slate-900 to-slate-950 text-white border-rose-500/40'
                : 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white border-slate-700'
            }`}>
              
              {/* Top Distinct Status Strip */}
              <div className="px-6 py-2.5 bg-black/40 border-b border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      activeTab === 'live' ? 'bg-rose-400' : 'bg-emerald-400'
                    }`}></span>
                    <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                      activeTab === 'live' ? 'bg-rose-500' : 'bg-emerald-500'
                    }`}></span>
                  </span>
                  <span className="font-black uppercase tracking-wider text-cyan-300">
                    {activeTab === 'upcoming' ? `🟢 UPCOMING CONCLAVE IN ${featuredSeminar.venueDetails.city.toUpperCase()}` : activeTab === 'live' ? '🔴 LIVE STREAM NOW ACTIVE' : '📜 COMPLETED ACADEMIC ARCHIVE'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-300">
                  <span>🏛️ <strong>{featuredSeminar.enrolledSchoolsCount}+</strong> Schools Registered</span>
                  <span>🎟️ <strong>{featuredSeminar.totalSeats - featuredSeminar.registeredAttendees}</strong> Seats Available</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                
                {/* Left Poster Image Column */}
                <Link
                  href={`/seminars/${featuredSeminar.id}`}
                  className="lg:col-span-5 relative min-h-[280px] lg:min-h-[380px] bg-slate-900 flex items-center justify-center overflow-hidden group cursor-pointer"
                >
                  <img
                    src={featuredSeminar.bannerImage}
                    alt={featuredSeminar.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/30 to-transparent pointer-events-none" />
                  
                  {/* Floating Date Badge on Poster */}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md rounded-2xl p-2.5 border border-white/40 text-center shadow-lg">
                    <span className="block text-[10px] font-black uppercase text-primary tracking-wider">
                      {featuredSeminar.date.split(' ')[0]}
                    </span>
                    <span className="block text-xl font-black text-gray-900 leading-none">
                      {featuredSeminar.date.split(' ')[1]?.replace(',', '') || '25'}
                    </span>
                  </div>

                  {/* Mode & Category Badge on Poster */}
                  <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 bg-cyan-500 text-slate-950 text-[10px] font-black rounded-lg shadow-xs flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>{featuredSeminar.category}</span>
                    </span>
                    <span className="px-2.5 py-1 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold rounded-lg border border-white/20">
                      📍 {featuredSeminar.venueDetails.city} • {featuredSeminar.mode}
                    </span>
                  </div>
                </Link>

                {/* Right Content Details Column */}
                <div className="lg:col-span-7 p-6 md:p-8 flex flex-col justify-between space-y-4">
                  
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-cyan-400/20 text-cyan-300 border border-cyan-400/40 text-[10px] font-black uppercase rounded-md">
                        {featuredSeminar.category}
                      </span>
                      <span className="px-2.5 py-0.5 bg-white/10 text-slate-200 border border-white/15 text-[10px] font-bold rounded-md">
                        Chapter: {featuredSeminar.venueDetails.city}
                      </span>
                    </div>

                    <Link href={`/seminars/${featuredSeminar.id}`} className="group block">
                      <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-white leading-snug group-hover:text-cyan-300 transition-colors">
                        {featuredSeminar.title}
                      </h2>
                    </Link>

                    <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
                      {featuredSeminar.summary}
                    </p>

                    {/* Venue & Time Card (Glassmorphic) */}
                    <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2 text-xs">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-cyan-300 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-white">{featuredSeminar.venueDetails.name} ({featuredSeminar.venueDetails.hallName})</p>
                          <p className="text-slate-300 text-[11px]">{featuredSeminar.venueDetails.address}, {featuredSeminar.venueDetails.city}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-200 font-semibold pt-1 border-t border-white/10">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-cyan-300" />
                          <span>{featuredSeminar.date}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-cyan-300" />
                          <span>{featuredSeminar.time}</span>
                        </span>
                      </div>
                    </div>

                    {/* Keynote Speaker Pill */}
                    <div className="flex items-center gap-3 p-2 bg-white/10 backdrop-blur-md border border-white/15 rounded-xl">
                      <img
                        src={featuredSeminar.speaker.avatar}
                        alt={featuredSeminar.speaker.name}
                        className="w-10 h-10 rounded-full object-cover border border-cyan-400/40"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">{featuredSeminar.speaker.name}</p>
                        <p className="text-[11px] text-slate-300 truncate">{featuredSeminar.speaker.designation} • {featuredSeminar.speaker.institution}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    {activeTab === 'past' ? (
                      <>
                        <button
                          onClick={() => setSelectedVideoModal({ title: featuredSeminar.title, url: featuredSeminar.recordingLink || "https://www.youtube.com" })}
                          className="px-6 py-2.5 bg-white text-slate-900 hover:bg-slate-100 rounded-full text-xs font-black shadow-md transition-all flex items-center gap-2"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Watch Keynote Recording</span>
                        </button>
                        <Link
                          href={`/seminars/${featuredSeminar.id}`}
                          className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-bold transition-colors flex items-center gap-1 border border-white/20"
                        >
                          <span>Full Details & Summary →</span>
                        </Link>
                      </>
                    ) : activeTab === 'live' ? (
                      <>
                        <button
                          onClick={() => setSelectedVideoModal({ title: featuredSeminar.title, url: featuredSeminar.recordingLink || "https://www.youtube.com" })}
                          className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-full text-xs font-black shadow-md transition-all flex items-center gap-2 animate-pulse"
                        >
                          <Radio className="w-3.5 h-3.5" />
                          <span>Join Live Interactive Stream</span>
                        </button>
                        <Link
                          href={`/seminars/${featuredSeminar.id}`}
                          className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-bold transition-colors border border-white/20"
                        >
                          <span>Event Details →</span>
                        </Link>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => setSelectedSeminarForSchoolReg(featuredSeminar)}
                          className="px-6 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 rounded-full text-xs font-black shadow-lg hover:shadow-cyan-400/30 transition-all flex items-center gap-2"
                        >
                          <Ticket className="w-3.5 h-3.5 text-slate-950" />
                          <span>Register School Delegation (Free Pass)</span>
                        </button>
                        <Link
                          href={`/seminars/${featuredSeminar.id}`}
                          className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-bold transition-colors flex items-center gap-1 border border-white/20"
                        >
                          <span>Full Agenda & Details →</span>
                        </Link>
                      </>
                    )}
                  </div>

                </div>

              </div>
            </div>

          </section>
        )}

        {/* ── DIRECTORY SECTION: CLEAN FULL-WIDTH FOR UPCOMING/LIVE, FILTER FOR PAST ── */}
        <section className="container mx-auto px-4 max-w-6xl mt-10">
          {activeTab === 'past' ? (
            /* Layout with Search Filter for Past Archives */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Filter for Archive */}
              <aside className="lg:col-span-4 space-y-4">
                <div className="bg-white rounded-3xl p-5 border border-gray-200/90 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <h3 className="font-black text-gray-900 text-sm flex items-center gap-1.5">
                      <Filter className="w-4 h-4 text-primary" />
                      <span>Search Archives</span>
                    </h3>
                  </div>

                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search past seminars..."
                      className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1 pt-1">
                    <label className="text-[11px] font-black uppercase text-gray-500">Categories</label>
                    <div className="space-y-1">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`w-full px-3 py-1.5 rounded-xl text-xs font-bold text-left transition-all ${
                            selectedCategory === cat ? 'bg-primary text-white font-black' : 'bg-slate-50 text-gray-700 hover:bg-slate-100'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </aside>

              {/* Right Cards for Past */}
              <div className="lg:col-span-8 space-y-4">
                {filteredSeminars.map((seminar) => (
                  <SeminarHorizontalCard
                    key={seminar.id}
                    seminar={seminar}
                    activeTab={activeTab}
                    onOpenVideo={() => setSelectedVideoModal({ title: seminar.title, url: seminar.recordingLink || "https://www.youtube.com" })}
                    onOpenDetails={() => setSelectedSeminarDetails(seminar)}
                    onOpenSchoolReg={() => setSelectedSeminarForSchoolReg(seminar)}
                    onOpenIndReg={() => setSelectedSeminarForIndReg(seminar)}
                  />
                ))}
              </div>

            </div>
          ) : (
            /* Clean Full-Width Cards for Upcoming & Live (No Filters Needed) */
            <div className="space-y-4 max-w-5xl mx-auto">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>{activeTab === 'upcoming' ? 'All Upcoming Conclaves Across India' : 'Live Interactive Sessions'}</span>
                </h3>
                <span className="text-xs text-gray-500 font-bold">
                  {filteredSeminars.length} Academic Sessions
                </span>
              </div>

              {filteredSeminars.map((seminar) => (
                <SeminarHorizontalCard
                  key={seminar.id}
                  seminar={seminar}
                  activeTab={activeTab}
                  onOpenVideo={() => setSelectedVideoModal({ title: seminar.title, url: seminar.recordingLink || "https://www.youtube.com" })}
                  onOpenDetails={() => setSelectedSeminarDetails(seminar)}
                  onOpenSchoolReg={() => setSelectedSeminarForSchoolReg(seminar)}
                  onOpenIndReg={() => setSelectedSeminarForIndReg(seminar)}
                />
              ))}
            </div>
          )}
        </section>

        {/* ── MODAL 1: FULL AGENDA & SPEAKER TIMELINE ────────────────────────────── */}
        <AnimatePresence>
          {selectedSeminarDetails && (
            <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm"
                onClick={() => setSelectedSeminarDetails(null)}
              />
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative z-10 w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 max-h-[85vh] flex flex-col"
              >
                {/* Header */}
                <div className="p-6 border-b border-gray-100 bg-slate-50">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="px-2.5 py-0.5 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-md">
                        {selectedSeminarDetails.category}
                      </span>
                      <h3 className="text-lg font-black text-gray-900 mt-1">{selectedSeminarDetails.title}</h3>
                      <p className="text-xs text-gray-500 font-semibold mt-1">
                        {selectedSeminarDetails.venueDetails.name} • {selectedSeminarDetails.venueDetails.city}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedSeminarDetails(null)}
                      className="p-1.5 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto space-y-5 text-xs text-gray-700 leading-relaxed">
                  <div>
                    <h4 className="font-black text-gray-900 uppercase tracking-wider mb-2 text-[11px]">Symposium Overview</h4>
                    <p>{selectedSeminarDetails.summary}</p>
                  </div>

                  <div>
                    <h4 className="font-black text-gray-900 uppercase tracking-wider mb-2 text-[11px]">Full Session Agenda</h4>
                    <div className="space-y-2 border-l-2 border-primary/30 pl-3">
                      {selectedSeminarDetails.agenda.map((item, idx) => (
                        <div key={idx} className="relative">
                          <div className="w-2 h-2 rounded-full bg-primary absolute -left-[17px] top-1.5" />
                          <span className="font-bold text-gray-900">{item.time}</span> — {item.session}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-black text-gray-900 uppercase tracking-wider mb-2 text-[11px]">Perks for Enrolled School Delegations</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedSeminarDetails.schoolInvitationDetails.perksForSchools.map((p, i) => (
                        <div key={i} className="p-2 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-1.5 font-medium">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 bg-white flex items-center justify-between gap-3">
                  <button
                    onClick={() => setSelectedSeminarDetails(null)}
                    className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      const sem = selectedSeminarDetails;
                      setSelectedSeminarDetails(null);
                      setSelectedSeminarForSchoolReg(sem);
                    }}
                    className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white font-black rounded-xl text-xs shadow-md transition-colors flex items-center gap-2"
                  >
                    <Ticket className="w-3.5 h-3.5" />
                    <span>Register Delegation Pass</span>
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ── MODAL 2: SCHOOL DELEGATION REGISTRATION ────────────────────────────── */}
        <AnimatePresence>
          {selectedSeminarForSchoolReg && (
            <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm"
                onClick={() => setSelectedSeminarForSchoolReg(null)}
              />
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative z-10 w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 max-h-[90vh] flex flex-col"
              >
                {/* Header */}
                <div className="p-5 border-b border-gray-100 bg-slate-50 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-primary uppercase">Institutional Delegation Pass</span>
                    <h3 className="text-base font-black text-gray-900 truncate max-w-md">{selectedSeminarForSchoolReg.title}</h3>
                  </div>
                  <button
                    onClick={() => setSelectedSeminarForSchoolReg(null)}
                    className="p-1.5 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {schoolRegSuccess ? (
                  <div className="p-8 text-center space-y-4 my-auto">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                      <Check className="w-8 h-8 stroke-[3]" />
                    </div>
                    <h3 className="text-lg font-black text-gray-900">Delegation Registered Successfully!</h3>
                    <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
                      Generating your official <strong className="text-gray-900">CSEEL School Delegation Pass & Letterhead Invitation</strong>...
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSchoolSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-gray-700 block mb-1">Official School Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Delhi Public School, R.K. Puram"
                          value={schoolForm.schoolName}
                          onChange={(e) => setSchoolForm({ ...schoolForm, schoolName: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-1 focus:ring-primary outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-gray-700 block mb-1">Board / Affiliation *</label>
                        <select
                          value={schoolForm.board}
                          onChange={(e) => setSchoolForm({ ...schoolForm, board: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-1 focus:ring-primary outline-none bg-white"
                        >
                          <option>CBSE</option>
                          <option>ICSE / ISC</option>
                          <option>IB World School</option>
                          <option>Cambridge (CIE)</option>
                          <option>State Board</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-gray-700 block mb-1">Coordinator / Principal Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Dr. Padma Ramanathan"
                          value={schoolForm.coordinatorName}
                          onChange={(e) => setSchoolForm({ ...schoolForm, coordinatorName: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-1 focus:ring-primary outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-gray-700 block mb-1">Designation</label>
                        <select
                          value={schoolForm.coordinatorRole}
                          onChange={(e) => setSchoolForm({ ...schoolForm, coordinatorRole: e.target.value as any })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-1 focus:ring-primary outline-none bg-white"
                        >
                          <option>Principal</option>
                          <option>Vice Principal</option>
                          <option>Science HOD</option>
                          <option>ATL Lab Incharge</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-gray-700 block mb-1">Official Email Address *</label>
                        <input
                          type="email"
                          required
                          placeholder="principal@school.edu.in"
                          value={schoolForm.email}
                          onChange={(e) => setSchoolForm({ ...schoolForm, email: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-1 focus:ring-primary outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-gray-700 block mb-1">Contact / WhatsApp Number *</label>
                        <input
                          type="tel"
                          required
                          placeholder="+91 98765 43210"
                          value={schoolForm.phone}
                          onChange={(e) => setSchoolForm({ ...schoolForm, phone: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-1 focus:ring-primary outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-gray-700 block mb-1">Accompanying Science Teachers</label>
                        <select
                          value={schoolForm.teachersCount}
                          onChange={(e) => setSchoolForm({ ...schoolForm, teachersCount: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-1 focus:ring-primary outline-none bg-white"
                        >
                          <option value="1">1 Teacher</option>
                          <option value="2">2 Teachers</option>
                          <option value="3">3 Teachers</option>
                          <option value="5">5 Teachers (Max)</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-bold text-gray-700 block mb-1">Student Delegation Size</label>
                        <select
                          value={schoolForm.studentsCount}
                          onChange={(e) => setSchoolForm({ ...schoolForm, studentsCount: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-1 focus:ring-primary outline-none bg-white"
                        >
                          <option value="5">5 Students</option>
                          <option value="10">10 Students</option>
                          <option value="15">15 Students</option>
                          <option value="20">20 Students (Max)</option>
                        </select>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-gray-900">Complimentary Project Exhibition Booth?</p>
                        <p className="text-[10px] text-gray-500">Free 10x10 ft stall for student hardware prototypes.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={schoolForm.needsBooth}
                        onChange={(e) => setSchoolForm({ ...schoolForm, needsBooth: e.target.checked })}
                        className="w-4 h-4 text-primary rounded cursor-pointer"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full py-3 bg-primary hover:bg-primary-hover text-white font-black rounded-xl text-xs shadow-md transition-colors flex items-center justify-center gap-2"
                      >
                        <Ticket className="w-4 h-4" />
                        <span>Confirm & Generate Delegation Letterhead Pass</span>
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ── MODAL 3: PRINTABLE INVITATION LETTERHEAD PASS ──────────────────────── */}
        <AnimatePresence>
          {selectedInvitationPass && (
            <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/75 backdrop-blur-sm"
                onClick={() => setSelectedInvitationPass(null)}
              />
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative z-10 w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 max-h-[90vh] flex flex-col"
              >
                {/* Letterhead Preview Header */}
                <div className="p-6 bg-gradient-to-r from-blue-900 via-primary to-slate-900 text-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src="/images/logo.png" alt="CSEEL" className="w-10 h-10 bg-white rounded-xl p-1" />
                    <div>
                      <h4 className="text-sm font-black tracking-wide">C.S.E.E.L NATIONAL ACADEMIC COUNCIL</h4>
                      <p className="text-[10px] text-blue-200">Official School Delegation Entry Pass & Accreditation Document</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedInvitationPass(null)}
                    className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Letterhead Body */}
                <div className="p-6 overflow-y-auto space-y-4 text-xs text-gray-800">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                    <div>
                      <p className="text-[10px] text-gray-500 font-bold uppercase">Pass Reference ID</p>
                      <p className="font-mono font-black text-primary text-sm">{selectedInvitationPass.passId}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-500 font-bold uppercase">Event Date</p>
                      <p className="font-black text-gray-900">{selectedInvitationPass.seminar.date}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-base font-black text-gray-900">{selectedInvitationPass.seminar.title}</h3>
                    <p className="text-gray-600"><strong className="text-gray-900">Venue:</strong> {selectedInvitationPass.seminar.venueDetails.name}, {selectedInvitationPass.seminar.venueDetails.address}, {selectedInvitationPass.seminar.venueDetails.city}</p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-gray-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div>
                      <p className="text-[10px] text-gray-500 font-bold">Institution</p>
                      <p className="font-black text-gray-900 truncate">{selectedInvitationPass.schoolName}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 font-bold">Lead Coordinator</p>
                      <p className="font-black text-gray-900 truncate">{selectedInvitationPass.coordinator}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 font-bold">Faculty Passes</p>
                      <p className="font-black text-primary">{selectedInvitationPass.teachersCount} Teachers</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 font-bold">Student Passes</p>
                      <p className="font-black text-emerald-600">{selectedInvitationPass.studentsCount} Students</p>
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 flex items-center gap-2 text-xs">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Includes complimentary delegate badges, networking lunch, and student project exhibition space.</span>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-4 border-t border-gray-100 bg-slate-50 flex items-center justify-between gap-3">
                  <button
                    onClick={() => setSelectedInvitationPass(null)}
                    className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-xl text-xs"
                  >
                    Done
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="px-6 py-2 bg-primary hover:bg-primary-hover text-white font-black rounded-xl text-xs shadow-md flex items-center gap-1.5"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Delegation Letterhead Pass</span>
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ── MODAL 4: INDIVIDUAL DELEGATE PASS MODAL ───────────────────────────── */}
        <AnimatePresence>
          {selectedSeminarForIndReg && (
            <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm"
                onClick={() => setSelectedSeminarForIndReg(null)}
              />
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 p-6 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-gray-900">Individual Attendee Pass</h3>
                  <button onClick={() => setSelectedSeminarForIndReg(null)} className="p-1 rounded-full bg-gray-100">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {indRegSuccess ? (
                  <div className="text-center py-6 space-y-3">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                      <Check className="w-6 h-6 stroke-[3]" />
                    </div>
                    <p className="text-xs font-bold text-gray-900">Pass Confirmed! Check your email for QR badge.</p>
                  </div>
                ) : (
                  <form onSubmit={handleIndSubmit} className="space-y-3">
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Your name"
                        value={indForm.name}
                        onChange={(e) => setIndForm({ ...indForm, name: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="you@email.com"
                        value={indForm.email}
                        onChange={(e) => setIndForm({ ...indForm, email: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">Phone *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={indForm.phone}
                        onChange={(e) => setIndForm({ ...indForm, phone: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">Institution Name</label>
                      <input
                        type="text"
                        placeholder="e.g. IIT Delhi / Kendriya Vidyalaya"
                        value={indForm.institution}
                        onChange={(e) => setIndForm({ ...indForm, institution: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-primary text-white rounded-xl text-xs font-black shadow-lg hover:bg-primary/90 transition-colors mt-2"
                    >
                      Confirm Free Individual Pass
                    </button>
                  </form>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ── MODAL 5: RECORDING / LIVE STREAM PLAYER MODAL ──────────────────────── */}
        <AnimatePresence>
          {selectedVideoModal && (
            <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-md"
                onClick={() => setSelectedVideoModal(null)}
              />
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative z-10 w-full max-w-3xl bg-slate-950 rounded-3xl shadow-2xl overflow-hidden border border-slate-800 flex flex-col"
              >
                <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
                    <h4 className="text-xs font-black truncate max-w-lg">{selectedVideoModal.title}</h4>
                  </div>
                  <button
                    onClick={() => setSelectedVideoModal(null)}
                    className="p-1 rounded-full bg-slate-800 hover:bg-slate-700 text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-8 text-center space-y-4 my-auto text-white">
                  <div className="w-16 h-16 rounded-full bg-rose-600/20 text-rose-500 border border-rose-500/40 flex items-center justify-center mx-auto shadow-lg animate-pulse">
                    <Play className="w-8 h-8 fill-current ml-1" />
                  </div>
                  <h3 className="text-lg font-black">{selectedVideoModal.title}</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                    Connecting to the high-definition interactive broadcast stream & keynote repository on CSEEL Cloud CDN...
                  </p>
                  <div className="pt-2">
                    <a
                      href={selectedVideoModal.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-full shadow-lg transition-colors"
                    >
                      <span>Open Fullscreen Stream</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </PageTransition>
  );
}

function SeminarHorizontalCard({
  seminar,
  activeTab,
  onOpenVideo,
  onOpenDetails,
  onOpenSchoolReg,
  onOpenIndReg,
}: {
  seminar: SeminarItem;
  activeTab: 'upcoming' | 'live' | 'past';
  onOpenVideo: () => void;
  onOpenDetails: () => void;
  onOpenSchoolReg: () => void;
  onOpenIndReg: () => void;
}) {
  return (
    <div className="bg-white rounded-3xl border border-gray-200/90 shadow-xs hover:shadow-lg hover:border-primary/40 transition-all overflow-hidden flex flex-col md:flex-row group">
      {/* Left Poster Image Column */}
      <Link
        href={`/seminars/${seminar.id}`}
        className="relative md:w-64 lg:w-72 h-48 md:h-auto shrink-0 bg-slate-900 overflow-hidden flex items-center justify-center cursor-pointer"
      >
        <img
          src={seminar.bannerImage}
          alt={seminar.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-950/80 md:from-transparent md:to-slate-950/60 to-transparent pointer-events-none" />

        {/* Date Chip */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md rounded-2xl px-3 py-1.5 text-center shadow-md border border-white/50">
          <span className="block text-[9px] font-black uppercase text-primary tracking-wider">
            {seminar.date.split(' ')[0]}
          </span>
          <span className="block text-base font-black text-gray-900 leading-none">
            {seminar.date.split(' ')[1]?.replace(',', '') || '25'}
          </span>
        </div>

        {/* Category & City Pills */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-1">
          <span className="px-2.5 py-1 bg-primary text-white text-[10px] font-black rounded-lg shadow-xs truncate">
            {seminar.category}
          </span>
          <span className="text-[10px] text-white font-bold bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20 shrink-0">
            📍 {seminar.venueDetails.city}
          </span>
        </div>
      </Link>

      {/* Right Content & Actions */}
      <div className="p-5 md:p-6 flex-1 flex flex-col justify-between space-y-3 bg-gradient-to-r from-white via-white to-slate-50/50">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase border ${
                seminar.status === 'Live Now'
                  ? 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse'
                  : seminar.status === 'Completed / Recorded'
                  ? 'bg-slate-100 text-slate-700 border-slate-300'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-300'
              }`}>
                {seminar.status === 'Live Now' ? '🔴 Live Now' : seminar.status === 'Completed / Recorded' ? '📜 Archive Recording' : '🟢 Upcoming Conclave'}
              </span>
            </div>
            <span className="text-xs font-bold text-gray-500">
              👥 {seminar.enrolledSchoolsCount}+ Schools
            </span>
          </div>

          <Link href={`/seminars/${seminar.id}`} className="group block">
            <h3 className="text-base sm:text-lg font-black text-gray-900 group-hover:text-primary transition-colors leading-snug">
              {seminar.title}
            </h3>
          </Link>

          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
            {seminar.summary}
          </p>

          {/* Location & Speaker */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs">
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80 space-y-0.5">
              <div className="flex items-center gap-1.5 truncate text-gray-800 font-bold">
                <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="truncate">{seminar.venueDetails.name}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-500 font-semibold text-[10px]">
                <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>{seminar.date} • {seminar.time}</span>
              </div>
            </div>

            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2">
              <img
                src={seminar.speaker.avatar}
                alt={seminar.speaker.name}
                className="w-7 h-7 rounded-full object-cover border border-primary/30 shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-gray-900 truncate">{seminar.speaker.name}</p>
                <p className="text-[10px] text-gray-500 truncate">{seminar.speaker.institution}</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShareButton
              title={seminar.title}
              text={`CSEEL Conclave: ${seminar.title} - ${seminar.date} (${seminar.venueDetails.city}). Keynote: ${seminar.speaker.name}`}
              url={`/seminars/${seminar.id}`}
              size="xs"
              variant="outline"
            />
            <span className="text-[10px] font-bold text-emerald-600">
              {seminar.status === 'Upcoming' ? '✓ Free Delegation Pass' : ''}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'past' ? (
              <>
                <button
                  onClick={onOpenVideo}
                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-xs font-bold shadow-xs transition-colors flex items-center gap-1"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Watch Recording</span>
                </button>
                <Link
                  href={`/seminars/${seminar.id}`}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-gray-700 rounded-full text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <span>Details</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </>
            ) : activeTab === 'live' ? (
              <>
                <button
                  onClick={onOpenVideo}
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-full text-xs font-bold shadow-xs transition-colors flex items-center gap-1 animate-pulse"
                >
                  <Radio className="w-3 h-3" />
                  <span>Join Stream</span>
                </button>
                <Link
                  href={`/seminars/${seminar.id}`}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-gray-700 rounded-full text-xs font-bold flex items-center gap-1"
                >
                  <span>Details</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={onOpenSchoolReg}
                  className="px-4 py-1.5 bg-primary hover:bg-primary-hover text-white rounded-full text-xs font-black shadow-xs hover:shadow-md transition-all flex items-center gap-1"
                >
                  <Ticket className="w-3 h-3" />
                  <span>School Pass (Free)</span>
                </button>
                <Link
                  href={`/seminars/${seminar.id}`}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-gray-700 rounded-full text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <span>Full Agenda</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

