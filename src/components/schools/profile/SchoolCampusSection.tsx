'use client';

import React, { useState } from 'react';
import {
  Camera,
  Trash2,
  Loader2,
  ChevronDown,
  Play,
  Plus
} from 'lucide-react';

export interface SchoolCampusSectionProps {
  displayName: string;
  isLiveTemplate?: boolean;
  isEditMode?: boolean;
  templateData?: any;
  templateCtx?: any;
  onAddMediaClick?: () => void;
  onTourClick?: () => void;
  onApplyClick?: () => void;
}

export default function SchoolCampusSection({
  displayName,
  isLiveTemplate = false,
  isEditMode = false,
  templateData,
  templateCtx,
  onAddMediaClick,
  onTourClick,
  onApplyClick,
}: SchoolCampusSectionProps) {
  const [galleryVisibleCount, setGalleryVisibleCount] = useState(6);
  const [isGalleryLoadingMore, setIsGalleryLoadingMore] = useState(false);

  return (
    <section id="school-campus" className="py-12 sm:py-20 bg-[#FEFBF3] border-t border-[#F4EBD9]/80 relative overflow-hidden">
      {/* Decorative ambient background blur */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#EDF5FA]/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#005689] bg-[#EDF5FA] border border-[#D6EDFF] px-3.5 py-1.5 rounded-full mb-3 shadow-2xs">
            <span className="w-2 h-2 bg-[#FBBC04] rounded-full inline-block" />
            <span>SCHOOL CAMPUS &amp; LIFE</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-tight">
            Campus Gallery,
            <span className="text-[#005689] block mt-0.5">Architecture &amp; Learning Spaces</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed font-medium">
            Take a visual tour of our experiential laboratories, learning halls, sports arenas, and vibrant campus at {displayName}.
          </p>

          {isLiveTemplate && isEditMode && (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={onAddMediaClick}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#005689] hover:bg-[#004168] text-white font-black text-xs shadow-[0_8px_24px_rgba(0,86,137,0.25)] transition-all cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Add Verified Campus Media</span>
              </button>
            </div>
          )}
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {(() => {
            const items = (templateData?.galleryItems && templateData.galleryItems.length > 0)
              ? templateData.galleryItems
              : [
                  {
                    id: 'campus-1',
                    type: 'image',
                    url: '/images/schools/hero-school-1.png',
                    title: 'Main Academic Quadrangle',
                    category: 'Infrastructure',
                  },
                  {
                    id: 'campus-2',
                    type: 'image',
                    url: '/images/real-facilities/science-lab.jpg',
                    title: 'Composite Practical Sciences Lab',
                    category: 'STEM Labs',
                  },
                  {
                    id: 'campus-3',
                    type: 'image',
                    url: '/images/real-facilities/computer-lab.jpg',
                    title: 'Interactive Multimedia IT Center',
                    category: 'Digital Innovation',
                  },
                  {
                    id: 'campus-4',
                    type: 'image',
                    url: '/images/real-facilities/library.jpg',
                    title: 'Central Library & Reading Hall',
                    category: 'Academics',
                  },
                  {
                    id: 'campus-5',
                    type: 'image',
                    url: '/images/real-facilities/sports.jpg',
                    title: 'Athletic Sports Complex',
                    category: 'Sports',
                  },
                  {
                    id: 'campus-6',
                    type: 'image',
                    url: '/images/schools/hero-school-2.jpg',
                    title: 'Junior Wing Activity Enclosure',
                    category: 'Campus Life',
                  },
                ];

            return items.slice(0, galleryVisibleCount).map((item: any, idx: number) => (
              <div
                key={item.id || idx}
                className="group relative rounded-[28px] overflow-hidden bg-slate-900 shadow-[0_12px_36px_rgba(0,35,70,0.08),inset_0_1px_0_rgba(255,255,255,0.9)] border border-[#F4EBD9] hover:border-[#005689]/40 hover:shadow-2xl transition-all duration-500 aspect-[4/3]"
              >
                {item.type === 'video' ? (
                  <div className="w-full h-full relative">
                    <iframe
                      src={item.url.includes('watch?v=') ? `https://www.youtube.com/embed/${item.url.split('watch?v=')[1]?.split('&')[0]}` : item.url}
                      title={item.title}
                      className="w-full h-full object-cover border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                )}

                {/* Overlay info with clay badge */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5 pointer-events-none">
                  <div className="mb-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#005689]/80 text-white backdrop-blur-md border border-white/20 inline-block shadow-xs">
                      {item.category || 'Campus Life'}
                    </span>
                  </div>
                  <h3 className="text-white font-extrabold text-base leading-snug drop-shadow-sm">
                    {item.title}
                  </h3>
                </div>

                {isEditMode && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      templateCtx?.deleteGalleryItem(item.id);
                    }}
                    className="absolute top-3 right-3 p-2 rounded-xl bg-black/60 text-white hover:bg-rose-600 transition-colors cursor-pointer z-20"
                    title="Delete Media"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ));
          })()}
        </div>

        {/* Load More Button */}
        {(() => {
          const totalItems = templateData?.galleryItems?.length || 6;
          if (galleryVisibleCount < totalItems) {
            return (
              <div className="mt-12 text-center">
                <button
                  type="button"
                  disabled={isGalleryLoadingMore}
                  onClick={() => {
                    setIsGalleryLoadingMore(true);
                    setTimeout(() => {
                      setGalleryVisibleCount((prev) => prev + 6);
                      setIsGalleryLoadingMore(false);
                    }, 500);
                  }}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-xs transition border border-slate-200 shadow-sm hover:shadow-md cursor-pointer"
                >
                  {isGalleryLoadingMore ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#005689]" />
                      <span>Loading Campus Photos...</span>
                    </>
                  ) : (
                    <>
                      <span>Show More Campus Photos</span>
                      <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                    </>
                  )}
                </button>
              </div>
            );
          }
          return null;
        })()}

        {/* Bottom Campus Tour CTA */}
        <div className="mt-14 sm:mt-20 rounded-[36px] bg-gradient-to-r from-[#002B49] via-[#005689] to-[#004168] text-white p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-[0_16px_40px_rgba(0,86,137,0.3)] border border-sky-300/20 relative overflow-hidden">
          <div className="max-w-xl text-center md:text-left relative z-10">
            <div className="inline-flex items-center gap-2 text-xs font-black tracking-widest uppercase text-amber-300 bg-white/10 px-3 py-1 rounded-full mb-3 border border-white/15">
              <span>EXPERIENCE CAMPUS IN PERSON</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black">Plan an In-Person Campus Walkthrough</h3>
            <p className="text-xs sm:text-sm text-sky-100 mt-2.5 leading-relaxed font-medium">
              Experience the classrooms, meet educators, and explore our laboratories firsthand during school working hours.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-3.5 shrink-0 relative z-10">
            {onTourClick && (
              <button
                type="button"
                onClick={onTourClick}
                className="px-7 py-3.5 rounded-full bg-white text-[#005689] font-black text-xs hover:bg-sky-50 shadow-md transition-all cursor-pointer flex items-center gap-2.5 hover:scale-105 active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Virtual Video Tour</span>
              </button>
            )}
            {onApplyClick && (
              <button
                type="button"
                onClick={onApplyClick}
                className="px-7 py-3.5 rounded-full bg-[#FBBC04] text-slate-950 font-black text-xs hover:bg-[#F2A900] shadow-[0_8px_24px_rgba(251,188,4,0.35)] transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                Book Campus Visit
              </button>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
