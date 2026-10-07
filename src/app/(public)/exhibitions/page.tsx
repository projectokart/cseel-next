import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: "National Science Exhibitions India | CSEEL Science Fairs",
  description: "Participate in CSEEL's national and international science exhibitions in India. Showcase your science projects, compete with students nationwide, and win recognition.",
  keywords: "national science exhibition India, science fair India, science competition students India, science expo India, student science project exhibition",
  alternates: {
    canonical: "https://www.cseel.org/exhibitions",
  },
  openGraph: {
    title: "National Science Exhibitions India | CSEEL Science Fairs",
    description: "Participate in CSEEL's national and international science exhibitions in India. Showcase your science projects, compete with students nationwide, and win recognition.",
    url: "https://www.cseel.org/exhibitions",
    siteName: "CSEEL",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://www.cseel.org/images/og-cover.jpg",
        width: 1200,
        height: 630,
        alt: "CSEEL - Center for Scientific Exploration & Experimental Learning",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@cseel_org",
    title: "National Science Exhibitions India | CSEEL Science Fairs",
    description: "Participate in CSEEL's national and international science exhibitions in India. Showcase your science projects, compete with students nationwide, and win recognition.",
    images: ["https://www.cseel.org/images/og-cover.jpg"],
  },
};

export default function Page() {
  return <Client />;
}
