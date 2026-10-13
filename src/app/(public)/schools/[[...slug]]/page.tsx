import type { Metadata } from 'next';
import { parseSchoolsSeoQuery } from '@/lib/schoolsSeoParser';
import { fetchSchoolsForDirectory } from '@/integrations/supabase/schoolsDirectoryDb';
import SchoolsDirectoryClient from '@/components/schools/SchoolsDirectoryClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({
  params,
  searchParams
}: {
  params?: Promise<{ slug?: string[] }> | { slug?: string[] };
  searchParams?: Promise<Record<string, string | string[] | undefined>> | Record<string, string | string[] | undefined>;
}): Promise<Metadata> {
  const resolvedParams = params ? await Promise.resolve(params) : {};
  const resolvedSearchParams = searchParams ? await Promise.resolve(searchParams) : {};
  const segments = resolvedParams?.slug || [];
  const parsed = parseSchoolsSeoQuery(segments, resolvedSearchParams);

  return {
    title: parsed.pageTitle,
    description: parsed.metaDescription,
    alternates: {
      canonical: parsed.canonicalUrl
    },
    openGraph: {
      title: parsed.pageTitle,
      description: parsed.metaDescription,
      url: parsed.canonicalUrl,
      siteName: 'CSEEL - Center for Scientific Exploration & Experiential Learning',
      locale: 'en_IN',
      type: 'website',
      images: [
        {
          url: 'https://www.cseel.org/images/og-schools.jpg',
          width: 1200,
          height: 630,
          alt: parsed.pageTitle,
          type: 'image/jpeg',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: parsed.pageTitle,
      description: parsed.metaDescription,
      images: ['https://www.cseel.org/images/og-schools.jpg'],
      creator: '@cseel_org',
      site: '@cseel_org',
    },
  };
}

export default async function SchoolsDirectoryPage({
  params,
  searchParams
}: {
  params?: Promise<{ slug?: string[] }> | { slug?: string[] };
  searchParams?: Promise<Record<string, string | string[] | undefined>> | Record<string, string | string[] | undefined>;
}) {
  const resolvedParams = params ? await Promise.resolve(params) : {};
  const resolvedSearchParams = searchParams ? await Promise.resolve(searchParams) : {};
  const segments = resolvedParams?.slug || [];
  const parsedQuery = parseSchoolsSeoQuery(segments, resolvedSearchParams);
  const directoryData = await fetchSchoolsForDirectory(parsedQuery);

  return <SchoolsDirectoryClient initialData={directoryData} />;
}
