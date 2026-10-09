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
  ChevronDown,
  ChevronUp,
  Settings2
} from 'lucide-react';
import type { MaintenanceStatus } from '../types';

export const MaintenanceControlPanel: React.FC = () => {
  const [status, setStatus] = useState<MaintenanceStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

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

        if (!d.expiresAt) {
          setSelectedPreset('indefinite');
        } else {
          try {
            const exp = new Date(d.expiresAt);
            const isoLocal = new Date(exp.getTime() - exp.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
            setCustomDateTime(isoLocal);
          } catch {}
        }
      }
    } catch {
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

  const handleQuickToggle = async () => {
    const nextState = !enabled;
    setEnabled(nextState);
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const payload: any = {
        enabled: nextState,
        title,
        message,
        contactPhone,
        contactPerson,
        durationPreset: selectedPreset,
        updatedBy: 'Dev Sharma (Admin)',
      };

      const res = await fetch('/api/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setStatus(json.data);
        setSuccessMsg(nextState ? 'Maintenance mode enabled! Visitors will see under construction.' : 'Maintenance disabled. Site is LIVE!');
        setTimeout(() => setSuccessMsg(''), 3500);
      } else {
        setErrorMsg(json.error || 'Failed to update settings');
        setEnabled(!nextState); // revert
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Network error updating settings');
      setEnabled(!nextState); // revert
    } finally {
      setSaving(false);
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
        setSuccessMsg(enabled ? 'Maintenance settings saved & active!' : 'Settings saved. Site is LIVE!');
        setTimeout(() => setSuccessMsg(''), 3500);
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
    document.cookie = 'cseel_admin_bypass=true; path=/; max-age=604800; SameSite=Lax';
    window.open('/?bypass_maintenance=1', '_blank');
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-[#dadce0] p-3 flex items-center justify-between text-xs text-[#5f6368]">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-3.5 h-3.5 text-[#1a73e8] animate-spin" />
          <span>Syncing site status...</span>
        </div>
      </div>
    );
  }

  const isCurrentlyActive = status?.isActive;

  return (
    <div className="bg-white rounded-xl border border-[#dadce0] shadow-[0_1px_2px_rgba(60,64,67,0.08)] overflow-hidden text-[#202124]">
      {/* ── COMPACT SINGLE-ROW GOOGLE-STYLE STATUS BAR ── */}
      <div className={`px-3 py-2 flex flex-wrap items-center justify-between gap-2.5 transition-colors ${
        isCurrentlyActive 
          ? 'bg-[#fef7e0]/70 border-b border-[#fce8b2]' 
          : 'bg-[#e6f4ea]/40'
      }`}>
        {/* Left: Status Pill + Quick Switch */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isCurrentlyActive ? 'bg-[#b06000] animate-pulse' : 'bg-[#137333]'}`} />
            <span className={`text-xs font-semibold ${isCurrentlyActive ? 'text-[#b06000]' : 'text-[#137333]'}`}>
              {isCurrentlyActive ? 'Maintenance Mode ACTIVE' : 'Public Site LIVE'}
            </span>
          </div>

          <span className="text-[#dadce0] text-xs">|</span>

          {/* Quick Toggle Switch */}
          <button
            type="button"
            disabled={saving}
            onClick={handleQuickToggle}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border transition-all cursor-pointer ${
              enabled
                ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                : 'bg-white text-[#5f6368] border-[#dadce0] hover:bg-[#f1f3f4]'
            }`}
            title="Toggle Maintenance Mode"
          >
            <Power className="w-3 h-3 text-current" />
            <span>{enabled ? 'Disable' : 'Enable'}</span>
          </button>

          {isCurrentlyActive && status?.formattedExpiresAt && (
            <span className="text-[11px] text-[#705000] hidden sm:inline-block">
              (Expires: {status.formattedExpiresAt})
            </span>
          )}
        </div>

        {/* Right: Actions & Collapse Button */}
        <div className="flex items-center gap-1.5">
          <a
            href="/under-construction"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2 py-1 rounded-md text-[11px] text-[#5f6368] hover:text-[#202124] hover:bg-black/5 flex items-center gap-1 transition-colors"
            title="Preview Construction Page"
          >
            <Eye className="w-3 h-3" />
            <span className="hidden sm:inline">Preview</span>
          </a>

          <button
            type="button"
            onClick={handleSetBypassCookie}
            className="px-2 py-1 rounded-md text-[11px] text-[#1a73e8] hover:bg-[#e8f0fe] flex items-center gap-1 transition-colors cursor-pointer"
            title="Preview Home Page bypassing maintenance"
          >
            <ShieldCheck className="w-3 h-3" />
            <span className="hidden sm:inline">Admin Bypass</span>
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-2 py-1 rounded-md text-[11px] font-medium text-[#202124] hover:bg-black/5 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Settings2 className="w-3 h-3 text-[#5f6368]" />
            <span>{isExpanded ? 'Hide' : 'Configure'}</span>
            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Messages */}
      {successMsg && (
        <div className="px-3 py-1.5 bg-[#e6f4ea] text-[#137333] text-xs font-medium flex items-center gap-1.5 border-t border-[#ceead6]">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="px-3 py-1.5 bg-[#fce8e6] text-[#c5221f] text-xs font-medium flex items-center gap-1.5 border-t border-[#fad2cf]">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* ── COLLAPSIBLE CONFIGURATION DRAWER ── */}
      {isExpanded && (
        <div className="p-3.5 border-t border-[#dadce0] bg-[#fafafa] space-y-3 animate-in fade-in text-xs">
          {/* Preset Buttons */}
          <div>
            <label className="block text-[11px] font-bold text-[#5f6368] uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#1a73e8]" />
              <span>Redirect Duration</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: '1h', label: '1 Hr' },
                { id: '6h', label: '6 Hrs' },
                { id: '12h', label: '12 Hrs' },
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
                    className={`py-1 px-2 text-[11px] font-medium rounded-md border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#1a73e8] border-[#1a73e8] text-white shadow-xs'
                        : 'bg-white border-[#dadce0] text-[#3c4043] hover:bg-[#f1f3f4]'
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>

            {selectedPreset === 'custom' && (
              <div className="mt-2 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-[#5f6368]" />
                <input
                  type="datetime-local"
                  value={customDateTime}
                  onChange={(e) => setCustomDateTime(e.target.value)}
                  className="px-2.5 py-1 text-xs border rounded-md bg-white border-[#dadce0] focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
                />
              </div>
            )}
          </div>

          {/* Text and Contact Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-[#dadce0]/70">
            <div>
              <label className="block text-[11px] font-semibold text-[#5f6368] mb-1">
                Headline Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="CSEEL Platform Under Active Upgrade"
                className="w-full px-2.5 py-1 text-xs border rounded-md bg-white border-[#dadce0] focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#5f6368] mb-1">
                Contact Person &amp; Phone
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <input
                  type="text"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  placeholder="Dev Sharma"
                  className="px-2.5 py-1 text-xs border rounded-md bg-white border-[#dadce0] focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
                />
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+91 90507 78830"
                  className="px-2.5 py-1 text-xs border rounded-md bg-white border-[#dadce0] focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-[#5f6368] mb-1">
                Notice Message
              </label>
              <textarea
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Explanation shown to visitors..."
                className="w-full px-2.5 py-1 text-xs border rounded-md bg-white border-[#dadce0] focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
              />
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex justify-end gap-2 border-t border-[#dadce0]/70">
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="px-3 py-1 text-xs text-[#5f6368] hover:text-[#202124] rounded-md hover:bg-black/5 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={handleSave}
              className="px-4 py-1.5 rounded-md bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenanceControlPanel;
