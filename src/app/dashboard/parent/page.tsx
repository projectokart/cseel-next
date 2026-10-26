import { Metadata } from 'next';
import ParentDashboard from '@/dashboards/ParentDashboard';

export const metadata: Metadata = {
  title: 'Parent Portal | CSEEL Experiential Learning',
  description: "Monitor your child's practical science laboratory attendance, Kolb cycle experiment journals, and NEP 2020 competency certificates.",
  robots: { index: false, follow: false },
};

export default function ParentDashboardPage() {
  return <ParentDashboard />;
}
