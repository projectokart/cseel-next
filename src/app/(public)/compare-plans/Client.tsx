'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { CheckCircle, Star, ChevronLeft, ChevronRight, Quote, Sparkles } from "lucide-react";
import PageTransition from "@/components/shared/PageTransition";
import ScrollReveal from "@/components/shared/ScrollReveal";
import StaggerChildren, { staggerItem } from "@/components/shared/StaggerChildren";
import { motion } from "framer-motion";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const testimonials = [
  {
    name: "Rakesh Sharma",
    title: "Associate Professor, Delhi University",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQasrbD4o8y03QK0ogqw8jJtrRMkApA8HLtDw&s",
    quote: "My goal is for students to have experiences that simulate the hands-on labs they would encounter if they were in person. CSEEL makes that completely seamless.",
    badge: "Higher Education",
  },
  {
    name: "Vivek Sharma",
    title: "STEM Coordinator, Korean Embassy School",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQihhZf7her-3KOsNQwuB3q9IwxNcWbGGGxkQ&s",
    quote: "Fortunately for us, instructors found everything they needed in CSEEL. It just worked perfectly for our international experiential curriculum.",
    badge: "International STEM",
  },
  {
    name: "Caitlyn Montross",
    title: "Assistant Professor, Daemen University",
    image: "https://cdn.prod.website-files.com/63105b5082760e06eb992f00/66fed812d849b3068dc5ec11_Caitlyn-Montross-Daemen-University.avif",
    quote: "One way I engage my students is by using CSEEL as a fun, curious game that drives their scientific inquiry and critical thinking.",
    badge: "Applied Chemistry",
  },
  {
    name: "Dr. Ananya Sen",
    title: "Head of Science, Modern School Barakhamba",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    quote: "The interactive simulations and NEP 2020 aligned lab manual downloads increased our Class 11 and 12 practical scores by 34%.",
    badge: "CBSE Senior Secondary",
  },
  {
    name: "Prof. Rajesh Mehra",
    title: "Physics Department Chair, IIT Delhi Mentorship Cell",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    quote: "Students who practiced optical bench alignments and LCR resonance on CSEEL entered physical labs with 100% confidence.",
    badge: "Physics & Optics",
  },
  {
    name: "Meenakshi Sundaram",
    title: "ATL Incharge, BVB Mehta Vidyalaya",
    image: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=200&q=80",
    quote: "The robotics and IoT sensor workbenches made ATL tinkering an everyday thrill for middle and high school students alike.",
    badge: "Robotics & IoT",
  },
];

const plans = [
  {
    name: "Cseel Explorer™",
    description: "Start your journey with hands-on learning in a real lab environment.",
    price: "₹1,00,000",
    priceNote: "Per School / Year",
    subNote: "Annual term for high-impact learning.",
    features: ["Access to 1000+ modules", "Teacher Dashboard", "Standard Support"],
    cta: "Get Started",
    ctaLink: "/contact-us",
    popular: false,
  },
  {
    name: "Cseel Advanced",
    description: "Expand your reach with more experiments and flexible student engagement.",
    price: "Custom",
    priceNote: "Contact for Quote",
    subNote: "Tailored for growing institutions.",
    features: ["Everything in Explorer", "Advanced Analytics", "Priority Support", "LMS Integration"],
    cta: "Contact Sales",
    ctaLink: "/contact-us",
    popular: true,
  },
  {
    name: "Cseel Elite",
    description: "Full program support for institutions looking to transform STEM learning.",
    price: "Enterprise",
    priceNote: "Custom Solutions",
    subNote: "Complete digital transformation.",
    features: ["Everything in Advanced", "Custom Experiment Design", "On-site Training", "Dedicated Manager"],
    cta: "Contact Sales",
    ctaLink: "/contact-us",
    popular: false,
  },
];

