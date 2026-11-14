import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Wrench, Briefcase, Home, Sparkles, ArrowRight } from 'lucide-react';

export function getSchoolMaintenanceMetadata(customTitle?: string): Metadata {
  return {
    title: customTitle ? `${customTitle} - Under Maintenance | CSEEL` : 'School Directory Under Maintenance | CSEEL',
    description: 'The School Directory is temporarily undergoing maintenance as we polish and verify fresh dataset records. Back online soon.',
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
      },
    },
  };
}

export default function SchoolUnderMaintenance({
  schoolName,
  locationName,
}: {
  schoolName?: string;
  locationName?: string;
}) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-[#F8F9FA] font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/90 shadow-sm p-8 text-center">
        {/* Maintenance Icon Badge */}
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200/60 flex items-center justify-center mx-auto mb-6 text-amber-600 shadow-xs">
          <Wrench size={32} className="animate-pulse" />
        </div>

        {/* Status Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/70 text-amber-900 text-xs font-semibold mb-4">
          <Sparkles size={12} className="text-amber-600" />
          <span>Site Under Maintenance</span>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">
          {schoolName ? `${schoolName}` : 'Schools Directory'}
        </h1>

        <p className="text-sm font-semibold text-amber-700 mb-4">
          {schoolName ? 'This school profile is temporarily under maintenance' : 'Directory Database Under Maintenance'}
        </p>

        {/* Description */}
        <p className="text-xs leading-relaxed text-slate-600 mb-8 max-w-sm mx-auto">
          We are currently updating, curating and verifying fresh official school datasets to provide polished, accurate information. This section will be restored shortly.
        </p>

        {/* Quick Action Buttons */}
        <div className="space-y-2.5">
          <Link
            href="/edu-network/teachers"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#006FCC] hover:bg-[#005689] text-white text-xs font-bold transition shadow-xs group"
          >
            <Briefcase size={14} />
            <span>Explore 2,700+ Teacher Vacancies</span>
            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
          >
            <Home size={14} className="text-slate-500" />
            <span>Return to Homepage</span>
          </Link>
        </div>

        {/* Trust badge */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-600 font-medium">
          <span>CSEEL India · Educational Network</span>
        </div>
      </div>
    </div>
  );
}
