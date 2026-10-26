'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  HelpCircle,
  Grid3X3,
  LogOut,
  User,
  Settings,
  ChevronDown
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';

interface PortalGlobalHeaderProps {
  portalName?: string;
  portalBadge?: string;
  badgeColor?: string;
  searchPlaceholder?: string;
}

export default function PortalGlobalHeader({
  portalName,
  portalBadge,
  badgeColor = 'bg-[#e8f0fe] text-[#1967d2] border-blue-200',
  searchPlaceholder = 'Search portal, records, simulations...'
}: PortalGlobalHeaderProps) {
  const router = useRouter();
  const { signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch {}
  };

  return (
    <header className="h-[48px] min-h-[48px] max-h-[48px] bg-white border-b border-[#dadce0] px-3 flex items-center justify-between z-30 shrink-0">
      {/* 1. Left: Logo & Context Badge */}
      <div className="flex items-center gap-2 min-w-0">
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity shrink-0 mr-1">
          <img
            src="/images/cseel-logo.svg"
            alt="CSEEL"
            className="h-6.5 w-auto max-w-[100px] object-contain shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/cseel-logo.png';
            }}
          />
        </Link>

        {portalBadge && (
          <div className={`hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[11px] font-semibold ${badgeColor}`}>
            <span>{portalBadge}</span>
          </div>
        )}
      </div>

      {/* 2. Center: Compact High-Density Search Bar */}
      <div className="flex-1 max-w-[480px] mx-2">
        <div className="relative flex items-center w-full h-8 bg-[#f1f3f4] hover:bg-[#e8eaed] focus-within:bg-white focus-within:shadow-[0_1px_3px_rgba(60,64,67,0.15)] focus-within:border focus-within:border-[#dadce0] rounded-full px-3 transition-all border border-transparent">
          <Search className="w-3.5 h-3.5 text-[#5f6368] mr-2 shrink-0 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full bg-transparent text-xs text-[#202124] placeholder-[#5f6368] focus:outline-none !border-0 !border-transparent !outline-none !shadow-none !ring-0 p-0"
            style={{ border: 'none', outline: 'none', boxShadow: 'none', background: 'transparent' }}
          />
        </div>
      </div>

      {/* 3. Right: Utility Controls & User Profile */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          className="w-7.5 h-7.5 rounded-full flex items-center justify-center text-[#5f6368] hover:bg-[#f1f3f4] transition-colors cursor-pointer"
          title="Help &amp; Documentation"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        <button
          type="button"
          className="w-7.5 h-7.5 rounded-full flex items-center justify-center text-[#5f6368] hover:bg-[#f1f3f4] transition-colors cursor-pointer"
          title="CSEEL Ecosystem Apps"
        >
          <Grid3X3 className="w-4 h-4" />
        </button>

        {/* User Account Menu */}
        <div className="relative ml-1">
          <button
            type="button"
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center gap-1.5 p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <Avatar className="w-6.5 h-6.5 border border-[#dadce0]">
              <AvatarFallback className="bg-[#1a73e8] text-white font-semibold text-[10px]">
                {portalName ? portalName.charAt(0).toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            <ChevronDown className="w-3 h-3 text-[#5f6368]" />
          </button>

          {userDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-52 bg-white rounded-lg shadow-lg border border-[#dadce0] py-1.5 z-[900] text-xs">
              <div className="px-3 py-1.5 border-b border-gray-100">
                <p className="font-semibold text-[#202124]">{portalName || 'Signed In User'}</p>
                <p className="text-[10px] text-[#5f6368] truncate">Active Institutional Session</p>
              </div>

              <button
                type="button"
                onClick={() => setUserDropdownOpen(false)}
                className="w-full text-left px-3 py-1.5 hover:bg-gray-50 flex items-center gap-2 text-[#3c4043] cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5 text-[#5f6368]" />
                <span>Account Preferences</span>
              </button>

              <div className="border-t border-gray-100 my-1" />

              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-left px-3 py-1.5 hover:bg-red-50 text-red-600 flex items-center gap-2 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-red-500" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
