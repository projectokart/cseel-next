import { Metadata } from 'next';
import StudentDashboard from '@/dashboards/StudentDashboard';

export const metadata: Metadata = {
  title: 'Student Experiential Science Lab & Practical Dashboard | CSEEL',
  description: 'Hands-on practical experiments, virtual laboratory simulations, observation logs, and NEP 2020 competency certificates for CBSE students.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function StudentDashboardPage() {
  return <StudentDashboard />;
}
