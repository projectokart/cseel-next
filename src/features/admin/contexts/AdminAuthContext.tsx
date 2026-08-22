'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminRole, AdminModuleId, AdminUser, AuditLogItem } from '../types';
import { ADMIN_ROLE_CONFIGS, INITIAL_ADMIN_USERS, INITIAL_AUDIT_LOGS, canAccessModule } from '../data';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  currentAdmin: AdminUser;
  currentRole: AdminRole;
  activeModule: AdminModuleId;
  adminUsers: AdminUser[];
  auditLogs: AuditLogItem[];
  login: (email: string, pass: string) => LoginResult;
  logout: () => void;
  quickDemoLogin: (role: AdminRole) => void;
  switchRole: (role: AdminRole) => void;
  setActiveModule: (mod: AdminModuleId) => void;
  hasAccess: (mod: AdminModuleId) => boolean;
  addAuditLog: (action: string, module: AdminModuleId, details: string) => void;
  addNewAdminUser: (user: Omit<AdminUser, 'id' | 'lastLogin' | 'status'>) => void;
  updateAdminStatus: (id: string, status: 'active' | 'inactive') => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const DEPARTMENT_SUBDOMAIN_REDIRECTS: Record<string, string> = {
  inventory_admin: 'https://material.cseel.org/admin',
  hr_admin: 'https://careers.cseel.org/admin',
  school_admin: 'https://network.cseel.org/admin',
  recruitment_admin: 'https://careers.cseel.org/admin',
  science_admin: 'https://content.cseel.org/admin',
  projectokart_admin: 'https://material.cseel.org/admin',
  programs_admin: 'https://training.cseel.org/admin',
  events_admin: 'https://events.cseel.org/admin',
  support_admin: 'https://support.cseel.org/admin',
  content_admin: 'https://blog.cseel.org/admin',
  rnd_admin: 'https://api.cseel.org',
  super_admin: '/admin',
};

export interface LoginResult {
  success: boolean;
  error?: string;
  redirectUrl?: string;
  role?: AdminRole;
}

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(INITIAL_ADMIN_USERS);
  const [currentRole, setCurrentRole] = useState<AdminRole>('super_admin');
  const [activeModule, setActiveModule] = useState<AdminModuleId>('overview');
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Load session from storage if available
  useEffect(() => {
    try {
      const savedRole = localStorage.getItem('cseel_admin_role') as AdminRole;
      const savedAuth = localStorage.getItem('cseel_admin_auth');
      if (savedAuth === 'true' && savedRole && ADMIN_ROLE_CONFIGS[savedRole]) {
        setCurrentRole(savedRole);
        setIsAuthenticated(true);
      }
    } catch {}
  }, []);

  const currentAdmin = adminUsers.find((u) => u.role === currentRole) || adminUsers[0];

  const login = (email: string, pass: string): LoginResult => {
    const clean = email.trim().toLowerCase().replace('@cseel.org', '');
    const cleanPass = pass.trim();

    // Map common aliases
    const user = adminUsers.find((u) => {
      const uEmail = u.email.toLowerCase();
      const uRole = u.role.toLowerCase();
      return (
        uEmail === clean ||
        uEmail.startsWith(clean) ||
        uEmail === `${clean}@123` ||
        uEmail === `${clean}@cseel.org` ||
        uRole.includes(clean) ||
        (clean === 'material' && u.role === 'inventory_admin') ||
        (clean === 'materials' && u.role === 'inventory_admin') ||
        (clean === 'school' && u.role === 'school_admin') ||
        (clean === 'schools' && u.role === 'school_admin') ||
        (clean === 'super' && u.role === 'super_admin') ||
        (clean === 'admin' && u.role === 'super_admin')
      );
    });

    if (!user) {
      return { success: false, error: 'No administrator found with this username/email.' };
    }

    if (cleanPass !== 'Dev@12345' && user.password && user.password !== cleanPass) {
      return { success: false, error: 'Incorrect administrator password. Please use Dev@12345.' };
    }

    // Success
    setCurrentRole(user.role);
    setIsAuthenticated(true);
    try {
      localStorage.setItem('cseel_admin_auth', 'true');
      localStorage.setItem('cseel_admin_role', user.role);
    } catch {}

    const redirectUrl = DEPARTMENT_SUBDOMAIN_REDIRECTS[user.role] || '/admin';

    addAuditLog('ADMIN_LOGIN_SUCCESS', 'overview', `Admin ${user.name} logged into ${user.role} workspace.`);
    return { success: true, redirectUrl, role: user.role };
  };

  const quickDemoLogin = (role: AdminRole) => {
    const user = adminUsers.find((u) => u.role === role) || adminUsers[0];
    setCurrentRole(role);
    setIsAuthenticated(true);
    try {
      localStorage.setItem('cseel_admin_auth', 'true');
      localStorage.setItem('cseel_admin_role', role);
    } catch {}

    addAuditLog('DEMO_AUTH_ACCESS', 'overview', `Direct one-click access to ${role} workspace.`);
  };

  const logout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('cseel_admin_auth');
      localStorage.removeItem('cseel_admin_role');
    } catch {}
    addAuditLog('ADMIN_LOGOUT', 'overview', `Admin ${currentAdmin.name} logged out.`);
  };

  const switchRole = (role: AdminRole) => {
    setCurrentRole(role);
    try {
      localStorage.setItem('cseel_admin_role', role);
    } catch {}
    // If current active module is not allowed in new role, redirect to overview
    if (!canAccessModule(role, activeModule)) {
      setActiveModule('overview');
    }
  };

  const hasAccess = (mod: AdminModuleId): boolean => {
    return canAccessModule(currentRole, mod);
  };

  const addAuditLog = (action: string, module: AdminModuleId, details: string) => {
    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      timestamp: 'Just now',
      adminName: currentAdmin?.name || 'Administrator',
      adminRole: currentRole,
      action,
      module,
      details,
      ipAddress: '127.0.0.1',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const addNewAdminUser = (user: Omit<AdminUser, 'id' | 'lastLogin' | 'status'>) => {
    const created: AdminUser = {
      ...user,
      id: `adm-${Date.now()}`,
      lastLogin: 'Never',
      status: 'active',
    };
    setAdminUsers((prev) => [...prev, created]);
    addAuditLog('CREATED_ADMIN_USER', 'admin_management', `Added new admin ${user.name} (${user.role})`);
  };

  const updateAdminStatus = (id: string, status: 'active' | 'inactive') => {
    setAdminUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status } : u))
    );
    addAuditLog('UPDATED_ADMIN_STATUS', 'admin_management', `Changed status to ${status} for ID ${id}`);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated,
        currentAdmin,
        currentRole,
        activeModule,
        adminUsers,
        auditLogs,
        login,
        logout,
        quickDemoLogin,
        switchRole,
        setActiveModule,
        hasAccess,
        addAuditLog,
        addNewAdminUser,
        updateAdminStatus,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return ctx;
}
