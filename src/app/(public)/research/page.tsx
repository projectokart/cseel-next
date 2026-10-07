import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: "Science Research Programs India | CSEEL Research & Innovation",
  description: "CSEEL supports science research and innovation programs for students and educators across India. Explore research opportunities, publications, and collaborations.",
  keywords: "science research India, student research program India, science innovation India, science research students",
  alternates: {
    canonical: "https://www.cseel.org/research",
  },
  openGraph: {
    title: "Science Research Programs India | CSEEL Research & Innovation",
    description: "CSEEL supports science research and innovation programs for students and educators across India. Explore research opportunities, publications, and collaborations.",
    url: "https://www.cseel.org/research",
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
    title: "Science Research Programs India | CSEEL Research & Innovation",
    description: "CSEEL supports science research and innovation programs for students and educators across India. Explore research opportunities, publications, and collaborations.",
    images: ["https://www.cseel.org/images/og-cover.jpg"],
  },
};

export default function Page() {
  return <Client />;
}
