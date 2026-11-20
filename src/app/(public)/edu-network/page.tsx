import type { Metadata } from 'next';
import { parseSchoolsSeoQuery } from '@/lib/schoolsSeoParser';
import { fetchSchoolsForDirectory } from '@/integrations/supabase/schoolsDirectoryDb';
import SchoolsDirectoryClient from '@/components/schools/SchoolsDirectoryClient';

export const revalidate = 60;

export async function generateMetadata({
  searchParams
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>> | Record<string, string | string[] | undefined>;
}): Promise<Metadata> {
  const resolvedSearchParams = searchParams ? await Promise.resolve(searchParams) : {};
  const parsed = parseSchoolsSeoQuery([], resolvedSearchParams);

  return {
    title: parsed.pageTitle || 'Schools Directory | CSEEL EduNetwork',
    description: parsed.metaDescription || 'Explore verified schools, STEM labs, admissions, and facilities across India on CSEEL EduNetwork.',
    alternates: {
      canonical: 'https://www.cseel.org/edu-network'
    },
    openGraph: {
      title: parsed.pageTitle || 'Schools Directory | CSEEL EduNetwork',
      description: parsed.metaDescription || 'Explore verified schools, STEM labs, admissions, and facilities across India.',
      url: 'https://www.cseel.org/edu-network',
      siteName: 'CSEEL EduNetwork',
      locale: 'en_IN',
      type: 'website',
      images: [
        {
          url: 'https://www.cseel.org/images/cseel-schools-preview.jpg',
          width: 1200,
          height: 630,
          alt: 'CSEEL EduNetwork Schools',
          type: 'image/jpeg',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: parsed.pageTitle || 'Schools Directory | CSEEL EduNetwork',
      description: parsed.metaDescription || 'Explore verified schools across India.',
      images: ['https://www.cseel.org/images/cseel-schools-preview.jpg'],
      creator: '@cseel_org',
      site: '@cseel_org',
    },
  };
}

export default async function EduNetworkSchoolsPage({
  searchParams
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>> | Record<string, string | string[] | undefined>;
}) {
  const resolvedSearchParams = searchParams ? await Promise.resolve(searchParams) : {};
  const parsedQuery = parseSchoolsSeoQuery([], resolvedSearchParams);
  const directoryData = await fetchSchoolsForDirectory(parsedQuery);

  const jsonLdGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://www.cseel.org/edu-network#page',
        name: parsedQuery.pageTitle,
        description: parsedQuery.metaDescription,
        url: 'https://www.cseel.org/edu-network',
        isPartOf: {
          '@type': 'WebSite',
          '@id': 'https://www.cseel.org/#website',
          name: 'CSEEL',
          url: 'https://www.cseel.org',
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://www.cseel.org/edu-network#breadcrumb',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://www.cseel.org',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'EduNetwork Schools',
            item: 'https://www.cseel.org/edu-network',
          },
        ],
      },
      {
        '@type': 'ItemList',
        '@id': 'https://www.cseel.org/edu-network#itemlist',
        name: parsedQuery.pageTitle,
        numberOfItems: directoryData.totalCount,
        itemListElement: directoryData.schools.slice(0, 15).map((school, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          item: {
            '@type': ['School', 'EducationalOrganization', 'LocalBusiness'],
            name: school.school_name || school.name,
            address: {
              '@type': 'PostalAddress',
              streetAddress: school.address || '',
              addressLocality: school.district_name || school.city || '',
              addressRegion: school.state_name || school.state || '',
              postalCode: school.pincode || undefined,
              addressCountry: 'IN',
            },
            ...(school.latitude && school.longitude ? {
              geo: {
                '@type': 'GeoCoordinates',
                latitude: school.latitude,
                longitude: school.longitude,
              }
            } : {}),
            telephone: school.phone || undefined,
            url: `https://www.cseel.org/edu-network/school/${(school.state_name || 'delhi').toLowerCase().replace(/\s+/g, '-')}/${(school.district_name || 'central').toLowerCase().replace(/\s+/g, '-')}/${school.udise_code || school.id}/${(school.school_name || 'school').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
          },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
      />
      <SchoolsDirectoryClient initialData={directoryData} />
    </>
  );
}
