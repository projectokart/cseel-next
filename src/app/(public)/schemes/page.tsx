import { Metadata } from 'next';
import SchemesHubClient from './Client';

export const metadata: Metadata = {
  title: 'Government Schemes & School Grants (2026): PM SHRI, NITI Aayog ATL, Samagra Shiksha | CSEEL',
  description: 'Comprehensive directory of Indian Government schemes, capital modernization grants, and lab infrastructure norms for PM SHRI, NITI Aayog ATL ₹20 Lakh, Samagra Shiksha, NEP 2020, and CBSE Skill Hubs.',
  keywords: [
    'Government School Grants',
    'PM SHRI Schools Scheme',
    'NITI Aayog ATL Grants',
    'Samagra Shiksha Abhiyan Lab',
    'NEP 2020 Lab Guidelines',
    'CBSE Skill Hub PMKVY',
    'School Lab Infrastructure Grants India'
  ],
  openGraph: {
    title: 'Government Schemes & School Grants Directory (2026) | CSEEL',
    description: 'Expert DPR preparation, GeM procurement, and turnkey STEM lab setup for PM SHRI, ATL, and Samagra Shiksha.',
    type: 'website',
  },
};

export default function SchemesHubPage() {
  return <SchemesHubClient />;
}
