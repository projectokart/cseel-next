'use client';

import React, { useState } from 'react';
import {
  Megaphone, Plus, Trash2, Edit3, Eye, Tag, Gift,
  Search, X
} from 'lucide-react';
import { MarketingPromotion, CouponVoucher, PromotionType, PromoStatus } from '@/features/marketing/types';
import { INITIAL_PROMOTIONS, INITIAL_COUPONS, INITIAL_LEADS } from '@/features/marketing/data/marketingSeed';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

export const MarketingAdminModule: React.FC = () => {
  const { addAuditLog } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<'promotions' | 'coupons' | 'leads'>('promotions');
  const [promoTypeFilter, setPromoTypeFilter] = useState<string>('all');
  
  // Data states
  const [promotions, setPromotions] = useState<MarketingPromotion[]>(INITIAL_PROMOTIONS);
  const [coupons, setCoupons] = useState<CouponVoucher[]>(INITIAL_COUPONS);
  const [leads] = useState(INITIAL_LEADS);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [promoModalOpen, setPromoModalOpen] = useState(false);
  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<MarketingPromotion | null>(null);
  const [editingCoupon, setEditingCoupon] = useState<CouponVoucher | null>(null);
  const [previewPromo, setPreviewPromo] = useState<MarketingPromotion | null>(null);

  // Form states for Promotion
  const [promoTitle, setPromoTitle] = useState('');
  const [promoSubtitle, setPromoSubtitle] = useState('');
  const [promoContent, setPromoContent] = useState('');
  const [promoType, setPromoType] = useState<PromotionType>('offer');
  const [promoCtaText, setPromoCtaText] = useState('Learn More');
  const [promoCtaLink, setPromoCtaLink] = useState('/');
  const [promoBadgeText, setPromoBadgeText] = useState('SPECIAL OFFER');
  const [promoBgColor, setPromoBgColor] = useState('#eff6ff');
  const [promoAccentColor, setPromoAccentColor] = useState('#2563eb');
  const [promoImageUrl, setPromoImageUrl] = useState('');
  const [promoDiscount, setPromoDiscount] = useState<number | ''>('');
  const [promoCouponCode, setPromoCouponCode] = useState('');
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

  const openNewPromoModal = () => {
    setEditingPromo(null);
    setPromoTitle('');
    setPromoSubtitle('');
    setPromoContent('');
    setPromoType('offer');
    setPromoCtaText('Learn More');
    setPromoCtaLink('/');
    setPromoBadgeText('SPECIAL DEAL');
    setPromoBgColor('#eff6ff');
    setPromoAccentColor('#2563eb');
    setPromoImageUrl('');
    setPromoDiscount('');
    setPromoCouponCode('');
    setPromoIsActive(true);
    setPromoModalOpen(true);
  };

  const openEditPromoModal = (p: MarketingPromotion) => {
    setEditingPromo(p);
    setPromoTitle(p.title);
    setPromoSubtitle(p.subtitle || '');
    setPromoContent(p.content);
    setPromoType(p.type);
    setPromoCtaText(p.cta_text || 'Learn More');
    setPromoCtaLink(p.cta_link || '/');
    setPromoBadgeText(p.badge_text || 'PROMO');
    setPromoBgColor(p.bg_color || '#eff6ff');
    setPromoAccentColor(p.accent_color || '#2563eb');
    setPromoImageUrl(p.image_url || '');
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

    if (editingPromo) {
      const updated: MarketingPromotion = {
        ...editingPromo,
        title: promoTitle.trim(),
        subtitle: promoSubtitle.trim() || undefined,
        content: promoContent.trim(),
        type: promoType,
        cta_text: promoCtaText.trim() || undefined,
        cta_link: promoCtaLink.trim() || undefined,
        badge_text: promoBadgeText.trim() || undefined,
        bg_color: promoBgColor,
        accent_color: promoAccentColor,
        image_url: promoImageUrl.trim() || undefined,
        discount_percentage: promoDiscount ? Number(promoDiscount) : undefined,
        coupon_code: promoCouponCode.trim() || undefined,
        status: promoIsActive ? 'published' : 'draft',
        is_active: promoIsActive,
        updated_at: new Date().toISOString(),
      };
      setPromotions(promotions.map((p) => (p.id === updated.id ? updated : p)));
      addAuditLog('EDIT_PROMOTION', 'marketing_growth', `Updated marketing promotion: ${updated.title}`);
    } else {
      const created: MarketingPromotion = {
        id: `promo-${Date.now()}`,
        title: promoTitle.trim(),
        subtitle: promoSubtitle.trim() || undefined,
        content: promoContent.trim(),
        type: promoType,
        cta_text: promoCtaText.trim() || undefined,
        cta_link: promoCtaLink.trim() || undefined,
        badge_text: promoBadgeText.trim() || undefined,
        bg_color: promoBgColor,
        accent_color: promoAccentColor,
        image_url: promoImageUrl.trim() || undefined,
        discount_percentage: promoDiscount ? Number(promoDiscount) : undefined,
        coupon_code: promoCouponCode.trim() || undefined,
        status: promoIsActive ? 'published' : 'draft',
        is_active: promoIsActive,
        views_count: 0,
        clicks_count: 0,
        sort_order: promotions.length + 1,
        target_pages: ['/'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setPromotions([created, ...promotions]);
      addAuditLog('CREATE_PROMOTION', 'marketing_growth', `Created new ${promoType} promotion: ${created.title}`);
    }
    setPromoModalOpen(false);
  };

  const handleTogglePromoActive = (id: string, current: boolean) => {
    const updated = promotions.map((p) => (p.id === id ? { ...p, is_active: !current, status: !current ? ('published' as PromoStatus) : ('draft' as PromoStatus) } : p));
    setPromotions(updated);
    addAuditLog('TOGGLE_PROMOTION', 'marketing_growth', `Toggled promotion ${id} to ${!current ? 'Active' : 'Draft'}`);
  };

  const handleDeletePromo = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete marketing campaign: "${title}"?`)) {
      setPromotions(promotions.filter((p) => p.id !== id));
      addAuditLog('DELETE_PROMOTION', 'marketing_growth', `Deleted promotion campaign: ${title}`);
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
    if (!couponCode.trim()) {
      alert('Coupon code is required');
      return;
    }

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
      addAuditLog('EDIT_COUPON', 'marketing_growth', `Updated promo coupon code: ${updated.code}`);
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
      addAuditLog('CREATE_COUPON', 'marketing_growth', `Created new discount voucher: ${created.code}`);
    }
    setCouponModalOpen(false);
  };

  const handleToggleCoupon = (id: string, current: boolean) => {
    setCoupons(coupons.map((c) => (c.id === id ? { ...c, is_active: !current } : c)));
    addAuditLog('TOGGLE_COUPON', 'marketing_growth', `Toggled coupon ${id} to ${!current ? 'Active' : 'Disabled'}`);
  };

  const handleDeleteCoupon = (id: string, code: string) => {
    if (confirm(`Delete coupon voucher code: ${code}?`)) {
      setCoupons(coupons.filter((c) => c.id !== id));
      addAuditLog('DELETE_COUPON', 'marketing_growth', `Deleted coupon voucher: ${code}`);
    }
  };

  // Filtered lists
  const filteredPromotions = promotions.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = promoTypeFilter === 'all' || p.type === promoTypeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* ── HEADER ── */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 rounded-full text-xs font-black text-amber-800 dark:text-amber-300">
            <Megaphone className="w-3.5 h-3.5 text-amber-600" />
            <span>MARKETING, ADVERTISEMENTS & GROWTH DESK</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Promotions, Special Offers & Campaign CMS
          </h2>
          <p className="text-xs text-slate-500 max-w-2xl">
            Live management of Special Offers & Events cards, announcement tickers, discount popup modals, homepage advertisement banners, discount promo codes, and institutional leads.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={openNewPromoModal}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-black text-xs rounded-2xl shadow-md transition-all flex items-center gap-2 shrink-0 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Offer / Banner</span>
          </button>
          <button
            onClick={openNewCouponModal}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-black text-xs rounded-2xl shadow-md transition-all flex items-center gap-2 shrink-0 active:scale-95"
          >
            <Tag className="w-4 h-4" />
            <span>Create Promo Code</span>
          </button>
        </div>
      </div>

      {/* ── METRICS TILES ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Live Promotions</span>
          <p className="text-xl font-black text-slate-900 dark:text-white">
            {promotions.filter((p) => p.is_active).length} / {promotions.length}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Active Coupon Codes</span>
          <p className="text-xl font-black text-purple-600 dark:text-purple-400">
            {coupons.filter((c) => c.is_active).length} Codes
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Total Campaign Impressions</span>
          <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">
            {promotions.reduce((acc, p) => acc + (p.views_count || 0), 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Captured Leads</span>
          <p className="text-xl font-black text-amber-600 dark:text-amber-400">
            {leads.length} Inquiries
          </p>
        </div>
      </div>

      {/* ── NAVIGATION TABS ── */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('promotions')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
            activeTab === 'promotions'
              ? 'bg-amber-500 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Megaphone className="w-3.5 h-3.5" />
          <span>Offers, Popups & Banners ({promotions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('coupons')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
            activeTab === 'coupons'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>Promo Codes & Vouchers ({coupons.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('leads')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
            activeTab === 'leads'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Gift className="w-3.5 h-3.5" />
          <span>Campaign Leads CRM ({leads.length})</span>
        </button>
      </div>

      {/* ── TAB 1: PROMOTIONS & POPUPS ── */}
      {activeTab === 'promotions' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search promotion headlines, coupons, or text..."
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <button
                onClick={() => setPromoTypeFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  promoTypeFilter === 'all' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                }`}
              >
                All Types
              </button>
              <button
                onClick={() => setPromoTypeFilter('offer')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  promoTypeFilter === 'offer' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                }`}
              >
                Special Offer Cards
              </button>
              <button
                onClick={() => setPromoTypeFilter('announcement')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  promoTypeFilter === 'announcement' ? 'bg-purple-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                }`}
              >
                Top Tickers
              </button>
              <button
                onClick={() => setPromoTypeFilter('popup')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  promoTypeFilter === 'popup' ? 'bg-amber-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                }`}
              >
                Offer Popups
              </button>
              <button
                onClick={() => setPromoTypeFilter('hero_banner')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  promoTypeFilter === 'hero_banner' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                }`}
              >
                Hero Ads
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPromotions.map((p) => (
              <div
                key={p.id}
                className={`bg-white dark:bg-slate-900 rounded-3xl p-5 border transition-all flex flex-col justify-between space-y-4 shadow-2xs ${
                  p.is_active ? 'border-slate-200 dark:border-slate-800' : 'border-dashed border-slate-300 dark:border-slate-700 opacity-75'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                        p.type === 'offer'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : p.type === 'announcement'
                          ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300'
                          : p.type === 'popup'
                          ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300'
                          : 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300'
                      }`}>
                        {p.type.replace('_', ' ')}
                      </span>
                      {p.badge_text && (
                        <span className="text-[10px] font-black px-2 py-0.5 bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 rounded-full">
                          {p.badge_text}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleTogglePromoActive(p.id, p.is_active)}
                        className={`text-[10px] font-black px-2.5 py-1 rounded-full border transition-all ${
                          p.is_active
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : 'bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {p.is_active ? '● Published (Live)' : '○ Draft (Hidden)'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-black text-base text-slate-900 dark:text-white leading-snug">
                      {p.title}
                    </h3>
                    {p.subtitle && (
                      <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mt-0.5">
                        {p.subtitle}
                      </p>
                    )}
                    <div 
                      className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: p.content }}
                    />
                  </div>

                  {/* Highlights */}
                  <div className="flex items-center gap-2 flex-wrap text-[11px]">
                    {p.coupon_code && (
                      <span className="px-2 py-0.5 bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 rounded-md font-mono font-bold border border-purple-200">
                        Code: {p.coupon_code}
                      </span>
                    )}
                    {p.discount_percentage && (
                      <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-md font-bold border border-emerald-200">
                        {p.discount_percentage}% Instant OFF
                      </span>
                    )}
                    {p.cta_text && (
                      <span className="text-slate-400 font-medium">
                        CTA: <strong className="text-slate-700 dark:text-slate-300">{p.cta_text}</strong> ({p.cta_link})
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="text-[10px] text-slate-400 space-x-2">
                    <span>👁️ {(p.views_count || 0).toLocaleString()} views</span>
                    <span>👆 {(p.clicks_count || 0).toLocaleString()} clicks</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPreviewPromo(p)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950 transition-all"
                      title="Live Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openEditPromoModal(p)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 transition-all"
                      title="Edit Campaign"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePromo(p.id, p.title)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-all"
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

      {/* ── TAB 2: COUPONS & VOUCHERS ── */}
      {activeTab === 'coupons' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {coupons.map((c) => (
              <div
                key={c.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-mono font-black text-sm rounded-xl border border-purple-200 tracking-wider">
                      {c.code}
                    </span>
                    <button
                      onClick={() => handleToggleCoupon(c.id, c.is_active)}
                      className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                        c.is_active
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-slate-100 text-slate-500 border-slate-300 dark:bg-slate-800'
                      }`}
                    >
                      {c.is_active ? 'Active' : 'Disabled'}
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                    {c.description}
                  </p>

                  <div className="text-xs space-y-1 text-slate-500">
                    <p>
                      Discount: <strong className="text-purple-600 font-black">{c.discount_type === 'percentage' ? `${c.discount_value}% OFF` : `₹${c.discount_value} FLAT`}</strong>
                    </p>
                    <p>Min Order: <strong>₹{c.min_order_value?.toLocaleString()}</strong></p>
                    <p>Applicable: <strong>{c.applicable_category}</strong></p>
                    <p>Used: <strong>{c.used_count} / {c.usage_limit} times</strong></p>
                    <p>Valid Until: <strong>{c.valid_until}</strong></p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-1">
                  <button
                    onClick={() => handleDeleteCoupon(c.id, c.code)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 3: LEADS CRM ── */}
      {activeTab === 'leads' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-sm text-slate-900 dark:text-white">
              Captured Campaign & Voucher Inquiries
            </h3>
            <span className="text-xs text-slate-500">Total Leads: {leads.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3">Educator / Contact</th>
                  <th className="p-3">Email & Phone</th>
                  <th className="p-3">School / Organization</th>
                  <th className="p-3">Source Channel</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {leads.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{l.name || 'Anonymous User'}</td>
                    <td className="p-3">
                      <p className="font-mono text-purple-700 dark:text-purple-300">{l.email}</p>
                      {l.phone && <p className="text-slate-400 text-[11px]">{l.phone}</p>}
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">{l.school_name || 'Direct Visitor'}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 rounded-md font-mono text-[10px]">
                        {l.source}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400 text-[11px]">{new Date(l.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── MODAL: CREATE / EDIT PROMOTION ── */}
      {promoModalOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in-50">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden my-auto">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-950">
              <h3 className="font-black text-base text-slate-900 dark:text-white">
                {editingPromo ? 'Edit Marketing Promotion' : 'Create New Offer / Banner'}
              </h3>
              <button onClick={() => setPromoModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePromo} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Promotion Type</label>
                  <select
                    value={promoType}
                    onChange={(e) => setPromoType(e.target.value as PromotionType)}
                    className="w-full p-2.5 border rounded-xl bg-slate-50 dark:bg-slate-800"
                  >
                    <option value="offer">Special Offer Card (Homepage Cards)</option>
                    <option value="announcement">Top Announcement Bar / Ticker</option>
                    <option value="popup">Offer Popup Modal</option>
                    <option value="hero_banner">Homepage Hero Ad Banner</option>
                    <option value="card_ad">Card Advertisement</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={promoBadgeText}
                    onChange={(e) => setPromoBadgeText(e.target.value)}
                    placeholder="e.g. FLASH DEAL, SPECIAL GRANT"
                    className="w-full p-2.5 border rounded-xl bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Headline / Title *</label>
                <input
                  type="text"
                  required
                  value={promoTitle}
                  onChange={(e) => setPromoTitle(e.target.value)}
                  placeholder="e.g. Early Bird Discount – 20% Off"
                  className="w-full p-2.5 border rounded-xl bg-slate-50 dark:bg-slate-800 font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Subtitle (Optional)</label>
                <input
                  type="text"
                  value={promoSubtitle}
                  onChange={(e) => setPromoSubtitle(e.target.value)}
                  placeholder="e.g. Limited Period Institutional Grant"
                  className="w-full p-2.5 border rounded-xl bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Content / Promotional Copy (Supports HTML) *</label>
                <textarea
                  required
                  rows={3}
                  value={promoContent}
                  onChange={(e) => setPromoContent(e.target.value)}
                  placeholder="Enroll in any CSEEL science course before <strong>April 30</strong> and get 20% off..."
                  className="w-full p-2.5 border rounded-xl bg-slate-50 dark:bg-slate-800 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    value={promoCtaText}
                    onChange={(e) => setPromoCtaText(e.target.value)}
                    placeholder="e.g. Enroll Now, Book a Demo"
                    className="w-full p-2.5 border rounded-xl bg-slate-50 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">CTA Destination Route</label>
                  <input
                    type="text"
                    value={promoCtaLink}
                    onChange={(e) => setPromoCtaLink(e.target.value)}
                    placeholder="e.g. /courses or /demo"
                    className="w-full p-2.5 border rounded-xl bg-slate-50 dark:bg-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Background Color</label>
                  <input
                    type="text"
                    value={promoBgColor}
                    onChange={(e) => setPromoBgColor(e.target.value)}
                    placeholder="e.g. #eff6ff, #f0fdf4, #fffbeb"
                    className="w-full p-2.5 border rounded-xl bg-slate-50 dark:bg-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Accent / Button Color</label>
                  <input
                    type="text"
                    value={promoAccentColor}
                    onChange={(e) => setPromoAccentColor(e.target.value)}
                    placeholder="e.g. #2563eb, #16a34a, #d97706"
                    className="w-full p-2.5 border rounded-xl bg-slate-50 dark:bg-slate-800 font-mono"
                  />
                </div>
              </div>

              {/* Publish Toggle */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Publish Status</p>
                  <p className="text-[11px] text-slate-500">Enable to make live on website immediately</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPromoIsActive(!promoIsActive)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                    promoIsActive ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {promoIsActive ? '🌐 Live (Published)' : '🔒 Draft (Hidden)'}
                </button>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setPromoModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-black rounded-xl shadow-md"
                >
                  {editingPromo ? 'Save Changes' : 'Create Offer Card'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: CREATE / EDIT COUPON ── */}
      {couponModalOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-md p-6 space-y-4">
            <h3 className="font-black text-base text-slate-900 dark:text-white">Create Discount Promo Code</h3>
            <form onSubmit={handleSaveCoupon} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="e.g. STEM50"
                  className="w-full p-2.5 border rounded-xl bg-slate-50 dark:bg-slate-800 font-mono font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Description</label>
                <input
                  type="text"
                  value={couponDesc}
                  onChange={(e) => setCouponDesc(e.target.value)}
                  placeholder="e.g. Flat 25% discount for institutional lab kits"
                  className="w-full p-2.5 border rounded-xl bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Discount Type</label>
                  <select
                    value={couponType}
                    onChange={(e) => setCouponType(e.target.value as any)}
                    className="w-full p-2.5 border rounded-xl bg-slate-50 dark:bg-slate-800"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Cash (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Value ({couponType === 'percentage' ? '%' : '₹'})</label>
                  <input
                    type="number"
                    required
                    value={couponVal}
                    onChange={(e) => setCouponVal(Number(e.target.value))}
                    className="w-full p-2.5 border rounded-xl bg-slate-50 dark:bg-slate-800 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Min Order (₹)</label>
                  <input
                    type="number"
                    value={couponMinOrder}
                    onChange={(e) => setCouponMinOrder(Number(e.target.value))}
                    className="w-full p-2.5 border rounded-xl bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Max Usages</label>
                  <input
                    type="number"
                    value={couponLimit}
                    onChange={(e) => setCouponLimit(Number(e.target.value))}
                    className="w-full p-2.5 border rounded-xl bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Valid Until</label>
                <input
                  type="date"
                  value={couponValidUntil}
                  onChange={(e) => setCouponValidUntil(e.target.value)}
                  className="w-full p-2.5 border rounded-xl bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setCouponModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-purple-600 text-white font-black rounded-xl shadow-md"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: LIVE PREVIEW ── */}
      {previewPromo && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm" onClick={() => setPreviewPromo(null)}>
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-400 uppercase">Live Rendering Preview</span>
              <button onClick={() => setPreviewPromo(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {previewPromo.type === 'offer' && (
              <div
                style={{
                  background: previewPromo.bg_color || '#eff6ff',
                  borderRadius: 20,
                  padding: '24px',
                  border: `1px solid ${previewPromo.accent_color || '#2563eb'}20`,
                }}
                className="flex flex-col space-y-3"
              >
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>
                  {previewPromo.title}
                </h3>
                <div
                  style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.6 }}
                  dangerouslySetInnerHTML={{ __html: previewPromo.content }}
                />
                {previewPromo.cta_text && (
                  <span style={{ color: previewPromo.accent_color || '#2563eb', fontWeight: 700, fontSize: 14 }}>
                    {previewPromo.cta_text} →
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketingAdminModule;
