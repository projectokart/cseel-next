import JigyasuInfoArticlePage, { metadata as jigyasuMetadata } from '../jigyasu-scam-review-truth/page';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  if (params.slug === 'jigyasu-scam-review-truth' || params.slug.includes('jigyasu')) {
    return jigyasuMetadata;
  }
  return {
    title: 'Educational Safety Advisory | Public Information Notice',
    description: 'Independent consumer awareness and laboratory safety advisory for schools.',
  };
}

export default function InfoDynamicSlugPage({ params }: { params: { slug: string } }) {
  if (params.slug === 'jigyasu-scam-review-truth' || params.slug.includes('jigyasu')) {
    return <JigyasuInfoArticlePage />;
  }
  notFound();
}
