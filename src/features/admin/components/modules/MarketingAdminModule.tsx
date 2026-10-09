'use client';

import React, { useState } from 'react';
import {
  Megaphone,
  Plus,
  Trash2,
  Edit3,
  Eye,
  Tag,
  Gift,
  Search,
  X,
  ArrowUp,
  ArrowDown,
  LayoutGrid,
  Sliders,
  Sparkles,
  Code2,
  MapPin,
  Play,
  Pause,
} from 'lucide-react';
import {
  MarketingPromotion,
  CouponVoucher,
  PromotionType,
  PromoStatus,
  AdSlotId,
  AdDesignStyle,
  AdActionType,
  AD_SLOTS_REGISTRY,
} from '@/features/marketing/types';
import { INITIAL_COUPONS, INITIAL_LEADS } from '@/features/marketing/data/marketingSeed';
import { PIXEL_PERFECT_BANNER_TEMPLATES } from '@/features/marketing/data/bannerHtmlTemplates';
import { useMarketingCampaigns } from '@/features/marketing/useMarketingCampaigns';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

const PRESET_PREMIUM_IMAGES = [
  {
    label: 'Red Chemiluminescence Lab',
    url: '/images/experiments/red-chemiluminescence.jpg',
  },
  {
    label: 'Interactive Science Interface',
    url: '/images/hero/interactive-science-simulation-interface.webp',
  },
  {
    label: 'STEM Robotics & Electronics',
    url: '/images/hero/stem-robotics-and-electronics-breadboard.webp',
  },
  {
    label: 'Students Chemistry Experiment',
    url: '/images/hero/students-doing-chemistry-lab-experiment.webp',
  },
  {
    label: 'Physics Pendulum Virtual Lab',
    url: '/images/hero/physics-virtual-laboratory-pendulum-simulation.webp',
  },
  {
    label: 'Biology Microscope Lab',
    url: '/images/hero/biology-cell-mitosis-microscope-lab.webp',
  },
];

const DEFAULT_ADOBE_HTML_SNIPPET = `<div style="width: 100%; background: #ffffff; border: 1px solid #ea3829; border-radius: 16px; padding: 24px; box-sizing: border-box; display: flex; flex-direction: column; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
    <div style="display: flex; align-items: center; gap: 12px;">
      <img src="/favicon.svg" alt="CSEEL Pro" style="width: 32px; height: 32px; border-radius: 8px; object-fit: contain;">
      <h3 style="margin: 0; font-size: 18px; font-weight: 700; color: #2c2c2c; letter-spacing: -0.2px;">CSEEL Science Pro</h3>
    </div>
    <div style="background-color: #fae8ff; color: #86198f; font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 20px;">
      Special Offer
    </div>
  </div>
  <div style="font-size: 14px; line-height: 1.5; color: #222222; margin-bottom: 20px;">
    <p style="margin: 0 0 12px 0;">Save over 55% on the CSEEL Science Pro plan. Get Physics, Chemistry, Biology, and Robotics interactive labs. First year only.</p>
    <a href="/terms" style="color: #000000; text-decoration: underline; font-weight: 500; font-size: 13px;">See terms</a>
  </div>
  <div style="display: flex; align-items: center; justify-content: space-between; margin-top: auto; gap: 8px;">
    <div style="display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap;">
      <span style="font-size: 13px; color: #717171; text-decoration: line-through;">₹2,714.00/mo</span>
      <span style="font-size: 18px; font-weight: 700; color: #111111;">₹1,199.00<span style="font-size: 13px; font-weight: 400; color: #4b5563;">/mo incl. GST</span></span>
    </div>
    <a href="/compare-plans" style="background-color: #0063eb; color: #ffffff; border: none; border-radius: 20px; padding: 8px 24px; font-size: 14px; font-weight: 600; cursor: pointer; white-space: nowrap; text-decoration: none;">Buy</a>
  </div>
</div>`;

