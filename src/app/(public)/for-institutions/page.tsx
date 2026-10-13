import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: "Science Programs for Schools & Colleges India | CSEEL Institutional Plans",
  description: "CSEEL offers institutional plans for schools and colleges in India. Get access to experiential science labs, experiment kits, teacher training, and curriculum mapping services.",
  keywords: "science program schools India, college science platform, institutional science plan India, school STEM program India, live lab school India",
  alternates: {
    canonical: "https://www.cseel.org/for-institutions",
  },
  openGraph: {
    title: "Science Programs for Schools & Colleges India | CSEEL Institutional Plans",
    description: "CSEEL offers institutional plans for schools and colleges in India. Get access to experiential science labs, experiment kits, teacher training, and curriculum mapping services.",
    url: "https://www.cseel.org/for-institutions",
    siteName: "CSEEL - Center for Scientific Exploration & Experiential Learning",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://www.cseel.org/images/og-institutions.jpg",
        width: 1200,
        height: 630,
        alt: "Science Lab Setup for Schools & Colleges - CSEEL Institutional Plans",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@cseel_org",
    creator: "@cseel_org",
    title: "Science Programs for Schools & Colleges India | CSEEL Institutional Plans",
    description: "CSEEL offers institutional plans for schools and colleges in India. Get access to experiential science labs, experiment kits, teacher training, and curriculum mapping services.",
    images: ["https://www.cseel.org/images/og-institutions.jpg"],
  },
};

export default function Page() {
  return <Client />;
}
