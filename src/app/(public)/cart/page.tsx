import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: "Shopping Cart | CSEEL Lab Store",
  description: "View and manage your selected science lab materials, experiment kits, and curriculum supplies.",
  keywords: "CSEEL cart, science store checkout",
  alternates: {
    canonical: "https://www.cseel.org/cart",
  },
  openGraph: {
    title: "Shopping Cart | CSEEL Lab Store",
    description: "View and manage your selected science lab materials, experiment kits, and curriculum supplies.",
    url: "https://www.cseel.org/cart",
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
    title: "Shopping Cart | CSEEL Lab Store",
    description: "View and manage your selected science lab materials, experiment kits, and curriculum supplies.",
    images: ["https://www.cseel.org/images/og-cover.jpg"],
  },
};

export default function Page() {
  return <Client />;
}
