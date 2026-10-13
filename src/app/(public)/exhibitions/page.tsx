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
    siteName: "CSEEL - Center for Scientific Exploration & Experiential Learning",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://www.cseel.org/images/og-events.jpg",
        width: 1200,
        height: 630,
        alt: "National Science Exhibitions & Fairs - CSEEL",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@cseel_org",
    creator: "@cseel_org",
    title: "National Science Exhibitions India | CSEEL Science Fairs",
    description: "Participate in CSEEL's national and international science exhibitions in India. Showcase your science projects, compete with students nationwide, and win recognition.",
    images: ["https://www.cseel.org/images/og-events.jpg"],
  },
};

export default function Page() {
  return <Client />;
}
