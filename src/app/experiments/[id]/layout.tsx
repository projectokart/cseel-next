import type { Metadata } from 'next';
import { findActivityById, slugifyExperimentTitle } from '@/data/subjectActivitiesData';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = findActivityById(params.id);
  if (!data) {
    return {
      title: 'Experiment Lab Guide | CSEEL Hands-On Science',
      description: 'Hands-on practical science experiments and DIY STEM lab kits aligned with NEP 2020.',
    };
  }

  const { activity, subject } = data;
  const imageMap: Record<string, string> = {
    chemistry: 'https://www.cseel.org/images/categories/chemistry.jpg',
    physics: 'https://www.cseel.org/images/categories/physics.jpg',
    biology: 'https://www.cseel.org/images/categories/biology.jpg',
    mathematics: 'https://www.cseel.org/images/categories/mathematics.jpg',
    art: 'https://www.cseel.org/images/categories/art.jpg',
    technology: 'https://www.cseel.org/images/categories/technology.jpg',
    engineering: 'https://www.cseel.org/images/categories/engineering.jpg',
  };
  const imageUrl = imageMap[subject.slug] || 'https://www.cseel.org/images/categories/chemistry.jpg';

  return {
    title: `${activity.title} - ${subject.name.replace(' Activities', '')} Lab Guide | CSEEL`,
    description: `${activity.subtitle}. ${activity.description.slice(0, 150)}... Category: ${activity.category}, Grade: ${activity.gradeLevel}.`,
    openGraph: {
      title: `${activity.title} | CSEEL Hands-on Science`,
      description: `${activity.subtitle} - ${activity.category} practical experiment guide.`,
      url: `https://www.cseel.org/experiments/${slugifyExperimentTitle(activity.title) || activity.id}`,
      type: 'article',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: activity.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${activity.title} | CSEEL Hands-on Science`,
      description: activity.subtitle,
      images: [imageUrl],
    },
  };
}

export default function ExperimentIdLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
