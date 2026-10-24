/**
 * Feature: Science Laboratories (Physics, Chemistry, Biology)
 * Standalone Independent Domain Module
 */

// Types
export * from './types';

// Data
export * from './data/scienceData';

// Hooks
export * from './hooks/useScienceFilter';

// Components
export { default as ScienceCard } from './components/ScienceCard';
export { default as ScienceFilterBar } from './components/ScienceFilterBar';
export { default as ScienceFilterDrawer } from './components/ScienceFilterDrawer';
export { default as ScienceHeroSlider } from './components/ScienceHeroSlider';
