'use client';

import React, { useState } from 'react';
import { HomepageVersion } from '@/features/homepage-cms/types';
import { History, RotateCcw, X, CheckCircle, Clock, User, AlertTriangle, Layers } from 'lucide-react';

interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  versions: HomepageVersion[];
  onRollback: (versionId: string) => Promise<{ success: boolean; message?: string }>;
  isRollingBack: boolean;
}

export const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({
  isOpen,
  onClose,
  versions,
  onRollback,
  isRollingBack,
}) => {
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!isOpen) return null;

  // Sort versions descending (newest first)
  const sortedVersions = [...versions].sort((a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  const handleTriggerRollback = async (versionId: string) => {
    setFeedback(null);
    const res = await onRollback(versionId);
    if (res.success) {
      setFeedback({ type: 'success', message: res.message || 'Successfully rolled back to this version!' });
      setConfirmingId(null);
      setTimeout(() => {
        setFeedback(null);
        onClose();
      }, 1500);
    } else {
      setFeedback({ type: 'error', message: res.message || 'Failed to rollback' });
    }
  };

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      return iso;
    }
  };

  const getRelativeTime = (iso: string) => {
    try {
      const diffSec = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
      if (diffSec < 60) return 'Just now';
      if (diffSec < 3600) return `${Math.floor(diffSec / 60)} min ago`;
      if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} hr ago`;
      return `${Math.floor(diffSec / 86400)} days ago`;
    } catch {
      return '';
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#005689]/10 text-[#005689] flex items-center justify-center font-bold">
              <History className="w-5 h-5 text-[#005689]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Version History & Rollback
                </h3>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                  {versions.length} / 10 Saved
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Reverse website changes anytime. System automatically stores up to max 10 latest versions.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback message */}
        {feedback && (
          <div
            className={`px-6 py-3 text-sm flex items-center gap-2 font-medium ${
              feedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-b border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300'
                : 'bg-rose-50 text-rose-800 border-b border-rose-200 dark:bg-rose-950/40 dark:text-rose-300'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Versions List */}
        <div className="p-6 overflow-y-auto space-y-3.5 flex-1 divide-y divide-slate-100 dark:divide-slate-800/60">
          {sortedVersions.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <History className="w-12 h-12 mx-auto mb-3 stroke-[1.5] text-slate-300 dark:text-slate-600" />
              <p className="text-sm font-medium">No saved versions found yet.</p>
              <p className="text-xs text-slate-500">Edit any content and click &quot;Save Changes&quot; to create a new version.</p>
            </div>
          ) : (
            sortedVersions.map((v, idx) => {
              const isLatest = idx === 0;
              const isConfirming = confirmingId === v.id;

              return (
                <div
                  key={v.id}
                  className={`pt-3.5 first:pt-0 rounded-xl transition ${
                    isLatest ? 'bg-blue-50/40 dark:bg-blue-950/20 p-3.5 border border-blue-200/60 dark:border-blue-900/40' : 'p-3'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-[#005689]" />
                          Version #{v.versionNumber}
                        </span>
                        {isLatest && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-[#005689] text-white px-2 py-0.5 rounded-full">
                            Current Active
                          </span>
                        )}
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {getRelativeTime(v.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        {v.summary || 'Content update'}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" /> {v.author || 'Admin'}
                        </span>
                        <span>•</span>
                        <span>{formatDate(v.timestamp)}</span>
                        <span>•</span>
                        <span>{v.sections?.length || 0} sections configured</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {!isLatest && (
                        <>
                          {isConfirming ? (
                            <div className="flex items-center gap-1.5 animate-in fade-in">
                              <button
                                type="button"
                                disabled={isRollingBack}
                                onClick={() => handleTriggerRollback(v.id)}
                                className="px-3 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition disabled:opacity-50"
                              >
                                {isRollingBack ? 'Restoring...' : 'Confirm Rollback'}
                              </button>
                              <button
                                type="button"
                                disabled={isRollingBack}
                                onClick={() => setConfirmingId(null)}
                                className="px-2 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmingId(v.id)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#005689] dark:text-cyan-400 border border-[#005689]/30 dark:border-cyan-500/30 rounded-lg hover:bg-[#005689]/10 dark:hover:bg-cyan-950/30 transition shadow-2xs cursor-pointer active:scale-95"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              Reverse to this
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>Max 10 chronological version snapshots retained</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold hover:bg-slate-100 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
