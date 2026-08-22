'use client';

import React from 'react';
import { EventsAdminDashboard } from '@/features/events';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { ShieldAlert } from 'lucide-react';

export const RndAdminModule: React.FC = () => {
  const { addAuditLog, hasAccess, currentRole } = useAdminAuth();

  if (!hasAccess('research_rnd')) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-red-200 space-y-3">
        <ShieldAlert className="w-12 h-12 text-red-500 mx-auto" />
        <h3 className="text-base font-black text-slate-900">
          Access Restricted: Events & Outreach Desk
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Your current administrative role (<code className="font-bold text-red-600">{currentRole}</code>) does not have authorization to manage national symposia, webinars, and outreach hackathons.
        </p>
      </div>
    );
  }

  return (
    <EventsAdminDashboard
      onAuditLog={(action, module, details) => addAuditLog(action, 'research_rnd', details)}
    />
  );
};

export default RndAdminModule;
