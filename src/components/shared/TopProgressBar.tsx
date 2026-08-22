'use client';

import { useEffect, useState, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NucleusLoader from "@/components/shared/NucleusLoader";

export default function TopProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const safetyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const minDisplayTime = 400; // Minimum time (ms) loader is displayed for smooth visual experience

  const finishLoading = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);

    const elapsed = Date.now() - startTimeRef.current;
    const remainingTime = Math.max(minDisplayTime - elapsed, 0);

    const t1 = setTimeout(() => {
      setProgress(100);

      const t2 = setTimeout(() => {
        setIsFadingOut(true);

        const t3 = setTimeout(() => {
          setLoading(false);
          setVisible(false);
          setIsFadingOut(false);
          setProgress(0);
        }, 250);

        return () => clearTimeout(t3);
      }, 150);

      return () => clearTimeout(t2);
    }, remainingTime);

    return () => clearTimeout(t1);
  };

  // When pathname or searchParams change (Route has loaded successfully)
  useEffect(() => {
    if (loading) {
      finishLoading();
    }
  }, [pathname, searchParams]);

  // Intercept internal link clicks to trigger smooth fluid transition
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      // ── CRITICAL: Ignore file downloads, data/blob URLs, and non-navigation links ──
      if (
        target.hasAttribute("download") ||
        target.hasAttribute("data-skip-progress") ||
        href.startsWith("blob:") ||
        href.startsWith("data:") ||
        href.startsWith("javascript:") ||
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("#") ||
        href.startsWith("/api/") ||
        href.includes(".csv") ||
        href.includes(".pdf") ||
        href.includes(".xlsx") ||
        href.includes(".zip") ||
        target.getAttribute("target") === "_blank" ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey
      ) {
        return;
      }

      // If clicking current route, ignore
      const currentFullUrl = window.location.pathname + window.location.search;
      if (href === currentFullUrl) return;

      // Start smooth transition
      startTimeRef.current = Date.now();
      setIsFadingOut(false);
      setVisible(true);
      setLoading(true);
      setProgress(20);

      if (timerRef.current) clearInterval(timerRef.current);
      if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);

      // Smooth progress progression
      let currentProgress = 20;
      timerRef.current = setInterval(() => {
        currentProgress += Math.floor(Math.random() * 15) + 10;
        if (currentProgress >= 88) {
          currentProgress = 88;
          if (timerRef.current) clearInterval(timerRef.current);
        }
        setProgress(currentProgress);
      }, 70);

      // ── SAFETY FALLBACK: Auto-dismiss loader after 2.5 seconds if no route change occurs ──
      safetyTimeoutRef.current = setTimeout(() => {
        finishLoading();
      }, 2500);
    };

    document.addEventListener("click", handleAnchorClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleAnchorClick, { capture: true });
      if (timerRef.current) clearInterval(timerRef.current);
      if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
    };
  }, []);

  if (!visible) return null;

  return (
    <>
      {/* Top glowing progress bar in CSEEL Action Blue */}
      <div
        className="fixed top-0 left-0 right-0 z-[999999] pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="h-[3.5px] bg-gradient-to-r from-[#003c6e] via-[#006fcc] to-cyan-400 shadow-[0_0_12px_rgba(0,111,204,0.9)] transition-all duration-200 ease-out"
          style={{
            width: `${progress}%`,
            opacity: visible ? 1 : 0,
          }}
        />
      </div>

      {/* Screen-Centered Animated Atom Science Loader with Fluid Fade In/Out */}
      <div
        className={`fixed inset-0 z-[999990] flex items-center justify-center bg-white/85 dark:bg-slate-950/85 backdrop-blur-sm pointer-events-none select-none transition-opacity duration-300 ${
          isFadingOut ? "opacity-0" : "opacity-100"
        }`}
        style={{
          animation: isFadingOut ? "none" : "fadeInLoader 0.2s ease-out forwards",
        }}
      >
        <NucleusLoader progress={progress} />
      </div>

      <style jsx global>{`
        @keyframes fadeInLoader {
          from {
            opacity: 0;
            transform: scale(0.98);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
}
