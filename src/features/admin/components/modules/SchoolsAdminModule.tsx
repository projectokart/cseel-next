'use client';

import React from 'react';
import { EduNetworkAdminDashboard } from '@/features/edu-network';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { ShieldAlert } from 'lucide-react';

export const SchoolsAdminModule: React.FC = () => {
  const { addAuditLog, hasAccess, currentRole } = useAdminAuth();

  if (!hasAccess('edu_network')) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-red-200 space-y-3">
        <ShieldAlert className="w-12 h-12 text-red-500 mx-auto" />
        <h3 className="text-base font-black text-slate-900">
          Access Restricted: EduNetwork & School Partnerships
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Your current administrative role (<code className="font-bold text-red-600">{currentRole}</code>) does not have authorization to manage partner schools and institutional affiliations.
        </p>
      </div>
    );
  }

  return (
    <EduNetworkAdminDashboard
      onAuditLog={(action, module, details) => addAuditLog(action, module as any, details)}
    />
  );
};

export default SchoolsAdminModule;
