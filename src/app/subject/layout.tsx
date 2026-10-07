import type { Metadata } from 'next';
import Layout from '@/components/layout/Layout';

export const metadata: Metadata = {
  title: 'STEAM Subjects & Guided Labs | CSEEL Experiential Science',
  description: 'Explore interactive hands-on science activities, practical lab kits, and curriculum-aligned STEM experiments for CBSE & ICSE across Chemistry, Physics, Biology, Math, and Engineering.',
};

export default function SubjectLayout({ children }: { children: React.ReactNode }) {
  return <Layout>{children}</Layout>;
}
