'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Check, Heart, Plus, Atom } from 'lucide-react';
import { ApparatusItem } from '../types';
import { QuantityStepper } from '@/components/ui/QuantityStepper';

export interface MaterialCardProps {
  product: ApparatusItem;
  quantity: number;
  isWishlisted: boolean;
  onIncrement: () => void;
  onDecrement: () => void;
  onToggleWishlist: () => void;
}

export const MaterialCard: React.FC<MaterialCardProps> = ({
  product,
  quantity,
  isWishlisted,
  onIncrement,
  onDecrement,
  onToggleWishlist,
}) => {
  const isSelected = quantity > 0;
  const [imgSrc, setImgSrc] = useState<string>(product.image_url);
  const [imgFailed, setImgFailed] = useState<boolean>(false);

  useEffect(() => {
    setImgSrc(product.image_url);
    setImgFailed(false);
  }, [product.image_url]);

  const handleImageError = () => {
    if (product.cdn_image_url && imgSrc !== product.cdn_image_url) {
      setImgSrc(product.cdn_image_url);
    } else {
      setImgFailed(true);
    }
  };

  return (
    <div
      className={`bg-white rounded-2xl border transition-all duration-300 flex flex-col overflow-hidden group shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.08)] ${
        isSelected
          ? 'border-[#1a73e8] ring-1 ring-[#1a73e8]/30'
          : 'border-[#dadce0] hover:border-[#bdc1c6]'
      }`}
    >
      {/* Image Container (Google Shopping Style with Soft #f8f9fa background) */}
      <Link
        href={`/materials/${product.slug}`}
        className="relative aspect-square bg-[#f8f9fa] group-hover:bg-[#f1f3f4] rounded-xl m-2.5 overflow-hidden flex items-center justify-center p-3 transition-colors block"
      >
        {!imgFailed ? (
          <img
            src={imgSrc}
            alt={product.name}
            onError={handleImageError}
            loading="lazy"
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-3 bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-xl">
            <div className="w-12 h-12 rounded-2xl bg-white border border-[#006FCC]/20 shadow-2xs flex items-center justify-center text-[#006FCC] mb-2">
              <Atom className="w-6 h-6 text-[#006FCC]" />
            </div>
            <span className="text-[11px] font-bold text-[#003C6E] line-clamp-1">
              {product.name}
            </span>
            <span className="text-[10px] text-slate-400 font-mono mt-0.5">
              {product.sku}
            </span>
          </div>
        )}

        {/* Google Style Pill Badge on Bottom-Left */}
        <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/95 text-[#656773] shadow-xs border border-[#dadce0] flex items-center gap-1.5 backdrop-blur-xs font-['Google_Sans',Roboto,sans-serif]">
          <Atom className="w-3 h-3 text-[#1a73e8]" />
          <span className="font-mono">{product.sku}</span>
        </div>

        {/* Selected Indicator Badge - Top Left */}
        {isSelected && (
          <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#e8f0fe] text-[#1a73e8] border border-[#d2e3fc] shadow-xs flex items-center gap-1">
            <Check size={11} strokeWidth={2.8} />
            <span>{quantity} in List</span>
          </div>
        )}

        {/* Wishlist Button - Top Right */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleWishlist();
          }}
          className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
            isWishlisted
              ? 'bg-red-500 text-white'
              : 'bg-white/90 text-slate-400 hover:text-red-500 shadow-xs'
          }`}
          title="Save apparatus"
          aria-label="Save apparatus"
        >
          <Heart className="h-3.5 w-3.5" fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>
      </Link>

      {/* Card Content */}
      <div className="px-3.5 pb-3.5 pt-1 flex flex-col flex-1">
        <Link href={`/materials/${product.slug}`} className="block">
          <p className="text-[11px] font-medium text-[#1a73e8] tracking-wide truncate mb-1 font-['Google_Sans',Roboto,sans-serif]">
            {product.cbse_chapter}
          </p>
          <h3 className="text-[14px] font-semibold text-[#16171A] line-clamp-2 leading-snug group-hover:text-[#1a73e8] transition-colors mb-1.5 font-['Google_Sans',Roboto,sans-serif]">
            {product.name}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-[12px] text-[#656773] font-normal line-clamp-2 leading-relaxed mb-3 font-['Google_Sans',Roboto,sans-serif]">
          {product.description}
        </p>

        {/* Action Row */}
        <div className="mt-auto pt-2.5 border-t border-[#dadce0]/70 flex items-center gap-2">
          <Link
            href={`/materials/${product.slug}`}
            className="flex-1 py-1.5 bg-white hover:bg-[#f8fafd] border border-[#dadce0] hover:border-[#1a73e8]/40 text-[#1a73e8] text-[12px] font-medium rounded-full transition-colors text-center font-['Google_Sans',Roboto,sans-serif]"
          >
            Details &rarr;
          </Link>

          {quantity === 0 ? (
            <button
              type="button"
              onClick={onIncrement}
              className="flex-1 py-1.5 text-[12px] font-medium rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white active:scale-[0.98] transition-all flex items-center justify-center gap-1 shadow-xs h-[30px] font-['Google_Sans',Roboto,sans-serif]"
            >
              <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>Select</span>
            </button>
          ) : (
            <QuantityStepper
              value={quantity}
              onIncrement={onIncrement}
              onDecrement={onDecrement}
              size="sm"
              variant="google"
              className="flex-1 !rounded-full"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MaterialCard;
