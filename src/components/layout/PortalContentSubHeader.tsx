'use client';

import React from 'react';
import { PanelLeft } from 'lucide-react';

interface PortalContentSubHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: string;
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
  actions?: React.ReactNode;
}

export default function PortalContentSubHeader({
  title,
  subtitle,
  badge,
  badgeColor = 'bg-blue-50 text-blue-800 border-blue-200',
  isSidebarOpen = true,
  onToggleSidebar,
  actions,
}: PortalContentSubHeaderProps) {
  return (
    <div className="bg-white border-b border-[#dadce0] px-4 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0 sticky top-0 z-10">
      <div className="flex items-center gap-2.5 min-w-0">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className={`p-1.5 rounded-md transition-all cursor-pointer shrink-0 border border-[#dadce0] hover:bg-gray-100 ${
              isSidebarOpen ? 'bg-[#e8f0fe] text-[#1a73e8] border-[#aecbfa]' : 'text-[#5f6368] bg-white'
            }`}
            title={isSidebarOpen ? "Collapse sidebar (Ctrl+B)" : "Expand sidebar (Ctrl+B)"}
          >
            <PanelLeft className="w-4 h-4" />
          </button>
        )}
        <div className="truncate">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-semibold text-[#202124] truncate">{title}</h1>
            {badge && (
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badgeColor}`}>
                {badge}
              </span>
            )}
          </div>
          {subtitle && <p className="text-[11px] text-[#5f6368] truncate mt-0.5">{subtitle}</p>}
        </div>
      </div>

      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
