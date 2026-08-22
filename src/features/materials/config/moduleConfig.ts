/**
 * Module Configuration: Lab Materials & STEM Kits Engine
 * 
 * Supports standalone deployment on subdomains (e.g. material.cseel.org)
 * and seamless connection to a separate external database.
 */

export const MATERIALS_MODULE_CONFIG = {
  moduleId: 'materials-kits-engine',
  version: '2.0.0',
  name: 'CSEEL Lab Materials & Hardware Kits',
  // Base API endpoint - if connecting to a separate microservice/subdomain, change via env
  apiBaseUrl: process.env.NEXT_PUBLIC_MATERIALS_API_URL || '/api/materials',
  // Standalone subdomain support (e.g., https://material.cseel.org)
  subdomainUrl: process.env.NEXT_PUBLIC_MATERIALS_SUBDOMAIN || 'https://material.cseel.org',
  isSubdomainEnabled: Boolean(process.env.NEXT_PUBLIC_MATERIALS_SUBDOMAIN),
  // Database connection string for isolated DB instances
  databaseUrl: process.env.MATERIALS_DATABASE_URL || '',
  // E-commerce defaults
  currency: 'INR',
  currencySymbol: '₹',
  defaultTaxRate: 0.18, // 18% GST for educational lab equipment
  freeDeliveryThreshold: 999, // Free shipping above ₹999
  maxProductImages: 5,
};
