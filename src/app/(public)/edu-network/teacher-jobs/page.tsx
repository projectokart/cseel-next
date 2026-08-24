import type { Metadata } from 'next';
import EduJobsClient from '../jobs/Client';

export const metadata: Metadata = {
  title: 'Teacher & STEM Faculty Jobs in India | CSEEL EduNetwork Career Portal',
  description: 'Find verified school teaching jobs, physics, chemistry, biology, mathematics educator vacancies, and live STEM lab coordinator openings across India.',
  alternates: {
    canonical: 'https://www.cseel.org/edu-network/jobs',
  },
};

export default function TeacherJobsPage() {
  return <EduJobsClient />;
}
