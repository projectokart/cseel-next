'use client';

import React, { useState } from 'react';
import { Sparkles, Plus, FileText, Download, Award, Layers, CheckCircle2 } from 'lucide-react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

interface ResearchPaperItem {
  id: string;
  title: string;
  domain: string;
  authors: string;
  status: 'Published' | 'Peer Review' | 'Patent Pending';
  downloadsCount: number;
  publishedDate: string;
}

const INITIAL_PAPERS: ResearchPaperItem[] = [
  { id: 'rnd-1', title: 'Empirical Pedagogical Efficacy of Virtual Experiment Simulations in Secondary STEM Classrooms', domain: 'Applied Physics & EdTech', authors: 'Dr. Vikram Sharma, Prof. S. N. Bose', status: 'Published', downloadsCount: 1420, publishedDate: 'Jan 2026' },
  { id: 'rnd-2', title: 'Low-Cost Dual-Axis Solar Photovoltaic Tracking for High School ATL Laboratories', domain: 'Renewable Energy', authors: 'Karan Mehra, Dr. Harshvardhan Joshi', status: 'Patent Pending', downloadsCount: 890, publishedDate: 'Feb 2026' },
  { id: 'rnd-3', title: 'Interactive Electrochemical Simulation Models aligned with NEP-2020 Experiential Standards', domain: 'Physical Chemistry', authors: 'Dr. Anita Roy', status: 'Published', downloadsCount: 650, publishedDate: 'March 2026' },
];

export const RndAdminModule: React.FC = () => {
  const { addAuditLog } = useAdminAuth();
  const [papers, setPapers] = useState<ResearchPaperItem[]>(INITIAL_PAPERS);

  return (
    <div className="space-y-6">
      {/* ── HEADER ── */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-50 border border-violet-200 rounded-full text-xs font-black text-violet-700">
            <Sparkles className="w-3.5 h-3.5" />
            <span>RESEARCH, DEVELOPMENT & PATENT DISCLOSURES DESK</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900">
            Scientific Research Papers & Future Innovation Prototypes
          </h2>
          <p className="text-xs text-gray-500 max-w-2xl">
            Manage published whitepapers, laboratory research findings, and ATL innovation patents displayed on <code className="bg-slate-100 px-1 py-0.5 rounded text-purple-700 font-bold">/research</code>.
          </p>
        </div>

        <button
          onClick={() => addAuditLog('UPLOADED_RESEARCH_WHITEPAPER', 'research_rnd', 'Submitted new research paper for peer review')}
          className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-black text-xs rounded-2xl shadow-md transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Submit Research Paper</span>
        </button>
      </div>

      {/* ── PAPERS LIST ── */}
      <div className="space-y-3">
        {papers.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl p-5 border border-gray-200 shadow-2xs hover:border-violet-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase text-violet-700 bg-violet-50 px-2.5 py-0.5 rounded-full border border-violet-200">
                  {p.domain}
                </span>
                <span className="text-[10px] font-bold text-gray-500">Published {p.publishedDate}</span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-gray-900">{p.title}</h3>
              <p className="text-xs text-gray-500">Authors: <strong className="text-gray-700">{p.authors}</strong></p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                {p.status}
              </span>
              <a
                href="/research"
                target="_blank"
                className="px-4 py-2 bg-violet-50 hover:bg-violet-100 text-violet-800 font-bold text-xs rounded-xl transition-colors"
              >
                View on /research
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RndAdminModule;
