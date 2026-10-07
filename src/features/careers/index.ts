/**
 * Careers & Talent Acquisition Service
 * Subdomain: careers.cseel.org
 * Database: hr_db
 */

export * from './config/moduleConfig';
export * from './types';
export * from './db/careersRepository';
export * from './api/careersApiClient';
export { default as CareersAdminDashboard } from './components/admin/CareersAdminDashboard';
