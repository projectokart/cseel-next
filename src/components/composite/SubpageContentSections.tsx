'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  Search, 
  Download, 
  ShieldCheck, 
  AlertTriangle, 
  Building2, 
  DollarSign, 
  Layers, 
  BookOpen, 
  Sparkles,
  ArrowRight,
  ExternalLink,
  Flame,
  Droplets,
  DoorOpen,
  Info,
  FileSpreadsheet,
  ZoomIn,
  Eye,
  X
} from 'lucide-react';
import { 
  CBSE_SOP_NON_CONSUMABLES, 
  CBSE_SOP_CONSUMABLES, 
  CBSE_SOP_BIOLOGY_SPECIMENS, 
  CBSE_SOP_GENERAL_REQUIREMENTS,
  SopEquipmentItem,
  SopChemicalItem,
  SopSpecimenItem
} from '@/lib/compositeSopData';

/* ═══════════════════════════════════════════════════════════════
   SUBPAGE 1: MATERIAL & APPARATUS (Exclusively on /composite-lab/material)
   ═══════════════════════════════════════════════════════════════ */
export function MaterialSubpageContent() {
  const [filter, setFilter] = useState<'All' | 'Physics' | 'Chemistry' | 'Biology' | 'General'>('All');
  const [search, setSearch] = useState('');
  
  // Interactive Image Zoom / Lightbox Modal State
  const [previewItem, setPreviewItem] = useState<{
    name: string;
    category?: string;
    qty: string;
    spec?: string;
    image?: string;
    alt?: string;
    type?: string;
    formula?: string;
    application?: string;
    observation?: string;
  } | null>(null);

  const filteredItems = CBSE_SOP_NON_CONSUMABLES.filter(item => {
    const matchesFilter = filter === 'All' || item.category === filter;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Client-Side CSV Export for Microsoft Excel
  const handleExportExcel = () => {
    const headers = ['Type', 'Item Number', 'Item Name', 'Category / Discipline', 'Mandated Quantity', 'Specification / Formula', 'Educational Application'];
    
    const rows: string[][] = [];

    // 49 Non-Consumables
    CBSE_SOP_NON_CONSUMABLES.forEach((item, idx) => {
      rows.push([
        'Non-Consumable Apparatus (Clause 6a)',
        String(idx + 1),
        `"${item.name.replace(/"/g, '""')}"`,
        item.category,
        `"${item.qty}"`,
        `"${(item.spec || 'Standard').replace(/"/g, '""')}"`,
        'General Science & Physics/Chem/Bio Practicals'
      ]);
    });

    // 18 Consumables
    CBSE_SOP_CONSUMABLES.forEach((chem, idx) => {
      rows.push([
        'Consumable Chemical (Clause 6b)',
        String(idx + 1),
        `"${chem.name.replace(/"/g, '""')}"`,
        'Chemistry / Consumable',
        `"${chem.qty}"`,
        `"${(chem.formula || 'Lab Grade').replace(/"/g, '""')}"`,
        `"${(chem.application || 'Chemical Reagent').replace(/"/g, '""')}"`
      ]);
    });

    // 15 Specimens
    CBSE_SOP_BIOLOGY_SPECIMENS.forEach((spec, idx) => {
      rows.push([
        'Biology Specimen / Slide (Clause 6c)',
        String(idx + 1),
        `"${spec.name.replace(/"/g, '""')}"`,
        'Biology / Specimen',
        `"${spec.qty}"`,
        `"${(spec.type || 'Permanent Mount').replace(/"/g, '""')}"`,
        `"${(spec.observation || 'Microscopic Study').replace(/"/g, '""')}"`
      ]);
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'CBSE_Composite_Science_Lab_Material_Checklist_2026.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 text-slate-700 text-sm leading-relaxed">
      
      {/* Introduction & Top Excel Download Bar */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2" style={{ color: '#003c6e' }}>
            Mandatory Equipment, Apparatus &amp; Chemical Specifications
          </h2>
          <p>
            Under Clause 6 of the official CBSE SARAS Composite Science Laboratory SOP, every secondary school must maintain an exact inventory of <strong>49 non-consumable equipment items</strong>, <strong>18 essential chemicals</strong>, and <strong>15 preserved biological specimens/permanent slides</strong>. This inventory is calibrated specifically for a practical batch of 40 students working concurrently under a science teacher.
          </p>
        </div>

        {/* ── TOP ACTION BAR: EXCEL DOWNLOAD & SOP PDF ── */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-800 via-[#005689] to-[#003c6e] text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
          <div className="space-y-0.5 text-center sm:text-left">
            <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest block">
              Official Material Register Export
            </span>
            <h4 className="font-bold text-sm text-white">
              Download Complete 82-Item Lab Inventory in Excel
            </h4>
            <p className="text-[11px] text-blue-100">
              Includes 49 Apparatus, 18 Chemicals &amp; 15 Preserved Specimens with quantities &amp; specifications.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handleExportExcel}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition shadow-sm"
              title="Export complete checklist to Excel (.csv)"
            >
              <FileSpreadsheet className="w-4 h-4 text-slate-950" />
              <span>Export as Excel (.CSV)</span>
            </button>
            <a
              href="/docs/CompositeScienceLabSOP.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs flex items-center gap-1.5 transition border border-white/20"
            >
              <Download className="w-3.5 h-3.5 text-cyan-300" />
              <span>SARAS SOP PDF</span>
            </a>
          </div>
        </div>
      </div>

      {/* ═════════ 1. COMPLETE 49 APPARATUS TABLE ═════════ */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
          <div>
            <h3 className="text-lg font-bold text-slate-900" style={{ color: '#003c6e' }}>
              1. Mandatory 49 Non-Consumable Apparatus Checklist
            </h3>
            <p className="text-xs text-slate-500">Official Clause 6(a) Itemized Register with Photo Preview (Click photo to enlarge)</p>
          </div>

          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search apparatus..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#005689] bg-white"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5">
          {(['All', 'Physics', 'Chemistry', 'Biology', 'General'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                filter === cat
                  ? 'bg-[#005689] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat} ({cat === 'All' ? CBSE_SOP_NON_CONSUMABLES.length : CBSE_SOP_NON_CONSUMABLES.filter(i => i.category === cat).length})
            </button>
          ))}
        </div>

        {/* Apparatus Table */}
        <div className="space-y-1.5">
          <div className="sm:hidden text-[10px] text-slate-500 italic flex items-center justify-end gap-1 font-medium">
            <span>↔ Swipe horizontally to view full table</span>
          </div>
          <div className="rounded-xl border border-slate-200 overflow-x-auto overflow-y-auto max-h-96 shadow-2xs w-full scrollbar-thin">
            <table className="min-w-[620px] w-full text-left text-xs">
              <thead className="bg-[#EDF5FA] text-[#003c6e] font-bold uppercase sticky top-0 z-10 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 text-center w-14">Photo</th>
                  <th className="py-2.5 px-2.5 w-10">#</th>
                  <th className="py-2.5 px-3">Apparatus / Equipment Name &amp; Specs</th>
                  <th className="py-2.5 px-3">Mandated Quantity</th>
                  <th className="py-2.5 px-3">Discipline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    {/* Photo Column with Click to Preview */}
                    <td className="py-2 px-3 text-center">
                      <button
                        onClick={() => setPreviewItem(item)}
                        className="relative w-10 h-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 hover:opacity-80 transition group shrink-0 inline-block shadow-2xs"
                        title="Click to zoom image"
                      >
                        <img
                          src={item.image || '/images/features/hands-on-science-laboratory-beakers.avif'}
                          alt={item.alt || `${item.name} - CBSE Science Lab Apparatus`}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                          loading="lazy"
                        />
                        <span className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                          <ZoomIn className="w-3.5 h-3.5 text-white" />
                        </span>
                      </button>
                    </td>
                    <td className="py-2 px-2.5 text-slate-400 font-mono">{idx + 1}</td>
                    <td className="py-2 px-3">
                      <div className="font-semibold text-slate-800">{item.name}</div>
                      {item.spec && (
                        <div className="text-[11px] text-slate-500 font-normal leading-tight mt-0.5">
                          {item.spec}
                        </div>
                      )}
                    </td>
                    <td className="py-2 px-3 font-bold text-[#005689] whitespace-nowrap">{item.qty}</td>
                    <td className="py-2 px-3 whitespace-nowrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.category === 'Physics' ? 'bg-cyan-100 text-cyan-800' :
                        item.category === 'Chemistry' ? 'bg-amber-100 text-amber-800' :
                        item.category === 'Biology' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {item.category}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ═════════ 2. MANDATORY 18 CHEMICALS IN TABLE FORMAT ═════════ */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-slate-900" style={{ color: '#003c6e' }}>
              2. Mandatory 18 Chemical Reagents &amp; Consumables
            </h3>
            <p className="text-xs text-slate-500">Official Clause 6(b) Lab-Grade Chemical Reagents with Proper Packaging</p>
          </div>
          <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 self-start sm:self-auto">
            18 Mandatory SKUs
          </span>
        </div>

        {/* Chemicals Full Table */}
        <div className="space-y-1.5">
          <div className="sm:hidden text-[10px] text-slate-500 italic flex items-center justify-end gap-1 font-medium">
            <span>↔ Swipe horizontally to view full table</span>
          </div>
          <div className="rounded-xl border border-slate-200 overflow-x-auto overflow-y-auto max-h-96 shadow-2xs w-full scrollbar-thin">
            <table className="min-w-[660px] w-full text-left text-xs">
              <thead className="bg-[#EDF5FA] text-[#003c6e] font-bold uppercase sticky top-0 z-10 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 text-center w-14">Photo</th>
                  <th className="py-2.5 px-2.5 w-10">#</th>
                  <th className="py-2.5 px-3">Chemical Reagent Name</th>
                  <th className="py-2.5 px-3">Formula / Purity Grade</th>
                  <th className="py-2.5 px-3">Mandated Packaging</th>
                  <th className="py-2.5 px-3">Laboratory Purpose / Application</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {CBSE_SOP_CONSUMABLES.map((chem, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    {/* Photo Column */}
                    <td className="py-2 px-3 text-center">
                      <button
                        onClick={() => setPreviewItem({
                          name: chem.name,
                          category: 'Chemistry Consumable',
                          qty: chem.qty,
                          formula: chem.formula,
                          application: chem.application,
                          image: chem.image,
                          alt: chem.alt
                        })}
                        className="relative w-10 h-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 hover:opacity-80 transition group shrink-0 inline-block shadow-2xs"
                        title="Click to zoom image"
                      >
                        <img
                          src={chem.image || '/images/categories/chemistry.jpg'}
                          alt={chem.alt || `${chem.name} - CBSE Laboratory Chemical Reagent`}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                          loading="lazy"
                        />
                        <span className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                          <ZoomIn className="w-3.5 h-3.5 text-white" />
                        </span>
                      </button>
                    </td>
                    <td className="py-2 px-2.5 text-slate-400 font-mono">{idx + 1}</td>
                    <td className="py-2 px-3 font-semibold text-slate-800">{chem.name}</td>
                    <td className="py-2 px-3 text-slate-600 font-mono text-[11px]">{chem.formula || 'Lab Grade'}</td>
                    <td className="py-2 px-3 font-bold text-[#005689] whitespace-nowrap">{chem.qty}</td>
                    <td className="py-2 px-3 text-slate-600 text-[11px]">{chem.application || 'Standard chemical test reagent'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ═════════ 3. BIOLOGICAL SPECIMENS IN TABLE FORMAT ═════════ */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-slate-900" style={{ color: '#003c6e' }}>
              3. Biological Permanent Slides &amp; Preserved Museum Specimens
            </h3>
            <p className="text-xs text-slate-500">Official Clause 6(c) Museum Jars, Microscopic Mounts &amp; Anatomical Models</p>
          </div>
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 self-start sm:self-auto">
            15 Preserved Specimens
          </span>
        </div>

        {/* Specimens Full Table */}
        <div className="space-y-1.5">
          <div className="sm:hidden text-[10px] text-slate-500 italic flex items-center justify-end gap-1 font-medium">
            <span>↔ Swipe horizontally to view full table</span>
          </div>
          <div className="rounded-xl border border-slate-200 overflow-x-auto overflow-y-auto max-h-96 shadow-2xs w-full scrollbar-thin">
            <table className="min-w-[660px] w-full text-left text-xs">
              <thead className="bg-[#EDF5FA] text-[#003c6e] font-bold uppercase sticky top-0 z-10 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 text-center w-14">Photo</th>
                  <th className="py-2.5 px-2.5 w-10">#</th>
                  <th className="py-2.5 px-3">Specimen / Slide Name</th>
                  <th className="py-2.5 px-3">Type / Mount</th>
                  <th className="py-2.5 px-3">Mandated Quantity</th>
                  <th className="py-2.5 px-3">Microscopic Observation / Syllabus Topic</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {CBSE_SOP_BIOLOGY_SPECIMENS.map((spec, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    {/* Photo Column */}
                    <td className="py-2 px-3 text-center">
                      <button
                        onClick={() => setPreviewItem({
                          name: spec.name,
                          category: 'Biology Specimen / Slide',
                          qty: spec.qty,
                          type: spec.type,
                          observation: spec.observation,
                          image: spec.image,
                          alt: spec.alt
                        })}
                        className="relative w-10 h-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 hover:opacity-80 transition group shrink-0 inline-block shadow-2xs"
                        title="Click to zoom image"
                      >
                        <img
                          src={spec.image || '/images/categories/biology.jpg'}
                          alt={spec.alt || `${spec.name} - CBSE Biology Specimen`}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                          loading="lazy"
                        />
                        <span className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                          <ZoomIn className="w-3.5 h-3.5 text-white" />
                        </span>
                      </button>
                    </td>
                    <td className="py-2 px-2.5 text-slate-400 font-mono">{idx + 1}</td>
                    <td className="py-2 px-3 font-semibold text-slate-800">{spec.name}</td>
                    <td className="py-2 px-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 whitespace-nowrap">
                        {spec.type || 'Permanent Slide'}
                      </span>
                    </td>
                    <td className="py-2 px-3 font-bold text-[#005689] whitespace-nowrap">{spec.qty}</td>
                    <td className="py-2 px-3 text-slate-600 text-[11px]">{spec.observation || 'Microscopic morphological study'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ═════════ 4. GLASSWARE PURITY & INSPECTION WARNING ═════════ */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1.5">
        <div className="flex items-center gap-2 font-bold text-sm text-amber-950">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>Critical Affiliation Inspection Note: Glassware &amp; Chemical Storage</span>
        </div>
        <p>
          CBSE inspection committees strictly reject cheap unbranded soda-lime glass test tubes and ungraduated beakers because they crack under direct flame. All glassware supplied by CSEEL is 100% <strong>Borosilicate 3.3 laboratory glass</strong> with permanent ceramic enamel graduations. All concentrated acids must be stored inside locked double-door metal/wooden cupboards away from student workbenches.
        </p>
      </div>

      {/* ═════════ INTERACTIVE IMAGE ZOOM / LIGHTBOX MODAL ═════════ */}
      {previewItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setPreviewItem(null)}
        >
          <div 
            className="relative bg-white rounded-2xl w-[94vw] sm:max-w-lg overflow-hidden shadow-2xl border border-slate-200 text-slate-800 max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-slate-100 bg-slate-50 shrink-0">
              <div>
                <span className="text-[10px] font-bold text-[#005689] uppercase tracking-wider block">
                  {previewItem.category || previewItem.type || 'CBSE Laboratory Item'}
                </span>
                <h4 className="font-bold text-slate-900 text-sm">{previewItem.name}</h4>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
                aria-label="Close Preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Image Container with Zoom Effect */}
            <div className="relative aspect-video bg-slate-900 flex items-center justify-center overflow-hidden group shrink-0">
              <img
                src={previewItem.image || '/images/features/hands-on-science-laboratory-beakers.avif'}
                alt={previewItem.alt || previewItem.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-xs text-white text-[10px] font-medium flex items-center gap-1">
                <Eye className="w-3 h-3 text-cyan-300" />
                <span>High-Resolution Photo Preview</span>
              </div>
            </div>

            {/* Details Body (Scrollable on small mobile screens) */}
            <div className="p-4 space-y-3 text-xs overflow-y-auto">
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Mandated Quantity</span>
                  <span className="font-bold text-[#005689] text-xs">{previewItem.qty}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Specification / Standard</span>
                  <span className="font-semibold text-slate-700 text-xs">
                    {previewItem.spec || previewItem.formula || previewItem.type || 'CBSE SARAS Standard'}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Descriptive Alt Text</span>
                <p className="text-slate-600 italic text-[11px] mt-0.5">
                  &ldquo;{previewItem.alt || previewItem.name}&rdquo;
                </p>
              </div>

              {(previewItem.application || previewItem.observation) && (
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Lab Purpose &amp; Observation</span>
                  <p className="text-slate-700 text-xs mt-0.5">
                    {previewItem.application || previewItem.observation}
                  </p>
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                <span>💡 Image slot active — customize photo URL in dataset.</span>
                <button
                  onClick={() => setPreviewItem(null)}
                  className="px-3 py-1 rounded-lg bg-[#005689] text-white font-bold hover:bg-[#003c6e] transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SUBPAGE 2: SPACE & 600 SQ FT LAYOUT (Exclusively on /composite-lab/space)
   ═══════════════════════════════════════════════════════════════ */
export function SpaceSubpageContent() {
  return (
    <div className="space-y-8 text-slate-700 text-sm leading-relaxed">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3" style={{ color: '#003c6e' }}>
          Room Dimension Norms, 8-Sink Plumbing &amp; Civil Blueprints
        </h2>
        <p>
          According to CBSE Affiliation Bye-Laws (Rule 4.4) and the SARAS Composite Science Laboratory SOP (Clause 4 &amp; 5), the school laboratory must have a <strong>minimum clear carpet area of 600 sq. ft.</strong> (approximately 56 sq. meters). This space must be dedicated exclusively to science practicals and cannot be combined with a standard lecture classroom.
        </p>
        <p className="mt-2.5">
          During SARAS on-site inspection, the committee physically takes a measuring tape and records a continuous 360-degree geotagged video showing the carpet area, aisle clearance, plumbing points, and emergency exits.
        </p>
      </div>

      {/* Room Dimensions Grid */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-slate-900" style={{ color: '#003c6e' }}>
          1. Optimal 600 Sq. Ft. Room Aspect Ratios
        </h3>
        <p className="text-xs text-slate-500">Architectural dimensions recommended for uninterrupted sightlines and safety:</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase">Layout A (Recommended)</span>
            <span className="text-base font-black text-[#005689] block">30 ft × 20 ft</span>
            <p className="text-[11px] text-slate-500">Perfect rectangular layout with central aisle and side plumbing lines.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase">Layout B (Square Hall)</span>
            <span className="text-base font-black text-[#005689] block">25 ft × 24 ft</span>
            <p className="text-[11px] text-slate-500">Allows 4 large island workbenches with peripheral perimeter sinks.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase">Layout C (Deep Room)</span>
            <span className="text-base font-black text-[#005689] block">35 ft × 17.5 ft</span>
            <p className="text-[11px] text-slate-500">Requires linear 2-row workbench arrangement with wide central corridor.</p>
          </div>
        </div>
      </div>

      {/* 8-Sink Distribution Architecture */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2" style={{ color: '#003c6e' }}>
            <Droplets className="w-5 h-5 text-cyan-600" />
            <span>2. The 8-Sink Water &amp; Drainage Distribution Standard</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            CBSE mandates a minimum of 8 student wash sinks plus 1 dedicated teacher sink.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-bold text-slate-900 block text-sm">Island Workbench Configuration (Preferred)</span>
            <p className="text-slate-600 leading-relaxed">
              4 central student workbenches, each measuring 8 ft × 4 ft. Each table incorporates 2 acid-resistant ceramic/polypropylene sinks with double-way swan neck brass taps. This allows 10 students per bench to wash apparatus without crowding the perimeter.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-bold text-slate-900 block text-sm">Peripheral Wall Counter Configuration</span>
            <p className="text-slate-600 leading-relaxed">
              For rooms with existing floor slabs where digging central trenches is impossible, 8 wash sinks are installed along the side walls on continuous black granite slabs with overhead water manifold piping and anti-clog chemical traps.
            </p>
          </div>
        </div>
      </div>

      {/* Seating & Two Doors Safety */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2" style={{ color: '#003c6e' }}>
            <DoorOpen className="w-5 h-5 text-amber-600" />
            <span>3. Two Unobstructed Doors &amp; 40-Stool Ergonomics</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">Critical life-safety norms examined by the inspection committee:</p>
        </div>

        <div className="space-y-2.5 text-xs text-slate-700">
          <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900">Two Outward-Swinging Doors:</strong> The lab MUST have 2 wide doors situated at opposite ends of the room. In case of an accidental fire, acid spill, or gas leakage, students can evacuate immediately without bottlenecking. Doors must open outwards into the school corridor.
            </div>
          </div>
          <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900">40 Circular Lab Stools:</strong> Backless wooden or heavy-duty polymer stools (height 18" to 22") allow students to quickly step back and stand up during exothermic reactions. Revolving office chairs with wheels are strictly prohibited by safety guidelines.
            </div>
          </div>
          <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900">Aisle Spacing:</strong> A minimum walkway clearance of 4.5 feet between adjacent workbenches is required so that the science teacher can freely circulate, inspect titration burettes, and guide learners.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SUBPAGE 3: CERTIFIED VENDOR & TENDERS (Exclusively on /composite-lab/vendor)
   ═══════════════════════════════════════════════════════════════ */
export function VendorSubpageContent() {
  return (
    <div className="space-y-8 text-slate-700 text-sm leading-relaxed">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3" style={{ color: '#003c6e' }}>
          Vendor Qualification, GeM Procurement &amp; Affiliation Assurance
        </h2>
        <p>
          Setting up a CBSE Composite Science Laboratory is fundamentally different from purchasing ordinary stationery. It involves customized civil granite fabrication, acid-proof plumbing, LPG manifold testing, electrical earthing, and supplying ISI-standard calibrated instruments.
        </p>
        <p className="mt-2.5">
          Schools that hire local uncertified carpenters and general traders frequently face <strong>deficiency notices on the SARAS portal</strong> due to incorrect sink dimensions, missing safety shut-offs, unbranded apparatus, or lack of calibration certificates.
        </p>
      </div>

      {/* 5 Warning Signs of Substandard Vendors */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-slate-900" style={{ color: '#003c6e' }}>
          1. 5 Red Flags When Selecting a Lab Vendor
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-red-50/60 border border-red-200 text-red-900 space-y-1">
            <span className="font-bold flex items-center gap-1.5 text-red-950">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>Uncalibrated &amp; Unbranded Equipment</span>
            </span>
            <p className="text-slate-600">Supplying cheap microscope lenses without magnification stamps or optical prism sets with internal air bubbles that fail CBSE inspection.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-red-50/60 border border-red-200 text-red-900 space-y-1">
            <span className="font-bold flex items-center gap-1.5 text-red-950">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>No On-Site Plumbing &amp; Civil Execution</span>
            </span>
            <p className="text-slate-600">Delivering equipment in boxes on the school doorstep without installing the 8 water sinks, drainage manifold, or gas burners.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-red-50/60 border border-red-200 text-red-900 space-y-1">
            <span className="font-bold flex items-center gap-1.5 text-red-950">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>Soda-Lime Glass Instead of Borosilicate 3.3</span>
            </span>
            <p className="text-slate-600">Using thin soda glass beakers that shatter when heated over Bunsen burners, posing severe burn risks to Class 9 and 10 students.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-red-50/60 border border-red-200 text-red-900 space-y-1">
            <span className="font-bold flex items-center gap-1.5 text-red-950">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>Missing Inspection Readiness Dossier</span>
            </span>
            <p className="text-slate-600">Failing to provide bilingual Safety Norms display boards, Equipment Stock Registers with CBSE item codes, and Material Safety Data Sheets (MSDS).</p>
          </div>
        </div>
      </div>

      {/* GeM & Turnkey Scope */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <div>
          <h3 className="text-lg font-bold text-slate-900" style={{ color: '#003c6e' }}>
            2. The CSEEL Turnkey Execution Scope (GeM Registered)
          </h3>
          <p className="text-xs text-slate-500 mt-1">End-to-end delivery framework provided by CSEEL certified engineers:</p>
        </div>

        <div className="space-y-2.5 text-xs text-slate-700">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900">Custom 2D/3D CAD Layout:</strong> Scaled specifically to your school’s 600 sq. ft. room dimensions, verifying plumbing risers, electrical conduits, and two outward emergency doors.
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900">Complete Civil &amp; Plumbing Installation:</strong> Delivery and assembly of 4 island workbenches, black granite countertops, 8 acid-resistant sinks, continuous running water lines, and master drainage manifold.
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900">Official CBSE Affiliation Dossier:</strong> Delivery of itemized stock register with CBSE item numbers pre-printed, teacher lab manual, MSDS hazardous chemical sheets, and calibration warranty.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SUBPAGE 4: COST & PRICING BREAKDOWN (Exclusively on /composite-lab/cost)
   ═══════════════════════════════════════════════════════════════ */
export function CostSubpageContent() {
  return (
    <div className="space-y-8 text-slate-700 text-sm leading-relaxed">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3" style={{ color: '#003c6e' }}>
          Transparent Price Breakdown &amp; Budget Estimation (2026)
        </h2>
        <p>
          Setting up a fully compliant CBSE Composite Science Laboratory is an essential capital investment for school affiliation. Depending on whether your school already has existing granite workbenches or requires a 100% turnkey transformation from a bare hall, setup costs range from <strong>₹2.85 Lakhs to ₹6.50 Lakhs</strong>.
        </p>
        <p className="mt-2.5">
          CSEEL offers transparent, itemized packages with GST-compliant billing suitable for school audit reports and state grant clearance.
        </p>
      </div>

      {/* Package Tiers */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-slate-900" style={{ color: '#003c6e' }}>
          1. Turnkey Budget Tiers for Indian Schools
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase">Tier 1: Equipment Only</span>
              <h4 className="text-lg font-bold text-slate-900 mt-1">Starter Affiliation Kit</h4>
              <div className="text-2xl font-black text-[#005689] my-2">₹2.85 Lakhs</div>
              <p className="text-xs text-slate-500">For schools that already have workbenches, 8 sinks, and room plumbing completed.</p>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> All 49 non-consumable apparatus</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 18 laboratory chemical reagents</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 15 biology specimen jars &amp; slides</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> CBSE Stock register &amp; safety charts</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-b from-[#EDF5FA] to-white border-2 border-[#005689] shadow-md flex flex-col justify-between space-y-3 relative">
            <span className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-[#005689] text-white text-[10px] font-black uppercase">
              Most Popular
            </span>
            <div>
              <span className="text-[11px] font-bold text-[#005689] uppercase">Tier 2: Full Turnkey</span>
              <h4 className="text-lg font-bold text-slate-900 mt-1">Complete Lab Setup</h4>
              <div className="text-2xl font-black text-[#005689] my-2">₹4.85 Lakhs</div>
              <p className="text-xs text-slate-600">Complete setup from bare room: furniture, 8 sinks, plumbing &amp; all apparatus.</p>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-700 border-t border-slate-200 pt-3">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 4 island granite tables &amp; 8 sinks</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 40 student stools + 1 teacher desk</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> On-site civil plumbing &amp; gas lines</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> All 49 apparatus + 18 chemicals</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
            <div>
              <span className="text-[11px] font-bold text-purple-700 uppercase">Tier 3: Hybrid STEM</span>
              <h4 className="text-lg font-bold text-slate-900 mt-1">Science + Skill Super-Lab</h4>
              <div className="text-2xl font-black text-purple-900 my-2">₹7.50 Lakhs</div>
              <p className="text-xs text-slate-500">Combines mandatory science lab with AI, 3D printing &amp; Circular 75/2024 skills.</p>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-purple-600" /> Full Turnkey Science Lab package</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-purple-600" /> 75" 4K Interactive Flat Panel Display</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-purple-600" /> 3D Printer + Arduino robotics kits</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-purple-600" /> Dual syllabus (Science + AI Code 417)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Itemized BOQ Breakdown */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <h3 className="text-lg font-bold text-slate-900" style={{ color: '#003c6e' }}>
          2. Itemized Bill of Quantities (BOQ) Cost Distribution
        </h3>
        <div className="space-y-1.5">
          <div className="sm:hidden text-[10px] text-slate-500 italic flex items-center justify-end gap-1 font-medium">
            <span>↔ Swipe horizontally to view full table</span>
          </div>
          <div className="rounded-xl border border-slate-200 overflow-x-auto shadow-2xs w-full scrollbar-thin">
            <table className="min-w-[560px] w-full text-left text-xs">
            <thead className="bg-[#EDF5FA] text-[#003c6e] font-bold uppercase border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Infrastructure Component</th>
                <th className="py-2.5 px-3">Standard Scope</th>
                <th className="py-2.5 px-3">Estimated Budget</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50">
                <td className="py-2 px-3 font-semibold text-slate-800">49 Non-Consumable Apparatus</td>
                <td className="py-2 px-3 text-slate-600">10 Microscopes, optical prisms, lenses, glassware, stands</td>
                <td className="py-2 px-3 font-bold text-[#005689]">₹1,75,000</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-2 px-3 font-semibold text-slate-800">18 Chemicals &amp; Specimens</td>
                <td className="py-2 px-3 text-slate-600">Lab-grade reagents, safety bottles, permanent slides &amp; jars</td>
                <td className="py-2 px-3 font-bold text-[#005689]">₹45,000</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-2 px-3 font-semibold text-slate-800">4 Island Tables &amp; 40 Stools</td>
                <td className="py-2 px-3 text-slate-600">Black granite tops, CRCA steel frames, 40 circular stools</td>
                <td className="py-2 px-3 font-bold text-[#005689]">₹1,65,000</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-2 px-3 font-semibold text-slate-800">8 Sinks &amp; Plumbing Lines</td>
                <td className="py-2 px-3 text-slate-600">Acid-resistant sinks, swan-neck taps, drainage manifold</td>
                <td className="py-2 px-3 font-bold text-[#005689]">₹55,000</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-2 px-3 font-semibold text-slate-800">Safety &amp; Compliance Dossier</td>
                <td className="py-2 px-3 text-slate-600">2 Fire extinguishers, first aid kit, bilingual hazard charts, stock books</td>
                <td className="py-2 px-3 font-bold text-[#005689]">₹20,000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SUBPAGE 5: OFFICIAL CBSE SARAS SOP (Exclusively on /composite-lab/cbse-sop)
   ═══════════════════════════════════════════════════════════════ */
export function CbseSopSubpageContent() {
  return (
    <div className="space-y-8 text-slate-700 text-sm leading-relaxed">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3" style={{ color: '#003c6e' }}>
          Official CBSE SARAS SOP: Clause-by-Clause Inspection Breakdown
        </h2>
        <p>
          The Central Board of Secondary Education issued the <em>"Essential Standard Operating Procedure (SOP) Required for Affiliation with CBSE - Composite Science Laboratory"</em> to eliminate arbitrary inspections and establish transparent benchmarks across all secondary schools.
        </p>
        <p className="mt-2.5">
          Under the SARAS framework, the inspection committee operates under strict digital guidelines where non-compliance with laboratory norms directly triggers affiliation rejection or extension deferral.
        </p>
      </div>

      {/* Clause-by-Clause Regulatory Table */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-slate-900" style={{ color: '#003c6e' }}>
          1. Key Regulatory Clauses Breakdown
        </h3>
        <div className="space-y-2.5 text-xs text-slate-700">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-[#005689] block text-sm">Clause 1 to 3: Pedagogical Objective &amp; NEP 2020</span>
            <p className="text-slate-600 leading-relaxed">Mandates that school laboratories shift classroom teaching from rote textbook memorization towards competency-focused experiential learning, observation, hypothesis testing, and quantitative measurements consistent with NEP 2020 Para 4.6.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-[#005689] block text-sm">Clause 4 &amp; 5: Physical Infrastructure Specifications</span>
            <p className="text-slate-600 leading-relaxed">Mandatory 600 sq. ft. floor space, 8 wash sinks, 40 student stools, 1 teacher demonstration desk with sink/gas burner, intelligent board, 2 laptops, 2 exhaust fans, and two outward emergency doors.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-[#005689] block text-sm">Clause 6: Itemized Equipment, Chemicals &amp; Specimens</span>
            <p className="text-slate-600 leading-relaxed">Prescribes the exact 49 non-consumable apparatus items, 18 chemicals, and biological specimens required for secondary classes 6th to 10th.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-[#005689] block text-sm">Clause 7: Mandatory Laboratory Safety Rules &amp; Protocols</span>
            <p className="text-slate-600 leading-relaxed">Specifies 18 strict safety rules for students (lab coats, safety goggles, pipetting bans) and teacher directives including hazardous waste disposal and first aid maintenance.</p>
          </div>
        </div>
      </div>

      {/* Inspection Day Videography Checklist */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <h3 className="text-lg font-bold text-slate-900" style={{ color: '#003c6e' }}>
          2. SARAS Inspection Day Videography Checklist
        </h3>
        <p className="text-xs text-slate-500">Items that the visiting inspection team MUST record on camera for the SARAS portal:</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          <div className="p-3 rounded-lg bg-white border border-slate-200 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Tape measurement showing at least 600 sq. ft. clear floor area.</span>
          </div>
          <div className="p-3 rounded-lg bg-white border border-slate-200 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Turning on all 8 student water taps showing active running water.</span>
          </div>
          <div className="p-3 rounded-lg bg-white border border-slate-200 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Verification of two independent exit doors swinging outwards.</span>
          </div>
          <div className="p-3 rounded-lg bg-white border border-slate-200 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Physical count of 10 compound microscopes and 40 stools.</span>
          </div>
          <div className="p-3 rounded-lg bg-white border border-slate-200 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Inspection of locked chemical cabinet and valid fire extinguisher tag.</span>
          </div>
          <div className="p-3 rounded-lg bg-white border border-slate-200 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Stock register signatures and student practical logbooks.</span>
          </div>
        </div>
      </div>

      {/* Official Download */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#003c6e] to-[#005689] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-cyan-200 uppercase">Original CBSE Document</span>
          <h4 className="text-base font-bold text-white mt-0.5">Download Official CompositeScienceLabSOP.pdf</h4>
          <p className="text-xs text-blue-100 mt-1">Official Central Board circular from the SARAS affiliation portal.</p>
        </div>
        <a
          href="/docs/CompositeScienceLabSOP.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 rounded-xl bg-white text-[#003c6e] hover:bg-blue-50 font-bold text-xs shrink-0 flex items-center gap-1.5 transition shadow-sm"
        >
          <Download className="w-4 h-4" />
          <span>Download PDF (8 Pages)</span>
        </a>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SUBPAGE 6: SKILL EDUCATION & NEP 2020 (Exclusively on /composite-lab/skill-education)
   ═══════════════════════════════════════════════════════════════ */
export function SkillEducationSubpageContent() {
  return (
    <div className="space-y-8 text-slate-700 text-sm leading-relaxed">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3" style={{ color: '#003c6e' }}>
          Composite Science Lab vs. Composite Skill Lab: CBSE Circulars &amp; Complete Difference Analysis
        </h2>
        <p>
          CBSE affiliated schools ke liye do alag-alag composite labs ke official circulars aur mandates hain jinhe samajhna behad zaroori hai. In dono labs ka uddeshya, circulars, classes aur infrastructure rules bilkul alag hain:
        </p>
      </div>

      {/* 2 Detailed Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Composite Skill Lab */}
        <div className="p-5 rounded-2xl bg-purple-50/50 border border-purple-200/80 space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-purple-700 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              1
            </span>
            <div>
              <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">Vocational &amp; 21st Century Skills</span>
              <h3 className="text-base font-bold text-slate-900">Composite Skill Lab (Vocational Skills)</h3>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            According to CBSE official <strong>Circular No. Skill-75/2024</strong> (dated 27.08.2024), reinforced by <strong>Circular No. 13/2026</strong>, this laboratory is <strong>mandatory</strong> for all students across <strong>Classes VI to XII</strong>.
          </p>
          <div className="p-3 bg-white rounded-xl border border-purple-100 text-xs space-y-1.5">
            <strong className="text-purple-900 block font-bold">CBSE Lab Setup Options:</strong>
            <ul className="space-y-1 text-slate-600">
              <li className="flex items-start gap-1.5">
                <span className="text-purple-600 font-bold">•</span>
                <span><strong>Option A:</strong> A single <strong>600 sq. ft.</strong> unified laboratory catering to all students from Classes VI to XII.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-purple-600 font-bold">•</span>
                <span><strong>Option B:</strong> Two separate <strong>400 sq. ft.</strong> laboratories — one dedicated for Classes VI to X, and another for Classes XI and XII.</span>
              </li>
            </ul>
          </div>
          <div className="pt-2 border-t border-purple-100 text-[11px] text-purple-800">
            <strong>Curriculum Focus:</strong> Artificial Intelligence (AI 417/843), Coding (418), Robotics, IoT, Data Science, Design Thinking, and 33+ vocational modules.
          </div>
        </div>

        {/* Card 2: Composite Science Lab */}
        <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-200/80 space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-[#005689] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              2
            </span>
            <div>
              <span className="text-[10px] font-bold text-[#005689] uppercase tracking-wider block">Academic Science Practicals</span>
              <h3 className="text-base font-bold text-slate-900">Composite Science Laboratory (PCB)</h3>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            According to CBSE <strong>Circular No. 11/2022</strong> and associated <strong>SARAS SOPs</strong>, the Composite Science Lab is strictly mandated for <strong>Secondary Classes (Classes IX and X)</strong>. As per timetable allocation, it may also be used for introductory practical demonstrations for <strong>Classes VI to VIII</strong>.
          </p>
          <div className="p-3 bg-white rounded-xl border border-blue-100 text-xs space-y-1.5">
            <strong className="text-blue-900 block font-bold">Senior Secondary (XI-XII) Mandate:</strong>
            <p className="text-slate-600 leading-relaxed">
              Upon reaching the Senior Secondary level (Classes XI and XII), CBSE regulations mandate separate, dedicated laboratories for Physics, Chemistry, and Biology. A Composite Science Lab is <strong>not valid</strong> for Senior Secondary affiliation.
            </p>
          </div>
          <div className="pt-2 border-t border-blue-100 text-[11px] text-[#005689]">
            <strong>Infrastructure Specs:</strong> Minimum 600 sq. ft. room, 8 sinks with continuous running water, 40 stools, 49 apparatus, 18 chemicals.
          </div>
        </div>
      </div>

      {/* Complete Side-by-Side Comparison Matrix */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <h3 className="text-lg font-bold text-slate-900" style={{ color: '#003c6e' }}>
          Side-by-Side Regulatory Difference Matrix
        </h3>
        <div className="space-y-1.5">
          <div className="sm:hidden text-[10px] text-slate-500 italic flex items-center justify-end gap-1 font-medium">
            <span>↔ Swipe horizontally to view full table</span>
          </div>
          <div className="rounded-xl border border-slate-200 overflow-x-auto shadow-2xs w-full scrollbar-thin">
            <table className="min-w-[620px] w-full text-left text-xs">
            <thead className="bg-[#EDF5FA] text-[#003c6e] font-bold uppercase border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Criteria / Parameter</th>
                <th className="py-2.5 px-3">Composite Science Lab</th>
                <th className="py-2.5 px-3">Composite Skill Lab</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-bold text-slate-800">Official CBSE Circular</td>
                <td className="py-2.5 px-3 font-semibold text-[#005689]">Circular No. 11/2022 &amp; SARAS SOP</td>
                <td className="py-2.5 px-3 font-semibold text-purple-700">Circular No. Skill-75/2024 &amp; 13/2026</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-bold text-slate-800">Mandatory Grade Spectrum</td>
                <td className="py-2.5 px-3 text-slate-700">Classes IX &amp; X (Secondary Affiliation)</td>
                <td className="py-2.5 px-3 text-slate-700 font-semibold">Classes VI to XII (Middle to Sr. Secondary)</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-bold text-slate-800">Middle School (VI–VIII) Role</td>
                <td className="py-2.5 px-3 text-slate-600">Permitted via timetable sharing</td>
                <td className="py-2.5 px-3 text-slate-600">Strictly mandatory in curriculum</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-bold text-slate-800">Senior Secondary (XI–XII) Status</td>
                <td className="py-2.5 px-3 text-rose-700 font-bold bg-rose-50/50">
                  NOT VALID (Separate Individual Physics, Chem, Bio labs mandatory)
                </td>
                <td className="py-2.5 px-3 text-emerald-700 font-bold bg-emerald-50/50">
                  FULLY VALID &amp; MANDATORY (Skill Lab operates for XI–XII)
                </td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-bold text-slate-800">Room Area Options</td>
                <td className="py-2.5 px-3 text-slate-700">Single 600 sq. ft. room compulsory</td>
                <td className="py-2.5 px-3 text-slate-700 font-medium">
                  Option A: 1 × 600 sq. ft. OR Option B: 2 × 400 sq. ft.
                </td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-bold text-slate-800">Plumbing &amp; Water Needs</td>
                <td className="py-2.5 px-3 text-slate-700 font-medium">8 student sinks + 1 demo sink continuous running water</td>
                <td className="py-2.5 px-3 text-slate-600">No continuous wet sinks required (power sockets prioritized)</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-bold text-slate-800">Core Hardware &amp; Kits</td>
                <td className="py-2.5 px-3 text-slate-600">49 apparatus (prisms, lenses, microscopes, chemicals)</td>
                <td className="py-2.5 px-3 text-slate-600">Robotics kits, IoT sensors, 3D printers, AI computing, AR/VR</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-bold text-slate-800">Affiliation Inspection Type</td>
                <td className="py-2.5 px-3 text-slate-600">SARAS Geotagged physical inspection for general affiliation</td>
                <td className="py-2.5 px-3 text-slate-600">Skill Education Compliance &amp; NEP Vocational audit</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

      {/* The 2-in-1 Hybrid Solution */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <div>
          <h3 className="text-lg font-bold text-slate-900" style={{ color: '#003c6e' }}>
            2. The CSEEL 2-in-1 Unified Hybrid Solution
          </h3>
          <p className="text-xs text-slate-500 mt-1">Smart architectural planning that allows schools to satisfy both mandates efficiently:</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-bold text-[#005689] block text-sm">Zone A: Wet Science Practicals (600 sq. ft.)</span>
            <p className="text-slate-600 leading-relaxed">
              Equipped with 4 acid-proof black granite tables, 8 water sinks, Bunsen burners, and locked chemical cupboards. Fully compliant with Circular 11/2022 and SARAS SOP for Classes 6–10.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-bold text-purple-800 block text-sm">Zone B: Dry Skill &amp; Tinkering Hub</span>
            <p className="text-slate-600 leading-relaxed">
              Equipped with anti-static workbenches, 3D printing station, robotics electronics kits, interactive display, and laptop docks for Circular Skill-75/2024 and Circular 13/2026.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
          <strong className="block text-emerald-950 mb-1">Campus Capital Savings: Over ₹3.5 Lakhs &amp; 40% Carpet Area</strong>
          Donon labs ki physical requirements ko smartly integrate karke schools building construction aur equipment duplication me lakho rupaye bacha sakte hain.
        </div>
      </div>

      {/* Official Circular Verification Links */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-[#003c6e] text-white space-y-3">
        <div>
          <span className="text-xs font-bold text-cyan-300 uppercase">Official CBSE Verification</span>
          <h4 className="text-base font-bold text-white mt-0.5">Direct Links to Official CBSE Portals &amp; Circulars</h4>
          <p className="text-xs text-slate-300 mt-1">
            Aap in sabhi niyamo ki pushti seedhe CBSE ke official portals par jaakar kar sakte hain:
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs">
          <a
            href="https://www.cbse.gov.in/cbsenew/documents/75_Circular_2024_Composite_Skill_Labs_27082024.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition flex items-center justify-between"
          >
            <span>📄 Circular No. Skill-75/2024 (PDF)</span>
            <Download className="w-3.5 h-3.5 text-cyan-300" />
          </a>
          <a
            href="https://cbseacademic.nic.in/web_material/Circulars/2026/13_Circular_2026.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition flex items-center justify-between"
          >
            <span>📄 Circular No. 13/2026 (PDF)</span>
            <Download className="w-3.5 h-3.5 text-cyan-300" />
          </a>
          <a
            href="https://saras.cbse.gov.in/saras/Circulars/Circular11_2022.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition flex items-center justify-between"
          >
            <span>📄 Circular No. 11/2022 - Science Lab (PDF)</span>
            <Download className="w-3.5 h-3.5 text-cyan-300" />
          </a>
          <a
            href="https://cbseacademic.nic.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition flex items-center justify-between"
          >
            <span>🌐 CBSE Academic Circulars Portal</span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-300" />
          </a>
        </div>
      </div>
    </div>
  );
}
