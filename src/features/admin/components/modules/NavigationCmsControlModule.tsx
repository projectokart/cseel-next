'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Globe, Eye, EyeOff, ShieldAlert, CheckCircle2,
  RefreshCw, Power, Sparkles, AlertTriangle, Layers,
  ExternalLink, ArrowRight, ToggleLeft, ToggleRight,
  SlidersHorizontal, Check, Info, Lock, Plus, Trash2,
  Edit2, ChevronDown, ChevronRight, ArrowUp, ArrowDown,
  FilePlus, FileText, Construction, CornerDownRight,
  ExternalLink as LinkIcon, Search, Save
} from 'lucide-react';
import { useNavVisibility } from '@/contexts/NavigationContext';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { NavStage1Category, NavStage2Column, NavStage3Item } from '@/lib/navigationData';

interface CustomPageRecord {
  slug: string;
  title: string;
  subtitle?: string;
  status: 'working' | 'published' | 'draft';
  customMessage?: string;
  category?: string;
  updatedAt?: string;
}

export const NavigationCmsControlModule: React.FC = () => {
  const { 
    navCategories, 
    saveAllNav, 
    resetToDefault,
    addCategory,
    updateCategory,
    deleteCategory,
    toggleCategory,
    addColumn,
    updateColumn,
    deleteColumn,
    addItem,
    updateItem,
    deleteItem
  } = useNavVisibility();

  const { addAuditLog } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<'nav-tree' | 'custom-pages'>('nav-tree');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Expanded tree states
  const [expandedCat, setExpandedCat] = useState<string | null>(navCategories[0]?.id || null);
  const [expandedCol, setExpandedCol] = useState<string | null>(null);

  // Custom pages list
  const [customPages, setCustomPages] = useState<CustomPageRecord[]>([]);
  const [loadingPages, setLoadingPages] = useState(false);

  // Modals / Forms
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [catForm, setCatForm] = useState({ label: '', to: '', hasDropdown: true });

  const [colModalOpen, setColModalOpen] = useState(false);
  const [colParentCatId, setColParentCatId] = useState<string | null>(null);
  const [editingColId, setEditingColId] = useState<string | null>(null);
  const [colForm, setColForm] = useState({ categoryTitle: '', to: '' });

  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [itemParentCatId, setItemParentCatId] = useState<string | null>(null);
  const [itemParentColId, setItemParentColId] = useState<string | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [itemForm, setItemForm] = useState({ label: '', to: '', desc: '', badge: '' });

  // Custom Page Creator Form
  const [newPageForm, setNewPageForm] = useState({
    title: '',
    slug: '',
    subtitle: '',
    customMessage: 'We are currently working on this experiential science page. Practical manuals and equipment checklists will be live shortly.',
    status: 'working' as 'working' | 'published',
    autoLinkToNav: false,
    selectedCatId: '',
    selectedColId: ''
  });

  const showToast = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  // Fetch custom pages
  const fetchCustomPages = async () => {
    try {
      setLoadingPages(true);
      const res = await fetch('/api/admin/custom-pages');
      if (res.ok) {
        const json = await res.json();
        if (json.pages) setCustomPages(json.pages);
      }
    } catch (err) {
      console.error('Failed to load custom pages:', err);
    } finally {
      setLoadingPages(false);
    }
  };

  useEffect(() => {
    fetchCustomPages();
  }, []);

  // ── STAGE 1: CATEGORY ACTIONS ──
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catForm.label.trim()) return;

    if (editingCatId) {
      updateCategory(editingCatId, {
        label: catForm.label,
        to: catForm.to || undefined,
        hasDropdown: catForm.hasDropdown,
      });
      showToast(`Updated Category: "${catForm.label}"`);
    } else {
      addCategory({
        label: catForm.label,
        to: catForm.to || `/page/${catForm.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        hasDropdown: catForm.hasDropdown,
      });
      showToast(`Created New Stage-1 Category: "${catForm.label}"`);
    }
    setCatModalOpen(false);
    setEditingCatId(null);
    setCatForm({ label: '', to: '', hasDropdown: true });
  };

  const moveCategory = (idx: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= navCategories.length) return;
    const copy = [...navCategories];
    const [moved] = copy.splice(idx, 1);
    copy.splice(newIdx, 0, moved);
    saveAllNav(copy);
    showToast(`Reordered Navigation Categories`);
  };

  // ── STAGE 2: COLUMN ACTIONS ──
  const handleSaveColumn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!colParentCatId || !colForm.categoryTitle.trim()) return;

    if (editingColId) {
      updateColumn(colParentCatId, editingColId, {
        categoryTitle: colForm.categoryTitle,
        to: colForm.to || undefined,
      });
      showToast(`Updated Section Column: "${colForm.categoryTitle}"`);
    } else {
      addColumn(colParentCatId, {
        categoryTitle: colForm.categoryTitle,
        to: colForm.to || undefined,
      });
      showToast(`Added Section Column to Category`);
    }
    setColModalOpen(false);
    setEditingColId(null);
    setColForm({ categoryTitle: '', to: '' });
  };

  // ── STAGE 3: ITEM ACTIONS ──
  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemParentCatId || !itemParentColId || !itemForm.label.trim()) return;

    const targetUrl = itemForm.to.trim() || `/page/${itemForm.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

    if (editingItemId) {
      updateItem(itemParentCatId, itemParentColId, editingItemId, {
        label: itemForm.label,
        to: targetUrl,
        desc: itemForm.desc,
        badge: itemForm.badge || undefined,
      });
      showToast(`Updated Menu Link: "${itemForm.label}"`);
    } else {
      addItem(itemParentCatId, itemParentColId, {
        label: itemForm.label,
        to: targetUrl,
        desc: itemForm.desc,
        badge: itemForm.badge || undefined,
      });
      showToast(`Added Menu Link to Column`);
    }
    setItemModalOpen(false);
    setEditingItemId(null);
    setItemForm({ label: '', to: '', desc: '', badge: '' });
  };

  // ── CUSTOM PAGE CREATION ──
  const handleCreateCustomPage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageForm.title.trim()) return;

    const cleanSlug = (newPageForm.slug.trim() || newPageForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'))
      .replace(/^\/+|\/+$/g, '')
      .replace(/^(page|p)\//, '');

    const finalPath = `/page/${cleanSlug}`;

    try {
      const res = await fetch('/api/admin/custom-pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newPageForm.title,
          slug: cleanSlug,
          subtitle: newPageForm.subtitle,
          customMessage: newPageForm.customMessage,
          status: newPageForm.status,
        }),
      });

      if (res.ok) {
        showToast(`Created Page: "${newPageForm.title}" (${finalPath})`);
        fetchCustomPages();

        // Optionally link to navigation automatically
        if (newPageForm.autoLinkToNav && newPageForm.selectedCatId && newPageForm.selectedColId) {
          addItem(newPageForm.selectedCatId, newPageForm.selectedColId, {
            label: newPageForm.title,
            to: finalPath,
            desc: newPageForm.subtitle || 'Experiential practical module in progress.',
            badge: 'New',
          });
          showToast(`Page created & linked to Navigation!`);
        }

        setNewPageForm({
          title: '',
          slug: '',
          subtitle: '',
          customMessage: 'We are currently working on this experiential science page. Practical manuals and equipment checklists will be live shortly.',
          status: 'working',
          autoLinkToNav: false,
          selectedCatId: '',
          selectedColId: ''
        });
      }
    } catch (err) {
      console.error('Failed to create custom page:', err);
    }
  };

  const handleDeleteCustomPage = async (slug: string) => {
    if (!confirm(`Are you sure you want to delete custom page: "${slug}"?`)) return;
    try {
      const res = await fetch(`/api/admin/custom-pages?slug=${encodeURIComponent(slug)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        showToast(`Deleted page: ${slug}`);
        fetchCustomPages();
      }
    } catch (err) {
      console.error('Failed to delete custom page:', err);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
      
      {/* ── TOP HEADER BANNER ── */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EDF5FA] border border-[#006FCC]/20 rounded-full text-xs font-bold text-[#006FCC] mb-2">
            <Globe className="w-3.5 h-3.5" />
            <span>FULL FREEDOM 3-STAGE NAVIGATION & PAGE ENGINE</span>
          </div>
          <h2 className="text-2xl font-black text-[#023858] tracking-tight">
            Navigation Bar, Submenus & Dynamic Page Creator
          </h2>
          <p className="text-xs sm:text-sm text-[#5F6265] mt-1 max-w-3xl">
            Full CRUD control over all 3 stages: <strong>Stage 1: Main Category</strong> &gt; <strong>Stage 2: Section Columns</strong> &gt; <strong>Stage 3: Menu Links & Sub-items</strong>. Create custom pages with automatic "Working on this page" templates that always keep TopBar, Navbar, and Footer intact.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => {
              if (confirm('Reset navigation to factory defaults? All manual edits will be replaced.')) {
                resetToDefault();
                showToast('Reset navigation to factory defaults.');
              }
            }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
            title="Reset to factory defaults"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingCatId(null);
              setCatForm({ label: '', to: '', hasDropdown: true });
              setCatModalOpen(true);
            }}
            className="px-4 py-2 bg-[#006FCC] hover:bg-[#005499] text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Main Category</span>
          </button>
        </div>
      </div>

      {/* Toast Alert */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* ── TABS SELECTOR ── */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('nav-tree')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'nav-tree'
              ? 'bg-[#006FCC] text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>3-Stage Navigation Tree Editor ({navCategories.length} Categories)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('custom-pages')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'custom-pages'
              ? 'bg-[#006FCC] text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Construction className="w-4 h-4" />
          <span>Custom Pages &amp; "Working on this page" Engine ({customPages.length} Pages)</span>
        </button>
      </div>

      {/* ════════════════════════════════════════════════════════
          TAB 1: 3-STAGE NAVIGATION TREE (STAGE 1 > STAGE 2 > STAGE 3)
         ════════════════════════════════════════════════════════ */}
      {activeTab === 'nav-tree' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[#5F6265] px-2 font-medium">
            <span>Click any Stage 1 Category below to expand its Section Columns (Stage 2) and Menu Links (Stage 3).</span>
            <span>Real-time Sync Active</span>
          </div>

          <div className="space-y-3">
            {navCategories.map((cat, catIdx) => {
              const isCatExpanded = expandedCat === cat.id;

              return (
                <div 
                  key={cat.id}
                  className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                    isCatExpanded ? 'border-[#006FCC]/50 shadow-md ring-2 ring-[#006FCC]/10' : 'border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  {/* ── STAGE 1 ROW (Main Navbar Item) ── */}
                  <div className="p-4 sm:p-5 flex items-center justify-between gap-3 bg-white">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* Expand / Collapse toggle */}
                      <button
                        type="button"
                        onClick={() => setExpandedCat(isCatExpanded ? null : cat.id)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-[#023858] transition-colors"
                      >
                        <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isCatExpanded ? 'rotate-180 text-[#006FCC]' : ''}`} />
                      </button>

                      {/* Category Badge & Title */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-50 text-[#006FCC]">
                            Stage 1
                          </span>
                          <h3 className="font-extrabold text-base sm:text-lg text-[#023858] truncate">
                            {cat.label}
                          </h3>
                          {!cat.enabled && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-600 border border-rose-200">
                              Disabled
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-xs text-[#5F6265] mt-0.5">
                          <span>Link: <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">{cat.to || '(Dropdown Container)'}</code></span>
                          <span>•</span>
                          <span>Columns: {cat.columns?.length || 0}</span>
                          <span>•</span>
                          <span>Total Items: {cat.columns?.reduce((acc, c) => acc + (c.items?.length || 0), 0) || 0}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions on Category */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Reorder Up/Down */}
                      <button
                        type="button"
                        onClick={() => moveCategory(catIdx, 'up')}
                        disabled={catIdx === 0}
                        className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                        title="Move Up"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveCategory(catIdx, 'down')}
                        disabled={catIdx === navCategories.length - 1}
                        className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                        title="Move Down"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>

                      {/* Enable/Disable Toggle */}
                      <button
                        type="button"
                        onClick={() => toggleCategory(cat.id, !cat.enabled)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          cat.enabled ? 'text-emerald-600 hover:bg-emerald-50' : 'text-slate-400 hover:bg-slate-100'
                        }`}
                        title={cat.enabled ? 'Disable Category' : 'Enable Category'}
                      >
                        <Power className="w-4 h-4" />
                      </button>

                      {/* Edit Category */}
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCatId(cat.id);
                          setCatForm({ label: cat.label, to: cat.to || '', hasDropdown: cat.hasDropdown });
                          setCatModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-[#006FCC]"
                        title="Edit Category"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      {/* Delete Category */}
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Delete entire category "${cat.label}" and all its submenus?`)) {
                            deleteCategory(cat.id);
                            showToast(`Deleted Category: ${cat.label}`);
                          }
                        }}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"
                        title="Delete Category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {/* Add Column Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setColParentCatId(cat.id);
                          setEditingColId(null);
                          setColForm({ categoryTitle: '', to: '' });
                          setColModalOpen(true);
                        }}
                        className="ml-2 px-3 py-1.5 rounded-lg bg-[#EDF5FA] hover:bg-[#DDECF6] text-[#006FCC] font-bold text-xs flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Add Section</span>
                      </button>
                    </div>
                  </div>

                  {/* ── STAGE 2 & STAGE 3 NESTED BODY ── */}
                  {isCatExpanded && (
                    <div className="border-t border-slate-100 bg-[#F8FAFD] p-4 sm:p-6 space-y-5 animate-in fade-in duration-150">
                      {(!cat.columns || cat.columns.length === 0) ? (
                        <div className="text-center py-6 bg-white rounded-xl border border-dashed border-slate-300">
                          <p className="text-xs text-slate-500 font-medium">No sections or sub-columns in this category yet.</p>
                          <button
                            type="button"
                            onClick={() => {
                              setColParentCatId(cat.id);
                              setEditingColId(null);
                              setColForm({ categoryTitle: '', to: '' });
                              setColModalOpen(true);
                            }}
                            className="mt-2 text-xs font-bold text-[#006FCC] hover:underline"
                          >
                            + Add First Section Column (Stage 2)
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                          {cat.columns.map((col, colIdx) => (
                            <div 
                              key={col.id}
                              className="bg-white rounded-xl border border-[#E8E9E9] p-4 flex flex-col justify-between shadow-2xs"
                            >
                              <div>
                                {/* Stage 2 Column Header */}
                                <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                                      Stage 2 Column
                                    </span>
                                    <h4 className="font-bold text-sm text-[#023858]">
                                      {col.categoryTitle}
                                    </h4>
                                  </div>

                                  <div className="flex items-center gap-1">
                                    {/* Edit Column */}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setColParentCatId(cat.id);
                                        setEditingColId(col.id);
                                        setColForm({ categoryTitle: col.categoryTitle, to: col.to || '' });
                                        setColModalOpen(true);
                                      }}
                                      className="p-1 text-slate-500 hover:text-[#006FCC]"
                                      title="Edit Section Column"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>

                                    {/* Delete Column */}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (confirm(`Delete section column "${col.categoryTitle}"?`)) {
                                          deleteColumn(cat.id, col.id);
                                          showToast(`Deleted Section: ${col.categoryTitle}`);
                                        }
                                      }}
                                      className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                                      title="Delete Column"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>

                                    {/* Add Item into this Column */}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setItemParentCatId(cat.id);
                                        setItemParentColId(col.id);
                                        setEditingItemId(null);
                                        setItemForm({ label: '', to: '', desc: '', badge: '' });
                                        setItemModalOpen(true);
                                      }}
                                      className="ml-1 px-2 py-1 bg-[#EDF5FA] hover:bg-[#DDECF6] text-[#006FCC] rounded text-[11px] font-bold flex items-center gap-1"
                                      title="Add Menu Item to this Column"
                                    >
                                      <Plus className="w-3 h-3" />
                                      <span>+ Item</span>
                                    </button>
                                  </div>
                                </div>

                                {/* Stage 3 Items List */}
                                <div className="space-y-2">
                                  {(!col.items || col.items.length === 0) ? (
                                    <p className="text-xs text-slate-400 py-3 text-center">No menu links in this column.</p>
                                  ) : (
                                    col.items.map((it, itIdx) => (
                                      <div 
                                        key={it.id}
                                        className="p-2.5 rounded-lg bg-slate-50/70 hover:bg-slate-50 border border-slate-100 flex items-start justify-between gap-2 transition-all"
                                      >
                                        <div className="min-w-0 flex-1">
                                          <div className="flex items-center gap-2">
                                            <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-sky-100/70 text-sky-800">
                                              Stage 3
                                            </span>
                                            <span className="text-xs font-bold text-[#023858] truncate">
                                              {it.label}
                                            </span>
                                            {it.badge && (
                                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#EDF5FA] text-[#006FCC]">
                                                {it.badge}
                                              </span>
                                            )}
                                          </div>
                                          
                                          {it.desc && (
                                            <p className="text-[11px] text-[#5F6265] line-clamp-1 mt-0.5">
                                              {it.desc}
                                            </p>
                                          )}

                                          <div className="flex items-center gap-1.5 mt-1">
                                            <span className="text-[10px] text-slate-400">Path:</span>
                                            <Link 
                                              href={it.to} 
                                              target="_blank"
                                              className="text-[10.5px] font-semibold text-[#006FCC] hover:underline flex items-center gap-0.5"
                                            >
                                              <span>{it.to}</span>
                                              <LinkIcon className="w-2.5 h-2.5" />
                                            </Link>
                                          </div>

                                          {/* Sub-items (if any) */}
                                          {it.subItems && it.subItems.length > 0 && (
                                            <div className="mt-1.5 pl-2 border-l border-[#006FCC]/40 space-y-0.5">
                                              {it.subItems.map((s, sIdx) => (
                                                <div key={sIdx} className="text-[10px] text-slate-600 flex items-center gap-1">
                                                  <span>• {s.label}</span>
                                                  <span className="text-slate-400">({s.to})</span>
                                                </div>
                                              ))}
                                            </div>
                                          )}
                                        </div>

                                        {/* Actions on Item */}
                                        <div className="flex items-center gap-1 shrink-0">
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setItemParentCatId(cat.id);
                                              setItemParentColId(col.id);
                                              setEditingItemId(it.id);
                                              setItemForm({
                                                label: it.label,
                                                to: it.to,
                                                desc: it.desc || '',
                                                badge: it.badge || '',
                                              });
                                              setItemModalOpen(true);
                                            }}
                                            className="p-1 text-slate-500 hover:text-[#006FCC]"
                                            title="Edit Item"
                                          >
                                            <Edit2 className="w-3 h-3" />
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              if (confirm(`Delete menu item "${it.label}"?`)) {
                                                deleteItem(cat.id, col.id, it.id);
                                                showToast(`Deleted Item: ${it.label}`);
                                              }
                                            }}
                                            className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                                            title="Delete Item"
                                          >
                                            <Trash2 className="w-3 h-3" />
                                          </button>
                                        </div>
                                      </div>
                                    ))
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
          TAB 2: CUSTOM PAGES & "WORKING ON THIS PAGE" ENGINE
         ════════════════════════════════════════════════════════ */}
      {activeTab === 'custom-pages' && (
        <div className="space-y-8">
          
          {/* Create New Custom Page Form */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <Construction className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-[#023858]">
                  Create New Page with "Working on this page" Notice
                </h3>
                <p className="text-xs text-[#5F6265]">
                  Add any dynamic page. It automatically loads inside the public layout with <strong>TopBar, Navbar, and Footer always active</strong>.
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateCustomPage} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Page Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newPageForm.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      const autoSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                      setNewPageForm(prev => ({
                        ...prev,
                        title,
                        slug: prev.slug === '' || prev.slug === autoSlug.slice(0, -1) ? autoSlug : prev.slug
                      }));
                    }}
                    placeholder="e.g. Astronomy & Space Laboratory"
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-[#006FCC]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    URL Path / Slug *
                  </label>
                  <div className="flex items-center">
                    <span className="px-3 py-2 bg-slate-100 border border-r-0 border-slate-300 rounded-l-xl text-xs text-slate-500 font-mono">
                      /page/
                    </span>
                    <input
                      type="text"
                      required
                      value={newPageForm.slug}
                      onChange={(e) => setNewPageForm({ ...newPageForm, slug: e.target.value })}
                      placeholder="astronomy-space-lab"
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-r-xl font-mono focus:outline-none focus:border-[#006FCC]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Subtitle / Brief Description
                </label>
                <input
                  type="text"
                  value={newPageForm.subtitle}
                  onChange={(e) => setNewPageForm({ ...newPageForm, subtitle: e.target.value })}
                  placeholder="Hands-on telescopes, celestial mechanics and astrophysics models."
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-[#006FCC]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Notice Message (Shown in "Working on this page" card)
                </label>
                <textarea
                  rows={2}
                  value={newPageForm.customMessage}
                  onChange={(e) => setNewPageForm({ ...newPageForm, customMessage: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-[#006FCC]"
                />
              </div>

              {/* Checkbox to auto-link to navigation */}
              <div className="pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#023858]">
                  <input
                    type="checkbox"
                    checked={newPageForm.autoLinkToNav}
                    onChange={(e) => setNewPageForm({ ...newPageForm, autoLinkToNav: e.target.checked })}
                    className="rounded text-[#006FCC] focus:ring-[#006FCC]"
                  />
                  <span>Automatically add this new page into a Navigation Dropdown</span>
                </label>

                {newPageForm.autoLinkToNav && (
                  <div className="grid grid-cols-2 gap-3 mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Target Category</label>
                      <select
                        value={newPageForm.selectedCatId}
                        onChange={(e) => setNewPageForm({ ...newPageForm, selectedCatId: e.target.value, selectedColId: '' })}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                      >
                        <option value="">Select Category...</option>
                        {navCategories.map(c => (
                          <option key={c.id} value={c.id}>{c.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Target Section Column</label>
                      <select
                        value={newPageForm.selectedColId}
                        onChange={(e) => setNewPageForm({ ...newPageForm, selectedColId: e.target.value })}
                        disabled={!newPageForm.selectedCatId}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white disabled:opacity-50"
                      >
                        <option value="">Select Column...</option>
                        {navCategories.find(c => c.id === newPageForm.selectedCatId)?.columns?.map(col => (
                          <option key={col.id} value={col.id}>{col.categoryTitle}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#006FCC] hover:bg-[#005499] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Page Now</span>
                </button>
              </div>
            </form>
          </div>

          {/* List of Existing Custom Pages */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-[#023858] px-1">
              Active Custom Pages Directory ({customPages.length} Pages)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {customPages.map((page) => (
                <div 
                  key={page.slug}
                  className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between shadow-2xs hover:shadow-sm transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                        <Construction className="w-3 h-3" />
                        <span>Working On This Page</span>
                      </span>

                      <button
                        type="button"
                        onClick={() => handleDeleteCustomPage(page.slug)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded"
                        title="Delete Page"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h4 className="font-bold text-base text-[#023858] mb-1">
                      {page.title}
                    </h4>

                    {page.subtitle && (
                      <p className="text-xs text-[#5F6265] mb-2">
                        {page.subtitle}
                      </p>
                    )}

                    <div className="p-2.5 bg-slate-50 rounded-lg text-[11px] text-slate-600 italic border border-slate-100 mb-4">
                      "{page.customMessage}"
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-500 text-[11px]">
                      /page/{page.slug}
                    </span>

                    <Link
                      href={`/page/${page.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 font-bold text-[#006FCC] hover:underline"
                    >
                      <span>View Live Page</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ════════════════════════════════════════════════════════
          MODAL 1: ADD / EDIT STAGE 1 CATEGORY
         ════════════════════════════════════════════════════════ */}
      {catModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-[#023858] mb-1">
              {editingCatId ? 'Edit Stage 1 Category' : 'Add New Stage 1 Category'}
            </h3>
            <p className="text-xs text-[#5F6265] mb-4">
              Top-level category displayed directly on the primary navbar.
            </p>

            <form onSubmit={handleSaveCategory} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category Label *</label>
                <input
                  type="text"
                  required
                  value={catForm.label}
                  onChange={(e) => setCatForm({ ...catForm, label: e.target.value })}
                  placeholder="e.g. Turnkey Setups"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-[#006FCC]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Direct Page Route (Optional)</label>
                <input
                  type="text"
                  value={catForm.to}
                  onChange={(e) => setCatForm({ ...catForm, to: e.target.value })}
                  placeholder="e.g. /composite-lab or /page/my-page"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-[#006FCC]"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#023858]">
                  <input
                    type="checkbox"
                    checked={catForm.hasDropdown}
                    onChange={(e) => setCatForm({ ...catForm, hasDropdown: e.target.checked })}
                    className="rounded text-[#006FCC]"
                  />
                  <span>Has Dropdown Mega Menu (Stage 2 &amp; 3 Columns)</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCatModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#006FCC] hover:bg-[#005499] rounded-xl shadow-xs"
                >
                  {editingCatId ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
          MODAL 2: ADD / EDIT STAGE 2 COLUMN
         ════════════════════════════════════════════════════════ */}
      {colModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-[#023858] mb-1">
              {editingColId ? 'Edit Section Column' : 'Add Section Column (Stage 2)'}
            </h3>
            <p className="text-xs text-[#5F6265] mb-4">
              Groups items into categorized columns inside the mega menu and mobile view.
            </p>

            <form onSubmit={handleSaveColumn} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Section Title *</label>
                <input
                  type="text"
                  required
                  value={colForm.categoryTitle}
                  onChange={(e) => setColForm({ ...colForm, categoryTitle: e.target.value })}
                  placeholder="e.g. Science Labs or Tinkering Hubs"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-[#006FCC]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Optional Section Header Route</label>
                <input
                  type="text"
                  value={colForm.to}
                  onChange={(e) => setColForm({ ...colForm, to: e.target.value })}
                  placeholder="e.g. /domain/science"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-[#006FCC]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setColModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#006FCC] hover:bg-[#005499] rounded-xl shadow-xs"
                >
                  {editingColId ? 'Save Changes' : 'Add Section Column'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
          MODAL 3: ADD / EDIT STAGE 3 ITEM
         ════════════════════════════════════════════════════════ */}
      {itemModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-[#023858] mb-1">
              {editingItemId ? 'Edit Menu Link (Stage 3)' : 'Add Menu Link (Stage 3)'}
            </h3>
            <p className="text-xs text-[#5F6265] mb-4">
              Direct practical module link inside the column.
            </p>

            <form onSubmit={handleSaveItem} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Link Title *</label>
                <input
                  type="text"
                  required
                  value={itemForm.label}
                  onChange={(e) => setItemForm({ ...itemForm, label: e.target.value })}
                  placeholder="e.g. Astronomy Space Lab"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-[#006FCC]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Destination Route / URL *</label>
                <input
                  type="text"
                  value={itemForm.to}
                  onChange={(e) => setItemForm({ ...itemForm, to: e.target.value })}
                  placeholder="e.g. /subject/physics or /page/astronomy-lab"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono focus:outline-none focus:border-[#006FCC]"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Tip: Use <code>/page/your-slug</code> to link to an automatic "Working on this page" template.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <input
                  type="text"
                  value={itemForm.desc}
                  onChange={(e) => setItemForm({ ...itemForm, desc: e.target.value })}
                  placeholder="Brief 1-line practical description"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-[#006FCC]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Badge (Optional)</label>
                <input
                  type="text"
                  value={itemForm.badge}
                  onChange={(e) => setItemForm({ ...itemForm, badge: e.target.value })}
                  placeholder="e.g. New, Grant ₹20L, CBSE Norms"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-[#006FCC]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setItemModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#006FCC] hover:bg-[#005499] rounded-xl shadow-xs"
                >
                  {editingItemId ? 'Save Changes' : 'Add Menu Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default NavigationCmsControlModule;
