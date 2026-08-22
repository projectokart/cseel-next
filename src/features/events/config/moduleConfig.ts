/**
 * Events & Outreach Service Configuration
 * Subdomain: events.cseel.org
 * Database: events_db
 */

export const EVENTS_MODULE_CONFIG = {
  moduleId: 'events-outreach-service',
  version: '2.0.0',
  name: 'CSEEL National Science Events & Symposia Service',
  subdomainUrl: process.env.NEXT_PUBLIC_EVENTS_SUBDOMAIN || 'https://events.cseel.org',
  apiBaseUrl: process.env.NEXT_PUBLIC_EVENTS_API_URL || '/api/events',
  databaseUrl: process.env.EVENTS_DB_URL || '',
  isSubdomainEnabled: Boolean(process.env.NEXT_PUBLIC_EVENTS_SUBDOMAIN),
};
