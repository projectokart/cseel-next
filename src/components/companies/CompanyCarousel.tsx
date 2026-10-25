'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import type { CompanyProfile } from '@/data/roboticsCompaniesData';
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface CompanyCarouselProps {
  companies: CompanyProfile[];
  currentSlug?: string;
  title?: string;
  subtitle?: string;
}

export default function CompanyCarousel({
  companies,
  currentSlug,
  title = 'Explore Leading Indian Robotics & STEM Lab Partners',
  subtitle = 'Discover verified school robotics suppliers, Atal Tinkering Lab partners, and experiential learning providers.',
}: CompanyCarouselProps) {
  // Filter out the current company if present
  const displayCompanies = currentSlug
    ? companies.filter((c) => c.slug !== currentSlug)
    : companies;

  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  if (!displayCompanies || displayCompanies.length === 0) {
    return null;
  }

  return (
    <section className="w-full my-12 overflow-hidden">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 px-1">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-100 text-[#005689] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>Robotics &amp; STEM Directory</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {title}
          </h3>
          <p className="text-slate-600 text-sm max-w-2xl mt-1">
            {subtitle}
          </p>
        </div>

        {/* Carousel Arrows */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            ref={prevRef}
            aria-label="Previous Slide"
            className="w-10 h-10 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center transition-all cursor-pointer shadow-xs disabled:opacity-40"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            ref={nextRef}
            aria-label="Next Slide"
            className="w-10 h-10 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center transition-all cursor-pointer shadow-xs disabled:opacity-40"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Swiper Slider with Full Width Mobile Friendly Experience */}
      <div className="w-full -mx-4 px-4 sm:mx-0 sm:px-0">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={16}
          slidesPerView={1.12}
          grabCursor={true}
          loop={displayCompanies.length > 2}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onBeforeInit={(swiper) => {
            // @ts-ignore
            swiper.params.navigation.prevEl = prevRef.current;
            // @ts-ignore
            swiper.params.navigation.nextEl = nextRef.current;
          }}
          breakpoints={{
            640: {
              slidesPerView: 2.15,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 24,
            },
          }}
          className="pb-4"
        >
          {displayCompanies.map((comp) => (
            <SwiperSlide key={comp.slug} className="h-auto">
              {/* Card Design Inspired by Reference Image 2 (Labster / Yavapai College Style) */}
              <Link
                href={`/info/companies/${comp.slug}`}
                className="group relative block h-[390px] sm:h-[430px] w-full rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 bg-slate-900 border border-slate-200/80"
              >
                {/* 1. Full-Bleed Authentic Image */}
                <img
                  src={comp.image}
                  alt={comp.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* 2. Deep Gradient Dark Overlay (Transparent top -> Dark bottom) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/25 group-hover:via-black/40 transition-all duration-300" />

                {/* 3. Clean Text Layout matching Reference Image 2 */}
                <div className="relative z-10 flex flex-col justify-between h-full p-6 sm:p-7 text-white">
                  
                  {/* Top-Left: Brand Name / Tagline in Bold Clean White (Yavapai College Style) */}
                  <div>
                    <span className="text-base sm:text-lg font-black tracking-wider text-white uppercase drop-shadow-sm font-sans flex items-center gap-2">
                      {comp.brandVariants[0] || comp.name}
                    </span>
                    <span className="text-[11px] font-medium text-slate-300 block mt-0.5 tracking-wide">
                      {comp.headquarters.split(',')[0]}, India
                    </span>
                  </div>

                  {/* Bottom: Bold White Headline + "Read profile >" */}
                  <div className="space-y-4">
                    {/* Bold White Headline */}
                    <h4 className="text-lg sm:text-xl font-extrabold text-white leading-snug drop-shadow-sm line-clamp-3 group-hover:text-sky-200 transition-colors">
                      {comp.tagline || comp.shortDescription}
                    </h4>

                    {/* Bottom Action Link */}
                    <div className="inline-flex items-center gap-2 text-sm font-bold text-white group-hover:text-sky-300 transition-colors pt-1">
                      <span>Read profile</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                    </div>
                  </div>

                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
