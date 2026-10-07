'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { 
  Cpu, 
  Bot, 
  FlaskConical, 
  Telescope, 
  Plane, 
  Cog, 
  Palette, 
  Glasses, 
  Calculator, 
  Mic, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight,
  Building2,
  PhoneCall,
  ShieldCheck,
  Zap
} from 'lucide-react';

export interface CompactLabSolution {
  id: string;
  category: 'innovation' | 'tech' | 'science' | 'steam';
  badge: string;
  badgeBg: string;
  title: string;
  shortDesc: string;
  image: string;
  space: string;
  grades: string;
  features: string[];
  linkUrl: string;
}

export const COMPACT_LAB_SOLUTIONS: CompactLabSolution[] = [
  {
    id: 'atl-lab',
    category: 'innovation',
    badge: 'NITI Aayog (P1–P4)',
    badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
    title: 'Atal Tinkering Lab (ATL)',
    shortDesc: 'Turnkey setup for NITI Aayog AIM packages with 3D printers, electronics, and rapid prototyping.',
    image: '/images/hero/school-science-exhibition-tinkering-lab.webp',
    space: '1,000–1,500 sq ft',
    grades: 'Class 6th–12th',
    features: [
      'Packages P1 to P4 complete hardware & 3D printers',
      'Arduino, sensors, mechanical tools & mentor training'
    ],
    linkUrl: '/steam-lab#atl'
  },
  {
    id: 'ai-lab',
    category: 'tech',
    badge: 'CBSE Skill 417 & 843',
    badgeBg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    title: 'Artificial Intelligence & ML Lab',
    shortDesc: 'Future skills lab with computer vision rigs, edge AI accelerators, and Python neural network tools.',
    image: '/images/categories/engineering-robotics-and-technology-labs.webp',
    space: '600–800 sq ft',
    grades: 'Class 8th–12th',
    features: [
      'Edge AI vision cameras & Coral accelerators',
      'Python SDK, OpenCV & hands-on student projects'
    ],
    linkUrl: '/domain/engineering'
  },
  {
    id: 'composite-skill-lab',
    category: 'tech',
    badge: 'Circular Skill-75/2024',
    badgeBg: 'bg-purple-50 text-purple-800 border-purple-200',
    title: 'Composite Skill Lab',
    shortDesc: 'Mandatory vocational lab for Classes 6–12 with AI, coding, robotics, and 33 CBSE skill subjects.',
    image: '/images/composite-lab-skill-integration.jpg',
    space: '600 sq ft (Opt A) / 400x2 (Opt B)',
    grades: 'Class 6th–12th',
    features: [
      'Option A (600 sq ft) or Option B (2x 400 sq ft)',
      '33 vocational modules including AI Code 417 & 843'
    ],
    linkUrl: '/composite-skill-lab'
  },
  {
    id: 'advance-composite',
    category: 'science',
    badge: 'Senior Secondary (11–12)',
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    title: 'Advance Composite Science Lab',
    shortDesc: 'High-end interdisciplinary research lab with analytical spectrophotometers and research microscopes.',
    image: '/images/features/hands-on-science-laboratory-beakers.avif',
    space: '800–1,200 sq ft',
    grades: 'Class 11th–12th',
    features: [
      'Digital spectrophotometer, research microscopes & centrifuge',
      'Fume exhaust hood & Class 11-12 research stations'
    ],
    linkUrl: '/composite-lab'
  },
  {
    id: 'astronomy-lab',
    category: 'science',
    badge: 'ISRO Space Aligned',
    badgeBg: 'bg-sky-50 text-sky-800 border-sky-200',
    title: 'Astronomical & Space Lab',
    shortDesc: 'Interactive celestial observatory with motorized GoTo telescopes, solar filters, and planetarium software.',
    image: '/images/hero/physics-optics.jpg',
    space: '500 sq ft + Terrace',
    grades: 'Class 4th–12th',
    features: [
      'Motorized 8" Schmidt-Cassegrain tracking telescope',
      'H-alpha solar filter, digital planetarium & astrophotography'
    ],
    linkUrl: '/domain/science'
  },
  {
    id: 'aerospace-drone-lab',
    category: 'tech',
    badge: 'DGCA Micro-Aviation',
    badgeBg: 'bg-cyan-50 text-cyan-800 border-cyan-200',
    title: 'Aerospace & Drone Lab',
    shortDesc: 'Aeronautical wind tunnel simulators, modular quadcopter kits, flight simulators, and safety net cage.',
    image: '/images/categories/technology.jpg',
    space: '600–1,000 sq ft',
    grades: 'Class 6th–12th',
    features: [
      'Modular DIY multirotor drone kits & flight simulators',
      'Wind tunnel lift/drag test kits & flight safety netting'
    ],
    linkUrl: '/domain/engineering'
  },
  {
    id: 'robotics-iot-lab',
    category: 'tech',
    badge: 'Industry 4.0 Robotics',
    badgeBg: 'bg-blue-50 text-blue-800 border-blue-200',
    title: 'Robotics & IoT Super-Lab',
    shortDesc: 'Industrial kinematics, multi-sensor autonomous rovers, smart IoT cloud, and WRO competition tracks.',
    image: '/images/hero/stem-robotics-and-electronics-breadboard.webp',
    space: '700–1,000 sq ft',
    grades: 'Class 5th–12th',
    features: [
      '4-DOF/6-DOF robotic arms & autonomous rovers',
      'ESP32 wireless mesh & World Robot Olympiad mats'
    ],
    linkUrl: '/steam-lab'
  },
  {
    id: 'design-thinking-lab',
    category: 'steam',
    badge: 'NEP 2020 Makerspace',
    badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
    title: 'Design Thinking & Innovation Lab',
    shortDesc: 'Human-centric design studio with enclosed laser cutters, vinyl plotters, and woodworking workbenches.',
    image: '/images/categories/art-design-steam-creative-modules.webp',
    space: '800–1,200 sq ft',
    grades: 'Class 4th–12th',
    features: [
      'Enclosed laser cutter/engraver & vinyl plotter',
      'Heavy-duty ergonomic maker workbenches & tool kits'
    ],
    linkUrl: '/art'
  },
  {
    id: 'ar-vr-lab',
    category: 'tech',
    badge: 'Spatial Computing',
    badgeBg: 'bg-purple-50 text-purple-800 border-purple-200',
    title: 'AR / VR Immersive Science Lab',
    shortDesc: 'Virtual reality suites for 3D molecular biology, virtual dissections, and risk-free hazardous chemistry.',
    image: '/images/hero/interactive-science-simulation-interface.webp',
    space: '500–700 sq ft',
    grades: 'Class 6th–12th',
    features: [
      'Standalone 6-DoF VR headsets with teacher dashboard',
      'Virtual anatomy & chemistry simulations with zero hazard'
    ],
    linkUrl: '/simulations'
  },
  {
    id: 'math-lab',
    category: 'science',
    badge: 'CBSE Math Lab Norm',
    badgeBg: 'bg-teal-50 text-teal-800 border-teal-200',
    title: 'Vedic & Experiential Math Lab',
    shortDesc: 'Eliminates math phobia through tactile geometric proof solids, algebra tiles, clinometers, and abacus.',
    image: '/images/categories/mathematics.webp',
    space: '400–600 sq ft',
    grades: 'Class 1st–10th',
    features: [
      'Tactile pythagoras models, algebra tiles & clinometers',
      'Vedic arithmetic abacus & chapter-wise NCERT kits'
    ],
    linkUrl: '/domain/science'
  },
  {
    id: 'language-lab',
    category: 'steam',
    badge: 'Digital Phonetics',
    badgeBg: 'bg-orange-50 text-orange-800 border-orange-200',
    title: 'Language & Phonetics Lab',
    shortDesc: 'Interactive acoustic booths with AI-powered pronunciation waveforms, debate recording, and fluency trainers.',
    image: '/images/features/students-collaborative-laptop-learning.avif',
    space: '600–900 sq ft',
    grades: 'Class 1st–12th',
    features: [
      'Student audio terminals with master teacher console',
      'Real-time voice waveform matching for neutral accent'
    ],
    linkUrl: '/domain/art'
  }
];

