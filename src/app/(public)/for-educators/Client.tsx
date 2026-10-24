'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PageTransition from "@/components/shared/PageTransition";
import {
  GraduationCap, BookOpen, Users, Award, Calendar, CheckCircle2,
  Sparkles, Star, ChevronDown, Check, Microscope, FlaskConical,
  Zap, Clock, ShieldCheck, FileText, Compass, Layers
} from "lucide-react";
import { useBookDemoModal } from '@/contexts/BookDemoModalContext';

export default function ForEducatorsClient() {
  const { openDemoModal } = useBookDemoModal();
  const [activeSubject, setActiveSubject] = useState<'physics' | 'chemistry' | 'biology' | 'robotics'>('physics');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const teacherStats = [
    { value: '10,000+', label: 'Educators Empowered', sub: 'Across 500+ Indian schools' },
    { value: '15 Hrs', label: 'Saved Weekly on Lab Prep', sub: 'Ready lesson plans & manuals' },
    { value: '100%', label: 'Curriculum-Aligned Experiments', sub: 'CBSE, ICSE & State Boards' },
    { value: '50 Hrs', label: 'Accredited CPD Training', sub: 'In experiential STEM pedagogy' },
  ];

  const teacherBenefits = [
    {
      icon: BookOpen,
      color: 'bg-blue-50 text-[#005689] border-blue-200',
      title: "Comprehensive Lab Manuals & Lesson Plans",
      desc: "Zero time wasted creating worksheets from scratch. Every experiment comes with bilingual step-by-step student procedure sheets, observation tables, and teacher solution keys.",
      highlights: ["Standard observation tables & graph templates", "Viva-voce question bank with model answers", "Formative rubrics for continuous assessment"]
    },
    {
      icon: FlaskConical,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      title: "Zero Apparatus Breakage Stress",
      desc: "Let students rehearse delicate optical alignment, titration drop rates, and circuit connections on interactive simulations before handling actual physical apparatus in the lab.",
      highlights: ["Pre-lab virtual practice eliminates accidents", "Builds student confidence prior to physical handling", "Protects expensive glassware and precision meters"]
    },
    {
      icon: Sparkles,
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      title: "Kolb's 4-Stage Experiential Pedagogy",
      desc: "Move beyond rote memory. Ground every lesson in Concrete Experience -> Reflective Observation -> Abstract Conceptualization -> Active Experimentation.",
      highlights: ["100% compliance with NEP 2020 experiential norms", "Dramatically improves concept retention (+34%)", "Transforms passive listeners into active investigators"]
    },
    {
      icon: Award,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      title: "Accredited Faculty CPD Certification",
      desc: "Earn Continuous Professional Development (CPD) credits recognized by CBSE. Attend our weekend masterclasses led by senior professors and STEM research faculty.",
      highlights: ["Official CSEEL Experiential Educator Certificate", "Hands-on pedagogy and safety SOP masterclasses", "Mentorship to lead school teams in national fairs"]
    },
    {
      icon: ShieldCheck,
      color: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      title: "Standardized Lab Safety SOPs",
      desc: "Equip your laboratory with full safety compliance: chemical hazard classifications, eye-wash protocols, fire emergency procedures, and student safety contracts.",
      highlights: ["CBSE SARAS safety audit checklists", "Chemical storage and acid dilution safety charts", "First aid response manuals for every lab table"]
    },
    {
      icon: Users,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      title: "Pan-India Educator Community",
      desc: "Connect with thousands of physics, chemistry, biology, and ATL teachers. Share innovative project ideas, collaborative lesson plans, and STEM exhibition blueprints.",
      highlights: ["Monthly educator roundtable conclaves", "Direct access to curriculum subject matter experts", "Co-authoring opportunities for research papers"]
    },
  ];

  const subjectData = {
    physics: {
      title: "Physics Practicals & Mechanics",
      badge: "Classes 9 to 12 · CBSE & ICSE",
      desc: "Precision apparatus and interactive simulations for optical benches, screw gauge, spherometer, Ohm's law, resonance tube, and projectile motion.",
      experiments: [
        "Focal length of concave mirror & convex lens using optical bench",
        "Determination of resistivity using meter bridge & potentiometer",
        "Surface tension of water by capillary rise method",
        "Frequency of AC mains using sonometer & electromagnet"
      ]
    },
    chemistry: {
      title: "Chemistry Titrations & Salt Analysis",
      badge: "Classes 9 to 12 · CBSE & ICSE",
      desc: "Safe titration workflows, systematic qualitative cation/anion analysis, pH measurement, crystal preparation, and thermochemistry experiments.",
      experiments: [
        "Volumetric analysis of KMnO4 against standard oxalic acid",
        "Systematic identification of acidic and basic radicals (Salt Analysis)",
        "Preparation of double salts (Mohr's salt & potash alum)",
        "Determination of pH of various fruit juices and soil samples"
      ]
    },
    biology: {
      title: "Biology Microscopy & Specimen Slides",
      badge: "Classes 9 to 12 · CBSE & ICSE",
      desc: "High-resolution microscope slide analysis, mitosis observation in onion root tips, osmosis in Rheo leaves, and transpiration photometers.",
      experiments: [
        "Preparation and study of temporary mount of onion root tip (Mitosis)",
        "Study of plasmolysis in epidermal peels of Rheo discolor leaf",
        "Detection of starch, proteins, and fats in common food samples",
        "Comparative study of stomatal distribution on upper and lower surfaces"
      ]
    },
    robotics: {
      title: "Robotics, IoT & Atal Tinkering Labs",
      badge: "Classes 6 to 12 · ATL 2.0 & STEAM",
      desc: "Block coding and Python microcontrollers, Arduino sensor interfacing, 3D printing slicing, and obstacle-avoidance robotics challenges.",
      experiments: [
        "Automated smart irrigation system using soil moisture sensor & relay",
        "Line follower robot using dual IR sensor array and L298N driver",
        "3D modeling and precision extrusion of custom drone chassis",
        "Home automation controller using ESP32 and MQTT cloud"
      ]
    }
  };

  const educatorFaqs = [
    {
      q: "How do CSEEL lab manuals integrate with our existing school textbook?",
      a: "CSEEL lab manuals are designed as companion workbooks that directly follow the NCERT / CBSE / ICSE curriculum sequence. Each experiment begins with the textbook chapter reference, states the specific learning outcomes, and includes observation charts that match board practical exam answer sheets."
    },
    {
      q: "Can I use CSEEL interactive experiments on our school smart boards?",
      a: "Yes! Every module is 100% browser-based and optimized for classroom interactive flat panels (IFPs), smart boards, tablets, and desktop computer labs. No downloads or VR headsets required."
    },
    {
      q: "How does CSEEL help prepare high school students for board practical viva?",
      a: "Each lab package includes our proprietary 'Viva Question Vault' containing 50+ typical external examiner questions per topic, complete with conceptual reasoning, common pitfalls, and calculation checklists."
    },
    {
      q: "How can science educators join the CSEEL Continuous Professional Development (CPD) program?",
      a: "You can register for upcoming weekend masterclasses directly on our Teacher Training page or through your school's institutional partnership. Certificates with verifiable digital credentials are issued upon course completion."
    }
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-white">

        {/* ─── HERO SECTION (Labster Style Split Hero) ─── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#001D38] via-[#003C6E] to-[#005689] text-white pt-12 pb-20 md:pt-16 md:pb-24">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              <div className="lg:col-span-7 space-y-6 text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-cyan-200">
                  <GraduationCap className="w-3.5 h-3.5 text-cyan-300" />
                  <span>FOR SCIENCE EDUCATORS · NEP 2020 PEDAGOGY</span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-extrabold text-white tracking-tight leading-[1.15]" style={{ color: '#ffffff' }}>
                  Empower Your Classroom with <span className="text-cyan-300">Experiential Science Labs</span>
                </h1>

                <p className="text-base sm:text-lg text-slate-100/90 max-w-2xl leading-relaxed">
                  Transform abstract formulas into captivating practical investigations. Eliminate apparatus breakage stress, save 15+ hours weekly on practical setup, and inspire every student to think like a scientist.
                </p>

                <div className="flex flex-col sm:flex-row gap-3.5 pt-2">
                  <button
                    onClick={() => openDemoModal({
                      title: 'Request Educator Demo & Lesson Plans',
                      subtitle: 'Access curriculum-mapped lab manuals, teacher guides, and sample practical simulations.'
                    })}
                    className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-400 to-cyan-500 text-slate-950 hover:brightness-105 transition-all shadow-lg shadow-cyan-500/25 active:scale-[0.98] cursor-pointer"
                  >
                    <span>Get Free Teacher Pack</span>
                  </button>

                  <Link
                    href="/teacher-training"
                    className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/25 backdrop-blur-sm transition-all active:scale-[0.98]"
                  >
                    <span>Faculty CPD Masterclasses</span>
                  </Link>

                  <Link
                    href="/materials"
                    className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/25 backdrop-blur-sm transition-all active:scale-[0.98]"
                  >
                    <span>Browse 950+ Lab Materials</span>
                  </Link>
                </div>

                <div className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-200/90 font-medium border-t border-white/15">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-300" />
                    <span>CBSE & ICSE Aligned</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-300" />
                    <span>Ready Observation Tables</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-300" />
                    <span>Accredited CPD Certificates</span>
                  </span>
                </div>
              </div>

              {/* Right Column: Labster-Style Teacher Resource Card */}
              <div className="lg:col-span-5">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 text-left">
                  
                  <div className="flex items-center justify-between border-b border-white/15 pb-4">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-300 block">Teacher Toolkit</span>
                      <h3 className="text-lg font-bold text-white mt-0.5" style={{ color: '#ffffff' }}>What Every Educator Receives</h3>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 text-[11px] font-bold">
                      Turnkey
                    </span>
                  </div>

                  <div className="space-y-3.5">
                    <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-cyan-400/20 text-cyan-300 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white" style={{ color: '#ffffff' }}>Curriculum-Mapped Lab Manuals</h4>
                        <p className="text-[11px] text-slate-200 mt-0.5">Bilingual procedure manuals, theory outlines & model viva sheets.</p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center shrink-0">
                        <Zap className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white" style={{ color: '#ffffff' }}>Demonstration Video Library</h4>
                        <p className="text-[11px] text-slate-200 mt-0.5">High-definition practical walkthroughs for classroom projection.</p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-purple-400/20 text-purple-300 flex items-center justify-center shrink-0">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white" style={{ color: '#ffffff' }}>Accredited CPD Hours</h4>
                        <p className="text-[11px] text-slate-200 mt-0.5">Recognized continuous professional development teaching credits.</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-cyan-200">Weekly Time Saved</span>
                      <p className="text-xs font-bold text-white mt-0.5" style={{ color: '#ffffff' }}>15+ Hours Free from Manual Prep</p>
                    </div>
                    <button
                      onClick={() => openDemoModal({ title: 'Join Educator Network' })}
                      className="px-3.5 py-1.5 rounded-lg bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition-all cursor-pointer shadow-xs"
                    >
                      <span>Join Network</span>
                    </button>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ─── KEY TEACHER STATS ─── */}
        <section className="border-y border-slate-200 bg-slate-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              {teacherStats.map((s, idx) => (
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

        {/* ─── CORE TEACHER ADVANTAGES (Labster Cards) ─── */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
              <span className="px-3 py-1 rounded-full bg-blue-50 text-[#005689] border border-blue-200/80 text-xs font-bold uppercase tracking-wider">
                Pedagogical Empowerment
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight" style={{ color: '#003c6e' }}>
                Built to Make Teaching Science Rewarding
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                CSEEL equips teachers with the physical tools, digital scaffolding, and pedagogical framework to engage every learner effortlessly.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {teacherBenefits.map((b, i) => (
                <div
                  key={i}
                  className="bg-white rounded-3xl p-7 border border-slate-200 hover:border-[#005689]/40 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className={`w-12 h-12 rounded-2xl ${b.color} border flex items-center justify-center shrink-0`}>
                      <b.icon className="w-6 h-6" />
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#005689] transition-colors" style={{ color: '#003c6e' }}>
                      {b.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {b.desc}
                    </p>

                    <div className="pt-2 border-t border-slate-100 space-y-2">
                      {b.highlights.map((h, hIdx) => (
                        <div key={hIdx} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ─── SUBJECT EXPLORER (Interactive Tabs) ─── */}
        <section className="py-16 sm:py-20 bg-[#F8FAFC] border-y border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
              <span className="text-xs font-bold text-[#005689] uppercase tracking-wider">Discipline Coverage</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900" style={{ color: '#003c6e' }}>
                Curriculum Alignment by Subject
              </h2>
            </div>

            <div className="flex justify-center mb-8">
              <div className="inline-flex p-1.5 rounded-2xl bg-slate-200/80 border border-slate-300/80 max-w-full overflow-x-auto">
                <button
                  onClick={() => setActiveSubject('physics')}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeSubject === 'physics' ? 'bg-white text-[#005689] shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Physics Practicals
                </button>
                <button
                  onClick={() => setActiveSubject('chemistry')}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeSubject === 'chemistry' ? 'bg-white text-[#005689] shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Chemistry Labs
                </button>
                <button
                  onClick={() => setActiveSubject('biology')}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeSubject === 'biology' ? 'bg-white text-[#005689] shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Biology Microscopy
                </button>
                <button
                  onClick={() => setActiveSubject('robotics')}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeSubject === 'robotics' ? 'bg-white text-[#005689] shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Robotics & ATL
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-md">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-[#005689] border border-blue-200 text-xs font-bold">
                    {subjectData[activeSubject].badge}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2" style={{ color: '#003c6e' }}>
                    {subjectData[activeSubject].title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                    {subjectData[activeSubject].desc}
                  </p>
                </div>
                <Link
                  href="/materials"
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-[#005689] hover:bg-[#003c6e] text-white font-bold text-xs transition-all shadow-xs shrink-0"
                >
                  <span>Explore Apparatus</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
                {subjectData[activeSubject].experiments.map((exp, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      ✓
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                      {exp}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ─── EDUCATOR FAQ ─── */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 space-y-2">
              <span className="text-xs font-bold text-[#005689] uppercase tracking-wider">Teacher Guidance</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900" style={{ color: '#003c6e' }}>
                Frequently Asked Teacher Questions
              </h2>
            </div>

            <div className="space-y-3.5">
              {educatorFaqs.map((f, i) => (
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
                  Elevate Your Teaching Practice
                </span>

                <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight" style={{ color: '#ffffff' }}>
                  Ready to Experience the Power of Experiential Science?
                </h2>

                <p className="text-xs sm:text-base text-slate-100/90 max-w-xl mx-auto leading-relaxed">
                  Join 10,000+ science teachers across India. Download sample lab manuals, explore experiment simulations, or register for our next faculty CPD masterclass.
                </p>

                <div className="flex flex-col sm:flex-row gap-3.5 justify-center pt-2">
                  <button
                    onClick={() => openDemoModal({
                      title: 'Download Free Science Teacher Kit',
                      subtitle: 'Access sample experiment rubrics, observation tables, and demonstration guidelines.'
                    })}
                    className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-400 to-cyan-500 text-slate-950 hover:brightness-105 transition-all shadow-lg shadow-cyan-500/25 active:scale-[0.98] cursor-pointer"
                  >
                    <span>Download Teacher Kit</span>
                  </button>

                  <Link
                    href="/teacher-training"
                    className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/25 backdrop-blur-sm transition-all active:scale-[0.98]"
                  >
                    <span>Register for Masterclass</span>
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
