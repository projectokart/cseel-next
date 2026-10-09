export type PromotionType = 'offer' | 'announcement' | 'popup' | 'hero_banner' | 'card_ad';
export type PromoStatus = 'published' | 'draft' | 'scheduled' | 'expired';

export type AdSlotId =
  | 'slot_after_hero'
  | 'slot_after_stats'
  | 'slot_after_partners'
  | 'slot_after_metrics'
  | 'slot_after_outcomes'
  | 'slot_after_catalog'
  | 'slot_after_testimonials'
  | 'slot_before_footer'
  | 'slot_popup_modal'
  | 'slot_top_ticker';

export type AdDesignStyle =
  | 'adobe_light_card'
  | 'adobe_image_card'
  | 'full_hero_banner'
  | 'custom_html';

export type AdActionType = 'navigate' | 'new_tab' | 'copy_coupon' | 'trigger_popup';

export interface AdSlotMetadata {
  id: AdSlotId;
  label: string;
  locationDesc: string;
  defaultSlidesPerView: 1 | 2 | 3 | 4;
}

export const AD_SLOTS_REGISTRY: AdSlotMetadata[] = [
  {
    id: 'slot_after_hero',
    label: 'Slot #1: Below Hero Section',
    locationDesc: 'Homepage — Immediately below the main Welcome to CSEEL Hero section',
    defaultSlidesPerView: 3,
  },
  {
    id: 'slot_after_stats',
    label: 'Slot #2: Below Research Stats',
    locationDesc: 'Homepage — Below "Why Hands-On Science Works" stats section',
    defaultSlidesPerView: 3,
  },
  {
    id: 'slot_after_partners',
    label: 'Slot #3: Below Partner Schools Marquee',
    locationDesc: 'Homepage — Below the 250+ Partner Schools scrolling marquee',
    defaultSlidesPerView: 3,
  },
  {
    id: 'slot_after_metrics',
    label: 'Slot #4: Below CSEEL by the Numbers',
    locationDesc: 'Homepage — Below the "Our Impact / CSEEL by the Numbers" section',
    defaultSlidesPerView: 3,
  },
  {
    id: 'slot_after_outcomes',
    label: 'Slot #5: Below Learning Outcomes Sticky Cards',
    locationDesc: 'Homepage — Below "#cseel-lms-integration-section" sticky cards',
    defaultSlidesPerView: 3,
  },
  {
    id: 'slot_after_catalog',
    label: 'Slot #6: Below Subjects & Disciplines Catalog',
    locationDesc: 'Homepage — Below the 3 Domain Cards catalog section',
    defaultSlidesPerView: 3,
  },
  {
    id: 'slot_after_testimonials',
    label: 'Slot #7: Below Teacher Testimonials',
    locationDesc: 'Homepage — Below "Trusted by Teachers" Swiper section',
    defaultSlidesPerView: 3,
  },
  {
    id: 'slot_before_footer',
    label: 'Slot #8: Above Final CTA / Footer',
    locationDesc: 'Homepage — Below "3-Step Easy Process", right before Final CTA',
    defaultSlidesPerView: 1,
  },
  {
    id: 'slot_popup_modal',
    label: 'Global Slot: Offer / Video Popup Modal',
    locationDesc: 'Overlay Modal — Pops up over the page when active',
    defaultSlidesPerView: 1,
  },
  {
    id: 'slot_top_ticker',
    label: 'Global Slot: Top Announcement Ticker',
    locationDesc: 'Top Bar — Announcement strip at the very top of the page',
    defaultSlidesPerView: 1,
  },
];

export interface SlotSwiperSettings {
  slot_id: AdSlotId;
  slides_per_view: 1 | 2 | 3 | 4;
  autoplay: boolean;
  autoplay_delay: number;
  show_arrows: boolean;
  show_dots: boolean;
  show_section_header: boolean;
  section_title: string;
  section_badge: string;
}

export interface MarketingPromotion {
  id: string;
  type: PromotionType;
  slot_id?: AdSlotId;
  design_style?: AdDesignStyle;
  action_type?: AdActionType;
  title: string;
  subtitle?: string;
  content: string;
  cta_text?: string;
  cta_link?: string;
  badge_text?: string;
  badge_bg_color?: string;
  badge_text_color?: string;
  border_color?: string;
  button_bg_color?: string;
  bg_color?: string;
  bg_gradient?: string;
  accent_color?: string;
  image_url?: string;
  icon_url?: string;
  old_price?: string;
  new_price?: string;
  price_unit?: string;
  terms_text?: string;
  terms_link?: string;
  custom_html?: string;
  discount_percentage?: number;
  coupon_code?: string;
  start_date?: string;
  end_date?: string;
  is_active: boolean;
  status: PromoStatus;
  views_count?: number;
  clicks_count?: number;
  sort_order?: number;
  target_pages?: string[];
  created_at: string;
  updated_at: string;
}

export interface CouponVoucher {
  id: string;
  code: string;
  description: string;
  discount_type: 'percentage' | 'flat';
  discount_value: number;
  min_order_value?: number;
  max_discount_amount?: number;
  usage_limit?: number;
  used_count: number;
  valid_until: string;
  is_active: boolean;
  applicable_category?: string;
  created_at: string;
}

export interface MarketingLead {
  id: string;
  campaign_id?: string;
  name?: string;
  email: string;
  phone?: string;
  school_name?: string;
  source: string;
  created_at: string;
}
