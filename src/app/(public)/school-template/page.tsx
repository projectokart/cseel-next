import React from 'react';
import { Metadata } from 'next';
import SchoolTemplateClient from './SchoolTemplateClient';

export const metadata: Metadata = {
  title: 'School Profile Master Template & Visual Live Editor | CSEEL',
  description:
    'Interactive visual editor and live data collection blueprint for schools to list and publish on the CSEEL platform.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function SchoolTemplatePage() {
  return <SchoolTemplateClient />;
}
