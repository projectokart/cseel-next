'use client';

import React, { useState } from 'react';
import { useSchoolTemplate } from './SchoolTemplateContext';
import { CURATED_SCHOOL_PHOTOS } from './SchoolAssetLibrary';
import { Camera, Upload, Link as LinkIcon, Check, X, Image as ImageIcon } from 'lucide-react';

interface EditableImageProps {
  src: string;
  alt: string;
  fieldKey: string;
  className?: string;
  aspectRatio?: string;
  label?: string;
}

export default function EditableImage({
  src,
  alt,
  fieldKey,
  className = 'w-full h-full object-cover',
  aspectRatio,
  label = 'Change Photo'
}: EditableImageProps) {
  const { isEditMode, updateField } = useSchoolTemplate();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<'curated' | 'url' | 'upload'>('curated');
  const [customUrl, setCustomUrl] = useState<string>('');
  const [previewSrc, setPreviewSrc] = useState<string>(src);

  const handleSelectCurated = (url: string) => {
    updateField(fieldKey as any, url);
    setPreviewSrc(url);
    setIsModalOpen(false);
  };

  const handleApplyUrl = () => {
    if (customUrl.trim()) {
      updateField(fieldKey as any, customUrl.trim());
      setPreviewSrc(customUrl.trim());
      setIsModalOpen(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          updateField(fieldKey as any, reader.result);
          setPreviewSrc(reader.result);
          setIsModalOpen(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`relative group/img-wrapper ${aspectRatio || ''}`}>
      <img
        src={previewSrc || src}
        alt={alt}
        className={className}
        onError={(e) => {
          e.currentTarget.src = 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80';
        }}
      />

      {/* Edit Mode Hover Trigger Badge */}
      {isEditMode && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsModalOpen(true);
          }}
          className="absolute inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center opacity-0 group-hover/img-wrapper:opacity-100 transition-opacity cursor-pointer z-20 text-white font-bold text-xs"
        >
          <div className="bg-white/95 text-slate-900 px-3.5 py-2 rounded-xl shadow-xl flex items-center gap-2 hover:bg-white hover:scale-105 transition-all">
            <Camera className="w-4 h-4 text-[#006FCC]" />
            <span>{label}</span>
          </div>
        </button>
      )}

      {/* Image Selection Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl max-h-[85vh] flex flex-col text-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center text-[#006FCC]">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Select School Photograph</h3>
                  <p className="text-xs text-slate-500">Choose from verified high-res library, upload, or paste link</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 pt-3 border-b border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedTab('curated')}
                className={`px-3 py-1.5 text-xs font-bold rounded-t-lg transition-all cursor-pointer ${
                  selectedTab === 'curated'
                    ? 'text-[#006FCC] border-b-2 border-[#006FCC] bg-sky-50/50'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Photo Library
              </button>
              <button
                type="button"
                onClick={() => setSelectedTab('upload')}
                className={`px-3 py-1.5 text-xs font-bold rounded-t-lg transition-all cursor-pointer ${
                  selectedTab === 'upload'
                    ? 'text-[#006FCC] border-b-2 border-[#006FCC] bg-sky-50/50'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Upload File
              </button>
              <button
                type="button"
                onClick={() => setSelectedTab('url')}
                className={`px-3 py-1.5 text-xs font-bold rounded-t-lg transition-all cursor-pointer ${
                  selectedTab === 'url'
                    ? 'text-[#006FCC] border-b-2 border-[#006FCC] bg-sky-50/50'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Direct Image Link
              </button>
            </div>

            {/* Tab Body */}
            <div className="flex-1 overflow-y-auto py-4">
              {selectedTab === 'curated' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {CURATED_SCHOOL_PHOTOS.map((photo) => (
                    <button
                      key={photo.id}
                      type="button"
                      onClick={() => handleSelectCurated(photo.url)}
                      className="group/photo relative aspect-4/3 rounded-xl overflow-hidden border-2 border-slate-200 hover:border-[#006FCC] transition-all cursor-pointer text-left"
                    >
                      <img src={photo.url} alt={photo.title} className="w-full h-full object-cover group-hover/photo:scale-105 transition-transform" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2 text-white">
                        <span className="text-[10px] font-bold line-clamp-1">{photo.title}</span>
                        <span className="text-[8.5px] text-sky-200">{photo.category}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {selectedTab === 'upload' && (
                <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 text-center">
                  <Upload className="w-10 h-10 text-slate-400 mb-2" />
                  <p className="text-sm font-semibold text-slate-700">Choose a school image from your computer</p>
                  <p className="text-xs text-slate-400 mt-1 mb-4">PNG, JPG, WEBP up to 5MB</p>
                  <label className="px-4 py-2 bg-[#006FCC] hover:bg-[#005499] text-white font-bold text-xs rounded-xl cursor-pointer shadow-sm">
                    <span>Browse Files</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              )}

              {selectedTab === 'url' && (
                <div className="space-y-3 py-2">
                  <label className="block text-xs font-semibold text-slate-700">Enter Public Image URL</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      value={customUrl}
                      onChange={(e) => setCustomUrl(e.target.value)}
                      placeholder="https://example.com/school-campus.jpg"
                      className="flex-1 p-2.5 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#006FCC]"
                    />
                    <button
                      type="button"
                      onClick={handleApplyUrl}
                      className="px-4 py-2.5 bg-[#006FCC] hover:bg-[#005499] text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>Apply</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
