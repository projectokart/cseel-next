'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface NucleusLoaderProps {
  progress?: number;
  text?: string;
  fullScreen?: boolean;
}

export default function NucleusLoader({
  progress = 75,
  text = "Loading Laboratory Simulation...",
  fullScreen = false,
}: NucleusLoaderProps) {
  return (
    <div
      className={`${
        fullScreen
          ? "fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-md"
          : "w-full py-16"
      } flex flex-col items-center justify-center select-none`}
    >
      <div className="relative flex items-center justify-center w-36 h-36">
        {/* Ambient Outer Glow */}
        <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-2xl animate-pulse" />

        {/* Central Nucleus with Proton/Neutron cluster effect */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            boxShadow: [
              "0 0 15px rgba(6, 182, 212, 0.6)",
              "0 0 30px rgba(14, 165, 233, 0.9)",
              "0 0 15px rgba(6, 182, 212, 0.6)",
            ],
          }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-20 w-8 h-8 rounded-full bg-gradient-to-tr from-teal-400 via-cyan-500 to-blue-600 flex items-center justify-center"
        >
          {/* Inner core sparkle */}
          <div className="w-2.5 h-2.5 rounded-full bg-white shadow-inner animate-ping" />
        </motion.div>

        {/* Electron Orbit 1 (Horizontal / 0 deg) */}
        <div className="absolute w-28 h-12 rounded-[50%] border-2 border-cyan-400/40 animate-orbit-1 pointer-events-none">
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-cyan-300 shadow-[0_0_8px_#22d3ee] animate-pulse" />
        </div>

        {/* Electron Orbit 2 (Rotated 60 deg) */}
        <div className="absolute w-28 h-12 rounded-[50%] border-2 border-teal-400/40 rotate-[60deg] animate-orbit-2 pointer-events-none">
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-teal-300 shadow-[0_0_8px_#5eead4] animate-pulse" />
        </div>

        {/* Electron Orbit 3 (Rotated 120 deg) */}
        <div className="absolute w-28 h-12 rounded-[50%] border-2 border-blue-400/40 rotate-[120deg] animate-orbit-3 pointer-events-none">
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-blue-300 shadow-[0_0_8px_#93c5fd] animate-pulse" />
        </div>
      </div>

      {/* Progress & Status Message */}
      <div className="mt-4 flex flex-col items-center gap-2 max-w-xs text-center px-4">
        <p className="text-xs md:text-sm font-extrabold tracking-wider bg-gradient-to-r from-teal-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent uppercase">
          {text}
        </p>

        {/* Visual Quantum Progress Bar */}
        <div className="w-48 h-1.5 bg-gray-800/80 rounded-full overflow-hidden border border-cyan-500/30 shadow-inner">
          <motion.div
            className="h-full bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500 rounded-full"
            initial={{ width: "10%" }}
            animate={{ width: `${Math.min(Math.max(progress, 15), 100)}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <span className="text-[10px] font-mono text-cyan-400/80">
          {Math.round(progress)}% Loaded
        </span>
      </div>

      {/* Embedded CSS keyframe animations */}
      <style jsx global>{`
        @keyframes orbitSpin1 {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes orbitSpin2 {
          0% { transform: rotate(60deg); }
          100% { transform: rotate(420deg); }
        }
        @keyframes orbitSpin3 {
          0% { transform: rotate(120deg); }
          100% { transform: rotate(480deg); }
        }
        .animate-orbit-1 {
          animation: orbitSpin1 2.4s linear infinite;
        }
        .animate-orbit-2 {
          animation: orbitSpin2 2.8s linear infinite;
        }
        .animate-orbit-3 {
          animation: orbitSpin3 3.2s linear infinite;
        }
      `}</style>
    </div>
  );
}
