/**
 * Training & Programs Service Configuration
 * Subdomain: training.cseel.org
 * Database: training_db
 */

export const TRAINING_MODULE_CONFIG = {
  moduleId: 'training-programs-service',
  version: '2.0.0',
  name: 'CSEEL Teacher Training & Capacity Building Service',
  subdomainUrl: process.env.NEXT_PUBLIC_TRAINING_SUBDOMAIN || 'https://training.cseel.org',
  apiBaseUrl: process.env.NEXT_PUBLIC_TRAINING_API_URL || '/api/training',
  databaseUrl: process.env.TRAINING_DB_URL || '',
  isSubdomainEnabled: Boolean(process.env.NEXT_PUBLIC_TRAINING_SUBDOMAIN),
};
