'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PageTransition from "@/components/shared/PageTransition";
import {
  Sparkles, MapPin, Calendar, Clock, Users, School,
  CheckCircle2, Compass, FlaskConical, Zap, Microscope,
  ChevronDown, Check, Award, Eye
} from "lucide-react";
import { useBookDemoModal } from '@/contexts/BookDemoModalContext';

export default function ExhibitionsClient() {
  const { openDemoModal } = useBookDemoModal();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const exhibitionStats = [
    { value: '25,000+', label: 'Annual School Visitors', sub: 'Students, educators & parents' },
    { value: '50+', label: 'Working Interactive Exhibits', sub: 'Hands-on manipulation allowed' },
    { value: '3 Pavilions', label: 'Physics, Chemistry & Biology', sub: 'Curriculum-mapped displays' },
    { value: '100%', label: 'Guided Tour by Scientists', sub: 'Senior lab demonstrator support' },
  ];

  const pavilions = [
    {
      title: "Wonders of Chemistry & Material Sciences",
      subject: "Chemistry Pavilion",
      color: "bg-blue-50 text-[#005689] border-blue-200",
      location: "Hall A · Experiential Center",
      open: "Mon–Sat · 9:30 AM to 4:30 PM",
      img: "https://img.freepik.com/premium-photo/chemistryfilled-beakers-beakers-with-colorful-chemical-generative-ai_722401-1517.jpg",
      desc: "An interactive walkthrough of chemical transformations. Students observe dynamic color-changing oscillating reactions, touch giant 3D crystallographic lattice models, test natural pH indicators, and discover smart polymer synthesis.",
      highlights: [
        "Giant 3D tactile periodic table with authentic element samples",
        "Luminescence & photochemistry dark room",
        "Live titration & chemical clock oscillation booth"
      ]
    },
    {
      title: "Forces, Dynamics & Optical Ray Labs",
      subject: "Physics Pavilion",
      color: "bg-amber-50 text-amber-700 border-amber-200",
      location: "Hall B · Experiential Center",
      open: "Mon–Sat · 9:30 AM to 4:30 PM",
      img: "https://img.freepik.com/premium-photo/physics-lab-background-with-pendulums-circuits_641503-120945.jpg",
      desc: "Feel the laws of nature firsthand. Experience rotational inertia with spinning gyroscopes, observe laser ray refraction through precision prism benches, generate 200,000V static charge on a Van de Graaff generator, and explore sound resonance.",
      highlights: [
        "Van de Graaff electrostatic generator & hair-raising demo",
        "Optical ray bench with multi-beam diffraction gratings",
        "Coupled resonance pendulums & Chladni plate acoustics"
      ]
    },
    {
      title: "Cellular Biology, Genetics & Microscopy",
      subject: "Biology Pavilion",
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
      location: "Hall C · Experiential Center",
      open: "Mon–Sat · 9:30 AM to 4:30 PM",
      img: "https://png.pngtree.com/thumb_back/fw800/background/20241007/pngtree-biology-laboratory-nature-and-science-plants-with-biochemistry-structure-on-green-image_16319180.jpg",
      desc: "Journey from sub-cellular organelles to living ecosystems. Students view living pond microorganisms under high-powered research microscopes, assemble giant double-helix DNA models, and explore plant stomatal mechanics.",
      highlights: [
        "Digital camera microscope connected to widescreen projector",
        "6-Foot mechanical double-helix DNA replication model",
        "Living ecosystem terrarium & photosynthesis chamber"
      ]
    },
  ];

  const fieldTripSteps = [
    {
      num: "01",
      title: "Reserve Date & Student Count",
      desc: "School coordinators select preferred dates and estimate student batch sizes (minimum 30 students per school booking)."
    },
    {
      num: "02",
      title: "Customized Grade Routing",
      desc: "Our team tailors the exhibition walkthrough path according to whether your students are in Middle (6-8), Secondary (9-10), or Senior (11-12)."
    },
    {
      num: "03",
      title: "Guided Interactive Tour",
      desc: "Certified science educators guide your students through each exhibit, running dynamic demonstrations with active participation."
    },
    {
      num: "04",
      title: "Hands-On Take-Home Lab Quiz",
      desc: "Every student receives a field-trip activity journal and certificate of participation to reinforce key takeaways back in the classroom."
    },
  ];

  const faqs = [
    {
      q: "Can schools book private, exclusive group walkthroughs?",
      a: "Yes! Schools with 50 or more students can reserve exclusive time slots so the entire exhibition hall is dedicated to their students, ensuring uninterrupted access to every single exhibit."
    },
    {
      q: "Is there an option for a mobile exhibition at our school campus?",
      a: "Yes! Through our 'Science on Wheels' mobile initiative, we can bring a curated selection of 20+ working interactive exhibits directly to your school auditorium or sports hall for an annual science festival."
    },
    {
      q: "What is the typical duration of a school exhibition visit?",
      a: "A standard guided school visit lasts between 2.5 to 3.5 hours, which includes walkthroughs across all three pavilions, a live 30-minute spectacular demonstration show, and a hands-on Q&A challenge."
    }
  ];

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
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                  <span>PERMANENT SCIENCE EXHIBITIONS · INTERACTIVE PAVILIONS</span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-extrabold text-white tracking-tight leading-[1.15]" style={{ color: '#ffffff' }}>
                  Inspiring Wonder Through Hands-On <span className="text-cyan-300">Science Exhibitions</span>
                </h1>

                <p className="text-base sm:text-lg text-slate-100/90 max-w-2xl leading-relaxed">
                  Permanent science galleries, mobile experiential labs, and guided interactive pavilions that bring textbook concepts into tangible reality for students, educators, and science enthusiasts across India.
                </p>

                <div className="flex flex-col sm:flex-row gap-3.5 pt-2">
                  <button
                    onClick={() => openDemoModal({
                      title: 'Book a School Exhibition Visit',
                      subtitle: 'Reserve exclusive time slots for your student batch across Physics, Chemistry, and Biology pavilions.'
                    })}
                    className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-400 to-cyan-500 text-slate-950 hover:brightness-105 transition-all shadow-lg shadow-cyan-500/25 active:scale-[0.98] cursor-pointer"
                  >
                    <span>Book School Field Trip</span>
                  </button>

                  <Link
                    href="/events"
                    className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/25 backdrop-blur-sm transition-all active:scale-[0.98]"
                  >
                    <span>Upcoming Hackathons & Fairs</span>
                  </Link>

                  <Link
                    href="/contact-us"
                    className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/25 backdrop-blur-sm transition-all active:scale-[0.98]"
                  >
                    <span>Request Mobile Exhibition</span>
                  </Link>
                </div>

                <div className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-200/90 font-medium border-t border-white/15">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-300" />
                    <span>50+ Working Exhibits</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-300" />
                    <span>Guided Scientific Demonstrations</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-300" />
                    <span>Free Field Trip Workbooks</span>
                  </span>
                </div>
              </div>

              {/* Right Column: Exhibition Ticket Overview Card */}
              <div className="lg:col-span-5">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 text-left">
                  
                  <div className="flex items-center justify-between border-b border-white/15 pb-4">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-300 block">Exhibition Hub</span>
                      <h3 className="text-lg font-bold text-white mt-0.5" style={{ color: '#ffffff' }}>Visitor Experience Pass</h3>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 text-[11px] font-bold">
                      Open 6 Days
                    </span>
                  </div>

                  <div className="space-y-3.5">
                    <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-cyan-400/20 text-cyan-300 flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white" style={{ color: '#ffffff' }}>Central Innovation Center</h4>
                        <p className="text-[11px] text-slate-200 mt-0.5">3 Large Experiential Pavilions equipped with interactive demonstration stages.</p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center shrink-0">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white" style={{ color: '#ffffff' }}>Flexible Batch Scheduling</h4>
                        <p className="text-[11px] text-slate-200 mt-0.5">Morning & Afternoon slots available for school bus field trips.</p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-purple-400/20 text-purple-300 flex items-center justify-center shrink-0">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white" style={{ color: '#ffffff' }}>Student Science Quiz & Badges</h4>
                        <p className="text-[11px] text-slate-200 mt-0.5">Interactive digital challenge at the end of every pavilion tour.</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-cyan-200">School Inquiries</span>
                      <p className="text-xs font-bold text-white mt-0.5" style={{ color: '#ffffff' }}>Group Pass & Transport Assistance</p>
                    </div>
                    <button
                      onClick={() => openDemoModal({ title: 'Book School Exhibition Trip' })}
                      className="px-3.5 py-1.5 rounded-lg bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition-all cursor-pointer shadow-xs"
                    >
                      <span>Inquire Now</span>
                    </button>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ─── EXHIBITION STATS BAR ─── */}
        <section className="border-y border-slate-200 bg-slate-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              {exhibitionStats.map((s, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="text-3xl sm:text-4xl font-extrabold text-[#005689]" style={{ color: '#003c6e' }}>
                    {s.value}
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900">
                    {s.label}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {s.sub}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── 3 SIGNATURE PAVILIONS (Cards) ─── */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
              <span className="px-3 py-1 rounded-full bg-blue-50 text-[#005689] border border-blue-200/80 text-xs font-bold uppercase tracking-wider">
                Permanent Science Galleries
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight" style={{ color: '#003c6e' }}>
                Three Immersive Scientific Pavilions
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Step inside interactive galleries where students are encouraged to touch, manipulate, observe, and question.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {pavilions.map((p, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="h-52 overflow-hidden relative">
                      <img src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${p.color}`}>
                        {p.subject}
                      </span>
                    </div>

                    <div className="p-7 space-y-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#005689] transition-colors" style={{ color: '#003c6e' }}>
                          {p.title}
                        </h3>
                        <div className="flex flex-col gap-1 mt-2 text-xs text-slate-500">
                          <span className="flex items-center gap-1.5 font-medium">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {p.location}
                          </span>
                          <span className="flex items-center gap-1.5 font-medium">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {p.open}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {p.desc}
                      </p>

                      <div className="pt-3 border-t border-slate-100 space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Featured Exhibits</h4>
                        {p.highlights.map((h, hIdx) => (
                          <div key={hIdx} className="flex items-start gap-2 text-xs text-slate-700">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-7 pt-0">
                    <button
                      onClick={() => openDemoModal({
                        title: `Book Walkthrough: ${p.title}`,
                        subtitle: `${p.location} · Group reservation for school field trips.`
                      })}
                      className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-[#005689] hover:text-white text-slate-900 font-bold text-xs transition-all cursor-pointer shadow-2xs"
                    >
                      <span>Reserve for School Group</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ─── FIELD TRIP ORGANIZER ROADMAP (4 Steps) ─── */}
        <section className="py-16 sm:py-20 bg-[#F8FAFC] border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
              <span className="text-xs font-bold text-[#005689] uppercase tracking-wider">Smooth Field Trip Coordination</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900" style={{ color: '#003c6e' }}>
                How to Plan a School Exhibition Visit
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {fieldTripSteps.map((st, idx) => (
                <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-2xl font-black text-blue-200 block">
                      {st.num}
                    </span>
                    <h4 className="text-base font-bold text-slate-900" style={{ color: '#003c6e' }}>
                      {st.title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {st.desc}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-bold text-[#005689]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Coordinated Step</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── EXHIBITIONS FAQ ─── */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 space-y-2">
              <span className="text-xs font-bold text-[#005689] uppercase tracking-wider">Visitor Guidance</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900" style={{ color: '#003c6e' }}>
                Exhibition Field Trip FAQs
              </h2>
            </div>

            <div className="space-y-3.5">
              {faqs.map((f, i) => (
                <div key={i} className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full p-5 text-left font-bold text-sm text-slate-900 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <span style={{ color: '#003c6e' }}>{f.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 shrink-0 ${openFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaq === i && (
                    <div className="p-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                      {f.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FINAL CTA ─── */}
        <section className="py-16 bg-[#F8FAFC]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-gradient-to-r from-[#002244] via-[#003c6e] to-[#005689] text-white p-8 sm:p-12 text-center relative overflow-hidden shadow-xl">
              <div className="max-w-3xl mx-auto space-y-5 relative z-10">
                <span className="px-3.5 py-1.5 rounded-full bg-white/10 text-cyan-200 border border-white/20 text-xs font-bold uppercase tracking-wider inline-block">
                  Experiential School Visits
                </span>

                <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight" style={{ color: '#ffffff' }}>
                  Give Your Students an Unforgettable Day of Scientific Wonder
                </h2>

                <p className="text-xs sm:text-base text-slate-100/90 max-w-xl mx-auto leading-relaxed">
                  Join 25,000+ students visiting CSEEL permanent exhibitions every year. Book a guided school field trip or request our traveling Science on Wheels pavilion.
                </p>

                <div className="flex flex-col sm:flex-row gap-3.5 justify-center pt-2">
                  <button
                    onClick={() => openDemoModal({
                      title: 'Book a School Exhibition Field Trip',
                      subtitle: 'Our coordinator will confirm available time slots and transport support.'
                    })}
                    className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-400 to-cyan-500 text-slate-950 hover:brightness-105 transition-all shadow-lg shadow-cyan-500/25 active:scale-[0.98] cursor-pointer"
                  >
                    <span>Book School Field Trip</span>
                  </button>

                  <Link
                    href="/contact-us"
                    className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/25 backdrop-blur-sm transition-all active:scale-[0.98]"
                  >
                    <span>Request Traveling Exhibit</span>
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
