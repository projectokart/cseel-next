import React from 'react';
import { Metadata } from 'next';
import DashboardSchoolProfileClient from './DashboardSchoolProfileClient';

export const metadata: Metadata = {
  title: 'Manage School Profile | CSEEL Dashboard',
  description: 'Edit and manage your verified school profile on CSEEL.',
  robots: { index: false, follow: false },
};

export default function DashboardSchoolProfilePage() {
  return <DashboardSchoolProfileClient />;
}
