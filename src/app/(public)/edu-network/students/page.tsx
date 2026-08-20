import { Metadata } from 'next';
import EduNetworkClient from '../Client';

export const metadata: Metadata = {
  title: 'National Student Innovator Showcase & ATL Tinkering Talents | CSEEL',
  description: 'Explore 50+ outstanding school science fair prototypes, robotics projects, and verified hands-on lab experiment portfolios from young innovators across India.',
  keywords: [
    'student innovators India',
    'ATL tinkering projects',
    'CBSE national science fair winners',
    'school robotics prototypes',
    'CSEEL student showcase',
  ],
  alternates: {
    canonical: 'https://www.cseel.org/edu-network/students',
  },
  openGraph: {
    title: 'National Student Innovator Showcase | CSEEL',
    description: 'Explore student STEM prototypes, hardware schematics, and virtual simulation portfolios.',
    url: 'https://www.cseel.org/edu-network/students',
    siteName: 'CSEEL EduNetwork',
    images: [
      {
        url: '/images/og-cover.jpg',
        width: 1200,
        height: 630,
        alt: 'CSEEL Student Innovator Showcase',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
};

export default function StudentsPage() {
  return <EduNetworkClient initialTab="students" />;
}
