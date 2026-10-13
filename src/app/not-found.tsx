'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { 
  Home, 
  Search, 
  ArrowRight,
  School,
  Construction, 
  Compass,
} from "lucide-react";

export default function NotFound() {
  const [isSchoolUrl, setIsSchoolUrl] = useState(false);
  const [schoolNameGuess, setSchoolNameGuess] = useState('');
  const [searchUrl, setSearchUrl] = useState('/schools');

  useEffect(() => {
    const path = window.location.pathname;
    // Check if this looks like a school URL
    if (path.startsWith('/school/') || path.includes('vidya') || path.includes('school')) {
      setIsSchoolUrl(true);
      // Extract school name from URL
      const parts = path.split('/').filter(Boolean);
      // For /school/state/district/village/slug - take the slug
      const slug = parts[parts.length - 1] || '';
      const cleanName = slug
        .replace(/\.(html|htm)$/i, '')
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase())
        .trim();
      if (cleanName && cleanName.length > 2) {
        setSchoolNameGuess(cleanName);
        setSearchUrl(`/schools?q=${encodeURIComponent(cleanName)}`);
      }
    }
  }, []);

  return (
    <div className="min-h-[85vh] bg-gradient-to-b from-slate-50 via-white to-sky-50/40 flex flex-col items-center justify-center text-center px-4 py-16 text-slate-800">
      <div className="max-w-xl w-full mx-auto">
        {/* Emblem */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 bg-[#005689]/10 rounded-2xl blur-lg" />
          <div className="relative w-full h-full bg-white rounded-2xl border border-slate-200 shadow-md flex items-center justify-center p-3">
            <img 
              src="/favicon.svg" 
              alt="CSEEL Emblem" 
              className="w-14 h-14 object-contain"
            />
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-600 mb-4">
          <span>Error 404 • Page Not Found</span>
        </div>

        <h1 
          className="text-4xl md:text-5xl font-black tracking-tight mb-3"
          style={{ color: '#003c6e' }}
        >
          {isSchoolUrl ? 'School Page Moved' : 'Page Not Found'}
        </h1>

        <p className="text-base text-slate-600 mb-6 max-w-md mx-auto leading-relaxed">
          {isSchoolUrl 
            ? `The school profile you're looking for may have been updated or the URL has changed. Try searching below to find the correct profile.`
            : 'The page or module you are looking for might have been moved, updated, or is currently under active construction.'
          }
        </p>

        {/* School-specific smart search box */}
        {isSchoolUrl && (
          <div className="bg-[#EDF5FA] border border-[#D6EDFF] rounded-2xl p-4 mb-6 text-left">
            <div className="flex items-center gap-2 mb-3">
              <School className="w-4 h-4 text-[#005689]" />
              <span className="text-sm font-bold text-[#005689]">Find the school you were looking for</span>
            </div>
            {schoolNameGuess && (
              <p className="text-xs text-slate-600 mb-3">
                Were you looking for: <strong className="text-slate-900">{schoolNameGuess}</strong>?
              </p>
            )}
            <div className="flex gap-2">
              <Link
                href={searchUrl}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#005689] text-white font-bold text-sm hover:bg-[#003c6e] transition-all shadow-sm"
              >
                <Search className="w-4 h-4" />
                <span>Search School Directory</span>
              </Link>
              <Link
                href="/schools"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-all"
              >
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#005689] text-white font-semibold text-sm hover:bg-[#003c6e] transition-all shadow-sm"
          >
            <Home className="w-4 h-4" />
            <span>Go to Home</span>
          </Link>

          <Link
            href="/schools"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white border border-[#005689]/30 text-[#005689] font-semibold text-sm hover:bg-[#EDF5FA] transition-all shadow-sm"
          >
            <School className="w-4 h-4" />
            <span>Browse All Schools</span>
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
          <Link href="/steam-lab" className="hover:text-[#005689] hover:underline">
            STEAM & ATL Labs
          </Link>
          <Link href="/composite-lab" className="hover:text-[#005689] hover:underline">
            Composite Science Lab
          </Link>
          <Link href="/schemes" className="hover:text-[#005689] hover:underline">
            Govt Schemes (PM SHRI)
          </Link>
          <Link href="/contact-us" className="hover:text-[#005689] hover:underline">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
