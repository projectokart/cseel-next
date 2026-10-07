import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: "Login to CSEEL | Student, Teacher & School Portal",
  description: "Sign in to your CSEEL account to access virtual science simulations, assignments, classes, and personalized experiment dashboard.",
  keywords: "CSEEL login, student portal login, teacher science dashboard, school login",
  alternates: {
    canonical: "https://www.cseel.org/login",
  },
  openGraph: {
    title: "Login to CSEEL | Student, Teacher & School Portal",
    description: "Sign in to your CSEEL account to access virtual science simulations, assignments, classes, and personalized experiment dashboard.",
    url: "https://www.cseel.org/login",
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
    title: "Login to CSEEL | Student, Teacher & School Portal",
    description: "Sign in to your CSEEL account to access virtual science simulations, assignments, classes, and personalized experiment dashboard.",
    images: ["https://www.cseel.org/images/og-cover.jpg"],
  },
};

export default function Page() {
  return <Client />;
}
