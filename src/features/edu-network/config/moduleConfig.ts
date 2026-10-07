/**
 * EduNetwork & Academic Partnerships Service
 * Subdomain: network.cseel.org
 * Database: network_db
 */

export const NETWORK_MODULE_CONFIG = {
  moduleId: 'network-partnerships-service',
  version: '2.0.0',
  name: 'CSEEL EduNetwork & Institutional Partnerships',
  subdomainUrl: process.env.NEXT_PUBLIC_NETWORK_SUBDOMAIN || 'https://network.cseel.org',
  apiBaseUrl: process.env.NEXT_PUBLIC_NETWORK_API_URL || '/api/network',
  databaseUrl: process.env.NETWORK_DB_URL || '',
  isSubdomainEnabled: Boolean(process.env.NEXT_PUBLIC_NETWORK_SUBDOMAIN),
};
