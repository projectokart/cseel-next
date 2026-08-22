/**
 * EduNetwork & Academic Partnerships Service
 * Subdomain: network.cseel.org
 * Database: network_db
 */

export * from './config/moduleConfig';
export * from './types';
export * from './db/networkRepository';
export * from './api/networkApiClient';
export { default as EduNetworkAdminDashboard } from './components/admin/EduNetworkAdminDashboard';

// Legacy compatibility exports
export * from '@/lib/eduNetworkData';
export { default as ShareButton } from '@/components/shared/ShareButton';
