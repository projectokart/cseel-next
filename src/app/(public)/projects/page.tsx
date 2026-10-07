import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: "Top Science Working Models & Projects for Class 6-12 | CBSE & ICSE | CSEEL",
  description: "Explore 500+ top science projects, working models, and DIY innovations for school students from Class 6 to 12. Aligned with CBSE, ICSE, and NEP 2020 experiential learning standards.",
  keywords: [
    "top science projects for school students",
    "science working models for class 6 to 12",
    "CBSE science exhibition working models",
    "ICSE science practical projects",
    "physics working models for school",
    "chemistry science exhibition projects",
    "biology working models and diagrams",
    "environmental science project ideas",
    "robotics and AI projects for kids India",
    "national science fair competition projects",
    "learning by doing science innovations"
  ].join(", "),
  alternates: {
    canonical: "https://www.cseel.org/projects",
  },
  openGraph: {
    title: "Top Science Working Models & Projects for Class 6-12 | CBSE & ICSE | CSEEL",
    description: "Browse 500+ student science innovations, working models, and DIY experiments from across India.",
    url: "https://www.cseel.org/projects",
    siteName: "CSEEL",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://www.cseel.org/images/og-cover.jpg",
        width: 1200,
        height: 630,
        alt: "CSEEL - Top Student Science Working Models India",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@cseel_org",
    title: "Top Science Working Models & Projects for Class 6-12 | CSEEL",
    description: "Browse 500+ student science innovations, working models, and DIY experiments from across India.",
    images: ["https://www.cseel.org/images/og-cover.jpg"],
  },
};

export default function Page() {
  return <Client />;
}
