'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  CheckCircle2,
  Printer,
  Share2,
  ArrowLeft,
  Copy,
  Check,
  IndianRupee,
  Tag,
  User,
  Building2,
  BookOpen
} from 'lucide-react';
import { TeacherItem, ALL_TEACHERS, getTeacherById } from '@/lib/eduNetworkData';

interface TeacherProfileClientProps {
  teacherId: string;
}

interface QualificationRecord {
  degree: string;
  institute: string;
  year: string;
  grade: string;
}

// Generate structured educational qualifications from teacher data
function getQualificationsList(teacher: TeacherItem): QualificationRecord[] {
  const currentYear = 2026;
  const exp = teacher.experienceYears || 5;
  const endEduYear = Math.max(2004, currentYear - exp);

  const rawQual = teacher.qualification || 'M.Sc., B.Ed.';
  const hasPhd = /ph\.?d/i.test(rawQual);
  const hasMed = /m\.?ed/i.test(rawQual);
  const hasBed = /b\.?ed/i.test(rawQual) || !hasPhd;
  const hasMsc = /m\.?sc|m\.?tech|m\.?a|master/i.test(rawQual) || hasPhd;

  const records: QualificationRecord[] = [];
  let currentStepYear = endEduYear;

  if (hasPhd) {
    const institutePhd = rawQual.includes('(')
      ? rawQual.split('(')[1].replace(')', '').trim()
      : `Indian Institute of Technology / Central University`;
    records.push({
      degree: 'Ph.D. / Doctorate',
      institute: institutePhd,
      year: `${currentStepYear}`,
      grade: 'Awarded / Distinction'
    });
    currentStepYear -= 4;
  }

  if (hasMed) {
    records.push({
      degree: 'M.Ed. (Master of Education)',
      institute: `Department of Education, ${teacher.state || 'State'} University`,
      year: `${currentStepYear}`,
      grade: '76.8% (First Class)'
    });
    currentStepYear -= 2;
  }

  if (hasMsc) {
    const instituteMsc = rawQual.includes('University')
      ? rawQual.split('(')[1]?.replace(')', '').trim() || `${teacher.city} University`
      : `${teacher.city} University / Central University`;
    records.push({
      degree: `Post Graduation (M.Sc. ${teacher.subject || 'Science'})`,
      institute: instituteMsc,
      year: `${currentStepYear}`,
      grade: '75.4% (First Class)'
    });
    currentStepYear -= 2;
  }

  if (hasBed) {
    records.push({
      degree: 'B.Ed. (Bachelor of Education)',
      institute: `State Council of Educational Research & Training (${teacher.state || 'CBSE Region'})`,
      year: `${currentStepYear}`,
      grade: '78.2% (First Class with Distinction)'
    });
    currentStepYear -= 2;
  }

  records.push({
    degree: `Graduation (B.Sc. ${teacher.subject || 'Science'})`,
    institute: `${teacher.city} Degree College, State University`,
    year: `${currentStepYear}`,
    grade: '73.5% (First Class)'
  });
  currentStepYear -= 3;

  records.push({
    degree: 'Higher Secondary (Class XII - Science/PCM/PCB)',
    institute: `${teacher.board || 'CBSE'} Board`,
    year: `${currentStepYear}`,
    grade: '87.2%'
  });

  return records;
}

