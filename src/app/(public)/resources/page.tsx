import { Metadata } from 'next';
import ResourcesClient from './Client';

export const metadata: Metadata = {
  title: 'School Resources, Government Schemes & Lab Manuals | CSEEL India',
  description: 'Comprehensive resource repository for Indian schools: PM SHRI & ATL Government schemes, lab apparatus material catalog, experiment manuals, STEM blog, press news, and educator careers.',
  keywords: [
    'School Government Schemes India',
    'PM SHRI Lab Grants',
    'ATL NITI Aayog Schemes',
    'School Lab Manuals CBSE',
    'Science Lab Materials Catalog',
    'STEM Education Blog',
    'Science Teacher Careers India',
    'CSEEL Resources'
  ],
  alternates: {
    canonical: 'https://www.cseel.org/resources',
  },
  openGraph: {
    title: 'School Resources, Government Schemes & Lab Manuals | CSEEL India',
    description: 'Explore funding schemes (PM SHRI, ATL, Samagra Shiksha), lab supplies, practical manuals, blogs, and careers.',
    url: 'https://www.cseel.org/resources',
    type: 'website',
  },
};

export default function ResourcesPage() {
  return <ResourcesClient />;
}
