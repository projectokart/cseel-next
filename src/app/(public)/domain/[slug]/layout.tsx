import type { Metadata } from 'next';

const DOMAIN_METADATA: Record<string, { title: string; desc: string; image: string }> = {
  science: {
    title: 'Science & Mathematics Virtual Labs & Experiential Modules | CSEEL',
    desc: 'Explore Chemistry, Biology, Physics & Mathematics through interactive virtual labs, simulations and NEP 2020 aligned practical experiments.',
    image: 'https://www.cseel.org/images/og-experiments.jpg',
  },
  engineering: {
    title: 'Engineering & Technology Innovation Labs (IoT, Robotics, AI) | CSEEL',
    desc: 'Hands-on Engineering design, AI, IoT, Robotics and ATL Tinkering Labs that build critical thinking and real-world problem solving.',
    image: 'https://www.cseel.org/images/og-steam-lab.jpg',
  },
  art: {
    title: 'Art & Design Creative STEAM Modules | CSEEL',
    desc: 'Blend creativity with science — Color Physics, Photochemistry, Design Thinking and Creative STEAM modules for holistic development.',
    image: 'https://www.cseel.org/images/og-materials.jpg',
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}): Promise<Metadata> {
  const resolved = await Promise.resolve(params);
  const slug = resolved?.slug || 'science';
  const meta = DOMAIN_METADATA[slug] || DOMAIN_METADATA.science;
  const canonicalUrl = `https://www.cseel.org/domain/${slug}`;

  return {
    title: meta.title,
    description: meta.desc,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: meta.title,
      description: meta.desc,
      url: canonicalUrl,
      siteName: 'CSEEL - Center for Scientific Exploration & Experiential Learning',
      locale: 'en_IN',
      type: 'website',
      images: [
        {
          url: meta.image,
          width: 1200,
          height: 630,
          alt: meta.title,
          type: 'image/jpeg',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.desc,
      images: [meta.image],
      creator: '@cseel_org',
      site: '@cseel_org',
    },
  };
}

export default function DomainLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
