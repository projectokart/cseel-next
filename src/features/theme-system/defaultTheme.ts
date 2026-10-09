import { GlobalThemeConfig } from './types';

export const DEFAULT_CSEEL_THEME: GlobalThemeConfig = {
  buttonVariant: 'cseel',
  buttonRadius: '12px',
  primaryColor: '#006FCC',
  primaryHoverColor: '#005499',
  secondaryBgColor: '#EDF5FA',
  secondaryTextColor: '#006FCC',
  secondaryBorderColor: '#D6EDFF',
  headingFont: 'google_sans',
  cardRadius: '16px',
  buttonShadow: 'glow',
  customCssOverrides: '',
  updatedAt: new Date().toISOString(),
  updatedBy: 'system',
};

export const GOOGLE_PRESET_THEME: GlobalThemeConfig = {
  buttonVariant: 'google',
  buttonRadius: '9999px',
  primaryColor: '#1A73E8',
  primaryHoverColor: '#1557B0',
  secondaryBgColor: '#F1F3F4',
  secondaryTextColor: '#1A73E8',
  secondaryBorderColor: '#DADCE0',
  headingFont: 'google_sans',
  cardRadius: '16px',
  buttonShadow: 'material',
  customCssOverrides: '',
  updatedAt: new Date().toISOString(),
  updatedBy: 'system',
};
