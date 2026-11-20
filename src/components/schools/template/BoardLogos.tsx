'use client';

import React from 'react';

// Official CBSE Logo SVG (Central Board of Secondary Education)
export function CbseLogo({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="#003874" stroke="#D4AF37" strokeWidth="3" />
      <circle cx="50" cy="50" r="42" fill="#FFFFFF" stroke="#003874" strokeWidth="1.5" />
      {/* Decorative Outer Ring */}
      <circle cx="50" cy="50" r="39" stroke="#D4AF37" strokeWidth="0.8" strokeDasharray="3 2" />
      {/* Open Book */}
      <path d="M50 66 C42 62 30 63 24 67 L24 45 C30 42 42 41 50 45 C58 41 70 42 76 45 L76 67 C70 63 58 62 50 66 Z" fill="#D4AF37" stroke="#003874" strokeWidth="1.5" />
      <path d="M50 45 L50 66" stroke="#003874" strokeWidth="1.5" />
      {/* Sacred Diya / Lamp of Knowledge */}
      <path d="M43 42 C43 38 46 36 50 36 C54 36 57 38 57 42 C57 44 54 46 50 46 C46 46 43 44 43 42 Z" fill="#D97706" />
      <path d="M50 35 C48 31 49 26 50 22 C51 26 52 31 50 35 Z" fill="#EA580C" />
      <circle cx="50" cy="27" r="2.5" fill="#FBBF24" />
      {/* Sunburst Rays of Enlightenment */}
      <path d="M50 16 L50 20 M38 20 L40 23 M62 20 L60 23 M30 27 L33 29 M70 27 L67 29" stroke="#D4AF37" strokeWidth="1.8" strokeLinecap="round" />
      {/* CBSE Text */}
      <text x="50" y="80" textAnchor="middle" fill="#003874" fontSize="10" fontWeight="900" fontFamily="sans-serif">CBSE</text>
    </svg>
  );
}

// Official HBSE / BSEH Logo (Haryana Board of School Education - Bhiwani)
export function HbseLogo({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="#1E3A8A" stroke="#F59E0B" strokeWidth="3" />
      <circle cx="50" cy="50" r="41" fill="#FFFFFF" />
      {/* Haryana Golden Ears of Wheat on sides */}
      <path d="M26 62 C24 50 26 38 34 28 C32 36 33 46 32 58 Z" fill="#F59E0B" />
      <path d="M74 62 C76 50 74 38 66 28 C68 36 67 46 68 58 Z" fill="#F59E0B" />
      {/* Torch of Enlightenment (Mashaal) */}
      <path d="M47 48 L45 68 L55 68 L53 48 Z" fill="#92400E" stroke="#78350F" strokeWidth="1" />
      <path d="M44 48 L56 48 L53 42 L47 42 Z" fill="#F59E0B" />
      {/* Vibrant Flame */}
      <path d="M50 22 C44 28 44 34 47 38 C48 39 52 39 53 38 C56 34 56 28 50 22 Z" fill="#DC2626" />
      <path d="M50 26 C47 30 47 33 49 35 C50 36 51 36 51 35 C53 33 53 30 50 26 Z" fill="#FBBF24" />
      {/* HBSE Text */}
      <text x="50" y="80" textAnchor="middle" fill="#1E3A8A" fontSize="9.5" fontWeight="900" fontFamily="sans-serif">HBSE</text>
    </svg>
  );
}

// Official CISCE / ICSE Logo (Council for the Indian School Certificate Examinations)
export function IcseLogo({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="#831843" stroke="#F59E0B" strokeWidth="3" />
      <circle cx="50" cy="50" r="41" fill="#FFFFFF" stroke="#831843" strokeWidth="1.5" />
      {/* Shield Crest */}
      <path d="M34 30 L66 30 L66 54 C66 65 50 72 50 72 C50 72 34 65 34 54 Z" fill="#BE185D" stroke="#831843" strokeWidth="1.5" />
      {/* Book & Feather Quill */}
      <path d="M40 42 C44 40 48 41 50 43 C52 41 56 40 60 42 L60 55 C56 53 52 54 50 56 C48 54 44 53 40 55 Z" fill="#FFFFFF" />
      <path d="M55 35 L45 52" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
      {/* CISCE / ICSE Label */}
      <text x="50" y="84" textAnchor="middle" fill="#831843" fontSize="9" fontWeight="900" fontFamily="sans-serif">ICSE</text>
    </svg>
  );
}

// Official IB Logo (International Baccalaureate World School)
export function IbLogo({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="#0284C7" stroke="#38BDF8" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="42" fill="#FFFFFF" />
      {/* Stylized IB Crest Globe Arch */}
      <circle cx="50" cy="46" r="22" stroke="#0369A1" strokeWidth="4" />
      <ellipse cx="50" cy="46" rx="10" ry="22" stroke="#0369A1" strokeWidth="2.5" />
      <path d="M28 46 L72 46" stroke="#0369A1" strokeWidth="2.5" />
      <path d="M34 35 L66 35 M34 57 L66 57" stroke="#0284C7" strokeWidth="1.5" />
      {/* IB letters */}
      <rect x="36" y="72" width="28" height="15" rx="3" fill="#0369A1" />
      <text x="50" y="83" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="900" fontFamily="sans-serif">IB</text>
    </svg>
  );
}

