'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PageTransition from '@/components/shared/PageTransition';
import OtherLabSolutions from '@/components/composite/OtherLabSolutions';
import SidebarOtherLabsWidget from '@/components/composite/SidebarOtherLabsWidget';
import { 
  COMPOSITE_LAB_SUBPAGES
} from '@/lib/compositeSopData';
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
  Maximize2,
  HelpCircle,
  Package,
  Layers,
  ArrowLeft,
  ChevronLeft,
  Phone,
  Mail,
  User,
  MapPin,
  Tag,
  Check
} from 'lucide-react';

export default function CompositeLabClient() {
  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);

  // Sidebar search & form
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formState, setFormState] = useState({
    schoolName: '',
    contactPerson: '',
    phone: '',
    email: '',
    cityState: '',
    requirementType: 'Fresh CBSE Affiliation Setup'
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
      const text = encodeURIComponent('CBSE Composite Science & Skill Lab Setup Guide on CSEEL: ');
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
              <span className="text-slate-500">School Labs &amp; Setup</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[#005689] font-semibold">CBSE Composite Science Lab</span>
            </nav>

            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3 h-3 text-emerald-600" /> Official CBSE SARAS SOP Compliant
            </span>
          </div>
        </div>

        {/* ── Main 2-Column Blog Detail Layout (STEMROBO Style) ── */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">

            {/* ═════════ LEFT COLUMN: MAIN ARTICLE (8 Cols) ═════════ */}
            <main className="lg:col-span-8 bg-white p-4 sm:p-8 md:p-10 rounded-3xl border border-slate-200 shadow-xs space-y-6">

              {/* Category Badge & Meta Information */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span className="px-3 py-1 rounded-full font-black uppercase text-[10px] bg-[#EDF5FA] text-[#005689] border border-[#005689]/20 tracking-wider">
                  CBSE Affiliation
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-[#005689]" /> October 2026
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5 text-[#005689]" /> 8 min read
                </span>
                <span>•</span>
                <span className="font-semibold text-slate-700">By Devendra Singh</span>
              </div>

              {/* Article Main H1 Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#003c6e] leading-tight tracking-tight">
                CBSE Composite Science &amp; Skill Lab Setup Guide: Norms, Infrastructure, and Inspection Requirements
              </h1>

              {/* Author Info Bar */}
              <div className="flex items-center justify-between flex-wrap gap-4 py-3.5 border-y border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#005689] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    DS
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs sm:text-sm">Devendra Singh</div>
                    <div className="text-[11px] text-slate-500">STEM &amp; CBSE Lab Architect • CSEEL EdTech</div>
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

              {/* Featured Cover Image (Inside Article, Full Width of Left Col) */}
              <div className="relative rounded-2xl overflow-hidden shadow-md aspect-video bg-slate-900 border border-slate-200 group">
                <img
                  src="/images/cbse-composite-science-lab-3d.jpg"
                  alt="CBSE Composite Science Laboratory 3D Realistic Architectural Layout (600 sq ft, 8 sinks, 40 stools)"
                  className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
                />

                <div className="absolute top-3 left-3 px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md text-white border border-white/20 text-[11px] font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>CBSE SARAS 3D Architectural Model (600 Sq. Ft.)</span>
                </div>

                {/* Hotspot Pins */}
                <div 
                  className="absolute top-[18%] left-[48%] -translate-x-1/2 cursor-pointer z-20"
                  onMouseEnter={() => setActiveHotspot(1)}
                  onMouseLeave={() => setActiveHotspot(null)}
                  onClick={() => setActiveHotspot(activeHotspot === 1 ? null : 1)}
                >
                  <span className="relative flex h-6 w-6 items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-cyan-500 text-white font-bold text-[9px] items-center justify-center shadow-lg">1</span>
                  </span>
                  {activeHotspot === 1 && (
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-8 w-56 p-2.5 bg-slate-950/95 text-white text-[11px] rounded-xl border border-cyan-400 shadow-2xl z-30 pointer-events-none">
                      <p className="font-bold text-cyan-300">Intelligent Board &amp; Demo Desk</p>
                      <p className="text-slate-300 text-[10px] mt-0.5">Teacher demo table with individual sink and smartboard.</p>
                    </div>
                  )}
                </div>

                <div 
                  className="absolute top-[48%] left-[45%] -translate-x-1/2 cursor-pointer z-20"
                  onMouseEnter={() => setActiveHotspot(2)}
                  onMouseLeave={() => setActiveHotspot(null)}
                  onClick={() => setActiveHotspot(activeHotspot === 2 ? null : 2)}
                >
                  <span className="relative flex h-6 w-6 items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 text-white font-bold text-[9px] items-center justify-center shadow-lg">2</span>
                  </span>
                  {activeHotspot === 2 && (
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-8 w-60 p-2.5 bg-slate-950/95 text-white text-[11px] rounded-xl border border-emerald-400 shadow-2xl z-30 pointer-events-none">
                      <p className="font-bold text-emerald-300">4 Island Tables • 8 Water Sinks</p>
                      <p className="text-slate-300 text-[10px] mt-0.5">Acid-proof granite tops with 8 continuous running water taps.</p>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-[#003c6e] text-xs font-bold shadow-lg flex items-center gap-1.5 transition"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Enlarge Layout</span>
                </button>
              </div>

              {/* Tagline / Excerpt Callout */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#EDF5FA] border-l-4 border-[#005689] text-sm text-slate-700 leading-relaxed font-medium">
                The authoritative blueprint for K-12 school principals and trustees. Mandatory 600 sq. ft. room dimensions, 8-sink plumbing layout, 40-student seating, complete 49 non-consumable apparatus checklist, 18 chemicals, and inspection preparation as per CBSE SARAS SOP.
              </div>

              {/* Article Content */}
              <div className="space-y-8 text-slate-700 text-sm leading-relaxed">

                {/* Section 1: Introduction - What is a Composite Science Lab? */}
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#003c6e] mb-3">
                    1. What is a Composite Science Laboratory?
                  </h2>
                  <p>
                    A <strong>Composite Science Laboratory</strong> is a specialized, multi-disciplinary educational studio designed for Secondary School students (Classes 6th to 10th). Unlike Senior Secondary schools (Classes 11th and 12th) that require three separate, isolated laboratories for Physics, Chemistry, and Biology, a Composite Science Lab brings all three foundational science branches together into a single, cohesive 600 sq. ft. learning environment.
                  </p>
                  <p className="mt-3">
                    In this unified space, learners perform hands-on optics and mechanics experiments, chemical titrations and exothermic reaction tests, and biological microscopic slide observations using centralized water sinks, acid-resistant workbenches, and shared smart digital displays.
                  </p>
                </div>

                {/* Section 2: Origins - Who Started It and When? */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-[#005689] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      📜
                    </span>
                    <h3 className="text-base font-bold text-slate-900" style={{ color: '#003c6e' }}>
                      2. Regulatory Origins: Who Started It, When, and Under Which Mandate?
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    The Composite Science Laboratory mandate was formally conceptualized and enforced by the <strong>Central Board of Secondary Education (CBSE)</strong> under <strong>Chapter 4 (Rule 4.4)</strong> of the official <em>CBSE Affiliation Bye-Laws</em>. 
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    With the introduction of the digital <strong>SARAS (School Affiliation Re-Engineered Automation System)</strong> portal, CBSE codified the definitive <em>Standard Operating Procedure (SOP)</em>. This SOP replaced arbitrary inspections with measurable, geotagged videography criteria: every school seeking fresh secondary affiliation, extension, or upgradation must maintain an operational, fully-equipped 600 sq. ft. Composite Science Lab with 8 sinks and 40 stools before an inspection committee can grant approval.
                  </p>
                </div>

                {/* Section 3: Rationale - Why Was It Started? (Kyu Shuru Ki?) */}
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#003c6e] mb-3">
                    3. Why Was the Composite Science Lab Introduced?
                  </h2>
                  <p>
                    CBSE introduced the Composite Science Lab model to solve three deep-rooted challenges in Indian school education:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-4">
                    <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
                      <span className="text-xs font-bold text-[#005689] uppercase tracking-wide block">1. Space &amp; Cost Efficiency</span>
                      <h4 className="font-bold text-slate-900 text-sm">Eliminating Idle Classrooms</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Building 3 separate 600 sq. ft. labs (1,800 sq. ft. total) for Classes 6–10 is financially burdensome for most private and trust schools. Individual subject labs remain vacant for 70% of the timetable. A composite lab consolidates infrastructure into a single, high-utilization room.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
                      <span className="text-xs font-bold text-[#005689] uppercase tracking-wide block">2. Integrated Pedagogy</span>
                      <h4 className="font-bold text-slate-900 text-sm">Interdisciplinary Science</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Middle and secondary school science is naturally interconnected. Photosynthesis combines light physics with biochemistry. A unified lab environment enables teachers to conduct cross-disciplinary experiments without shuffling students between different rooms.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
                      <span className="text-xs font-bold text-[#005689] uppercase tracking-wide block">3. NEP 2020 Mandate</span>
                      <h4 className="font-bold text-slate-900 text-sm">Experiential Learning</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        National Education Policy 2020 (Para 4.6 &amp; Para 7.5) mandates that classroom transactions must move away from rote memorization toward hands-on observation, hypothesis formulation, data collection, and scientific temper from the school level itself.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section 4: Essential Implementation Pillars & Executive Reviews */}
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-[#003c6e] mb-2">
                      4. Essential Implementation Pillars &amp; Technical Reviews
                    </h2>
                    <p className="text-slate-600 text-xs sm:text-sm">
                      Setting up a CBSE-compliant Composite Science Laboratory involves six foundational pillars. Instead of browsing scattered specifications, review each executive summary below and access the dedicated in-depth checklists, blueprints, and budgeting tools:
                    </p>
                  </div>

                  {/* Pillar 1: Material & Apparatus Review */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#005689]/40 shadow-xs hover:shadow-md transition group space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="w-9 h-9 rounded-xl bg-cyan-50 text-[#005689] flex items-center justify-center font-bold text-base border border-cyan-100">
                          🔬
                        </span>
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Clause 6a, 6b &amp; 6c Inventory</span>
                          <h3 className="text-base font-bold text-slate-900 group-hover:text-[#005689] transition-colors">
                            <Link href="/composite-lab/material" className="hover:underline">
                              Official CBSE Material &amp; Apparatus Checklist
                            </Link>
                          </h3>
                        </div>
                      </div>
                      <Link 
                        href="/composite-lab/material"
                        className="shrink-0 text-xs font-bold text-[#005689] bg-[#EDF5FA] hover:bg-[#005689] hover:text-white px-3 py-1.5 rounded-lg transition flex items-center gap-1"
                      >
                        <span>Full Checklist</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      CBSE SARAS SOP strictly specifies batch quantities for <strong>49 non-consumable apparatus</strong> (including optical benches, concave/convex mirrors, compound microscopes, spring balances, and digital multimeters), <strong>18 essential laboratory-grade chemicals</strong> (dilute HCl, copper sulphate, sodium hydroxide, litmus indicators), and <strong>permanent biological slides &amp; specimens</strong>. All glassware must strictly comply with Borosilicate 3.3 thermal standards.
                    </p>
                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                      <span className="font-semibold text-slate-700">Explore in detail:</span>
                      <Link href="/composite-lab/material" className="text-[#005689] hover:underline font-medium">
                        49 Equipment Quantities
                      </Link>
                      <span>•</span>
                      <Link href="/composite-lab/material" className="text-[#005689] hover:underline font-medium">
                        18 Chemicals &amp; Reagents
                      </Link>
                      <span>•</span>
                      <Link href="/composite-lab/material" className="text-[#005689] hover:underline font-medium">
                        Permanent Biology Specimens
                      </Link>
                    </div>
                  </div>

                  {/* Pillar 2: Space & Architecture Review */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#005689]/40 shadow-xs hover:shadow-md transition group space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-base border border-emerald-100">
                          📐
                        </span>
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Clause 5 Physical Infrastructure</span>
                          <h3 className="text-base font-bold text-slate-900 group-hover:text-[#005689] transition-colors">
                            <Link href="/composite-lab/space" className="hover:underline">
                              Room Dimensions, Plumbing Architecture &amp; 3D Layout
                            </Link>
                          </h3>
                        </div>
                      </div>
                      <Link 
                        href="/composite-lab/space"
                        className="shrink-0 text-xs font-bold text-[#005689] bg-[#EDF5FA] hover:bg-[#005689] hover:text-white px-3 py-1.5 rounded-lg transition flex items-center gap-1"
                      >
                        <span>View Blueprints</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Clause 5 mandates a minimum carpet area of <strong>600 sq. ft. (typically 30 ft × 20 ft)</strong> accommodating 40 seated students simultaneously. The floor plan requires 4 central island working tables (8 ft × 4 ft) with acid-resistant granite counters, <strong>8 dedicated plumbing wash sinks with continuous running water</strong>, an elevated teacher demonstration dais, two outward-opening safety fire exits, and dual ceiling-mounted exhaust ventilators.
                    </p>
                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                      <span className="font-semibold text-slate-700">Explore in detail:</span>
                      <Link href="/composite-lab/space" className="text-[#005689] hover:underline font-medium">
                        600 Sq. Ft. CAD Floor Plan
                      </Link>
                      <span>•</span>
                      <Link href="/composite-lab/space" className="text-[#005689] hover:underline font-medium">
                        8-Sink Plumbing Loop
                      </Link>
                      <span>•</span>
                      <Link href="/composite-lab/space" className="text-[#005689] hover:underline font-medium">
                        40-Stool Ergonomics
                      </Link>
                    </div>
                  </div>

                  {/* Pillar 3: CBSE SARAS SOP & Inspection Review */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#005689]/40 shadow-xs hover:shadow-md transition group space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-base border border-amber-100">
                          🛡️
                        </span>
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">SARAS Compliance &amp; Clause 7</span>
                          <h3 className="text-base font-bold text-slate-900 group-hover:text-[#005689] transition-colors">
                            <Link href="/composite-lab/cbse-sop" className="hover:underline">
                              Official CBSE SARAS SOP &amp; Inspection Readiness
                            </Link>
                          </h3>
                        </div>
                      </div>
                      <Link 
                        href="/composite-lab/cbse-sop"
                        className="shrink-0 text-xs font-bold text-[#005689] bg-[#EDF5FA] hover:bg-[#005689] hover:text-white px-3 py-1.5 rounded-lg transition flex items-center gap-1"
                      >
                        <span>Inspection SOP</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      CBSE inspection committees conduct physical audits with 360-degree geo-tagged videography. Crucial compliance triggers include: <strong>18 mandatory student safety guidelines</strong> prominently framed on walls, dual pressurized ABC-type fire extinguishers, fully stocked first-aid stations, chemical poison lock-and-key storage, active exhaust ventilation, and calibrated consumables logbooks.
                    </p>
                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                      <span className="font-semibold text-slate-700">Explore in detail:</span>
                      <Link href="/composite-lab/cbse-sop" className="text-[#005689] hover:underline font-medium">
                        Inspection Videography Checklist
                      </Link>
                      <span>•</span>
                      <Link href="/composite-lab/cbse-sop" className="text-[#005689] hover:underline font-medium">
                        18 Student Lab Rules
                      </Link>
                      <span>•</span>
                      <Link href="/composite-lab/cbse-sop" className="text-[#005689] hover:underline font-medium">
                        Stock Register Templates
                      </Link>
                    </div>
                  </div>

                  {/* Pillar 4: Cost Estimation & BOQ Review */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#005689]/40 shadow-xs hover:shadow-md transition group space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-base border border-purple-100">
                          💰
                        </span>
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Budgeting &amp; Capital Outlay (2025–26)</span>
                          <h3 className="text-base font-bold text-slate-900 group-hover:text-[#005689] transition-colors">
                            <Link href="/composite-lab/cost" className="hover:underline">
                              Complete Cost Estimation &amp; Itemized BOQ Breakdown
                            </Link>
                          </h3>
                        </div>
                      </div>
                      <Link 
                        href="/composite-lab/cost"
                        className="shrink-0 text-xs font-bold text-[#005689] bg-[#EDF5FA] hover:bg-[#005689] hover:text-white px-3 py-1.5 rounded-lg transition flex items-center gap-1"
                      >
                        <span>BOQ Pricing</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      A turnkey composite laboratory setup typically ranges from <strong>₹2.85 Lakhs to ₹6.50 Lakhs</strong> depending on existing civil readiness. Expenditure divides into: Lab Furniture &amp; Granite Workbenches (₹1.20L–₹2.20L), 49 Non-Consumable Apparatus (₹75k–₹1.40L), Plumbing &amp; Sanitary (₹35k–₹65k), Safety &amp; Electricals (₹25k–₹45k), and Annual Recurring Chemicals (₹20k–₹35k).
                    </p>
                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                      <span className="font-semibold text-slate-700">Explore in detail:</span>
                      <Link href="/composite-lab/cost" className="text-[#005689] hover:underline font-medium">
                        3 Turnkey Pricing Tiers
                      </Link>
                      <span>•</span>
                      <Link href="/composite-lab/cost" className="text-[#005689] hover:underline font-medium">
                        Itemized BOQ Cost Sheet
                      </Link>
                      <span>•</span>
                      <Link href="/composite-lab/cost" className="text-[#005689] hover:underline font-medium">
                        Recurring Maintenance Budget
                      </Link>
                    </div>
                  </div>

                  {/* Pillar 5: Turnkey Vendor Selection Review */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#005689]/40 shadow-xs hover:shadow-md transition group space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="w-9 h-9 rounded-xl bg-blue-50 text-[#005689] flex items-center justify-center font-bold text-base border border-blue-100">
                          🏢
                        </span>
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Procurement &amp; Tender Evaluation</span>
                          <h3 className="text-base font-bold text-slate-900 group-hover:text-[#005689] transition-colors">
                            <Link href="/composite-lab/vendor" className="hover:underline">
                              Turnkey Vendor Selection &amp; GeM Procurement Guide
                            </Link>
                          </h3>
                        </div>
                      </div>
                      <Link 
                        href="/composite-lab/vendor"
                        className="shrink-0 text-xs font-bold text-[#005689] bg-[#EDF5FA] hover:bg-[#005689] hover:text-white px-3 py-1.5 rounded-lg transition flex items-center gap-1"
                      >
                        <span>Vendor Matrix</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Selecting an unverified local supplier often leads to affiliation rejections due to uncalibrated apparatus, thin glassware, and non-compliant sink spacing. Schools must evaluate vendors on ISO/SEFA certifications, GeM (Government e-Marketplace) registration, 100% CBSE SARAS compliance guarantees, on-site calibration, and inspection dossier handovers.
                    </p>
                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                      <span className="font-semibold text-slate-700">Explore in detail:</span>
                      <Link href="/composite-lab/vendor" className="text-[#005689] hover:underline font-medium">
                        Vendor Evaluation Scorecard
                      </Link>
                      <span>•</span>
                      <Link href="/composite-lab/vendor" className="text-[#005689] hover:underline font-medium">
                        GeM Procurement Guidelines
                      </Link>
                      <span>•</span>
                      <Link href="/composite-lab/vendor" className="text-[#005689] hover:underline font-medium">
                        Inspection Guarantee Clauses
                      </Link>
                    </div>
                  </div>

                  {/* Pillar 6: Skill Education Integration Review */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#005689]/40 shadow-xs hover:shadow-md transition group space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="w-9 h-9 rounded-xl bg-orange-50 text-orange-700 flex items-center justify-center font-bold text-base border border-orange-100">
                          ⚙️
                        </span>
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">NEP 2020 &amp; Circular Skill-75/2024</span>
                          <h3 className="text-base font-bold text-slate-900 group-hover:text-[#005689] transition-colors">
                            <Link href="/composite-lab/skill-education" className="hover:underline">
                              Composite Science Lab vs. Composite Skill Lab
                            </Link>
                          </h3>
                        </div>
                      </div>
                      <Link 
                        href="/composite-lab/skill-education"
                        className="shrink-0 text-xs font-bold text-[#005689] bg-[#EDF5FA] hover:bg-[#005689] hover:text-white px-3 py-1.5 rounded-lg transition flex items-center gap-1"
                      >
                        <span>Skill Hub Guide</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      While the <em>Composite Science Lab</em> is a mandatory prerequisite for CBSE secondary affiliation (Classes 6–10 Science), CBSE introduced the <em>Composite Skill Lab</em> under <strong>Circular Skill-75/2024</strong>. Progressive institutions are now integrating both into a dual-purpose 2-in-1 hybrid innovation hub, combining physics &amp; biology stations with 33 vocational skill modules like AI, Robotics, and IoT.
                    </p>
                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                      <span className="font-semibold text-slate-700">Explore in detail:</span>
                      <Link href="/composite-lab/skill-education" className="text-[#005689] hover:underline font-medium">
                        Science Lab vs. Skill Lab Comparison
                      </Link>
                      <span>•</span>
                      <Link href="/composite-lab/skill-education" className="text-[#005689] hover:underline font-medium">
                        33 CBSE Skill Subjects
                      </Link>
                      <span>•</span>
                      <Link href="/composite-lab/skill-education" className="text-[#005689] hover:underline font-medium">
                        Hybrid 2-in-1 Timetable Model
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Section 5: FAQs */}
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#003c6e] mb-3">
                    5. Frequently Asked Questions
                  </h2>
                  <div className="space-y-2.5">
                    {[
                      {
                        q: 'Is a Composite Science Lab mandatory for CBSE secondary affiliation?',
                        a: 'Yes. As per CBSE Affiliation Bye-Laws and SARAS SOP, every secondary school (up to Class 10) must establish a minimum 600 sq. ft. Composite Science Laboratory before affiliation approval.'
                      },
                      {
                        q: 'How many wash sinks are required by CBSE SARAS SOP?',
                        a: 'Clause 5.7 explicitly mandates 8 sinks with continuous running water supply on student island tables, plus 1 demonstration sink on the teacher demo bench (total 9 sinks).'
                      },
                      {
                        q: 'What is the turnaround time for CSEEL turnkey setup?',
                        a: 'CSEEL completes turnkey lab setup—including 3D CAD drafting, plumbing, bench fabrication, equipment supply, and inspection dossier—in 14 business days.'
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
                {['CBSEAffiliation', 'CompositeLab', 'SARASSOP', 'STEMIndia', 'SchoolSetup'].map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Author Bio Box */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#005689] text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-sm">
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

              {/* Search Widget */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-700 mb-3">
                  Search Guides
                </h4>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search composite lab topic..."
                    value={sidebarSearch}
                    onChange={(e) => setSidebarSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#005689]"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              {/* Contact Us Form Widget (STEMROBO Style) */}
              <div id="inquiry-form" className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <span className="w-8 h-8 rounded-xl bg-[#005689] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    🧪
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Contact Us to Get More Information</h3>
                    <p className="text-[11px] text-slate-500">Official CBSE Lab Setup Support</p>
                  </div>
                </div>

                {formSubmitted ? (
                  <div className="p-4 bg-emerald-50 rounded-xl text-center border border-emerald-200 space-y-1">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                    <span className="text-xs font-bold text-slate-900 block">Thank You!</span>
                    <p className="text-[11px] text-slate-600">Our lab architect will call you within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-2.5 text-xs">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5">School Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. DPS Senior Secondary"
                        value={formState.schoolName}
                        onChange={(e) => setFormState({...formState, schoolName: e.target.value})}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-[#005689] bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Contact Person *</label>
                      <input
                        type="text"
                        required
                        placeholder="Principal / Manager"
                        value={formState.contactPerson}
                        onChange={(e) => setFormState({...formState, contactPerson: e.target.value})}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-[#005689] bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Phone / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 XXXXX"
                        value={formState.phone}
                        onChange={(e) => setFormState({...formState, phone: e.target.value})}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-[#005689] bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5">City &amp; State *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Lucknow, UP"
                        value={formState.cityState}
                        onChange={(e) => setFormState({...formState, cityState: e.target.value})}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-[#005689] bg-slate-50"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 mt-1 rounded-xl bg-[#005689] hover:bg-[#003c6e] text-white font-extrabold text-xs uppercase tracking-wider transition shadow-sm active:scale-98"
                    >
                      Get Itemized BoQ &amp; 3D Plan
                    </button>
                  </form>
                )}
              </div>

              {/* Latest Guides Widget */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-700 pb-2 border-b border-slate-100">
                  Latest Composite Lab Guides
                </h4>

                <div className="space-y-3">
                  {Object.values(COMPOSITE_LAB_SUBPAGES).map((p) => (
                    <Link
                      key={p.slug}
                      href={`/composite-lab/${p.slug}`}
                      className="group flex gap-3 items-center"
                    >
                      <div className="w-14 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                        <img
                          src={p.image || "/images/cbse-composite-science-lab-3d.jpg"}
                          alt={p.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[11px] font-medium text-slate-500 block">
                          {p.badge}
                        </span>
                        <h5 className="font-bold text-xs text-slate-900 group-hover:text-[#005689] line-clamp-2 leading-snug transition-colors">
                          {p.title}
                        </h5>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Official CBSE Document Download Widget */}
              <div className="bg-gradient-to-br from-[#003c6e] to-[#005689] text-white p-5 rounded-2xl shadow-md space-y-3">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-cyan-400 text-slate-900">
                  Official Affiliation SOP
                </span>
                <h4 className="font-bold text-sm">Download CBSE SARAS Guidelines (PDF)</h4>
                <p className="text-xs text-blue-100 leading-relaxed">
                  Official Central Board of Secondary Education SOP document for Composite Science Laboratories.
                </p>
                <a
                  href="/docs/CompositeScienceLabSOP.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-white text-[#003c6e] hover:bg-blue-50 font-bold text-xs text-center block transition shadow-sm"
                >
                  Download SOP PDF →
                </a>
              </div>

              {/* ═════════ OTHER SCHOOL LABS SIDEBAR WIDGET ═════════ */}
              <SidebarOtherLabsWidget />

            </aside>
          </div>

          {/* ═════════ OTHER SCHOOL LAB SOLUTIONS ═════════ */}
          <OtherLabSolutions />
        </div>

        {/* ── Modal for 3D Layout ── */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-white/20 shadow-2xl p-4 sm:p-6">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/15">
                <div>
                  <h3 className="text-base font-bold text-white">
                    CBSE SARAS Composite Science Laboratory Model Layout
                  </h3>
                  <p className="text-xs text-slate-400">
                    600 Sq. Ft. Carpet Area • 8 Water Sinks • 40 Student Stools • 2 Emergency Exits
                  </p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold transition"
                >
                  ✕
                </button>
              </div>

              <div className="rounded-2xl overflow-hidden bg-slate-950 border border-white/10">
                <img
                  src="/images/cbse-composite-science-lab-3d.jpg"
                  alt="CBSE Composite Science Lab 3D Architectural Model"
                  className="w-full h-auto object-contain max-h-[70vh] mx-auto"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
