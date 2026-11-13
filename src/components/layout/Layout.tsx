'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import TopBar from "./TopBar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AnnouncementBar from "./AnnouncementBar";
import ResearchRibbonBanner from "./ResearchRibbonBanner";
import OfferPopup from "@/components/offers/OfferPopup";
import { UserProfileModal } from "@/components/auth/UserProfileModal";

import { NavigationProvider } from '@/contexts/NavigationContext';
import { UniversalCmsProvider } from '@/features/universal-cms/useUniversalCms';
import { UniversalAdminBar } from '@/components/admin-editor';
import AdSenseBanner from '@/components/ads/AdSenseBanner';

interface LayoutProps {
  children: React.ReactNode;
}

const LayoutContent = ({ children }: LayoutProps) => {
  const pathname = usePathname();
  const isAdmin = pathname?.includes('/admin') || pathname?.startsWith('/admin') || pathname?.includes('/system-admin-portal');
  const isDedicated =
    pathname?.startsWith('/school-finder') ||
    pathname?.startsWith('/schoolsearch') ||
    pathname?.startsWith('/school-template') ||
    pathname === '/domain/astronomy' ||
    pathname?.startsWith('/domain/astronomy') ||
    pathname === '/antariksha' ||
    pathname?.startsWith('/antariksha');
  const isHomePage = pathname === '/' || pathname === '';
  const shouldHideAds =
    isHomePage ||
    pathname?.startsWith('/login') ||
    pathname?.startsWith('/signup') ||
    pathname?.startsWith('/auth') ||
    pathname?.startsWith('/reset-password') ||
    pathname?.startsWith('/register') ||
    pathname?.startsWith('/dashboard') ||
    pathname?.startsWith('/studio') ||
    pathname?.startsWith('/mrstudio') ||
    pathname?.startsWith('/under-construction');

  if (isAdmin || isDedicated) {
    return <div className="min-h-screen flex flex-col">{children}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col w-full max-w-full [overflow-x:clip] print:min-h-0 print:h-auto print:block print:w-auto print:max-w-none print:overflow-visible">
      {/* Empirical Research Announcement Ribbon at the very top of all pages */}
      <div className="print:hidden">
        <ResearchRibbonBanner />
      </div>

      {/* On non-home pages, Universal Admin Bar handles in-place live editing */}
      {!isHomePage && (
        <div className="print:hidden">
          <UniversalAdminBar />
        </div>
      )}

      {/* Sticky Header Container: Both TopBar and Navbar stick together at the top on scroll */}
      <div className="print:hidden sticky top-0 z-[500] w-full bg-white shadow-xs">
        <TopBar />
        <Navbar />
      </div>
      <OfferPopup />
      <UserProfileModal />

      <main className="flex-1 min-w-0 w-full [overflow-x:clip] print:overflow-visible print:min-h-0 print:h-auto print:block">{children}</main>

      {!shouldHideAds && (
        <div className="print:hidden w-full max-w-screen-2xl mx-auto px-2 sm:px-6 lg:px-8 py-4">
          <AdSenseBanner key={`layout-ad-${pathname || 'page'}`} plain label="" className="my-0" />
        </div>
      )}

      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
};

export const Layout = ({ children }: LayoutProps) => {
  return (
    <NavigationProvider>
      <UniversalCmsProvider>
        <LayoutContent>{children}</LayoutContent>
      </UniversalCmsProvider>
    </NavigationProvider>
  );
};

export default Layout;
