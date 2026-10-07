import type { Metadata, Viewport } from 'next';
import SchoolFinderClient from './Client';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'School Search & Finder | Find Best Schools Near You | CSEEL',
  description: 'Explore, search and discover verified CBSE, ICSE, Government, and Private schools near your location with interactive map, real-time distance calculator, STEM labs, ATL Tinkering labs, and official UDISE data.',
  keywords: [
    'school finder',
    'find schools near me',
    'CBSE schools near me',
    'Government schools directory',
    'best schools in Rewari Haryana',
    'UDISE school search',
    'CSEEL school search',
    'school map finder',
    'PM SHRI schools',
    'school student teacher ratio'
  ],
  authors: [{ name: 'CSEEL Educational Network', url: 'https://cseel.org' }],
  creator: 'CSEEL',
  publisher: 'CSEEL Educational Network',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://schoolsearch.cseel.org',
  },
  openGraph: {
    title: 'School Search & Finder | Find Best Schools Near You | CSEEL',
    description: 'Explore, search and discover verified CBSE, ICSE, Government, and Private schools near your location with interactive map, real-time distance calculator, and official UDISE data.',
    url: 'https://schoolsearch.cseel.org',
    siteName: 'CSEEL School Finder',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'School Search & Finder | Find Best Schools Near You | CSEEL',
    description: 'Find verified CBSE, ICSE, Govt, and Private schools near you with interactive map and UDISE data.',
    creator: '@cseel_org',
  },
};

export default function SchoolFinderPage() {
  return <SchoolFinderClient />;
}
