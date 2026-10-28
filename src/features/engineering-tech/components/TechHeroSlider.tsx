'use client';

import React from 'react';
import { Sparkles, Bot, BookOpen, Wrench, Cpu } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export interface TechHeroSliderProps {
  onBookDemo?: () => void;
}

const TECH_SLIDES = [
  {
    title: 'Robotics & Autonomous STEM Lab',
    eyebrow: 'Microcontrollers, Actuators & Telemetry',
    description:
      'Build real autonomous rovers, robotic arms, obstacle-avoiding algorithms, and ultrasonic radar telemetry systems aligned with ATL standards.',
    image: '/images/categories/engineering.jpg',
    badge: 'Atal Tinkering Lab 2.0 Aligned',
    icon: Bot,
  },
  {
    title: 'IoT & Smart Hardware Engineering',
    eyebrow: 'Microcontrollers, Cloud Telemetry & Sensors',
    description:
      'Wire solderless digital logic gates, binary adders, ESP8266 IoT weather stations and solar MPPT trackers for future-ready problem solving.',
    image: '/images/categories/technology.jpg',
    badge: 'NEP 2020 Future Skills',
    icon: Cpu,
  },
];

export const TechHeroSlider: React.FC<TechHeroSliderProps> = ({ onBookDemo }) => {
  return (
    <section className="relative overflow-hidden w-full max-w-full bg-gradient-to-b from-[#2e1903] via-[#3d2204] to-[#1a0c01] text-white border-b border-white/10 select-none">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={900}
        autoplay={{ delay: 5500, disableOnInteraction: false }}
        pagination={{
          clickable: true,
          el: '.tech-swiper-pagination',
          bulletClass: 'tech-bullet',
          bulletActiveClass: 'tech-bullet-active',
        }}
        loop={true}
        className="w-full h-auto min-h-[360px] sm:min-h-[420px] md:min-h-[460px]"
      >
        {TECH_SLIDES.map((slide, idx) => {
          const Icon = slide.icon;
          return (
            <SwiperSlide key={idx} className="relative w-full h-full">
              <div className="absolute inset-0 z-0">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover object-center filter brightness-[0.38] contrast-[1.1] transform scale-105 transition-transform [transition-duration:6000ms]"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#200f01]/95 via-[#2e1603]/85 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a0c01] via-transparent to-transparent" />
              </div>

              <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 flex flex-col justify-center min-h-[360px] sm:min-h-[420px] md:min-h-[460px]">
                <div className="max-w-2xl space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-200 text-xs font-semibold">
                    <Icon size={14} className="text-amber-300" />
                    <span>{slide.badge}</span>
                  </div>

                  <p className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-amber-400 font-['Google_Sans',Roboto,sans-serif]">
                    {slide.eyebrow}
                  </p>

                  <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight font-['Google_Sans',Roboto,sans-serif]">
                    {slide.title}
                  </h1>

                  <p className="text-xs sm:text-sm md:text-base text-slate-200 leading-relaxed font-normal max-w-xl font-['Google_Sans',Roboto,sans-serif]">
                    {slide.description}
                  </p>

                  <div className="flex items-center gap-3 pt-2">
                    <a
                      href="#experiments-grid"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#d97706] hover:bg-[#b45309] text-white text-xs sm:text-sm font-medium transition-colors shadow-md"
                    >
                      <BookOpen size={15} />
                      <span>Explore Engineering Labs</span>
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

        <div className="tech-swiper-pagination !absolute !bottom-3 !left-1/2 !-translate-x-1/2 !z-20 !flex !items-center !justify-center !gap-2 !w-auto !bg-black/40 !backdrop-blur-md !px-3 !py-1 !rounded-full !border !border-white/20" />
      </Swiper>

      <style jsx global>{`
        .tech-bullet {
          width: 8px;
          height: 8px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.4);
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-block;
        }
        .tech-bullet-active {
          width: 24px;
          background: #f59e0b;
        }
      `}</style>
    </section>
  );
};

export default TechHeroSlider;
