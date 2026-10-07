import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: "Science Community Feed | Discussions & Project Sharing | CSEEL",
  description: "Join India's largest science learning community. Share your experiment discoveries, ask scientific questions, and connect with fellow students and educators.",
  keywords: "science community India, student science forum, science discussion feed, STEM social network",
  alternates: {
    canonical: "https://www.cseel.org/feed",
  },
  openGraph: {
    title: "Science Community Feed | Discussions & Project Sharing | CSEEL",
    description: "Join India's largest science learning community. Share your experiment discoveries, ask scientific questions, and connect with fellow students and educators.",
    url: "https://www.cseel.org/feed",
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
    title: "Science Community Feed | Discussions & Project Sharing | CSEEL",
    description: "Join India's largest science learning community. Share your experiment discoveries, ask scientific questions, and connect with fellow students and educators.",
    images: ["https://www.cseel.org/images/og-cover.jpg"],
  },
};

export default function Page() {
  return <Client />;
}
