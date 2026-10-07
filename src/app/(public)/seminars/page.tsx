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
    siteName: "CSEEL",
    images: [
      {
        url: "/images/og-cover.jpg",
        width: 1200,
        height: 630,
        alt: "CSEEL National Science Seminars",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

export default function SeminarsPage() {
  return <SeminarsClient />;
}
