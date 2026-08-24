import { Metadata } from 'next';
import TeachersClient from './Client';

export const metadata: Metadata = {
  title: 'Verified STEM Faculty & Teacher Directory | NEP-2020 Educators | CSEEL',
  description: 'Search and connect with 50+ verified Physics, Chemistry, Biology, Mathematics, Robotics, and Computer Science teachers across India.',
  alternates: {
    canonical: 'https://www.cseel.org/edu-network/teachers',
  },
};

export default function TeachersPage() {
  return <TeachersClient />;
}
