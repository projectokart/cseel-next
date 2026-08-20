import { Metadata } from 'next';
import EduNetworkClient from '../Client';

export const metadata: Metadata = {
  title: 'STEM & School Teaching Jobs Across India | CSEEL EduNetwork Career Portal',
  description: 'Explore 40+ verified STEM teaching, physics, chemistry, biology, mathematics, robotics, and lab instructor jobs across top CBSE schools and institutes in India. Apply with 1-click.',
  keywords: [
    'STEM teacher jobs',
    'PGT Physics vacancies',
    'School teacher jobs India',
    'Robotics lab mentor jobs',
    'CBSE school recruitment 2026',
    'CSEEL EduNetwork Jobs',
  ],
  alternates: {
    canonical: 'https://www.cseel.org/edu-network/jobs',
  },
  openGraph: {
    title: 'STEM & School Teaching Jobs Across India | CSEEL',
    description: 'Explore 40+ verified STEM teaching & lab instructor vacancies across India with competitive salaries and 1-click application.',
    url: 'https://www.cseel.org/edu-network/jobs',
    siteName: 'CSEEL',
    images: [
      {
        url: '/images/og-cover.jpg',
        width: 1200,
        height: 630,
        alt: 'CSEEL STEM Jobs Portal',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
};

export default function JobsPage() {
  return <EduNetworkClient initialTab="jobs" />;
}
