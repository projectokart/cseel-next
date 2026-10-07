'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PageTransition from '@/components/shared/PageTransition';
import OtherLabSolutions from '@/components/composite/OtherLabSolutions';
import { SCHEMES_DATA } from '@/lib/schemesData';
import { 
  Search, 
  ArrowRight, 
  ShieldCheck, 
  Download, 
  ExternalLink, 
  Building2, 
  CheckCircle2, 
  ChevronRight, 
  Sparkles,
  Phone,
  Mail,
  User,
  MapPin,
  Calendar,
  Clock,
  Award,
  Layers,
  FileSpreadsheet
} from 'lucide-react';

export default function SchemesHubClient() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Grants' | 'Innovation' | 'Policy'>('All');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formState, setFormState] = useState({
    schoolName: '',
    contactPerson: '',
    phone: '',
    email: '',
    cityState: '',
    schemeOfInterest: 'PM SHRI Schools Scheme'
  });

  const schemesList = Object.values(SCHEMES_DATA);

  const filteredSchemes = schemesList.filter(scheme => {
    const matchesSearch = 
      scheme.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scheme.shortTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scheme.tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scheme.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Grants' && (scheme.slug === 'pm-shri' || scheme.slug === 'samagra-shiksha')) return true;
    if (selectedCategory === 'Innovation' && (scheme.slug === 'atl-grants' || scheme.slug === 'cbse-skill-hub')) return true;
    if (selectedCategory === 'Policy' && (scheme.slug === 'nep-2020-guidelines')) return true;

    return true;
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <PageTransition>
      <div className="bg-[#F8FAFC] min-h-screen text-slate-800">
        
        {/* ── Breadcrumb Bar ── */}
        <div className="bg-white border-b border-slate-200 py-3.5 px-3 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
            <nav className="flex flex-wrap items-center gap-2 text-slate-500" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-[#005689] transition-colors">Home</Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[#005689] font-semibold">Government Schemes &amp; School Grants Hub</span>
            </nav>

            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Ministry of Education &amp; NITI Aayog Verified
            </span>
          </div>
        </div>

        {/* ── Hero Banner Section ── */}
        <section className="bg-gradient-to-br from-[#002b4d] via-[#003c6e] to-[#005689] text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
          
          <div className="max-w-7xl mx-auto relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-cyan-200">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>National Educational Grant &amp; Modernization Framework 2026</span>
            </div>

            <div className="max-w-3xl space-y-3">
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight" style={{ color: 'white' }}>
                Government Schemes, School Grants &amp; Lab Infrastructure Blueprint
              </h1>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                Comprehensive step-by-step guides for PM SHRI, NITI Aayog ATL ₹20 Lakhs, Samagra Shiksha Abhiyan, NEP 2020 Experiential STEAM, and CBSE Skill Hubs. Complete with official circulars, GFR-2017 norms, and turnkey GeM procurement assistance.
              </p>
            </div>

            {/* Quick Search & Filter Bar */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-2xl">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search scheme, e.g. PM SHRI, ATL, 20 Lakh, Composite..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white text-slate-800 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300 shadow-lg"
                />
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {(['All', 'Grants', 'Innovation', 'Policy'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-cyan-400 text-slate-950 shadow-md'
                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* 4 Highlights Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/15 text-xs text-cyan-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-300 shrink-0" />
                <span>₹27,360 Cr PM SHRI Outlay</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-300 shrink-0" />
                <span>₹20 Lakhs Per ATL Lab</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-300 shrink-0" />
                <span>GFR-2017 &amp; GeM Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-300 shrink-0" />
                <span>100% PFMS Audit Support</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Main Directory Grid ── */}
        <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#005689] block">
                Flagship Schemes &amp; Funding Directives
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1" style={{ color: '#003c6e' }}>
                Explore National Grant Programs for School Modernization
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Showing {filteredSchemes.length} of {schemesList.length} Central &amp; State Schemes
            </span>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSchemes.map((scheme) => (
              <article 
                key={scheme.slug} 
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col group"
              >
                {/* Image Header with Badge */}
                <div className="relative aspect-16/9 bg-slate-900 overflow-hidden">
                  <img
                    src={scheme.heroImage}
                    alt={scheme.heroImageAlt}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/90 backdrop-blur-md text-[#005689] border border-white/20 shadow-xs">
                      {scheme.badge}
                    </span>
                  </div>
                  <div className="absolute bottom-2 right-2 px-2.5 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-xs text-white text-[10px] font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-300" />
                    <span>{scheme.readTime}</span>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 font-semibold">
                      <span className="text-[#005689]">{scheme.eyebrow}</span>
                      <span>•</span>
                      <span>{scheme.updatedDate}</span>
                    </div>

                    <h3 className="font-black text-slate-900 text-base sm:text-lg group-hover:text-[#005689] transition-colors leading-snug">
                      <Link href={`/schemes/${scheme.slug}`}>
                        {scheme.shortTitle}
                      </Link>
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {scheme.tagline}
                    </p>
                  </div>

                  {/* Highlights Bullet List */}
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1.5 text-xs text-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Grant Envelope:</span>
                      <span className="font-bold text-[#005689]">{scheme.stats[0]?.value || 'Govt Allocated'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Lab Mandate:</span>
                      <span className="font-semibold text-slate-800 text-[11px]">
                        {scheme.labInfrastructure.labTypes[0]?.name.slice(0, 24)}...
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Target Level:</span>
                      <span className="font-semibold text-slate-800 text-[11px]">
                        {scheme.slug === 'atl-grants' ? 'Classes 6 to 12' : scheme.slug === 'nep-2020-guidelines' ? '5+3+3+4 Spectrum' : 'Secondary & Sr. Sec.'}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <Link
                      href={`/schemes/${scheme.slug}`}
                      className="flex-1 py-2 px-3 rounded-xl bg-[#005689] text-white font-bold text-xs hover:bg-[#003c6e] transition flex items-center justify-center gap-1.5"
                    >
                      <span>Read Full Guide</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    {scheme.officialLinks[0] && (
                      <a
                        href={scheme.officialLinks[0].url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-[#005689] hover:bg-slate-50 transition"
                        title="Official Government Portal"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* ── Comprehensive Comparison Matrix Table ── */}
          <div className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#005689] block">
                Quick Comparison Matrix
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1" style={{ color: '#003c6e' }}>
                Comparative Breakdown: All 5 Govt Schemes &amp; Grants
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Evaluate budget ceilings, mandated school categories, funding patterns, and lab equipment scope at a glance:
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="sm:hidden text-[10px] text-slate-500 italic flex items-center justify-end gap-1 font-medium">
                <span>↔ Swipe horizontally to view full table</span>
              </div>
              <div className="rounded-xl border border-slate-200 overflow-x-auto shadow-2xs w-full scrollbar-thin">
                <table className="min-w-[700px] w-full text-left text-xs">
                  <thead className="bg-[#EDF5FA] text-[#003c6e] font-bold uppercase border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Government Scheme</th>
                      <th className="py-2.5 px-3">Max Grant / Outlay</th>
                      <th className="py-2.5 px-3">Eligible Schools</th>
                      <th className="py-2.5 px-3">Mandated Lab Type</th>
                      <th className="py-2.5 px-3">Executing Portal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-bold text-slate-900">
                        <Link href="/schemes/pm-shri" className="text-[#005689] hover:underline">
                          PM SHRI Schools Scheme
                        </Link>
                      </td>
                      <td className="py-2.5 px-3 font-extrabold text-emerald-700">₹27,360 Cr (₹1-2 Cr/school)</td>
                      <td className="py-2.5 px-3 text-slate-700">14,500+ Govt/KV/JNV/State Schools</td>
                      <td className="py-2.5 px-3 text-slate-600">Integrated Science &amp; ATL Tinkering</td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">pmshrischools.education.gov.in</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-bold text-slate-900">
                        <Link href="/schemes/atl-grants" className="text-[#005689] hover:underline">
                          NITI Aayog ATL Grants
                        </Link>
                      </td>
                      <td className="py-2.5 px-3 font-extrabold text-emerald-700">₹20 Lakhs (5 Years)</td>
                      <td className="py-2.5 px-3 text-slate-700">Govt, Aided &amp; Private (Classes 6-12)</td>
                      <td className="py-2.5 px-3 text-slate-600">3D Printing, Robotics &amp; DIY Maker</td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">atl.aim.gov.in / PFMS [0217]</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-bold text-slate-900">
                        <Link href="/schemes/samagra-shiksha" className="text-[#005689] hover:underline">
                          Samagra Shiksha Abhiyan
                        </Link>
                      </td>
                      <td className="py-2.5 px-3 font-extrabold text-emerald-700">₹10K–₹1L/yr CSG + Up to ₹10L Lab</td>
                      <td className="py-2.5 px-3 text-slate-700">Government &amp; Aided High Schools</td>
                      <td className="py-2.5 px-3 text-slate-600">Secondary Science &amp; Glassware Replenishment</td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">samagrashiksha.education.gov.in</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-bold text-slate-900">
                        <Link href="/schemes/nep-2020-guidelines" className="text-[#005689] hover:underline">
                          NEP 2020 Lab Guidelines
                        </Link>
                      </td>
                      <td className="py-2.5 px-3 font-extrabold text-purple-700">Curricular Mandate</td>
                      <td className="py-2.5 px-3 text-slate-700">All Recognized CBSE/ICSE/State Schools</td>
                      <td className="py-2.5 px-3 text-slate-600">Experiential STEAM &amp; 10 Bagless Days</td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">education.gov.in / NCF-SE 2023</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-bold text-slate-900">
                        <Link href="/schemes/cbse-skill-hub" className="text-[#005689] hover:underline">
                          CBSE Skill Hub Initiative
                        </Link>
                      </td>
                      <td className="py-2.5 px-3 font-extrabold text-emerald-700">PMKVY 4.0 Training Cost</td>
                      <td className="py-2.5 px-3 text-slate-700">CBSE Affiliated Secondary/Sr. Sec.</td>
                      <td className="py-2.5 px-3 text-slate-600">Composite Skill Lab (AI, Design &amp; Coding)</td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">cbseacademic.nic.in / SIDH</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ── DPR & Grant Assistance Consultation Form ── */}
          <div className="bg-gradient-to-br from-white to-[#EDF5FA] p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#005689] bg-[#EDF5FA] px-3 py-1 rounded-full border border-[#005689]/20">
                End-to-End Turnkey Support
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight" style={{ color: '#003c6e' }}>
                Need Assistance with School DPR, GeM Bidding, or PFMS Setup?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                CSEEL is a Government e-Marketplace (GeM) registered turnkey educational solution provider. We assist school principals, administrators, and trust committees with comprehensive DPR creation, equipment supply (Package 1–4 &amp; 49 Science items), and teacher training.
              </p>
              <div className="grid grid-cols-2 gap-3 text-xs text-slate-700 pt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>GeM OEM Verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Custom BOQ Creation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>PFMS GFR-2017 Invoicing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Pan-India Onsite Setup</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
              {formSubmitted ? (
                <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-emerald-900 text-base">Consultation Request Received!</h4>
                  <p className="text-xs text-emerald-700">
                    Our lead grant specialist will contact you directly within 2 business hours with official guidelines and a turnkey proposal.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">School / Institution Name *</label>
                    <div className="relative">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={formState.schoolName}
                        onChange={(e) => setFormState({ ...formState, schoolName: e.target.value })}
                        placeholder="School Name"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#005689] bg-slate-50/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Principal / Coordinator *</label>
                      <div className="relative">
                        <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          required
                          value={formState.contactPerson}
                          onChange={(e) => setFormState({ ...formState, contactPerson: e.target.value })}
                          placeholder="Your Name"
                          className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#005689] bg-slate-50/50"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Phone Number *</label>
                      <div className="relative">
                        <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="tel"
                          required
                          value={formState.phone}
                          onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                          placeholder="Phone Number"
                          className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#005689] bg-slate-50/50"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">City, State *</label>
                      <div className="relative">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          required
                          value={formState.cityState}
                          onChange={(e) => setFormState({ ...formState, cityState: e.target.value })}
                          placeholder="City, State"
                          className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#005689] bg-slate-50/50"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Target Scheme</label>
                      <select
                        value={formState.schemeOfInterest}
                        onChange={(e) => setFormState({ ...formState, schemeOfInterest: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-medium"
                      >
                        <option value="PM SHRI Schools Scheme">PM SHRI Schools Scheme</option>
                        <option value="NITI Aayog ATL Grants">NITI Aayog ATL Grants</option>
                        <option value="Samagra Shiksha Abhiyan">Samagra Shiksha Abhiyan</option>
                        <option value="NEP 2020 Lab Guidelines">NEP 2020 Lab Guidelines</option>
                        <option value="CBSE Skill Hub Initiative">CBSE Skill Hub Initiative</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-[#005689] text-white font-bold hover:bg-[#003c6e] transition shadow-sm text-xs flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                  >
                    <span>Request Free DPR &amp; Consultation</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

        </section>

        {/* ── Bottom Section: Other School Lab Solutions ── */}
        <OtherLabSolutions />

      </div>
    </PageTransition>
  );
}
