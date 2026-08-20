import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: "Why Choose CSEEL? | India's Leading Experiential Science Lab",
  description: "Discover why 500+ schools and thousands of students trust CSEEL for virtual science labs, interactive simulations, and hands-on science kits.",
  keywords: "why CSEEL, best science lab India, benefits of virtual lab, experiential science education",
  alternates: {
    canonical: "https://www.cseel.org/why-cseel",
  },
  openGraph: {
    title: "Why Choose CSEEL? | India's Leading Experiential Science Lab",
    description: "Discover why 500+ schools and thousands of students trust CSEEL for virtual science labs, interactive simulations, and hands-on science kits.",
    url: "https://www.cseel.org/why-cseel",
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
    title: "Why Choose CSEEL? | India's Leading Experiential Science Lab",
    description: "Discover why 500+ schools and thousands of students trust CSEEL for virtual science labs, interactive simulations, and hands-on science kits.",
    images: ["https://www.cseel.org/images/og-cover.jpg"],
  },
};

export default function Page() {
  return <Client />;
}