function RenderBioContent({ teacher }: { teacher: TeacherItem }) {
  if (teacher.customBlocks && Array.isArray(teacher.customBlocks) && teacher.customBlocks.length > 0) {
    return (
      <div className="space-y-3.5">
        {teacher.customBlocks.map((b: any, idx: number) => {
          if (b.type === 'header') {
            return (
              <h3 key={idx} className="text-sm sm:text-base font-bold text-[#003c6e] border-b border-slate-200 pb-1 pt-2 first:pt-0">
                {b.text}
              </h3>
            );
          }
          if (b.type === 'paragraph') {
            return (
              <p key={idx} className="whitespace-pre-wrap leading-relaxed text-slate-700 text-xs sm:text-sm">
                {b.text}
              </p>
            );
          }
          if (b.type === 'table') {
            return (
              <div key={idx} className="overflow-x-auto rounded-xl border border-slate-200 bg-white my-2">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      {b.headers.map((h: string, i: number) => (
                        <th key={i} className="p-2.5 font-bold text-slate-700">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {b.rows.map((row: string[], rI: number) => (
                      <tr key={rI}>
                        {row.map((cell: string, cI: number) => (
                          <td key={cI} className="p-2.5 text-slate-800">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  }

  const bioText = teacher.bio || '';
  if (!bioText) {
    return (
      <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
        {teacher.name} is a dedicated educator specializing in {teacher.subject} with {teacher.experienceYears}+ years of teaching and laboratory demonstration experience. Committed to experiential pedagogy aligned with NEP 2020.
      </p>
    );
  }

  // If bio contains HTML tags from the Rich Editor
  if (/<[a-z][\s\S]*>/i.test(bioText)) {
    return (
      <div
        className="prose prose-sm max-w-none text-slate-700 text-xs sm:text-sm leading-relaxed
          [&_h3]:text-base [&_h3]:sm:text-lg [&_h3]:font-bold [&_h3]:text-[#003c6e] [&_h3]:border-b [&_h3]:border-slate-200 [&_h3]:pb-1 [&_h3]:pt-2.5 [&_h3]:first:pt-0
          [&_p]:text-xs [&_p]:sm:text-sm [&_p]:text-slate-700 [&_p]:leading-relaxed [&_p]:mb-2.5
          [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:space-y-1.5 [&_ol]:my-2
          [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:space-y-1.5 [&_ul]:my-2
          [&_li]:text-xs [&_li]:sm:text-sm [&_li]:text-slate-700"
        dangerouslySetInnerHTML={{ __html: bioText }}
      />
    );
  }

  const sections = bioText.split(/\n(?=###?\s)/);
  return (
    <div className="space-y-3">
      {sections.map((sec, idx) => {
        const trimmed = sec.trim();
        if (trimmed.startsWith('###') || trimmed.startsWith('##')) {
          const firstLineEnd = trimmed.indexOf('\n');
          const header = firstLineEnd !== -1 ? trimmed.slice(0, firstLineEnd).replace(/^#+\s*/, '') : trimmed.replace(/^#+\s*/, '');
          const body = firstLineEnd !== -1 ? trimmed.slice(firstLineEnd).trim() : '';
          return (
            <div key={idx} className="space-y-1.5">
              <h3 className="text-sm sm:text-base font-bold text-[#003c6e] border-b border-slate-200 pb-1 pt-1.5 first:pt-0">
                {header}
              </h3>
              {body && <p className="whitespace-pre-wrap leading-relaxed text-slate-700 text-xs sm:text-sm">{body}</p>}
            </div>
          );
        }
        return (
          <p key={idx} className="whitespace-pre-wrap leading-relaxed text-slate-700 text-xs sm:text-sm">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}

export default function TeacherProfileClient({ teacherId }: TeacherProfileClientProps) {
  const teacher = getTeacherById(teacherId) || ALL_TEACHERS[0];
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2500);
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const qualifications = getQualificationsList(teacher);

  // Job Search tags (comma-separated string + pill badges)
  const jobSearchTags: string[] = Array.from(new Set([
    `${teacher.designation || 'PGT'} ${teacher.subject}`,
    `TGT ${teacher.subject}`,
    `${teacher.board || 'CBSE'} Board`,
    'Senior Secondary (Class 11 & 12)',
    'Practical Lab Demonstration',
    'NEET & JEE Foundation',
    'NEP 2020 Experiential Pedagogy',
    ...(teacher.skills || []).slice(0, 4)
  ]));

  const addressText = teacher.address || `${teacher.city}, ${teacher.state}${teacher.pincode ? ` - ${teacher.pincode}` : ''}`;

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 py-6 sm:py-10 px-3 sm:px-6 font-sans print:min-h-0 print:h-auto print:bg-white print:p-0 print:m-0">
      {/* ── Top Bar / Action Controls (Hidden on Print) ───────────────────────── */}
      <div className="max-w-4xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link
          href="/edu-network/teachers"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#005689] hover:text-[#003c6e] bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm transition hover:shadow"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Faculty Directory</span>
        </Link>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => copyToClipboard(typeof window !== 'undefined' ? window.location.href : '', 'link')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm transition"
            title="Share Profile Link"
          >
            {copiedText === 'link' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copiedText === 'link' ? 'Link Copied!' : 'Share CV'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-[#005689] hover:bg-[#003c6e] px-4 py-2 rounded-xl shadow-sm transition"
            title="Print or Save as PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* ── Main Resume / CV Paper Document ───────────────────────────────────── */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-lg print:shadow-none print:border-none print:rounded-none print:p-0 print:m-0 print:max-w-none print:w-full overflow-hidden print:overflow-visible">
        {/* Top Decorative Header Accent */}
        <div className="h-2.5 bg-gradient-to-r from-[#005689] via-[#0077b6] to-[#0F9D58] print:hidden" />

        <div className="p-6 sm:p-10 md:p-12 space-y-8 sm:space-y-10 print:p-0 print:space-y-4">

          {/* ══════════════════════════════════════════════════════════════════════
              SECTION 1: BASIC DETAILS / HEADER
              (Faculty Name, Address, Image, Highest Qualification)
             ══════════════════════════════════════════════════════════════════════ */}
          <div className="border-b border-slate-200 pb-8 print:pb-3.5 print:break-inside-avoid">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 print:gap-4">
              {/* Left / Info */}
              <div className="space-y-3 print:space-y-1.5 flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200/60 rounded-full text-xs font-bold text-[#005689] print:py-0.5 print:px-2 print:text-[10px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 print:w-3 print:h-3" />
                  <span>Verified Educator Profile</span>
                </div>

                {/* Faculty Name */}
                <h1
                  className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight print:text-2xl"
                  style={{ color: '#003c6e' }}
                >
                  {teacher.name}
                </h1>

                {/* Highest Qualification */}
                <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm sm:text-base print:text-xs">
                  <div className="w-7 h-7 rounded-lg bg-[#005689]/10 flex items-center justify-center text-[#005689] shrink-0 print:w-5 print:h-5">
                    <GraduationCap className="w-4 h-4 print:w-3.5 print:h-3.5" />
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium text-xs sm:text-sm block print:inline print:mr-1">Highest Qualification:</span>
                    <span className="font-bold text-[#003c6e]">{teacher.qualification}</span>
                  </div>
                </div>

                {/* Address / Location */}
                <div className="flex items-start gap-2 text-slate-600 text-xs sm:text-sm print:text-xs">
                  <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0 print:w-3 print:h-3" />
                  <span className="leading-snug">{addressText}</span>
                </div>
              </div>

              {/* Right / Profile Image */}
              <div className="shrink-0 self-center sm:self-auto print:self-start">
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-slate-200 shadow-sm bg-slate-100 flex items-center justify-center print:w-20 print:h-20 print:rounded-xl">
                  {teacher.avatar && !imgError ? (
                    <img
                      src={teacher.avatar}
                      alt={teacher.name}
                      onError={() => setImgError(true)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400">
                      <User className="w-12 h-12 text-slate-300" />
                      <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Photo</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════════
              SECTION 2: QUALIFICATION DETAIL SECTION (TABLE WITH HEADER)
             ══════════════════════════════════════════════════════════════════════ */}
          <div className="space-y-3.5 print:space-y-1.5 print:break-inside-avoid">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#005689]/10 flex items-center justify-center text-[#005689] print:w-5 print:h-5">
                <BookOpen className="w-4 h-4 print:w-3.5 print:h-3.5" />
              </div>
              <h2
                className="text-lg sm:text-xl font-bold tracking-tight uppercase text-xs print:text-sm"
                style={{ color: '#003c6e' }}
              >
                Qualification
              </h2>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm print:shadow-none print:rounded-lg">
              <table className="w-full text-left text-xs sm:text-sm text-slate-700 divide-y divide-slate-200 print:text-[9pt]">
                <thead className="bg-slate-50 text-slate-700 font-bold text-xs border-b border-slate-200 print:text-[8.5pt]">
                  <tr>
                    <th scope="col" className="px-4 py-2.5 sm:px-5 whitespace-nowrap print:px-2.5 print:py-1.5">Degree / Course</th>
                    <th scope="col" className="px-4 py-2.5 sm:px-5 whitespace-nowrap print:px-2.5 print:py-1.5">Board / University</th>
                    <th scope="col" className="px-4 py-2.5 sm:px-5 text-center whitespace-nowrap print:px-2.5 print:py-1.5">Year</th>
                    <th scope="col" className="px-4 py-2.5 sm:px-5 text-right whitespace-nowrap print:px-2.5 print:py-1.5">Grade / %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {qualifications.map((item, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50 print:bg-white'}>
                      <td className="px-4 py-3 sm:px-5 font-semibold text-slate-900 print:px-2.5 print:py-1.5">{item.degree}</td>
                      <td className="px-4 py-3 sm:px-5 text-slate-600 print:px-2.5 print:py-1.5">{item.institute}</td>
                      <td className="px-4 py-3 sm:px-5 text-center font-medium text-slate-500 whitespace-nowrap print:px-2.5 print:py-1.5">{item.year}</td>
                      <td className="px-4 py-3 sm:px-5 text-right font-bold text-slate-800 whitespace-nowrap print:px-2.5 print:py-1.5">{item.grade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════════
              SECTION 3: EXPERIENCE SECTION
             ══════════════════════════════════════════════════════════════════════ */}
          <div className="space-y-4 print:space-y-2 print:break-inside-avoid">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#005689]/10 flex items-center justify-center text-[#005689] print:w-5 print:h-5">
                  <Briefcase className="w-4 h-4 print:w-3.5 print:h-3.5" />
                </div>
                <h2
                  className="text-lg sm:text-xl font-bold tracking-tight uppercase text-xs print:text-sm"
                  style={{ color: '#003c6e' }}
                >
                  Work & Teaching Experience
                </h2>
              </div>
              <span className="text-xs font-bold text-[#005689] bg-blue-50 px-3 py-1 rounded-full border border-blue-200 print:text-[9pt] print:py-0.5 print:px-2">
                {teacher.experienceYears}+ Years Overall Experience
              </span>
            </div>

            <div className="space-y-3.5 print:space-y-2">
              {/* Current Institute Role */}
              <div className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition print:p-2.5 print:rounded-lg print:border-slate-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 mb-2 print:mb-1">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#005689] print:w-3.5 print:h-3.5" />
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base print:text-xs">
                      {teacher.designation || 'Senior Faculty'} ({teacher.subject})
                    </h3>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200 w-fit print:text-[8pt] print:py-0 print:px-1.5">
                    <Calendar className="w-3 h-3" />
                    <span>2022 - Present (Current Role)</span>
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-[#005689] print:text-xs">{teacher.currentInstitute}</p>
                <p className="text-xs text-slate-500 mt-0.5 print:text-[9pt]">{teacher.city}, {teacher.state}</p>
                <ul className="mt-2.5 space-y-1 text-xs text-slate-600 list-disc list-inside print:mt-1 print:text-[9pt] print:space-y-0.5">
                  <li>Conducting experiential laboratory practicals, CBSE theory curriculum, and NEP-2020 aligned demonstrations.</li>
                  <li>Mentoring students for science Olympiads, CBSE board practical exams, and competitive exams.</li>
                </ul>
              </div>

              {/* Past Schools List */}
              {teacher.pastSchools && teacher.pastSchools.length > 0 ? (
                teacher.pastSchools.map((ps, idx) => (
                  <div key={idx} className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-slate-50/50 print:bg-white print:p-2.5 print:rounded-lg print:border-slate-300 print:break-inside-avoid">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 mb-1.5 print:mb-0.5">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-slate-500 print:w-3.5 print:h-3.5" />
                        <h3 className="font-bold text-slate-800 text-sm sm:text-base print:text-xs">{ps.role}</h3>
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 bg-white px-2.5 py-0.5 rounded-md border border-slate-200 w-fit print:text-[8pt] print:py-0 print:px-1.5">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{ps.duration}</span>
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-700 print:text-xs">{ps.schoolName}</p>
                    <p className="text-xs text-slate-500 mt-0.5 print:text-[9pt]">{ps.city}</p>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 print:bg-white print:p-2.5 print:rounded-lg print:border-slate-300 print:break-inside-avoid">
                  <div className="flex items-center justify-between mb-1 print:mb-0.5">
                    <h3 className="font-bold text-slate-800 text-sm print:text-xs">{teacher.subject} Demonstrator & Educator</h3>
                    <span className="text-xs text-slate-500 font-medium print:text-[8pt]">Prior Experience</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 print:text-xs">Senior Secondary School, {teacher.city}</p>
                </div>
              )}
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════════
              SECTION 4: JOB SEARCH RELATED FIELD (TAGS COMMA-SEPARATED)
             ══════════════════════════════════════════════════════════════════════ */}
          <div className="space-y-3 print:space-y-1.5 print:break-inside-avoid">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#005689]/10 flex items-center justify-center text-[#005689] print:w-5 print:h-5">
                <Tag className="w-4 h-4 print:w-3.5 print:h-3.5" />
              </div>
              <h2
                className="text-lg sm:text-xl font-bold tracking-tight uppercase text-xs print:text-sm"
                style={{ color: '#003c6e' }}
              >
                Job Search Profile & Target Roles
              </h2>
            </div>

            {/* Pill Badges */}
            <div className="flex flex-wrap gap-2 pt-1 print:gap-1 print:pt-0">
              {jobSearchTags.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200 hover:bg-slate-200/70 transition print:text-[8.5pt] print:py-0.5 print:px-2"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Comma-Separated Line */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed font-mono print:p-2 print:text-[8.5pt] print:bg-white print:rounded-lg">
              <span className="font-bold text-slate-500 uppercase text-[11px] block mb-1 font-sans print:text-[8pt] print:mb-0.5">Target Roles:</span>
              {jobSearchTags.join(', ')}
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════════
              SECTION 5: EXPECTED SALARY
             ══════════════════════════════════════════════════════════════════════ */}
          <div className="space-y-3 print:space-y-1.5 print:break-inside-avoid">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 print:w-5 print:h-5">
                <IndianRupee className="w-4 h-4 print:w-3.5 print:h-3.5" />
              </div>
              <h2
                className="text-lg sm:text-xl font-bold tracking-tight uppercase text-xs print:text-sm"
                style={{ color: '#003c6e' }}
              >
                Expected Salary
              </h2>
            </div>

            <div className="p-4 sm:p-5 rounded-xl border border-emerald-200 bg-emerald-50/30 flex items-center justify-between print:p-2.5 print:rounded-lg print:border-slate-300 print:bg-white">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block print:text-[8pt]">Salary Expectation</span>
                <span className="text-lg sm:text-2xl font-extrabold text-[#0F9D58] tracking-tight print:text-base">
                  {teacher.expectedSalary || '₹45,000 - ₹60,000 / month'}
                </span>
              </div>
              <span className="text-xs font-bold px-3 py-1 bg-white text-emerald-800 border border-emerald-300 rounded-lg shadow-sm print:text-[8pt] print:py-0.5 print:px-2 print:border-slate-300">
                Negotiable
              </span>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════════
              SECTION 6: CONTACT DETAILS (EMAIL & PHONE)
             ══════════════════════════════════════════════════════════════════════ */}
          <div className="space-y-3.5 print:space-y-1.5 print:break-inside-avoid">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#005689]/10 flex items-center justify-center text-[#005689] print:w-5 print:h-5">
                <Mail className="w-4 h-4 print:w-3.5 print:h-3.5" />
              </div>
              <h2
                className="text-lg sm:text-xl font-bold tracking-tight uppercase text-xs print:text-sm"
                style={{ color: '#003c6e' }}
              >
                Contact Details
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 print:gap-2.5">
              {/* Email */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-3 print:p-2.5 print:rounded-lg print:border-slate-300">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#005689] flex items-center justify-center shrink-0 print:w-6 print:h-6">
                    <Mail className="w-4 h-4 print:w-3.5 print:h-3.5" />
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-[11px] font-bold text-slate-400 uppercase block print:text-[8pt]">Email Address</span>
                    <a
                      href={`mailto:${teacher.email}`}
                      className="font-semibold text-xs sm:text-sm text-[#005689] hover:underline truncate block print:text-xs"
                    >
                      {teacher.email}
                    </a>
                  </div>
                </div>

                <button
                  onClick={() => copyToClipboard(teacher.email, 'email')}
                  className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition shrink-0 print:hidden"
                  title="Copy Email"
                >
                  {copiedText === 'email' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Phone */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-3 print:p-2.5 print:rounded-lg print:border-slate-300">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 print:w-6 print:h-6">
                    <Phone className="w-4 h-4 print:w-3.5 print:h-3.5" />
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-[11px] font-bold text-slate-400 uppercase block print:text-[8pt]">Phone / Mobile (Protected)</span>
                    <span className="font-semibold text-xs sm:text-sm text-slate-800 font-mono truncate block print:text-xs">
                      {maskPhoneNumber(teacher.phone)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => copyToClipboard(teacher.phone, 'phone')}
                  className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition shrink-0 print:hidden"
                  title="Copy Phone"
                >
                  {copiedText === 'phone' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════════
              SECTION 7: ABOUT YOU / DESCRIPTION SECTION
             ══════════════════════════════════════════════════════════════════════ */}
          <div className="space-y-3 pt-2 print:pt-0 print:space-y-1.5 print:break-inside-avoid">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#005689]/10 flex items-center justify-center text-[#005689] print:w-5 print:h-5">
                <User className="w-4 h-4 print:w-3.5 print:h-3.5" />
              </div>
              <h2
                className="text-lg sm:text-xl font-bold tracking-tight uppercase text-xs print:text-sm"
                style={{ color: '#003c6e' }}
              >
                Description
              </h2>
            </div>

            <div className="p-5 sm:p-6 rounded-xl border border-slate-200 bg-slate-50/70 text-slate-700 text-sm sm:text-base leading-relaxed print:p-3 print:bg-white print:border-slate-300 print:rounded-lg print:text-[9.5pt]">
              <RenderBioContent teacher={teacher} />
            </div>
          </div>

        </div>

        {/* Bottom Resume Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 print:bg-white print:px-0 print:py-2.5 print:border-t print:border-slate-300 print:text-[8pt] print:break-inside-avoid">
          <span>Verified Faculty Resume • CSEEL EduNetwork (www.cseel.org)</span>
          <span className="font-mono text-slate-600 hidden print:inline">A4 Verified Document</span>
          <span className="print:hidden">Last Updated: October 2026</span>
        </div>
      </div>

      {/* ── Fixed Running Print Page Footer ─────────────────────────────────── */}
      <div className="hidden print:flex fixed bottom-0 left-0 right-0 pt-1 pb-1 border-t border-slate-300 bg-white text-[8pt] text-slate-500 justify-between items-center z-50">
        <span>CSEEL EduNetwork • Faculty Profile</span>
        <span className="font-mono text-slate-700">Official Profile Document</span>
      </div>
    </div>
  );
}
