'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, ArrowRight, Play, ChevronLeft, ChevronRight, School, GraduationCap, MapPin, Sparkles } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import PageTransition from "@/components/shared/PageTransition";
import OffersSection from "@/components/offers/OffersSection";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import OfferPopup from "@/components/offers/OfferPopup";
import { useHomepageCms } from "@/features/homepage-cms/hooks/useHomepageCms";
import { 
  AdminVisualEditorBar, 
  SectionVisualWrapper, 
  SectionEditorDrawer, 
  VersionHistoryModal 
} from "@/components/admin-editor";
import { HomepageSectionId, HomepageSectionConfig } from "@/features/homepage-cms/types";

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
  logoUrl?: string;
}

const partnerSchoolsList: PartnerSchoolItem[] = [
  {
    id: "st-columbas-delhi",
    name: "St. Columba's School",
    shortName: "St. Columba's",
    city: "Ashok Place, New Delhi",
    board: "CBSE Affiliated",
    initials: "SCS",
    studentsCount: "2,814+ Students",
    badge: "Senior Secondary",
    accent: "text-blue-700 bg-blue-50 border-blue-200",
    avatarBg: "bg-blue-600 text-white",
    avatarGradient: "from-blue-600 to-indigo-700 text-white",
    image: "/images/schools/st-columbas-school-delhi.webp",
    logoUrl: "/images/partner-logos/st-columbas-school-logo.webp",
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
    image: "/images/schools/sanskriti-school-chanakyapuri-delhi.webp",
    logoUrl: "/images/partner-logos/sanskriti-school-logo.webp",
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
    image: "/images/schools/modern-school-barakhamba-road-delhi.webp",
    logoUrl: "/images/partner-logos/modern-school-logo.webp",
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
    image: "/images/schools/st-thomas-school-mandir-marg-delhi.webp",
    logoUrl: "/images/partner-logos/st-thomas-school-logo.webp",
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
    image: "/images/schools/convent-of-jesus-and-mary-delhi.webp",
    logoUrl: "/images/partner-logos/convent-of-jesus-and-mary-school-logo.webp",
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
    image: "/images/schools/bharatiya-vidya-bhavan-delhi-campus.webp",
    logoUrl: "/images/partner-logos/bharatiya-vidya-bhavan-school-logo.webp",
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
    image: "/images/schools/mater-dei-school-tilak-lane-delhi.webp",
    logoUrl: "/images/partner-logos/mater-dei-school-logo.webp",
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
    image: "/images/schools/guru-harkrishan-public-school-delhi.webp",
    logoUrl: "/images/partner-logos/guru-harkrishan-public-school-logo.webp",
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
    image: "/images/schools/sardar-patel-vidyalaya-delhi.webp",
    logoUrl: "/images/partner-logos/sardar-patel-vidyalaya-logo.webp",
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
    image: "/images/schools/carmel-convent-school-delhi.webp",
    logoUrl: "/images/partner-logos/carmel-convent-school-logo.webp",
  },
];



const catalogDomains = [
  {
    id: "science-mathematics",
    title: "Science & Mathematics",
    subtitle: "Core STEM Foundation",
    desc: "Explore Chemistry, Biology, Physics & Mathematics through experiential science practicals, hands-on kits and NEP 2020 aligned laboratories. Build scientific temper through real experiments and tactile learning.",
    badge: "NEP 2020 • CBSE • ICSE",
    totalLabs: "15 Labs",
    link: "/domain/science",
    bgImage: "/images/categories/chemistry-virtual-lab-experiments.webp",
    subjects: ["Chemistry", "Biology", "Physics", "Mathematics"],
    icon: "🔬",
  },
  {
    id: "engineering-technology",
    title: "Engineering & Technology",
    subtitle: "Future-Ready Skills",
    desc: "Hands-on Engineering design, AI, IoT, Robotics and ATL Tinkering Labs that build critical thinking and real-world problem solving. Build real circuits, program microcontrollers and create robotics prototypes.",
    badge: "ATL Tinkering • Future Skills",
    totalLabs: "8 Labs",
    link: "/domain/engineering",
    bgImage: "/images/categories/engineering-robotics-and-technology-labs.webp",
    subjects: ["Engineering", "Technology", "Robotics", "AI & IoT"],
    icon: "⚙️",
  },
  {
    id: "art-design",
    title: "Art & Design",
    subtitle: "Creative STEAM",
    desc: "Blend creativity with science — Color Physics, Photochemistry, Design Thinking and Creative STEAM modules for holistic development. Develop both analytical and creative capacities simultaneously.",
    badge: "Experiential • Design Thinking",
    totalLabs: "4 Labs",
    link: "/domain/art",
    bgImage: "/images/categories/art-design-steam-creative-modules.webp",
    subjects: ["Art & STEAM", "Color Physics", "Design", "Creativity"],
    icon: "🎨",
  },
];

