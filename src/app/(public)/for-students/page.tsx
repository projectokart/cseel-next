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
    title: "Science Experiments & Simulations for Students India | CSEEL",
    description: "CSEEL helps students in India learn science by doing. Explore live labs, hands-on experiments, and science projects aligned with CBSE, ICSE, and state boards.",
    images: ["https://www.cseel.org/images/og-cover.jpg"],
  },
};

export default function Page() {
  return <Client />;
}
