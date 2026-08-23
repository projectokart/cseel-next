'use client';

import React, { useState } from 'react';
import {
  Layout, Eye, EyeOff, Edit3, CheckCircle2, RotateCcw,
  Search, ArrowRight, ExternalLink, Save, X, Sparkles,
  Layers, Check, Globe, Sliders, AlertCircle
} from 'lucide-react';
import { HomepageSectionConfig, HomepageSectionId } from '@/features/homepage-cms/types';
import { useHomepageCms } from '@/features/homepage-cms/hooks/useHomepageCms';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

export const HomepageCmsAdminModule: React.FC = () => {
  const { addAuditLog } = useAdminAuth();
  const { sections, isSectionEnabled, toggleSection, updateSection } = useHomepageCms();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'enabled' | 'disabled'>('all');

  // Modal State
  const [editingSection, setEditingSection] = useState<HomepageSectionConfig | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formBadgeText, setFormBadgeText] = useState('');
  const [formCtaText, setFormCtaText] = useState('');
  const [formCtaLink, setFormCtaLink] = useState('');
  const [formSecondaryCtaText, setFormSecondaryCtaText] = useState('');
  const [formSecondaryCtaLink, setFormSecondaryCtaLink] = useState('');
  const [formEnabled, setFormEnabled] = useState(true);
  const [formItems, setFormItems] = useState<any[]>([]);

  const handleOpenEdit = (sec: HomepageSectionConfig) => {
    setEditingSection(sec);
    setFormTitle(sec.title || '');
    setFormSubtitle(sec.subtitle || '');
    setFormBadgeText(sec.badge_text || '');
    setFormCtaText(sec.cta_text || '');
    setFormCtaLink(sec.cta_link || '');
    setFormSecondaryCtaText(sec.secondary_cta_text || '');
    setFormSecondaryCtaLink(sec.secondary_cta_link || '');
    setFormEnabled(sec.enabled);
    setFormItems(sec.items ? JSON.parse(JSON.stringify(sec.items)) : []);
    setModalOpen(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSection) return;

    await updateSection(editingSection.id, {
      title: formTitle.trim(),
      subtitle: formSubtitle.trim() || undefined,
      badge_text: formBadgeText.trim() || undefined,
      cta_text: formCtaText.trim() || undefined,
      cta_link: formCtaLink.trim() || undefined,
      secondary_cta_text: formSecondaryCtaText.trim() || undefined,
      secondary_cta_link: formSecondaryCtaLink.trim() || undefined,
      enabled: formEnabled,
      items: formItems.length > 0 ? formItems : undefined,
    });

    addAuditLog(
      'EDIT_HOMEPAGE_SECTION',
      'content_homepage',
      `Updated homepage section "${editingSection.name}" (${editingSection.id}) data & copy`
    );

    setModalOpen(false);
  };

  const handleToggle = async (sec: HomepageSectionConfig) => {
    await toggleSection(sec.id);
    addAuditLog(
      'TOGGLE_HOMEPAGE_SECTION',
      'content_homepage',
      `Toggled section "${sec.name}" to ${!sec.enabled ? 'Enabled (Live)' : 'Disabled (Hidden)'}`
    );
  };

  const handleResetAll = async () => {
    if (confirm('Are you sure you want to reset all homepage sections to the initial factory default layout?')) {
      try {
        const res = await fetch('/api/homepage-sections', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'reset' }),
        });
        const data = await res.json();
        if (data.success) {
          localStorage.removeItem('cseel_homepage_sections_cms');
          window.location.reload();
        }
      } catch {}
    }
  };

  // Filter sections
  const filteredSections = sections.filter((sec) => {
    const matchesSearch =
      sec.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sec.subtitle || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      sec.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = filterCategory === 'all' || sec.category === filterCategory;
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'enabled' && sec.enabled) ||
      (filterStatus === 'disabled' && !sec.enabled);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const enabledCount = sections.filter((s) => s.enabled).length;
  const disabledCount = sections.length - enabledCount;

  return (
    <div className="space-y-6">
      {/* ── HEADER ── */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 rounded-full text-xs font-black text-sky-800 dark:text-sky-300">
            <Layout className="w-3.5 h-3.5 text-sky-600" />
            <span>HOMEPAGE MASTER SECTIONS & DATA CMS</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Homepage Section Visibility & Content Manager
          </h2>
          <p className="text-xs text-slate-500 max-w-2xl">
            Super Admin master control to enable/disable any section on <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-purple-600 font-bold">www.cseel.org/</code>, change headlines, copy, badges, CTA buttons, and numbers in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-2xl transition-all flex items-center gap-2"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Preview Live Homepage</span>
          </a>
          <button
            onClick={handleResetAll}
            className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-bold text-xs rounded-2xl border border-rose-200 dark:border-rose-800 transition-all flex items-center gap-2"
            title="Reset all sections to factory default"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      {/* ── METRICS TILES ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Total Sections</span>
          <p className="text-xl font-black text-slate-900 dark:text-white">{sections.length} Components</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Live (Visible)</span>
          <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">{enabledCount} Active</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Disabled (Hidden)</span>
          <p className="text-xl font-black text-amber-600 dark:text-amber-400">{disabledCount} Hidden</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Sync State</span>
          <p className="text-xl font-black text-sky-600 dark:text-sky-400">Instant Live Sync</p>
        </div>
      </div>

      {/* ── SEARCH & FILTERS ── */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search section name, headline, ID, or copy..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1 rounded-lg transition-all ${
                filterStatus === 'all' ? 'bg-white dark:bg-slate-900 shadow-xs text-slate-900 dark:text-white' : 'text-slate-500'
              }`}
            >
              All Status
            </button>
            <button
              onClick={() => setFilterStatus('enabled')}
              className={`px-3 py-1 rounded-lg transition-all ${
                filterStatus === 'enabled' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-500'
              }`}
            >
              Live ({enabledCount})
            </button>
            <button
              onClick={() => setFilterStatus('disabled')}
              className={`px-3 py-1 rounded-lg transition-all ${
                filterStatus === 'disabled' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-500'
              }`}
            >
              Hidden ({disabledCount})
            </button>
          </div>
        </div>
      </div>

      {/* ── SECTIONS LIST GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSections.map((sec, idx) => (
          <div
            key={sec.id}
            className={`bg-white dark:bg-slate-900 rounded-3xl p-5 border transition-all flex flex-col justify-between space-y-4 shadow-2xs ${
              sec.enabled
                ? 'border-slate-200 dark:border-slate-800'
                : 'border-dashed border-amber-300 dark:border-amber-900/60 bg-amber-50/20 dark:bg-amber-950/10'
            }`}
          >
            <div className="space-y-3">
              {/* Top Row: Index Badge, ID, and Enable/Disable Switch */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-black text-slate-700 dark:text-slate-300">
                    {sec.order || idx + 1}
                  </span>
                  <span className="font-mono text-[10px] font-bold text-slate-400">
                    #{sec.id}
                  </span>
                  {sec.badge_text && (
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 rounded-full border border-purple-200 dark:border-purple-800">
                      {sec.badge_text}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggle(sec)}
                    className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-1.5 transition-all active:scale-95 ${
                      sec.enabled
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {sec.enabled ? (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Visible (Live)</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Hidden (Disabled)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Section Details */}
              <div>
                <h3 className="font-black text-base text-slate-900 dark:text-white leading-snug">
                  {sec.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {sec.description}
                </p>
              </div>

              {/* Current Live Headline & Subtitle Snippet */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1 text-xs">
                <p className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                  Title: <span className="font-normal text-slate-600 dark:text-slate-300">{sec.title}</span>
                </p>
                {sec.subtitle && (
                  <p className="text-slate-500 line-clamp-2 text-[11px]">
                    Subtitle: {sec.subtitle}
                  </p>
                )}
                {sec.cta_text && (
                  <p className="text-[11px] text-slate-400">
                    CTA: <strong className="text-slate-700 dark:text-slate-300">{sec.cta_text}</strong> ({sec.cta_link})
                  </p>
                )}
                {sec.items && sec.items.length > 0 && (
                  <p className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold">
                    Contains {sec.items.length} customizable metric/feature cards
                  </p>
                )}
              </div>
            </div>

            {/* Actions Bar */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">
                {sec.updated_at ? `Updated: ${new Date(sec.updated_at).toLocaleDateString()}` : 'Factory Default'}
              </span>

              <button
                onClick={() => handleOpenEdit(sec)}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-2xs active:scale-95"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Section Data</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── MODAL: EDIT SECTION DATA ── */}
      {modalOpen && editingSection && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in-50">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden my-auto">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-950">
              <div>
                <span className="text-[10px] font-black uppercase text-purple-600 font-mono">
                  #{editingSection.id}
                </span>
                <h3 className="font-black text-base text-slate-900 dark:text-white">
                  Edit {editingSection.name}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveModal} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              
              {/* Visibility Status Toggle */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <p className="font-black text-slate-900 dark:text-white">Section Visibility on Website</p>
                  <p className="text-[11px] text-slate-500">Enable or disable this section from appearing on the public homepage</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormEnabled(!formEnabled)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                    formEnabled ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                  }`}
                >
                  {formEnabled ? 'Visible (Active)' : 'Hidden (Disabled)'}
                </button>
              </div>

              {/* Badge Text */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Upper Badge / Label (Optional)
                </label>
                <input
                  type="text"
                  value={formBadgeText}
                  onChange={(e) => setFormBadgeText(e.target.value)}
                  placeholder="e.g. OUR IMPACT, WHY CSEEL, LIVE CONCLAVE"
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 font-bold"
                />
              </div>

              {/* Section Headline */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Main Headline / Section Title *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Explore Science Through Interactive Experiments"
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 font-black text-slate-900 dark:text-white"
                />
              </div>

              {/* Section Subtitle / Copy */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Subtitle / Descriptive Copy
                </label>
                <textarea
                  rows={3}
                  value={formSubtitle}
                  onChange={(e) => setFormSubtitle(e.target.value)}
                  placeholder="Descriptive text explaining the section..."
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 leading-relaxed"
                />
              </div>

              {/* CTA Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Primary Button Text</label>
                  <input
                    type="text"
                    value={formCtaText}
                    onChange={(e) => setFormCtaText(e.target.value)}
                    placeholder="e.g. Explore Experiments"
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Primary Destination Link</label>
                  <input
                    type="text"
                    value={formCtaLink}
                    onChange={(e) => setFormCtaLink(e.target.value)}
                    placeholder="e.g. /simulations"
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 font-mono"
                  />
                </div>
              </div>

              {/* Secondary CTA */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Secondary Button Text (Optional)</label>
                  <input
                    type="text"
                    value={formSecondaryCtaText}
                    onChange={(e) => setFormSecondaryCtaText(e.target.value)}
                    placeholder="e.g. Request Institutional Access"
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Secondary Destination Link</label>
                  <input
                    type="text"
                    value={formSecondaryCtaLink}
                    onChange={(e) => setFormSecondaryCtaLink(e.target.value)}
                    placeholder="e.g. /for-institutions"
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 font-mono"
                  />
                </div>
              </div>

              {/* Section Sub-items (If Impact Metrics or Features) */}
              {formItems.length > 0 && (
                <div className="space-y-3 pt-2">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block">
                    Section Sub-Cards & Metric Values ({formItems.length})
                  </label>
                  <div className="space-y-2">
                    {formItems.map((item, i) => (
                      <div key={item.id || i} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {item.value !== undefined ? (
                          <>
                            <div>
                              <span className="text-[10px] font-bold text-slate-400">Metric Value</span>
                              <input
                                type="text"
                                value={item.value}
                                onChange={(e) => {
                                  const updated = [...formItems];
                                  updated[i].value = e.target.value;
                                  setFormItems(updated);
                                }}
                                className="w-full p-1.5 border rounded-lg bg-white dark:bg-slate-900 font-black text-primary text-sm"
                              />
                            </div>
                            <div>
                              <span className="text-[10px] font-bold text-slate-400">Metric Label</span>
                              <input
                                type="text"
                                value={item.label}
                                onChange={(e) => {
                                  const updated = [...formItems];
                                  updated[i].label = e.target.value;
                                  setFormItems(updated);
                                }}
                                className="w-full p-1.5 border rounded-lg bg-white dark:bg-slate-900 font-bold"
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="sm:col-span-2">
                              <span className="text-[10px] font-bold text-slate-400">Card Title</span>
                              <input
                                type="text"
                                value={item.title || ''}
                                onChange={(e) => {
                                  const updated = [...formItems];
                                  updated[i].title = e.target.value;
                                  setFormItems(updated);
                                }}
                                className="w-full p-1.5 border rounded-lg bg-white dark:bg-slate-900 font-bold"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <span className="text-[10px] font-bold text-slate-400">Card Description</span>
                              <input
                                type="text"
                                value={item.description || ''}
                                onChange={(e) => {
                                  const updated = [...formItems];
                                  updated[i].description = e.target.value;
                                  setFormItems(updated);
                                }}
                                className="w-full p-1.5 border rounded-lg bg-white dark:bg-slate-900 text-xs"
                              />
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-black rounded-xl shadow-md flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes to Homepage</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomepageCmsAdminModule;
