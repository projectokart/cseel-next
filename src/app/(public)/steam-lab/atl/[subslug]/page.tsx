import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ATL_SUBPAGES } from '@/lib/atlData';
import AtlMasterClient from '../Client';

interface Props {
  params: {
    subslug: string;
  };
}

export function generateStaticParams() {
  return Object.keys(ATL_SUBPAGES)
    .filter((slug) => slug !== 'overview')
    .map((subslug) => ({
      subslug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const targetSlug = (params.subslug === 'zones' || params.subslug === 'layout') ? 'infrastructure' : params.subslug;
  const meta = ATL_SUBPAGES[targetSlug];
  if (!meta) {
    return {
      title: 'ATL Resource Not Found | CSEEL',
    };
  }

  return {
    title: `${meta.title} | CSEEL`,
    description: meta.tagline.slice(0, 160),
    keywords: [
      'Atal Tinkering Lab',
      meta.shortTitle,
      'NITI Aayog ATL 2026',
      'Package 1 to 4 ATL',
      'ATL 60 students vs 90 students',
      '4 Functional Tinkering Zones',
      'CSEEL Labs'
    ],
    openGraph: {
      title: meta.title,
      description: meta.tagline,
      type: 'article',
      images: [meta.heroImage],
    },
  };
}

export default function AtlSubpage({ params }: Props) {
  const validSubslugs = ['equipment', 'infrastructure', 'cost', 'vendor', 'zones', 'layout'] as const;
  const rawSubslug = params.subslug as typeof validSubslugs[number];

  if (!validSubslugs.includes(rawSubslug)) {
    notFound();
  }

  const subslug = (rawSubslug === 'zones' || rawSubslug === 'layout') ? 'infrastructure' : rawSubslug;

  return <AtlMasterClient subslug={subslug} />;
}
