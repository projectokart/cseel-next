import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: "Media Archive & Press Releases | CSEEL Science Education",
  description: "Explore photos, videos, press coverage, and publications from CSEEL's national exhibitions, workshops, and science outreach programs.",
  keywords: "CSEEL media, science fair photos, press coverage, science exhibition videos",
  alternates: {
    canonical: "https://www.cseel.org/media-archive",
  },
  openGraph: {
    title: "Media Archive & Press Releases | CSEEL Science Education",
    description: "Explore photos, videos, press coverage, and publications from CSEEL's national exhibitions, workshops, and science outreach programs.",
    url: "https://www.cseel.org/media-archive",
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
    title: "Media Archive & Press Releases | CSEEL Science Education",
    description: "Explore photos, videos, press coverage, and publications from CSEEL's national exhibitions, workshops, and science outreach programs.",
    images: ["https://www.cseel.org/images/og-cover.jpg"],
  },
};

export default function Page() {
  return <Client />;
}
