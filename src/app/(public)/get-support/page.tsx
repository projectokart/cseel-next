import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: "Customer & Technical Support | CSEEL Platform India",
  description: "Need help with your CSEEL account, virtual lab simulation, or kit order? Reach our dedicated support team for quick assistance.",
  keywords: "CSEEL support, virtual lab help, science platform customer care",
  alternates: {
    canonical: "https://www.cseel.org/get-support",
  },
  openGraph: {
    title: "Customer & Technical Support | CSEEL Platform India",
    description: "Need help with your CSEEL account, virtual lab simulation, or kit order? Reach our dedicated support team for quick assistance.",
    url: "https://www.cseel.org/get-support",
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
    title: "Customer & Technical Support | CSEEL Platform India",
    description: "Need help with your CSEEL account, virtual lab simulation, or kit order? Reach our dedicated support team for quick assistance.",
    images: ["https://www.cseel.org/images/og-cover.jpg"],
  },
};

export default function Page() {
  return <Client />;
}
