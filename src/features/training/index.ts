/**
 * Training & Capacity Building Service
 * Subdomain: training.cseel.org
 * Database: training_db
 */

export * from './config/moduleConfig';
export * from './types';
export * from './db/trainingRepository';
export * from './api/trainingApiClient';
export { default as TrainingAdminDashboard } from './components/admin/TrainingAdminDashboard';