// Descriptive SEO image objects for Homepage Hero Carousel Slider
const heroImages = [
  {
    src: "/images/hero/students-doing-chemistry-lab-experiment.webp",
    alt: "Indian school students conducting chemistry experiment with test tubes and beakers in CSEEL experiential science laboratory",
  },
  {
    src: "/images/hero/physics-virtual-laboratory-pendulum-simulation.webp",
    alt: "High school physics students analyzing pendulum oscillation and harmonic motion in experiential laboratory",
  },
  {
    src: "/images/hero/biology-cell-mitosis-microscope-lab.webp",
    alt: "Students exploring cell division mitosis and biological specimens under digital microscope",
  },
  {
    src: "/images/hero/stem-robotics-and-electronics-breadboard.webp",
    alt: "Students building electronic circuit with breadboard sensors in ATL tinkering robotics lab",
  },
  {
    src: "/images/hero/interactive-science-simulation-interface.webp",
    alt: "Interactive experiential learning interface showcasing NEP 2020 practical science modules",
  },
  {
    src: "/images/hero/school-science-exhibition-tinkering-lab.webp",
    alt: "School learners collaborating and presenting innovative engineering models at science exhibition",
  },
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
      className="p-6 md:p-8 rounded-2xl card-soft-blue shadow-xs hover:shadow-md transition-all duration-500 hover:-translate-y-1"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        transitionDelay: `${delay}ms`,
      }}
    >
      <div ref={ref} className="text-3xl md:text-5xl font-black text-primary mb-2 tracking-tight">
        +{count}%
      </div>
      <h3 className="text-base md:text-lg font-bold text-foreground mb-2">{label}{suffix && <sup className="text-xs text-primary font-bold">{suffix}</sup>}</h3>
      <p className="text-xs md:text-sm text-muted-foreground font-medium leading-relaxed">{desc}</p>
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
        {heroImages.map((slide, i) => (
          <SwiperSlide key={i} className="relative w-full h-full cseel-hero-slide">
            <img
              src={slide.src}
              alt={slide.alt}
              loading={i === 0 ? "eager" : "lazy"}
              decoding={i === 0 ? "sync" : "async"}
              fetchPriority={i === 0 ? "high" : "low"}
              className="w-full h-full object-cover cseel-hero-slide-image"
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
  const router = useRouter();
  const heroReveal = useScrollReveal();
  const metricsReveal = useScrollReveal();
  const ctaReveal = useScrollReveal();
  const { 
    sections,
    versions,
    isSaving,
    isRollingBack,
    hasUnsavedChanges,
    isSectionEnabled, 
    getSection, 
    toggleSection, 
    updateSectionDraft, 
    saveChangesWithVersion, 
    rollbackToVersion, 
    discardChanges 
  } = useHomepageCms();

  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editingSection, setEditingSection] = useState<HomepageSectionConfig | null>(null);
  const [isVersionModalOpen, setIsVersionModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = localStorage.getItem('cseel_admin_auth') === 'true';
      if (!auth) {
        setIsEditMode(false);
        return;
      }
      const p = new URLSearchParams(window.location.search);
      if (p.get('edit') === 'true' || p.get('editMode') === 'true') {
        setIsEditMode(true);
      }
    }
  }, []);

  const handleOpenEditSection = (id: HomepageSectionId) => {
    const sec = getSection(id);
    if (sec) {
      setEditingSection(sec);
    }
  };

  const getSubjectHref = (name: string): string => {
    const n = name.toLowerCase().trim();
    if (n.includes('chem')) return '/subject/chemistry';
    if (n.includes('phys')) return '/subject/physics';
    if (n.includes('bio') || n.includes('botan') || n.includes('zool')) return '/subject/biology';
    if (n.includes('math')) return '/subject/mathematics';
    if (n.includes('eng')) return '/subject/engineering';
    if (n.includes('tech') || n.includes('robot') || n.includes('ai') || n.includes('iot')) return '/subject/technology';
    if (n.includes('art') || n.includes('steam') || n.includes('design') || n.includes('creat')) return '/subject/art';
    return '/domain/science';
  };

  const heroConfig = getSection('hero_section');
  const metricsConfig = getSection('impact_metrics');
  const featuresConfig = getSection('why_cseel_features');
  const catalogConfig = getSection('subjects_catalog');
  const partnerConfig = getSection('partner_schools');
  const finalCtaConfig = getSection('final_cta');

  return (
    <PageTransition>
      {/* ─── Top Floating Admin Visual Editor Bar ─── */}
      <AdminVisualEditorBar
        isEditMode={isEditMode}
        onToggleEditMode={() => setIsEditMode(!isEditMode)}
        hasUnsavedChanges={hasUnsavedChanges}
        versions={versions}
        onSave={async (summary) => {
          return await saveChangesWithVersion(summary);
        }}
        onRollback={async (vId) => {
          return await rollbackToVersion(vId);
        }}
        onDiscard={discardChanges}
        isSaving={isSaving}
        isRollingBack={isRollingBack}
        onOpenVersionModal={() => setIsVersionModalOpen(true)}
      />

      {/* ─── In-Place Section Editor Drawer ─── */}
      <SectionEditorDrawer
        isOpen={Boolean(editingSection)}
        onClose={() => setEditingSection(null)}
        section={editingSection}
        onUpdateDraft={(id, changes) => {
          updateSectionDraft(id, changes);
          setEditingSection((prev) => (prev ? { ...prev, ...changes } : null));
        }}
      />

      {/* ─── Version History & Rollback Modal (Max 10 Stored) ─── */}
      <VersionHistoryModal
        isOpen={isVersionModalOpen}
        onClose={() => setIsVersionModalOpen(false)}
        versions={versions}
        onRollback={async (vId) => {
          return await rollbackToVersion(vId);
        }}
        isRollingBack={isRollingBack}
      />

      {/* ─── Hero Section with Brand Palette (#003c6e & #006fcc) ─── */}
      <SectionVisualWrapper
        sectionId="hero_section"
        sectionName="Hero Headline & Primary CTAs"
        isEditMode={isEditMode}
        enabled={isSectionEnabled('hero_section')}
        onToggleVisibility={() => toggleSection('hero_section')}
        onOpenEdit={() => handleOpenEditSection('hero_section')}
      >
        <section id="cseel-hero-section" aria-label="Welcome to CSEEL" className="cseel-hero-section hero-gradient pt-6 sm:pt-10 md:pt-14 pb-8 md:pb-12 overflow-hidden">
          <div className="cseel-hero-container container mx-auto px-4 text-center">
            
            {/* Single-Line Dominant Brand Title (Geometric Sans-Serif Matching Logo Typography) */}
            <div style={{ animation: "fadeSlideUp 0.8s ease forwards" }} className="my-4 sm:my-7 px-2">
              <h1
                className="text-[25px] xs:text-[28px] sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-tight whitespace-nowrap text-center"
                style={{ fontFamily: "var(--font-montserrat), 'Montserrat', 'Poppins', sans-serif" }}
              >
                <span>{heroConfig?.title ? (heroConfig.title.toLowerCase().includes('welcome to cseel') ? 'Welcome to ' : heroConfig.title + ' ') : 'Welcome to '}</span>
                <span
                  className="text-primary font-bold tracking-wide inline-block"
                  style={{
                    fontFamily: "var(--font-fredoka), 'Fredoka', 'Varela Round', 'Nunito', sans-serif",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                  }}
                >
                  {heroConfig?.title && heroConfig.title.toLowerCase().includes('welcome to cseel') ? 'CSEEL' : ''}
                </span>
              </h1>
              <p
                className="mt-2.5 sm:mt-3.5 text-xs sm:text-sm md:text-base font-bold text-primary tracking-tight max-w-xl mx-auto"
                style={{ fontFamily: "var(--font-poppins), 'Poppins', 'Montserrat', sans-serif" }}
              >
                {heroConfig?.subtitle || 'Center for Scientific Exploration and Experiential Learning'}
              </p>
            </div>

            {/* Description with Read More */}
            <div style={{ animation: "fadeSlideUp 0.8s ease 0.15s both" }}>
              <HeroText />
            </div>

            {/* CTA Buttons */}
            <div
              className="flex flex-col sm:flex-row justify-center gap-3.5 my-6 sm:my-8 max-w-sm sm:max-w-none mx-auto px-4"
              style={{ animation: "fadeSlideUp 0.8s ease 0.3s both" }}
            >
              <Link
                href={heroConfig?.cta_link || "/compare-plans"}
                className="button_primary group px-8 py-3.5 text-white font-bold text-[15px] rounded-[12px] transition-all flex items-center justify-center gap-2.5 active:scale-98 shadow-[0_4px_18px_rgba(0,111,204,0.35)]"
              >
                <span className="text-white">{heroConfig?.cta_text || "Our Plans"}</span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform shrink-0" />
              </Link>
              <Link
                href={heroConfig?.secondary_cta_link || "/virtual-lab-tour"}
                className="button_secondary group px-8 py-3.5 text-[#006FCC] font-bold text-[15px] rounded-[12px] transition-all flex items-center justify-center gap-2.5 active:scale-98"
              >
                <Play className="w-4 h-4 text-[#006FCC] fill-[#006FCC]/20 shrink-0" />
                <span>{heroConfig?.secondary_cta_text || "Live Lab Tour"}</span>
              </Link>
            </div>

            {/* Hero Image Slider - Scaled to fit perfectly */}
            <div style={{ animation: "fadeSlideUp 0.9s ease 0.45s both" }}>
              <HeroSlider />
            </div>

          </div>
        </section>
      </SectionVisualWrapper>

      {/* ─── Special Offers Section ─── */}
      <SectionVisualWrapper
        sectionId="special_offers"
        sectionName="Special Offers & Events Cards"
        isEditMode={isEditMode}
        enabled={isSectionEnabled('special_offers')}
        onToggleVisibility={() => toggleSection('special_offers')}
        onOpenEdit={() => handleOpenEditSection('special_offers')}
      >
        <OffersSection />
      </SectionVisualWrapper>
      {/* ─── Stats ─── */}
      <section id="cseel-research-backed-stats-section" aria-label="Why Hands-On Science Works" className="cseel-stats-section py-16 bg-slate-50/70 border-y border-slate-200/80">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Research Backed</p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Why Hands-On Science Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <StatCard value={42} label="Higher Retention Rate" desc="Students engaged in hands-on STEAM/STEM learning show up to 42% higher knowledge retention." delay={0} suffix="¹" />
            <StatCard value={25} label="Engagement" desc="Gamified, interactive STEAM environments increase student engagement and motivation by 25%." delay={150} suffix="²" />
            <div
              className="p-6 md:p-8 rounded-2xl card-soft-blue shadow-xs hover:shadow-md transition-all duration-500 hover:-translate-y-1"
              style={{ animation: "fadeSlideUp 0.7s ease 0.4s both" }}
            >
              <div className="text-3xl md:text-5xl font-black text-primary mb-2 tracking-tight">≧ C</div>
              <h3 className="text-base md:text-lg font-bold text-foreground mb-2">Higher Academic Success<sup className="text-xs text-primary font-bold">³</sup></h3>
              <p className="text-xs md:text-sm text-muted-foreground font-medium leading-relaxed">Students earning C or higher in foundational science courses are more likely to persist in STEAM careers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Trusted Schools Marquee Strip (logo + name together) ─── */}
      <SectionVisualWrapper
        sectionId="partner_schools"
        sectionName="Verified Delhi Schools Network"
        isEditMode={isEditMode}
        enabled={isSectionEnabled('partner_schools')}
        onToggleVisibility={() => toggleSection('partner_schools')}
        onOpenEdit={() => handleOpenEditSection('partner_schools')}
      >
        <section id="cseel-partner-schools-network-section" aria-labelledby="trust-h" className="cseel-partner-schools-section bg-white py-14 border-b border-[#E2E8F0]">
          <div className="max-w-[1280px] mx-auto px-6 lg:px-10 text-center mb-10">
            <p id="trust-h" className="font-semibold text-[#64748B] text-[14px]">
              {partnerConfig?.subtitle || partnerConfig?.title || "Trusted by 250+ schools & institutions across Delhi NCR and India"}
            </p>
          </div>

          {/* Single unified marquee: logo + name card together */}
          <div className="school-marquee" role="list" aria-label="Partner schools">
            <div className="school-marquee__track">
              {[...partnerSchoolsList, ...partnerSchoolsList].map((school, i) => (
                <div
                  key={`school-card-${school.id}-${i}`}
                  className="school-marquee__card"
                  role="listitem"
                  aria-hidden={i >= partnerSchoolsList.length ? true : undefined}
                >
                  {/* Logo / initials */}
                  <div className="school-marquee__logo">
                    {school.logoUrl ? (
                      <img
                        src={school.logoUrl}
                        alt={school.name}
                        loading="lazy"
                        onError={(e) => {
                          const img = e.currentTarget;
                          img.style.display = 'none';
                          const fallback = img.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <span
                      style={{ display: school.logoUrl ? 'none' : 'flex' }}
                      className={`school-marquee__initials bg-gradient-to-br ${school.avatarGradient}`}
                    >
                      {school.initials}
                    </span>
                  </div>
                  {/* Name */}
                  <span className="school-marquee__name">{school.shortName}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </SectionVisualWrapper>

      {/* ─── Key Metrics ─── */}
      <SectionVisualWrapper
        sectionId="impact_metrics"
        sectionName="Key Impact Metrics & Numbers"
        isEditMode={isEditMode}
        enabled={isSectionEnabled('impact_metrics')}
        onToggleVisibility={() => toggleSection('impact_metrics')}
        onOpenEdit={() => handleOpenEditSection('impact_metrics')}
      >
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
      </SectionVisualWrapper>

      {/* ─── Feature Rows ─── */}
      <SectionVisualWrapper
        sectionId="why_cseel_features"
        sectionName="Why CSEEL Learning Outcomes"
        isEditMode={isEditMode}
        enabled={isSectionEnabled('why_cseel_features')}
        onToggleVisibility={() => toggleSection('why_cseel_features')}
        onOpenEdit={() => handleOpenEditSection('why_cseel_features')}
      >
        <section id="cseel-lms-integration-section" aria-label="LMS Integration and Support" className="cseel-lms-section py-20 bg-background">
          <div className="container mx-auto px-4 max-w-[1240px]">
            <div className="text-center mb-12">
              <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">
                {featuresConfig?.badge_text || "Why CSEEL"}
              </p>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
                {featuresConfig?.title || "Built for Real Learning Outcomes"}
              </h2>
            </div>
            
            {/* Stacking Cards Wrapper with Sticky Scroll Flow */}
            <div className="achievement_list-wrapper flex flex-col gap-8 pb-12 relative">
              
              {/* Feature 1: Soft Blue Background - Sticky Card 1 */}
              <div 
                className="card-soft-blue rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-xl transition-all duration-300 sticky"
                style={{ top: '100px', zIndex: 10, marginBottom: '2.5rem' }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch min-h-[380px]">
                  {/* Content Section */}
                  <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
                    <p className="text-sm font-semibold text-primary mb-2">No need for extra grading or planning time</p>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-4" style={{ color: '#023858' }}>
                      Students look forward to learning at their own pace
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground mb-6 leading-relaxed">
                      Educators assign CSEEL experimental labs to actively engage students—without increasing their already busy workloads. Higher engagement naturally leads to better understanding, improved grades, and stronger retention.
                    </p>
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
                  <div className="relative w-full h-64 lg:h-auto lg:min-h-full overflow-hidden group">
                    <img src="/images/features/virtual-classroom-remote-science-learning.avif" alt="Student learning remotely" loading="lazy" decoding="async" className="w-full h-full lg:absolute lg:inset-0 object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                </div>
              </div>

              {/* Feature 2: Soft Peach/Rose Background - Sticky Card 2 */}
              <div 
                className="card-soft-red rounded-3xl overflow-hidden shadow-[0_-6px_28px_rgba(0,0,0,0.07),0_12px_32px_rgba(0,0,0,0.08)] hover:shadow-xl transition-all duration-300 sticky"
                style={{ top: '124px', zIndex: 20, marginBottom: '2.5rem' }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch min-h-[380px]">
                  {/* Image Section */}
                  <div className="relative w-full h-64 lg:h-auto lg:min-h-full overflow-hidden group lg:order-first order-last">
                    <img src="/images/features/hands-on-science-laboratory-beakers.avif" alt="Scientists in lab" loading="lazy" decoding="async" className="w-full h-full lg:absolute lg:inset-0 object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  {/* Content Section */}
                  <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
                    <p className="text-sm font-semibold text-rose-600 mb-2">Higher Pass Rates. Stronger Retention.</p>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-4" style={{ color: '#023858' }}>
                      Improved Student Success
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground mb-6 leading-relaxed">
                      CSEEL has been proven to increase student grades, pass rates, and overall academic performance.
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-check-big h-5 w-5 text-rose-600 mt-0.5 flex-shrink-0"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg>
                        <div>
                          <p className="font-semibold text-foreground text-sm md:text-base">34% Reduction in DFW Rates</p>
                          <p className="text-xs md:text-sm text-muted-foreground">Institutions using CSEEL have observed a 34% decrease in DFW rates across multiple semesters.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-check-big h-5 w-5 text-rose-600 mt-0.5 flex-shrink-0"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg>
                        <div>
                          <p className="font-semibold text-foreground text-sm md:text-base">93% Positive Student Experience</p>
                          <p className="text-xs md:text-sm text-muted-foreground">93% of students report a positive learning experience with CSEEL.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature 3: Soft Teal/Emerald Background - Sticky Card 3 */}
              <div 
                className="card-soft-green rounded-3xl overflow-hidden shadow-[0_-6px_28px_rgba(0,0,0,0.07),0_12px_32px_rgba(0,0,0,0.08)] hover:shadow-xl transition-all duration-300 sticky"
                style={{ top: '148px', zIndex: 30, marginBottom: '1rem' }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch min-h-[380px]">
                  {/* Content Section */}
                  <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
                    <p className="text-sm font-semibold text-emerald-700 mb-2">Increase Access</p>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-4" style={{ color: '#023858' }}>
                      Dismantle Barriers to Achievement
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground mb-6 leading-relaxed">
                      Expand STEM equity and access among your students. Cseel is designed to meet diverse student needs and offer a more consistent, accessible science learning experience.
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-check-big h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg>
                        <div>
                          <p className="font-semibold text-foreground text-sm md:text-base">24% Learning Gains for Struggling Students</p>
                          <p className="text-xs md:text-sm text-muted-foreground">The lowest-performing students show an average 24% improvement in pre-to-post test knowledge.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-check-big h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg>
                        <div>
                          <p className="font-semibold text-foreground text-sm md:text-base">Trusted by Educators</p>
                          <p className="text-xs md:text-sm text-muted-foreground">9 out of 10 educators say they would recommend CSEEL to other teachers or institutions.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Image Section */}
                  <div className="relative w-full h-64 lg:h-auto lg:min-h-full overflow-hidden group">
                    <img src="/images/features/indian-school-students-interactive-classroom.avif" alt="Students in classroom" loading="lazy" decoding="async" className="w-full h-full lg:absolute lg:inset-0 object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                </div>
              </div>

            </div>

          </div>
        </section>
      </SectionVisualWrapper>

      {/* ─── Subjects & Disciplines — 3 Domain Cards ─── */}
      <SectionVisualWrapper
        sectionId="subjects_catalog"
        sectionName="Subjects & Disciplines Catalog"
        isEditMode={isEditMode}
        enabled={isSectionEnabled('subjects_catalog')}
        onToggleVisibility={() => toggleSection('subjects_catalog')}
        onOpenEdit={() => handleOpenEditSection('subjects_catalog')}
      >
        <section id="cseel-disciplines-catalog-section" className="py-16 hero-gradient overflow-hidden">
          <div className="container mx-auto px-4">

            {/* Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-[#006fcc] border border-blue-200/80 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{catalogConfig?.badge_text || "SUBJECTS & DISCIPLINES"}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
                {catalogConfig?.title || "Explore the CSEEL Experimental Catalog"}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2 font-medium max-w-xl mx-auto">
                Discover experiential learning practicals, hands-on lab experiments, and NEP 2020 concept modules across core disciplines.
              </p>
            </div>

            {/* 3 Domain Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {catalogDomains.map((domain, i) => (
                <Link
                  key={domain.id}
                  href={domain.link}
                  className="lift block bg-white rounded-card shadow-card border overflow-hidden border-rule/60 flex flex-col justify-between group hover:border-[#005689]/40 hover:shadow-card-hi transition-all"
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  {/* Top content section */}
                  <div className="p-7 pb-5 lg:p-8">
                    <div className="flex items-center justify-between mb-3 gap-2">
                      <h3 className="text-2xl font-bold text-[#0D4979] group-hover:text-[#005689] transition-colors">
                        {domain.title}
                      </h3>
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-[#005689] group-hover:translate-x-1 transition-transform shrink-0">
                        Explore Labs <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                    <p className="text-slate-body text-[15px] leading-relaxed">
                      {domain.desc}
                    </p>
                  </div>
                  {/* Image section */}
                  <div className="px-7 pb-7 lg:px-8 lg:pb-8">
                    <div className="thumb-zoom rounded-xl overflow-hidden shadow-sm">
                      <img
                        className="w-full object-cover aspect-[16/9] group-hover:scale-[1.04] transition-transform duration-500"
                        src={domain.bgImage}
                        alt={domain.title}
                        loading="lazy"
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="text-center mt-10">
              <Link
                href={catalogConfig?.cta_link && catalogConfig.cta_link !== '/subject' ? catalogConfig.cta_link : "/domain/science"}
                className="button_primary inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#006FCC] hover:bg-[#005499] text-white font-bold text-[15px] rounded-[12px] transition-all shadow-[0_4px_18px_rgba(0,111,204,0.35)] active:scale-98"
              >
                <span>{catalogConfig?.cta_text || "View All Subject Hubs & Interactive Labs"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </section>
      </SectionVisualWrapper>

      {/* ─── Testimonial ─── */}
      <SectionVisualWrapper
        sectionId="testimonials"
        sectionName="Educator & Student Testimonials"
        isEditMode={isEditMode}
        enabled={isSectionEnabled('testimonials')}
        onToggleVisibility={() => toggleSection('testimonials')}
        onOpenEdit={() => handleOpenEditSection('testimonials')}
      >
        <TestimonialSection />
      </SectionVisualWrapper>

      {/* ─── Awards ─── */}
      <SectionVisualWrapper
        sectionId="awards_accreditations"
        sectionName="Awards & STEM Accreditations"
        isEditMode={isEditMode}
        enabled={isSectionEnabled('awards_accreditations')}
        onToggleVisibility={() => toggleSection('awards_accreditations')}
        onOpenEdit={() => handleOpenEditSection('awards_accreditations')}
      >
        <AwardsSection />
      </SectionVisualWrapper>

      {/* ─── Easy to Use ─── */}
      <SectionVisualWrapper
        sectionId="easy_steps"
        sectionName="3-Step Easy Process"
        isEditMode={isEditMode}
        enabled={isSectionEnabled('easy_steps')}
        onToggleVisibility={() => toggleSection('easy_steps')}
        onOpenEdit={() => handleOpenEditSection('easy_steps')}
      >
        <EasySection />
      </SectionVisualWrapper>

      {/* ─── Final CTA ─── */}
      <SectionVisualWrapper
        sectionId="final_cta"
        sectionName="Final Call To Action"
        isEditMode={isEditMode}
        enabled={isSectionEnabled('final_cta')}
        onToggleVisibility={() => toggleSection('final_cta')}
        onOpenEdit={() => handleOpenEditSection('final_cta')}
      >
        <section
          className="py-20 relative overflow-hidden text-white"
          style={{
            background: 'linear-gradient(110deg, #023858 36%, #005499 68%)',
          }}
          ref={ctaReveal.ref as any}
        >
          {/* Background ambient lighting */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#006FCC]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#023858]/60 rounded-full blur-3xl pointer-events-none" />

          <div className="container mx-auto px-6 lg:px-12 relative z-10">
            <div
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
              style={{
                opacity: ctaReveal.visible ? 1 : 0,
                transform: ctaReveal.visible ? "translateY(0)" : "translateY(40px)",
                transition: "all 0.7s ease",
              }}
            >
              <div>
                <p className="text-xs font-bold text-[#38BDF8] uppercase tracking-widest mb-3">
                  {finalCtaConfig?.badge_text || "Get Started"}
                </p>
                <h2
                  className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-5 leading-tight tracking-tight"
                  style={{ color: '#ffffff' }}
                >
                  {finalCtaConfig?.title || "Find the Plan That Works For You"}
                </h2>
                <p className="text-[#D6EDFF]/90 text-base md:text-lg mb-8 leading-relaxed max-w-xl">
                  {finalCtaConfig?.subtitle || "See our plan options, learn more about live labs, and find out how easy it is to get started with CSEEL."}
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    href={finalCtaConfig?.cta_link || "/compare-plans"}
                    className="button_primary inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#006FCC] hover:bg-[#005499] text-white font-bold rounded-[12px] transition-all text-base shadow-[0_4px_18px_rgba(0,111,204,0.4)] hover:shadow-[0_6px_24px_rgba(0,111,204,0.55)] active:scale-98"
                  >
                    <span>{finalCtaConfig?.cta_text || "Compare Plans & Pricing"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/15 group">
                <img
                  src={finalCtaConfig?.image || "/images/features/students-collaborative-laptop-learning.avif"}
                  alt="Students with laptop"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-80 md:h-[380px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        </section>
      </SectionVisualWrapper>

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


const FALLBACK_TESTIMONIALS = [
  { id:"f1", name:"Sunil Lakra", role:"Science Teacher", institution:"DAV School, Delhi", quote:"CSEEL emphasizes the theory behind the labs. It's much easier for students to carry knowledge forward into advanced classes without missing core concepts.", initials:"SL", photo_url:"/images/teachers/sunil-lakra-science-teacher-dav-delhi.webp" },
  { id:"f2", name:"Priya Sharma", role:"KV Teacher", institution:"Kendriya Vidyalaya, Mumbai", quote:"The hands-on experiments have transformed how my students engage with science. Their curiosity and participation has increased manifold since we started.", initials:"PS", photo_url:"/images/teachers/priya-sharma-teacher-kendriya-vidyalaya.webp" },
  { id:"f3", name:"Rajesh Kumar", role:"Physics Educator", institution:"DPS School, Bengaluru", quote:"hands-on experiments & live labs are perfectly aligned with our CBSE curriculum. Students practice experiments at home which has greatly improved their practical exam scores.", initials:"RA", photo_url:"/images/teachers/rajesh-kumar-physics-educator-dps.webp" },
  { id:"f4", name:"Anita Verma", role:"Biology Teacher", institution:"Navodaya Vidyalaya, Pune", quote:"The interactive experiments keep students engaged longer. I've seen remarkable improvement in my students' understanding of complex biological processes with CSEEL.", initials:"AV", photo_url:"/images/teachers/anita-verma-biology-teacher-navodaya.webp" },
  { id:"f5", name:"Vikram Singh", role:"Chemistry Professor", institution:"St. Xavier's College, Chennai", quote:"CSEEL bridges theory and practice beautifully. My college students arrive at labs with much better conceptual clarity, reducing experiment failures significantly.", initials:"VS", photo_url:"/images/teachers/vikram-singh-chemistry-professor-st-xaviers.webp" },
];

function TestimonialSection() {
  const [items, setItems] = useState<any[]>(FALLBACK_TESTIMONIALS);
  const { ref, visible } = useScrollReveal();

  // Testimonials load instantly from curated data

  return (
    <section
      id="cseel-teacher-testimonials-section" aria-label="Teacher Testimonials Across India" className="cseel-testimonials-section py-20 overflow-hidden bg-[#F8FAFD] dark:bg-[#121212] border-t border-border"
      ref={ref as any}
    >
      <div
        className="container mx-auto px-6 max-w-7xl"
        style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(40px)", transition: "all 0.7s ease" }}
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-14 gap-8">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight leading-tight mb-4">
              Trusted by Teachers<br/>
              <span className="text-muted-foreground">across the nation.</span>
            </h2>
          </div>
          {/* Arrows */}
          <div className="flex gap-3 shrink-0">
            <button
              className="testimonial-swiper-prev w-12 h-12 rounded-full bg-white dark:bg-[#1E1F20] border border-border flex items-center justify-center cursor-pointer transition-all text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button
              className="testimonial-swiper-next w-12 h-12 rounded-full bg-white dark:bg-[#1E1F20] border border-border flex items-center justify-center cursor-pointer transition-all text-muted-foreground hover:text-foreground hover:bg-muted"
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
            bulletClass: 'inline-block w-2 h-2 bg-slate-300 dark:bg-slate-700 rounded-full cursor-pointer transition-all duration-300 mx-1',
            bulletActiveClass: '!bg-primary !w-6',
          }}
          breakpoints={{
            640: { slidesPerView: 1.8, spaceBetween: 24 },
            1024: { slidesPerView: 2.8, spaceBetween: 28 },
          }}
          className="w-full !overflow-visible"
        >
          {items.map((t, i) => {
            const THEMES = [
              { cardBg:"var(--soft-blue-bg)", border:"var(--soft-blue-border)", avatarBg:"#E8F0FE", color:"var(--soft-blue-text)" },
              { cardBg:"var(--soft-green-bg)", border:"var(--soft-green-border)", avatarBg:"#E6F4EA", color:"var(--soft-green-text)" },
              { cardBg:"var(--soft-yellow-bg)", border:"var(--soft-yellow-border)", avatarBg:"#FEF7E0", color:"var(--soft-yellow-text)" },
              { cardBg:"var(--soft-red-bg)", border:"var(--soft-red-border)", avatarBg:"#FCE8E6", color:"var(--soft-red-text)" },
              { cardBg:"var(--soft-neutral-bg)", border:"var(--soft-neutral-border)", avatarBg:"#F1F3F4", color:"var(--soft-neutral-text)" },
            ];
            const theme = THEMES[i % THEMES.length];
            const cardBg = t.cardBg || theme.cardBg;
            const cardBorder = theme.border;
            const avatarBg = t.avatarBg || theme.avatarBg;
            const avatarColor = t.avatarColor || theme.color;
            const starColor = t.starColor || "#FBBC04";
            const iconColor = t.iconColor || theme.color;
            const initials = t.initials || t.name?.slice(0,2).toUpperCase();
            return (
              <SwiperSlide key={t.id||i} className="h-auto">
                <div
                  style={{
                    background: cardBg,
                    borderRadius: 24,
                    border: `1px solid ${cardBorder}`,
                    padding: "32px",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "border-color 0.3s, box-shadow 0.3s, transform 0.3s",
                    cursor: "default",
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
                    <div style={{ width:52, height:52, borderRadius:"50%", background:avatarBg, display:"flex", alignItems:"center", justifyContent:"center", color:avatarColor, fontWeight:700, fontSize:15, flexShrink:0, overflow:"hidden", border:"2px solid white", boxShadow:"0 2px 8px rgba(0,0,0,0.08)" }}>
                      <img
                        src={t.photo_url || "/images/teachers/verified-teacher-avatar-placeholder.webp"}
                        alt={t.name}
                        loading="lazy"
                        style={{ width:"100%", height:"100%", objectFit:"cover" }}
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          if (target.src !== "/images/teachers/verified-teacher-avatar-placeholder.webp") {
                            target.src = "/images/teachers/verified-teacher-avatar-placeholder.webp";
                          }
                        }}
                      />
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
    "/images/awards/gsv-edtech-cup-award.avif",
    "/images/awards/stem-education-promise-award.avif",
    "/images/awards/national-edtech-excellence-award.avif",
    "/images/awards/science-learning-advocate-award.avif",
    "/images/awards/education-innovation-leader-award.avif",
    "/images/awards/experiential-learning-impact-award.avif",
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
              className="button_primary inline-flex items-center gap-2.5 px-7 py-3 bg-[#006FCC] hover:bg-[#005499] text-white font-bold text-sm rounded-[12px] transition-all shadow-[0_4px_14px_rgba(0,111,204,0.35)] active:scale-98"
            >
              <span>Learn More About CSEEL</span> <ArrowRight className="w-4 h-4" />
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
              className="p-8 rounded-2xl card-soft-blue shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 text-center"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(40px)",
                transition: "opacity 0.6s ease, transform 0.6s ease, box-shadow 0.3s, translateY 0.3s",
                transitionDelay: `${i * 120}ms`,
              }}
            >
              <div className="text-sm font-bold text-primary mb-2 uppercase tracking-wide">{c.tag}</div>
              <h3 className="text-lg font-bold text-foreground mb-3">{c.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Index;