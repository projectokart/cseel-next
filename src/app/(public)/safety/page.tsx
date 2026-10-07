import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: "Laboratory Safety Guidelines & Protocols | CSEEL",
  description: "Comprehensive science laboratory safety rules, chemical handling protocols, and protective measures for school labs and home experiments.",
  keywords: "science lab safety India, laboratory rules students, chemical safety protocols, school lab guidelines",
  alternates: {
    canonical: "https://www.cseel.org/safety",
  },
  openGraph: {
    title: "Laboratory Safety Guidelines & Protocols | CSEEL",
    description: "Comprehensive science laboratory safety rules, chemical handling protocols, and protective measures for school labs and home experiments.",
    url: "https://www.cseel.org/safety",
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
    title: "Laboratory Safety Guidelines & Protocols | CSEEL",
    description: "Comprehensive science laboratory safety rules, chemical handling protocols, and protective measures for school labs and home experiments.",
    images: ["https://www.cseel.org/images/og-cover.jpg"],
  },
};

export default function Page() {
  return <Client />;
}
