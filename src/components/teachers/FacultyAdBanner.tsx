'use client';

import React from 'react';
import Link from 'next/link';

interface FacultyAdBannerProps {
  bannerNumber?: 1 | 2;
  className?: string;
  onRegisterClick?: () => void;
}

export default function FacultyAdBanner({
  bannerNumber = 1,
  className = '',
  onRegisterClick,
}: FacultyAdBannerProps) {
  const registerUrl =
    'https://docs.google.com/forms/d/e/1FAIpQLScgKoheaC5BRHhpGPUQHSOFbaCJpuK2LCz82I7Ii7RIR_Z-RQ/viewform';
  const imageSrc =
    bannerNumber === 1
      ? '/images/banners/faculty-hiring-banner-1.webp'
      : '/images/banners/faculty-hiring-banner-2.webp';
  const altText =
    bannerNumber === 1
      ? 'Are you a School Teacher? Join CSEEL as a Faculty'
      : 'Looking to Teach in Top Schools? Register as Faculty on CSEEL';

  return (
    <div className={`w-full col-span-full ${className}`}>
      <a
        href={registerUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onRegisterClick}
        className="block w-full rounded-2xl overflow-hidden border border-[#E7E7E7] hover:border-[#0A66C2] transition-all duration-300 shadow-[0_1px_4px_rgba(0,0,0,0.04)] hover:shadow-lg group relative cursor-pointer bg-slate-900"
        title="Register as Verified Faculty on CSEEL"
      >
        <div className="w-full aspect-[16/9] sm:aspect-[1.79/1] max-h-[320px] relative overflow-hidden flex items-center justify-center bg-slate-950">
          <img
            src={imageSrc}
            alt={altText}
            className="w-full h-full object-contain object-center group-hover:scale-[1.01] transition-transform duration-500"
            loading="lazy"
          />
        </div>
      </a>
    </div>
  );
}
