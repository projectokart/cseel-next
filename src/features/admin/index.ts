/**
 * Feature: Admin (Role-Based Admin Management Control System)
 * Subdomain-ready, decoupled RBAC architecture for CSEEL platform
 */

export * from './types';
export * from './data';
export * from './contexts/AdminAuthContext';
export { default as AdminLayout } from './components/AdminLayout';
export { default as AdminHeader } from './components/AdminHeader';
export { default as AdminSidebar } from './components/AdminSidebar';
export { default as AdminLoginScreen } from './components/AdminLoginScreen';
