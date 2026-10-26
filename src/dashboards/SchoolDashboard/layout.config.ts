import {
  School,
  Briefcase,
  Plus,
  Users,
  Settings
} from 'lucide-react';

export const schoolLayoutConfig = {
  id: 'school',
  title: 'School Institutional Desk',
  portalBadge: 'CBSE Affiliation # 2730017',
  badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  searchPlaceholder: 'Search faculty candidates, applicant resumes, physics...',
  roleIcon: 'school' as const,
  primaryRailItems: [
    { id: 'create-job', label: 'Post Faculty Job', icon: Plus, badge: 'New' },
    { id: 'my-jobs', label: 'Active Vacancies', icon: Briefcase, badge: 'Live' },
    { id: 'school-kyc', label: 'School KYC & Profile', icon: School, badge: 'CBSE' }
  ],
  secondaryRailTitle: 'Faculty Recruitment Hub',
  shortcuts: [
    { key: 'Ctrl+B', description: 'Toggle collapsible sub-sidebar' }
  ]
};

export default schoolLayoutConfig;
