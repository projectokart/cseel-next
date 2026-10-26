import type { Metadata } from 'next';
import ManageJobsClient from './Client';

export const metadata: Metadata = {
  title: 'School Vacancy Dashboard & Job Manager | CSEEL EduNetwork',
  description: 'Manage school job postings, activate 15-day listings, clone vacancies, and add role-based templates for teaching and non-teaching positions.',
};

export default function ManageJobsPage() {
  return <ManageJobsClient />;
}
