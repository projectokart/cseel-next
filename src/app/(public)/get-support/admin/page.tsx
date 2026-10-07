import { Metadata } from 'next';
import SupportAdminDashboard from '@/features/support/components/admin/SupportAdminDashboard';
import DepartmentAdminLayout from '@/features/admin/components/DepartmentAdminLayout';

export const metadata: Metadata = {
  title: 'Technical Helpdesk & School Support Admin | CSEEL',
  description: 'Resolve lab hardware warranty tickets, teacher curriculum inquiries, and sensor calibration assistance.',
  robots: { index: false, follow: false },
};

export default function SupportAdminPage() {
  return (
    <DepartmentAdminLayout
      departmentName="Helpdesk & School Support Administration"
      departmentRole="inventory_admin"
      publicUrl="/get-support"
      subdomainUrl="https://support.cseel.org/admin"
      schemaBadge="support.*"
    >
      <SupportAdminDashboard />
    </DepartmentAdminLayout>
  );
}
