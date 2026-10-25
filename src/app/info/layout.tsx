import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  robots: {
    index: true,
    follow: true,
  },
};

export default function InfoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-rose-100 selection:text-rose-900">
      {children}
    </div>
  );
}
