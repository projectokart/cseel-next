'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// ─── CRISP SELF-CONTAINED SVG ICONS (NO RUNTIME DEPENDENCY GLITCHES) ──────────

function ArrowRightIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function MenuIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function CloseIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function TelescopeIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m10 10 8-5 3 5-8 5" />
      <path d="m5 13 5-3" />
      <circle cx="4" cy="14" r="2" />
      <path d="m14 11-6 10" />
      <path d="m14 11 6 10" />
      <path d="M14 11v10" />
    </svg>
  );
}

function SunIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function StarIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function CompassIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}

function PlanetIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="6" />
      <path d="M4.5 16.5C3.5 15.5 3 14 3 12c0-3.5 4-6.5 9-6.5 3 0 5.7 1 7.2 2.5" />
      <path d="M19.5 7.5c1 1 1.5 2.5 1.5 4.5 0 3.5-4 6.5-9 6.5-3 0-5.7-1-7.2-2.5" />
    </svg>
  );
}

function GalaxyIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3a9 9 0 0 0-9 9c0 4.97 4.03 9 9 9s9-4.03 9-9" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M12 7c2.5 0 4.5 2 4.5 4.5S14.5 16 12 16" />
    </svg>
  );
}

function CameraIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function RocketIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4.5c1.62-1.63 5-2.5 5-2.5" />
      <path d="M15 15v5s3.03-.55 4.5-2c1.63-1.62 2.5-5 2.5-5" />
    </svg>
  );
}

function SendIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function CheckCircleIcon({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function YoutubeIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

function InstagramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function LinkedinIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
    </svg>
  );
}

// ─── 4 HERO SLIDES DATA (CLEAN VISUALS, MAX 5 WORDS DESKTOP TITLE) ─────────────

const HERO_SLIDES = [
  {
    id: 'slide-1',
    desktopAvif: '/images/antariksha/slide1_desktop.avif',
    desktopWebp: '/images/antariksha/slide1_desktop.webp',
    mobileAvif: '/images/antariksha/slide1_mobile.avif',
    mobileWebp: '/images/antariksha/slide1_mobile.webp',
    alt: 'Students stargazing with telescope under the night sky',
    tag: 'EXPLORE · EXPERIMENT · OBSERVE',
    title: 'Real Learning Beyond Classrooms', // Max 4 words
    highlightWord: 'Beyond Classrooms',
    subtitle: 'Hands-on astronomical experiments, research telescopes, and real-world cosmos exploration — from our labs to the stars.',
    cta: 'Enquiry',
  },
  {
    id: 'slide-2',
    desktopAvif: '/images/antariksha/slide2_desktop.avif',
    desktopWebp: '/images/antariksha/slide2_desktop.webp',
    mobileAvif: '/images/antariksha/slide2_mobile.avif',
    mobileWebp: '/images/antariksha/slide2_mobile.webp',
    alt: 'Solar eclipse over planet Earth horizon from space',
    tag: 'HELIOPHYSICS · SOLAR OBSERVATION',
    title: 'Witness Wonders Beyond Our World', // Max 5 words
    highlightWord: 'Beyond Our World',
    subtitle: 'Observe solar eclipses, sunspots, and coronal prominences using specialized H-Alpha solar observation filters.',
    cta: 'Enquiry',
  },
  {
    id: 'slide-3',
    desktopAvif: '/images/antariksha/slide3_desktop.avif',
    desktopWebp: '/images/antariksha/slide3_desktop.webp',
    mobileAvif: '/images/antariksha/slide3_mobile.avif',
    mobileWebp: '/images/antariksha/slide3_mobile.webp',
    alt: 'Earth curvature and atmosphere limb against deep space',
    tag: 'ORBITAL MECHANICS · STRATOSPHERE',
    title: 'Journey to the Cosmic Frontier', // Max 5 words
    highlightWord: 'Cosmic Frontier',
    subtitle: 'Understand Keplerian planetary motion, satellite orbital mechanics, and atmospheric boundaries through hands-on practicals.',
    cta: 'Enquiry',
  },
  {
    id: 'slide-4',
    desktopAvif: '/images/antariksha/slide4_desktop.avif',
    desktopWebp: '/images/antariksha/slide4_desktop.webp',
    mobileAvif: '/images/antariksha/slide4_mobile.avif',
    mobileWebp: '/images/antariksha/slide4_mobile.webp',
    alt: 'Spacewalking astronaut orbiting Earth against stars',
    tag: 'DEEP SPACE · ASTRONAUTICS',
    title: "Inspiring Tomorrow's Space Explorers", // Max 4 words
    highlightWord: 'Space Explorers',
    subtitle: 'Equipping schools and colleges with complete astronomical laboratories, experiential curriculum, and night stargazing sessions.',
    cta: 'Enquiry',
  },
];

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────────

