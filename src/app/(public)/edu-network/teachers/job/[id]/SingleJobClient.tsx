'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PageTransition from '@/components/shared/PageTransition';
import {
  MapPin, Clock, ExternalLink, Share2, Check, CheckCheck,
  Building2, GraduationCap, Briefcase, Calendar, ShieldCheck,
  Sparkles, Award, ArrowLeft, RefreshCw
} from 'lucide-react';
import { FacultyJobItem } from '@/data/facultyJobsData';
import { formatStructuredAddress, formatCleanSalary, getSourceDisplayName, getSourceBadgeColor, extractPureLocalAddress, getGoogleMapsSearchUrl } from '@/lib/jobCardUtils';
import { trackCseelEvent } from '@/components/analytics/AnalyticsScripts';

interface Props {
  job: FacultyJobItem;
  relatedJobs: FacultyJobItem[];
}

export default function SingleJobClient({ job, relatedJobs }: Props) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const getSourceBadgeColor = (source: string) => {
    switch (source) {
      case 'LinkedIn':
        return 'bg-[#0A66C2]/10 text-[#0A66C2] border-[#0A66C2]/30';
      case 'Indeed':
        return 'bg-[#003A9B]/10 text-[#003A9B] border-[#003A9B]/30';
      case 'Naukri.com':
        return 'bg-[#1A73E8]/10 text-[#1A73E8] border-[#1A73E8]/30';
      case 'TimesJobs':
        return 'bg-[#C5221F]/10 text-[#C5221F] border-[#C5221F]/30';
      default:
        return 'bg-emerald-50 text-[#0F9D58] border-emerald-300';
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-28">

        {/* ─── BREADCRUMB & BACK NAVIGATION ─── */}
        <section className="bg-white border-b border-slate-200 py-3 px-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 text-xs font-medium text-slate-600">
            <div className="flex items-center gap-2 overflow-hidden truncate">
              <Link href="/" className="hover:text-[#005689] transition-colors">Home</Link>
              <span className="text-slate-300">/</span>
              <Link href="/edu-network/teachers" className="hover:text-[#005689] transition-colors">STEM Faculty & Jobs</Link>
              <span className="text-slate-300">/</span>
              <span className="text-slate-900 font-bold truncate">{job.jobPostName}</span>
            </div>

            <Link
              href="/edu-network/teachers"
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all shrink-0 flex items-center gap-1.5"
            >
              <span>Back to All Jobs</span>
            </Link>
          </div>
        </section>

        {/* ─── JOB HEADER HERO SECTION ─── */}
        <section className="bg-white border-b border-slate-200/80 py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              
              <div className="flex items-start gap-4 sm:gap-5">
                {/* School Logo: Only show if valid URL exists. Hide completely if not available so no space is wasted */}
                {job.organisationLogo && job.organisationLogo.trim() !== '' ? (
                  <div className="single-logo-box w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-white border border-slate-200 shrink-0 shadow-sm relative flex items-center justify-center p-1.5">
                    <img
                      src={job.organisationLogo}
                      alt={job.organisationName}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        const box = (e.target as HTMLElement).closest('.single-logo-box') as HTMLElement;
                        if (box) box.style.display = 'none';
                      }}
                    />
                  </div>
                ) : null}

                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {job.designation && (
                      <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold">
                        {job.designation}
                      </span>
                    )}
                    {job.subject && (
                      <span className="px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-800 border border-purple-200 text-xs font-bold">
                        {job.subject}
                      </span>
                    )}
                    {job.board && (
                      <span className="px-2 py-0.5 rounded-md bg-cyan-50 text-cyan-800 border border-cyan-200 text-xs font-bold">
                        {job.board}
                      </span>
                    )}
                    {job.forLady && (
                      <span className="px-2.5 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold inline-flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                        Lady Only
                      </span>
                    )}
                    <span className={`px-2 py-0.5 rounded-md text-xs font-bold border ${getSourceBadgeColor(job.source)}`}>
                      Indexed via {job.source}
                    </span>
                    {job.badge && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
                        {job.badge}
                      </span>
                    )}
                  </div>

                  <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 leading-tight" style={{ color: '#003c6e' }}>
                    {job.jobPostName}
                  </h1>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs sm:text-sm text-slate-600 font-medium">
                    <span className="font-bold text-slate-900 flex items-center gap-1">
                      <Building2 className="w-4 h-4 text-[#005689]" />
                      <span>{job.organisationName}</span>
                    </span>
                    {(() => {
                      const structuredAddress = formatStructuredAddress(job);
                      return (
                        <a
                          href={getGoogleMapsSearchUrl(job)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start gap-1.5 text-slate-700 bg-slate-100/90 hover:bg-slate-200/80 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors group/maplink"
                          title={`Open Google Maps for ${job.organisationName}, ${structuredAddress}`}
                        >
                          <MapPin className="w-3.5 h-3.5 text-[#005689] group-hover/maplink:text-[#EA4335] shrink-0 mt-0.5 transition-colors" />
                          <span className="break-words leading-tight">{structuredAddress}</span>
                        </a>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* Action Buttons & Salary Strip */}
              <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-3 shrink-0">
                <div className="text-left md:text-right">
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Offered Compensation</div>
                  <div className={`text-xl sm:text-2xl font-black ${job.salary && job.salary !== '---' && job.salary !== 'Not Disclosed' ? 'text-[#0F9D58]' : 'text-slate-700'}`}>
                    {formatCleanSalary(job.salary, true)}
                  </div>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleShare}
                    className="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
                  >
                    {copied ? (
                      <>
                        <CheckCheck className="w-4 h-4 text-emerald-600" />
                        <span className="text-[#0F9D58]">Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-4 h-4 text-slate-500" />
                        <span>Share Job</span>
                      </>
                    )}
                  </button>

                  <a
                    href={job.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      trackCseelEvent('job_apply_click', {
                        job_id: job.id,
                        job_title: job.jobPostName,
                        school_name: job.organisationName,
                        city: job.city,
                        state: job.state,
                        salary: job.salary,
                        source: job.source,
                      });
                    }}
                    className="flex-1 sm:flex-initial py-2.5 px-6 rounded-xl bg-[#005689] hover:bg-[#003c6e] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
                  >
                    <ExternalLink className="w-4 h-4 shrink-0" />
                    <span>Apply on {job.source}</span>
                  </a>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ─── MAIN CONTENT TWO-COLUMN LAYOUT ─── */}
        <section className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left 2 Columns: Job Overview & Requirements */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Freshness & Validity Card */}
              <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-2 text-[#005689] font-bold">
                  <Clock className="w-4 h-4 shrink-0 text-[#005689]" />
                  <span>Verified Active Vacancy (Within 45-Day Retention Policy)</span>
                </div>
                {job.lastDate ? (
                  <div className="text-slate-600 font-semibold shrink-0">
                    Application Deadline: <strong className="text-slate-900">{job.lastDate}</strong>
                  </div>
                ) : (
                  <div className="text-slate-500 font-medium shrink-0">
                    Application Status: <strong className="text-[#0F9D58]">Open & Active</strong>
                  </div>
                )}
              </div>

              {/* Overview & Direct Apply Callout Box (Description kept empty per request) */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
                {/* Direct Apply Callout Box */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900" style={{ color: '#003c6e' }}>
                      Ready to submit your application?
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      This vacancy is hosted on {job.source}. Click below to visit the official portal and submit your application.
                    </p>
                  </div>
                  <a
                    href={job.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-5 rounded-xl bg-[#005689] hover:bg-[#003c6e] text-white text-xs font-bold inline-flex items-center gap-1.5 shrink-0 transition-all shadow-xs"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Apply on {job.source}</span>
                  </a>
                </div>
              </div>



            </div>

            {/* Right Column: Key Vacancy Parameters & Direct Summary */}
            <div className="space-y-6">
              
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3" style={{ color: '#003c6e' }}>
                  Vacancy Overview
                </h3>

                <div className="space-y-3.5 text-xs">
                  {job.designation && (
                    <div className="flex items-center justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">Designation</span>
                      <span className="font-bold text-slate-900">{job.designation}</span>
                    </div>
                  )}

                  {job.subject && (
                    <div className="flex items-center justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">Subject</span>
                      <span className="font-bold text-slate-900">{job.subject}</span>
                    </div>
                  )}

                  {job.board && (
                    <div className="flex items-center justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">Curriculum Board</span>
                      <span className="font-bold text-slate-900">{job.board}</span>
                    </div>
                  )}

                  {job.roleType && (
                    <div className="flex items-center justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">Employment Type</span>
                      <span className="font-bold text-slate-900">{job.roleType}</span>
                    </div>
                  )}

                  {job.minExperience && (
                    <div className="flex items-center justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">Experience</span>
                      <span className="font-bold text-slate-900">{job.minExperience}+ Years</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Compensation</span>
                    <span className={`font-bold ${job.salary && job.salary !== '---' && job.salary !== 'Not Disclosed' ? 'text-[#0F9D58]' : 'text-slate-700'}`}>
                      {formatCleanSalary(job.salary, true)}
                    </span>
                  </div>

                  {job.openingDate && (
                    <div className="flex items-center justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">Opening Date</span>
                      <span className="font-bold text-slate-700">{job.openingDate}</span>
                    </div>
                  )}

                  {job.lastDate && (
                    <div className="flex items-center justify-between py-1">
                      <span className="text-slate-500">Application Deadline</span>
                      <span className="font-bold text-amber-700">{job.lastDate}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <a
                    href={job.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      trackCseelEvent('job_apply_click', {
                        job_id: job.id,
                        job_title: job.jobPostName,
                        school_name: job.organisationName,
                        city: job.city,
                        state: job.state,
                        salary: job.salary,
                        source: job.source,
                      });
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-[#005689] hover:bg-[#003c6e] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Apply on {job.source}</span>
                  </a>
                </div>
              </div>

              {/* Share & Index Notice */}
              <div className="bg-slate-100/70 rounded-3xl p-5 border border-slate-200/80 space-y-3 text-xs">
                <div className="flex items-center gap-2 text-slate-800 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>CSEEL Real-Time Indexer</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  This vacancy is indexed from public educational job boards. CSEEL does not charge any fee from applicants. Always verify authentic school domains before sharing sensitive credentials.
                </p>
                <button
                  type="button"
                  onClick={handleShare}
                  className="w-full py-2 px-3 rounded-xl bg-white hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all border border-slate-300 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copied ? 'Link Copied!' : 'Copy Permanent Job Link'}</span>
                </button>
              </div>

            </div>

          </div>

          {/* ─── NEARBY & SIMILAR VACANCIES (Zero Bounce Engine) ─── */}
          {relatedJobs.length > 0 && (
            <div className="mt-14 pt-8 border-t border-slate-200 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Verified Nearby Vacancies
                    </span>
                    <span className="text-xs text-slate-500 font-medium hidden sm:inline">• Zero Application Fees</span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mt-1" style={{ color: '#003c6e' }}>
                    More Teaching Positions near {job.city || job.district || 'this Location'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Explore similar school teaching openings in {job.city || job.state || 'India'} matching your subject background.
                  </p>
                </div>
                <Link
                  href="/edu-network/teachers"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#005689] hover:text-[#003c6e] hover:underline whitespace-nowrap self-start sm:self-auto"
                >
                  <span>Explore All 2,300+ School Openings</span>
                  <span>&rarr;</span>
                </Link>
              </div>

              <div className="flex flex-row overflow-x-auto gap-4 pb-4 pt-1 scroll-smooth snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0">
                {relatedJobs.map((rj) => {
                  const isSameCity = Boolean(job.city && rj.city && job.city.toLowerCase() === rj.city.toLowerCase());
                  return (
                    <div
                      key={rj.id}
                      className="min-w-[280px] sm:min-w-[320px] max-w-[340px] shrink-0 snap-start bg-white rounded-2xl p-4 border border-slate-200/90 hover:border-[#005689] shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between gap-1">
                          <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-900 text-[10px] font-bold border border-blue-200 truncate max-w-[140px]">
                            {rj.designation || 'Teacher'} · {rj.subject || 'Faculty'}
                          </span>
                          {isSameCity ? (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
                              Nearby
                            </span>
                          ) : (
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border shrink-0 ${getSourceBadgeColor(rj.source)}`}>
                              {rj.source}
                            </span>
                          )}
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 line-clamp-2 group-hover:text-[#005689] transition-colors leading-snug" style={{ color: '#003c6e' }}>
                          {rj.jobPostName}
                        </h4>

                        <p className="text-[11px] font-medium text-slate-600 truncate flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{rj.organisationName}</span>
                        </p>

                        <div className="flex items-center justify-between pt-1">
                          <div className="text-xs font-extrabold text-[#0F9D58]">
                            {formatCleanSalary(rj.salary, false)}
                          </div>
                          <div className="text-[10.5px] text-slate-500 font-medium flex items-start gap-1 max-w-[150px]">
                            <MapPin className="w-2.5 h-2.5 text-slate-400 shrink-0 mt-0.5" />
                            <span className="break-words leading-tight">{formatStructuredAddress(rj)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 mt-3 border-t border-slate-100 flex items-center gap-2">
                        <Link
                          href={`/edu-network/teachers/job/${rj.id}`}
                          className="flex-1 py-1.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold text-center transition-all"
                        >
                          Details
                        </Link>
                        <a
                          href={rj.originalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => {
                            trackCseelEvent('job_apply_click', {
                              job_id: rj.id,
                              job_title: rj.jobPostName,
                              school_name: rj.organisationName,
                              city: rj.city,
                              salary: rj.salary,
                              source: rj.source,
                            });
                          }}
                          className="flex-1 py-1.5 px-2 rounded-xl bg-[#005689] hover:bg-[#003c6e] text-white text-[11px] font-bold text-center transition-all flex items-center justify-center gap-1"
                        >
                          <span>Apply</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </section>

        {/* ─── MOBILE STICKY FLOATING ACTION BAR (70.8% Traffic Conversion Engine) ─── */}
        <div className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-slate-950/95 backdrop-blur-lg border-t border-slate-800 px-4 py-3 shadow-2xl safe-bottom">
          <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block truncate">
                {job.designation || 'Teaching Faculty'} • {formatCleanSalary(job.salary, true)}
              </span>
              <span className="text-xs font-bold text-white truncate block">
                {job.organisationName}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleShare}
                aria-label="Share Job"
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 active:scale-95 transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>
              <a
                href={job.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackCseelEvent('job_apply_click', {
                    job_id: job.id,
                    job_title: job.jobPostName,
                    school_name: job.organisationName,
                    city: job.city,
                    state: job.state,
                    salary: job.salary,
                    source: job.source,
                  });
                }}
                className="py-2.5 px-4 rounded-xl bg-[#005689] hover:bg-[#003c6e] text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-blue-900/30 active:scale-95 transition-all whitespace-nowrap"
              >
                <span>Apply Now</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

      </div>
    </PageTransition>
  );
}
