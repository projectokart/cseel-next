'use client';

import React from 'react';
import {
  Video,
  Trash2,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  Play
} from 'lucide-react';
import { VideoSectionBlock } from '@/types/experiment';

interface VideoSectionEditorProps {
  section: VideoSectionBlock;
  onChange: (updated: VideoSectionBlock) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete?: () => void;
}

function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

export const VideoSectionEditor: React.FC<VideoSectionEditorProps> = ({
  section,
  onChange,
  onMoveUp,
  onMoveDown,
  onDelete,
}) => {
  const handleUpdate = (field: keyof VideoSectionBlock, val: any) => {
    onChange({ ...section, [field]: val });
  };

  const embedUrl = getYouTubeEmbedUrl(section.videoUrl);

  const isCollapsed = !!section.isCollapsed;
  const toggleCollapse = () => {
    onChange({ ...section, isCollapsed: !isCollapsed });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden transition-all hover:border-slate-300">
      {/* ── Header ── */}
      <div className={`flex items-center justify-between px-4 py-2.5 bg-slate-50 ${!isCollapsed ? 'border-b border-slate-200' : ''}`}>
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-rose-50 text-rose-700">
            <Video className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={section.title}
            onChange={(e) => handleUpdate('title', e.target.value)}
            className="font-bold text-sm text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#005689] focus:outline-none px-1"
            placeholder="Section Title (e.g. Demonstration & Walkthrough Video)"
          />
          <span className="text-[10px] font-semibold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full">
            Video Block
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
        <div className="p-4 space-y-3">
        {/* Video URL Input */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            Video Source URL (YouTube / Vimeo / MP4):
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={section.videoUrl || ''}
              onChange={(e) => handleUpdate('videoUrl', e.target.value)}
              placeholder="e.g. https://www.youtube.com/watch?v=28rAN41mCDk"
              className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#005689] font-mono"
            />
          </div>
        </div>

        {/* Caption */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            Video Description / Caption:
          </label>
          <input
            type="text"
            value={section.caption || ''}
            onChange={(e) => handleUpdate('caption', e.target.value)}
            placeholder="Brief description of key observations captured in the recording..."
            className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#005689]"
          />
        </div>

        {/* Live Video Preview Box */}
        {embedUrl ? (
          <div className="rounded-xl overflow-hidden border border-slate-200 aspect-video max-w-lg mx-auto bg-black">
            <iframe
              src={embedUrl}
              title={section.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : section.videoUrl ? (
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-center text-xs text-slate-500">
            Direct video link configured: <span className="font-mono text-slate-700">{section.videoUrl}</span>
          </div>
        ) : (
          <div className="p-6 rounded-xl border border-dashed border-slate-300 text-center text-xs text-slate-400">
            Paste a YouTube URL above to view the interactive live player preview.
          </div>
        )}
      </div>
      )}
    </div>
  );
};

export default VideoSectionEditor;
