'use client';

import Link from 'next/link';

import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, ArrowRight, Play, ChevronLeft, ChevronRight, School, GraduationCap, MapPin, Sparkles } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import PageTransition from "@/components/shared/PageTransition";
import OffersSection from "@/components/offers/OffersSection";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import OfferPopup from "@/components/offers/OfferPopup";
import { useHomepageCms } from "@/features/homepage-cms/hooks/useHomepageCms";

// Swiper React Component & Modules
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';

// Swiper Styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

interface PartnerSchoolItem {
  id: string;
  name: string;
  shortName: string;
  city: string;
  board: string;
  initials: string;
  studentsCount: string;
  badge: string;
  accent: string;
  avatarBg: string;
  avatarGradient: string;
  image: string;
}

const partnerSchoolsList: PartnerSchoolItem[] = [
  {
    id: "st-columbas-delhi",
    name: "St. Columba's School",
    shortName: "St. Columba's School",
    city: "Ashok Place, New Delhi",
    board: "CBSE Affiliated",
    initials: "SCS",
    studentsCount: "2,814+ Students",
    badge: "Senior Secondary",
    accent: "text-blue-700 bg-blue-50 border-blue-200",
    avatarBg: "bg-blue-600 text-white",
    avatarGradient: "from-blue-600 to-indigo-700 text-white",
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=320&q=80",
  },
  {
    id: "sanskriti-school-delhi",
    name: "Sanskriti School",
    shortName: "Sanskriti School",
    city: "Chanakyapuri, New Delhi",
    board: "CBSE • STEM Excellence",
    initials: "SS",
    studentsCount: "2,481+ Students",
    badge: "ATL Tinkering Lab",
    accent: "text-emerald-700 bg-emerald-50 border-emerald-200",
    avatarBg: "bg-emerald-600 text-white",
    avatarGradient: "from-emerald-600 to-teal-700 text-white",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=320&q=80",
  },
  {
    id: "modern-school-barakhamba",
    name: "Modern School",
    shortName: "Modern School",
    city: "Barakhamba Road, New Delhi",
    board: "CBSE Affiliated • Est. 1920",
    initials: "MS",
    studentsCount: "2,337+ Students",
    badge: "Century of Excellence",
    accent: "text-indigo-700 bg-indigo-50 border-indigo-200",
    avatarBg: "bg-indigo-600 text-white",
    avatarGradient: "from-indigo-600 to-violet-700 text-white",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=320&q=80",
  },
  {
    id: "st-thomas-girls-delhi",
    name: "St. Thomas' Girls Senior Secondary School",
    shortName: "St. Thomas' Girls",
    city: "Mandir Marg, New Delhi",
    board: "CBSE Affiliated",
    initials: "STG",
    studentsCount: "2,377+ Students",
    badge: "Science & Arts Hub",
    accent: "text-rose-700 bg-rose-50 border-rose-200",
    avatarBg: "bg-rose-600 text-white",
    avatarGradient: "from-rose-600 to-pink-700 text-white",
    image: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=320&q=80",
  },
  {
    id: "convent-jesus-mary-delhi",
    name: "Convent of Jesus & Mary",
    shortName: "Convent of Jesus & Mary",
    city: "Bangla Sahib Marg, New Delhi",
    board: "CBSE Affiliated",
    initials: "CJM",
    studentsCount: "1,965+ Students",
    badge: "Heritage School",
    accent: "text-amber-700 bg-amber-50 border-amber-200",
    avatarBg: "bg-amber-600 text-white",
    avatarGradient: "from-amber-600 to-orange-700 text-white",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=320&q=80",
  },
  {
    id: "bhavans-mehta-delhi",
    name: "Bharatiya Vidya Bhavan's Mehta Vidyalaya",
    shortName: "BVB Mehta Vidyalaya",
    city: "K.G. Marg, New Delhi",
    board: "CBSE • Holistic STEM",
    initials: "BVB",
    studentsCount: "1,837+ Students",
    badge: "National Science Lead",
    accent: "text-cyan-700 bg-cyan-50 border-cyan-200",
    avatarBg: "bg-cyan-600 text-white",
    avatarGradient: "from-cyan-600 to-blue-700 text-white",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=320&q=80",
  },
  {
    id: "mater-dei-delhi",
    name: "Mater Dei School",
    shortName: "Mater Dei School",
    city: "Tilak Lane, New Delhi",
    board: "CBSE Affiliated",
    initials: "MDS",
    studentsCount: "1,649+ Students",
    badge: "Value Education",
    accent: "text-purple-700 bg-purple-50 border-purple-200",
    avatarBg: "bg-purple-600 text-white",
    avatarGradient: "from-purple-600 to-fuchsia-700 text-white",
    image: "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=320&q=80",
  },
  {
    id: "guru-harkrishan-delhi",
    name: "Guru Harkrishan Public School",
    shortName: "Guru Harkrishan Public",
    city: "Purana Quila Road, New Delhi",
    board: "CBSE • Innovation Lab",
    initials: "GHPS",
    studentsCount: "1,514+ Students",
    badge: "Smart Classrooms",
    accent: "text-orange-700 bg-orange-50 border-orange-200",
    avatarBg: "bg-orange-600 text-white",
    avatarGradient: "from-orange-600 to-red-700 text-white",
    image: "https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?auto=format&fit=crop&w=320&q=80",
  },
  {
    id: "sardar-patel-vidyalaya-delhi",
    name: "Sardar Patel Vidyalaya",
    shortName: "Sardar Patel Vidyalaya",
    city: "Lodi Estate, New Delhi",
    board: "CBSE Affiliated",
    initials: "SPV",
    studentsCount: "1,463+ Students",
    badge: "Progressive Learning",
    accent: "text-teal-700 bg-teal-50 border-teal-200",
    avatarBg: "bg-teal-600 text-white",
    avatarGradient: "from-teal-600 to-emerald-700 text-white",
    image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=320&q=80",
  },
  {
    id: "carmel-convent-delhi",
    name: "Carmel Convent School",
    shortName: "Carmel Convent School",
    city: "Chanakyapuri, New Delhi",
    board: "CBSE Affiliated",
    initials: "CCS",
    studentsCount: "1,284+ Students",
    badge: "Academic Leader",
    accent: "text-sky-700 bg-sky-50 border-sky-200",
    avatarBg: "bg-sky-600 text-white",
    avatarGradient: "from-sky-600 to-blue-700 text-white",
    image: "https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=320&q=80",
  },
];

