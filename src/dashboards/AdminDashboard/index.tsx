'use client';

import React from 'react';
import AdminDashboardClient from '@/app/admin/AdminDashboardClient';
import adminLayoutConfig from './layout.config';

/**
 * AdminDashboard Isolated Module
 * Follows isolated folder structure:
 * src/dashboards/AdminDashboard/
 *   ├── index.tsx
 *   └── layout.config.ts
 */
export default function AdminDashboard() {
  return <AdminDashboardClient />;
}

export { adminLayoutConfig };
