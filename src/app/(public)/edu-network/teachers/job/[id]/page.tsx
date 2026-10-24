import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { RAW_FACULTY_JOBS, FacultyJobItem } from '@/data/facultyJobsData';
import SingleJobClient from './SingleJobClient';

interface Props {
  params: {
    id: string;
  };
}

export async function generateStaticParams() {
  return RAW_FACULTY_JOBS.map((job) => ({
    id: job.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const job = RAW_FACULTY_JOBS.find((j) => j.id === params.id);
  if (!job) {
    return {
      title: 'Job Not Found | CSEEL STEM Indexer',
    };
  }

  const title = `${job.jobPostName} at ${job.organisationName} | Teaching Vacancy`;
  const description = `${job.shortDescription} Salary: ${job.salary}. Location: ${job.city}, ${job.state}. Board: ${job.board || 'CBSE'}. Apply directly on ${job.source}.`;

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
          url: job.organisationLogo || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80',
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
      images: [job.organisationLogo || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80'],
    },
  };
}

export default function SingleJobPage({ params }: Props) {
  const job = RAW_FACULTY_JOBS.find((j) => j.id === params.id);

  if (!job) {
    notFound();
  }

  // Schema.org JobPosting Structured Data for Google Jobs Indexing
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.jobPostName,
    description: job.shortDescription,
    identifier: {
      '@type': 'PropertyValue',
      name: job.organisationName,
      value: job.id,
    },
    datePosted: job.openingDate,
    validThrough: job.lastDate,
    employmentType: 'FULL_TIME',
    hiringOrganization: {
      '@type': 'Organization',
      name: job.organisationName,
      logo: job.organisationLogo,
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        streetAddress: job.address,
        addressLocality: job.city,
        addressRegion: job.state,
        addressCountry: 'IN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: job.coordinates.lat,
        longitude: job.coordinates.lng,
      },
    },
    baseSalary: {
      '@type': 'MonetaryAmount',
      currency: 'INR',
      value: {
        '@type': 'QuantitativeValue',
        minValue: job.salaryMin || 600000,
        maxValue: job.salaryMax || 1200000,
        unitText: 'YEAR',
      },
    },
  };

  // Find related jobs in same subject or city
  const relatedJobs = RAW_FACULTY_JOBS.filter(
    (j) => j.id !== job.id && (j.subject === job.subject || j.city === job.city)
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
