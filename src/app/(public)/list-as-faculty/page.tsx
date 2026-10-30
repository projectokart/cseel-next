import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'List as Faculty | Get Direct Interview Calls from 28,000+ Schools | CSEEL',
  description: 'Are you a School Teacher? Join CSEEL as a Faculty and inspire students through hands-on, experimental learning. Get direct interview calls from 28,000+ verified schools across India.',
  keywords: [
    'List as Faculty',
    'School Teacher Recruitment',
    'CBSE School Teaching Jobs',
    'Teacher Registration',
    'Verified Faculty Directory',
    'Teaching Vacancies India',
  ],
  alternates: {
    canonical: 'https://www.cseel.org/list-as-faculty',
  },
  openGraph: {
    title: 'List as Faculty | Get Direct Interview Calls from 28,000+ Schools | CSEEL',
    description: 'Join CSEEL as a Faculty and get direct interview calls from verified schools across India.',
    url: 'https://www.cseel.org/list-as-faculty',
    images: ['/images/banners/faculty-hiring-banner-2.webp'],
  },
};

export default function ListAsFacultyPage() {
  redirect('https://docs.google.com/forms/d/e/1FAIpQLScgKoheaC5BRHhpGPUQHSOFbaCJpuK2LCz82I7Ii7RIR_Z-RQ/viewform');
}
