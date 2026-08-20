import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ALL_SEMINARS } from '@/lib/seminarsData';
import SeminarDetailClient from './Client';

interface Props {
  params: { id: string };
}

export async function generateStaticParams() {
  return ALL_SEMINARS.map((seminar) => ({
    id: seminar.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const seminar = ALL_SEMINARS.find((s) => s.id === params.id);
  if (!seminar) {
    return {
      title: 'Event Not Found | CSEEL Seminars',
    };
  }

  const title = `${seminar.title} | CSEEL Conclaves & Seminars 2026`;
  const description = seminar.summary;

  return {
    title,
    description,
    alternates: { canonical: `https://www.cseel.org/seminars/${seminar.id}` },
    openGraph: {
      title,
      description,
      url: `https://www.cseel.org/seminars/${seminar.id}`,
      type: 'article',
      images: [
        {
          url: seminar.bannerImage,
          width: 1200,
          height: 630,
          alt: seminar.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [seminar.bannerImage],
    },
  };
}

export default function SeminarDetailPage({ params }: Props) {
  const seminar = ALL_SEMINARS.find((s) => s.id === params.id);

  if (!seminar) {
    notFound();
  }

  return <SeminarDetailClient seminar={seminar} allSeminars={ALL_SEMINARS} />;
}
