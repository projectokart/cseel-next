'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PageTransition from "@/components/shared/PageTransition";
import {
  GraduationCap, BookOpen, Users, Award, Calendar, CheckCircle2,
  Clock, ShieldCheck, Sparkles, ChevronDown, Check, Video,
  Microscope, Atom, Compass, Layers, School
} from "lucide-react";
import { useBookDemoModal } from '@/contexts/BookDemoModalContext';

export default function TeacherTrainingClient() {
  const { openDemoModal } = useBookDemoModal();
  const [activeTier, setActiveTier] = useState<number>(1);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const trainingStats = [
    { value: '10,000+', label: 'Educators Certified', sub: 'Across 22 Indian States' },
    { value: '50 Hrs', label: 'Accredited CPD Hours', sub: 'Recognized for faculty appraisal' },
    { value: '98%', label: 'Teacher Recommendation', sub: 'Post-training evaluation score' },
    { value: '500+', label: 'Schools Trained', sub: 'CBSE, ICSE & Cambridge boards' },
  ];

  const programTiers = [
    {
      id: 0,
      title: "Foundation in Experiential Science",
      duration: "3 Days · 15 CPD Hours",
      badge: "Core Certification",
      desc: "Designed for middle and high school science teachers transitioning from lecture-heavy teaching to active student-led experimentation.",
      modules: [
        "Kolb's 4-Stage Cycle: Spark, Experience, Conceptualize, and Apply",
        "CBSE SARAS Lab Safety Norms, chemical handling, and emergency SOPs",
        "Designing 40-minute experiential class practicals with zero downtime",
        "Formative rubric assessment & viva question scaffolding"
      ],
      idealFor: "Science Teachers (Classes 6 to 10), Lab Demonstrators"
    },
    {
      id: 1,
      title: "Advanced Composite Lab & ATL 2.0 Pedagogy",
      duration: "5 Days · 25 CPD Hours",
      badge: "Flagship Program",
      desc: "Deep-dive practical mastery for senior secondary science educators and Atal Tinkering Lab coordinators.",
      modules: [
        "Class 11 & 12 physics, chemistry, and biology practical exam prep",
        "3D Printing, CAD slicing, and rapid prototyping workflows",
        "IoT microcontrollers, Arduino sensors, and robotics challenge design",
        "Mentoring student teams for National Science Fairs & ATL Marathons"
      ],
      idealFor: "Senior Secondary Faculty (Classes 11-12), ATL In-Charges, HODs"
    },
    {
      id: 2,
      title: "STEM Master Trainer & Institutional Leadership",
      duration: "7 Days · 40 CPD Hours",
      badge: "Executive Leadership",
      desc: "A train-the-trainer immersion for academic coordinators and school principals to establish an institution-wide culture of inquiry.",
      modules: [
        "Curriculum auditing and NEP 2020 experiential mapping across departments",
        "Peer coaching, lesson observation protocols, and faculty mentoring",
        "Budgeting, equipment procurement, and GeM tender evaluation",
        "Parent showcase events and community STEM exhibitions"
      ],
      idealFor: "Principals, Vice Principals, Academic Coordinators, Trust Directors"
    }
  ];

  const corePillars = [
    {
      icon: Layers,
      color: 'bg-blue-50 text-[#005689] border-blue-200',
      title: "Zero Teacher Burden Methodology",
      desc: "We provide bilingual lesson plans, pre-calculated observation tables, and demonstration video guides so teachers can focus on mentoring students rather than administrative setup."
    },
    {
      icon: ShieldCheck,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      title: "Rigorous Lab Safety SOPs",
      desc: "Master hands-on protocols for acid storage, eyewash station maintenance, chemical spill containment, and electrical workbench circuit protection."
    },
    {
      icon: Video,
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      title: "Blended Digital & Physical Practice",
      desc: "Learn how to use virtual experiment simulations to introduce complex concepts before guiding students through delicate physical apparatus in the lab."
    },
    {
      icon: Award,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      title: "Verifiable Digital CPD Credentials",
      desc: "Each certified teacher receives a blockchain-verifiable digital badge and formal certificate documenting completed Continuous Professional Development hours."
    }
  ];

  const faqs = [
    {
      q: "Are CSEEL training hours accredited for CBSE mandatory teacher CPD requirements?",
      a: "Yes. The National Education Policy (NEP) 2020 mandates that every school teacher must complete at least 50 hours of Continuous Professional Development (CPD) per year. CSEEL masterclasses are structured to fulfill these requirements with verifiable certification."
    },
    {
      q: "Can our school organize an exclusive on-campus training workshop for our faculty?",
      a: "Absolutely. We routinely dispatch senior STEM master trainers to partner school campuses across India to conduct customized 3-day or 5-day on-site workshops using your school's actual laboratory apparatus and rooms."
    },
    {
      q: "Is there an online option available for individual teachers?",
      a: "Yes! We run interactive weekend cohorts conducted live via Zoom with take-home hands-on mini-experiment kits dispatched directly to your address."
    },
    {
      q: "What post-training support do participating educators receive?",
      a: "Every alumnus gains permanent access to the CSEEL Educator Resource Portal, which includes updated CBSE practical blueprints, downloadable lesson plans, and an ongoing monthly advisory helpline."
    }
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-white">

        {/* ─── HERO SECTION (Labster Split Hero) ─── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#001D38] via-[#003C6E] to-[#005689] text-white pt-12 pb-20 md:pt-16 md:pb-24">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              <div className="lg:col-span-7 space-y-6 text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-cyan-200">
                  <GraduationCap className="w-3.5 h-3.5 text-cyan-300" />
                  <span>CONTINUOUS PROFESSIONAL DEVELOPMENT (CPD) · NEP 2020</span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-extrabold text-white tracking-tight leading-[1.15]" style={{ color: '#ffffff' }}>
                  Teacher Training in <span className="text-cyan-300">Experiential STEM Pedagogy</span>
                </h1>

                <p className="text-base sm:text-lg text-slate-100/90 max-w-2xl leading-relaxed">
                  Equip your science educators with hands-on mastery, lab safety SOPs, modern ATL equipment handling, and NEP 2020 experiential learning delivery. Recognized CPD certification for school faculty across India.
                </p>

                <div className="flex flex-col sm:flex-row gap-3.5 pt-2">
                  <button
                    onClick={() => openDemoModal({
                      title: 'Register for Faculty Training Program',
                      subtitle: 'Choose between on-campus school masterclasses or upcoming live weekend cohorts.'
                    })}
                    className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-400 to-cyan-500 text-slate-950 hover:brightness-105 transition-all shadow-lg shadow-cyan-500/25 active:scale-[0.98] cursor-pointer"
                  >
                    <span>Register for Masterclass</span>
                  </button>

                  <Link
                    href="/for-educators"
                    className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/25 backdrop-blur-sm transition-all active:scale-[0.98]"
                  >
                    <span>For Science Educators</span>
                  </Link>

                  <Link
                    href="/workshops"
                    className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/25 backdrop-blur-sm transition-all active:scale-[0.98]"
                  >
                    <span>Explore Student Workshops</span>
                  </Link>
                </div>

                <div className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-200/90 font-medium border-t border-white/15">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-300" />
                    <span>50 Mandatory CPD Hours</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-300" />
                    <span>On-Campus & Online Cohorts</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-300" />
                    <span>Digital Verifiable Certificate</span>
                  </span>
                </div>
              </div>

              {/* Right Column: Training Overview Card */}
              <div className="lg:col-span-5">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 text-left">
                  
                  <div className="flex items-center justify-between border-b border-white/15 pb-4">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-300 block">Faculty CPD Track</span>
                      <h3 className="text-lg font-bold text-white mt-0.5" style={{ color: '#ffffff' }}>Upcoming Masterclass Schedule</h3>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-bold">
                      Open
                    </span>
                  </div>

                  <div className="space-y-3.5">
                    <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-cyan-400/20 text-cyan-300 flex items-center justify-center shrink-0">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white" style={{ color: '#ffffff' }}>National Weekend Faculty Cohort</h4>
                        <p className="text-[11px] text-slate-200 mt-0.5">Live Interactive Weekend Masterclass via Zoom with hands-on home kit.</p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center shrink-0">
                        <School className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white" style={{ color: '#ffffff' }}>On-Campus School Masterclass</h4>
                        <p className="text-[11px] text-slate-200 mt-0.5">Custom 3-day on-site training for full science department.</p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-purple-400/20 text-purple-300 flex items-center justify-center shrink-0">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white" style={{ color: '#ffffff' }}>Master Trainer Certification</h4>
                        <p className="text-[11px] text-slate-200 mt-0.5">Advanced 7-day executive credential for science coordinators.</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-cyan-200">School Bookings</span>
                      <p className="text-xs font-bold text-white mt-0.5" style={{ color: '#ffffff' }}>Special Group Institutional Rates</p>
                    </div>
                    <button
                      onClick={() => openDemoModal({ title: 'Book School Teacher Workshop' })}
                      className="px-3.5 py-1.5 rounded-lg bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition-all cursor-pointer shadow-xs"
                    >
                      <span>Inquire Now</span>
                    </button>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ─── KEY STATS BAR ─── */}
        <section className="border-y border-slate-200 bg-slate-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              {trainingStats.map((s, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="text-3xl sm:text-4xl font-extrabold text-[#005689]" style={{ color: '#003c6e' }}>
                    {s.value}
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900">
                    {s.label}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {s.sub}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── 3 PROGRAM TIERS (Cards) ─── */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
              <span className="px-3 py-1 rounded-full bg-blue-50 text-[#005689] border border-blue-200/80 text-xs font-bold uppercase tracking-wider">
                Progressive Certification Paths
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight" style={{ color: '#003c6e' }}>
                Three Specialized Training Programs
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Structured to meet educators at their current stage of development, from foundational pedagogy to executive STEM lab leadership.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {programTiers.map((p, idx) => (
                <div
                  key={idx}
                  className={`bg-white rounded-3xl p-7 border transition-all duration-300 flex flex-col justify-between shadow-xs hover:shadow-xl ${
                    idx === 1
                      ? 'border-[#005689] ring-2 ring-[#005689]/20 relative'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-blue-50 text-[#005689] border border-blue-200 text-xs font-bold">
                        {p.badge}
                      </span>
                      <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{p.duration}</span>
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-900" style={{ color: '#003c6e' }}>
                        {p.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        {p.desc}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 space-y-2.5">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Key Curriculum Modules</h4>
                      {p.modules.map((m, mIdx) => (
                        <div key={mIdx} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{m}</span>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600">
                      <strong className="text-slate-800">Ideal For:</strong> {p.idealFor}
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100">
                    <button
                      onClick={() => openDemoModal({
                        title: `Register for ${p.title}`,
                        subtitle: `Duration: ${p.duration}. Let us know your preferred dates.`
                      })}
                      className={`w-full py-3 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-xs ${
                        idx === 1
                          ? 'bg-[#005689] hover:bg-[#003c6e] text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                      }`}
                    >
                      <span>Enroll in Program</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ─── CORE TRAINING PILLARS ─── */}
        <section className="py-16 bg-[#F8FAFC] border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <span className="text-xs font-bold text-[#005689] uppercase tracking-wider">Quality Standards</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900" style={{ color: '#003c6e' }}>
                Why School Leaders Choose CSEEL Training
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {corePillars.map((cp, idx) => (
                <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-3">
                  <div className={`w-11 h-11 rounded-2xl ${cp.color} border flex items-center justify-center shrink-0`}>
                    <cp.icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900" style={{ color: '#003c6e' }}>{cp.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{cp.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FAQ ACCORDION ─── */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 space-y-2">
              <span className="text-xs font-bold text-[#005689] uppercase tracking-wider">Frequently Asked Questions</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900" style={{ color: '#003c6e' }}>
                CPD Certification Details
              </h2>
            </div>

            <div className="space-y-3.5">
              {faqs.map((f, i) => (
                <div key={i} className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full p-5 text-left font-bold text-sm text-slate-900 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <span style={{ color: '#003c6e' }}>{f.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 shrink-0 ${openFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaq === i && (
                    <div className="p-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                      {f.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FINAL CTA ─── */}
        <section className="py-16 bg-[#F8FAFC]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-gradient-to-r from-[#002244] via-[#003c6e] to-[#005689] text-white p-8 sm:p-12 text-center relative overflow-hidden shadow-xl">
              <div className="max-w-3xl mx-auto space-y-5 relative z-10">
                <span className="px-3.5 py-1.5 rounded-full bg-white/10 text-cyan-200 border border-white/20 text-xs font-bold uppercase tracking-wider inline-block">
                  Institutional & Individual Registrations
                </span>

                <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight" style={{ color: '#ffffff' }}>
                  Upgrade Your School's Science Teaching Capacity
                </h2>

                <p className="text-xs sm:text-base text-slate-100/90 max-w-xl mx-auto leading-relaxed">
                  Join 10,000+ certified educators across India. Book an on-site masterclass for your school or register for our next live interactive cohort.
                </p>

                <div className="flex flex-col sm:flex-row gap-3.5 justify-center pt-2">
                  <button
                    onClick={() => openDemoModal({
                      title: 'Register for Faculty Development Workshop',
                      subtitle: 'Speak with our academic training director to confirm dates and seat availability.'
                    })}
                    className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-400 to-cyan-500 text-slate-950 hover:brightness-105 transition-all shadow-lg shadow-cyan-500/25 active:scale-[0.98] cursor-pointer"
                  >
                    <span>Register for Masterclass</span>
                  </button>

                  <Link
                    href="/contact-us"
                    className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/25 backdrop-blur-sm transition-all active:scale-[0.98]"
                  >
                    <span>Request On-Campus Workshop</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </PageTransition>
  );
}
