import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getActiveFacultyJobs, FacultyJobItem } from '@/data/facultyJobsData';
import { SupabaseJobService } from '@/lib/services/supabaseJobService';
import SingleJobClient from './SingleJobClient';

export const dynamic = 'force-dynamic';

interface Props {
  params: {
    id: string;
  };
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
      title: 'Job Not Found | CSEEL STEM Indexer',
    };
  }

  const locationStr = [job.city || job.district, job.state].filter(Boolean).join(', ') || 'India';
  const title = `${job.jobPostName} at ${job.organisationName} in ${locationStr} | School Teaching Vacancy`;
  const description = `${job.shortDescription || `${job.jobPostName} vacancy at ${job.organisationName}`}. Compensation: ${job.salary && job.salary !== '---' ? job.salary : 'Best in industry'}. Location: ${locationStr}. Apply directly via verified original source.`;

  return {
    title,
    description,
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
          url: job.organisationLogo || 'https://www.cseel.org/og-cover.png',
          width: 800,
          height: 600,
          alt: job.organisationName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [job.organisationLogo || 'https://www.cseel.org/og-cover.png'],
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

  // Schema.org JobPosting Structured Data for Google Jobs Indexing (Strict Google Jobs Validator Compliant)
  const jsonLd: any = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.jobPostName,
    description: job.shortDescription || `${job.jobPostName} opening at ${job.organisationName}`,
    identifier: {
      '@type': 'PropertyValue',
      name: job.organisationName,
      value: job.id,
    },
    employmentType: job.roleType === 'Part-Time' ? 'PART_TIME' : 'FULL_TIME',
    hiringOrganization: {
      '@type': 'Organization',
      name: job.organisationName,
      ...(job.organisationLogo ? { logo: job.organisationLogo } : {}),
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        streetAddress: job.address || job.city || 'India',
        addressLocality: job.city || job.district || 'India',
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
  };

  if (job.openingDate) {
    jsonLd.datePosted = job.openingDate;
  }
  if (job.lastDate) {
    jsonLd.validThrough = job.lastDate;
  }

  if (job.salaryMin && job.salaryMax) {
    jsonLd.baseSalary = {
      '@type': 'MonetaryAmount',
      currency: 'INR',
      value: {
        '@type': 'QuantitativeValue',
        minValue: job.salaryMin,
        maxValue: job.salaryMax,
        unitText: 'YEAR',
      },
    };
  }

  // Find related jobs in same subject or city
  const relatedJobs = allJobs.filter(
    (j) => j.id !== job!.id && ((job!.subject && j.subject === job!.subject) || (job!.city && j.city === job!.city))
  ).slice(0, 4);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SingleJobClient job={job} relatedJobs={relatedJobs} />
    </>
  );
}
