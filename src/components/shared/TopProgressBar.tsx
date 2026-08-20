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
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Complete progress on route change
  useEffect(() => {
    if (loading) {
      setProgress(100);
      const t1 = setTimeout(() => {
        setLoading(false);
        const t2 = setTimeout(() => {
          setVisible(false);
          setProgress(0);
        }, 220);
        return () => clearTimeout(t2);
      }, 200);
      return () => clearTimeout(t1);
    }
  }, [pathname, searchParams]);

  // Intercept link clicks to immediately show progress
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      // Ignore external, anchor hash, or target="_blank" links
      if (
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("#") ||
        target.getAttribute("target") === "_blank" ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey
      ) {
        return;
      }

      // If already on this page, don't trigger
      const currentFullUrl = window.location.pathname + window.location.search;
      if (href === currentFullUrl) return;

      // Start progress immediately
      setVisible(true);
      setLoading(true);
      setProgress(30);

      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            if (timerRef.current) clearInterval(timerRef.current);
            return 90;
          }
          return prev + Math.floor(Math.random() * 12) + 6;
        });
      }, 80);
    };

    document.addEventListener("click", handleAnchorClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleAnchorClick, { capture: true });
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  if (!visible) return null;

  return (
    <>
      {/* Top glowing progress bar */}
      <div
        className="fixed top-0 left-0 right-0 z-[999999] pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="h-[3.5px] bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500 shadow-[0_0_15px_rgba(6,182,212,0.9)] transition-all duration-150 ease-out"
          style={{
            width: `${progress}%`,
            opacity: loading ? 1 : 0,
          }}
        />
      </div>

      {/* Screen-Centered Animated Nucleus Science Loader */}
      {loading && (
        <div className="fixed inset-0 z-[999990] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150 pointer-events-none select-none">
          <NucleusLoader
            progress={progress}
            text="Initializing Science Lab..."
          />
        </div>
      )}
    </>
  );
}
