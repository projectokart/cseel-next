import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: "About Us | Transforming Science Education Across India | CSEEL",
  description: "Learn about CSEEL's mission to bridge the gap between theoretical science and practical experimentation for students and educators across India.",
  keywords: "about CSEEL, science education mission India, experimental learning platform, STEM initiative India",
  alternates: {
    canonical: "https://www.cseel.org/about-us",
  },
  openGraph: {
    title: "About Us | Transforming Science Education Across India | CSEEL",
    description: "Learn about CSEEL's mission to bridge the gap between theoretical science and practical experimentation for students and educators across India.",
    url: "https://www.cseel.org/about-us",
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
    title: "About Us | Transforming Science Education Across India | CSEEL",
    description: "Learn about CSEEL's mission to bridge the gap between theoretical science and practical experimentation for students and educators across India.",
    images: ["https://www.cseel.org/images/og-cover.jpg"],
  },
};

export default function Page() {
  return <Client />;
}
