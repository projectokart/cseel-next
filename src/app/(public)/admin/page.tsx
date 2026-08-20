import { Metadata } from 'next';
import { AdminLayout } from '@/features/admin';

export const metadata: Metadata = {
  title: 'CSEEL Administrative Governance Center | Role-Based Control Portal',
  description: 'Enterprise role-based admin management portal for CSEEL. Super Admin, HR, School, Faculty Recruitment, Science Labs, Projectokart, Inventory, Events and Content governance.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return <AdminLayout />;
}
