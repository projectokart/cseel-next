/**
 * Support & Helpdesk Service
 * Subdomain: support.cseel.org
 * Database: tickets_db
 */

export * from './config/moduleConfig';
export * from './types';
export * from './db/supportRepository';
export * from './api/supportApiClient';
export { default as SupportAdminDashboard } from './components/admin/SupportAdminDashboard';
