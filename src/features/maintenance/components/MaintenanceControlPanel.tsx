'use client';

import React, { useState, useEffect } from 'react';
import {
  Construction,
  Clock,
  Calendar,
  Save,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Eye,
  ExternalLink,
  ShieldCheck,
  Phone,
  Power,
  Sparkles
} from 'lucide-react';
import type { MaintenanceStatus } from '../types';

export const MaintenanceControlPanel: React.FC = () => {
  const [status, setStatus] = useState<MaintenanceStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Form states
  const [enabled, setEnabled] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<'1h' | '6h' | '12h' | '1d' | '2d' | '7d' | 'custom' | 'indefinite'>('1d');
  const [customDateTime, setCustomDateTime] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [contactPhone, setContactPhone] = useState('+91 90507 78830');
  const [contactPerson, setContactPerson] = useState('Dev Sharma');

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/maintenance', { cache: 'no-store' });
      const json = await res.json();
      if (json.success && json.data) {
        const d: MaintenanceStatus = json.data;
        setStatus(d);
        setEnabled(d.enabled);
        setTitle(d.title || '');
        setMessage(d.message || '');
        setContactPhone(d.contactPhone || '+91 90507 78830');
        setContactPerson(d.contactPerson || 'Dev Sharma');

        // Set preset matching
        if (!d.expiresAt) {
          setSelectedPreset('indefinite');
        } else {
          // Format custom datetime for input
          try {
            const exp = new Date(d.expiresAt);
            const isoLocal = new Date(exp.getTime() - exp.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
            setCustomDateTime(isoLocal);
          } catch {}
        }
      }
    } catch (err: any) {
      setErrorMsg('Failed to load maintenance status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleApplyPreset = (preset: '1h' | '6h' | '12h' | '1d' | '2d' | '7d' | 'custom' | 'indefinite') => {
    setSelectedPreset(preset);
    const now = new Date();
    let target: Date | null = null;

    if (preset === '1h') target = new Date(now.getTime() + 1 * 60 * 60 * 1000);
    else if (preset === '6h') target = new Date(now.getTime() + 6 * 60 * 60 * 1000);
    else if (preset === '12h') target = new Date(now.getTime() + 12 * 60 * 60 * 1000);
    else if (preset === '1d') target = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    else if (preset === '2d') target = new Date(now.getTime() + 48 * 60 * 60 * 1000);
    else if (preset === '7d') target = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    if (target) {
      const isoLocal = new Date(target.getTime() - target.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      setCustomDateTime(isoLocal);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const payload: any = {
        enabled,
        title,
        message,
        contactPhone,
        contactPerson,
        updatedBy: 'Dev Sharma (Admin)',
      };

      if (selectedPreset === 'custom') {
        if (!customDateTime) {
          setErrorMsg('Please select a custom expiration date & time.');
          setSaving(false);
          return;
        }
        payload.durationPreset = 'custom';
        payload.customExpiresAt = new Date(customDateTime).toISOString();
      } else {
        payload.durationPreset = selectedPreset;
      }

      const res = await fetch('/api/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setStatus(json.data);
        setSuccessMsg(enabled ? 'Maintenance mode is now active!' : 'Maintenance mode disabled. Site is live!');
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setErrorMsg(json.error || 'Failed to update settings');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Network error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSetBypassCookie = () => {
    // Set 7-day bypass cookie for testing
    document.cookie = 'cseel_admin_bypass=true; path=/; max-age=604800; SameSite=Lax';
    window.open('/?bypass_maintenance=1', '_blank');
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 flex items-center justify-center">
        <RefreshCw className="w-6 h-6 text-[#005689] animate-spin" />
        <span className="ml-3 text-sm font-semibold text-slate-600">Loading Maintenance Status...</span>
      </div>
    );
  }

  const isCurrentlyActive = status?.isActive;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden text-slate-800">
      
      {/* ── HEADER BANNER ── */}
      <div className={`p-5 sm:p-6 border-b transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
        isCurrentlyActive 
          ? 'bg-amber-50/80 border-amber-200 text-amber-950' 
          : 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-2xl ${
            isCurrentlyActive ? 'bg-amber-500 text-white shadow-md' : 'bg-emerald-500 text-white shadow-md'
          }`}>
            <Construction className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full animate-ping ${
                isCurrentlyActive ? 'bg-amber-600' : 'bg-emerald-600'
              }`} />
              <h3 className="text-base sm:text-lg font-black tracking-tight">
                {isCurrentlyActive 
                  ? 'Maintenance Mode is LIVE (Redirecting /)' 
                  : 'Public Site is LIVE (Normal Mode)'}
              </h3>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              {isCurrentlyActive
                ? `Visitors of cseel.org (/) are being redirected to the Under Construction page.`
                : 'All visitors can access the CSEEL home page normally.'}
            </p>
          </div>
        </div>

        {/* Master ON/OFF Switch */}
        <div className="flex items-center gap-3 self-end sm:self-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
            {enabled ? 'ENABLED' : 'DISABLED'}
          </span>
          <button
            type="button"
            onClick={() => setEnabled(!enabled)}
            className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 focus:outline-none cursor-pointer ${
              enabled ? 'bg-amber-500' : 'bg-slate-300'
            }`}
          >
            <div
              className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center ${
                enabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            >
              <Power className={`w-3.5 h-3.5 ${enabled ? 'text-amber-600' : 'text-slate-400'}`} />
            </div>
          </button>
        </div>
      </div>

      {/* ── BODY CONTROLS ── */}
      <div className="p-6 space-y-6">
        
        {/* Messages */}
        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ── SECTION 1: REDIRECTION DURATION (Presets: 1h, 1 day, 2 days, etc.) ── */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#005689]" />
              <span>Redirection Duration (Admin Control)</span>
            </label>
            {status?.formattedExpiresAt && isCurrentlyActive && (
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                Active until: {status.formattedExpiresAt}
              </span>
            )}
          </div>

          <p className="text-xs text-slate-500">
            Choose how long visitors should be redirected to the Construction page. Once the time expires, normal home page access automatically resumes.
          </p>

          {/* Preset Buttons Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {[
              { id: '1h', label: '1 Hour' },
              { id: '6h', label: '6 Hours' },
              { id: '12h', label: '12 Hours' },
              { id: '1d', label: '1 Day' },
              { id: '2d', label: '2 Days' },
              { id: '7d', label: '7 Days' },
              { id: 'custom', label: 'Custom' },
              { id: 'indefinite', label: 'Indefinite' },
            ].map((p) => {
              const isSelected = selectedPreset === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleApplyPreset(p.id as any)}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#005689] border-[#005689] text-white shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          {/* Custom Date & Time Picker */}
          {selectedPreset === 'custom' && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mt-2 space-y-2 animate-in fade-in">
              <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#005689]" />
                <span>Select Expiration Date &amp; Time (IST)</span>
              </label>
              <input
                type="datetime-local"
                value={customDateTime}
                onChange={(e) => setCustomDateTime(e.target.value)}
                className="w-full sm:w-80 px-3.5 py-2 text-xs font-mono border rounded-xl bg-white border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#005689]"
              />
            </div>
          )}
        </div>

        {/* ── SECTION 2: CONTENT CUSTOMIZATION ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Heading Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="CSEEL Platform Under Active Upgrade & Construction"
              className="w-full px-3.5 py-2 text-xs border rounded-xl bg-white border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#005689]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-500" />
              <span>Contact Person &amp; Phone (Shown on Call CTA)</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="Dev Sharma"
                className="px-3.5 py-2 text-xs border rounded-xl bg-white border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#005689]"
              />
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+91 90507 78830"
                className="px-3.5 py-2 text-xs border rounded-xl bg-white border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#005689]"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Explanatory Message
            </label>
            <textarea
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Explanation shown to visitors on the under-construction page..."
              className="w-full px-3.5 py-2 text-xs border rounded-xl bg-white border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#005689]"
            />
          </div>
        </div>

        {/* ── FOOTER ACTIONS ── */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {/* View Under-Construction Page */}
            <a
              href="/under-construction"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview Construction Page</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            {/* Test Home Page with Bypass */}
            <button
              type="button"
              onClick={handleSetBypassCookie}
              className="px-4 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-[#005689] border border-sky-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Open Home Page with Admin Bypass Cookie enabled"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#005689]" />
              <span>Preview Home (Admin Bypass)</span>
            </button>
          </div>

          {/* Primary Save Button */}
          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#005689] hover:bg-[#003c6e] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saving ? 'Applying...' : 'Save & Apply Setting'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceControlPanel;
