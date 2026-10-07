import { Metadata } from "next";
import { notFound } from "next/navigation";
import OrgProfileClient from "./Client";
import { getOrganizationById, ALL_ORGANIZATIONS, getOrgSlug } from "@/lib/eduNetworkData";

export const dynamicParams = true;

export function generateStaticParams() {
  const ids = new Set<string>();
  ALL_ORGANIZATIONS.slice(0, 100).forEach((org) => {
    if (org.id) ids.add(org.id);
    if (org.slug) ids.add(org.slug);
  });
  return Array.from(ids).map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const org = getOrganizationById(params.id);
  if (!org) {
    return {
      title: "Organization Not Found | CSEEL EduNetwork",
      description: "The requested school, university, or research laboratory profile could not be found.",
    };
  }

  const slug = org.slug || getOrgSlug(org);
  const pageUrl = `https://www.cseel.org/edu-network/org/${slug}`;

  return {
    title: `${org.name} (${org.city}) | Admissions, STEM Labs & Reviews | CSEEL`,
    description: `${org.name} in ${org.city}, ${org.state}. ${org.type} affiliated with ${org.affiliation}. ${org.stemLabsCount} STEM Labs, ${org.studentStrength}+ Students, Rating: ${org.rating}/5 (${org.reviews} reviews). Explore active teaching jobs, facilities, and verified profile.`,
    keywords: [
      `${org.name} admissions 2026`,
      `${org.name} ${org.city}`,
      `${org.name} fee structure`,
      `best ${org.type.toLowerCase()} in ${org.city}`,
      `${org.name} teacher vacancy`,
      `${org.name} STEM labs`,
      "CSEEL EduNetwork School Directory",
    ],
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${org.name} - ${org.city}, ${org.state} | CSEEL EduNetwork`,
      description: `${org.type} affiliated with ${org.affiliation}. Rating: ${org.rating}/5. ${org.stemLabsCount} STEM Labs, ${org.openJobsCount} Live Job Openings.`,
      url: pageUrl,
      siteName: "CSEEL EduNetwork",
      images: [
        {
          url: org.bannerImage || org.logo || "/images/og-cover.jpg",
          width: 1200,
          height: 630,
          alt: org.name,
        },
      ],
      locale: "en_IN",
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: `${org.name} (${org.city}) | CSEEL`,
      description: `${org.name} in ${org.city}. Rating ${org.rating}/5. ${org.stemLabsCount} STEM Labs.`,
      images: [org.bannerImage || org.logo || "/images/og-cover.jpg"],
    },
  };
}

export default function OrgProfilePage({ params }: { params: { id: string } }) {
  const org = getOrganizationById(params.id);
  if (!org) {
    notFound();
  }

  const slug = org.slug || getOrgSlug(org);
  const pageUrl = `https://www.cseel.org/edu-network/org/${slug}`;

  // ── Schema.org EducationalOrganization Structured Data ───────────────────────
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": org.type === "School" ? "School" : org.type === "University" ? "CollegeOrUniversity" : "EducationalOrganization",
    name: org.name,
    description: org.description,
    url: pageUrl,
    logo: org.logo,
    image: org.bannerImage,
    telephone: org.phone,
    email: org.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: org.address,
      addressLocality: org.city,
      addressRegion: org.state,
      postalCode: org.pincode,
      addressCountry: "IN",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: org.rating,
      reviewCount: org.reviews || 100,
      bestRating: 5,
      worstRating: 1,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <OrgProfileClient orgId={org.id} />
    </>
  );
}
