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
  const registerUrl = '/edu-network/teachers/register';
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
      <Link
        href={registerUrl}
        onClick={onRegisterClick}
        className="block w-full rounded-2xl overflow-hidden border border-[#E7E7E7] hover:border-[#0A66C2] transition-all duration-300 shadow-[0_1px_4px_rgba(0,0,0,0.04)] hover:shadow-lg group relative cursor-pointer bg-slate-900"
        title="Register as Verified Faculty on CSEEL"
      >
        <div className="w-full h-44 sm:h-52 md:h-56 lg:h-56 relative overflow-hidden flex items-center justify-center">
          <img
            src={imageSrc}
            alt={altText}
            className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-500"
            loading="lazy"
          />
        </div>
      </Link>
    </div>
  );
}
