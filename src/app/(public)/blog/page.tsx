import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: "Science Education Blog | Tips, Experiments & STEM News India | CSEEL",
  description: "Read the CSEEL blog for science education tips, experiment ideas, STEM news, and teacher resources. Helping educators and students across India stay inspired.",
  keywords: "science education blog India, STEM blog India, science experiments blog, science teacher resources India, science news India",
  alternates: {
    canonical: "https://www.cseel.org/blog",
  },
  openGraph: {
    title: "Science Education Blog | Tips, Experiments & STEM News India | CSEEL",
    description: "Read the CSEEL blog for science education tips, experiment ideas, STEM news, and teacher resources. Helping educators and students across India stay inspired.",
    url: "https://www.cseel.org/blog",
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
    title: "Science Education Blog | Tips, Experiments & STEM News India | CSEEL",
    description: "Read the CSEEL blog for science education tips, experiment ideas, STEM news, and teacher resources. Helping educators and students across India stay inspired.",
    images: ["https://www.cseel.org/images/og-cover.jpg"],
  },
};

export default function Page() {
  return <Client />;
}
