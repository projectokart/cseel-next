import { Metadata } from 'next';
import JobsClient from './Client';

export const metadata: Metadata = {
  title: 'STEM & School Teaching Jobs Across India | CSEEL EduNetwork Career Portal',
  description: 'Explore 40+ verified STEM teaching, physics, chemistry, biology, mathematics, robotics, and lab instructor jobs across top CBSE schools and institutes in India.',
  alternates: {
    canonical: 'https://www.cseel.org/edu-network/jobs',
  },
};

export default function JobsPage() {
  return <JobsClient />;
}
