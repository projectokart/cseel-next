'use client';

import { useEffect, useState, useRef, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function TopProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimers = () => {
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
  };

  const startLoading = () => {
    clearTimers();
    setVisible(true);
    setProgress(25);

    // Fast top progress bar advancement
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

  // When route changes, complete the top progress line instantly
  useEffect(() => {
    if (currentPathString !== prevPathRef.current) {
      prevPathRef.current = currentPathString;
      finishLoading();
    }
  }, [currentPathString, finishLoading]);

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

    return () => {
      document.removeEventListener("click", handleAnchorClick, { capture: true });
      window.removeEventListener("popstate", handlePopState);
      clearTimers();
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[999999] pointer-events-none h-[2.5px] overflow-hidden"
      aria-hidden="true"
    >
      <div
        className="h-full bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC04] to-[#34A853] shadow-[0_0_8px_rgba(66,133,244,0.8)] transition-all duration-150 ease-out"
        style={{
          width: `${progress}%`,
          opacity: visible ? 1 : 0,
        }}
      />
    </div>
  );
}
