'use client';

import React from 'react';
import DepartmentAdminLayout from '@/features/admin/components/DepartmentAdminLayout';
import MarketingAdminModule from '@/features/admin/components/modules/MarketingAdminModule';

export default function MarketingAdminPage() {
  return (
    <DepartmentAdminLayout
      allowedDepartment="Marketing, Advertisements & Growth Desk"
      departmentBadge="Marketing & Growth Lead"
      departmentColor="amber"
      previewStoreRoute="/"
    >
      <MarketingAdminModule />
    </DepartmentAdminLayout>
  );
}
