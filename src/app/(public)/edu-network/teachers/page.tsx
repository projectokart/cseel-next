import { Metadata } from 'next';
import TeachersClient from './Client';
import { RAW_FACULTY_JOBS } from '@/data/facultyJobsData';
import { ALL_TEACHERS } from '@/lib/eduNetworkData';

export const metadata: Metadata = {
  title: 'Verified STEM Faculty Directory & School Vacancies | CSEEL',
  description: 'Connect with verified Physics, Chemistry, Biology, Mathematics, Robotics and AI school educators across India. Browse active PGT, TGT, PRT teaching vacancies with transparent salary bands.',
  keywords: [
    'STEM teacher vacancies India',
    'CBSE school teaching jobs',
    'PGT Physics teacher vacancies',
    'TGT Science educator directory',
    'PRT Mathematics teaching jobs Delhi NCR',
    'Verified school faculty network',
    'NEP 2020 STEM teachers',
    'Robotics and ATL mentor vacancies'
  ],
  alternates: {
    canonical: 'https://www.cseel.org/edu-network/teachers',
  },
  openGraph: {
    title: 'Verified STEM Faculty Directory & School Vacancies | CSEEL',
    description: 'Connect with verified Physics, Chemistry, Biology, Mathematics, Robotics and AI school educators across India. Browse active PGT, TGT, PRT teaching vacancies with transparent salary bands.',
    url: 'https://www.cseel.org/edu-network/teachers',
    siteName: 'CSEEL EduNetwork',
    images: [
      {
        url: 'https://www.cseel.org/images/cseel-social-preview.jpg',
        width: 1200,
        height: 630,
        alt: 'CSEEL Verified Faculty Directory & School Vacancies',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Verified STEM Faculty Directory & School Vacancies | CSEEL',
    description: 'Find verified school educators and browse active STEM teaching vacancies with transparent salary bands across India.',
    images: ['https://www.cseel.org/images/cseel-social-preview.jpg'],
  },
};

export default function TeachersPage() {
  // Schema.org CollectionPage & ItemList Structured Data for Google Indexing
  const directorySchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'CSEEL Verified STEM Faculty & School Vacancy Directory',
    description: 'Search verified STEM school educators and active teaching appointments across India.',
    url: 'https://www.cseel.org/edu-network/teachers',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: [
        ...RAW_FACULTY_JOBS.slice(0, 10).map((job, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: `${job.jobPostName} at ${job.organisationName}`,
          url: `https://www.cseel.org/edu-network/teachers/job/${job.id}`,
        })),
        ...ALL_TEACHERS.slice(0, 10).map((teacher, idx) => ({
          '@type': 'ListItem',
          position: RAW_FACULTY_JOBS.length + idx + 1,
          name: `${teacher.name} (${teacher.subject} Educator, ${teacher.city})`,
          url: `https://www.cseel.org/edu-network/teachers/${teacher.slug || teacher.id}`,
        }))
      ]
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://www.cseel.org'
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Edu Network',
          item: 'https://www.cseel.org/edu-network'
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Faculty & Vacancies',
          item: 'https://www.cseel.org/edu-network/teachers'
        }
      ]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(directorySchema) }}
      />
      <TeachersClient />
    </>
  );
}
