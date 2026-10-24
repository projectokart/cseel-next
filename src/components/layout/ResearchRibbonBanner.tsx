'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const STORAGE_KEY = 'cseel_research_ribbon_dismissed_2026';

export default function ResearchRibbonBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const dismissed = sessionStorage.getItem(STORAGE_KEY);
        if (!dismissed) {
          setIsVisible(true);
        }
      }
    } catch {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(STORAGE_KEY, 'true');
      }
    } catch {}
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="navbar_topbar_banner_main_wrap relative z-[450] overflow-hidden select-none"
        >
          <div className="relative bg-[#001C33] overflow-hidden border-b border-white/10">
            {/* Background Texture Image */}
            <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen">
              <img
                src="https://cdn.prod.website-files.com/63105b5082760e06eb992f00/68b466e0b22ee95bf91b60f2_56c73f8d1865725ddaaa3f2717ffa8d1_labster_banner_bg.avif"
                alt=""
                className="w-full h-full object-cover object-center"
              />
            </div>

            <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 py-1.5 sm:py-2 relative z-10">
              <div className="flex items-center justify-between gap-3">
                
                {/* Left Visual + Content Wrap */}
                <div className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0">
                  {/* Report Cover Booklet Graphic */}
                  <div className="shrink-0 w-6 h-8 sm:w-7 sm:h-9 rounded shadow-xs overflow-hidden bg-[#002F56] border border-white/20">
                    <img
                      src="https://cdn.prod.website-files.com/63105b5082760e06eb992f00/6a67c361b02dca4f0f089fec_Frame%201000002796.png"
                      alt="Cover of 'The Confidence Effect'"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Title and Subtext */}
                  <div className="min-w-0">
                    <Link
                      href="/research"
                      className="group block"
                    >
                      <h2 className="text-[12px] sm:text-[13px] font-bold text-white tracking-[0.16px] group-hover:text-[#66A9E0] transition-colors truncate font-['Hanken_Grotesk',sans-serif] leading-tight">
                        What Keeps Online STEM Students Enrolled | CSEEL Empirical Research
                      </h2>
                      <p className="text-[11px] sm:text-[11.5px] text-[#CCE2F5]/90 line-clamp-1 font-normal font-['Lato',sans-serif] mt-0.5">
                        New research surveyed 400+ online and hybrid STEM students to reveal what drives persistence and retention, and why experiential learning is the key.
                      </p>
                    </Link>
                  </div>
                </div>

                {/* Right Action CTA + Close Dismiss Button */}
                <div className="flex items-center gap-2.5 shrink-0">
                  <Link
                    href="/research"
                    className="hidden sm:inline-flex items-center justify-center px-3 py-1 rounded-[10px] bg-white hover:bg-[#F7F8F8] text-[#001C33] hover:text-[#006FCC] text-[11.5px] font-bold font-['Montserrat',sans-serif] shadow-xs transition-all active:scale-[0.98] whitespace-nowrap cursor-pointer"
                  >
                    Read the report
                  </Link>

                  <button
                    type="button"
                    onClick={handleDismiss}
                    aria-label="Close banner"
                    className="p-1 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    title="Dismiss"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.53464 25.3332L6.66797 23.4665L14.1346 15.9998L6.66797 8.53317L8.53464 6.6665L16.0013 14.1332L23.468 6.6665L25.3346 8.53317L17.868 15.9998L25.3346 23.4665L23.468 25.3332L16.0013 17.8665L8.53464 25.3332Z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                </div>

              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
