export type AdminRole =
  | 'super_admin'
  | 'hr_admin'
  | 'school_admin'
  | 'recruitment_admin'
  | 'science_admin'
  | 'projectokart_admin'
  | 'inventory_admin'
  | 'programs_admin'
  | 'rnd_admin'
  | 'content_admin';

export type AdminModuleId =
  | 'overview'
  | 'hr_careers'
  | 'schools_institutions'
  | 'teaching_recruitment'
  | 'science_simulations'
  | 'projectokart_inventions'
  | 'inventory_materials'
  | 'programs_events'
  | 'research_rnd'
  | 'content_homepage'
  | 'admin_management'
  | 'audit_logs';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatar: string;
  role: AdminRole;
  department: string;
  assignedModules: AdminModuleId[];
  lastLogin: string;
  status: 'active' | 'inactive';
}

export interface AdminRoleConfig {
  role: AdminRole;
  title: string;
  department: string;
  color: string;
  badgeBg: string;
  badgeText: string;
  allowedModules: AdminModuleId[];
  description: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  adminName: string;
  adminRole: AdminRole;
  action: string;
  module: AdminModuleId;
  details: string;
  ipAddress: string;
}
