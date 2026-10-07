'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Settings, 
  Bell, 
  Menu, 
  HelpCircle, 
  Grip, 
  X, 
  SlidersHorizontal,
  Moon,
  Sun,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import CseelLogoEmblem from '@/components/shared/CseelLogoEmblem';

interface AdminHeaderProps {
  onToggleMobileMenu: () => void;
  onToggleSidebarCollapse: () => void;
  sidebarCollapsed: boolean;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ 
  onToggleMobileMenu, 
  onToggleSidebarCollapse,
  sidebarCollapsed 
}) => {
  const { currentAdmin, logout, currentRole } = useAdminAuth();
  const [searchVal, setSearchVal] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [appsOpen, setAppsOpen] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-[#dadce0] px-3 sm:px-5 flex items-center justify-between sticky top-0 z-30 font-sans select-none w-full shrink-0">
      {/* ── TOP-LEFT: HAMBURGER ICON (VERY FAR LEFT) + BRAND LOGO & TITLE ── */}
      <div className="flex items-center gap-2 sm:gap-4 min-w-[200px] sm:min-w-[240px]">
        {/* Hamburger Menu Toggle Button */}
        <button
          type="button"
          onClick={() => {
            if (typeof window !== 'undefined' && window.innerWidth < 1024) {
              onToggleMobileMenu();
            } else {
              onToggleSidebarCollapse();
            }
          }}
          className="p-2.5 rounded-full text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4] active:bg-[#e8eaed] transition-colors cursor-pointer"
          title="Main Menu"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5 text-[#5f6368]" />
        </button>

        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2.5 cursor-pointer">
          <div className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center relative shrink-0">
            <CseelLogoEmblem size={38} animated={false} />
          </div>

          <div className="leading-none">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm sm:text-[18px] text-[#202124] tracking-tight">CSEEL</span>
              <span className="text-xs sm:text-[15px] text-[#5f6368] font-normal">Admin</span>
            </div>
            <p className="text-[9px] sm:text-[10px] text-[#5f6368] font-medium tracking-wide mt-0.5 uppercase hidden xs:block">Enterprise Workspace</p>
          </div>
        </div>
      </div>

      {/* ── TOP-CENTER: ROUNDED SEARCH PILL BAR ── */}
      <div className="flex-1 max-w-xl lg:max-w-2xl mx-3 sm:mx-6 hidden md:block">
        <div 
          className={`relative w-full rounded-full transition-all duration-200 flex items-center ${
            searchFocused 
              ? 'bg-white shadow-[0_1px_3px_0_rgba(60,64,67,0.3),0_4px_8px_3px_rgba(60,64,67,0.15)] ring-0' 
              : 'bg-[#f1f3f4] hover:bg-[#e8eaed] hover:shadow-xs'
          }`}
        >
          <div className="pl-4 pr-2 text-[#5f6368]">
            <Search className="w-5 h-5" />
          </div>

          <input
            type="text"
            placeholder="Search across modules, users, settings, and experiments..."
            value={searchVal}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full py-2.5 text-xs sm:text-sm bg-transparent text-[#202124] placeholder:text-[#5f6368] focus:outline-none font-normal"
          />

          {searchVal ? (
            <button
              onClick={() => setSearchVal('')}
              className="p-1.5 mr-2 text-[#5f6368] hover:text-[#202124] rounded-full hover:bg-black/5"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <div className="mr-4 px-2 py-0.5 rounded-md bg-[#e8eaed] text-[11px] font-mono text-[#5f6368] font-medium hidden lg:block">
              ⌘K
            </div>
          )}
        </div>
      </div>

      {/* ── TOP-RIGHT: UTILITIES & AVATAR ── */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Mobile Search Icon */}
        <button
          type="button"
          onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
          className="md:hidden p-2 rounded-full text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4] transition-colors"
          title="Search"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Live Visual Editor Button */}
        <a
          href="/?edit=true"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#005689] hover:bg-[#003c6e] text-white font-bold text-xs shadow-xs hover:shadow-md transition-all active:scale-98"
          title="Open Live Public Website in Visual Edit Mode"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-200" />
          <span>Live Visual Editor</span>
        </a>

        {/* Support */}
        <button
          type="button"
          className="hidden sm:flex p-2.5 rounded-full text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4] transition-colors"
          title="Support & Documentation"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* Settings */}
        <button
          type="button"
          className="p-2 sm:p-2.5 rounded-full text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4] transition-colors"
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>

        {/* 9-Dots App Launcher */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setAppsOpen(!appsOpen)}
            className={`p-2 sm:p-2.5 rounded-full text-[#5f6368] hover:text-[#202124] transition-colors ${appsOpen ? 'bg-[#e8f0fe] text-[#1a73e8]' : 'hover:bg-[#f1f3f4]'}`}
            title="Quick Portals"
          >
            <Grip className="w-5 h-5" />
          </button>

          {appsOpen && (
            <div className="absolute right-0 top-12 w-72 bg-white rounded-2xl shadow-xl border border-[#dadce0] p-4 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="text-xs font-semibold text-[#5f6368] mb-3 uppercase tracking-wider">Platform Hub</div>
              
              <a 
                href="/?edit=true" 
                target="_blank" 
                rel="noopener noreferrer"
                className="mb-3 p-2.5 rounded-xl bg-blue-50/80 hover:bg-blue-100/80 border border-blue-200/80 transition-colors flex items-center gap-3 text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-[#005689] text-white flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#005689] block">Live Website Visual Editor</span>
                  <span className="text-[10px] text-slate-500 block">Edit public website in-place</span>
                </div>
              </a>

              <div className="grid grid-cols-3 gap-3 text-center">
                <a href="https://cseel.org" target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl hover:bg-[#f1f3f4] transition-colors flex flex-col items-center">
                  <div className="w-8 h-8 rounded-lg bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center font-bold text-xs mb-1">Web</div>
                  <span className="text-[11px] text-[#3c4043] font-medium">Public Site</span>
                </a>
                <a href="https://cseel.org/blog" target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl hover:bg-[#f1f3f4] transition-colors flex flex-col items-center">
                  <div className="w-8 h-8 rounded-lg bg-[#fce8e6] text-[#c5221f] flex items-center justify-center font-bold text-xs mb-1">Blog</div>
                  <span className="text-[11px] text-[#3c4043] font-medium">Articles</span>
                </a>
                <a href="https://cseel.org/steam-lab" target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl hover:bg-[#f1f3f4] transition-colors flex flex-col items-center">
                  <div className="w-8 h-8 rounded-lg bg-[#e6f4ea] text-[#137333] flex items-center justify-center font-bold text-xs mb-1">ATL</div>
                  <span className="text-[11px] text-[#3c4043] font-medium">STEAM Labs</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <button
          type="button"
          className="p-2 sm:p-2.5 rounded-full text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4] transition-colors relative"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="w-2 h-2 rounded-full bg-[#ea4335] absolute top-1.5 right-1.5 sm:top-2 sm:right-2 ring-2 ring-white" />
        </button>

        {/* Account Avatar Circle */}
        <div className="ml-1 flex items-center gap-2">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1a73e8] text-white flex items-center justify-center font-semibold text-xs sm:text-sm shadow-xs cursor-pointer ring-2 ring-transparent hover:ring-[#d2e3fc] transition-all">
            D
          </div>
        </div>
      </div>

      {/* ── MOBILE SEARCH POPUP ── */}
      {mobileSearchOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-[#dadce0] p-3 shadow-md z-40 animate-in fade-in slide-in-from-top-2">
          <div className="relative w-full rounded-full bg-[#f1f3f4] flex items-center">
            <div className="pl-3.5 pr-2 text-[#5f6368]">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              autoFocus
              placeholder="Search anything..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full py-2 text-xs bg-transparent text-[#202124] focus:outline-none"
            />
            <button
              onClick={() => setMobileSearchOpen(false)}
              className="p-2 text-[#5f6368]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default AdminHeader;
