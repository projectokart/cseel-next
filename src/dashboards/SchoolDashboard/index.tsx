'use client';

import React from 'react';
import SchoolDashboardClient from '@/app/dashboard/school/SchoolDashboardClient';
import schoolLayoutConfig from './layout.config';

/**
 * SchoolDashboard Isolated Module
 * Follows isolated folder structure:
 * src/dashboards/SchoolDashboard/
 *   ├── index.tsx
 *   └── layout.config.ts
 */
export default function SchoolDashboard() {
  return <SchoolDashboardClient />;
}

export { schoolLayoutConfig };
