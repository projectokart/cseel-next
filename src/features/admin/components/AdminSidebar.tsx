'use client';

import React, { useState } from 'react';
import {
  LayoutDashboard,
  Plus,
  ChevronDown,
  ChevronRight,
  LogOut,
  FolderKanban,
  FileText,
  Users,
  Settings,
  HelpCircle,
  Sparkles,
  Layers,
  Activity,
  FlaskConical,
  Menu,
  X
} from 'lucide-react';
import { useAdminAuth } from '../contexts/AdminAuthContext';

interface AdminSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile
}) => {
  const { currentRole, logout, currentAdmin, activeModule, setActiveModule } = useAdminAuth();
  const [analyticsOpen, setAnalyticsOpen] = useState(true);
  const [managementOpen, setManagementOpen] = useState(true);

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-2xs lg:hidden transition-opacity duration-300"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container (Docked Underneath Top Header) */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-50 bg-[#f8fafd] border-r border-[#dadce0] flex flex-col justify-between transition-all duration-300 ease-in-out lg:static lg:top-0 ${
          mobileOpen ? 'translate-x-0 shadow-2xl w-64' : '-translate-x-full lg:translate-x-0'
        } ${collapsed ? 'lg:w-[72px]' : 'lg:w-64'} font-sans select-none shrink-0 h-full overflow-hidden`}
      >
        {/* ── TOP SECTION (COMPOSE BUTTON & NAVIGATION) ── */}
        <div className="p-3 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
          {/* "+ Create New" Pill Button */}
          <div className="pt-2 pb-1">
            <button
              type="button"
              onClick={() => {
                setActiveModule('experiments_studio');
                if (typeof window !== 'undefined') {
                  if (window.location.pathname !== '/admin/experiments') {
                    window.location.href = '/admin/experiments';
                  }
                  if (window.innerWidth < 1024) onCloseMobile();
                }
              }}
              className={`w-full flex items-center gap-3 bg-[#c2e7ff] hover:bg-[#b3d7ff] text-[#001d35] transition-all duration-200 rounded-2xl shadow-xs hover:shadow-md active:scale-98 ${
                collapsed ? 'lg:justify-center p-3.5' : 'px-5 py-3.5'
              }`}
              title="Create New Experiment"
            >
              <Plus className="w-5 h-5 text-[#001d35] shrink-0" />
              <span className={`font-semibold text-sm tracking-tight ${collapsed ? 'lg:hidden' : 'block'}`}>
                Create Experiment
              </span>
            </button>
          </div>

          {/* Navigation Category 1: DASHBOARDS */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => setAnalyticsOpen(!analyticsOpen)}
              className={`w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-bold text-[#5f6368] uppercase tracking-wider hover:text-[#202124] transition-colors ${
                collapsed ? 'lg:hidden' : 'flex'
              }`}
            >
              <span>Analytics &amp; Views</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${analyticsOpen ? '' : '-rotate-90'}`} />
            </button>

            {analyticsOpen && (
              <div className="space-y-1">
                {/* Overview */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveModule('overview');
                    if (typeof window !== 'undefined') {
                      if (window.location.pathname !== '/admin') {
                        window.location.href = '/admin';
                      }
                      if (window.innerWidth < 1024) onCloseMobile();
                    }
                  }}
                  className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
                    collapsed ? 'lg:justify-center lg:px-2' : ''
                  } ${
                    activeModule === 'overview'
                      ? 'bg-[#c2e7ff] text-[#001d35] font-bold shadow-2xs'
                      : 'text-[#444746] hover:bg-[#f1f3f4]'
                  }`}
                >
                  <LayoutDashboard className="w-5 h-5 shrink-0" />
                  <span className={collapsed ? 'lg:hidden' : 'block'}>Overview</span>
                </button>
              </div>
            )}
          </div>

          {/* Navigation Category 2: ACADEMIC & EXPERIMENTS */}
          <div className="space-y-1 pt-2">
            <button
              type="button"
              onClick={() => setManagementOpen(!managementOpen)}
              className={`w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-bold text-[#5f6368] uppercase tracking-wider hover:text-[#202124] transition-colors ${
                collapsed ? 'lg:hidden' : 'flex'
              }`}
            >
              <span>Academic Curriculum</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${managementOpen ? '' : '-rotate-90'}`} />
            </button>

            {managementOpen && (
              <div className="space-y-1">
                {/* 🧪 Experiments Studio Link */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveModule('experiments_studio');
                    if (typeof window !== 'undefined') {
                      if (window.location.pathname !== '/admin/experiments') {
                        window.location.href = '/admin/experiments';
                      }
                      if (window.innerWidth < 1024) onCloseMobile();
                    }
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
                    collapsed ? 'lg:justify-center lg:px-2' : ''
                  } ${
                    activeModule === 'experiments_studio'
                      ? 'bg-[#c2e7ff] text-[#001d35] font-bold shadow-2xs'
                      : 'text-[#444746] hover:bg-[#f1f3f4]'
                  }`}
                  title="Experiment Management & Single Page Studio"
                >
                  <div className="flex items-center gap-3.5">
                    <FlaskConical className="w-5 h-5 text-[#005689] shrink-0" />
                    <span className={collapsed ? 'lg:hidden' : 'block'}>Experiments</span>
                  </div>
                  <span className={`text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full ${collapsed ? 'lg:hidden' : 'block'}`}>
                    Active
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Navigation Category 3: LIVE WEBSITE CMS */}
          <div className="space-y-1 pt-2">
            <div className={`px-3 py-1.5 text-[11px] font-bold text-[#5f6368] uppercase tracking-wider ${collapsed ? 'lg:hidden' : 'block'}`}>
              Website Visual CMS
            </div>
            {/* 🌐 3-Stage Navigation & Custom Pages CMS */}
            <button
              type="button"
              onClick={() => {
                setActiveModule('navigation_cms');
                if (typeof window !== 'undefined') {
                  if (window.location.pathname !== '/admin') {
                    window.location.href = '/admin';
                  }
                  if (window.innerWidth < 1024) onCloseMobile();
                }
              }}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
                collapsed ? 'lg:justify-center lg:px-2' : ''
              } ${
                activeModule === 'navigation_cms'
                  ? 'bg-[#c2e7ff] text-[#001d35] font-bold shadow-2xs'
                  : 'text-[#444746] hover:bg-[#f1f3f4]'
              }`}
              title="3-Stage Navigation Tree & Custom Page Studio"
            >
              <div className="flex items-center gap-3.5">
                <Menu className="w-5 h-5 text-[#005689] shrink-0" />
                <span className={collapsed ? 'lg:hidden' : 'block'}>Navigation &amp; Pages</span>
              </div>
              <span className={`text-[10px] bg-sky-100 text-sky-800 font-bold px-1.5 py-0.5 rounded-full ${collapsed ? 'lg:hidden' : 'block'}`}>
                3-Stage
              </span>
            </button>

            <a
              href="/?edit=true"
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-full text-sm font-medium transition-all text-[#444746] hover:bg-[#e8f0fe] hover:text-[#005689] ${
                collapsed ? 'lg:justify-center lg:px-2' : ''
              }`}
              title="Open Live Website Visual Editor"
            >
              <div className="flex items-center gap-3.5">
                <Sparkles className="w-5 h-5 text-[#005689] shrink-0" />
                <span className={collapsed ? 'lg:hidden' : 'block'}>Visual Page Editor</span>
              </div>
              <span className={`text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded-full ${collapsed ? 'lg:hidden' : 'block'}`}>
                Live ↗
              </span>
            </a>
          </div>
        </div>

        {/* ── BOTTOM ACCOUNT & STATUS ── */}
        <div className="p-3 border-t border-[#dadce0] bg-[#f8fafd] shrink-0">
          <div className={`flex items-center justify-between p-2 rounded-2xl bg-white border border-[#dadce0] shadow-2xs ${
            collapsed ? 'lg:justify-center' : ''
          }`}>
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-[#1a73e8] text-white flex items-center justify-center font-bold text-xs shrink-0">
                SA
              </div>
              <div className={`leading-tight truncate ${collapsed ? 'lg:hidden' : 'block'}`}>
                <p className="text-xs font-semibold text-[#202124] truncate">{currentAdmin?.name || 'Super Admin'}</p>
                <p className="text-[11px] text-[#5f6368] font-normal truncate">{currentAdmin?.email || 'admin@cseel.org'}</p>
              </div>
            </div>

            <button
              onClick={logout}
              className={`p-2 text-[#5f6368] hover:text-[#d93025] hover:bg-[#fce8e6] rounded-xl transition-colors ${
                collapsed ? 'lg:hidden' : 'block'
              }`}
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
