/**
 * Support & Helpdesk Service Configuration
 * Subdomain: support.cseel.org
 * Database: tickets_db
 */

export const SUPPORT_MODULE_CONFIG = {
  moduleId: 'support-helpdesk-service',
  version: '2.0.0',
  name: 'CSEEL Institutional Support & Helpdesk Service',
  subdomainUrl: process.env.NEXT_PUBLIC_SUPPORT_SUBDOMAIN || 'https://support.cseel.org',
  apiBaseUrl: process.env.NEXT_PUBLIC_SUPPORT_API_URL || '/api/support',
  databaseUrl: process.env.TICKETS_DB_URL || '',
  isSubdomainEnabled: Boolean(process.env.NEXT_PUBLIC_SUPPORT_SUBDOMAIN),
};
