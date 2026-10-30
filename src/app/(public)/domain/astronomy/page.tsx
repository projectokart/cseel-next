'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// ─── SELF-CONTAINED CRISP SVG ICONS (ZERO RUNTIME DEPENDENCY GLITCHES) ──────────

function ArrowRightIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function MenuIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function CloseIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function FlaskIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2v5.5L4.4 17.8c-.8 1.4.2 3.2 1.8 3.2h11.6c1.6 0 2.6-1.8 1.8-3.2L14 7.5V2" />
      <path d="M8.5 2h7" />
      <path d="M7 16h10" />
    </svg>
  );
}

function ShieldCheckIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function UserCheckIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <polyline points="16 11 18 13 22 9" />
    </svg>
  );
}

function GearIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function RobotIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v4" />
      <line x1="8" y1="16" x2="8" y2="16" />
      <line x1="16" y1="16" x2="16" y2="16" />
    </svg>
  );
}

function CpuIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <path d="M15 2v2" />
      <path d="M15 20v2" />
      <path d="M2 15h2" />
      <path d="M2 9h2" />
      <path d="M20 15h2" />
      <path d="M20 9h2" />
      <path d="M9 2v2" />
      <path d="M9 20v2" />
    </svg>
  );
}

function CodeIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function LightbulbIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  );
}

function PlanetIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="6" />
      <path d="M4.5 16.5C3.5 15.5 3 14 3 12c0-3.5 4-6.5 9-6.5 3 0 5.7 1 7.2 2.5" />
      <path d="M19.5 7.5c1 1 1.5 2.5 1.5 4.5 0 3.5-4 6.5-9 6.5-3 0-5.7-1-7.2-2.5" />
    </svg>
  );
}

function GalaxyIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3a9 9 0 0 0-9 9c0 4.97 4.03 9 9 9s9-4.03 9-9" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M12 7c2.5 0 4.5 2 4.5 4.5S14.5 16 12 16" />
    </svg>
  );
}

function TelescopeIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m10 10 8-5 3 5-8 5" />
      <path d="m5 13 5-3" />
      <circle cx="4" cy="14" r="2" />
      <path d="m14 11-6 10" />
      <path d="m14 11 6 10" />
      <path d="M14 11v10" />
    </svg>
  );
}

function RocketIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4.5c1.62-1.63 5-2.5 5-2.5" />
      <path d="M15 15v5s3.03-.55 4.5-2c1.63-1.62 2.5-5 2.5-5" />
    </svg>
  );
}

function SendIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function CheckCircleIcon({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function YoutubeIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

function InstagramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function LinkedinIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
    </svg>
  );
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────────

export default function AntarikshaPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [enquirySubmitted, setEnquirySubmitted] = useState(false);
  const [formSubject, setFormSubject] = useState('Antariksha Astronomy Lab Enquiry');
  const [formData, setFormData] = useState({
    name: '',
    schoolName: '',
    phone: '',
    email: '',
    city: '',
    program: 'Antariksha Astronomy Lab Setup',
    message: ''
  });

  const handleOpenEnquiry = (programName?: string) => {
    if (programName) {
      setFormSubject(programName);
      setFormData(prev => ({ ...prev, program: programName }));
    }
    setEnquiryOpen(true);
  };

  const handleSubmitEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setEnquirySubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#060913] text-white font-sans selection:bg-cyan-500 selection:text-black">
      {/* ========================================================
          1. MINIMALIST BRAND NAVBAR (MATCHING REFERENCE DESIGN)
         ======================================================== */}
      <header className="sticky top-0 z-50 w-full bg-[#060913]/90 backdrop-blur-md border-b border-white/5 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo with Atom/Orbit symbol */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-cyan-400/40 rotate-12 animate-pulse" />
              <div className="absolute inset-0 rounded-full border border-blue-500/50 -rotate-45" />
              <div className="absolute inset-1 rounded-full border border-amber-400/40 rotate-60" />
              <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-amber-400 to-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                CSEEL
              </span>
              <span className="text-[9px] sm:text-[10px] tracking-wide text-gray-400 font-medium leading-none -mt-0.5 hidden xs:inline">
                Center for Scientific Exploration and Experiential Learning
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <Link href="/" className="hover:text-cyan-400 transition-colors">
              Home
            </Link>
            <a href="#our-lab" className="hover:text-cyan-400 transition-colors">
              Our Lab
            </a>
            <a href="#workshops" className="hover:text-cyan-400 transition-colors">
              Workshops
            </a>
            <a href="#space-exploration" className="hover:text-cyan-400 transition-colors">
              Space Exploration
            </a>
            <a href="#stargazing" className="hover:text-cyan-400 transition-colors">
              Stargazing
            </a>
          </nav>

          {/* Right Action CTA */}
          <div className="hidden sm:flex items-center gap-4">
            <button
              onClick={() => handleOpenEnquiry('Antariksha General Enquiry')}
              className="px-6 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-[#0A84FF] to-[#0066CC] hover:from-[#2997FF] hover:to-[#0A84FF] shadow-[0_0_20px_rgba(10,132,255,0.4)] hover:shadow-[0_0_25px_rgba(10,132,255,0.7)] transition-all active:scale-95 cursor-pointer"
            >
              Enquiry
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <CloseIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0A0E1C] border-b border-white/10 px-6 py-5 space-y-4">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-gray-300 hover:text-cyan-400"
            >
              Home
            </Link>
            <a
              href="#our-lab"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-gray-300 hover:text-cyan-400"
            >
              Our Lab
            </a>
            <a
              href="#workshops"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-gray-300 hover:text-cyan-400"
            >
              Workshops
            </a>
            <a
              href="#space-exploration"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-gray-300 hover:text-cyan-400"
            >
              Space Exploration
            </a>
            <a
              href="#stargazing"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-gray-300 hover:text-cyan-400"
            >
              Stargazing
            </a>
            <div className="pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleOpenEnquiry('Mobile Enquiry');
                }}
                className="w-full py-3 rounded-full text-center font-semibold text-white bg-gradient-to-r from-[#0A84FF] to-[#0066CC] shadow-lg shadow-blue-500/30"
              >
                Enquiry
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ========================================================
          2. HERO SECTION (WITH MOBILE & DESKTOP HERO IMAGES)
             Image already has text, with Enquiry button attached
         ======================================================== */}
      <section className="relative w-full overflow-hidden bg-[#060913]">
        {/* Desktop Hero Banner (16:9 ratio) */}
        <div className="hidden md:block relative w-full max-w-[1440px] mx-auto">
          <div className="relative w-full aspect-[16/9] overflow-hidden">
            <Image
              src="/images/antariksha/hero_desktop.jpg"
              alt="Antariksha Astronomy Lab - Real Learning Beyond Classrooms"
              fill
              priority
              className="object-cover object-center"
              sizes="100vw"
            />
            {/* Interactive Enquiry Button placed directly over the image button area */}
            <div className="absolute left-[5.5%] bottom-[33%] z-20">
              <button
                onClick={() => handleOpenEnquiry('Hero CTA Enquiry')}
                className="group relative inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-bold text-white bg-gradient-to-r from-[#0A84FF] to-[#0062CC] hover:from-[#2997FF] hover:to-[#0A84FF] shadow-[0_0_35px_rgba(10,132,255,0.8)] hover:shadow-[0_0_45px_rgba(34,211,238,0.95)] transition-all transform hover:-translate-y-0.5 active:scale-95 text-base cursor-pointer"
              >
                <span>Enquiry</span>
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-500" />
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Hero Banner (Vertical Portrait) */}
        <div className="block md:hidden relative w-full">
          <div className="relative w-full aspect-[9/16] overflow-hidden">
            <Image
              src="/images/antariksha/hero_mobile.jpg"
              alt="Antariksha Astronomy Lab - Real Learning Beyond Classrooms"
              fill
              priority
              className="object-cover object-center"
              sizes="100vw"
            />
            {/* Mobile Enquiry button placed prominently */}
            <div className="absolute inset-x-6 bottom-[6%] z-20">
              <button
                onClick={() => handleOpenEnquiry('Mobile Hero Enquiry')}
                className="w-full py-4 rounded-full font-bold text-white bg-gradient-to-r from-[#0A84FF] to-[#0062CC] shadow-[0_0_30px_rgba(10,132,255,0.8)] active:scale-95 text-base flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Enquiry</span>
                <ArrowRightIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. SECTION 1: OUR LAB (MATCHING REFERENCE DESIGN)
         ======================================================== */}
      <section id="our-lab" className="py-20 lg:py-28 bg-[#070B16] border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold tracking-widest uppercase">
                <span className="w-6 h-[2px] bg-cyan-400" />
                <span>OUR LAB</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                Hands-On Learning
                <br />
                in a Real Lab Environment
              </h2>

              <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-xl font-normal">
                Explore, experiment and discover with state-of-the-art equipment and guided mentorship.
                Our labs are designed to turn curiosity into real skills.
              </p>

              {/* 4 Feature Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-2 group">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                    <FlaskIcon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold text-gray-200">Modern Equipment</span>
                </div>

                <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-2 group">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                    <ShieldCheckIcon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold text-gray-200">Safe &amp; Structured</span>
                </div>

                <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-2 group">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                    <UserCheckIcon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold text-gray-200">Expert Mentors</span>
                </div>

                <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-2 group">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                    <GearIcon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold text-gray-200">Real-World Projects</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <button
                  onClick={() => handleOpenEnquiry('Explore Our Lab Enquiry')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-gray-200 border border-white/20 hover:border-cyan-400 hover:text-white hover:bg-cyan-500/10 transition-all group cursor-pointer"
                >
                  <span>Explore Our Lab</span>
                  <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Right Visual Card with Glowing Accent Badges */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] group">
                <div className="relative aspect-[16/10] w-full">
                  <Image
                    src="/images/antariksha/lab.jpg"
                    alt="Antariksha hands-on modern lab environment"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070B16]/80 via-transparent to-transparent" />
                </div>
                {/* Decorative Translucent Corner Accent */}
                <div className="absolute top-4 left-4 w-10 h-10 rounded-xl bg-cyan-400/20 backdrop-blur-md border border-cyan-400/40 -rotate-12" />
                <div className="absolute bottom-4 right-4 w-12 h-12 rounded-2xl bg-cyan-500/20 backdrop-blur-md border border-cyan-500/40 rotate-6" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. SECTION 2: WORKSHOPS (MATCHING REFERENCE DESIGN)
         ======================================================== */}
      <section id="workshops" className="py-20 lg:py-28 bg-[#0A0F1E] border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Visual Card with Warm Amber Accent Badges */}
            <div className="lg:col-span-6 order-2 lg:order-1 relative">
              <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] group">
                <div className="relative aspect-[16/10] w-full">
                  <Image
                    src="/images/antariksha/robotics.jpg"
                    alt="Students building robotics and STEM kits"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1E]/80 via-transparent to-transparent" />
                </div>
                {/* Decorative Warm Accent Badges */}
                <div className="absolute top-4 left-4 w-10 h-10 rounded-xl bg-amber-400/30 backdrop-blur-md border border-amber-400/50 -rotate-6" />
                <div className="absolute bottom-4 left-4 w-12 h-12 rounded-2xl bg-amber-500/20 backdrop-blur-md border border-amber-500/40 rotate-12" />
                <div className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-cyan-400/20 backdrop-blur-md border border-cyan-400/40 rotate-12" />
              </div>
            </div>

            {/* Right Content */}
            <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold tracking-widest uppercase">
                <span className="w-6 h-[2px] bg-cyan-400" />
                <span>WORKSHOPS</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                Build Skills,
                <br />
                Create Something Amazing
              </h2>

              <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-xl font-normal">
                Our curated workshops help students gain practical skills in robotics, electronics, coding,
                design and more — with project-based, hands-on learning.
              </p>

              {/* 4 Workshop Pillars */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-2 group">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                    <RobotIcon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold text-gray-200">Robotics</span>
                </div>

                <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-2 group">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                    <CpuIcon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold text-gray-200">Electronics</span>
                </div>

                <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-2 group">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                    <CodeIcon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold text-gray-200">Coding</span>
                </div>

                <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-2 group">
                  <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform">
                    <LightbulbIcon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold text-gray-200">Design &amp; Build</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <button
                  onClick={() => handleOpenEnquiry('Workshops Enquiry')}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-[#0A84FF] to-[#0062CC] hover:from-[#2997FF] hover:to-[#0A84FF] shadow-[0_0_20px_rgba(10,132,255,0.4)] transition-all group cursor-pointer"
                >
                  <span>View Workshops</span>
                  <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          5. SECTION 3: SPACE EXPLORATION (MATCHING REFERENCE DESIGN)
         ======================================================== */}
      <section id="space-exploration" className="py-20 lg:py-28 bg-[#050811] border-t border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold tracking-widest uppercase">
                <span className="w-6 h-[2px] bg-cyan-400" />
                <span>SPACE EXPLORATION</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                A Closer Look at a
                <br />
                Bigger Universe
              </h2>

              <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-xl font-normal">
                From understanding our solar system to exploring distant galaxies, our space programs
                inspire students to dream, question and explore beyond the ordinary.
              </p>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  onClick={() => handleOpenEnquiry('Explore Space Programs')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-gray-200 border border-white/20 hover:border-cyan-400 hover:text-white hover:bg-cyan-500/10 transition-all group cursor-pointer"
                >
                  <span>Explore Space</span>
                  <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Right Visual: Curved Earth Limb against Stars */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden border border-cyan-500/20 shadow-[0_0_50px_rgba(6,182,212,0.15)] group">
                <div className="relative aspect-[16/10] w-full">
                  <Image
                    src="/images/antariksha/earth_space.jpg"
                    alt="Curved Earth horizon from orbit in starry space"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050811]/70 via-transparent to-transparent" />
                </div>
              </div>
            </div>
          </div>

          {/* 4 Space Category Pillars across bottom */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-16 border-t border-white/5 mt-16">
            <div className="flex flex-col items-center text-center space-y-3 group cursor-pointer" onClick={() => handleOpenEnquiry('Solar System Study')}>
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:border-cyan-400 transition-all">
                <PlanetIcon className="w-7 h-7" />
              </div>
              <span className="text-sm font-semibold text-gray-200 group-hover:text-cyan-400 transition-colors">Solar System</span>
            </div>

            <div className="flex flex-col items-center text-center space-y-3 group cursor-pointer" onClick={() => handleOpenEnquiry('Galaxies & Deep Space')}>
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 group-hover:border-purple-400 transition-all">
                <GalaxyIcon className="w-7 h-7" />
              </div>
              <span className="text-sm font-semibold text-gray-200 group-hover:text-purple-400 transition-colors">Galaxies</span>
            </div>

            <div className="flex flex-col items-center text-center space-y-3 group cursor-pointer" onClick={() => handleOpenEnquiry('Astronomy Lab Setup')}>
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:border-blue-400 transition-all">
                <TelescopeIcon className="w-7 h-7" />
              </div>
              <span className="text-sm font-semibold text-gray-200 group-hover:text-blue-400 transition-colors">Astronomy</span>
            </div>

            <div className="flex flex-col items-center text-center space-y-3 group cursor-pointer" onClick={() => handleOpenEnquiry('Future Space Missions')}>
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 group-hover:border-amber-400 transition-all">
                <RocketIcon className="w-7 h-7" />
              </div>
              <span className="text-sm font-semibold text-gray-200 group-hover:text-amber-400 transition-colors">Future Missions</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          6. SECTION 4: STARGAZING (MATCHING REFERENCE DESIGN)
         ======================================================== */}
      <section id="stargazing" className="py-20 lg:py-28 bg-[#04060E] border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Visual: Silhouette with Telescope */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] group">
                <div className="relative aspect-[16/10] w-full">
                  <Image
                    src="/images/antariksha/stargazing.jpg"
                    alt="Students stargazing with telescope under Milky Way"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#04060E]/70 via-transparent to-transparent" />
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold tracking-widest uppercase">
                <span className="w-6 h-[2px] bg-cyan-400" />
                <span>STARGAZING</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                Look Up. Ask Why.
              </h2>

              <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-xl font-normal">
                Through our telescope sessions, students get a real view of the night sky —
                planets, stars, nebulae and more. Because the universe is better seen, not just read about.
              </p>

              {/* Action Button */}
              <div className="pt-4">
                <button
                  onClick={() => handleOpenEnquiry('Join a Telescope Session')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-gray-200 border border-white/20 hover:border-cyan-400 hover:text-white hover:bg-cyan-500/10 transition-all group cursor-pointer"
                >
                  <span>Join a Telescope Session</span>
                  <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          7. MINIMALIST FOOTER (MATCHING REFERENCE DESIGN)
         ======================================================== */}
      <footer className="bg-[#030409] border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Left Brand */}
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-cyan-400/40 rotate-12" />
                <div className="absolute inset-0 rounded-full border border-blue-500/50 -rotate-45" />
                <div className="w-2 h-2 rounded-full bg-cyan-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tight text-white">CSEEL</span>
                <span className="text-[9px] text-gray-400 font-medium">
                  Center for Scientific Exploration and Experiential Learning
                </span>
              </div>
            </div>

            {/* Center Navigation Links */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <a href="#our-lab" className="hover:text-white transition-colors">Our Lab</a>
              <a href="#workshops" className="hover:text-white transition-colors">Workshops</a>
              <a href="#space-exploration" className="hover:text-white transition-colors">Space Exploration</a>
              <a href="#stargazing" className="hover:text-white transition-colors">About</a>
            </div>

            {/* Right Socials & Tagline */}
            <div className="flex flex-col items-center md:items-end gap-2">
              <div className="flex items-center gap-4 text-gray-400">
                <a href="https://youtube.com/@cseel" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="YouTube">
                  <YoutubeIcon className="w-4 h-4" />
                </a>
                <a href="https://instagram.com/cseel_official" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Instagram">
                  <InstagramIcon className="w-4 h-4" />
                </a>
                <a href="https://linkedin.com/company/cseel" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="LinkedIn">
                  <LinkedinIcon className="w-4 h-4" />
                </a>
              </div>
              <p className="text-xs text-gray-500 font-medium tracking-tight">
                Curiosity Today. Innovators Tomorrow.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 text-center text-xs text-gray-600">
            &copy; {new Date().getFullYear()} CSEEL — Antariksha Astronomy Lab. All rights reserved.
          </div>
        </div>
      </footer>

      {/* ========================================================
          8. DEDICATED ENQUIRY MODAL (FAST LEAD FORM)
         ======================================================== */}
      {enquiryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#0A0F1E] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(6,182,212,0.2)] text-white">
            {/* Close Button */}
            <button
              onClick={() => {
                setEnquiryOpen(false);
                setEnquirySubmitted(false);
              }}
              className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <CloseIcon className="w-5 h-5" />
            </button>

            {!enquirySubmitted ? (
              <form onSubmit={handleSubmitEnquiry} className="space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                    <TelescopeIcon className="w-4 h-4" />
                    <span>Antariksha Lab Enquiry</span>
                  </div>
                  <h3 className="text-2xl font-black text-white">Get Started With CSEEL</h3>
                  <p className="text-xs text-gray-400">
                    Fill this quick form to enquire about school lab setup, night sky telescope sessions, or astronomy workshops.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Dr. Rajesh Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">School / Institute *</label>
                    <input
                      type="text"
                      required
                      value={formData.schoolName}
                      onChange={e => setFormData({ ...formData, schoolName: e.target.value })}
                      placeholder="e.g. Modern School"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Mobile / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="principal@school.edu.in"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={e => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. New Delhi"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Program of Interest</label>
                    <select
                      value={formData.program}
                      onChange={e => setFormData({ ...formData, program: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#141B30] border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                    >
                      <option value="Antariksha Astronomy Lab Setup">Antariksha Lab Setup</option>
                      <option value="Telescope Night Stargazing Session">Night Stargazing Session</option>
                      <option value="Mobile Planetarium Show">Mobile Planetarium Show</option>
                      <option value="Robotics & Space Workshop">Robotics &amp; Space Workshop</option>
                      <option value="Curriculum & Faculty Training">Curriculum &amp; Teacher Training</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Message or Queries (Optional)</label>
                  <textarea
                    rows={2}
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your school grade levels or preferred dates..."
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-[#0A84FF] to-[#0062CC] hover:from-[#2997FF] hover:to-[#0A84FF] shadow-[0_0_20px_rgba(10,132,255,0.6)] transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
                >
                  <SendIcon className="w-4 h-4" />
                  <span>Submit Enquiry</span>
                </button>
              </form>
            ) : (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircleIcon className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-white">Enquiry Received!</h3>
                <p className="text-sm text-gray-300 max-w-sm mx-auto leading-relaxed">
                  Thank you, <span className="font-semibold text-cyan-400">{formData.name}</span>. Our Antariksha space team will reach out to you within 24 hours.
                </p>
                <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href={`https://wa.me/919876543210?text=Hello%20CSEEL,%20I%20enquired%20about%20${encodeURIComponent(formData.program)}%20for%20${encodeURIComponent(formData.schoolName)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2.5 rounded-full text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                  >
                    Chat on WhatsApp
                  </a>
                  <button
                    onClick={() => {
                      setEnquiryOpen(false);
                      setEnquirySubmitted(false);
                    }}
                    className="px-6 py-2.5 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
