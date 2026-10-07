import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { COMPOSITE_LAB_SUBPAGES } from '@/lib/compositeSopData';
import SubslugClient from './Client';

interface Props {
  params: { subslug: string };
}

export function generateStaticParams() {
  return Object.keys(COMPOSITE_LAB_SUBPAGES).map((subslug) => ({ subslug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const data = COMPOSITE_LAB_SUBPAGES[params.subslug];
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

export default function SubPage({ params }: Props) {
  const data = COMPOSITE_LAB_SUBPAGES[params.subslug];
  if (!data) notFound();

  return <SubslugClient data={data} />;
}
