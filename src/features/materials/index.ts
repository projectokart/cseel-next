/**
 * Feature: Lab Materials & STEM Hardware Kits Engine (Decoupled Module)
 * 
 * Standalone & Subdomain Ready (material.cseel.org)
 * Pluggable Database Repository Layer
 */

// Config
export * from './config/moduleConfig';

// Types
export * from './types/materialTypes';

// Database & Repository
export * from './db/materialsRepository';
export * from './db/seedData';

// API Client & Services
export * from './api/materialsApiClient';
export * from './services/importExportService';

// Admin Components
export { default as MaterialsAdminDashboard } from './components/admin/MaterialsAdminDashboard';
export { default as CompactAdminProductCard } from './components/admin/CompactAdminProductCard';
export { default as MaterialFormModal } from './components/admin/MaterialFormModal';
export { default as MaterialImportModal } from './components/admin/MaterialImportModal';
export { default as DeleteConfirmModal } from './components/admin/DeleteConfirmModal';

// Storefront Components
export { default as MaterialsStorefront } from './components/store/MaterialsStorefront';
export { default as MaterialCard } from './components/store/MaterialCard';
export { default as CartDrawer } from './components/store/CartDrawer';
export { default as OrderTrackingModal } from './components/store/OrderTrackingModal';
export { default as PincodeDeliveryChecker } from './components/store/PincodeDeliveryChecker';

// Legacy compatibility export
export { default as ShareButton } from '@/components/shared/ShareButton';
