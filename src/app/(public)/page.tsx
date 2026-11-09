import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: "CSEEL | India's #1 Experimental Science Learning Platform",
  description: "CSEEL offers hands-on science experiments, virtual lab simulations, STEM education, teacher training, and national science exhibitions for students and educators across India. Aligned with CBSE, ICSE & NCERT.",
  alternates: {
    canonical: "https://www.cseel.org",
  },
  openGraph: {
    title: "CSEEL | India's #1 Experimental Science Learning Platform",
    description: "CSEEL offers hands-on science experiments, virtual lab simulations, STEM education, teacher training, and national science exhibitions for students and educators across India. Aligned with CBSE, ICSE & NCERT.",
    url: "https://www.cseel.org",
    siteName: "CSEEL - Center for Scientific Exploration & Experiential Learning",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://www.cseel.org/images/cseel-social-preview.jpg",
        secureUrl: "https://www.cseel.org/images/cseel-social-preview.jpg",
        width: 1200,
        height: 630,
        alt: "CSEEL - Center for Scientific Exploration & Experiential Learning",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@cseel_org",
    creator: "@cseel_org",
    title: "CSEEL | India's #1 Experiential Science & STEM Learning Platform",
    description: "CSEEL offers hands-on science experiments, virtual lab simulations, STEM education, teacher training, and national science exhibitions for students and educators across India. Aligned with CBSE, ICSE & NCERT.",
    images: ["https://www.cseel.org/images/cseel-social-preview.jpg"],
  },
};

export default function Page() {
  return <Client />;
}
