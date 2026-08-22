'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck, ChevronDown, Bell, LogOut, ArrowLeft,
  ExternalLink, Globe, FileSpreadsheet, Download, Check, Menu
} from 'lucide-react';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { ADMIN_ROLE_CONFIGS, downloadAdminCredentialsCSVFile } from '../data';
import { AdminRole } from '../types';

interface AdminHeaderProps {
  onToggleMobileMenu?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onToggleMobileMenu }) => {
  const { currentAdmin, currentRole, switchRole, logout } = useAdminAuth();
  const [downloaded, setDownloaded] = useState(false);
  const roleConfig = ADMIN_ROLE_CONFIGS[currentRole];

  const handleDownload = () => {
    downloadAdminCredentialsCSVFile();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  return (
    <header className="bg-white border-b border-gray-200/90 py-2.5 sm:py-3 px-3 sm:px-6 sticky top-0 z-40 shadow-2xs">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-4">
        
        {/* Left: Mobile Menu Toggle + Breadcrumbs & Return to Live Website */}
        <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-3">
          
          <div className="flex items-center gap-2">
            {/* Mobile Hamburger Button */}
            {onToggleMobileMenu && (
              <button
                type="button"
                onClick={onToggleMobileMenu}
                className="lg:hidden p-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 transition-colors flex items-center gap-1.5 text-xs font-bold shrink-0"
                title="Open Admin Workspaces Menu"
              >
                <Menu className="w-4 h-4 text-purple-700" />
                <span className="text-[11px] font-black sm:hidden">Menu</span>
              </button>
            )}

            <Link
              href="/"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-gray-700 text-[11px] sm:text-xs font-bold rounded-xl transition-colors shrink-0"
              title="View Live Public Website"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Live Website</span>
            </Link>
          </div>

          <div className="h-4 w-px bg-gray-200 hidden sm:block" />
          
          <div className="flex items-center gap-1.5 text-xs truncate">
            <span className="text-gray-400 font-medium hidden md:inline">CSEEL Portal /</span>
            <span className="font-black text-gray-900 truncate text-[11px] sm:text-xs">{roleConfig?.title || 'Admin Center'}</span>
          </div>

          {/* Mobile Profile Icon (Visible on small screens) */}
          <div className="sm:hidden flex items-center gap-1.5 shrink-0">
            <img
              src={currentAdmin.avatar}
              alt={currentAdmin.name}
              className="w-7 h-7 rounded-lg object-cover border border-purple-300"
            />
            <button
              type="button"
              onClick={logout}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-gray-600 hover:text-rose-600 transition-colors"
              title="Sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Download Sheet, Role Switcher, Profile Pill & Logout */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          
          {/* Download CSV Button */}
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-[11px] sm:text-xs font-black transition-all shadow-2xs shrink-0"
            title="Download credentials spreadsheet (.csv / Excel)"
          >
            {downloaded ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Downloaded!</span>
              </>
            ) : (
              <>
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Excel</span>
              </>
            )}
          </button>

          {/* Quick Simulation Role Switcher */}
          <div className="flex items-center gap-1.5 flex-1 sm:flex-initial min-w-0">
            <span className="text-[11px] font-bold text-gray-400 hidden lg:inline">Viewing As:</span>
            <select
              value={currentRole}
              onChange={(e) => switchRole(e.target.value as AdminRole)}
              className="w-full sm:w-auto px-2 py-1.5 bg-slate-50 border border-gray-200 rounded-xl text-[11px] sm:text-xs font-black text-purple-900 outline-none cursor-pointer hover:bg-purple-50 transition-colors truncate"
            >
              {Object.entries(ADMIN_ROLE_CONFIGS).map(([key, cfg]) => (
                <option key={key} value={key}>
                  {cfg.badgeText} ({cfg.title})
                </option>
              ))}
            </select>
          </div>

          {/* Admin Profile Pill & Logout (Hidden on mobile small bar, shown on sm+) */}
          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-gray-200 shrink-0">
            <img
              src={currentAdmin.avatar}
              alt={currentAdmin.name}
              className="w-8 h-8 rounded-xl object-cover border border-purple-300 shrink-0"
            />
            <div className="hidden xl:block text-left">
              <p className="text-xs font-black text-gray-900 leading-tight truncate max-w-[120px]">{currentAdmin.name}</p>
              <p className="text-[10px] font-bold text-purple-700 truncate max-w-[120px]">{roleConfig?.department}</p>
            </div>
            <button
              type="button"
              onClick={logout}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-gray-600 hover:text-rose-600 border border-gray-200 transition-colors"
              title="Sign out of Admin Portal"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </header>
  );
};

export default AdminHeader;
