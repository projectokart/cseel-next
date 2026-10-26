'use client';

import React from 'react';
import Header, { HeaderProps } from './Header';
import { PanelLeft } from 'lucide-react';
import './SharedTheme.css';

export interface LayoutWrapperProps {
  portalName?: string;
  portalBadge?: string;
  badgeColor?: string;
  searchPlaceholder?: string;
  roleIcon?: HeaderProps['roleIcon'];
  isLoading?: boolean;
  customLeftContent?: React.ReactNode;
  children: React.ReactNode;
}

export function LayoutWrapper({
  portalName,
  portalBadge,
  badgeColor,
  searchPlaceholder,
  roleIcon,
  isLoading = false,
  customLeftContent,
  children
}: LayoutWrapperProps) {
  return (
    <div className="h-screen max-h-screen overflow-hidden bg-[#f8fafd] flex flex-col font-sans text-[#202124] select-none text-xs portal-root">
      {/* Top Blue Loading Progress Bar */}
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-[2px] bg-blue-100 z-[9999] overflow-hidden">
          <div className="h-full bg-[#1a73e8] animate-pulse w-full" />
        </div>
      )}

      {/* 100% Reused Global Header */}
      <Header
        portalName={portalName}
        portalBadge={portalBadge}
        badgeColor={badgeColor}
        searchPlaceholder={searchPlaceholder}
        roleIcon={roleIcon}
        customLeftContent={customLeftContent}
      />

      {/* Dynamic Module Layout Injection Slot */}
      <div className="flex-1 flex overflow-hidden min-h-0 relative">
        {children}
      </div>
    </div>
  );
}

export interface ContentSubHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: string;
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
  actions?: React.ReactNode;
}

export function ContentSubHeader({
  title,
  subtitle,
  badge,
  badgeColor = 'bg-blue-50 text-blue-800 border-blue-200',
  isSidebarOpen = true,
  onToggleSidebar,
  actions
}: ContentSubHeaderProps) {
  return (
    <div className="portal-subheader">
      <div className="flex items-center gap-2.5 min-w-0">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className={`portal-toggle-btn ${
              isSidebarOpen ? 'portal-toggle-btn-active' : 'portal-toggle-btn-inactive'
            }`}
            title={isSidebarOpen ? 'Collapse sidebar (Ctrl+B)' : 'Expand sidebar (Ctrl+B)'}
          >
            <PanelLeft className="portal-toggle-icon" />
          </button>
        )}
        <div className="truncate">
          <div className="flex items-center gap-2">
            <h1 className="portal-subheader-title truncate">{title}</h1>
            {badge && (
              <span className={`portal-subheader-badge ${badgeColor}`}>
                {badge}
              </span>
            )}
          </div>
          {subtitle && <p className="portal-subheader-subtitle truncate">{subtitle}</p>}
        </div>
      </div>

      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}

export default LayoutWrapper;
