import type { Metadata } from 'next';
import Client from './Client';
import { events } from '@/lib/eventsData';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const event = events.find((e) => e.id === params.id);
  if (event) {
    const title = `${event.title} (${event.date}) | CSEEL Science Events India`;
    const description = event.desc || `Join ${event.title} organized by CSEEL. Event location: ${event.location}.`;
    return {
      title,
      description,
      alternates: { canonical: `https://www.cseel.org/events/${params.id}` },
      openGraph: {
        title,
        description,
        url: `https://www.cseel.org/events/${params.id}`,
        type: "website",
        images: [{ url: "https://www.cseel.org/images/og-cover.jpg" }],
      },
      twitter: {
        card: "summary_large_image",
        site: "@cseel_org",
        title,
        description,
        images: ["https://www.cseel.org/images/og-cover.jpg"],
      },
    };
  }

  return {
    title: 'Science Event & Exhibition | CSEEL India',
    description: 'Participate in national-level science fairs, exhibitions, and teacher workshops organized by CSEEL.',
  };
}

export default function Page() {
  return <Client />;
}
