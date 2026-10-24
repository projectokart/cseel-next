import type { Metadata } from 'next';
import EventsClient from './EventsClient';

export const metadata: Metadata = {
  title: 'STEM Events, Workshops & Science Competitions 2026 | CSEEL',
  description:
    'Join national science exhibitions, Atal Tinkering Lab hackathons, experiential pedagogy symposiums, and hands-on workshops across India.',
  keywords:
    'STEM events India, robotics hackathon, science exhibition, ATL workshop, experiential science pedagogy, teacher training',
  alternates: {
    canonical: 'https://www.cseel.org/events',
  },
  openGraph: {
    title: 'STEM Events, Workshops & Science Competitions 2026 | CSEEL',
    description:
      'Join national science exhibitions, Atal Tinkering Lab hackathons, experiential pedagogy symposiums, and hands-on workshops across India.',
    url: 'https://www.cseel.org/events',
    siteName: 'CSEEL',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function EventsPage() {
  return <EventsClient />;
}
