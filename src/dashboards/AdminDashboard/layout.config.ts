import {
  ShieldCheck,
  Briefcase,
  School,
  GraduationCap,
  Users,
  Activity,
  Layers,
  Settings
} from 'lucide-react';

export const adminLayoutConfig = {
  id: 'admin',
  title: 'Admin Verification Console',
  portalBadge: 'Super Admin - CSEEL Directorate',
  badgeColor: 'bg-rose-50 text-rose-800 border-rose-200',
  searchPlaceholder: 'Search jobs, school affiliations, teachers, student logs...',
  roleIcon: 'admin' as const,
  primaryRailItems: [
    { id: 'jobs', label: 'Faculty & Lab Openings', icon: Briefcase, badge: 'Live' },
    { id: 'school-kyc', label: 'School Verifications', icon: School, badge: 'CBSE' },
    { id: 'teachers', label: 'Faculty Portfolios', icon: GraduationCap, badge: 'CTET' },
    { id: 'students', label: 'Student Practicals', icon: Users, badge: 'NEP' },
    { id: 'system', label: 'System Analytics', icon: Activity, badge: '99.9%' }
  ],
  secondaryRailTitle: 'Institutional Governance',
  shortcuts: [
    { key: 'Ctrl+B', description: 'Toggle collapsible sub-sidebar' }
  ]
};

export default adminLayoutConfig;
