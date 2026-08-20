import { Metadata } from "next";
import EduNetworkClient from "./Client";

export const metadata: Metadata = {
  title: "CSEEL EduNetwork | India's National Academic, Research & Faculty-Student Exchange",
  description:
    "Explore 10,000+ Schools, Colleges, and Premier Research Institutes (ISRO, DRDO, CSIR, IITs). Connect with 50,000+ Verified Science Teachers, Student Innovators, and apply for nearby STEM teaching & lab jobs across India.",
  keywords: [
    "school search India",
    "science teacher jobs",
    "faculty recruitment India",
    "ISRO STEM mentorship",
    "DRDO student projects",
    "IIT laboratory faculty",
    "CBSE ICSE teacher openings",
    "pincode school finder",
    "CSEEL EduNetwork",
    "Atal Tinkering Labs network",
  ],
  alternates: {
    canonical: "https://www.cseel.org/edu-network",
  },
  openGraph: {
    title: "CSEEL EduNetwork | National STEM Academic & Faculty Portal India",
    description:
      "India's largest science network connecting top schools, ISRO/DRDO research centers, verified teachers, and student innovators.",
    url: "https://www.cseel.org/edu-network",
    siteName: "CSEEL",
    images: [
      {
        url: "/images/og-cover.jpg",
        width: 1200,
        height: 630,
        alt: "CSEEL EduNetwork National Platform",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

export default function EduNetworkPage({ searchParams }: { searchParams?: { tab?: string; job?: string } }) {
  return <EduNetworkClient initialTab={searchParams?.tab as any} />;
}
