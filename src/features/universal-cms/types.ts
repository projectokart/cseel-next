export interface CmsVersion {
  id: string;
  versionNumber: number;
  timestamp: string;
  author: string;
  summary: string;
  pageKey: string;
  data: any;
}

export interface UniversalPageData {
  pageKey: string;
  title?: string;
  eyebrow?: string;
  subtitle?: string;
  description?: string;
  heroImage?: string;
  badge?: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  sections?: Record<string, any>;
  blocks?: Record<string, any>;
  customFields?: Record<string, any>;
  updatedAt?: string;
  updatedBy?: string;
}

export interface UniversalCmsState {
  pages: Record<string, UniversalPageData>;
  versions: Record<string, CmsVersion[]>; // pageKey -> max 10 versions
}
