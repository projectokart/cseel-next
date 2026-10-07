'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PageTransition from '@/components/shared/PageTransition';
import OtherLabSolutions from '@/components/composite/OtherLabSolutions';
import SidebarOtherLabsWidget from '@/components/composite/SidebarOtherLabsWidget';
import { 
  MaterialSubpageContent,
  SpaceSubpageContent,
  VendorSubpageContent,
  CostSubpageContent,
  CbseSopSubpageContent,
  SkillEducationSubpageContent
} from '@/components/composite/SubpageContentSections';
import { 
  CompositeSubPageData,
  COMPOSITE_LAB_SUBPAGES,
  CBSE_SOP_NON_CONSUMABLES,
  CBSE_SOP_CONSUMABLES,
  CBSE_SOP_GENERAL_REQUIREMENTS
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
  Tag
} from 'lucide-react';

interface Props {
  data: CompositeSubPageData;
}

export default function SubslugClient({ data }: Props) {
  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [formState, setFormState] = useState({
    schoolName: '',
    contactPerson: '',
    phone: '',
    email: '',
    cityState: '',
    requirement: data.title
  });

  const otherSubpages = Object.values(COMPOSITE_LAB_SUBPAGES).filter(
    (item) => item.slug !== data.slug
  );

  // Find previous and next pages for post navigation
  const allSubkeys = Object.keys(COMPOSITE_LAB_SUBPAGES);
  const currentIndex = allSubkeys.indexOf(data.slug);
  const prevSub = currentIndex > 0 ? COMPOSITE_LAB_SUBPAGES[allSubkeys[currentIndex - 1]] : null;
  const nextSub = currentIndex < allSubkeys.length - 1 ? COMPOSITE_LAB_SUBPAGES[allSubkeys[currentIndex + 1]] : null;

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
      const text = encodeURIComponent(`Check out ${data.title} on CSEEL: `);
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
              <Link href="/composite-lab" className="hover:text-[#005689] transition-colors">Composite Lab</Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[#005689] font-semibold">{data.badge}</span>
            </nav>

            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3 h-3 text-emerald-600" /> CBSE SARAS SOP Verified
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
                  {data.badge}
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-[#005689]" /> October 2026
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5 text-[#005689]" /> 6 min read
                </span>
                <span>•</span>
                <span className="font-semibold text-slate-700">By Devendra Singh</span>
              </div>

              {/* Article Main H1 Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#003c6e] leading-tight tracking-tight">
                {data.title}
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
                  src={data.image || "/images/cbse-composite-science-lab-3d.jpg"}
                  alt={`${data.title} - CBSE Composite Science Lab Guide`}
                  className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
                />

                <div className="absolute top-3 left-3 px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md text-white border border-white/20 text-[11px] font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{data.badge}</span>
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
                {data.tagline}
              </div>

              {/* Article Body Content */}
              <div className="space-y-8 text-slate-700 text-sm leading-relaxed">
                
                {/* Topic Core Highlights Card */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2" style={{ color: '#003c6e' }}>
                    <ShieldCheck className="w-4 h-4 text-[#005689]" />
                    <span>Essential Compliance Highlights ({data.badge})</span>
                  </h3>
                  <div className="space-y-2">
                    {data.coreHighlights.map((hl, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ═════════ 100% DEDICATED TOPIC CONTENT ═════════ */}
                {data.slug === 'material' && <MaterialSubpageContent />}
                {data.slug === 'space' && <SpaceSubpageContent />}
                {data.slug === 'vendor' && <VendorSubpageContent />}
                {data.slug === 'cost' && <CostSubpageContent />}
                {data.slug === 'cbse-sop' && <CbseSopSubpageContent />}
                {data.slug === 'skill-education' && <SkillEducationSubpageContent />}

                {/* Frequently Asked Questions */}
                <div className="pt-4 border-t border-slate-100">
                  <h2 className="text-xl sm:text-2xl font-black text-[#003c6e] mb-3">
                    Frequently Asked Questions ({data.badge})
                  </h2>
                  <div className="space-y-2.5">
                    {data.faqs.map((faq, idx) => (
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
                {['CBSEAffiliation', 'CompositeLab', 'SARASSOP', 'STEMIndia', data.badge].map((tag) => (
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

              {/* Previous / Next Article Navigation (STEMROBO Style) */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 text-xs">
                {prevSub ? (
                  <Link href={`/composite-lab/${prevSub.slug}`} className="group p-3 rounded-xl border border-slate-200 hover:border-[#005689] transition">
                    <span className="text-slate-400 flex items-center gap-1 text-[11px] mb-1">
                      <ChevronLeft className="w-3 h-3" /> Previous
                    </span>
                    <span className="font-bold text-slate-800 group-hover:text-[#005689] line-clamp-1">
                      {prevSub.title}
                    </span>
                  </Link>
                ) : <div />}

                {nextSub ? (
                  <Link href={`/composite-lab/${nextSub.slug}`} className="group p-3 rounded-xl border border-slate-200 hover:border-[#005689] transition text-right">
                    <span className="text-slate-400 flex items-center justify-end gap-1 text-[11px] mb-1">
                      Next <ChevronRight className="w-3 h-3" />
                    </span>
                    <span className="font-bold text-slate-800 group-hover:text-[#005689] line-clamp-1">
                      {nextSub.title}
                    </span>
                  </Link>
                ) : <div />}
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
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
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
                    <p className="text-[11px] text-slate-600">Our lab consultant will call you within 24 hours.</p>
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

              {/* Latest Posts / Guides Widget */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-700 pb-2 border-b border-slate-100">
                  Latest Composite Lab Guides
                </h4>

                <div className="space-y-3">
                  {otherSubpages.map((p) => (
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
