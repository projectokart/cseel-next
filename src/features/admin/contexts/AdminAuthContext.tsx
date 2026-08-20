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
  login: (email: string, pass: string) => { success: boolean; error?: string };
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

  const login = (email: string, pass: string): { success: boolean; error?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const user = adminUsers.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      return { success: false, error: 'No administrator found with this email address.' };
    }

    if (user.password && user.password !== pass.trim()) {
      return { success: false, error: 'Incorrect administrator password. Please try again.' };
    }

    // Success
    setCurrentRole(user.role);
    setIsAuthenticated(true);
    try {
      localStorage.setItem('cseel_admin_auth', 'true');
      localStorage.setItem('cseel_admin_role', user.role);
    } catch {}

    addAuditLog('ADMIN_LOGIN_SUCCESS', 'overview', `Admin ${user.name} logged into ${user.role} workspace.`);
    return { success: true };
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
