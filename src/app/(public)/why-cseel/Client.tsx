'use client';

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import PageTransition from "@/components/shared/PageTransition";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  ExternalLink,
} from "lucide-react";

const TOTAL_SLIDES = 14;

const slideTitles = [
  "Cover · Where Textbooks Come Alive",
  "Your Map to the CSEEL Universe",
  "About CSEEL · Who Is Behind the Beakers?",
  "Our Vision, Mission & Purpose",
  "Traditional Learning vs. CSEEL Learning",
  "900+ Ways to Feel Science",
  "From Listening to Discovering",
  "Our Four-Stage Learning Framework",
  "The Creation Cycle: From Learning to Making",
  "How We Implement CSEEL in Schools",
  "Student Outcomes & Measurable Impact",
  "Aligned with National Initiatives (NEP, NCF)",
  "Contribution to Viksit Bharat 2047",
  "Bring It to Your School · Contact CSEEL",
];

export default function WhyCseelClient() {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev < TOTAL_SLIDES ? prev + 1 : 1));
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev > 1 ? prev - 1 : TOTAL_SLIDES));
  }, []);

  // Keyboard navigation (Arrow keys + Esc for fullscreen)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        nextSlide();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        prevSlide();
      } else if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide, isFullscreen]);

  return (
    <PageTransition>
      <div
        className={`bg-slate-950 text-white flex flex-col items-center justify-center transition-all ${
          isFullscreen
            ? "fixed inset-0 z-50 p-2 sm:p-4"
            : "min-h-[calc(100vh-4rem)] py-6 px-3 sm:px-6"
        }`}
      >
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
          
          {/* Top Control Header */}
          <div className="w-full flex items-center justify-between gap-3 mb-3 px-1 text-xs sm:text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">
                Page {currentSlide} of {TOTAL_SLIDES}
              </span>
              <span className="hidden sm:inline text-slate-500">•</span>
              <span className="hidden sm:inline text-slate-400 font-medium truncate max-w-xs md:max-w-md">
                {slideTitles[currentSlide - 1]}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors text-xs"
                title={isFullscreen ? "Exit Fullscreen (Esc)" : "Fullscreen Mode"}
              >
                {isFullscreen ? (
                  <>
                    <Minimize2 className="w-3.5 h-3.5" />
                    <span>Exit Fullscreen</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Fullscreen</span>
                  </>
                )}
              </button>

              <a
                href="https://www.canva.com/design/DAHZ9aUMclY/Pc-AzpbO2nKQNzWDz-zpZQ/view?utm_content=DAHZ9aUMclY&utm_campaign=designshare&utm_medium=embeds&utm_source=link"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors text-xs"
              >
                <span className="hidden xs:inline">Canva</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          </div>

          {/* Main Slide Viewer Container */}
          <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-900 group">
            {/* The A4 Aspect Ratio Container (636 x 900 = 1:1.415) */}
            <div
              className={`relative w-full ${
                isFullscreen
                  ? "h-[80vh] max-w-full"
                  : "aspect-[636/900] max-h-[82vh]"
              } mx-auto flex items-center justify-center bg-black/40`}
            >
              <Image
                key={currentSlide}
                src={`/images/why-cseel/slide_${currentSlide}.png`}
                alt={slideTitles[currentSlide - 1]}
                fill
                className="object-contain select-none"
                priority
              />

              {/* Prev Navigation Overlay Button */}
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous Slide"
                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center border border-white/20 shadow-lg backdrop-blur-sm opacity-80 hover:opacity-100 transition-all hover:scale-105"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Next Navigation Overlay Button */}
              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next Slide"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center border border-white/20 shadow-lg backdrop-blur-sm opacity-80 hover:opacity-100 transition-all hover:scale-105"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Bottom Controls & Navigation Strip */}
          <div className="w-full mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 px-1">
            {/* Prev / Next buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prevSlide}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs flex items-center gap-1.5 border border-slate-700 transition-colors shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
              <button
                type="button"
                onClick={nextSlide}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Slide Numbers (1 to 14) */}
            <div className="flex items-center gap-1 overflow-x-auto max-w-full py-1 scrollbar-thin">
              {Array.from({ length: TOTAL_SLIDES }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setCurrentSlide(num)}
                  className={`w-7 h-7 rounded-lg text-xs font-semibold flex items-center justify-center transition-all ${
                    currentSlide === num
                      ? "bg-amber-400 text-slate-950 shadow-md font-bold scale-110"
                      : "bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Thumbnail preview strip */}
          <div className="w-full mt-3 flex items-center gap-2 overflow-x-auto py-2 scrollbar-thin scrollbar-thumb-slate-700">
            {Array.from({ length: TOTAL_SLIDES }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setCurrentSlide(num)}
                className={`relative flex-shrink-0 w-14 sm:w-16 aspect-[636/900] rounded-lg overflow-hidden border-2 transition-all ${
                  currentSlide === num
                    ? "border-amber-400 ring-2 ring-amber-400/40 scale-105 shadow-md"
                    : "border-slate-800 opacity-50 hover:opacity-100"
                }`}
                title={slideTitles[num - 1]}
              >
                <Image
                  src={`/images/why-cseel/slide_${num}.png`}
                  alt={`Slide ${num}`}
                  fill
                  className="object-cover"
                />
                <span className="absolute bottom-0 inset-x-0 bg-black/80 text-[9px] text-center text-white py-0.5">
                  {num}
                </span>
              </button>
            ))}
          </div>

        </div>
      </div>
    </PageTransition>
  );
}
