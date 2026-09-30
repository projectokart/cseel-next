'use client';

import { useEffect, useState, useRef, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NucleusLoader from "@/components/shared/NucleusLoader";

export default function TopProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [showAtomLoader, setShowAtomLoader] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const startTimeRef = useRef<number>(0);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const atomDebounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const safetyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const targetUrlRef = useRef<string>("");

  const clearTimers = () => {
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    if (atomDebounceTimerRef.current) clearTimeout(atomDebounceTimerRef.current);
    if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
  };

  const startLoading = (url: string = "") => {
    clearTimers();
    targetUrlRef.current = url;
    startTimeRef.current = Date.now();
    setIsFadingOut(false);
    setVisible(true);
    setLoading(true);
    setProgress(20);

    // Only show the full-screen modal atom loader if page transition takes >120ms
    atomDebounceTimerRef.current = setTimeout(() => {
      setShowAtomLoader(true);
    }, 120);

    // Dynamic, realistic progress ticker that continuously advances
    let current = 20;
    progressTimerRef.current = setInterval(() => {
      if (current < 55) {
        current += Math.floor(Math.random() * 12) + 8;
      } else if (current < 85) {
        current += Math.floor(Math.random() * 6) + 3;
      } else if (current < 95) {
        current += Math.floor(Math.random() * 2) + 1;
      } else if (current < 98) {
        current += 0.5;
      }
      setProgress(Math.min(Math.round(current), 98));
    }, 50);

    // Generous safety timeout (12s) for slow connections or dev cold-compiles
    safetyTimeoutRef.current = setTimeout(() => {
      finishLoading();
    }, 12000);
  };

  const finishLoading = useCallback(() => {
    clearTimers();

    // Fast leap to 100% completion
    setProgress(100);

    const t1 = setTimeout(() => {
      setIsFadingOut(true);

      const t2 = setTimeout(() => {
        setLoading(false);
        setVisible(false);
        setShowAtomLoader(false);
        setIsFadingOut(false);
        setProgress(0);
        targetUrlRef.current = "";
      }, 250);

      return () => clearTimeout(t2);
    }, 140);

    return () => clearTimeout(t1);
  }, []);

  // Track previous path to detect actual route transitions
  const currentPathString = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
  const prevPathRef = useRef(currentPathString);

  // When pathname or searchParams change (Route transition has completed)
  useEffect(() => {
    if (currentPathString !== prevPathRef.current) {
      prevPathRef.current = currentPathString;
      if (loading || visible) {
        requestAnimationFrame(() => {
          finishLoading();
        });
      }
    }
  }, [currentPathString, finishLoading, loading, visible]);

  // Intercept all internal navigation clicks across the entire app
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      // Ignore downloads, external URLs, hashes, protocol links & new tabs
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

      // If clicking current route, do not trigger loader
      const currentFullUrl = window.location.pathname + window.location.search;
      if (href === currentFullUrl || href === window.location.pathname) return;

      startLoading(href);
    };

    // Handle browser back/forward buttons
    const handlePopState = () => {
      startLoading();
    };

    document.addEventListener("click", handleAnchorClick, { capture: true });
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("click", handleAnchorClick, { capture: true });
      window.removeEventListener("popstate", handlePopState);
      clearTimers();
    };
  }, []);

  if (!visible) return null;

  return (
    <>
      {/* Top glowing progress line in CSEEL Action Blue */}
      <div
        className="fixed top-0 left-0 right-0 z-[999999] pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="h-[3.5px] bg-gradient-to-r from-[#003c6e] via-[#006fcc] to-cyan-400 shadow-[0_0_14px_rgba(0,111,204,0.95)] transition-all duration-150 ease-out"
          style={{
            width: `${progress}%`,
            opacity: visible ? 1 : 0,
          }}
        />
      </div>

      {/* Screen-Centered Animated Atom Science Loader only when fetch is non-instant (>120ms) */}
      {showAtomLoader && (
        <div
          className={`fixed inset-0 z-[999990] flex items-center justify-center bg-white/80 dark:bg-slate-950/80 backdrop-blur-xs pointer-events-none select-none transition-opacity duration-250 ${
            isFadingOut ? "opacity-0" : "opacity-100"
          }`}
          style={{
            animation: isFadingOut ? "none" : "fadeInLoader 0.15s ease-out forwards",
          }}
        >
          <NucleusLoader progress={progress} />
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeInLoader {
          from {
            opacity: 0;
            transform: scale(0.97);
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
