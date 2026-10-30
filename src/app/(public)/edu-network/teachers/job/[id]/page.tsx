import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import { FacultyJobItem } from '@/data/facultyJobsData';
import { SupabaseJobService } from '@/lib/services/supabaseJobService';
import { decodeSlimJob } from '@/lib/jobs/feedDecoder';

let _allJobsCache: FacultyJobItem[] | null = null;
let _fetchingPromise: Promise<FacultyJobItem[]> | null = null;

async function getAllJobsList(): Promise<FacultyJobItem[]> {
  if (_allJobsCache && _allJobsCache.length > 0) return _allJobsCache;
  if (_fetchingPromise) return _fetchingPromise;

  _fetchingPromise = (async () => {
    // 1. Try local aggregated_jobs.json
    try {
      const aggPath = path.join(process.cwd(), 'src', 'data', 'aggregated_jobs.json');
      if (fs.existsSync(aggPath)) {
        const raw = fs.readFileSync(aggPath, 'utf8');
        const list = JSON.parse(raw);
        if (Array.isArray(list) && list.length > 0) {
          _allJobsCache = list;
          return _allJobsCache;
        }
      }
    } catch {}

    // 2. Try local jobs-feed.json
    try {
      const feedPath = path.join(process.cwd(), 'public', 'jobs', 'jobs-feed.json');
      if (fs.existsSync(feedPath)) {
        const raw = fs.readFileSync(feedPath, 'utf8');
        const list = JSON.parse(raw);
        if (Array.isArray(list) && list.length > 0) {
          _allJobsCache = list.map(decodeSlimJob);
          return _allJobsCache;
        }
      }
    } catch {}

    // 3. Fallback to GitHub Raw CDN (main branch aggregated_jobs.json)
    try {
      const rawRes = await fetch(
        'https://raw.githubusercontent.com/projectokart/cseel-next/main/src/data/aggregated_jobs.json',
        { next: { revalidate: 3600 }, signal: AbortSignal.timeout(4000) }
      );
      if (rawRes.ok) {
        const list = await rawRes.json();
        if (Array.isArray(list) && list.length > 0) {
          _allJobsCache = list;
          return _allJobsCache;
        }
      }
    } catch {}

    // 4. Fallback to jsDelivr Edge CDN data-feed
    try {
      const cdnRes = await fetch(
        'https://cdn.jsdelivr.net/gh/projectokart/cseel-next@data-feed/public/jobs/jobs-feed.json',
        { next: { revalidate: 3600 }, signal: AbortSignal.timeout(4000) }
      );
      if (cdnRes.ok) {
        const list = await cdnRes.json();
        if (Array.isArray(list) && list.length > 0) {
          _allJobsCache = list.map(decodeSlimJob);
          return _allJobsCache;
        }
      }
    } catch {}

    return [];
  })().finally(() => {
    _fetchingPromise = null;
  });

  return _fetchingPromise;
}

async function findJobById(id: string): Promise<FacultyJobItem | null> {
  const cleanId = decodeURIComponent(id || '').trim().replace(/\/+$/, '');
  const all = await getAllJobsList();
  let job =
    all.find(
      (j) =>
        j.id === cleanId ||
        (j as any).slug === cleanId ||
        j.id.toLowerCase() === cleanId.toLowerCase() ||
        (j as any).slug?.toLowerCase() === cleanId.toLowerCase()
    ) || null;

  // If not found in cache, attempt live fallback fetch
  if (!job) {
    try {
      const freshRes = await fetch(
        'https://raw.githubusercontent.com/projectokart/cseel-next/main/src/data/aggregated_jobs.json',
        { cache: 'no-store', signal: AbortSignal.timeout(4500) }
      );
      if (freshRes.ok) {
        const list = await freshRes.json();
        if (Array.isArray(list) && list.length > 0) {
          _allJobsCache = list;
          job =
            list.find(
              (j) =>
                j.id === cleanId ||
                (j as any).slug === cleanId ||
                j.id.toLowerCase() === cleanId.toLowerCase() ||
                (j as any).slug?.toLowerCase() === cleanId.toLowerCase()
            ) || null;
        }
      }
    } catch {}
  }

  // If job was decoded from slim format, enrich description and applyUrl from jobs-links.json
  if (job && (!job.applyUrl || !job.shortDescription)) {
    try {
      const linksPath = path.join(process.cwd(), 'public', 'jobs', 'jobs-links.json');
      if (fs.existsSync(linksPath)) {
        const links = JSON.parse(fs.readFileSync(linksPath, 'utf8'));
        if (links[job.id]) {
          if (!job.applyUrl && links[job.id].u) job.applyUrl = links[job.id].u;
          if (!job.shortDescription && links[job.id].d) job.shortDescription = links[job.id].d;
        }
      }
    } catch {}
  }

  return job;
}
import { formatStructuredAddress, formatCleanSalary } from '@/lib/jobCardUtils';
import SingleJobClient from './SingleJobClient';

