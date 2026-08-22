import { Metadata } from 'next';
import EduNetworkAdminDashboard from '@/features/edu-network/components/admin/EduNetworkAdminDashboard';

export const metadata: Metadata = {
  title: 'School & Institutional Network Admin | CSEEL',
  description: 'Manage 100+ partner schools across India, CBSE/ICSE accreditation levels, and STEM laboratory audit KYC.',
  robots: { index: false, follow: false },
};

export default function EduNetworkAdminPage() {
  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <EduNetworkAdminDashboard />
      </div>
    </div>
  );
}
