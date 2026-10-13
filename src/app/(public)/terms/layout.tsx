import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | CSEEL - Center for Scientific Exploration and Experiential Learning',
  description: 'Review the official CSEEL Terms of Service and institutional usage agreements for schools, teachers, and student learners.',
  alternates: {
    canonical: 'https://www.cseel.org/terms',
  },
  openGraph: {
    title: 'Terms of Service | CSEEL',
    description: 'Terms and conditions for utilizing CSEEL STEM virtual laboratories, school directories, and educational services.',
    url: 'https://www.cseel.org/terms',
    siteName: 'CSEEL - Center for Scientific Exploration & Experiential Learning',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: 'https://www.cseel.org/images/og-cover.jpg',
        width: 1200,
        height: 630,
        alt: 'CSEEL Terms of Service and Institutional Usage Agreements',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@cseel_org',
    creator: '@cseel_org',
    title: 'Terms of Service | CSEEL',
    description: 'Terms and conditions for utilizing CSEEL educational services.',
    images: ['https://www.cseel.org/images/og-cover.jpg'],
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
