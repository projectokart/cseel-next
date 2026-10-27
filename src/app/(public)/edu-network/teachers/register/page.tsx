import { Metadata } from 'next';
import RegisterClient from './RegisterClient';

export const metadata: Metadata = {
  title: 'Register as Verified STEM Faculty | CSEEL EduNetwork',
  description: 'Join India\'s premier network of verified CBSE & ICSE educators. List your credentials as PGT, TGT, PRT, or Lab In-Charge to connect with top schools.',
  alternates: {
    canonical: 'https://www.cseel.org/edu-network/teachers/register',
  },
};

export default function RegisterFacultyPage() {
  return <RegisterClient />;
}
