'use client';

import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Plus,
  ChevronDown,
  LogOut,
  Sparkles,
  FlaskConical,
  Megaphone,
  Menu,
  Palette,
  Building2,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldAlert
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
  const [analyticsOpen, setAnalyticsOpen] = useState(true);
  const [schoolsOpen, setSchoolsOpen] = useState(true);
  const [cmsOpen, setCmsOpen] = useState(true);
  const [pendingClaimsCount, setPendingClaimsCount] = useState<number>(0);

  // Poll or fetch pending claims count
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

      {/* Sidebar Container */}
      <aside
        className={`fixed top-12 bottom-0 left-0 z-50 bg-[#f8fafd] border-r border-[#dadce0] flex flex-col justify-between transition-all duration-200 ease-in-out lg:static lg:top-0 ${
          mobileOpen ? 'translate-x-0 shadow-xl w-60' : '-translate-x-full lg:translate-x-0'
        } ${collapsed ? 'lg:w-[60px]' : 'lg:w-60'} font-sans select-none shrink-0 h-full overflow-hidden text-[#202124]`}
      >
        {/* ── TOP SECTION & NAVIGATION ── */}
        <div className="p-2 space-y-3 overflow-y-auto flex-1 custom-scrollbar">
          {/* Compact "+ Create Experiment" Pill Button */}
          <div className="pt-1 pb-1">
            <button
              type="button"
              onClick={() => handleNav('experiments_studio', '/admin/experiments')}
              className={`w-full flex items-center gap-2 bg-[#c2e7ff] hover:bg-[#b3d7ff] text-[#001d35] transition-all rounded-full shadow-2xs hover:shadow-xs active:scale-98 ${
                collapsed ? 'lg:justify-center p-2.5' : 'px-3.5 py-2'
              }`}
              title="Create New Experiment"
            >
              <Plus className="w-4 h-4 text-[#001d35] shrink-0" />
              <span className={`font-semibold text-xs tracking-tight ${collapsed ? 'lg:hidden' : 'block'}`}>
                New Experiment
              </span>
            </button>
          </div>

          {/* Section: MAIN OVERVIEW */}
          <div className="space-y-0.5">
            <button
              type="button"
              onClick={() => handleNav('overview', '/admin')}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                collapsed ? 'lg:justify-center lg:px-2' : ''
              } ${
                activeModule === 'overview'
                  ? 'bg-[#c2e7ff] text-[#001d35] font-semibold'
                  : 'text-[#444746] hover:bg-[#eceef0]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0 text-[#1a73e8]" />
              <span className={collapsed ? 'lg:hidden' : 'block truncate'}>Overview</span>
            </button>
          </div>

          {/* Section: SCHOOLS & PROFILE CLAIMS (HIGH PRIORITY) */}
          <div className="space-y-0.5 pt-1">
            <div className={`px-2.5 py-1 text-[10px] font-bold text-[#5f6368] uppercase tracking-wider flex items-center justify-between ${
              collapsed ? 'lg:hidden' : 'flex'
            }`}>
              <span>School Directory &amp; Claims</span>
              {pendingClaimsCount > 0 && (
                <span className="bg-amber-100 text-amber-800 text-[9px] font-extrabold px-1.5 py-0.2 rounded-full border border-amber-300">
                  {pendingClaimsCount} new
                </span>
              )}
            </div>

            {/* School Claims & Approvals Link */}
            <button
              type="button"
              onClick={() => handleNav('schools_institutions')}
              className={`w-full flex items-center justify-between px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                collapsed ? 'lg:justify-center lg:px-2' : ''
              } ${
                activeModule === 'schools_institutions' || activeModule === 'school_claims'
                  ? 'bg-[#c2e7ff] text-[#001d35] font-semibold'
                  : 'text-[#444746] hover:bg-[#eceef0]'
              }`}
              title="Review, Approve, or Reject School Profile Claims & Add Requests"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Building2 className="w-4 h-4 text-[#1a73e8] shrink-0" />
                <span className={collapsed ? 'lg:hidden' : 'block truncate'}>Profile Claims</span>
              </div>
              {pendingClaimsCount > 0 ? (
                <span className={`text-[10px] bg-amber-500 text-white font-bold px-1.5 py-0.2 rounded-full shadow-2xs shrink-0 ${collapsed ? 'lg:hidden' : 'block'}`}>
                  {pendingClaimsCount}
                </span>
              ) : (
                <span className={`text-[9px] text-[#5f6368] font-normal ${collapsed ? 'lg:hidden' : 'block'}`}>
                  Synced
                </span>
              )}
            </button>

            {/* Public Directory Link */}
            <a
              href="/schools"
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full flex items-center justify-between px-3 py-1.5 rounded-full text-xs font-medium transition-all text-[#444746] hover:bg-[#eceef0] ${
                collapsed ? 'lg:justify-center lg:px-2' : ''
              }`}
              title="Open Public School Directory"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <ExternalLink className="w-4 h-4 text-[#5f6368] shrink-0" />
                <span className={collapsed ? 'lg:hidden' : 'block truncate'}>Public Directory</span>
              </div>
              <span className={`text-[9px] text-[#5f6368] ${collapsed ? 'lg:hidden' : 'block'}`}>↗</span>
            </a>
          </div>

          {/* Section: ACADEMIC CURRICULUM */}
          <div className="space-y-0.5 pt-1">
            <div className={`px-2.5 py-1 text-[10px] font-bold text-[#5f6368] uppercase tracking-wider ${collapsed ? 'lg:hidden' : 'block'}`}>
              Academic Labs
            </div>

            <button
              type="button"
              onClick={() => handleNav('experiments_studio', '/admin/experiments')}
              className={`w-full flex items-center justify-between px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                collapsed ? 'lg:justify-center lg:px-2' : ''
              } ${
                activeModule === 'experiments_studio'
                  ? 'bg-[#c2e7ff] text-[#001d35] font-semibold'
                  : 'text-[#444746] hover:bg-[#eceef0]'
              }`}
              title="Experiment Management & Virtual Labs"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <FlaskConical className="w-4 h-4 text-[#005689] shrink-0" />
                <span className={collapsed ? 'lg:hidden' : 'block truncate'}>Experiments</span>
              </div>
              <span className={`text-[9px] bg-emerald-100 text-emerald-800 font-semibold px-1 py-0.2 rounded-full ${collapsed ? 'lg:hidden' : 'block'}`}>
                24
              </span>
            </button>
          </div>

          {/* Section: WEBSITE VISUAL CMS */}
          <div className="space-y-0.5 pt-1">
            <div className={`px-2.5 py-1 text-[10px] font-bold text-[#5f6368] uppercase tracking-wider ${collapsed ? 'lg:hidden' : 'block'}`}>
              Visual CMS
            </div>

            {/* Offers & Banners */}
            <button
              type="button"
              onClick={() => handleNav('marketing_growth')}
              className={`w-full flex items-center justify-between px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                collapsed ? 'lg:justify-center lg:px-2' : ''
              } ${
                activeModule === 'marketing_growth'
                  ? 'bg-[#c2e7ff] text-[#001d35] font-semibold'
                  : 'text-[#444746] hover:bg-[#eceef0]'
              }`}
              title="Offers, Custom HTML Banners & Page Ad Slots"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Megaphone className="w-4 h-4 text-[#ea3829] shrink-0" />
                <span className={collapsed ? 'lg:hidden' : 'block truncate'}>Offers &amp; Ads</span>
              </div>
              <span className={`text-[9px] bg-rose-100 text-rose-800 font-semibold px-1 py-0.2 rounded-full ${collapsed ? 'lg:hidden' : 'block'}`}>
                Slots
              </span>
            </button>

            {/* Navigation & Pages CMS */}
            <button
              type="button"
              onClick={() => handleNav('navigation_cms')}
              className={`w-full flex items-center justify-between px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                collapsed ? 'lg:justify-center lg:px-2' : ''
              } ${
                activeModule === 'navigation_cms'
                  ? 'bg-[#c2e7ff] text-[#001d35] font-semibold'
                  : 'text-[#444746] hover:bg-[#eceef0]'
              }`}
              title="Navigation Trees & Custom Pages"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Menu className="w-4 h-4 text-[#005689] shrink-0" />
                <span className={collapsed ? 'lg:hidden' : 'block truncate'}>Navigation &amp; Pages</span>
              </div>
            </button>

            {/* Global Theme & CSS Styling */}
            <button
              type="button"
              onClick={() => handleNav('global_styling')}
              className={`w-full flex items-center justify-between px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                collapsed ? 'lg:justify-center lg:px-2' : ''
              } ${
                activeModule === 'global_styling'
                  ? 'bg-[#c2e7ff] text-[#001d35] font-semibold'
                  : 'text-[#444746] hover:bg-[#eceef0]'
              }`}
              title="Theme Sheet, Colors & Typography"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Palette className="w-4 h-4 text-[#7b1fa2] shrink-0" />
                <span className={collapsed ? 'lg:hidden' : 'block truncate'}>Theme &amp; Styles</span>
              </div>
            </button>

            {/* Visual Page Editor link */}
            <a
              href="/?edit=true"
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full flex items-center justify-between px-3 py-1.5 rounded-full text-xs font-medium transition-all text-[#444746] hover:bg-[#e8f0fe] hover:text-[#005689] ${
                collapsed ? 'lg:justify-center lg:px-2' : ''
              }`}
              title="Open Live Website Visual Editor"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Sparkles className="w-4 h-4 text-[#005689] shrink-0" />
                <span className={collapsed ? 'lg:hidden' : 'block truncate'}>Visual Editor</span>
              </div>
              <span className={`text-[9px] bg-blue-100 text-blue-800 font-semibold px-1 py-0.2 rounded-full ${collapsed ? 'lg:hidden' : 'block'}`}>
                Live ↗
              </span>
            </a>
          </div>
        </div>

        {/* ── BOTTOM ACCOUNT & SIGN OUT ── */}
        <div className="p-2 border-t border-[#dadce0] bg-[#f8fafd] shrink-0">
          <div className={`flex items-center justify-between p-1.5 rounded-xl bg-white border border-[#dadce0] shadow-2xs ${
            collapsed ? 'lg:justify-center' : ''
          }`}>
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-[#1a73e8] text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                SA
              </div>
              <div className={`leading-none truncate ${collapsed ? 'lg:hidden' : 'block'}`}>
                <p className="text-[11px] font-semibold text-[#202124] truncate">{currentAdmin?.name || 'Super Admin'}</p>
                <p className="text-[10px] text-[#5f6368] truncate mt-0.5">{currentAdmin?.email || 'admin@cseel.org'}</p>
              </div>
            </div>

            <button
              onClick={logout}
              className={`p-1.5 text-[#5f6368] hover:text-[#d93025] hover:bg-[#fce8e6] rounded-lg transition-colors cursor-pointer ${
                collapsed ? 'lg:hidden' : 'block'
              }`}
              title="Sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
