import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: "Upcoming Science Events & Workshops India 2026 | CSEEL",
  description: "Browse upcoming science events, workshops, exhibitions, and competitions by CSEEL across India in 2026. Register early and secure your spot.",
  keywords: "upcoming science events India 2026, science workshop 2026 India, science exhibition 2026, STEM event India",
  alternates: {
    canonical: "https://www.cseel.org/events/upcoming",
  },
  openGraph: {
    title: "Upcoming Science Events & Workshops India 2026 | CSEEL",
    description: "Browse upcoming science events, workshops, exhibitions, and competitions by CSEEL across India in 2026. Register early and secure your spot.",
    url: "https://www.cseel.org/events/upcoming",
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
    title: "Upcoming Science Events & Workshops India 2026 | CSEEL",
    description: "Browse upcoming science events, workshops, exhibitions, and competitions by CSEEL across India in 2026. Register early and secure your spot.",
    images: ["https://www.cseel.org/images/og-cover.jpg"],
  },
};

export default function Page() {
  return <Client />;
}
