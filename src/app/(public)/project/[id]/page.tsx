import type { Metadata } from 'next';
import Client from './Client';
import { getProjectBySlugOrId } from '@/lib/projectsData';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const proj = getProjectBySlugOrId(params.id);

  if (proj) {
    const title = `${proj.title} | Student Science Projects India | CSEEL`;
    const description = proj.desc.slice(0, 160);
    const image = proj.img || 'https://www.cseel.org/images/og-cover.jpg';

    return {
      title,
      description,
      alternates: { canonical: `https://www.cseel.org/project/${proj.slug}` },
      openGraph: {
        title,
        description,
        url: `https://www.cseel.org/project/${proj.slug}`,
        type: 'article',
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
    title: 'Student Science Project & Research | CSEEL India',
    description: 'Explore student science innovations, models, and research projects across India on CSEEL.',
  };
}

export default function ProjectDetailPage() {
  return <Client />;
}
