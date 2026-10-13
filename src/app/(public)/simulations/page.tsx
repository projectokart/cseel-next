import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: "hands-on science experiments & live labs India | Chemistry, Biology, Physics | CSEEL",
  description: "Explore 200+ hands-on science experiments & live labs for Chemistry, Biology, Physics, Engineering & Mathematics. Aligned with CBSE, ICSE, NCERT. Free demo available. CSEEL India.",
  keywords: "experiential science lab India, online hands-on science experiments, chemistry experiments India, biology live lab, physics live practicals CBSE, ICSE science practical, NCERT experiments, hands-on science India",
  alternates: {
    canonical: "https://www.cseel.org/simulations",
  },
  openGraph: {
    title: "hands-on science experiments & live labs India | Chemistry, Biology, Physics | CSEEL",
    description: "Explore 200+ hands-on science experiments & live labs for Chemistry, Biology, Physics, Engineering & Mathematics. Aligned with CBSE, ICSE, NCERT. Free demo available. CSEEL India.",
    url: "https://www.cseel.org/simulations",
    siteName: "CSEEL - Center for Scientific Exploration & Experiential Learning",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://www.cseel.org/images/og-simulations.jpg",
        width: 1200,
        height: 630,
        alt: "Interactive Science Practical Simulations & Live Labs - CSEEL",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@cseel_org",
    creator: "@cseel_org",
    title: "Hands-on Science Experiments & Live Labs India | Chemistry, Biology, Physics | CSEEL",
    description: "Explore 200+ hands-on science experiments & live labs for Chemistry, Biology, Physics, Engineering & Mathematics. Aligned with CBSE, ICSE, NCERT. Free demo available. CSEEL India.",
    images: ["https://www.cseel.org/images/og-simulations.jpg"],
  },
};

export default function Page() {
  return <Client />;
}
