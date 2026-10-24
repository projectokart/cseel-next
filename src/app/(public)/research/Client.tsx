'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PageTransition from "@/components/shared/PageTransition";
import {
  Search, FileText, Users, TrendingUp, CheckCircle2,
  Download, Sparkles, BookOpen, School, Award, ChevronDown
} from "lucide-react";
import { useBookDemoModal } from '@/contexts/BookDemoModalContext';

export default function ResearchClient() {
  const { openDemoModal } = useBookDemoModal();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const researchStats = [
    { value: '+34%', label: 'Practical Score Surge', sub: 'Measured across 12,000+ students' },
    { value: '92%', label: 'Long-Term Concept Retention', sub: 'Compared to 58% in traditional lecture' },
    { value: '18+', label: 'Peer-Reviewed Studies', sub: 'Published in international STEM journals' },
    { value: '500+', label: 'Partner Schools in Research Cohort', sub: 'Across CBSE & ICSE networks' },
  ];

  const focusAreas = [
    {
      icon: TrendingUp,
      color: "bg-blue-50 text-[#005689] border-blue-200",
      title: "Experiential Learning Efficacy & Retention",
      desc: "Longitudinal tracking of how hands-on manipulation of physical apparatus and interactive simulations impacts long-term scientific recall and higher-order Bloom's taxonomy performance.",
      findings: ["+34% improvement in board exam practical viva scores", "Elimination of gender gap in senior physics participation", "Deep conceptual clarity in electromagnetism & reaction kinetics"]
    },
    {
      icon: FileText,
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
      title: "NEP 2020 Competency Alignment Frameworks",
      desc: "Systematic mapping of practical laboratory activities to the National Education Policy 2020 experiential learning mandates and CBSE competency-based assessment rubrics.",
      findings: ["100% alignment with Class 9-12 NCERT learning outcomes", "Formative rubric frameworks for non-standardized assessment", "Integration of indigenous scientific knowledge traditions"]
    },
    {
      icon: Users,
      color: "bg-purple-50 text-purple-700 border-purple-200",
      title: "Teacher Efficacy & Lab Confidence Studies",
      desc: "Investigating how turnkey curriculum-mapped lesson plans, pre-lab simulations, and structured safety SOPs reduce science teacher cognitive overload and burnout.",
      findings: ["15+ hours weekly saved per science faculty member", "98% teacher confidence handling delicate optical and electronic rigs", "Higher faculty retention in partner institutions"]
    },
    {
      icon: Search,
      color: "bg-amber-50 text-amber-700 border-amber-200",
      title: "Predictive Learning Analytics & Misconception Mapping",
      desc: "Using anonymized simulation telemetry to pinpoint exact conceptual hurdles where students stumble during practical circuit wiring, titration drop rates, or genetic crosses.",
      findings: ["Real-time diagnostic identification of 40+ common student misconceptions", "Automated adaptive scaffolding recommendations", "Class-wide practical examination readiness forecasts"]
    },
  ];

  const publishedPapers = [
    {
      title: "Bridging the Physical-Virtual Chasm: Impact of Pre-Lab Simulations on High School Practical Efficacy",
      journal: "Journal of Science Education & Technology (2025)",
      authors: "Dr. Ananya Sen, Prof. Rajesh Mehra, CSEEL Research Cell",
      downloads: "3.2k Downloads"
    },
    {
      title: "Kolb's Experiential Cycle in Indian Senior Secondary Laboratories: A 2-Year Empirical Study",
      journal: "Asian Journal of STEM Education (2025)",
      authors: "CSEEL Academic Advisory Board & Modern School Barakhamba",
      downloads: "2.8k Downloads"
    },
    {
      title: "Cost-Effective Micro-Scale Experiments: Overcoming Consumable Barriers in Indian Secondary Schools",
      journal: "International Review of Chemical Education (2024)",
      authors: "Dr. Rakesh Sharma, Dept. of Chemistry, Delhi University",
      downloads: "4.1k Downloads"
    },
  ];

  const faqs = [
    {
      q: "Can our university or institution collaborate with CSEEL on educational research?",
      a: "Yes! CSEEL regularly partners with universities, education researchers, doctoral scholars, and government advisory bodies. We provide anonymized learning analytics data, access to our school network, and joint research grant collaboration."
    },
    {
      q: "How does CSEEL protect student privacy in learning analytics research?",
      a: "All research data is strictly anonymized and aggregated in full compliance with the Digital Personal Data Protection (DPDP) Act 2023. No personally identifiable information (PII) is ever shared or accessible to external researchers."
    },
    {
      q: "Where can educators download CSEEL research whitepapers?",
      a: "All our published whitepapers, assessment rubrics, and pedagogy efficacy reports are available for open educational access. You can request copies directly through the form below."
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
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                  <span>EVIDENCE-BASED PEDAGOGY · EMPIRICAL RESEARCH</span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-extrabold text-white tracking-tight leading-[1.15]" style={{ color: '#ffffff' }}>
                  Advancing the Science of <span className="text-cyan-300">Science Education</span>
                </h1>

                <p className="text-base sm:text-lg text-slate-100/90 max-w-2xl leading-relaxed">
                  Rigorous empirical research validating how hands-on experiential learning, virtual pre-lab scaffolding, and curriculum-mapped practicals boost conceptual retention and academic performance.
                </p>

                <div className="flex flex-col sm:flex-row gap-3.5 pt-2">
                  <button
                    onClick={() => openDemoModal({
                      title: 'Download CSEEL Efficacy Whitepaper',
                      subtitle: 'Access the complete 48-page empirical report on student practical score surge.'
                    })}
                    className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-400 to-cyan-500 text-slate-950 hover:brightness-105 transition-all shadow-lg shadow-cyan-500/25 active:scale-[0.98] cursor-pointer"
                  >
                    <span>Download Efficacy Whitepaper</span>
                  </button>

                  <Link
                    href="/why-cseel"
                    className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/25 backdrop-blur-sm transition-all active:scale-[0.98]"
                  >
                    <span>Pedagogical Framework</span>
                  </Link>

                  <Link
                    href="/contact-us"
                    className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/25 backdrop-blur-sm transition-all active:scale-[0.98]"
                  >
                    <span>Research Collaboration</span>
                  </Link>
                </div>

                <div className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-200/90 font-medium border-t border-white/15">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-300" />
                    <span>18+ Peer-Reviewed Studies</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-300" />
                    <span>DPDP Act 2023 Compliant</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-300" />
                    <span>NEP 2020 Validated</span>
                  </span>
                </div>
              </div>

              {/* Right Column: Research Impact Card */}
              <div className="lg:col-span-5">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 text-left">
                  
                  <div className="flex items-center justify-between border-b border-white/15 pb-4">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-300 block">Empirical Findings</span>
                      <h3 className="text-lg font-bold text-white mt-0.5" style={{ color: '#ffffff' }}>Efficacy at a Glance</h3>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-bold">
                      Verified
                    </span>
                  </div>

                  <div className="space-y-3.5">
                    <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-cyan-400/20 text-cyan-300 flex items-center justify-center shrink-0">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white" style={{ color: '#ffffff' }}>+34% Practical Viva Boost</h4>
                        <p className="text-[11px] text-slate-200 mt-0.5">Students with dual virtual + physical training scored significantly higher.</p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center shrink-0">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white" style={{ color: '#ffffff' }}>92% Conceptual Retention</h4>
                        <p className="text-[11px] text-slate-200 mt-0.5">Tested 90 days after experiment compared to 58% control groups.</p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-purple-400/20 text-purple-300 flex items-center justify-center shrink-0">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white" style={{ color: '#ffffff' }}>100% Student Participation</h4>
                        <p className="text-[11px] text-slate-200 mt-0.5">Zero students relegated to passive observer status in the lab.</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-cyan-200">Joint Research</span>
                      <p className="text-xs font-bold text-white mt-0.5" style={{ color: '#ffffff' }}>Collaborate with Our Team</p>
                    </div>
                    <Link
                      href="/contact-us"
                      className="px-3.5 py-1.5 rounded-lg bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition-all cursor-pointer shadow-xs"
                    >
                      <span>Get in Touch</span>
                    </Link>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ─── RESEARCH STATS STRIP ─── */}
        <section className="border-y border-slate-200 bg-slate-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              {researchStats.map((s, idx) => (
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

        {/* ─── RESEARCH FOCUS AREAS (Cards) ─── */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
              <span className="px-3 py-1 rounded-full bg-blue-50 text-[#005689] border border-blue-200/80 text-xs font-bold uppercase tracking-wider">
                Inquiry Pillars
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight" style={{ color: '#003c6e' }}>
                Key Research Focus Areas
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                CSEEL is dedicated to establishing evidence-based pedagogy that proves what works in Indian science classrooms.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {focusAreas.map((fa, i) => (
                <div
                  key={i}
                  className="bg-white rounded-3xl p-8 border border-slate-200 hover:border-[#005689]/40 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className={`w-12 h-12 rounded-2xl ${fa.color} border flex items-center justify-center shrink-0`}>
                      <fa.icon className="w-6 h-6" />
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#005689] transition-colors" style={{ color: '#003c6e' }}>
                      {fa.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {fa.desc}
                    </p>

                    <div className="pt-3 border-t border-slate-100 space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Key Empirical Outcomes</h4>
                      {fa.findings.map((f, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ─── PUBLISHED PAPERS SECTION ─── */}
        <section className="py-16 sm:py-20 bg-[#F8FAFC] border-y border-slate-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <span className="text-xs font-bold text-[#005689] uppercase tracking-wider">Peer-Reviewed Literature</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900" style={{ color: '#003c6e' }}>
                Recent Publications & Whitepapers
              </h2>
            </div>

            <div className="space-y-4">
              {publishedPapers.map((p, idx) => (
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
                        {p.title}
                      </h4>
                      <p className="text-xs font-semibold text-[#005689] mt-1">
                        {p.journal}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                        <span>{p.authors}</span>
                        <span>•</span>
                        <span className="font-bold text-emerald-700">{p.downloads}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => openDemoModal({
                      title: `Download Paper: ${p.title}`,
                      subtitle: 'We will send the full peer-reviewed PDF paper to your email address.'
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

        {/* ─── RESEARCH FAQ ─── */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 space-y-2">
              <span className="text-xs font-bold text-[#005689] uppercase tracking-wider">Research FAQ</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900" style={{ color: '#003c6e' }}>
                Academic Inquiries
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
                  Academic Partnerships
                </span>

                <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight" style={{ color: '#ffffff' }}>
                  Collaborate on the Future of STEM Pedagogy
                </h2>

                <p className="text-xs sm:text-base text-slate-100/90 max-w-xl mx-auto leading-relaxed">
                  Join our nationwide educational research consortium. Partner with CSEEL on grant-funded efficacy studies, learning analytics, and curriculum innovation.
                </p>

                <div className="flex flex-col sm:flex-row gap-3.5 justify-center pt-2">
                  <Link
                    href="/contact-us"
                    className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-400 to-cyan-500 text-slate-950 hover:brightness-105 transition-all shadow-lg shadow-cyan-500/25 active:scale-[0.98]"
                  >
                    <span>Contact Research Team</span>
                  </Link>

                  <button
                    onClick={() => openDemoModal({ title: 'Join CSEEL Research Advisory' })}
                    className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/25 backdrop-blur-sm transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <span>Join Advisory Board</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </PageTransition>
  );
}
