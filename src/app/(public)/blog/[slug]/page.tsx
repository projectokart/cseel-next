import type { Metadata } from 'next';
import Client from './Client';
import { supabase } from '@/integrations/supabase/client';
import { getBlogBySlug } from '@/lib/blogsData';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const local = getBlogBySlug(params.slug);
  if (local) {
    const title = `${local.title} | CSEEL Science Blog`;
    const description = local.summary.slice(0, 160);
    const image = local.coverImage || 'https://www.cseel.org/images/og-cover.jpg';
    return {
      title,
      description,
      alternates: { canonical: `https://www.cseel.org/blog/${local.slug}` },
      openGraph: {
        title,
        description,
        url: `https://www.cseel.org/blog/${local.slug}`,
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

  try {
    const { data } = await (supabase as any)
      .from('blog_posts')
      .select('title, excerpt, cover_image_url')
      .eq('slug', params.slug)
      .maybeSingle();

    if (data) {
      const title = `${data.title} | CSEEL Science Blog`;
      const description = data.excerpt?.slice(0, 160) || 'Read this post on CSEEL Science Blog.';
      const image = data.cover_image_url || 'https://www.cseel.org/images/og-cover.jpg';

      return {
        title,
        description,
        alternates: { canonical: `https://www.cseel.org/blog/${params.slug}` },
        openGraph: {
          title,
          description,
          url: `https://www.cseel.org/blog/${params.slug}`,
          type: 'article',
          images: [{ url: image }],
        },
      };
    }
  } catch (e) {}

  return {
    title: 'Science Education & Research Article | CSEEL Blog',
    description: 'Read the latest educational research, laboratory guidelines, and STEM innovations on CSEEL.',
  };
}

export default function BlogDetailPage() {
  return <Client />;
}
