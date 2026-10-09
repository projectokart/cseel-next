'use client';

import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Plus,
  LogOut,
  Sparkles,
  FlaskConical,
  Megaphone,
  Menu,
  Palette,
  Building2,
  ExternalLink
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
  const { logout, currentAdmin, activeModule, setActiveModule } = useAdminAuth();
  const [pendingClaimsCount, setPendingClaimsCount] = useState<number>(0);

  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        const res = await fetch('/api/school-claim', { cache: 'no-store' });
        const data = await res.json();
        if (data.success && Array.isArray(data.claims)) {
          const pending = data.claims.filter((c: any) => c.status === 'pending').length;
          setPendingClaimsCount(pending);
        }
      } catch {}
    };

    fetchPendingCount();
    const interval = setInterval(fetchPendingCount, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleNav = (module: any, path?: string) => {
    setActiveModule(module);
    if (typeof window !== 'undefined') {
      if (path && window.location.pathname !== path) {
        window.location.href = path;
      }
      if (window.innerWidth < 1024) onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-2xs lg:hidden transition-opacity"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container (Ultra-compact 192px width) */}
      <aside
        className={`fixed top-12 bottom-0 left-0 z-50 bg-[#f8fafd] border-r border-[#dadce0] flex flex-col justify-between transition-all duration-200 ease-in-out lg:static lg:top-0 ${
          mobileOpen ? 'translate-x-0 shadow-xl w-48' : '-translate-x-full lg:translate-x-0'
        } ${collapsed ? 'lg:w-[52px]' : 'lg:w-48'} font-sans select-none shrink-0 h-full overflow-hidden text-[#202124]`}
      >
        {/* ── TOP SECTION & NAVIGATION ── */}
        <div className="p-1.5 space-y-2 overflow-y-auto flex-1 custom-scrollbar">
          {/* Compact "+ Create Experiment" Pill Button */}
          <div className="pt-0.5 pb-0.5">
            <button
              type="button"
              onClick={() => handleNav('experiments_studio', '/admin/experiments')}
              className={`w-full flex items-center gap-1.5 bg-[#c2e7ff] hover:bg-[#b3d7ff] text-[#001d35] transition-all rounded-full shadow-2xs hover:shadow-xs active:scale-98 ${
                collapsed ? 'lg:justify-center p-2' : 'px-3 py-1.5'
              }`}
              title="Create New Experiment"
            >
              <Plus className="w-3.5 h-3.5 text-[#001d35] shrink-0" />
              <span className={`font-semibold text-[11px] tracking-tight ${collapsed ? 'lg:hidden' : 'block'}`}>
                New Experiment
              </span>
            </button>
          </div>

          {/* Section: MAIN OVERVIEW */}
          <div className="space-y-0.5">
            <button
              type="button"
              onClick={() => handleNav('overview', '/admin')}
              className={`w-full flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                collapsed ? 'lg:justify-center lg:px-1.5' : ''
              } ${
                activeModule === 'overview'
                  ? 'bg-[#c2e7ff] text-[#001d35] font-semibold'
                  : 'text-[#444746] hover:bg-[#eceef0]'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 shrink-0 text-[#1a73e8]" />
              <span className={collapsed ? 'lg:hidden' : 'block truncate'}>Overview</span>
            </button>
          </div>

          {/* Section: SCHOOLS & PROFILE CLAIMS */}
          <div className="space-y-0.5 pt-0.5">
            <div className={`px-2 py-0.5 text-[9px] font-bold text-[#5f6368] uppercase tracking-wider flex items-center justify-between ${
              collapsed ? 'lg:hidden' : 'flex'
            }`}>
              <span>Schools &amp; Claims</span>
              {pendingClaimsCount > 0 && (
                <span className="bg-amber-100 text-amber-900 text-[9px] font-bold px-1 rounded border border-amber-300">
                  {pendingClaimsCount}
                </span>
              )}
            </div>

            {/* School Claims & Approvals Link */}
            <button
              type="button"
              onClick={() => handleNav('schools_institutions')}
              className={`w-full flex items-center justify-between px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                collapsed ? 'lg:justify-center lg:px-1.5' : ''
              } ${
                activeModule === 'schools_institutions' || activeModule === 'school_claims'
                  ? 'bg-[#c2e7ff] text-[#001d35] font-semibold'
                  : 'text-[#444746] hover:bg-[#eceef0]'
              }`}
              title="Review, Approve, or Reject School Profile Claims"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Building2 className="w-3.5 h-3.5 text-[#1a73e8] shrink-0" />
                <span className={collapsed ? 'lg:hidden' : 'block truncate'}>Profile Claims</span>
              </div>
              {pendingClaimsCount > 0 && (
                <span className={`text-[9px] bg-amber-500 text-white font-bold px-1.5 rounded-full shrink-0 ${collapsed ? 'lg:hidden' : 'block'}`}>
                  {pendingClaimsCount}
                </span>
              )}
            </button>

            {/* Public Directory Link */}
            <a
              href="/schools"
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full flex items-center justify-between px-2.5 py-1 rounded-full text-[11px] font-medium transition-all text-[#444746] hover:bg-[#eceef0] ${
                collapsed ? 'lg:justify-center lg:px-1.5' : ''
              }`}
              title="Open Public School Directory"
            >
              <div className="flex items-center gap-2 min-w-0">
                <ExternalLink className="w-3.5 h-3.5 text-[#5f6368] shrink-0" />
                <span className={collapsed ? 'lg:hidden' : 'block truncate'}>Directory</span>
              </div>
              <span className={`text-[9px] text-[#5f6368] ${collapsed ? 'lg:hidden' : 'block'}`}>↗</span>
            </a>
          </div>

          {/* Section: ACADEMIC CURRICULUM */}
          <div className="space-y-0.5 pt-0.5">
            <div className={`px-2 py-0.5 text-[9px] font-bold text-[#5f6368] uppercase tracking-wider ${collapsed ? 'lg:hidden' : 'block'}`}>
              Academic Labs
            </div>

            <button
              type="button"
              onClick={() => handleNav('experiments_studio', '/admin/experiments')}
              className={`w-full flex items-center justify-between px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                collapsed ? 'lg:justify-center lg:px-1.5' : ''
              } ${
                activeModule === 'experiments_studio'
                  ? 'bg-[#c2e7ff] text-[#001d35] font-semibold'
                  : 'text-[#444746] hover:bg-[#eceef0]'
              }`}
              title="Experiment Management"
            >
              <div className="flex items-center gap-2 min-w-0">
                <FlaskConical className="w-3.5 h-3.5 text-[#005689] shrink-0" />
                <span className={collapsed ? 'lg:hidden' : 'block truncate'}>Experiments</span>
              </div>
              <span className={`text-[9px] bg-emerald-100 text-emerald-800 font-semibold px-1 rounded ${collapsed ? 'lg:hidden' : 'block'}`}>
                24
              </span>
            </button>
          </div>

          {/* Section: WEBSITE VISUAL CMS */}
          <div className="space-y-0.5 pt-0.5">
            <div className={`px-2 py-0.5 text-[9px] font-bold text-[#5f6368] uppercase tracking-wider ${collapsed ? 'lg:hidden' : 'block'}`}>
              Visual CMS
            </div>

            {/* Offers & Banners */}
            <button
              type="button"
              onClick={() => handleNav('marketing_growth')}
              className={`w-full flex items-center justify-between px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                collapsed ? 'lg:justify-center lg:px-1.5' : ''
              } ${
                activeModule === 'marketing_growth'
                  ? 'bg-[#c2e7ff] text-[#001d35] font-semibold'
                  : 'text-[#444746] hover:bg-[#eceef0]'
              }`}
              title="Offers & Ad Banners"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Megaphone className="w-3.5 h-3.5 text-[#ea3829] shrink-0" />
                <span className={collapsed ? 'lg:hidden' : 'block truncate'}>Offers &amp; Ads</span>
              </div>
              <span className={`text-[9px] bg-rose-100 text-rose-800 font-semibold px-1 rounded ${collapsed ? 'lg:hidden' : 'block'}`}>
                Slots
              </span>
            </button>

            {/* Navigation & Pages CMS */}
            <button
              type="button"
              onClick={() => handleNav('navigation_cms')}
              className={`w-full flex items-center justify-between px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                collapsed ? 'lg:justify-center lg:px-1.5' : ''
              } ${
                activeModule === 'navigation_cms'
                  ? 'bg-[#c2e7ff] text-[#001d35] font-semibold'
                  : 'text-[#444746] hover:bg-[#eceef0]'
              }`}
              title="Navigation Trees & Custom Pages"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Menu className="w-3.5 h-3.5 text-[#005689] shrink-0" />
                <span className={collapsed ? 'lg:hidden' : 'block truncate'}>Navigation &amp; Pages</span>
              </div>
            </button>

            {/* Global Theme & CSS Styling */}
            <button
              type="button"
              onClick={() => handleNav('global_styling')}
              className={`w-full flex items-center justify-between px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                collapsed ? 'lg:justify-center lg:px-1.5' : ''
              } ${
                activeModule === 'global_styling'
                  ? 'bg-[#c2e7ff] text-[#001d35] font-semibold'
                  : 'text-[#444746] hover:bg-[#eceef0]'
              }`}
              title="Theme Sheet, Colors & Typography"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Palette className="w-3.5 h-3.5 text-[#7b1fa2] shrink-0" />
                <span className={collapsed ? 'lg:hidden' : 'block truncate'}>Theme &amp; Styles</span>
              </div>
            </button>

            {/* Visual Page Editor link */}
            <a
              href="/?edit=true"
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full flex items-center justify-between px-2.5 py-1 rounded-full text-[11px] font-medium transition-all text-[#444746] hover:bg-[#e8f0fe] hover:text-[#005689] ${
                collapsed ? 'lg:justify-center lg:px-1.5' : ''
              }`}
              title="Open Live Website Visual Editor"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Sparkles className="w-3.5 h-3.5 text-[#005689] shrink-0" />
                <span className={collapsed ? 'lg:hidden' : 'block truncate'}>Visual Editor</span>
              </div>
              <span className={`text-[9px] bg-blue-100 text-blue-800 font-semibold px-1 rounded ${collapsed ? 'lg:hidden' : 'block'}`}>
                Live ↗
              </span>
            </a>
          </div>
        </div>

        {/* ── BOTTOM ACCOUNT & SIGN OUT (ULTRA COMPACT) ── */}
        <div className="p-1.5 border-t border-[#dadce0] bg-[#f8fafd] shrink-0">
          <div className={`flex items-center justify-between p-1 rounded-lg bg-white border border-[#dadce0] shadow-2xs ${
            collapsed ? 'lg:justify-center' : ''
          }`}>
            <div className="flex items-center gap-1.5 overflow-hidden">
              <div className="w-6 h-6 rounded-full bg-[#1a73e8] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                SA
              </div>
              <div className={`leading-none truncate ${collapsed ? 'lg:hidden' : 'block'}`}>
                <p className="text-[10px] font-semibold text-[#202124] truncate">{currentAdmin?.name || 'Super Admin'}</p>
                <p className="text-[9px] text-[#5f6368] truncate mt-0.5">{currentAdmin?.email || 'admin@cseel.org'}</p>
              </div>
            </div>

            <button
              onClick={logout}
              className={`p-1 text-[#5f6368] hover:text-[#d93025] hover:bg-[#fce8e6] rounded transition-colors cursor-pointer ${
                collapsed ? 'lg:hidden' : 'block'
              }`}
              title="Sign out"
            >
              <LogOut className="w-3 h-3" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
