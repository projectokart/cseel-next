import { Metadata } from "next";
import TeacherProfileClient from "./Client";
import { fetchTeacherByIdOrSlug, ALL_TEACHERS, getTeacherSlug } from "@/lib/eduNetworkData";

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const teacher = await fetchTeacherByIdOrSlug(params.id);
  if (!teacher) {
    return {
      title: "Faculty Profile | CSEEL EduNetwork",
      description: "Verified science educator or laboratory instructor profile on CSEEL EduNetwork.",
    };
  }

  const slug = teacher.slug || getTeacherSlug(teacher);
  const pageUrl = `https://www.cseel.org/edu-network/teachers/${slug}`;
  const statusLabel = teacher.verified ? 'Verified' : 'Under Verification';

  return {
    title: `${teacher.name} | ${statusLabel} ${teacher.subject} Educator in ${teacher.city} | CSEEL`,
    description: `${teacher.name} (${teacher.qualification}, ${teacher.experienceYears}+ years exp). Current Institute: ${teacher.currentInstitute}, ${teacher.city}, ${teacher.state}. Exp. Salary: ${teacher.expectedSalary}.`,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${teacher.name} - ${statusLabel} ${teacher.subject} Faculty (${teacher.city})`,
      description: `${teacher.qualification} • ${teacher.experienceYears}+ Years Practical Experience • Rating: ${teacher.rating}/5.`,
      url: pageUrl,
      siteName: "CSEEL EduNetwork",
      images: [
        {
          url: teacher.avatar || "/images/cseel-social-preview.jpg",
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
      title: `${teacher.name} | ${statusLabel} ${teacher.subject} Faculty (${teacher.city})`,
      description: `${teacher.name} (${teacher.qualification}, ${teacher.experienceYears}+ yrs exp). Rating: ${teacher.rating}/5.`,
      images: [teacher.avatar || "/images/cseel-social-preview.jpg"],
    },
  };
}

export default async function TeacherPage({ params }: { params: { id: string } }) {
  const teacher = await fetchTeacherByIdOrSlug(params.id);

  const slug = teacher ? (teacher.slug || getTeacherSlug(teacher)) : params.id;
  const pageUrl = `https://www.cseel.org/edu-network/teachers/${slug}`;

  const teacherSchema = teacher
    ? {
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
      }
    : null;

  return (
    <>
      {teacherSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(teacherSchema) }}
        />
      )}
      <TeacherProfileClient teacherId={params.id} initialTeacher={teacher} />
    </>
  );
}
