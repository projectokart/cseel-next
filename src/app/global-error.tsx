'use client';

import { useEffect } from 'react';
import { RefreshCw, AlertOctagon } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Fatal Root Application Error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8 text-center">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <AlertOctagon className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Application Error</h1>
          <p className="text-slate-600 text-sm mt-3 leading-relaxed">
            A critical system error occurred. Please refresh the page to restore your session.
          </p>
          {error.digest && (
            <p className="mt-3 text-xs font-mono text-slate-400 bg-slate-50 py-1.5 px-3 rounded-lg border border-slate-100">
              Ref: {error.digest}
            </p>
          )}
          <button
            onClick={() => reset()}
            className="w-full mt-6 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#005689] text-white text-sm font-bold shadow-md hover:bg-[#003c6e] transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}
