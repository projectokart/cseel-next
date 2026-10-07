'use client';

import React from 'react';
import DepartmentAdminLayout from '@/features/admin/components/DepartmentAdminLayout';
import MarketingAdminModule from '@/features/admin/components/modules/MarketingAdminModule';

export default function MarketingAdminPage() {
  return (
    <DepartmentAdminLayout
      departmentName="Marketing, Special Offers & Growth Desk"
      departmentRole="marketing_admin"
      publicUrl="https://www.cseel.org/why-cseel"
      subdomainUrl="https://marketing.cseel.org/admin"
      schemaBadge="Marketing & Growth Lead"
    >
      <MarketingAdminModule />
    </DepartmentAdminLayout>
  );
}
