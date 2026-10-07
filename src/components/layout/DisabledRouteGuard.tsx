'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, Home, Lock } from 'lucide-react';
import { useNavVisibility } from '@/contexts/NavigationContext';

export const DisabledRouteGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const { isRouteAllowed } = useNavVisibility();

  const isAllowed = isRouteAllowed(pathname || '/');

  if (!isAllowed) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/80 text-rose-600 flex items-center justify-center mx-auto border border-rose-200 dark:border-rose-800">
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 text-[10px] font-black uppercase rounded-full border border-rose-200">
              Module Disabled by Governance
            </span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Section Under Maintenance
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              This department module or service URL (<span className="font-mono font-bold text-slate-700 dark:text-slate-300">{pathname}</span>) is currently disabled or restricted by the CSEEL Central Super Administrator.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-2xl shadow-md transition-all"
            >
              <Home className="w-4 h-4" />
              <span>Return to Homepage</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default DisabledRouteGuard;
