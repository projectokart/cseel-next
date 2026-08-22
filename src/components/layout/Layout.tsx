'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import TopBar from "./TopBar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AnnouncementBar from "./AnnouncementBar";
import OfferPopup from "@/components/offers/OfferPopup";

import { NavigationProvider } from '@/contexts/NavigationContext';
import DisabledRouteGuard from './DisabledRouteGuard';

interface LayoutProps {
  children: React.ReactNode;
}

const LayoutContent = ({ children }: LayoutProps) => {
  const pathname = usePathname();
  const isAdmin = pathname?.includes('/admin') || pathname?.startsWith('/admin') || pathname?.includes('/system-admin-portal');

  if (isAdmin) {
    return <div className="min-h-screen flex flex-col">{children}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
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
      <LayoutContent>{children}</LayoutContent>
    </NavigationProvider>
  );
};

export default Layout;

