import {
  GraduationCap,
  Briefcase,
  FileText,
  Award,
  Sparkles,
  Settings
} from 'lucide-react';

export const teacherLayoutConfig = {
  id: 'teacher',
  title: 'Faculty Career & CV Desk',
  portalBadge: 'Verified PGT Faculty',
  badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  searchPlaceholder: 'Search teaching jobs, lab roles, CBSE vacancies...',
  roleIcon: 'teacher' as const,
  primaryRailItems: [
    { id: 'resume-builder', label: 'CV Builder', icon: FileText, badge: 'Active' },
    { id: 'credentials', label: 'Credentials Vault', icon: Award, badge: 'CTET' },
    { id: 'preview-cv', label: 'Live CV Preview', icon: Sparkles, badge: 'ATS' },
    { id: 'matched-jobs', label: 'Institutional Matches', icon: Briefcase, badge: '14' }
  ],
  secondaryRailTitle: 'Faculty Career Desk',
  shortcuts: [
    { key: 'Ctrl+B', description: 'Toggle collapsible sub-sidebar' }
  ]
};

export default teacherLayoutConfig;
