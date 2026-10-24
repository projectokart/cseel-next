import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getActiveFacultyJobs, FacultyJobItem } from '@/data/facultyJobsData';
import { SupabaseJobService } from '@/lib/services/supabaseJobService';
import { formatStructuredAddress, formatCleanSalary } from '@/lib/jobCardUtils';
import SingleJobClient from './SingleJobClient';

export const dynamic = 'force-dynamic';

interface Props {
  params: {
    id: string;
  };
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
  const allJobs = getActiveFacultyJobs();
  let job = allJobs.find((j) => j.id === params.id || (j as any).slug === params.id);
  if (!job) {
    try {
      const supa = await SupabaseJobService.fetchJobsFromSupabase();
      job = supa.find((j) => j.id === params.id || (j as any).slug === params.id);
    } catch {}
  }

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
  const allJobs = getActiveFacultyJobs();
  let job = allJobs.find((j) => j.id === params.id || (j as any).slug === params.id);
  if (!job) {
    try {
      const supa = await SupabaseJobService.fetchJobsFromSupabase();
      job = supa.find((j) => j.id === params.id || (j as any).slug === params.id);
    } catch {}
  }

  if (!job) {
    notFound();
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

  // Schema.org JobPosting Structured Data for Google for Jobs Indexing
  const jobSchema: any = {
    '@type': 'JobPosting',
    '@id': `https://www.cseel.org/edu-network/teachers/job/${job.id}#job`,
    title: job.jobPostName,
    description: job.shortDescription || `${job.jobPostName} opening at ${job.organisationName}. Verified school vacancy in India.`,
    identifier: {
      '@type': 'PropertyValue',
      name: job.organisationName,
      value: job.id,
    },
    datePosted,
    validThrough,
    employmentType: job.roleType === 'Part-Time' ? 'PART_TIME' : 'FULL_TIME',
    directApply: true,
    hiringOrganization: {
      '@type': 'Organization',
      name: job.organisationName,
      sameAs: job.websiteUrl || job.website || undefined,
      logo: job.organisationLogo || 'https://www.cseel.org/images/cseel-social-preview.jpg',
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        streetAddress: job.address || structuredLoc || job.city || 'India',
        addressLocality: job.district || job.city || 'India',
        addressRegion: job.state || '',
        addressCountry: 'IN',
      },
      ...(job.coordinates ? {
        geo: {
          '@type': 'GeoCoordinates',
          latitude: job.coordinates.lat,
          longitude: job.coordinates.lng,
        }
      } : {}),
    },
    applicantLocationRequirements: {
      '@type': 'Country',
      name: 'India',
    },
  };

  // Add Base Salary if numeric range detected
  if (salaryParsed.min) {
    jobSchema.baseSalary = {
      '@type': 'MonetaryAmount',
      currency: 'INR',
      value: {
        '@type': 'QuantitativeValue',
        minValue: salaryParsed.min,
        maxValue: salaryParsed.max || salaryParsed.min,
        unitText: salaryParsed.unitText,
      },
    };
  }

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

  // Find related jobs
  const relatedJobs = allJobs.filter(
    (j) => j.id !== job!.id && ((job!.subject && j.subject === job!.subject) || (job!.city && j.city === job!.city))
  ).slice(0, 4);

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
