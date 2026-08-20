import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: "Student Science Projects & Innovations India | CSEEL",
  description: "Browse hundreds of student science innovations, research projects, working models, and DIY experiments from students across India.",
  keywords: "student science projects India, science fair ideas, STEM project models, national science competition entries",
  alternates: {
    canonical: "https://www.cseel.org/projects",
  },
  openGraph: {
    title: "Student Science Projects & Innovations India | CSEEL",
    description: "Browse hundreds of student science innovations, research projects, working models, and DIY experiments from students across India.",
    url: "https://www.cseel.org/projects",
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
    title: "Student Science Projects & Innovations India | CSEEL",
    description: "Browse hundreds of student science innovations, research projects, working models, and DIY experiments from students across India.",
    images: ["https://www.cseel.org/images/og-cover.jpg"],
  },
};

export default function Page() {
  return <Client />;
}
