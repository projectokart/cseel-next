'use client';

import React from 'react';
import TeacherDashboardClient from '@/app/dashboard/teacher/TeacherDashboardClient';
import teacherLayoutConfig from './layout.config';

/**
 * TeacherDashboard Isolated Module
 * Follows isolated folder structure:
 * src/dashboards/TeacherDashboard/
 *   ├── index.tsx
 *   └── layout.config.ts
 */
export default function TeacherDashboard() {
  return <TeacherDashboardClient />;
}

export { teacherLayoutConfig };
