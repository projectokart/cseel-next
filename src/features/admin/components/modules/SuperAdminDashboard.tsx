'use client';

import React from 'react';
import {
  ShieldAlert, Users, Building2, Briefcase, GraduationCap,
  Sparkles, Beaker, Wrench, Package, Calendar, FileText,
  Activity, ArrowUpRight, CheckCircle2, RefreshCw, Layers,
  Lock, Globe, Database, ExternalLink
} from 'lucide-react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { ADMIN_ROLE_CONFIGS } from '../../data';
import { AdminRole } from '../../types';

export const SuperAdminDashboard: React.FC = () => {
  const { currentRole, switchRole, setActiveModule, auditLogs, adminUsers } = useAdminAuth();

  const STAT_CARDS = [
    { label: 'Google Indexable Pages', val: '332', desc: '100% Live in Sitemap.xml', icon: Globe, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Schools Onboarded', val: '104', desc: 'Verified STEM Infrastructure', icon: Building2, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Verified Faculty', val: '50', desc: '34 Active 72h Flash Seekers', icon: GraduationCap, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Student Portfolios', val: '50', desc: 'Patent & ATL Fair Inventions', icon: Sparkles, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Live Teaching Jobs', val: '40', desc: 'Schools Across India', icon: Briefcase, color: 'text-teal-500', bg: 'bg-teal-500/10' },
    { label: 'Active Admin Teams', val: '10', desc: 'Role-Based Access Control', icon: Users, color: 'text-rose-500', bg: 'bg-rose-500/10' },
  ];

  const MODULE_SHORTCUTS: {
    role: AdminRole;
    label: string;
    icon: any;
    color: string;
    desc: string;
    modId: any;
    subdomainUrl: string;
    schema: string;
  }[] = [
    {
      role: 'inventory_admin',
      label: 'Lab Materials & Store',
      icon: Package,
      color: 'from-teal-600 to-emerald-700',
      desc: 'Manage STEM lab materials, equipment stock & school wholesale quotes.',
      modId: 'inventory_materials',
      subdomainUrl: 'https://material.cseel.org/admin',
      schema: 'materials.*',
    },
    {
      role: 'hr_admin',
      label: 'HR & Careers Portal',
      icon: Briefcase,
      color: 'from-rose-600 to-pink-700',
      desc: 'Manage internal company vacancies and candidate applications.',
      modId: 'hr_careers',
      subdomainUrl: 'https://careers.cseel.org/admin',
      schema: 'careers.*',
    },
    {
      role: 'school_admin',
      label: 'Schools & Institutes Network',
      icon: Building2,
      color: 'from-blue-600 to-cyan-700',
      desc: 'Verify 100+ partner schools, accreditation levels & STEM lab KYC.',
      modId: 'schools_institutions',
      subdomainUrl: 'https://network.cseel.org/admin',
      schema: 'network.*',
    },
    {
      role: 'programs_admin',
      label: 'Teacher Training & Pedagogy',
      icon: GraduationCap,
      color: 'from-purple-600 to-indigo-700',
      desc: 'NEP-2020 teacher bootcamps, masterclasses and certificate issuances.',
      modId: 'programs_events',
      subdomainUrl: 'https://training.cseel.org/admin',
      schema: 'training.*',
    },
    {
      role: 'programs_admin',
      label: 'Outreach Events & Conclaves',
      icon: Calendar,
      color: 'from-indigo-600 to-violet-700',
      desc: 'National science symposia, principals conclaves and webinars.',
      modId: 'programs_events',
      subdomainUrl: 'https://events.cseel.org/admin',
      schema: 'events.*',
    },
    {
      role: 'super_admin',
      label: 'Support & Helpdesk',
      icon: ShieldAlert,
      color: 'from-orange-600 to-amber-700',
      desc: 'Lab equipment claims, warranty tickets & institutional assistance.',
      modId: 'overview',
      subdomainUrl: 'https://support.cseel.org/admin',
      schema: 'support.*',
    },
    {
      role: 'science_admin',
      label: 'Virtual Lab Practicals',
      icon: Beaker,
      color: 'from-cyan-600 to-teal-700',
      desc: 'Virtual simulations, interactive physics & chemistry apparatus.',
      modId: 'science_simulations',
      subdomainUrl: 'https://content.cseel.org/admin',
      schema: 'science.*',
    },
    {
      role: 'projectokart_admin',
      label: 'Projectokart Hardware',
      icon: Wrench,
      color: 'from-amber-600 to-orange-700',
      desc: 'Science fair kits, CAD diagrams, BOM lists and student awards.',
      modId: 'projectokart_inventions',
      subdomainUrl: 'https://material.cseel.org/admin',
      schema: 'materials.hardware',
    },
    {
      role: 'rnd_admin',
      label: 'R&D Innovation Labs',
      icon: Sparkles,
      color: 'from-violet-600 to-purple-800',
      desc: 'Research whitepapers, patent filings & futuristic ATL tech.',
      modId: 'research_rnd',
      subdomainUrl: 'https://api.cseel.org',
      schema: 'rnd.*',
    },
    {
      role: 'content_admin',
      label: 'Homepage & CMS Media',
      icon: FileText,
      color: 'from-sky-600 to-blue-700',
      desc: 'Promotional banners, blog articles, NEP publications and FAQs.',
      modId: 'content_homepage',
      subdomainUrl: 'https://blog.cseel.org/admin',
      schema: 'content.*',
    },
  ];

  return (
    <div className="space-y-6">
      {/* ── TOP BANNER ── */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-indigo-950 text-white rounded-3xl p-6 border border-purple-800/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-xs font-black text-emerald-300">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>SUPER ADMIN COMMAND CENTER • SUBDOMAIN-READY ARCHITECTURE</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white">
              CSEEL Central Administrative Governance
            </h2>
            <p className="text-xs sm:text-sm text-purple-200/80 leading-relaxed">
              Full control over all 10 administrative divisions. Click on any department's Subdomain URL to access its dedicated portal or switch into its workspace.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/15 text-center shrink-0">
            <p className="text-xs text-purple-200 font-bold uppercase">System Architecture</p>
            <p className="text-sm font-black text-emerald-400 mt-0.5">Microservices • 10 Subdomains</p>
            <p className="text-[10px] text-white/60">Edge Routed • Pluggable DB</p>
          </div>
        </div>
      </div>

      {/* ── GLOBAL KPI METRICS GRID ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {STAT_CARDS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-2xl p-4 border border-gray-200/90 shadow-2xs space-y-1">
              <div className={`w-8 h-8 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                <Icon className="w-4 h-4" />
              </div>
              <p className="text-xl font-black text-gray-900 pt-1">{stat.val}</p>
              <p className="text-xs font-bold text-gray-700 leading-snug">{stat.label}</p>
              <p className="text-[10px] text-gray-400">{stat.desc}</p>
            </div>
          );
        })}
      </div>

      {/* ── DEPARTMENTAL MODULES FAST-SWITCH GRID ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-600" />
            <span>Department Subdomains & Isolated Admin Portals</span>
          </h3>
          <span className="text-xs text-gray-500 font-bold">10 Autonomous Subdomains</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODULE_SHORTCUTS.map((m) => {
            const Icon = m.icon;
            const isCurrent = currentRole === m.role;

            return (
              <div
                key={m.label}
                className="bg-white rounded-3xl p-5 border border-gray-200/90 hover:border-purple-400 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-2xl bg-gradient-to-r ${m.color} text-white flex items-center justify-center shadow-xs`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">
                        {m.schema}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                          Active
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-black text-gray-900 group-hover:text-purple-700 transition-colors">
                      {m.label}
                    </h4>
                    <p className="text-xs text-gray-500 leading-relaxed mt-1">{m.desc}</p>
                  </div>

                  {/* Direct Subdomain URL Box */}
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <span className="text-[9px] font-bold text-slate-400 uppercase block">Subdomain Admin URL:</span>
                      <a
                        href={m.subdomainUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono font-bold text-purple-700 hover:text-purple-900 hover:underline truncate block"
                      >
                        {m.subdomainUrl.replace('https://', '')}
                      </a>
                    </div>
                    <a
                      href={m.subdomainUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-white hover:bg-purple-100 text-purple-700 border border-slate-200 transition-colors shrink-0"
                      title="Open Subdomain in New Tab"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      switchRole(m.role);
                      setActiveModule(m.modId);
                    }}
                    className="text-xs font-black text-purple-700 hover:text-purple-900 flex items-center gap-1"
                  >
                    <span>Embedded Workspace</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  <a
                    href={m.subdomainUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 border border-emerald-200"
                  >
                    <span>Launch URL</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── LIVE AUDIT TRAIL & SYSTEM HEALTH ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Audit Log Stream (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-5 border border-gray-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 flex-wrap gap-2">
            <h3 className="text-xs font-black uppercase text-gray-900 tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-600" />
              <span>Real-Time System Security & Activity Audit Log</span>
            </h3>
            <button
              type="button"
              onClick={() => setActiveModule('audit_logs')}
              className="px-3 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1 border border-purple-200"
            >
              <span>Daily Work History Ledger</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-gray-100">
            {auditLogs.map((log) => (
              <div key={log.id} className="py-3 flex items-start justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-gray-900">{log.adminName}</span>
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.2 rounded-md">
                      {log.adminRole}
                    </span>
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.2 rounded-md">
                      {log.action}
                    </span>
                  </div>
                  <p className="text-gray-600">{log.details}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-gray-400 block">{log.timestamp}</span>
                  <span className="text-[9px] font-mono text-gray-400">{log.ipAddress}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Admin Staff Roster (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-gray-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="text-xs font-black uppercase text-gray-900 tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-purple-600" />
              <span>Admin Passwords & Roster</span>
            </h3>
            <span className="text-[11px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              {adminUsers.length} Staff
            </span>
          </div>

          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
            {adminUsers.map((user) => {
              const roleCfg = ADMIN_ROLE_CONFIGS[user.role];
              return (
                <div key={user.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2">
                  <div className="flex items-center gap-2.5">
                    <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-xl object-cover border border-purple-200 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-black text-gray-900 truncate">{user.name}</p>
                      <p className="text-[10px] font-bold text-purple-700 truncate">{roleCfg?.title}</p>
                      <p className="text-[9px] text-gray-500 font-mono truncate">{user.email}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between gap-2 text-[10px]">
                    <span className="font-mono text-gray-600 truncate bg-white px-2 py-0.5 rounded border border-gray-200">
                      🔑 {user.password}
                    </span>
                    <button
                      onClick={() => switchRole(user.role)}
                      className="px-2 py-0.5 bg-purple-100 hover:bg-purple-200 text-purple-800 text-[10px] font-black rounded-lg transition-colors shrink-0"
                    >
                      Switch
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default SuperAdminDashboard;
