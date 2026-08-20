import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: "Science Programs for Schools & Colleges India | CSEEL Institutional Plans",
  description: "CSEEL offers institutional plans for schools and colleges in India. Get access to virtual science labs, experiment kits, teacher training, and curriculum mapping services.",
  keywords: "science program schools India, college science platform, institutional science plan India, school STEM program India, virtual lab school India",
  alternates: {
    canonical: "https://www.cseel.org/for-institutions",
  },
  openGraph: {
    title: "Science Programs for Schools & Colleges India | CSEEL Institutional Plans",
    description: "CSEEL offers institutional plans for schools and colleges in India. Get access to virtual science labs, experiment kits, teacher training, and curriculum mapping services.",
    url: "https://www.cseel.org/for-institutions",
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
    title: "Science Programs for Schools & Colleges India | CSEEL Institutional Plans",
    description: "CSEEL offers institutional plans for schools and colleges in India. Get access to virtual science labs, experiment kits, teacher training, and curriculum mapping services.",
    images: ["https://www.cseel.org/images/og-cover.jpg"],
  },
};

export default function Page() {
  return <Client />;
}
