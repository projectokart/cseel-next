'use client';

import React, { useState } from 'react';
import { Play, Video, Edit3, Check, X, ExternalLink } from 'lucide-react';

export interface SchoolCampusTourSectionProps {
  displayName: string;
  videoUrl?: string;
  isEditMode?: boolean;
  onUpdateVideoUrl?: (url: string) => void;
}

/**
 * Extracts a standard YouTube embed URL from various YouTube link formats
 * (watch?v=, youtu.be/, embed/, shorts/, or raw 11-char ID)
 */
export function extractYouTubeEmbedUrl(inputUrl: string | undefined): string {
  if (!inputUrl) return 'https://www.youtube.com/embed/ScMzIvxBSi4'; // Default clean tour embed
  const url = inputUrl.trim();
  if (!url) return 'https://www.youtube.com/embed/ScMzIvxBSi4';

  // Already embed URL
  if (url.includes('youtube.com/embed/')) {
    return url;
  }

  // youtu.be/ID
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (shortMatch && shortMatch[1]) {
    return `https://www.youtube.com/embed/${shortMatch[1]}`;
  }

  // youtube.com/watch?v=ID
  const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (watchMatch && watchMatch[1]) {
    return `https://www.youtube.com/embed/${watchMatch[1]}`;
  }

  // youtube.com/shorts/ID
  const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
  if (shortsMatch && shortsMatch[1]) {
    return `https://www.youtube.com/embed/${shortsMatch[1]}`;
  }

  // Direct 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return `https://www.youtube.com/embed/${url}`;
  }

  return url;
}

export default function SchoolCampusTourSection({
  displayName,
  videoUrl,
  isEditMode = false,
  onUpdateVideoUrl,
}: SchoolCampusTourSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputUrl, setInputUrl] = useState(videoUrl || '');

  const effectiveEmbedUrl = extractYouTubeEmbedUrl(videoUrl);

  const handleSave = () => {
    if (onUpdateVideoUrl) {
      onUpdateVideoUrl(inputUrl);
    }
    setIsEditing(false);
  };

  return (
    <section id="campus-tour" className="py-12 sm:py-16 bg-[#F8FAFC] border-t border-slate-100 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#005689] bg-[#EDF5FA] border border-[#D6EDFF] px-3.5 py-1.5 rounded-full mb-3">
            <span className="w-2 h-2 bg-[#FBBC04] rounded-full inline-block" />
            <span className="flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5 text-[#005689]" />
              CAMPUS TOUR
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-950 tracking-tight leading-tight">
            Virtual Campus Tour of{' '}
            <span className="text-[#005689]">{displayName}</span>
          </h2>

          <p className="text-xs sm:text-sm text-gray-600 mt-2.5 max-w-2xl mx-auto">
            Take a visual tour of our classrooms, experiential labs, sports grounds, and school environment from anywhere.
          </p>

          {/* Edit Mode Control */}
          {isEditMode && (
            <div className="mt-4 flex justify-center">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => {
                    setInputUrl(videoUrl || '');
                    setIsEditing(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-xs cursor-pointer transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#005689]" />
                  <span>Change YouTube Tour Video</span>
                </button>
              ) : (
                <div className="flex flex-col sm:flex-row items-center gap-2 bg-white p-3 rounded-2xl border border-blue-200 shadow-md max-w-xl w-full">
                  <input
                    type="url"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="Paste YouTube Video URL (e.g. https://www.youtube.com/watch?v=...)"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={handleSave}
                      className="px-3 py-2 bg-[#005689] hover:bg-[#003c6e] text-white rounded-lg text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3 h-3" />
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* The YouTube Video (Clean Bold Frame matching Hero Ring style) */}
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-[28px] sm:rounded-[38px] overflow-hidden bg-slate-950 shadow-2xl border-[6px] sm:border-[10px] border-[#005689] aspect-video group">
            <iframe
              className="w-full h-full border-0"
              src={effectiveEmbedUrl}
              title={`${displayName} Campus Video Tour`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>

      </div>
    </section>
  );
}
