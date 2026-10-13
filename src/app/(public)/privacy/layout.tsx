import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | CSEEL - Center for Scientific Exploration and Experiential Learning',
  description: 'Read the official CSEEL Privacy Policy detailing how we collect, protect, and handle personal and educational data in compliance with the DPDP Act 2023 and Indian IT regulations.',
  alternates: {
    canonical: 'https://www.cseel.org/privacy',
  },
  openGraph: {
    title: 'Privacy Policy | CSEEL',
    description: 'CSEEL data privacy, security, and DPDP Act 2023 compliance guidelines.',
    url: 'https://www.cseel.org/privacy',
    siteName: 'CSEEL - Center for Scientific Exploration & Experiential Learning',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: 'https://www.cseel.org/images/cseel-social-preview.jpg',
        width: 1200,
        height: 630,
        alt: 'CSEEL Privacy Policy and Data Protection',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@cseel_org',
    creator: '@cseel_org',
    title: 'Privacy Policy | CSEEL',
    description: 'CSEEL data privacy and DPDP Act 2023 compliance.',
    images: ['https://www.cseel.org/images/cseel-social-preview.jpg'],
  },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
