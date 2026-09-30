'use client';

import { useState, useEffect, useRef } from "react";
import { X, Sparkles, ArrowRight, Compass, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/integrations/supabase/client";
import { useHomepageCms } from "@/features/homepage-cms/hooks/useHomepageCms";

interface PromoItem {
  id?: string;
  title: string;
  content: string;
  cta_text?: string | null;
  cta_link?: string | null;
  accent_color?: string;
  video_id?: string;
  video_url?: string | null;
  badge_text?: string | null;
}

const STORAGE_KEY = "offer-popup-closed-v2";

const DEFAULT_POPUP: PromoItem = {
  id: "cseel-nextgen-preview",
  title: "Experience Next-Gen Science!",
  content: "Discovery Lab teaches children science with hands-on educational experiments. <strong class=\"text-cyan-400 font-semibold\">Book a free school demo</strong> today!",
  cta_text: "Book Free Demo Now",
  cta_link: "/get-support",
  video_id: "28rAN41mCDk",
  video_url: "https://www.youtube.com/embed/28rAN41mCDk",
  badge_text: "Live CSEEL Lab Preview",
  accent_color: "#06b6d4",
};

const OfferPopup = () => {
  const { isSectionEnabled } = useHomepageCms();
  const [item, setItem] = useState<PromoItem | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const hasLoaded = useRef(false);

  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;

    try {
      if (typeof window !== 'undefined') {
        const closed = localStorage.getItem(STORAGE_KEY);
        if (closed) {
          const hoursAgo = (Date.now() - Number(closed)) / 3600000;
          if (hoursAgo < 12) return; // Re-show after 12 hours for visitors
        }
      }
    } catch {}

    const loadPromo = async () => {
      try {
        const { data } = await (supabase as any)
          .from("promotions")
          .select("id,title,content,cta_text,cta_link,accent_color,image_url")
          .eq("type", "popup")
          .eq("is_active", true)
          .order("sort_order")
          .limit(1)
          .single();

        if (data && data.title) {
          setItem({
            ...DEFAULT_POPUP,
            ...data,
          });
        } else {
          setItem(DEFAULT_POPUP);
        }
      } catch {
        setItem(DEFAULT_POPUP);
      } finally {
        // Show smoothly after 1.8 seconds delay
        setTimeout(() => {
          setIsOpen(true);
        }, 1800);
      }
    };

    loadPromo();
  }, []);

  const close = () => {
    setIsOpen(false);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, String(Date.now()));
      }
    } catch {}
  };

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted((prev) => !prev);
  };

  if (!isSectionEnabled('offer_popup') && isSectionEnabled('offer_popup') !== undefined) {
    return null;
  }

  const videoSrc = item?.video_id
    ? `https://www.youtube.com/embed/${item.video_id}?autoplay=1&mute=${isMuted ? '1' : '0'}&controls=0&loop=1&playlist=${item.video_id}&rel=0&playsinline=1&enablejsapi=1`
    : `https://www.youtube.com/embed/28rAN41mCDk?autoplay=1&mute=${isMuted ? '1' : '0'}&controls=0&loop=1&playlist=28rAN41mCDk&rel=0&playsinline=1&enablejsapi=1`;

  return (
    <AnimatePresence>
      {isOpen && item && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          
          {/* Backdrop Blur & Dark Gradient */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={close}
            className="fixed inset-0 bg-black/75 backdrop-blur-md z-0"
          />

          {/* Premium Neon Dark Modal */}
          <motion.div
            key="popup-modal"
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: "spring", damping: 25, stiffness: 320 }}
            className="pointer-events-auto w-full max-w-[490px] bg-slate-950 text-white rounded-3xl overflow-hidden shadow-2xl shadow-cyan-950/60 border border-cyan-500/30 relative z-10 my-auto"
          >
            {/* Top Neon Accent Glow Line */}
            <div className="h-1.5 w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-[#006fcc] shadow-[0_0_18px_rgba(6,182,212,0.85)]" />

            {/* Sound Toggle Button */}
            <button
              onClick={toggleSound}
              aria-label={isMuted ? "Unmute video sound" : "Mute video sound"}
              className={`absolute top-3.5 left-3.5 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer z-20 border shadow-md hover:scale-105 active:scale-95 ${
                isMuted
                  ? 'bg-slate-900/85 hover:bg-slate-800 text-slate-300 border-slate-700/80'
                  : 'bg-cyan-950/90 hover:bg-cyan-900 text-cyan-300 border-cyan-500/60 shadow-[0_0_12px_rgba(6,182,212,0.5)]'
              }`}
            >
              {isMuted ? (
                <>
                  <VolumeX size={14} className="text-slate-400" />
                  <span>Sound Off</span>
                </>
              ) : (
                <>
                  <Volume2 size={14} className="text-cyan-400 animate-pulse" />
                  <span>Sound ON</span>
                </>
              )}
            </button>

            {/* Close Button */}
            <button
              onClick={close}
              aria-label="Close offer"
              className="absolute top-3.5 right-3.5 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-900/85 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer z-20 border border-slate-700/80 shadow-md hover:scale-105 active:scale-95"
            >
              <X size={17} strokeWidth={2.5} />
            </button>

            {/* YouTube / Media Video Container (Autoplay & Loop with interactive Sound) */}
            <div className="relative w-full h-[210px] sm:h-[240px] bg-slate-900 overflow-hidden">
              <iframe
                key={isMuted ? 'muted' : 'unmuted'}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] object-cover opacity-90 pointer-events-none"
                src={videoSrc}
                title="Discovery Lab Science Experiments"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />

              {/* Gradient Overlay for seamless dark integration */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent pointer-events-none" />

              {/* Floating Live Badge */}
              <div className="absolute bottom-3 left-4 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-cyan-500/40 shadow-lg pointer-events-none">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
                <span className="text-[11px] sm:text-xs font-bold text-cyan-300 tracking-wider uppercase">
                  {item.badge_text || "Live CSEEL Lab Preview"}
                </span>
              </div>
            </div>

            {/* Content & Call to Action Area */}
            <div className="p-5 sm:p-6 pt-3 space-y-4">
              
              {/* Header */}
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-[11px] font-bold text-cyan-300">
                  <Sparkles size={12} className="text-cyan-400" />
                  <span>Interactive Science Education</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-snug">
                  {item.title}
                </h3>
              </div>

              {/* Description */}
              <div
                className="text-xs sm:text-sm text-slate-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: item.content }}
              />

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-1">
                {item.cta_link && (
                  <Link
                    href={item.cta_link}
                    onClick={close}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 via-[#006fcc] to-[#0a5c8a] hover:from-cyan-500 hover:via-[#0080eb] hover:to-[#084b71] text-white py-3.5 px-6 rounded-2xl font-bold text-sm sm:text-base shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 active:scale-98 border border-cyan-400/30 text-decoration-none group"
                  >
                    <span>{item.cta_text || "Book Free Demo Now"}</span>
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
                  </Link>
                )}

                {/* Secondary 360 Tour Quick Link */}
                <div className="flex items-center justify-between pt-1 px-1">
                  <Link
                    href="/virtual-lab-tour"
                    onClick={close}
                    className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold transition-colors group"
                  >
                    <Compass size={14} className="text-cyan-400 group-hover:rotate-45 transition-transform" />
                    <span>Explore 360° Virtual Lab</span>
                  </Link>

                  <button
                    type="button"
                    onClick={close}
                    className="text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  >
                    Maybe later
                  </button>
                </div>
              </div>

            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default OfferPopup;