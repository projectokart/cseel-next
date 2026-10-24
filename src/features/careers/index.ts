/**
 * Careers & Talent Acquisition Service (Teaching Jobs & Faculty Placement)
 * Subdomain: careers.cseel.org
 * Database: hr_db
 */

export * from './config/moduleConfig';
export * from './types';
export * from './db/careersRepository';
export * from './data/careersData';
export * from './hooks/useCareersFilter';
export * from './api/careersApiClient';

// Public UI Components
export { default as JobCard } from './components/JobCard';
export { default as JobsFilterBar } from './components/JobsFilterBar';

// Admin
export { default as CareersAdminDashboard } from './components/admin/CareersAdminDashboard';
