import { Metadata } from 'next';
import CustomPageClient from '@/app/(public)/page/[...slug]/Client';

interface Props {
  params: { slug: string[] };
}

export function generateMetadata({ params }: Props): Metadata {
  const slugPath = params.slug?.join('/') || 'custom-page';
  const cleanTitle = slugPath
    .split('/')
    .pop()
    ?.split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ') || 'Experiential Learning';

  return {
    title: `${cleanTitle} | CSEEL India`,
    description: `Official information, practical blueprints, and resources for ${cleanTitle} by CSEEL India.`,
  };
}

export default function CustomDynamicPage({ params }: Props) {
  const slugPath = params.slug?.join('/') || '';
  return <CustomPageClient slug={slugPath} />;
}
