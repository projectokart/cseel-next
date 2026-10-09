import Layout from '@/components/layout/Layout';
import { getMaintenanceStatus } from '@/features/maintenance/maintenanceService';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  try {
    const host = headers().get('host') || '';
    const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1');

    const cookieStore = cookies();
    const hasBypass = 
      cookieStore.get('cseel_admin_bypass')?.value === 'true' ||
      Boolean(cookieStore.get('cseel_admin_auth')?.value);

    if (!hasBypass && !isLocalhost) {
      const maintenance = getMaintenanceStatus();
      if (maintenance.isActive) {
        redirect('/under-construction');
      }
    }
  } catch (e: any) {
    if (e?.digest?.startsWith?.('NEXT_REDIRECT')) {
      throw e;
    }
  }

  return <Layout>{children}</Layout>;
}
