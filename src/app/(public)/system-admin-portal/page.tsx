import { Metadata } from 'next';
import { AdminLayout } from '@/features/admin';

export const metadata: Metadata = {
  title: 'Secure System Administration | CSEEL Governance Console',
  description: 'Authorized administrative governance portal for CSEEL network.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function SecureAdminPortalPage() {
  return <AdminLayout />;
}
