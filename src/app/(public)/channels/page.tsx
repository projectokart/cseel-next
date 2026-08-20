import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: "Science Topic Channels | Biology, Chemistry, Physics, Robotics | CSEEL",
  description: "Explore dedicated community channels covering Physics, Chemistry, Biology, Astronomy, Robotics, and Environmental Science.",
  keywords: "science channels India, physics discussion, chemistry forum, robotics student community",
  alternates: {
    canonical: "https://www.cseel.org/channels",
  },
  openGraph: {
    title: "Science Topic Channels | Biology, Chemistry, Physics, Robotics | CSEEL",
    description: "Explore dedicated community channels covering Physics, Chemistry, Biology, Astronomy, Robotics, and Environmental Science.",
    url: "https://www.cseel.org/channels",
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
    title: "Science Topic Channels | Biology, Chemistry, Physics, Robotics | CSEEL",
    description: "Explore dedicated community channels covering Physics, Chemistry, Biology, Astronomy, Robotics, and Environmental Science.",
    images: ["https://www.cseel.org/images/og-cover.jpg"],
  },
};

export default function Page() {
  return <Client />;
}
