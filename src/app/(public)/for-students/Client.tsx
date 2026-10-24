'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PageTransition from "@/components/shared/PageTransition";
import {
  FlaskConical, Gamepad2, Trophy, BookOpenCheck, Sparkles,
  Star, CheckCircle2, ChevronDown, Check, Cpu, Eye,
  Atom, Award, Compass, Zap, HelpCircle
} from "lucide-react";
import { useBookDemoModal } from '@/contexts/BookDemoModalContext';

export default function ForStudentsClient() {
  const { openDemoModal } = useBookDemoModal();
  const [activeGrade, setActiveGrade] = useState<'middle' | 'secondary' | 'senior'>('secondary');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const studentStats = [
    { value: '150,000+', label: 'Active Student Innovators', sub: 'Across 500+ schools' },
    { value: '300+', label: 'Experiential Simulations', sub: 'Physics, Chemistry, Bio & Math' },
    { value: '45+', label: 'National Fair Winners', sub: 'ATL Marathon & Science Olympiads' },
    { value: '100%', label: 'Risk-Free Safe Practice', sub: 'Zero chemical burns or breakage' },
  ];

  const studentFeatures = [
    {
      icon: Gamepad2,
      color: 'bg-blue-50 text-[#005689] border-blue-200',
      title: "Interactive Live Simulations",
      desc: "Perform experiments you can't normally do at home. Change temperatures, adjust gravity, mix reactive compounds, and view subatomic molecules in 3D.",
      highlights: ["Control variables and see instant graphical plots", "Safe exploration of high-voltage and toxic chemicals", "Re-run experiments infinite times until mastery"]
    },
    {
      icon: FlaskConical,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      title: "Hands-On Practical Exam Mastery",
      desc: "Ace your school and CBSE board practical exams. Practice vernier calipers, screw gauge, titration, and salt analysis before stepping into the physical exam hall.",
      highlights: ["Step-by-step procedure guides and zero-error checks", "Real-time reading capture in observation tables", "Formula calculation checkers with instant feedback"]
    },
    {
      icon: Cpu,
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      title: "ATL Robotics & Maker Tinkering",
      desc: "Turn your ideas into working prototypes. Learn Arduino coding, sensor interfacing, IoT smart devices, and 3D printing design.",
      highlights: ["Circuit wiring with simulated LEDs, motors and microcontrollers", "Tinkercad 3D CAD modeling tutorials", "National hackathon problem-statement guides"]
    },
    {
      icon: Trophy,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      title: "Olympiad & Science Fair Mentorship",
      desc: "Get ready to shine in national science fairs. Access winning project blueprints, research paper formats, and innovation rubrics.",
      highlights: ["Guidance for CBSE Science Exhibition & State Fairs", "ATL Marathon innovation challenge frameworks", "Mentorship from university research scholars"]
    },
    {
      icon: BookOpenCheck,
      color: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      title: "Viva-Voce Question Vault",
      desc: "Conquer practical viva anxiety. Practice hundreds of actual external examiner questions with conceptual reasoning and animated diagrams.",
      highlights: ["Top 50 viva questions per experiment", "Explains the 'Why' behind every lab observation", "Mock viva voice drills with instant answers"]
    },
    {
      icon: Award,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      title: "Digital Portfolio & Mastery Badges",
      desc: "Build an impressive STEM portfolio. Earn verifiable digital skill badges for every module, experiment, and hackathon project you complete.",
      highlights: ["Showcase projects for college & scholarship applications", "Verifiable digital certificates recognized by schools", "Track your scientific learning streak"]
    },
  ];

  const gradePathways = {
    middle: {
      grade: "Classes 6 to 8 (Middle School)",
      badge: "Curiosity & Tinkering",
      desc: "Spark your scientific imagination with fun, visual experiments and basic hands-on making.",
      projects: [
        "Light & Shadows: Ray tracing through pinhole camera & lenses",
        "Acid-Base Magic: Natural indicators using turmeric & red cabbage",
        "Plant Botany: Stomata exploration & transpiration under microscope",
        "Junior Maker: Simple LED flashlight circuit & paper electromagnet"
      ]
    },
    secondary: {
      grade: "Classes 9 & 10 (Secondary School)",
      badge: "Core Practical Mastery",
      desc: "Bridge textbook physics, chemistry, and biology with board practical exam requirements.",
      projects: [
        "Ohm's Law: Verifying V = IR with voltmeter, ammeter & rheostat",
        "Chemical Reactions: Displacement, decomposition & precipitation",
        "Microscopic Slides: Observing onion root tip cells and stomatal peels",
        "Robotics Basics: Building an obstacle-avoiding autonomous car"
      ]
    },
    senior: {
      grade: "Classes 11 & 12 (Senior Secondary)",
      badge: "Advanced STEM & Viva",
      desc: "Master high-stakes CBSE/ICSE practicals, advanced instrumentation, and competitive entrance concepts.",
      projects: [
        "Optics Bench: Convex lens focal length by u-v method and parallax",
        "Volumetric Titration: Standard oxalic acid vs KMnO4 titration curve",
        "Potentiometer: Internal resistance of primary cell & EMF comparison",
        "Applied IoT: ESP32 wireless sensor telemetry and cloud dashboard"
      ]
    }
  };

  const studentFaqs = [
    {
      q: "Do I need to install any heavy software or buy expensive hardware?",
      a: "No! All CSEEL interactive experiments run straight in your web browser on any phone, tablet, laptop, or desktop computer. No software installations or high-end graphics cards required."
    },
    {
      q: "How does CSEEL help me score 30/30 in my Board Practical Exam?",
      a: "Our modules simulate the exact apparatus and measurement steps you will encounter on exam day. You will practice recording zero error, calculating mean readings, drawing accurate graphs, and answering typical external examiner viva questions."
    },
    {
      q: "Can I build real physical projects with CSEEL?",
      a: "Yes! Alongside digital simulations, we provide complete schematics, bill of materials (BOM), and step-by-step assembly guides in our Projects section so you can build physical robots, IoT systems, and science fair prototypes."
    },
    {
      q: "How do I earn verified certificates and badges?",
      a: "As you complete experiments, submit lab observations, and pass conceptual diagnostic checkpoints, digital mastery badges are automatically added to your CSEEL learner profile."
    }
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-white">

        {/* ─── HERO SECTION (Labster Dual Column) ─── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#001D38] via-[#003C6E] to-[#005689] text-white pt-12 pb-20 md:pt-16 md:pb-24">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              <div className="lg:col-span-7 space-y-6 text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-cyan-200">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                  <span>K-12 STEM DISCOVERY · HANDS-ON LEARNING</span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-extrabold text-white tracking-tight leading-[1.15]" style={{ color: '#ffffff' }}>
                  Learn Science by Doing — Explore <span className="text-cyan-300">Live Labs & Projects</span>
                </h1>

                <p className="text-base sm:text-lg text-slate-100/90 max-w-2xl leading-relaxed">
                  Stop memorizing dry definitions. Run virtual and hands-on experiments, build working robotics prototypes, master CBSE board practicals, and crack science Olympiads with confidence.
                </p>

                <div className="flex flex-col sm:flex-row gap-3.5 pt-2">
                  <Link
                    href="/simulations"
                    className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-400 to-cyan-500 text-slate-950 hover:brightness-105 transition-all shadow-lg shadow-cyan-500/25 active:scale-[0.98]"
                  >
                    <span>Launch Free Simulations</span>
                  </Link>

                  <Link
                    href="/projects"
                    className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/25 backdrop-blur-sm transition-all active:scale-[0.98]"
                  >
                    <span>Explore Maker Projects</span>
                  </Link>

                  <Link
                    href="/domain/science"
                    className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/25 backdrop-blur-sm transition-all active:scale-[0.98]"
                  >
                    <span>Science Domain Hub</span>
                  </Link>
                </div>

                <div className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-200/90 font-medium border-t border-white/15">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-300" />
                    <span>Free Browser-Based Access</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-300" />
                    <span>Step-by-Step Viva Prep</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-300" />
                    <span>Verifiable STEM Badges</span>
                  </span>
                </div>
              </div>

              {/* Right Column: Student Quest Preview Card */}
              <div className="lg:col-span-5">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 text-left">
                  
                  <div className="flex items-center justify-between border-b border-white/15 pb-4">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-300 block">Student Quest Hub</span>
                      <h3 className="text-lg font-bold text-white mt-0.5" style={{ color: '#ffffff' }}>Your Learning Journey</h3>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 text-[11px] font-bold">
                      Interactive
                    </span>
                  </div>

                  <div className="space-y-3.5">
                    <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-cyan-400/20 text-cyan-300 flex items-center justify-center shrink-0">
                        <FlaskConical className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white" style={{ color: '#ffffff' }}>Interactive 3D Lab Benches</h4>
                        <p className="text-[11px] text-slate-200 mt-0.5">Control lasers, chemical burettes & circuit boards virtually.</p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center shrink-0">
                        <Trophy className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white" style={{ color: '#ffffff' }}>Practical Viva Score Booster</h4>
                        <p className="text-[11px] text-slate-200 mt-0.5">Understand the reasoning behind examiner questions.</p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-purple-400/20 text-purple-300 flex items-center justify-center shrink-0">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white" style={{ color: '#ffffff' }}>Build & Share STEM Projects</h4>
                        <p className="text-[11px] text-slate-200 mt-0.5">Earn badges and showcase prototypes to peer innovators.</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-cyan-200">Start Your First Lab</span>
                      <p className="text-xs font-bold text-white mt-0.5" style={{ color: '#ffffff' }}>No Account Required to Preview</p>
                    </div>
                    <Link
                      href="/simulations"
                      className="px-3.5 py-1.5 rounded-lg bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition-all cursor-pointer shadow-xs"
                    >
                      <span>Explore Labs</span>
                    </Link>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ─── KEY STUDENT STATS ─── */}
        <section className="border-y border-slate-200 bg-slate-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              {studentStats.map((s, idx) => (
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

        {/* ─── CORE STUDENT ADVANTAGES (Labster Cards) ─── */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
              <span className="px-3 py-1 rounded-full bg-blue-50 text-[#005689] border border-blue-200/80 text-xs font-bold uppercase tracking-wider">
                Hands-On Superpowers
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight" style={{ color: '#003c6e' }}>
                Why Indian Students Love CSEEL
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Experience science the way it was meant to be: interactive, visual, exciting, and connected directly to the real world.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {studentFeatures.map((f, i) => (
                <div
                  key={i}
                  className="bg-white rounded-3xl p-7 border border-slate-200 hover:border-[#005689]/40 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className={`w-12 h-12 rounded-2xl ${f.color} border flex items-center justify-center shrink-0`}>
                      <f.icon className="w-6 h-6" />
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#005689] transition-colors" style={{ color: '#003c6e' }}>
                      {f.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {f.desc}
                    </p>

                    <div className="pt-2 border-t border-slate-100 space-y-2">
                      {f.highlights.map((h, hIdx) => (
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

        {/* ─── GRADE-WISE LEARNING PATHWAYS (Tabs) ─── */}
        <section className="py-16 sm:py-20 bg-[#F8FAFC] border-y border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
              <span className="text-xs font-bold text-[#005689] uppercase tracking-wider">Targeted Pathways</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900" style={{ color: '#003c6e' }}>
                Curriculum Designed for Your Class Level
              </h2>
            </div>

            <div className="flex justify-center mb-8">
              <div className="inline-flex p-1.5 rounded-2xl bg-slate-200/80 border border-slate-300/80 max-w-full overflow-x-auto">
                <button
                  onClick={() => setActiveGrade('middle')}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeGrade === 'middle' ? 'bg-white text-[#005689] shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Classes 6 to 8
                </button>
                <button
                  onClick={() => setActiveGrade('secondary')}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeGrade === 'secondary' ? 'bg-white text-[#005689] shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Classes 9 & 10
                </button>
                <button
                  onClick={() => setActiveGrade('senior')}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeGrade === 'senior' ? 'bg-white text-[#005689] shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Classes 11 & 12
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-md">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-[#005689] border border-blue-200 text-xs font-bold">
                    {gradePathways[activeGrade].badge}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2" style={{ color: '#003c6e' }}>
                    {gradePathways[activeGrade].grade}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                    {gradePathways[activeGrade].desc}
                  </p>
                </div>
                <Link
                  href="/simulations"
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-[#005689] hover:bg-[#003c6e] text-white font-bold text-xs transition-all shadow-xs shrink-0"
                >
                  <span>Explore Class Practicals</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
                {gradePathways[activeGrade].projects.map((proj, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      ✓
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                      {proj}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ─── STUDENT FAQ ─── */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 space-y-2">
              <span className="text-xs font-bold text-[#005689] uppercase tracking-wider">Learner Help Desk</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900" style={{ color: '#003c6e' }}>
                Frequently Asked Student Questions
              </h2>
            </div>

            <div className="space-y-3.5">
              {studentFaqs.map((f, i) => (
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

        {/* ─── FINAL STUDENT CTA ─── */}
        <section className="py-16 bg-[#F8FAFC]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-gradient-to-r from-[#002244] via-[#003c6e] to-[#005689] text-white p-8 sm:p-12 text-center relative overflow-hidden shadow-xl">
              <div className="max-w-3xl mx-auto space-y-5 relative z-10">
                <span className="px-3.5 py-1.5 rounded-full bg-white/10 text-cyan-200 border border-white/20 text-xs font-bold uppercase tracking-wider inline-block">
                  Begin Your Scientific Adventure
                </span>

                <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight" style={{ color: '#ffffff' }}>
                  Ready to Experience Science Like Never Before?
                </h2>

                <p className="text-xs sm:text-base text-slate-100/90 max-w-xl mx-auto leading-relaxed">
                  Join 150,000+ students across India. Launch your first live experiment simulation right now or explore working science fair prototypes.
                </p>

                <div className="flex flex-col sm:flex-row gap-3.5 justify-center pt-2">
                  <Link
                    href="/simulations"
                    className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-400 to-cyan-500 text-slate-950 hover:brightness-105 transition-all shadow-lg shadow-cyan-500/25 active:scale-[0.98]"
                  >
                    <span>Launch Free Simulator</span>
                  </Link>

                  <Link
                    href="/projects"
                    className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/25 backdrop-blur-sm transition-all active:scale-[0.98]"
                  >
                    <span>View Maker Projects</span>
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
