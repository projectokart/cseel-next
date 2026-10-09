'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PageTransition from "@/components/shared/PageTransition";
import { 
  FlaskConical, 
  Sparkles, 
  BarChart3, 
  ArrowRight, 
  CheckCircle2, 
  X,
  Target,
  Eye,
  Award,
  BookOpen,
  QrCode,
  Layers,
  Cpu,
  Atom,
  GraduationCap
} from "lucide-react";

export default function AboutClient() {
  const [showBrochureModal, setShowBrochureModal] = useState(false);
  const [brochureSubmitted, setBrochureSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', school: '' });

  const handleBrochureSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      setBrochureSubmitted(true);
      setTimeout(() => {
        setShowBrochureModal(false);
        setBrochureSubmitted(false);
        setFormData({ name: '', email: '', school: '' });
      }, 2500);
    }
  };

  return (
    <PageTransition>
      <main id="main" data-screen-label="About page" className="min-h-screen bg-white overflow-x-hidden w-full max-w-full">
        {/* ========================================================================= */}
        {/* HERO SECTION                                                              */}
        {/* ========================================================================= */}
        <section className="bg-white sec-pad" aria-labelledby="hero-h1">
          <div className="mx-auto px-4 sm:px-6 max-w-[1280px] lg:px-10 w-full">
            <div className="grid gap-10 items-center lg:grid-cols-12 lg:gap-14">
              <div className="lg:col-span-6">
                <p className="hero-eyebrow mb-6">About CSEEL</p>
                <h1 className="hero-h1 mb-7 break-words" id="hero-h1">
                  We&apos;re building the future of hands-on STEM &amp; virtual science labs.
                </h1>
                <p className="hero-lead mb-7 max-w-[560px]">
                  CSEEL (Centre for Scientific Exploration and Experiential Learning) partners with schools, colleges, and educators across India to deliver curriculum-aligned 3D virtual laboratories, interactive physics engines, and hands-on experiential learning kits that classrooms truly need.
                </p>
                <p className="text-slate-muted font-medium tracking-wide text-[13px]">
                  NEP 2020 Aligned · ISO 9001:2015 Certified · 1,200+ Experiments
                </p>
              </div>

              <div className="lg:col-span-6">
                <div className="thumb-zoom shadow-card-hi rounded-card overflow-hidden">
                  <img
                    className="w-full object-cover aspect-[4/3]"
                    src="https://cdn.prod.website-files.com/63105b5082760e06eb992f00/66bf944f3df098f183b92727_Lab-Scientists-Beakers-edit.avif"
                    alt="CSEEL Scientific Laboratory and 3D Virtual Experiments"
                    loading="eager"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* MISSION & VISION SECTION (2-Card iXRLabs Feature Design)                   */}
        {/* ========================================================================= */}
        <section className="bg-tint sec-pad" aria-labelledby="mission-h">
          <div className="mx-auto px-4 sm:px-6 max-w-[1280px] lg:px-10 w-full">
            <div className="text-center max-w-[900px] mx-auto mb-12">
              <p className="eyebrow mb-4">Mission &amp; Vision</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-ink mb-6 break-words" id="mission-h">
                Why we exist &amp; where we&apos;re headed.
              </h2>
              <p className="text-slate-body text-[clamp(15px,1.3vw,18px)] leading-[1.7] font-normal">
                Science education across India has a fundamental lab gap: physical equipment is costly, lab slots are limited, and safety concerns often reduce practicals to passive demonstrations. CSEEL exists to transform science from textbook memorization into active, fearless discovery.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {/* Mission Card */}
              <div className="bg-white rounded-card border border-rule/60 p-6 sm:p-10 shadow-card hover:shadow-card-hi transition-all duration-300 flex flex-col justify-between group overflow-hidden">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-tint border border-rule/80 text-ixr-blue flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                    <Target className="w-7 h-7 text-ixr-blue" />
                  </div>
                  <h3 className="text-2xl font-bold text-ixr-blue-2 mb-4">
                    Our Mission
                  </h3>
                  <p className="text-slate-body text-[15px] leading-relaxed mb-6 font-normal">
                    To democratize world-class experiential scientific learning for every school and student across India. We remove infrastructure bottlenecks, hazardous chemical risks, and high consumable costs through browser-native 3D interactive labs and physical kits.
                  </p>
                </div>
                <ul className="space-y-3 pt-6 border-t border-rule/60 text-[14px] text-slate-body">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-ixr-blue shrink-0" />
                    <span>Equitable practical science access for all schools &amp; ATLs</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-ixr-blue shrink-0" />
                    <span>Inquiry-based experimentation with zero chemical or electric risk</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-ixr-blue shrink-0" />
                    <span>100% alignment with NEP 2020 competency-based guidelines</span>
                  </li>
                </ul>
              </div>

              {/* Vision Card */}
              <div className="bg-[#EDF5FA] rounded-card border border-[#D5E9F0] p-6 sm:p-10 shadow-card hover:shadow-card-hi transition-all duration-300 flex flex-col justify-between group overflow-hidden">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-ixr-blue text-white flex items-center justify-center mb-6 group-hover:scale-105 transition-transform shadow-btn">
                    <Eye className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-ixr-blue-2 mb-4">
                    Our Vision
                  </h3>
                  <p className="text-slate-body text-[15px] leading-relaxed mb-6 font-normal">
                    To become the national benchmark for hybrid scientific laboratory education. We envision an India where every student develops a genuine scientific temper, translating interactive digital twin simulations into breakthrough hardware inventions and research.
                  </p>
                </div>
                <ul className="space-y-3 pt-6 border-t border-[#D5E9F0] text-[14px] text-slate-body">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-ixr-blue shrink-0" />
                    <span>Empowering 1 Million+ student innovators across India by 2028</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-ixr-blue shrink-0" />
                    <span>Pioneering real-time WebGL physics &amp; chemistry simulation engines</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-ixr-blue shrink-0" />
                    <span>Connecting school classrooms directly with premier research mentors</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* NUMBERS SECTION (The numbers)                                             */}
        {/* ========================================================================= */}
        <section className="bg-white sec-pad" aria-labelledby="num-h">
          <div className="mx-auto px-4 sm:px-6 max-w-[1280px] lg:px-10 w-full">
            <div className="mb-10 sm:mb-12 max-w-[760px] lg:mb-14">
              <p className="eyebrow mb-4">By the numbers</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-ink break-words" id="num-h">
                Our impact across India.
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
              <div className="bg-tint rounded-card border p-4 sm:p-6 lg:p-8 text-center border-rule/60 hover:shadow-card transition-all overflow-hidden">
                <div className="font-extrabold text-ixr-blue-2 leading-tight mb-1 sm:mb-2 text-[clamp(26px,4.5vw,52px)]">
                  <span>1,200</span>+
                </div>
                <p className="text-slate-body text-xs sm:text-[15px] font-medium">experiments &amp; live labs</p>
              </div>

              <div className="bg-tint rounded-card border p-4 sm:p-6 lg:p-8 text-center border-rule/60 hover:shadow-card transition-all overflow-hidden">
                <div className="font-extrabold text-ixr-blue-2 leading-tight mb-1 sm:mb-2 text-[clamp(26px,4.5vw,52px)]">
                  <span>500</span>+
                </div>
                <p className="text-slate-body text-xs sm:text-[15px] font-medium">partner schools &amp; ATLs</p>
              </div>

              <div className="bg-tint rounded-card border p-4 sm:p-6 lg:p-8 text-center border-rule/60 hover:shadow-card transition-all overflow-hidden">
                <div className="font-extrabold text-ixr-blue-2 leading-tight mb-1 sm:mb-2 text-[clamp(26px,4.5vw,52px)]">
                  <span>250</span>K+
                </div>
                <p className="text-slate-body text-xs sm:text-[15px] font-medium">active student learners</p>
              </div>

              <div className="bg-tint rounded-card border p-4 sm:p-6 lg:p-8 text-center border-rule/60 hover:shadow-card transition-all overflow-hidden">
                <div className="font-extrabold text-ixr-blue-2 leading-tight mb-1 sm:mb-2 text-[clamp(26px,4.5vw,52px)]">
                  <span>99.4</span>%
                </div>
                <p className="text-slate-body text-xs sm:text-[15px] font-medium">concept retention rate</p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* OUR STORY (Timeline)                                                      */}
        {/* ========================================================================= */}
        <section className="bg-white sec-pad border-t border-rule" aria-labelledby="story-h">
          <div className="mx-auto px-4 sm:px-6 max-w-[1280px] lg:px-10 w-full">
            <div className="grid gap-8 sm:gap-12 items-start lg:grid-cols-12 lg:gap-16">
              {/* Left sticky column */}
              <div className="lg:col-span-5">
                <div className="lg:sticky lg:top-28">
                  <p className="eyebrow mb-4">Our story</p>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-ink mb-5 break-words" id="story-h">
                    From an idea to a nationwide STEM network.
                  </h2>
                  <p className="text-slate-body text-[15px] sm:text-[16px] leading-relaxed">
                    Founded by Dev Sharma with a passionate team of educators, engineers, and scientists dedicated to making practical science accessible to every classroom in India.
                  </p>
                </div>
              </div>

              {/* Right timeline column */}
              <div className="lg:col-span-7">
                <div className="tl-item">
                  <span className="tl-dot"></span>
                  <div className="tl-year mb-1.5">2022</div>
                  <h3 className="text-[19px] font-bold text-ink mb-1.5">Founded by Dev Sharma.</h3>
                  <p className="text-slate-body text-[15px] leading-relaxed">
                    Initiated to solve the acute shortage of experiential lab infrastructure in secondary schools; engineered the first interactive virtual physics models and practical toolkits.
                  </p>
                </div>

                <div className="tl-item">
                  <span className="tl-dot"></span>
                  <div className="tl-year mb-1.5">2023</div>
                  <h3 className="text-[19px] font-bold text-ink mb-1.5">NEP 2020 National Pilot.</h3>
                  <p className="text-slate-body text-[15px] leading-relaxed">
                    Partnered with 100+ premier schools to pilot curriculum-mapped experiential practicals, integrating inquiry-driven worksheets and digital lab manuals.
                  </p>
                </div>

                <div className="tl-item">
                  <span className="tl-dot"></span>
                  <div className="tl-year mb-1.5">2024</div>
                  <h3 className="text-[19px] font-bold text-ink mb-1.5">3D Workbench &amp; Smart Barcode Engine.</h3>
                  <p className="text-slate-body text-[15px] leading-relaxed">
                    Launched real-time WebGL 3D virtual laboratories with interactive apparatus barcode scanning, auditory narration, and multimedia conceptual deep-dives.
                  </p>
                </div>

                <div className="tl-item">
                  <span className="tl-dot"></span>
                  <div className="tl-year mb-1.5">2025</div>
                  <h3 className="text-[19px] font-bold text-ink mb-1.5">Advanced Science &amp; ATL Expansion.</h3>
                  <p className="text-slate-body text-[15px] leading-relaxed">
                    Expanded library to 800+ modules covering complex chemistry titrations, molecular biology electrophoresis, optics benches, and robotics prototyping.
                  </p>
                </div>

                <div className="tl-item">
                  <span className="tl-dot"></span>
                  <div className="tl-year mb-1.5">2026</div>
                  <h3 className="text-[19px] font-bold text-ink mb-1.5">EduNetwork &amp; 250,000+ Students.</h3>
                  <p className="text-slate-body text-[15px] leading-relaxed">
                    Unified students, verified science teachers, and schools into India&apos;s fastest growing collaborative STEM experimentation ecosystem.
                  </p>
                </div>

                <div className="tl-item">
                  <span className="tl-dot"></span>
                  <div className="tl-year mb-1.5">2027 and beyond</div>
                  <h3 className="text-[19px] font-bold text-ink mb-1.5">AI Tutors &amp; Pan-India Reach.</h3>
                  <p className="text-slate-body text-[15px] leading-relaxed">
                    Rolling out intelligent AI lab assistants in regional Indian languages, ensuring world-class practical science is available to every child across the nation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* HOW WE DEPLOY (3 Steps)                                                   */}
        {/* ========================================================================= */}
        <section className="bg-white sec-pad border-t border-rule" aria-labelledby="how-h">
          <div className="mx-auto px-4 sm:px-6 max-w-[1280px] lg:px-10 w-full">
            <div className="mb-12 max-w-[760px] lg:mb-16">
              <p className="eyebrow mb-4">How we deploy</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-ink break-words" id="how-h">
                Classroom-ready in three simple steps.
              </h2>
            </div>

            <ol className="grid gap-6 md:grid-cols-3 lg:gap-7">
              <li className="lift bg-white rounded-card shadow-card border p-6 sm:p-7 relative border-rule/60 lg:p-8 overflow-hidden">
                <div className="flex items-center justify-between mb-5">
                  <span className="font-bold leading-none text-ixr-cyan text-[40px]">01</span>
                  <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl text-ixr-blue bg-ixr-blue/10">
                    <Layers className="w-5 h-5 text-ixr-blue" />
                  </span>
                </div>
                <h3 className="text-lg font-bold text-ink mb-3 break-words">Interactive 3D Workbench.</h3>
                <p className="text-slate-body text-[14.5px] leading-relaxed">
                  Browser-based 3D simulation workbench running at 60 FPS on any laptop, tablet, or interactive smartboard with zero installations.
                </p>
              </li>

              <li className="lift bg-white rounded-card shadow-card border p-6 sm:p-7 relative border-rule/60 lg:p-8 overflow-hidden">
                <div className="flex items-center justify-between mb-5">
                  <span className="font-bold leading-none text-ixr-cyan text-[40px]">02</span>
                  <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl text-ixr-blue bg-ixr-blue/10">
                    <QrCode className="w-5 h-5 text-ixr-blue" />
                  </span>
                </div>
                <h3 className="text-lg font-bold text-ink mb-3 break-words">
                  Smart Barcode &amp; Audio Guide.
                </h3>
                <p className="text-slate-body text-[14.5px] leading-relaxed">
                  Students click or scan any apparatus to inspect its exact working principle, formula breakdown, and voice-guided experimental instructions.
                </p>
              </li>

              <li className="lift bg-white rounded-card shadow-card border p-6 sm:p-7 relative border-rule/60 lg:p-8 overflow-hidden">
                <div className="flex items-center justify-between mb-5">
                  <span className="font-bold leading-none text-ixr-cyan text-[40px]">03</span>
                  <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl text-ixr-blue bg-ixr-blue/10">
                    <BarChart3 className="w-5 h-5 text-ixr-blue" />
                  </span>
                </div>
                <h3 className="text-lg font-bold text-ink mb-3 break-words">Formative Analytics &amp; Viva.</h3>
                <p className="text-slate-body text-[14.5px] leading-relaxed">
                  Real-time error tracking, error tolerance feedback, and continuous NEP 2020 competency scores for teachers and administrators.
                </p>
              </li>
            </ol>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* THE TEAM / LEADERSHIP (Dev Sharma & Key Leaders)                          */}
        {/* ========================================================================= */}
        <section className="bg-tint sec-pad" aria-labelledby="team-h">
          <div className="mx-auto px-4 sm:px-6 max-w-[1280px] lg:px-10 w-full">
            <div className="mb-10 sm:mb-12 max-w-[760px] lg:mb-14">
              <p className="eyebrow mb-4">Leadership</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-ink break-words" id="team-h">
                The people behind CSEEL.
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:gap-6">
              {/* Dev Sharma - Founder Card */}
              <article className="bg-white rounded-card shadow-card border p-5 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-5 border-rule/60 lg:p-7 md:col-span-2 overflow-hidden">
                <img
                  className="rounded-2xl object-cover flex-shrink-0 bg-tint w-24 h-24 sm:w-[120px] sm:h-[120px] border border-rule mx-auto sm:mx-0"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop"
                  alt="Dev Sharma"
                  loading="lazy"
                />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-[20px] font-extrabold text-ink break-words">Dev Sharma</h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-ixr-blue text-white text-[11px] font-bold">Founder</span>
                  </div>
                  <p className="text-ixr-blue font-bold text-[14px] mb-2.5">Founder &amp; Lead Innovator</p>
                  <p className="text-slate-body text-[14px] leading-[1.6] mb-0 break-words">
                    Dev Sharma founded CSEEL with a clear mission: to revolutionize experiential science learning and solve the hands-on lab deficit across Indian schools. Under his leadership, CSEEL has engineered India’s most comprehensive browser-native 3D laboratory simulation engine, smart barcode apparatus inspectors, and NEP 2020 experiential curriculum modules, empowering over 500+ schools and 250,000+ students nationwide.
                  </p>
                </div>
              </article>

              {/* Leader 2 */}
              <article className="bg-white rounded-card shadow-card border p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:gap-5 border-rule/60 lg:p-6 overflow-hidden">
                <img
                  className="rounded-xl object-cover flex-shrink-0 bg-tint w-20 h-20 sm:w-[88px] sm:h-[88px] lg:w-[104px] lg:h-[104px] mx-auto sm:mx-0"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop"
                  alt="Dr. Arvind Sharma"
                  loading="lazy"
                />
                <div className="min-w-0">
                  <h3 className="text-[17px] font-bold text-ink mb-0.5 break-words">Dr. Arvind Sharma</h3>
                  <p className="text-ixr-blue font-semibold text-[13px] mb-2.5">Director of Curriculum &amp; Pedagogy</p>
                  <p className="text-slate-body text-[13.5px] leading-[1.6] mb-0 break-words">
                    Senior science education expert with 22+ years experience designing NCERT &amp; CBSE curriculum practical frameworks, ensuring rigorous pedagogical standards.
                  </p>
                </div>
              </article>

              {/* Leader 3 */}
              <article className="bg-white rounded-card shadow-card border p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:gap-5 border-rule/60 lg:p-6 overflow-hidden">
                <img
                  className="rounded-xl object-cover flex-shrink-0 bg-tint w-20 h-20 sm:w-[88px] sm:h-[88px] lg:w-[104px] lg:h-[104px] mx-auto sm:mx-0"
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop"
                  alt="Priya Nair"
                  loading="lazy"
                />
                <div className="min-w-0">
                  <h3 className="text-[17px] font-bold text-ink mb-0.5 break-words">Priya Nair</h3>
                  <p className="text-ixr-blue font-semibold text-[13px] mb-2.5">ATL Robotics &amp; Prototyping Lead</p>
                  <p className="text-slate-body text-[13.5px] leading-[1.6] mb-0 break-words">
                    Robotics and embedded hardware engineer who has mentored 15,000+ school students in Atal Tinkering Labs across IoT, sensors, and microcontrollers.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* ACCREDITATIONS & NATIONAL STANDARDS                                       */}
        {/* ========================================================================= */}
        <section className="bg-white sec-pad" aria-labelledby="part-h">
          <div className="mx-auto px-4 sm:px-6 max-w-[1280px] lg:px-10 w-full">
            <div className="mb-10 sm:mb-12 max-w-[760px]">
              <p className="eyebrow mb-4">Quality &amp; Compliance</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-ink break-words" id="part-h">
                Aligned with national educational frameworks.
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-5 items-center sm:grid-cols-4">
              <div className="lift bg-white rounded-card shadow-card border p-4 sm:p-6 text-center border-rule/60 overflow-hidden">
                <Award className="w-7 h-7 text-ixr-blue mx-auto mb-2" />
                <h4 className="font-bold text-sm text-ink mb-1 break-words">NEP 2020</h4>
                <p className="text-xs text-slate-muted">Competency-Based Learning</p>
              </div>

              <div className="lift bg-white rounded-card shadow-card border p-4 sm:p-6 text-center border-rule/60 overflow-hidden">
                <BookOpen className="w-7 h-7 text-ixr-blue mx-auto mb-2" />
                <h4 className="font-bold text-sm text-ink mb-1 break-words">CBSE &amp; ICSE</h4>
                <p className="text-xs text-slate-muted">Practical Lab Syllabi</p>
              </div>

              <div className="lift bg-white rounded-card shadow-card border p-4 sm:p-6 text-center border-rule/60 overflow-hidden">
                <Cpu className="w-7 h-7 text-ixr-blue mx-auto mb-2" />
                <h4 className="font-bold text-sm text-ink mb-1 break-words">ATL Mission</h4>
                <p className="text-xs text-slate-muted">Hands-on Prototyping</p>
              </div>

              <div className="lift bg-white rounded-card shadow-card border p-4 sm:p-6 text-center border-rule/60 overflow-hidden">
                <Award className="w-7 h-7 text-ixr-blue mx-auto mb-2" />
                <h4 className="font-bold text-sm text-ink mb-1 break-words">ISO 9001:2015</h4>
                <p className="text-xs text-slate-muted">Certified Educational Safety</p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* CTA BANNER                                                                */}
        {/* ========================================================================= */}
        <section 
          className="relative overflow-hidden text-white" 
          style={{ background: "linear-gradient(315deg, #0D4979 0%, #005689 55%, #086FA6 100%)" }} 
          aria-labelledby="cta-h"
        >
          <div 
            aria-hidden="true" 
            style={{ 
              position: "absolute", 
              inset: 0, 
              background: "radial-gradient(ellipse at top right, rgba(77,177,218,0.35), transparent 60%)", 
              pointerEvents: "none" 
            }}
          />
          <div className="mx-auto px-6 py-20 text-center max-w-[1280px] lg:px-10 lg:py-24 relative z-10">
            <h2 className="text-white text-3xl sm:text-4xl md:text-5xl font-black mb-4" id="cta-h">
              Experience CSEEL 3D Live Labs in action.
            </h2>
            <p className="text-ixr-sky mb-8 mx-auto text-[18px]">
              A walkthrough tailored to your school, college, and laboratory curriculum.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/virtual-lab" className="btn-on-blue">
                Launch 3D Virtual Lab <ArrowRight className="w-4 h-4" />
              </Link>
              <button 
                onClick={() => setShowBrochureModal(true)}
                className="btn-ghost-white"
              >
                Schedule School Demo
              </button>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* BROCHURE / DEMO MODAL                                                     */}
        {/* ========================================================================= */}
        {showBrochureModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-[#0F172A]/70 backdrop-blur-sm transition-opacity" 
              onClick={() => setShowBrochureModal(false)}
            />
            <div className="relative bg-white rounded-card shadow-card-hi w-full max-w-[440px] p-8 z-10 border border-rule">
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <p className="eyebrow">School Demo</p>
                  <button 
                    onClick={() => setShowBrochureModal(false)} 
                    type="button" 
                    className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <h3 className="text-xl font-bold text-ink mt-2">Book a Live Demo</h3>
                <p className="text-slate-body text-sm mt-1">Get an interactive 30-min walkthrough for your institution.</p>
              </div>

              {brochureSubmitted ? (
                <div className="text-center py-6">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-ink">Demo Request Received!</h4>
                  <p className="text-xs text-slate-muted mt-1">Our academic advisor will connect with your institution shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleBrochureSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-ink" htmlFor="demo-name">Full name</label>
                    <input 
                      id="demo-name"
                      type="text" 
                      required
                      placeholder="e.g. Principal Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full border border-rule rounded-btn px-3 py-2.5 text-sm text-ink placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-ixr-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-ink" htmlFor="demo-school">School / Institution Name</label>
                    <input 
                      id="demo-school"
                      type="text" 
                      required
                      placeholder="e.g. Delhi Public School"
                      value={formData.school}
                      onChange={(e) => setFormData(prev => ({ ...prev, school: e.target.value }))}
                      className="w-full border border-rule rounded-btn px-3 py-2.5 text-sm text-ink placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-ixr-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-ink" htmlFor="demo-email">Email Address</label>
                    <input 
                      id="demo-email"
                      type="email" 
                      required
                      placeholder="principal@school.edu"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full border border-rule rounded-btn px-3 py-2.5 text-sm text-ink placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-ixr-blue"
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="button_primary w-full py-3.5 text-white font-bold rounded-[12px] text-sm shadow-sm hover:shadow-md transition-all mt-2"
                  >
                    Schedule Demo
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </main>
    </PageTransition>
  );
}
