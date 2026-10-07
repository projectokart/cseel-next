'use client';

import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  LayoutGrid,
  SlidersHorizontal,
  Maximize2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { GallerySectionBlock, GalleryDisplayMode, GalleryImage } from '@/types/experiment';

interface GallerySectionEditorProps {
  section: GallerySectionBlock;
  onChange: (updated: GallerySectionBlock) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete?: () => void;
}

export const GallerySectionEditor: React.FC<GallerySectionEditorProps> = ({
  section,
  onChange,
  onMoveUp,
  onMoveDown,
  onDelete,
}) => {
  const [sliderIndex, setSliderIndex] = useState(0);

  const handleUpdateTitle = (title: string) => {
    onChange({ ...section, title });
  };

  const handleModeChange = (displayMode: GalleryDisplayMode) => {
    onChange({ ...section, displayMode });
  };

  const handleAddImage = () => {
    const newId = `img-${Date.now().toString(36)}`;
    const newImg: GalleryImage = {
      id: newId,
      url: '/images/categories/chemistry.jpg',
      title: 'Apparatus Detail',
      caption: '',
    };
    onChange({ ...section, images: [...section.images, newImg] });
  };

  const handleUpdateImage = (id: string, field: keyof GalleryImage, val: string) => {
    const updated = section.images.map((img) => {
      if (img.id === id) {
        return { ...img, [field]: val };
      }
      return img;
    });
    onChange({ ...section, images: updated });
  };

  const handleDeleteImage = (id: string) => {
    const updated = section.images.filter((img) => img.id !== id);
    onChange({ ...section, images: updated });
    if (sliderIndex >= updated.length && updated.length > 0) {
      setSliderIndex(updated.length - 1);
    }
  };

  const isCollapsed = !!section.isCollapsed;
  const toggleCollapse = () => {
    onChange({ ...section, isCollapsed: !isCollapsed });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden transition-all hover:border-slate-300">
      {/* ── Header ── */}
      <div className={`flex items-center justify-between px-4 py-2.5 bg-slate-50 ${!isCollapsed ? 'border-b border-slate-200' : ''}`}>
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-sky-50 text-sky-700">
            <ImageIcon className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={section.title}
            onChange={(e) => handleUpdateTitle(e.target.value)}
            className="font-bold text-sm text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#005689] focus:outline-none px-1"
            placeholder="Section Title (e.g. Visual Gallery & Apparatus Documentation)"
          />
          <span className="text-[10px] font-semibold bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full capitalize">
            {section.displayMode} Gallery Block
          </span>
          {isCollapsed && (
            <span className="text-[11px] font-medium text-slate-400 italic hidden sm:inline">
              (Collapsed — click Expand to edit)
            </span>
          )}
        </div>

        {/* Section Ordering & Delete Controls */}
        <div className="flex items-center gap-1.5">
          {onMoveUp && (
            <button
              type="button"
              onClick={onMoveUp}
              className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded transition-colors"
              title="Move Up"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          )}
          {onMoveDown && (
            <button
              type="button"
              onClick={onMoveDown}
              className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded transition-colors"
              title="Move Down"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          )}

          {/* Collapse / Expand Toggle */}
          <button
            type="button"
            onClick={toggleCollapse}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              isCollapsed
                ? 'bg-[#005689] text-white hover:bg-[#003c6e] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-200 border border-slate-200'
            }`}
            title={isCollapsed ? 'Expand this section' : 'Collapse this section'}
          >
            {isCollapsed ? (
              <>
                <ChevronDown className="w-3.5 h-3.5 text-cyan-200" />
                <span>Expand</span>
              </>
            ) : (
              <>
                <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
                <span>Collapse</span>
              </>
            )}
          </button>

          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors ml-1"
              title="Delete Section"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {!isCollapsed && (
        <div className="p-4 space-y-4">
        {/* ── Display Mode Selector (Single / Multi-Grid / Slider) ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
          <div>
            <span className="text-xs font-bold text-slate-700 block">Select Gallery Layout Version:</span>
            <span className="text-[11px] text-slate-500">Configure how images appear to students</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleModeChange('single')}
              className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                section.displayMode === 'single'
                  ? 'bg-[#005689] text-white border-[#005689] shadow-xs'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Single Large</span>
            </button>

            <button
              type="button"
              onClick={() => handleModeChange('grid')}
              className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                section.displayMode === 'grid'
                  ? 'bg-[#005689] text-white border-[#005689] shadow-xs'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Multi-Grid</span>
            </button>

            <button
              type="button"
              onClick={() => handleModeChange('slider')}
              className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                section.displayMode === 'slider'
                  ? 'bg-[#005689] text-white border-[#005689] shadow-xs'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Slider / Carousel</span>
            </button>
          </div>
        </div>

        {/* ── Image Cards List ── */}
        <div className="space-y-3">
          {section.images.map((img, idx) => (
            <div
              key={img.id}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl shadow-2xs hover:border-slate-300 transition-all"
            >
              <div className="w-20 h-16 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center relative group">
                <img
                  src={img.url}
                  alt={img.title || 'Image'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <span className="absolute top-1 left-1 bg-black/60 text-white font-mono text-[9px] px-1 rounded">
                  #{idx + 1}
                </span>
              </div>

              <div className="flex-1 space-y-1.5 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={img.title || ''}
                    onChange={(e) => handleUpdateImage(img.id, 'title', e.target.value)}
                    placeholder="Image Title (e.g. Retort Stand Setup)..."
                    className="text-xs font-bold text-slate-800 p-1.5 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-[#005689]"
                  />
                  <input
                    type="text"
                    value={img.url}
                    onChange={(e) => handleUpdateImage(img.id, 'url', e.target.value)}
                    placeholder="Image URL (/images/... or https://)..."
                    className="text-xs font-mono text-slate-600 p-1.5 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-[#005689]"
                  />
                </div>
                <input
                  type="text"
                  value={img.caption || ''}
                  onChange={(e) => handleUpdateImage(img.id, 'caption', e.target.value)}
                  placeholder="Caption explaining the visual apparatus or observation..."
                  className="w-full text-xs text-slate-600 p-1.5 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-[#005689]"
                />
              </div>

              <button
                type="button"
                onClick={() => handleDeleteImage(img.id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors self-end sm:self-center"
                title="Delete Image"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleAddImage}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 rounded-lg text-xs font-bold transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Image to Gallery</span>
        </button>

        {/* ── Live Interactive Preview of the Chosen Version ── */}
        {section.images.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-200">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Live Preview: {section.displayMode.toUpperCase()} VIEW
            </span>

            {/* Version 1: Single Hero Mode */}
            {section.displayMode === 'single' && (
              <div className="max-w-xl mx-auto rounded-xl overflow-hidden border border-slate-200 bg-slate-900 text-white shadow-md">
                <div className="aspect-video relative">
                  <img
                    src={section.images[0]?.url}
                    alt={section.images[0]?.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3 bg-slate-900/90 border-t border-slate-800">
                  <p className="font-bold text-xs text-white">{section.images[0]?.title}</p>
                  <p className="text-[11px] text-slate-300">{section.images[0]?.caption}</p>
                </div>
              </div>
            )}

            {/* Version 2: Multi-Grid Mode */}
            {section.displayMode === 'grid' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {section.images.map((img) => (
                  <div
                    key={img.id}
                    className="rounded-xl overflow-hidden border border-slate-200 bg-white shadow-2xs group"
                  >
                    <div className="aspect-4/3 overflow-hidden bg-slate-100">
                      <img
                        src={img.url}
                        alt={img.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-2">
                      <p className="text-xs font-bold text-slate-800 truncate">{img.title}</p>
                      <p className="text-[10px] text-slate-500 truncate">{img.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Version 3: Slider / Carousel Mode */}
            {section.displayMode === 'slider' && (
              <div className="relative max-w-xl mx-auto rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shadow-md">
                <div className="aspect-video relative">
                  <img
                    src={section.images[sliderIndex]?.url}
                    alt={section.images[sliderIndex]?.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Left / Right Carousel Arrows */}
                  <button
                    type="button"
                    onClick={() =>
                      setSliderIndex((prev) => (prev === 0 ? section.images.length - 1 : prev - 1))
                    }
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setSliderIndex((prev) => (prev === section.images.length - 1 ? 0 : prev + 1))
                    }
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-3 bg-slate-900 text-white flex items-center justify-between border-t border-slate-800">
                  <div>
                    <p className="font-bold text-xs">{section.images[sliderIndex]?.title}</p>
                    <p className="text-[11px] text-slate-300">{section.images[sliderIndex]?.caption}</p>
                  </div>
                  <span className="text-[10px] font-mono bg-white/20 px-2 py-0.5 rounded text-white shrink-0">
                    {sliderIndex + 1} / {section.images.length}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      )}
    </div>
  );
};

export default GallerySectionEditor;
