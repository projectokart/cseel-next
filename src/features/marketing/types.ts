export type PromotionType = 'offer' | 'announcement' | 'popup' | 'hero_banner' | 'card_ad';
export type PromoStatus = 'published' | 'draft' | 'scheduled' | 'expired';

export interface MarketingPromotion {
  id: string;
  type: PromotionType;
  title: string;
  subtitle?: string;
  content: string;
  cta_text?: string;
  cta_link?: string;
  badge_text?: string;
  bg_color?: string;
  bg_gradient?: string;
  accent_color?: string;
  image_url?: string;
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
