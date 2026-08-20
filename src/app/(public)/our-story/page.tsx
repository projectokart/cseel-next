import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: "Our Story | The Vision Behind CSEEL Science Learning",
  description: "Discover the journey and vision behind CSEEL — empowering the next generation of Indian scientists and innovators through hands-on experimental learning.",
  keywords: "CSEEL story, science education history, STEM learning journey India",
  alternates: {
    canonical: "https://www.cseel.org/our-story",
  },
  openGraph: {
    title: "Our Story | The Vision Behind CSEEL Science Learning",
    description: "Discover the journey and vision behind CSEEL — empowering the next generation of Indian scientists and innovators through hands-on experimental learning.",
    url: "https://www.cseel.org/our-story",
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
    title: "Our Story | The Vision Behind CSEEL Science Learning",
    description: "Discover the journey and vision behind CSEEL — empowering the next generation of Indian scientists and innovators through hands-on experimental learning.",
    images: ["https://www.cseel.org/images/og-cover.jpg"],
  },
};

export default function Page() {
  return <Client />;
}
