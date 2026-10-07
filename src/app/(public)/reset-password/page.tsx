import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: "Reset Your CSEEL Password",
  description: "Reset your CSEEL account password securely.",
  keywords: "CSEEL reset password, recover account",
  alternates: {
    canonical: "https://www.cseel.org/reset-password",
  },
  openGraph: {
    title: "Reset Your CSEEL Password",
    description: "Reset your CSEEL account password securely.",
    url: "https://www.cseel.org/reset-password",
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
    title: "Reset Your CSEEL Password",
    description: "Reset your CSEEL account password securely.",
    images: ["https://www.cseel.org/images/og-cover.jpg"],
  },
};

export default function Page() {
  return <Client />;
}
