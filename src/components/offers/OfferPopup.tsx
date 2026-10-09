'use client';

import { useState, useEffect, useRef } from "react";
import { X, Sparkles, ArrowRight, Compass, Volume2, VolumeX, TrendingUp, Award, CheckCircle2 } from "lucide-react";
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

const STORAGE_KEY = "offer-popup-closed-v3";

const DEFAULT_POPUP: PromoItem = {
  id: "cseel-nextgen-preview",
  title: "Beyond Textbooks: Where Learning Becomes an Experience",
  content: "Move past one-way lectures and rote formulas. Turn your classrooms into dynamic innovation labs with 1,000+ experiments in Chemistry, Biology, Mathematics, Physics, as well as Robotics—where students don't just read science—they touch, test, and discover it.",
  cta_text: "Book Free School Demo",
  cta_link: "/get-support",
  video_id: "28rAN41mCDk",
  video_url: "https://www.youtube.com/embed/28rAN41mCDk",
  badge_text: "1,000+ STEM & Robotics Labs",
  accent_color: "#0284c7",
};

import { useMarketingCampaigns } from "@/features/marketing/useMarketingCampaigns";

const OfferPopup = () => {
  const { isSectionEnabled } = useHomepageCms();
  const { promotions, hydrated } = useMarketingCampaigns();
  const [item, setItem] = useState<PromoItem | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (!hydrated) return;

    const activePopup = promotions.find(
      (p) => p.is_active && (p.slot_id === 'slot_popup_modal' || p.type === 'popup')
    );

    if (!activePopup) {
      setIsOpen(false);
      setItem(null);
      return;
    }

    setItem({
      ...DEFAULT_POPUP,
      id: activePopup.id,
      title: activePopup.title || DEFAULT_POPUP.title,
      content: activePopup.content || DEFAULT_POPUP.content,
      cta_text: activePopup.cta_text || DEFAULT_POPUP.cta_text,
      cta_link: activePopup.cta_link || DEFAULT_POPUP.cta_link,
      badge_text: activePopup.badge_text || DEFAULT_POPUP.badge_text,
      accent_color: activePopup.accent_color || DEFAULT_POPUP.accent_color,
    });

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 900);

    return () => clearTimeout(timer);
  }, [promotions, hydrated]);

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

  const videoId = item?.video_id || "28rAN41mCDk";
  const videoSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${isMuted ? '1' : '0'}&controls=0&loop=1&playlist=${videoId}&rel=0&playsinline=1&enablejsapi=1`;

  return (
    <AnimatePresence>
      {isOpen && item && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          
          {/* Backdrop Blur & Neutral Dark Overlay */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={close}
            className="fixed inset-0 bg-[#0f172a]/70 backdrop-blur-sm z-0"
          />

          {/* Premium Warm Off-White Modal */}
          <motion.div
            key="popup-modal"
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: "spring", damping: 26, stiffness: 340 }}
            className="pointer-events-auto w-full max-w-[500px] bg-[#fafaf9] text-[#1c1917] rounded-3xl overflow-hidden shadow-2xl shadow-slate-900/40 border border-stone-200 relative z-10 my-auto"
          >
            {/* Top Navy-Cyan Accent Line */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#0f172a] via-[#0284c7] to-[#0ea5e9]" />

            {/* 16:9 Video Header Container */}
            <div className="relative w-full aspect-video bg-slate-900 overflow-hidden group">
              <iframe
                key={isMuted ? 'muted' : 'unmuted'}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[135%] h-[135%] object-cover opacity-95 pointer-events-none"
                src={videoSrc}
                title="CSEEL Hands-on STEM Science Labs"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />

              {/* Subtle Bottom Shade */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

              {/* Floating Frosted Glass Sound Toggle Button */}
              <button
                type="button"
                onClick={toggleSound}
                aria-label={isMuted ? "Unmute video sound" : "Mute video sound"}
                className={`absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md transition-all cursor-pointer z-20 border shadow-md active:scale-95 ${
                  isMuted
                    ? 'bg-slate-900/70 hover:bg-slate-900/90 text-white/90 border-white/20'
                    : 'bg-[#0284c7]/90 hover:bg-[#0284c7] text-white border-cyan-300/40 shadow-[0_0_12px_rgba(2,132,199,0.5)]'
                }`}
              >
                {isMuted ? (
                  <>
                    <VolumeX size={14} className="text-stone-300" />
                    <span>Sound Off</span>
                  </>
                ) : (
                  <>
                    <Volume2 size={14} className="text-white animate-pulse" />
                    <span>Sound ON</span>
                  </>
                )}
              </button>

              {/* Floating Frosted Glass Close Button */}
              <button
                type="button"
                onClick={close}
                aria-label="Close offer"
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-900/70 hover:bg-slate-900/95 text-white/90 hover:text-white backdrop-blur-md flex items-center justify-center transition-all cursor-pointer z-20 border border-white/20 shadow-md active:scale-95"
              >
                <X size={16} strokeWidth={2.5} />
              </button>

              {/* Badge Tag */}
              <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5 bg-black/65 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-[11px] font-semibold text-white tracking-wide">
                  {item.badge_text || "NEP 2020 Practical Framework"}
                </span>
              </div>
            </div>

            {/* Content & Conversion Area */}
            <div className="p-5 sm:p-6 pt-4 space-y-4">
              
              {/* Header & Hook */}
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-[11px] font-bold text-[#0284c7]">
                  <Sparkles size={12} className="text-[#0284c7]" />
                  <span>Experiential STEM Learning</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0f172a] leading-tight">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed pt-0.5">
                  {item.content}
                </p>
              </div>

              {/* 3 Proof & Metric Chips */}
              <div className="grid grid-cols-3 gap-2 pt-0.5">
                <div className="bg-white p-2.5 rounded-2xl border border-stone-200/90 shadow-sm flex flex-col items-center text-center">
                  <div className="flex items-center gap-1 text-[#0284c7] mb-0.5">
                    <TrendingUp size={13} strokeWidth={2.5} />
                    <span className="text-xs sm:text-sm font-extrabold">+68%</span>
                  </div>
                  <span className="text-[10px] font-bold text-stone-700 leading-tight">Retention Rate</span>
                  <span className="text-[8.5px] text-stone-500 leading-tight mt-0.5">Practical recall</span>
                </div>

                <div className="bg-white p-2.5 rounded-2xl border border-stone-200/90 shadow-sm flex flex-col items-center text-center">
                  <div className="flex items-center gap-1 text-[#0f172a] mb-0.5">
                    <Award size={13} strokeWidth={2.5} />
                    <span className="text-xs sm:text-sm font-extrabold">2.4x</span>
                  </div>
                  <span className="text-[10px] font-bold text-stone-700 leading-tight">Exam Scores</span>
                  <span className="text-[8.5px] text-stone-500 leading-tight mt-0.5">Application clarity</span>
                </div>

                <div className="bg-white p-2.5 rounded-2xl border border-stone-200/90 shadow-sm flex flex-col items-center text-center">
                  <div className="flex items-center gap-1 text-emerald-600 mb-0.5">
                    <CheckCircle2 size={13} strokeWidth={2.5} />
                    <span className="text-xs sm:text-sm font-extrabold">100%</span>
                  </div>
                  <span className="text-[10px] font-bold text-stone-700 leading-tight">Active Engagement</span>
                  <span className="text-[8.5px] text-stone-500 leading-tight mt-0.5">Zero passive memory</span>
                </div>
              </div>

              {/* Conversion CTAs */}
              <div className="space-y-2.5 pt-1">
                {item.cta_link && (
                  <Link
                    href={item.cta_link}
                    onClick={close}
                    className="w-full flex items-center justify-center gap-2 bg-[#0f172a] hover:bg-[#1e293b] text-white py-3.5 px-6 rounded-2xl font-bold text-sm sm:text-base shadow-lg shadow-slate-900/15 transition-all transform hover:-translate-y-0.5 active:scale-98 text-decoration-none group"
                  >
                    <span>{item.cta_text || "Book Free School Demo"}</span>
                    <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
                  </Link>
                )}

                {/* Secondary 360 Tour Quick Link & Dismiss */}
                <div className="flex items-center justify-between pt-1 px-1">
                  <Link
                    href="/virtual-lab-tour"
                    onClick={close}
                    className="inline-flex items-center gap-1.5 text-xs text-[#0284c7] hover:text-sky-700 font-bold transition-colors group"
                  >
                    <Compass size={14} className="text-[#0284c7] group-hover:rotate-45 transition-transform" />
                    <span>Explore 360° Virtual Lab</span>
                  </Link>

                  <button
                    type="button"
                    onClick={close}
                    className="text-xs text-stone-400 hover:text-stone-700 transition-colors cursor-pointer font-medium"
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