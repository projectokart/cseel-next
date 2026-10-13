'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, Home, AlertTriangle } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log exception to monitoring
    console.error('Unhandled Next.js Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8 text-center">
        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Something went wrong</h2>
        <p className="text-slate-600 text-sm mt-3 leading-relaxed">
          We encountered an unexpected error while loading this page. Our team has been notified.
        </p>

        {error.digest && (
          <p className="mt-3 text-xs font-mono text-slate-400 bg-slate-50 py-1.5 px-3 rounded-lg border border-slate-100">
            Error Digest: {error.digest}
          </p>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-3 mt-8">
          <button
            onClick={() => reset()}
            className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#005689] text-white text-sm font-bold shadow-md shadow-blue-900/10 hover:bg-[#003c6e] transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-all"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
