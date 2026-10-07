import type { Metadata } from 'next';
import { parseHierarchySeoQuery } from '@/lib/schoolsHierarchySeoParser';
import { fetchHierarchyPageData } from '@/integrations/supabase/schoolsHierarchyDb';
import SchoolsHierarchyClient from '@/components/schools/SchoolsHierarchyClient';

export const revalidate = 3600; // ISR cache for 1 hour

export async function generateMetadata({
  params,
  searchParams
}: {
  params?: { slug?: string[] };
  searchParams?: Record<string, string | string[] | undefined>;
}): Promise<Metadata> {
  const segments = params?.slug || [];
  const parsed = parseHierarchySeoQuery(segments, searchParams);

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
      siteName: 'CSEEL National Schools Directory',
      locale: 'en_IN',
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: parsed.pageTitle,
      description: parsed.metaDescription
    }
  };
}

export default async function SchoolIndiaHierarchyPage({
  params,
  searchParams
}: {
  params?: { slug?: string[] };
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const segments = params?.slug || [];
  const parsedQuery = parseHierarchySeoQuery(segments, searchParams);
  const hierarchyData = await fetchHierarchyPageData(parsedQuery);

  return <SchoolsHierarchyClient initialData={hierarchyData} />;
}
