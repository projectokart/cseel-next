'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  Terminal, 
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Globe,
  Users,
  Building2,
  FileText,
  Activity,
  TrendingUp
} from 'lucide-react';
import { AdminAuthProvider, useAdminAuth } from '../contexts/AdminAuthContext';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import AdminLoginScreen from './AdminLoginScreen';
import MaterialCircularLoader from '@/components/shared/MaterialCircularLoader';

const AdminCanvasContent: React.FC = () => {
  const { currentAdmin } = useAdminAuth();

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      {/* ── TOP HEADER ROW ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#dadce0]/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-[#1a73e8] bg-[#e8f0fe] px-2.5 py-0.5 rounded-md">
              Enterprise Governance Suite
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#202124] tracking-tight">
            Admin Overview
          </h1>
          <p className="text-xs sm:text-sm text-[#5f6368] mt-0.5">
            Live snapshot of operations, capacity, and activity across CSEEL.
          </p>
        </div>

        {/* Primary Action Button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="px-5 py-2.5 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs sm:text-sm font-medium shadow-xs hover:shadow-md transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Action</span>
          </button>
        </div>
      </div>

      {/* ── 4 SUMMARY METRIC CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white rounded-2xl p-4 border border-[#dadce0] shadow-[0_1px_2px_rgba(60,64,67,0.1)] hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="p-2 rounded-xl bg-[#e8f0fe] text-[#1a73e8]">
              <Users className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-semibold text-[#137333] flex items-center gap-0.5 bg-[#e6f4ea] px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3" /> +4.2%
            </span>
          </div>
          <p className="text-xs font-medium text-[#5f6368]">Active Inquiries</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-[#202124]">44</span>
            <span className="text-[11px] text-[#5f6368]">vs last week</span>
          </div>
        </div>

        {/* Card 2: CSEEL Green */}
        <div className="bg-white rounded-2xl p-4 border border-[#dadce0] shadow-[0_1px_2px_rgba(60,64,67,0.1)] hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="p-2 rounded-xl bg-[#e6f4ea] text-[#137333]">
              <Activity className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-semibold text-[#137333] flex items-center gap-0.5 bg-[#e6f4ea] px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3" /> +6.8%
            </span>
          </div>
          <p className="text-xs font-medium text-[#5f6368]">Labs Configured</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-[#202124]">24</span>
            <span className="text-[11px] text-[#5f6368]">today</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-2xl p-4 border border-[#dadce0] shadow-[0_1px_2px_rgba(60,64,67,0.1)] hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="p-2 rounded-xl bg-[#fce8e6] text-[#c5221f]">
              <FileText className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-semibold text-[#c5221f] bg-[#fce8e6] px-2 py-0.5 rounded-full">
              100% Live
            </span>
          </div>
          <p className="text-xs font-medium text-[#5f6368]">Published Articles</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-[#202124]">50</span>
            <span className="text-[11px] text-[#5f6368]">in Sanity</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-2xl p-4 border border-[#dadce0] shadow-[0_1px_2px_rgba(60,64,67,0.1)] hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="p-2 rounded-xl bg-[#fef7e0] text-[#b06000]">
              <Building2 className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-semibold text-[#137333] flex items-center gap-0.5 bg-[#e6f4ea] px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3" /> +2.5%
            </span>
          </div>
          <p className="text-xs font-medium text-[#5f6368]">Partner Schools</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-[#202124]">150+</span>
            <span className="text-[11px] text-[#5f6368]">active labs</span>
          </div>
        </div>
      </div>

      {/* ── MAIN WORKSPACE SECTION ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Central Card */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-[#dadce0] shadow-xs flex flex-col justify-between min-h-[320px]">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#dadce0]/60">
              <div>
                <h3 className="font-bold text-sm text-[#202124]">Activity &amp; Operational Flow</h3>
                <p className="text-[11px] text-[#5f6368]">Last 30 days telemetry</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#e6f4ea] text-[#137333] border border-[#ceead6]">
                ● Live Connected
              </span>
            </div>

            <div className="py-10 text-center text-[#5f6368] space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#f8fafd] border border-[#dadce0] flex items-center justify-center mx-auto text-[#1a73e8]">
                <Layers className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-[#202124]">Central Workspace Canvas</p>
              <p className="text-xs text-[#5f6368] max-w-sm mx-auto">
                Aap batayein ki is main section ke andar kaunsa data, chart, ya management table add karna hai.
              </p>
            </div>
          </div>
        </div>

        {/* Side Distribution Card */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-[#dadce0] shadow-xs flex flex-col justify-between min-h-[320px]">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#dadce0]/60">
              <h3 className="font-bold text-sm text-[#202124]">Distribution</h3>
              <span className="text-[11px] text-[#5f6368]">By category</span>
            </div>

            <div className="space-y-4 pt-1">
              {[
                { label: 'Atal Tinkering Labs (ATL)', pct: '85%', color: 'bg-[#1a73e8]' },
                { label: 'AI & Robotics Hubs', pct: '65%', color: 'bg-[#34a853]' },
                { label: 'PM SHRI Composite Labs', pct: '50%', color: 'bg-[#fbbc04]' },
                { label: 'Clean Tech Green Labs', pct: '35%', color: 'bg-[#ea4335]' },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-[#202124]">{item.label}</span>
                    <span className="font-bold text-[#5f6368]">{item.pct}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#f1f3f4] overflow-hidden">
                    <div className={`h-full rounded-full ${item.color}`} style={{ width: item.pct }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import ExperimentsAdminModule from '../experiments/ExperimentsAdminModule';
import NavigationCmsControlModule from './modules/NavigationCmsControlModule';
import { AdminModuleId } from '../types';

const AdminPortalRoot: React.FC<{ initialModule?: AdminModuleId; children?: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, activeModule } = useAdminAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <AdminLoginScreen />;
  }

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#f8fafd] text-[#202124] font-sans antialiased selection:bg-[#c2e7ff] selection:text-[#001d35]">
      {/* ── 1. TOP HEADER (100% full screen width across the top) ── */}
      <AdminHeader
        onToggleMobileMenu={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        onToggleSidebarCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        sidebarCollapsed={sidebarCollapsed}
      />

      {/* ── 2. BODY ROW (Sidebar underneath on left + Content on right) ── */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* SIDEBAR DRAWER */}
        <AdminSidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* MAIN CONTENT CANVAS */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#f8fafd]">
          {children ? (
            children
          ) : activeModule === 'experiments_studio' ? (
            <ExperimentsAdminModule />
          ) : activeModule === 'navigation_cms' ? (
            <NavigationCmsControlModule />
          ) : (
            <AdminCanvasContent />
          )}
        </main>
      </div>
    </div>
  );
};

export const AdminLayout: React.FC<{ initialModule?: AdminModuleId; children?: React.ReactNode }> = ({ initialModule, children }) => {
  return (
    <AdminAuthProvider defaultModule={initialModule}>
      <AdminPortalRoot initialModule={initialModule}>
        {children}
      </AdminPortalRoot>
    </AdminAuthProvider>
  );
};

export default AdminLayout;
