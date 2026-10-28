'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, Sparkles, Clock, ArrowRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { BlogPost } from '../types';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export interface BlogHeroSliderProps {
  featuredPosts: BlogPost[];
}

export const BlogHeroSlider: React.FC<BlogHeroSliderProps> = ({ featuredPosts }) => {
  const posts = featuredPosts.length > 0 ? featuredPosts : [];

  if (posts.length === 0) return null;

  return (
    <section className="relative overflow-hidden w-full max-w-full bg-gradient-to-b from-[#002244] via-[#002b55] to-[#001833] text-white border-b border-white/10 select-none">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={900}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={{
          clickable: true,
          el: '.blog-swiper-pagination',
          bulletClass: 'blog-bullet',
          bulletActiveClass: 'blog-bullet-active',
        }}
        loop={posts.length > 1}
        className="w-full h-auto min-h-[360px] sm:min-h-[420px] md:min-h-[460px]"
      >
        {posts.map((post) => (
          <SwiperSlide key={post.id} className="relative w-full h-full">
            <div className="absolute inset-0 z-0">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover object-center filter brightness-[0.35] contrast-[1.1] transform scale-105 transition-transform [transition-duration:6000ms]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#001a33]/95 via-[#002b55]/85 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#001833] via-transparent to-transparent" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 flex flex-col justify-center min-h-[360px] sm:min-h-[420px] md:min-h-[460px]">
              <div className="max-w-2xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sky-200 text-xs font-semibold">
                  <Sparkles size={13} className="text-amber-300" />
                  <span>Featured Editorial &bull; {post.category}</span>
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight font-['Google_Sans',Roboto,sans-serif]">
                  {post.title}
                </h1>

                <p className="text-xs sm:text-sm md:text-base text-slate-200 leading-relaxed font-normal max-w-xl font-['Google_Sans',Roboto,sans-serif]">
                  {post.summary}
                </p>

                <div className="flex items-center gap-4 text-xs text-slate-300 font-medium pt-1 font-['Google_Sans',Roboto,sans-serif]">
                  <span>By {post.author.name}</span>
                  <span>&bull;</span>
                  <span>{post.publishedAt}</span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {post.readTimeMinutes} min read
                  </span>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}

        <div className="blog-swiper-pagination !absolute !bottom-3 !left-1/2 !-translate-x-1/2 !z-20 !flex !items-center !justify-center !gap-2 !w-auto !bg-black/40 !backdrop-blur-md !px-3 !py-1 !rounded-full !border !border-white/20" />
      </Swiper>

      <style jsx global>{`
        .blog-bullet {
          width: 8px;
          height: 8px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.4);
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-block;
        }
        .blog-bullet-active {
          width: 24px;
          background: #38bdf8;
        }
      `}</style>
    </section>
  );
};

export default BlogHeroSlider;
