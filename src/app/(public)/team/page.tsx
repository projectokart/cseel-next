import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: "Our Team | Scientists & Educators Behind CSEEL India",
  description: "Meet the passionate team of scientists, educators, and innovators behind CSEEL — India's leading experimental science learning platform.",
  keywords: "CSEEL team, science educators India, CSEEL founders, science curriculum experts",
  alternates: {
    canonical: "https://www.cseel.org/team",
  },
  openGraph: {
    title: "Our Team | Scientists & Educators Behind CSEEL India",
    description: "Meet the passionate team of scientists, educators, and innovators behind CSEEL — India's leading experimental science learning platform.",
    url: "https://www.cseel.org/team",
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
    title: "Our Team | Scientists & Educators Behind CSEEL India",
    description: "Meet the passionate team of scientists, educators, and innovators behind CSEEL — India's leading experimental science learning platform.",
    images: ["https://www.cseel.org/images/og-cover.jpg"],
  },
};

export default function Page() {
  return <Client />;
}
