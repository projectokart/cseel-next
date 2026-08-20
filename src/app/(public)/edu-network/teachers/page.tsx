import { Metadata } from 'next';
import EduNetworkClient from '../Client';

export const metadata: Metadata = {
  title: 'Verified STEM Faculty & Teacher Directory | NEP-2020 Educators | CSEEL',
  description: 'Search and connect with 50+ verified Physics, Chemistry, Biology, Mathematics, Robotics, and Computer Science teachers across India. Filter by GPS proximity and hire directly.',
  keywords: [
    'STEM teacher directory India',
    'verified science faculty',
    'hire physics teacher',
    'robotics lab mentor',
    'NEP-2020 certified educators',
    'CSEEL faculty directory',
  ],
  alternates: {
    canonical: 'https://www.cseel.org/edu-network/teachers',
  },
  openGraph: {
    title: 'Verified STEM Faculty & Teacher Directory | CSEEL',
    description: 'Find verified educators, filter by distance radius, and send direct recruitment invitations.',
    url: 'https://www.cseel.org/edu-network/teachers',
    siteName: 'CSEEL EduNetwork',
    images: [
      {
        url: '/images/og-cover.jpg',
        width: 1200,
        height: 630,
        alt: 'CSEEL Verified Faculty Directory',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
};

export default function TeachersPage() {
  return <EduNetworkClient initialTab="teachers" />;
}
