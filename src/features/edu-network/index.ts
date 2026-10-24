/**
 * EduNetwork & Academic Partnerships Service (School Directory)
 * Subdomain: network.cseel.org
 * Database: network_db
 */

export * from './config/moduleConfig';
export * from './types';
export * from './db/networkRepository';
export * from './data/schoolsData';
export * from './hooks/useSchoolsFilter';
export * from './api/networkApiClient';
export * from './api/udiseMasterService';
export * from './utils/fuzzySearch';

// Public UI Components
export { default as SchoolCard } from './components/SchoolCard';
export { default as SchoolsFilterBar } from './components/SchoolsFilterBar';

// Admin
export { default as EduNetworkAdminDashboard } from './components/admin/EduNetworkAdminDashboard';

// Legacy compatibility exports
export * from '@/lib/eduNetworkData';
export { default as ShareButton } from '@/components/shared/ShareButton';
