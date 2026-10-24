'use client';

import React from 'react';
import Link from 'next/link';
import { Clock, GraduationCap, Heart, Share2, Plus, Minus, Atom, FlaskConical, Dna } from 'lucide-react';
import { ScienceExperiment } from '../types';
import { M3IconButton, M3AssistChip } from '@/components/google-ui';

export interface ScienceCardProps {
  experiment: ScienceExperiment;
  quantity?: number;
  isLiked?: boolean;
  onSelect?: () => void;
  onUpdateQty?: (delta: number) => void;
  onToggleLike?: () => void;
  onShare?: () => void;
  onClick?: () => void;
}

const SUBJECT_ICONS = {
  physics: Atom,
  chemistry: FlaskConical,
  biology: Dna,
};

export const ScienceCard: React.FC<ScienceCardProps> = ({
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
  const SubjectIcon = SUBJECT_ICONS[experiment.subject] || Atom;

  const imageSrc =
    experiment.thumbnail_url ||
    experiment.image ||
    `/images/categories/${experiment.subject}.jpg`;

  return (
    <div
      onClick={onClick}
      className={`relative flex flex-col justify-between border rounded-2xl bg-white w-full select-none overflow-hidden cursor-pointer group box-border transition-all duration-300 shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 ${
        isSelected
          ? 'border-[#1a73e8] ring-1 ring-[#1a73e8]/30 shadow-[0_4px_16px_rgba(26,115,232,0.15)]'
          : 'border-[#dadce0] hover:border-[#bdc1c6]'
      }`}
    >
      {/* Top Section: Apparatus/Experiment Photo + Details Side-by-Side */}
      <div className="flex flex-row items-stretch gap-3 p-3.5">
        {/* Left Thumbnail Container */}
        <div className="w-28 sm:w-36 flex-shrink-0 overflow-hidden rounded-xl bg-[#f8f9fa] border border-[#dadce0] relative self-stretch min-h-[96px]">
          <img
            src={imageSrc}
            alt={experiment.title}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              const target = e.currentTarget;
              const fallback = `/images/categories/${experiment.subject}.jpg`;
              if (target.src !== fallback) {
                target.src = fallback;
              }
            }}
          />

          {/* Duration Badge */}
          <div className="absolute top-2 left-2 z-10">
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-900/75 text-white backdrop-blur-xs border border-white/20 flex items-center gap-1 shadow-xs">
              <Clock size={9} />
              {experiment.duration}
            </span>
          </div>
        </div>

        {/* Right Content Section */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <div className="space-y-1">
            {/* Subject & Category Label */}
            <div className="flex items-center gap-1 text-[11px] font-medium text-[#1a73e8] tracking-wide truncate font-['Google_Sans',Roboto,sans-serif]">
              <SubjectIcon size={12} className="shrink-0" />
              <span className="uppercase text-[10px] font-bold tracking-wider">{experiment.subject}</span>
              <span className="text-slate-300">&bull;</span>
              <span className="truncate">{experiment.category}</span>
            </div>

            {/* Primary Hero: Activity Title */}
            <h3 className="text-[14px] sm:text-[15px] font-semibold text-[#16171A] group-hover:text-[#1a73e8] leading-snug transition-colors line-clamp-2 font-['Google_Sans',Roboto,sans-serif]">
              {experiment.title}
            </h3>

            {/* Subdued Description */}
            <p className="text-[12px] text-[#656773] font-normal leading-relaxed line-clamp-2 font-['Google_Sans',Roboto,sans-serif]">
              {experiment.subtitle || experiment.description}
            </p>

            {/* Concept Tags */}
            {experiment.tags && experiment.tags.length > 0 && (
              <div className="flex items-center gap-1 flex-wrap pt-0.5">
                {experiment.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center text-[10px] font-medium text-[#656773] bg-[#f8f9fa] px-2 py-0.5 rounded-full border border-[#dadce0] transition-colors font-['Google_Sans',Roboto,sans-serif]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div
        className="flex items-center justify-between gap-2 px-3.5 py-2.5 border-t border-[#dadce0] bg-[#f8fafd] rounded-b-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Class Badge */}
        <div className="flex items-center min-w-0">
          <M3AssistChip
            label={experiment.gradeLevel}
            icon={<GraduationCap className="w-3.5 h-3.5" />}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          {onToggleLike && (
            <M3IconButton
              variant={isLiked ? 'tonal' : 'outlined'}
              size="sm"
              selected={isLiked}
              ariaLabel="Like experiment"
              icon={
                <Heart
                  size={14}
                  className={isLiked ? 'fill-rose-500 text-rose-500' : ''}
                />
              }
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

          {/* Quantity Stepper or Add Button */}
          {isSelected ? (
            <div className="flex items-center gap-1.5 bg-[#eef3fc] rounded-full p-1 border border-[#1a73e8]/30 shadow-xs">
              <button
                type="button"
                aria-label="Decrease quantity"
                className="w-7 h-7 rounded-full bg-white text-[#1a73e8] hover:bg-[#d3e3fd] border border-[#d3e3fd] flex items-center justify-center transition-all cursor-pointer shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateQty?.(-1);
                }}
              >
                <Minus size={13} strokeWidth={2.5} />
              </button>

              <span className="min-w-[20px] text-center text-xs font-bold text-[#1a73e8] select-none font-['Google_Sans',Roboto,sans-serif]">
                {quantity}
              </span>

              <button
                type="button"
                aria-label="Increase quantity"
                className="w-7 h-7 rounded-full bg-[#1a73e8] text-white hover:bg-[#1557b0] flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-2xs"
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
              className="h-8 px-3 rounded-full bg-white hover:bg-[#f8fafd] text-[#1a73e8] hover:text-[#1557b0] border border-[#dadce0] hover:border-[#1a73e8]/40 text-xs font-medium inline-flex items-center gap-1 transition-all duration-200 cursor-pointer shadow-xs active:scale-95 font-['Google_Sans',Roboto,sans-serif]"
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

export default ScienceCard;
