/**
 * Feature: Lab Materials & STEM Hardware Kits Engine (Decoupled Module)
 * Standalone & Subdomain Ready (material.cseel.org)
 * Pluggable Database Repository Layer
 */

// Config
export * from './config/moduleConfig';

// Types
export * from './types/materialTypes';
export * from './types';

// Database & Repository
export * from './db/materialsRepository';
export * from './db/seedData';

// API Client & Services
export * from './api/materialsApiClient';
export * from './services/importExportService';
export * from './services/quotationService';

// Hooks
export * from './hooks/useMaterialsFilter';

// Admin Components
export { default as MaterialsAdminDashboard } from './components/admin/MaterialsAdminDashboard';
export { default as CompactAdminProductCard } from './components/admin/CompactAdminProductCard';
export { default as MaterialFormModal } from './components/admin/MaterialFormModal';
export { default as MaterialImportModal } from './components/admin/MaterialImportModal';
export { default as DeleteConfirmModal } from './components/admin/DeleteConfirmModal';

// Public Catalog Components (M3 Standard)
export { default as MaterialsHeroSlider } from './components/MaterialsHeroSlider';
export { default as MaterialCard } from './components/MaterialCard';
export { default as MaterialsFilterBar } from './components/MaterialsFilterBar';
export { default as MaterialsFilterDrawer } from './components/MaterialsFilterDrawer';
export { default as RequisitionDrawer } from './components/RequisitionDrawer';
export { default as QuotationModal } from './components/QuotationModal';

// Storefront Components
export { default as MaterialsStorefront } from './components/store/MaterialsStorefront';
export { default as CartDrawer } from './components/store/CartDrawer';
export { default as OrderTrackingModal } from './components/store/OrderTrackingModal';
export { default as PincodeDeliveryChecker } from './components/store/PincodeDeliveryChecker';

// Legacy compatibility export
export { default as ShareButton } from '@/components/shared/ShareButton';
