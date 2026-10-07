import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: "Science & Art Innovation Gallery | CSEEL STEAM",
  description: "Explore the intersection of science and creative arts through interactive STEAM models, scientific illustrations, and student art projects.",
  keywords: "science and art, STEAM education India, scientific illustration, creative science projects",
  alternates: {
    canonical: "https://www.cseel.org/art",
  },
  openGraph: {
    title: "Science & Art Innovation Gallery | CSEEL STEAM",
    description: "Explore the intersection of science and creative arts through interactive STEAM models, scientific illustrations, and student art projects.",
    url: "https://www.cseel.org/art",
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
    title: "Science & Art Innovation Gallery | CSEEL STEAM",
    description: "Explore the intersection of science and creative arts through interactive STEAM models, scientific illustrations, and student art projects.",
    images: ["https://www.cseel.org/images/og-cover.jpg"],
  },
};

export default function Page() {
  return <Client />;
}
