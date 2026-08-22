import { Metadata } from 'next';
import TrainingAdminDashboard from '@/features/training/components/admin/TrainingAdminDashboard';
import { AdminAuthProvider } from '@/features/admin/contexts/AdminAuthContext';

export const metadata: Metadata = {
  title: 'Teacher Training & NEP Pedagogy Admin | CSEEL',
  description: 'Oversee teacher masterclasses, ATL tinkering bootcamps, certificates issued, and faculty enrollments.',
  robots: { index: false, follow: false },
};

export default function TrainingAdminPage() {
  return (
    <AdminAuthProvider>
      <div className="min-h-screen bg-slate-950 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <TrainingAdminDashboard />
        </div>
      </div>
    </AdminAuthProvider>
  );
}
