import React from 'react';
import { Sparkles } from 'lucide-react';
import MaterialCircularLoader from '@/components/shared/MaterialCircularLoader';

export default function SchoolsHierarchyLoading() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      {/* Top Animated Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1.5 bg-blue-600/20 z-50 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-500 via-indigo-400 to-amber-400 animate-pulse w-full origin-left-right" />
      </div>

      {/* Header Banner Skeleton */}
      <header className="bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 text-white pt-10 pb-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Breadcrumbs Skeleton */}
          <div className="flex items-center gap-2 mb-6">
            <div className="h-3.5 w-16 bg-white/20 rounded animate-pulse" />
            <div className="h-3.5 w-3.5 bg-white/20 rounded-full animate-pulse" />
            <div className="h-3.5 w-28 bg-white/20 rounded animate-pulse" />
            <div className="h-3.5 w-3.5 bg-white/20 rounded-full animate-pulse" />
            <div className="h-3.5 w-24 bg-white/30 rounded animate-pulse" />
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/30 text-blue-200 text-xs font-semibold border border-blue-400/30">
                <MaterialCircularLoader size="xs" color="#fbbc04" />
                <span>Connecting to UDISE+ National Education Network...</span>
              </div>
              <div className="h-10 sm:h-12 w-3/4 bg-white/20 rounded-xl animate-pulse" />
              <div className="h-4 w-full max-w-xl bg-white/15 rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-white/15 rounded animate-pulse" />
            </div>

            {/* Quick Metrics Card Skeleton */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 flex flex-row md:flex-col gap-4 justify-around min-w-[240px]">
              <div>
                <div className="h-3 w-20 bg-white/20 rounded animate-pulse mb-2" />
                <div className="h-8 w-28 bg-white/30 rounded-lg animate-pulse" />
              </div>
              <div className="border-l md:border-l-0 md:border-t border-white/15 pl-4 md:pl-0 md:pt-3">
                <div className="h-3 w-24 bg-emerald-400/30 rounded animate-pulse mb-2" />
                <div className="h-7 w-20 bg-emerald-400/40 rounded-lg animate-pulse" />
              </div>
            </div>
          </div>

          {/* Quick Search Bar Skeleton */}
          <div className="mt-8 max-w-2xl h-12 bg-white/20 rounded-xl animate-pulse border border-white/20" />
        </div>
      </header>

      {/* Main Container Skeletons */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 space-y-8">
        {/* Loading Banner Notification */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
              <MaterialCircularLoader size="sm" multicolor={true} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                Fetching Live School Records & Calculation
              </h3>
              <p className="text-sm text-slate-500">
                Loading verified school affiliations, STEM labs, Atal Tinkering Labs (ATL), and student strength...
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> 3,88,932+ Verified Database
          </div>
        </div>

        {/* Location / School Cards Skeleton Grid */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-slate-200/80">
          <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-6">
            <div className="h-6 w-64 bg-slate-200 rounded-lg animate-pulse" />
            <div className="h-6 w-32 bg-slate-100 rounded-lg animate-pulse" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 16 }).map((_, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-3 animate-pulse"
              >
                <div className="flex items-center justify-between">
                  <div className="h-4 w-3/4 bg-slate-200 rounded" />
                  <div className="h-4 w-4 bg-slate-200 rounded-full" />
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="h-3 w-1/3 bg-slate-200 rounded" />
                  <div className="h-3 w-1/4 bg-slate-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
