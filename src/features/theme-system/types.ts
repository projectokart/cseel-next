export type ButtonShapeVariant = 'cseel' | 'google' | 'custom';

export interface GlobalThemeConfig {
  buttonVariant: ButtonShapeVariant; // 'cseel' | 'google' | 'custom'
  buttonRadius: string; // '12px' | '9999px' | custom string
  primaryColor: string; // e.g. '#006FCC'
  primaryHoverColor: string; // e.g. '#005499'
  secondaryBgColor: string; // e.g. '#EDF5FA'
  secondaryTextColor: string; // e.g. '#006FCC'
  secondaryBorderColor: string; // e.g. '#D6EDFF'
  headingFont: 'google_sans' | 'roboto' | 'system';
  cardRadius: string; // e.g. '16px'
  buttonShadow: 'glow' | 'material' | 'none';
  customCssOverrides: string;
  updatedAt?: string;
  updatedBy?: string;
}
