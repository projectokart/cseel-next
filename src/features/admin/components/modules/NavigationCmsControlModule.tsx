'use client';

import React, { useState } from 'react';
import {
  Globe, Eye, EyeOff, ShieldAlert, CheckCircle2,
  RefreshCw, Power, Sparkles, AlertTriangle, Layers,
  ExternalLink, ArrowRight, ToggleLeft, ToggleRight,
  SlidersHorizontal, Check, Info, Lock
} from 'lucide-react';
import { useNavVisibility } from '@/contexts/NavigationContext';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

export const NavigationCmsControlModule: React.FC = () => {
  const { navSettings, toggleNavSection, toggleSubItem, resetToDefault } = useNavVisibility();
  const { addAuditLog } = useAdminAuth();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleToggleSection = (sectionId: string, label: string, currentVal: boolean) => {
    const newVal = !currentVal;
    toggleNavSection(sectionId, newVal);
    addAuditLog(
      newVal ? 'ENABLED_NAVBAR_SECTION' : 'DISABLED_NAVBAR_SECTION',
      'content_homepage',
      `${newVal ? 'Enabled' : 'Disabled'} public navigation section "${label}" and all sub-routes.`
    );
    setSuccessMsg(`Navigation section "${label}" is now ${newVal ? 'LIVE (Public)' : 'DISABLED (Hidden & Restricted)'}`);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleToggleChild = (sectionId: string, subId: string, childLabel: string, currentVal: boolean) => {
    const newVal = !currentVal;
    toggleSubItem(sectionId, subId, newVal);
    addAuditLog(
      newVal ? 'ENABLED_NAV_SUBITEM' : 'DISABLED_NAV_SUBITEM',
      'content_homepage',
      `${newVal ? 'Enabled' : 'Disabled'} sub-menu item "${childLabel}".`
    );
    setSuccessMsg(`Sub-menu item "${childLabel}" is now ${newVal ? 'Visible' : 'Hidden'}`);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const totalSections = navSettings.length;
  const activeSections = navSettings.filter((s) => s.enabled).length;
  const totalSubItems = navSettings.reduce((acc, s) => acc + (s.children?.length || 0), 0);
  const activeSubItems = navSettings.reduce((acc, s) => acc + (s.children?.filter((c) => c.enabled && s.enabled).length || 0), 0);

  return (
    <div className="space-y-6">
      
      {/* ── TOP HEADER BANNER ── */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 rounded-full text-xs font-black text-teal-700 dark:text-teal-300">
            <Globe className="w-3.5 h-3.5" />
            <span>SUPER ADMIN CMS & ROUTE GOVERNANCE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Navigation Bar, Menus & Dynamic Route Control
          </h2>
          <p className="text-xs text-slate-500 max-w-2xl">
            Super Administrator controls to dynamically enable, disable, hide, or restrict any website menu, top navigation item, sub-menu link, or route. Changes apply immediately to all visitors in real-time.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={resetToDefault}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
            title="Reset all navigation items to factory defaults"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
            <span>Reset All to Default</span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* ── KPI METRIC CARDS ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400">Main Navbar Sections</p>
            <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">{activeSections} / {totalSections} Active</p>
          </div>
          <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600">
            <Layers className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400">Total Sub-Menu Links</p>
            <p className="text-xl font-black text-purple-600 mt-0.5">{activeSubItems} / {totalSubItems} Live</p>
          </div>
          <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600">
            <Globe className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400">Disabled Modules</p>
            <p className="text-xl font-black text-rose-600 mt-0.5">{totalSections - activeSections}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600">
            <EyeOff className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400">Access Policy</p>
            <p className="text-xl font-black text-emerald-600 mt-0.5">Strict Guard</p>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
            <Lock className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* ── SECTIONS & SUB-MENU CONTROLS GRID ── */}
      <div className="space-y-4">
        {navSettings.map((section) => {
          return (
            <div
              key={section.id}
              className={`rounded-3xl p-5 border transition-all ${
                section.enabled
                  ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xs'
                  : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60 opacity-90'
              }`}
            >
              {/* Section Header Row */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black ${
                    section.enabled ? 'bg-teal-50 dark:bg-teal-950 text-teal-600' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {section.enabled ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-black text-slate-900 dark:text-white">
                        {section.label}
                      </h3>
                      {section.isSpecial && (
                        <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[10px] font-black uppercase">
                          Special Hub
                        </span>
                      )}
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                        section.enabled
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300'
                      }`}>
                        {section.enabled ? 'LIVE ON WEBSITE' : 'DISABLED & BLOCKED'}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-slate-400 mt-0.5">
                      Primary Route: <span className="font-bold text-slate-600 dark:text-slate-300">{section.route}</span>
                    </p>
                  </div>
                </div>

                {/* Section Toggle Switch */}
                <button
                  type="button"
                  onClick={() => handleToggleSection(section.id, section.label, section.enabled)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 shadow-xs ${
                    section.enabled
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : 'bg-rose-600 hover:bg-rose-500 text-white'
                  }`}
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>{section.enabled ? 'Enabled (Turn OFF)' : 'Disabled (Turn ON)'}</span>
                </button>
              </div>

              {/* Sub-Menu Items */}
              {section.children && section.children.length > 0 && (
                <div className="pt-4 space-y-2">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Sub-Menu Links & Child Routes
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {section.children.map((child) => {
                      const isChildActive = section.enabled && child.enabled;

                      return (
                        <div
                          key={child.id}
                          className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-2 ${
                            isChildActive
                              ? 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
                              : 'bg-slate-100/60 dark:bg-slate-900 border-dashed border-slate-300 dark:border-slate-700 opacity-60'
                          }`}
                        >
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {child.label}
                            </p>
                            <p className="text-[10px] font-mono text-slate-400 truncate">
                              {child.route}
                            </p>
                          </div>

                          <button
                            type="button"
                            disabled={!section.enabled}
                            onClick={() => handleToggleChild(section.id, child.id, child.label, child.enabled)}
                            className={`p-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 ${
                              !section.enabled
                                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                : child.enabled
                                ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                                : 'bg-rose-100 hover:bg-rose-200 text-rose-800'
                            }`}
                            title={child.enabled ? 'Click to disable' : 'Click to enable'}
                          >
                            {child.enabled && section.enabled ? (
                              <Eye className="w-3.5 h-3.5" />
                            ) : (
                              <EyeOff className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};

export default NavigationCmsControlModule;
