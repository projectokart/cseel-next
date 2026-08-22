import { Metadata } from 'next';
import MaterialsAdminDashboard from '@/features/materials/components/admin/MaterialsAdminDashboard';
import { AdminAuthProvider } from '@/features/admin/contexts/AdminAuthContext';

export const metadata: Metadata = {
  title: 'Materials & Lab Kits Admin Center | CSEEL Scientific Store',
  description: 'Departmental administration for STEM lab materials, glassware, equipment stock, and wholesale school supply orders.',
  robots: { index: false, follow: false },
};

export default function MaterialsAdminPage() {
  return (
    <AdminAuthProvider>
      <div className="min-h-screen bg-slate-950 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <MaterialsAdminDashboard />
        </div>
      </div>
    </AdminAuthProvider>
  );
}
