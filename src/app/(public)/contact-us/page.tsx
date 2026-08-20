import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: "Contact CSEEL | Science Education Platform India",
  description: "Get in touch with CSEEL for science education partnerships, school programs, teacher training, and workshop inquiries. Serving students and educators across India.",
  keywords: "contact CSEEL, science education India contact, school science program inquiry, teacher training India",
  alternates: {
    canonical: "https://www.cseel.org/contact-us",
  },
  openGraph: {
    title: "Contact CSEEL | Science Education Platform India",
    description: "Get in touch with CSEEL for science education partnerships, school programs, teacher training, and workshop inquiries. Serving students and educators across India.",
    url: "https://www.cseel.org/contact-us",
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
    title: "Contact CSEEL | Science Education Platform India",
    description: "Get in touch with CSEEL for science education partnerships, school programs, teacher training, and workshop inquiries. Serving students and educators across India.",
    images: ["https://www.cseel.org/images/og-cover.jpg"],
  },
};

export default function Page() {
  return <Client />;
}
