'use client';

import Link from "next/link";
import { 
  Home, 
  Compass, 
  Search, 
  ArrowLeft, 
  Construction, 
  HelpCircle,
  Layers,
  Sparkles
} from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[85vh] bg-gradient-to-b from-slate-50 via-white to-sky-50/40 flex flex-col items-center justify-center text-center px-4 py-16 text-slate-800">
      <div className="max-w-xl w-full mx-auto">
        {/* Emblem */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 bg-[#0A4B69]/10 rounded-2xl blur-lg" />
          <div className="relative w-full h-full bg-white rounded-2xl border border-slate-200 shadow-md flex items-center justify-center p-3">
            <img 
              src="/favicon.svg" 
              alt="CSEEL Emblem" 
              className="w-14 h-14 object-contain"
            />
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-600 mb-4">
          <span>Error 404 • Resource Not Located</span>
        </div>

        <h1 
          className="text-4xl md:text-5xl font-black tracking-tight mb-3"
          style={{ color: '#0A4B69' }}
        >
          Page Not Found
        </h1>

        <p className="text-base text-slate-600 mb-8 max-w-md mx-auto leading-relaxed">
          The page or module you are looking for might have been moved, updated, or is currently under active construction for NEP 2020 rollout.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0A4B69] text-white font-semibold text-sm hover:bg-[#07364c] transition-all shadow-sm"
          >
            <Home className="w-4 h-4" />
            <span>Go to Home</span>
          </Link>

          <Link
            href="/under-construction"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 font-semibold text-sm hover:bg-amber-500/20 transition-all"
          >
            <Construction className="w-4 h-4 text-amber-700" />
            <span>Under Construction Hub</span>
          </Link>

          <Link
            href="/virtual-lab"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-all shadow-sm"
          >
            <Compass className="w-4 h-4 text-[#F8A130]" />
            <span>Virtual Labs</span>
          </Link>
        </div>

        {/* Quick Help Links */}
        <div className="border-t border-slate-200/80 pt-6 text-xs text-slate-500 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <Link href="/steam-lab" className="hover:text-[#0A4B69] hover:underline">
            STEAM & ATL Labs
          </Link>
          <Link href="/composite-lab" className="hover:text-[#0A4B69] hover:underline">
            Composite Science Lab
          </Link>
          <Link href="/schemes" className="hover:text-[#0A4B69] hover:underline">
            Govt Schemes (PM SHRI)
          </Link>
          <Link href="/contact-us" className="hover:text-[#0A4B69] hover:underline">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
