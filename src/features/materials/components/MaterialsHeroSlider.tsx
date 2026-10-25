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
            className="relative w-full max-w-full px-4 sm:px-8 py-8 sm:py-12 md:py-16 overflow-hidden min-h-[220px] sm:min-h-[260px] md:min-h-[290px] flex items-center"
          >
            {/* Background Image with Fallback */}
            <div
              className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-cover bg-no-repeat bg-center"
              style={{
                backgroundImage: `url(${slide.image})`,
              }}
            />

            {/* Cinematic Gradient Overlays for Razor-Sharp Text Contrast */}
            <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-r from-[#000a18]/90 via-[#001229]/60 to-[#000e1f]/30" />
            <div className="absolute inset-0 z-[2] pointer-events-none bg-gradient-to-t from-[#000814]/75 via-transparent to-transparent" />

            {/* Slide Content: Just Clean Main Heading & 1-line short paragraph */}
            <div className="relative z-10 w-full max-w-6xl mx-auto">
              <div className="max-w-2xl flex flex-col items-start text-left">
                {/* Main Heading */}
                <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.15] drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                  {slide.titleLine1}{' '}
                  <span className="text-[#fbb03b]">{slide.titleLine2}</span>
                </h1>

                {/* 1-line Short Paragraph */}
                <p className="text-xs sm:text-sm md:text-[15px] text-slate-100/95 font-medium max-w-xl truncate leading-relaxed mt-2 drop-shadow-sm">
                  {slide.description}
                </p>
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
