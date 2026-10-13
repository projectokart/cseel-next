import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: "Science Lab Materials & Equipment Store | CSEEL India",
  description: "Purchase high-quality science lab apparatus, chemical reagents, glassware, and DIY STEM kits for schools, teachers, and student science experiments.",
  keywords: "buy science lab materials India, laboratory equipment online India, science experiment kits, school lab chemicals",
  alternates: {
    canonical: "https://www.cseel.org/materials",
  },
  openGraph: {
    title: "Science Lab Materials & Equipment Store | CSEEL India",
    description: "Purchase high-quality science lab apparatus, chemical reagents, glassware, and DIY STEM kits for schools, teachers, and student science experiments.",
    url: "https://www.cseel.org/materials",
    siteName: "CSEEL - Center for Scientific Exploration & Experiential Learning",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://www.cseel.org/images/og-materials.jpg",
        width: 1200,
        height: 630,
        alt: "Science Lab Materials, Apparatus & STEM Kits - CSEEL",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@cseel_org",
    creator: "@cseel_org",
    title: "Science Lab Materials & Equipment Store | CSEEL India",
    description: "Purchase high-quality science lab apparatus, chemical reagents, glassware, and DIY STEM kits for schools, teachers, and student science experiments.",
    images: ["https://www.cseel.org/images/og-materials.jpg"],
  },
};

export default function Page() {
  return <Client />;
}
