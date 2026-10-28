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
import DisabledRouteGuard from './DisabledRouteGuard';

interface LayoutProps {
  children: React.ReactNode;
}

const LayoutContent = ({ children }: LayoutProps) => {
  const pathname = usePathname();
  const isAdmin = pathname?.includes('/admin') || pathname?.startsWith('/admin') || pathname?.includes('/system-admin-portal');
  const isDedicated =
    pathname?.startsWith('/school-finder') ||
    pathname?.startsWith('/schoolsearch') ||
    pathname?.startsWith('/school-template');
  const isHomePage = pathname === '/' || pathname === '';

  if (isAdmin || isDedicated) {
    return <div className="min-h-screen flex flex-col">{children}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col w-full max-w-[100vw] print:min-h-0 print:h-auto print:block print:w-auto print:max-w-none print:overflow-visible">
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

      {/* TopBar: Normal non-sticky, scrolls away naturally */}
      <div className="print:hidden relative z-[9999]">
        <TopBar />
      </div>

      {/* Navbar Container: Sticky at top-0 */}
      <div className="print:hidden sticky top-0 z-[500] w-full bg-white">
        <Navbar />
      </div>
      <OfferPopup />
      <UserProfileModal />

      <DisabledRouteGuard>
        <main className="flex-1 min-w-0 w-full [overflow-x:clip] print:overflow-visible print:min-h-0 print:h-auto print:block">{children}</main>
      </DisabledRouteGuard>

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
