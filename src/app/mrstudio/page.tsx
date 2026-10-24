'use client';

import React, { useEffect, useState } from 'react';

export default function MrStudioPage() {
  const [iframeSrc, setIframeSrc] = useState('/freelancers/index.html?v=8');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const search = window.location.search;
      if (search) {
        setIframeSrc(`/freelancers/index.html?v=8&${search.replace(/^\?/, '')}`);
      } else {
        setIframeSrc('/freelancers/index.html?v=8');
      }
    }
  }, []);

  return (
    <main style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden' }}>
      <iframe
        src={iframeSrc}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          display: 'block',
        }}
        title="Dev Sharma - School Website Specialist"
      />
    </main>
  );
}
