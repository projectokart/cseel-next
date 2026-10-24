'use client';

import React from 'react';
import { Camera, Video, Compass, MapPin, Eye, ArrowRight } from 'lucide-react';
import { MediaItem } from '../types';

export interface GalleryCardProps {
  item: MediaItem;
  onClick?: () => void;
}

const TYPE_ICONS = {
  photo: Camera,
  video: Video,
  virtual_tour_360: Compass,
  press_release: Eye,
};

export const GalleryCard: React.FC<GalleryCardProps> = ({ item, onClick }) => {
  const Icon = TYPE_ICONS[item.type] || Camera;

  return (
    <article
      onClick={onClick}
      className="relative flex flex-col justify-between border border-[#dadce0] hover:border-[#bdc1c6] rounded-2xl bg-white w-full select-none overflow-hidden cursor-pointer group box-border transition-all duration-300 shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.08)] hover:-translate-y-0.5"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#f8f9fa] border-b border-[#dadce0]">
        <img
          src={item.thumbnailUrl}
          alt={item.title}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/95 text-[#1a73e8] border border-[#dadce0] shadow-xs backdrop-blur-xs flex items-center gap-1 font-['Google_Sans',Roboto,sans-serif]">
            <Icon size={11} className="text-[#1a73e8]" />
            <span className="capitalize">{item.type.replace('_', ' ')}</span>
          </span>
        </div>

        <div className="absolute bottom-2 right-2 z-10">
          <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-slate-900/75 text-white backdrop-blur-xs border border-white/20 shadow-xs">
            {item.date}
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-[11px] text-[#656773] font-medium font-['Google_Sans',Roboto,sans-serif]">
            <span className="font-semibold text-[#1a73e8]">{item.category}</span>
            {item.location && (
              <>
                <span>&bull;</span>
                <span className="flex items-center gap-0.5 text-slate-500">
                  <MapPin size={11} className="text-[#d97706]" /> {item.location}
                </span>
              </>
            )}
          </div>

          <h3 className="text-[15px] sm:text-[16px] font-semibold text-[#16171A] group-hover:text-[#1a73e8] leading-snug transition-colors line-clamp-2 font-['Google_Sans',Roboto,sans-serif]">
            {item.title}
          </h3>

          <p className="text-[12px] text-[#656773] font-normal leading-relaxed line-clamp-2 font-['Google_Sans',Roboto,sans-serif]">
            {item.description}
          </p>

          {item.schoolName && (
            <p className="text-[11px] font-medium text-slate-500 pt-0.5 truncate font-['Google_Sans',Roboto,sans-serif]">
              School: <strong className="text-[#16171A] font-semibold">{item.schoolName}</strong>
            </p>
          )}
        </div>

        <div className="pt-3 border-t border-[#dadce0] flex items-center justify-between gap-2 mt-auto">
          <div className="flex items-center gap-1 flex-wrap">
            {item.tags.slice(0, 2).map((t) => (
              <span
                key={t}
                className="text-[9px] font-medium text-[#656773] bg-[#f8f9fa] px-2 py-0.5 rounded-full border border-[#dadce0]"
              >
                #{t}
              </span>
            ))}
          </div>

          <span className="px-3 py-1 rounded-full border border-[#dadce0] bg-white text-[#1a73e8] group-hover:bg-[#f8fafd] group-hover:border-[#1a73e8]/40 text-[11px] font-medium transition-colors inline-flex items-center gap-1 shrink-0 font-['Google_Sans',Roboto,sans-serif]">
            <span>View</span>
            <ArrowRight size={11} />
          </span>
        </div>
      </div>
    </article>
  );
};

export default GalleryCard;
