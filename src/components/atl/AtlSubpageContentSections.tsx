'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ATL_EQUIPMENT_DATA, 
  ATL_OFFICIAL_LINKS,
  AtlEquipmentItem 
} from '@/lib/atlData';
import { 
  CheckCircle2, 
  Download, 
  ExternalLink, 
  ArrowRight, 
  Search, 
  FileSpreadsheet, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  Cpu, 
  Layers, 
  Wrench, 
  Flame, 
  Zap, 
  Building2, 
  Maximize2, 
  Clock, 
  Tag 
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   SUBPAGE 1: ATL OVERVIEW & SETUP GUIDE
   ═══════════════════════════════════════════════════════════════ */
export function AtlOverviewContent() {
  return (
    <div className="space-y-8 text-slate-700 text-sm leading-relaxed">
      
      {/* Introduction */}
      <div className="space-y-3">
        <h2 className="text-xl sm:text-2xl font-black" style={{ color: '#003c6e' }}>
          1. Introduction to Atal Innovation Mission &amp; ATL 2.0 Vision
        </h2>
        <p>
          With a national vision to <em>&ldquo;Cultivate One Million children in India as Neoteric Innovators&rdquo;</em>, the Atal Innovation Mission (AIM), NITI Aayog, is establishing <strong>Atal Tinkering Laboratories (ATLs)</strong> in schools across every district of India. The primary objective of this flagship scheme is to foster curiosity, creativity, and imagination in young minds while inculcating essential 21st-century skills such as computational thinking, adaptive learning, physical computing, and rapid design mindset.
        </p>
        <p>
          An ATL is not a traditional passive demonstration science laboratory; it is an active workspace where young minds give concrete physical shape to their creative ideas through a hands-on, do-it-yourself (DIY) approach. Students in Classes 6 through 12 work directly with educational kits and industrial equipment across electronics, robotics, open-source microcontrollers, sensors, 3D printers, and mechanical tools.
        </p>
        
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-blue-50 border-l-4 border-amber-500 font-medium text-xs leading-relaxed text-slate-800">
          💡 <strong>Official AIM Principle:</strong> &ldquo;To create dedicated workspaces where students learn innovation skills, sculpt ideas through hands-on activities, and build innovative technological solutions for India’s unique community challenges, thereby powering our national knowledge economy.&rdquo;
        </div>
      </div>

      {/* 3 Core National Objectives */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <h3 className="text-lg font-bold" style={{ color: '#003c6e' }}>
          2. The Three Cardinal Pillars of Atal Tinkering Labs
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
            <span className="w-8 h-8 rounded-xl bg-[#005689] text-white flex items-center justify-center font-bold text-sm">
              1
            </span>
            <h4 className="font-bold text-slate-900 text-sm">Empower Innovation Mindset</h4>
            <p className="text-slate-600 leading-relaxed">
              Create flexible workspaces where students independently experiment, embrace failure as a learning step, and sculpt conceptual theories into functional hardware prototypes.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
            <span className="w-8 h-8 rounded-xl bg-[#005689] text-white flex items-center justify-center font-bold text-sm">
              2
            </span>
            <h4 className="font-bold text-slate-900 text-sm">Cultivate 21st-Century Competencies</h4>
            <p className="text-slate-600 leading-relaxed">
              Equip children with critical design thinking, computational logic, cross-cultural teamwork, physical computing, and ethical technological leadership.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
            <span className="w-8 h-8 rounded-xl bg-[#005689] text-white flex items-center justify-center font-bold text-sm">
              3
            </span>
            <h4 className="font-bold text-slate-900 text-sm">Build Grassroots Indigenous Solutions</h4>
            <p className="text-slate-600 leading-relaxed">
              Inspire youth to formulate low-cost, scalable community innovations addressing agriculture, clean water, healthcare, waste management, and renewable energy.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Functional Zones Blueprint */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <h3 className="text-lg font-bold" style={{ color: '#003c6e' }}>
          3. Architectural Layout: The 4 Functional Tinkering Zones
        </h3>
        <p className="text-xs text-slate-500">
          In accordance with NITI Aayog architectural guidelines, the 1,500 sq. ft. laboratory space is bifurcated into four contiguous functional clusters:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Zone 1: Ideation &amp; Discussion Studio</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Equipped with magnetic whiteboards, ergonomic modular seating, video conferencing terminal, and projection display for brainstorming and challenge ideation.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Zone 2: Electronics &amp; Microcontroller Station</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Workbenches outfitted with anti-static ESD rubber mats, regulated DC power supplies, multimeters, Arduino development boards, and sensor arrays.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              <span>Zone 3: Rapid Prototyping &amp; 3D Fabrication</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Dedicated, vibration-isolated counter holding the FDM 3D printer, non-toxic PLA filament storage, slicing terminals, and post-processing tools.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Zone 4: Mechanical Fabrication &amp; Woodwork</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Heavy-duty wooden/steel workbench equipped with bench vices, vertical drill press, junior hacksaws, precision files, pliers, and safety goggles.
            </p>
          </div>
        </div>
      </div>

      {/* Cluster Navigation Cards */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <h3 className="text-lg font-bold" style={{ color: '#003c6e' }}>
          4. Explore Dedicated ATL 2.0 Resource Clusters
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <Link
            href="/steam-lab/atl/equipment"
            className="p-3.5 rounded-2xl border border-slate-200 hover:border-[#005689] hover:bg-[#EDF5FA]/40 transition group space-y-1"
          >
            <div className="flex items-center justify-between font-bold text-slate-900 group-hover:text-[#005689]">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-[#005689]" />
                <span>Equipment List (60 vs 90 Students)</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-slate-500 text-[11px]">
              Full bill of materials for Package 1 to 4 with official quantity comparison for 60-student and 90-student batches.
            </p>
          </Link>

          <Link
            href="/steam-lab/atl/infrastructure"
            className="p-3.5 rounded-2xl border border-slate-200 hover:border-[#005689] hover:bg-[#EDF5FA]/40 transition group space-y-1"
          >
            <div className="flex items-center justify-between font-bold text-slate-900 group-hover:text-[#005689]">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-[#005689]" />
                <span>Space &amp; 1,500 Sq. Ft. Layout</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-slate-500 text-[11px]">
              Official floor plan, power requirements (5kVA), safety protocols, and furniture ergonomics.
            </p>
          </Link>

          <Link
            href="/steam-lab/atl/cost"
            className="p-3.5 rounded-2xl border border-slate-200 hover:border-[#005689] hover:bg-[#EDF5FA]/40 transition group space-y-1"
          >
            <div className="flex items-center justify-between font-bold text-slate-900 group-hover:text-[#005689]">
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-[#005689]" />
                <span>Cost &amp; ₹20 Lakh Grant Breakdown</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-slate-500 text-[11px]">
              ₹10L capital, ₹10L O&amp;M envelope, Tranche 1–3 disbursement rules, and Form GFR 12-A compliance.
            </p>
          </Link>

          <Link
            href="/steam-lab/atl/vendor"
            className="p-3.5 rounded-2xl border border-slate-200 hover:border-[#005689] hover:bg-[#EDF5FA]/40 transition group space-y-1"
          >
            <div className="flex items-center justify-between font-bold text-slate-900 group-hover:text-[#005689]">
              <span className="flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-[#005689]" />
                <span>Turnkey Vendor &amp; GeM Guide</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-slate-500 text-[11px]">
              How to procure compliant hardware via GeM under GFR Rule 149 and secure OEM warranties.
            </p>
          </Link>
        </div>
      </div>

    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SUBPAGE 2: ATL EQUIPMENT & PACKAGES (60 vs 90 Students)
   ═══════════════════════════════════════════════════════════════ */
export function AtlEquipmentContent() {
  const [selectedPackage, setSelectedPackage] = useState<'All' | 'Package 1' | 'Package 2' | 'Package 3' | 'Package 4'>('All');
  const [search, setSearch] = useState('');

  const filteredItems = ATL_EQUIPMENT_DATA.filter(item => {
    const matchesPkg = selectedPackage === 'All' || item.package === selectedPackage;
    const matchesSearch = 
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase()) ||
      item.spec.toLowerCase().includes(search.toLowerCase());
    return matchesPkg && matchesSearch;
  });

  const handleExportCSV = () => {
    const headers = [
      'Sr No', 
      'Package', 
      'Category', 
      'Item Name', 
      'Technical Specifications', 
      'Type', 
      'Mandated Qty (60 Students)', 
      'Mandated Qty (90 Students)', 
      'Educational Application', 
      'Official NITI Aayog Reference URL'
    ];
    const rows = ATL_EQUIPMENT_DATA.map(i => [
      String(i.srNo),
      i.package,
      `"${i.category}"`,
      `"${i.name.replace(/"/g, '""')}"`,
      `"${i.spec.replace(/"/g, '""')}"`,
      i.type,
      `"${i.qty60}"`,
      `"${i.qty90}"`,
      `"${i.application.replace(/"/g, '""')}"`,
      `"${i.refUrl}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'NITI_Aayog_ATL_Equipment_List_151_SKUs_60_vs_90_Students_2026.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 text-slate-700 text-sm leading-relaxed">
      
      {/* Intro & Download Callout */}
      <div className="space-y-3">
        <h2 className="text-xl sm:text-2xl font-black" style={{ color: '#003c6e' }}>
          Official NITI Aayog ATL Equipment Inventory: 60 vs 90 Students
        </h2>
        <p>
          The Atal Innovation Mission prescribes a standardized equipment architecture categorized into <strong>four core packages</strong>. The inventory specifications differ depending on whether the school is commissioned for a standard practical batch of <strong>60 students</strong> (12 to 15 concurrent working teams) or an expanded batch of <strong>90 students</strong> (18 to 22 concurrent working teams).
        </p>

        {/* Dual PDF Direct Download Bar (Compact & Blue Links) */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-[#F0F7FB] border border-[#B9DCF2] shadow-xs space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D4E8F5] pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#005689] animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-wider text-[#005689]">
                Official NITI Aayog Gazetted Equipment PDFs
              </span>
            </div>
            <button
              onClick={handleExportCSV}
              className="px-3 py-1 rounded-lg bg-[#005689] text-white font-bold text-xs hover:bg-[#003c6e] transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-2xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-300" />
              <span>Export as Excel (.CSV)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <a
              href="https://aim.gov.in/pdf/ATL_Equipment_List/ATL_Equipment_List_60_students.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-white hover:bg-blue-50/60 border border-slate-200 hover:border-[#005689] shadow-2xs hover:shadow-xs transition flex items-center justify-between group cursor-pointer"
            >
              <div className="min-w-0 pr-2 space-y-0.5">
                <div className="font-bold text-[#005689] group-hover:text-[#003c6e] group-hover:underline flex items-center gap-1.5 text-xs truncate">
                  <Download className="w-3.5 h-3.5 text-[#005689] shrink-0" />
                  <span className="truncate">ATL Equipment List: 60 Students</span>
                </div>
                <div className="text-[10px] text-slate-500 truncate flex items-center gap-1">
                  <span className="text-emerald-700 font-semibold">PDF File •</span>
                  <span className="text-[#0284c7] font-medium">aim.gov.in standard batch spec</span>
                </div>
              </div>

              <span className="shrink-0 text-[10px] font-bold text-[#005689] bg-[#EDF5FA] group-hover:bg-[#005689] group-hover:text-white px-2.5 py-1 rounded-lg border border-[#B9DCF2] transition flex items-center gap-1">
                <span>Download</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </a>

            <a
              href="https://aim.gov.in/pdf/ATL_Equipment_List/ATL_Equipment_List_90_students.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-white hover:bg-blue-50/60 border border-slate-200 hover:border-[#005689] shadow-2xs hover:shadow-xs transition flex items-center justify-between group cursor-pointer"
            >
              <div className="min-w-0 pr-2 space-y-0.5">
                <div className="font-bold text-[#005689] group-hover:text-[#003c6e] group-hover:underline flex items-center gap-1.5 text-xs truncate">
                  <Download className="w-3.5 h-3.5 text-[#005689] shrink-0" />
                  <span className="truncate">ATL Equipment List: 90 Students</span>
                </div>
                <div className="text-[10px] text-slate-500 truncate flex items-center gap-1">
                  <span className="text-emerald-700 font-semibold">PDF File •</span>
                  <span className="text-[#0284c7] font-medium">aim.gov.in expanded batch spec</span>
                </div>
              </div>

              <span className="shrink-0 text-[10px] font-bold text-[#005689] bg-[#EDF5FA] group-hover:bg-[#005689] group-hover:text-white px-2.5 py-1 rounded-lg border border-[#B9DCF2] transition flex items-center gap-1">
                <span>Download</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Package Filter & Search Controls */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by equipment, sensor, package or spec..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#005689] bg-white shadow-2xs"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {(['All', 'Package 1', 'Package 2', 'Package 3', 'Package 4'] as const).map((pkg) => (
              <button
                key={pkg}
                onClick={() => setSelectedPackage(pkg)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  selectedPackage === pkg
                    ? 'bg-[#005689] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {pkg} ({pkg === 'All' ? ATL_EQUIPMENT_DATA.length : ATL_EQUIPMENT_DATA.filter(i => i.package === pkg).length})
              </button>
            ))}
          </div>
        </div>

        {/* 60 vs 90 Students Itemized Table */}
        <div className="space-y-1.5">
          <div className="sm:hidden text-[10px] text-slate-500 italic flex items-center justify-end gap-1 font-medium">
            <span>↔ Swipe horizontally to view full table</span>
          </div>

          <div className="rounded-xl border border-slate-200 overflow-x-auto shadow-2xs w-full scrollbar-thin">
            <table className="min-w-[880px] w-full text-left text-xs">
              <thead className="bg-[#EDF5FA] text-[#003c6e] font-bold uppercase border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-2.5 w-10 text-center">#</th>
                  <th className="py-2.5 px-3 min-w-[240px]">Equipment &amp; Technical Specs</th>
                  <th className="py-2.5 px-2.5 whitespace-nowrap">Package &amp; Type</th>
                  <th className="py-2.5 px-3 bg-amber-50/70 border-x border-amber-200/60 text-amber-900 font-black whitespace-nowrap">
                    60 Students Qty
                  </th>
                  <th className="py-2.5 px-3 bg-emerald-50/70 text-emerald-900 font-black whitespace-nowrap">
                    90 Students Qty
                  </th>
                  <th className="py-2.5 px-3 min-w-[170px]">Application</th>
                  <th className="py-2.5 px-2.5 text-center whitespace-nowrap">Official Ref</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item) => (
                  <tr key={item.srNo} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-2.5 text-slate-400 font-mono text-center">{item.srNo}</td>
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-900">{item.name}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">{item.spec}</div>
                      <span className="inline-block mt-1 text-[9px] font-semibold text-[#005689] bg-[#EDF5FA] px-1.5 py-0.5 rounded">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-2.5 px-2.5 whitespace-nowrap space-y-1">
                      <span className="block px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 w-fit">
                        {item.package}
                      </span>
                      <span className={`block px-2 py-0.5 rounded-md text-[9px] font-bold w-fit ${
                        item.type === 'Equipment'
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-extrabold text-amber-900 bg-amber-50/40 border-x border-amber-200/40 whitespace-nowrap">
                      {item.qty60}
                    </td>
                    <td className="py-2.5 px-3 font-extrabold text-emerald-900 bg-emerald-50/40 whitespace-nowrap">
                      {item.qty90}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 text-[11px] leading-relaxed">
                      {item.application}
                    </td>
                    <td className="py-2.5 px-2.5 text-center whitespace-nowrap">
                      <a
                        href={item.refUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-[#005689] hover:text-[#003c6e] hover:underline bg-[#EDF5FA] hover:bg-blue-100/80 px-2 py-1 rounded-lg border border-[#B9DCF2] transition shadow-2xs"
                        title="Open Official NITI Aayog PDF Specification"
                      >
                        <ExternalLink className="w-2.5 h-2.5 text-[#005689]" />
                        <span>aim.gov.in</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span>Showing {filteredItems.length} of {ATL_EQUIPMENT_DATA.length} officially mandated equipment entries.</span>
          <span className="font-semibold text-[#005689]">All items 100% compliant with NITI Aayog AIM guidelines.</span>
        </div>
      </div>

    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SUBPAGE 3: ATL INFRASTRUCTURE & 1,500 SQ FT LAYOUT
   ═══════════════════════════════════════════════════════════════ */
export function AtlInfrastructureContent() {
  const [activeZone, setActiveZone] = useState<'all' | 'zone1' | 'zone2' | 'zone3' | 'zone4'>('all');

  const ZONES_DATA = [
    {
      id: 'zone1',
      title: 'Zone 1: Ideation & Discussion Studio',
      area: '300 Sq. Ft. (20% of Floor Space)',
      capacity: '15 to 20 Students Concurrent',
      powerLoad: '0.8 kVA (Low Load / Clean Circuit)',
      noiseProfile: 'Quiet (< 45 dB) — Brainstorming & Review',
      flooring: 'Heavy-traffic acoustic vinyl / carpet tiles',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      accentColor: '#0284c7',
      purpose: 'The creative front-end where student cohorts transition from passive listeners to active problem solvers through empathy mapping, design thinking frameworks, and visual ideation sprints.',
      features: [
        'Floor-to-ceiling magnetic writable ceramic glassboards for sprint mapping',
        'Modular flip-top collaborative tables with lockable casters for rapid re-grouping',
        '65-inch 4K Interactive Flat Panel Display (IFPD) with wireless casting & camera',
        'Dedicated high-speed Wi-Fi 6 access point for cloud research and CAD reviews',
        'Ideation card decks, Post-it sprint kits, and design thinking workbooks'
      ],
      allocatedEquipment: [
        'Display & AV presentation hardware',
        'Modular collaborative flip-top student tables (3 sets)',
        'Ergonomic mobile plastic shell stackable chairs (20 nos)',
        'Magnetic whiteboard markers, erasers & cleaning fluid'
      ]
    },
    {
      id: 'zone2',
      title: 'Zone 2: Electronics & Microcontroller Station',
      area: '450 Sq. Ft. (30% of Floor Space)',
      capacity: '20 to 25 Students Concurrent',
      powerLoad: '1.8 kVA (Regulated Variable DC + Oscilloscope)',
      noiseProfile: 'Quiet to Moderate (< 50 dB) — Soldering & Coding',
      flooring: 'Electrostatic Discharge (ESD) dissipative vinyl with copper grounding strip',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      accentColor: '#059669',
      purpose: 'The central physical computing workshop where circuit diagrams become reality through breadboard prototyping, sensor calibration, embedded microcontroller programming, and wireless IoT telemetry.',
      features: [
        'Workbenches fitted with 2mm dual-layer anti-static ESD rubber mats with 1MΩ ground cords',
        'Dual-trace 25MHz Digital Storage Oscilloscopes (DSO) for signal analysis and PWM verification',
        'Regulated 0–30V 5A variable DC bench power supplies with digital current limiting',
        'Temperature-controlled soldering irons with active carbon smoke fume absorbers and brass tip cleaners',
        'Perimeter cable raceway delivering 40+ multi-pin 5A/15A sockets with dedicated ELCB protection'
      ],
      allocatedEquipment: [
        'Package 1: Arduino Uno (30), Nano (10), Mega (10), Raspberry Pi 3 B+ (5), ESP32 / NodeMCU (6)',
        'Package 1: 30 Solderless breadboards (400/800 pin), 200 Alligator leads, 1000 Jumper wires',
        'Package 1: Full sensor suites (Ultrasonic, PIR, Humidity, MQ Gas, Soil Moisture, Pulse Rate, Flex)',
        'Package 3: Digital Multimeters (5 nos), Digital Pen testers, Soldering Helping Hands (4 nos)'
      ]
    },
    {
      id: 'zone3',
      title: 'Zone 3: Rapid Prototyping & 3D Fabrication Zone',
      area: '350 Sq. Ft. (23% of Floor Space)',
      capacity: '8 to 10 Students Concurrent',
      powerLoad: '1.2 kVA (Dedicated Online 2kVA UPS Circuit)',
      noiseProfile: 'Moderate (50–60 dB) — Stepper Motors & Fans',
      flooring: 'Anti-slip industrial epoxy with vibration dampening base',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      accentColor: '#7c3aed',
      purpose: 'The additive manufacturing studio where digital CAD assemblies are converted into high-precision physical components, functional robotic chassis, gears, and custom drone brackets.',
      features: [
        'Heavy vibration-isolated industrial granite/concrete pedestal counter for 3D printer calibration',
        'Dedicated 2kVA online pure sine-wave UPS ensuring 2-hour uninterrupted runtime during power dips',
        'Humidity-sealed transparent filament dry-boxes with silica desiccant packs to prevent filament brittleness',
        'Dedicated CAD slicing terminal running Cura, PrusaSlicer, and Autodesk Fusion 360',
        'Post-processing workstation with digital vernier calipers, scraper blades, and isopropyl alcohol bath'
      ],
      allocatedEquipment: [
        'Package 2: FDM 3D Printer Kit (Minimum 160×160×160mm build volume / 4L capacity)',
        'Package 2: Dedicated Online UPS / Power Backup with 2-hour battery bank',
        'Package 2: PLA 3D Printer Filaments (5 kg assorted colors: White, Black, Red, Blue, Green)',
        'Package 2: Filament storage dry-boxes (5 nos) & Arts & Craft prototyping tool sets',
        'Package 3: Digital Vernier Calipers (2 nos), Precision needle files, Deburring scrapers'
      ]
    },
    {
      id: 'zone4',
      title: 'Zone 4: Mechanical Fabrication & Woodwork Shop',
      area: '400 Sq. Ft. (27% of Floor Space)',
      capacity: '10 to 15 Students Concurrent',
      powerLoad: '1.5 kVA (High-Torque Machinery & Drills)',
      noiseProfile: 'High (65–75 dB) — Cutting, Drilling, Clamping',
      flooring: 'Heavy-impact chemical-resistant hardwood parquet or hardened concrete',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      accentColor: '#d97706',
      purpose: 'The heavy fabrication workshop where students execute structural cutting, wood shaping, precision metal drilling, bracket bending, and mechanical rover assembly under strict safety protocols.',
      features: [
        'Solid 40mm seasoned hardwood fabrication bench with heavy-gauge steel aprons to absorb shock',
        'Heavy 4-inch cast-iron table vices mounted on bench corners for secure workpiece holding',
        'Vertical pillar drill press stand for precision 90-degree hole drilling in metal, acrylic, and wood',
        'High-velocity particulate air blower for chip collection and workspace dust suppression',
        'Dedicated PPE station with polycarbonate impact goggles rack, anti-cut Kevlar gloves, and dust masks'
      ],
      allocatedEquipment: [
        'Package 3: 12-inch Hacksaws (1 frame + 10 blades), Mini Hacksaws (1 frame + 10 blades)',
        'Package 3: Ball Pein Hammer, Steel Shaft Claw Hammer, C-Clamps (4 nos), Spanner set (12-pc)',
        'Package 3: Table-top Vice, Precision Screwdriver sets, Cordless Rotary Multitool, Drill machine set',
        'Package 4: First-Aid Kit (2 nos), Fire Extinguishers (2 nos), Safety Goggles (30 pairs), Safety Gloves (10 pairs)'
      ]
    }
  ];

  return (
    <div className="space-y-8 text-slate-700 text-sm leading-relaxed">
      
      {/* Space Norms */}
      <div className="space-y-3">
        <h2 className="text-xl sm:text-2xl font-black" style={{ color: '#003c6e' }}>
          1. Mandatory Floor Space Requirements: 1,500 Sq. Ft. Blueprint
        </h2>
        <p>
          According to NITI Aayog’s operational guidelines, schools applying for or commissioning an Atal Tinkering Lab must allocate a minimum of <strong>1,500 sq. ft. of dedicated, contiguous carpet area</strong> in plain regions. For institutions situated in designated hilly, northeastern, or island territories, a special concession allows a minimum carpet area of <strong>1,000 sq. ft.</strong>
        </p>
        <p>
          The room must be completely secure, well-ventilated, pest-proof, and brightly illuminated. It cannot be combined with an existing physics, chemistry, or biology lab; it must operate as an independent, standalone innovation studio.
        </p>
      </div>

      {/* ── SECTION 2: ARCHITECTURAL LAYOUT: THE 4 FUNCTIONAL TINKERING ZONES ── */}
      <div className="space-y-4 pt-4 border-t border-slate-100" id="zones">
        <div>
          <span className="text-[10px] font-bold text-[#005689] uppercase tracking-wider block">
            NITI Aayog Official Spatial Architecture
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#003c6e] mt-0.5">
            2. Architectural Layout: The 4 Functional Tinkering Zones
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-1 leading-relaxed">
            In accordance with the official AIM operational blueprint, an optimal 1,500 sq. ft. Atal Tinkering Lab is partitioned into four contiguous, workflow-aligned functional zones connected by a central 6-ft safety circulation spine:
          </p>
        </div>

        {/* Interactive 2D Floorplan Schematic Map */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#002244] text-white shadow-md space-y-4 border border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">
                Architectural Floor Plan Schematic
              </span>
              <h3 className="text-sm sm:text-base font-bold text-white">
                1,500 Sq. Ft. Master Zoning &amp; Student Circulation Blueprint
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-cyan-200 bg-white/10 px-2.5 py-1 rounded-full border border-white/20">
                Scale: 50 ft × 30 ft (1,500 sq ft)
              </span>
            </div>
          </div>

          {/* 2D Schematic Grid representing the room */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 p-3 bg-slate-900/80 rounded-xl border border-white/10 text-xs font-medium">
            
            {/* Zone 1 Box (North-West) */}
            <div 
              onClick={() => setActiveZone(activeZone === 'zone1' ? 'all' : 'zone1')}
              className={`md:col-span-6 p-4 rounded-xl border-2 transition cursor-pointer space-y-2 ${
                activeZone === 'zone1' || activeZone === 'all'
                  ? 'bg-blue-950/80 border-blue-400 text-blue-100 shadow-sm'
                  : 'bg-slate-950/40 border-slate-700 text-slate-500 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md bg-blue-500 text-white text-[10px] font-bold uppercase">
                  Zone 1: Ideation
                </span>
                <span className="text-[11px] font-mono text-cyan-300">300 Sq. Ft. (20%)</span>
              </div>
              <h4 className="font-bold text-white text-sm">Ideation &amp; Discussion Studio</h4>
              <p className="text-[11px] text-blue-200 leading-snug">
                Magnetic writable glassboards, 65" 4K interactive display, flip-top collaborative modular desks, and empathy mapping sprint boards.
              </p>
              <div className="flex items-center gap-2 text-[10px] text-cyan-300 pt-1">
                <span>Capacity: 15–20 Students</span> • <span>Load: 0.8 kVA</span>
              </div>
            </div>

            {/* Zone 2 Box (North-East) */}
            <div 
              onClick={() => setActiveZone(activeZone === 'zone2' ? 'all' : 'zone2')}
              className={`md:col-span-6 p-4 rounded-xl border-2 transition cursor-pointer space-y-2 ${
                activeZone === 'zone2' || activeZone === 'all'
                  ? 'bg-emerald-950/80 border-emerald-400 text-emerald-100 shadow-sm'
                  : 'bg-slate-950/40 border-slate-700 text-slate-500 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-white text-[10px] font-bold uppercase">
                  Zone 2: Electronics
                </span>
                <span className="text-[11px] font-mono text-emerald-300">450 Sq. Ft. (30%)</span>
              </div>
              <h4 className="font-bold text-white text-sm">Electronics, Microcontroller &amp; IoT Station</h4>
              <p className="text-[11px] text-emerald-200 leading-snug">
                2mm static-dissipative ESD rubber mats, digital oscilloscopes, 0–30V DC bench supplies, soldering smoke extractors, 40+ power sockets.
              </p>
              <div className="flex items-center gap-2 text-[10px] text-emerald-300 pt-1">
                <span>Capacity: 20–25 Students</span> • <span>Load: 1.8 kVA</span>
              </div>
            </div>

            {/* Central Corridor Indicator (Full Width Bar) */}
            <div className="md:col-span-12 py-2 px-4 rounded-lg bg-white/5 border border-dashed border-cyan-400/40 text-center flex items-center justify-between text-[11px] text-cyan-300 font-mono">
              <span>◄ Emergency Double-Door Exit</span>
              <span className="font-bold tracking-wider">▲ CENTRAL 6-FT SAFETY &amp; ACCESSIBILITY CIRCULATION AISLE ▼</span>
              <span>Fire Extinguisher &amp; First Aid ►</span>
            </div>

            {/* Zone 3 Box (South-West) */}
            <div 
              onClick={() => setActiveZone(activeZone === 'zone3' ? 'all' : 'zone3')}
              className={`md:col-span-6 p-4 rounded-xl border-2 transition cursor-pointer space-y-2 ${
                activeZone === 'zone3' || activeZone === 'all'
                  ? 'bg-purple-950/80 border-purple-400 text-purple-100 shadow-sm'
                  : 'bg-slate-950/40 border-slate-700 text-slate-500 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md bg-purple-500 text-white text-[10px] font-bold uppercase">
                  Zone 3: 3D Prototyping
                </span>
                <span className="text-[11px] font-mono text-purple-300">350 Sq. Ft. (23%)</span>
              </div>
              <h4 className="font-bold text-white text-sm">Rapid Prototyping &amp; 3D Fabrication Zone</h4>
              <p className="text-[11px] text-purple-200 leading-snug">
                Vibration-isolated stone platform, FDM 3D printer, dedicated 2-hr online UPS, PLA filament dry-box, CAD slicing terminals.
              </p>
              <div className="flex items-center gap-2 text-[10px] text-purple-300 pt-1">
                <span>Capacity: 8–10 Students</span> • <span>Load: 1.2 kVA</span>
              </div>
            </div>

            {/* Zone 4 Box (South-East) */}
            <div 
              onClick={() => setActiveZone(activeZone === 'zone4' ? 'all' : 'zone4')}
              className={`md:col-span-6 p-4 rounded-xl border-2 transition cursor-pointer space-y-2 ${
                activeZone === 'zone4' || activeZone === 'all'
                  ? 'bg-amber-950/80 border-amber-400 text-amber-100 shadow-sm'
                  : 'bg-slate-950/40 border-slate-700 text-slate-500 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-bold uppercase">
                  Zone 4: Fabrication
                </span>
                <span className="text-[11px] font-mono text-amber-300">400 Sq. Ft. (27%)</span>
              </div>
              <h4 className="font-bold text-white text-sm">Mechanical Fabrication &amp; Woodwork Shop</h4>
              <p className="text-[11px] text-amber-200 leading-snug">
                Solid 40mm hardwood workbench, 4-inch bench vices, vertical drill press, rotary multitools, hand hacksaws, dust collection &amp; PPE rack.
              </p>
              <div className="flex items-center gap-2 text-[10px] text-amber-300 pt-1">
                <span>Capacity: 10–15 Students</span> • <span>Load: 1.5 kVA</span>
              </div>
            </div>

          </div>

          <div className="text-[11px] text-cyan-200 flex items-center justify-between pt-1">
            <span>Tip: Click any zone in the blueprint to inspect detailed architectural specs and allocated equipment below.</span>
            {activeZone !== 'all' && (
              <button 
                onClick={() => setActiveZone('all')}
                className="underline hover:text-white font-bold cursor-pointer"
              >
                Reset to Show All Zones
              </button>
            )}
          </div>
        </div>

        {/* Zone Detail Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {ZONES_DATA.filter(z => activeZone === 'all' || activeZone === z.id).map((z) => (
            <div 
              key={z.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-xs transition space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wide border ${z.badgeColor}`}>
                  {z.area}
                </span>
                <span className="text-xs font-semibold text-slate-500">{z.capacity}</span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900" style={{ color: '#003c6e' }}>
                  {z.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {z.purpose}
                </p>
              </div>

              {/* Technical Specifications Pill List */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                <span className="text-[11px] font-bold text-slate-700 block">Architectural &amp; Infrastructure Features:</span>
                <ul className="space-y-1 text-[11px] text-slate-600">
                  {z.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Allocated Mandated Inventory */}
              <div className="space-y-1 pt-2 border-t border-slate-100 text-xs">
                <span className="text-[11px] font-bold text-[#005689] block">Mandated Equipment Allocated:</span>
                <ul className="space-y-1 text-[11px] text-slate-600">
                  {z.allocatedEquipment.map((eq, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-slate-400 font-bold">•</span>
                      <span>{eq}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Meta row */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-medium">
                <span>Power: <strong>{z.powerLoad}</strong></span>
                <span>Noise: <strong>{z.noiseProfile}</strong></span>
              </div>
            </div>
          ))}
        </div>

        {/* 4-Zone Technical Comparison Table */}
        <div className="space-y-1.5 pt-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-900 text-sm">
              4-Zone Technical Parameters &amp; Environmental Profile
            </h4>
            <span className="sm:hidden text-[10px] text-slate-500 italic">↔ Scroll table</span>
          </div>

          <div className="rounded-xl border border-slate-200 overflow-x-auto shadow-2xs w-full scrollbar-thin">
            <table className="min-w-[700px] w-full text-left text-xs">
              <thead className="bg-[#EDF5FA] text-[#003c6e] font-bold uppercase border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Tinkering Zone</th>
                  <th className="py-2.5 px-3">Floor Area</th>
                  <th className="py-2.5 px-3">Max Capacity</th>
                  <th className="py-2.5 px-3">Connected Electrical</th>
                  <th className="py-2.5 px-3">Flooring Spec</th>
                  <th className="py-2.5 px-3">Noise &amp; Fume Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-bold text-blue-900">Zone 1: Ideation Studio</td>
                  <td className="py-2.5 px-3 font-semibold">300 Sq. Ft. (20%)</td>
                  <td className="py-2.5 px-3">15–20 Students</td>
                  <td className="py-2.5 px-3">0.8 kVA (Clean)</td>
                  <td className="py-2.5 px-3 text-slate-600">Acoustic vinyl tiles</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-semibold">&lt; 45 dB (Quiet)</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-bold text-emerald-900">Zone 2: Electronics &amp; IoT</td>
                  <td className="py-2.5 px-3 font-semibold">450 Sq. Ft. (30%)</td>
                  <td className="py-2.5 px-3">20–25 Students</td>
                  <td className="py-2.5 px-3">1.8 kVA (40+ sockets)</td>
                  <td className="py-2.5 px-3 text-slate-600">2mm ESD rubber matting</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-semibold">&lt; 50 dB (Solder smoke exhaust)</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-bold text-purple-900">Zone 3: 3D Fabrication</td>
                  <td className="py-2.5 px-3 font-semibold">350 Sq. Ft. (23%)</td>
                  <td className="py-2.5 px-3">8–10 Students</td>
                  <td className="py-2.5 px-3">1.2 kVA (Online UPS)</td>
                  <td className="py-2.5 px-3 text-slate-600">Anti-vibration stone base</td>
                  <td className="py-2.5 px-3 text-amber-700 font-semibold">50–60 dB (Fan / stepper motor)</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-bold text-amber-900">Zone 4: Mechanical Workshop</td>
                  <td className="py-2.5 px-3 font-semibold">400 Sq. Ft. (27%)</td>
                  <td className="py-2.5 px-3">10–15 Students</td>
                  <td className="py-2.5 px-3">1.5 kVA (Drill / Rotary)</td>
                  <td className="py-2.5 px-3 text-slate-600">40mm seasoned hardwood</td>
                  <td className="py-2.5 px-3 text-rose-700 font-semibold">65–75 dB (Cutting / drilling chips)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Electrical Load & Power Distribution */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <h3 className="text-lg font-bold" style={{ color: '#003c6e' }}>
          3. Electrical Load &amp; Safe Power Architecture
        </h3>
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Total Connected Load:</strong> Minimum 5kVA connected electrical load dedicated to the laboratory.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Workstation Power Sockets:</strong> Minimum 40 to 60 multi-pin power outlets (5A/15A) distributed evenly along perimeter raceways and overhead retractable drops.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>UPS Power Backup:</strong> A minimum 2kVA to 3kVA pure sine-wave online UPS system providing at least 1-2 hours of uninterrupted backup to prevent 3D print failures during power brownouts.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Earthing &amp; Residual Current Protection:</strong> Proper chemical copper earthing with leakage voltage under 2V and dedicated Earth Leakage Circuit Breakers (ELCB / RCCB) to safeguard students from electrical shocks.</span>
          </div>
        </div>
      </div>

      {/* Furniture & Ergonomics */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <h3 className="text-lg font-bold" style={{ color: '#003c6e' }}>
          4. Heavy-Duty Workbenches, ESD Matting &amp; Stools
        </h3>
        <p className="text-xs text-slate-500">
          Standard classroom desks are strictly prohibited in an ATL due to mechanical vibration and soldering heat risks. The mandatory furniture specifications include:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
            <h4 className="font-bold text-slate-900">Hexagonal / Modular Collaborative Tables</h4>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Equipped with heavy CRCA powder-coated steel frames and high-density, scratch-resistant laminate tops. Designed to seat 4-6 students collaboratively.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
            <h4 className="font-bold text-slate-900">Mechanical &amp; Heavy Fabrication Worktable</h4>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Solid 40mm seasoned hardwood or steel top mounted with a heavy bench vice, drill stand, and tool racks. Built to absorb mechanical impacts.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
            <h4 className="font-bold text-slate-900">Anti-Static (ESD) Rubber Table Mats</h4>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              2mm thick dual-layer dissipative rubber mats grounded with 1MΩ resistors on all soldering and electronics workstations to prevent chip damage.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
            <h4 className="font-bold text-slate-900">Lockable Steel Storage Cupboards</h4>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Transparent glass-fronted display cabinets for student project showcases and locked heavy-gauge metal cupboards for high-value tool kits and 3D filaments.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SUBPAGE 4: ATL COST & ₹20 LAKH GRANT BREAKDOWN
   ═══════════════════════════════════════════════════════════════ */
export function AtlCostContent() {
  return (
    <div className="space-y-8 text-slate-700 text-sm leading-relaxed">
      
      {/* Intro */}
      <div className="space-y-3">
        <h2 className="text-xl sm:text-2xl font-black" style={{ color: '#003c6e' }}>
          1. Complete ₹20 Lakh Grant-in-Aid Structure
        </h2>
        <p>
          The financial assistance sanctioned by the Atal Innovation Mission, NITI Aayog, is capped at <strong>₹20,00,000 (Twenty Lakh Rupees)</strong> per selected school disbursed across a 5-year operating lifecycle. The funds are legally classified into two distinct components:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1.5">
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">One-Time Capital Envelope</span>
            <div className="text-xl font-black text-amber-950">₹10,00,000 (Establishment)</div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Dedicated solely to purchasing Package 1 (Electronics/Sensors), Package 2 (3D Printer), Package 3 (Mechanical Tools), and Package 4 (Power/Safety).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1.5">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">5-Year Recurring Envelope</span>
            <div className="text-xl font-black text-emerald-950">₹10,00,000 (O&amp;M @ ₹2L / Yr)</div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Earmarked for replenishment of consumables (filaments, solder, batteries), teacher mentoring honorarium, student travel, and competition registrations.
            </p>
          </div>
        </div>
      </div>

      {/* Tranche Release Schedule */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <h3 className="text-lg font-bold" style={{ color: '#003c6e' }}>
          2. Tranche Disbursement Schedule &amp; Bank Mapping
        </h3>

        {/* Scrollable Table */}
        <div className="space-y-1.5">
          <div className="sm:hidden text-[10px] text-slate-500 italic flex items-center justify-end gap-1 font-medium">
            <span>↔ Swipe horizontally to view full table</span>
          </div>

          <div className="rounded-xl border border-slate-200 overflow-x-auto shadow-2xs w-full scrollbar-thin">
            <table className="min-w-[640px] w-full text-left text-xs">
              <thead className="bg-[#EDF5FA] text-[#003c6e] font-bold uppercase border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Disbursement Phase</th>
                  <th className="py-2.5 px-3">Amount Released</th>
                  <th className="py-2.5 px-3">Mandatory Prerequisites for Release</th>
                  <th className="py-2.5 px-3">Permissible Utilization Head</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-bold text-slate-900">Tranche 1 (Year 1)</td>
                  <td className="py-2.5 px-3 font-extrabold text-[#005689] whitespace-nowrap">₹12,00,000</td>
                  <td className="py-2.5 px-3 text-slate-600 text-[11px]">Execution of MoA, Indemnity Bond, and PFMS Scheme [0217] mapping</td>
                  <td className="py-2.5 px-3 text-slate-700 font-medium">₹10L Capital Setup + ₹2L Year-1 O&amp;M</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-bold text-slate-900">Tranche 2 (Year 2 &amp; 3)</td>
                  <td className="py-2.5 px-3 font-extrabold text-[#005689] whitespace-nowrap">₹2,00,000 / Yr</td>
                  <td className="py-2.5 px-3 text-slate-600 text-[11px]">CA-certified Form GFR 12-A, 75%+ utilization, and monthly AIM reporting</td>
                  <td className="py-2.5 px-3 text-slate-700 font-medium">Consumables, Mentorship, ATL Community Day</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-bold text-slate-900">Tranche 3 (Year 4 &amp; 5)</td>
                  <td className="py-2.5 px-3 font-extrabold text-[#005689] whitespace-nowrap">₹2,00,000 / Yr</td>
                  <td className="py-2.5 px-3 text-slate-600 text-[11px]">Audited financial balance sheet, ATL Marathon participation, and student prototype reports</td>
                  <td className="py-2.5 px-3 text-slate-700 font-medium">Hardware calibration, prototyping competitions, patents</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* PFMS Rules */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <h3 className="text-lg font-bold" style={{ color: '#003c6e' }}>
          3. PFMS Accounting &amp; Audit Compliance
        </h3>
        <p className="text-xs text-slate-600">
          All financial disbursements must adhere strictly to the Public Financial Management System (PFMS). Under no circumstances can schools issue manual paper cheques or make cash transactions exceeding ₹500. Failure to submit Form GFR 12-A within 12 months triggers statutory recovery proceedings with 18% penal interest.
        </p>
      </div>

    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SUBPAGE 5: ATL TURNKEY VENDOR & GeM PROCUREMENT
   ═══════════════════════════════════════════════════════════════ */
export function AtlVendorContent() {
  return (
    <div className="space-y-8 text-slate-700 text-sm leading-relaxed">
      
      {/* Intro */}
      <div className="space-y-3">
        <h2 className="text-xl sm:text-2xl font-black" style={{ color: '#003c6e' }}>
          1. Public Procurement via Government e-Marketplace (GeM)
        </h2>
        <p>
          In accordance with Rule 149 of the General Financial Rules (GFR-2017), government and grant-recipient schools must procure equipment through the Government e-Marketplace (GeM). Turnkey execution ensures that schools do not suffer from component mismatches, incompatible firmware, or substandard counterfeit electronics.
        </p>
      </div>

      {/* Vendor Selection Criteria Checklist */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <h3 className="text-lg font-bold" style={{ color: '#003c6e' }}>
          2. Mandatory Turnkey Vendor Qualification Checklist
        </h3>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Active GeM OEM / Reseller Registration:</strong> Vendor must be an authorized OEM or registered primary reseller with valid GeM catalog listings.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Comprehensive Package 1–4 Compliance:</strong> The supplier must deliver all 42+ mandated SKUs with genuine branded microcontrollers and IS-certified electrical gear.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>On-Site Commissioning &amp; Calibration:</strong> Certified engineers must install the 3D printer, conduct leveling test prints, wire testing stations, and verify sensor modules.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Mandatory 3-Day Faculty Master Training:</strong> Complete pedagogical and technical instruction for designated school teachers covering electronics, 3D slicing, and robotics.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>5-Year Replacement Warranty &amp; Mentorship Support:</strong> Rapid repair/replacement of defective 3D printer parts, controllers, and motors throughout the grant cycle.</span>
          </div>
        </div>
      </div>

      {/* Why Choose CSEEL */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <h3 className="text-lg font-bold" style={{ color: '#003c6e' }}>
          3. Why Leading Schools Partner with CSEEL for Turnkey ATL Setup
        </h3>
        <p className="text-xs text-slate-600">
          CSEEL is an empanelled educational technology enterprise that has successfully commissioned over 180+ Atal Tinkering Labs across India. We offer complete assistance from PFMS registration and GeM custom bidding to curriculum scaffolding and ATL Marathon mentoring.
        </p>
      </div>

    </div>
  );
}
