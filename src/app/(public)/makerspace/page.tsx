import type { Metadata } from 'next';
import MakerspaceClient from './Client';

export const metadata: Metadata = {
  title: "Junior Makerspace - Complete 325+ Material & Equipment List, Setup Norms | CSEEL India",
  description: "Official procurement inventory & turnkey lab setup reference for Junior Makerspaces across India. 14 specialized categories, 325 verified equipment items: Robotics, 3D Printing, Electronics, Engineering, Art & Craft, Science Exploration, and Safety aligned with NEP 2020.",
  keywords: [
    "junior makerspace india",
    "makerspace material list pdf",
    "makerspace equipment list for schools",
    "school makerspace setup india",
    "junior tinkering lab equipment",
    "stem makerspace boq",
    "primary school innovation lab",
    "makerspace 3d printing tools",
    "nep 2020 makerspace curriculum",
    "cseel makerspace turnkey setup pan india"
  ].join(", "),
  alternates: {
    canonical: "https://www.cseel.org/makerspace",
  },
  openGraph: {
    title: "Junior Makerspace - Complete 325+ Material & Equipment List | CSEEL India",
    description: "Procurement inventory covering 14 categories and 325+ items: furniture, tools, robotics, electronics, science exploration, and safety for schools across India.",
    url: "https://www.cseel.org/makerspace",
    siteName: "CSEEL - Center for Scientific Exploration & Experiential Learning",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://www.cseel.org/images/makerspace/hero-rocket-makerspace.png",
        width: 741,
        height: 584,
        alt: "Junior Makerspace Setup CSEEL India",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Junior Makerspace - Complete 325+ Material & Equipment List | CSEEL India",
    description: "Complete turnkey procurement inventory for Junior Makerspaces in schools across India. 14 specialized categories, 325 items.",
    images: ["https://www.cseel.org/images/makerspace/hero-rocket-makerspace.png"],
  },
};

const makerspaceSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://www.cseel.org/makerspace#webpage",
      "url": "https://www.cseel.org/makerspace",
      "name": "Junior Makerspace - Complete 325+ Material & Equipment List | CSEEL India",
      "description": "Turnkey lab setup reference and 325+ verified equipment items for school makerspaces across India.",
      "inLanguage": "en-IN",
      "primaryImageOfPage": {
        "@type": "ImageObject",
        "url": "https://www.cseel.org/images/makerspace/hero-rocket-makerspace.png"
      },
      "spatialCoverage": {
        "@type": "Country",
        "name": "India"
      }
    },
    {
      "@type": "EducationalOrganization",
      "@id": "https://www.cseel.org/#organization",
      "name": "CSEEL - Center for Scientific Exploration & Experiential Learning",
      "url": "https://www.cseel.org",
      "logo": "https://www.cseel.org/images/Logo_1-a6da49-21857e9e.png",
      "areaServed": {
        "@type": "Country",
        "name": "India"
      },
      "description": "India's leading experiential STEM learning platform and turnkey school lab setup directorate."
    }
  ]
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(makerspaceSchema) }}
      />
      <MakerspaceClient />
    </>
  );
}
