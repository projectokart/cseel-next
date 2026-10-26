'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, roles, loading, rolesLoading } = useAuth();

  useEffect(() => {
    if (!loading && !rolesLoading) {
      if (!user) {
        router.replace('/login?redirect=/dashboard');
        return;
      }
      if (roles.includes('moderator') || (user.email && (user.email.endsWith('@cseel.org') || user.email.endsWith('@cseel.in')))) {
        router.replace('/admin');
        return;
      }
      if (roles.includes('teacher')) {
        router.replace('/dashboard/teacher');
        return;
      }
      if (roles.includes('organisation')) {
        router.replace('/dashboard/school');
        return;
      }
      if (roles.includes('student')) {
        router.replace('/dashboard/student');
        return;
      }
      router.replace('/dashboard/student');
    }
  }, [user, roles, loading, rolesLoading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafd]">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#006FCC]" />
        <p className="text-xs font-semibold text-gray-500">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
