'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PageTransition from "@/components/shared/PageTransition";
import {
  Play, Image as ImageIcon, FileText, Download, Sparkles,
  MapPin, Calendar, ExternalLink, CheckCircle2, Eye, School,
  Video, Newspaper, Award
} from "lucide-react";
import { useBookDemoModal } from '@/contexts/BookDemoModalContext';

export default function MediaArchiveClient() {
  const { openDemoModal } = useBookDemoModal();
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Labs & Setups', 'ATL Workshops', 'Student Hackathons', 'Press & Awards'];

  const mediaItems = [
    {
      type: "video",
      category: "Labs & Setups",
      title: "Walkthrough: 600 Sq Ft CBSE Composite Science Lab",
      school: "Modern School Barakhamba, New Delhi",
      date: "Oct 2026",
      thumbnail: "https://img.freepik.com/premium-photo/physics-lab-background-with-pendulums-circuits_641503-120945.jpg",
      badge: "Video Tour",
      desc: "Inside look at the 8-sink plumbing layout, chemical fume ventilation, optical benches, and SARAS 49 apparatus cabinets."
    },
    {
      type: "photo",
      category: "Labs & Setups",
      title: "Chemistry Titration & Precision Reagents Station",
      school: "DAV Public School, Gurugram",
      date: "Sep 2026",
      thumbnail: "https://img.freepik.com/premium-photo/chemistryfilled-beakers-beakers-with-colorful-chemical-generative-ai_722401-1517.jpg",
      badge: "Lab Photo",
      desc: "Secondary school students performing standard oxalic acid vs KMnO4 titration with digital drop counter assistance."
    },
    {
      type: "photo",
      category: "ATL Workshops",
      title: "Atal Tinkering Lab 2.0: 3D Printing Extrusion in Action",
      school: "BVB Mehta Vidyalaya, New Delhi",
      date: "Aug 2026",
      thumbnail: "https://cdn.prod.website-files.com/63105b5082760e06eb992f00/66bf9f93d712be6d135ac575_Student-Remote-Room-Labster-reverse-edit.avif",
      badge: "ATL 2.0",
      desc: "Middle school students designing CAD prototypes in Tinkercad and extruding working structural gear assemblies."
    },
    {
      type: "video",
      category: "Student Hackathons",
      title: "National STEM Hackathon 2026: Working Prototype Demos",
      school: "CSEEL National Innovation Conclave",
      date: "Jul 2026",
      thumbnail: "https://cdn.prod.website-files.com/63105b5082760e06eb992f00/66be608d71d32863b2bf5487_Students-Desk-Classroom-Laptop-reverse.avif",
      badge: "Hackathon",
      desc: "Highlights from 60+ school teams presenting autonomous robotics rovers and AI smart irrigation sensors."
    },
    {
      type: "photo",
      category: "Labs & Setups",
      title: "Biology Microscopy & Cellular Staining Lab",
      school: "Heritage Valley International School, Pune",
      date: "Jun 2026",
      thumbnail: "https://png.pngtree.com/thumb_back/fw800/background/20241007/pngtree-biology-laboratory-nature-and-science-plants-with-biochemistry-structure-on-green-image_16319180.jpg",
      badge: "Biology",
      desc: "High-resolution microscope slide analysis of onion root tip mitosis and epidermal stomatal peels."
    },
    {
      type: "press",
      category: "Press & Awards",
      title: "CSEEL Recognized for Best Experiential STEM Infrastructure",
      school: "National Education Excellence Conclave 2025",
      date: "May 2026",
      thumbnail: "https://cdn.prod.website-files.com/63105b5082760e06eb992f00/66b6088ed6f732140b977d32_gsv.avif",
      badge: "Award",
      desc: "Honored for empowering 500+ Indian schools with zero-breakage composite science laboratories and teacher training."
    },
    {
      type: "photo",
      category: "ATL Workshops",
      title: "Hands-on Sensor Workbenches & Electronic Breadboarding",
      school: "St. Xavier's Senior Secondary, Jaipur",
      date: "Apr 2026",
      thumbnail: "https://cdn.prod.website-files.com/63105b5082760e06eb992f00/66c366924698e845aff6397c_Group-Laptop-Labster-edit-2.avif",
      badge: "Electronics",
      desc: "Class 9 students wiring ultrasonic distance sensors with Arduino microcontrollers for autonomous obstacle detection."
    },
    {
      type: "video",
      category: "Press & Awards",
      title: "Feature: How NEP 2020 Experiential Labs are Transforming Schools",
      school: "Education Today National Broadcast",
      date: "Mar 2026",
      thumbnail: "https://cdn.prod.website-files.com/63105b5082760e06eb992f00/66bf944f3df098f183b92727_Lab-Scientists-Beakers-edit.avif",
      badge: "Press",
      desc: "Television documentary exploring CSEEL's turnkey composite lab installations in tier-1 and tier-2 Indian cities."
    },
  ];

  const filteredMedia = activeCategory === 'All'
    ? mediaItems
    : mediaItems.filter((m) => m.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <PageTransition>
      <div className="min-h-screen bg-white">

        {/* ─── HERO SECTION (Labster Split Hero) ─── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#001D38] via-[#003C6E] to-[#005689] text-white pt-12 pb-20 md:pt-16 md:pb-24">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              <div className="lg:col-span-7 space-y-6 text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-cyan-200">
                  <ImageIcon className="w-3.5 h-3.5 text-cyan-300" />
                  <span>VISUAL ARCHIVE · LAB INSTALLATIONS ACROSS INDIA</span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-extrabold text-white tracking-tight leading-[1.15]" style={{ color: '#ffffff' }}>
                  Explore Experiential Labs & STEM <span className="text-cyan-300">Installations</span>
                </h1>

                <p className="text-base sm:text-lg text-slate-100/90 max-w-2xl leading-relaxed">
                  High-definition photography, video walkthroughs inside real school composite laboratories, student prototyping bootcamps, and national press coverage of the CSEEL journey.
                </p>

                <div className="flex flex-col sm:flex-row gap-3.5 pt-2">
                  <Link
                    href="/virtual-lab-tour"
                    className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-400 to-cyan-500 text-slate-950 hover:brightness-105 transition-all shadow-lg shadow-cyan-500/25 active:scale-[0.98]"
                  >
                    <span>Launch 360° Virtual Lab Tour</span>
                  </Link>

                  <button
                    onClick={() => openDemoModal({
                      title: 'Download Press & Media Kit',
                      subtitle: 'Access high-resolution CSEEL brand assets, founder profiles, and institutional fact sheets.'
                    })}
                    className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/25 backdrop-blur-sm transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <span>Download Media Kit</span>
                  </button>

                  <Link
                    href="/schools"
                    className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/25 backdrop-blur-sm transition-all active:scale-[0.98]"
                  >
                    <span>500+ Partner Schools</span>
                  </Link>
                </div>

                <div className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-200/90 font-medium border-t border-white/15">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-300" />
                    <span>Real Campus Installations</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-300" />
                    <span>4K Video Walkthroughs</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-300" />
                    <span>Press Accreditation</span>
                  </span>
                </div>
              </div>

              {/* Right Column: Featured Tour Card */}
              <div className="lg:col-span-5">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 text-left">
                  
                  <div className="flex items-center justify-between border-b border-white/15 pb-4">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-300 block">Featured Installation</span>
                      <h3 className="text-lg font-bold text-white mt-0.5" style={{ color: '#ffffff' }}>CBSE Composite Science Lab</h3>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 text-[11px] font-bold">
                      Verified
                    </span>
                  </div>

                  <div className="rounded-2xl overflow-hidden relative aspect-video bg-black/40">
                    <img
                      src="https://img.freepik.com/premium-photo/physics-lab-background-with-pendulums-circuits_641503-120945.jpg"
                      alt="Featured Lab"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-white/90 text-[#005689] flex items-center justify-center shadow-xl">
                        <Play className="w-6 h-6 ml-0.5 fill-current" />
                      </div>
                    </div>
                    <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-black/70 text-white text-[11px] font-bold">
                      360° Interactive View
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-cyan-200">Interactive Walkthrough</span>
                      <p className="text-xs font-bold text-white mt-0.5" style={{ color: '#ffffff' }}>Explore Real Apparatus in 3D</p>
                    </div>
                    <Link
                      href="/virtual-lab-tour"
                      className="px-3.5 py-1.5 rounded-lg bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition-all cursor-pointer shadow-xs"
                    >
                      <span>Launch Tour</span>
                    </Link>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ─── MEDIA FILTER TABS ─── */}
        <section className="py-12 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-[#005689] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ─── MEDIA GRID (Labster Style Cards) ─── */}
        <section className="py-16 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredMedia.map((m, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="h-52 overflow-hidden relative bg-slate-900">
                      <img
                        src={m.thumbnail}
                        alt={m.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95"
                      />
                      <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-black/60 text-white backdrop-blur-md border border-white/20">
                        {m.badge}
                      </span>
                      {m.type === 'video' && (
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-white/90 text-[#005689] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Play className="w-5 h-5 ml-0.5 fill-current" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-6 space-y-3">
                      <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                        <span className="flex items-center gap-1 text-[#005689]">
                          <School className="w-3.5 h-3.5" />
                          <span>{m.school}</span>
                        </span>
                        <span>•</span>
                        <span>{m.date}</span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 group-hover:text-[#005689] transition-colors line-clamp-2" style={{ color: '#003c6e' }}>
                        {m.title}
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {m.desc}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#005689]">
                      {m.category}
                    </span>
                    <button
                      onClick={() => openDemoModal({
                        title: `View Media Asset: ${m.title}`,
                        subtitle: `${m.school} · High-resolution media archive.`
                      })}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-[#005689] hover:text-white text-slate-800 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                    >
                      <span>Inspect Asset</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ─── FINAL MEDIA CTA ─── */}
        <section className="py-16 bg-white border-t border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-gradient-to-r from-[#002244] via-[#003c6e] to-[#005689] text-white p-8 sm:p-12 text-center relative overflow-hidden shadow-xl">
              <div className="max-w-3xl mx-auto space-y-5 relative z-10">
                <span className="px-3.5 py-1.5 rounded-full bg-white/10 text-cyan-200 border border-white/20 text-xs font-bold uppercase tracking-wider inline-block">
                  Press & Media Relations
                </span>

                <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight" style={{ color: '#ffffff' }}>
                  Looking for High-Resolution Assets & Media Inquiries?
                </h2>

                <p className="text-xs sm:text-base text-slate-100/90 max-w-xl mx-auto leading-relaxed">
                  Download our official media press kit containing vector brand logos, high-resolution photography, case studies, and executive commentary.
                </p>

                <div className="flex flex-col sm:flex-row gap-3.5 justify-center pt-2">
                  <button
                    onClick={() => openDemoModal({
                      title: 'Download Press & Media Kit',
                      subtitle: 'We will dispatch high-res imagery and press assets to your email.'
                    })}
                    className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-400 to-cyan-500 text-slate-950 hover:brightness-105 transition-all shadow-lg shadow-cyan-500/25 active:scale-[0.98] cursor-pointer"
                  >
                    <span>Download Press Kit</span>
                  </button>

                  <Link
                    href="/contact-us"
                    className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/25 backdrop-blur-sm transition-all active:scale-[0.98]"
                  >
                    <span>Contact Media Desk</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </PageTransition>
  );
}
