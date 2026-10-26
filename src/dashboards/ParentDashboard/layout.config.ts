import {
  Users,
  FlaskConical,
  Award,
  Settings
} from 'lucide-react';

export const parentLayoutConfig = {
  id: 'parent',
  title: 'Parent Observation & Progress Portal',
  portalBadge: 'Child: Aarav Sharma',
  badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
  searchPlaceholder: "Search Aarav's lab practicals, scores, faculty feedback...",
  roleIcon: 'parent' as const,
  primaryRailItems: [
    { id: 'overview', label: 'Parent Overview', icon: Users, badge: 'Live' },
    { id: 'experiments', label: 'Lab Practicals', icon: FlaskConical, badge: '6 Done' },
    { id: 'reports', label: 'Performance Cards', icon: Award, badge: 'Grade A+' }
  ],
  secondaryRailTitle: 'Parent Portal',
  shortcuts: [
    { key: 'Ctrl+B', description: 'Toggle collapsible sub-sidebar' }
  ]
};

export default parentLayoutConfig;
