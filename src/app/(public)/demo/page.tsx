import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: "Request a Free Science Lab Demo | CSEEL India",
  description: "Book a personalized live demo of CSEEL's virtual science simulations and experimental learning platform for your school or institution.",
  keywords: "science lab demo, virtual lab demonstration India, CSEEL free demo, book school science demo",
  alternates: {
    canonical: "https://www.cseel.org/demo",
  },
  openGraph: {
    title: "Request a Free Science Lab Demo | CSEEL India",
    description: "Book a personalized live demo of CSEEL's virtual science simulations and experimental learning platform for your school or institution.",
    url: "https://www.cseel.org/demo",
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
    title: "Request a Free Science Lab Demo | CSEEL India",
    description: "Book a personalized live demo of CSEEL's virtual science simulations and experimental learning platform for your school or institution.",
    images: ["https://www.cseel.org/images/og-cover.jpg"],
  },
};

export default function Page() {
  return <Client />;
}
