import React from 'react';
import Layout from '@/components/layout/Layout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Indian School Robotics & Experiential Learning Directory | Knowledge Hub',
  description: 'Verified public directory and encyclopedia of robotics, STEM, and experiential learning companies for schools across India.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function CompaniesDirectoryLayout({ children }: { children: React.ReactNode }) {
  return <Layout>{children}</Layout>;
}
