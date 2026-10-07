import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: "Privacy Policy | CSEEL India",
  description: "Read our privacy policy to understand how CSEEL protects student, teacher, and school data.",
  keywords: "CSEEL privacy policy, data protection",
  alternates: {
    canonical: "https://www.cseel.org/privacy",
  },
  openGraph: {
    title: "Privacy Policy | CSEEL India",
    description: "Read our privacy policy to understand how CSEEL protects student, teacher, and school data.",
    url: "https://www.cseel.org/privacy",
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
    title: "Privacy Policy | CSEEL India",
    description: "Read our privacy policy to understand how CSEEL protects student, teacher, and school data.",
    images: ["https://www.cseel.org/images/og-cover.jpg"],
  },
};

export default function Page() {
  return <Client />;
}
