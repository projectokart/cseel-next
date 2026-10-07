'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PageTransition from '@/components/shared/PageTransition';
import OtherLabSolutions from '@/components/composite/OtherLabSolutions';
import { SchemeArticleData, SCHEMES_DATA } from '@/lib/schemesData';
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
  Building2, 
  Check, 
  Tag, 
  AlertTriangle,
  FileText,
  DollarSign,
  Phone,
  Mail,
  User,
  MapPin,
  ExternalLink,
  Award,
  BookOpen,
  Sparkles
} from 'lucide-react';

interface Props {
  scheme: SchemeArticleData;
}

export default function StandardArticleLayout({ scheme }: Props) {
  const [copied, setCopied] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formState, setFormState] = useState({
    schoolName: '',
    contactPerson: '',
    phone: '',
    email: '',
    cityState: '',
    schemeRequirement: scheme.shortTitle
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
      const text = encodeURIComponent(`${scheme.title} — Detailed Guide on CSEEL: `);
      window.open(`https://api.whatsapp.com/send?text=${text}${url}`, '_blank');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  // Get other schemes for cross-navigation
  const allSchemesList = Object.values(SCHEMES_DATA);

  return (
    <PageTransition>
      <div className="bg-[#F8FAFC] min-h-screen text-slate-800">
        
        {/* ── Breadcrumb Bar ── */}
        <div className="bg-white border-b border-slate-200 py-3.5 px-3 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
            <nav className="flex flex-wrap items-center gap-2 text-slate-500" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-[#005689] transition-colors">Home</Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <Link href="/schemes" className="hover:text-[#005689] transition-colors">Govt Schemes &amp; Grants</Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[#005689] font-semibold">{scheme.shortTitle}</span>
            </nav>

            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Govt Scheme Verified
            </span>
          </div>
        </div>

        {/* ── Main 2-Column Standard Article Layout (STEMROBO Style) ── */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">

            {/* ═════════ LEFT COLUMN: MAIN ARTICLE (8 Cols) ═════════ */}
            <main className="lg:col-span-8 bg-white p-4 sm:p-8 md:p-10 rounded-3xl border border-slate-200 shadow-xs space-y-6">

              {/* Category Badge & Meta Information */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span className="px-3 py-1 rounded-full font-black uppercase text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 tracking-wider">
                  {scheme.badge}
                </span>
                <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md">
                  {scheme.eyebrow}
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-[#005689]" /> {scheme.updatedDate}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5 text-[#005689]" /> {scheme.readTime}
                </span>
                <span>•</span>
                <span className="font-semibold text-slate-700">By {scheme.author.name}</span>
              </div>

              {/* Article Main H1 Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black leading-tight tracking-tight" style={{ color: '#003c6e' }}>
                {scheme.title}
              </h1>

              {/* Author Info & Social Share Bar */}
              <div className="flex items-center justify-between flex-wrap gap-4 py-3.5 border-y border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#005689] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    {scheme.author.initials}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs sm:text-sm">{scheme.author.name}</div>
                    <div className="text-[11px] text-slate-500">{scheme.author.role} • CSEEL India</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleShareLinkedIn}
                    className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-[#0077b5] transition"
                    title="Share on LinkedIn"
                    aria-label="Share on LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleShareWhatsApp}
                    className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-[#25D366] transition"
                    title="Share on WhatsApp"
                    aria-label="Share on WhatsApp"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
                    title="Copy Link"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Link2 className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>

              {/* Featured Banner Image */}
              <div className="relative aspect-video sm:aspect-21/9 rounded-2xl overflow-hidden bg-slate-900 shadow-inner group">
                <img
                  src={scheme.heroImage}
                  alt={scheme.heroImageAlt}
                  className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
                />
                <div className="absolute top-3 left-3 px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md text-white border border-white/20 text-[11px] font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Official Govt Gazette &amp; Guidelines Verified</span>
                </div>
              </div>

              {/* Tagline / Executive Summary Callout */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50/70 to-blue-50/50 border-l-4 border-emerald-600 text-sm text-slate-700 leading-relaxed font-medium">
                {scheme.tagline}
              </div>

              {/* Key Scheme Statistics 4-Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {scheme.stats.map((st, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center flex flex-col justify-center">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">{st.label}</span>
                    <span className="text-base sm:text-lg font-black text-[#003c6e] mt-0.5 block">{st.value}</span>
                    <span className="text-[10px] text-slate-500 mt-0.5 block leading-tight">{st.detail}</span>
                  </div>
                ))}
              </div>

              {/* ── TOP ACTION BAR: OFFICIAL CIRCULARS & DOWNLOADS (Compact & Blue Links) ── */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-[#F0F7FB] border border-[#B9DCF2] shadow-xs space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-[#D4E8F5] pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#005689] animate-pulse" />
                    <span className="text-[11px] font-black uppercase tracking-wider text-[#005689]">
                      Official Government Directives &amp; Verified Portals
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-[#005689] bg-white px-2.5 py-0.5 rounded-full border border-[#B9DCF2] self-start sm:self-auto">
                    Direct Official URLs
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {scheme.officialLinks.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-white hover:bg-blue-50/60 border border-slate-200 hover:border-[#005689] shadow-2xs hover:shadow-xs transition flex items-center justify-between group cursor-pointer"
                    >
                      <div className="min-w-0 pr-2 space-y-0.5">
                        <div className="font-bold text-[#005689] group-hover:text-[#003c6e] group-hover:underline flex items-center gap-1.5 text-xs truncate">
                          {link.isPdf ? (
                            <Download className="w-3.5 h-3.5 text-[#005689] shrink-0" />
                          ) : (
                            <ExternalLink className="w-3.5 h-3.5 text-[#005689] shrink-0" />
                          )}
                          <span className="truncate">{link.title}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 truncate flex items-center gap-1">
                          <span className="text-emerald-700 font-semibold">{link.isPdf ? 'PDF Directive' : 'Official Portal'} •</span>
                          <span className="text-[#0284c7] font-medium">{link.subtitle}</span>
                        </div>
                      </div>

                      <span className="shrink-0 text-[10px] font-bold text-[#005689] bg-[#EDF5FA] group-hover:bg-[#005689] group-hover:text-white px-2.5 py-1 rounded-lg border border-[#B9DCF2] transition flex items-center gap-1">
                        <span>{link.isPdf ? 'Download' : 'Open Link'}</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Main Content Body */}
              <div className="space-y-8 text-slate-700 text-sm leading-relaxed">

                {/* Section 1: Overview */}
                <div className="space-y-3">
                  <h2 className="text-xl sm:text-2xl font-black" style={{ color: '#003c6e' }}>
                    {scheme.overview.heading}
                  </h2>
                  {scheme.overview.paragraphs.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                  {scheme.overview.calloutText && (
                    <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-950 font-medium text-xs">
                      {scheme.overview.calloutText}
                    </div>
                  )}
                </div>

                {/* Section 2: Eligibility */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <h2 className="text-xl sm:text-2xl font-black" style={{ color: '#003c6e' }}>
                    {scheme.eligibility.heading}
                  </h2>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                    {scheme.eligibility.bullets.map((b, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                  {scheme.eligibility.note && (
                    <p className="text-xs text-amber-800 bg-amber-50 p-3 rounded-xl border border-amber-200 font-medium">
                      {scheme.eligibility.note}
                    </p>
                  )}
                </div>

                {/* Section 3: Financial & Grant Allocation Matrix */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black" style={{ color: '#003c6e' }}>
                      {scheme.financialMatrix.heading}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">{scheme.financialMatrix.intro}</p>
                  </div>

                  {/* Responsive Scrollable Table */}
                  <div className="space-y-1.5">
                    <div className="sm:hidden text-[10px] text-slate-500 italic flex items-center justify-end gap-1 font-medium">
                      <span>↔ Swipe horizontally to view full table</span>
                    </div>
                    <div className="rounded-xl border border-slate-200 overflow-x-auto shadow-2xs w-full scrollbar-thin">
                      <table className="min-w-[620px] w-full text-left text-xs">
                        <thead className="bg-[#EDF5FA] text-[#003c6e] font-bold uppercase border-b border-slate-200">
                          <tr>
                            <th className="py-2.5 px-3">Grant Head / Component</th>
                            <th className="py-2.5 px-3">Allocation Slabs</th>
                            <th className="py-2.5 px-3">Expenditure Nature</th>
                            <th className="py-2.5 px-3">Permissible Scope &amp; GFR Rules</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {scheme.financialMatrix.items.map((row, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="py-2.5 px-3 font-bold text-slate-900">{row.component}</td>
                              <td className="py-2.5 px-3 font-extrabold text-[#005689] whitespace-nowrap">{row.allocation}</td>
                              <td className="py-2.5 px-3">
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 whitespace-nowrap">
                                  {row.nature}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-slate-600 text-[11px] leading-relaxed">{row.rules}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold text-xs flex items-center justify-between">
                    <span>Total Grant Envelope:</span>
                    <span className="text-emerald-800 text-sm font-black">{scheme.financialMatrix.totalOrMaxGrant}</span>
                  </div>
                </div>

                {/* Section 4: Mandatory Lab Setup & Equipment Specifications */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black" style={{ color: '#003c6e' }}>
                      {scheme.labInfrastructure.heading}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">{scheme.labInfrastructure.intro}</p>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {scheme.labInfrastructure.labTypes.map((lab, idx) => (
                      <div key={idx} className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-200 pb-2">
                          <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-[#005689] text-white flex items-center justify-center text-xs font-bold shrink-0">
                              {idx + 1}
                            </span>
                            <span>{lab.name}</span>
                          </h3>
                          <span className="text-xs font-bold text-[#005689] bg-[#EDF5FA] px-2.5 py-0.5 rounded-full self-start sm:self-auto">
                            {lab.sqft}
                          </span>
                        </div>

                        <ul className="space-y-1.5 text-xs text-slate-600">
                          {lab.hardware.map((hw, hIdx) => (
                            <li key={hIdx} className="flex items-start gap-2">
                              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{hw}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="pt-2 border-t border-slate-200/60 text-[11px] text-slate-500 font-medium">
                          <strong>Mandate / Outcome:</strong> {lab.mandate}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 5: Step-by-Step Application & Procurement Process */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black" style={{ color: '#003c6e' }}>
                      {scheme.processSteps.heading}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">{scheme.processSteps.intro}</p>
                  </div>

                  <div className="space-y-3">
                    {scheme.processSteps.steps.map((st) => (
                      <div key={st.step} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-start gap-3.5">
                        <div className="w-8 h-8 rounded-xl bg-[#005689] text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                          {st.step}
                        </div>
                        <div className="space-y-1 flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <h4 className="font-bold text-slate-900 text-sm">{st.title}</h4>
                            {st.portal && (
                              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md self-start sm:self-auto">
                                🔗 {st.portal}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">{st.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 6: Compliance, Audits & Caution */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <h2 className="text-xl sm:text-2xl font-black" style={{ color: '#003c6e' }}>
                    {scheme.complianceAndAudits.heading}
                  </h2>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    {scheme.complianceAndAudits.points.map((pt, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                        <ShieldCheck className="w-4 h-4 text-[#005689] shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <p className="font-medium leading-relaxed">{scheme.complianceAndAudits.warningNote}</p>
                  </div>
                </div>

                {/* Section 7: FAQs Accordion */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <h2 className="text-xl sm:text-2xl font-black" style={{ color: '#003c6e' }}>
                    Frequently Asked Questions (FAQ)
                  </h2>
                  <div className="space-y-2.5">
                    {scheme.faqs.map((faq, idx) => (
                      <details key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 group open:bg-white open:shadow-xs transition">
                        <summary className="font-bold text-xs sm:text-sm text-slate-900 cursor-pointer list-none flex items-center justify-between">
                          <span>{faq.q}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-open:rotate-90 transition-transform" />
                        </summary>
                        <p className="text-xs text-slate-600 mt-2.5 pt-2.5 border-t border-slate-100 leading-relaxed">
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
                {scheme.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Author Bio Box */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#005689] text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-sm">
                  {scheme.author.initials}
                </div>
                <div className="text-center sm:text-left space-y-1">
                  <h4 className="font-bold text-slate-900 text-sm">{scheme.author.name}</h4>
                  <div className="text-xs font-medium text-[#005689]">{scheme.author.role}</div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {scheme.author.bio}
                  </p>
                </div>
              </div>

            </main>

            {/* ═════════ RIGHT COLUMN: SIDEBAR (4 Cols) ═════════ */}
            <aside className="lg:col-span-4 space-y-6">

              {/* Consultation Lead Capture Card */}
              <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#005689] bg-[#EDF5FA] px-2.5 py-0.5 rounded-full inline-block mb-1">
                    Free DPR &amp; Grant Assistance
                  </span>
                  <h3 className="font-black text-slate-900 text-base" style={{ color: '#003c6e' }}>
                    Apply or Upgrade Under {scheme.shortTitle}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Get end-to-end turnkey DPR, GeM specifications, and PFMS compliance support from CSEEL experts.
                  </p>
                </div>

                {formSubmitted ? (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                    <h4 className="font-bold text-emerald-900 text-sm">Request Submitted!</h4>
                    <p className="text-xs text-emerald-700">
                      Our grant consultant will call you within 2 business hours with the complete BOQ and proposal.
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
                          placeholder="e.g. Kendriya Vidyalaya / Public School"
                          className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#005689] bg-slate-50/50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Principal / Coordinator Name *</label>
                      <div className="relative">
                        <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          required
                          value={formState.contactPerson}
                          onChange={(e) => setFormState({ ...formState, contactPerson: e.target.value })}
                          placeholder="Full Name"
                          className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#005689] bg-slate-50/50"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Phone Number *</label>
                        <div className="relative">
                          <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                          <input
                            type="tel"
                            required
                            value={formState.phone}
                            onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                            placeholder="Mobile"
                            className="w-full pl-8 pr-2.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#005689] bg-slate-50/50"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">City, State *</label>
                        <div className="relative">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                          <input
                            type="text"
                            required
                            value={formState.cityState}
                            onChange={(e) => setFormState({ ...formState, cityState: e.target.value })}
                            placeholder="City, State"
                            className="w-full pl-8 pr-2.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#005689] bg-slate-50/50"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Target Scheme Requirement</label>
                      <input
                        type="text"
                        readOnly
                        value={formState.schemeRequirement}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-100 text-slate-700 font-semibold cursor-not-allowed"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 rounded-xl bg-[#005689] text-white font-bold hover:bg-[#003c6e] transition shadow-sm text-xs flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                    >
                      <span>Request Free DPR &amp; Quote</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </form>
                )}
              </div>

              {/* All Govt Schemes & Grants Navigator */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <h3 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                    <span>🏛️</span>
                    <span>All Govt Schemes &amp; Grants</span>
                  </h3>
                  <Link href="/schemes" className="text-[11px] font-bold text-[#005689] hover:underline">
                    View All
                  </Link>
                </div>

                <div className="space-y-1.5">
                  {allSchemesList.map((sc) => {
                    const isActive = sc.slug === scheme.slug;
                    return (
                      <Link
                        key={sc.slug}
                        href={`/schemes/${sc.slug}`}
                        className={`p-2.5 rounded-xl transition flex items-center justify-between text-xs ${
                          isActive
                            ? 'bg-[#EDF5FA] text-[#005689] font-bold border border-[#005689]/20'
                            : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isActive ? 'bg-[#005689]' : 'bg-slate-300'}`} />
                          <span className="truncate">{sc.shortTitle}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0 font-medium ml-1">
                          {sc.badge}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Composite Science & Skill Lab Hub Cross-link */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 space-y-2">
                <span className="text-[10px] font-black uppercase text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md inline-block">
                  CBSE Affiliation Norms
                </span>
                <h4 className="font-bold text-slate-900 text-xs">Looking for Composite Lab Guidelines?</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Check out the official CBSE Circular 11/2022 and Skill-75/2024 SARAS norms for 600 sq ft lab rooms and 49 apparatus checklist.
                </p>
                <div className="pt-1 flex flex-col gap-1.5 text-xs">
                  <Link href="/composite-lab" className="font-bold text-[#005689] hover:underline flex items-center gap-1">
                    <span>Composite Science Lab Hub</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                  <Link href="/composite-skill-lab" className="font-bold text-purple-700 hover:underline flex items-center gap-1">
                    <span>Composite Skill Lab Guide</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

            </aside>

          </div>
        </div>

        {/* ── Bottom Section: Other School Lab Solutions ── */}
        <OtherLabSolutions />

      </div>
    </PageTransition>
  );
}
