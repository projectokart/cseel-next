import { Metadata } from 'next';
import { AdminLayout } from '@/features/admin';

export const metadata: Metadata = {
  title: 'CSEEL Administrative Governance Center | Role-Based Control Portal',
  description: 'Enterprise role-based admin management portal for CSEEL. Super Admin, HR, School, Faculty Recruitment, Science Labs, Projectokart, Inventory, Events and Content governance.',
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
  return <AdminLayout />;
}
