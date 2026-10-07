import type { Metadata } from 'next';
import { parseSchoolsSeoQuery } from '@/lib/schoolsSeoParser';
import { fetchSchoolsForDirectory } from '@/integrations/supabase/schoolsDirectoryDb';
import SchoolsDirectoryClient from '@/components/schools/SchoolsDirectoryClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Top Schools in India 2026-27 | Fees, CBSE/ICSE/IB Boards, STEM Labs | CSEEL UniApply',
  description: 'Explore 100+ top schools in India. Compare verified monthly fees, student-faculty ratios, board affiliations (CBSE, ICSE, IB), and live experiential STEM science laboratory infrastructure.',
  keywords: 'top schools in India, best CBSE schools Delhi, top schools Mumbai, schools in Bengaluru, school fees compare, admission open 2026-27, STEM science labs in schools, UniApply school directory, CSEEL EduNetwork',
  alternates: {
    canonical: 'https://www.cseel.org/edu-network/organisation/school',
  },
  openGraph: {
    title: 'Top Schools in India 2026-27 | Fees, CBSE/ICSE/IB Boards, STEM Labs | CSEEL UniApply',
    description: 'Explore 100+ top schools in India. Compare verified monthly fees, student-faculty ratios, board affiliations (CBSE, ICSE, IB), and live experiential STEM science laboratory infrastructure.',
    url: 'https://www.cseel.org/edu-network/organisation/school',
    siteName: 'CSEEL',
    locale: 'en_IN',
    type: 'website',
  },
};

export default async function SchoolOrganisationMainPage({
  searchParams
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>> | Record<string, string | string[] | undefined>;
}) {
  const resolvedSearchParams = searchParams ? await Promise.resolve(searchParams) : {};
  const parsedQuery = parseSchoolsSeoQuery([], resolvedSearchParams);
  const directoryData = await fetchSchoolsForDirectory(parsedQuery);

  return <SchoolsDirectoryClient initialData={directoryData} />;
}
