/**
 * Events & Outreach Service
 * Subdomain: events.cseel.org
 * Database: events_db
 */

export * from './config/moduleConfig';
export * from './types';
export * from './db/eventsRepository';
export * from './api/eventsApiClient';
export { default as EventsAdminDashboard } from './components/admin/EventsAdminDashboard';

// Legacy compatibility exports
export { default as ShareButton } from '@/components/shared/ShareButton';
