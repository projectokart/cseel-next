'use client';

import React, { useState, useEffect } from 'react';
import { HomepageSectionConfig, HomepageSectionId } from '@/features/homepage-cms/types';
import { 
  X, Save, Eye, EyeOff, Sparkles, Image as ImageIcon, 
  Link as LinkIcon, Type, Layers, CheckCircle2, ChevronRight 
} from 'lucide-react';

interface SectionEditorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  section: HomepageSectionConfig | null;
  onUpdateDraft: (id: HomepageSectionId, changes: Partial<HomepageSectionConfig>) => void;
  onSaveDirectly?: (id: HomepageSectionId, changes: Partial<HomepageSectionConfig>) => Promise<void>;
}

// Preset popular images across CSEEL for quick 1-click selection
const PRESET_IMAGES = [
  { label: 'Chemistry Lab', url: '/images/categories/chemistry.webp' },
  { label: 'Physics Lab', url: '/images/categories/physics.webp' },
  { label: 'Biology Lab', url: '/images/categories/biology.webp' },
  { label: 'Mathematics Lab', url: '/images/categories/mathematics.webp' },
  { label: 'Engineering & Tech', url: '/images/categories/engineering.webp' },
  { label: 'Art & Design', url: '/images/categories/art.webp' },
  { label: 'School Network Hero', url: '/images/schools/st-columbas-school-delhi.webp' },
  { label: 'Teacher Portrait', url: '/images/teachers/teacher-1.webp' },
];

