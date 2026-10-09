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
  AlertCircle,
  Shield,
  X,
  Check
} from 'lucide-react';
import AiJsonImportExportModal from './AiJsonImportExportModal';

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
    verifyAllUdiseFields,
    resetToDefault,
    publishToSupabase,
    isUdiseLoading,
    notification
  } = useSchoolTemplate();

  const [udiseInput, setUdiseInput] = useState<string>(data.udiseCode || '');
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState<boolean>(false);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState<boolean>(false);

  const TABS_LIST = [
    { id: 'home', label: 'Home Page' },
    { id: 'academics', label: 'Academics' },
    { id: 'facilities', label: 'Facilities' },
    { id: 'extracurricular', label: 'Extracurricular & Sports' },
    { id: 'awards', label: 'Awards & Honors' },
    { id: 'events', label: 'Events & Life' },
    { id: 'faculty', label: 'Faculty & Mentors' },
    { id: 'gallery', label: 'Campus Gallery' },
    { id: 'admissions', label: 'Admissions & Fees' },
    { id: 'reviews', label: 'Reviews & Ratings' },
    { id: 'contact', label: 'Contact Us Page' },
  ];

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
          {/* 1-Click AI JSON Import / Export Button */}
          {isEditMode && (
            <button
              type="button"
              onClick={() => setIsJsonModalOpen(true)}
              title="Upload JSON to create school profile in 1-Click, or copy AI prompt"
              className="px-3 py-1.5 rounded-xl border border-indigo-500/40 bg-gradient-to-r from-indigo-600/90 to-purple-600/90 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-900/30 transition-all hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>AI JSON Auto-Fill</span>
            </button>
          )}

          {/* Unified Privacy & Visibility Settings Button */}
          {isEditMode && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsPrivacyModalOpen(!isPrivacyModalOpen)}
                title="Manage Public / Private Privacy for all Tabs and Contact Details"
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-xs ${
                  isPrivacyModalOpen
                    ? 'bg-[#006FCC] border-[#006FCC] text-white shadow-md'
                    : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Privacy Settings</span>
              </button>

              {/* Privacy Settings Dropdown Modal / Popover */}
              {isPrivacyModalOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-4 z-[700] text-white animate-in fade-in zoom-in-95 duration-150"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-amber-400" />
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-wider text-white">Privacy & Visibility</h4>
                        <p className="text-[10px] text-slate-400">Toggle public visibility for tabs & contact info</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsPrivacyModalOpen(false)}
                      className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Contact Info Master Toggle */}
                  <div className="py-3 border-b border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-sky-400" />
                        <span>Public Contact Details</span>
                      </div>
                      <p className="text-[10px] text-slate-400">Show phone numbers & emails to parents</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={data.showContactInfo}
                        onChange={toggleContactVisibility}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500" />
                    </label>
                  </div>

                  {/* Tabs Visibility List */}
                  <div className="py-2.5">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
                      <span>Website Tabs ({TABS_LIST.length})</span>
                      <span className="text-[10px] text-slate-500">Public if checked</span>
                    </div>
                    <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
                      {TABS_LIST.map((tab) => {
                        const isTabPublic = data.tabVisibility[tab.id] !== false;
                        return (
                          <div
                            key={tab.id}
                            onClick={() => toggleTabVisibility(tab.id)}
                            className="flex items-center justify-between p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 cursor-pointer border border-slate-700/50 transition-all select-none"
                          >
                            <span className="text-xs font-medium text-slate-200">{tab.label}</span>
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-bold ${isTabPublic ? 'text-emerald-400' : 'text-slate-400'}`}>
                                {isTabPublic ? 'Public' : 'Private'}
                              </span>
                              <input
                                type="checkbox"
                                checked={isTabPublic}
                                onChange={() => {}}
                                className="w-4 h-4 text-emerald-600 bg-slate-900 border-slate-600 rounded focus:ring-emerald-500 pointer-events-none cursor-pointer"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setIsPrivacyModalOpen(false)}
                      className="px-3 py-1.5 bg-[#006FCC] hover:bg-[#005499] text-white text-xs font-bold rounded-xl transition"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 1-Click Verify All Fields Button */}
          {isEditMode && (
            <button
              type="button"
              onClick={verifyAllUdiseFields}
              title="Click to mark all institutional data as Verified by School"
              className="px-3 py-1.5 bg-emerald-700/90 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition-all active:scale-95 border border-emerald-400/50"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
              <span className="hidden sm:inline">Verify All</span>
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

      {/* 1-Click AI JSON Import / Export Modal */}
      <AiJsonImportExportModal
        isOpen={isJsonModalOpen}
        onClose={() => setIsJsonModalOpen(false)}
      />
    </div>
  );
}
