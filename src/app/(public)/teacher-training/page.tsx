import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: "Science Teacher Training Programs India | CSEEL Professional Development",
  description: "Join CSEEL's science teacher training programs in India. Online and offline workshops, certifications, and professional development for school and college science educators.",
  keywords: "science teacher training India, teacher professional development science, science workshop teachers India, teacher certification science India",
  alternates: {
    canonical: "https://www.cseel.org/teacher-training",
  },
  openGraph: {
    title: "Science Teacher Training Programs India | CSEEL Professional Development",
    description: "Join CSEEL's science teacher training programs in India. Online and offline workshops, certifications, and professional development for school and college science educators.",
    url: "https://www.cseel.org/teacher-training",
    siteName: "CSEEL - Center for Scientific Exploration & Experiential Learning",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://www.cseel.org/images/og-teachers.jpg",
        width: 1200,
        height: 630,
        alt: "NEP 2020 Science Teacher Training & Certification - CSEEL",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@cseel_org",
    creator: "@cseel_org",
    title: "Science Teacher Training Programs India | CSEEL Professional Development",
    description: "Join CSEEL's science teacher training programs in India. Online and offline workshops, certifications, and professional development for school and college science educators.",
    images: ["https://www.cseel.org/images/og-teachers.jpg"],
  },
};

export default function Page() {
  return <Client />;
}
