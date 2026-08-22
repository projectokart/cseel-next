'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard, Briefcase, Building2, GraduationCap,
  Beaker, Wrench, Package, Calendar, Sparkles, Globe,
  ShieldAlert, Activity, LogOut, ChevronRight, X, Settings
} from 'lucide-react';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { ADMIN_ROLE_CONFIGS } from '../data';
import { AdminModuleId } from '../types';
import { AdminSettingsModal } from './AdminSettingsModal';

interface NavItem {
  id: AdminModuleId;
  label: string;
  icon: any;
  badge?: string;
}

const ALL_NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Command Overview', icon: LayoutDashboard },
  { id: 'hr_careers', label: 'HR & Careers', icon: Briefcase, badge: 'Internal' },
  { id: 'schools_institutions', label: 'Schools & Institutes', icon: Building2, badge: '104' },
  { id: 'teaching_recruitment', label: 'Faculty & Jobs', icon: GraduationCap, badge: '50+' },
  { id: 'science_simulations', label: 'Virtual Lab Practicals', icon: Beaker },
  { id: 'projectokart_inventions', label: 'Projectokart Hardware', icon: Wrench },
  { id: 'inventory_materials', label: 'Lab Materials & Kits', icon: Package },
  { id: 'programs_events', label: 'Seminars & Events', icon: Calendar },
  { id: 'research_rnd', label: 'R&D Innovation Labs', icon: Sparkles },
  { id: 'content_homepage', label: 'Homepage & CMS', icon: Globe },
];

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ mobileOpen = false, onCloseMobile }) => {
  const { currentRole, activeModule, setActiveModule, hasAccess } = useAdminAuth();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const roleConfig = ADMIN_ROLE_CONFIGS[currentRole];

  const visibleNavItems = ALL_NAV_ITEMS.filter((item) => hasAccess(item.id));

  const handleSelectModule = (id: AdminModuleId) => {
    setActiveModule(id);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const sidebarContent = (
    <aside className="w-72 sm:w-64 bg-slate-950 text-white h-full min-h-screen p-4 flex flex-col justify-between shrink-0 border-r border-slate-800 overflow-y-auto">
      <div className="space-y-6">
        
        {/* Brand Logo & Subdomain Badge */}
        <div className="px-2 pt-2 space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center font-black text-white text-sm shadow-md">
                C
              </div>
              <div>
                <h1 className="font-black text-sm text-white tracking-wide">CSEEL ADMIN</h1>
                <p className="text-[9px] text-purple-300 font-bold uppercase tracking-wider">Enterprise RBAC</p>
              </div>
            </div>

            {/* Mobile Close Button */}
            {onCloseMobile && (
              <button
                type="button"
                onClick={onCloseMobile}
                className="lg:hidden p-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Close Navigation"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="pt-3">
            <div className={`p-2.5 rounded-2xl border text-[11px] font-bold ${roleConfig?.badgeBg || 'bg-slate-900 text-white'}`}>
              <p className="text-[9px] font-black uppercase text-purple-300">Active Division:</p>
              <p className="text-xs font-black truncate">{roleConfig?.title}</p>
            </div>
          </div>
        </div>

        {/* Dynamic Navigation Items based on Role Access */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-500">
            Available Workspaces
          </p>
          <nav className="space-y-1 pt-1">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectModule(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left group ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-purple-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-md ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

      </div>

      {/* Footer Settings & Subdomain Info */}
      <div className="pt-4 border-t border-slate-800/80 px-2 space-y-2 mt-auto">
        <button
          type="button"
          onClick={() => setSettingsOpen(true)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-800 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-purple-400" />
            <span>Profile & Settings</span>
          </div>
          <span className="text-[10px] text-purple-400">Edit</span>
        </button>

        <div className="bg-slate-900/60 p-2.5 rounded-xl text-[10px] text-slate-400 space-y-0.5 border border-slate-800/50">
          <p className="font-bold text-white">Subdomain Ready 🚀</p>
          <p>Active Schema: <code className="text-purple-300 font-mono">{roleConfig?.badgeText || 'cseel.admin'}</code></p>
        </div>
      </div>

      <AdminSettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </aside>
  );

  return (
    <>
      {/* ── DESKTOP SIDEBAR (Visible on Desktop >= 1024px) ── */}
      <div className="hidden lg:block shrink-0 sticky top-0 h-screen">
        {sidebarContent}
      </div>

      {/* ── MOBILE DRAWER MODAL (Visible on Mobile when open) ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Dark Backdrop */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          {/* Slide-over Drawer Content */}
          <div className="fixed inset-y-0 left-0 max-w-[85vw] w-72 z-50 shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export default AdminSidebar;
