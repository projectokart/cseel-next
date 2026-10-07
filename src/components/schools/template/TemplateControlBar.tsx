'use client';

import React, { useState } from 'react';
import { useSchoolTemplate } from './SchoolTemplateContext';
import {
  Edit3,
  Eye,
  Save,
  RotateCcw,
  Send,
  Sparkles,
  CheckCircle2,
  Lock,
  Globe,
  Phone,
  PhoneOff,
  Search,
  Loader2,
  AlertCircle
} from 'lucide-react';

interface TemplateControlBarProps {
  currentTab: string;
  onTabChange?: (tab: string) => void;
}

export default function TemplateControlBar({ currentTab }: TemplateControlBarProps) {
  const {
    data,
    isEditMode,
    setIsEditMode,
    isSaving,
    lastSavedAt,
    saveTab,
    toggleTabVisibility,
    toggleContactVisibility,
    fetchUdise,
    resetToDefault,
    publishToSupabase,
    isUdiseLoading,
    notification
  } = useSchoolTemplate();

  const [udiseInput, setUdiseInput] = useState<string>(data.udiseCode || '');
  const [isPublishing, setIsPublishing] = useState<boolean>(false);

  const isCurrentTabPublic = data.tabVisibility[currentTab] !== false;
  const isUdiseReady = udiseInput.trim().replace(/\D/g, '').length === 11;

  const handleUdiseSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isUdiseReady) return;
    await fetchUdise(udiseInput.trim().replace(/\D/g, ''));
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    await publishToSupabase();
    setIsPublishing(false);
  };

  return (
    <div className="sticky top-0 z-[600] w-full bg-slate-900/95 backdrop-blur-md text-white border-b border-slate-700 shadow-xl transition-all">
      {/* Dynamic Toast Notification Banner */}
      {notification && (
        <div
          className={`px-4 py-2 text-xs sm:text-sm font-semibold flex items-center justify-between transition-all ${
            notification.type === 'success'
              ? 'bg-emerald-600 text-white'
              : notification.type === 'error'
              ? 'bg-rose-600 text-white'
              : 'bg-sky-600 text-white'
          }`}
        >
          <div className="max-w-[1440px] mx-auto flex items-center gap-2">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Main Bar */}
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Mode Toggle & Autosave Indicator */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="bg-slate-800 p-0.5 rounded-xl border border-slate-700 flex items-center">
            <button
              type="button"
              onClick={() => setIsEditMode(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isEditMode
                  ? 'bg-[#006FCC] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Live Edit Mode</span>
            </button>
            <button
              type="button"
              onClick={() => setIsEditMode(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                !isEditMode
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview Mode</span>
            </button>
          </div>

          {/* Autosave Status Pill */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-[11px] text-slate-300">
            <span
              className={`w-2 h-2 rounded-full ${
                isSaving ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'
              }`}
            />
            <span>{isSaving ? 'Saving to local storage...' : `Autosaved: ${lastSavedAt || 'Synced'}`}</span>
          </div>
        </div>

        {/* Center: UDISE Auto-Fetch Quick Tool (Prominent when on Home tab or anytime) */}
        {isEditMode && (
          <form
            onSubmit={handleUdiseSubmit}
            className="flex items-center gap-2 bg-slate-800/90 border border-slate-700 rounded-xl px-2.5 py-1 flex-1 max-w-md"
          >
            <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400 uppercase tracking-wider shrink-0">
              <Sparkles className="w-3 h-3" />
              <span className="hidden sm:inline">UDISE:</span>
            </div>
            <input
              type="text"
              maxLength={11}
              value={udiseInput}
              onChange={(e) => setUdiseInput(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter 11-digit UDISE code (e.g. 06170100101)"
              className="bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none w-full font-mono tracking-wider"
            />
            <button
              type="submit"
              disabled={!isUdiseReady || isUdiseLoading}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shrink-0 transition-all ${
                isUdiseReady && !isUdiseLoading
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer shadow-xs'
                  : 'bg-slate-700 text-slate-400 cursor-not-allowed opacity-60'
              }`}
            >
              {isUdiseLoading ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Search className="w-3 h-3" />
              )}
              <span className="hidden xs:inline">Auto-Fill</span>
            </button>
          </form>
        )}

        {/* Right: Tab Controls & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Tab Visibility Switch (Public vs Private) */}
          {isEditMode && (
            <button
              type="button"
              onClick={() => toggleTabVisibility(currentTab)}
              title={isCurrentTabPublic ? 'Make this tab private' : 'Make this tab public'}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
                isCurrentTabPublic
                  ? 'bg-slate-800 border-slate-700 text-emerald-400 hover:bg-slate-750'
                  : 'bg-rose-950/60 border-rose-800 text-rose-300 hover:bg-rose-900/60'
              }`}
            >
              {isCurrentTabPublic ? <Globe className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              <span className="hidden lg:inline">{isCurrentTabPublic ? 'Tab: Public' : 'Tab: Private'}</span>
            </button>
          )}

          {/* Contact Info Visibility Switch */}
          {isEditMode && (
            <button
              type="button"
              onClick={toggleContactVisibility}
              title={data.showContactInfo ? 'Hide contact information' : 'Show contact information'}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
                data.showContactInfo
                  ? 'bg-slate-800 border-slate-700 text-sky-400 hover:bg-slate-750'
                  : 'bg-amber-950/60 border-amber-800 text-amber-300 hover:bg-amber-900/60'
              }`}
            >
              {data.showContactInfo ? <Phone className="w-3.5 h-3.5" /> : <PhoneOff className="w-3.5 h-3.5" />}
              <span className="hidden xl:inline">{data.showContactInfo ? 'Contact: Shown' : 'Contact: Hidden'}</span>
            </button>
          )}

          {/* Save Current Tab Button */}
          {isEditMode && (
            <button
              type="button"
              onClick={() => saveTab(currentTab)}
              className="px-3 py-1.5 bg-[#006FCC] hover:bg-[#005499] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition-transform active:scale-95"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Tab</span>
            </button>
          )}

          {/* Reset Template Button */}
          {isEditMode && (
            <button
              type="button"
              onClick={resetToDefault}
              title="Reset to default template"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Publish / Submit to Supabase */}
          <button
            type="button"
            onClick={handlePublish}
            disabled={isPublishing}
            className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
          >
            {isPublishing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span>Publish Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
