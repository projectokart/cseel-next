'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import PageTransition from '@/components/shared/PageTransition';
import {
  MapPin, Clock, ExternalLink, Share2, Check, CheckCheck,
  Building2, GraduationCap, Briefcase, Calendar, ShieldCheck,
  Sparkles, Award, ArrowLeft, RefreshCw
} from 'lucide-react';
import { FacultyJobItem } from '@/data/facultyJobsData';
import { formatStructuredAddress, formatCleanSalary, getSourceDisplayName, getSourceBadgeColor } from '@/lib/jobCardUtils';

const FacultyJobMap = dynamic(() => import('@/components/teachers/FacultyJobMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-72 bg-slate-100 rounded-2xl flex items-center justify-center text-xs font-bold text-slate-500 animate-pulse">
      Loading Location Map...
    </div>
  ),
});

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
        return 'bg-emerald-50 text-emerald-700 border-emerald-300';
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
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-sm relative flex items-center justify-center">
                  {job.organisationLogo ? (
                    <img
                      src={job.organisationLogo}
                      alt={job.organisationName}
                      className="w-full h-full object-contain p-1"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                        const fb = (e.target as HTMLElement).parentElement?.querySelector('.monogram-single') as HTMLElement;
                        if (fb) fb.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div
                    className={`monogram-single w-full h-full bg-blue-50 text-[#006FCC] font-black text-xl sm:text-2xl items-center justify-center uppercase select-none ${job.organisationLogo ? 'hidden' : 'flex'}`}
                  >
                    {(job.organisationName || 'SC').slice(0, 2)}
                  </div>
                </div>

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

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-slate-600 font-medium">
                    <span className="font-bold text-slate-900 flex items-center gap-1">
                      <Building2 className="w-4 h-4 text-[#005689]" />
                      <span>{job.organisationName}</span>
                    </span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span>{formatStructuredAddress(job)}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons & Salary Strip */}
              <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-3 shrink-0">
                <div className="text-left md:text-right">
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Offered Compensation</div>
                  <div className={`text-xl sm:text-2xl font-black ${job.salary && job.salary !== '---' && job.salary !== 'Not Disclosed' ? 'text-emerald-700' : 'text-slate-700'}`}>
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
                        <span className="text-emerald-700">Link Copied!</span>
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
                    Application Status: <strong className="text-emerald-700">Open & Active</strong>
                  </div>
                )}
              </div>

              {/* Description Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900" style={{ color: '#003c6e' }}>
                    Job Role & Pedagogical Scope
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 mt-2 leading-relaxed">
                    {job.shortDescription}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Key Lab Responsibilities</h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#005689] mt-2 shrink-0" />
                      <span>Conduct experiential hands-on practicals, demonstrations, and NEP 2020 inquiry-based investigation sets.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#005689] mt-2 shrink-0" />
                      <span>Prepare senior secondary students for CBSE / ICSE external viva examinations, lab logbook maintenance, and project assessments.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#005689] mt-2 shrink-0" />
                      <span>Adhere strictly to composite science laboratory safety standards (CBSE SARAS 4.4 and emergency neutralization protocols).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#005689] mt-2 shrink-0" />
                      <span>Guide student innovators for science fairs, Olympiads, and inter-school ATL maker hackathons.</span>
                    </li>
                  </ul>
                </div>

                {/* Direct Apply Callout Box */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6">
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900" style={{ color: '#003c6e' }}>
                      Ready to submit your application?
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      This opening is hosted on {job.source}. Click below to view the official vacancy listing and submit your resume.
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

              {/* Interactive Location Map */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#005689]">Geographic Location</span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5" style={{ color: '#003c6e' }}>
                      School Campus Location
                    </h3>
                  </div>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{job.city}, {job.state}</span>
                  </span>
                </div>

                <FacultyJobMap
                  activeTab="jobs"
                  jobs={[job]}
                  faculty={[]}
                  className="h-72 w-full rounded-2xl overflow-hidden border border-slate-200 shadow-2xs relative"
                />
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
                    <span className={`font-bold ${job.salary && job.salary !== '---' && job.salary !== 'Not Disclosed' ? 'text-emerald-700' : 'text-slate-700'}`}>
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

          {/* ─── RELATED VACANCIES (Strict 2-3-4 Responsive Grid) ─── */}
          {relatedJobs.length > 0 && (
            <div className="mt-14 pt-8 border-t border-slate-200 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#005689]">Similar Opportunities</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5" style={{ color: '#003c6e' }}>
                    Related STEM Teaching Vacancies
                  </h3>
                </div>
                <Link
                  href="/edu-network/teachers"
                  className="text-xs font-bold text-[#005689] hover:underline"
                >
                  View All Active Openings
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
                {relatedJobs.map((rj) => (
                  <div
                    key={rj.id}
                    className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-[#005689]/40 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-1">
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 text-[10px] font-bold border border-blue-200">
                          {rj.designation} · {rj.subject}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${getSourceBadgeColor(rj.source)}`}>
                          {rj.source}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 line-clamp-2" style={{ color: '#003c6e' }}>
                        {rj.jobPostName}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">{rj.organisationName}</p>

                      <div className="text-[11px] font-bold text-emerald-700">{formatCleanSalary(rj.salary, false)}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{rj.city}</span>
                      </div>
                    </div>

                    <div className="pt-3 mt-3 border-t border-slate-100 flex items-center gap-2">
                      <Link
                        href={`/edu-network/teachers/job/${rj.id}`}
                        className="flex-1 py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold text-center transition-all"
                      >
                        Details
                      </Link>
                      <a
                        href={rj.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-1.5 px-2 rounded-lg bg-[#005689] hover:bg-[#003c6e] text-white text-[11px] font-bold text-center transition-all"
                      >
                        Apply
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </section>

      </div>
    </PageTransition>
  );
}
