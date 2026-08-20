import { Metadata } from 'next';

export interface SeoConfig {
  title: string;
  description: string;
  path: string;
  image?: string;
  keywords?: string[];
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
}

const DEFAULT_OG_IMAGE = 'https://sc0.blr1.digitaloceanspaces.com/inline/827643-dgxdopizaz-1487753907.JPG';
const BASE_URL = 'https://www.cseel.org';

/**
 * Standardized SEO & WhatsApp Preview Generator for CSEEL Next.js Platform
 */
export function generateSeoMetadata(config: SeoConfig): Metadata {
  const fullUrl = `${BASE_URL}${config.path.startsWith('/') ? '' : '/'}${config.path}`;
  const imageUrl = config.image || DEFAULT_OG_IMAGE;

  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords || [
      'CSEEL',
      'STEM Education India',
      'Hands-on Science Labs',
      'NEP-2020 Curriculum',
      'School Faculty Recruitment',
      'Physics Chemistry Biology Kits',
    ],
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      title: config.title,
      description: config.description,
      url: fullUrl,
      siteName: 'CSEEL - Centre for Science Education & Experiential Learning',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: config.title,
        },
      ],
      locale: 'en_IN',
      type: config.type || 'website',
      ...(config.publishedTime ? { publishedTime: config.publishedTime } : {}),
      ...(config.modifiedTime ? { modifiedTime: config.modifiedTime } : {}),
      ...(config.authors ? { authors: config.authors } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: config.title,
      description: config.description,
      images: [imageUrl],
      creator: '@cseel_india',
    },
    other: {
      'og:image:width': '1200',
      'og:image:height': '630',
      'og:image:type': 'image/jpeg',
    },
  };
}
