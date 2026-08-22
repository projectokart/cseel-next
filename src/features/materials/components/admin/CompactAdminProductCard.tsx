'use client';

import React, { useState } from 'react';
import { MaterialProduct } from '../../types/materialTypes';
import {
  Edit2, Trash2, ExternalLink, Copy, Check,
  ChevronLeft, ChevronRight, Star, AlertTriangle, CheckCircle2,
  PackageCheck, Eye
} from 'lucide-react';
import Image from 'next/image';

interface CompactAdminProductCardProps {
  product: MaterialProduct;
  onEdit: (product: MaterialProduct) => void;
  onDelete: (product: MaterialProduct) => void;
  onDuplicate: (product: MaterialProduct) => void;
}

export default function CompactAdminProductCard({
  product,
  onEdit,
  onDelete,
  onDuplicate,
}: CompactAdminProductCardProps) {
  const images = (product.gallery && product.gallery.length > 0) ? product.gallery : [product.image_url];
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  const nextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImgIdx((prev) => (prev + 1) % images.length);
  };

  const prevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImgIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  const isLowStock = product.current_stock > 0 && product.current_stock <= 10;
  const isOutOfStock = product.current_stock <= 0;

  return (
    <div className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-400 dark:hover:border-teal-500 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between select-none">
      
      {/* ── TOP: Multi-Image Showcase (Google Shopping style) ── */}
      <div className="relative w-full h-44 bg-slate-50 dark:bg-slate-950 overflow-hidden">
        <img
          src={images[activeImgIdx] || product.image_url}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop';
          }}
        />

        {/* Category & Tag Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          <span className="px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-wider">
            {product.category}
          </span>
          {product.tag && (
            <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white text-[9px] font-bold shadow-xs">
              {product.tag}
            </span>
          )}
        </div>

        {/* Stock Status Indicator */}
        <div className="absolute top-2 right-2 z-10">
          {isOutOfStock ? (
            <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-black border border-red-200 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black border border-amber-200 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Only {product.current_stock} Left
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> {product.current_stock} in stock
            </span>
          )}
        </div>

        {/* Image Slider Controls (if multiple images) */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevImg}
              className="absolute left-1 top-1/2 -translate-y-1/2 p-1 rounded-full bg-white/80 dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-xs"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={nextImg}
              className="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded-full bg-white/80 dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-xs"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-1.5 inset-x-0 flex justify-center gap-1 z-10">
              {images.map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    i === activeImgIdx ? 'bg-white w-3 shadow-xs' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── MIDDLE: Product Details ── */}
      <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1">
            <span>SKU: {product.sku || 'CSE-001'}</span>
            <div className="flex items-center gap-0.5 text-amber-500 font-bold">
              <Star className="w-3 h-3 fill-amber-400" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-slate-400">({product.reviews})</span>
            </div>
          </div>

          <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug">
            {product.name}
          </h3>

          <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Pricing */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-black text-slate-900 dark:text-white">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.original_price > product.price && (
              <span className="text-[11px] text-slate-400 line-through">
                ₹{product.original_price.toLocaleString('en-IN')}
              </span>
            )}
          </div>
          {product.discountPercentage && product.discountPercentage > 0 && (
            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              {product.discountPercentage}% OFF
            </span>
          )}
        </div>
      </div>

      {/* ── BOTTOM: Admin Action Buttons ── */}
      <div className="bg-slate-50 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800 p-2 flex items-center justify-between gap-1 text-xs">
        <a
          href={`/materials/${product.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
          title="View Public Store Page"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onDuplicate(product)}
            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="Duplicate Product"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onEdit(product)}
            className="px-2.5 py-1 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-lg shadow-2xs transition-all flex items-center gap-1"
            title="Edit Product"
          >
            <Edit2 className="w-3 h-3" />
            <span>Edit</span>
          </button>
          <button
            type="button"
            onClick={() => onDelete(product)}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Product"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
}
