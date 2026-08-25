import type { Metadata } from 'next';
import SchoolVacancyPageClient from '@/components/edu-network/SchoolVacancyPageClient';
import { ALL_ORGANIZATIONS } from '@/lib/eduNetworkData';

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const org = ALL_ORGANIZATIONS.find(o => o.id === params.slug) || ALL_ORGANIZATIONS[0];
  return {
    title: `Careers & Faculty Vacancies at ${org.name} | CSEEL EduNetwork`,
    description: `Apply for open teaching and administrative job vacancies at ${org.name}, ${org.city}. Active 30-day listings with direct application.`,
  };
}

export default function SchoolVacancyPage({ params }: PageProps) {
  return (
    <SchoolVacancyPageClient
      orgId={params.slug}
      backUrl={`/edu-network/organisation/school/${params.slug}`}
    />
  );
}
