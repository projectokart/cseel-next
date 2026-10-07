import type { Metadata } from 'next';
import Client from './Client';
import { getMaterialBySlugOrId } from '@/lib/materialsData';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const local = getMaterialBySlugOrId(params.slug);

  if (local) {
    const title = `${local.name} | Lab Equipment & Science Materials India | CSEEL`;
    const description = local.description.slice(0, 160);
    const image = local.image_url || "https://www.cseel.org/images/og-cover.jpg";

    return {
      title,
      description,
      keywords: `${local.name}, ${local.category} lab equipment India, ${local.common_names.join(', ')}, buy science kits India, CSEEL materials`,
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
    title: 'Lab Materials & Scientific Equipment | CSEEL India',
    description: 'Explore certified science lab apparatus, chemical reagents, and STEM experiment kits on CSEEL.',
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
        brand: {
          '@type': 'Brand',
          name: 'CSEEL',
        },
        offers: {
          '@type': 'Offer',
          url: `https://www.cseel.org/materials/${material.slug}`,
          priceCurrency: 'INR',
          price: material.price,
          availability: material.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: material.rating,
          reviewCount: material.reviews,
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
