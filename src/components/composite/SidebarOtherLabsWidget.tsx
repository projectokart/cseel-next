'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Sparkles } from 'lucide-react';

export interface SidebarLabItem {
  id: string;
  tag: string;
  title: string;
  shortDesc: string;
  image: string;
  url: string;
}

export const SIDEBAR_OTHER_LABS: SidebarLabItem[] = [
  {
    id: 'skill-lab-setup',
    tag: 'CBSE Circular Skill-75/2024 & 13/2026',
    title: 'Composite Skill Lab Setup (Classes VI to XII)',
    shortDesc: 'Mandatory vocational lab: Option A (600 sq ft) or Option B (two 400 sq ft) for AI & coding.',
    image: '/images/composite-lab-skill-integration.jpg',
    url: '/composite-skill-lab'
  },
  {
    id: 'atl-setup',
    tag: 'NITI Aayog / AIM Compliant',
    title: 'Atal Tinkering Lab (ATL) Setup for Schools',
    shortDesc: 'Packages P1 to P4 with 3D printers, electronics, IoT sensors & mentor training.',
    image: '/images/hero/school-science-exhibition-tinkering-lab.webp',
    url: '/steam-lab#atl'
  },
  {
    id: 'ai-lab-setup',
    tag: 'CBSE Skill Subject 417 & 843',
    title: 'Artificial Intelligence (AI) & Machine Learning Lab',
    shortDesc: 'Edge AI computer vision rigs, Google Coral modules & Python neural net simulators.',
    image: '/images/categories/engineering-robotics-and-technology-labs.webp',
    url: '/domain/engineering'
  },
  {
    id: 'drone-aerospace',
    tag: 'DGCA Micro-Aviation Framework',
    title: 'Aerospace & Drone Technology Lab for Schools',
    shortDesc: 'DIY multirotor quadcopters, RC flight simulators & aerodynamics wind tunnel kits.',
    image: '/images/categories/technology.jpg',
    url: '/domain/engineering'
  },
  {
    id: 'robotics-iot',
    tag: 'Industry 4.0 Robotics & Automation',
    title: 'Robotics & IoT Super-Lab Setup',
    shortDesc: 'Multi-axis robotic arms, autonomous rovers & World Robot Olympiad (WRO) arenas.',
    image: '/images/hero/stem-robotics-and-electronics-breadboard.webp',
    url: '/steam-lab'
  },
  {
    id: 'space-astronomy',
    tag: 'ISRO Space STEM Aligned',
    title: 'Astronomical & Space Science Observatory Lab',
    shortDesc: 'Motorized 8" GoTo tracking telescopes, solar filters & digital planetarium software.',
    image: '/images/hero/physics-optics.jpg',
    url: '/domain/science'
  },
  {
    id: 'design-makerspace',
    tag: 'NEP 2020 Hands-on Prototyping',
    title: 'Design Thinking & Innovation Lab (Makerspace)',
    shortDesc: 'Enclosed laser cutters, vinyl plotters & heavy-duty ergonomic maker workbenches.',
    image: '/images/categories/art-design-steam-creative-modules.webp',
    url: '/art'
  },
  {
    id: 'math-lab-setup',
    tag: 'CBSE Mandatory Experiential Math',
    title: 'Experiential & Vedic Mathematics Lab',
    shortDesc: 'Tactile geometry proof models, dynamic algebra tiles, clinometers & NCERT kits.',
    image: '/images/categories/mathematics.webp',
    url: '/domain/science'
  },
  {
    id: 'ar-vr-simulation',
    tag: 'Spatial 3D Computing',
    title: 'AR / VR Immersive Science Simulation Lab',
    shortDesc: 'Virtual human anatomy dissections, molecular docking & 100% hazard-free chemistry.',
    image: '/images/hero/interactive-science-simulation-interface.webp',
    url: '/simulations'
  }
];

export default function SidebarOtherLabsWidget() {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
      {/* Header */}
      <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
            School Infrastructure
          </span>
          <h4 className="font-bold text-sm text-slate-900" style={{ color: '#003c6e' }}>
            Explore Other Lab Solutions
          </h4>
        </div>
        <span className="w-6 h-6 rounded-lg bg-[#EDF5FA] text-[#005689] flex items-center justify-center text-xs">
          <Sparkles className="w-3.5 h-3.5" />
        </span>
      </div>

      {/* Lab Items List */}
      <div className="space-y-3.5 divide-y divide-slate-100">
        {SIDEBAR_OTHER_LABS.map((item, idx) => (
          <Link
            key={item.id}
            href={item.url}
            className={`group flex gap-3 items-start ${idx > 0 ? 'pt-3' : ''}`}
          >
            {/* Thumbnail Image */}
            <div className="w-16 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200 relative">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>

            {/* Content Column */}
            <div className="min-w-0 flex-1">
              {/* Subtle Muted Gray Tag so Heading Stands Out */}
              <span className="text-[10px] font-medium text-slate-500 block leading-tight truncate">
                {item.tag}
              </span>

              {/* SEO Heading */}
              <h5 className="font-bold text-xs text-slate-900 group-hover:text-[#005689] line-clamp-2 leading-snug transition-colors mt-0.5">
                {item.title}
              </h5>

              {/* Short Description */}
              <p className="text-[11px] text-slate-500 line-clamp-2 leading-tight mt-1">
                {item.shortDesc}
              </p>
            </div>

            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#005689] shrink-0 mt-1 transition-colors" />
          </Link>
        ))}
      </div>

      {/* Mini Footer Link */}
      <div className="pt-3 border-t border-slate-100 text-center">
        <Link
          href="/steam-lab"
          className="text-xs font-bold text-[#005689] hover:text-[#003c6e] inline-flex items-center gap-1 transition"
        >
          <span>View All 10+ School Lab Packages</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}
