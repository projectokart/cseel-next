import type { Metadata } from 'next';
import MakerspaceCurriculumClient from './Client';

export const metadata: Metadata = {
  title: "Makerspace & STEM Tinkering Curriculum (Grades 1-8) | CSEEL India",
  description: "Official NEP 2020 experiential STEM tinkering curriculum for school makerspaces and Atal Tinkering Labs across India (Grades 1 to 8). 240+ hands-on practical activities, engineering design challenges, and grade-wise interactive books.",
  keywords: [
    "makerspace curriculum",
    "grade 1 stem curriculum",
    "school tinkering syllabus india",
    "nep 2020 experiential curriculum",
    "cseel makerspace curriculum",
    "stem workbook grade 1 to 8",
    "junior tinkering lab activities",
    "atal tinkering lab primary curriculum",
    "hands-on science projects pan india",
    "atl curriculum cbse schools"
  ].join(", "),
  alternates: {
    canonical: "https://www.cseel.org/makerspace/curriculum",
  },
  openGraph: {
    title: "Makerspace & STEM Tinkering Curriculum (Grades 1-8) | CSEEL India",
    description: "Progressive, NEP 2020-aligned experiential STEM tinkering curriculum for schools pan-India. 240+ interactive practical chapters, maker challenges, and curriculum books.",
    url: "https://www.cseel.org/makerspace/curriculum",
    siteName: "CSEEL - Center for Scientific Exploration & Experiential Learning",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://www.cseel.org/images/makerspace/hero-rocket-makerspace.png",
        width: 741,
        height: 584,
        alt: "CSEEL Makerspace & STEM Curriculum India",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Makerspace & STEM Tinkering Curriculum (Grades 1-8) | CSEEL India",
    description: "Standard-wise progressive experiential learning curriculum for school makerspaces (Grades 1 to 8) across India.",
    images: ["https://www.cseel.org/images/makerspace/hero-rocket-makerspace.png"],
  },
};

const curriculumSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": "https://www.cseel.org/makerspace/curriculum#webpage",
      "url": "https://www.cseel.org/makerspace/curriculum",
      "name": "Makerspace & STEM Tinkering Curriculum (Grades 1-8) | CSEEL India",
      "description": "Standard-wise progressive experiential learning curriculum for school makerspaces and Atal Tinkering Labs (Grades 1 to 8) across India.",
      "inLanguage": "en-IN",
      "isPartOf": {
        "@type": "WebSite",
        "@id": "https://www.cseel.org/#website",
        "name": "CSEEL Experiential Science & STEM",
        "url": "https://www.cseel.org"
      },
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
      "@type": "EducationalOccupationalProgram",
      "@id": "https://www.cseel.org/makerspace/curriculum#program",
      "name": "CSEEL School Makerspace & STEM Tinkering Curriculum (Grades 1 to 8)",
      "description": "Comprehensive 8-grade hands-on STEM and ATL curriculum with 240+ practical activities aligned with NEP 2020 and Atal Innovation Mission.",
      "provider": {
        "@type": "EducationalOrganization",
        "name": "CSEEL - Center for Scientific Exploration & Experiential Learning",
        "url": "https://www.cseel.org",
        "logo": "https://www.cseel.org/images/Logo_1-a6da49-21857e9e.png",
        "areaServed": {
          "@type": "Country",
          "name": "India"
        }
      },
      "educationalProgramMode": "Blended / Hands-on Lab Practicals",
      "educationalCredentialAwarded": "STEM Tinkerer Completion Certificate",
      "occupationalCategory": "STEM Education, Tinkering, Experiential Science",
      "hasCourse": [
        {
          "@type": "Course",
          "name": "Grade 1 STEM Tinkering Curriculum: Mountain Rescuers & Physical Science",
          "description": "30 interactive practical chapters exploring sensory discovery, ramps, structures, pulleys, and materials.",
          "url": "https://www.cseel.org/makerspace/curriculum/grade-1",
          "courseCode": "CSEEL-MK-G1",
          "educationalLevel": "Primary / Foundational Stage (Ages 5-7)",
          "numberOfCredits": 30
        },
        {
          "@type": "Course",
          "name": "Grade 2 Makerspace Discovery & Structures",
          "description": "Explores mechanical foundations, motion, gravity, floating/sinking, and elementary structural design.",
          "url": "https://www.cseel.org/makerspace/curriculum/grade-2",
          "courseCode": "CSEEL-MK-G2",
          "educationalLevel": "Primary (Ages 6-8)"
        },
        {
          "@type": "Course",
          "name": "Grade 3 Early Mechanical Tinkering & Optics",
          "description": "Light, Shadows, Pulleys & Mechanical Linkages with hands-on maker tasks.",
          "url": "https://www.cseel.org/makerspace/curriculum/grade-3",
          "courseCode": "CSEEL-MK-G3",
          "educationalLevel": "Primary (Ages 7-9)"
        }
      ]
    }
  ]
};

export default function MakerspaceCurriculumPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(curriculumSchema) }}
      />
      <MakerspaceCurriculumClient />
    </>
  );
}
