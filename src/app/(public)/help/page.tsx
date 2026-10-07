import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: "Help Center & FAQs | CSEEL Science Learning Platform",
  description: "Find answers to frequently asked questions about CSEEL live labs, system requirements, subscription plans, and teacher resources.",
  keywords: "CSEEL help center, science lab FAQs, hands-on experiment guides",
  alternates: {
    canonical: "https://www.cseel.org/help",
  },
  openGraph: {
    title: "Help Center & FAQs | CSEEL Science Learning Platform",
    description: "Find answers to frequently asked questions about CSEEL live labs, system requirements, subscription plans, and teacher resources.",
    url: "https://www.cseel.org/help",
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
    title: "Help Center & FAQs | CSEEL Science Learning Platform",
    description: "Find answers to frequently asked questions about CSEEL live labs, system requirements, subscription plans, and teacher resources.",
    images: ["https://www.cseel.org/images/og-cover.jpg"],
  },
};

export default function Page() {
  return <Client />;
}
