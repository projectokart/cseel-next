'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PageTransition from '@/components/shared/PageTransition';
import OtherLabSolutions from '@/components/composite/OtherLabSolutions';
import SidebarOtherLabsWidget from '@/components/composite/SidebarOtherLabsWidget';
import { 
  ChevronRight, 
  Clock, 
  Calendar, 
  ArrowRight, 
  Download, 
  ShieldCheck, 
  CheckCircle2, 
  Share2, 
  Link2, 
  Linkedin, 
  Search, 
  Building2, 
  Calculator, 
  Layers, 
  Maximize2,
  Tag, 
  Check, 
  Cpu, 
  Sparkles, 
  GraduationCap, 
  AlertCircle
} from 'lucide-react';

export default function CompositeSkillLabClient() {
  const [copied, setCopied] = useState(false);
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formState, setFormState] = useState({
    schoolName: '',
    contactPerson: '',
    phone: '',
    email: '',
    cityState: '',
    requirementType: 'Composite Skill Lab Setup (Option A: 600 Sq Ft)'
  });

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareLinkedIn = () => {
    if (typeof window !== 'undefined') {
      window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
        '_blank',
        'noopener,noreferrer'
      );
    }
  };

  const handleShareWhatsApp = () => {
    if (typeof window !== 'undefined') {
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent('CBSE Composite Skill Lab (Circular Skill-75/2024 & 13/2026) Guide on CSEEL: ');
      window.open(`https://api.whatsapp.com/send?text=${text}${url}`, '_blank');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <PageTransition>
      <div className="bg-[#F8FAFC] min-h-screen text-slate-800">
        
        {/* ── Breadcrumb Bar ── */}
        <div className="bg-white border-b border-slate-200 py-3.5 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
            <nav className="flex flex-wrap items-center gap-2 text-slate-500" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-[#005689] transition-colors">Home</Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <Link href="/composite-lab" className="hover:text-[#005689] transition-colors">School Labs</Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[#005689] font-semibold">CBSE Composite Skill Lab</span>
            </nav>

            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
              <ShieldCheck className="w-3 h-3 text-purple-600" /> Circular Skill-75/2024 &amp; 13/2026 Mandate
            </span>
          </div>
        </div>

        {/* ── Main 2-Column Layout ── */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">

            {/* ═════════ LEFT COLUMN: MAIN ARTICLE (8 Cols) ═════════ */}
            <main className="lg:col-span-8 bg-white p-4 sm:p-8 md:p-10 rounded-3xl border border-slate-200 shadow-xs space-y-6">

              {/* Category Badge & Meta Information */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span className="px-3 py-1 rounded-full font-black uppercase text-[10px] bg-purple-50 text-purple-700 border border-purple-200 tracking-wider">
                  CBSE Skill Education
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-[#005689]" /> October 2026
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5 text-[#005689]" /> 7 min read
                </span>
                <span>•</span>
                <span className="font-semibold text-slate-700">By Devendra Singh</span>
              </div>

              {/* Main H1 Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#003c6e] leading-tight tracking-tight">
                CBSE Composite Skill Lab (Classes VI to XII): Circular Guidelines, Setup Norms &amp; Key Differences with Composite Science Lab
              </h1>

              {/* Author Info Bar */}
              <div className="flex items-center justify-between flex-wrap gap-4 py-3.5 border-y border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-700 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    DS
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs sm:text-sm">Devendra Singh</div>
                    <div className="text-[11px] text-slate-500">CBSE Lab Architect &amp; Vocational Infrastructure Expert</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleShareLinkedIn}
                    className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-[#005689] transition"
                    title="Share on LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleShareWhatsApp}
                    className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-emerald-600 transition"
                    title="Share on WhatsApp"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleCopyLink}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-600 hover:text-[#005689] transition flex items-center gap-1"
                    title="Copy Link"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Featured Cover Image */}
              <div className="relative rounded-2xl overflow-hidden shadow-md aspect-video bg-slate-900 border border-slate-200 group">
                <img
                  src="/images/composite-lab-skill-integration.jpg"
                  alt="CBSE Composite Skill Lab setup showing robotics, AI workstations and prototyping stations"
                  className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
                />
                <div className="absolute top-3 left-3 px-3 py-1.5 rounded-xl bg-purple-950/80 backdrop-blur-md text-white border border-purple-400/30 text-[11px] font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                  <span>CBSE Circular Skill-75/2024 &amp; 13/2026 Model</span>
                </div>
              </div>

              {/* Tagline / Callout */}
              <div className="p-4 sm:p-5 rounded-2xl bg-purple-50/70 border-l-4 border-purple-600 text-sm text-slate-700 leading-relaxed font-medium">
                Under official CBSE directives, establishing a <strong>Composite Skill Lab</strong> has been made <strong>mandatory</strong> for all affiliated schools across <strong>Classes VI to XII (Middle to Senior Secondary)</strong>. Explore Option A (single 600 sq. ft.) vs Option B (two 400 sq. ft. labs), key compliance requirements, and fundamental differences from Composite Science Labs (Circular 11/2022).
              </div>

              {/* Main Content Body */}
              <div className="space-y-8 text-slate-700 text-sm leading-relaxed">

                {/* ── TOP QUICK-DOWNLOAD BAR: OFFICIAL CBSE CIRCULARS (Compact & Blue Links) ── */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-[#F0F7FB] border border-[#B9DCF2] shadow-xs space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-[#D4E8F5] pb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#005689] animate-pulse" />
                      <span className="text-[11px] font-black uppercase tracking-wider text-[#005689]">
                        Official CBSE Gazetted Directives &amp; Verified Links
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-[#005689] bg-white px-2.5 py-0.5 rounded-full border border-[#B9DCF2] self-start sm:self-auto">
                      Direct CBSE Circular URLs
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {/* Link 1: Circular Skill-75/2024 */}
                    <a
                      href="https://www.cbse.gov.in/cbsenew/documents/75_Circular_2024_Composite_Skill_Labs_27082024.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-white hover:bg-blue-50/60 border border-slate-200 hover:border-[#005689] shadow-2xs hover:shadow-xs transition flex items-center justify-between group cursor-pointer"
                    >
                      <div className="min-w-0 pr-2 space-y-0.5">
                        <div className="font-bold text-[#005689] group-hover:text-[#003c6e] group-hover:underline flex items-center gap-1.5 text-xs truncate">
                          <Download className="w-3.5 h-3.5 text-[#005689] shrink-0" />
                          <span className="truncate">Circular No. Skill-75/2024 (PDF)</span>
                        </div>
                        <div className="text-[10px] text-slate-500 truncate flex items-center gap-1">
                          <span className="text-emerald-700 font-semibold">PDF File •</span>
                          <span className="text-[#0284c7] font-medium">Composite Skill Labs Setup Guidelines</span>
                        </div>
                      </div>

                      <span className="shrink-0 text-[10px] font-bold text-[#005689] bg-[#EDF5FA] group-hover:bg-[#005689] group-hover:text-white px-2.5 py-1 rounded-lg border border-[#B9DCF2] transition flex items-center gap-1">
                        <span>Download</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </a>

                    {/* Link 2: Circular 13/2026 */}
                    <a
                      href="https://cbseacademic.nic.in/web_material/Circulars/2026/13_Circular_2026.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-white hover:bg-blue-50/60 border border-slate-200 hover:border-[#005689] shadow-2xs hover:shadow-xs transition flex items-center justify-between group cursor-pointer"
                    >
                      <div className="min-w-0 pr-2 space-y-0.5">
                        <div className="font-bold text-[#005689] group-hover:text-[#003c6e] group-hover:underline flex items-center gap-1.5 text-xs truncate">
                          <Download className="w-3.5 h-3.5 text-[#005689] shrink-0" />
                          <span className="truncate">Circular No. 13/2026 (PDF)</span>
                        </div>
                        <div className="text-[10px] text-slate-500 truncate flex items-center gap-1">
                          <span className="text-emerald-700 font-semibold">PDF File •</span>
                          <span className="text-[#0284c7] font-medium">Skill Lab Mandatory Reinforcement</span>
                        </div>
                      </div>

                      <span className="shrink-0 text-[10px] font-bold text-[#005689] bg-[#EDF5FA] group-hover:bg-[#005689] group-hover:text-white px-2.5 py-1 rounded-lg border border-[#B9DCF2] transition flex items-center gap-1">
                        <span>Download</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </a>

                    {/* Link 3: Circular 11/2022 */}
                    <a
                      href="https://saras.cbse.gov.in/saras/Circulars/Circular11_2022.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-white hover:bg-blue-50/60 border border-slate-200 hover:border-[#005689] shadow-2xs hover:shadow-xs transition flex items-center justify-between group cursor-pointer"
                    >
                      <div className="min-w-0 pr-2 space-y-0.5">
                        <div className="font-bold text-[#005689] group-hover:text-[#003c6e] group-hover:underline flex items-center gap-1.5 text-xs truncate">
                          <Download className="w-3.5 h-3.5 text-[#005689] shrink-0" />
                          <span className="truncate">Circular No. 11/2022 (PDF)</span>
                        </div>
                        <div className="text-[10px] text-slate-500 truncate flex items-center gap-1">
                          <span className="text-emerald-700 font-semibold">PDF File •</span>
                          <span className="text-[#0284c7] font-medium">Composite Science Lab &amp; Infra Norms</span>
                        </div>
                      </div>

                      <span className="shrink-0 text-[10px] font-bold text-[#005689] bg-[#EDF5FA] group-hover:bg-[#005689] group-hover:text-white px-2.5 py-1 rounded-lg border border-[#B9DCF2] transition flex items-center gap-1">
                        <span>Download</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </a>

                    {/* Link 4: CBSE Academic Portal */}
                    <a
                      href="https://cbseacademic.nic.in/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-white hover:bg-blue-50/60 border border-slate-200 hover:border-[#005689] shadow-2xs hover:shadow-xs transition flex items-center justify-between group cursor-pointer"
                    >
                      <div className="min-w-0 pr-2 space-y-0.5">
                        <div className="font-bold text-[#005689] group-hover:text-[#003c6e] group-hover:underline flex items-center gap-1.5 text-xs truncate">
                          <Download className="w-3.5 h-3.5 text-[#005689] shrink-0" />
                          <span className="truncate">CBSE Academic Circulars Portal</span>
                        </div>
                        <div className="text-[10px] text-slate-500 truncate flex items-center gap-1">
                          <span className="text-emerald-700 font-semibold">Official Portal •</span>
                          <span className="text-[#0284c7] font-medium">cbseacademic.nic.in verification</span>
                        </div>
                      </div>

                      <span className="shrink-0 text-[10px] font-bold text-[#005689] bg-[#EDF5FA] group-hover:bg-[#005689] group-hover:text-white px-2.5 py-1 rounded-lg border border-[#B9DCF2] transition flex items-center gap-1">
                        <span>Open Link</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </a>
                  </div>
                </div>

                {/* Section 1: What is Composite Skill Lab */}
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#003c6e] mb-3">
                    1. What is a CBSE Composite Skill Lab (Vocational Skills)?
                  </h2>
                  <p>
                    Under CBSE official <strong>Circular No. Skill-75/2024</strong> (dated August 27, 2024), reinforced by <strong>Circular No. 13/2026</strong>, establishing a <strong>Composite Skill Lab</strong> has been made <strong>mandatory</strong> for all affiliated schools for students across <strong>Classes VI to XII</strong>.
                  </p>
                  <p className="mt-3">
                    Operationalizing the vision of the National Education Policy (NEP 2020), CBSE mandates exposing at least 50% of secondary and higher secondary learners to vocational education. This specialized lab serves as an innovation crucible, offering cutting-edge infrastructure for 33+ notified skill modules, including Artificial Intelligence (AI), Coding, Robotics, Internet of Things (IoT), Data Science, and Design Thinking.
                  </p>

                  <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 mt-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-purple-700" />
                      <h4 className="font-bold text-purple-900 text-sm">Why is it Mandatory for Classes VI to XII?</h4>
                    </div>
                    <p className="text-xs text-purple-950 leading-relaxed">
                      Conventional computer labs are confined to basic software applications. The Composite Skill Lab bridges hardware-software integration, rapid physical prototyping, sensor programming, and 21st-century experiential competencies. CBSE has consequently made it compulsory across both middle school (Classes 6–8) and secondary/senior secondary tiers (Classes 9–12).
                    </p>
                  </div>
                </div>

                {/* Section 2: Setup Rules (Option A vs Option B) */}
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#003c6e] mb-3">
                    2. Two CBSE Infrastructure Setup Models (Option A vs. Option B)
                  </h2>
                  <p className="mb-4">
                    Recognizing diverse campus limitations and structural configurations across private and government schools, CBSE provides two explicit architectural models for setting up the Composite Skill Lab:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-white border-2 border-purple-200 shadow-2xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-md bg-purple-100 text-purple-800 font-bold text-xs uppercase tracking-wide">
                          Option A
                        </span>
                        <span className="text-xs font-semibold text-slate-500">Single Hall Model</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900">Single 600 Sq. Ft. Lab Hall</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        A single unified <strong>600 sq. ft.</strong> hall that serves all students from <strong>Classes 6 to 12</strong>. Batch rotation is managed through intelligent timetable scheduling across middle, secondary, and senior secondary grades.
                      </p>
                      <ul className="text-xs text-slate-600 space-y-1 pt-2 border-t border-slate-100">
                        <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> Minimum 600 sq. ft. carpet area</li>
                        <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> Combined utilization for Classes 6 to 12</li>
                        <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> Lower initial infrastructure and civil footprint</li>
                      </ul>
                    </div>

                    <div className="p-5 rounded-2xl bg-white border-2 border-purple-200 shadow-2xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-md bg-purple-100 text-purple-800 font-bold text-xs uppercase tracking-wide">
                          Option B
                        </span>
                        <span className="text-xs font-semibold text-slate-500">Dual Room Model</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900">Two Separate 400 Sq. Ft. Labs</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Two separate <strong>400 sq. ft.</strong> labs—one dedicated to <strong>Classes 6 to 10</strong> and the other to <strong>Classes 11 and 12</strong>. Recommended for larger campuses with multiple sections and high student enrollments.
                      </p>
                      <ul className="text-xs text-slate-600 space-y-1 pt-2 border-t border-slate-100">
                        <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> Lab 1 (400 sq. ft.): Dedicated for Classes 6 to 10</li>
                        <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> Lab 2 (400 sq. ft.): Dedicated for Classes 11 &amp; 12</li>
                        <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> Simultaneous class scheduling without bottlenecks</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Section 3: Difference between Composite Science Lab and Composite Skill Lab */}
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#003c6e] mb-3">
                    3. Composite Science Lab vs. Composite Skill Lab: Fundamental Differences
                  </h2>
                  <p className="mb-4">
                    School administrators, principals, and trustees frequently confuse these two distinct laboratory mandates. Below is the definitive regulatory comparison based on official CBSE gazetted circulars:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-2">
                      <span className="text-[11px] font-bold text-[#005689] uppercase tracking-wider block">
                        Circular 11/2022 Mandate
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm">Composite Science Laboratory</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Mandatory exclusively for <strong>Secondary Classes (Classes IX and X)</strong>. While schools may schedule basic general science practicals for Classes 6 to 8, it is strictly non-compliant for Senior Secondary.
                      </p>
                      <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-semibold">
                        ⚠️ <strong>Affiliation Rule:</strong> For Senior Secondary (Classes 11 &amp; 12), independent individual labs for Physics, Chemistry, and Biology are mandatory. A Composite Science Lab is NOT valid for Classes 11 &amp; 12!
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-200 space-y-2">
                      <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider block">
                        Circular Skill-75/2024 &amp; 13/2026 Mandate
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm">Composite Skill Lab</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Mandated comprehensively across <strong>Classes VI to XII (Middle through Senior Secondary)</strong>. It remains fully recognized, active, and compulsory at both secondary and senior secondary stages.
                      </p>
                      <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold">
                        ✅ <strong>Affiliation Rule:</strong> Whether a school operates up to Secondary or Senior Secondary, the Composite Skill Lab covers vocational subjects for the entire student cohort (Classes 6 to 12).
                      </div>
                    </div>
                  </div>

                  {/* Comprehensive Difference Table */}
                  <div className="space-y-1.5">
                    <div className="sm:hidden text-[10px] text-slate-500 italic flex items-center justify-end gap-1 font-medium">
                      <span>↔ Swipe horizontally to view full table</span>
                    </div>
                    <div className="rounded-xl border border-slate-200 overflow-x-auto shadow-2xs w-full scrollbar-thin">
                      <table className="min-w-[620px] w-full text-left text-xs">
                        <thead className="bg-[#EDF5FA] text-[#003c6e] font-bold uppercase border-b border-slate-200">
                          <tr>
                            <th className="py-2.5 px-3">Comparison Parameter</th>
                            <th className="py-2.5 px-3">Composite Science Lab</th>
                            <th className="py-2.5 px-3">Composite Skill Lab</th>
                          </tr>
                        </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-bold text-slate-800">Official Circular</td>
                          <td className="py-2.5 px-3 font-semibold text-[#005689]">Circular No. 11/2022 &amp; SARAS SOP</td>
                          <td className="py-2.5 px-3 font-semibold text-purple-700">Circular No. Skill-75/2024 &amp; 13/2026</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-bold text-slate-800">Mandatory Classes</td>
                          <td className="py-2.5 px-3 text-slate-700">Classes IX &amp; X (Secondary Level)</td>
                          <td className="py-2.5 px-3 text-slate-700 font-bold">Classes VI to XII (Middle, Secondary &amp; Sr. Sec)</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-bold text-slate-800">Applicability for Classes 6 to 8</td>
                          <td className="py-2.5 px-3 text-slate-600">Permissible for basic practicals as per timetable</td>
                          <td className="py-2.5 px-3 text-slate-600 font-semibold">Mandatory curricular component from Class 6 onwards</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-bold text-slate-800">Senior Secondary (XI-XII) Validity</td>
                          <td className="py-2.5 px-3 text-rose-700 font-bold bg-rose-50/40">
                            Not Valid (Separate Physics, Chem &amp; Bio labs mandatory)
                          </td>
                          <td className="py-2.5 px-3 text-emerald-700 font-bold bg-emerald-50/40">
                            Fully Valid &amp; Mandatory (For Classes XI &amp; XII skill courses)
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-bold text-slate-800">Lab Floor Area Options</td>
                          <td className="py-2.5 px-3 text-slate-700">Single 600 sq. ft. room mandatory</td>
                          <td className="py-2.5 px-3 text-slate-700">
                            Option A: 600 sq ft OR Option B: Two 400 sq ft rooms
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-bold text-slate-800">Plumbing &amp; Water Supply</td>
                          <td className="py-2.5 px-3 text-slate-700 font-semibold">Continuous running water with min 8 sinks mandatory</td>
                          <td className="py-2.5 px-3 text-slate-600">Running water sinks not mandatory; high-density power sockets required</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-bold text-slate-800">Core Equipment &amp; Apparatus</td>
                          <td className="py-2.5 px-3 text-slate-600">49 core apparatus (microscopes, prisms, glassware, reagents)</td>
                          <td className="py-2.5 px-3 text-slate-600">Robotics kits, 3D printer, AI compute hardware, IoT sensors</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-bold text-slate-800">Subjects / Curricular Scope</td>
                          <td className="py-2.5 px-3 text-slate-600">General Science (Physics, Chemistry, Biology practicals)</td>
                          <td className="py-2.5 px-3 text-slate-600">AI Code 417/843, Coding 418, 33+ Vocational Skill courses</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

                {/* Section 4: 33+ Vocational Skill Subjects */}
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#003c6e] mb-3">
                    4. Key Vocational Skill Subjects Taught in Composite Skill Lab
                  </h2>
                  <p className="mb-3">
                    The CBSE Skill Education Division has notified over 33 vocational skill subjects for Classes VI to XII. The primary technological subjects delivered through this lab include:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="font-bold text-purple-700 block">Artificial Intelligence (AI)</span>
                      <p className="text-slate-600">Practical modules for Subject Code 417 (Classes IX–X) and Subject Code 843 (Classes XI–XII).</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="font-bold text-purple-700 block">Coding &amp; Data Science</span>
                      <p className="text-slate-600">Hands-on programming and data projects for Subject Code 418 (Coding) and Subject Code 419 (Data Science).</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="font-bold text-purple-700 block">Robotics &amp; IoT</span>
                      <p className="text-slate-600">Sensor interfacing, microcontroller programming (Arduino / Raspberry Pi), and embedded automation modules.</p>
                    </div>
                  </div>
                </div>

                {/* Section 5: Official Circular Verification */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-900 to-[#003c6e] text-white space-y-3">
                  <div>
                    <span className="text-xs font-bold text-cyan-300 uppercase">Official CBSE Direct Verification</span>
                    <h4 className="text-base font-bold text-white mt-0.5">Download &amp; Verify Official CBSE Circulars</h4>
                    <p className="text-xs text-purple-100 mt-1">
                      Verify all regulatory guidelines and infrastructure mandates directly from official CBSE portals:
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs">
                    <a
                      href="https://www.cbse.gov.in/cbsenew/documents/75_Circular_2024_Composite_Skill_Labs_27082024.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-white">Circular No. Skill-75/2024</div>
                        <div className="text-[10px] text-purple-200">Composite Skill Labs Guidelines</div>
                      </div>
                      <Download className="w-4 h-4 text-cyan-300 shrink-0" />
                    </a>
                    <a
                      href="https://cbseacademic.nic.in/web_material/Circulars/2026/13_Circular_2026.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-white">Circular No. 13/2026</div>
                        <div className="text-[10px] text-purple-200">Skill Lab Reinforcement Circular</div>
                      </div>
                      <Download className="w-4 h-4 text-cyan-300 shrink-0" />
                    </a>
                    <a
                      href="https://saras.cbse.gov.in/saras/Circulars/Circular11_2022.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-white">Circular No. 11/2022</div>
                        <div className="text-[10px] text-purple-200">Composite Science Lab Norms</div>
                      </div>
                      <Download className="w-4 h-4 text-cyan-300 shrink-0" />
                    </a>
                    <a
                      href="https://cbseacademic.nic.in/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-white">CBSE Academic Portal</div>
                        <div className="text-[10px] text-purple-200">cbseacademic.nic.in</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-cyan-300 shrink-0" />
                    </a>
                  </div>
                </div>

                {/* Section 6: FAQs */}
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#003c6e] mb-3">
                    5. Frequently Asked Questions (FAQ)
                  </h2>
                  <div className="space-y-2.5">
                    {[
                      {
                        q: 'Is establishing a Composite Skill Lab mandatory for CBSE schools immediately?',
                        a: 'Yes. As per CBSE Circular No. Skill-75/2024 and Circular No. 13/2026, all CBSE-affiliated schools offering secondary and senior secondary curriculum must establish a Composite Skill Lab for Classes VI to XII.'
                      },
                      {
                        q: 'Can an existing Atal Tinkering Lab (ATL) be utilized as a Composite Skill Lab?',
                        a: 'Yes. Schools with a functional NITI Aayog Atal Tinkering Lab (ATL) can utilize their existing lab infrastructure to meet CBSE Composite Skill Lab mandates, provided required vocational skill software, AI modules, and grade-appropriate curricula are integrated.'
                      },
                      {
                        q: 'Why is a Composite Science Lab not permissible for Senior Secondary (Classes 11 & 12)?',
                        a: 'Under CBSE Circular 11/2022 and SARAS Affiliation Bye-Laws, Senior Secondary (Classes XI & XII) science curricula involve specialized syllabus requirements that necessitate separate, dedicated Physics, Chemistry, and Biology laboratories. A Composite Science Lab is strictly limited to Secondary classes (IX & X).'
                      },
                      {
                        q: 'Which layout option is better for schools: Option A or Option B?',
                        a: 'Option A (single 600 sq. ft. room) is the most space-efficient and cost-effective for schools with unified batch scheduling. Option B (two separate 400 sq. ft. rooms totaling 800 sq. ft.) is ideal for high-enrollment schools wishing to conduct parallel vocational tracks simultaneously.'
                      }
                    ].map((faq, idx) => (
                      <details key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 group open:bg-white open:shadow-xs">
                        <summary className="font-bold text-xs text-slate-900 cursor-pointer list-none flex items-center justify-between">
                          <span>{faq.q}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-open:rotate-90 transition-transform" />
                        </summary>
                        <p className="text-xs text-slate-600 mt-2 pt-2 border-t border-slate-100 leading-relaxed">
                          {faq.a}
                        </p>
                      </details>
                    ))}
                  </div>
                </div>

              </div>

              {/* Tags Section */}
              <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" /> Tags:
                </span>
                {['CompositeSkillLab', 'CBSESkillEducation', 'CircularSkill75', 'NEP2020', 'VocationalSkills'].map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Author Bio Box */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-purple-700 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-sm">
                  DS
                </div>
                <div className="text-center sm:text-left space-y-1">
                  <h4 className="font-bold text-slate-900 text-sm">Devendra Singh</h4>
                  <p className="text-xs text-slate-500">
                    Lead Educational Infrastructure Consultant at CSEEL. Specialized in CBSE SARAS affiliation norms, Atal Tinkering Labs (ATL), and NEP 2020 STEM experiential lab setups across India.
                  </p>
                </div>
              </div>

            </main>

            {/* ═════════ RIGHT COLUMN: STICKY SIDEBAR (4 Cols) ═════════ */}
            <aside className="lg:col-span-4 space-y-6 sticky top-24">

              {/* Consultation Form Widget */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-purple-600 animate-ping" />
                  <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">
                    Turnkey Setup Assistance
                  </span>
                </div>
                <h3 className="font-black text-slate-900 text-base" style={{ color: '#003c6e' }}>
                  Composite Skill Lab Setup
                </h3>
                <p className="text-xs text-slate-500 mt-1 mb-4 leading-relaxed">
                  Get complete BOQ itemized quotation and compliant 3D layout to meet CBSE Circular Skill-75/2024 & 13/2026 norms:
                </p>

                {formSubmitted ? (
                  <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 text-center space-y-2">
                    <div className="w-8 h-8 rounded-full bg-purple-600 text-white mx-auto flex items-center justify-center font-bold">
                      ✓
                    </div>
                    <h5 className="font-bold text-purple-900 text-xs">Request Received!</h5>
                    <p className="text-[11px] text-purple-700">
                      Our CBSE Lab Engineer will share the Skill Lab BOQ within 2 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-3 text-xs">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">School Name *</label>
                      <input
                        type="text"
                        required
                        value={formState.schoolName}
                        onChange={(e) => setFormState({ ...formState, schoolName: e.target.value })}
                        placeholder="e.g. Delhi Public School"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Contact Person &amp; Phone *</label>
                      <input
                        type="tel"
                        required
                        value={formState.phone}
                        onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                        placeholder="+91 Mobile number"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Setup Option *</label>
                      <select
                        value={formState.requirementType}
                        onChange={(e) => setFormState({ ...formState, requirementType: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-600 bg-white"
                      >
                        <option>Option A: Single 600 Sq. Ft. Lab (Classes 6-12)</option>
                        <option>Option B: Two 400 Sq. Ft. Labs (6-10 &amp; 11-12)</option>
                        <option>2-in-1 Hybrid (Science + Skill Lab)</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-xs transition"
                    >
                      Get Official Skill Lab BOQ
                    </button>
                  </form>
                )}
              </div>

              {/* Link to Science Lab Hub */}
              <div className="bg-gradient-to-br from-[#EDF5FA] to-blue-50/50 p-5 rounded-2xl border border-[#005689]/20 space-y-2.5">
                <span className="text-[10px] font-black uppercase text-[#005689] tracking-wider block">
                  Mandatory Science Lab (Classes 9-10)
                </span>
                <h4 className="font-bold text-slate-900 text-sm">
                  Looking for Composite Science Laboratory?
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  SARAS SOP 600 sq. ft. room, 8 wash sinks, 49 apparatus checklist and chemicals guide for CBSE affiliation.
                </p>
                <Link
                  href="/composite-lab"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#005689] hover:underline pt-1"
                >
                  <span>Go to Composite Science Lab Hub</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Other Labs Widget */}
              <SidebarOtherLabsWidget />

            </aside>

          </div>
        </div>

        {/* ── Bottom Section: Other School Lab Solutions ── */}
        <OtherLabSolutions />

      </div>
    </PageTransition>
  );
}
