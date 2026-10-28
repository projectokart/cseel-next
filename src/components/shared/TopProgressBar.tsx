'use client';

import { useEffect, useState, useRef, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function TopProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimers = () => {
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
  };

  const startLoading = () => {
    clearTimers();
    setVisible(true);
    setProgress(25);

    let current = 25;
    progressTimerRef.current = setInterval(() => {
      if (current < 70) {
        current += 15;
      } else if (current < 90) {
        current += 5;
      } else if (current < 98) {
        current += 1;
      }
      setProgress(Math.min(Math.round(current), 98));
    }, 40);
  };

  const finishLoading = useCallback(() => {
    clearTimers();
    setProgress(100);

    const t = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 200);

    return () => clearTimeout(t);
  }, []);

  const currentPathString = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
  const prevPathRef = useRef(currentPathString);

  // When route changes, complete loading
  useEffect(() => {
    if (currentPathString !== prevPathRef.current) {
      prevPathRef.current = currentPathString;
      finishLoading();
    }
  }, [currentPathString, finishLoading]);

  // Lock body scroll when overlay is visible
  useEffect(() => {
    if (visible) {
      const originalOverflow = document.body.style.overflow;
      const originalTouchAction = document.body.style.touchAction;

      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.touchAction = originalTouchAction;
      };
    }
  }, [visible]);

  // Trap keyboard focus when visible
  useEffect(() => {
    if (visible) {
      containerRef.current?.focus();

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Tab") {
          e.preventDefault();
          containerRef.current?.focus();
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [visible]);

  // Intercept navigation clicks
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
        target.getAttribute("target") === "_blank" ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey
      ) {
        return;
      }

      const currentFullUrl = window.location.pathname + window.location.search;
      if (href === currentFullUrl || href === window.location.pathname) return;

      startLoading();
    };

    const handlePopState = () => {
      startLoading();
    };

    document.addEventListener("click", handleAnchorClick, { capture: true });
    window.addEventListener("popstate", handlePopState);

    // Initial page load check
    if (typeof document !== "undefined" && document.readyState !== "complete") {
      startLoading();
      const handleLoad = () => {
        finishLoading();
      };
      window.addEventListener("load", handleLoad, { once: true });
      const safetyTimer = setTimeout(() => {
        finishLoading();
      }, 700);

      return () => {
        document.removeEventListener("click", handleAnchorClick, { capture: true });
        window.removeEventListener("popstate", handlePopState);
        window.removeEventListener("load", handleLoad);
        clearTimeout(safetyTimer);
        clearTimers();
      };
    }

    return () => {
      document.removeEventListener("click", handleAnchorClick, { capture: true });
      window.removeEventListener("popstate", handlePopState);
      clearTimers();
    };
  }, [finishLoading]);

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      tabIndex={-1}
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="outline-none"
    >
      {/* ── Thin Top Progress Bar with Google-Color Gradient (scaleX animation) ── */}
      <div
        className="fixed top-0 left-0 right-0 z-[999999] pointer-events-none h-[2.5px] overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="h-full w-full origin-left motion-safe:animate-[progress_1.4s_ease-in-out_infinite]"
          style={{
            background:
              "linear-gradient(to right, #4285f4, #ea4335, #fbbc04, #34a853)",
          }}
        />
      </div>

      {/* ── Full-Screen Blocking Loading Overlay (Fade-in after 200ms delay to avoid flicker) ── */}
      <div
        className="fixed inset-0 z-[999998] pointer-events-auto cursor-wait select-none touch-none flex flex-col items-center justify-center backdrop-blur-[6px] bg-white/40 opacity-0 motion-safe:animate-[fadeIn_150ms_200ms_forwards] motion-reduce:opacity-100"
        aria-hidden="true"
        onWheel={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onTouchMove={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        {/* Centered Glassmorphic Loading Card */}
        <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/85 shadow-lg border border-slate-200/60 backdrop-blur-md">
          {/* Animated Spinner Ring */}
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-full border-[3px] border-[#023858]/15" />
            <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[#023858] border-r-[#0b57d0] motion-safe:animate-spin" />
            <div className="absolute inset-0 m-auto w-2.5 h-2.5 rounded-full bg-[#023858] motion-safe:animate-pulse" />
          </div>
          <span className="mt-2.5 text-[11px] font-semibold tracking-wide text-[#023858]/90">
            Loading...
          </span>
        </div>
      </div>

      {/* Screen-reader announcement */}
      <span className="sr-only">Loading content, please wait...</span>
    </div>
  );
}
