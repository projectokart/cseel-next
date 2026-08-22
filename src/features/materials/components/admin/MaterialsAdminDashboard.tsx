'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { MaterialProduct, MaterialCategory, MaterialCategoryKey, MaterialFilterState } from '../../types/materialTypes';
import { materialsApi } from '../../api/materialsApiClient';
import CompactAdminProductCard from './CompactAdminProductCard';
import MaterialFormModal from './MaterialFormModal';
import MaterialImportModal from './MaterialImportModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import {
  Package, Plus, Search, Filter, Download, Upload,
  RefreshCw, CheckCircle2, AlertTriangle, X, SlidersHorizontal,
  ChevronDown, Layers, Star, ArrowUpDown, Sparkles,
  LayoutGrid, Grid2X2, Grid3X3, List, Table as TableIcon,
  ArrowLeft, Settings, LogOut, Edit2, Trash2, Copy, Eye, ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import AdminSettingsModal from '@/features/admin/components/AdminSettingsModal';
import { useAdminAuth } from '@/features/admin/contexts/AdminAuthContext';

interface MaterialsAdminDashboardProps {
  onAuditLog?: (action: string, module: string, details: string) => void;
}

export default function MaterialsAdminDashboard({ onAuditLog }: MaterialsAdminDashboardProps) {
  const { logout } = useAdminAuth();
  
  // Data States
  const [products, setProducts] = useState<MaterialProduct[]>([]);
  const [categories, setCategories] = useState<MaterialCategory[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Layout View Mode
  const [viewMode, setViewMode] = useState<'grid-3' | 'grid-2' | 'grid-4' | 'list' | 'table'>('grid-3');
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<MaterialCategoryKey[]>([]);
  const [stockStatus, setStockStatus] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'rating' | 'newest'>('featured');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Modal States
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<MaterialProduct | null>(null);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<MaterialProduct | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch from API
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const filter: Partial<MaterialFilterState> = {
        searchQuery,
        selectedCategories,
        stockStatus,
        sortBy,
        minPrice: minPrice > 0 ? minPrice : undefined,
        maxPrice: maxPrice < 5000 ? maxPrice : undefined,
      };
      const result = await materialsApi.fetchMaterials(filter);
      setProducts(result.items);
      setTotalCount(result.total);
      setCategories(result.categories);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load catalog');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedCategories, stockStatus, sortBy, minPrice, maxPrice]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Toggle category
  const toggleCategory = (catKey: MaterialCategoryKey) => {
    setSelectedCategories((prev) =>
      prev.includes(catKey) ? prev.filter((k) => k !== catKey) : [...prev, catKey]
    );
  };

  // Reset filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setStockStatus('all');
    setSortBy('featured');
    setMinPrice(0);
    setMaxPrice(5000);
  };

  // CRUD Handlers
  const handleSaveProduct = async (data: Partial<MaterialProduct>) => {
    if (editProduct) {
      await materialsApi.updateProduct(editProduct.id, data);
      onAuditLog?.('UPDATED_MATERIAL', 'inventory_materials', `Updated item ${data.name}`);
    } else {
      await materialsApi.createProduct(data);
      onAuditLog?.('CREATED_MATERIAL', 'inventory_materials', `Added new lab item ${data.name}`);
    }
    setFormModalOpen(false);
    setEditProduct(null);
    loadData();
  };

  const handleDuplicateProduct = async (product: MaterialProduct) => {
    const copyData = {
      ...product,
      name: `${product.name} (Copy)`,
      sku: `CSE-${Date.now().toString().slice(-6)}`,
    };
    await materialsApi.createProduct(copyData);
    onAuditLog?.('DUPLICATED_MATERIAL', 'inventory_materials', `Duplicated item ${product.name}`);
    loadData();
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      await materialsApi.deleteProduct(productToDelete.id);
      onAuditLog?.('DELETED_MATERIAL', 'inventory_materials', `Removed item ${productToDelete.name}`);
      setDeleteModalOpen(false);
      setProductToDelete(null);
      loadData();
    } catch (err: any) {
      alert('Delete failed: ' + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleImportItems = async (items: any[]) => {
    const count = await materialsApi.importProducts(items);
    onAuditLog?.('IMPORTED_MATERIALS', 'inventory_materials', `Bulk imported ${count} items from spreadsheet`);
    loadData();
    return count;
  };

  // Quick stats
  const totalInStock = products.filter((p) => p.current_stock > 10).length;
  const totalLowStock = products.filter((p) => p.current_stock > 0 && p.current_stock <= 10).length;
  const totalOutOfStock = products.filter((p) => p.current_stock <= 0).length;

  return (
    <div className="space-y-5 select-none">
      
      {/* ── HEADER ── */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 rounded-full text-xs font-black text-teal-700 dark:text-teal-300">
            <Package className="w-3.5 h-3.5" />
            <span>LAB MATERIALS & STEM HARDWARE KITS HUB</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Inventory & Supply Chain Governance
          </h2>
          <p className="text-xs text-slate-500 max-w-2xl">
            Complete management of school lab glassware, chemical reagents, ATL hardware kits, and instruments. Equipped with multi-image gallery, spreadsheet tools, and isolated API layer.
          </p>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-start md:justify-end">
          {/* Export CSV */}
          <a
            href={materialsApi.getExportUrl()}
            download
            data-skip-progress="true"
            className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
            title="Download CSV spreadsheet"
          >
            <Download className="w-3.5 h-3.5 text-teal-600" />
            <span className="hidden sm:inline">Export CSV</span>
          </a>

          {/* Import Spreadsheet */}
          <button
            type="button"
            onClick={() => setImportModalOpen(true)}
            className="px-3.5 py-2 bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 text-teal-800 dark:text-teal-300 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 border border-teal-200 dark:border-teal-800 shadow-2xs"
            title="Upload CSV / Excel"
          >
            <Upload className="w-3.5 h-3.5 text-teal-600" />
            <span className="hidden sm:inline">Import Excel</span>
          </button>

          {/* Add New Material */}
          <button
            type="button"
            onClick={() => {
              setEditProduct(null);
              setFormModalOpen(true);
            }}
            className="px-5 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-black text-xs rounded-2xl shadow-md transition-all flex items-center gap-2 active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lab Item</span>
          </button>
        </div>
      </div>

      {/* ── KPI METRICS CARDS ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400">Total Products</p>
            <p className="text-lg font-black text-slate-900 dark:text-white mt-0.5">{totalCount}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700">
            <Layers className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400">In Stock Ready</p>
            <p className="text-lg font-black text-emerald-600 mt-0.5">{totalInStock}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400">Low Stock Alert</p>
            <p className="text-lg font-black text-amber-600 mt-0.5">{totalLowStock}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400">Out of Stock</p>
            <p className="text-lg font-black text-rose-600 mt-0.5">{totalOutOfStock}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600">
            <X className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* ── MAIN WORKSPACE: Left Filter Sidebar + Right Google Shopping Cards ── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        
        {/* ── LEFT SIDEBAR FILTERS ── */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-5 sticky top-20">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="font-black text-xs uppercase text-slate-900 dark:text-white flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-teal-600" />
                <span>Filters & Categories</span>
              </span>
              {(selectedCategories.length > 0 || stockStatus !== 'all' || searchQuery) && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-[10px] font-bold text-teal-600 hover:text-teal-700"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Category Checkboxes with Item Count Badges */}
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Categories</p>
              <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
                {categories.map((cat) => {
                  const isChecked = selectedCategories.includes(cat.key);
                  return (
                    <label
                      key={cat.key}
                      className={`flex items-center justify-between p-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                        isChecked ? 'bg-teal-50 dark:bg-teal-950/50 text-teal-900 dark:text-teal-200 font-bold' : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleCategory(cat.key)}
                          className="w-3.5 h-3.5 rounded text-teal-600 accent-teal-600"
                        />
                        <span className="truncate">{cat.label}</span>
                      </div>
                      {cat.itemCount !== undefined && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
                          {cat.itemCount}
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Stock Status Radio Filters */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Stock Availability</p>
              <div className="space-y-1 text-xs">
                {[
                  { key: 'all', label: 'All Inventory' },
                  { key: 'in_stock', label: 'In Stock (>10)' },
                  { key: 'low_stock', label: 'Low Stock (1-10)' },
                  { key: 'out_of_stock', label: 'Out of Stock (0)' },
                ].map((s) => (
                  <label key={s.key} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer text-slate-700 dark:text-slate-300">
                    <input
                      type="radio"
                      name="stockStatus"
                      checked={stockStatus === s.key}
                      onChange={() => setStockStatus(s.key as any)}
                      className="text-teal-600 accent-teal-600"
                    />
                    <span>{s.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-400">
                <span>Max Price</span>
                <span className="text-slate-800 dark:text-slate-200 font-mono font-bold">₹{maxPrice}</span>
              </div>
              <input
                type="range"
                min="100"
                max="5000"
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
            </div>

          </div>
        </div>

        {/* ── RIGHT PRODUCT CARDS GRID ── */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Search, Sort & Counter Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 sm:p-4 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            
            {/* Search Bar */}
            <div className="relative flex-1 w-full">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search lab equipment by name, SKU, scientific title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:border-teal-500 focus:bg-white"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort & View Mode Switcher */}
            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-between sm:justify-end flex-wrap">
              
              {/* Layout Switcher Buttons */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setViewMode('grid-3')}
                  className={`p-1.5 rounded-lg text-xs transition-all ${viewMode === 'grid-3' ? 'bg-white dark:bg-slate-700 text-teal-600 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-900'}`}
                  title="3-Column Grid"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('grid-2')}
                  className={`p-1.5 rounded-lg text-xs transition-all ${viewMode === 'grid-2' ? 'bg-white dark:bg-slate-700 text-teal-600 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-900'}`}
                  title="2-Column Large Grid"
                >
                  <Grid2X2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('grid-4')}
                  className={`p-1.5 rounded-lg text-xs transition-all ${viewMode === 'grid-4' ? 'bg-white dark:bg-slate-700 text-teal-600 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-900'}`}
                  title="4-Column Compact Grid"
                >
                  <Grid3X3 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg text-xs transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-teal-600 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-900'}`}
                  title="Horizontal Detailed List"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded-lg text-xs transition-all ${viewMode === 'table' ? 'bg-white dark:bg-slate-700 text-teal-600 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-900'}`}
                  title="Spreadsheet Table View"
                >
                  <TableIcon className="w-3.5 h-3.5" />
                </button>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-xs outline-none text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                <option value="featured">Featured / Best Match</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
                <option value="newest">Newest Additions</option>
              </select>

              <button
                type="button"
                onClick={loadData}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                title="Refresh Catalog"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-teal-600' : ''}`} />
              </button>
            </div>

          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Product Cards Grid / List / Table Views */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 p-4 space-y-3 animate-pulse">
                  <div className="w-full h-40 bg-slate-100 dark:bg-slate-800 rounded-xl" />
                  <div className="h-4 bg-slate-100 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                  <div className="h-8 bg-slate-100 rounded" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
              <Package className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-black text-slate-800 dark:text-slate-200 text-base">No Lab Equipment Found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No items match your active filters or search query. Try clearing filters or add a new material.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="px-4 py-2 bg-teal-50 text-teal-700 font-bold text-xs rounded-xl hover:bg-teal-100 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : viewMode === 'table' ? (
            /* ── SPREADSHEET TABLE VIEW ── */
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 text-[10px] font-black uppercase text-slate-500 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="p-3">Product & SKU</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Stock Status</th>
                      <th className="p-3">Price & MOQ</th>
                      <th className="p-3">Rating</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <img src={p.image_url} alt={p.name} className="w-10 h-10 rounded-xl object-contain bg-slate-50 border shrink-0" />
                            <div className="min-w-0">
                              <p className="font-bold text-slate-900 dark:text-white truncate max-w-xs">{p.name}</p>
                              <p className="text-[10px] font-mono text-slate-400">{p.sku}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md text-[10px] font-bold">
                            {p.category}
                          </span>
                        </td>
                        <td className="p-3">
                          {p.current_stock > 10 ? (
                            <span className="text-emerald-700 font-bold text-[11px]">✓ {p.current_stock}</span>
                          ) : p.current_stock > 0 ? (
                            <span className="text-amber-600 font-bold text-[11px]">⚠️ {p.current_stock}</span>
                          ) : (
                            <span className="text-rose-600 font-bold text-[11px]">✕ Out of Stock</span>
                          )}
                        </td>
                        <td className="p-3">
                          <p className="font-bold text-slate-900 dark:text-white">₹{p.price}</p>
                          <p className="text-[10px] text-slate-400">MOQ: {p.min_order_qty || 1}</p>
                        </td>
                        <td className="p-3">
                          <span className="text-amber-500 font-bold flex items-center gap-0.5">★ {p.rating.toFixed(1)}</span>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                setEditProduct(p);
                                setFormModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDuplicateProduct(p)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                              title="Duplicate"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setProductToDelete(p);
                                setDeleteModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : viewMode === 'list' ? (
            /* ── DETAILED HORIZONTAL LIST VIEW ── */
            <div className="space-y-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs hover:border-teal-400 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start sm:items-center gap-4 min-w-0">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-16 h-16 rounded-xl object-contain bg-slate-50 dark:bg-slate-800 border shrink-0"
                    />
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 text-[10px] font-black uppercase">
                          {product.category}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">{product.sku}</span>
                      </div>
                      <h4 className="font-black text-sm text-slate-900 dark:text-white truncate max-w-md">
                        {product.name}
                      </h4>
                      <div className="flex items-center gap-4 text-[11px] text-slate-500 flex-wrap">
                        <span className="font-bold text-slate-900 dark:text-white">Price: ₹{product.price}</span>
                        <span>Stock: <strong className={product.current_stock > 10 ? 'text-emerald-600' : 'text-rose-600'}>{product.current_stock}</strong></span>
                        <span>Rating: ★ {product.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setEditProduct(product);
                        setFormModalOpen(true);
                      }}
                      className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDuplicateProduct(product)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-xl"
                      title="Duplicate"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setProductToDelete(product);
                        setDeleteModalOpen(true);
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* ── GRID VIEWS (grid-3, grid-2, grid-4) ── */
            <div className={
              viewMode === 'grid-2'
                ? 'grid grid-cols-1 sm:grid-cols-2 gap-4'
                : viewMode === 'grid-4'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3'
                : 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'
            }>
              {products.map((product) => (
                <CompactAdminProductCard
                  key={product.id}
                  product={product}
                  onEdit={(p) => {
                    setEditProduct(p);
                    setFormModalOpen(true);
                  }}
                  onDelete={(p) => {
                    setProductToDelete(p);
                    setDeleteModalOpen(true);
                  }}
                  onDuplicate={handleDuplicateProduct}
                />
              ))}
            </div>
          )}

        </div>

      </div>

      {/* ── MODALS ── */}
      <MaterialFormModal
        isOpen={formModalOpen}
        onClose={() => {
          setFormModalOpen(false);
          setEditProduct(null);
        }}
        onSave={handleSaveProduct}
        initialData={editProduct}
      />

      <MaterialImportModal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onImport={handleImportItems}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setProductToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        product={productToDelete}
        isDeleting={isDeleting}
      />

    </div>
  );
}
