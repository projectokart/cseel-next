'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck, ChevronDown, Bell, LogOut, ArrowLeft,
  ExternalLink, Globe, FileSpreadsheet, Download, Check
} from 'lucide-react';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { ADMIN_ROLE_CONFIGS, downloadAdminCredentialsCSVFile } from '../data';
import { AdminRole } from '../types';

export const AdminHeader: React.FC = () => {
  const { currentAdmin, currentRole, switchRole, logout } = useAdminAuth();
  const [downloaded, setDownloaded] = useState(false);
  const roleConfig = ADMIN_ROLE_CONFIGS[currentRole];

  const handleDownload = () => {
    downloadAdminCredentialsCSVFile();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  return (
    <header className="bg-white border-b border-gray-200/90 py-3 px-6 sticky top-0 z-40 shadow-2xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        
        {/* Left: Breadcrumbs & Return to Live Website */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-gray-700 text-xs font-bold rounded-xl transition-colors shrink-0"
            title="View Live Public Website"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Live Website</span>
          </Link>
          <div className="h-4 w-px bg-gray-200" />
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-400 font-medium">CSEEL Portal /</span>
            <span className="font-black text-gray-900">{roleConfig?.title || 'Admin Center'}</span>
          </div>
        </div>

        {/* Right: Download Sheet, Role Switcher, Profile Pill & Logout */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end flex-wrap">
          
          {/* Download CSV Button */}
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-black transition-all shadow-2xs"
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
                <span className="hidden md:inline">Credentials Excel</span>
              </>
            )}
          </button>

          {/* Quick Simulation Role Switcher */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-gray-400 hidden lg:inline">Viewing As:</span>
            <select
              value={currentRole}
              onChange={(e) => switchRole(e.target.value as AdminRole)}
              className="px-2.5 py-1 bg-slate-50 border border-gray-200 rounded-xl text-xs font-black text-purple-900 outline-none cursor-pointer hover:bg-purple-50 transition-colors"
            >
              {Object.entries(ADMIN_ROLE_CONFIGS).map(([key, cfg]) => (
                <option key={key} value={key}>
                  {cfg.badgeText} ({cfg.title})
                </option>
              ))}
            </select>
          </div>

          {/* Admin Profile Pill */}
          <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
            <img
              src={currentAdmin.avatar}
              alt={currentAdmin.name}
              className="w-8 h-8 rounded-xl object-cover border border-purple-300 shrink-0"
            />
            <div className="hidden xl:block text-left">
              <p className="text-xs font-black text-gray-900 leading-tight truncate max-w-[120px]">{currentAdmin.name}</p>
              <p className="text-[10px] font-bold text-purple-700 truncate max-w-[120px]">{roleConfig?.department}</p>
            </div>
          </div>

          {/* Logout Button */}
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
    </header>
  );
};

export default AdminHeader;
