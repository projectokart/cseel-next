import { Metadata } from 'next';
import EventsAdminDashboard from '@/features/events/components/admin/EventsAdminDashboard';
import DepartmentAdminLayout from '@/features/admin/components/DepartmentAdminLayout';

export const metadata: Metadata = {
  title: 'Conclaves & Outreach Events Admin | CSEEL',
  description: 'Coordinate national science symposia, principals conclaves, speaker lineups, and delegate registrations.',
  robots: { index: false, follow: false },
};

export default function EventsAdminPage() {
  return (
    <DepartmentAdminLayout
      departmentName="Conclaves & Events Administration"
      departmentRole="programs_admin"
      publicUrl="/events"
      subdomainUrl="https://events.cseel.org/admin"
      schemaBadge="events.*"
    >
      <EventsAdminDashboard />
    </DepartmentAdminLayout>
  );
}
