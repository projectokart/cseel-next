import type { Metadata } from 'next';
import Client from './Client';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const title = `Community Post | CSEEL Science Community`;
  return {
    title,
    description: "Join the discussion on CSEEL's Science Community.",
    alternates: { canonical: `https://www.cseel.org/feed/${params.id}` },
    openGraph: {
      title,
      description: "Join the discussion on CSEEL's Science Community.",
      url: `https://www.cseel.org/feed/${params.id}`,
      type: "website",
      images: [{ url: "https://www.cseel.org/images/og-cover.jpg" }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@cseel_org",
      title,
      description: "Join the discussion on CSEEL's Science Community.",
      images: ["https://www.cseel.org/images/og-cover.jpg"],
    },
  };
}

export default function Page() {
  return <Client />;
}
