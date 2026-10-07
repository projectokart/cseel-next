'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ArrowLeft, 
  PhoneCall, 
  Mail, 
  Construction, 
  Layers, 
  FlaskConical, 
  CheckCircle2, 
  Clock,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import PageTransition from '@/components/shared/PageTransition';

interface CustomPageData {
  slug: string;
  title: string;
  subtitle?: string;
  status: 'working' | 'published' | 'draft';
  customMessage?: string;
  category?: string;
  updatedAt?: string;
}

export default function CustomPageClient({ slug }: { slug: string }) {
  const [pageData, setPageData] = useState<CustomPageData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fallback formatting from slug string
  const formattedSlugTitle = slug
    .split('/')
    .pop()
    ?.split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ') || 'Experiential Learning';

  useEffect(() => {
    let isMounted = true;
    async function fetchPage() {
      try {
        const res = await fetch(`/api/admin/custom-pages?slug=${encodeURIComponent(slug)}`);
        if (res.ok) {
          const json = await res.json();
          if (isMounted && json.page) {
            setPageData(json.page);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error('Failed to fetch page data:', err);
      }
      if (isMounted) {
        setPageData({
          slug,
          title: formattedSlugTitle,
          subtitle: 'Experiential STEM module & school laboratory guidelines.',
          status: 'working',
          customMessage: 'We are currently working on this page. Our academic specialists and lab designers are finalizing curriculum-aligned practical procedures and equipment checklists.',
        });
        setLoading(false);
      }
    }
    fetchPage();
    return () => {
      isMounted = false;
    };
  }, [slug, formattedSlugTitle]);

  const displayTitle = pageData?.title || formattedSlugTitle;
  const displaySubtitle = pageData?.subtitle || 'Experiential practical learning & turnkey school laboratory solutions.';
  const displayMessage = pageData?.customMessage || 'We are currently working on this page. Check back soon!';

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#F8FAFD] text-slate-800">

        {/* ── TOP HERO BANNER ── */}
        <section 
          className="relative text-white py-16 lg:py-20 overflow-hidden"
          style={{ background: 'linear-gradient(110deg, #023858 36%, #005499 68%)' }}
        >
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl">
              
              {/* Breadcrumb / Back Link */}
              <div className="mb-4">
                <Link 
                  href="/"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-200 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Homepage</span>
                </Link>
              </div>

              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 border border-amber-300/30 text-amber-200 text-xs font-bold uppercase tracking-wider mb-4">
                <Construction className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span>Working On This Page</span>
              </div>

              {/* Page Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15] mb-4">
                {displayTitle}
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-sky-100/90 leading-relaxed font-normal">
                {displaySubtitle}
              </p>
            </div>
          </div>
        </section>

        {/* ── MAIN CONTENT NOTICE CARD ── */}
        <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-[24px] border border-[#E8E9E9] shadow-sm p-8 sm:p-12 text-center max-w-2xl mx-auto">
            
            {/* Visual Icon */}
            <div className="w-16 h-16 rounded-2xl bg-[#EDF5FA] border border-[#006FCC]/20 flex items-center justify-center mx-auto mb-6 shadow-xs">
              <Construction className="w-8 h-8 text-[#006FCC]" />
            </div>

            {/* Notification Heading */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#023858] tracking-tight mb-3">
              Working On This Page
            </h2>

            {/* Custom Message */}
            <p className="text-sm sm:text-base text-[#5F6265] leading-relaxed mb-8 max-w-lg mx-auto">
              {displayMessage}
            </p>

            {/* Progress Checklist Indicators */}
            <div className="bg-[#F8FAFD] rounded-xl p-4 sm:p-5 border border-[#E8E9E9] text-left max-w-md mx-auto mb-8 space-y-2.5">
              <div className="text-xs font-bold uppercase tracking-wider text-[#006FCC] mb-1">
                Development Roadmap:
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Curriculum & NEP 2020 alignment in progress</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Apparatus checklists & practical manuals being verified</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Teacher onboarding & student worksheets underway</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/subject/physics"
                className="button_primary inline-flex items-center justify-center px-6 py-3 bg-[#006FCC] hover:bg-[#005499] text-white text-sm font-bold rounded-[12px] transition-all shadow-[0_4px_14px_rgba(0,111,204,0.35)]"
              >
                Explore Active Science Labs
              </Link>
              <Link
                href="/contact-us"
                className="inline-flex items-center justify-center px-6 py-3 bg-[#EDF5FA] hover:bg-[#DDECF6] text-[#006FCC] text-sm font-bold rounded-[12px] transition-all"
              >
                Contact Lab Team
              </Link>
            </div>

            {/* Helpline Footer */}
            <div className="mt-8 pt-6 border-t border-[#F0F2F4] text-xs text-[#5F6265] flex items-center justify-center gap-4">
              <span className="flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-[#006FCC]" />
                <span>Lab Helpline: +91-9050778830</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#006FCC]" />
                <span>support@cseel.org</span>
              </span>
            </div>

          </div>
        </section>

      </div>
    </PageTransition>
  );
}
