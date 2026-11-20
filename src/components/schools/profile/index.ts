/**
 * Active School Profile Components
 * Clean, production-grade 3-tab architecture: Overview, Admission, Result
 */

// 1. Overview Tab Sections
export { default as SchoolAboutSection } from './SchoolAboutSection';
export type { SchoolAboutSectionProps } from './SchoolAboutSection';

export { default as SchoolStatsSection } from './SchoolStatsSection';

export { default as SchoolFacilitiesSection } from './SchoolFacilitiesSection';
export type { SchoolFacilitiesSectionProps } from './SchoolFacilitiesSection';

export { default as SchoolCampusSection } from './SchoolCampusSection';
export type { SchoolCampusSectionProps } from './SchoolCampusSection';

export { default as SchoolFaqSection } from '@/components/schools/template/SchoolFaqSection';
export type { SchoolFaqSectionProps, AuthenticFaqProps } from '@/components/schools/template/SchoolFaqSection';

// 2. Admission Tab Section
export { default as SchoolFeeSection } from './SchoolFeeSection';
export type { SchoolFeeSectionProps } from './SchoolFeeSection';

// 3. Result Tab Section
export { default as SchoolBoardResultsSection } from './SchoolBoardResultsSection';

// Shared Utilities & Modals
export { default as SchoolFooterSection } from './SchoolFooterSection';
export type { SchoolFooterSectionProps } from './SchoolFooterSection';

export { default as LazySection } from './LazySection';
export { default as SchoolProfileModals } from './SchoolProfileModals';