// Official Cambridge Logo (Cambridge Assessment International Education)
export function CambridgeLogo({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="#B91C1C" stroke="#FBBF24" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="42" fill="#FFFFFF" />
      {/* Cambridge Shield */}
      <path d="M32 26 L68 26 L68 52 C68 64 50 71 50 71 C50 71 32 64 32 52 Z" fill="#DC2626" stroke="#991B1B" strokeWidth="1.5" />
      {/* White Cross */}
      <path d="M50 26 L50 70 M32 44 L68 44" stroke="#FFFFFF" strokeWidth="4" />
      {/* Central Academic Closed Book */}
      <rect x="44" y="38" width="12" height="12" rx="1.5" fill="#FBBF24" stroke="#78350F" strokeWidth="1" />
      {/* CIE Label */}
      <text x="50" y="84" textAnchor="middle" fill="#991B1B" fontSize="8.5" fontWeight="900" fontFamily="sans-serif">CAMBRIDGE</text>
    </svg>
  );
}

// Official UPMSP / UP Board Logo (Uttar Pradesh Madhyamik Shiksha Parishad)
export function UpBoardLogo({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="#047857" stroke="#F59E0B" strokeWidth="3" />
      <circle cx="50" cy="50" r="41" fill="#FFFFFF" stroke="#047857" strokeWidth="1.5" />
      {/* Bow and Arrow Emblem */}
      <path d="M35 50 C35 38 65 38 65 50" stroke="#065F46" strokeWidth="2.5" fill="none" />
      <path d="M35 50 L65 50 M50 35 L50 65" stroke="#B45309" strokeWidth="2" />
      {/* Twin Fishes */}
      <path d="M32 56 C36 53 40 56 42 60 C38 62 34 60 32 56 Z" fill="#047857" />
      <path d="M68 56 C64 53 60 56 58 60 C62 62 66 60 68 56 Z" fill="#047857" />
      {/* UP Board Text */}
      <text x="50" y="80" textAnchor="middle" fill="#065F46" fontSize="9" fontWeight="900" fontFamily="sans-serif">UP BOARD</text>
    </svg>
  );
}

// Official Maharashtra State Board Logo (MSBSHSE)
export function MaharashtraBoardLogo({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="#C2410C" stroke="#FBBF24" strokeWidth="3" />
      <circle cx="50" cy="50" r="41" fill="#FFFFFF" stroke="#C2410C" strokeWidth="1.5" />
      {/* Rising Sun */}
      <circle cx="50" cy="46" r="14" fill="#F59E0B" />
      <path d="M50 26 L50 30 M38 30 L40 33 M62 30 L60 33 M32 38 L36 39 M68 38 L64 39" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" />
      {/* Open Book */}
      <path d="M50 58 C42 54 32 55 26 58 L26 42 C32 39 42 38 50 42 C58 38 68 39 74 42 L74 58 C68 55 58 54 50 58 Z" fill="#FFFFFF" stroke="#9A3412" strokeWidth="1.5" />
      {/* MSBSHSE Label */}
      <text x="50" y="80" textAnchor="middle" fill="#9A3412" fontSize="8.5" fontWeight="900" fontFamily="sans-serif">MSBSHSE</text>
    </svg>
  );
}

// General State Board Logo (Department of School Education)
export function StateBoardLogo({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="#0F766E" stroke="#5EEAD4" strokeWidth="3" />
      <circle cx="50" cy="50" r="41" fill="#FFFFFF" stroke="#0F766E" strokeWidth="1.5" />
      {/* Ashoka Pillar Lion Capital Motif Silhouette */}
      <path d="M42 30 L58 30 L55 54 L45 54 Z" fill="#0F766E" />
      <rect x="40" y="54" width="20" height="6" rx="1.5" fill="#134E4A" />
      <circle cx="50" cy="57" r="2" fill="#5EEAD4" />
      <path d="M36 60 L64 60 L61 66 L39 66 Z" fill="#0F766E" />
      {/* State Board Label */}
      <text x="50" y="80" textAnchor="middle" fill="#134E4A" fontSize="8.5" fontWeight="900" fontFamily="sans-serif">STATE BOARD</text>
    </svg>
  );
}

// Official 100KW Rooftop Solar Panel Icon Component
export function SolarPanelIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {/* Angled Solar Array Surface */}
      <polygon points="3 17 8 5 21 5 16 17" fill="#0284C7" fillOpacity="0.25" stroke="#0284C7" strokeWidth="1.8" />
      {/* Grid Lines */}
      <line x1="14.5" y1="5" x2="9.5" y2="17" stroke="#0284C7" strokeWidth="1.4" />
      <line x1="5.5" y1="11" x2="18.5" y2="11" stroke="#0284C7" strokeWidth="1.4" />
      {/* Stand Pillars */}
      <line x1="7" y1="17" x2="7" y2="21" stroke="#475569" strokeWidth="2" />
      <line x1="12" y1="17" x2="12" y2="21" stroke="#475569" strokeWidth="2" />
      <line x1="4" y1="21" x2="15" y2="21" stroke="#475569" strokeWidth="2" />
      {/* Sun Ray Beams */}
      <path d="M19 2 L20 4 M22 5 L20 6" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
