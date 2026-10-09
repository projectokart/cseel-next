import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import Client from './Client';
import { getMaintenanceStatus } from '@/features/maintenance/maintenanceService';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "CSEEL | India's #1 Experimental Science Learning Platform",
  description: "CSEEL offers hands-on science experiments, virtual lab simulations, STEM education, teacher training, and national science exhibitions for students and educators across India. Aligned with CBSE, ICSE & NCERT.",
  alternates: {
    canonical: "https://www.cseel.org",
  },
  openGraph: {
    title: "CSEEL | India's #1 Experimental Science Learning Platform",
    description: "CSEEL offers hands-on science experiments, virtual lab simulations, STEM education, teacher training, and national science exhibitions for students and educators across India. Aligned with CBSE, ICSE & NCERT.",
    url: "https://www.cseel.org",
    siteName: "CSEEL",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://www.cseel.org/images/og-cover.jpg",
        width: 1200,
        height: 630,
        alt: "CSEEL - Center for Scientific Exploration & Experimental Learning",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@cseel_org",
    title: "CSEEL | India's #1 Experimental Science Learning Platform",
    description: "CSEEL offers hands-on science experiments, virtual lab simulations, STEM education, teacher training, and national science exhibitions for students and educators across India. Aligned with CBSE, ICSE & NCERT.",
    images: ["https://www.cseel.org/images/og-cover.jpg"],
  },
};

export default function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const isBypassQuery = searchParams?.bypass === 'true' || 
                        searchParams?.bypass_maintenance === '1' || 
                        searchParams?.edit === 'true' || 
                        searchParams?.editMode === 'true';

  if (!isBypassQuery) {
    try {
      const cookieStore = cookies();
      const hasBypassCookie = 
        cookieStore.get('cseel_admin_bypass')?.value === 'true' ||
        Boolean(cookieStore.get('cseel_admin_auth')?.value);

      if (!hasBypassCookie) {
        const maintenance = getMaintenanceStatus();
        if (maintenance.isActive) {
          redirect('/under-construction');
        }
      }
    } catch (e: any) {
      if (e?.digest?.startsWith?.('NEXT_REDIRECT')) {
        throw e;
      }
      console.error('[HomePage] Maintenance check error:', e);
    }
  }

  return <Client />;
}
