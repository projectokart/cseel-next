export type HomepageSectionId =
  | 'announcement_bar'
  | 'hero_section'
  | 'special_offers'
  | 'partner_schools'
  | 'impact_metrics'
  | 'why_cseel_features'
  | 'subjects_catalog'
  | 'testimonials'
  | 'awards_accreditations'
  | 'easy_steps'
  | 'final_cta'
  | 'offer_popup';

export interface HomepageSectionItem {
  id: string;
  title?: string;
  subtitle?: string;
  description?: string;
  icon?: string;
  image?: string;
  value?: string;
  label?: string;
  link?: string;
  badge?: string;
  accent?: string;
}

export interface HomepageSectionConfig {
  id: HomepageSectionId;
  name: string;
  description: string;
  category: 'header' | 'hero' | 'social_proof' | 'features' | 'catalog' | 'conversion';
  enabled: boolean;
  order: number;
  badge_text?: string;
  title: string;
  subtitle?: string;
  content?: string;
  cta_text?: string;
  cta_link?: string;
  secondary_cta_text?: string;
  secondary_cta_link?: string;
  bg_type?: 'default' | 'gradient' | 'soft-blue' | 'white';
  items?: HomepageSectionItem[];
  updated_at?: string;
  updated_by?: string;
}
