import { AdminRole, AdminRoleConfig, AdminUser, AuditLogItem, AdminModuleId } from './types';

export const ADMIN_ROLE_CONFIGS: Record<AdminRole, AdminRoleConfig> = {
  super_admin: {
    role: 'super_admin',
    title: 'Super Administrator',
    department: 'Executive Leadership & Governance',
    color: 'emerald',
    badgeBg: 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300',
    badgeText: 'Full System Access',
    allowedModules: [
      'overview',
      'admin_management',
      'hr_careers',
      'schools_institutions',
      'teaching_recruitment',
      'science_simulations',
      'projectokart_inventions',
      'inventory_materials',
      'programs_events',
      'research_rnd',
      'content_homepage',
      'audit_logs',
    ],
    description: 'Unrestricted control over all company settings, admin team rosters, financial metrics, and core infrastructure.',
  },
  hr_admin: {
    role: 'hr_admin',
    title: 'HR & Talent Acquisition Lead',
    department: 'Human Resources',
    color: 'rose',
    badgeBg: 'bg-rose-500/20 border-rose-400/40 text-rose-300',
    badgeText: 'HR & Careers',
    allowedModules: ['overview', 'hr_careers'],
    description: 'Manages CSEEL company career vacancies, job applicant pipelines, interview scheduling, and hiring decisions.',
  },
  school_admin: {
    role: 'school_admin',
    title: 'Institutional Network Administrator',
    department: 'School & University Relations',
    color: 'blue',
    badgeBg: 'bg-blue-500/20 border-blue-400/40 text-blue-300',
    badgeText: 'Schools & Institutes',
    allowedModules: ['overview', 'schools_institutions'],
    description: 'Onboards schools, verifies STEM laboratory facilities, audits fee structures, and approves institute KYC profiles.',
  },
  recruitment_admin: {
    role: 'recruitment_admin',
    title: 'Faculty Recruitment Specialist',
    department: 'Teacher & Staffing Operations',
    color: 'purple',
    badgeBg: 'bg-purple-500/20 border-purple-400/40 text-purple-300',
    badgeText: 'Faculty Recruitment',
    allowedModules: ['overview', 'teaching_recruitment'],
    description: 'Manages school teaching vacancies, verifies educator degrees, and oversees 72-hour flash job seeker activations.',
  },
  science_admin: {
    role: 'science_admin',
    title: 'Virtual Lab & Simulation Lead',
    department: 'Academic Science Team',
    color: 'cyan',
    badgeBg: 'bg-cyan-500/20 border-cyan-400/40 text-cyan-300',
    badgeText: 'Virtual Labs & Simulations',
    allowedModules: ['overview', 'science_simulations'],
    description: 'Configures interactive physics/chemistry/biology simulations, apparatus variables, and NEP-2020 lab practical manuals.',
  },
  projectokart_admin: {
    role: 'projectokart_admin',
    title: 'Projectokart Inventions Manager',
    department: 'Hardware Projects & Fairs',
    color: 'amber',
    badgeBg: 'bg-amber-500/20 border-amber-400/40 text-amber-300',
    badgeText: 'Projectokart Hardware',
    allowedModules: ['overview', 'projectokart_inventions'],
    description: 'Curates science fair hardware kits, BOM lists, downloadable circuit diagrams, CAD schematics, and student awards.',
  },
  inventory_admin: {
    role: 'inventory_admin',
    title: 'Lab Materials & Supply Chain Lead',
    department: 'Inventory & Procurement',
    color: 'teal',
    badgeBg: 'bg-teal-500/20 border-teal-400/40 text-teal-300',
    badgeText: 'Lab Materials & Stock',
    allowedModules: ['overview', 'inventory_materials'],
    description: 'Oversees STEM lab inventory, wholesale pricing, equipment specifications, stock alerts, and bulk school orders.',
  },
  programs_admin: {
    role: 'programs_admin',
    title: 'Conclaves, Seminars & Events Head',
    department: 'Outreach & Events',
    color: 'indigo',
    badgeBg: 'bg-indigo-500/20 border-indigo-400/40 text-indigo-300',
    badgeText: 'Programs & Seminars',
    allowedModules: ['overview', 'programs_events'],
    description: 'Organizes national science conclaves, live webinars, teacher training bootcamps, and student exhibitions.',
  },
  rnd_admin: {
    role: 'rnd_admin',
    title: 'R&D & Research Director',
    department: 'Research & Future Technologies',
    color: 'violet',
    badgeBg: 'bg-violet-500/20 border-violet-400/40 text-violet-300',
    badgeText: 'R&D Innovation Labs',
    allowedModules: ['overview', 'research_rnd', 'science_simulations', 'projectokart_inventions'],
    description: 'Drives new experimental pedagogical designs, published research whitepapers, and patent-pending ATL tech prototypes.',
  },
  content_admin: {
    role: 'content_admin',
    title: 'Web Platform & Content Editor',
    department: 'Media, Blog & Web Communications',
    color: 'sky',
    badgeBg: 'bg-sky-500/20 border-sky-400/40 text-sky-300',
    badgeText: 'Homepage CMS & Media',
    allowedModules: ['overview', 'content_homepage'],
    description: 'Controls homepage announcements, hero promotional banners, science articles, blog publishing, and FAQs.',
  },
};

