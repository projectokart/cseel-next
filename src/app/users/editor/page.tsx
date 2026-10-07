'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ResumeBuilderCanvas from '@/components/resume-builder/ResumeBuilderCanvas';
import { ArrowLeft, Loader2, Plus, Sparkles, FileText } from 'lucide-react';
import Link from 'next/link';

function DedicatedResumeEditorInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const slugParam = searchParams.get('slug');
  const isNewParam = searchParams.get('new') === 'true' || searchParams.get('create') === 'true';

  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    async function loadEditorData() {
      if (authLoading) return;

      if (isNewParam || !slugParam) {
        // Fresh Empty Resume Draft
        const baseSlug = (user?.email?.split('@')[0] || 'faculty').replace(/[^a-z0-9]/g, '-');
        setProfileData({
          isNew: true,
          userId: user?.id,
          name: user?.user_metadata?.display_name || '',
          slug: `${baseSlug}-${Date.now().toString().slice(-4)}`,
          subject: 'Physics Faculty',
          title: 'Physics Faculty | Master Trainer | Academic Manager',
          experience: 'Experienced Faculty',
          phone: '',
          altPhone: '',
          email: user?.email || '',
          sections: [],
          address: '',
          addressDetails: {
            state: 'Haryana',
            district: 'Palwal',
            pincode: '121102',
            blockOrCluster: '',
            localAddress: '',
            googleMapLocation: 'https://maps.google.com/?q=28.1432,77.3241',
            latitude: 28.1432,
            longitude: 77.3241,
            liveLatitude: 28.1432,
            liveLongitude: 77.3241,
            distanceKm: 0.0,
            isLocationVerified: true,
            verificationStatus: 'verified_within_2km',
            source: 'manual_coordinates'
          },
          photoUrl: '/images/dev-sharma.jpg',
          resumeData: {
            objective: '',
            skills: [],
            qualifications: [],
            certifications: [],
            experienceList: []
          },
          videos: [],
          galleryImages: []
        });
        setLoading(false);
        return;
      }

      // Fetch existing profile by slug
      try {
        const res = await fetch('/api/faculty-resumes');
        const data = await res.json();
        if (data.success && Array.isArray(data.faculty)) {
          const found = data.faculty.find((f: any) => f.slug === slugParam);
          if (found) {
            setProfileData(found);
          } else {
            // If not found, check if it's user's profile
            const userMatch = data.faculty.find(
              (f: any) => (f.userId && f.userId === user?.id) || (f.email && f.email === user?.email)
            );
            setProfileData(userMatch || null);
          }
        }
      } catch (err) {
        console.error('Failed to load profile for editor:', err);
      } finally {
        setLoading(false);
      }
    }

    loadEditorData();
  }, [user, authLoading, slugParam, isNewParam]);

  const handleSaveProfile = async (payload: any) => {
    const res = await fetch('/api/faculty-resumes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!data.success) {
      throw new Error(data.error || 'Failed to save to Supabase');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center p-6 font-['Plus_Jakarta_Sans',sans-serif]">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20 animate-spin">
          <Loader2 className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-base font-bold text-slate-200">Loading Resume Studio Editor...</h2>
        <p className="text-xs text-slate-400 mt-1">Fetching resume blocks and styles...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#f0f2f5]">
      <ResumeBuilderCanvas
        initialData={profileData}
        userId={user?.id}
        onSave={handleSaveProfile}
        onClose={() => router.push('/users')}
      />
    </div>
  );
}

export default function DedicatedResumeEditorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      }
    >
      <DedicatedResumeEditorInner />
    </Suspense>
  );
}
