'use client';

import React from 'react';
import ParentDashboardClient from '@/app/dashboard/parent/ParentDashboardClient';
import parentLayoutConfig from './layout.config';

/**
 * ParentDashboard Isolated Module
 * Follows isolated folder structure:
 * src/dashboards/ParentDashboard/
 *   ├── index.tsx
 *   └── layout.config.ts
 */
export default function ParentDashboard() {
  return <ParentDashboardClient />;
}

export { parentLayoutConfig };
