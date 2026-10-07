'use client';

import React, { useState } from 'react';
import { Wrench, Plus, Download, Eye, Sparkles, FileCode, CheckCircle2, Layers } from 'lucide-react';
import { ALL_PROJECTS } from '@/lib/projectsData';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

export const ProjectokartAdminModule: React.FC = () => {
  const { addAuditLog } = useAdminAuth();
  const [projectList, setProjectList] = useState(ALL_PROJECTS);

  return (
    <div className="space-y-6">
      {/* ── HEADER ── */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs font-black text-amber-800">
            <Wrench className="w-3.5 h-3.5" />
            <span>PROJECTOKART HARDWARE & ATL INVENTIONS DESK</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900">
            Science Fair Kits, CAD Schematics & BOM Lists
          </h2>
          <p className="text-xs text-gray-500 max-w-2xl">
            Control the 15+ Science Fair Prototypes on <code className="bg-slate-100 px-1 py-0.5 rounded text-purple-700 font-bold">/projects</code> and <code className="bg-slate-100 px-1 py-0.5 rounded text-purple-700 font-bold">/project/[slug]</code>. Manage downloadable circuit schematics, 3D STL files, code repositories and kit pricing.
          </p>
        </div>

        <button
          onClick={() => addAuditLog('CREATED_PROJECTOKART_KIT', 'projectokart_inventions', 'Initiated new science fair hardware setup')}
          className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-black text-xs rounded-2xl shadow-md transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Projectokart Project</span>
        </button>
      </div>

      {/* ── PROJECT LIST ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projectList.map((proj) => (
          <div key={proj.id} className="bg-white rounded-2xl p-5 border border-gray-200 shadow-2xs hover:border-amber-400 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  {proj.category}
                </span>
                <span className="text-xs font-black text-emerald-700">★ {proj.rating}</span>
              </div>
              <div>
                <h3 className="text-sm font-black text-gray-900">{proj.title}</h3>
                <p className="text-xs text-gray-500 line-clamp-2 mt-1">{proj.desc}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2 text-xs">
              <span className="text-[11px] font-bold text-gray-500 flex items-center gap-1">
                <FileCode className="w-3.5 h-3.5 text-amber-600" />
                <span>CAD / Code Ready</span>
              </span>
              <a
                href={`/project/${proj.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold rounded-xl transition-colors"
              >
                View Public Page
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectokartAdminModule;
