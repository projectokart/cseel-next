'use client';

import React, { useState, useRef } from 'react';
import {
  Trash2,
  Video,
  Edit3,
  Check,
  X,
  Image as ImageIcon,
  UploadCloud,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { extractYouTubeEmbedUrl } from '@/components/schools/profile/SchoolCampusTourSection';
import { compressImageUnder100KB } from '@/lib/mediaCompressor';

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

const DEFAULT_12_GALLERY_ITEMS = [
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

export default function SchoolCampusSection({
  displayName,
  videoUrl,
  onUpdateVideoUrl,
  isLiveTemplate = false,
  isEditMode = false,
  templateData,
  templateCtx,
}: SchoolCampusSectionProps) {
  const [isEditingVideo, setIsEditingVideo] = useState(false);
  const [inputUrl, setInputUrl] = useState(videoUrl || '');
  const [activeTouchIdx, setActiveTouchIdx] = useState<number | null>(null);

  // Modal State for "Change Image" (3 fields: URL, Title, Category)
  const [editingSlotIdx, setEditingSlotIdx] = useState<number | null>(null);
  const [modalUrl, setModalUrl] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [modalCategory, setModalCategory] = useState('');
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const effectiveEmbedUrl = extractYouTubeEmbedUrl(videoUrl);

  const handleSaveVideo = () => {
    if (onUpdateVideoUrl) {
      onUpdateVideoUrl(inputUrl);
    }
    setIsEditingVideo(false);
  };

  // Build full 12-item grid
  const customItems: any[] = Array.isArray(templateData?.galleryItems) && templateData.galleryItems.length > 0
    ? templateData.galleryItems
    : [];

  const [localItems, setLocalItems] = useState<any[]>(() => {
    const combined = [...customItems];
    for (let i = combined.length; i < 12; i++) {
      combined.push(DEFAULT_12_GALLERY_ITEMS[i] || {
        id: `campus-${i + 1}`,
        type: 'image',
        url: '',
        title: `Campus Space ${i + 1}`,
        category: 'Campus Area',
      });
    }
    return combined.slice(0, 12);
  });

  const openChangeImageModal = (idx: number) => {
    const current = localItems[idx] || {};
    setEditingSlotIdx(idx);
    setModalUrl(current.url || '');
    setModalTitle(current.title || '');
    setModalCategory(current.category || 'Infrastructure');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingFile(true);
    try {
      const compressed = await compressImageUnder100KB(file, 95);
      setModalUrl(compressed.dataUrl);
    } catch (err) {
      console.error('Failed to compress image:', err);
    } finally {
      setIsUploadingFile(false);
    }
  };

  const handleSaveModal = () => {
    if (editingSlotIdx === null) return;
    const updated = [...localItems];
    updated[editingSlotIdx] = {
      ...updated[editingSlotIdx],
      id: updated[editingSlotIdx]?.id || `campus-${editingSlotIdx + 1}`,
      type: 'image',
      url: modalUrl,
      title: modalTitle,
      category: modalCategory,
    };
    setLocalItems(updated);
    if (templateCtx?.setGalleryItems) {
      templateCtx.setGalleryItems(updated);
    }
    if (templateCtx?.updateContentOverride) {
      templateCtx.updateContentOverride('gallery_custom_items', JSON.stringify(updated));
    }
    if (templateData) {
      templateData.galleryItems = updated;
    }
    setEditingSlotIdx(null);
  };

  return (
    <section
      id="campus-tour"
      className="py-5 sm:py-9 bg-[#EEF2F6] border-b border-[#DCE2E8] relative overflow-hidden"
    >
      <div
        id="school-campus"
        className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 relative z-10 space-y-4 sm:space-y-6"
      >
        {/* Unified Header (Standalone top buttons removed per user request) */}
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

        {/* 1. Campus Tour Video Player with Direct "Edit YouTube Video" Overlay Button */}
        <div className="max-w-4xl mx-auto relative group">
          {isEditMode && (
            <button
              type="button"
              onClick={() => {
                setInputUrl(videoUrl || '');
                setIsEditingVideo((v) => !v);
              }}
              className="absolute top-3 right-3 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-950/85 hover:bg-[#006FCC] text-white backdrop-blur-md border border-white/20 shadow-md transition-all cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-300" />
              <span>Edit YouTube Video</span>
            </button>
          )}

          {isEditMode && isEditingVideo && (
            <div className="absolute top-12 right-3 z-30 flex flex-col sm:flex-row items-center gap-2 bg-white p-3 rounded-2xl border border-[#D0E4F5] shadow-xl max-w-md w-full animate-fade-in">
              <input
                type="url"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="Paste YouTube Video URL (e.g. https://www.youtube.com/watch?v=...)"
                className="w-full text-xs px-3 py-1.5 border border-[#E8E9E9] rounded-lg focus:outline-none focus:border-[#006FCC]"
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

        {/* 2. Campus Photo & Media Gallery 3x4 Grid (12 template items with Change Image button on each) */}
        <div
          id="campus-gallery-scroll"
          className="grid grid-rows-3 grid-flow-col auto-cols-[calc((100%_-_0.625rem)/2)] sm:auto-cols-[calc((100%_-_1.75rem)/3)] lg:auto-cols-[calc((100%_-_2.625rem)/4)] gap-2.5 sm:gap-3.5 overflow-x-auto pb-2 snap-x snap-mandatory [touch-action:pan-x_pan-y]"
        >
          {localItems.slice(0, 12).map((item: any, idx: number) => {
            const hasImage = Boolean(item.url && item.url.trim() !== '');
            return (
              <div
                key={item.id || idx}
                onTouchStart={() => setActiveTouchIdx(idx)}
                onTouchEnd={() => setActiveTouchIdx(null)}
                onTouchCancel={() => setActiveTouchIdx(null)}
                className={`group relative rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 aspect-[4/3] snap-start select-none ${
                  !hasImage
                    ? 'bg-white border-2 border-dashed border-[#CBD5E1] flex flex-col items-center justify-center'
                    : `bg-slate-900 shadow-xs border border-[#E8E9E9] hover:border-[#006FCC]/40 hover:scale-[1.02] hover:z-10 hover:shadow-md ${
                        activeTouchIdx === idx ? 'scale-[1.02] z-10 shadow-md border-[#006FCC]/40' : ''
                      }`
                }`}
              >
                {!hasImage ? (
                  <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center p-3 text-center">
                    <ImageIcon className="w-7 h-7 text-slate-300 mb-1" />
                    <span className="text-[10px] font-bold text-slate-400">Empty Slot {idx + 1}</span>
                  </div>
                ) : (
                  <img
                    src={item.url}
                    alt={item.title || `Campus Photo ${idx + 1}`}
                    draggable={false}
                    className={`w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.06] ${
                      activeTouchIdx === idx ? 'scale-[1.06]' : ''
                    }`}
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/images/schools/hero-school-1.png';
                    }}
                  />
                )}

                {/* Caption / Category Overlay */}
                {hasImage && (item.category || item.title) && (
                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10 flex flex-col justify-end p-2.5 sm:p-3 pointer-events-none transition-opacity duration-200 ${
                      isEditMode ? 'pb-10' : ''
                    } ${activeTouchIdx === idx ? 'opacity-0' : 'opacity-100 group-hover:opacity-0'}`}
                  >
                    {item.category && (
                      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#006FCC] text-white w-fit mb-1 shadow-xs font-['Montserrat',sans-serif]">
                        {item.category}
                      </span>
                    )}
                    {item.title && (
                      <h3 className="!text-white font-bold text-[11px] sm:text-xs leading-snug line-clamp-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)] font-['Montserrat',sans-serif] m-0">
                        {item.title}
                      </h3>
                    )}
                  </div>
                )}

                {/* Explicit "Change Image" Button in Edit Mode on Every Grid Slot */}
                {isEditMode && (
                  <button
                    type="button"
                    onClick={() => openChangeImageModal(idx)}
                    className="absolute bottom-2 left-2 right-2 z-20 py-1.5 px-2 rounded-lg bg-black/80 hover:bg-[#006FCC] text-white text-[11px] font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer backdrop-blur-xs border border-white/20 active:scale-95"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-300" />
                    <span>Change Image</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3-Field Pop-up Modal for "Change Image" */}
      {editingSlotIdx !== null && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl relative border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#006FCC]" />
                <h3 className="font-bold text-sm sm:text-base text-[#003C6E] font-['Montserrat',sans-serif]">
                  Update Gallery Photo (Slot {editingSlotIdx + 1})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingSlotIdx(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Field 1: Image / Video URL */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                1. Image / Video URL (or Upload from Device)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  value={modalUrl}
                  onChange={(e) => setModalUrl(e.target.value)}
                  placeholder="Paste direct URL (e.g. https://.../photo.webp)"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-[#006FCC]"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingFile}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-xs font-bold shrink-0 flex items-center gap-1 cursor-pointer"
                >
                  {isUploadingFile ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <UploadCloud className="w-3.5 h-3.5 text-[#006FCC]" />
                  )}
                  <span>Upload</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>

              {/* Live Preview Thumbnail */}
              {modalUrl && (
                <div className="mt-2 relative w-full h-28 rounded-xl overflow-hidden bg-slate-900 border border-slate-200">
                  <img
                    src={modalUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/images/schools/hero-school-1.png';
                    }}
                  />
                  <span className="absolute bottom-1 right-1 text-[9px] font-bold bg-black/70 text-white px-1.5 py-0.5 rounded">
                    Live Preview
                  </span>
                </div>
              )}
            </div>

            {/* Field 2: Title / Caption */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                2. Photo Title / Caption
              </label>
              <input
                type="text"
                value={modalTitle}
                onChange={(e) => setModalTitle(e.target.value)}
                placeholder="e.g. Advanced Physics & Robotics Lab"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-[#006FCC]"
              />
            </div>

            {/* Field 3: Category / Tag */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                3. Facility Category / Tag
              </label>
              <input
                type="text"
                value={modalCategory}
                onChange={(e) => setModalCategory(e.target.value)}
                placeholder="e.g. STEM Labs, Sports, Library, Auditorium, Classrooms"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-[#006FCC]"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingSlotIdx(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveModal}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#006FCC] hover:bg-[#005399] text-white shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save &amp; Update Image</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
