'use client';

import React, { useState } from 'react';
import { MaterialProduct } from '../../types/materialTypes';
import {
  ShoppingBag, Star, Heart, Check, Eye,
  ChevronLeft, ChevronRight, Truck, CheckCircle2, AlertTriangle
} from 'lucide-react';
import Link from 'next/link';

interface MaterialCardProps {
  product: MaterialProduct;
  onAddToCart: (product: MaterialProduct) => void;
  onQuickView?: (product: MaterialProduct) => void;
}

export default function MaterialCard({
  product,
  onAddToCart,
  onQuickView,
}: MaterialCardProps) {
  const images = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image_url];
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [addedAnim, setAddedAnim] = useState(false);

  const nextImg = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImgIdx((prev) => (prev + 1) % images.length);
  };

  const prevImg = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImgIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart(product);
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1500);
  };

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 hover:border-teal-400 dark:hover:border-teal-500 overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between select-none">
      
      {/* ── TOP IMAGE CONTAINER ── */}
      <div className="relative w-full h-48 sm:h-52 bg-slate-50 dark:bg-slate-950 overflow-hidden">
        <Link href={`/materials/${product.slug}`} className="block w-full h-full">
          <img
            src={images[activeImgIdx] || product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop';
            }}
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          <span className="px-2.5 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-wider shadow-xs">
            {product.category}
          </span>
          {product.tag && (
            <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 text-white text-[9px] font-black shadow-xs">
              {product.tag}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md z-10 transition-transform active:scale-75 ${
            isLiked ? 'bg-rose-50 text-rose-600 shadow-xs' : 'bg-white/80 dark:bg-slate-900/80 text-slate-500 hover:text-rose-600'
          }`}
          title="Add to Wishlist"
        >
          <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-600' : ''}`} />
        </button>

        {/* Multi-Image Slider Controls */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevImg}
              className="absolute left-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-md z-10"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={nextImg}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-md z-10"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-2 inset-x-0 flex justify-center gap-1 z-10">
              {images.map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    i === activeImgIdx ? 'bg-white w-3 shadow-xs' : 'bg-white/60'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── MIDDLE DETAILS ── */}
      <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold mb-1">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>{product.rating.toFixed(1)}</span>
            <span className="text-slate-400 font-normal">({product.reviews} reviews)</span>
          </div>

          <Link href={`/materials/${product.slug}`}>
            <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100 line-clamp-2 hover:text-teal-600 transition-colors leading-snug">
              {product.name}
            </h3>
          </Link>

          <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Delivery badge */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.original_price > product.price && (
                <span className="text-xs text-slate-400 line-through">
                  ₹{product.original_price.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {product.discountPercentage && product.discountPercentage > 0 && (
              <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {product.discountPercentage}% OFF
              </span>
            )}
          </div>

          <p className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
            <Truck className="w-3 h-3 text-teal-600" />
            <span>Free Delivery by {product.delivery_days || 3} days</span>
          </p>
        </div>
      </div>

      {/* ── BOTTOM ACTIONS (Amazon / Flipkart Style) ── */}
      <div className="p-3 bg-slate-50/80 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800 flex gap-2">
        <button
          type="button"
          onClick={handleAddClick}
          className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs shadow-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 ${
            addedAnim
              ? 'bg-emerald-600 text-white'
              : 'bg-teal-600 hover:bg-teal-700 text-white'
          }`}
        >
          {addedAnim ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Added to Bag!</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </>
          )}
        </button>

        <Link
          href={`/materials/${product.slug}`}
          className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center shadow-2xs"
          title="Quick View Details"
        >
          <Eye className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
