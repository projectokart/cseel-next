'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Cpu, 
  Printer, 
  Radio, 
  Wrench, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  BookOpen, 
  Award, 
  Users, 
  School, 
  Download, 
  Calculator, 
  Layers, 
  HelpCircle, 
  FileText, 
  ChevronRight,
  ExternalLink,
  Zap,
  Globe,
  MonitorPlay,
  Settings,
  ChevronDown
} from 'lucide-react';
import { 
  STEAM_LAB_PACKAGES, 
  STEAM_EXPERIMENTS_DIRECTORY, 
  STEAM_EQUIPMENT_MATRIX, 
  STEAM_LAB_FAQS,
  SteamPackage 
} from '@/lib/steamLabData';

export default function Client() {
  // State for active package tab
  const [selectedPackageId, setSelectedPackageId] = useState<string>(STEAM_LAB_PACKAGES[0].id);
  
  // State for experiment category filter
  const [selectedExpCategory, setSelectedExpCategory] = useState<string>('All');
  
  // State for interactive lab configurator
  const [schoolType, setSchoolType] = useState<string>('cbse');
  const [studentCount, setStudentCount] = useState<number>(600);
  const [targetGrades, setTargetGrades] = useState<string>('6-12');
  const [labSpace, setLabSpace] = useState<number>(1000);
  const [include3DPrinting, setInclude3DPrinting] = useState<boolean>(true);
  const [includeRoboticsAI, setIncludeRoboticsAI] = useState<boolean>(true);
  const [includeTeacherCert, setIncludeTeacherCert] = useState<boolean>(true);
  const [includeAMCMentorship, setIncludeAMCMentorship] = useState<boolean>(true);

  // State for FAQ accordion
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // State for Consultation Form
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [formState, setFormState] = useState({
    institutionName: '',
    contactPerson: '',
    designation: 'Principal / Management',
    phone: '',
    email: '',
    cityState: '',
    preferredPackage: 'Atal Tinkering Lab (ATL) Turnkey Setup',
    additionalRequirements: ''
  });

  const selectedPackage = STEAM_LAB_PACKAGES.find(p => p.id === selectedPackageId) || STEAM_LAB_PACKAGES[0];

  // Dynamic calculations for Configurator
  const calculatedBatches = Math.ceil(studentCount / 35);
  const recommendedWorkbenches = Math.ceil(labSpace / 200);
  const calculatedKitsCount = Math.max(15, Math.ceil(studentCount / 30));
  
  // Base cost calculation
  let estimatedMinLakhs = 4.5;
  let estimatedMaxLakhs = 8.5;
  if (targetGrades === '6-12') {
    estimatedMinLakhs += 3.5;
    estimatedMaxLakhs += 6.0;
  }
  if (include3DPrinting) {
    estimatedMinLakhs += 1.2;
    estimatedMaxLakhs += 2.5;
  }
  if (includeRoboticsAI) {
    estimatedMinLakhs += 1.8;
    estimatedMaxLakhs += 3.2;
  }
  if (includeTeacherCert) {
    estimatedMinLakhs += 0.5;
    estimatedMaxLakhs += 1.0;
  }
  if (includeAMCMentorship) {
    estimatedMinLakhs += 0.8;
    estimatedMaxLakhs += 1.5;
  }

  const filteredExperiments = selectedExpCategory === 'All' 
    ? STEAM_EXPERIMENTS_DIRECTORY 
    : STEAM_EXPERIMENTS_DIRECTORY.filter(exp => exp.category === selectedExpCategory);

  const experimentCategories = ['All', 'Robotics & AI', 'IoT & Smart Systems', 'Clean Tech & Green Energy', '3D Design & Making', 'Computational Bio & Chem', 'Early STEAM Mechanics'];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Schema.org JSON-LD for rich Google snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Product",
                "name": "CSEEL Turnkey Atal Tinkering Lab & STEAM Lab Setup",
                "description": "Comprehensive NITI Aayog ATL and NEP 2020 compliant STEAM lab setup for Indian schools including Package 1 to 4 equipment, 3D printers, AI robotics kits, and certified teacher training.",
                "brand": {
                  "@type": "Brand",
                  "name": "CSEEL"
                },
                "offers": {
                  "@type": "AggregateOffer",
                  "priceCurrency": "INR",
                  "lowPrice": "350000",
                  "highPrice": "2000000",
                  "offerCount": "6"
                }
              },
              {
                "@type": "FAQPage",
                "mainEntity": STEAM_LAB_FAQS.map(faq => ({
                  "@type": "Question",
                  "name": faq.question,
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.answer
                  }
                }))
              }
            ]
          })
        }}
      />

      {/* ─── Hero Section: CSEEL Authentic Royal Blue Theme ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#001f3f] via-[#003c6e] to-[#005689] text-white pt-12 sm:pt-16 pb-16 sm:pb-24 px-4">
        {/* Subtle background overlay with blueprint grid pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 bottom-0 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Top Trust & Accreditation Pills */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white/10 text-cyan-200 border border-white/20 backdrop-blur-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>GeM Registered Turnkey Vendor</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white/10 text-emerald-300 border border-white/20 backdrop-blur-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>NITI Aayog ATL Packages P1–P4 Compliant</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white/10 text-amber-300 border border-white/20 backdrop-blur-xs">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>CBSE Skill Education Code 417, 418 &amp; 419</span>
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7">
              <div className="inline-block text-xs uppercase tracking-widest text-cyan-300 font-extrabold mb-3">
                India's Trusted School STEM &amp; Innovation Infrastructure Partner
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-black tracking-tight leading-[1.15] mb-6 text-white">
                Atal Tinkering Labs (ATL 2.0) &amp; <span className="text-cyan-300">Composite Skill Lab</span> Setup for Schools
              </h1>
              <p className="text-base sm:text-lg text-blue-100/90 leading-relaxed mb-8 max-w-2xl">
                Transform your school campus into an accredited hub of innovation. Complete turnkey execution with NITI Aayog Package P1 to P4 hardware, CBSE Composite Skill Lab affiliation compliance, high-speed 3D printers, AI robotics kits, curriculum blueprints, and certified 5-day teacher training.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 sm:gap-4 items-center">
                <a 
                  href="#book-consultation" 
                  className="px-7 py-3.5 rounded-full bg-white hover:bg-blue-50 text-[#003c6e] font-extrabold text-sm transition-all shadow-xl hover:shadow-2xl flex items-center gap-2 active:scale-98"
                >
                  <span>Request Turnkey Proposal &amp; DPR</span>
                  <ArrowRight className="w-4 h-4 text-[#005689]" />
                </a>
                <a 
                  href="#lab-configurator" 
                  className="px-6 py-3.5 rounded-full bg-[#005689]/60 hover:bg-[#005689] text-white font-bold text-sm border-2 border-white/40 hover:border-white transition-all flex items-center gap-2 active:scale-98"
                >
                  <Calculator className="w-4 h-4 text-cyan-300" />
                  <span>Calculate Setup Cost</span>
                </a>
                <a 
                  href="#packages-section" 
                  className="px-4 py-3 rounded-full text-blue-200 hover:text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-4 h-4 text-cyan-300" />
                  <span>Equipment Checklist (PDF)</span>
                </a>
              </div>

              {/* Trust Metrics Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 pt-8 border-t border-white/15">
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-white">150+</p>
                  <p className="text-xs text-blue-200/80 font-medium mt-0.5">Schools Transformed</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-cyan-300">₹20 Lakh</p>
                  <p className="text-xs text-blue-200/80 font-medium mt-0.5">ATL Grant Expertise</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-emerald-300">100%</p>
                  <p className="text-xs text-blue-200/80 font-medium mt-0.5">CBSE &amp; GeM Compliant</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-amber-300">5-Year</p>
                  <p className="text-xs text-blue-200/80 font-medium mt-0.5">On-Site Support &amp; FDP</p>
                </div>
              </div>
            </div>

            {/* Right: Institutional Lab Consultation & DPR Card */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl bg-white text-slate-900 p-6 sm:p-7 shadow-2xl border border-slate-100 relative overflow-hidden">
                {/* Card Top Pill */}
                <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-[#005689] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      🏛️
                    </span>
                    <div>
                      <span className="text-xs font-bold text-[#003c6e] block">Institutional Inquiry</span>
                      <span className="text-[10px] text-slate-500 block">K-12 Principals &amp; Trustees</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Fast-Track 24h DPR
                  </span>
                </div>

                <h3 className="text-lg font-extrabold text-slate-900 mb-1">
                  Get Custom Lab Blueprint &amp; BOQ
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Official vendor estimate for CBSE affiliation, PM SHRI &amp; NITI Aayog grant approvals.
                </p>

                {formSubmitted ? (
                  <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                    <h4 className="font-bold text-slate-900 text-sm">Inquiry Received Successfully!</h4>
                    <p className="text-xs text-slate-600">
                      Our Senior Lab Architect will contact you with a customized 3D CAD Blueprint and Equipment BOQ within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">School / Institution Name *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Delhi Public School / St. Xavier's" 
                        value={formState.institutionName}
                        onChange={(e) => setFormState({...formState, institutionName: e.target.value})}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#005689] bg-slate-50/50"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Contact Person *</label>
                        <input 
                          type="text" 
                          required
                          placeholder="Principal / Coordinator" 
                          value={formState.contactPerson}
                          onChange={(e) => setFormState({...formState, contactPerson: e.target.value})}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#005689] bg-slate-50/50"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Phone / WhatsApp *</label>
                        <input 
                          type="tel" 
                          required
                          placeholder="+91 98765 XXXXX" 
                          value={formState.phone}
                          onChange={(e) => setFormState({...formState, phone: e.target.value})}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#005689] bg-slate-50/50"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">City &amp; State *</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. Jaipur, Rajasthan" 
                          value={formState.cityState}
                          onChange={(e) => setFormState({...formState, cityState: e.target.value})}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#005689] bg-slate-50/50"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Preferred Lab Setup</label>
                        <select
                          value={formState.preferredPackage}
                          onChange={(e) => setFormState({...formState, preferredPackage: e.target.value})}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#005689] bg-slate-50/50"
                        >
                          <option>Atal Tinkering Lab (ATL 2.0)</option>
                          <option>CBSE Composite Skill Lab</option>
                          <option>AI, IoT &amp; Robotics Super-Lab</option>
                          <option>PM SHRI Modernization Suite</option>
                          <option>Pre-Tinkering Lab (Primary)</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 mt-2 rounded-xl bg-[#005689] hover:bg-[#003c6e] text-white font-extrabold text-xs tracking-wide uppercase transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
                    >
                      <span>Get Instant DPR &amp; Price Estimate</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                )}

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span>🔒 100% Confidential</span>
                  <span>⚡ On-site Visit Available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4 Core Pillars of CSEEL Turnkey School Labs ─── */}
      <section className="py-14 sm:py-16 px-4 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-[#EDF5FA] text-[#005689] border border-[#005689]/20 uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#005689]" /> Comprehensive School Infrastructure
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#003c6e] tracking-tight">
              4 Specialized Lab Frameworks for Indian Schools
            </h2>
            <p className="text-slate-600 mt-3 text-sm sm:text-base leading-relaxed">
              Designed as per latest NEP 2020 experiential learning mandates and CBSE / NITI Aayog technical norms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: ATL 2.0 */}
            <div className="bg-[#EDF5FA]/60 rounded-3xl p-6 border border-[#005689]/20 hover:border-[#005689] hover:shadow-xl transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#005689] text-white flex items-center justify-center font-bold text-xl mb-4 shadow-md group-hover:scale-105 transition-transform">
                  🔬
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    NITI Aayog
                  </span>
                  <span className="text-[10px] font-bold text-slate-500">Grades 6–12</span>
                </div>
                <h3 className="text-lg font-bold text-[#003c6e] group-hover:text-[#005689] transition-colors mb-2">
                  Atal Tinkering Lab (ATL 2.0)
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Full compliance with NITI Aayog Package P1 (Electronics), P2 (3D Printing), P3 (Mechanical), and P4 (IoT &amp; Sensors). Complete ₹20 Lakh grant utilization blueprint.
                </p>
              </div>
              <a
                href="#packages-section"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#005689] hover:underline pt-3 border-t border-[#005689]/10"
              >
                <span>View Package Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Card 2: CBSE Composite Skill Lab */}
            <div className="bg-[#EDF5FA]/60 rounded-3xl p-6 border border-[#005689]/20 hover:border-[#005689] hover:shadow-xl transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#003c6e] text-white flex items-center justify-center font-bold text-xl mb-4 shadow-md group-hover:scale-105 transition-transform">
                  🧪
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                    CBSE Mandatory
                  </span>
                  <span className="text-[10px] font-bold text-slate-500">Affiliation Norm</span>
                </div>
                <h3 className="text-lg font-bold text-[#003c6e] group-hover:text-[#005689] transition-colors mb-2">
                  CBSE Composite Skill Lab
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Multi-disciplinary vocational lab engineered to fulfill mandatory CBSE affiliation Bye-laws. Equipped for Design Thinking, Coding, and Hands-on Technical Skills.
                </p>
              </div>
              <a
                href="#book-consultation"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#005689] hover:underline pt-3 border-t border-[#005689]/10"
              >
                <span>Get Affiliation Checklist</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Card 3: AI, IoT & Robotics Super-Lab */}
            <div className="bg-[#EDF5FA]/60 rounded-3xl p-6 border border-[#005689]/20 hover:border-[#005689] hover:shadow-xl transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#005689] text-white flex items-center justify-center font-bold text-xl mb-4 shadow-md group-hover:scale-105 transition-transform">
                  🤖
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    Subject Code 417
                  </span>
                  <span className="text-[10px] font-bold text-slate-500">AI &amp; Robotics</span>
                </div>
                <h3 className="text-lg font-bold text-[#003c6e] group-hover:text-[#005689] transition-colors mb-2">
                  AI, IoT &amp; Robotics Super-Lab
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Future-ready testbeds with Autonomous Mobile Robots (AMR), 6-DOF Robotic Arms, OpenCV Vision AI cameras, Arduino &amp; Raspberry Pi kits for class 9 to 12.
                </p>
              </div>
              <a
                href="#lab-configurator"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#005689] hover:underline pt-3 border-t border-[#005689]/10"
              >
                <span>Explore AI Lab Kits</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Card 4: Pre-Tinkering Maker Space */}
            <div className="bg-[#EDF5FA]/60 rounded-3xl p-6 border border-[#005689]/20 hover:border-[#005689] hover:shadow-xl transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#086FA6] text-white flex items-center justify-center font-bold text-xl mb-4 shadow-md group-hover:scale-105 transition-transform">
                  🎨
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Early STEM
                  </span>
                  <span className="text-[10px] font-bold text-slate-500">Grades 1–5</span>
                </div>
                <h3 className="text-lg font-bold text-[#003c6e] group-hover:text-[#005689] transition-colors mb-2">
                  Pre-Tinkering Maker Space
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Child-safe, magnetic snap-circuit kits, mechanical gear building sets, and interactive blocks that build scientific curiosity from primary school years.
                </p>
              </div>
              <a
                href="#book-consultation"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#005689] hover:underline pt-3 border-t border-[#005689]/10"
              >
                <span>Request Primary Demo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Lab Configurator & Cost Estimator */}
      <section id="lab-configurator" className="py-20 px-4 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-[#EDF5FA] text-[#003c6e] mb-3">
              <Calculator className="w-3.5 h-3.5" /> Instant School Cost & Capacity Sizing
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Interactive STEAM Lab Configurator
            </h2>
            <p className="text-slate-600 mt-3 text-base sm:text-lg">
              Calculate exact hardware requirements, student batch capacities, workbench allocations, and estimated budget customized to your school’s infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Input Controls */}
            <div className="lg:col-span-7 bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-6">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#005689]" /> Customize School Parameters
              </h3>

              {/* School Board */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">School Affiliation / Board</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'cbse', label: 'CBSE Affiliated' },
                    { id: 'icse', label: 'ICSE / ISC' },
                    { id: 'pmshri', label: 'PM SHRI / Govt' },
                    { id: 'international', label: 'IB / Cambridge' }
                  ].map(b => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setSchoolType(b.id)}
                      className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                        schoolType === b.id 
                          ? 'bg-[#005689] text-white border-[#005689] shadow-sm' 
                          : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Grades */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Target Grade Band</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: '1-5', label: 'Grades 1-5 (Primary)' },
                    { id: '6-10', label: 'Grades 6-10 (Secondary)' },
                    { id: '6-12', label: 'Grades 6-12 (All-Through)' }
                  ].map(g => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setTargetGrades(g.id)}
                      className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                        targetGrades === g.id 
                          ? 'bg-[#005689] text-white border-[#005689] shadow-sm' 
                          : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Student Strength Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-slate-700">Total Enrolled Science / Tech Students</label>
                  <span className="text-sm font-bold text-[#005689] bg-[#EDF5FA] px-2.5 py-0.5 rounded-md">
                    {studentCount} Students
                  </span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={2500}
                  step={50}
                  value={studentCount}
                  onChange={(e) => setStudentCount(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#005689]"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>100 Students</span>
                  <span>1,000 Students</span>
                  <span>2,500+ Students</span>
                </div>
              </div>

              {/* Lab Floor Space Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-slate-700">Dedicated Lab Floor Space (Sq. Ft.)</label>
                  <span className="text-sm font-bold text-[#005689] bg-[#EDF5FA] px-2.5 py-0.5 rounded-md">
                    {labSpace} Sq. Ft.
                  </span>
                </div>
                <input
                  type="range"
                  min={400}
                  max={2500}
                  step={50}
                  value={labSpace}
                  onChange={(e) => setLabSpace(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#005689]"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>400 sq. ft. (Compact)</span>
                  <span>1,000 sq. ft. (Standard ATL)</span>
                  <span>2,500 sq. ft. (Mega Hub)</span>
                </div>
              </div>

              {/* Add-on Toggles */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Included Modules & Add-Ons</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:border-slate-300">
                    <input
                      type="checkbox"
                      checked={include3DPrinting}
                      onChange={(e) => setInclude3DPrinting(e.target.checked)}
                      className="w-4 h-4 text-[#005689] rounded border-slate-300 focus:ring-[#005689]"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-800">3D Rapid Prototyping</p>
                      <p className="text-[11px] text-slate-500">CoreXY 3D Printer + PLA Spools</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:border-slate-300">
                    <input
                      type="checkbox"
                      checked={includeRoboticsAI}
                      onChange={(e) => setIncludeRoboticsAI(e.target.checked)}
                      className="w-4 h-4 text-[#005689] rounded border-slate-300 focus:ring-[#005689]"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-800">AI Vision & Robotic Arms</p>
                      <p className="text-[11px] text-slate-500">Edge AI + 6-DOF Manipulator</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:border-slate-300">
                    <input
                      type="checkbox"
                      checked={includeTeacherCert}
                      onChange={(e) => setIncludeTeacherCert(e.target.checked)}
                      className="w-4 h-4 text-[#005689] rounded border-slate-300 focus:ring-[#005689]"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-800">Faculty FDP Certification</p>
                      <p className="text-[11px] text-slate-500">5-Day In-Person Training</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:border-slate-300">
                    <input
                      type="checkbox"
                      checked={includeAMCMentorship}
                      onChange={(e) => setIncludeAMCMentorship(e.target.checked)}
                      className="w-4 h-4 text-[#005689] rounded border-slate-300 focus:ring-[#005689]"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-800">Annual Mentorship & AMC</p>
                      <p className="text-[11px] text-slate-500">Quarterly Visits + Spare Pool</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Live Calculation Output Card */}
            <div className="lg:col-span-5 bg-gradient-to-b from-[#002244] to-[#003c6e] text-white p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-800 sticky top-24">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                <div>
                  <p className="text-xs uppercase tracking-wider text-cyan-300 font-bold">Estimated Configuration</p>
                  <h4 className="text-xl font-bold text-white">Lab Blueprint Summary</h4>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Ready to Deploy
                </span>
              </div>

              {/* Sizing Metrics */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                  <p className="text-xs text-slate-400">Student Kits Required</p>
                  <p className="text-lg font-bold text-white">{calculatedKitsCount} Microcontroller Sets</p>
                </div>
                <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                  <p className="text-xs text-slate-400">Workbenches Suggested</p>
                  <p className="text-lg font-bold text-white">{recommendedWorkbenches} Octagonal Pods</p>
                </div>
                <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                  <p className="text-xs text-slate-400">Parallel Lab Batches</p>
                  <p className="text-lg font-bold text-white">{calculatedBatches} Batches / Week</p>
                </div>
                <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                  <p className="text-xs text-slate-400">Curriculum Coverage</p>
                  <p className="text-lg font-bold text-white">120+ Lesson Plans</p>
                </div>
              </div>

              {/* Estimated Budget Range */}
              <div className="bg-[#001f3f]/90 p-5 rounded-xl border border-[#005689]/30 mb-6">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-xs text-blue-200 font-semibold uppercase">Estimated Turnkey Investment</span>
                  <span className="text-[11px] text-slate-400">Govt & Private models</span>
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
                  ₹{estimatedMinLakhs.toFixed(2)} – ₹{estimatedMaxLakhs.toFixed(2)} Lakhs
                </p>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Includes hardware delivery, anti-static lab furniture, safety equipment, teacher training & 1-year warranty support.
                </p>
              </div>

              <div className="space-y-3">
                <a
                  href="#book-consultation"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-center block transition-all shadow-lg"
                >
                  Download Customized School PDF Proposal
                </a>
                <p className="text-center text-[11px] text-slate-400">
                  Institutional discounts available for multi-branch school trusts and government schools.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive Packages Explorer */}
      <section id="packages-section" className="py-20 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 mb-3">
              <Layers className="w-3.5 h-3.5" /> Turnkey Institutional Offerings
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              6 Specialized STEAM Lab Architectures
            </h2>
            <p className="text-slate-600 mt-3 text-base sm:text-lg">
              Whether you need official NITI Aayog ATL compliance, cutting-edge AI & Robotics, or foundational Primary STEM, select a package below to inspect complete technical specifications.
            </p>
          </div>

          {/* Package Selector Tabs */}
          <div className="flex overflow-x-auto pb-4 mb-8 gap-2 no-scrollbar">
            {STEAM_LAB_PACKAGES.map((pkg) => (
              <button
                key={pkg.id}
                type="button"
                onClick={() => setSelectedPackageId(pkg.id)}
                className={`px-4 py-3 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                  selectedPackageId === pkg.id
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                }`}
              >
                <span>{pkg.name}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                  selectedPackageId === pkg.id ? 'bg-[#EDF5FA]0 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {pkg.badge}
                </span>
              </button>
            ))}
          </div>

          {/* Active Package Detailed Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#001f3f] via-[#003c6e] to-[#001f3f] text-white p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#EDF5FA]0/20 text-blue-200 border border-[#005689]/30 mb-2">
                    {selectedPackage.badge}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                    {selectedPackage.name}
                  </h3>
                  <p className="text-sm sm:text-base text-blue-100 mt-1">
                    {selectedPackage.tagline}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-slate-400 font-medium">Investment Range</p>
                  <p className="text-xl sm:text-2xl font-bold text-emerald-400">
                    {selectedPackage.estimatedPriceRange}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-8">
              <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
                {selectedPackage.description}
              </p>

              {/* Quick Specs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <p className="text-xs text-slate-500 font-semibold">Target Student Levels</p>
                  <p className="text-sm font-bold text-slate-800">{selectedPackage.gradeLevels}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold">Batch Capacity</p>
                  <p className="text-sm font-bold text-slate-800">{selectedPackage.studentCapacity}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold">Recommended Floor Area</p>
                  <p className="text-sm font-bold text-slate-800">{selectedPackage.recommendedSpace}</p>
                </div>
              </div>

              {/* Equipment Breakdown by Category */}
              <div>
                <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-[#005689]" /> Equipment & Hardware Included
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedPackage.equipmentIncluded.map((cat, idx) => (
                    <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <h5 className="font-bold text-xs uppercase tracking-wider text-[#005689] mb-2">{cat.category}</h5>
                      <ul className="space-y-1.5">
                        {cat.items.map((item, iIdx) => (
                          <li key={iIdx} className="text-xs sm:text-sm text-slate-700 flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Curriculum & Mentorship */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-600" /> Curriculum & Skill Modules
                  </h4>
                  <ul className="space-y-2">
                    {selectedPackage.curriculumModules.map((mod, mIdx) => (
                      <li key={mIdx} className="text-xs sm:text-sm text-slate-700 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                        <span>{mod}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-600" /> Mentorship & Teacher Enablement
                  </h4>
                  <ul className="space-y-2">
                    {selectedPackage.mentorshipAndSupport.map((sup, sIdx) => (
                      <li key={sIdx} className="text-xs sm:text-sm text-slate-700 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        <span>{sup}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-slate-200 flex flex-wrap gap-4 items-center justify-between">
                <div className="text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">Best For: </span> {selectedPackage.bestFor}
                </div>
                <div className="flex gap-3">
                  <a
                    href="#book-consultation"
                    className="px-5 py-2.5 rounded-xl bg-[#005689] text-white font-bold text-xs sm:text-sm hover:bg-[#003c6e] transition-all flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" /> Request Official Proposal
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 100+ Hands-On Experiments & DIY Project Explorer */}
      <section className="py-20 px-4 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 mb-3">
              <Zap className="w-3.5 h-3.5" /> Project-Based Learning Directory
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              100+ Ready-To-Build STEAM Projects & Working Models
            </h2>
            <p className="text-slate-600 mt-3 text-base sm:text-lg">
              From Arduino line followers to AutoDock Vina molecular simulations—explore real hands-on projects mapped to CBSE and state science exhibition standards.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex overflow-x-auto pb-4 mb-8 gap-2 no-scrollbar">
            {experimentCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedExpCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedExpCategory === cat
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Experiments Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExperiments.map((exp) => (
              <div 
                key={exp.id}
                className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-[#005689]/40 hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#EDF5FA] text-[#003c6e] border border-[#005689]/20">
                      {exp.category}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      {exp.duration} • {exp.grade}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                    {exp.title}
                  </h3>
                  <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                    {exp.description}
                  </p>

                  {/* Hardware Pills */}
                  <div className="mb-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Hardware Components</p>
                    <div className="flex flex-wrap gap-1.5">
                      {exp.hardwareRequired.map((hw, hIdx) => (
                        <span key={hIdx} className="text-[10px] bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700">
                          {hw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <p className="text-[11px] text-emerald-700 font-medium">
                    <span className="font-bold">Learning Outcome: </span>{exp.learningOutcome}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/hands-on-experiments"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all"
            >
              <span>Explore All 250+ Hands-on Experiments & Lab Manuals</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Equipment & Component Inventory Matrix */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-[#EDF5FA] text-[#003c6e] mb-3">
              <Cpu className="w-3.5 h-3.5" /> Certified Hardware Inventory
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Industrial-Grade, Child-Safe STEAM Hardware
            </h2>
            <p className="text-slate-600 mt-3 text-base sm:text-lg">
              All CSEEL lab components adhere strictly to BIS safety standards, CE ratings, and NITI Aayog ATL technical specifications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {STEAM_EQUIPMENT_MATRIX.map((cat, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-[#EDF5FA] text-[#005689]">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{cat.category}</h3>
                    <p className="text-xs text-slate-500">{cat.description}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {cat.items.map((item, iIdx) => (
                    <div key={iIdx} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <h4 className="font-bold text-sm text-slate-900">{item.name}</h4>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          item.safetyLevel === 'Safe for All Grades'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {item.safetyLevel}
                        </span>
                      </div>
                      <p className="text-xs font-mono text-[#003c6e] mb-1.5">{item.spec}</p>
                      <p className="text-xs text-slate-600"><span className="font-semibold text-slate-700">Application: </span>{item.applications}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Teacher Training & Faculty Development (FDP) */}
      <section className="py-20 px-4 bg-gradient-to-br from-[#002244] via-[#003c6e] to-[#005689] text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-4">
                <Award className="w-3.5 h-3.5" /> 5-Day Educator Enablement
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Empowering Your Existing Teachers into <span className="text-emerald-400">Certified STEM Mentors</span>
              </h2>
              <p className="text-slate-300 mt-4 text-base sm:text-lg leading-relaxed">
                A STEAM lab is only as good as the educators operating it. CSEEL provides an intensive Faculty Development Program (FDP) that transforms science, mathematics, and computer science teachers into confident tinkering coaches.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
                  <h3 className="font-bold text-sm text-white mb-1">Day 1-2: Microcontrollers & Circuitry</h3>
                  <p className="text-xs text-slate-400">Arduino, breadboarding, sensor calibration, and block-to-Python coding.</p>
                </div>
                <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
                  <h3 className="font-bold text-sm text-white mb-1">Day 3: 3D CAD & Additive Prototyping</h3>
                  <p className="text-xs text-slate-400">Tinkercad, 3D slicing software, CoreXY printer maintenance & zero-jam operations.</p>
                </div>
                <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
                  <h3 className="font-bold text-sm text-white mb-1">Day 4: AI Vision, IoT & Drones</h3>
                  <p className="text-xs text-slate-400">Machine learning vision models, cloud telemetry dashboards, and quadcopter physics.</p>
                </div>
                <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
                  <h3 className="font-bold text-sm text-white mb-1">Day 5: Pedagogy & Tinkerfest Prep</h3>
                  <p className="text-xs text-slate-400">NEP 2020 formative rubrics, hackathon hosting, and student patent filing mentorship.</p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/teacher-training"
                  className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all"
                >
                  View Full Educator Certification Syllabus
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-800/80 p-6 sm:p-8 rounded-2xl border border-slate-700 text-slate-200">
              <h3 className="text-xl font-bold text-white mb-4">Educator Deliverables Included</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Printed Teacher Manuals with complete step-by-step schematics & lesson plans.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Individual Teacher Certification Badges recognized under NEP 2020 CPD hours.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Access to dedicated WhatsApp Mentor Hotline for instant classroom debugging.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Full LMS access to assign student projects and track formative rubric progress.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SEO FAQs Accordion */}
      <section className="py-20 px-4 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-[#EDF5FA] text-[#003c6e] mb-3">
              <HelpCircle className="w-3.5 h-3.5" /> Institutional Questions Answered
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions on STEAM & ATL Setup
            </h2>
          </div>

          <div className="space-y-4">
            {STEAM_LAB_FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div 
                  key={idx}
                  className="rounded-xl border border-slate-200 bg-slate-50/50 overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full text-left p-5 font-bold text-slate-900 flex justify-between items-center gap-4 hover:bg-slate-100/60 transition-colors"
                  >
                    <span className="text-sm sm:text-base">{faq.question}</span>
                    <ChevronDown className={`w-5 h-5 text-slate-500 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 pt-3 bg-white">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Consultation Request & Institutional Quote Form */}
      <section id="book-consultation" className="py-20 px-4 bg-slate-100">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl">
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 mb-2">
              <School className="w-3.5 h-3.5" /> Priority Institutional Desk
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Request On-Campus STEAM Lab Consultation & Quote
            </h2>
            <p className="text-slate-600 mt-2 text-sm sm:text-base">
              Our regional STEM Lab engineers will prepare a customized floor layout, equipment BOM, and cost proposal within 24 hours.
            </p>
          </div>

          {formSubmitted ? (
            <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-emerald-900 mb-2">Thank You for Reaching Out!</h3>
              <p className="text-sm text-emerald-800 leading-relaxed max-w-md mx-auto">
                Our Senior Lab Consultant has received your request for <strong>{formState.institutionName || 'your institution'}</strong>. We will call you within 24 hours with your customized lab blueprint and proposal PDF.
              </p>
              <button
                type="button"
                onClick={() => setFormSubmitted(false)}
                className="mt-6 px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">School / Institution Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Delhi Public School / St. Xavier's"
                    value={formState.institutionName}
                    onChange={(e) => setFormState({ ...formState, institutionName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#005689] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Contact Person Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Dr. Rajesh Kumar"
                    value={formState.contactPerson}
                    onChange={(e) => setFormState({ ...formState, contactPerson: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#005689] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Designation</label>
                  <select
                    value={formState.designation}
                    onChange={(e) => setFormState({ ...formState, designation: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#005689] focus:outline-none bg-white"
                  >
                    <option>Principal / Director</option>
                    <option>Trustee / Management</option>
                    <option>ATL In-charge / STEM Coordinator</option>
                    <option>Science HOD / PGT Teacher</option>
                    <option>Procurement Officer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Mobile / WhatsApp No. *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formState.phone}
                    onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#005689] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Official Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="principal@school.edu.in"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#005689] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">City, State *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Jaipur, Rajasthan"
                    value={formState.cityState}
                    onChange={(e) => setFormState({ ...formState, cityState: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#005689] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Preferred Lab Package</label>
                  <select
                    value={formState.preferredPackage}
                    onChange={(e) => setFormState({ ...formState, preferredPackage: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#005689] focus:outline-none bg-white"
                  >
                    {STEAM_LAB_PACKAGES.map(pkg => (
                      <option key={pkg.id} value={pkg.name}>{pkg.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Specific Requirements / Estimated Space</label>
                <textarea
                  rows={3}
                  placeholder="Tell us about your student strength, target installation date, or specific requirements..."
                  value={formState.additionalRequirements}
                  onChange={(e) => setFormState({ ...formState, additionalRequirements: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#005689] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#003c6e] to-[#005689] hover:from-[#002244] hover:to-[#003c6e] text-white font-bold text-base transition-all shadow-lg shadow-[#005689]/25"
              >
                Submit Request for Official Lab Proposal & BOM
              </button>

              <p className="text-center text-xs text-slate-400">
                🔒 Your contact details will only be used by CSEEL lab engineers for institutional proposal coordination.
              </p>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
