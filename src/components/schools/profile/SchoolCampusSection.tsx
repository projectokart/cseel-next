'use client';

import React, { useState } from 'react';
import {
  Trash2,
  Plus,
  Video,
  Edit3,
  Check,
  X,
  Image as ImageIcon,
} from 'lucide-react';
import { extractYouTubeEmbedUrl } from '@/components/schools/profile/SchoolCampusTourSection';

export interface SchoolCampusSectionProps {
  displayName: string;
  videoUrl?: string;
  onUpdateVideoUrl?: (url: string) => void;
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
  videoUrl,
  onUpdateVideoUrl,
  isLiveTemplate = false,
  isEditMode = false,
  templateData,
  templateCtx,
  onAddMediaClick,
}: SchoolCampusSectionProps) {
  const [isEditingVideo, setIsEditingVideo] = useState(false);
  const [inputUrl, setInputUrl] = useState(videoUrl || '');
  const [activeTouchIdx, setActiveTouchIdx] = useState<number | null>(null);

  const effectiveEmbedUrl = extractYouTubeEmbedUrl(videoUrl);

  const handleSaveVideo = () => {
    if (onUpdateVideoUrl) {
      onUpdateVideoUrl(inputUrl);
    }
    setIsEditingVideo(false);
  };

  // 12 default campus showcase cards in 3x4 horizontal scroll grid (overridden if custom galleryItems exist)
  const customItems = Array.isArray(templateData?.galleryItems) ? templateData.galleryItems : [];
  const defaultGalleryItems = [
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
    {
      id: 'campus-7',
      type: 'image',
      url: '/images/real-facilities/smart-classroom.jpg',
      title: 'Interactive Smart Classrooms',
      category: 'Learning Spaces',
    },
    {
      id: 'campus-8',
      type: 'image',
      url: '/images/real-facilities/robotics-lab.jpg',
      title: 'ATL & Robotics Innovation Lab',
      category: 'Robotics & AI',
    },
    {
      id: 'campus-9',
      type: 'image',
      url: '/images/real-facilities/auditorium.jpg',
      title: 'Multipurpose Cultural Auditorium',
      category: 'Auditorium',
    },
    {
      id: 'campus-10',
      type: 'image',
      url: '/images/real-facilities/art-music.jpg',
      title: 'Fine Arts & Music Studio',
      category: 'Creative Arts',
    },
    {
      id: 'campus-11',
      type: 'image',
      url: '/images/real-facilities/medical.jpg',
      title: 'Campus Health & Medical Room',
      category: 'Student Care',
    },
    {
      id: 'campus-12',
      type: 'image',
      url: '/images/real-facilities/transport.jpg',
      title: 'GPS-Enabled School Transport',
      category: 'Transport',
    },
  ];
  const items = customItems.length > 0 ? customItems : defaultGalleryItems;

  return (
    <section
      id="campus-tour"
      className="py-5 sm:py-9 bg-[#EEF2F6] border-b border-[#DCE2E8] relative overflow-hidden"
    >
      <div
        id="school-campus"
        className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 relative z-10 space-y-4 sm:space-y-6"
      >
        {/* Unified Header: Virtual Campus Tour & Gallery */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase text-[#006FCC] bg-[#EDF5FA] border border-[#D0E4F5] px-2.5 py-0.5 rounded-full mb-2 font-['Montserrat',sans-serif]">
              <Video className="w-3 h-3 text-[#006FCC]" />
              <span>CAMPUS TOUR &amp; GALLERY</span>
            </div>

            <h2 className="text-[20px] sm:text-2xl font-bold font-['Montserrat',sans-serif] text-[#003C6E] tracking-tight leading-snug">
              Virtual Campus Tour of{' '}
              <span className="text-[#006FCC]">{displayName}</span>
            </h2>

            <p className="!text-[15px] font-['Lato',var(--font-roboto),Roboto,sans-serif] font-normal text-[#5F6368] !leading-[1.68] mt-1.5 max-w-2xl m-0">
              Explore campus classrooms, laboratories, sports arenas, and learning spaces in video and photos.
            </p>
          </div>

          {isLiveTemplate && isEditMode && (
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setInputUrl(videoUrl || '');
                  setIsEditingVideo((v) => !v);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold bg-white border border-slate-200 text-[#003C6E] hover:bg-slate-50 shadow-2xs cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#006FCC]" />
                <span>Edit Tour Video</span>
              </button>
              {onAddMediaClick && (
                <button
                  type="button"
                  onClick={onAddMediaClick}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#006FCC] hover:bg-[#005399] text-white font-bold text-[11px] shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Gallery Media</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Inline YouTube Video Editor (Edit Mode) */}
        {isEditMode && isEditingVideo && (
          <div className="flex flex-col sm:flex-row items-center gap-2 bg-white p-2.5 rounded-xl border border-[#D0E4F5] shadow-sm max-w-xl">
            <input
              type="url"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Paste YouTube Video URL (e.g. https://www.youtube.com/watch?v=...)"
              className="w-full text-xs px-3 py-1.5 border border-[#E8E9E9] rounded-lg focus:outline-none"
            />
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleSaveVideo}
                className="px-3 py-1.5 bg-[#006FCC] hover:bg-[#005399] text-white rounded-lg text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
              >
                <Check className="w-3 h-3" />
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditingVideo(false)}
                className="px-2 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* 1. Campus Tour Video Player */}
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 shadow-md border-2 border-white ring-1 ring-slate-200 aspect-video">
            <iframe
              className="w-full h-full border-0"
              src={effectiveEmbedUrl}
              title={`${displayName} Campus Video Tour`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>

        {/* 2. Campus Photo & Media Gallery Grid (3 rows x 4 columns horizontal scroll; 2 cols always visible on mobile) */}
        <div
          id="campus-gallery-scroll"
          className="grid grid-rows-3 grid-flow-col auto-cols-[calc((100%_-_0.625rem)/2)] sm:auto-cols-[calc((100%_-_1.75rem)/3)] lg:auto-cols-[calc((100%_-_2.625rem)/4)] gap-2.5 sm:gap-3.5 overflow-x-auto pb-2 snap-x snap-mandatory [touch-action:pan-x_pan-y]"
        >
          {items.map((item: any, idx: number) => (
            <div
              key={item.id || idx}
              onTouchStart={() => setActiveTouchIdx(idx)}
              onTouchEnd={() => setActiveTouchIdx(null)}
              onTouchCancel={() => setActiveTouchIdx(null)}
              onContextMenu={(e) => e.preventDefault()}
              className={`group relative rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 aspect-[4/3] snap-start select-none ${
                item.type === 'blank'
                  ? 'bg-white border border-dashed border-[#CBD5E1]'
                  : `bg-slate-900 shadow-xs border border-[#E8E9E9] hover:border-[#006FCC]/40 hover:scale-[1.03] hover:z-10 hover:shadow-md ${
                      activeTouchIdx === idx ? 'scale-[1.03] z-10 shadow-md border-[#006FCC]/40' : ''
                    }`
              }`}
            >
              {item.type === 'blank' ? (
                <div
                  className="w-full h-full bg-slate-50/70 flex items-center justify-center"
                  aria-label={`Sample campus gallery photo slot ${idx + 1}`}
                >
                  <ImageIcon className="w-6 h-6 text-slate-300" />
                </div>
              ) : item.type === 'video' ? (
                <iframe
                  src={
                    item.url.includes('watch?v=')
                      ? `https://www.youtube.com/embed/${item.url.split('watch?v=')[1]?.split('&')[0]}`
                      : item.url
                  }
                  title={item.title || `Campus Video ${idx + 1}`}
                  className="w-full h-full object-cover border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <img
                  src={item.url}
                  alt={item.title || `Campus Photo ${idx + 1}`}
                  draggable={false}
                  className={`w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.08] ${
                    activeTouchIdx === idx ? 'scale-[1.08]' : ''
                  }`}
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/images/schools/hero-school-1.png';
                  }}
                />
              )}

              {item.type !== 'blank' && (item.category || item.title) && (
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10 flex flex-col justify-end p-2.5 sm:p-4 pointer-events-none transition-opacity duration-200 ${
                    activeTouchIdx === idx
                      ? 'opacity-0'
                      : 'opacity-100 group-hover:opacity-0'
                  }`}
                >
                  {item.category && (
                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded bg-[#006FCC] text-white w-fit mb-1 shadow-xs font-['Montserrat',sans-serif]">
                      {item.category}
                    </span>
                  )}
                  {item.title && (
                    <h3 className="!text-white font-bold text-[11.5px] sm:text-sm leading-snug line-clamp-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)] font-['Montserrat',sans-serif] m-0">
                      {item.title}
                    </h3>
                  )}
                </div>
              )}

              {isEditMode && item.type !== 'blank' && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    templateCtx?.deleteGalleryItem(item.id);
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/65 text-white hover:bg-rose-600 transition-colors cursor-pointer z-20"
                  title="Delete Media"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
