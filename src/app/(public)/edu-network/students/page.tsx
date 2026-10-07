import { Metadata } from 'next';
import StudentsClient from './Client';

export const metadata: Metadata = {
  title: 'National Student Innovator Showcase & ATL Tinkering Talents | CSEEL',
  description: 'Explore 50+ outstanding school science fair prototypes, robotics projects, and verified research portfolios from young innovators across India.',
  alternates: {
    canonical: 'https://www.cseel.org/edu-network/students',
  },
};

export default function StudentsPage() {
  return <StudentsClient />;
}
