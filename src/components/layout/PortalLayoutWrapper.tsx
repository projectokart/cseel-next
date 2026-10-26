'use client';

import React from 'react';
import PortalGlobalHeader from './PortalGlobalHeader';

interface PortalLayoutWrapperProps {
  portalName?: string;
  portalBadge?: string;
  badgeColor?: string;
  searchPlaceholder?: string;
  isLoading?: boolean;
  children: React.ReactNode;
}

export default function PortalLayoutWrapper({
  portalName,
  portalBadge,
  badgeColor,
  searchPlaceholder,
  isLoading = false,
  children
}: PortalLayoutWrapperProps) {
  return (
    <div className="h-screen max-h-screen overflow-hidden bg-[#f8fafd] flex flex-col font-sans text-[#202124] select-none text-xs">
      {/* Top Blue Loading Progress Bar */}
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-[2px] bg-blue-100 z-[9999] overflow-hidden">
          <div className="h-full bg-[#1a73e8] animate-pulse w-full" />
        </div>
      )}

      {/* 100% Reused Global Top Header */}
      <PortalGlobalHeader
        portalName={portalName}
        portalBadge={portalBadge}
        badgeColor={badgeColor}
        searchPlaceholder={searchPlaceholder}
      />

      {/* Dynamic Module Layout Injection Slot */}
      <div className="flex-1 flex overflow-hidden min-h-0 relative">
        {children}
      </div>
    </div>
  );
}
