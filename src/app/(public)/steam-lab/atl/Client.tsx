'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PageTransition from '@/components/shared/PageTransition';
import OtherLabSolutions from '@/components/composite/OtherLabSolutions';
import { ATL_SUBPAGES, ATL_OFFICIAL_LINKS } from '@/lib/atlData';
import { 
  AtlOverviewContent, 
  AtlEquipmentContent, 
  AtlInfrastructureContent, 
  AtlCostContent, 
  AtlVendorContent 
} from '@/components/atl/AtlSubpageContentSections';
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
  ExternalLink,
  Cpu,
  Layers,
  Wrench,
  Zap,
  Phone,
  User,
  MapPin
} from 'lucide-react';

interface Props {
  subslug?: 'overview' | 'equipment' | 'infrastructure' | 'cost' | 'vendor';
}

export default function AtlMasterClient({ subslug = 'overview' }: Props) {
  const [copied, setCopied] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formState, setFormState] = useState({
    schoolName: '',
    contactPerson: '',
    phone: '',
    email: '',
    cityState: '',
    requirementType: 'Atal Tinkering Lab (ATL 2.0) Turnkey Setup'
  });

  const currentMeta = ATL_SUBPAGES[subslug] || ATL_SUBPAGES['overview'];

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
      const text = encodeURIComponent(`${currentMeta.title} — Official NITI Aayog Guide on CSEEL: `);
      window.open(`https://api.whatsapp.com/send?text=${text}${url}`, '_blank');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  const navTabs = [
    { slug: 'overview', href: '/steam-lab/atl', label: '1. Overview & Setup', icon: Layers },
    { slug: 'equipment', href: '/steam-lab/atl/equipment', label: '2. Equipment (60 vs 90)', icon: Cpu },
    { slug: 'infrastructure', href: '/steam-lab/atl/infrastructure', label: '3. 4-Zone Layout & Space (1,500 sq ft)', icon: Building2 },
    { slug: 'cost', href: '/steam-lab/atl/cost', label: '4. Cost & ₹20L Grant', icon: Zap },
    { slug: 'vendor', href: '/steam-lab/atl/vendor', label: '5. GeM Turnkey Vendor', icon: Wrench },
  ];

  return (
    <PageTransition>
      <div className="bg-[#F8FAFC] min-h-screen text-slate-800">
        
        {/* ── Breadcrumb Bar ── */}
        <div className="bg-white border-b border-slate-200 py-3.5 px-3 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
            <nav className="flex flex-wrap items-center gap-2 text-slate-500" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-[#005689] transition-colors">Home</Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <Link href="/steam-lab" className="hover:text-[#005689] transition-colors">Lab Solutions</Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <Link href="/steam-lab/atl" className="hover:text-[#005689] transition-colors">Atal Tinkering Lab (ATL 2.0)</Link>
              {subslug !== 'overview' && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-[#005689] font-semibold">{currentMeta.shortTitle}</span>
                </>
              )}
            </nav>

            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" /> NITI Aayog AIM Verified
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
                <span className="px-3 py-1 rounded-full font-black uppercase text-[10px] bg-amber-50 text-amber-800 border border-amber-200 tracking-wider">
                  {currentMeta.badge}
                </span>
                <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md">
                  {currentMeta.eyebrow}
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-[#005689]" /> October 2026
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5 text-[#005689]" /> {currentMeta.readTime}
                </span>
                <span>•</span>
                <span className="font-semibold text-slate-700">By Devendra Singh</span>
              </div>

              {/* Main H1 Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black leading-tight tracking-tight" style={{ color: '#003c6e' }}>
                {currentMeta.title}
              </h1>

              {/* Author & Share Bar */}
              <div className="flex items-center justify-between flex-wrap gap-4 py-3.5 border-y border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#005689] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    DS
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs sm:text-sm">Devendra Singh</div>
                    <div className="text-[11px] text-slate-500">Atal Tinkering Lab Specialist • CSEEL India</div>
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
                  src={currentMeta.heroImage}
                  alt={currentMeta.heroImageAlt}
                  className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
                />
                <div className="absolute top-3 left-3 px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md text-white border border-white/20 text-[11px] font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span>NITI Aayog AIM Official Specifications</span>
                </div>
              </div>

              {/* Tagline Callout */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-50/70 to-blue-50/50 border-l-4 border-amber-500 text-sm text-slate-700 leading-relaxed font-medium">
                {currentMeta.tagline}
              </div>

              {/* ── TOP ACTION BAR: NITI AAYOG OFFICIAL CIRCULARS & DOWNLOADS (Compact & Blue Links) ── */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-[#F0F7FB] border border-[#B9DCF2] shadow-xs space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-[#D4E8F5] pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#005689] animate-pulse" />
                    <span className="text-[11px] font-black uppercase tracking-wider text-[#005689]">
                      Official NITI Aayog Directives &amp; Verified Links
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-[#005689] bg-white px-2.5 py-0.5 rounded-full border border-[#B9DCF2] self-start sm:self-auto">
                    Direct aim.gov.in URLs
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {ATL_OFFICIAL_LINKS.map((link, idx) => (
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
                          <span className="text-emerald-700 font-semibold">{link.isPdf ? 'PDF File' : 'Official Portal'} •</span>
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

              {/* ── Subpage Navigation Pills ── */}
              <div className="space-y-1.5 pt-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Dedicated ATL Resource Sections:
                </span>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
                  {navTabs.map((tab) => {
                    const isActive = subslug === tab.slug;
                    const Icon = tab.icon;
                    return (
                      <Link
                        key={tab.slug}
                        href={tab.href}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
                          isActive
                            ? 'bg-[#005689] text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{tab.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* ── Dynamic Subpage Content Section ── */}
              {subslug === 'overview' && <AtlOverviewContent />}
              {subslug === 'equipment' && <AtlEquipmentContent />}
              {subslug === 'infrastructure' && <AtlInfrastructureContent />}
              {subslug === 'cost' && <AtlCostContent />}
              {subslug === 'vendor' && <AtlVendorContent />}

              {/* Tags Section */}
              <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" /> Tags:
                </span>
                {['AtalTinkeringLab', 'NITIAayog', 'AIM', 'EquipmentList60', 'EquipmentList90', 'Package1to4', 'PFMSGrants'].map((tag) => (
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
                  <div className="text-xs font-medium text-[#005689]">Master Trainer &amp; Educational Lab Architect</div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Lead infrastructure consultant at CSEEL with deep specialization in NITI Aayog Atal Tinkering Labs, CBSE Composite Science Laboratories, and turnkey GeM procurement execution across 250+ schools in India.
                  </p>
                </div>
              </div>

            </main>

            {/* ═════════ RIGHT COLUMN: SIDEBAR (4 Cols) ═════════ */}
            <aside className="lg:col-span-4 space-y-6">

              {/* Consultation Lead Capture Card */}
              <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full inline-block mb-1 border border-amber-200">
                    Turnkey ATL Support
                  </span>
                  <h3 className="font-black text-slate-900 text-base" style={{ color: '#003c6e' }}>
                    Setup or Upgrade Your Atal Tinkering Lab
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Get custom GeM BOQ creation, Package 1-4 quotation, PFMS guidance, and teacher training support.
                  </p>
                </div>

                {formSubmitted ? (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                    <h4 className="font-bold text-emerald-900 text-sm">Inquiry Received!</h4>
                    <p className="text-xs text-emerald-700">
                      Our ATL consultant will contact you within 2 business hours with official specifications and pricing.
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
                          placeholder="e.g. DPS / St. Xavier / KV"
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
                      <label className="font-bold text-slate-700 block mb-1">Setup Requirement</label>
                      <select
                        value={formState.requirementType}
                        onChange={(e) => setFormState({ ...formState, requirementType: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-medium"
                      >
                        <option value="ATL 2.0 Turnkey Setup (Package 1-4)">ATL 2.0 Turnkey Setup (Package 1-4)</option>
                        <option value="60-Students Batch Equipment Kit">60-Students Batch Equipment Kit</option>
                        <option value="90-Students Batch Equipment Kit">90-Students Batch Equipment Kit</option>
                        <option value="3D Printer & Robotics Replenishment">3D Printer &amp; Robotics Replenishment</option>
                        <option value="PFMS Tranche 2/3 UC Guidance">PFMS Tranche 2/3 UC Guidance</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 rounded-xl bg-[#005689] text-white font-bold hover:bg-[#003c6e] transition shadow-sm text-xs flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                    >
                      <span>Request Free ATL Quote &amp; DPR</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </form>
                )}
              </div>

              {/* ATL Cluster Navigator */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <h3 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                    <span>🔬</span>
                    <span>ATL 2.0 Topic Clusters</span>
                  </h3>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    5 Sections
                  </span>
                </div>

                <div className="space-y-1.5">
                  {navTabs.map((tab) => {
                    const isActive = subslug === tab.slug;
                    return (
                      <Link
                        key={tab.slug}
                        href={tab.href}
                        className={`p-2.5 rounded-xl transition flex items-center justify-between text-xs ${
                          isActive
                            ? 'bg-[#EDF5FA] text-[#005689] font-bold border border-[#005689]/20'
                            : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isActive ? 'bg-[#005689]' : 'bg-slate-300'}`} />
                          <span>{tab.label}</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Official NITI Aayog Direct Links Widget */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 space-y-2 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-amber-900">
                  <ExternalLink className="w-4 h-4 text-amber-700" />
                  <span>Official NITI Aayog Verification</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Verify government sanction lists, operational guidelines, and fund utilization manuals:
                </p>
                <div className="space-y-1 pt-1">
                  <a
                    href="https://aim.gov.in/atl-overview.php"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block font-semibold text-[#005689] hover:underline"
                  >
                    • aim.gov.in/atl-overview.php ↗
                  </a>
                  <a
                    href="https://atl.aim.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block font-semibold text-[#005689] hover:underline"
                  >
                    • atl.aim.gov.in (Compliance Portal) ↗
                  </a>
                </div>
              </div>

              {/* Govt Schemes Cross Link */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Other Govt Grant Programs
                </span>
                <Link href="/schemes/pm-shri" className="font-bold text-[#005689] hover:underline block">
                  • PM SHRI Modernization Grants (₹27,360 Cr)
                </Link>
                <Link href="/schemes/samagra-shiksha" className="font-bold text-[#005689] hover:underline block">
                  • Samagra Shiksha Composite School Grant
                </Link>
                <Link href="/composite-lab" className="font-bold text-[#005689] hover:underline block">
                  • CBSE Composite Science Lab (600 sq ft)
                </Link>
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
