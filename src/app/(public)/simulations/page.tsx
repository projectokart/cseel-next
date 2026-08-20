import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: "Virtual Science Lab Simulations India | Chemistry, Biology, Physics | CSEEL",
  description: "Explore 200+ virtual science lab simulations for Chemistry, Biology, Physics, Engineering & Mathematics. Aligned with CBSE, ICSE, NCERT. Free demo available. CSEEL India.",
  keywords: "virtual science lab India, online science simulations, chemistry experiments India, biology virtual lab, physics simulations CBSE, ICSE science practical, NCERT experiments, hands-on science India",
  alternates: {
    canonical: "https://www.cseel.org/simulations",
  },
  openGraph: {
    title: "Virtual Science Lab Simulations India | Chemistry, Biology, Physics | CSEEL",
    description: "Explore 200+ virtual science lab simulations for Chemistry, Biology, Physics, Engineering & Mathematics. Aligned with CBSE, ICSE, NCERT. Free demo available. CSEEL India.",
    url: "https://www.cseel.org/simulations",
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
    title: "Virtual Science Lab Simulations India | Chemistry, Biology, Physics | CSEEL",
    description: "Explore 200+ virtual science lab simulations for Chemistry, Biology, Physics, Engineering & Mathematics. Aligned with CBSE, ICSE, NCERT. Free demo available. CSEEL India.",
    images: ["https://www.cseel.org/images/og-cover.jpg"],
  },
};

export default function Page() {
  return <Client />;
}
