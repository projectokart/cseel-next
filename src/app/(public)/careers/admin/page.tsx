import { Metadata } from 'next';
import CareersAdminDashboard from '@/features/careers/components/admin/CareersAdminDashboard';

export const metadata: Metadata = {
  title: 'HR & Talent Acquisition Admin Portal | CSEEL Careers',
  description: 'Manage CSEEL job openings, applicant resumes, interview stages, and faculty recruitment pipelines.',
  robots: { index: false, follow: false },
};

export default function CareersAdminPage() {
  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <CareersAdminDashboard />
      </div>
    </div>
  );
}