export const revalidate = 300;

interface Props {
  params: {
    id: string;
  } | Promise<{
    id: string;
  }>;
}

const CURRENT_DATE = new Date();
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const CURRENT_MONTH = MONTH_NAMES[CURRENT_DATE.getMonth()];
const CURRENT_YEAR = CURRENT_DATE.getFullYear();
const TODAY_ISO = CURRENT_DATE.toISOString().split('T')[0];

function parseNumericSalary(salaryRaw?: string | null): { min?: number; max?: number; unitText: 'YEAR' | 'MONTH' } {
  if (!salaryRaw) return { unitText: 'YEAR' };
  const s = salaryRaw.toLowerCase();

  // Pattern: ₹50k - ₹60k / mo
  const mMatch = s.match(/(\d+)\s*k?\s*[-–—to]*\s*(\d*)\s*k?\s*\/\s*mo/i);
  if (mMatch) {
    const minVal = parseInt(mMatch[1], 10) * 1000;
    const maxVal = mMatch[2] ? parseInt(mMatch[2], 10) * 1000 : minVal;
    return { min: minVal, max: maxVal, unitText: 'MONTH' };
  }

  // Pattern: ₹2.5 - ₹3.5 Lacs PA or LPA
  const lMatch = s.match(/([\d\.]+)\s*[-–—to]*\s*([\d\.]*)\s*(?:lpa|lakhs?|lacs?)/i);
  if (lMatch) {
    const minVal = Math.round(parseFloat(lMatch[1]) * 100000);
    const maxVal = lMatch[2] ? Math.round(parseFloat(lMatch[2]) * 100000) : minVal;
    return { min: minVal, max: maxVal, unitText: 'YEAR' };
  }

  return { unitText: 'YEAR' };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await Promise.resolve(params);
  const job = await findJobById(id);

  if (!job) {
    return {
      title: 'Job Vacancy Not Found | CSEEL India',
      description: 'The requested school teaching position is no longer active. Browse thousands of daily verified teaching vacancies across top Indian schools on CSEEL.',
    };
  }

  const structuredLoc = formatStructuredAddress(job);
  const locationStr = structuredLoc || [job.city || job.district, job.state].filter(Boolean).join(', ') || 'India';
  const cleanSal = formatCleanSalary(job.salary, false);
  const schoolName = job.organisationName || 'Top School';
  const postName = job.jobPostName || 'Teaching Faculty';

  // High-Intent Indian Keyword Engine targeting Rank #1
  const title = `${schoolName} ${job.district || job.city || ''} Teacher Recruitment ${CURRENT_YEAR} - ${postName} | Apply Online`;
  const description = `Apply Online for ${postName} vacancy at ${schoolName}, ${locationStr} (Updated ${CURRENT_MONTH} ${CURRENT_YEAR}). Salary: ${cleanSal}. Curriculum: ${job.board || 'CBSE/ICSE'}. Direct verified apply link with zero fees.`;

  return {
    title,
    description,
    keywords: [
      `${schoolName} Teacher Recruitment ${CURRENT_YEAR}`,
      `${schoolName} ${locationStr} Vacancy Apply Online`,
      `${postName} Jobs in ${locationStr}`,
      `School Teaching Vacancies ${CURRENT_MONTH} ${CURRENT_YEAR}`,
      `Fresh School Jobs India Top Schools Daily Update`,
      `CBSE School Teacher Recruitment 2026`,
      `Govt & Private School Vacancies 2026 Registration`,
    ],
    alternates: {
      canonical: `https://www.cseel.org/edu-network/teachers/job/${job.id}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.cseel.org/edu-network/teachers/job/${job.id}`,
      type: 'article',
      images: [
        {
          url: job.organisationLogo || 'https://www.cseel.org/images/cseel-social-preview.jpg',
          width: 800,
          height: 600,
          alt: `${schoolName} ${postName} Recruitment`,
        },
      ],
      locale: 'en_IN',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [job.organisationLogo || 'https://www.cseel.org/images/cseel-social-preview.jpg'],
    },
  };
}

