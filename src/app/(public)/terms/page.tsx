import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: "Terms of Service | CSEEL India",
  description: "Read the terms and conditions for using the CSEEL experimental science learning platform and services.",
  keywords: "CSEEL terms of service, user agreement",
  alternates: {
    canonical: "https://www.cseel.org/terms",
  },
  openGraph: {
    title: "Terms of Service | CSEEL India",
    description: "Read the terms and conditions for using the CSEEL experimental science learning platform and services.",
    url: "https://www.cseel.org/terms",
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
    title: "Terms of Service | CSEEL India",
    description: "Read the terms and conditions for using the CSEEL experimental science learning platform and services.",
    images: ["https://www.cseel.org/images/og-cover.jpg"],
  },
};

export default function Page() {
  return <Client />;
}
