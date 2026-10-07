import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: "Atal Tinkering Lab (ATL) & STEAM Lab Setup for Schools India | CSEEL",
  description: "Set up world-class Atal Tinkering Labs (ATL), AI & Robotics Super-Labs, and NEP 2020 Experiential STEM Labs for Indian schools. NITI Aayog compliant packages P1-P4, 3D printing, IoT kits, and teacher certification.",
  keywords: [
    "Atal Tinkering Lab setup",
    "ATL package 1 to 4 equipment list",
    "STEM lab setup cost for schools India",
    "STEAM lab in school",
    "AI robotics lab setup company",
    "PM SHRI composite skill lab",
    "CBSE AI curriculum 417 lab",
    "Arduino robotics kits for kids",
    "tinkering lab for schools India",
    "experiential learning lab NEP 2020",
    "3D printer school lab India",
    "AutoDock Vina molecular docking school lab"
  ].join(", "),
  alternates: {
    canonical: "https://www.cseel.org/steam-lab",
  },
  openGraph: {
    title: "Atal Tinkering Lab (ATL) & STEAM Lab Setup for Schools India | CSEEL",
    description: "Turnkey Atal Tinkering Labs, AI & Robotics Super-Labs, and NEP 2020 Experiential STEAM Labs for K-12 Indian Schools. Get customized proposals, hardware kits, and certified teacher training.",
    url: "https://www.cseel.org/steam-lab",
    siteName: "CSEEL - Center for Scientific Exploration & Experiential Learning",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://www.cseel.org/images/og-cover.jpg",
        width: 1200,
        height: 630,
        alt: "CSEEL STEAM & Atal Tinkering Lab Setup India",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@cseel_org",
    title: "Atal Tinkering Lab (ATL) & STEAM Lab Setup for Schools India | CSEEL",
    description: "Turnkey Atal Tinkering Labs, AI & Robotics Super-Labs, and NEP 2020 Experiential STEAM Labs for K-12 Indian Schools.",
    images: ["https://www.cseel.org/images/og-cover.jpg"],
  },
};

export default function Page() {
  return <Client />;
}
