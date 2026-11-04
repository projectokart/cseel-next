'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// ─── CRISP SELF-CONTAINED SVG ICONS ─────────────────────────────────────────────

function ArrowRightIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function HomeIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
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

function CrownIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M2 19h20v2H2v-2zm1-8.5l4 3.5 5-8 5 8 4-3.5L20 17H4l-1-6.5z" />
    </svg>
  );
}

function TelescopeIcon({ className = 'w-5 h-5' }: { className?: string }) {
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

function RadarIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
      <path d="M12 6a6 6 0 1 0 6 6 6 6 0 0 0-6-6zm0 10a4 4 0 1 1 4-4 4 4 0 0 1-4 4z" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

function CompassIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" />
    </svg>
  );
}

function SunIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" fill="currentColor" fillOpacity="0.2" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
    </svg>
  );
}

function RocketIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    </svg>
  );
}

function CheckCircleIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
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

// ─── MAIN COMPONENT: DRIBBBLE PIXEL-PERFECT RECREATION ─────────────────────────

export default function AntarikshaPage() {
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
    <div className="min-h-screen bg-[#13192B] text-white font-sans selection:bg-[#FF5E36] selection:text-white relative overflow-x-hidden">
      
      {/* Background Decorative Constellations & Grid */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-25 z-0"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 20%, rgba(41, 182, 246, 0.15), transparent 45%),
                            radial-gradient(circle at 80% 70%, rgba(255, 94, 54, 0.12), transparent 40%),
                            linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)`,
          backgroundSize: '100% 100%, 100% 100%, 64px 64px, 64px 64px'
        }}
      />

      {/* ========================================================
          1. TOP NAVIGATION BAR (MATCHING USER SCREENSHOT EXACTLY)
         ======================================================== */}
      <header className="relative z-40 w-full px-6 lg:px-12 py-4 border-b border-white/5 bg-[#0A0D16]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Left: Official CSEEL White Logo (Clickable to Home) */}
          <div className="flex items-center gap-3">
            <Link 
              href="/" 
              className="flex items-center hover:opacity-90 transition-opacity focus:outline-none"
              title="CSEEL - Center for Scientific Exploration and Experiential Learning"
            >
              <img
                src="/images/cseel-logo-white.svg"
                alt="CSEEL - Center for Scientific Exploration and Experiential Learning"
                className="h-9 sm:h-10 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Right Action: Exact Vibrant Blue Pill "Enquiry ->" Button from Screenshot */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleOpenEnquiry('Top Navbar Enquiry')}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold text-white bg-[#0070F3] hover:bg-[#0060df] active:scale-95 shadow-[0_2px_12px_rgba(0,112,243,0.35)] hover:shadow-[0_4px_20px_rgba(0,112,243,0.5)] transition-all cursor-pointer"
            >
              <span>Enquiry</span>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================
          2. HERO SECTION: ROCKET & SATURN-LIKE PLANET
             (Exact 1:1 Layout from Top Half of Reference Image)
         ======================================================== */}
      <section className="relative z-10 w-full px-6 lg:px-16 pt-8 pb-16 lg:py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Crown Icon, Big Typography, Description, Button, Floating HUD Card */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Golden Crown Circular Badge */}
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#FFB703]/20 border border-[#FFB703]/40 text-[#FFB703] shadow-lg shadow-[#FFB703]/10">
              <CrownIcon className="w-6 h-6" />
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08]">
                Explore Space
              </h1>
              <p className="text-xs font-mono tracking-widest text-[#FF5E36] uppercase">
                CSEEL ANTARIKSHA LAB · EXPERIENTIAL COSMOS
              </p>
            </div>

            {/* Subtitle Description */}
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-normal">
              Equipping schools and colleges with research-grade telescope observatories, solar astrophysics instrumentation, and dark-sky observation expeditions beyond the classroom.
            </p>

            {/* Orange/Coral Gradient CTA Button */}
            <div>
              <button
                onClick={() => handleOpenEnquiry('Hero Start Journey')}
                className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-[#FF5E36] to-[#FF2A54] hover:shadow-[0_0_25px_rgba(255,94,54,0.5)] active:scale-95 transition-all shadow-lg cursor-pointer group"
              >
                <span>Start Journey</span>
                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Floating Glassmorphic HUD Telemetry Card (Matching Reference Image) */}
            <div className="p-5 rounded-2xl bg-[#1C2337]/80 backdrop-blur-md border border-white/10 shadow-xl space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF5E36] animate-pulse" />
                  <span className="text-xs font-mono font-bold tracking-wider text-white">
                    0.8M OPTICAL ARRAY
                  </span>
                </div>
                <span className="text-[10px] font-mono text-cyan-400">
                  GOTO TRACKING: ACTIVE
                </span>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed">
                Automated equatorial drive tracking celestial coordinates with sub-arcsecond sidereal precision. Capturing real-time light curves and spectroscopic data.
              </p>

              <div className="flex items-center gap-4 pt-1 text-[11px] font-mono text-gray-400">
                <span>RA: 05h 35m 17s</span>
                <span>DEC: -05° 23′ 28″</span>
              </div>
            </div>

          </div>

          {/* Right Column: Giant Ringed Planet & Blasting Rocket */}
          <div className="lg:col-span-7 relative flex items-center justify-center">
            <div className="relative w-full max-w-[640px] aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="/images/antariksha/dribbble_rocket_planet.webp"
                alt="Vibrant orange ringed planet and rocket spaceship blasting into space"
                className="w-full h-full object-cover object-center filter contrast-105"
              />
              {/* Seamless Vignette Blending into Background */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#13192B]/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#13192B]/40 via-transparent to-[#13192B]/30 pointer-events-none" />
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          3. SECTION 2: COCKPIT DASHBOARD & TELEMETRY GAUGES
             (Exact 1:1 Layout from Mid Section of Reference Image)
         ======================================================== */}
      <section id="telemetry" className="relative z-10 w-full px-6 lg:px-16 py-16 lg:py-24 border-t border-white/10 bg-[#101524]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Heading, Description & Button */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2">
              <span className="w-6 h-[2px] bg-[#FF5E36]" />
              <span className="text-xs font-mono font-bold tracking-widest text-[#FF5E36] uppercase">
                TELEMETRY &amp; LAB CONTROLS
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.12]">
              Observatory Telemetry &amp; Controls
            </h2>

            <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-normal">
              Real-time monitoring parameters for school observatory domes. Students control optical focal lengths, measure solar prominence flux, and analyze CCD astrophotometry from interactive mission dashboards.
            </p>

            <div className="pt-2">
              <button
                onClick={() => handleOpenEnquiry('Observatory Telemetry Enquiry')}
                className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-[#FF5E36] to-[#FF2A54] hover:shadow-[0_0_20px_rgba(255,94,54,0.4)] active:scale-95 transition-all shadow-md cursor-pointer"
              >
                <span>View Full Parameters</span>
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: 6 Circular HUD Gauges & Cockpit Dials */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
              
              {/* Dial 1: Optical Alignment */}
              <div className="p-5 rounded-2xl bg-[#192136] border border-white/10 flex flex-col items-center text-center space-y-3 group hover:border-cyan-400/40 transition-all shadow-lg">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-white/10"
                      strokeWidth="3"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-cyan-400"
                      strokeDasharray="98, 100"
                      strokeWidth="3"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-sm font-black font-mono text-white">
                    98%
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Collimation</div>
                  <div className="text-[10px] font-mono text-gray-400">Optics Precision</div>
                </div>
              </div>

              {/* Dial 2: Aperture Capacity */}
              <div className="p-5 rounded-2xl bg-[#192136] border border-white/10 flex flex-col items-center text-center space-y-3 group hover:border-[#FF5E36]/40 transition-all shadow-lg">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-white/10"
                      strokeWidth="3"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-[#FF5E36]"
                      strokeDasharray="85, 100"
                      strokeWidth="3"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-black font-mono text-white">
                    400mm
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Aperture Tube</div>
                  <div className="text-[10px] font-mono text-gray-400">Primary Mirror</div>
                </div>
              </div>

              {/* Dial 3: Solar H-Alpha */}
              <div className="p-5 rounded-2xl bg-[#192136] border border-white/10 flex flex-col items-center text-center space-y-3 group hover:border-amber-400/40 transition-all shadow-lg">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-white/10"
                      strokeWidth="3"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-amber-400"
                      strokeDasharray="92, 100"
                      strokeWidth="3"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-[11px] font-black font-mono text-white">
                    656.3 nm
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold text-white">H-Alpha Solar</div>
                  <div className="text-[10px] font-mono text-gray-400">Etalon Bandwidth</div>
                </div>
              </div>

              {/* Dial 4: Deep Sky Catalogues */}
              <div className="p-5 rounded-2xl bg-[#192136] border border-white/10 flex flex-col items-center text-center space-y-3 group hover:border-purple-400/40 transition-all shadow-lg">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-white/10"
                      strokeWidth="3"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-purple-400"
                      strokeDasharray="95, 100"
                      strokeWidth="3"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-black font-mono text-white">
                    10K+
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Messier &amp; NGC</div>
                  <div className="text-[10px] font-mono text-gray-400">Celestial Catalog</div>
                </div>
              </div>

              {/* Dial 5: GoTo Tracking Precision */}
              <div className="p-5 rounded-2xl bg-[#192136] border border-white/10 flex flex-col items-center text-center space-y-3 group hover:border-emerald-400/40 transition-all shadow-lg">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-white/10"
                      strokeWidth="3"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-emerald-400"
                      strokeDasharray="90, 100"
                      strokeWidth="3"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-black font-mono text-white">
                    0.02&quot;
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Sidereal Drive</div>
                  <div className="text-[10px] font-mono text-gray-400">Tracking Error</div>
                </div>
              </div>

              {/* Dial 6: Dark Sky Index */}
              <div className="p-5 rounded-2xl bg-[#192136] border border-white/10 flex flex-col items-center text-center space-y-3 group hover:border-cyan-300/40 transition-all shadow-lg">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-white/10"
                      strokeWidth="3"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-cyan-300"
                      strokeDasharray="100, 100"
                      strokeWidth="3"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-black font-mono text-white">
                    Class 1
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Bortle Scale</div>
                  <div className="text-[10px] font-mono text-gray-400">Dark Sky Camps</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          4. SECTION 3: ASTRONAUT & MISSION RESEARCH
             (Exact 1:1 Layout from Bottom Section of Reference Image)
         ======================================================== */}
      <section id="observatory" className="relative z-10 w-full px-6 lg:px-16 py-16 lg:py-24 border-t border-white/10 bg-[#13192B]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Curriculum, Checklist, Stat Bars & Badges */}
          <div className="lg:col-span-6 space-y-8">
            
            <div className="space-y-3">
              <div className="text-xs font-mono font-bold tracking-widest text-[#FF5E36] uppercase">
                ACADEMIC CURRICULUM
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.12]">
                Experiential Astronomy Program
              </h2>
            </div>

            <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-normal">
              Structured hands-on learning modules developed for CBSE, ICSE, and IB schools. Students progress from lens optics to computerized CCD spectroscopy and ISRO mission tracking.
            </p>

            {/* Glowing Dot Checklist */}
            <div className="space-y-3 text-xs sm:text-sm text-gray-200">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#FF5E36] shadow-[0_0_8px_#FF5E36]" />
                <span>Hands-on Newtonian, Refractor and Schmidt-Cassegrain optics assembly</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]" />
                <span>Photometric measurement of variable star light curves and exoplanet transits</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
                <span>ISRO Chandrayaan &amp; Aditya-L1 real-time telemetry analysis</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                <span>High-altitude Himalayan dark sky observation camps under Bortle 1 skies</span>
              </div>
            </div>

            {/* 3 Metric Columns with Red/Coral Accent Bars (Matching Reference Image) */}
            <div className="grid grid-cols-3 gap-6 pt-4 border-t border-white/10">
              <div className="space-y-1.5">
                <div className="w-8 h-[2px] bg-[#FF5E36]" />
                <div className="text-xl sm:text-2xl font-black font-mono text-white">400mm</div>
                <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Aperture Size</div>
              </div>

              <div className="space-y-1.5">
                <div className="w-8 h-[2px] bg-cyan-400" />
                <div className="text-xl sm:text-2xl font-black font-mono text-white">0.02&quot;</div>
                <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">GoTo Precision</div>
              </div>

              <div className="space-y-1.5">
                <div className="w-8 h-[2px] bg-amber-400" />
                <div className="text-xl sm:text-2xl font-black font-mono text-white">FITS</div>
                <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Raw Astrometry</div>
              </div>
            </div>

            {/* 3 Feature Icon Badges (Matching Reference Image) */}
            <div className="flex items-center gap-4 pt-2">
              <div className="w-10 h-10 rounded-full bg-[#1C2337] border border-white/10 flex items-center justify-center text-cyan-400 shadow-md">
                <TelescopeIcon className="w-4 h-4" />
              </div>
              <div className="w-10 h-10 rounded-full bg-[#1C2337] border border-white/10 flex items-center justify-center text-[#FF5E36] shadow-md">
                <SunIcon className="w-4 h-4" />
              </div>
              <div className="w-10 h-10 rounded-full bg-[#1C2337] border border-white/10 flex items-center justify-center text-amber-400 shadow-md">
                <CompassIcon className="w-4 h-4" />
              </div>
              <span className="text-xs font-mono text-gray-400">
                CERTIFIED CURRICULUM · NEP 2020 COMPLIANT
              </span>
            </div>

          </div>

          {/* Right Column: Floating Astronaut with Ringed Planets Illustration */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            <div className="relative w-full max-w-[600px] aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="/images/antariksha/dribbble_astronaut_planets.webp"
                alt="Floating astronaut with red and blue ringed planets in deep space"
                className="w-full h-full object-cover object-center filter contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#13192B]/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-l from-[#13192B]/40 via-transparent to-[#13192B]/30 pointer-events-none" />
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          5. SECTION 4: INSTITUTIONAL TIERS (SKY LAB TO DOME)
         ======================================================== */}
      <section id="workshops" className="relative z-10 w-full px-6 lg:px-16 py-16 lg:py-24 border-t border-white/10 bg-[#101524]">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="text-xs font-mono font-bold tracking-widest text-[#FF5E36] uppercase">
              INSTITUTIONAL PACKAGES
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Astronomy Lab Tiers for Schools &amp; Colleges
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              Tailored configurations designed for elementary schools up to university research centers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Tier 1 */}
            <div className="p-8 rounded-2xl bg-[#192136] border border-white/10 flex flex-col justify-between space-y-6 hover:border-white/25 transition-all shadow-lg">
              <div className="space-y-4">
                <div className="text-xs font-mono font-bold text-gray-400">TIER 01</div>
                <h3 className="text-2xl font-black text-white">Sky Explorer Lab</h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Introductory observational setup with portable reflector telescopes and celestial navigation charts.
                </p>
                <div className="space-y-2 pt-2 text-xs text-gray-300">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF5E36]" />
                    <span>2x 150mm Newtonian Reflector Telescopes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF5E36]" />
                    <span>White-Light Solar Projection Kit</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF5E36]" />
                    <span>Constellation Maps &amp; Student Manuals</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleOpenEnquiry('Tier 1: Sky Explorer Lab')}
                className="w-full py-3 rounded-full text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/15 transition-all cursor-pointer"
              >
                Enquire for Tier 01
              </button>
            </div>

            {/* Tier 2: Highlighted */}
            <div className="p-8 rounded-2xl bg-[#1C253D] border border-[#FF5E36] flex flex-col justify-between space-y-6 shadow-xl shadow-[#FF5E36]/10 relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#FF5E36] to-[#FF2A54] text-[10px] font-bold text-white tracking-widest uppercase">
                MOST POPULAR
              </div>
              <div className="space-y-4">
                <div className="text-xs font-mono font-bold text-[#FF5E36]">TIER 02</div>
                <h3 className="text-2xl font-black text-white">Astro-Research Lab</h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Complete setup with computerized GoTo tracking, dedicated H-Alpha solar scope, and astrophotography kit.
                </p>
                <div className="space-y-2 pt-2 text-xs text-gray-200">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>8&quot; Computerized GoTo Schmidt-Cassegrain</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>H-Alpha Dedicated Solar Scope (0.5Å)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Cooled Astrophotography Camera &amp; Guider</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleOpenEnquiry('Tier 2: Astro-Research Lab')}
                className="w-full py-3.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#FF5E36] to-[#FF2A54] hover:shadow-[0_0_20px_rgba(255,94,54,0.4)] active:scale-95 transition-all cursor-pointer"
              >
                Enquire for Tier 02
              </button>
            </div>

            {/* Tier 3 */}
            <div className="p-8 rounded-2xl bg-[#192136] border border-white/10 flex flex-col justify-between space-y-6 hover:border-white/25 transition-all shadow-lg">
              <div className="space-y-4">
                <div className="text-xs font-mono font-bold text-gray-400">TIER 03</div>
                <h3 className="text-2xl font-black text-white">Observatory Dome</h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Turnkey motorized rooftop observatory dome for premier universities and flagship campuses.
                </p>
                <div className="space-y-2 pt-2 text-xs text-gray-300">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>3.0m - 5.0m Motorized Slit Observatory Dome</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>11&quot; - 14&quot; Research Optical Tube Assembly</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>Automated Weather &amp; Cloud Tracking Sensor</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleOpenEnquiry('Tier 3: Observatory Dome')}
                className="w-full py-3 rounded-full text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/15 transition-all cursor-pointer"
              >
                Enquire for Tier 03
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          6. INSTITUTIONAL FOOTER
         ======================================================== */}
      <footer className="relative z-10 w-full px-6 lg:px-16 py-12 border-t border-white/10 bg-[#0E1321]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-3">
            <Link href="/" className="hover:opacity-90 transition-opacity">
              <img
                src="/images/cseel-logo-white.svg"
                alt="CSEEL - Center for Scientific Exploration and Experiential Learning"
                className="h-8 w-auto object-contain"
              />
            </Link>
            <span className="text-xs font-mono text-gray-500">
              · ANTARIKSHA ASTRONOMY
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs text-gray-400">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <a href="#observatory" className="hover:text-white transition-colors">Observatory</a>
            <a href="#workshops" className="hover:text-white transition-colors">Workshops</a>
            <a href="#telemetry" className="hover:text-white transition-colors">Telemetry</a>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
          </div>

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

        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-white/5 text-center text-xs font-mono text-gray-500">
          &copy; {new Date().getFullYear()} CSEEL — Center for Scientific Exploration and Experiential Learning.
        </div>
      </footer>

      {/* ========================================================
          7. DEDICATED ENQUIRY MODAL (FAST LEAD CONVERSION)
         ======================================================== */}
      {enquiryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#192136] border border-[#FF5E36]/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-white">
            
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
                  <div className="flex items-center gap-2 text-[#FF5E36] text-xs font-mono font-bold uppercase tracking-wider">
                    <TelescopeIcon className="w-4 h-4" />
                    <span>Antariksha Lab Enquiry</span>
                  </div>
                  <h3 className="text-2xl font-black text-white">Get Started With CSEEL</h3>
                  <p className="text-xs text-gray-300">
                    Connect with our astrophysics mentors to discuss school astronomy lab setups, night sky observation sessions, or teacher training.
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#FF5E36]"
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#FF5E36]"
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#FF5E36]"
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#FF5E36]"
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#FF5E36]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Program of Interest</label>
                    <select
                      value={formData.program}
                      onChange={e => setFormData({ ...formData, program: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#111728] border border-white/10 text-white text-sm focus:outline-none focus:border-[#FF5E36]"
                    >
                      <option value="Antariksha Astronomy Lab Setup">Antariksha Lab Setup</option>
                      <option value="Telescope Night Stargazing Session">Night Stargazing Session</option>
                      <option value="Campus Observatory Dome">Campus Observatory Dome</option>
                      <option value="Solar & Space Workshop">Solar &amp; Space Workshop</option>
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
                    placeholder="Tell us about your campus grade levels or preferred timeline..."
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#FF5E36] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-[#FF5E36] to-[#FF2A54] hover:shadow-[0_0_20px_rgba(255,94,54,0.4)] transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
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
                  Thank you, <span className="font-semibold text-[#FF5E36]">{formData.name}</span>. Our Antariksha space and astronomy team will connect with your institution within 24 hours.
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
