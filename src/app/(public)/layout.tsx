import Layout from '@/components/layout/Layout';
import { getMaintenanceStatus } from '@/features/maintenance/maintenanceService';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  try {
    const cookieStore = cookies();
    const hasBypass = 
      cookieStore.get('cseel_admin_bypass')?.value === 'true' ||
      Boolean(cookieStore.get('cseel_admin_auth')?.value);

    if (!hasBypass) {
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
