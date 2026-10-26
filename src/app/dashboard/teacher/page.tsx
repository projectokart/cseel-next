import { Metadata } from 'next';
import TeacherDashboard from '@/dashboards/TeacherDashboard';

export const metadata: Metadata = {
  title: 'Teacher Faculty Dashboard & Resume Builder | CSEEL',
  description: 'Manage your teaching credentials, build your academic CV, and apply for verified school faculty and STEM lab positions across India.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function TeacherDashboardPage() {
  return <TeacherDashboard />;
}