export default function AntarikshaPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [enquirySubmitted, setEnquirySubmitted] = useState(false);
  const [formSubject, setFormSubject] = useState('Antariksha Astronomy Lab Enquiry');
  const [formData, setFormData] = useState({
    name: '',
    schoolName: '',
    phone: '',
    email: '',
    city: '',
    program: 'Antariksha Astronomy Lab Setup',
    message: ''
  });

  const handleOpenEnquiry = (programName?: string) => {
    if (programName) {
      setFormSubject(programName);
      setFormData(prev => ({ ...prev, program: programName }));
    }
    setEnquiryOpen(true);
  };

  const handleSubmitEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setEnquirySubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans selection:bg-[#006FCC] selection:text-white">
      {/* ========================================================
          1. HEADER: OFFICIAL WHITE CSEEL LOGO IN TOP-LEFT CORNER
         ======================================================== */}
      <header className="sticky top-0 z-50 w-full bg-[#050811]/95 backdrop-blur-md border-b border-white/10 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          
          {/* Top Left Corner: Official CSEEL White Logo */}
          <Link href="/" className="flex items-center hover:opacity-90 transition-opacity shrink-0">
            <img
              src="/images/cseel-logo-white.svg"
              alt="CSEEL - Center for Scientific Exploration and Experiential Learning"
              className="h-9 sm:h-11 w-auto object-contain"
            />
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-gray-200">
            <Link href="/" className="hover:text-[#006FCC] transition-colors">
              Home
            </Link>
            <a href="#our-lab" className="hover:text-[#006FCC] transition-colors">
              Our Lab
            </a>
            <a href="#workshops" className="hover:text-[#006FCC] transition-colors">
              Workshops
            </a>
            <a href="#space-exploration" className="hover:text-[#006FCC] transition-colors">
              Space Exploration
            </a>
            <a href="#stargazing" className="hover:text-[#006FCC] transition-colors">
              Stargazing
            </a>
            <Link href="/about" className="hover:text-[#006FCC] transition-colors">
              About
            </Link>
          </nav>

          {/* Right Action: Authentic CSEEL Button Design */}
          <div className="hidden sm:flex items-center gap-4">
            <button
              onClick={() => handleOpenEnquiry('Header Enquiry')}
              className="px-6 py-2.5 rounded-full text-sm font-semibold text-white bg-[#006FCC] hover:bg-[#005499] shadow-md shadow-blue-500/25 active:scale-95 transition-all cursor-pointer"
            >
              Enquiry
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <CloseIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0A0E1C] border-b border-white/10 px-6 py-5 space-y-4">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-gray-300 hover:text-white"
            >
              Home
            </Link>
            <a
              href="#our-lab"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-gray-300 hover:text-white"
            >
              Our Lab
            </a>
            <a
              href="#workshops"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-gray-300 hover:text-white"
            >
              Workshops
            </a>
            <a
              href="#space-exploration"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-gray-300 hover:text-white"
            >
              Space Exploration
            </a>
            <a
              href="#stargazing"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-gray-300 hover:text-white"
            >
              Stargazing
            </a>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-gray-300 hover:text-white"
            >
              About
            </Link>
            <div className="pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleOpenEnquiry('Mobile Enquiry');
                }}
                className="w-full py-3 rounded-full text-center font-semibold text-white bg-[#006FCC] hover:bg-[#005499] shadow-md shadow-blue-500/30 cursor-pointer"
              >
                Enquiry
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ========================================================
          2. HERO SECTION: SMOOTH SWIPER CAROUSEL (4 AVIF SLIDES)
             Clean images (NO baked-in header, NO baked-in text,
             NO baked-in button). Text and Button rendered in HTML.
         ======================================================== */}
      <section className="relative w-full bg-[#000000] overflow-hidden">
        <Swiper
          modules={[Autoplay, EffectFade, Pagination, Navigation]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          loop={true}
          speed={900}
          autoplay={{
            delay: 5500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{
            clickable: true,
            bulletClass: 'antariksha-bullet',
            bulletActiveClass: 'antariksha-bullet-active',
          }}
          className="w-full relative"
        >
          {HERO_SLIDES.map((slide, index) => (
            <SwiperSlide key={slide.id} className="relative w-full">
              {/* DESKTOP HERO SLIDE (Aspect ratio 16:9, max 1440px) */}
              <div className="hidden md:block relative w-full h-[620px] lg:h-[720px] max-w-[1440px] mx-auto overflow-hidden">
                {/* Pure Clean AVIF Background Image with WebP fallback */}
                <picture className="absolute inset-0 w-full h-full">
                  <source srcSet={slide.desktopAvif} type="image/avif" />
                  <source srcSet={slide.desktopWebp} type="image/webp" />
                  <img
                    src={slide.desktopWebp}
                    alt={slide.alt}
                    className="w-full h-full object-cover object-center"
                    loading={index === 0 ? 'eager' : 'lazy'}
                  />
                </picture>

                {/* Subtle Cinematic Vignette & Radial Dark Gradient on Left for Razor-Sharp Text Contrast */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

                {/* HTML TEXT OVERLAY (Max 5 words title on desktop) */}
                <div className="relative z-10 h-full max-w-7xl mx-auto px-6 lg:px-12 flex flex-col justify-center max-w-2xl">
                  {/* Eyebrow Tag */}
                  <div className="inline-flex items-center gap-2 mb-4">
                    <span className="w-6 h-[2px] bg-cyan-400" />
                    <span className="text-xs font-bold tracking-widest text-cyan-400 uppercase">
                      {slide.tag}
                    </span>
                  </div>

                  {/* Title (Max 5 words) */}
                  <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight text-white leading-[1.12] mb-5">
                    {slide.title.replace(slide.highlightWord, '')}
                    <span className="bg-gradient-to-r from-cyan-400 to-[#38EF7D] bg-clip-text text-transparent">
                      {slide.highlightWord}
                    </span>
                  </h1>

                  {/* Subtitle */}
                  <p className="text-gray-200 text-base lg:text-lg leading-relaxed max-w-lg mb-8 font-normal">
                    {slide.subtitle}
                  </p>

                  {/* Authentic CSEEL Button Design */}
                  <div>
                    <button
                      onClick={() => handleOpenEnquiry(`Hero CTA - ${slide.title}`)}
                      className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full font-semibold text-white bg-[#006FCC] hover:bg-[#005499] shadow-lg shadow-blue-500/30 hover:shadow-cyan-400/30 active:scale-95 transition-all text-base cursor-pointer group"
                    >
                      <span>{slide.cta}</span>
                      <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>

              {/* MOBILE HERO SLIDE (9:16 Portrait, AVIF, Optimized) */}
              <div className="block md:hidden relative w-full h-[580px] overflow-hidden">
                <picture className="absolute inset-0 w-full h-full">
                  <source srcSet={slide.mobileAvif} type="image/avif" />
                  <source srcSet={slide.mobileWebp} type="image/webp" />
                  <img
                    src={slide.mobileWebp}
                    alt={slide.alt}
                    className="w-full h-full object-cover object-center"
                    loading={index === 0 ? 'eager' : 'lazy'}
                  />
                </picture>

                {/* Mobile Text Readability Gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/30" />

                {/* Mobile HTML Content */}
                <div className="relative z-10 h-full px-6 flex flex-col justify-end pb-12">
                  <div className="text-[11px] font-bold tracking-widest text-cyan-400 uppercase mb-2">
                    {slide.tag}
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-2">
                    {slide.title.replace(slide.highlightWord, '')}
                    <span className="bg-gradient-to-r from-cyan-400 to-[#38EF7D] bg-clip-text text-transparent">
                      {slide.highlightWord}
                    </span>
                  </h1>

                  <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-5 line-clamp-2">
                    {slide.subtitle}
                  </p>

                  <button
                    onClick={() => handleOpenEnquiry(`Mobile Hero - ${slide.title}`)}
                    className="w-full py-3.5 rounded-full font-semibold text-white bg-[#006FCC] hover:bg-[#005499] shadow-lg shadow-blue-500/40 text-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{slide.cta}</span>
                    <ArrowRightIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom CSS for Swiper pagination bullets */}
        <style jsx global>{`
          .antariksha-bullet {
            display: inline-block;
            width: 10px;
            height: 10px;
            margin: 0 4px;
            border-radius: 9999px;
            background-color: rgba(255, 255, 255, 0.35);
            transition: all 0.3s ease;
            cursor: pointer;
          }
          .antariksha-bullet-active {
            width: 28px;
            background-color: #006FCC;
            box-shadow: 0 0 10px rgba(0, 111, 204, 0.8);
          }
        `}</style>
      </section>

      {/* ========================================================
          3. SECTION 1: OUR LAB (STRICTLY ASTRONOMY RELATED)
         ======================================================== */}
      <section id="our-lab" className="py-20 lg:py-28 bg-[#050811] border-t border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold tracking-widest uppercase">
                <span className="w-6 h-[2px] bg-cyan-400" />
                <span>OUR LAB · ANTARIKSHA</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                Hands-On Astronomy
                <br />
                in a Real Observatory Lab
              </h2>

              <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-xl font-normal">
                Explore celestial mechanics, optics, and solar astrophysics with state-of-the-art
                telescopes and guided mentorship. Our labs turn night sky curiosity into real scientific mastery.
              </p>

              {/* 4 Feature Badges (100% Astronomy) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-2 group">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                    <TelescopeIcon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold text-gray-200">Modern Telescopes</span>
                </div>

                <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-2 group">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                    <SunIcon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold text-gray-200">Solar H-Alpha</span>
                </div>

                <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-2 group">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                    <CompassIcon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold text-gray-200">Expert Mentors</span>
                </div>

                <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-2 group">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                    <StarIcon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold text-gray-200">Real-Sky Projects</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <button
                  onClick={() => handleOpenEnquiry('Explore Antariksha Lab Enquiry')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-gray-200 border border-white/20 hover:border-cyan-400 hover:text-white hover:bg-cyan-500/10 transition-all group cursor-pointer"
                >
                  <span>Explore Our Lab</span>
                  <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Right Visual Card with Astronomy Lab Photo */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] group">
                <div className="relative aspect-[16/10] w-full">
                  <img
                    src="/images/antariksha/astronomy_lab.jpg"
                    alt="Antariksha Astronomy Lab with optical telescope and celestial globes"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050811]/70 via-transparent to-transparent" />
                </div>
                {/* Decorative Translucent Corner Badges */}
                <div className="absolute top-4 left-4 w-10 h-10 rounded-xl bg-cyan-400/20 backdrop-blur-md border border-cyan-400/40 -rotate-12" />
                <div className="absolute bottom-4 right-4 w-12 h-12 rounded-2xl bg-cyan-500/20 backdrop-blur-md border border-cyan-500/40 rotate-6" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. SECTION 2: ASTRONOMY WORKSHOPS (STRICTLY ASTRONOMY)
         ======================================================== */}
      <section id="workshops" className="py-20 lg:py-28 bg-[#080C18] border-t border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Visual: Students assembling telescope optics */}
            <div className="lg:col-span-6 order-2 lg:order-1 relative">
              <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] group">
                <div className="relative aspect-[16/10] w-full">
                  <img
                    src="/images/antariksha/astronomy_workshop.jpg"
                    alt="Students assembling telescope lenses and star charts"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080C18]/70 via-transparent to-transparent" />
                </div>
                <div className="absolute top-4 left-4 w-10 h-10 rounded-xl bg-amber-400/30 backdrop-blur-md border border-amber-400/50 -rotate-6" />
                <div className="absolute bottom-4 right-4 w-12 h-12 rounded-2xl bg-cyan-500/20 backdrop-blur-md border border-cyan-500/40 rotate-12" />
              </div>
            </div>

            {/* Right Content */}
            <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold tracking-widest uppercase">
                <span className="w-6 h-[2px] bg-cyan-400" />
                <span>ASTRONOMY WORKSHOPS</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                Build Telescopes,
                <br />
                Track the Universe
              </h2>

              <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-xl font-normal">
                Our practical astronomy workshops help students gain hands-on skills in optical assembly,
                mirror collimation, solar flare detection, and celestial navigation.
              </p>

              {/* 4 Astronomy Workshop Pillars */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-2 group">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                    <TelescopeIcon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold text-gray-200">Telescope Optics</span>
                </div>

                <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-2 group">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                    <SunIcon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold text-gray-200">Solar Flares</span>
                </div>

                <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-2 group">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                    <CameraIcon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold text-gray-200">Astrophoto</span>
                </div>

                <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-2 group">
                  <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform">
                    <CompassIcon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold text-gray-200">Star Mapping</span>
                </div>
              </div>

              {/* Action Button: Authentic CSEEL Button */}
              <div className="pt-4">
                <button
                  onClick={() => handleOpenEnquiry('Astronomy Workshops Enquiry')}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-semibold text-white bg-[#006FCC] hover:bg-[#005499] shadow-md shadow-blue-500/30 transition-all group cursor-pointer"
                >
                  <span>View Workshops</span>
                  <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          5. SECTION 3: SPACE EXPLORATION
         ======================================================== */}
      <section id="space-exploration" className="py-20 lg:py-28 bg-[#03050C] border-t border-white/10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold tracking-widest uppercase">
                <span className="w-6 h-[2px] bg-cyan-400" />
                <span>SPACE EXPLORATION</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                A Closer Look at a
                <br />
                Bigger Universe
              </h2>

              <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-xl font-normal">
                From understanding our Solar System to exploring distant galaxies, our space programs
                inspire students to dream, question and explore beyond the ordinary.
              </p>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  onClick={() => handleOpenEnquiry('Explore Space Programs Enquiry')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-gray-200 border border-white/20 hover:border-cyan-400 hover:text-white hover:bg-cyan-500/10 transition-all group cursor-pointer"
                >
                  <span>Explore Space</span>
                  <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Right Visual: Curved Earth Limb from Space */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden border border-cyan-500/20 shadow-[0_0_50px_rgba(6,182,212,0.15)] group">
                <div className="relative aspect-[16/10] w-full">
                  <img
                    src="/images/antariksha/earth_space.jpg"
                    alt="Curved Earth horizon from orbit in starry space"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#03050C]/70 via-transparent to-transparent" />
                </div>
              </div>
            </div>
          </div>

          {/* 4 Space Category Pillars */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-16 border-t border-white/10 mt-16">
            <div className="flex flex-col items-center text-center space-y-3 group cursor-pointer" onClick={() => handleOpenEnquiry('Solar System Practical')}>
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:border-cyan-400 transition-all">
                <PlanetIcon className="w-7 h-7" />
              </div>
              <span className="text-sm font-semibold text-gray-200 group-hover:text-cyan-400 transition-colors">Solar System</span>
            </div>

            <div className="flex flex-col items-center text-center space-y-3 group cursor-pointer" onClick={() => handleOpenEnquiry('Galaxies and Deep Sky')}>
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 group-hover:border-purple-400 transition-all">
                <GalaxyIcon className="w-7 h-7" />
              </div>
              <span className="text-sm font-semibold text-gray-200 group-hover:text-purple-400 transition-colors">Galaxies</span>
            </div>

            <div className="flex flex-col items-center text-center space-y-3 group cursor-pointer" onClick={() => handleOpenEnquiry('Astronomy Lab Infrastructure')}>
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:border-blue-400 transition-all">
                <TelescopeIcon className="w-7 h-7" />
              </div>
              <span className="text-sm font-semibold text-gray-200 group-hover:text-blue-400 transition-colors">Astronomy</span>
            </div>

            <div className="flex flex-col items-center text-center space-y-3 group cursor-pointer" onClick={() => handleOpenEnquiry('Future Space Missions')}>
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 group-hover:border-amber-400 transition-all">
                <RocketIcon className="w-7 h-7" />
              </div>
              <span className="text-sm font-semibold text-gray-200 group-hover:text-amber-400 transition-colors">Future Missions</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          6. SECTION 4: STARGAZING
         ======================================================== */}
      <section id="stargazing" className="py-20 lg:py-28 bg-[#000000] border-t border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Visual: Silhouette with Telescope */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] group">
                <div className="relative aspect-[16/10] w-full">
                  <img
                    src="/images/antariksha/stargazing.jpg"
                    alt="Students stargazing with telescope under Milky Way"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold tracking-widest uppercase">
                <span className="w-6 h-[2px] bg-cyan-400" />
                <span>NIGHT SKY OBSERVATION</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                Look Up. Ask Why.
              </h2>

              <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-xl font-normal">
                Through our telescope sessions, students get a real view of the night sky —
                planets, stars, nebulae and more. Because the universe is better seen, not just read about.
              </p>

              {/* Action Button */}
              <div className="pt-4">
                <button
                  onClick={() => handleOpenEnquiry('Join a Telescope Session Enquiry')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-gray-200 border border-white/20 hover:border-cyan-400 hover:text-white hover:bg-cyan-500/10 transition-all group cursor-pointer"
                >
                  <span>Join a Telescope Session</span>
                  <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          7. FOOTER: OFFICIAL WHITE CSEEL LOGO
         ======================================================== */}
      <footer className="bg-[#020307] border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            
            {/* Left Brand: Official White CSEEL Logo */}
            <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
              <img
                src="/images/cseel-logo-white.svg"
                alt="CSEEL - Center for Scientific Exploration and Experiential Learning"
                className="h-9 sm:h-11 w-auto object-contain"
              />
            </Link>

            {/* Center Navigation Links */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <a href="#our-lab" className="hover:text-white transition-colors">Our Lab</a>
              <a href="#workshops" className="hover:text-white transition-colors">Workshops</a>
              <a href="#space-exploration" className="hover:text-white transition-colors">Space Exploration</a>
              <a href="#stargazing" className="hover:text-white transition-colors">Stargazing</a>
              <Link href="/about" className="hover:text-white transition-colors">About</Link>
            </div>

            {/* Right Socials & Tagline */}
            <div className="flex flex-col items-center md:items-end gap-2">
              <div className="flex items-center gap-4 text-gray-400">
                <a href="https://youtube.com/@cseel" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="YouTube">
                  <YoutubeIcon className="w-4 h-4" />
                </a>
                <a href="https://instagram.com/cseel_official" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Instagram">
                  <InstagramIcon className="w-4 h-4" />
                </a>
                <a href="https://linkedin.com/company/cseel" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="LinkedIn">
                  <LinkedinIcon className="w-4 h-4" />
                </a>
              </div>
              <p className="text-xs text-gray-500 font-medium tracking-tight">
                Curiosity Today. Innovators Tomorrow.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 text-center text-xs text-gray-600">
            &copy; {new Date().getFullYear()} CSEEL — Antariksha Astronomy Lab. All rights reserved.
          </div>
        </div>
      </footer>

      {/* ========================================================
          8. DEDICATED ENQUIRY MODAL (FAST LEAD FORM)
         ======================================================== */}
      {enquiryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#0A0F1E] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(6,182,212,0.2)] text-white">
            
            {/* Close Button */}
            <button
              onClick={() => {
                setEnquiryOpen(false);
                setEnquirySubmitted(false);
              }}
              className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <CloseIcon className="w-5 h-5" />
            </button>

            {!enquirySubmitted ? (
              <form onSubmit={handleSubmitEnquiry} className="space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                    <TelescopeIcon className="w-4 h-4" />
                    <span>Antariksha Lab Enquiry</span>
                  </div>
                  <h3 className="text-2xl font-black text-white">Get Started With CSEEL</h3>
                  <p className="text-xs text-gray-400">
                    Fill this quick form to enquire about school astronomy lab setup, night sky telescope sessions, or astronomy workshops.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Dr. Rajesh Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">School / Institute *</label>
                    <input
                      type="text"
                      required
                      value={formData.schoolName}
                      onChange={e => setFormData({ ...formData, schoolName: e.target.value })}
                      placeholder="e.g. Modern School"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Mobile / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="principal@school.edu.in"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={e => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. New Delhi"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Program of Interest</label>
                    <select
                      value={formData.program}
                      onChange={e => setFormData({ ...formData, program: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#141B30] border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                    >
                      <option value="Antariksha Astronomy Lab Setup">Antariksha Lab Setup</option>
                      <option value="Telescope Night Stargazing Session">Night Stargazing Session</option>
                      <option value="Mobile Planetarium Show">Mobile Planetarium Show</option>
                      <option value="Solar & Space Workshop">Solar &amp; Space Workshop</option>
                      <option value="Curriculum & Faculty Training">Curriculum &amp; Teacher Training</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Message or Queries (Optional)</label>
                  <textarea
                    rows={2}
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your school grade levels or preferred dates..."
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400 resize-none"
                  />
                </div>

                {/* Submit: CSEEL Button */}
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl font-bold text-white bg-[#006FCC] hover:bg-[#005499] shadow-md shadow-blue-500/40 transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
                >
                  <SendIcon className="w-4 h-4" />
                  <span>Submit Enquiry</span>
                </button>
              </form>
            ) : (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircleIcon className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-white">Enquiry Received!</h3>
                <p className="text-sm text-gray-300 max-w-sm mx-auto leading-relaxed">
                  Thank you, <span className="font-semibold text-cyan-400">{formData.name}</span>. Our Antariksha astronomy team will reach out to you within 24 hours.
                </p>
                <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href={`https://wa.me/919876543210?text=Hello%20CSEEL,%20I%20enquired%20about%20${encodeURIComponent(formData.program)}%20for%20${encodeURIComponent(formData.schoolName)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2.5 rounded-full text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                  >
                    Chat on WhatsApp
                  </a>
                  <button
                    onClick={() => {
                      setEnquiryOpen(false);
                      setEnquirySubmitted(false);
                    }}
                    className="px-6 py-2.5 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
