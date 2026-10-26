'use client';

import React from 'react';
import StudentDashboardClient from '@/app/dashboard/student/StudentDashboardClient';
import studentLayoutConfig from './layout.config';

/**
 * StudentDashboard Isolated Module
 * Follows isolated folder structure:
 * src/dashboards/StudentDashboard/
 *   ├── index.tsx
 *   └── layout.config.ts
 */
export default function StudentDashboard() {
  return <StudentDashboardClient />;
}

export { studentLayoutConfig };
