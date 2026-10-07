'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Sparkles,
  GraduationCap,
  RotateCcw,
  ChevronRight,
  CheckCircle2,
  BookOpen,
  Award,
  ShieldCheck
} from 'lucide-react';

interface SchoolPhotoBookProps {
  displayName: string;
  primaryImage?: string;
  onApplyClick?: () => void;
}

/**
 * 100% Natural Physical Paper Flip Sound (Zero "cut-cut" clicks / No mechanical impacts)
 * Smooth continuous acoustic paper friction rustle that sweeps gently like turning a real book page.
 */
function playNaturalPageFlipSound() {
  try {
    if (typeof window === 'undefined') return;
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const rate = ctx.sampleRate;
    const now = ctx.currentTime;
    const duration = 0.38;
    const len = Math.ceil(rate * duration);
    const buffer = ctx.createBuffer(1, len, rate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < len; i++) {
      const t = i / rate;
      const progress = t / duration;
      // Smooth bell envelope (no sharp onset pop/click, gentle swell, soft decay)
      const envelope = Math.sin(Math.PI * progress) * Math.exp(-progress * 1.5);
      // Soft continuous paper fiber friction noise
      const noise = (Math.random() * 2 - 1) + (Math.random() * 0.4 - 0.2);
      data[i] = noise * envelope * 0.16;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    // Smooth acoustic resonance bandpass filter sweeping from 1250Hz down to 450Hz
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1250, now);
    filter.frequency.exponentialRampToValueAtTime(450, now + duration);
    filter.Q.value = 1.35;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.005, now + duration);

    source.connect(filter).connect(gain).connect(ctx.destination);
    source.start(now);
  } catch (_) {}
}

/**
/**
 * User's Exact 3D Metallic Spiral Spine & Rings
 * Pure CSS with cylindrical linear gradient, inner/outer depth shadows and 3D loop slit.
 */
function MetallicSpiralSpine({
  count = 15,
  isCenter = true,
  className = ''
}: {
  count?: number;
  isCenter?: boolean;
  className?: string;
}) {
  const prefix = isCenter ? 'c' : 'm';
  return (
    <div
      className={`spiral-spine flex flex-col justify-between pointer-events-none select-none ${
        isCenter ? 'w-[45px] h-full py-3.5' : 'w-[24px] h-full py-4'
      } ${className}`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          id={`metallic-ring-${prefix}-${i}`}
          className={`ring ${!isCenter ? 'ring-mobile' : ''} transition-[clip-path]`}
        />
      ))}
    </div>
  );
}

