import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: "360° Interactive Virtual Science Lab Tour | CSEEL India",
  description: "Experience CSEEL's immersive 360° interactive virtual laboratory. Explore advanced Chemistry, Physics, Biology, and ATL Robotics labs aligned with NEP 2020 and CBSE/ICSE curriculum.",
  keywords: "virtual lab tour, 360 lab experience, school science lab tour, CSEEL 360 virtual lab, interactive STEM lab, CBSE virtual laboratory",
  alternates: {
    canonical: "https://www.cseel.org/virtual-lab-tour",
  },
  openGraph: {
    title: "360° Interactive Virtual Science Lab Tour | CSEEL India",
    description: "Step inside CSEEL's state-of-the-art experiential science laboratories with 360° panoramic navigation, interactive instrument inspection, and NEP 2020 practicals.",
    url: "https://www.cseel.org/virtual-lab-tour",
    siteName: "CSEEL",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://www.cseel.org/images/cseel-science-lab-hero.png",
        width: 1200,
        height: 630,
        alt: "CSEEL 360 Interactive Virtual Lab Tour",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@cseel_org",
    title: "360° Interactive Virtual Science Lab Tour | CSEEL India",
    description: "Take a 360° interactive tour of CSEEL's high-tech Chemistry, Physics, Biology, and Robotics labs.",
    images: ["https://www.cseel.org/images/cseel-science-lab-hero.png"],
  },
};

export default function Page() {
  return <Client />;
}
