import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: "Science Experiments & Simulations for Students India | CSEEL",
  description: "CSEEL helps students in India learn science by doing. Explore live labs, hands-on experiments, and science projects aligned with CBSE, ICSE, and state boards.",
  keywords: "science experiments students India, live lab students, CBSE science students, ICSE science practical, science project India, online science learning",
  alternates: {
    canonical: "https://www.cseel.org/for-students",
  },
  openGraph: {
    title: "Science Experiments & Simulations for Students India | CSEEL",
    description: "CSEEL helps students in India learn science by doing. Explore live labs, hands-on experiments, and science projects aligned with CBSE, ICSE, and state boards.",
    url: "https://www.cseel.org/for-students",
    siteName: "CSEEL - Center for Scientific Exploration & Experiential Learning",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://www.cseel.org/images/og-experiments.jpg",
        width: 1200,
        height: 630,
        alt: "Science Experiments & Simulations for Students - CSEEL",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@cseel_org",
    creator: "@cseel_org",
    title: "Science Experiments & Simulations for Students India | CSEEL",
    description: "CSEEL helps students in India learn science by doing. Explore live labs, hands-on experiments, and science projects aligned with CBSE, ICSE, and state boards.",
    images: ["https://www.cseel.org/images/og-experiments.jpg"],
  },
};

export default function Page() {
  return <Client />;
}
