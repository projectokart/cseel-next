'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import { Atom, ChevronLeft, ChevronRight, BookmarkCheck, Sparkles, BookOpen } from 'lucide-react';
import { M3Button } from '@/components/google-ui';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

export interface MaterialsHeroSliderProps {
  totalQuantity: number;
  onOpenRequisition: () => void;
  onExploreClick: () => void;
}

const HERO_SLIDES = [
  {
    id: 'slide-1',
    image: '/images/cseel-science-lab-hero-expanded.jpg',
    badge: 'NEP 2020 • CBSE Physics Apparatus Directory',
    titleLine1: 'Physics Laboratory',
    titleLine2: 'Apparatus & Instruments',
    tagline: 'Precision Calibrated • Class 6th to 12th',
    description:
      'Explore 950+ scientific instruments mapped directly to CBSE, ICSE and state board physics practicals. Select apparatuses to generate an official institutional lab quotation.',
    primaryCta: 'Explore Catalog',
  },
  {
    id: 'slide-2',
    image: '/images/cbse-composite-science-lab-3d.jpg',
    badge: 'Turnkey CBSE Skill & Composite Lab Setup',
    titleLine1: 'Complete School Lab',
    titleLine2: 'Turnkey Requisition',
    tagline: 'CBSE Byelaws Ready • Zero Breakage Worries',
    description:
      'Optical benches, spectrometers, resistance boxes, potentiometer setups, and fluid mechanics apparatuses ready for turnkey institutional supply and teacher pedagogy support.',
    primaryCta: 'View Practical Kits',
  },
  {
    id: 'slide-3',
    image: '/images/composite-lab-skill-integration.jpg',
    badge: 'Experiential Science Pedagogy',
    titleLine1: 'Hands-On Physics',
    titleLine2: 'Learning by Doing',
    tagline: 'Tactile Practicals • Conceptual Clarity',
    description:
      'Empowering educators and students with hands-on apparatuses that bridge textbook formulas with real physical observations for high board exam and Olympiad performance.',
    primaryCta: 'Browse Apparatuses',
  },
];

export const MaterialsHeroSlider: React.FC<MaterialsHeroSliderProps> = ({
  totalQuantity,
  onOpenRequisition,
  onExploreClick,
}) => {
  return (
    <section className="relative overflow-hidden w-full max-w-full bg-gradient-to-b from-[#002244] via-[#002b55] to-[#001833] text-white select-none">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        speed={850}
        loop={true}
        autoplay={{
          delay: 5500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{
          clickable: true,
          el: '.materials-hero-pagination',
          bulletClass:
            'materials-bullet inline-block w-2.5 h-2.5 bg-sky-400/40 rounded-full cursor-pointer transition-all duration-300 mx-1 hover:bg-white/80',
          bulletActiveClass: '!w-2.5 !h-2.5 !bg-[#fbb03b] !rounded-full !shadow-md',
        }}
        navigation={{
          prevEl: '.materials-hero-prev',
          nextEl: '.materials-hero-next',
        }}
        className="w-full max-w-full"
      >
        {HERO_SLIDES.map((slide) => (
          <SwiperSlide
            key={slide.id}
            className="relative w-full max-w-full px-4 sm:px-8 pt-4 sm:pt-6 pb-6 sm:pb-10 overflow-hidden min-h-[380px] sm:min-h-[440px] md:min-h-[480px] flex flex-col justify-between"
          >
            {/* Background Image with Fallback */}
            <div
              className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-cover bg-no-repeat bg-center"
              style={{
                backgroundImage: `url(${slide.image})`,
              }}
            />

            {/* Cinematic Gradient Overlays for Razor-Sharp Text Contrast */}
            <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-r from-[#000a18]/92 via-[#001229]/65 to-[#000e1f]/35" />
            <div className="absolute inset-0 z-[2] pointer-events-none bg-gradient-to-t from-[#000814]/85 via-transparent to-transparent" />

            {/* Slide Content */}
            <div className="relative z-10 w-full max-w-6xl mx-auto pt-2 sm:pt-4">
              <div className="max-w-xl flex flex-col items-start text-left space-y-2 pt-1 sm:pt-2">
                {/* Eyebrow Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00172e]/80 border border-[#38bdf8]/40 backdrop-blur-md shadow-md">
                  <Atom className="w-3.5 h-3.5 text-[#fbb03b] shrink-0" />
                  <span className="text-[10px] xs:text-[11px] sm:text-xs font-bold tracking-wider uppercase text-sky-100">
                    {slide.badge}
                  </span>
                </div>

                {/* Main Heading */}
                <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.12] drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                  {slide.titleLine1} <br />
                  <span className="text-[#fbb03b]">{slide.titleLine2}</span>
                </h1>

                {/* Dual Color Accent Bar */}
                <div className="flex items-center gap-1.5 my-1">
                  <div className="w-8 h-[3.5px] rounded-full bg-[#fbb03b]" />
                  <div className="w-8 h-[3.5px] rounded-full bg-[#38bdf8]" />
                </div>

                {/* Subtitle / Tagline */}
                <p className="text-xs sm:text-sm md:text-base text-white font-bold tracking-wide drop-shadow-sm">
                  {slide.tagline}
                </p>

                {/* Description */}
                <p className="text-[11.5px] xs:text-xs sm:text-sm text-slate-100/90 leading-relaxed font-normal max-w-md drop-shadow-sm line-clamp-3 xs:line-clamp-none">
                  {slide.description}
                </p>
              </div>
            </div>

            {/* Footer Buttons Bar */}
            <div className="relative z-10 w-full max-w-6xl mx-auto pt-4 mt-auto">
              <div className="flex flex-wrap items-center gap-3">
                <M3Button variant="filled" size="md" onClick={onExploreClick}>
                  {slide.primaryCta}
                </M3Button>

                <button
                  type="button"
                  onClick={onOpenRequisition}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/95 hover:bg-white text-[#005689] font-bold text-xs shadow-md transition-all active:scale-95"
                >
                  <BookmarkCheck className="w-4 h-4" />
                  <span>Requisition List</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#005689] text-white text-[10px] font-extrabold">
                    {totalQuantity}
                  </span>
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Edge Navigation Arrows (Desktop) */}
      <button
        aria-label="Previous Slide"
        className="materials-hero-prev hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 text-white border border-white/30 backdrop-blur-md items-center justify-center transition-all duration-200 active:scale-95 shadow-lg cursor-pointer"
      >
        <ChevronLeft size={20} />
      </button>

      <button
        aria-label="Next Slide"
        className="materials-hero-next hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 text-white border border-white/30 backdrop-blur-md items-center justify-center transition-all duration-200 active:scale-95 shadow-lg cursor-pointer"
      >
        <ChevronRight size={20} />
      </button>

      {/* Pagination Dots Pill */}
      <div className="materials-hero-pagination !absolute !bottom-2 !left-1/2 !-translate-x-1/2 !z-30 !flex !items-center !justify-center !w-auto !bg-black/35 !backdrop-blur-md !px-3 !py-1 !rounded-full !border !border-sky-400/20 !shadow-lg" />
    </section>
  );
};

export default MaterialsHeroSlider;
