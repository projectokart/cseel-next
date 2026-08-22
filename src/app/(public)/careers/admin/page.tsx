import { Metadata } from 'next';
import CareersAdminDashboard from '@/features/careers/components/admin/CareersAdminDashboard';
import DepartmentAdminLayout from '@/features/admin/components/DepartmentAdminLayout';

export const metadata: Metadata = {
  title: 'HR & Talent Acquisition Admin Portal | CSEEL Careers',
  description: 'Manage CSEEL job openings, applicant resumes, interview stages, and faculty recruitment pipelines.',
  robots: { index: false, follow: false },
};

export default function CareersAdminPage() {
  return (
    <DepartmentAdminLayout
      departmentName="HR & Talent Acquisition Administration"
      departmentRole="hr_admin"
      publicUrl="/careers"
      subdomainUrl="https://careers.cseel.org/admin"
      schemaBadge="careers.*"
    >
      <CareersAdminDashboard />
    </DepartmentAdminLayout>
  );
}
