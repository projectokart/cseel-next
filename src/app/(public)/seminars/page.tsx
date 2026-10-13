import { Metadata } from "next";
import SeminarsClient from "./Client";

export const metadata: Metadata = {
  title: "National Science Seminars & Webinars 2026 | CSEEL",
  description:
    "Join live scientific seminars, keynote symposiums, and webinars hosted by distinguished scientists from ISRO, DRDO, CSIR, and IITs. Register for free seats and earn verified participation certificates.",
  keywords: [
    "science seminars India 2026",
    "ISRO space webinars",
    "DRDO robotics seminar",
    "quantum computing webinars India",
    "NEP 2020 science conference",
    "CSEEL scientific keynotes",
    "free STEM webinars for students and teachers",
  ],
  alternates: {
    canonical: "https://www.cseel.org/seminars",
  },
  openGraph: {
    title: "National Science Seminars & Webinars 2026 | CSEEL",
    description:
      "Join live research keynotes and interactive STEM webinars with premier national scientists. Register online with CSEEL.",
    url: "https://www.cseel.org/seminars",
    siteName: "CSEEL - Center for Scientific Exploration & Experiential Learning",
    images: [
      {
        url: "https://www.cseel.org/images/og-events.jpg",
        width: 1200,
        height: 630,
        alt: "CSEEL National Science Seminars & Interactive Keynotes",
        type: "image/jpeg",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "National Science Seminars & Webinars 2026 | CSEEL",
    description: "Join live research keynotes and interactive STEM webinars with premier national scientists. Register online with CSEEL.",
    images: ["https://www.cseel.org/images/og-events.jpg"],
    site: "@cseel_org",
    creator: "@cseel_org",
  },
};

export default function SeminarsPage() {
  return <SeminarsClient />;
}
