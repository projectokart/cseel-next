import { Metadata } from 'next';
import TeachersClient from './Client';
import { getActiveFacultyJobs } from '@/data/facultyJobsData';
import { ALL_TEACHERS } from '@/lib/eduNetworkData';
import { SupabaseJobService } from '@/lib/services/supabaseJobService';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Freshness dates for Google Rank #1 Priority Crawl
const CURRENT_DATE = new Date();
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const CURRENT_MONTH = MONTH_NAMES[CURRENT_DATE.getMonth()];
const CURRENT_YEAR = CURRENT_DATE.getFullYear();
const TODAY_ISO = CURRENT_DATE.toISOString().split('T')[0];

export const metadata: Metadata = {
  title: `Daily School Job Vacancies in India ${CURRENT_MONTH} ${CURRENT_YEAR} - Top CBSE & Govt Teaching Recruitment | CSEEL`,
  description: `Updated Today (${CURRENT_MONTH} ${CURRENT_YEAR}): Browse 2,180+ fresh school job vacancies in India across top CBSE, ICSE & private schools. Daily teacher recruitment for PGT, TGT, PRT, Science, Math & English with verified salaries and direct apply links.`,
  keywords: [
    `Daily School Job Vacancies in India ${CURRENT_MONTH} ${CURRENT_YEAR}`,
    `Fresh School Jobs India Top Schools Daily Update`,
    `Govt & Private School Vacancies ${CURRENT_YEAR} Registration`,
    `CBSE School Teacher Recruitment ${CURRENT_YEAR}`,
    `PGT Physics Chemistry Biology Teacher Jobs ${CURRENT_YEAR}`,
    `TGT Mathematics Science Vacancy ${CURRENT_YEAR}`,
    `PRT Primary Teacher Jobs India`,
    `School Teacher Recruitment in Delhi NCR Mumbai Bangalore Pune Hyderabad`,
    `School Faculty Vacancies India Apply Online`,
    `NEP 2020 STEM Educator Jobs`,
    `Atal Tinkering Lab ATL Mentor Vacancy`
  ],
  alternates: {
    canonical: 'https://www.cseel.org/edu-network/teachers',
  },
  openGraph: {
    title: `Daily School Job Vacancies in India ${CURRENT_MONTH} ${CURRENT_YEAR} - Top CBSE & Govt Teaching Recruitment`,
    description: `Updated Today (${CURRENT_MONTH} ${CURRENT_YEAR}): Browse 2,180+ active school teaching vacancies across India. PGT, TGT, PRT, Science, Math & Coding educators. Transparent salary bands & instant direct apply.`,
    url: 'https://www.cseel.org/edu-network/teachers',
    siteName: 'CSEEL EduNetwork',
    images: [
      {
        url: 'https://www.cseel.org/images/cseel-social-preview.jpg',
        width: 1200,
        height: 630,
        alt: `Daily School Job Vacancies India ${CURRENT_MONTH} ${CURRENT_YEAR} - CSEEL`,
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Daily School Job Vacancies in India ${CURRENT_MONTH} ${CURRENT_YEAR} | CSEEL`,
    description: `Updated Today (${CURRENT_MONTH} ${CURRENT_YEAR}): Browse 2,180+ fresh school job vacancies across India with transparent salaries & direct apply links.`,
    images: ['https://www.cseel.org/images/cseel-social-preview.jpg'],
  },
};

export default async function TeachersPage() {
  let activeJobs = await SupabaseJobService.fetchJobsFromSupabase();
  if (!activeJobs || activeJobs.length === 0) {
    activeJobs = getActiveFacultyJobs();
  }

  // Multi-Entity Structured Data: CollectionPage + ItemList + BreadcrumbList for Google for Jobs
  const jsonLdGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://www.cseel.org/edu-network/teachers#page',
        name: `Daily School Job Vacancies in India ${CURRENT_MONTH} ${CURRENT_YEAR} | CSEEL`,
        description: `Explore 2,180+ verified teaching vacancies across CBSE, ICSE, and top private schools in India. Updated daily with direct application links.`,
        url: 'https://www.cseel.org/edu-network/teachers',
        dateModified: TODAY_ISO,
        isPartOf: {
          '@type': 'WebSite',
          '@id': 'https://www.cseel.org/#website',
          name: 'CSEEL - Center for Scientific Exploration & Experiential Learning',
          url: 'https://www.cseel.org',
        },
        about: {
          '@type': 'Thing',
          name: 'School Teaching Jobs in India',
          sameAs: 'https://en.wikipedia.org/wiki/Teaching',
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://www.cseel.org/edu-network/teachers#breadcrumb',
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
            name: `School Job Vacancies (${CURRENT_MONTH} ${CURRENT_YEAR})`,
            item: 'https://www.cseel.org/edu-network/teachers',
          },
        ],
      },
      {
        '@type': 'ItemList',
        '@id': 'https://www.cseel.org/edu-network/teachers#itemlist',
        name: `Active Teaching Appointments in India (${CURRENT_MONTH} ${CURRENT_YEAR})`,
        numberOfItems: activeJobs.length,
        itemListElement: activeJobs.slice(0, 20).map((job, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          item: {
            '@type': 'JobPosting',
            title: job.jobPostName,
            description: job.shortDescription || `${job.jobPostName} at ${job.organisationName}`,
            datePosted: job.openingDate || TODAY_ISO,
            validThrough: job.lastDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            employmentType: job.roleType === 'Part-Time' ? 'PART_TIME' : 'FULL_TIME',
            directApply: true,
            hiringOrganization: {
              '@type': 'Organization',
              name: job.organisationName,
              ...(job.organisationLogo ? { logo: job.organisationLogo } : {}),
            },
            jobLocation: {
              '@type': 'Place',
              address: {
                '@type': 'PostalAddress',
                addressLocality: job.city || job.district || 'India',
                addressRegion: job.state || '',
                postalCode: (job as any).pincode || ((job.address && (job.address.match(/\b\d{6}\b/) || [])[0]) || '110001'),
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
            baseSalary: {
              '@type': 'MonetaryAmount',
              currency: 'INR',
              value: {
                '@type': 'QuantitativeValue',
                minValue: 25000,
                maxValue: 55000,
                unitText: 'MONTH',
              },
            },
            url: `https://www.cseel.org/edu-network/teachers/job/${job.id}`,
          },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
      />
      <TeachersClient initialJobs={activeJobs} />
    </>
  );
}
