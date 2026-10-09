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
  params?: { slug?: string[] };
  searchParams?: Record<string, string | string[] | undefined>;
}): Promise<Metadata> {
  const segments = params?.slug || [];
  const parsed = parseSchoolsSeoQuery(segments, searchParams);

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
      siteName: 'CSEEL Schools Directory',
      locale: 'en_IN',
      type: 'website'
    }
  };
}

export default async function SchoolsDirectoryPage({
  params,
  searchParams
}: {
  params?: { slug?: string[] };
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const segments = params?.slug || [];
  const parsedQuery = parseSchoolsSeoQuery(segments, searchParams);
  const directoryData = await fetchSchoolsForDirectory(parsedQuery);

  return <SchoolsDirectoryClient initialData={directoryData} />;
}
