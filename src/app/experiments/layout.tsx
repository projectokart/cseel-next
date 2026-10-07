import type { Metadata } from 'next';
import Layout from '@/components/layout/Layout';

export const metadata: Metadata = {
  title: 'Experiment Lab Guide | CSEEL Hands-On Science',
  description: 'Interactive step-by-step experiment instructions, scientific theory, required materials, and lab manuals aligned with NEP 2020.',
};

export default function ExperimentsLayout({ children }: { children: React.ReactNode }) {
  return <Layout>{children}</Layout>;
}