export default function OtherLabSolutions() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const scrollToInquiry = (labTitle: string) => {
    const el = document.getElementById('inquiry-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      const input = el.querySelector('input');
      if (input) input.focus();
    }
  };

  return (
    <section className="mt-14 pt-10 border-t border-slate-200">
      {/* ── Section Header with Left/Right Scroll Controls ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDF5FA] border border-[#005689]/20 text-[#005689] text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Turnkey School Infrastructure</span>
          </div>

          <h2 
            className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-slate-900"
            style={{ color: '#003c6e' }}
          >
            Explore Other School Lab Solutions
          </h2>

          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Beyond Composite Science Labs, CSEEL designs and equips turnkey NEP 2020 and NITI Aayog aligned innovation labs across India.
          </p>
        </div>

        {/* Scroll Arrows */}
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-end">
          <button
            onClick={() => scroll('left')}
            aria-label="Scroll left"
            className="w-9 h-9 rounded-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 flex items-center justify-center transition shadow-xs hover:border-[#005689] active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            aria-label="Scroll right"
            className="w-9 h-9 rounded-full bg-[#005689] hover:bg-[#003c6e] text-white flex items-center justify-center transition shadow-xs active:scale-95"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Horizontal Scrollable Row (Single Row) ── */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory scrollbar-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {COMPACT_LAB_SOLUTIONS.map((lab) => (
          <div
            key={lab.id}
            className="w-[275px] sm:w-[295px] shrink-0 snap-start bg-white rounded-2xl border border-slate-200 hover:border-[#005689]/40 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group"
          >
            {/* Lab Image Banner */}
            <div className="relative h-36 w-full overflow-hidden bg-slate-100">
              <img
                src={lab.image}
                alt={lab.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              
              {/* Badge on Image */}
              <span className={`absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold border backdrop-blur-xs shadow-xs ${lab.badgeBg}`}>
                {lab.badge}
              </span>
            </div>

            {/* Content Body */}
            <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
              <div>
                <h3 
                  className="font-bold text-sm text-slate-900 group-hover:text-[#005689] transition-colors leading-snug"
                  style={{ color: '#003c6e' }}
                >
                  {lab.title}
                </h3>
                <p className="text-[12px] text-slate-500 mt-1 leading-relaxed line-clamp-2">
                  {lab.shortDesc}
                </p>
              </div>

              {/* Space & Grade Specs */}
              <div className="flex items-center justify-between text-[11px] bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100 text-slate-600">
                <span><strong>Space:</strong> {lab.space}</span>
                <span><strong>For:</strong> {lab.grades}</span>
              </div>

              {/* Bullet Highlights */}
              <ul className="space-y-1 text-[11px] text-slate-600 pt-1">
                {lab.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="leading-tight">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Card Action Row */}
            <div className="px-4 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => scrollToInquiry(lab.title)}
                className="text-[11px] font-semibold text-[#005689] hover:text-[#003c6e] transition"
              >
                Request BoQ
              </button>

              <Link
                href={lab.linkUrl}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 hover:text-[#005689] transition"
              >
                <span>Details</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* ── Multi-Lab Institutional Callout Banner (Clean Normal Case) ── */}
      <div className="mt-8 rounded-2xl bg-gradient-to-r from-[#002b4d] via-[#003c6e] to-[#005689] text-white p-5 sm:p-7 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/10 text-cyan-200 text-xs font-medium">
              <Building2 className="w-3.5 h-3.5" />
              <span>School Campus Modernization</span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-white">
              Planning Multiple Labs for CBSE Affiliation or PM SHRI Grant?
            </h3>

            <p className="text-xs text-blue-100 leading-relaxed">
              CSEEL offers integrated turnkey packages for Composite Labs, Atal Tinkering Labs (ATL), AI &amp; Robotics Suites under a single audit-ready warranty with 3D CAD plans.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-1 text-xs text-blue-200">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>GeM &amp; State Tender Compliant</span>
              </span>
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Turnkey Deployment</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => scrollToInquiry('Multi-Lab Campus Bundle')}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs text-center transition shadow-sm"
            >
              Get Campus Proposal
            </button>

            <a
              href="tel:+919876543210"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium text-xs text-center flex items-center justify-center gap-1.5 transition"
            >
              <PhoneCall className="w-3.5 h-3.5 text-cyan-300" />
              <span>Call Lab Architect</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