export const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: 'adm-1',
    name: 'Dr. Vikram Sharma',
    email: 'superadmin@cseel.org',
    password: 'SuperAdmin@2026#CSEEL',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop',
    role: 'super_admin',
    department: 'Executive Board',
    assignedModules: ADMIN_ROLE_CONFIGS.super_admin.allowedModules,
    lastLogin: 'Just now (Active)',
    status: 'active',
  },
  {
    id: 'adm-2',
    name: 'Pooja Kashyap',
    email: 'hr.careers@cseel.org',
    password: 'HrCareers@2026#CSEEL',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop',
    role: 'hr_admin',
    department: 'Human Resources',
    assignedModules: ADMIN_ROLE_CONFIGS.hr_admin.allowedModules,
    lastLogin: '10 mins ago',
    status: 'active',
  },
  {
    id: 'adm-3',
    name: 'Col. Rajesh Menon (Retd.)',
    email: 'schools.admin@cseel.org',
    password: 'SchoolAdmin@2026#CSEEL',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop',
    role: 'school_admin',
    department: 'Institutional Relations',
    assignedModules: ADMIN_ROLE_CONFIGS.school_admin.allowedModules,
    lastLogin: '25 mins ago',
    status: 'active',
  },
  {
    id: 'adm-4',
    name: 'Dr. Anita Roy',
    email: 'recruitment.jobs@cseel.org',
    password: 'RecruitAdmin@2026#CSEEL',
    avatar: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=150&auto=format&fit=crop',
    role: 'recruitment_admin',
    department: 'Faculty Operations',
    assignedModules: ADMIN_ROLE_CONFIGS.recruitment_admin.allowedModules,
    lastLogin: '1 hour ago',
    status: 'active',
  },
  {
    id: 'adm-5',
    name: 'Prof. S. N. Bose',
    email: 'science.labs@cseel.org',
    password: 'ScienceLab@2026#CSEEL',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop',
    role: 'science_admin',
    department: 'Virtual Labs & Physics Lab',
    assignedModules: ADMIN_ROLE_CONFIGS.science_admin.allowedModules,
    lastLogin: '2 hours ago',
    status: 'active',
  },
  {
    id: 'adm-6',
    name: 'Karan Mehra',
    email: 'projectokart@cseel.org',
    password: 'ProjectoKart@2026#CSEEL',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop',
    role: 'projectokart_admin',
    department: 'Projectokart Hardware Labs',
    assignedModules: ADMIN_ROLE_CONFIGS.projectokart_admin.allowedModules,
    lastLogin: '3 hours ago',
    status: 'active',
  },
  {
    id: 'adm-7',
    name: 'Sunil Aggarwal',
    email: 'inventory.stock@cseel.org',
    password: 'InventoryStock@2026#CSEEL',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop',
    role: 'inventory_admin',
    department: 'Inventory & Procurement',
    assignedModules: ADMIN_ROLE_CONFIGS.inventory_admin.allowedModules,
    lastLogin: '4 hours ago',
    status: 'active',
  },
  {
    id: 'adm-8',
    name: 'Ritu Sen',
    email: 'events.seminars@cseel.org',
    password: 'ProgramsEvent@2026#CSEEL',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop',
    role: 'programs_admin',
    department: 'Conclaves & Seminars',
    assignedModules: ADMIN_ROLE_CONFIGS.programs_admin.allowedModules,
    lastLogin: '5 hours ago',
    status: 'active',
  },
  {
    id: 'adm-9',
    name: 'Dr. Harshvardhan Joshi',
    email: 'rnd.research@cseel.org',
    password: 'RndResearch@2026#CSEEL',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop',
    role: 'rnd_admin',
    department: 'R&D Innovation Labs',
    assignedModules: ADMIN_ROLE_CONFIGS.rnd_admin.allowedModules,
    lastLogin: 'Yesterday',
    status: 'active',
  },
  {
    id: 'adm-10',
    name: 'Neha Verma',
    email: 'content.web@cseel.org',
    password: 'ContentWeb@2026#CSEEL',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop',
    role: 'content_admin',
    department: 'Media & Web Content',
    assignedModules: ADMIN_ROLE_CONFIGS.content_admin.allowedModules,
    lastLogin: 'Yesterday',
    status: 'active',
  },
];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'log-1',
    timestamp: '2 mins ago',
    adminName: 'Dr. Anita Roy',
    adminRole: 'recruitment_admin',
    action: 'APPROVED_72H_FLASH',
    module: 'teaching_recruitment',
    details: 'Activated 72-hour Flash Status for Dr. R. K. Mukherjee (Physics PGT, Bengaluru).',
    ipAddress: '103.21.144.68',
  },
  {
    id: 'log-2',
    timestamp: '18 mins ago',
    adminName: 'Col. Rajesh Menon (Retd.)',
    adminRole: 'school_admin',
    action: 'VERIFIED_INSTITUTION_LABS',
    module: 'schools_institutions',
    details: 'Verified ATL & Composite Science Lab facilities for DPS International, R.K. Puram.',
    ipAddress: '122.161.49.210',
  },
  {
    id: 'log-3',
    timestamp: '45 mins ago',
    adminName: 'Pooja Kashyap',
    adminRole: 'hr_admin',
    action: 'PUBLISHED_CAREER_JOB',
    module: 'hr_careers',
    details: 'Posted internal opening "Senior STEM Curriculum Architect" on /careers.',
    ipAddress: '182.74.88.14',
  },
  {
    id: 'log-4',
    timestamp: '2 hours ago',
    adminName: 'Karan Mehra',
    adminRole: 'projectokart_admin',
    action: 'UPDATED_PROJECT_CAD',
    module: 'projectokart_inventions',
    details: 'Uploaded updated Gerber and 3D STL CAD files for Solar Dual-Axis Sun Tracker Kit.',
    ipAddress: '49.36.120.95',
  },
  {
    id: 'log-5',
    timestamp: '4 hours ago',
    adminName: 'Dr. Vikram Sharma',
    adminRole: 'super_admin',
    action: 'SYSTEM_SETTINGS_UPDATE',
    module: 'admin_management',
    details: 'Updated global SEO Canonical and Sitemap auto-indexing interval to 24 Hours.',
    ipAddress: '115.240.90.12',
  },
];

export function canAccessModule(role: AdminRole, moduleId: AdminModuleId): boolean {
  const config = ADMIN_ROLE_CONFIGS[role];
  if (!config) return false;
  return config.allowedModules.includes(moduleId);
}

/**
 * Generate CSV Content for Excel download
 */
export function generateAdminCredentialsCSV(): string {
  const headers = ['Admin Name', 'Role Identifier', 'Role Title', 'Department', 'Login Email', 'Login Password', 'Permitted Modules', 'Portal Path'];
  const rows = INITIAL_ADMIN_USERS.map((user) => {
    const cfg = ADMIN_ROLE_CONFIGS[user.role];
    return [
      `"${user.name}"`,
      `"${user.role}"`,
      `"${cfg.title}"`,
      `"${user.department}"`,
      `"${user.email}"`,
      `"${user.password || ''}"`,
      `"${cfg.allowedModules.join('; ')}"`,
      `"/admin"`,
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\r\n');
}

/**
 * Trigger client-side direct CSV/Excel file download
 */
export function downloadAdminCredentialsCSVFile() {
  const csvContent = generateAdminCredentialsCSV();
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `CSEEL_Admin_Credentials_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
