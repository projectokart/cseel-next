'use client';

import React, { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface KatexRendererProps {
  latex: string;
  displayMode?: boolean;
  className?: string;
}

export const KatexRenderer: React.FC<KatexRendererProps> = ({
  latex,
  displayMode = true,
  className = '',
}) => {
  const html = useMemo(() => {
    if (!latex || !latex.trim()) return '';
    try {
      return katex.renderToString(latex.trim(), {
        displayMode,
        throwOnError: false,
        strict: false,
      });
    } catch (err: any) {
      return `<span class="text-rose-500 font-mono text-xs">Formula error: ${err.message || 'invalid latex'}</span>`;
    }
  }, [latex, displayMode]);

  if (!html) return null;

  return (
    <span
      className={`katex-rendered-formula inline-block overflow-x-auto max-w-full ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default KatexRenderer;
