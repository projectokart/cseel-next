'use client';

import React, { useState } from 'react';
import { Share2, Check, MessageCircle, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ShareButtonProps {
  title: string;
  text?: string;
  url?: string;
  variant?: 'pill' | 'icon' | 'outline' | 'ghost';
  size?: 'xs' | 'sm' | 'md';
  className?: string;
  showWhatsApp?: boolean;
  onShareSuccess?: (msg: string) => void;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  title,
  text,
  url,
  variant = 'pill',
  size = 'sm',
  className = '',
  showWhatsApp = true,
  onShareSuccess,
}) => {
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const getFullUrl = () => {
    if (typeof window === 'undefined') return url || '';
    if (!url) return window.location.href;
    if (url.startsWith('http')) return url;
    return `${window.location.origin}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const fullUrl = getFullUrl();
    const shareText = text ? `${title}\n${text}\n\n${fullUrl}` : `${title}\n\n${fullUrl}`;

    // 1. Try Native Mobile/Modern Web Share API if available
    if (typeof navigator !== 'undefined' && navigator.share && /mobile|android|iphone|ipad/i.test(navigator.userAgent)) {
      try {
        await navigator.share({
          title,
          text: text || title,
          url: fullUrl,
        });
        if (onShareSuccess) onShareSuccess('Shared successfully!');
        return;
      } catch (err: any) {
        if (err.name === 'AbortError') return; // User closed share sheet
      }
    }

    // 2. Fallback: Copy clean link to clipboard
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(fullUrl);
        setCopied(true);
        setShowToast(true);
        if (onShareSuccess) onShareSuccess('Link copied to clipboard!');
        setTimeout(() => {
          setCopied(false);
          setShowToast(false);
        }, 2200);
      }
    } catch (err) {
      console.error('Failed to copy share link', err);
    }
  };

  const handleWhatsAppShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const fullUrl = getFullUrl();
    const waText = encodeURIComponent(`*${title}*\n${text ? text + '\n' : ''}${fullUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${waText}`, '_blank');
  };

  // Sizing styles
  const sizeClasses = {
    xs: 'px-2 py-1 text-[10px] gap-1',
    sm: 'px-2.5 py-1 text-xs gap-1.5',
    md: 'px-3.5 py-1.5 text-xs font-bold gap-2',
  };

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
  };

  // Variant styling
  const variantClasses = {
    pill: 'bg-slate-100/90 hover:bg-slate-200/90 text-gray-700 font-bold border border-gray-200/80 rounded-full shadow-2xs active:scale-95',
    icon: 'p-1.5 bg-slate-50 hover:bg-slate-100 text-gray-600 hover:text-gray-900 border border-gray-200 rounded-xl shadow-2xs active:scale-95',
    outline: 'bg-white hover:bg-slate-50 text-gray-700 font-bold border border-gray-300 rounded-xl shadow-2xs active:scale-95',
    ghost: 'hover:bg-slate-100 text-gray-500 hover:text-gray-900 rounded-lg',
  };

  return (
    <div className="relative inline-flex items-center gap-1">
      {/* Main Share Button */}
      <button
        type="button"
        onClick={handleShare}
        className={`inline-flex items-center justify-center transition-all ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
        title="Share link"
      >
        {copied ? (
          <>
            <Check className={`${iconSizes[size]} text-emerald-600`} />
            {variant !== 'icon' && <span className="text-emerald-700 font-black">Copied!</span>}
          </>
        ) : (
          <>
            <Share2 className={`${iconSizes[size]} text-gray-500 group-hover:text-gray-700`} />
            {variant !== 'icon' && <span>Share</span>}
          </>
        )}
      </button>

      {/* Optional WhatsApp Quick Share icon */}
      {showWhatsApp && (
        <button
          type="button"
          onClick={handleWhatsAppShare}
          className="p-1 sm:p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full transition-all active:scale-95 shadow-2xs shrink-0"
          title="Share directly via WhatsApp"
        >
          <MessageCircle className={`${iconSizes[size]} fill-emerald-600 text-emerald-600`} />
        </button>
      )}

      {/* Floating Animated Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.9 }}
            className="absolute -top-9 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-xl whitespace-nowrap border border-slate-700 flex items-center gap-1 pointer-events-none"
          >
            <Check className="w-3 h-3 text-emerald-400" />
            <span>Link Copied!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShareButton;
