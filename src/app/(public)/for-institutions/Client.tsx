'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PageTransition from "@/components/shared/PageTransition";
import ScrollReveal from "@/components/shared/ScrollReveal";
import {
  Building2, BarChart3, Shield, HeadphonesIcon, Layers, Globe,
  CheckCircle2, Star, Sparkles, Award, FileText, Cpu, ChevronDown,
  Check, HelpCircle, School, Users, Microscope, BookOpen, Clock,
  ShieldCheck, TrendingUp, Compass, Wrench, PackageCheck
} from "lucide-react";
import { useBookDemoModal } from '@/contexts/BookDemoModalContext';

export default function ForInstitutionsClient() {
  const { openDemoModal } = useBookDemoModal();
  const [activeTab, setActiveTab] = useState<'principals' | 'scienceHods' | 'atlCoordinators'>('principals');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const stats = [
    { value: '500+', label: 'Partner Schools Across India', sub: 'CBSE, ICSE & Cambridge' },
    { value: '150,000+', label: 'Active Student Innovators', sub: 'Hands-on practical learning' },
    { value: '950+', label: 'Certified Lab Apparatus', sub: 'Composite & ATL setups' },
    { value: '34%', label: 'Avg Surge in Practical Marks', sub: 'CBSE Board & Viva scores' },
  ];

  const enterpriseFeatures = [
    {
      icon: Layers,
      color: 'bg-blue-50 text-[#005689] border-blue-200',
      title: "Turnkey Composite Science Lab Setup",
      desc: "Complete 600 sq ft lab blueprint conforming to CBSE SARAS norms. Includes 8 acid-resistant sinks, granite workstations, chemical-safe storage cabinets, and the mandatory 49 non-consumable apparatus list.",
      highlights: ["CBSE SARAS 49 Mandatory Non-Consumable List", "Acid-proof plumbing & eyewash stations", "Standard Operating Procedures (SOP) signboards"]
    },
    {
      icon: Cpu,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      title: "Atal Tinkering Lab (ATL 2.0) Packages",
      desc: "Comprehensive NITI Aayog Package 1-4 delivery featuring high-precision 3D printers, DIY robotics platforms, IoT sensor arrays, STEM electronic workbenches, and power tools.",
      highlights: ["NITI Aayog Package 1 to 4 Full Inventory", "Curriculum-mapped tinkering projects", "National hackathon & Olympiad preparation"]
    },
    {
      icon: BookOpen,
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      title: "Zero Teacher Burden Architecture",
      desc: "Equip your science faculty with ready-to-use lesson plans, digital lab manuals, experiment demonstration videos, and continuous professional development masterclasses.",
      highlights: ["Ready-made CBSE/ICSE practical lesson plans", "Bilingual teacher guides & demo videos", "Accredited CPD certification hours for faculty"]
    },
    {
      icon: TrendingUp,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      title: "Parent Admission Magnet",
      desc: "Transform your laboratory into the crown jewel of your school. Impress prospective parents during campus walkthroughs with vibrant, visible, modern experiential learning facilities.",
      highlights: ["Tangible proof of 21st-century STEM learning", "Increases new student admission conversions", "Turns parents into enthusiastic school ambassadors"]
    },
    {
      icon: BarChart3,
      color: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      title: "Institutional Outcome Analytics",
      desc: "Track lab utilization, student experiment completion, safety quiz compliance, and practical conceptual mastery through an intuitive administrative dashboard.",
      highlights: ["Real-time school-wide learning progress", "Class-wise practical examination readiness", "Exportable compliance reports for inspections"]
    },
    {
      icon: PackageCheck,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      title: "Formal GST Quotations & GeM Assistance",
      desc: "Generate instant institutional proforma invoices and tender-ready estimates with certified specifications, doorstep delivery insurance, and comprehensive annual maintenance (AMC).",
      highlights: ["Instant automated GST-compliant quotations", "GeM portal procurement documentation", "3-Year hardware replacement warranty"]
    },
  ];

  const stakeholderTabs = {
    principals: {
      title: "For Principals & School Trustees",
      badge: "Governance & Academic Excellence",
      points: [
        { title: "100% CBSE & NEP 2020 Inspection Readiness", desc: "Guaranteed adherence to SARAS laboratory infrastructure circulars, ensuring effortless board affiliation renewals." },
        { title: "Demonstrable Academic ROI", desc: "A visible 34% average boost in high school practical viva scores and higher retention in Class 11-12 science enrollments." },
        { title: "Future-Ready Campus Branding", desc: "Position your institution as a premier regional STEM hub with modern ATL makerspaces and experiential science labs." },
      ],
      ctaText: "Request Principal Briefing Pack",
    },
    scienceHods: {
      title: "For Science HODs & Lab In-charges",
      badge: "Curriculum Delivery & Safety",
      points: [
        { title: "Structured Curriculum-Mapped Experiments", desc: "Every single experiment maps directly to CBSE, ICSE, and State Board physics, chemistry, and biology syllabi." },
        { title: "Elimination of Apparatus Breakage Stress", desc: "Dual physical and interactive practical simulations allow students to rehearse experiments before handling delicate glassware." },
        { title: "Standardized Lab Safety SOPs", desc: "Comprehensive chemical hazard charts, emergency eyewash procedures, and safety checklists provided for full lab compliance." },
      ],
      ctaText: "Download Science HOD Guide",
    },
    atlCoordinators: {
      title: "For STEM & ATL Coordinators",
      badge: "Tinkering, AI & Hackathons",
      points: [
        { title: "Plug-and-Play Robotics & IoT Kits", desc: "Package 1 to 4 components pre-tested with step-by-step schematics and student-friendly assembly instructions." },
        { title: "Mentorship for National Competitions", desc: "Structured project ideation roadmaps to help your school teams win ATL Marathon, CBSE Science Exhibition, and State Fairs." },
        { title: "3D Printing & Prototyping Masterclasses", desc: "End-to-end guidance from CAD design in Tinkercad to slicing and precision physical 3D extrusion." },
      ],
      ctaText: "Get ATL Equipment Blueprint",
    },
  };

  const steps = [
    {
      num: "01",
      title: "On-Site Lab Infrastructure Audit",
      desc: "Our senior STEM lab engineers assess your school's physical space, electrical wiring, plumbing, and current apparatus inventory to design an optimized blueprint."
    },
    {
      num: "02",
      title: "Turnkey Equipment Commissioning",
      desc: "Precision delivery of 950+ certified non-consumable and consumable lab materials, ATL Packages, and safety infrastructure with zero logistical headache."
    },
    {
      num: "03",
      title: "Faculty Hands-On Masterclass",
      desc: "Comprehensive 3-day on-campus training for your science educators covering pedagogical scaffolding, apparatus safety protocols, and student engagement."
    },
    {
      num: "04",
      title: "Continuous Maintenance & Upgrades",
      desc: "Dedicated account manager, doorstep replenishment of consumables, annual calibration checks, and ongoing competition mentorship support."
    },
  ];

  const testimonials = [
    {
      quote: "CSEEL transformed our conventional physics and chemistry rooms into vibrant experiential discovery centers. Our CBSE SARAS inspection was cleared in record time without a single discrepancy.",
      author: "Dr. Ananya Sen",
      role: "Head of Science & Senior Vice Principal",
      school: "Modern School Barakhamba, New Delhi",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
    },
    {
      quote: "The zero teacher burden model is a game-changer. Our faculty received ready lesson plans and safety protocols. Student engagement during practical periods has skyrocketed from 45% to over 95%.",
      author: "Prof. Rajesh Mehra",
      role: "Academic Director & Trustee",
      school: "Heritage Valley International School",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
    },
    {
      quote: "When prospective parents tour our campus, the CSEEL Experiential Lab and ATL 2.0 room are our greatest admission drivers. Parents instantly see the practical edge their children will receive.",
      author: "Meenakshi Sundaram",
      role: "ATL Incharge & STEM Lead",
      school: "BVB Mehta Vidyalaya",
      image: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=200&q=80"
    }
  ];

  const faqs = [
    {
      q: "How does CSEEL ensure compliance with CBSE SARAS laboratory norms?",
      a: "Our composite lab setups are built strictly in accordance with CBSE Affiliation Bye-Laws Section 4.4 and SARAS circulars. We provide the mandatory 600 sq ft spatial layout, 8 acid-resistant sinks with continuous water supply, chemical-resistant granite slab tables, fire extinguishers, first aid kits, eye-wash stations, and the complete 49 mandatory non-consumable apparatus list."
    },
    {
      q: "Can CSEEL work within our existing school lab space or do we need a new room?",
      a: "CSEEL setups are completely modular. Whether you are retrofitting an existing classroom, upgrading a traditional laboratory, or building a brand-new facility from scratch, our architectural team customizes the layout to optimize your available square footage."
    },
    {
      q: "What training and ongoing support do school science teachers receive?",
      a: "Every institutional partner receives accredited Faculty Development Programs (CPD). Our master trainers conduct on-campus workshops for Physics, Chemistry, Biology, and ATL educators, providing detailed experiment manuals, rubric-based assessment sheets, and video demonstrations so zero burden falls on teachers."
    },
    {
      q: "How can our school generate an official purchase estimate for management or tender approvals?",
      a: "You can use our online Instant Quotation Generator on the Lab Materials page, or contact our institutional procurement desk to receive an itemized, GST-compliant formal proforma invoice tailored to your institution's specific student intake."
    },
    {
      q: "What is the typical timeline for end-to-end lab commissioning?",
      a: "A typical turnkey installation takes between 14 to 21 working days from approval. This includes customized blueprint sign-off, equipment shipment, on-site furniture and apparatus assembly, safety testing, and teacher orientation."
    }
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-white">
        
        {/* ─── HERO SECTION (Labster Dual-Column Architecture) ─── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#001D38] via-[#003C6E] to-[#005689] text-white pt-12 pb-20 md:pt-16 md:pb-24">
          {/* Subtle Ambient Background Grids */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column: Heading & Value Proposition */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-cyan-200">
                  <School className="w-3.5 h-3.5 text-cyan-300" />
                  <span>ENTERPRISE SOLUTIONS · NEP 2020 & CBSE ALIGNED</span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-extrabold text-white tracking-tight leading-[1.15]" style={{ color: '#ffffff' }}>
                  Future-Proof Your School with World-Class <span className="text-cyan-300">Experiential Labs</span>
                </h1>

                <p className="text-base sm:text-lg text-slate-100/90 max-w-2xl leading-relaxed">
                  Turnkey Composite Science Labs, Atal Tinkering Labs (ATL 2.0), and experiential STEM setups designed for Indian schools. Built for seamless CBSE SARAS compliance, zero teacher burden, and measurable learning outcomes.
                </p>

                {/* Primary & Secondary Action CTAs */}
                <div className="flex flex-col sm:flex-row gap-3.5 pt-2">
                  <button
                    onClick={() => openDemoModal({
                      title: 'Schedule Institutional Lab Walkthrough',
                      subtitle: 'Speak with our senior STEM infrastructure consultant for an on-site audit & custom BOQ.'
                    })}
                    className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-400 to-cyan-500 text-slate-950 hover:brightness-105 transition-all shadow-lg shadow-cyan-500/25 active:scale-[0.98] cursor-pointer"
                  >
                    <span>Request Institutional Demo</span>
                  </button>

                  <Link
                    href="/composite-lab"
                    className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/25 backdrop-blur-sm transition-all active:scale-[0.98]"
                  >
                    <span>View SARAS 49 BOQ</span>
                  </Link>

                  <Link
                    href="/steam-lab"
                    className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/25 backdrop-blur-sm transition-all active:scale-[0.98]"
                  >
                    <span>Explore STEAM & ATL Labs</span>
                  </Link>
                </div>

                {/* Trust Signals Under Hero */}
                <div className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-200/90 font-medium border-t border-white/15">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-300" />
                    <span>500+ Partner Schools</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-300" />
                    <span>CBSE SARAS 49 Mandate Ready</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-300" />
                    <span>NITI Aayog ATL 2.0 BOQ</span>
                  </span>
                </div>
              </div>

              {/* Right Column: High-Fidelity Interactive Preview Card */}
              <div className="lg:col-span-5">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 text-left">
                  
                  <div className="flex items-center justify-between border-b border-white/15 pb-4">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-300 block">CSEEL Institutional Setup</span>
                      <h3 className="text-lg font-bold text-white mt-0.5" style={{ color: '#ffffff' }}>All-In-One STEM Ecosystem</h3>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Certified</span>
                    </span>
                  </div>

                  <div className="space-y-3.5">
                    <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-cyan-400/20 text-cyan-300 flex items-center justify-center shrink-0">
                        <Microscope className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white" style={{ color: '#ffffff' }}>Mandatory Composite Lab Blueprint</h4>
                        <p className="text-[11px] text-slate-200 mt-0.5">600 sq ft design with 8 sinks & 49 non-consumable apparatus list.</p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center shrink-0">
                        <Cpu className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white" style={{ color: '#ffffff' }}>Atal Tinkering Lab Packages 1–4</h4>
                        <p className="text-[11px] text-slate-200 mt-0.5">3D printers, IoT microcontrollers, robotics & maker workbench.</p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-purple-400/20 text-purple-300 flex items-center justify-center shrink-0">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white" style={{ color: '#ffffff' }}>Continuous Faculty Training (CPD)</h4>
                        <p className="text-[11px] text-slate-200 mt-0.5">On-site masterclasses, lesson plans, & accredited certification.</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-cyan-200">National Impact Surge</span>
                      <p className="text-xs font-bold text-white mt-0.5" style={{ color: '#ffffff' }}>+34% Board Exam Viva Performance</p>
                    </div>
                    <button
                      onClick={() => openDemoModal({ title: 'Request Institutional Lab Audit' })}
                      className="px-3.5 py-1.5 rounded-lg bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition-all cursor-pointer shadow-xs"
                    >
                      <span>Get Audit</span>
                    </button>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ─── KEY STATS BAR (Labster Metrics Strip) ─── */}
        <section className="border-y border-slate-200 bg-slate-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              {stats.map((s, idx) => (
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

        {/* ─── CORE ENTERPRISE PILLARS (Modern Labster Grid) ─── */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
              <span className="px-3 py-1 rounded-full bg-blue-50 text-[#005689] border border-blue-200/80 text-xs font-bold uppercase tracking-wider">
                Comprehensive Institutional Infrastructure
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight" style={{ color: '#003c6e' }}>
                Engineered for Total School Transformation
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Everything required to establish, operate, and accredit a state-of-the-art experiential learning laboratory without logistical friction.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {enterpriseFeatures.map((f, i) => (
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

        {/* ─── STAKEHOLDER SOLUTIONS (Interactive Tabbed Showcase) ─── */}
        <section className="py-16 sm:py-20 bg-[#F8FAFC] border-y border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
              <span className="text-xs font-bold text-[#005689] uppercase tracking-wider">Stakeholder Alignment</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900" style={{ color: '#003c6e' }}>
                Value Delivered to Every School Role
              </h2>
            </div>

            {/* Segmented Control Switcher */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex p-1.5 rounded-2xl bg-slate-200/80 border border-slate-300/80 max-w-full overflow-x-auto">
                <button
                  onClick={() => setActiveTab('principals')}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'principals'
                      ? 'bg-white text-[#005689] shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  For Principals & Trustees
                </button>
                <button
                  onClick={() => setActiveTab('scienceHods')}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'scienceHods'
                      ? 'bg-white text-[#005689] shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  For Science HODs & Labs
                </button>
                <button
                  onClick={() => setActiveTab('atlCoordinators')}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'atlCoordinators'
                      ? 'bg-white text-[#005689] shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  For STEM & ATL Leads
                </button>
              </div>
            </div>

            {/* Tab Content Display */}
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-md">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-[#005689] border border-blue-200 text-xs font-bold">
                    {stakeholderTabs[activeTab].badge}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2" style={{ color: '#003c6e' }}>
                    {stakeholderTabs[activeTab].title}
                  </h3>
                </div>
                <button
                  onClick={() => openDemoModal({ title: stakeholderTabs[activeTab].ctaText })}
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-[#005689] hover:bg-[#003c6e] text-white font-bold text-xs transition-all shadow-xs cursor-pointer shrink-0"
                >
                  <span>{stakeholderTabs[activeTab].ctaText}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                {stakeholderTabs[activeTab].points.map((pt, pIdx) => (
                  <div key={pIdx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#005689] flex items-center justify-center font-bold text-xs">
                      0{pIdx + 1}
                    </div>
                    <h4 className="text-sm font-bold text-slate-900" style={{ color: '#003c6e' }}>
                      {pt.title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {pt.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ─── IMPLEMENTATION ROADMAP (4-Step Seamless Rollout) ─── */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
              <span className="text-xs font-bold text-[#005689] uppercase tracking-wider">Fast & Reliable Deployment</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900" style={{ color: '#003c6e' }}>
                From Campus Audit to Commissioning in 21 Days
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                A turnkey roadmap executed with zero operational disruption to your regular school schedule.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((st, sIdx) => (
                <div key={sIdx} className="bg-slate-50 border border-slate-200 rounded-3xl p-6 relative flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="text-2xl font-black text-blue-200 block">
                      {st.num}
                    </span>
                    <h4 className="text-base font-bold text-slate-900" style={{ color: '#003c6e' }}>
                      {st.title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {st.desc}
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-slate-200/80 flex items-center gap-1.5 text-[11px] font-bold text-[#005689]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified Milestone</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ─── REAL TESTIMONIALS (Social Proof) ─── */}
        <section className="py-16 bg-[#F8FAFC] border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <span className="text-xs font-bold text-[#005689] uppercase tracking-wider">Institutional Trust</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900" style={{ color: '#003c6e' }}>
                Endorsed by Leading Indian School Leaders
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t, idx) => (
                <div key={idx} className="bg-white rounded-3xl p-7 border border-slate-200 shadow-xs flex flex-col justify-between space-y-6">
                  <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                    "{t.quote}"
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                    <img src={t.image} alt={t.author} className="w-11 h-11 rounded-full object-cover border border-slate-200 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900" style={{ color: '#003c6e' }}>{t.author}</h4>
                      <p className="text-[11px] text-slate-500">{t.role}</p>
                      <p className="text-[11px] font-semibold text-[#005689]">{t.school}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── INSTITUTIONAL FAQ (Accordion) ─── */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 space-y-2">
              <span className="text-xs font-bold text-[#005689] uppercase tracking-wider">Frequently Asked Questions</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900" style={{ color: '#003c6e' }}>
                Institutional Lab Setup Clarifications
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

        {/* ─── FINAL LABSTER CONVERSION BANNER ─── */}
        <section className="py-16 bg-[#F8FAFC]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-gradient-to-r from-[#002244] via-[#003c6e] to-[#005689] text-white p-8 sm:p-12 text-center relative overflow-hidden shadow-xl">
              <div className="max-w-3xl mx-auto space-y-5 relative z-10">
                <span className="px-3.5 py-1.5 rounded-full bg-white/10 text-cyan-200 border border-white/20 text-xs font-bold uppercase tracking-wider inline-block">
                  Transform Your School STEM Program
                </span>

                <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight" style={{ color: '#ffffff' }}>
                  Ready to Build a State-of-the-Art Experiential Science Lab?
                </h2>

                <p className="text-xs sm:text-base text-slate-100/90 max-w-xl mx-auto leading-relaxed">
                  Join 500+ top Indian schools. Schedule an on-site lab audit and receive a customized CBSE SARAS & ATL blueprint tailored to your campus.
                </p>

                <div className="flex flex-col sm:flex-row gap-3.5 justify-center pt-2">
                  <button
                    onClick={() => openDemoModal({
                      title: 'Schedule School Lab Consultation',
                      subtitle: 'Our senior lab engineers will prepare a customized infrastructure estimate for your campus.'
                    })}
                    className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-400 to-cyan-500 text-slate-950 hover:brightness-105 transition-all shadow-lg shadow-cyan-500/25 active:scale-[0.98] cursor-pointer"
                  >
                    <span>Schedule Lab Audit</span>
                  </button>

                  <Link
                    href="/contact-us"
                    className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/25 backdrop-blur-sm transition-all active:scale-[0.98]"
                  >
                    <span>Speak with Lab Specialist</span>
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
