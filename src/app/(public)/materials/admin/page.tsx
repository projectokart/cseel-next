import { Metadata } from 'next';
import MaterialsAdminDashboard from '@/features/materials/components/admin/MaterialsAdminDashboard';
import DepartmentAdminLayout from '@/features/admin/components/DepartmentAdminLayout';

export const metadata: Metadata = {
  title: 'Materials & Lab Kits Admin Center | CSEEL Scientific Store',
  description: 'Departmental administration for STEM lab materials, glassware, equipment stock, and wholesale school supply orders.',
  robots: { index: false, follow: false },
};

export default function MaterialsAdminPage() {
  return (
    <DepartmentAdminLayout
      departmentName="Materials & Lab Store Administration"
      departmentRole="inventory_admin"
      publicUrl="/materials"
      subdomainUrl="https://material.cseel.org/admin"
      schemaBadge="materials.*"
    >
      <MaterialsAdminDashboard />
    </DepartmentAdminLayout>
  );
}
