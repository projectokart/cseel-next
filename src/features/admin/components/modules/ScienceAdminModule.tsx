'use client';

import React, { useState } from 'react';
import { Beaker, Plus, Eye, Play, Sparkles, BookOpen, Layers, Edit, CheckCircle2 } from 'lucide-react';
import { ALL_EXPERIMENTS } from '@/lib/experimentsData';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

export const ScienceAdminModule: React.FC = () => {
  const { addAuditLog } = useAdminAuth();
  const [labList, setLabList] = useState(ALL_EXPERIMENTS);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filtered = labList.filter((e) => selectedCategory === 'All' || e.subject === selectedCategory);

  return (
    <div className="space-y-6">
      {/* ── HEADER ── */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-50 border border-cyan-200 rounded-full text-xs font-black text-cyan-700">
            <Beaker className="w-3.5 h-3.5" />
            <span>hands-on experiment & EXPERIMENTAL CURRICULUM DESK</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900">
            Interactive hands-on science experiments & Virtual Practical Labs
          </h2>
          <p className="text-xs text-gray-500 max-w-2xl">
            Configure simulations and NEP-2020 experimental manuals live on <code className="bg-slate-100 px-1 py-0.5 rounded text-purple-700 font-bold">/demo</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-purple-700 font-bold">/hands-on-experiments</code> and <code className="bg-slate-100 px-1 py-0.5 rounded text-purple-700 font-bold">/experiment/[slug]</code>.
          </p>
        </div>

        <button
          onClick={() => addAuditLog('OPENED_SIMULATION_EDITOR', 'science_simulations', 'Initiated new experiment setup wizard')}
          className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-black text-xs rounded-2xl shadow-md transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Lab Simulation</span>
        </button>
      </div>

      {/* ── CATEGORY FILTER ── */}
      <div className="flex flex-wrap items-center gap-2">
        {['All', 'Physics', 'Chemistry', 'Biology'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-black transition-all ${selectedCategory === cat ? 'bg-cyan-700 text-white shadow-xs' : 'bg-white border border-gray-200 text-gray-700 hover:bg-slate-50'}`}
          >
            {cat} Labs
          </button>
        ))}
      </div>

      {/* ── EXPERIMENTS GRID ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((exp) => (
          <div key={exp.id} className="bg-white rounded-2xl p-5 border border-gray-200 shadow-2xs hover:border-cyan-400 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-cyan-700 bg-cyan-50 px-2.5 py-0.5 rounded-full border border-cyan-200">
                  {exp.subject}
                </span>
                <span className="text-[10px] font-bold text-gray-500">{exp.class}</span>
              </div>
              <div>
                <h3 className="text-sm font-black text-gray-900">{exp.title}</h3>
                <p className="text-xs text-gray-500 line-clamp-2 mt-1">{exp.description}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2 text-xs">
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                ✓ Interactive Sim Active
              </span>
              <a
                href={`/experiment/${exp.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white font-black rounded-xl shadow-2xs transition-colors flex items-center gap-1"
              >
                <Play className="w-3 h-3" />
                <span>Launch Sim</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScienceAdminModule;
