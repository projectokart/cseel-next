import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import StudentProfileClient from './Client';
import { getStudentById, ALL_STUDENTS, getStudentSlug } from '@/lib/eduNetworkData';

export function generateStaticParams() {
  const ids = new Set<string>();
  ALL_STUDENTS.forEach((student) => {
    if (student.id) ids.add(student.id);
    if (student.slug) ids.add(student.slug);
  });
  return Array.from(ids).map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const student = getStudentById(params.id);
  if (!student) {
    return {
      title: 'Student Profile Not Found | CSEEL EduNetwork',
      description: 'The requested student innovator project profile could not be found.',
    };
  }

  const slug = student.slug || getStudentSlug(student);
  const pageUrl = `https://www.cseel.org/edu-network/students/${slug}`;

  return {
    title: `${student.name} (${student.classGrade}) | STEM Inventions & Project Vault | CSEEL`,
    description: `${student.name} - ${student.classGrade} innovator at ${student.schoolCollege}, ${student.city}. Built '${student.topProject}'. Explore hardware schematics, research PDFs, code repositories, and science fair badges.`,
    keywords: [
      `${student.name} student`,
      `${student.topProject}`,
      `${student.schoolCollege} science projects`,
      'young STEM innovator India',
      'Atal Tinkering Lab student prototype',
      'CBSE science exhibition winner',
      'CSEEL student profile',
    ],
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${student.name} | ${student.topProject} - CSEEL Innovator`,
      description: `${student.classGrade} at ${student.schoolCollege}. Explore verified hardware prototypes, hands-on live experiments, and research vault.`,
      url: pageUrl,
      siteName: 'CSEEL EduNetwork',
      images: [
        {
          url: student.avatar || '/images/og-cover.jpg',
          width: 1200,
          height: 630,
          alt: `${student.name} Portfolio`,
        },
      ],
      locale: 'en_IN',
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${student.name} (${student.classGrade}) | STEM Inventions`,
      description: `Built '${student.topProject}' at ${student.schoolCollege}. Explore research files & hardware schematics.`,
      images: [student.avatar || '/images/og-cover.jpg'],
    },
  };
}

export default function StudentPage({ params }: { params: { id: string } }) {
  const student = getStudentById(params.id);
  if (!student) {
    notFound();
  }

  const slug = student.slug || getStudentSlug(student);
  const pageUrl = `https://www.cseel.org/edu-network/students/${slug}`;

  // ── Schema.org Person / ProfilePage Structured Data ────────────────────────
  const studentSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: student.name,
    jobTitle: 'Young STEM Innovator',
    affiliation: {
      '@type': 'EducationalOrganization',
      name: student.schoolCollege,
    },
    description: student.bio,
    image: student.avatar,
    url: pageUrl,
    address: {
      '@type': 'PostalAddress',
      addressLocality: student.city,
      addressRegion: student.state,
      postalCode: student.pincode,
      addressCountry: 'IN',
    },
    knowsAbout: student.interests,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(studentSchema) }}
      />
      <StudentProfileClient studentId={student.id} />
    </>
  );
}
