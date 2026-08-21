'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface NucleusLoaderProps {
  progress?: number;
  text?: string;
  fullScreen?: boolean;
}

export default function NucleusLoader({
  progress = 50,
  text,
  fullScreen = false,
}: NucleusLoaderProps) {
  const roundedProgress = Math.min(Math.max(Math.round(progress), 0), 100);

  return (
    <div
      className={`${
        fullScreen
          ? "fixed inset-0 z-[99999] bg-white/90 dark:bg-slate-950/90 backdrop-blur-md"
          : "w-full py-8"
      } flex flex-col items-center justify-center select-none`}
    >
      {/* ── ATOM CONTAINER (FULL CLOCKWISE ROTATION) ── */}
      <div className="relative flex items-center justify-center w-28 h-28 sm:w-32 sm:h-32">
        
        {/* Ambient Soft Glow */}
        <div className="absolute inset-0 rounded-full bg-[#006fcc]/10 blur-xl animate-pulse pointer-events-none" />

        {/* Whole Atom SVG Rotating Clockwise */}
        <div className="w-full h-full animate-atom-clockwise flex items-center justify-center">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full overflow-visible"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* ── 3 Elliptical Orbital Rings (0°, 60°, 120°) ── */}
            {/* Orbit 1: Horizontal */}
            <ellipse
              cx="50"
              cy="50"
              rx="42"
              ry="16"
              stroke="#006fcc"
              strokeWidth="3.2"
              strokeLinecap="round"
              className="opacity-90"
            />

            {/* Orbit 2: 60 deg */}
            <ellipse
              cx="50"
              cy="50"
              rx="42"
              ry="16"
              stroke="#006fcc"
              strokeWidth="3.2"
              strokeLinecap="round"
              transform="rotate(60 50 50)"
              className="opacity-90"
            />

            {/* Orbit 3: 120 deg */}
            <ellipse
              cx="50"
              cy="50"
              rx="42"
              ry="16"
              stroke="#006fcc"
              strokeWidth="3.2"
              strokeLinecap="round"
              transform="rotate(120 50 50)"
              className="opacity-90"
            />

            {/* ── Central Nucleus (#003c6e) ── */}
            <circle
              cx="50"
              cy="50"
              r="8"
              fill="#003c6e"
              className="drop-shadow-xs"
            />
            <circle
              cx="48"
              cy="48"
              r="2.5"
              fill="#ffffff"
              className="opacity-80"
            />
          </svg>
        </div>

        {/* ── Orbiting Electron 1 ── */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-electron-orbit-1">
          <div className="w-28 h-10 rounded-[50%] relative">
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#003c6e] border-2 border-white shadow-[0_0_8px_#006fcc]" />
          </div>
        </div>

        {/* ── Orbiting Electron 2 ── */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none rotate-[60deg] animate-electron-orbit-2">
          <div className="w-28 h-10 rounded-[50%] relative">
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#006fcc] border-2 border-white shadow-[0_0_8px_#006fcc]" />
          </div>
        </div>

        {/* ── Orbiting Electron 3 ── */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none rotate-[120deg] animate-electron-orbit-3">
          <div className="w-28 h-10 rounded-[50%] relative">
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#003c6e] border-2 border-white shadow-[0_0_8px_#006fcc]" />
          </div>
        </div>

      </div>

      {/* ── LOADING STATUS & PERCENTAGE ONLY ── */}
      <div className="mt-4 flex flex-col items-center gap-1.5 text-center px-4">
        <p className="text-sm sm:text-base font-black text-[#003c6e] tracking-tight">
          Loading... {roundedProgress}%
        </p>

        {/* Subtle Progress Bar */}
        <div className="w-36 sm:w-44 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden border border-[#006fcc]/20 shadow-inner">
          <motion.div
            className="h-full bg-gradient-to-r from-[#003c6e] to-[#006fcc] rounded-full"
            initial={{ width: "10%" }}
            animate={{ width: `${Math.min(Math.max(roundedProgress, 10), 100)}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>
      </div>

      {/* Embedded Clockwise & Orbit CSS animations */}
      <style jsx global>{`
        @keyframes atomClockwise {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes electronSpin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .animate-atom-clockwise {
          animation: atomClockwise 6s linear infinite;
        }
        .animate-electron-orbit-1 {
          animation: electronSpin 2.2s linear infinite;
        }
        .animate-electron-orbit-2 {
          animation: electronSpin 2.6s linear infinite;
        }
        .animate-electron-orbit-3 {
          animation: electronSpin 3s linear infinite;
        }
      `}</style>
    </div>
  );
}
