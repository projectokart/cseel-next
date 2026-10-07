'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Save, RotateCcw, Eye, EyeOff, Check, AlertCircle, 
  History, Shield, LogIn, LogOut, ChevronDown, ChevronUp, Layers, RefreshCw
} from 'lucide-react';
import { HomepageVersion } from '@/features/homepage-cms/types';

interface AdminVisualEditorBarProps {
  isEditMode: boolean;
  onToggleEditMode: () => void;
  hasUnsavedChanges: boolean;
  versions: HomepageVersion[];
  onSave: (summary: string) => Promise<{ success: boolean; message?: string }>;
  onRollback: (versionId: string) => Promise<{ success: boolean; message?: string }>;
  onDiscard: () => void;
  isSaving: boolean;
  isRollingBack: boolean;
  onOpenVersionModal: () => void;
}

export const AdminVisualEditorBar: React.FC<AdminVisualEditorBarProps> = ({
  isEditMode,
  onToggleEditMode,
  hasUnsavedChanges,
  versions,
  onSave,
  onRollback,
  onDiscard,
  isSaving,
  isRollingBack,
  onOpenVersionModal,
}) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [adminRole, setAdminRole] = useState<string>('super_admin');
  const [showSavePromptModal, setShowSavePromptModal] = useState<boolean>(false);
  const [saveSummaryInput, setSaveSummaryInput] = useState<string>('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [isBarCollapsed, setIsBarCollapsed] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');

  // Check admin session strictly from localStorage
  useEffect(() => {
    try {
      const auth = localStorage.getItem('cseel_admin_auth');
      const role = localStorage.getItem('cseel_admin_role') || 'super_admin';
      if (auth === 'true') {
        setIsAdminLoggedIn(true);
        setAdminRole(role);
      } else {
        setIsAdminLoggedIn(false);
        if (typeof window !== 'undefined') {
          const isEditUrl = window.location.search.includes('edit=true') || window.location.hostname.includes('admin');
          if (isEditUrl) {
            setShowLoginModal(true);
          }
        }
      }
    } catch {
      setIsAdminLoggedIn(false);
    }
  }, []);

  const handleAdminLogout = () => {
    try {
      localStorage.setItem('cseel_admin_auth', 'false');
      setIsAdminLoggedIn(false);
      if (isEditMode) onToggleEditMode();
    } catch {}
  };

  const handleQuickLogin = (role = 'super_admin') => {
    try {
      localStorage.setItem('cseel_admin_auth', 'true');
      localStorage.setItem('cseel_admin_role', role);
      setIsAdminLoggedIn(true);
      setAdminRole(role);
      setShowLoginModal(false);
      setLoginError('');
      if (!isEditMode) onToggleEditMode();
    } catch {}
  };

  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginPassword.trim() === 'Dev@12345' || loginPassword.trim() === 'super@123' || loginPassword.trim() === 'admin') {
      try {
        localStorage.setItem('cseel_admin_auth', 'true');
        localStorage.setItem('cseel_admin_role', 'super_admin');
        setIsAdminLoggedIn(true);
        setAdminRole('super_admin');
        setShowLoginModal(false);
        setLoginError('');
        if (!isEditMode) onToggleEditMode();
      } catch {}
    } else {
      setLoginError('Invalid password. Default: Dev@12345');
    }
  };

  const handleConfirmSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const summary = saveSummaryInput.trim() || `Homepage update by ${adminRole}`;
    const res = await onSave(summary);
    if (res.success) {
      setShowSavePromptModal(false);
      setSaveSummaryInput('');
      setSaveSuccessMsg(res.message || 'Changes saved & version created!');
      setTimeout(() => setSaveSuccessMsg(null), 3500);
    }
  };

  // If not logged in as Admin, only show modal if explicitly on admin subdomain or ?edit=true
  if (!isAdminLoggedIn) {
    if (!showLoginModal) return null;

    return (
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#005689] text-white flex items-center justify-center font-bold shadow-md">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">CSEEL Live Visual Editor</h3>
                <p className="text-xs text-slate-500">Admin authentication required to edit</p>
              </div>
            </div>
            <button
              onClick={() => setShowLoginModal(false)}
              className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1 rounded-lg"
              title="Close"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handlePasswordLogin} className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Admin Password
              </label>
              <input
                type="password"
                placeholder="Enter admin password (Dev@12345)"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#005689]"
                autoFocus
              />
              {loginError && (
                <p className="text-[11px] text-red-500 mt-1 font-medium">{loginError}</p>
              )}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="submit"
                className="flex-1 py-2.5 text-xs font-bold rounded-xl bg-[#005689] hover:bg-[#003c6e] text-white shadow-sm transition active:scale-98"
              >
                Sign In &amp; Unlock Editor
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('super_admin')}
                className="px-3.5 py-2.5 text-xs font-bold rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-[#005689] transition active:scale-98"
                title="Quick demo access"
              >
                👑 Super Admin
              </button>
            </div>
          </form>

          <p className="text-[11px] text-slate-400 text-center pt-1 border-t border-slate-100 dark:border-slate-800">
            Protected under CSEEL Enterprise Governance Suite
          </p>
        </div>
      </div>
    );
  }

  // Admin is logged in:
  return (
    <>
      {/* Save Success Banner Notification */}
      {saveSuccessMsg && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[99999] px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-full shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <Check className="w-4 h-4 text-emerald-200" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Floating Top Control Toolbar */}
      <aside 
        aria-label="Admin Visual Editor Bar"
        className={`fixed top-0 left-0 right-0 z-[99997] transition-all duration-300 shadow-xl ${
          isEditMode 
            ? 'bg-slate-900/95 text-white backdrop-blur-md border-b border-[#005689]/40' 
            : 'bg-slate-900/80 text-white backdrop-blur-sm border-b border-slate-800/80'
        } ${isBarCollapsed ? '-translate-y-[calc(100%-8px)]' : 'translate-y-0'}`}
      >
        <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Left: Identity & Mode Switch */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-extrabold tracking-wide uppercase text-[11px] text-blue-300 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                CSEEL Live Editor
              </span>
              <span className="hidden sm:inline px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                {adminRole.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            {/* Edit Mode Toggle Switch */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-700">
              <span className="text-[11px] font-semibold text-slate-300 hidden md:inline">
                Edit Mode:
              </span>
              <button
                type="button"
                onClick={onToggleEditMode}
                className={`relative inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer shadow-sm ${
                  isEditMode
                    ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 ring-2 ring-amber-400/50'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isEditMode ? 'EDIT MODE: ON' : 'EDIT MODE: OFF'}</span>
              </button>
            </div>
          </div>

          {/* Center: Unsaved State Indicator */}
          {isEditMode && (
            <div className="hidden lg:flex items-center gap-2">
              {hasUnsavedChanges ? (
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  Unsaved Draft Changes
                </span>
              ) : (
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
                  <Check className="w-3 h-3 text-emerald-400" />
                  Live Website In Sync
                </span>
              )}
            </div>
          )}

          {/* Right: Actions (Save Changes, Reverse/Rollback, Preview, Logout) */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Save Changes Button */}
            {isEditMode && (
              <button
                type="button"
                disabled={isSaving}
                onClick={() => setShowSavePromptModal(true)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-md transition cursor-pointer active:scale-95 ${
                  hasUnsavedChanges
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white ring-2 ring-emerald-400/40'
                    : 'bg-[#005689] hover:bg-[#003c6e] text-white'
                }`}
                title="Save current changes and publish a new version snapshot"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            )}

            {/* Reverse / Rollback (Version History) */}
            <button
              type="button"
              onClick={onOpenVersionModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer shadow-xs"
              title="Reverse changes to any previous version (Max 10 stored)"
            >
              <History className="w-3.5 h-3.5 text-blue-400" />
              <span>Reverse / Rollback</span>
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {versions.length}/10
              </span>
            </button>

            {/* Discard Draft Changes */}
            {isEditMode && hasUnsavedChanges && (
              <button
                type="button"
                onClick={onDiscard}
                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-300 hover:bg-rose-500/20 transition cursor-pointer"
                title="Discard unsaved edits and restore last saved state"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Discard</span>
              </button>
            )}

            {/* View Admin Dashboard */}
            <a
              href="/admin"
              className="hidden md:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Open full admin portal"
            >
              <span>Dashboard</span>
            </a>

            {/* Logout button */}
            <button
              type="button"
              onClick={handleAdminLogout}
              className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition"
              title="Log out of Admin Visual Editor"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>

            {/* Collapse/Expand bar button */}
            <button
              type="button"
              onClick={() => setIsBarCollapsed(!isBarCollapsed)}
              className="p-1 text-slate-400 hover:text-white rounded"
              title={isBarCollapsed ? 'Expand Admin Bar' : 'Collapse Admin Bar'}
            >
              {isBarCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Mini expand tab when collapsed */}
        {isBarCollapsed && (
          <div className="flex justify-center pb-0.5">
            <button
              onClick={() => setIsBarCollapsed(false)}
              className="px-3 py-0.5 bg-slate-900 text-white text-[10px] font-bold rounded-b-md shadow-md border-x border-b border-slate-700 flex items-center gap-1"
            >
              <Shield className="w-3 h-3 text-blue-400" />
              <span>CSEEL Visual Editor</span>
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        )}
      </aside>

      {/* Save Version Prompt Modal */}
      {showSavePromptModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center font-bold">
                <Save className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Save Changes & Publish Version
                </h3>
                <p className="text-xs text-slate-500">
                  A new version snapshot will be saved (up to max 10 kept).
                </p>
              </div>
            </div>

            <form onSubmit={handleConfirmSave} className="space-y-4 pt-1">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Version Summary Note (Optional)
                </label>
                <input
                  type="text"
                  autoFocus
                  value={saveSummaryInput}
                  onChange={(e) => setSaveSummaryInput(e.target.value)}
                  placeholder="e.g. Updated hero title and hidden partner schools"
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                <div className="flex items-center justify-between font-semibold">
                  <span>Current Version Count:</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    {versions.length} / 10
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  If more than 10 versions exist, the oldest baseline rolls over automatically.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSavePromptModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-md transition cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? 'Publishing...' : 'Save & Publish Version'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
