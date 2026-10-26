'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Exclude /profile routes so users can start their setup flow
    if (!loading && !user && pathname && !pathname.startsWith('/profile')) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [user, loading, router, pathname]);

  return <>{children}</>;
}