export const MarketingAdminModule: React.FC = () => {
  const { addAuditLog } = useAdminAuth();
  const {
    promotions,
    slotSettings,
    savePromotions,
    updateSlotSetting,
    swapPromotionOrder,
  } = useMarketingCampaigns();

  const [activeTab, setActiveTab] = useState<
    'promotions' | 'slots_swiper' | 'coupons' | 'leads'
  >('promotions');
  const [selectedSlotFilter, setSelectedSlotFilter] = useState<string>('all');
  const [selectedSlotForSwiper, setSelectedSlotForSwiper] =
    useState<AdSlotId>('slot_after_hero');

  const [coupons, setCoupons] = useState<CouponVoucher[]>(INITIAL_COUPONS);
  const [leads] = useState(INITIAL_LEADS);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [promoModalOpen, setPromoModalOpen] = useState(false);
  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<MarketingPromotion | null>(null);
  const [editingCoupon, setEditingCoupon] = useState<CouponVoucher | null>(null);
  const [previewPromo, setPreviewPromo] = useState<MarketingPromotion | null>(null);

  // Form states for Promotion / Ad Card
  const [promoTitle, setPromoTitle] = useState('');
  const [promoSubtitle, setPromoSubtitle] = useState('');
  const [promoContent, setPromoContent] = useState('');
  const [promoType, setPromoType] = useState<PromotionType>('offer');
  const [promoSlotId, setPromoSlotId] = useState<AdSlotId>('slot_after_hero');
  const [promoDesignStyle, setPromoDesignStyle] =
    useState<AdDesignStyle>('adobe_image_card');
  const [promoActionType, setPromoActionType] = useState<AdActionType>('navigate');
  const [promoCtaText, setPromoCtaText] = useState('Buy');
  const [promoCtaLink, setPromoCtaLink] = useState('/compare-plans');
  const [promoBadgeText, setPromoBadgeText] = useState('Special Offer');
  const [promoBadgeBg, setPromoBadgeBg] = useState('#fae8ff');
  const [promoBadgeColor, setPromoBadgeColor] = useState('#86198f');
  const [promoBorderColor, setPromoBorderColor] = useState('#ea3829');
  const [promoButtonBg, setPromoButtonBg] = useState('#0063eb');
  const [promoBgColor, setPromoBgColor] = useState('#ffffff');
  const [promoImageUrl, setPromoImageUrl] = useState(
    '/images/experiments/red-chemiluminescence.jpg'
  );
  const [promoIconUrl, setPromoIconUrl] = useState('');
  const [promoOldPrice, setPromoOldPrice] = useState('₹2,714.00/mo');
  const [promoNewPrice, setPromoNewPrice] = useState('₹1,199.00');
  const [promoPriceUnit, setPromoPriceUnit] = useState('/mo incl. GST');
  const [promoTermsText, setPromoTermsText] = useState('See terms');
  const [promoTermsLink, setPromoTermsLink] = useState('/terms');
  const [promoCustomHtml, setPromoCustomHtml] = useState('');
  const [promoDiscount, setPromoDiscount] = useState<number | ''>(55);
  const [promoCouponCode, setPromoCouponCode] = useState('EARLY55');
  const [promoIsActive, setPromoIsActive] = useState(true);

  // Form states for Coupon
  const [couponCode, setCouponCode] = useState('');
  const [couponDesc, setCouponDesc] = useState('');
  const [couponType, setCouponType] = useState<'percentage' | 'flat'>('percentage');
  const [couponVal, setCouponVal] = useState(10);
  const [couponMinOrder, setCouponMinOrder] = useState(1000);
  const [couponLimit, setCouponLimit] = useState(500);
  const [couponValidUntil, setCouponValidUntil] = useState('2026-12-31');
  const [couponCategory, setCouponCategory] = useState('All Lab Materials');
  const [couponActive, setCouponActive] = useState(true);

  const openNewPromoModal = (defaultSlot?: AdSlotId) => {
    setEditingPromo(null);
    setPromoTitle('CSEEL Science Pro');
    setPromoSubtitle('All-in-One Virtual & Hands-on Lab Suite');
    setPromoContent(
      'Save over 55% on the CSEEL Science Pro plan. Get Physics, Chemistry, Biology, and Robotics interactive labs. First year only.'
    );
    setPromoType('offer');
    setPromoSlotId(defaultSlot || 'slot_after_hero');
    setPromoDesignStyle('adobe_image_card');
    setPromoActionType('navigate');
    setPromoCtaText('Buy');
    setPromoCtaLink('/compare-plans');
    setPromoBadgeText('Special Offer');
    setPromoBadgeBg('#fae8ff');
    setPromoBadgeColor('#86198f');
    setPromoBorderColor('#ea3829');
    setPromoButtonBg('#0063eb');
    setPromoBgColor('#ffffff');
    setPromoImageUrl('/images/experiments/red-chemiluminescence.jpg');
    setPromoIconUrl('');
    setPromoOldPrice('₹2,714.00/mo');
    setPromoNewPrice('₹1,199.00');
    setPromoPriceUnit('/mo incl. GST');
    setPromoTermsText('See terms');
    setPromoTermsLink('/terms');
    setPromoCustomHtml(DEFAULT_ADOBE_HTML_SNIPPET);
    setPromoDiscount(55);
    setPromoCouponCode('EARLY55');
    setPromoIsActive(true);
    setPromoModalOpen(true);
  };

  const openEditPromoModal = (p: MarketingPromotion) => {
    setEditingPromo(p);
    setPromoTitle(p.title);
    setPromoSubtitle(p.subtitle || '');
    setPromoContent(p.content);
    setPromoType(p.type);
    setPromoSlotId(p.slot_id || 'slot_after_hero');
    setPromoDesignStyle(p.design_style || 'adobe_image_card');
    setPromoActionType(p.action_type || 'navigate');
    setPromoCtaText(p.cta_text || 'Buy');
    setPromoCtaLink(p.cta_link || '/compare-plans');
    setPromoBadgeText(p.badge_text || 'Special Offer');
    setPromoBadgeBg(p.badge_bg_color || '#fae8ff');
    setPromoBadgeColor(p.badge_text_color || '#86198f');
    setPromoBorderColor(p.border_color || p.accent_color || '#ea3829');
    setPromoButtonBg(p.button_bg_color || '#0063eb');
    setPromoBgColor(p.bg_color || '#ffffff');
    setPromoImageUrl(p.image_url || '/images/experiments/red-chemiluminescence.jpg');
    setPromoIconUrl(p.icon_url || '');
    setPromoOldPrice(p.old_price ?? '₹2,714.00/mo');
    setPromoNewPrice(p.new_price ?? '₹1,199.00');
    setPromoPriceUnit(p.price_unit ?? '/mo incl. GST');
    setPromoTermsText(p.terms_text || 'See terms');
    setPromoTermsLink(p.terms_link || '/terms');
    setPromoCustomHtml(p.custom_html || DEFAULT_ADOBE_HTML_SNIPPET);
    setPromoDiscount(p.discount_percentage || '');
    setPromoCouponCode(p.coupon_code || '');
    setPromoIsActive(p.is_active);
    setPromoModalOpen(true);
  };

  const handleSavePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoTitle.trim()) {
      alert('Promotion title is required');
      return;
    }

    const commonFields = {
      title: promoTitle.trim(),
      subtitle: promoSubtitle.trim() || undefined,
      content: promoContent.trim(),
      type: promoSlotId === 'slot_popup_modal' ? ('popup' as PromotionType) : promoType,
      slot_id: promoSlotId,
      design_style: promoDesignStyle,
      action_type: promoActionType,
      cta_text: promoCtaText.trim() || 'Buy',
      cta_link: promoCtaLink.trim() || '/compare-plans',
      badge_text: promoBadgeText.trim() || 'Special Offer',
      badge_bg_color: promoBadgeBg,
      badge_text_color: promoBadgeColor,
      border_color: promoBorderColor,
      button_bg_color: promoButtonBg,
      bg_color: promoBgColor,
      accent_color: promoBorderColor,
      image_url: promoImageUrl.trim() || undefined,
      icon_url: promoIconUrl.trim() || undefined,
      old_price: promoOldPrice.trim(),
      new_price: promoNewPrice.trim(),
      price_unit: promoPriceUnit.trim(),
      terms_text: promoTermsText.trim() || 'See terms',
      terms_link: promoTermsLink.trim() || '/terms',
      custom_html: promoCustomHtml,
      discount_percentage: promoDiscount ? Number(promoDiscount) : undefined,
      coupon_code: promoCouponCode.trim() || undefined,
      status: promoIsActive ? ('published' as PromoStatus) : ('draft' as PromoStatus),
      is_active: promoIsActive,
      updated_at: new Date().toISOString(),
    };

    if (editingPromo) {
      const updated: MarketingPromotion = {
        ...editingPromo,
        ...commonFields,
      };
      savePromotions(promotions.map((p) => (p.id === updated.id ? updated : p)));
      addAuditLog(
        'EDIT_PROMOTION',
        'marketing_growth',
        `Updated campaign "${updated.title}" in slot ${updated.slot_id}`
      );
    } else {
      const created: MarketingPromotion = {
        id: `promo-${Date.now()}`,
        ...commonFields,
        views_count: 0,
        clicks_count: 0,
        sort_order: promotions.length + 1,
        target_pages: ['/'],
        created_at: new Date().toISOString(),
      };
      savePromotions([created, ...promotions]);
      addAuditLog(
        'CREATE_PROMOTION',
        'marketing_growth',
        `Created campaign "${created.title}" in slot ${created.slot_id}`
      );
    }
    setPromoModalOpen(false);
  };

  const handleTogglePromoActive = (id: string, current: boolean) => {
    const next = promotions.map((p) =>
      p.id === id
        ? {
            ...p,
            is_active: !current,
            status: !current ? ('published' as PromoStatus) : ('draft' as PromoStatus),
            updated_at: new Date().toISOString(),
          }
        : p
    );
    savePromotions(next);
    addAuditLog(
      'TOGGLE_PROMOTION',
      'marketing_growth',
      `Toggled promotion ${id} to ${!current ? 'LIVE' : 'HIDDEN'}`
    );
  };

  const handleQuickChangeSlot = (id: string, newSlot: AdSlotId) => {
    const next = promotions.map((p) =>
      p.id === id
        ? {
            ...p,
            slot_id: newSlot,
            type: newSlot === 'slot_popup_modal' ? ('popup' as PromotionType) : p.type,
            updated_at: new Date().toISOString(),
          }
        : p
    );
    savePromotions(next);
    addAuditLog('MOVE_PROMO_SLOT', 'marketing_growth', `Moved promotion ${id} to ${newSlot}`);
  };

  const handleQuickChangeDesign = (id: string, newDesign: AdDesignStyle) => {
    const next = promotions.map((p) =>
      p.id === id
        ? {
            ...p,
            design_style: newDesign,
            updated_at: new Date().toISOString(),
          }
        : p
    );
    savePromotions(next);
  };

  const handleActivateEntireSlot = (slotId: AdSlotId, active: boolean) => {
    const next = promotions.map((p) =>
      (p.slot_id || 'slot_after_hero') === slotId
        ? {
            ...p,
            is_active: active,
            status: active ? ('published' as PromoStatus) : ('draft' as PromoStatus),
          }
        : p
    );
    savePromotions(next);
  };

  const handleDeletePromo = (id: string, title: string) => {
    if (confirm(`Delete campaign "${title}"?`)) {
      savePromotions(promotions.filter((p) => p.id !== id));
      addAuditLog('DELETE_PROMOTION', 'marketing_growth', `Deleted campaign: ${title}`);
    }
  };

  // Coupon Handlers
  const openNewCouponModal = () => {
    setEditingCoupon(null);
    setCouponCode('');
    setCouponDesc('');
    setCouponType('percentage');
    setCouponVal(15);
    setCouponMinOrder(2000);
    setCouponLimit(500);
    setCouponValidUntil('2026-12-31');
    setCouponCategory('All Lab Materials');
    setCouponModalOpen(true);
  };

  const handleSaveCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    if (editingCoupon) {
      const updated: CouponVoucher = {
        ...editingCoupon,
        code: couponCode.toUpperCase().trim(),
        description: couponDesc.trim(),
        discount_type: couponType,
        discount_value: Number(couponVal),
        min_order_value: Number(couponMinOrder),
        usage_limit: Number(couponLimit),
        valid_until: couponValidUntil,
        applicable_category: couponCategory,
        is_active: couponActive,
      };
      setCoupons(coupons.map((c) => (c.id === updated.id ? updated : c)));
    } else {
      const created: CouponVoucher = {
        id: `coup-${Date.now()}`,
        code: couponCode.toUpperCase().trim(),
        description: couponDesc.trim(),
        discount_type: couponType,
        discount_value: Number(couponVal),
        min_order_value: Number(couponMinOrder),
        usage_limit: Number(couponLimit),
        used_count: 0,
        valid_until: couponValidUntil,
        applicable_category: couponCategory,
        is_active: couponActive,
        created_at: new Date().toISOString(),
      };
      setCoupons([created, ...coupons]);
    }
    setCouponModalOpen(false);
  };

  const sortedPromotions = [...promotions].sort(
    (a, b) => (a.sort_order || 0) - (b.sort_order || 0)
  );

  const filteredPromotions = sortedPromotions.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.slot_id || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSlot =
      selectedSlotFilter === 'all' || (p.slot_id || 'slot_after_hero') === selectedSlotFilter;
    return matchesSearch && matchesSlot;
  });

  const currentSlotConfig = slotSettings[selectedSlotForSwiper] || {
    slot_id: selectedSlotForSwiper,
    slides_per_view: 3,
    autoplay: true,
    autoplay_delay: 4500,
    show_arrows: true,
    show_dots: true,
    show_section_header: true,
    section_title: 'Special Offers & Featured Programs',
    section_badge: 'Special Offers & Events',
  };

  return (
    <div className="space-y-6">
      {/* ── HEADER ── */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 rounded-full text-xs font-black text-amber-800 dark:text-amber-300">
            <Megaphone className="w-3.5 h-3.5 text-amber-600" />
            <span>DYNAMIC AD SLOTS, OFFERS & SWIPER STUDIO</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Advertisements, Offers & Page Slot Controller
          </h2>
          <p className="text-xs text-slate-500 max-w-2xl">
            Every section on the page has a unique Slot ID and starts empty by default. Launch Adobe-style offer cards, premium image banners, custom HTML blocks, or popups into any Page Slot, swap card order, and control Swiper behavior live.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => openNewPromoModal()}
            className="px-4 py-2.5 bg-gradient-to-r from-[#ea3829] to-orange-600 hover:opacity-95 text-white font-black text-xs rounded-2xl shadow-md transition-all flex items-center gap-2 shrink-0 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Custom Offer / Ad Banner</span>
          </button>
          <button
            onClick={openNewCouponModal}
            className="px-4 py-2.5 bg-[#0063eb] hover:bg-blue-700 text-white font-black text-xs rounded-2xl shadow-md transition-all flex items-center gap-2 shrink-0 active:scale-95 cursor-pointer"
          >
            <Tag className="w-4 h-4" />
            <span>Create Promo Code</span>
          </button>
        </div>
      </div>

      {/* ── PAGE SLOTS QUICK CONTROL STRIP (Shows all Page Section IDs & Live Counts) ── */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#0063eb]" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">
              Page Section Slot IDs (Initially Empty Until Activated)
            </h3>
          </div>
          <span className="text-[11px] text-slate-500">
            Click any slot to filter or toggle all cards in that section
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {AD_SLOTS_REGISTRY.map((slot) => {
            const totalInSlot = promotions.filter(
              (p) => (p.slot_id || 'slot_after_hero') === slot.id
            ).length;
            const liveInSlot = promotions.filter(
              (p) => p.is_active && (p.slot_id || 'slot_after_hero') === slot.id
            ).length;
            const isSelected = selectedSlotFilter === slot.id;

            return (
              <div
                key={slot.id}
                onClick={() =>
                  setSelectedSlotFilter(isSelected ? 'all' : slot.id)
                }
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  isSelected
                    ? 'border-[#0063eb] bg-blue-50/60 dark:bg-blue-950/40'
                    : liveInSlot > 0
                      ? 'border-emerald-300 bg-emerald-50/30 dark:border-emerald-800'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <code className="text-[10px] font-mono font-bold text-[#0063eb] bg-blue-100/80 dark:bg-blue-950 px-1.5 py-0.5 rounded">
                      {slot.id}
                    </code>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        liveInSlot > 0
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      {liveInSlot > 0 ? `● ${liveInSlot} Live` : 'Empty'}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-800 dark:text-white leading-snug">
                    {slot.label}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-1 pt-1 border-t border-slate-200/60 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500">
                    {totalInSlot} saved card{totalInSlot === 1 ? '' : 's'}
                  </span>
                  <div
                    className="flex items-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {totalInSlot > 0 && (
                      <button
                        type="button"
                        onClick={() =>
                          handleActivateEntireSlot(slot.id, liveInSlot === 0)
                        }
                        className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                          liveInSlot === 0
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                            : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                        }`}
                      >
                        {liveInSlot === 0 ? 'Run Slot' : 'Stop Slot'}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => openNewPromoModal(slot.id)}
                      className="px-1.5 py-0.5 rounded bg-slate-900 text-white text-[10px] font-bold hover:bg-slate-700 cursor-pointer"
                      title="Add Ad/Offer to this Slot"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── NAVIGATION TABS ── */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 flex-wrap">
        <button
          onClick={() => setActiveTab('promotions')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'promotions'
              ? 'bg-[#0063eb] text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>Ad & Offer Cards Manager ({promotions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('slots_swiper')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'slots_swiper'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Slot Swiper & Layout Settings</span>
        </button>

        <button
          onClick={() => setActiveTab('coupons')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'coupons'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>Promo Codes ({coupons.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('leads')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'leads'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Gift className="w-3.5 h-3.5" />
          <span>Campaign Leads ({leads.length})</span>
        </button>
      </div>

      {/* ── TAB 1: AD & OFFER CARDS MANAGER (With Swap, Slot Move, Design Switch & Live Toggle) ── */}
      {activeTab === 'promotions' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, slot ID, or coupon..."
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-500">Filter Slot:</span>
              <select
                value={selectedSlotFilter}
                onChange={(e) => setSelectedSlotFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold"
              >
                <option value="all">All Page Slots ({promotions.length})</option>
                {AD_SLOTS_REGISTRY.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label} ({s.id})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredPromotions.map((p, idx) => (
              <div
                key={p.id}
                className={`bg-white dark:bg-slate-900 rounded-3xl p-5 border transition-all flex flex-col justify-between space-y-4 shadow-2xs ${
                  p.is_active
                    ? 'border-emerald-400 dark:border-emerald-700 ring-1 ring-emerald-400/30'
                    : 'border-dashed border-slate-300 dark:border-slate-700'
                }`}
              >
                <div className="space-y-3">
                  {/* Top Bar: Order Number + Slot ID + Live Toggle */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md bg-slate-900 text-white text-[10px] font-black">
                        #{idx + 1}
                      </span>
                      <code className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0063eb] border border-blue-200">
                        {p.slot_id || 'slot_after_hero'}
                      </code>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
                        {p.badge_text || 'Special Offer'}
                      </span>
                      {p.coupon_code && (
                        <span className="text-[10px] font-mono font-black px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-dashed border-amber-400">
                          🎟️ PROMO: {p.coupon_code}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleTogglePromoActive(p.id, p.is_active)}
                      className={`text-xs font-black px-3.5 py-1.5 rounded-full border transition-all flex items-center gap-1.5 cursor-pointer ${
                        p.is_active
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300'
                      }`}
                    >
                      {p.is_active ? (
                        <>
                          <Pause className="w-3 h-3 fill-current" />
                          <span>LIVE ON PAGE (Click to Stop)</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3 fill-current" />
                          <span>Hidden / Draft (Click to Run)</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Card Preview Thumbnail + Info */}
                  <div className="flex items-start gap-3.5">
                    {p.image_url && (
                      <img
                        src={p.image_url}
                        alt={p.title}
                        className="w-20 h-20 rounded-2xl object-cover shrink-0 border border-slate-200"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-black text-base text-slate-900 dark:text-white leading-snug">
                        {p.title}
                      </h3>
                      <div
                        className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: p.content }}
                      />
                      <div className="flex items-center gap-3 mt-2 flex-wrap text-xs">
                        {p.old_price && (
                          <span className="text-slate-400 line-through">{p.old_price}</span>
                        )}
                        {p.new_price && (
                          <span className="font-black text-slate-900 dark:text-white">
                            {p.new_price}{' '}
                            <span className="font-normal text-slate-500">{p.price_unit}</span>
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                          CTA: {p.cta_text || 'Buy'} → {p.cta_link}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Instant Controls Row: Move Slot Location & Switch Design Style */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                        Place / Location in Page (Slot ID)
                      </label>
                      <select
                        value={p.slot_id || 'slot_after_hero'}
                        onChange={(e) =>
                          handleQuickChangeSlot(p.id, e.target.value as AdSlotId)
                        }
                        className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                      >
                        {AD_SLOTS_REGISTRY.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                        Card / Banner Design Style
                      </label>
                      <select
                        value={p.design_style || 'adobe_image_card'}
                        onChange={(e) =>
                          handleQuickChangeDesign(
                            p.id,
                            e.target.value as AdDesignStyle
                          )
                        }
                        className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                      >
                        <option value="adobe_image_card">
                          Adobe Offer Card + Premium Bg Image
                        </option>
                        <option value="adobe_light_card">
                          Adobe Clean White Card (#ffffff)
                        </option>
                        <option value="full_hero_banner">
                          Full-Width Hero Banner Slide
                        </option>
                        <option value="custom_html">
                          Custom Raw HTML / CSS Design
                        </option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Bar: Swap Order Buttons + Preview + Edit + Delete */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => swapPromotionOrder(p.id, 'up')}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
                      title="Swap card left / up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                      <span>Swap Left/Up</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => swapPromotionOrder(p.id, 'down')}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
                      title="Swap card right / down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                      <span>Swap Right/Down</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setPreviewPromo(p)}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>
                    <button
                      onClick={() => openEditPromoModal(p)}
                      className="px-3 py-1 rounded-lg text-xs font-bold text-white bg-[#0063eb] hover:bg-blue-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Customize</span>
                    </button>
                    <button
                      onClick={() => handleDeletePromo(p.id, p.title)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                      title="Delete Campaign"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 2: SLOT SWIPER & LAYOUT SETTINGS ── */}
      {activeTab === 'slots_swiper' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="font-black text-base text-slate-900 dark:text-white">
                Swiper Carousel & Layout Controls per Page Slot
              </h3>
              <p className="text-xs text-slate-500">
                Choose how many cards show per row (1 full-width banner, 2, 3, or 4 cards), autoplay speed, arrows, and section title for each slot ID.
              </p>
            </div>
            <select
              value={selectedSlotForSwiper}
              onChange={(e) => setSelectedSlotForSwiper(e.target.value as AdSlotId)}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-black text-[#0063eb]"
            >
              {AD_SLOTS_REGISTRY.filter(
                (s) => s.id !== 'slot_popup_modal' && s.id !== 'slot_top_ticker'
              ).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label} ({s.id})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <label className="font-black text-slate-800 dark:text-white block">
                Cards / Slides Per Row (Desktop)
              </label>
              <select
                value={currentSlotConfig.slides_per_view}
                onChange={(e) =>
                  updateSlotSetting(selectedSlotForSwiper, {
                    slides_per_view: Number(e.target.value) as 1 | 2 | 3 | 4,
                  })
                }
                className="w-full p-2.5 rounded-xl border bg-white dark:bg-slate-900 font-bold"
              >
                <option value={1}>1 Full-Width Slide per View</option>
                <option value={2}>2 Cards per Row</option>
                <option value={3}>3 Cards per Row (Adobe Standard)</option>
                <option value={4}>4 Compact Cards per Row</option>
              </select>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <label className="font-black text-slate-800 dark:text-white block">
                Section Eyebrow Badge Text
              </label>
              <input
                type="text"
                value={currentSlotConfig.section_badge}
                onChange={(e) =>
                  updateSlotSetting(selectedSlotForSwiper, {
                    section_badge: e.target.value,
                  })
                }
                className="w-full p-2.5 rounded-xl border bg-white dark:bg-slate-900 font-bold"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <label className="font-black text-slate-800 dark:text-white block">
                Autoplay Delay (ms)
              </label>
              <input
                type="number"
                step={500}
                min={1500}
                value={currentSlotConfig.autoplay_delay}
                onChange={(e) =>
                  updateSlotSetting(selectedSlotForSwiper, {
                    autoplay_delay: Number(e.target.value),
                  })
                }
                className="w-full p-2.5 rounded-xl border bg-white dark:bg-slate-900 font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <button
              type="button"
              onClick={() =>
                updateSlotSetting(selectedSlotForSwiper, {
                  autoplay: !currentSlotConfig.autoplay,
                })
              }
              className={`p-3 rounded-2xl border font-bold cursor-pointer ${
                currentSlotConfig.autoplay
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-slate-100 border-slate-200 text-slate-600'
              }`}
            >
              Swiper Autoplay: {currentSlotConfig.autoplay ? 'ON' : 'OFF'}
            </button>

            <button
              type="button"
              onClick={() =>
                updateSlotSetting(selectedSlotForSwiper, {
                  show_arrows: !currentSlotConfig.show_arrows,
                })
              }
              className={`p-3 rounded-2xl border font-bold cursor-pointer ${
                currentSlotConfig.show_arrows
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-slate-100 border-slate-200 text-slate-600'
              }`}
            >
              Prev/Next Arrows: {currentSlotConfig.show_arrows ? 'ON' : 'OFF'}
            </button>

            <button
              type="button"
              onClick={() =>
                updateSlotSetting(selectedSlotForSwiper, {
                  show_dots: !currentSlotConfig.show_dots,
                })
              }
              className={`p-3 rounded-2xl border font-bold cursor-pointer ${
                currentSlotConfig.show_dots
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-slate-100 border-slate-200 text-slate-600'
              }`}
            >
              Pagination Dots: {currentSlotConfig.show_dots ? 'ON' : 'OFF'}
            </button>

            <button
              type="button"
              onClick={() =>
                updateSlotSetting(selectedSlotForSwiper, {
                  show_section_header: !currentSlotConfig.show_section_header,
                })
              }
              className={`p-3 rounded-2xl border font-bold cursor-pointer ${
                currentSlotConfig.show_section_header
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-slate-100 border-slate-200 text-slate-600'
              }`}
            >
              Section Header: {currentSlotConfig.show_section_header ? 'VISIBLE' : 'HIDDEN'}
            </button>
          </div>
        </div>
      )}

      {/* ── TAB 3: COUPONS & VOUCHERS ── */}
      {activeTab === 'coupons' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {coupons.map((c) => (
            <div
              key={c.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-purple-50 text-purple-700 font-mono font-black text-sm rounded-xl border border-purple-200">
                    {c.code}
                  </span>
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300">
                    {c.is_active ? 'Active' : 'Disabled'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium">{c.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── TAB 4: LEADS CRM ── */}
      {activeTab === 'leads' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <h3 className="font-black text-sm text-slate-900 dark:text-white">
            Captured Campaign & Voucher Inquiries ({leads.length})
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b">
                <tr>
                  <th className="p-3">Educator / Contact</th>
                  <th className="p-3">Email & Phone</th>
                  <th className="p-3">School / Organization</th>
                  <th className="p-3">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.map((l) => (
                  <tr key={l.id}>
                    <td className="p-3 font-bold">{l.name}</td>
                    <td className="p-3 font-mono text-purple-700">{l.email}</td>
                    <td className="p-3">{l.school_name}</td>
                    <td className="p-3">{l.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── MODAL: FULL CUSTOMIZATION STUDIO FOR AD / OFFER CARD ── */}
      {promoModalOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden my-auto">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
              <div>
                <h3 className="font-black text-base text-slate-900 dark:text-white">
                  {editingPromo
                    ? `Customize Campaign: ${editingPromo.title}`
                    : 'Create New Offer Card / Ad Banner / Popup'}
                </h3>
                <p className="text-[11px] text-slate-500">
                  Full control over Page Slot ID, Design Style (Adobe Card / Image Card / Hero Banner / Raw HTML), Pricing, and Action
                </p>
              </div>
              <button
                onClick={() => setPromoModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleSavePromo}
              className="p-6 space-y-4 overflow-y-auto flex-1 text-xs"
            >
              {/* Row 1: Slot Location & Design Style */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-blue-50/50 dark:bg-slate-800/60 border border-blue-200/70">
                <div>
                  <label className="font-black text-slate-800 dark:text-slate-200 block mb-1">
                    1. Page Location (Slot ID) *
                  </label>
                  <select
                    value={promoSlotId}
                    onChange={(e) => setPromoSlotId(e.target.value as AdSlotId)}
                    className="w-full p-2.5 border rounded-xl bg-white dark:bg-slate-900 font-bold text-[#0063eb]"
                  >
                    {AD_SLOTS_REGISTRY.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label} ({s.id})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-black text-slate-800 dark:text-slate-200 block mb-1">
                    2. Design Template *
                  </label>
                  <select
                    value={promoDesignStyle}
                    onChange={(e) =>
                      setPromoDesignStyle(e.target.value as AdDesignStyle)
                    }
                    className="w-full p-2.5 border rounded-xl bg-white dark:bg-slate-900 font-bold"
                  >
                    <option value="adobe_image_card">
                      Adobe Offer Card + Premium Bg Image
                    </option>
                    <option value="adobe_light_card">
                      Adobe Clean White Card (#ffffff)
                    </option>
                    <option value="full_hero_banner">
                      Full-Width Hero Banner Slide
                    </option>
                    <option value="custom_html">
                      Custom Raw HTML / CSS Block
                    </option>
                  </select>
                </div>

                <div>
                  <label className="font-black text-slate-800 dark:text-slate-200 block mb-1">
                    3. Button Action Type *
                  </label>
                  <select
                    value={promoActionType}
                    onChange={(e) =>
                      setPromoActionType(e.target.value as AdActionType)
                    }
                    className="w-full p-2.5 border rounded-xl bg-white dark:bg-slate-900 font-bold"
                  >
                    <option value="navigate">Navigate to Link (Same Tab)</option>
                    <option value="new_tab">Open Link in New Tab</option>
                    <option value="copy_coupon">Copy Promo Code & Navigate</option>
                    <option value="trigger_popup">Open Interactive Popup Modal</option>
                  </select>
                </div>
              </div>

              {promoDesignStyle === 'custom_html' ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="font-bold text-slate-700 block mb-1">
                        Campaign / Banner Name (Admin Reference) *
                      </label>
                      <input
                        type="text"
                        required
                        value={promoTitle}
                        onChange={(e) => setPromoTitle(e.target.value)}
                        className="w-full p-2.5 border rounded-xl bg-slate-50 font-bold"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-amber-800 block mb-1">
                        🎟️ Promo / Coupon Code (Shows on Card)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. KIDS50 or CSEEL55"
                        value={promoCouponCode}
                        onChange={(e) => setPromoCouponCode(e.target.value.toUpperCase())}
                        className="w-full p-2.5 border border-amber-300 rounded-xl bg-amber-50/60 font-mono font-black text-amber-900"
                      />
                    </div>
                  </div>

                  {/* 1-Click Pixel-Perfect HTML Banner Template Presets */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="font-black text-slate-800 text-xs flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>1-Click Pixel-Perfect HTML Banner Templates (Click to Load Code):</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setPromoCustomHtml(DEFAULT_ADOBE_HTML_SNIPPET)}
                        className="text-[11px] font-bold text-[#0063eb] hover:underline cursor-pointer"
                      >
                        Load Adobe Offer Card HTML
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {PIXEL_PERFECT_BANNER_TEMPLATES.map((tpl) => (
                        <button
                          key={tpl.id}
                          type="button"
                          onClick={() => {
                            setPromoTitle(tpl.name);
                            setPromoSubtitle(tpl.subtitle);
                            setPromoImageUrl(tpl.previewImage);
                            setPromoCustomHtml(tpl.html);
                          }}
                          className="p-2.5 rounded-xl border border-slate-200 bg-white hover:border-[#0063eb] hover:bg-blue-50/40 text-left flex items-center gap-2.5 transition-all cursor-pointer"
                        >
                          <img
                            src={tpl.previewImage}
                            alt={tpl.name}
                            className="w-12 h-10 rounded-lg object-cover shrink-0 border border-slate-200"
                          />
                          <div className="min-w-0">
                            <p className="font-black text-[11px] text-slate-900 truncate">
                              {tpl.name}
                            </p>
                            <p className="text-[10px] text-slate-500 truncate">
                              {tpl.subtitle}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-black text-slate-800 flex items-center gap-1.5">
                      <Code2 className="w-4 h-4 text-[#0063eb]" />
                      <span>Custom HTML / Inline CSS Code (Editable) *</span>
                    </label>
                    <textarea
                      rows={9}
                      value={promoCustomHtml}
                      onChange={(e) => setPromoCustomHtml(e.target.value)}
                      className="w-full p-3 border rounded-2xl font-mono text-xs bg-slate-950 text-emerald-300"
                    />
                  </div>

                  {/* Live HTML Render Preview inside Editor */}
                  {promoCustomHtml && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                        Live HTML Output Preview:
                      </span>
                      <div className="relative w-full overflow-hidden rounded-2xl border border-slate-200">
                        <div
                          className="w-full"
                          dangerouslySetInnerHTML={{
                            __html: promoCustomHtml.replace(
                              /\{\{COUPON_CODE\}\}/g,
                              promoCouponCode || ''
                            ),
                          }}
                        />
                        {promoCouponCode && (
                          <span className="absolute top-3 right-3 z-20 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 text-amber-300 border border-dashed border-amber-400/80 text-[11px] font-mono font-bold shadow-md">
                            🎟️ PROMO: {promoCouponCode}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* Title, Pill Badge & Icon */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="font-bold text-slate-700 block mb-1">
                        Card Title (e.g. CSEEL Science Pro) *
                      </label>
                      <input
                        type="text"
                        required
                        value={promoTitle}
                        onChange={(e) => setPromoTitle(e.target.value)}
                        className="w-full p-2.5 border rounded-xl bg-slate-50 font-bold"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Pill Badge Text (e.g. Special Offer)
                      </label>
                      <input
                        type="text"
                        value={promoBadgeText}
                        onChange={(e) => setPromoBadgeText(e.target.value)}
                        className="w-full p-2.5 border rounded-xl bg-slate-50 font-bold"
                      />
                    </div>
                  </div>

                  {/* Description & Terms Link */}
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Offer Description (Supports HTML) *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={promoContent}
                      onChange={(e) => setPromoContent(e.target.value)}
                      className="w-full p-2.5 border rounded-xl bg-slate-50 leading-relaxed"
                    />
                  </div>

                  {/* Pricing & CTA Row (Adobe Footer) */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Strikethrough Price
                      </label>
                      <input
                        type="text"
                        value={promoOldPrice}
                        onChange={(e) => setPromoOldPrice(e.target.value)}
                        placeholder="₹2,714.00/mo"
                        className="w-full p-2 border rounded-xl bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Offer Price
                      </label>
                      <input
                        type="text"
                        value={promoNewPrice}
                        onChange={(e) => setPromoNewPrice(e.target.value)}
                        placeholder="₹1,199.00"
                        className="w-full p-2 border rounded-xl bg-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Price Unit Text
                      </label>
                      <input
                        type="text"
                        value={promoPriceUnit}
                        onChange={(e) => setPromoPriceUnit(e.target.value)}
                        placeholder="/mo incl. GST"
                        className="w-full p-2 border rounded-xl bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Button Text
                      </label>
                      <input
                        type="text"
                        value={promoCtaText}
                        onChange={(e) => setPromoCtaText(e.target.value)}
                        placeholder="Buy"
                        className="w-full p-2 border rounded-xl bg-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Button Route / URL
                      </label>
                      <input
                        type="text"
                        value={promoCtaLink}
                        onChange={(e) => setPromoCtaLink(e.target.value)}
                        placeholder="/compare-plans"
                        className="w-full p-2 border rounded-xl bg-white font-mono"
                      />
                    </div>
                  </div>

                  {/* Premium Background Image Picker */}
                  <div className="space-y-2">
                    <label className="font-bold text-slate-700 block">
                      Premium Background Image URL (or pick from gallery below)
                    </label>
                    <input
                      type="text"
                      value={promoImageUrl}
                      onChange={(e) => setPromoImageUrl(e.target.value)}
                      placeholder="/images/experiments/red-chemiluminescence.jpg"
                      className="w-full p-2.5 border rounded-xl bg-slate-50 font-mono"
                    />
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                      {PRESET_PREMIUM_IMAGES.map((img) => (
                        <button
                          key={img.url}
                          type="button"
                          onClick={() => setPromoImageUrl(img.url)}
                          className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-bold shrink-0 flex items-center gap-1.5 cursor-pointer ${
                            promoImageUrl === img.url
                              ? 'border-[#0063eb] bg-blue-50 text-[#0063eb]'
                              : 'border-slate-200 bg-white text-slate-600'
                          }`}
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>{img.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Colors & Terms Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Border Color
                      </label>
                      <input
                        type="text"
                        value={promoBorderColor}
                        onChange={(e) => setPromoBorderColor(e.target.value)}
                        className="w-full p-2 border rounded-xl font-mono"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Button Bg Color
                      </label>
                      <input
                        type="text"
                        value={promoButtonBg}
                        onChange={(e) => setPromoButtonBg(e.target.value)}
                        className="w-full p-2 border rounded-xl font-mono"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Badge Bg Color
                      </label>
                      <input
                        type="text"
                        value={promoBadgeBg}
                        onChange={(e) => setPromoBadgeBg(e.target.value)}
                        className="w-full p-2 border rounded-xl font-mono"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Terms Link Text
                      </label>
                      <input
                        type="text"
                        value={promoTermsText}
                        onChange={(e) => setPromoTermsText(e.target.value)}
                        className="w-full p-2 border rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Promo Code
                      </label>
                      <input
                        type="text"
                        value={promoCouponCode}
                        onChange={(e) =>
                          setPromoCouponCode(e.target.value.toUpperCase())
                        }
                        className="w-full p-2 border rounded-xl font-mono font-bold"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Publish Status Toggle */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">
                    Run Immediately in Selected Page Slot ({promoSlotId})
                  </p>
                  <p className="text-[11px] text-slate-500">
                    When enabled, this card/banner renders live inside {promoSlotId}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPromoIsActive(!promoIsActive)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    promoIsActive
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {promoIsActive ? '● LIVE ON PAGE' : '○ Saved as Draft (Hidden)'}
                </button>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setPromoModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#0063eb] hover:bg-blue-700 text-white font-black rounded-xl shadow-md cursor-pointer"
                >
                  {editingPromo ? 'Save & Update Live Slot' : 'Save Campaign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: CREATE COUPON ── */}
      {couponModalOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-4">
            <h3 className="font-black text-base">Create Discount Promo Code</h3>
            <form onSubmit={handleSaveCoupon} className="space-y-3 text-xs">
              <input
                type="text"
                required
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="e.g. STEM50"
                className="w-full p-2.5 border rounded-xl font-mono font-bold"
              />
              <input
                type="text"
                value={couponDesc}
                onChange={(e) => setCouponDesc(e.target.value)}
                placeholder="Description"
                className="w-full p-2.5 border rounded-xl"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCouponModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 text-white font-black rounded-xl"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: LIVE CARD / BANNER PREVIEW ── */}
      {previewPromo && (
        <div
          className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto"
          onClick={() => setPreviewPromo(null)}
        >
          <div
            className={`bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 shadow-2xl w-full ${
              previewPromo.design_style === 'custom_html' ? 'max-w-5xl' : 'max-w-md'
            } p-6 space-y-4 my-auto`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-400 uppercase">
                Live Rendering Preview ({previewPromo.slot_id || 'slot_after_hero'})
              </span>
              <button
                onClick={() => setPreviewPromo(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {previewPromo.design_style === 'custom_html' && previewPromo.custom_html ? (
              <div
                className="w-full overflow-hidden rounded-2xl"
                dangerouslySetInnerHTML={{ __html: previewPromo.custom_html }}
              />
            ) : (
              <div
                style={{
                  background: '#ffffff',
                  border: `1px solid ${previewPromo.border_color || '#ea3829'}`,
                  borderRadius: '16px',
                  padding: '24px',
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg text-[#2c2c2c]">{previewPromo.title}</h3>
                  <span
                    style={{
                      backgroundColor: previewPromo.badge_bg_color || '#fae8ff',
                      color: previewPromo.badge_text_color || '#86198f',
                      fontSize: '12px',
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: '20px',
                    }}
                  >
                    {previewPromo.badge_text || 'Special Offer'}
                  </span>
                </div>
                <div
                  className="text-sm text-[#222222] mb-4"
                  dangerouslySetInnerHTML={{ __html: previewPromo.content }}
                />
                <div className="flex items-center justify-between pt-2">
                  <div>
                    {previewPromo.old_price && (
                      <span className="text-xs text-[#717171] line-through mr-2">
                        {previewPromo.old_price}
                      </span>
                    )}
                    <span className="text-lg font-bold text-[#111111]">
                      {previewPromo.new_price || '₹1,199.00'}
                    </span>
                  </div>
                  <span
                    style={{
                      backgroundColor: previewPromo.button_bg_color || '#0063eb',
                      color: '#ffffff',
                      borderRadius: '20px',
                      padding: '8px 24px',
                      fontSize: '14px',
                      fontWeight: 600,
                    }}
                  >
                    {previewPromo.cta_text || 'Buy'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketingAdminModule;
