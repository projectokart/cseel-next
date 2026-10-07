import { Metadata } from 'next';
import AdminLayout from '@/features/admin/components/AdminLayout';

export const metadata: Metadata = {
  title: 'Experiments Management & Studio | CSEEL Admin',
  description: 'Enterprise laboratory practical and experiment builder for CSEEL with multi-subject CRUD, Word-like ribbon editor, and single-page publication preview.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminExperimentsPage() {
  return <AdminLayout initialModule="experiments_studio" />;
}
