import { Metadata } from 'next';
import AdminDashboard from '@/dashboards/AdminDashboard';

export const metadata: Metadata = {
  title: 'Admin Governance Console | CSEEL Master Operations',
  description: 'Enterprise master control portal for CSEEL. Science Labs, STEM Projects, School UDISE Verification, Procurement and NEP Certifications.',
  robots: {
    index: false,
    follow: false,
  },
  icons: {
    icon: [
      { url: '/favicon.svg?v=20261001-theme', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png?v=20261001-theme', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon.svg?v=20261001-theme',
  },
};

export default function AdminPage() {
  return <AdminDashboard />;
}
