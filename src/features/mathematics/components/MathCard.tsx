'use client';

import React from 'react';
import { Clock, GraduationCap, Heart, Share2, Plus, Minus, Calculator } from 'lucide-react';
import { MathExperiment } from '../types';
import { M3IconButton, M3AssistChip } from '@/components/google-ui';

export interface MathCardProps {
  experiment: MathExperiment;
  quantity?: number;
  isLiked?: boolean;
  onSelect?: () => void;
  onUpdateQty?: (delta: number) => void;
  onToggleLike?: () => void;
  onShare?: () => void;
  onClick?: () => void;
}

export const MathCard: React.FC<MathCardProps> = ({
  experiment,
  quantity = 0,
  isLiked = false,
  onSelect,
  onUpdateQty,
  onToggleLike,
  onShare,
  onClick,
}) => {
  const isSelected = quantity > 0;
  const imageSrc = experiment.thumbnail_url || '/images/categories/mathematics.jpg';

  return (
    <div
      onClick={onClick}
      className={`relative flex flex-col justify-between border rounded-2xl bg-white w-full select-none overflow-hidden cursor-pointer group box-border transition-all duration-300 shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 ${
        isSelected
          ? 'border-[#8b5cf6] ring-1 ring-[#8b5cf6]/30 shadow-[0_4px_16px_rgba(139,92,246,0.15)]'
          : 'border-[#dadce0] hover:border-[#bdc1c6]'
      }`}
    >
      {/* Top Section */}
      <div className="flex flex-row items-stretch gap-3 p-3.5">
        {/* Left Thumbnail */}
        <div className="w-28 sm:w-36 flex-shrink-0 overflow-hidden rounded-xl bg-[#f8f9fa] border border-[#dadce0] relative self-stretch min-h-[96px]">
          <img
            src={imageSrc}
            alt={experiment.title}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              const target = e.currentTarget;
              const fallback = '/images/categories/mathematics.jpg';
              if (target.src !== fallback) target.src = fallback;
            }}
          />

          <div className="absolute top-2 left-2 z-10">
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-900/75 text-white backdrop-blur-xs border border-white/20 flex items-center gap-1 shadow-xs">
              <Clock size={9} />
              {experiment.duration}
            </span>
          </div>
        </div>

        {/* Right Details */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <div className="space-y-1">
            {/* Category */}
            <div className="flex items-center gap-1 text-[11px] font-medium text-[#8b5cf6] tracking-wide truncate font-['Google_Sans',Roboto,sans-serif]">
              <Calculator size={12} className="shrink-0" />
              <span className="truncate">{experiment.category}</span>
            </div>

            {/* Title */}
            <h3 className="text-[14px] sm:text-[15px] font-semibold text-[#16171A] group-hover:text-[#8b5cf6] leading-snug transition-colors line-clamp-2 font-['Google_Sans',Roboto,sans-serif]">
              {experiment.title}
            </h3>

            {/* Formula Chip if available */}
            {experiment.formula && (
              <span className="inline-block text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 truncate max-w-full">
                {experiment.formula}
              </span>
            )}

            {/* Subtitle / Desc */}
            <p className="text-[12px] text-[#656773] font-normal leading-relaxed line-clamp-2 font-['Google_Sans',Roboto,sans-serif]">
              {experiment.subtitle || experiment.description}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between gap-2 px-3.5 py-2.5 border-t border-[#dadce0] bg-[#f8fafd] rounded-b-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center min-w-0">
          <M3AssistChip
            label={experiment.gradeLevel}
            icon={<GraduationCap className="w-3.5 h-3.5" />}
          />
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {onToggleLike && (
            <M3IconButton
              variant={isLiked ? 'tonal' : 'outlined'}
              size="sm"
              selected={isLiked}
              ariaLabel="Like experiment"
              icon={<Heart size={14} className={isLiked ? 'fill-rose-500 text-rose-500' : ''} />}
              onClick={(e) => {
                e.stopPropagation();
                onToggleLike();
              }}
            />
          )}

          {onShare && (
            <M3IconButton
              variant="outlined"
              size="sm"
              ariaLabel="Share experiment"
              icon={<Share2 size={14} />}
              onClick={(e) => {
                e.stopPropagation();
                onShare();
              }}
            />
          )}

          {isSelected ? (
            <div className="flex items-center gap-1.5 bg-[#f5f3ff] rounded-full p-1 border border-[#8b5cf6]/30 shadow-xs">
              <button
                type="button"
                aria-label="Decrease quantity"
                className="w-7 h-7 rounded-full bg-white text-[#8b5cf6] hover:bg-[#ede9fe] border border-[#ddd6fe] flex items-center justify-center transition-all cursor-pointer shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateQty?.(-1);
                }}
              >
                <Minus size={13} strokeWidth={2.5} />
              </button>

              <span className="min-w-[20px] text-center text-xs font-bold text-[#8b5cf6] select-none font-['Google_Sans',Roboto,sans-serif]">
                {quantity}
              </span>

              <button
                type="button"
                aria-label="Increase quantity"
                className="w-7 h-7 rounded-full bg-[#8b5cf6] text-white hover:bg-[#7c3aed] flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-2xs"
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateQty?.(1);
                }}
              >
                <Plus size={13} strokeWidth={2.5} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              aria-label="Add to selection"
              className="h-8 px-3 rounded-full bg-white hover:bg-[#f8fafd] text-[#8b5cf6] hover:text-[#7c3aed] border border-[#dadce0] hover:border-[#8b5cf6]/40 text-xs font-medium inline-flex items-center gap-1 transition-all duration-200 cursor-pointer shadow-xs active:scale-95 font-['Google_Sans',Roboto,sans-serif]"
              onClick={(e) => {
                e.stopPropagation();
                onSelect?.();
              }}
            >
              <Plus size={14} strokeWidth={2.5} />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MathCard;
