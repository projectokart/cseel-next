'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import TopBar from "./TopBar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AnnouncementBar from "./AnnouncementBar";
import OfferPopup from "@/components/offers/OfferPopup";

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
    <div className="min-h-screen flex flex-col">
      {/* On non-home pages, Universal Admin Bar handles in-place live editing */}
      {!isHomePage && <UniversalAdminBar />}

      <TopBar />
      <OfferPopup />
      <Navbar />
      <DisabledRouteGuard>
        <main className="flex-1">{children}</main>
      </DisabledRouteGuard>
      <Footer />
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
