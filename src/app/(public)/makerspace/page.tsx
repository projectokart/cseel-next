import type { Metadata } from 'next';
import MakerspaceClient from './Client';

export const metadata: Metadata = {
  title: "PRAYOGI Junior Makerspace - Complete 325+ Material & Equipment List, Setup Norms | CSEEL",
  description: "Official procurement inventory & turnkey lab setup reference for Junior Makerspaces (40 primary-school children planning basis). 14 specialized categories, 325 verified equipment items: Robotics, 3D Printing, Electronics, Engineering, Art & Craft, Science Exploration, and Safety.",
  keywords: [
    "Prayogi junior makerspace",
    "makerspace material list pdf",
    "makerspace equipment list for schools",
    "school makerspace setup india",
    "junior tinkering lab equipment",
    "stem makerspace boq",
    "primary school innovation lab",
    "makerspace 3d printing tools",
    "nep 2020 makerspace curriculum",
    "cseel makerspace turnkey setup"
  ].join(", "),
  alternates: {
    canonical: "https://www.cseel.org/makerspace",
  },
  openGraph: {
    title: "PRAYOGI Junior Makerspace - Complete 325+ Material & Equipment List | CSEEL",
    description: "Indicative procurement inventory covering 14 categories and 325+ items: furniture, tools, robotics, electronics, science exploration, and safety for 40-student cohorts.",
    url: "https://www.cseel.org/makerspace",
    siteName: "CSEEL - Center for Scientific Exploration & Experiential Learning",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://www.cseel.org/images/cseel-social-preview.jpg",
        secureUrl: "https://www.cseel.org/images/cseel-social-preview.jpg",
        width: 1200,
        height: 630,
        alt: "PRAYOGI Junior Makerspace Setup - CSEEL",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PRAYOGI Junior Makerspace - Complete 325+ Material & Equipment List | CSEEL",
    description: "Complete turnkey procurement inventory for Junior Makerspaces in schools. 14 specialized categories, 325 items.",
    images: ["https://www.cseel.org/images/cseel-social-preview.jpg"],
  },
};

export default function Page() {
  return <MakerspaceClient />;
}
