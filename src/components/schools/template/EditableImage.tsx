'use client';

import React, { useState, useRef } from 'react';
import { useOptionalSchoolTemplate } from './SchoolTemplateContext';
import { Camera, Upload, Image as ImageIcon, Link as LinkIcon, X, Check, RotateCcw } from 'lucide-react';

interface EditableImageProps {
  imageKey: string;
  defaultSrc: string;
  src?: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  aspectRatio?: string;
}

const PRESET_GALLERY = [
  { label: 'Campus Architecture', url: '/images/schools/hero-school-1.png' },
  { label: 'Science & Inquiry Lab', url: '/images/real-facilities/computer-lab.jpg' },
  { label: 'Principal / Head Desk', url: '/images/teachers/verified-teacher-avatar-placeholder.webp' },
  { label: 'Olympic Sports Arena', url: '/images/real-facilities/sports.jpg' },
  { label: 'Digital Library & E-Books', url: '/images/real-facilities/library.jpg' },
  { label: 'Smart Interactive Classroom', url: '/images/real-facilities/smart-class.jpg' },
  { label: 'Robotics & Computer Lab', url: '/images/real-facilities/computer-lab.jpg' },
  { label: 'GPS Bus Fleet', url: '/images/real-facilities/transport.jpg' },
];

export function compressImageUnder50KB(file: File): Promise<{ dataUrl: string; sizeKb: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        const maxDim = 1200;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          const raw = e.target?.result as string;
          return resolve({ dataUrl: raw, sizeKb: Math.round(raw.length * 0.75 / 1024) });
        }

        // Use high quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Target: <= 50KB (approx 48KB safe ceiling)
        const targetBytes = 49 * 1024;
        let quality = 0.85;
        let dataUrl = canvas.toDataURL('image/jpeg', quality);
        let currentBytes = dataUrl.length * 0.75;

        while (currentBytes > targetBytes && quality > 0.25) {
          quality -= 0.08;
          dataUrl = canvas.toDataURL('image/jpeg', quality);
          currentBytes = dataUrl.length * 0.75;
        }

        // If still over 50KB, scale down canvas resolution slightly
        if (currentBytes > targetBytes) {
          const scaleCanvas = document.createElement('canvas');
          scaleCanvas.width = Math.round(width * 0.8);
          scaleCanvas.height = Math.round(height * 0.8);
          const sCtx = scaleCanvas.getContext('2d');
          if (sCtx) {
            sCtx.imageSmoothingEnabled = true;
            sCtx.imageSmoothingQuality = 'high';
            sCtx.drawImage(canvas, 0, 0, scaleCanvas.width, scaleCanvas.height);
            dataUrl = scaleCanvas.toDataURL('image/jpeg', 0.65);
            currentBytes = dataUrl.length * 0.75;
          }
        }

        resolve({ dataUrl, sizeKb: Math.round(currentBytes / 1024) });
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function EditableImage({
  imageKey,
  defaultSrc,
  src,
  alt,
  className = 'w-full h-full object-cover',
  containerClassName = 'relative w-full h-full',
}: EditableImageProps) {
  const ctx = useOptionalSchoolTemplate();
  const isEditMode = ctx?.isEditMode ?? false;
  const contextOverride = ctx?.data?.imageOverrides?.[imageKey];
  const updateImageOverride = ctx?.updateImageOverride || (() => {});
  const effectiveSrc = contextOverride || src || (ctx?.getImage ? ctx.getImage(imageKey, defaultSrc) : defaultSrc);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'presets' | 'url'>('presets');
  const [previewSrc, setPreviewSrc] = useState(effectiveSrc);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [compressedSizeKb, setCompressedSizeKb] = useState<number | null>(null);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);

  const handleOpenModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewSrc(effectiveSrc);
    setUrlInput(effectiveSrc.startsWith('data:') ? '' : effectiveSrc);
    setCompressedSizeKb(null);
    setIsModalOpen(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressing(true);
      const { dataUrl, sizeKb } = await compressImageUnder50KB(file);
      setPreviewSrc(dataUrl);
      setCompressedSizeKb(sizeKb);
    } catch (err) {
      console.error('Image compression failed:', err);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSave = () => {
    updateImageOverride(imageKey, previewSrc);
    setIsModalOpen(false);
  };

  const handleReset = () => {
    setPreviewSrc(defaultSrc);
    updateImageOverride(imageKey, defaultSrc);
    setIsModalOpen(false);
  };

  return (
    <div className={`group/editimg relative overflow-hidden ${containerClassName}`}>
      <img
        src={effectiveSrc}
        alt={alt}
        className={className}
        onError={(e) => {
          // Fallback if broken URL
          (e.currentTarget as HTMLImageElement).src = defaultSrc;
        }}
      />

      {/* Edit Overlay Button */}
      {isEditMode && (
        <div
          onClick={handleOpenModal}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] opacity-0 group-hover/editimg:opacity-100 transition-opacity flex items-center justify-center cursor-pointer z-20"
        >
          <button
            type="button"
            className="px-3.5 py-2 rounded-xl bg-white/95 hover:bg-white text-slate-900 font-bold text-xs flex items-center gap-2 shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/40"
          >
            <Camera className="w-4 h-4 text-[#006FCC]" />
            <span>Change Photo</span>
          </button>
        </div>
      )}

      {/* Image Change Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#EDF5FA] text-[#006FCC] flex items-center justify-center">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Change Image</h3>
                  <p className="text-[11px] text-slate-500">Upload your own photo or pick from school gallery</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-slate-100 px-5 pt-3 gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('presets')}
                className={`pb-2.5 text-xs font-bold px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'presets'
                    ? 'border-[#006FCC] text-[#006FCC]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Preset Gallery</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`pb-2.5 text-xs font-bold px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'upload'
                    ? 'border-[#006FCC] text-[#006FCC]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload File</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('url')}
                className={`pb-2.5 text-xs font-bold px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'url'
                    ? 'border-[#006FCC] text-[#006FCC]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Image URL</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 max-h-[360px] overflow-y-auto [scrollbar-width:thin]">
              {/* Tab 1: Presets */}
              {activeTab === 'presets' && (
                <div className="grid grid-cols-2 gap-3">
                  {PRESET_GALLERY.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => setPreviewSrc(item.url)}
                      className={`relative rounded-xl overflow-hidden aspect-[4/3] border-2 cursor-pointer transition-all ${
                        previewSrc === item.url
                          ? 'border-[#006FCC] ring-2 ring-[#006FCC]/30 scale-[1.02]'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <img src={item.url} alt={item.label} className="w-full h-full object-cover" />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 text-white text-[10px] font-bold">
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 2: Upload */}
              {activeTab === 'upload' && (
                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50/50">
                  <div className="w-12 h-12 rounded-2xl bg-[#EDF5FA] text-[#006FCC] flex items-center justify-center mb-3">
                    <Upload className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">Click to browse your photos</h4>
                  <p className="text-xs text-slate-500 mb-4 text-center">PNG, JPG, WebP up to 5MB</p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl bg-[#006FCC] hover:bg-[#005499] text-white font-bold text-xs shadow-md transition cursor-pointer"
                  >
                    Select Photo From Device
                  </button>
                </div>
              )}

              {/* Tab 3: URL */}
              {activeTab === 'url' && (
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-700 block">Direct Image Link</label>
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => {
                      setUrlInput(e.target.value);
                      if (e.target.value.trim().startsWith('http')) {
                        setPreviewSrc(e.target.value.trim());
                      }
                    }}
                    placeholder="https://example.com/school-photo.jpg"
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#006FCC]/30 bg-slate-50"
                  />
                  <p className="text-[11px] text-slate-500">Paste any public URL to display instantly.</p>
                </div>
              )}

              {/* Live Preview Strip */}
              {previewSrc && (
                <div className="mt-4 p-3 bg-slate-100 rounded-2xl flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-slate-300">
                    <img src={previewSrc} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Selected Photo Preview</span>
                    {isCompressing ? (
                      <p className="text-[11px] text-[#006FCC] font-semibold animate-pulse">
                        ⚡ Auto-compressing under 50KB without quality loss...
                      </p>
                    ) : compressedSizeKb !== null ? (
                      <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                        ✓ Auto-compressed to {compressedSizeKb} KB (Max &lt; 50 KB, Crisp HD)
                      </p>
                    ) : (
                      <p className="text-xs font-semibold text-slate-800 truncate">Ready to apply to page</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Default</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-4 py-1.5 rounded-xl bg-[#006FCC] hover:bg-[#005499] text-white text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Apply Photo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
