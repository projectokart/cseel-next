import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: "Careers at CSEEL | Join India's Leading Science Education Platform",
  description: "Join the CSEEL team! We're hiring science educators, developers, and content creators passionate about transforming science education in India. Explore open positions.",
  keywords: "careers CSEEL, science education jobs India, edtech jobs India, science teacher jobs India",
  alternates: {
    canonical: "https://www.cseel.org/careers",
  },
  openGraph: {
    title: "Careers at CSEEL | Join India's Leading Science Education Platform",
    description: "Join the CSEEL team! We're hiring science educators, developers, and content creators passionate about transforming science education in India. Explore open positions.",
    url: "https://www.cseel.org/careers",
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
    title: "Careers at CSEEL | Join India's Leading Science Education Platform",
    description: "Join the CSEEL team! We're hiring science educators, developers, and content creators passionate about transforming science education in India. Explore open positions.",
    images: ["https://www.cseel.org/images/og-cover.jpg"],
  },
};

export default function Page() {
  return <Client />;
}
