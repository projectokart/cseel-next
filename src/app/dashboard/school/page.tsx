import { Metadata } from 'next';
import SchoolDashboard from '@/dashboards/SchoolDashboard';

export const metadata: Metadata = {
  title: 'School Recruitment & Job Post Portal | CSEEL',
  description: 'Post CBSE & ICSE teaching vacancies, recruit verified STEM lab instructors, and manage institutional faculty openings.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function SchoolDashboardPage() {
  return <SchoolDashboard />;
}
