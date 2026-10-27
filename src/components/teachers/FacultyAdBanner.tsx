'use client';

import React from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Building2,
  CheckCircle2,
  Award,
  Zap,
  Users
} from 'lucide-react';

interface FacultyAdBannerProps {
  variant?: 'top' | 'feed';
  className?: string;
  onRegisterClick?: () => void;
}

export default function FacultyAdBanner({
  variant = 'top',
  className = '',
  onRegisterClick
}: FacultyAdBannerProps) {
  const registerUrl = '/edu-network/teachers/register';

  if (variant === 'top') {
    return (
      <div
        className={`w-full relative overflow-hidden rounded-2xl sm:rounded-3xl border border-sky-200/80 bg-gradient-to-br from-[#003B64] via-[#004A75] to-[#012542] text-white shadow-md sm:shadow-lg transition-all duration-300 hover:shadow-xl ${className}`}
      >
        {/* Subtle decorative glow and grid backdrop */}
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-emerald-400/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-5 sm:gap-6 p-4 sm:p-6 lg:p-7">
          {/* Left Text / Value Prop Content */}
          <div className="flex-1 min-w-0 space-y-3 sm:space-y-3.5 text-center lg:text-left">
            {/* Top pill tag */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-400/15 border border-cyan-300/30 text-cyan-200 text-[11px] sm:text-xs font-bold tracking-wide uppercase backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
              <span>Nationwide Faculty Placement 2026-27</span>
            </div>

            {/* Main Punchy Heading */}
            <div className="space-y-1">
              <h2 className="font-['Montserrat',sans-serif] text-xl sm:text-2xl lg:text-[26px] font-extrabold tracking-tight leading-snug sm:leading-tight text-white">
                Are You a School Teacher or STEM Educator?
              </h2>
              <p className="text-cyan-100 text-xs sm:text-sm sm:leading-relaxed font-normal max-w-xl mx-auto lg:mx-0">
                Get direct interview calls from <span className="font-bold text-white">2,180+ top CBSE, ICSE &amp; International schools</span> across India. Build your verified digital portfolio today.
              </p>
            </div>

            {/* Key Benefit Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-0.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 text-white text-[11px] sm:text-xs font-semibold backdrop-blur-xs border border-white/10">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                Verified Educator Badge
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 text-white text-[11px] sm:text-xs font-semibold backdrop-blur-xs border border-white/10">
                <TrendingUp className="w-3.5 h-3.5 text-cyan-300" />
                Up to ₹18 LPA Salary Bands
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 text-white text-[11px] sm:text-xs font-semibold backdrop-blur-xs border border-white/10">
                <Building2 className="w-3.5 h-3.5 text-amber-300" />
                Direct Principal Connect
              </span>
            </div>

            {/* CTA Button Row */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 w-full sm:w-auto">
              <Link
                href={registerUrl}
                onClick={onRegisterClick}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:shadow-[0_0_28px_rgba(16,185,129,0.55)] transition-all duration-200 active:scale-98 group cursor-pointer"
                title="Register You As Faculty"
              >
                <GraduationCap className="w-4 h-4 text-slate-950" />
                <span>Register You As Faculty</span>
                <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
              </Link>

              <span className="text-[11px] sm:text-xs text-cyan-200/80 font-medium">
                ⚡ 100% Free • Verified within 24 hrs
              </span>
            </div>
          </div>

          {/* Right Banner Image Artwork */}
          <div className="w-full sm:w-80 lg:w-96 shrink-0 relative flex items-center justify-center">
            <div className="w-full max-h-52 sm:max-h-60 rounded-2xl overflow-hidden border border-white/20 shadow-2xl relative group/img bg-slate-900/40">
              <img
                src="/images/banners/faculty-top-banner.webp"
                alt="Register You As Faculty on CSEEL"
                className="w-full h-full object-cover object-center group-hover/img:scale-105 transition-transform duration-500"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
              
              {/* Floating pill on image */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-slate-900/85 backdrop-blur-md rounded-xl p-2 border border-white/15 flex items-center justify-between text-[11px] text-white">
                <span className="flex items-center gap-1.5 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Active Hiring Drive
                </span>
                <span className="text-emerald-300 font-extrabold">2,180+ Schools</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── IN-FEED INTERSTITIAL ADVERTISEMENT BANNER (BETWEEN JOB CARDS) ──
  return (
    <div
      className={`w-full relative overflow-hidden rounded-2xl sm:rounded-3xl border-2 border-indigo-200/90 bg-gradient-to-br from-[#0B2545] via-[#133E68] to-[#041B33] text-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-cyan-400/80 ${className}`}
    >
      {/* Decorative ambient lights */}
      <div className="absolute top-0 right-1/4 w-72 h-72 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-64 h-64 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />

      {/* Top Banner Tag: Sponsored / Career Accelerator */}
      <div className="px-4 sm:px-6 pt-3.5 sm:pt-4 pb-0 flex items-center justify-between border-b border-white/10 text-[10px] sm:text-[11px] font-bold text-cyan-200">
        <span className="flex items-center gap-1.5 uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>CSEEL Career Spotlight • Verified Faculty Registry</span>
        </span>
        <span className="bg-white/10 px-2 py-0.5 rounded text-[9.5px] uppercase tracking-wider text-slate-300 font-semibold border border-white/10">
          Advertisement
        </span>
      </div>

      <div className="p-4 sm:p-6 lg:p-7 flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6">
        {/* Banner Graphic (Left on desktop/tablet, Top on mobile) */}
        <div className="w-full md:w-72 lg:w-84 shrink-0">
          <div className="w-full h-44 sm:h-48 md:h-52 rounded-2xl overflow-hidden border border-white/20 shadow-xl relative group/card bg-slate-900/50">
            <img
              src="/images/banners/faculty-ad-banner-3d.webp"
              alt="Register You As Faculty"
              className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
            
            {/* Quick Stat Overlay */}
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/10 text-[11px]">
              <span className="text-slate-200 font-medium">Shortlisting Time</span>
              <span className="text-emerald-400 font-bold">&lt; 48 Hours</span>
            </div>
          </div>
        </div>

        {/* Banner Content (Right on desktop/tablet) */}
        <div className="flex-1 min-w-0 space-y-3 sm:space-y-3.5 text-center md:text-left">
          <div className="space-y-1 sm:space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-emerald-400 font-bold text-xs uppercase tracking-wide">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Priority Recommendation for Registered Faculty</span>
            </div>
            <h3 className="font-['Montserrat',sans-serif] text-lg sm:text-xl lg:text-2xl font-extrabold text-white leading-snug">
              Stop Applying One-By-One. Let Top Schools Find You!
            </h3>
            <p className="text-slate-200 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto md:mx-0">
              When you register as faculty on CSEEL, your verified profile is shared directly with hiring principals looking for PGT, TGT, PRT, Science, Math &amp; Robotics educators.
            </p>
          </div>

          {/* Quick Features List */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-left">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10">
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-[11px] sm:text-xs text-slate-100 font-medium">NEP 2020 Certified</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10">
              <Users className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="text-[11px] sm:text-xs text-slate-100 font-medium">Pan-India Reach</span>
            </div>
            <div className="col-span-2 sm:col-span-1 flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10">
              <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-[11px] sm:text-xs text-slate-100 font-medium">Fast Interview Calls</span>
            </div>
          </div>

          {/* CTA Action Button */}
          <div className="pt-1 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3">
            <Link
              href={registerUrl}
              onClick={onRegisterClick}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:shadow-[0_0_28px_rgba(16,185,129,0.55)] transition-all duration-200 active:scale-98 group cursor-pointer"
              title="Register You As Faculty"
            >
              <GraduationCap className="w-4 h-4 text-slate-950" />
              <span>Register You As Faculty</span>
              <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
            </Link>

            <span className="text-[11px] sm:text-xs text-cyan-200/80 font-medium">
              Join 12,400+ verified school educators
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
