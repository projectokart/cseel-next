import type { Metadata } from 'next';
import CreateSchoolProfileClient from '@/components/edu-network/CreateSchoolProfileClient';

export const metadata: Metadata = {
  title: 'Create Verified School Profile | CSEEL EduNetwork',
  description: 'Onboard your school to CSEEL EduNetwork with verified UDISE code, STEM Live Labs, Class 10/12 results, and fee matrix.',
};

export default function CreateSchoolProfilePage() {
  return <CreateSchoolProfileClient />;
}