const ComparePlans = () => {
  return (
    <PageTransition>
      <>
        {/* 1. PRICING SECTION */}
        <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-12 sm:mb-16">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                  Choose Your Plan
                </h1>
                <p className="text-slate-600 max-w-xl mx-auto text-sm sm:text-base font-medium">
                  Scale your science department with CSEEL's flexible live lab solutions and NEP 2020 curriculum modules.
                </p>
              </div>
            </ScrollReveal>

            <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto" staggerDelay={0.1}>
              {plans.map((plan) => (
                <motion.div
                  key={plan.name}
                  variants={staggerItem}
                  whileHover={{ y: -8 }}
                  className={`flex flex-col h-full rounded-3xl p-6 sm:p-8 transition-all duration-300 bg-white ${
                    plan.popular
                      ? 'border-2 border-[#006fcc] shadow-xl relative scale-105 z-10'
                      : 'border border-slate-200/90 shadow-xs hover:shadow-md'
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#006fcc] text-white px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase shadow-md">
                      Most Popular
                    </span>
                  )}

                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">{plan.description}</p>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-slate-900 tracking-tight">{plan.price}</span>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{plan.priceNote}</p>
                  </div>

                  <div className="flex-1 space-y-3.5 mb-8">
                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest opacity-50">Features</p>
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <CheckCircle className="h-4 w-4 text-[#006fcc] mt-0.5 shrink-0" />
                        <span className="text-xs sm:text-sm text-slate-600 font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    href={plan.ctaLink}
                    className={`w-full text-center py-3.5 rounded-full font-black text-xs transition-all tracking-wider uppercase active:scale-98 ${
                      plan.popular
                        ? 'bg-[#006fcc] text-white shadow-md hover:bg-[#005bb8]'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </motion.div>
              ))}
            </StaggerChildren>
          </div>
        </section>

        {/* 2. HORIZONTAL SCROLL TESTIMONIALS SLIDER WITH SWIPER */}
        <section className="py-16 sm:py-20 bg-white overflow-hidden border-b border-slate-100">
          <div className="container mx-auto px-4">
            
            {/* Header with Navigation Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12 max-w-6xl mx-auto">
              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-1 mb-3 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} fill="currentColor" />
                  ))}
                  <span className="text-xs font-bold text-slate-500 ml-1.5">5.0 Star Rating</span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                  Customers See the Results with CSEEL
                </h2>
                <p className="text-slate-500 text-xs sm:text-sm mt-1 font-medium">
                  Real stories from world-class educators, school principals & researchers.
                </p>
              </div>

              {/* Swiper Custom Arrow Navigation Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  aria-label="Previous Testimonial"
                  className="compare-testimonials-prev w-10 h-10 rounded-full border border-slate-200 hover:border-[#006fcc] hover:bg-blue-50 text-slate-600 hover:text-[#006fcc] flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  aria-label="Next Testimonial"
                  className="compare-testimonials-next w-10 h-10 rounded-full border border-slate-200 hover:border-[#006fcc] hover:bg-blue-50 text-slate-600 hover:text-[#006fcc] flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Swiper Horizontal Carousel */}
            <div className="max-w-6xl mx-auto relative pb-8">
              <Swiper
                modules={[Autoplay, Pagination, Navigation]}
                navigation={{
                  prevEl: '.compare-testimonials-prev',
                  nextEl: '.compare-testimonials-next',
                }}
                pagination={{
                  clickable: true,
                  el: '.compare-testimonials-pagination',
                  bulletClass: 'inline-block w-2.5 h-2.5 bg-slate-200 rounded-full cursor-pointer transition-all duration-300 mx-1 hover:bg-[#006fcc]/50',
                  bulletActiveClass: '!bg-[#006fcc] !scale-125 !w-6',
                }}
                autoplay={{
                  delay: 4500,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                loop={true}
                spaceBetween={24}
                slidesPerView={1}
                breakpoints={{
                  640: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                  },
                  1024: {
                    slidesPerView: 3,
                    spaceBetween: 24,
                  },
                }}
                className="w-full !overflow-visible"
              >
                {testimonials.map((t, idx) => (
                  <SwiperSlide key={idx} className="h-auto">
                    <div className="flex flex-col justify-between h-full bg-slate-50 hover:bg-white border border-slate-200/80 hover:border-[#006fcc]/40 rounded-3xl p-6 sm:p-7 transition-all duration-300 hover:shadow-xl group select-none">
                      
                      {/* Top: Avatar & Title */}
                      <div>
                        <div className="flex items-center justify-between gap-3 mb-5">
                          <div className="flex items-center gap-3">
                            <div className="relative w-13 h-13 rounded-2xl overflow-hidden shrink-0 border-2 border-white shadow-xs bg-slate-200">
                              <img
                                src={t.image}
                                alt={t.name}
                                loading="lazy"
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-900 text-sm truncate group-hover:text-[#006fcc] transition-colors">
                                {t.name}
                              </p>
                              <p className="text-[10px] font-semibold text-slate-500 truncate max-w-[180px]">
                                {t.title}
                              </p>
                            </div>
                          </div>
                          
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-blue-50 text-[#006fcc] border border-blue-200/60 shrink-0">
                            {t.badge}
                          </span>
                        </div>

                        {/* Quote Text */}
                        <div className="relative pt-2">
                          <Quote className="w-8 h-8 text-[#006fcc]/15 absolute -top-2 -left-1 pointer-events-none" />
                          <p className="text-xs sm:text-sm text-slate-600 italic leading-relaxed relative z-10 pl-2">
                            "{t.quote}"
                          </p>
                        </div>
                      </div>

                      {/* Bottom Rating Stars */}
                      <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between">
                        <div className="flex text-amber-400 gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={13} fill="currentColor" />
                          ))}
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">
                          Verified Educator
                        </span>
                      </div>

                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Custom Dots Pagination Container */}
              <div className="compare-testimonials-pagination flex items-center justify-center mt-8 !static !w-auto" />
            </div>

          </div>
        </section>
      </>
    </PageTransition>
  );
};

export default ComparePlans;
