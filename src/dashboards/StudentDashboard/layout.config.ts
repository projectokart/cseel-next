import {
  FlaskConical,
  Play,
  FileText,
  Award,
  Settings
} from 'lucide-react';

export const studentLayoutConfig = {
  id: 'student',
  title: 'Student Experimental Science Lab',
  portalBadge: 'Class 12 - Senior Secondary (PCM)',
  badgeColor: 'bg-purple-50 text-purple-800 border-purple-200',
  searchPlaceholder: 'Search experiments, simulations, lab submissions, certificates...',
  roleIcon: 'student' as const,
  primaryRailItems: [
    { id: 'my-experiments', label: 'My Experiments', icon: FlaskConical, badge: 'Live' },
    { id: 'simulations', label: 'Interactive Simulations', icon: Play, badge: 'CBSE' },
    { id: 'submissions', label: 'Lab Submissions', icon: FileText, badge: 'NEP' },
    { id: 'certificates', label: 'NEP Certifications', icon: Award, badge: 'Verified' }
  ],
  secondaryRailTitle: 'Science Lab Workspace',
  shortcuts: [
    { key: 'Ctrl+B', description: 'Toggle collapsible sub-sidebar' }
  ]
};

export default studentLayoutConfig;
