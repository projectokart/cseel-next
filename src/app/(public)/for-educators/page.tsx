import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: "Science Platform for Educators & Teachers India | CSEEL",
  description: "CSEEL empowers science teachers in India with virtual lab tools, curriculum-aligned experiments, and professional development. Trusted by 1000+ educators across India.",
  keywords: "science platform teachers India, educator science tools, virtual lab teachers, science teacher professional development India, CBSE teacher science",
  alternates: {
    canonical: "https://www.cseel.org/for-educators",
  },
  openGraph: {
    title: "Science Platform for Educators & Teachers India | CSEEL",
    description: "CSEEL empowers science teachers in India with virtual lab tools, curriculum-aligned experiments, and professional development. Trusted by 1000+ educators across India.",
    url: "https://www.cseel.org/for-educators",
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
    title: "Science Platform for Educators & Teachers India | CSEEL",
    description: "CSEEL empowers science teachers in India with virtual lab tools, curriculum-aligned experiments, and professional development. Trusted by 1000+ educators across India.",
    images: ["https://www.cseel.org/images/og-cover.jpg"],
  },
};

export default function Page() {
  return <Client />;
}
