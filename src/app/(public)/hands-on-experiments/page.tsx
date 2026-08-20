import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: "Hands-On Science Experiments | Practical Learning Kits India | CSEEL",
  description: "Explore curriculum-aligned hands-on science experiments and DIY kits for physics, chemistry, biology, and STEM across CBSE and ICSE boards.",
  keywords: "hands on science experiments, science experiment kits India, DIY science models, CBSE science practicals",
  alternates: {
    canonical: "https://www.cseel.org/hands-on-experiments",
  },
  openGraph: {
    title: "Hands-On Science Experiments | Practical Learning Kits India | CSEEL",
    description: "Explore curriculum-aligned hands-on science experiments and DIY kits for physics, chemistry, biology, and STEM across CBSE and ICSE boards.",
    url: "https://www.cseel.org/hands-on-experiments",
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
    title: "Hands-On Science Experiments | Practical Learning Kits India | CSEEL",
    description: "Explore curriculum-aligned hands-on science experiments and DIY kits for physics, chemistry, biology, and STEM across CBSE and ICSE boards.",
    images: ["https://www.cseel.org/images/og-cover.jpg"],
  },
};

export default function Page() {
  return <Client />;
}
