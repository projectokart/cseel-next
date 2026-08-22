/**
 * Careers & HR Service Configuration
 * Subdomain: careers.cseel.org
 * Database: hr_db
 */

export const CAREERS_MODULE_CONFIG = {
  moduleId: 'careers-hr-service',
  version: '2.0.0',
  name: 'CSEEL Careers & Talent Acquisition Service',
  subdomainUrl: process.env.NEXT_PUBLIC_CAREERS_SUBDOMAIN || 'https://careers.cseel.org',
  apiBaseUrl: process.env.NEXT_PUBLIC_CAREERS_API_URL || '/api/careers',
  databaseUrl: process.env.HR_DB_URL || '',
  isSubdomainEnabled: Boolean(process.env.NEXT_PUBLIC_CAREERS_SUBDOMAIN),
};
