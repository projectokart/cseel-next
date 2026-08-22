'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, ExternalLink, Settings, LogOut, Shield,
  User, Sparkles, CheckCircle2, Lock, Eye, RefreshCw
} from 'lucide-react';
import { AdminAuthProvider, useAdminAuth } from '../contexts/AdminAuthContext';
import AdminLoginScreen from './AdminLoginScreen';
import AdminSettingsModal from './AdminSettingsModal';
import { ADMIN_ROLE_CONFIGS } from '../data';
import { AdminRole } from '../types';

interface DepartmentAdminLayoutProps {
  children: React.ReactNode;
  departmentName: string;
  departmentRole: AdminRole;
  publicUrl: string;
  subdomainUrl: string;
  schemaBadge: string;
}

const DepartmentAdminPortalInner: React.FC<DepartmentAdminLayoutProps> = ({
  children,
  departmentName,
  departmentRole,
  publicUrl,
  subdomainUrl,
  schemaBadge,
}) => {
  const { isAuthenticated, currentAdmin, logout, switchRole } = useAdminAuth();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Ensure role is aligned with department
    try {
      const auth = localStorage.getItem('cseel_admin_auth');
      if (auth === 'true') {
        switchRole(departmentRole);
      }
    } catch {}
  }, [departmentRole, switchRole]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white space-y-4 font-sans">
        <div className="w-10 h-10 border-3 border-teal-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-slate-400 tracking-wider uppercase">Loading {departmentName} Admin Portal...</p>
      </div>
    );
  }

  // ── STRICT AUTHENTICATION GUARD ──
  // If not authenticated, require login immediately!
  if (!isAuthenticated) {
    return <AdminLoginScreen />;
  }

  const roleConfig = ADMIN_ROLE_CONFIGS[departmentRole];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-900 font-sans selection:bg-teal-500 selection:text-white flex flex-col">
      
      {/* ── TOP DEPARTMENT NAVIGATION BAR ── */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-2.5 px-3 sm:px-6 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          
          {/* Left: Back to Public Website & Title */}
          <div className="flex items-center gap-3 min-w-0">
            <a
              href={publicUrl}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors shrink-0 shadow-2xs"
              title="Return to Public Live Store"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back to Live Website</span>
              <span className="sm:hidden">Back</span>
            </a>

            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 hidden md:block shrink-0" />

            <div className="flex items-center gap-2 min-w-0">
              <span className="px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-mono text-[10px] font-black uppercase border border-teal-200 dark:border-teal-800 shrink-0">
                {schemaBadge}
              </span>
              <h1 className="font-black text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                {departmentName}
              </h1>
            </div>
          </div>

          {/* Right: Live Preview, Settings, Profile Avatar, Logout */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* Live Store Preview Button */}
            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-teal-50 dark:bg-teal-950/80 hover:bg-teal-100 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-700 rounded-xl text-xs font-bold transition-all shrink-0"
              title="Preview how website looks to students & customers"
            >
              <Eye className="w-3.5 h-3.5 text-teal-600" />
              <span className="hidden sm:inline">Preview Store</span>
            </a>

            {/* Central Governance Portal Link */}
            <a
              href="/admin"
              className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1.5 bg-purple-50 dark:bg-purple-950 hover:bg-purple-100 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 rounded-xl text-xs font-bold transition-all"
              title="Return to Master Central Console"
            >
              <Shield className="w-3.5 h-3.5 text-purple-600" />
              <span>Central Console</span>
            </a>

            {/* Settings & Change Password Button */}
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950 text-slate-700 dark:text-slate-200 hover:text-purple-600 border border-slate-200 dark:border-slate-700 transition-colors shrink-0"
              title="Admin Profile, Photo & Change Password Settings"
            >
              <Settings className="w-4 h-4 text-purple-600" />
            </button>

            {/* Profile Avatar */}
            <img
              src={currentAdmin.avatar}
              alt={currentAdmin.name}
              onClick={() => setSettingsOpen(true)}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl object-cover border border-purple-400 shrink-0 cursor-pointer hover:ring-2 hover:ring-purple-400 transition-all"
              title="Click to edit profile & photo"
            />

            {/* Logout Button */}
            <button
              type="button"
              onClick={logout}
              className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950 text-slate-600 hover:text-rose-600 border border-slate-200 dark:border-slate-700 transition-colors shrink-0"
              title="Sign out of Department Admin"
            >
              <LogOut className="w-4 h-4" />
            </button>

          </div>

        </div>
      </header>

      {/* ── MAIN WORKSPACE CONTENT ── */}
      <main className="flex-1 p-3 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-x-hidden">
        {children}
      </main>

      {/* ── ADMIN SETTINGS MODAL ── */}
      <AdminSettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

    </div>
  );
};

export const DepartmentAdminLayout: React.FC<DepartmentAdminLayoutProps> = (props) => {
  return (
    <AdminAuthProvider>
      <DepartmentAdminPortalInner {...props} />
    </AdminAuthProvider>
  );
};

export default DepartmentAdminLayout;
