'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Home, ArrowLeft, Compass } from 'lucide-react';

export default function UniversalBackBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCanGoBack(window.history.length > 1);
    }
  }, [pathname]);

  // Don't render on the home landing page
  if (!pathname || pathname === '/' || pathname === '') {
    return null;
  }

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    } else {
      // Fallback hierarchy
      if (pathname.startsWith('/edu-network/jobs')) {
        router.push('/edu-network/jobs');
      } else if (pathname.startsWith('/edu-network/teachers')) {
        router.push('/edu-network/teachers');
      } else if (pathname.startsWith('/edu-network/students')) {
        router.push('/edu-network/students');
      } else if (pathname.startsWith('/edu-network/org')) {
        router.push('/edu-network');
      } else {
        router.push('/');
      }
    }
  };

  // Build clean breadcrumb segments
  const pathSegments = pathname.split('/').filter(Boolean);

  return (
    <div className="bg-slate-900/95 backdrop-blur-md text-white border-b border-slate-800 py-2 px-4 sticky top-16 z-30 shadow-md">
      <div className="container mx-auto max-w-7xl flex items-center justify-between text-xs gap-3">
        
        {/* Universal Back Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black rounded-xl text-xs shadow-md transition-all active:scale-95 group"
            title="Go Back to Previous Page"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Back</span>
          </button>

          {/* Breadcrumb Trail */}
          <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1 text-slate-400 font-medium overflow-x-auto text-[11px]">
            <Link
              href="/"
              className="hover:text-white flex items-center gap-1 transition-colors px-1 py-0.5 rounded hover:bg-slate-800"
            >
              <Home className="w-3 h-3" />
              <span>Home</span>
            </Link>

            {pathSegments.map((segment, index) => {
              const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
              const isLast = index === pathSegments.length - 1;
              const formattedName = segment
                .replace(/-/g, ' ')
                .replace(/\b\w/g, (l) => l.toUpperCase());

              return (
                <React.Fragment key={href}>
                  <span className="text-slate-600">/</span>
                  {isLast ? (
                    <span className="text-cyan-400 font-bold truncate max-w-[200px] md:max-w-[320px]">
                      {formattedName}
                    </span>
                  ) : (
                    <Link
                      href={href}
                      className="hover:text-white transition-colors px-1 py-0.5 rounded hover:bg-slate-800 truncate max-w-[150px]"
                    >
                      {formattedName}
                    </Link>
                  )}
                </React.Fragment>
              );
            })}
          </nav>
        </div>

        {/* Quick Return to Hub Links */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/edu-network"
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-[11px] font-bold transition-colors hidden md:inline-flex items-center gap-1"
          >
            <Compass className="w-3 h-3 text-cyan-400" />
            <span>EduNetwork Hub</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
