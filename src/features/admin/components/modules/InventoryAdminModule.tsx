'use client';

import React from 'react';
import { MaterialsAdminDashboard } from '@/features/materials';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { ShieldAlert } from 'lucide-react';

export const InventoryAdminModule: React.FC = () => {
  const { addAuditLog, hasAccess, currentRole } = useAdminAuth();

  // Role Access Guard: Only super_admin or inventory_manager can access
  if (!hasAccess('inventory_materials')) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-red-200 dark:border-red-900/40 space-y-3">
        <ShieldAlert className="w-12 h-12 text-red-500 mx-auto" />
        <h3 className="text-base font-black text-slate-900 dark:text-white">
          Access Restricted: Inventory & Materials Desk
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Your current administrative role (<code className="font-bold text-red-600">{currentRole}</code>) does not have authorization to manage lab equipment catalog and supply chain orders.
        </p>
      </div>
    );
  }

  return (
    <MaterialsAdminDashboard
      onAuditLog={(action, module, details) => addAuditLog(action, module as any, details)}
    />
  );
};

export default InventoryAdminModule;
