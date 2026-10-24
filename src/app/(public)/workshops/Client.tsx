'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PageTransition from "@/components/shared/PageTransition";
import {
  FlaskConical, Cpu, Leaf, Calculator, Zap, Microscope,
  Sparkles, Star, CheckCircle2, ChevronDown, Check, Clock,
  Calendar, School, Users, ShieldCheck, Award, Layers
} from "lucide-react";
import { useBookDemoModal } from '@/contexts/BookDemoModalContext';

export default function WorkshopsClient() {
  const { openDemoModal } = useBookDemoModal();
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('All');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const workshopStats = [
    { value: '250+', label: 'School Bootcamps Conducted', sub: 'Across 20 Indian cities' },
    { value: '45,000+', label: 'Students Inspired', sub: 'Hands-on experiential discovery' },
    { value: '100%', label: 'All Apparatus & Kits Provided', sub: 'Zero logistical burden on school' },
    { value: '6 Disciplines', label: 'Physics, Chem, Bio, Robotics, AI & Math', sub: 'NEP 2020 experiential curriculum' },
  ];

  const workshops = [
    {
      icon: FlaskConical,
      title: "Chemistry in Action & Kinetics",
      subject: "Chemistry",
      age: "Classes 8 to 12",
      duration: "1 Day (6 Hours)",
      color: "bg-blue-50 text-[#005689] border-blue-200",
      desc: "Students run real chemical reactions: exothermic kinetics, iodine clock oscillation, titration drop rates, acid-base pH color gradients, and crystal synthesis.",
      takeaway: "Individual crystal growth kit + personal safety goggles"
    },
    {
      icon: Zap,
      title: "Physics Dynamics & Optics Lab",
      subject: "Physics",
      age: "Classes 8 to 12",
      duration: "1 Day (6 Hours)",
      color: "bg-amber-50 text-amber-700 border-amber-200",
      desc: "Hands-on exploration of laser ray optics, projectile trajectory measurement, electromagnetic induction coils, sound resonance tubes, and electrical circuit meters.",
      takeaway: "DIY optical spectrometer + acrylic lens assembly"
    },
    {
      icon: Microscope,
      title: "Biology Microscopy & Cellular DNA",
      subject: "Biology",
      age: "Classes 6 to 12",
      duration: "1 Day (6 Hours)",
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
      desc: "Every student operates a compound microscope: preparing live onion root mitosis slides, Rheo leaf plasmolysis mounts, and extracting visible DNA strands from fruit samples.",
      takeaway: "Set of 5 permanent prepared specimen slides"
    },
    {
      icon: Cpu,
      title: "Robotics, IoT & Autonomous Rovers",
      subject: "Robotics",
      age: "Classes 7 to 12",
      duration: "2 Days (12 Hours)",
      color: "bg-purple-50 text-purple-700 border-purple-200",
      desc: "Build and program a working autonomous robotics rover: Arduino C++ microcontrollers, ultrasonic distance radar, IR line follower sensors, and motor driver H-bridges.",
      takeaway: "Complete 4-wheel programmable robotics chassis kit"
    },
    {
      icon: Layers,
      title: "3D Printing, CAD & Tinkering Studio",
      subject: "Engineering",
      age: "Classes 6 to 12",
      duration: "1 Day (6 Hours)",
      color: "bg-cyan-50 text-cyan-700 border-cyan-200",
      desc: "Introduction to digital fabrication: CAD modeling in Tinkercad, G-code slicing, nozzle temperature calibration, and real-time physical 3D extrusion of custom prototypes.",
      takeaway: "Personal student 3D printed mechanical artifact"
    },
    {
      icon: Calculator,
      title: "Mathematics Visualized & 3D Geometry",
      subject: "Mathematics",
      age: "Classes 6 to 10",
      duration: "1 Day (6 Hours)",
      color: "bg-indigo-50 text-indigo-700 border-indigo-200",
      desc: "Transform dry textbook formulas into tactile intuition: 3D conic sections, Pythagorean mechanical proofs, coordinate visualizers, and probability simulation models.",
      takeaway: "Tactile geometric proof puzzle kit"
    },
  ];

  const filteredWorkshops = selectedDiscipline === 'All'
    ? workshops
    : workshops.filter((w) => w.subject.toLowerCase() === selectedDiscipline.toLowerCase());

  const workflowSteps = [
    {
      step: "01",
      title: "Date & Topic Selection",
      desc: "Choose from our 6 experiential disciplines and schedule dates that seamlessly fit your school's academic timetable."
    },
    {
      step: "02",
      title: "All Equipment Shipped",
      desc: "CSEEL delivers all required precision apparatus, chemical reagents, electronic kits, and safety gear to your campus."
    },
    {
      step: "03",
      title: "Master Demonstrator Arrival",
      desc: "Our senior STEM facilitators and lab demonstrators conduct dynamic, engaging sessions with 100% active student participation."
    },
    {
      step: "04",
      title: "Certificates & Take-Home Kits",
      desc: "Every participating student receives an accredited Certificate of Participation and personal take-home experiment kits."
    },
  ];

  const faqs = [
    {
      q: "What does the school need to provide for a CSEEL workshop?",
      a: "The school only needs to provide standard classroom or lab tables, normal electrical sockets, and enthusiastic students! CSEEL brings all specialized apparatus, reagents, microcontrollers, 3D printers, safety goggles, and student workbooks."
    },
    {
      q: "What is the recommended student batch size?",
      a: "To ensure maximum hands-on exposure where every single learner operates equipment independently, we recommend batches of 30 to 45 students per workshop hall, staffed with 2 CSEEL senior facilitators."
    },
    {
      q: "Are the experiments safe for school students?",
      a: "Absolutely. Safety is our foundational priority. All workshops adhere to strict CBSE SARAS lab safety SOPs. Students are provided with safety goggles, non-toxic micro-scale reagents, and low-voltage electronic circuits."
    },
    {
      q: "Can we customize the workshop curriculum to align with upcoming exams?",
      a: "Yes. We frequently customize workshop experiments to reinforce specific high-weightage topics from the CBSE or ICSE syllabus that students find conceptually challenging."
    }
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-white">

        {/* ─── HERO SECTION (Labster Style Split Hero) ─── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#001D38] via-[#003C6E] to-[#005689] text-white pt-12 pb-20 md:pt-16 md:pb-24">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              <div className="lg:col-span-7 space-y-6 text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-cyan-200">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                  <span>CAMPUS STEM BOOTCAMPS · 100% HANDS-ON LEARNING</span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-extrabold text-white tracking-tight leading-[1.15]" style={{ color: '#ffffff' }}>
                  Intensive Hands-On Science & Robotics <span className="text-cyan-300">School Workshops</span>
                </h1>

                <p className="text-base sm:text-lg text-slate-100/90 max-w-2xl leading-relaxed">
                  Turnkey 1-Day and 2-Day immersive STEM bootcamps that bring science alive through physical making, guided discovery, robotics challenges, and live experiments on your school campus.
                </p>

                <div className="flex flex-col sm:flex-row gap-3.5 pt-2">
                  <button
                    onClick={() => openDemoModal({
                      title: 'Bring a CSEEL Workshop to Your School',
                      subtitle: 'Choose your subject discipline and preferred dates. We bring all apparatus & kits.'
                    })}
                    className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-400 to-cyan-500 text-slate-950 hover:brightness-105 transition-all shadow-lg shadow-cyan-500/25 active:scale-[0.98] cursor-pointer"
                  >
                    <span>Book a School Workshop</span>
                  </button>

                  <Link
                    href="/events"
                    className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/25 backdrop-blur-sm transition-all active:scale-[0.98]"
                  >
                    <span>National Hackathons & Fairs</span>
                  </Link>

                  <Link
                    href="/materials"
                    className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/25 backdrop-blur-sm transition-all active:scale-[0.98]"
                  >
                    <span>Explore Lab Materials</span>
                  </Link>
                </div>

                <div className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-200/90 font-medium border-t border-white/15">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-300" />
                    <span>All Kits & Apparatus Provided</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-300" />
                    <span>Certified Lab Demonstrators</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-300" />
                    <span>Take-Home Student Kits</span>
                  </span>
                </div>
              </div>

              {/* Right Column: Workshop Highlight Card */}
              <div className="lg:col-span-5">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 text-left">
                  
                  <div className="flex items-center justify-between border-b border-white/15 pb-4">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-300 block">Turnkey School Delivery</span>
                      <h3 className="text-lg font-bold text-white mt-0.5" style={{ color: '#ffffff' }}>What CSEEL Brings to Campus</h3>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 text-[11px] font-bold">
                      All-Inclusive
                    </span>
                  </div>

                  <div className="space-y-3.5">
                    <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-cyan-400/20 text-cyan-300 flex items-center justify-center shrink-0">
                        <FlaskConical className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white" style={{ color: '#ffffff' }}>Individual Student Workstations</h4>
                        <p className="text-[11px] text-slate-200 mt-0.5">Every learner operates apparatus directly — no passive watching.</p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center shrink-0">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white" style={{ color: '#ffffff' }}>Senior STEM Facilitators</h4>
                        <p className="text-[11px] text-slate-200 mt-0.5">Trained university researchers guide every procedure safely.</p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-purple-400/20 text-purple-300 flex items-center justify-center shrink-0">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white" style={{ color: '#ffffff' }}>Certificates & Take-Home Kits</h4>
                        <p className="text-[11px] text-slate-200 mt-0.5">Physical STEM hardware projects that students keep forever.</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-cyan-200">School Inquiries</span>
                      <p className="text-xs font-bold text-white mt-0.5" style={{ color: '#ffffff' }}>Book Your School's STEM Day</p>
                    </div>
                    <button
                      onClick={() => openDemoModal({ title: 'Book School STEM Workshop' })}
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

        {/* ─── KEY WORKSHOP STATS ─── */}
        <section className="border-y border-slate-200 bg-slate-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              {workshopStats.map((s, idx) => (
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

        {/* ─── WORKSHOP CATALOG (Filtered Grid) ─── */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
              <span className="px-3 py-1 rounded-full bg-blue-50 text-[#005689] border border-blue-200/80 text-xs font-bold uppercase tracking-wider">
                Hands-On Curriculum
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight" style={{ color: '#003c6e' }}>
                Explore Our Workshop Catalog
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Choose from our subject-specific bootcamps designed for middle and high school students.
              </p>
            </div>

            {/* Discipline Filter Chips */}
            <div className="flex justify-center flex-wrap gap-2 mb-10">
              {['All', 'Chemistry', 'Physics', 'Biology', 'Robotics', 'Engineering', 'Mathematics'].map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDiscipline(d)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedDiscipline === d
                      ? 'bg-[#005689] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            {/* Workshop Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredWorkshops.map((w, i) => (
                <div
                  key={i}
                  className="bg-white rounded-3xl p-7 border border-slate-200 hover:border-[#005689]/40 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-11 h-11 rounded-2xl ${w.color} border flex items-center justify-center shrink-0`}>
                        <w.icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{w.duration}</span>
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#005689] transition-colors" style={{ color: '#003c6e' }}>
                        {w.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-bold text-[#005689]">{w.subject}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs text-slate-500 font-semibold">{w.age}</span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {w.desc}
                    </p>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-700">
                      <strong className="text-slate-900 block mb-0.5">Take-Home Student Kit:</strong>
                      {w.takeaway}
                    </div>
                  </div>

                  <div className="pt-5 mt-5 border-t border-slate-100">
                    <button
                      onClick={() => openDemoModal({
                        title: `Book ${w.title} Workshop`,
                        subtitle: `${w.subject} · ${w.duration} · For ${w.age}`
                      })}
                      className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-[#005689] hover:text-white text-slate-900 font-bold text-xs transition-all cursor-pointer shadow-2xs"
                    >
                      <span>Book for Your School</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ─── HOW A WORKSHOP OPERATES (Roadmap) ─── */}
        <section className="py-16 sm:py-20 bg-[#F8FAFC] border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
              <span className="text-xs font-bold text-[#005689] uppercase tracking-wider">Hassle-Free Organization</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900" style={{ color: '#003c6e' }}>
                How a School STEM Workshop Operates
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {workflowSteps.map((ws, idx) => (
                <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-2xl font-black text-blue-200 block">
                      {ws.step}
                    </span>
                    <h4 className="text-base font-bold text-slate-900" style={{ color: '#003c6e' }}>
                      {ws.title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {ws.desc}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-bold text-[#005689]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Zero School Overhead</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── WORKSHOP FAQ ─── */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 space-y-2">
              <span className="text-xs font-bold text-[#005689] uppercase tracking-wider">Organizer FAQs</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900" style={{ color: '#003c6e' }}>
                School Workshop Logistics
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
                  Bring Experiential Science to Your Campus
                </span>

                <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight" style={{ color: '#ffffff' }}>
                  Ready to Host a CSEEL STEM Day at Your School?
                </h2>

                <p className="text-xs sm:text-base text-slate-100/90 max-w-xl mx-auto leading-relaxed">
                  Join 250+ partner schools. Our team handles everything from apparatus shipment to certified facilitators and take-home student kits.
                </p>

                <div className="flex flex-col sm:flex-row gap-3.5 justify-center pt-2">
                  <button
                    onClick={() => openDemoModal({
                      title: 'Book a School STEM Workshop',
                      subtitle: 'Speak with our workshop coordinator to check available dates for your school.'
                    })}
                    className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-400 to-cyan-500 text-slate-950 hover:brightness-105 transition-all shadow-lg shadow-cyan-500/25 active:scale-[0.98] cursor-pointer"
                  >
                    <span>Request Workshop Dates</span>
                  </button>

                  <Link
                    href="/contact-us"
                    className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/25 backdrop-blur-sm transition-all active:scale-[0.98]"
                  >
                    <span>Speak with Coordinator</span>
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
