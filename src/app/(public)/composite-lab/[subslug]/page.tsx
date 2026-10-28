import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { COMPOSITE_LAB_SUBPAGES } from '@/lib/compositeSopData';
import SubslugClient from './Client';

interface Props {
  params: { subslug: string } | Promise<{ subslug: string }>;
}

export function generateStaticParams() {
  return Object.keys(COMPOSITE_LAB_SUBPAGES).map((subslug) => ({ subslug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subslug } = await Promise.resolve(params);
  const data = COMPOSITE_LAB_SUBPAGES[subslug];
  if (!data) return { title: 'Not Found | CSEEL' };

  return {
    title: data.metaTitle,
    description: data.metaDescription,
    keywords: [
      data.searchQuery,
      "cbse composite lab",
      "composite science laboratory cbse",
      "composite lab setup india",
      "cbse saras sop",
      "composite lab norms 2026"
    ].join(", "),
    alternates: {
      canonical: `https://www.cseel.org/composite-lab/${data.slug}`,
    },
    openGraph: {
      title: data.metaTitle,
      description: data.metaDescription,
      url: `https://www.cseel.org/composite-lab/${data.slug}`,
      siteName: "CSEEL - Center for Scientific Exploration & Experiential Learning",
      locale: "en_IN",
      type: "article",
    },
  };
}

export default async function SubPage({ params }: Props) {
  const { subslug } = await Promise.resolve(params);
  const data = COMPOSITE_LAB_SUBPAGES[subslug];
  if (!data) notFound();

  return <SubslugClient data={data} />;
}
