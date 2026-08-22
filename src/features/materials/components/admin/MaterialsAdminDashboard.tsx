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
  ChevronDown, Layers, Star, ArrowUpDown, Sparkles
} from 'lucide-react';

interface MaterialsAdminDashboardProps {
  onAuditLog?: (action: string, module: string, details: string) => void;
}

export default function MaterialsAdminDashboard({ onAuditLog }: MaterialsAdminDashboardProps) {
  // Data States
  const [products, setProducts] = useState<MaterialProduct[]>([]);
  const [categories, setCategories] = useState<MaterialCategory[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

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

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-between sm:justify-end">
              <span className="text-[11px] text-slate-400 font-bold hidden sm:inline">Sort by:</span>
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

          {/* Product Cards Grid (Google Shopping Style Compact Cards) */}
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
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
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