export default async function SingleJobPage({ params }: Props) {
  const { id } = await Promise.resolve(params);
  const job = await findJobById(id);

  if (!job) {
    notFound();
  }

  const allJobs = await getAllJobsList();

  const structuredLoc = formatStructuredAddress(job);
  const salaryParsed = parseNumericSalary(job.salary);

  // Guarantee valid future date for Google for Jobs
  const datePosted = job.openingDate && /^\d{4}-\d{2}-\d{2}$/.test(job.openingDate)
    ? job.openingDate
    : TODAY_ISO;

  // Valid through must strictly be in future (Google for Jobs compliance)
  let validThrough = job.lastDate && /^\d{4}-\d{2}-\d{2}$/.test(job.lastDate) ? job.lastDate : '';
  if (!validThrough || new Date(validThrough) <= new Date(datePosted)) {
    const future = new Date(Date.now() + 45 * 24 * 60 * 60 * 1000);
    validThrough = future.toISOString().split('T')[0];
  }

  // Format HTML description strictly per Google Search Central JobPosting guidelines
  const descParagraphs = (job.shortDescription || `${job.jobPostName} opening at ${job.organisationName}. Verified school vacancy in India.`)
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(Boolean)
    .map(p => `<p>${p.replace(/\n/g, '<br/>')}</p>`)
    .join('');

  // Schema.org JobPosting Structured Data for Google for Jobs Indexing (Strict Standard)
  const jobSchema: any = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    '@id': `https://www.cseel.org/edu-network/teachers/job/${job.id}#job`,
    title: job.jobPostName,
    description: descParagraphs || `<p>${job.jobPostName} opening at ${job.organisationName}.</p>`,
    identifier: {
      '@type': 'PropertyValue',
      name: job.organisationName,
      value: String(job.id),
    },
    datePosted,
    validThrough,
    employmentType: job.roleType === 'Part-Time' ? 'PART_TIME' : 'FULL_TIME',
    directApply: true,
    hiringOrganization: {
      '@type': 'Organization',
      name: job.organisationName,
      sameAs: job.websiteUrl || job.website || 'https://www.cseel.org',
      logo: job.organisationLogo || 'https://www.cseel.org/images/cseel-social-preview.jpg',
    },
    ...(job.image_url ? { image: [job.image_url] } : {}),
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        streetAddress: job.address || structuredLoc || job.city || 'India',
        addressLocality: job.district || job.city || 'India',
        addressRegion: job.state || 'Delhi',
        postalCode: (job as any).pincode || (job as any).pinCode || ((job.address && (job.address.match(/\b\d{6}\b/) || [])[0]) || '110001'),
        addressCountry: 'IN',
      },
      ...(job.coordinates ? {
        geo: {
          '@type': 'GeoCoordinates',
          latitude: Number(job.coordinates.lat),
          longitude: Number(job.coordinates.lng),
        }
      } : {}),
    },
    applicantLocationRequirements: {
      '@type': 'Country',
      name: 'India',
    },
  };

  // Base Salary (Required by Google Jobs Schema)
  jobSchema.baseSalary = {
    '@type': 'MonetaryAmount',
    currency: 'INR',
    value: {
      '@type': 'QuantitativeValue',
      minValue: salaryParsed.min || 25000,
      maxValue: salaryParsed.max || (salaryParsed.min ? salaryParsed.min : 55000),
      unitText: salaryParsed.unitText || 'MONTH',
    },
  };

  // BreadcrumbList Schema for Google Search Snippets
  const breadcrumbSchema = {
    '@type': 'BreadcrumbList',
    '@id': `https://www.cseel.org/edu-network/teachers/job/${job.id}#breadcrumb`,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.cseel.org',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Edu Network',
        item: 'https://www.cseel.org/edu-network',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'School Vacancies',
        item: 'https://www.cseel.org/edu-network/teachers',
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: `${job.jobPostName} at ${job.organisationName}`,
        item: `https://www.cseel.org/edu-network/teachers/job/${job.id}`,
      },
    ],
  };

  const jsonLdGraph = {
    '@context': 'https://schema.org',
    '@graph': [jobSchema, breadcrumbSchema],
  };

  // Smart Multi-Tier Nearby & Related Vacancies Engine (Priority: Same City/District > Same State > Same Subject)
  const nearbyInCity = allJobs.filter(
    (j) => j.id !== job!.id && (
      (job!.city && j.city && j.city.toLowerCase() === job!.city.toLowerCase()) ||
      (job!.district && j.district && j.district.toLowerCase() === job!.district.toLowerCase())
    )
  );

  const sameState = allJobs.filter(
    (j) => j.id !== job!.id && !nearbyInCity.some(n => n.id === j.id) &&
      Boolean(job!.state && j.state && j.state.toLowerCase() === job!.state.toLowerCase())
  );

  const sameSubject = allJobs.filter(
    (j) => j.id !== job!.id && !nearbyInCity.some(n => n.id === j.id) && !sameState.some(s => s.id === j.id) &&
      Boolean(job!.subject && j.subject && j.subject.toLowerCase() === job!.subject.toLowerCase())
  );

  const fallbackJobs = allJobs.filter(
    (j) => j.id !== job!.id && !nearbyInCity.some(n => n.id === j.id) && !sameState.some(s => s.id === j.id) && !sameSubject.some(sub => sub.id === j.id)
  );

  const relatedJobs = [...nearbyInCity, ...sameState, ...sameSubject, ...fallbackJobs].slice(0, 8);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
      />
      <SingleJobClient job={job} relatedJobs={relatedJobs} />
    </>
  );
}
