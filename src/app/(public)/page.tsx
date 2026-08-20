import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: "CSEEL | India's #1 Experimental Science Learning Platform",
  description: "CSEEL offers hands-on science experiments, virtual lab simulations, STEM education, teacher training, and national science exhibitions for students and educators across India. Aligned with CBSE, ICSE & NCERT.",
  keywords: "science education India, hands-on science experiments, virtual science lab India, STEM education India, CSEEL, experimental learning India, science exhibitions India, chemistry experiments India, physics simulations India, biology practicals India",
  alternates: {
    canonical: "https://www.cseel.org",
  },
  openGraph: {
    title: "CSEEL | India's #1 Experimental Science Learning Platform",
    description: "CSEEL offers hands-on science experiments, virtual lab simulations, STEM education, teacher training, and national science exhibitions for students and educators across India. Aligned with CBSE, ICSE & NCERT.",
    url: "https://www.cseel.org",
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
    title: "CSEEL | India's #1 Experimental Science Learning Platform",
    description: "CSEEL offers hands-on science experiments, virtual lab simulations, STEM education, teacher training, and national science exhibitions for students and educators across India. Aligned with CBSE, ICSE & NCERT.",
    images: ["https://www.cseel.org/images/og-cover.jpg"],
  },
};

export default function Page() {
  return <Client />;
}
