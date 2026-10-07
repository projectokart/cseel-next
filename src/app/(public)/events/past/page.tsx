import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: "Past Science Events & Exhibition Highlights | CSEEL India",
  description: "Review highlights, winning projects, and photos from past CSEEL national science fairs, workshops, and student science symposiums.",
  keywords: "past science events, science fair winners India, science exhibition gallery",
  alternates: {
    canonical: "https://www.cseel.org/events/past",
  },
  openGraph: {
    title: "Past Science Events & Exhibition Highlights | CSEEL India",
    description: "Review highlights, winning projects, and photos from past CSEEL national science fairs, workshops, and student science symposiums.",
    url: "https://www.cseel.org/events/past",
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
    title: "Past Science Events & Exhibition Highlights | CSEEL India",
    description: "Review highlights, winning projects, and photos from past CSEEL national science fairs, workshops, and student science symposiums.",
    images: ["https://www.cseel.org/images/og-cover.jpg"],
  },
};

export default function Page() {
  return <Client />;
}
