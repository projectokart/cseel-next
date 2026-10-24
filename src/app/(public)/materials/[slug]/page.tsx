import type { Metadata } from 'next';
import Client from './Client';
import { getMaterialBySlugOrId } from '@/lib/materialsData';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const local = getMaterialBySlugOrId(params.slug);

  if (local) {
    const title = `${local.name} (${local.sku}) - ${local.cbse_chapter} Apparatus | CSEEL`;
    const description = `${local.name}: ${local.description.slice(0, 160)}. Curriculum: ${local.cbse_chapter}. Experiential learning and school science practical apparatus from CSEEL.`;
    const image = local.image_url || "https://www.cseel.org/images/cseel-social-preview.jpg";

    return {
      title,
      description,
      keywords: `${local.name}, ${local.sku}, ${local.cbse_chapter}, physics practical apparatus, experiential science lab, CSEEL materials`,
      alternates: {
        canonical: `https://www.cseel.org/materials/${local.slug}`,
      },
      openGraph: {
        title,
        description,
        url: `https://www.cseel.org/materials/${local.slug}`,
        type: 'website',
        images: [
          {
            url: image,
            width: 800,
            height: 800,
            alt: local.name,
          },
        ],
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
    title: 'Science & Physics Lab Apparatus | CSEEL Experiential Learning',
    description: 'Explore 954+ science and physics laboratory apparatuses categorized by curriculum chapters for experiential school education.',
  };
}

export default function MaterialDetailPage({ params }: { params: { slug: string } }) {
  const material = getMaterialBySlugOrId(params.slug);

  const jsonLd = material
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: material.name,
        image: material.image_url,
        description: material.description,
        sku: material.sku,
        category: material.cbse_chapter,
        brand: {
          '@type': 'Brand',
          name: 'CSEEL Experiential Learning',
        },
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <Client slug={params.slug} />
    </>
  );
}