export default function SchoolPhotoBook({
  displayName,
  primaryImage,
  onApplyClick
}: SchoolPhotoBookProps) {
  // 6 Pages: 0-4 Photos, Page 5 Thank You
  const [currentPage, setCurrentPage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const bookMountRef = useRef<HTMLDivElement>(null);
  const templateRef = useRef<HTMLDivElement>(null);
  const pageFlipRef = useRef<any>(null);

  const pagesData = [
    {
      id: 0,
      image: primaryImage || '/images/schools/edunova-hero-students.jpg',
      title: 'Main Academic Campus & Life',
      desc: 'Inspiring architecture with lush green surroundings and modern classrooms.',
    },
    {
      id: 1,
      image: '/images/schools/hero-school-1.png',
      title: 'Advanced Science Practical Labs',
      desc: 'Hands-on chemistry, physics and biology labs with individual workstations.',
    },
    {
      id: 2,
      image: '/images/schools/hero-school-2.jpg',
      title: 'Interactive Smart Classrooms',
      desc: 'Digital multimedia boards, audio-visual learning & dedicated teacher guidance.',
    },
    {
      id: 3,
      image: '/images/schools/hero-school-3.jpg',
      title: 'Sports Complex & Athletic Grounds',
      desc: 'Dedicated football pitch, basketball court, athletics track and trained sports coaches.',
    },
    {
      id: 4,
      image: '/images/schools/hero-school-4.png',
      title: 'Central Library & Reading Halls',
      desc: 'Over 10,000 curriculum and reference books, quiet study pods & digital archives.',
    },
  ];

  const totalPages = pagesData.length + 1; // 5 photos + 1 thank you page = 6

  // Initialize PageFlip with pure cloned template DOM nodes (prevents React DOM mutation bugs)
  useEffect(() => {
    let isMounted = true;
    let animId = 0;

    async function loadBook() {
      if (typeof window === 'undefined' || !containerRef.current || !bookMountRef.current || !templateRef.current) return;

      try {
        const { PageFlip } = await import('page-flip');
        if (!isMounted || !containerRef.current || !bookMountRef.current || !templateRef.current) return;

        const w = containerRef.current.clientWidth || 560;
        const h = containerRef.current.clientHeight || 400;
        const mobile = window.innerWidth < 640;
        setIsMobile(mobile);

        // Clear previous mount children safely
        if (pageFlipRef.current) {
          try { pageFlipRef.current.destroy(); } catch (_) {}
          pageFlipRef.current = null;
        }
        bookMountRef.current.innerHTML = '';

        // Create independent host node that PageFlip owns completely
        const host = document.createElement('div');
        host.style.width = '100%';
        host.style.height = '100%';
        bookMountRef.current.appendChild(host);

        // Clone templates from hidden React DOM
        const templateNodes = templateRef.current.querySelectorAll('.pf-template-page');
        const clonedPages: HTMLElement[] = [];
        templateNodes.forEach((node) => {
          const clone = node.cloneNode(true) as HTMLElement;
          clone.classList.add('pf-page', 'cursor-pointer');
          clone.style.display = 'block';
          clonedPages.push(clone);
        });

        const targetPageW = mobile ? w : Math.round(w / 2);
        const targetPageH = h;

        const pf = new PageFlip(host, {
          width: targetPageW,
          height: targetPageH,
          size: 'stretch',
          autoSize: false,
          minWidth: mobile ? Math.max(100, Math.round(w * 0.6)) : 200,
          maxWidth: 2000,
          minHeight: 180,
          maxHeight: 2000,
          maxShadowOpacity: 0.7,
          showCover: false,
          flippingTime: 950,
          usePortrait: mobile,
          startPage: 0,
          drawShadow: true,
          showPageCorners: true,
          useMouseEvents: true,
          mobileScrollSupport: false,
          disableFlipByClick: false,
        });

        pf.loadFromHTML(clonedPages);

        pf.on('flip', (e: { data: number }) => {
          if (!isMounted) return;
          setCurrentPage(e.data);
          playNaturalPageFlipSound();
        });

        pageFlipRef.current = pf;
        setIsReady(true);
        if (typeof window !== 'undefined') (window as any).__PAGEFLIP_STATUS__ = 'SUCCESS';

        // Real Physics: dynamic angle-based spiral coil occlusion synchronized with 3D page turn

        function updateSpiralOcclusion() {
          if (!isMounted) return;
          const pfInstance = pageFlipRef.current;
          if (pfInstance) {
            const flipCtrl = pfInstance.getFlipController();
            const state = pfInstance.getState();
            const isFlipping = state === 'flipping' || state === 'user_fold';

            if (isFlipping && flipCtrl) {
              const calc = (flipCtrl as any).calc;
              let progress = 0;

              if (calc && typeof calc.getFlippingProgress === 'function') {
                progress = Math.max(0, Math.min(1, calc.getFlippingProgress() / 100));
              } else {
                const el = containerRef.current?.querySelector('.stf__item[style*="clip-path"]') as HTMLElement;
                if (el && el.style.transform) {
                  const match = el.style.transform.match(/translate3d\(([-\d.]+)px/);
                  if (match) {
                    const tx = parseFloat(match[1]);
                    const totalW = containerRef.current?.clientWidth || 560;
                    progress = Math.max(0, Math.min(1, 1 - tx / totalW));
                  }
                }
              }

              // Base angle: 0° (flat on right) -> 90° (vertical center) -> 180° (flat on left)
              const baseAngle = progress * 180;

              // Desktop center metallic rings (count: 15)
              for (let i = 0; i < 15; i++) {
                const ring = document.getElementById(`metallic-ring-c-${i}`);
                if (!ring) continue;

                // 3D diagonal curl physics: bottom corner curls first, so bottom rings lead
                const verticalLag = 0.72 + 0.45 * (i / 14);
                const ringAngle = Math.max(0, Math.min(180, baseAngle * verticalLag));

                if (ringAngle <= 1 || ringAngle >= 179) {
                  ring.style.clipPath = 'none';
                } else if (ringAngle <= 90) {
                  // Lifting page on right occludes right portion of the ring
                  const rad = (ringAngle * Math.PI) / 180;
                  const cutRightPct = (1 - (0.5 + 0.45 * Math.cos(rad))) * 100;
                  ring.style.clipPath = `inset(0 ${cutRightPct.toFixed(1)}% 0 0)`;
                } else {
                  // Descending page on left occludes left portion of the ring
                  const rad = (ringAngle * Math.PI) / 180;
                  const cutLeftPct = (0.5 + 0.45 * Math.cos(rad)) * 100;
                  ring.style.clipPath = `inset(0 0 0 ${cutLeftPct.toFixed(1)}%)`;
                }
              }

              // Mobile left edge metallic rings (count: 13)
              for (let i = 0; i < 13; i++) {
                const ring = document.getElementById(`metallic-ring-m-${i}`);
                if (!ring) continue;
                const ringAngle = Math.max(0, Math.min(180, baseAngle * (0.8 + 0.4 * (i / 12))));
                if (ringAngle <= 35 || ringAngle >= 165) {
                  ring.style.clipPath = 'none';
                } else {
                  const cutRightPct = Math.min(80, 85 * Math.sin((ringAngle * Math.PI) / 180));
                  ring.style.clipPath = `inset(0 ${cutRightPct.toFixed(1)}% 0 0)`;
                }
              }
            } else {
              // Idle state: all spiral rings 100% visible
              for (let i = 0; i < 15; i++) {
                const ring = document.getElementById(`metallic-ring-c-${i}`);
                if (ring && ring.style.clipPath && ring.style.clipPath !== 'none') {
                  ring.style.clipPath = 'none';
                }
              }
              for (let i = 0; i < 13; i++) {
                const ring = document.getElementById(`metallic-ring-m-${i}`);
                if (ring && ring.style.clipPath && ring.style.clipPath !== 'none') {
                  ring.style.clipPath = 'none';
                }
              }
            }
          }
          animId = requestAnimationFrame(updateSpiralOcclusion);
        }

        animId = requestAnimationFrame(updateSpiralOcclusion);
      } catch (err: any) {
        console.warn('PageFlip init:', err);
        if (typeof window !== 'undefined') (window as any).__PAGEFLIP_STATUS__ = 'ERROR: ' + (err?.message || String(err));
      }
    }

    const timer = setTimeout(loadBook, 50);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (animId) cancelAnimationFrame(animId);
      if (pageFlipRef.current) {
        try { pageFlipRef.current.destroy(); } catch (_) {}
        pageFlipRef.current = null;
      }
    };
  }, []);

  const handleDotClick = useCallback((index: number) => {
    if (pageFlipRef.current) {
      try {
        if (Math.abs(index - currentPage) <= 2) {
          pageFlipRef.current.flip(index);
        } else {
          pageFlipRef.current.turnToPage(index);
        }
        return;
      } catch (_) {}
    }
    setCurrentPage(index);
    playNaturalPageFlipSound();
  }, [currentPage]);

  const handleResetToFirst = useCallback(() => {
    if (pageFlipRef.current) {
      try {
        pageFlipRef.current.flip(0);
        return;
      } catch (_) {}
    }
    setCurrentPage(0);
    playNaturalPageFlipSound();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full select-none"
    >
      {/* ========================================================================= */}
      {/* 1. SPIRAL BINDING RINGS:
             - Desktop: In center spine between left and right pages
             - Mobile: On the left edge
      */}
      {/* ========================================================================= */}
      {/* 3D METALLIC SPIRAL BINDING RINGS: Only on Mobile view (left edge) */}
      <div className="sm:hidden">
        {currentPage > 0 && (
          <div
            className="absolute inset-y-1.5 -left-3 z-30 w-3.5 rounded-l-full bg-gradient-to-r from-slate-300 via-white to-slate-400 shadow-[-3px_0_6px_rgba(0,0,0,0.35)] border-l border-slate-300 pointer-events-none"
          />
        )}
        <div className="absolute inset-y-1.5 -left-2.5 z-40 pointer-events-none">
          <MetallicSpiralSpine count={12} isCenter={false} className="h-full" />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN BOOK CONTAINER:
             - 100% full bleed, zero black gaps
             - Left corners slightly rounded (rounded-l-lg), right corners round (rounded-r-3xl)
             - Thin left border
      */}
      {/* ========================================================================= */}
      <div className="relative w-full h-full rounded-l-lg rounded-r-3xl border-l border-slate-300/80 shadow-2xl overflow-hidden bg-transparent">
        
        {/* Dynamic Host Mount for StPageFlip Engine */}
        <div
          ref={bookMountRef}
          className="w-full h-full"
        />

        {/* SSR / Initial Preview before PageFlip interactive mount (zero layout shift) */}
        {!isReady && (
          <div className="absolute inset-0 w-full h-full flex rounded-l-lg rounded-r-3xl overflow-hidden pointer-events-none">
            {/* Left Page (Desktop only: Elegant Cover Page) */}
            <div className="hidden sm:flex w-1/2 h-full relative overflow-hidden bg-gradient-to-br from-[#071F38] via-[#002B49] to-[#00182C] text-white p-3.5 sm:p-5 pb-10 flex-col justify-between border-r border-[#FBBC04]/30">
              <div className="absolute inset-2 border-2 border-[#FBBC04]/40 rounded-xl pointer-events-none" />
              <div className="relative z-10 flex items-center justify-center pt-1.5 text-center shrink-0">
                <span className="text-[8.5px] font-bold text-[#FBBC04] tracking-[0.25em] uppercase">
                  ✦ ACADEMIC SESSION 2026 – 2027 ✦
                </span>
              </div>
              <div className="relative z-10 text-center my-auto space-y-2 px-2">
                <div className="w-11 h-11 mx-auto rounded-xl bg-[#FBBC04]/20 border border-[#FBBC04]/60 p-2 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-[#FBBC04]" />
                </div>
                <h2 className="text-base sm:text-lg font-black font-serif text-white tracking-tight leading-snug">{displayName}</h2>
                <p className="text-[9.5px] text-blue-100/90 line-clamp-3 max-w-xs mx-auto">Nurturing curiosity, values & leadership through experiential practical learning.</p>
                <div className="flex items-center justify-center gap-1.5 text-[8px] text-blue-200/90">
                  <span className="bg-white/10 px-2 py-0.5 rounded-full border border-white/10">CBSE Aligned</span>
                  <span className="bg-white/10 px-2 py-0.5 rounded-full border border-white/10">NEP 2020 Aligned</span>
                </div>
              </div>
              <div className="h-2 shrink-0 pointer-events-none" />
            </div>

            {/* Right Page (Desktop: Page 1 photo, Mobile: Cover Page) */}
            <div className="w-full sm:w-1/2 h-full relative overflow-hidden bg-slate-900">
              {/* Desktop image: Page 1 photo */}
              <div className="hidden sm:block w-full h-full relative">
                <img src={pagesData[1].image} alt={pagesData[1].title} className="w-full h-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-3 sm:p-4 pb-7 text-white z-20">
                  <h4 className="text-xs sm:text-sm font-black text-white">{pagesData[1].title}</h4>
                  <p className="text-[10px] sm:text-[11px] text-slate-200 mt-0.5 line-clamp-1">{pagesData[1].desc}</p>
                </div>
              </div>

              {/* Mobile: Cover Page preview */}
              <div className="sm:hidden w-full h-full relative bg-gradient-to-br from-[#071F38] via-[#002B49] to-[#00182C] text-white p-3.5 pb-10 flex flex-col justify-between">
                <div className="absolute inset-2 border-2 border-[#FBBC04]/40 rounded-xl pointer-events-none" />
                <div className="relative z-10 flex items-center justify-center pt-1.5 text-center shrink-0">
                  <span className="text-[8px] font-bold text-[#FBBC04] tracking-[0.25em] uppercase">
                    ✦ ACADEMIC SESSION 2026 – 2027 ✦
                  </span>
                </div>
                <div className="relative z-10 text-center my-auto space-y-2 px-2">
                  <div className="w-11 h-11 mx-auto rounded-xl bg-[#FBBC04]/20 border border-[#FBBC04]/60 p-2 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-[#FBBC04]" />
                  </div>
                  <h2 className="text-base font-black font-serif text-white tracking-tight leading-snug">{displayName}</h2>
                  <p className="text-[9.5px] text-blue-100/90 line-clamp-3 max-w-xs mx-auto">Nurturing curiosity, values & leadership through experiential practical learning.</p>
                  <div className="flex items-center justify-center gap-1 text-[8px] text-blue-200/90">
                    <span className="bg-white/10 px-2 py-0.5 rounded-full border border-white/10">CBSE Aligned</span>
                    <span className="bg-white/10 px-2 py-0.5 rounded-full border border-white/10">NEP 2020 Aligned</span>
                  </div>
                </div>
                <div className="h-2 shrink-0 pointer-events-none" />
              </div>
            </div>
          </div>
        )}

        {/* Floating Bottom Dots (ONLY DOTS, NO BACKGROUND) */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 select-none pointer-events-auto"
        >
          {Array.from({ length: totalPages }).map((_, idx) => {
            const isActive = isMobile
              ? currentPage === idx
              : Math.floor(currentPage / 2) === Math.floor(idx / 2);
            const isThankYou = idx === 5;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleDotClick(idx)}
                aria-label={`Jump to page ${idx + 1}`}
                className={`transition-all rounded-full cursor-pointer drop-shadow-md ${
                  isActive
                    ? isThankYou
                      ? 'w-6 h-2 bg-[#002B49] shadow-[0_0_8px_rgba(0,43,73,0.5)] scale-105'
                      : 'w-6 h-2 bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)] scale-105'
                    : isThankYou
                    ? 'w-2 h-2 bg-[#002B49]/40 hover:bg-[#002B49]/70 hover:scale-125'
                    : 'w-2 h-2 bg-white/70 hover:bg-white hover:scale-125'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. HIDDEN TEMPLATE PAGES (React renders these; PageFlip clones them cleanly) */}
      {/* ========================================================================= */}
      <div ref={templateRef} style={{ display: 'none' }}>
        {/* PAGE 0: ELEGANT DECORATED INSTITUTIONAL COVER PAGE */}
        <div
          className="pf-template-page relative w-full h-full overflow-hidden select-none cursor-pointer bg-gradient-to-br from-[#071F38] via-[#002B49] to-[#00182C] text-white p-3.5 sm:p-5 pb-10 sm:pb-10 flex flex-col justify-between shadow-2xl"
          data-density="hard"
        >
          {/* Subtle Background Geometric Lattice & Gold Flare */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.06]"
            style={{
              backgroundImage: 'radial-gradient(#FBBC04 1px, transparent 1px)',
              backgroundSize: '16px 16px'
            }}
          />
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[#FBBC04]/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-[#006FCC]/20 blur-3xl pointer-events-none" />

          {/* Double Gold Decorative Border with Corner Ornaments */}
          <div className="absolute inset-2 sm:inset-3 border-2 border-[#FBBC04]/40 rounded-xl sm:rounded-2xl pointer-events-none" />
          <div className="absolute inset-3 sm:inset-4.5 border border-[#FBBC04]/20 rounded-lg sm:rounded-xl pointer-events-none" />
          
          {/* Corner Floral / Filigree Accents */}
          <div className="absolute top-3 left-3 text-[#FBBC04]/70 text-[11px] sm:text-xs font-serif select-none pointer-events-none">✦</div>
          <div className="absolute top-3 right-3 text-[#FBBC04]/70 text-[11px] sm:text-xs font-serif select-none pointer-events-none">✦</div>
          <div className="absolute bottom-3 left-3 text-[#FBBC04]/70 text-[11px] sm:text-xs font-serif select-none pointer-events-none">✦</div>
          <div className="absolute bottom-3 right-3 text-[#FBBC04]/70 text-[11px] sm:text-xs font-serif select-none pointer-events-none">✦</div>

          {/* Spine Crease Shadow on Right */}
          <div className="hidden sm:block absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/50 via-black/20 to-transparent pointer-events-none z-20" />

          {/* Top Banner: Elegant Session Tag */}
          <div className="relative z-10 flex items-center justify-center pt-1.5 sm:pt-2 text-center shrink-0">
            <span className="inline-flex items-center gap-1.5 text-[8.5px] sm:text-[9.5px] font-bold text-[#FBBC04] tracking-[0.25em] uppercase">
              <Sparkles className="w-2.5 h-2.5 fill-current" />
              <span>ACADEMIC SESSION 2026 – 2027</span>
              <Sparkles className="w-2.5 h-2.5 fill-current" />
            </span>
          </div>

          {/* Center Showcase: Decorated Emblem + School Name + Description Paragraph */}
          <div className="relative z-10 text-center px-2 py-1 space-y-2 sm:space-y-2.5 my-auto">
            {/* Gold Leaf Illustrated Emblem */}
            <div className="w-11 h-11 sm:w-13 sm:h-13 mx-auto rounded-xl bg-gradient-to-tr from-[#FBBC04]/20 via-[#FBBC04]/10 to-transparent border-2 border-[#FBBC04]/60 p-2 flex items-center justify-center shadow-[0_0_18px_rgba(251,188,4,0.3)]">
              <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
                <path d="M24 16C20 12 10 12 6 15V36C10 33 20 33 24 37V16Z" fill="#FBBC04" />
                <path d="M24 16C28 12 38 12 42 15V36C38 33 28 33 24 37V16Z" fill="#F2A900" />
                <circle cx="24" cy="11" r="4" fill="#FFE082" />
                <path d="M24 4V8" stroke="#FFE082" strokeWidth="2" strokeLinecap="round" />
                <path d="M18 6L20 9" stroke="#FFE082" strokeWidth="2" strokeLinecap="round" />
                <path d="M30 6L28 9" stroke="#FFE082" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>

            {/* Sub-tagline */}
            <div className="inline-flex items-center gap-1.5 text-[8px] sm:text-[9px] font-bold tracking-[0.25em] uppercase text-[#FBBC04]">
              <span className="w-3.5 h-[1px] bg-[#FBBC04]/60 inline-block" />
              <span>CENTRE OF EXCELLENCE</span>
              <span className="w-3.5 h-[1px] bg-[#FBBC04]/60 inline-block" />
            </div>

            {/* School Name in High-Impact Serif Typography */}
            <h2 className="text-base xs:text-lg sm:text-xl lg:text-[23px] font-black font-serif tracking-tight text-white leading-snug drop-shadow-md px-1 max-w-[92%] mx-auto">
              {displayName}
            </h2>

            {/* Decorated Ribbon Paragraph */}
            <p className="text-[9.5px] sm:text-[11px] text-blue-100/90 leading-relaxed font-normal max-w-xs sm:max-w-sm mx-auto line-clamp-3">
              Nurturing intellectual curiosity, ethical character, and innovative leadership through experiential learning, world-class laboratory infrastructure, and holistic sports coaching.
            </p>

            {/* 2 Key Quality Badges (Cleanly centered & elevated) */}
            <div className="pt-1 flex items-center justify-center gap-1.5 sm:gap-2 text-[8px] sm:text-[9px] text-blue-200/90 font-medium">
              <span className="inline-flex items-center gap-1 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10 shadow-2xs">
                <ShieldCheck className="w-2.5 h-2.5 text-[#FBBC04]" /> CBSE Aligned
              </span>
              <span className="inline-flex items-center gap-1 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10 shadow-2xs">
                <Award className="w-2.5 h-2.5 text-[#FBBC04]" /> NEP 2020 Aligned
              </span>
            </div>
          </div>

          {/* Bottom Clear Buffer: Prevents any overlap with bottom border or yellow navigation dots */}
          <div className="h-2.5 sm:h-3 shrink-0 pointer-events-none" />
        </div>

        {/* PAGES 1 to 4: PHOTO PAGES */}
        {pagesData.slice(1).map((page, relIdx) => {
          const index = relIdx + 1;
          const isLeft = index % 2 === 0;
          return (
            <div
              key={page.id}
              className="pf-template-page relative w-full h-full overflow-hidden select-none cursor-pointer bg-slate-900"
              data-density="soft"
            >
              <img
                src={page.image}
                alt={page.title}
                className="w-full h-full object-cover object-center pointer-events-none block"
                onError={(e) => {
                  e.currentTarget.src = '/images/schools/hero-brightfuture.jpg';
                }}
              />

              {/* Spine crease shadow near center */}
              <div className={`hidden sm:block absolute inset-y-0 ${
                isLeft ? 'right-0 w-8 bg-gradient-to-l' : 'left-0 w-8 bg-gradient-to-r'
              } from-black/40 via-black/15 to-transparent pointer-events-none z-20`} />

              {/* Bottom Caption Banner */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-3 sm:p-4 pb-7 sm:pb-8 pt-7 text-white z-20 flex flex-col justify-end pointer-events-none">
                <h4 className="text-xs sm:text-sm font-black tracking-tight text-white leading-tight drop-shadow-sm">
                  {page.title}
                </h4>
                <p className="text-[10px] sm:text-[11px] text-slate-200 mt-0.5 line-clamp-1 drop-shadow-sm">
                  {page.desc}
                </p>
              </div>

              {/* Turn Page hint on right pages (or all pages on mobile) */}
              {(!isLeft || isMobile) && (
                <div className="absolute bottom-2.5 right-2.5 z-30 pointer-events-none opacity-85">
                  <span className="inline-flex items-center gap-1 text-[8.5px] font-bold text-white bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20 shadow-sm">
                    <span>Turn Page</span>
                    <ChevronRight className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                </div>
              )}
            </div>
          );
        })}

        {/* Page 6 Template: Concluding "Thank You" Page with Authentic Physical Book Paper Texture */}
        <div
          className="pf-template-page pf-thankyou-page relative w-full h-full bg-[#FAF8F5] border-l border-[#E2DDD0] p-5 sm:p-6 flex flex-col justify-between text-[#002B49] overflow-hidden select-none shadow-inner"
          style={{ backgroundColor: '#FAF8F5' }}
          data-density="soft"
        >
          {/* Authentic Real Book Paper Fiber / Grain Texture Overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.055] mix-blend-multiply z-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paperNoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paperNoise)'/%3E%3C/svg%3E")`
            }}
          />

          {/* Book Gutter Spine Crease Shadow (Darker near spiral seam, lightening across page) */}
          <div className="hidden sm:block absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/20 via-black/8 to-transparent pointer-events-none z-20" />

          {/* Paper Punch Holes: only on mobile matching the left edge spiral */}
          <div className="sm:hidden flex absolute inset-y-0 left-1 w-2 flex-col justify-between py-2 pointer-events-none z-20">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#001524]/70 shadow-inner border border-slate-400/30" />
            ))}
          </div>

          {/* Ambient Paper Depth Blobs */}
          <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-[#005689]/[0.035] blur-2xl pointer-events-none" />
          <div className="absolute -bottom-14 -left-14 w-40 h-40 rounded-full bg-amber-600/[0.03] blur-xl pointer-events-none" />

          {/* Header Badge */}
          <div className="relative z-20 flex items-center justify-start sm:pl-3">
            <span className="inline-flex items-center gap-1.5 bg-[#002B49]/[0.07] backdrop-blur-sm px-2.5 py-0.5 rounded-full text-[10px] font-bold text-[#002B49] uppercase tracking-wider border border-[#002B49]/15 shadow-sm">
              <Sparkles className="w-3 h-3 text-[#005689] fill-[#005689]" />
              <span>Campus Tour Complete</span>
            </span>
          </div>

          {/* Body Content */}
          <div className="relative z-20 text-center my-auto space-y-2 py-1 sm:pl-2">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#002B49]/[0.08] border border-[#002B49]/15 mx-auto flex items-center justify-center shadow-sm">
              <GraduationCap className="w-7 h-7 sm:w-8 sm:h-8 text-[#002B49] stroke-[2]" />
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-[#002B49] tracking-tight">
              Thank You!
            </h3>

            <p className="text-[11px] sm:text-xs text-[#002B49]/80 font-medium max-w-xs mx-auto leading-relaxed">
              We look forward to welcoming you to {displayName}. Visit our campus to experience our academic culture and world-class facilities in person.
            </p>

            <div className="pt-0.5 flex flex-wrap items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#002B49] bg-[#002B49]/[0.06] border border-[#002B49]/20 px-2.5 py-0.5 rounded-full shadow-xs">
                <CheckCircle2 className="w-3 h-3 text-[#005689]" />
                Admissions Open 2026-27
              </span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="relative z-20 flex items-center justify-between pt-2 border-t border-[#E2DDD0] sm:pl-2">
            <button
              type="button"
              onClick={handleResetToFirst}
              className="inline-flex items-center gap-1.5 bg-[#002B49] hover:bg-[#001D32] text-white font-bold px-3 py-1.5 rounded-xl text-[11px] shadow-sm transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3 stroke-[2.5]" />
              <span>Start Again ↺</span>
            </button>

            {onApplyClick && (
              <button
                type="button"
                onClick={onApplyClick}
                className="inline-flex items-center gap-1 bg-[#006FCC] hover:bg-[#005499] text-white font-bold px-3 py-1.5 rounded-xl text-[11px] shadow-sm transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>Apply Now</span>
                <ChevronRight className="w-3 h-3 stroke-[2.5]" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Global CSS Overrides for PageFlip container: fills 100% with realistic 3D curl perspective & shadows */}
      <style jsx global>{`
        .stf__parent {
          position: relative !important;
          width: 100% !important;
          height: 100% !important;
          background: transparent !important;
          box-sizing: border-box !important;
          transform: translateZ(0);
          touch-action: pan-y;
        }
        .stf__wrapper {
          position: relative !important;
          width: 100% !important;
          height: 100% !important;
          background: transparent !important;
          box-sizing: border-box !important;
        }
        .stf__block {
          position: absolute !important;
          width: 100% !important;
          height: 100% !important;
          box-sizing: border-box !important;
          perspective: 2400px !important;
        }
        .stf__item {
          box-sizing: border-box !important;
          transform-style: preserve-3d !important;
          backface-visibility: hidden !important;
          -webkit-backface-visibility: hidden !important;
          background-color: #0b1524 !important;
        }
        .stf__item.pf-thankyou-page,
        .pf-thankyou-page {
          background-color: #FAF8F5 !important;
          color: #002B49 !important;
        }
        .stf__item img {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          display: block !important;
        }
        .stf__outerShadow,
        .stf__innerShadow,
        .stf__hardShadow,
        .stf__hardInnerShadow {
          position: absolute !important;
          left: 0 !important;
          top: 0 !important;
          pointer-events: none !important;
        }

        /* User's Exact 3D Metallic Spiral Spine & Rings */
        .spiral-spine {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .ring {
          width: 100%;
          height: 16px;
          background: linear-gradient(90deg, #6b7280, #f3f4f6, #4b5563, #1f2937);
          border-radius: 10px;
          box-shadow: 
            0 4px 6px rgba(0, 0, 0, 0.4),
            inset 0 2px 3px rgba(255, 255, 255, 0.8),
            inset 0 -2px 3px rgba(0, 0, 0, 0.6);
          position: relative;
        }

        .ring::before {
          content: '';
          position: absolute;
          top: 3px;
          left: 10px;
          right: 10px;
          height: 4px;
          background: rgba(0, 0, 0, 0.4);
          border-radius: 2px;
        }

        .ring.ring-mobile {
          height: 13px;
          border-radius: 8px;
        }

        .ring.ring-mobile::before {
          top: 2px;
          left: 5px;
          right: 5px;
          height: 3px;
        }
      `}</style>
    </div>
  );
}
