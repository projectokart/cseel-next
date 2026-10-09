'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useUniversalCms } from '@/features/universal-cms/useUniversalCms';
import { VersionHistoryModal } from './VersionHistoryModal';
import { 
  Shield, Sparkles, Save, RotateCcw, History, 
  Eye, Edit3, LogOut, ChevronUp, ChevronDown, Check, Layers 
} from 'lucide-react';

export const UniversalAdminBar: React.FC = () => {
  const pathname = usePathname();
  const {
    pageKey,
    data,
    versions,
    isEditMode,
    isAdminLoggedIn,
    hasUnsavedChanges,
    isSaving,
    isRollingBack,
    toggleEditMode,
    saveChanges,
    rollbackToVersion,
    discardChanges,
  } = useUniversalCms();

  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [summaryInput, setSummaryInput] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // If in admin backend dashboard, don't double render this floating bar
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/system-admin-portal')) {
    return null;
  }

  // Visual edit mode is strictly for authenticated admins who logged in via admin portal
  if (!isAdminLoggedIn) {
    return null;
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await saveChanges(summaryInput.trim() || `Updated ${pathname}`);
    if (res.success) {
      setShowSaveModal(false);
      setSummaryInput('');
      setToastMsg(res.message || 'Changes saved & version created!');
      setTimeout(() => setToastMsg(null), 3000);
    }
  };

  return (
    <>
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[99999] px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-full shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <Check className="w-4 h-4 text-emerald-200" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Floating Universal Control Bar */}
      <div 
        className={`fixed top-0 left-0 right-0 z-[99997] transition-all duration-300 shadow-xl ${
          isEditMode 
            ? 'bg-slate-900/95 text-white backdrop-blur-md border-b border-[#005689]/40' 
            : 'bg-slate-900/80 text-white backdrop-blur-sm border-b border-slate-800/80'
        } ${isCollapsed ? '-translate-y-full pointer-events-none opacity-0' : 'translate-y-0'}`}
      >
        <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Identity & Mode Switch */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-extrabold tracking-wide uppercase text-[11px] text-blue-300 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                Universal Visual CMS
              </span>
              <span className="hidden sm:inline font-mono text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                {pathname || '/'}
              </span>
            </div>

            {/* Edit Mode Toggle Switch */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-700">
              <button
                type="button"
                onClick={toggleEditMode}
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

          {/* Unsaved indicator */}
          {isEditMode && (
            <div className="hidden lg:flex items-center gap-2">
              {hasUnsavedChanges ? (
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  Unsaved Edits Pending
                </span>
              ) : (
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
                  <Check className="w-3 h-3 text-emerald-400" />
                  Database Synchronized
                </span>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 ml-auto">
            {isEditMode && (
              <button
                type="button"
                disabled={isSaving}
                onClick={() => setShowSaveModal(true)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-md transition cursor-pointer active:scale-95 ${
                  hasUnsavedChanges
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white ring-2 ring-emerald-400/40'
                    : 'bg-[#005689] hover:bg-[#003c6e] text-white'
                }`}
                title="Save changes to database & create a version snapshot"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            )}

            {/* Reverse / Rollback History */}
            <button
              type="button"
              onClick={() => setIsVersionModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer shadow-xs"
              title="Reverse changes to any previous version (Max 10 stored)"
            >
              <History className="w-3.5 h-3.5 text-blue-400" />
              <span>Reverse / Rollback</span>
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {versions.length}/10
              </span>
            </button>

            {/* Discard */}
            {isEditMode && hasUnsavedChanges && (
              <button
                type="button"
                onClick={discardChanges}
                className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 rounded transition"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Discard</span>
              </button>
            )}

            {/* Admin Portal link */}
            <a
              href="/admin"
              className="hidden md:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              Dashboard
            </a>

            {/* Collapse toggle */}
            <button
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 text-slate-400 hover:text-white rounded"
            >
              {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mini expand tab when collapsed — standalone centered tab, no full-width bar */}
      {isCollapsed && (
        <div className="fixed top-0 left-1/2 -translate-x-1/2 z-[99997]">
          <button
            onClick={() => setIsCollapsed(false)}
            className="px-3 py-0.5 bg-slate-900 text-white text-[10px] font-bold rounded-b-md shadow-md border-x border-b border-slate-700 flex items-center gap-1 cursor-pointer hover:bg-slate-800 transition-colors"
          >
            <Shield className="w-3 h-3 text-blue-400" />
            <span>Universal CMS</span>
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center font-bold">
                <Save className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Save Changes to Database
                </h3>
                <p className="text-xs text-slate-500">
                  Page: <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">{pathname}</code>
                </p>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-4 pt-1">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Version Summary Note
                </label>
                <input
                  type="text"
                  autoFocus
                  value={summaryInput}
                  onChange={(e) => setSummaryInput(e.target.value)}
                  placeholder={`e.g. Updated copy and images on ${pathname}`}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                <div className="flex items-center justify-between font-semibold">
                  <span>Version Snapshots Stored:</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    {versions.length} / 10
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Max 10 historical snapshots are automatically maintained in database.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSaveModal(false)}
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

      {/* Version History Modal */}
      <VersionHistoryModal
        isOpen={isVersionModalOpen}
        onClose={() => setIsVersionModalOpen(false)}
        versions={versions as any}
        onRollback={async (vId) => {
          return await rollbackToVersion(vId);
        }}
        isRollingBack={isRollingBack}
      />
    </>
  );
};
