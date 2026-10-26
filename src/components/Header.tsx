'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  HelpCircle,
  Grid3X3,
  LogOut,
  Shield,
  School,
  GraduationCap,
  Users,
  UserCheck
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';

export interface HeaderProps {
  portalName?: string;
  portalBadge?: string;
  badgeColor?: string;
  searchPlaceholder?: string;
  onSearchChange?: (val: string) => void;
  searchValue?: string;
  roleIcon?: 'admin' | 'school' | 'teacher' | 'student' | 'parent';
  customLeftContent?: React.ReactNode;
}

export default function Header({
  portalName = 'CSEEL Portal',
  portalBadge,
  badgeColor = 'bg-blue-50 text-blue-700 border-blue-200',
  searchPlaceholder = 'Search across portal...',
  onSearchChange,
  searchValue = '',
  roleIcon = 'admin',
  customLeftContent
}: HeaderProps) {
  const router = useRouter();
  const { signOut, user } = useAuth();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchValue);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value);
    if (onSearchChange) {
      onSearchChange(e.target.value);
    }
  };

  const getRoleIcon = () => {
    switch (roleIcon) {
      case 'school':
        return <School className="portal-header-badge-icon text-[#1967d2]" />;
      case 'teacher':
        return <GraduationCap className="portal-header-badge-icon text-[#1967d2]" />;
      case 'student':
        return <UserCheck className="portal-header-badge-icon text-[#1967d2]" />;
      case 'parent':
        return <Users className="portal-header-badge-icon text-[#1967d2]" />;
      case 'admin':
      default:
        return <Shield className="portal-header-badge-icon text-[#1967d2]" />;
    }
  };

  return (
    <header className="portal-header">
      {/* Left: Brand Logo & Role Pill */}
      <div className="flex items-center gap-2.5 min-w-0 shrink-0">
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity shrink-0">
          <img
            src="/images/cseel-logo.svg"
            alt="CSEEL"
            className="portal-logo-img"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/cseel-logo.png';
            }}
          />
        </Link>

        {customLeftContent ? (
          customLeftContent
        ) : portalBadge ? (
          <div className={`portal-header-badge hidden sm:inline-flex ${badgeColor}`}>
            {getRoleIcon()}
            <span className="truncate max-w-[220px]">{portalBadge}</span>
          </div>
        ) : null}
      </div>

      {/* Center: Search Bar */}
      <div className="portal-search-container">
        <div className="portal-search-pill">
          <Search className="portal-search-icon" />
          <input
            type="text"
            value={localSearch}
            onChange={handleSearchChange}
            placeholder={searchPlaceholder}
            className="portal-search-input"
          />
        </div>
      </div>

      {/* Right: Support, App Launcher & Profile */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          className="portal-header-tool-btn"
          title="Support & Documentation"
        >
          <HelpCircle className="portal-header-tool-icon" />
        </button>

        <button
          type="button"
          className="portal-header-tool-btn"
          title="CSEEL Ecosystem Tools"
        >
          <Grid3X3 className="portal-header-tool-icon" />
        </button>

        <div className="relative ml-1">
          <button
            type="button"
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="portal-avatar-btn ring-1 ring-gray-200 hover:ring-2 hover:ring-blue-400 transition-all"
          >
            <Avatar className="w-7 h-7 bg-[#1a73e8] text-white font-semibold text-[11px]">
              <AvatarFallback>
                {portalName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </button>

          {userDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-[#dadce0] py-1.5 z-[700] text-xs">
              <div className="px-3 py-2 border-b border-gray-100">
                <p className="font-semibold text-[#202124] truncate">{portalName}</p>
                <p className="text-[#5f6368] text-[11px] truncate">{user?.email || 'authenticated-user@cseel.in'}</p>
              </div>
              <div className="pt-1">
                <button
                  type="button"
                  onClick={async () => {
                    try { await signOut(); } catch {}
                    router.push('/login');
                  }}
                  className="w-full px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
