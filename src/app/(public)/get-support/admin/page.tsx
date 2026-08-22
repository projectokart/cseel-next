import { Metadata } from 'next';
import SupportAdminDashboard from '@/features/support/components/admin/SupportAdminDashboard';

export const metadata: Metadata = {
  title: 'Technical Helpdesk & School Support Admin | CSEEL',
  description: 'Resolve lab hardware warranty tickets, teacher curriculum inquiries, and sensor calibration assistance.',
  robots: { index: false, follow: false },
};

export default function SupportAdminPage() {
  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <SupportAdminDashboard />
      </div>
    </div>
  );
}
