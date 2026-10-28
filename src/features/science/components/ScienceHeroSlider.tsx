'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, BookOpen, FlaskConical, Atom, Dna } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { M3Button } from '@/components/google-ui';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export interface ScienceHeroSliderProps {
  onBookDemo?: () => void;
}

const SCIENCE_SLIDES = [
  {
    title: 'Physics & Optics Laboratory',
    eyebrow: 'Classical Mechanics & Wave Dynamics',
    description:
      'Immerse students in real physical apparatus simulations: Ohm’s law, ray tracing, prisms, compound pendulums and electromagnetic circuits.',
    image: '/images/categories/physics.jpg',
    badge: 'CBSE & NEP 2020 Aligned',
    icon: Atom,
  },
  {
    title: 'Virtual Chemistry Wet Lab',
    eyebrow: 'Volumetric Titrations & Molecular Kinetics',
    description:
      'Practice standard volumetric titrations, redox reactions, qualitative salt analysis, and chemical kinetics without reagent breakage or safety hazards.',
    image: '/images/categories/chemistry-card-1.jpg',
    badge: 'Zero Chemical Consumables',
    icon: FlaskConical,
  },
  {
    title: 'Biology & Life Science Practical Lab',
    eyebrow: 'Microbiology, Plant Cells & Human Anatomy',
    description:
      'High-resolution virtual microscopy, onion peel cell mounting, stomatal transpiration and 3D human anatomy models for experiential mastery.',
    image: '/images/categories/biology.jpg',
    badge: '100% Curriculum Compliant',
    icon: Dna,
  },
];

export const ScienceHeroSlider: React.FC<ScienceHeroSliderProps> = ({ onBookDemo }) => {
  return (
    <section className="relative overflow-hidden w-full max-w-full bg-gradient-to-b from-[#002244] via-[#002b55] to-[#001833] text-white border-b border-white/10 select-none">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={900}
        autoplay={{ delay: 5500, disableOnInteraction: false }}
        pagination={{
          clickable: true,
          el: '.science-swiper-pagination',
          bulletClass: 'science-bullet',
          bulletActiveClass: 'science-bullet-active',
        }}
        loop={true}
        className="w-full h-auto min-h-[360px] sm:min-h-[420px] md:min-h-[460px]"
      >
        {SCIENCE_SLIDES.map((slide, idx) => {
          const Icon = slide.icon;
          return (
            <SwiperSlide key={idx} className="relative w-full h-full">
              {/* Background Image with Dark Vignette */}
              <div className="absolute inset-0 z-0">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover object-center filter brightness-[0.38] contrast-[1.1] transform scale-105 transition-transform [transition-duration:6000ms]"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#001f3f]/95 via-[#002b55]/85 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#001833] via-transparent to-transparent" />
              </div>

              {/* Slide Content */}
              <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 flex flex-col justify-center min-h-[360px] sm:min-h-[420px] md:min-h-[460px]">
                <div className="max-w-2xl space-y-4">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sky-200 text-xs font-semibold">
                    <Icon size={14} className="text-sky-300" />
                    <span>{slide.badge}</span>
                  </div>

                  {/* Eyebrow */}
                  <p className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-sky-400 font-['Google_Sans',Roboto,sans-serif]">
                    {slide.eyebrow}
                  </p>

                  {/* Title */}
                  <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight font-['Google_Sans',Roboto,sans-serif]">
                    {slide.title}
                  </h1>

                  {/* Description */}
                  <p className="text-xs sm:text-sm md:text-base text-slate-200 leading-relaxed font-normal max-w-xl font-['Google_Sans',Roboto,sans-serif]">
                    {slide.description}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-2">
                    <a
                      href="#experiments-grid"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs sm:text-sm font-medium transition-colors shadow-md"
                    >
                      <BookOpen size={15} />
                      <span>Explore Practicals</span>
                    </a>

                    {onBookDemo && (
                      <button
                        type="button"
                        onClick={onBookDemo}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/30 text-xs sm:text-sm font-medium backdrop-blur-md transition-colors"
                      >
                        <Sparkles size={14} className="text-amber-300" />
                        <span>Book School Demo</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}

        {/* Custom Pagination Container */}
        <div className="science-swiper-pagination !absolute !bottom-3 !left-1/2 !-translate-x-1/2 !z-20 !flex !items-center !justify-center !gap-2 !w-auto !bg-black/40 !backdrop-blur-md !px-3 !py-1 !rounded-full !border !border-white/20" />
      </Swiper>

      <style jsx global>{`
        .science-bullet {
          width: 8px;
          height: 8px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.4);
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-block;
        }
        .science-bullet-active {
          width: 24px;
          background: #38bdf8;
        }
      `}</style>
    </section>
  );
};

export default ScienceHeroSlider;
