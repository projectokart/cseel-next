import dynamic from 'next/dynamic';
import React from 'react';
import type { UniversalEditorProps } from './types';

export const UniversalEditor = dynamic<UniversalEditorProps>(
  () => import('./UniversalEditor'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl min-h-[220px]">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 animate-pulse">
          <div className="w-2 h-2 rounded-full bg-purple-600 animate-ping" />
          <span>Initializing Universal Editor...</span>
        </div>
      </div>
    ),
  }
);

export default UniversalEditor;
export * from './types';
export * from './config/editorConfig';
