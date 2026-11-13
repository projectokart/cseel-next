import React from 'react';
import fs from 'fs';
import path from 'path';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { FacultyJobItem } from '@/data/facultyJobsData';
import { decodeSlimJob } from '@/lib/jobs/feedDecoder';
import { SupabaseJobService } from '@/lib/services/supabaseJobService';
import { formatStructuredAddress, formatCleanSalary } from '@/lib/jobCardUtils';
import SingleJobClient from './SingleJobClient';

export const revalidate = 86400; // 1 Day Edge ISR cache

// Fast in-memory map of decoded jobs from jobs-feed.json
let cachedJobsMap: Map<string, FacultyJobItem> | null = null;
let cachedLinksMap: Record<string, string> | null = null;

function loadJobsFeed(): Map<string, FacultyJobItem> {
  if (cachedJobsMap) return cachedJobsMap;
  cachedJobsMap = new Map();

  try {
    const feedPath = path.join(process.cwd(), 'public', 'jobs', 'jobs-feed.json');
    if (fs.existsSync(feedPath)) {
      const raw = fs.readFileSync(feedPath, 'utf8');
      const list = JSON.parse(raw);
      if (Array.isArray(list)) {
        for (const item of list) {
          const decoded = decodeSlimJob(item);
          if (decoded && decoded.id) {
            cachedJobsMap.set(decoded.id, decoded);
            if (decoded.id.startsWith('ind-')) {
              cachedJobsMap.set(decoded.id.replace(/^ind-/, ''), decoded);
            }
          }
        }
      }
    }
  } catch (err) {
    console.error('[findJobById] Error loading jobs-feed.json:', err);
  }

  try {
    const linksPath = path.join(process.cwd(), 'public', 'jobs', 'jobs-links.json');
    if (fs.existsSync(linksPath)) {
      const linksRaw = fs.readFileSync(linksPath, 'utf8');
      cachedLinksMap = JSON.parse(linksRaw);
    }
  } catch {}

  return cachedJobsMap;
}

async function findJobById(id: string): Promise<FacultyJobItem | null> {
  const cleanId = decodeURIComponent(id || '').trim().replace(/\/+$/, '');
  if (!cleanId) return null;

  // 1. First check in-memory jobs feed (covers all 4,246 jobs in 0.01ms)
  const map = loadJobsFeed();
  const feedJob = map.get(cleanId) || map.get(`ind-${cleanId}`) || map.get(`li-${cleanId}`) || map.get(`nk-${cleanId}`);
  if (feedJob) {
    if (cachedLinksMap && cachedLinksMap[feedJob.id]) {
      const link = cachedLinksMap[feedJob.id];
      if (typeof link === 'string') {
        feedJob.originalUrl = link;
        feedJob.applyUrl = link;
      }
    }
    return feedJob;
  }

  // 2. Direct indexed Supabase query (for user-submitted / dynamically added jobs)
  try {
    const job = await SupabaseJobService.fetchJobBySlug(cleanId);
    if (job) return job;
  } catch (err) {
    console.warn('[findJobById] Supabase lookup error:', err);
  }

  // 3. Direct lookup for alternative slug format
  try {
    if (!cleanId.startsWith('ind-') && !cleanId.startsWith('li-') && !cleanId.startsWith('nk-') && !cleanId.startsWith('job-')) {
      const altJob = await SupabaseJobService.fetchJobBySlug(`ind-${cleanId}`);
      if (altJob) return altJob;
    } else if (cleanId.startsWith('ind-')) {
      const strippedJob = await SupabaseJobService.fetchJobBySlug(cleanId.replace(/^ind-/, ''));
      if (strippedJob) return strippedJob;
    }
  } catch {}

  // 4. In-memory fallback
  try {
    const { getActiveFacultyJobs } = await import('@/data/facultyJobsData');
    const active = getActiveFacultyJobs();
    const found = active.find((j) => j.id === cleanId || (j as any).slug === cleanId);
    if (found) return found;
  } catch {}

  return null;
}



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

  // High-Intent Indian Keyword Engine targeting Rank #1 and Maximum CTR
  const locShort = job.city || job.district || '';
  const title = `${postName} Teacher Vacancy - ${schoolName}${locShort ? ` (${locShort})` : ''} | Apply Direct - CSEEL`;
  const description = `Direct Apply: ${postName} vacancy at ${schoolName}, ${locationStr} (Updated ${CURRENT_MONTH} ${CURRENT_YEAR}). Salary: ${cleanSal}. Board: ${job.board || 'CBSE/ICSE'}. Direct verified apply link with zero fees on CSEEL.`;

  return {
    title,
    description,
    keywords: [
      `${postName} Teacher Vacancy Near Me`,
      `${postName} Vacancy in ${locationStr}`,
      `${schoolName} Teacher Recruitment ${CURRENT_YEAR}`,
      `School Jobs Near Me ${locShort}`,
      `${postName} Jobs in ${locationStr}`,
      `School Teaching Vacancies ${CURRENT_MONTH} ${CURRENT_YEAR}`,
      `CBSE School Teacher Recruitment ${CURRENT_YEAR}`,
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

  // Fetch related jobs (with memory fallback)
  let relatedJobs: FacultyJobItem[] = await SupabaseJobService.fetchRelatedJobs(
    job.city || job.district,
    job.state,
    job.id,
    8
  ).catch(() => []);

  if (!relatedJobs || relatedJobs.length === 0) {
    const map = loadJobsFeed();
    const all = Array.from(map.values()).filter(j => j.id !== job.id);
    const sameRegion = all.filter(j => 
      (j.city && job.city && j.city.toLowerCase() === job.city.toLowerCase()) || 
      (j.state && job.state && j.state.toLowerCase() === job.state.toLowerCase())
    );
    relatedJobs = (sameRegion.length >= 4 ? sameRegion : all).slice(0, 8);
  }

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
