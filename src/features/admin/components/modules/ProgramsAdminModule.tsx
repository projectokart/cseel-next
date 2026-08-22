'use client';

import React from 'react';
import { TrainingAdminDashboard } from '@/features/training';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { ShieldAlert } from 'lucide-react';

export const ProgramsAdminModule: React.FC = () => {
  const { addAuditLog, hasAccess, currentRole } = useAdminAuth();

  if (!hasAccess('programs_events')) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-red-200 space-y-3">
        <ShieldAlert className="w-12 h-12 text-red-500 mx-auto" />
        <h3 className="text-base font-black text-slate-900">
          Access Restricted: Training & Programs Governance
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Your current administrative role (<code className="font-bold text-red-600">{currentRole}</code>) does not have authorization to manage teacher training cohorts and certifications.
        </p>
      </div>
    );
  }

  return (
    <TrainingAdminDashboard
      onAuditLog={(action, module, details) => addAuditLog(action, 'programs_events', details)}
    />
  );
};

export default ProgramsAdminModule;