export const SectionEditorDrawer: React.FC<SectionEditorDrawerProps> = ({
  isOpen,
  onClose,
  section,
  onUpdateDraft,
  onSaveDirectly,
}) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [badgeText, setBadgeText] = useState('');
  const [ctaText, setCtaText] = useState('');
  const [ctaLink, setCtaLink] = useState('');
  const [secondaryCtaText, setSecondaryCtaText] = useState('');
  const [secondaryCtaLink, setSecondaryCtaLink] = useState('');
  const [image, setImage] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  const [isSavedFeedback, setIsSavedFeedback] = useState(false);

  useEffect(() => {
    if (section) {
      setTitle(section.title || '');
      setSubtitle(section.subtitle || '');
      setBadgeText(section.badge_text || '');
      setCtaText(section.cta_text || '');
      setCtaLink(section.cta_link || '');
      setSecondaryCtaText(section.secondary_cta_text || '');
      setSecondaryCtaLink(section.secondary_cta_link || '');
      setImage(section.image || '');
      setEnabled(section.enabled !== false);
      setItems(section.items ? JSON.parse(JSON.stringify(section.items)) : []);
      setIsSavedFeedback(false);
    }
  }, [section]);

  if (!isOpen || !section) return null;

  const handleApplyChanges = () => {
    const changes: Partial<HomepageSectionConfig> = {
      title,
      subtitle: subtitle || undefined,
      badge_text: badgeText || undefined,
      cta_text: ctaText || undefined,
      cta_link: ctaLink || undefined,
      secondary_cta_text: secondaryCtaText || undefined,
      secondary_cta_link: secondaryCtaLink || undefined,
      image: image || undefined,
      enabled,
      items: items.length > 0 ? items : undefined,
    };

    onUpdateDraft(section.id, changes);
    setIsSavedFeedback(true);
    setTimeout(() => {
      setIsSavedFeedback(false);
      onClose();
    }, 400);
  };

  const handleItemChange = (index: number, field: string, val: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: val };
    setItems(newItems);
  };

  return (
    <div className="fixed inset-0 z-[99998] flex justify-end bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col animate-in slide-in-from-right duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#005689] text-white flex items-center justify-center font-bold text-base shadow-sm">
              ✏️
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Edit Section: {section.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                ID: <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded text-[11px] font-mono">{section.id}</code>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Public Visibility Toggle */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {enabled ? (
                  <Eye className="w-4 h-4 text-emerald-600" />
                ) : (
                  <EyeOff className="w-4 h-4 text-amber-600" />
                )}
                Public Visibility
              </label>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {enabled ? 'Currently VISIBLE to all public website visitors' : 'HIDDEN from public visitors (Only admins see outline)'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setEnabled(!enabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                enabled ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Section Eyebrow / Badge */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Eyebrow / Badge Text
            </label>
            <input
              type="text"
              value={badgeText}
              onChange={(e) => setBadgeText(e.target.value)}
              placeholder="e.g. CORE STEM FOUNDATION"
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005689]"
            />
          </div>

          {/* Section Main Title */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Main Section Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter section title..."
              className="w-full px-3.5 py-2 text-sm font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005689]"
            />
          </div>

          {/* Subtitle / Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Subtitle / Description Copy
            </label>
            <textarea
              rows={3}
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Enter descriptive copy..."
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005689] resize-y"
            />
          </div>

          {/* Image URL & Quick Picker */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-[#005689]" />
                Section Image / Background URL
              </span>
            </label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="/images/categories/chemistry.webp"
              className="w-full px-3.5 py-2 text-sm font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005689]"
            />
            {/* Quick Picker Pills */}
            <div className="space-y-1 pt-1">
              <p className="text-[11px] text-slate-400 font-medium">Quick Pick Local Images:</p>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_IMAGES.map((p) => (
                  <button
                    key={p.url}
                    type="button"
                    onClick={() => setImage(p.url)}
                    className={`px-2 py-1 text-[11px] font-semibold rounded-md border transition cursor-pointer ${
                      image === p.url
                        ? 'border-[#005689] bg-[#005689] text-white'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-[#005689]'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            {/* Preview image */}
            {image && (
              <div className="mt-2 relative rounded-lg overflow-hidden border border-slate-200 max-h-32 bg-slate-100 flex items-center justify-center">
                <img
                  src={image}
                  alt="Section preview"
                  className="max-h-32 w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Action CTAs (Primary & Secondary) */}
          <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5" />
              Call To Action Buttons
            </h4>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Primary CTA Text</label>
                <input
                  type="text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  placeholder="e.g. Our Plans"
                  className="w-full px-3 py-1.5 text-xs rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Primary CTA URL</label>
                <input
                  type="text"
                  value={ctaLink}
                  onChange={(e) => setCtaLink(e.target.value)}
                  placeholder="e.g. /compare-plans"
                  className="w-full px-3 py-1.5 text-xs rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Secondary CTA Text</label>
                <input
                  type="text"
                  value={secondaryCtaText}
                  onChange={(e) => setSecondaryCtaText(e.target.value)}
                  placeholder="e.g. Live Tour"
                  className="w-full px-3 py-1.5 text-xs rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Secondary CTA URL</label>
                <input
                  type="text"
                  value={secondaryCtaLink}
                  onChange={(e) => setSecondaryCtaLink(e.target.value)}
                  placeholder="e.g. /virtual-lab-tour"
                  className="w-full px-3 py-1.5 text-xs rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Sub-items if section has items */}
          {items.length > 0 && (
            <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                Section Cards / Items ({items.length})
              </h4>
              <div className="space-y-3">
                {items.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                      <span>Card #{idx + 1} {item.id && `(${item.id})`}</span>
                    </div>
                    {item.value !== undefined && (
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-500">Value (e.g. 20,000+)</label>
                        <input
                          type="text"
                          value={item.value || ''}
                          onChange={(e) => handleItemChange(idx, 'value', e.target.value)}
                          className="w-full px-2.5 py-1 text-xs rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                        />
                      </div>
                    )}
                    {item.label !== undefined && (
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-500">Label</label>
                        <input
                          type="text"
                          value={item.label || ''}
                          onChange={(e) => handleItemChange(idx, 'label', e.target.value)}
                          className="w-full px-2.5 py-1 text-xs rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                        />
                      </div>
                    )}
                    {item.title !== undefined && (
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-500">Title</label>
                        <input
                          type="text"
                          value={item.title || ''}
                          onChange={(e) => handleItemChange(idx, 'title', e.target.value)}
                          className="w-full px-2.5 py-1 text-xs rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                        />
                      </div>
                    )}
                    {item.description !== undefined && (
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-500">Description</label>
                        <textarea
                          rows={2}
                          value={item.description || ''}
                          onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                          className="w-full px-2.5 py-1 text-xs rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApplyChanges}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#005689] hover:bg-[#003c6e] text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" />
            Apply & Live Preview
          </button>
        </div>
      </div>
    </div>
  );
};
