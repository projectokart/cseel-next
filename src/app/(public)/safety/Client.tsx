'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PageTransition from "@/components/shared/PageTransition";
import {
  Shield, AlertTriangle, Eye, Hand, Flame, Wind,
  CheckCircle2, FileText, Download, ShieldCheck, ChevronDown,
  Sparkles, Check, School, HeartPulse, Zap, HelpCircle
} from "lucide-react";
import { useBookDemoModal } from '@/contexts/BookDemoModalContext';

export default function SafetyClient() {
  const { openDemoModal } = useBookDemoModal();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const safetyStats = [
    { value: '100%', label: 'Zero-Accident Safety Standard', sub: 'Engineered into every lab layout' },
    { value: '49 Items', label: 'CBSE Mandatory Non-Consumable List', sub: 'Full SARAS inspection readiness' },
    { value: '10 Secs', label: 'Eyewash Station Reachability', sub: 'From every student lab bench' },
    { value: '5 Manuals', label: 'Standard Operating Procedures (SOP)', sub: 'Ready for faculty and students' },
  ];

  const safetyRules = [
    {
      icon: Eye,
      color: "bg-blue-50 text-[#005689] border-blue-200",
      title: "Eye & Face Protection Protocols",
      desc: "Chemical-splash safety goggles conforming to IS 5983 must be worn during all heating and reagent handling. Dual-head emergency eyewash stations must be reachable within 10 seconds without obstruction.",
      checkpoints: ["IS 5983 certified chemical-splash goggles", "Gravity-fed or plumbed emergency eyewash", "Eyewash weekly water flow flush verification"]
    },
    {
      icon: AlertTriangle,
      color: "bg-amber-50 text-amber-700 border-amber-200",
      title: "Chemical Classification & Storage",
      desc: "Segregated acid and alkali storage cabinets with secondary containment trays. Strictly no direct floor storage of concentrated reagents. Mandatory GHS hazard pictograms on every bottle.",
      checkpoints: ["Heavy-duty acid-resistant lined cabinets", "Incompatible chemical separation matrix", "Bilingual GHS hazard & antidote labeling"]
    },
    {
      icon: Flame,
      color: "bg-rose-50 text-rose-700 border-rose-200",
      title: "Fire Safety & Suppression Norms",
      desc: "Class B & C carbon dioxide (CO2) extinguishers paired with multi-purpose dry chemical (ABC) units. Heavy-duty fiberglass fire blankets and dried sand buckets mounted at 1.2m height near exits.",
      checkpoints: ["Annual ISI certified fire extinguisher servicing", "Woolen/fiberglass fire safety blankets", "Unobstructed clear 1.5m exit corridor routes"]
    },
    {
      icon: Zap,
      color: "bg-purple-50 text-purple-700 border-purple-200",
      title: "Electrical & Workbench Protection",
      desc: "All physics and robotics benches must be protected with dedicated Earth Leakage Circuit Breakers (ELCB / RCCB 30mA). Stepped-down 12V DC power supplies used for general student exploration.",
      checkpoints: ["Centralized master electrical emergency shut-off", "30mA residual current trip devices on all benches", "Shrouded banana plugs for circuit exploration"]
    },
    {
      icon: Wind,
      color: "bg-cyan-50 text-cyan-700 border-cyan-200",
      title: "Air Ventilation & Acid Fume Exhaust",
      desc: "High-volume cross-ventilation layout with corrosion-proof exhaust fans mounted above reagent prep counters. Specialized localized fume extraction hoods for concentrated acid experiments.",
      checkpoints: ["Continuous 8-12 air changes per hour (ACH)", "Acid-resistant polypropylene fan blades", "Operable windows on opposite walls for cross-draft"]
    },
    {
      icon: HeartPulse,
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
      title: "First Aid & Spill Neutralization",
      desc: "Fully stocked CBSE SARAS compliant first aid station with sterile burn dressings, antiseptic eyewash bottles, chemical burn neutralizing sprays, and emergency hospital contact charts.",
      checkpoints: ["Monthly replenishment of medical supplies", "Sodium bicarbonate powder for acid spills", "Bilingual emergency contact signboard at entrance"]
    },
  ];

  const manuals = [
    {
      title: "CBSE SARAS Lab Safety & Inspection Blueprint",
      pages: "28 Pages · PDF",
      desc: "Comprehensive manual detailing mandatory 600 sq ft room dimensions, 8 sinks layout, chemical storage norms, and SARAS inspection checklists.",
      fileSize: "2.4 MB"
    },
    {
      title: "Chemistry Laboratory Hazard & Storage SOP",
      pages: "22 Pages · PDF",
      desc: "Step-by-step chemical handling, dilution ratios, hazardous waste segregation, and acid neutralization protocols for chemistry teachers.",
      fileSize: "1.9 MB"
    },
    {
      title: "Biology Microscopy & Specimen Safety Guide",
      pages: "18 Pages · PDF",
      desc: "Safe staining procedures, handling of scalpel blades, disposal of organic peels, and immersion oil lens cleaning procedures.",
      fileSize: "1.6 MB"
    },
    {
      title: "Physics Electrical & Optics Safety Standards",
      pages: "16 Pages · PDF",
      desc: "Guidelines for high-voltage DC supplies, optical bench laser ray safety (Class 2 lasers), and induction coil spark management.",
      fileSize: "1.5 MB"
    },
    {
      title: "Emergency Response & First Aid SOP Wall Chart",
      pages: "12 Pages · Printable A3",
      desc: "Printable high-resolution laboratory wall charts showing instant responses to chemical splashes, glass cuts, and minor heat burns.",
      fileSize: "3.1 MB"
    },
  ];

  const safetyFaqs = [
    {
      q: "What are the exact sink and plumbing requirements for CBSE Composite Labs?",
      a: "CBSE SARAS norms mandate a minimum of 8 functional acid-resistant ceramic or stainless-steel sinks with continuous running water supply inside the 600 sq ft composite laboratory space. Sinks must have chemical-resistant PVC drainage traps to prevent acid corrosion."
    },
    {
      q: "Where should the laboratory first aid box and eyewash station be mounted?",
      a: "The first aid station and emergency eyewash should be mounted near the main entrance door or prep station at an accessible height (approx. 1.1 to 1.3 meters), completely free from any obstructing benches or stools, and clearly marked with an emergency green signboard."
    },
    {
      q: "Can school students perform experiments with concentrated acids?",
      a: "No. For safety compliance, all secondary school student experiments must use pre-diluted micro-scale reagents (e.g. 0.1M or 0.5M dilute solutions) prepared in advance by the lab demonstrator. Concentrated acids must remain locked inside the teacher's chemical storage cabinet."
    },
    {
      q: "How does CSEEL help schools pass their annual CBSE affiliation safety audit?",
      a: "We conduct complete on-site pre-inspection audits, provide compliant safety signage boards, verify fire extinguisher placements, deliver the 49 mandatory non-consumable apparatus list, and issue a formal Lab Safety Compliance Certificate."
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
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-300" />
                  <span>SAFETY & COMPLIANCE · CBSE SARAS PROTOCOLS</span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-extrabold text-white tracking-tight leading-[1.15]" style={{ color: '#ffffff' }}>
                  Laboratory Safety Standards, SOPs & <span className="text-cyan-300">Inspection Manuals</span>
                </h1>

                <p className="text-base sm:text-lg text-slate-100/90 max-w-2xl leading-relaxed">
                  Comprehensive safety frameworks conforming to CBSE Affiliation Bye-Laws Section 4.4 and SARAS laboratory circulars. Ensuring confident, risk-free practical exploration for every student and faculty member.
                </p>

                <div className="flex flex-col sm:flex-row gap-3.5 pt-2">
                  <button
                    onClick={() => openDemoModal({
                      title: 'Request School Lab Safety Audit',
                      subtitle: 'Our safety engineers will audit your laboratory plumbing, ventilation, and emergency preparedness.'
                    })}
                    className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-400 to-cyan-500 text-slate-950 hover:brightness-105 transition-all shadow-lg shadow-cyan-500/25 active:scale-[0.98] cursor-pointer"
                  >
                    <span>Request Safety Audit</span>
                  </button>

                  <Link
                    href="/composite-lab"
                    className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/25 backdrop-blur-sm transition-all active:scale-[0.98]"
                  >
                    <span>CBSE 49 Apparatus List</span>
                  </Link>

                  <Link
                    href="/contact-us"
                    className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/25 backdrop-blur-sm transition-all active:scale-[0.98]"
                  >
                    <span>Speak with Lab Specialist</span>
                  </Link>
                </div>

                <div className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-200/90 font-medium border-t border-white/15">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-300" />
                    <span>CBSE SARAS 4.4 Compliant</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-300" />
                    <span>8 Sinks & Eyewash Layout</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-300" />
                    <span>Downloadable SOP Wall Charts</span>
                  </span>
                </div>
              </div>

              {/* Right Column: Lab Safety Badge Overview */}
              <div className="lg:col-span-5">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 text-left">
                  
                  <div className="flex items-center justify-between border-b border-white/15 pb-4">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-300 block">SARAS Safety Standard</span>
                      <h3 className="text-lg font-bold text-white mt-0.5" style={{ color: '#ffffff' }}>Mandatory Lab Safety Kit</h3>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-bold">
                      Certified
                    </span>
                  </div>

                  <div className="space-y-3.5">
                    <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-cyan-400/20 text-cyan-300 flex items-center justify-center shrink-0">
                        <Eye className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white" style={{ color: '#ffffff' }}>Emergency Eyewash & Sinks</h4>
                        <p className="text-[11px] text-slate-200 mt-0.5">8 acid-resistant sinks with dual-nozzle eyewash within 10s reach.</p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-rose-400/20 text-rose-300 flex items-center justify-center shrink-0">
                        <Flame className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white" style={{ color: '#ffffff' }}>Fire Blanket & CO2 Extinguishers</h4>
                        <p className="text-[11px] text-slate-200 mt-0.5">ISI marked Class B/C extinguishers and fiberglass fire blankets.</p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-purple-400/20 text-purple-300 flex items-center justify-center shrink-0">
                        <Zap className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white" style={{ color: '#ffffff' }}>Centralized ELCB Trip Circuits</h4>
                        <p className="text-[11px] text-slate-200 mt-0.5">30mA shock protection on every student experiment workbench.</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-cyan-200">Inspection Prep</span>
                      <p className="text-xs font-bold text-white mt-0.5" style={{ color: '#ffffff' }}>Download Free Safety Blueprint</p>
                    </div>
                    <button
                      onClick={() => openDemoModal({ title: 'Download Lab Safety Manuals' })}
                      className="px-3.5 py-1.5 rounded-lg bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition-all cursor-pointer shadow-xs"
                    >
                      <span>Download</span>
                    </button>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ─── KEY SAFETY STATS ─── */}
        <section className="border-y border-slate-200 bg-slate-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              {safetyStats.map((s, idx) => (
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

        {/* ─── CORE SAFETY PROTOCOLS (Cards) ─── */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
              <span className="px-3 py-1 rounded-full bg-blue-50 text-[#005689] border border-blue-200/80 text-xs font-bold uppercase tracking-wider">
                Comprehensive Laboratory Protocols
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight" style={{ color: '#003c6e' }}>
                Six Foundational Lab Safety Pillars
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Engineered to prevent lab hazards before they happen and provide immediate, automated response mechanisms.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {safetyRules.map((r, i) => (
                <div
                  key={i}
                  className="bg-white rounded-3xl p-7 border border-slate-200 hover:border-[#005689]/40 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className={`w-12 h-12 rounded-2xl ${r.color} border flex items-center justify-center shrink-0`}>
                      <r.icon className="w-6 h-6" />
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#005689] transition-colors" style={{ color: '#003c6e' }}>
                      {r.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {r.desc}
                    </p>

                    <div className="pt-2 border-t border-slate-100 space-y-2">
                      {r.checkpoints.map((cp, cpIdx) => (
                        <div key={cpIdx} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{cp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ─── DOWNLOADABLE MANUALS SECTION ─── */}
        <section className="py-16 sm:py-20 bg-[#F8FAFC] border-y border-slate-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <span className="text-xs font-bold text-[#005689] uppercase tracking-wider">Official Documentation</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900" style={{ color: '#003c6e' }}>
                Downloadable Lab Safety Manuals & SOPs
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Print-ready PDF guides and compliance templates mapped to CBSE SARAS and Indian lab safety standards.
              </p>
            </div>

            <div className="space-y-4">
              {manuals.map((m, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#005689] border border-blue-200 flex items-center justify-center shrink-0">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900" style={{ color: '#003c6e' }}>
                        {m.title}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 max-w-xl leading-relaxed">
                        {m.desc}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-[11px] font-bold text-slate-500">
                        <span>{m.pages}</span>
                        <span>•</span>
                        <span className="text-[#005689]">{m.fileSize}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => openDemoModal({
                      title: `Download ${m.title}`,
                      subtitle: 'We will send the official PDF document directly to your institutional email.'
                    })}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#005689] hover:bg-[#003c6e] text-white font-bold text-xs transition-all shadow-xs shrink-0 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </button>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ─── SAFETY FAQ ─── */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 space-y-2">
              <span className="text-xs font-bold text-[#005689] uppercase tracking-wider">Safety Guidance</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900" style={{ color: '#003c6e' }}>
                Frequently Asked Safety Questions
              </h2>
            </div>

            <div className="space-y-3.5">
              {safetyFaqs.map((f, i) => (
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
                  Institutional Safety Assurance
                </span>

                <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight" style={{ color: '#ffffff' }}>
                  Is Your School Laboratory 100% SARAS Inspection-Ready?
                </h2>

                <p className="text-xs sm:text-base text-slate-100/90 max-w-xl mx-auto leading-relaxed">
                  Schedule an on-site lab safety audit. Our engineers will inspect your chemical storage, fire extinguishers, emergency eyewash stations, and provide a formal compliance roadmap.
                </p>

                <div className="flex flex-col sm:flex-row gap-3.5 justify-center pt-2">
                  <button
                    onClick={() => openDemoModal({
                      title: 'Request School Lab Safety Audit',
                      subtitle: 'We will dispatch a certified laboratory safety engineer to inspect your facility.'
                    })}
                    className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-400 to-cyan-500 text-slate-950 hover:brightness-105 transition-all shadow-lg shadow-cyan-500/25 active:scale-[0.98] cursor-pointer"
                  >
                    <span>Schedule Safety Audit</span>
                  </button>

                  <Link
                    href="/contact-us"
                    className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/25 backdrop-blur-sm transition-all active:scale-[0.98]"
                  >
                    <span>Contact Safety Desk</span>
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
