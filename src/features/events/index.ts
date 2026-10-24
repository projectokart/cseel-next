/**
 * Events & Outreach Service
 * Subdomain: events.cseel.org
 * Database: events_db
 */

export * from './config/moduleConfig';
export * from './types';
export * from './db/eventsRepository';
export * from './data/eventsData';
export * from './hooks/useEventsFilter';
export * from './api/eventsApiClient';

// Public UI Components
export { default as EventCard } from './components/EventCard';
export { default as EventsFilterBar } from './components/EventsFilterBar';
export { default as EventsHeroSlider } from './components/EventsHeroSlider';

// Admin
export { default as EventsAdminDashboard } from './components/admin/EventsAdminDashboard';

// Legacy compatibility exports
export { default as ShareButton } from '@/components/shared/ShareButton';
