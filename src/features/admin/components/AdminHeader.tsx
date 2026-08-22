'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck, ChevronDown, Bell, LogOut, ArrowLeft,
  ExternalLink, Globe, FileSpreadsheet, Download, Check, Menu,
  Briefcase, Building2, GraduationCap, Beaker, Wrench, Package,
  Calendar, Sparkles, User, Shield, Settings
} from 'lucide-react';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { ADMIN_ROLE_CONFIGS, downloadAdminCredentialsCSVFile } from '../data';
import { AdminRole } from '../types';
import { AdminSettingsModal } from './AdminSettingsModal';

interface AdminHeaderProps {
  onToggleMobileMenu?: () => void;
}

const ROLE_ICONS: Record<AdminRole, any> = {
  super_admin: Shield,
  hr_admin: Briefcase,
  school_admin: Building2,
  recruitment_admin: GraduationCap,
  science_admin: Beaker,
  projectokart_admin: Wrench,
  inventory_admin: Package,
  programs_admin: Calendar,
  rnd_admin: Sparkles,
  content_admin: Globe,
};

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onToggleMobileMenu }) => {
  const { currentAdmin, currentRole, switchRole, logout } = useAdminAuth();
  const [downloaded, setDownloaded] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const roleConfig = ADMIN_ROLE_CONFIGS[currentRole];
  const CurrentRoleIcon = ROLE_ICONS[currentRole] || Shield;

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setRoleDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDownload = () => {
    downloadAdminCredentialsCSVFile();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  const handleSelectRole = (role: AdminRole) => {
    switchRole(role);
    setRoleDropdownOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-200/90 py-2 sm:py-2.5 px-3 sm:px-6 sticky top-0 z-40 shadow-2xs">
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        
        {/* ── LEFT: Mobile Menu Button & Breadcrumb Navigation ── */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          
          {/* Mobile Hamburger Button */}
          {onToggleMobileMenu && (
            <button
              type="button"
              onClick={onToggleMobileMenu}
              className="lg:hidden p-1.5 sm:p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition-colors flex items-center gap-1 shrink-0"
              title="Open Navigation"
            >
              <Menu className="w-4 h-4 text-slate-700" />
            </button>
          )}

          <Link
            href="/"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors shrink-0"
            title="Return to Public Website"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Live Website</span>
          </Link>

          <div className="h-4 w-px bg-gray-200 hidden md:block shrink-0" />
          
          <div className="hidden md:flex items-center gap-1.5 text-xs truncate">
            <span className="text-gray-400 font-medium">CSEEL Portal /</span>
            <span className="font-black text-gray-900 truncate">{roleConfig?.title || 'Admin Center'}</span>
          </div>
        </div>

        {/* ── RIGHT: Role Selector Dropdown, Excel Download, Profile & Logout ── */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          
          {/* Custom SVG Icon Role Selector Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 transition-colors shadow-2xs"
              title="Switch Admin Role View"
            >
              <CurrentRoleIcon className="w-3.5 h-3.5 text-purple-600 shrink-0" />
              <span className="truncate max-w-[110px] sm:max-w-[160px] text-[11px] sm:text-xs">
                {roleConfig?.title}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${roleDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Popover Menu */}
            {roleDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-64 sm:w-72 bg-white rounded-2xl border border-gray-200 shadow-xl py-1.5 z-50 animate-in fade-in-50 zoom-in-95 duration-100 max-h-[75vh] overflow-y-auto">
                <div className="px-3 py-1.5 border-b border-gray-100 text-[10px] font-black uppercase text-gray-400 tracking-wider">
                  Switch Active Role Workspace
                </div>
                
                <div className="py-1 space-y-0.5 px-1">
                  {Object.entries(ADMIN_ROLE_CONFIGS).map(([key, cfg]) => {
                    const RoleIcon = ROLE_ICONS[key as AdminRole] || Shield;
                    const isSelected = currentRole === key;

                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleSelectRole(key as AdminRole)}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold text-left transition-colors ${
                          isSelected
                            ? 'bg-purple-50 text-purple-900 font-black border border-purple-200/60'
                            : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <RoleIcon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-purple-600' : 'text-slate-400'}`} />
                          <div className="min-w-0">
                            <p className="truncate leading-tight text-xs">{cfg.title}</p>
                            <p className="text-[10px] text-gray-400 truncate">{cfg.badgeText}</p>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="w-1.5 h-1.5 rounded-full bg-purple-600 shrink-0 ml-1" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Excel Credentials Download Button */}
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-[11px] sm:text-xs font-bold transition-all shrink-0"
            title="Download credentials spreadsheet"
          >
            {downloaded ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="hidden xs:inline text-[11px]">Saved!</span>
              </>
            ) : (
              <>
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="hidden xs:inline text-[11px]">Excel</span>
              </>
            )}
          </button>

          {/* Settings, Admin Profile Pill & Logout */}
          <div className="flex items-center gap-1.5 pl-1.5 border-l border-gray-200 shrink-0">
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-purple-700 border border-slate-200 transition-colors shrink-0"
              title="Admin Profile & Governance Settings"
            >
              <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600" />
            </button>

            <img
              src={currentAdmin.avatar}
              alt={currentAdmin.name}
              onClick={() => setSettingsOpen(true)}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl object-cover border border-purple-300 shrink-0 cursor-pointer hover:ring-2 hover:ring-purple-400 transition-all"
              title="Click to edit profile"
            />

            <button
              type="button"
              onClick={logout}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 transition-colors shrink-0"
              title="Sign out of Admin Portal"
            >
              <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* Admin Settings Modal */}
      <AdminSettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </header>
  );
};

export default AdminHeader;
