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
    title: "Science Lab Materials & Equipment Store | CSEEL India",
    description: "Purchase high-quality science lab apparatus, chemical reagents, glassware, and DIY STEM kits for schools, teachers, and student science experiments.",
    images: ["https://www.cseel.org/images/og-cover.jpg"],
  },
};

export default function Page() {
  return <Client />;
}
