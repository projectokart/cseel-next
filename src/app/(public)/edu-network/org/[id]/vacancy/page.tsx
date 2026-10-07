import type { Metadata } from 'next';
import SchoolVacancyPageClient from '@/components/edu-network/SchoolVacancyPageClient';
import { ALL_ORGANIZATIONS } from '@/lib/eduNetworkData';

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const org = ALL_ORGANIZATIONS.find(o => o.id === params.id) || ALL_ORGANIZATIONS[0];
  return {
    title: `Careers & Faculty Vacancies at ${org.name} | CSEEL EduNetwork`,
    description: `Apply for open teaching and administrative job vacancies at ${org.name}, ${org.city}. Active 30-day listings with direct application.`,
  };
}

export default function OrgVacancyPage({ params }: PageProps) {
  return (
    <SchoolVacancyPageClient
      orgId={params.id}
      backUrl={`/edu-network/org/${params.id}`}
    />
  );
}
