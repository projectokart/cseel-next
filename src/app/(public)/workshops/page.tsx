import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: "Science Workshops for Students & Schools India | CSEEL",
  description: "CSEEL conducts hands-on science workshops for students, schools, and colleges across India. Chemistry, Biology, Physics, Robotics, and STEM workshops available.",
  keywords: "science workshops India, student science workshop, school STEM workshop India, robotics workshop India, science camp India",
  alternates: {
    canonical: "https://www.cseel.org/workshops",
  },
  openGraph: {
    title: "Science Workshops for Students & Schools India | CSEEL",
    description: "CSEEL conducts hands-on science workshops for students, schools, and colleges across India. Chemistry, Biology, Physics, Robotics, and STEM workshops available.",
    url: "https://www.cseel.org/workshops",
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
    title: "Science Workshops for Students & Schools India | CSEEL",
    description: "CSEEL conducts hands-on science workshops for students, schools, and colleges across India. Chemistry, Biology, Physics, Robotics, and STEM workshops available.",
    images: ["https://www.cseel.org/images/og-cover.jpg"],
  },
};

export default function Page() {
  return <Client />;
}
