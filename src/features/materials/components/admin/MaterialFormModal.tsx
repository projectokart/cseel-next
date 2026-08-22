'use client';

import React, { useState, useRef } from 'react';
import { MaterialProduct, MaterialCategoryKey } from '../../types/materialTypes';
import { MATERIAL_CATEGORIES } from '../../db/seedData';
import {
  X, Plus, Trash2, Upload, Image as ImageIcon,
  Check, AlertTriangle, Sparkles, Layers, ShieldCheck, Tag, Globe, Lock
} from 'lucide-react';

interface MaterialFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Partial<MaterialProduct>) => Promise<void>;
  initialData?: MaterialProduct | null;
}

export default function MaterialFormModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: MaterialFormModalProps) {
  const isEdit = Boolean(initialData);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form States
  const [name, setName] = useState(initialData?.name || '');
  const [scientificName, setScientificName] = useState(initialData?.scientific_name || '');
  const [sku, setSku] = useState(initialData?.sku || `CSE-${Date.now().toString().slice(-6)}`);
  const [category, setCategory] = useState<MaterialCategoryKey>(initialData?.category || 'GLS');
  const [price, setPrice] = useState(initialData?.price || 199);
  const [originalPrice, setOriginalPrice] = useState(initialData?.original_price || 249);
  const [stock, setStock] = useState(initialData?.current_stock ?? initialData?.stock ?? 50);
  const [tag, setTag] = useState(initialData?.tag || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [specification, setSpecification] = useState(initialData?.specification || '');
  const [safety, setSafety] = useState(initialData?.safety || 'Standard educational lab safety rules apply.');
  const [warranty, setWarranty] = useState(initialData?.warranty || '1 Year Standard Warranty');
  const [deliveryDays, setDeliveryDays] = useState(initialData?.delivery_days || 3);
  
  // Gallery (Max 5 Images)
  const [gallery, setGallery] = useState<string[]>(
    initialData?.gallery && initialData.gallery.length > 0
      ? initialData.gallery
      : initialData?.image_url
      ? [initialData.image_url]
      : ['https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop']
  );
  const [newImageUrl, setNewImageUrl] = useState('');
  const [includesList, setIncludesList] = useState<string[]>(
    initialData?.includes || ['1x Main Equipment Unit', '1x User Guide & Safety Manual']
  );
  const [newIncludeItem, setNewIncludeItem] = useState('');
  const [isPublished, setIsPublished] = useState<boolean>(initialData ? (initialData.is_active !== false) : true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  // Add image from URL
  const handleAddImageUrl = () => {
    if (newImageUrl.trim() && gallery.length < 5) {
      setGallery([...gallery, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  // Add image from local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (gallery.length >= 5) {
      alert('Maximum 5 images allowed per product.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      if (dataUrl) {
        setGallery([...gallery, dataUrl]);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemoveImage = (idx: number) => {
    if (gallery.length <= 1) {
      alert('Product must have at least 1 image.');
      return;
    }
    const updated = [...gallery];
    updated.splice(idx, 1);
    setGallery(updated);
  };

  const handleSetPrimaryImage = (idx: number) => {
    if (idx === 0) return;
    const updated = [...gallery];
    const [selected] = updated.splice(idx, 1);
    updated.unshift(selected);
    setGallery(updated);
  };

  // Includes list handlers
  const handleAddIncludeItem = () => {
    if (newIncludeItem.trim()) {
      setIncludesList([...includesList, newIncludeItem.trim()]);
      setNewIncludeItem('');
    }
  };

  const handleRemoveIncludeItem = (idx: number) => {
    const updated = [...includesList];
    updated.splice(idx, 1);
    setIncludesList(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Product name is required');
      return;
    }
    if (gallery.length === 0) {
      setErrorMessage('At least 1 product image is required');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const discountPercentage = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
      await onSave({
        name: name.trim(),
        scientific_name: scientificName.trim(),
        sku: sku.trim(),
        category,
        price: Number(price),
        original_price: Number(originalPrice),
        discountPercentage,
        stock: Number(stock),
        current_stock: Number(stock),
        tag: tag.trim() || undefined,
        description: description.trim(),
        specification: specification.trim(),
        safety: safety.trim(),
        warranty: warranty.trim(),
        delivery_days: Number(deliveryDays),
        image_url: gallery[0],
        gallery,
        includes: includesList,
        is_active: isPublished,
      });
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in-50 duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden my-auto">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-950/50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-teal-100 dark:bg-teal-950/60 text-teal-700">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white">
                {isEdit ? 'Edit Lab Material / Kit' : 'Add New Lab Material & STEM Kit'}
              </h3>
              <p className="text-[11px] text-slate-500">
                Complete catalog entry with up to 5 product images, pricing, and safety specs
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-xs">
          
          {/* ── SECTION 1: Multi-Image Gallery Management (Max 5 Images) ── */}
          <div className="space-y-2 p-4 bg-slate-50/80 dark:bg-slate-950/50 rounded-2xl border border-slate-200/80">
            <div className="flex items-center justify-between">
              <label className="font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-teal-600" />
                <span>Product Images ({gallery.length}/5)</span>
              </label>
              <span className="text-[10px] text-slate-400 font-bold">
                First image is Primary (Thumbnail)
              </span>
            </div>

            {/* Gallery Previews Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
              {gallery.map((img, idx) => (
                <div
                  key={idx}
                  className={`relative group rounded-xl overflow-hidden border-2 h-24 bg-slate-100 dark:bg-slate-800 ${
                    idx === 0 ? 'border-teal-500 shadow-sm' : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <img src={img} alt={`Product preview ${idx}`} className="w-full h-full object-cover" />
                  {idx === 0 && (
                    <span className="absolute top-1 left-1 bg-teal-600 text-white text-[8px] font-black uppercase px-1.5 py-0.5 rounded">
                      Primary
                    </span>
                  )}

                  {/* Actions overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                    {idx !== 0 && (
                      <button
                        type="button"
                        onClick={() => handleSetPrimaryImage(idx)}
                        className="p-1 rounded-md bg-white text-teal-700 text-[9px] font-bold"
                        title="Make Primary"
                      >
                        Set Main
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="p-1 rounded-md bg-red-600 text-white hover:bg-red-700"
                      title="Remove image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Add Image Card (if < 5) */}
              {gallery.length < 5 && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-teal-400 hover:bg-teal-50/40 dark:hover:bg-teal-950/20 h-24 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all text-slate-500"
                >
                  <Upload className="w-4 h-4 text-teal-600" />
                  <span className="text-[10px] font-bold">Upload Image</span>
                </div>
              )}
            </div>

            {/* URL Input */}
            {gallery.length < 5 && (
              <div className="flex gap-2 pt-1">
                <input
                  type="url"
                  placeholder="Or paste external image URL (https://...)"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddImageUrl(); } }}
                  className="flex-1 px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-900"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold rounded-xl text-xs"
                >
                  Add URL
                </button>
              </div>
            )}

            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
          </div>

          {/* ── SECTION 2: Basic Info ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Product Title *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Borosilicate Glass Beaker 250ml"
                className="w-full px-3 py-2 border rounded-xl font-bold text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 focus:bg-white"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as MaterialCategoryKey)}
                className="w-full px-3 py-2 border rounded-xl font-bold text-xs bg-slate-50 dark:bg-slate-800"
              >
                {MATERIAL_CATEGORIES.map((cat) => (
                  <option key={cat.key} value={cat.key}>
                    {cat.label} ({cat.key})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: SKU, Scientific Name, Tag */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">SKU Code</label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g. CSE-GLS-001"
                className="w-full px-3 py-2 border rounded-xl font-mono text-xs bg-slate-50 dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Scientific / Technical Name</label>
              <input
                type="text"
                value={scientificName}
                onChange={(e) => setScientificName(e.target.value)}
                placeholder="e.g. Low Form Griffin Beaker 3.3"
                className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50 dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Promotional Tag</label>
              <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="e.g. Bestseller, 20% OFF"
                className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50 dark:bg-slate-800"
              />
            </div>
          </div>

          {/* ── SECTION 3: Pricing & Inventory ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Selling Price (₹) *</label>
              <input
                type="number"
                required
                min="1"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-xl font-bold text-xs bg-slate-50 dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Original Price (₹)</label>
              <input
                type="number"
                min="1"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50 dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Current Stock *</label>
              <input
                type="number"
                required
                min="0"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-xl font-bold text-xs bg-slate-50 dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Est. Delivery (Days)</label>
              <input
                type="number"
                min="1"
                max="30"
                value={deliveryDays}
                onChange={(e) => setDeliveryDays(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50 dark:bg-slate-800"
              />
            </div>
          </div>

          {/* ── SECTION 4: Descriptions & Specifications ── */}
          <div className="space-y-3">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Product Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Comprehensive technical details and educational utility..."
                className="w-full p-3 border rounded-xl text-xs leading-relaxed bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Technical Specifications</label>
                <textarea
                  rows={2}
                  value={specification}
                  onChange={(e) => setSpecification(e.target.value)}
                  placeholder="Material: Borosilicate 3.3, Thermal resistance..."
                  className="w-full p-2.5 border rounded-xl text-xs bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Safety & Handling Guidelines</label>
                <textarea
                  rows={2}
                  value={safety}
                  onChange={(e) => setSafety(e.target.value)}
                  placeholder="Wear safety goggles, avoid sudden temperature shock..."
                  className="w-full p-2.5 border rounded-xl text-xs bg-slate-50 dark:bg-slate-800"
                />
              </div>
            </div>
          </div>

          {/* ── SECTION 5: Package Includes List ── */}
          <div className="space-y-2">
            <label className="font-bold text-slate-700 dark:text-slate-300 block">Package Includes / Kit Contents</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newIncludeItem}
                onChange={(e) => setNewIncludeItem(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddIncludeItem(); } }}
                placeholder="e.g. 1x 250ml Beaker with white graduations"
                className="flex-1 px-3 py-1.5 border rounded-xl text-xs bg-slate-50 dark:bg-slate-800"
              />
              <button
                type="button"
                onClick={handleAddIncludeItem}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 font-bold rounded-xl text-xs text-slate-700 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {includesList.map((item, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300 text-[11px] font-medium flex items-center gap-1.5"
                >
                  <span>{item}</span>
                  <button type="button" onClick={() => handleRemoveIncludeItem(idx)} className="text-slate-400 hover:text-red-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* ── SECTION 6: Visibility & Publishing Status ── */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                {isPublished ? <Globe className="w-4 h-4 text-emerald-600" /> : <Lock className="w-4 h-4 text-amber-600" />}
                <span>Visibility & Catalog Publishing Status</span>
              </p>
              <p className="text-[11px] text-slate-500">
                {isPublished ? 'Live & Public — visible to students, schools, and website visitors.' : 'Draft & Private — saved in database but hidden from public catalog.'}
              </p>
            </div>

            <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setIsPublished(true)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isPublished ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 dark:text-slate-300'
                }`}
              >
                🌐 Published (Public)
              </button>
              <button
                type="button"
                onClick={() => setIsPublished(false)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  !isPublished ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 dark:text-slate-300'
                }`}
              >
                🔒 Draft (Private)
              </button>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-2xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-black text-xs rounded-2xl shadow-md transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