const catalogItems = [
  { title: "Chemistry", image: "/images/categories/chemistry.jpg", link: "/subject/chemistry", labs: "6 Labs", desc: "Molecular Reactions, Crystal Growth & Chemical Magic", badge: "NEP 2020" },
  { title: "Biology", image: "/images/categories/biology.jpg", link: "/subject/biology", labs: "3 Labs", desc: "Cellular Machinery, Genetics & Bio-Ecosystems", badge: "CBSE Lab" },
  { title: "Physics", image: "/images/categories/physics.jpg", link: "/subject/physics", labs: "4 Labs", desc: "Classical Mechanics, Quantum Light & Electromagnetism", badge: "ICSE Lab" },
  { title: "Technology", image: "/images/categories/technology.jpg", link: "/subject/technology", labs: "1 Labs", desc: "AI Vision, Logic Circuits & IoT Smart Systems", badge: "Future Skills" },
  { title: "Engineering", image: "/images/categories/engineering.jpg", link: "/subject/engineering", labs: "1 Labs", desc: "Structural Bridges, Aerodynamics & Solar Engines", badge: "ATL Tinkering" },
  { title: "Art & STEAM", image: "/images/categories/art.jpg", link: "/subject/art", labs: "2 Labs", desc: "Color Physics, Photochemistry & Creative STEAM", badge: "Experiential" },
  { title: "Mathematics", image: "/images/categories/mathematics.jpg", link: "/subject/mathematics", labs: "2 Labs", desc: "Fractal Geometry, Golden Ratio & Logic Puzzles", badge: "Applied Math" },
];

const heroImages = [
  "/images/hero/hero-1.jpg",
  "/images/hero/hero-2.jpg",
  "/images/hero/hero-3.jpg",
  "/images/hero/hero-4.jpg",
  "/images/hero/hero-5.jpg",
  "/images/hero/hero-6.png"
];

// Counter animation hook
function useCountUp(target: number, duration = 2000, suffix = "") {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [started, target, duration]);

  return { count, ref };
}

// Labster-grade Scroll-reveal hook
function useScrollReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, visible };
}

// Animated stat card with Labster smooth easing
function StatCard({ value, label, desc, delay = 0, suffix = "" }: { value: number; label: string; desc: string; delay?: number; suffix?: string }) {
  const { count, ref } = useCountUp(value, 1800);
  const { ref: revealRef, visible } = useScrollReveal();
  return (
    <div
      ref={revealRef as any}
      className="p-6 md:p-8 rounded-2xl bg-[#dcedfc] border border-[#a2d0f5] shadow-xs hover:shadow-md hover:border-[#3b82f6] transition-all duration-500 hover:-translate-y-1"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        transitionDelay: `${delay}ms`,
      }}
    >
      <div ref={ref} className="text-3xl md:text-5xl font-black text-[#004f98] mb-2 tracking-tight">
        +{count}%
      </div>
      <h3 className="text-base md:text-lg font-bold text-slate-900 mb-2">{label}{suffix && <sup className="text-xs text-primary font-bold">{suffix}</sup>}</h3>
      <p className="text-xs md:text-sm text-slate-600 font-medium leading-relaxed">{desc}</p>
    </div>
  );
}

