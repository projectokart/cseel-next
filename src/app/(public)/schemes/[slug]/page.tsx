import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SCHEMES_DATA } from '@/lib/schemesData';
import SchemeDetailClient from './Client';

interface Props {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return Object.keys(SCHEMES_DATA).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const scheme = SCHEMES_DATA[params.slug];
  if (!scheme) {
    return {
      title: 'Government Scheme Not Found | CSEEL',
    };
  }

  return {
    title: `${scheme.shortTitle} - Grants, Guidelines & Lab Modernization (2026) | CSEEL`,
    description: scheme.tagline.slice(0, 160),
    keywords: [
      scheme.shortTitle,
      ...scheme.tags,
      'Government School Grants',
      'School Lab Infrastructure',
      'CBSE Grants India',
      'CSEEL Labs'
    ],
    openGraph: {
      title: scheme.title,
      description: scheme.tagline,
      type: 'article',
      images: [
        {
          url: scheme.heroImage,
          width: 1200,
          height: 630,
          alt: scheme.heroImageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: scheme.shortTitle,
      description: scheme.tagline,
      images: [scheme.heroImage],
    },
  };
}

export default function SchemeDetailPage({ params }: Props) {
  const scheme = SCHEMES_DATA[params.slug];

  if (!scheme) {
    notFound();
  }

  return <SchemeDetailClient scheme={scheme} />;
}
