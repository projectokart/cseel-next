import { Metadata } from 'next';
import AtlMasterClient from './Client';

export const metadata: Metadata = {
  title: 'Atal Tinkering Lab (ATL 2.0) Setup: NITI Aayog Guidelines, Packages & Equipment | CSEEL',
  description: 'Complete master guide for NITI Aayog Atal Tinkering Lab (ATL) setup. Official Package 1-4 equipment lists for 60 & 90 students, 1,500 sq ft room blueprint, ₹20 Lakh grant tranches, and GeM procurement.',
  keywords: [
    'Atal Tinkering Lab',
    'ATL Setup Guide',
    'NITI Aayog ATL',
    'ATL Equipment List 60 students',
    'ATL Equipment List 90 students',
    'ATL 20 Lakh Grant',
    'Package 1 2 3 4 ATL',
    'CSEEL Tinkering Labs'
  ],
  openGraph: {
    title: 'Atal Tinkering Lab (ATL 2.0) Master Setup Guide | CSEEL',
    description: 'NITI Aayog compliant turnkey ATL setup with Package 1-4, 3D printers, robotics, and teacher training.',
    type: 'article',
    images: ['/images/categories/technology.jpg']
  }
};

export default function AtlMasterPage() {
  return <AtlMasterClient subslug="overview" />;
}
