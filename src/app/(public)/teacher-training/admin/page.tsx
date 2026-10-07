import { Metadata } from 'next';
import TrainingAdminDashboard from '@/features/training/components/admin/TrainingAdminDashboard';
import DepartmentAdminLayout from '@/features/admin/components/DepartmentAdminLayout';

export const metadata: Metadata = {
  title: 'Teacher Training & NEP Pedagogy Admin | CSEEL',
  description: 'Oversee teacher masterclasses, ATL tinkering bootcamps, certificates issued, and faculty enrollments.',
  robots: { index: false, follow: false },
};

export default function TrainingAdminPage() {
  return (
    <DepartmentAdminLayout
      departmentName="Teacher Training & Pedagogy Administration"
      departmentRole="programs_admin"
      publicUrl="/teacher-training"
      subdomainUrl="https://training.cseel.org/admin"
      schemaBadge="training.*"
    >
      <TrainingAdminDashboard />
    </DepartmentAdminLayout>
  );
}
