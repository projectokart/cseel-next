import { Metadata } from "next";
import { notFound } from "next/navigation";
import TeacherProfileClient from "./Client";
import { getTeacherById, ALL_TEACHERS, getTeacherSlug } from "@/lib/eduNetworkData";

export function generateStaticParams() {
  const ids = new Set<string>();
  ALL_TEACHERS.forEach((teacher) => {
    if (teacher.id) ids.add(teacher.id);
    if (teacher.slug) ids.add(teacher.slug);
  });
  return Array.from(ids).map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const teacher = getTeacherById(params.id);
  if (!teacher) {
    return {
      title: "Faculty Profile Not Found | CSEEL EduNetwork",
      description: "The requested science educator or laboratory instructor profile could not be found.",
    };
  }

  const slug = teacher.slug || getTeacherSlug(teacher);
  const pageUrl = `https://www.cseel.org/edu-network/teachers/${slug}`;

  return {
    title: `${teacher.name} | Verified ${teacher.subject} Educator in ${teacher.city} | CSEEL`,
    description: `${teacher.name} (${teacher.qualification}, ${teacher.experienceYears}+ years exp). Current Institute: ${teacher.currentInstitute}, ${teacher.city}, ${teacher.state}. NEP-2020 certified STEM faculty. Rating: ${teacher.rating}/5 (${teacher.reviewsCount} verified reviews). Exp. Salary: ${teacher.expectedSalary}.`,
    keywords: [
      `${teacher.name} teacher`,
      `${teacher.subject} teacher in ${teacher.city}`,
      `${teacher.subject} faculty ${teacher.state}`,
      `${teacher.currentInstitute} science teacher`,
      "verified STEM educator India",
      "NEP-2020 certified teacher",
      "CSEEL verified faculty",
    ],
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${teacher.name} - Verified ${teacher.subject} Faculty (${teacher.city})`,
      description: `${teacher.qualification} • ${teacher.experienceYears}+ Years Practical Experience • Rating: ${teacher.rating}/5 (${teacher.reviewsCount} Reviews).`,
      url: pageUrl,
      siteName: "CSEEL EduNetwork",
      images: [
        {
          url: teacher.avatar || "/images/og-cover.jpg",
          width: 1200,
          height: 630,
          alt: `${teacher.name} Profile`,
        },
      ],
      locale: "en_IN",
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: `${teacher.name} | Verified ${teacher.subject} Faculty (${teacher.city})`,
      description: `${teacher.name} (${teacher.qualification}, ${teacher.experienceYears}+ yrs exp). Rating: ${teacher.rating}/5.`,
      images: [teacher.avatar || "/images/og-cover.jpg"],
    },
  };
}

export default function TeacherPage({ params }: { params: { id: string } }) {
  const teacher = getTeacherById(params.id);
  if (!teacher) {
    notFound();
  }

  const slug = teacher.slug || getTeacherSlug(teacher);
  const pageUrl = `https://www.cseel.org/edu-network/teachers/${slug}`;

  // ── Schema.org Person Structured Data for Educator SEO ───────────────────────
  const teacherSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: teacher.name,
    jobTitle: `${teacher.subject} Educator & STEM Mentor`,
    worksFor: {
      "@type": "EducationalOrganization",
      name: teacher.currentInstitute,
    },
    description: teacher.bio,
    image: teacher.avatar,
    url: pageUrl,
    address: {
      "@type": "PostalAddress",
      addressLocality: teacher.city,
      addressRegion: teacher.state,
      postalCode: teacher.pincode,
      addressCountry: "IN",
    },
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      name: teacher.qualification,
      credentialCategory: "degree",
    },
    knowsAbout: teacher.skills,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(teacherSchema) }}
      />
      <TeacherProfileClient teacherId={teacher.id} />
    </>
  );
}
