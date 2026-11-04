import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: "CSEEL Institutional Plans | Experiential Science Labs",
  description: "Compare CSEEL subscription plans for schools, colleges, and individual learners. Tailored options for experiential science labs and hands-on experiment kits in India.",
  keywords: "CSEEL school plans India, science lab subscription India, school science plan, live lab pricing India",
  alternates: {
    canonical: "https://www.cseel.org/compare-plans",
  },
  openGraph: {
    title: "CSEEL Institutional Plans | Experiential Science Labs",
    description: "Compare CSEEL subscription plans for schools, colleges, and individual learners. Tailored options for experiential science labs and hands-on experiment kits in India.",
    url: "https://www.cseel.org/compare-plans",
    siteName: "CSEEL",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://www.cseel.org/images/cseel-social-preview.jpg",
        width: 1200,
        height: 630,
        alt: "CSEEL - Center for Scientific Exploration & Experimental Learning",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@cseel_org",
    title: "CSEEL Institutional Plans | Experiential Science Labs",
    description: "Compare CSEEL subscription plans for schools, colleges, and individual learners. Tailored options for experiential science labs and hands-on experiment kits in India.",
    images: ["https://www.cseel.org/images/cseel-social-preview.jpg"],
  },
};

export default function Page() {
  return <Client />;
}