// Feature row
function FeatureRow({
  tag, title, desc, checks, imgSrc, imgAlt, reverse = false, delay = 0,
}: {
  tag: string; title: string; desc: string; checks: { title: string; body: string }[];
  imgSrc: string; imgAlt: string; reverse?: boolean; delay?: number;
}) {
  const { ref, visible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(50px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
        transitionDelay: `${delay}ms`,
      }}
    >
      <div className={reverse ? "order-1 lg:order-2" : ""}>
        <p className="text-sm font-semibold text-primary mb-2">{tag}</p>
        <h2 className="text-xl md:text-3xl font-bold text-foreground mb-4">{title}</h2>
        <p className="text-sm md:text-base text-muted-foreground mb-6">{desc}</p>
        <div className="space-y-4">
          {checks.map((c, i) => (
            <div key={i} className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-foreground text-sm md:text-base">{c.title}</p>
                <p className="text-xs md:text-sm text-muted-foreground">{c.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={`rounded-2xl overflow-hidden shadow-lg group ${reverse ? "order-2 lg:order-1" : ""}`}>
        <img src={imgSrc} alt={imgAlt} loading="lazy" decoding="async" className="w-full h-52 md:h-80 object-cover transition-transform duration-700 group-hover:scale-105" />
      </div>
    </div>
  );
}

// Hero image slider with Swiper
function HeroSlider() {
  return (
    <div className="relative w-full max-w-4xl mx-auto h-52 sm:h-64 md:h-72 lg:h-[320px] xl:h-[360px] rounded-2xl md:rounded-3xl overflow-hidden shadow-xl border border-white/60 group">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        speed={1000}
        loop={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{
          clickable: true,
          el: '.homepage-hero-pagination',
          bulletClass: 'inline-block w-2.5 h-2.5 bg-white/50 rounded-full cursor-pointer transition-all duration-300 mx-1 hover:bg-white/80',
          bulletActiveClass: '!bg-white !scale-125 !w-6',
        }}
        className="w-full h-full"
      >
        {heroImages.map((src, i) => (
          <SwiperSlide key={i} className="relative w-full h-full">
            <img
              src={src}
              alt="CSEEL Experiential Lab"
              loading={i === 0 ? "eager" : "lazy"}
              decoding={i === 0 ? "sync" : "async"}
              fetchPriority={i === 0 ? "high" : "low"}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="homepage-hero-pagination !absolute !bottom-3 !left-1/2 !-translate-x-1/2 !flex !items-center !justify-center !z-20 !w-auto" />
    </div>
  );
}

// ReadMore text component matching cseel.org with clean typography
function HeroText() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="max-w-2xl mx-auto my-4 sm:my-6 px-3 text-center">
      <div
        className="text-slate-600 font-medium leading-relaxed text-xs sm:text-sm md:text-base transition-all duration-300"
        style={{
          textAlign: "center",
          display: expanded ? "block" : "-webkit-box",
          WebkitLineClamp: expanded ? "unset" : 2,
          WebkitBoxOrient: "vertical" as any,
          overflow: expanded ? "visible" : "hidden",
        }}
      >
        At CSEEL, we share the vision of the National Education Policy (<strong className="text-slate-900 font-bold">NEP</strong>) 2020
        to transform Indian education from <strong className="text-slate-900 font-bold">rote memorization</strong> to{" "}
        <strong className="text-slate-900 font-bold">experiential, inquiry-based, competency-focused</strong>, and{" "}
        <strong className="text-slate-900 font-bold">hands-on</strong> learning.
        <br /><br />
        At CSEEL, we believe the best way to learn science is by doing it.
        Students learn science most effectively when they <strong className="text-slate-900 font-bold">observe</strong>,{" "}
        <strong className="text-slate-900 font-bold">experiment</strong>, <strong className="text-slate-900 font-bold">analyse</strong>, <strong className="text-slate-900 font-bold">build</strong>, and{" "}
        <strong className="text-slate-900 font-bold">solve real-world problems</strong>, rather than only reading from textbooks.
        Through <strong className="text-slate-900 font-bold">experiential learning</strong> and <strong className="text-slate-900 font-bold">hands on learning</strong>, students
        discover how things work and why they work, building strong conceptual understanding
        and a deep connection with the world around them.
        <br /><br />
        This approach strongly aligns with <strong className="text-slate-900 font-bold">NEP 2020's</strong> emphasis on{" "}
        <strong className="text-slate-900 font-bold">learning by doing</strong>, <strong className="text-slate-900 font-bold">learner-centred pedagogy</strong>,{" "}
        <strong className="text-slate-900 font-bold">development of scientific temper</strong>, and{" "}
        <strong className="text-slate-900 font-bold">real-life application of knowledge</strong>, ensuring that learning is meaningful,
        engaging, and future-ready.
      </div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-[#006fcc] hover:text-[#003c6e] font-bold text-xs sm:text-sm mt-2.5 hover:underline cursor-pointer inline-flex items-center gap-1 transition-colors"
      >
        <span>{expanded ? "Read Less ↑" : "Read More ↓"}</span>
      </button>
    </div>
  );
}

const Index = () => {
  const heroReveal = useScrollReveal();
  const metricsReveal = useScrollReveal();
  const ctaReveal = useScrollReveal();
  const { isSectionEnabled, getSection } = useHomepageCms();

  const heroConfig = getSection('hero_section');
  const metricsConfig = getSection('impact_metrics');
  const featuresConfig = getSection('why_cseel_features');
  const catalogConfig = getSection('subjects_catalog');
  const partnerConfig = getSection('partner_schools');
  const finalCtaConfig = getSection('final_cta');

  const catalogScrollRef = useRef<HTMLDivElement>(null);
  const scrollCatalog = (direction: 'left' | 'right') => {
    if (catalogScrollRef.current) {
      const offset = direction === 'left' ? -320 : 320;
      catalogScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <PageTransition>
      {/* ─── Hero Section with Brand Palette (#003c6e & #006fcc) ─── */}
      {isSectionEnabled('hero_section') && (
        <section className="hero-gradient pt-6 sm:pt-10 md:pt-14 pb-8 md:pb-12 overflow-hidden">
          <div className="container mx-auto px-4 text-center">
            
            {/* Single-Line Dominant Brand Title (Geometric Sans-Serif Matching Logo Typography) */}
            <div style={{ animation: "fadeSlideUp 0.8s ease forwards" }} className="my-4 sm:my-7 px-2">
              <h1
                className="text-[25px] xs:text-[28px] sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-tight whitespace-nowrap text-center"
                style={{ fontFamily: "var(--font-montserrat), 'Montserrat', 'Poppins', sans-serif" }}
              >
                <span>Welcome to </span>
                <span
                  className="text-[#003c6e] font-bold tracking-wide inline-block"
                  style={{
                    fontFamily: "var(--font-fredoka), 'Fredoka', 'Varela Round', 'Nunito', sans-serif",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                  }}
                >
                  CSEEL
                </span>
              </h1>
              <p
                className="mt-2.5 sm:mt-3.5 text-xs sm:text-sm md:text-base font-bold text-[#003c6e] tracking-tight max-w-xl mx-auto"
                style={{ fontFamily: "var(--font-poppins), 'Poppins', 'Montserrat', sans-serif" }}
              >
                Center for Scientific Exploration and Experiential Learning
              </p>
            </div>

            {/* Description with Read More */}
            <div style={{ animation: "fadeSlideUp 0.8s ease 0.15s both" }}>
              <HeroText />
            </div>

            {/* CTA Buttons (#006fcc solid with pure white icons) */}
            <div
              className="flex flex-col sm:flex-row justify-center gap-3.5 my-6 sm:my-8 max-w-sm sm:max-w-none mx-auto px-4"
              style={{ animation: "fadeSlideUp 0.8s ease 0.3s both" }}
            >
              <Link
                href="/compare-plans"
                className="group px-8 py-3.5 bg-[#006fcc] hover:bg-[#005bb8] active:bg-[#004e9c] text-white font-black text-sm rounded-full transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 active:scale-98"
                style={{ backgroundColor: '#006fcc' }}
              >
                <span className="text-white">Our Plans</span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform shrink-0" />
              </Link>
              <Link
                href="/virtual-lab-tour"
                className="group px-8 py-3.5 border-2 border-[#006fcc] text-[#006fcc] hover:bg-[#006fcc]/10 font-black text-sm rounded-full transition-all duration-200 flex items-center justify-center gap-2.5 active:scale-98"
              >
                <Play className="w-4 h-4 text-[#006fcc] fill-[#006fcc]/20 shrink-0" />
                <span>Live Lab Tour</span>
              </Link>
            </div>

            {/* Hero Image Slider - Scaled to fit perfectly */}
            <div style={{ animation: "fadeSlideUp 0.9s ease 0.45s both" }}>
              <HeroSlider />
            </div>

          </div>
        </section>
      )}

      {/* ─── Special Offers Section ─── */}
      {isSectionEnabled('special_offers') && <OffersSection />}
      {/* ─── Stats ─── */}
      <section className="py-16 bg-slate-50/70 border-y border-slate-200/80">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Research Backed</p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Why Hands-On Science Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <StatCard value={42} label="Higher Retention Rate" desc="Students engaged in hands-on STEAM/STEM learning show up to 42% higher knowledge retention." delay={0} suffix="¹" />
            <StatCard value={25} label="Engagement" desc="Gamified, interactive STEAM environments increase student engagement and motivation by 25%." delay={150} suffix="²" />
            <div
              className="p-6 md:p-8 rounded-2xl bg-[#dcedfc] border border-[#a2d0f5] shadow-xs hover:shadow-md hover:border-[#3b82f6] transition-all duration-500 hover:-translate-y-1"
              style={{ animation: "fadeSlideUp 0.7s ease 0.4s both" }}
            >
              <div className="text-3xl md:text-5xl font-black text-[#004f98] mb-2 tracking-tight">≧ C</div>
              <h3 className="text-base md:text-lg font-bold text-slate-900 mb-2">Higher Academic Success<sup className="text-xs text-primary font-bold">³</sup></h3>
              <p className="text-xs md:text-sm text-slate-600 font-medium leading-relaxed">Students earning C or higher in foundational science courses are more likely to persist in STEAM careers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Top Verified Delhi Schools Showcase (Single Row, Crest Badges, Real UDISE Verified) ─── */}
      {isSectionEnabled('partner_schools') && (
        <section className="py-8 md:py-12 bg-slate-50/70 border-y border-gray-200/80 overflow-hidden">
          <div className="container mx-auto px-4 text-center mb-6 md:mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-[11px] font-bold mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{partnerConfig?.badge_text || "DELHI VERIFIED SCHOOLS NETWORK"}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              {partnerConfig?.title || "Featured Premier Schools in Delhi NCR"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl mx-auto">
              Empowering leading schools across New Delhi with experiential STEAM learning & verified UDISE infrastructure.
            </p>
          </div>

          {/* Single Seamless Infinite Scrolling Track */}
          <div className="overflow-hidden py-2 relative">
            {/* Edge Gradient Fades */}
            <div className="absolute left-0 top-0 h-full w-16 md:w-32 z-10 pointer-events-none bg-gradient-to-r from-slate-50 to-transparent" />
            <div className="absolute right-0 top-0 h-full w-16 md:w-32 z-10 pointer-events-none bg-gradient-to-l from-slate-50 to-transparent" />

            <div className="flex animate-scroll-logos items-center gap-4" style={{ width: "fit-content" }}>
              {[...partnerSchoolsList, ...partnerSchoolsList].map((school, i) => (
                <Link
                  href={`/school-finder?search=${encodeURIComponent(school.shortName)}`}
                  key={`single-track-${school.id}-${i}`}
                  className="bg-white hover:bg-gradient-to-r hover:from-white hover:to-blue-50/70 rounded-2xl border border-gray-200 hover:border-primary/50 p-3 md:p-3.5 shadow-2xs hover:shadow-md transition-all flex items-center gap-3.5 min-w-[280px] md:min-w-[320px] shrink-0 group cursor-pointer"
                >
                  {/* School Campus Photo Thumbnail */}
                  <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-2xl overflow-hidden shrink-0 shadow-xs group-hover:scale-105 group-hover:shadow-md transition-all border border-slate-200/90 bg-slate-100">
                    <img
                      src={school.image}
                      alt={school.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />
                    <div className="absolute bottom-1 left-1.5 right-1.5 flex items-center justify-between">
                      <span className="text-[8px] font-black tracking-wider text-white bg-black/60 backdrop-blur-xs px-1 py-0.5 rounded leading-none">
                        {school.initials}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1 text-left">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs sm:text-sm font-bold text-gray-900 truncate group-hover:text-primary transition-colors leading-tight">
                        {school.shortName}
                      </h4>
                      <CheckCircle className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                    </div>
                    <p className="text-[11px] text-gray-500 truncate font-medium mt-0.5">
                      {school.city} • {school.board.split('•')[0]}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full border ${school.accent}`}>
                        {school.badge}
                      </span>
                      <span className="text-[10px] text-primary font-bold group-hover:underline">
                        View Details →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Bottom CTA to Delhi Schools Directory */}
          <div className="text-center mt-5">
            <Link
              href={partnerConfig?.cta_link || "/school/india/delhi"}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
            >
              <span>{partnerConfig?.cta_text || "Explore All 2,750+ Verified Schools in Delhi Directory"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      )}

      {/* ─── Key Metrics ─── */}
      {isSectionEnabled('impact_metrics') && (
        <section className="py-16 hero-gradient" ref={metricsReveal.ref as any}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">
                {metricsConfig?.badge_text || "Our Impact"}
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                {metricsConfig?.title || "CSEEL by the Numbers"}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-16">
              {(metricsConfig?.items || [
                { value: "20,000+", label: "Active Learners" },
                { value: "1000+", label: "Concept Based Experiments" },
                { value: "25+", label: "Schools Empowered" },
              ]).map((m: any, i: number) => (
                <div
                  key={i}
                  style={{
                    opacity: metricsReveal.visible ? 1 : 0,
                    transform: metricsReveal.visible ? "translateY(0) scale(1)" : "translateY(30px) scale(0.95)",
                    transition: "all 0.6s ease",
                    transitionDelay: `${i * 150}ms`,
                  }}
                >
                  <div className="text-5xl font-bold text-primary mb-2">{m.value || m.num}</div>
                  <p className="font-semibold text-foreground">{m.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Feature Rows ─── */}
      {isSectionEnabled('why_cseel_features') && (
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 space-y-12">
            <div className="text-center mb-4">
              <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">
                {featuresConfig?.badge_text || "Why CSEEL"}
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                {featuresConfig?.title || "Built for Real Learning Outcomes"}
              </h2>
            </div>
            
            {/* Feature 1: Soft Blue/Slate Background */}
            <div className="bg-[#d8e9fa] border border-[#a2cbef] rounded-3xl overflow-hidden transition-all duration-300 shadow-xs hover:shadow-md">
              <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch" style={{ opacity: 1, transform: 'translateY(0px)', transition: 'opacity 0.7s, transform 0.7s' }}>
                {/* Content Section */}
                <div className="p-8 md:p-12">
                  <p className="text-sm font-semibold text-primary mb-2">No need for extra grading or planning time</p>
                  <h2 className="text-xl md:text-3xl font-bold text-foreground mb-4">Students look forward to learning at their own pace</h2>
                  <p className="text-sm md:text-base text-muted-foreground mb-6">Educators assign CSEEL experimental labs to actively engage students—without increasing their already busy workloads. Higher engagement naturally leads to better understanding, improved grades, and stronger retention.</p>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-check-big h-5 w-5 text-primary mt-0.5 flex-shrink-0"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg>
                      <div>
                        <p className="font-semibold text-foreground text-sm md:text-base">C- to B+ Grade Improvement</p>
                        <p className="text-xs md:text-sm text-muted-foreground">CSEEL helps students improve their academic performance by an average of one full letter grade or more.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-check-big h-5 w-5 text-primary mt-0.5 flex-shrink-0"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg>
                      <div>
                        <p className="font-semibold text-foreground text-sm md:text-base">82% Student Engagement</p>
                        <p className="text-xs md:text-sm text-muted-foreground">82% of students using CSEEL report high levels of engagement, participation, and interest in learning.</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Image Section */}
                <div className="relative w-full h-48 lg:h-auto lg:min-h-full overflow-hidden group">
                  <img src="/images/features/student-remote-room.avif" alt="Student learning remotely" loading="lazy" decoding="async" className="w-full h-full lg:absolute lg:inset-0 object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
              </div>
            </div>

            {/* Feature 2: Soft Peach/Rose Background */}
            <div className="bg-[#ffe4e4] border border-[#fca5a5] rounded-3xl overflow-hidden transition-all duration-300 shadow-xs hover:shadow-md">
              <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch" style={{ opacity: 1, transform: 'translateY(0px)', transition: 'opacity 0.7s 100ms, transform 0.7s' }}>
                {/* Image Section */}
                <div className="relative w-full h-48 lg:h-auto lg:min-h-full overflow-hidden group lg:order-first order-last">
                  <img src="/images/features/lab-scientists-beakers.avif" alt="Scientists in lab" loading="lazy" decoding="async" className="w-full h-full lg:absolute lg:inset-0 object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                {/* Content Section */}
                <div className="p-8 md:p-12">
                  <p className="text-sm font-semibold text-primary mb-2">Higher Pass Rates. Stronger Retention.</p>
                  <h2 className="text-xl md:text-3xl font-bold text-foreground mb-4">Improved Student Success</h2>
                  <p className="text-sm md:text-base text-muted-foreground mb-6">CSEEL has been proven to increase student grades, pass rates, and overall academic performance.</p>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-check-big h-5 w-5 text-primary mt-0.5 flex-shrink-0"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg>
                      <div>
                        <p className="font-semibold text-foreground text-sm md:text-base">34% Reduction in DFW Rates</p>
                        <p className="text-xs md:text-sm text-muted-foreground">Institutions using CSEEL have observed a 34% decrease in DFW rates across multiple semesters.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-check-big h-5 w-5 text-primary mt-0.5 flex-shrink-0"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg>
                      <div>
                        <p className="font-semibold text-foreground text-sm md:text-base">93% Positive Student Experience</p>
                        <p className="text-xs md:text-sm text-muted-foreground">93% of students report a positive learning experience with CSEEL.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 3: Soft Teal/Emerald Background */}
            <div className="bg-[#d2f4dc] border border-[#86efac] rounded-3xl overflow-hidden transition-all duration-300 shadow-xs hover:shadow-md">
              <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch" style={{ opacity: 1, transform: 'translateY(0px)', transition: 'opacity 0.7s 100ms, transform 0.7s' }}>
                {/* Content Section */}
                <div className="p-8 md:p-12">
                  <p className="text-sm font-semibold text-primary mb-2">Increase Access</p>
                  <h2 className="text-xl md:text-3xl font-bold text-foreground mb-4">Dismantle Barriers to Achievement</h2>
                  <p className="text-sm md:text-base text-muted-foreground mb-6">Expand STEM equity and access among your students. Cseel is designed to meet diverse student needs and offer a more consistent, accessible science learning experience.</p>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-check-big h-5 w-5 text-primary mt-0.5 flex-shrink-0"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg>
                      <div>
                        <p className="font-semibold text-foreground text-sm md:text-base">24% Learning Gains for Struggling Students</p>
                        <p className="text-xs md:text-sm text-muted-foreground">The lowest-performing students show an average 24% improvement in pre-to-post test knowledge.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-check-big h-5 w-5 text-primary mt-0.5 flex-shrink-0"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg>
                      <div>
                        <p className="font-semibold text-foreground text-sm md:text-base">Trusted by Educators</p>
                        <p className="text-xs md:text-sm text-muted-foreground">9 out of 10 educators say they would recommend CSEEL to other teachers or institutions.</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Image Section */}
                <div className="relative w-full h-48 lg:h-auto lg:min-h-full overflow-hidden group">
                  <img src="/images/features/students-classroom.avif" alt="Students in classroom" loading="lazy" decoding="async" className="w-full h-full lg:absolute lg:inset-0 object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* ─── Subjects & Disciplines Catalog (Horizontal Scrollable Rail) ─── */}
      {isSectionEnabled('subjects_catalog') && (
        <section className="py-16 hero-gradient overflow-hidden">
          <div className="container mx-auto px-4">
            
            {/* Header with Navigation Controls */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div className="text-left max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-[#006fcc] border border-blue-200/80 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>{catalogConfig?.badge_text || "SUBJECTS & DISCIPLINES"}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
                  {catalogConfig?.title || "Explore Curriculum-Mapped STEAM Subjects"}
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-medium">
                  Discover interactive virtual simulators, hands-on lab experiments, and NEP 2020 concept modules across core disciplines.
                </p>
              </div>

              {/* Scroll Arrow Controls for Desktop & Tablet */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  type="button"
                  onClick={() => scrollCatalog('left')}
                  aria-label="Previous Subjects"
                  className="w-10 h-10 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center transition-all shadow-xs hover:shadow-md active:scale-95 cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollCatalog('right')}
                  aria-label="Next Subjects"
                  className="w-10 h-10 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center transition-all shadow-xs hover:shadow-md active:scale-95 cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Horizontal Scrollable Track */}
            <div
              ref={catalogScrollRef}
              className="flex items-stretch gap-4 overflow-x-auto no-scrollbar py-2 px-1 snap-x scroll-smooth select-none"
              style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
            >
              {catalogItems.map((item, i) => (
                <CatalogCard key={item.title} item={item} delay={i * 40} />
              ))}
            </div>

            {/* Bottom Explore Button */}
            <div className="text-center mt-10">
              <Link href={catalogConfig?.cta_link || "/subject"}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#006fcc] hover:bg-[#005bb8] text-white font-black text-sm rounded-full transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105 active:scale-98"
              >
                <span>{catalogConfig?.cta_text || "View All Subject Hubs & Interactive Labs"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ─── Testimonial ─── */}
      {isSectionEnabled('testimonials') && <TestimonialSection />}

      {/* ─── Awards ─── */}
      {isSectionEnabled('awards_accreditations') && <AwardsSection />}

      {/* ─── Easy to Use ─── */}
      {isSectionEnabled('easy_steps') && <EasySection />}

      {/* ─── Final CTA ─── */}
      {isSectionEnabled('final_cta') && (
        <section className="py-16 hero-gradient" ref={ctaReveal.ref as any}>
          <div className="container mx-auto px-4">
            <div
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
              style={{
                opacity: ctaReveal.visible ? 1 : 0,
                transform: ctaReveal.visible ? "translateY(0)" : "translateY(40px)",
                transition: "all 0.7s ease",
              }}
            >
              <div>
                <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">
                  {finalCtaConfig?.badge_text || "Get Started"}
                </p>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  {finalCtaConfig?.title || "Find the Plan That Works For You"}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {finalCtaConfig?.subtitle || "See our plan options, learn more about live labs, and find out how easy it is to get started with Cseel."}
                </p>
                <Link href={finalCtaConfig?.cta_link || "/compare-plans"}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-full hover:bg-primary-hover transition-all duration-300 hover:shadow-lg hover:scale-105"
                >
                  {finalCtaConfig?.cta_text || "Compare Plans"} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-lg group">
                <img
                  src="/images/features/group-laptop.avif"
                  alt="Students with laptop"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Global keyframes */}
      <style>{`
        .t-slide{flex:0 0 88%;min-width:0;padding:0 12px;box-sizing:border-box}
        @media(min-width:640px){.t-slide{flex:0 0 56%!important}}
        @media(min-width:1024px){.t-slide{flex:0 0 35%!important}}
        @keyframes t-exit-left  { from{opacity:1;transform:translateX(0)}   to{opacity:0;transform:translateX(-60px)} }
        @keyframes t-exit-right { from{opacity:1;transform:translateX(0)}   to{opacity:0;transform:translateX(60px)}  }
        @keyframes t-enter-right{ from{opacity:0;transform:translateX(60px)} to{opacity:1;transform:translateX(0)}   }
        @keyframes t-enter-left { from{opacity:0;transform:translateX(-60px)}to{opacity:1;transform:translateX(0)}   }
        .t-exit-left  { animation: t-exit-left  0.4s cubic-bezier(0.4,0,0.6,1) forwards; }
        .t-exit-right { animation: t-exit-right 0.4s cubic-bezier(0.4,0,0.6,1) forwards; }
        .t-enter-right{ animation: t-enter-right 0.55s cubic-bezier(0.0,0,0.2,1) forwards; }
        .t-enter-left { animation: t-enter-left  0.55s cubic-bezier(0.0,0,0.2,1) forwards; }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </PageTransition>
  );
};

// Catalog card with full background image & layered typography
function CatalogCard({ item, delay }: { item: typeof catalogItems[0]; delay: number }) {
  const { ref, visible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className="w-[230px] sm:w-[265px] md:w-[280px] shrink-0 snap-start"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(24px) scale(0.96)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
        transitionDelay: `${delay}ms`,
      }}
    >
      <Link
        href={item.link}
        className="group relative h-40 sm:h-44 md:h-48 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 block hover:-translate-y-1 border border-slate-200/80 hover:border-blue-400 select-none p-3.5 flex flex-col justify-between"
      >
        {/* Full Image Background */}
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Multi-stage Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-slate-950/25 group-hover:via-slate-950/50 transition-all duration-300 pointer-events-none" />

        {/* Top Badges (Over Image) */}
        <div className="relative z-10 flex items-center justify-between">
          <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-md border border-white/20">
            {item.badge}
          </span>
          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-black/50 text-white backdrop-blur-md border border-white/20">
            {item.labs}
          </span>
        </div>

        {/* Bottom Typography & Explore Link (Over Image) */}
        <div className="relative z-10 space-y-1">
          <div className="flex items-center justify-between gap-1">
            <h3 className="text-sm sm:text-base font-black text-white group-hover:text-blue-200 transition-colors drop-shadow-sm truncate">
              {item.title}
            </h3>
            <div className="flex items-center gap-1 text-[10px] font-bold text-blue-200 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0">
              <span>Explore</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-200/90 line-clamp-1 font-medium drop-shadow-xs">
            {item.desc}
          </p>
        </div>
      </Link>
    </div>
  );
}

const FALLBACK_TESTIMONIALS = [
  { id:"f1", name:"Sunil Lakra", role:"Science Teacher", institution:"DAV School, Delhi", quote:"CSEEL emphasizes the theory behind the labs. It's much easier for students to carry knowledge forward into advanced classes without missing core concepts.", initials:"SL", cardBg:"#EBF4FA", avatarBg:"#C7E2F5", avatarColor:"#0a5c8a", starColor:"#0a5c8a", iconColor:"#0a5c8a" },
  { id:"f2", name:"Priya Sharma", role:"KV Teacher", institution:"Kendriya Vidyalaya, Mumbai", quote:"The hands-on experiments have transformed how my students engage with science. Their curiosity and participation has increased manifold since we started.", initials:"PS", cardBg:"#EAF5F0", avatarBg:"#B8E4D4", avatarColor:"#0F6E56", starColor:"#0F6E56", iconColor:"#0F6E56" },
  { id:"f3", name:"Rajesh Kumar", role:"Physics Educator", institution:"DPS School, Bengaluru", quote:"hands-on experiments & live labs are perfectly aligned with our CBSE curriculum. Students practice experiments at home which has greatly improved their practical exam scores.", initials:"RA", cardBg:"#EEF0FA", avatarBg:"#C9CFF5", avatarColor:"#3730A3", starColor:"#3730A3", iconColor:"#3730A3" },
  { id:"f4", name:"Anita Verma", role:"Biology Teacher", institution:"Navodaya Vidyalaya, Pune", quote:"The interactive experiments keep students engaged longer. I've seen remarkable improvement in my students' understanding of complex biological processes with CSEEL.", initials:"AV", cardBg:"#F0F7EE", avatarBg:"#C3DFB8", avatarColor:"#276B1A", starColor:"#276B1A", iconColor:"#276B1A" },
  { id:"f5", name:"Vikram Singh", role:"Chemistry Professor", institution:"St. Xavier's College, Chennai", quote:"CSEEL bridges theory and practice beautifully. My college students arrive at labs with much better conceptual clarity, reducing experiment failures significantly.", initials:"VS", cardBg:"#F5EEF8", avatarBg:"#DCC5E8", avatarColor:"#6B21A8", starColor:"#6B21A8", iconColor:"#6B21A8" },
];

function TestimonialSection() {
  const [items, setItems] = useState<any[]>(FALLBACK_TESTIMONIALS);
  const { ref, visible } = useScrollReveal();

  useEffect(() => {
    (supabase as any).from("testimonials").select("*").eq("is_active", true).order("sort_order")
      .then(({ data }) => { if (data && data.length > 0) setItems(data); });
  }, []);

  return (
    <section
      className="py-20 overflow-hidden"
      style={{ background: "#F8F9FA" }}
      ref={ref as any}
    >
      <div
        className="container mx-auto px-6 max-w-7xl"
        style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(40px)", transition: "all 0.7s ease" }}
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-14 gap-8">
          <div>
            <h2 style={{ fontSize:"clamp(2rem,4vw,3rem)", fontWeight:500, color:"#202124", letterSpacing:"-0.02em", lineHeight:1.2, marginBottom:16 }}>
              Trusted by Teachers<br/>
              <span style={{ color:"#5F6368" }}>across the nation.</span>
            </h2>
          </div>
          {/* Arrows */}
          <div style={{ display:"flex", gap:12, flexShrink:0 }}>
            <button
              className="testimonial-swiper-prev"
              style={{ width:48, height:48, borderRadius:"50%", background:"white", border:"1px solid #DADCE0", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", transition:"all 0.2s", color:"#5F6368" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background="#F1F3F4"; (e.currentTarget as HTMLElement).style.color="#202124"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background="white"; (e.currentTarget as HTMLElement).style.color="#5F6368"; }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button
              className="testimonial-swiper-next"
              style={{ width:48, height:48, borderRadius:"50%", background:"white", border:"1px solid #DADCE0", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", transition:"all 0.2s", color:"#5F6368" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background="#F1F3F4"; (e.currentTarget as HTMLElement).style.color="#202124"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background="white"; (e.currentTarget as HTMLElement).style.color="#5F6368"; }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        </div>

        {/* Swiper Testimonials Carousel */}
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={24}
          slidesPerView={1.1}
          speed={600}
          loop={true}
          autoplay={{
            delay: 4500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          navigation={{
            prevEl: '.testimonial-swiper-prev',
            nextEl: '.testimonial-swiper-next',
          }}
          pagination={{
            clickable: true,
            el: '.testimonial-swiper-pagination',
            bulletClass: 'inline-block w-2 h-2 bg-slate-300 rounded-full cursor-pointer transition-all duration-300 mx-1',
            bulletActiveClass: '!bg-blue-600 !w-6',
          }}
          breakpoints={{
            640: { slidesPerView: 1.8, spaceBetween: 24 },
            1024: { slidesPerView: 2.8, spaceBetween: 28 },
          }}
          className="w-full !overflow-visible"
        >
          {items.map((t, i) => {
            const THEMES = [
              { cardBg:"#d9ecfa", avatarBg:"#b5daf5", color:"#034a75" },
              { cardBg:"#d5f2e5", avatarBg:"#a5e5cb", color:"#085542" },
              { cardBg:"#eedaf7", avatarBg:"#d3abeb", color:"#551788" },
              { cardBg:"#fee5c9", avatarBg:"#fbc28b", color:"#852b0d" },
              { cardBg:"#dee5ff", avatarBg:"#b5c4fe", color:"#2b2586" },
            ];
            const theme = THEMES[i % THEMES.length];
            const cardBg = t.cardBg || theme.cardBg;
            const avatarBg = t.avatarBg || theme.avatarBg;
            const avatarColor = t.avatarColor || theme.color;
            const starColor = t.starColor || theme.color;
            const iconColor = t.iconColor || theme.color;
            const initials = t.initials || t.name?.slice(0,2).toUpperCase();
            return (
              <SwiperSlide key={t.id||i} className="h-auto">
                <div
                  style={{
                    background: cardBg,
                    borderRadius:28,
                    border:"1px solid rgba(0,0,0,0.07)",
                    padding:"32px",
                    height:"100%",
                    display:"flex",
                    flexDirection:"column",
                    transition:"border-color 0.3s, box-shadow 0.3s, transform 0.3s",
                    cursor:"default",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px rgba(0,0,0,0.10)";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  }}
                >
                  {/* Avatar + name */}
                  <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:24 }}>
                    <div style={{ width:52, height:52, borderRadius:"50%", background:avatarBg, display:"flex", alignItems:"center", justifyContent:"center", color:avatarColor, fontWeight:700, fontSize:15, flexShrink:0 }}>
                      {t.photo_url ? (
                        <img src={t.photo_url} alt={t.name} style={{ width:"100%", height:"100%", objectFit:"cover", borderRadius:"50%" }} />
                      ) : initials}
                    </div>
                    <div>
                      <p style={{ fontWeight:500, color:"#202124", fontSize:15, lineHeight:1.3 }}>{t.name}</p>
                      <p style={{ fontSize:13, color:"#5F6368", marginTop:2 }}>{t.institution || t.role}</p>
                    </div>
                  </div>

                  {/* Quote */}
                  <p style={{ color:"#3C4043", fontSize:16, lineHeight:1.7, flex:1 }}>
                    "{t.quote}"
                  </p>

                  {/* Footer */}
                  <div style={{ marginTop:24, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <div style={{ color:starColor, fontSize:16, letterSpacing:2 }}>★★★★★</div>
                    <svg style={{ width:22, height:22, color:iconColor, fill:iconColor }} viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* Swiper Pagination Dots */}
        <div className="testimonial-swiper-pagination !flex !justify-center !items-center !gap-1.5 !mt-10" />
      </div>
    </section>
  );
}

function AwardsSection() {
  const { ref, visible } = useScrollReveal();
  const awardImgs = [
    "/images/awards/gsv.avif",
    "/images/awards/promise.avif",
    "/images/awards/edtech.avif",
    "/images/awards/advocate.avif",
    "/images/awards/leader.avif",
    "/images/awards/ability.avif",
  ];
  return (
    <section className="py-16 hero-gradient" ref={ref as any}>
      <div className="container mx-auto px-4">
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(40px)",
            transition: "all 0.7s ease",
          }}
        >
          <div className="text-center mb-8 lg:hidden">
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Recognition</p>
            <h2 className="text-2xl font-bold text-foreground">Award-Winning Platform</h2>
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            {awardImgs.map((src, i) => (
              <img
                key={i}
                src={src}
                alt="Award badge"
                loading="lazy"
                decoding="async"
                className="h-20 w-20 object-contain transition-transform duration-300 hover:scale-110"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "scale(1)" : "scale(0.7)",
                  transition: "all 0.5s ease",
                  transitionDelay: `${i * 80}ms`,
                }}
              />
            ))}
          </div>
          <div>
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Recognition</p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Award-Winning Learning Platform</h2>
            <p className="text-muted-foreground mb-6">
              Cseel has earned recognition for our research-based learning architecture, best-in-class customer support, and student impact. Learn why our hands-on science labs have received more than 10 prestigious education awards.
            </p>
            <Link href="/about-us"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-full hover:bg-primary-hover transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              Learn More About Cseel <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function EasySection() {
  const { ref, visible } = useScrollReveal();
  const cards = [
    { tag: "LMS Integration", title: "Stay with your LMS or use our Course Manager", desc: "Assign CSEEL right from your LMS! Explore and select content, and monitor student results, all without having to leave your course page." },
    { tag: "Course Mapping", title: "Easily match Cseel to your curriculum", desc: "Browse our Catalog to find live labs that match your curriculum, or get our course mapping service with Advanced or Elite plans." },
    { tag: "Technical Support", title: "Get live support whenever you need it", desc: "Our award-winning support team is ready to help you and your students at every step via Live Chat, Help Center, and training guides." },
  ];
  return (
    <section className="py-16 bg-background" ref={ref as any}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12" style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: "all 0.6s ease" }}>
          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Simple to Start</p>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">We Make it Easy to Use CSEEL in STEM Courses</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((c, i) => (
            <div
              key={i}
              className="p-8 rounded-2xl bg-[#eef6ff] border border-[#b9dbf8] shadow-xs hover:shadow-md hover:border-primary text-center transition-all duration-300 hover:-translate-y-1"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(40px)",
                transition: "opacity 0.6s ease, transform 0.6s ease, box-shadow 0.3s, translateY 0.3s",
                transitionDelay: `${i * 120}ms`,
              }}
            >
              <div className="text-sm font-bold text-primary mb-2 uppercase tracking-wide">{c.tag}</div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">{c.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Index;