import { Metadata } from 'next';
import EduNetworkAdminDashboard from '@/features/edu-network/components/admin/EduNetworkAdminDashboard';
import DepartmentAdminLayout from '@/features/admin/components/DepartmentAdminLayout';

export const metadata: Metadata = {
  title: 'School & Institutional Network Admin | CSEEL',
  description: 'Manage 100+ partner schools across India, CBSE/ICSE accreditation levels, and STEM laboratory audit KYC.',
  robots: { index: false, follow: false },
};

export default function EduNetworkAdminPage() {
  return (
    <DepartmentAdminLayout
      departmentName="Institutional Network Administration"
      departmentRole="school_admin"
      publicUrl="/edu-network"
      subdomainUrl="https://network.cseel.org/admin"
      schemaBadge="network.*"
    >
      <EduNetworkAdminDashboard />
    </DepartmentAdminLayout>
  );
}
