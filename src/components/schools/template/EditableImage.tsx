'use client';

import React, { useState, useRef } from 'react';
import { useOptionalSchoolTemplate } from './SchoolTemplateContext';
import { Camera, Upload, Link as LinkIcon, X, Check, RotateCcw, AlertCircle } from 'lucide-react';
import { compressImageUnder100KB, validateVideoUnder10MB } from '@/lib/mediaCompressor';

interface EditableImageProps {
  imageKey: string;
  defaultSrc: string;
  src?: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  aspectRatio?: string;
}

export async function compressImageUnder50KB(file: File): Promise<{ dataUrl: string; sizeKb: number }> {
  const res = await compressImageUnder100KB(file, 49);
  return { dataUrl: res.dataUrl || '', sizeKb: res.sizeKb };
}

function isVideoMedia(url?: string): boolean {
  if (!url) return false;
  return (
    url.endsWith('.mp4') ||
    url.endsWith('.webm') ||
    url.startsWith('data:video/') ||
    url.includes('youtube.com') ||
    url.includes('youtu.be')
  );
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
  const [activeTab, setActiveTab] = useState<'url' | 'upload'>('url');
  const [previewSrc, setPreviewSrc] = useState(effectiveSrc);
  const [urlInput, setUrlInput] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [compressedSizeKb, setCompressedSizeKb] = useState<number | null>(null);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);

  const handleOpenModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewSrc(effectiveSrc);
    setUrlInput(effectiveSrc.startsWith('data:') ? '' : effectiveSrc);
    setCompressedSizeKb(null);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMessage(null);

    if (file.type.startsWith('video/')) {
      setIsCompressing(true);
      const res = await validateVideoUnder10MB(file);
      setIsCompressing(false);
      if (!res.success || res.error) {
        setErrorMessage(res.error || 'Video exceeds the 10 MB limit.');
        return;
      }
      setPreviewSrc(res.dataUrl || '');
      setCompressedSizeKb(res.sizeKb);
    } else {
      try {
        setIsCompressing(true);
        const res = await compressImageUnder100KB(file);
        if (!res.success || res.error) {
          setErrorMessage(res.error || 'Image compression failed.');
          return;
        }
        setPreviewSrc(res.dataUrl || '');
        setCompressedSizeKb(res.sizeKb);
      } catch (err) {
        console.error('Image compression failed:', err);
        setErrorMessage('Failed to process image file.');
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const handleSave = () => {
    updateImageOverride(imageKey, previewSrc);
    if (imageKey === 'school_logo' && ctx?.updateField) {
      ctx.updateField('logoImage', previewSrc);
    }
    setIsModalOpen(false);
  };

  const handleReset = () => {
    setPreviewSrc(defaultSrc);
    updateImageOverride(imageKey, defaultSrc);
    if (imageKey === 'school_logo' && ctx?.updateField) {
      ctx.updateField('logoImage', defaultSrc);
    }
    setIsModalOpen(false);
  };

  return (
    <div
      className={`group/editimg relative overflow-hidden ${containerClassName} ${
        isEditMode ? 'ring-2 ring-offset-2 ring-dashed ring-[#005689] cursor-pointer' : ''
      }`}
    >
      {isVideoMedia(effectiveSrc) ? (
        <video src={effectiveSrc} autoPlay loop muted playsInline className={className} />
      ) : (
        <img
          src={effectiveSrc}
          alt={alt}
          className={className}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = defaultSrc;
          }}
        />
      )}

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
            <Camera className="w-4 h-4 text-[#005689]" />
            <span>Change Photo / Video</span>
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
                  <h3 className="font-bold text-slate-900 text-sm">Change Campus Photo</h3>
                  <p className="text-[11px] text-slate-500">Provide direct image URL (preferred) or upload photo</p>
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
                onClick={() => setActiveTab('url')}
                className={`pb-2.5 text-xs font-bold px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'url'
                    ? 'border-[#005689] text-[#005689]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Image / Video URL (Preferred)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`pb-2.5 text-xs font-bold px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'upload'
                    ? 'border-[#005689] text-[#005689]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload From Device</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 max-h-[360px] overflow-y-auto [scrollbar-width:thin]">
              {/* Tab 1: Direct URL (First Preference) */}
              {activeTab === 'url' && (
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-700 block">Direct Image or Short Video Link</label>
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => {
                      setUrlInput(e.target.value);
                      if (e.target.value.trim().startsWith('http') || e.target.value.trim().startsWith('data:')) {
                        setPreviewSrc(e.target.value.trim());
                      }
                    }}
                    placeholder="https://images.unsplash.com/... or https://yourschool.org/campus.jpg"
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#005689]/30 bg-slate-50 font-mono"
                  />
                  <p className="text-[11px] text-slate-500">
                    Paste any direct image URL (JPG, PNG, WebP) or short campus video link (MP4 / YouTube). It will instantly preview below.
                  </p>
                </div>
              )}

              {/* Tab 2: Upload */}
              {activeTab === 'upload' && (
                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50/50">
                  <div className="w-12 h-12 rounded-2xl bg-[#EDF5FA] text-[#006FCC] flex items-center justify-center mb-3">
                    <Upload className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">Click to browse your photos or clip</h4>
                  <p className="text-xs text-slate-500 mb-4 text-center">
                    Images: PNG, JPG, WebP auto-compressed under 100 KB • Short Video: MP4 max 10 MB
                  </p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*,video/mp4,video/webm"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl bg-[#006FCC] hover:bg-[#005499] text-white font-bold text-xs shadow-md transition cursor-pointer"
                  >
                    Select Photo or Video From Device
                  </button>
                </div>
              )}

              {/* Error Alert */}
              {errorMessage && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2 text-red-700 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Live Preview Strip */}
              {previewSrc && (
                <div className="mt-4 p-3 bg-slate-100 rounded-2xl flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-slate-300 bg-black flex items-center justify-center">
                    {isVideoMedia(previewSrc) ? (
                      <video src={previewSrc} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                    ) : (
                      <img src={previewSrc} alt="Preview" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Selected Media Preview</span>
                    {isCompressing ? (
                      <p className="text-[11px] text-[#006FCC] font-semibold animate-pulse">
                        ⚡ Auto-compressing to WebP under 100 KB without quality loss...
                      </p>
                    ) : compressedSizeKb !== null ? (
                      <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                        ✓ Compressed to WebP: {compressedSizeKb} KB (Strictly &lt; 100 KB, Crisp HD)
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
                  <span>Apply Photo / Video</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
