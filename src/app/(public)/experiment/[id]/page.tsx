import type { Metadata } from 'next';
import Client from './Client';
import { getExperimentBySlugOrId } from '@/lib/experimentsData';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const exp = getExperimentBySlugOrId(params.id);

  if (exp) {
    const title = `${exp.title} (${exp.subject}) | CSEEL Experiential Science & Live Lab`;
    const description = exp.description.slice(0, 160);
    const image = exp.thumbnail_url || 'https://www.cseel.org/images/og-cover.jpg';

    return {
      title,
      description,
      alternates: { canonical: `https://www.cseel.org/experiment/${exp.slug}` },
      openGraph: {
        title,
        description,
        url: `https://www.cseel.org/experiment/${exp.slug}`,
        type: 'website',
        images: [{ url: image }],
      },
      twitter: {
        card: 'summary_large_image',
        site: '@cseel_org',
        title,
        description,
        images: [image],
      },
    };
  }

  return {
    title: 'Hands-on Science Practical Experiment | CSEEL Experiential Live Lab',
    description: 'Explore interactive hands-on science experiments and live labs covering Chemistry, Biology, Physics, and STEM practicals on CSEEL.',
  };
}

export default function ExperimentDetailPage() {
  return <Client />;
}
