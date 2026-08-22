import { Metadata } from 'next';
import EventsAdminDashboard from '@/features/events/components/admin/EventsAdminDashboard';

export const metadata: Metadata = {
  title: 'Conclaves & Outreach Events Admin | CSEEL',
  description: 'Coordinate national science symposia, principals conclaves, speaker lineups, and delegate registrations.',
  robots: { index: false, follow: false },
};

export default function EventsAdminPage() {
  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <EventsAdminDashboard />
      </div>
    </div>
  );
}
