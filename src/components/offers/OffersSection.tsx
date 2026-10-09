'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Tag,
  FlaskConical,
  Cpu,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Check,
  ArrowRight,
  X,
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { AdSlotId, MarketingPromotion } from '@/features/marketing/types';
import { useMarketingCampaigns } from '@/features/marketing/useMarketingCampaigns';
import { CSEELHtmlJsInjector } from '@/features/marketing/CSEELSlotRuntime';

interface OffersSectionProps {
  slotId?: AdSlotId;
  className?: string;
}

const DEFAULT_ICONS = [FlaskConical, Sparkles, Cpu];

export const OffersSection: React.FC<OffersSectionProps> = ({
  slotId = 'slot_after_hero',
  className = '',
}) => {
  const { promotions, slotSettings, hydrated } = useMarketingCampaigns();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [popupPromo, setPopupPromo] = useState<MarketingPromotion | null>(null);

  if (!hydrated) return null;

  const settings = slotSettings[slotId] || {
    slot_id: slotId,
    slides_per_view: 3,
    autoplay: true,
    autoplay_delay: 4500,
    show_arrows: true,
    show_dots: true,
    show_section_header: true,
    section_title: 'Special Offers & Featured Programs',
    section_badge: 'Special Offers & Events',
  };

  const activeItems = promotions
    .filter((p) => p.is_active && (p.slot_id || 'slot_after_hero') === slotId)
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

  // Initially empty: if no active campaigns are assigned to this slotId, render nothing
  if (activeItems.length === 0) return null;

  const prevBtnClass = `ad-swiper-prev-${slotId}`;
  const nextBtnClass = `ad-swiper-next-${slotId}`;
  const paginationClass = `ad-swiper-pagination-${slotId}`;

  const handleCopyPromoCode = (e: React.MouseEvent, item: MarketingPromotion) => {
    e.preventDefault();
    e.stopPropagation();
    if (!item.coupon_code) return;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(item.coupon_code).catch(() => {});
    }
    setCopiedId(item.id);
    setTimeout(() => setCopiedId((prev) => (prev === item.id ? null : prev)), 2200);
  };

  const handleActionClick = (e: React.MouseEvent, item: MarketingPromotion) => {
    if (item.action_type === 'trigger_popup') {
      e.preventDefault();
      setPopupPromo(item);
      return;
    }
    if (item.coupon_code) {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(item.coupon_code).catch(() => {});
      }
      setCopiedId(item.id);
      setTimeout(() => setCopiedId((prev) => (prev === item.id ? null : prev)), 2200);
    }
  };

  const renderCardByDesign = (item: MarketingPromotion, idx: number) => {
    const design = item.design_style || 'adobe_image_card';
    const FallbackIcon = DEFAULT_ICONS[idx % DEFAULT_ICONS.length];
    const borderColor = item.border_color || item.accent_color || '#ea3829';
    const badgeBg = item.badge_bg_color || '#fae8ff';
    const badgeColor = item.badge_text_color || '#86198f';
    const badgeText = item.badge_text || 'Special Offer';
    const buttonBg = item.button_bg_color || '#0063eb';
    const ctaHref = item.cta_link || '/compare-plans';
    const ctaText = item.cta_text || 'Buy';
    const termsText = item.terms_text || 'See terms';
    const termsHref = item.terms_link || ctaHref;
    const oldPrice = item.old_price ?? '₹2,714.00/mo';
    const newPrice = item.new_price ?? '₹1,199.00';
    const priceUnit = item.price_unit ?? '/mo incl. GST';
    const isCopied = copiedId === item.id;
    const linkTarget = item.action_type === 'new_tab' ? '_blank' : '_self';

    // 1. Custom Raw HTML + JS Mode (injected via CSEELHtmlJsInjector with window.CSEELAdSDK)
    if (design === 'custom_html' && item.custom_html) {
      return (
        <div className="relative w-full h-full flex justify-center">
          <CSEELHtmlJsInjector
            html={item.custom_html}
            couponCode={item.coupon_code || ''}
            promoId={item.id}
            className="w-full h-full flex justify-center"
          />
          {item.coupon_code && (
            <button
              type="button"
              onClick={(e) => handleCopyPromoCode(e, item)}
              title="Click to copy promo code"
              className="absolute top-3 right-3 z-20 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 hover:bg-slate-900 text-amber-300 border border-dashed border-amber-400/80 text-[11px] font-mono font-bold shadow-md backdrop-blur-xs transition-all cursor-pointer active:scale-95"
            >
              <Tag size={11} className="text-amber-400 shrink-0" />
              <span>
                {isCopied ? `✓ COPIED: ${item.coupon_code}` : `PROMO: ${item.coupon_code}`}
              </span>
            </button>
          )}
        </div>
      );
    }

    // 2. Full-Width Hero Banner Mode
    if (design === 'full_hero_banner') {
      const bgImg =
        item.image_url || '/images/hero/students-doing-chemistry-lab-experiment.webp';
      return (
        <div
          className="group relative rounded-2xl overflow-hidden min-h-[240px] md:min-h-[270px] flex items-center p-6 sm:p-10 shadow-lg transition-all duration-300"
          style={{ border: `1.5px solid ${borderColor}` }}
        >
          <img
            src={bgImg}
            alt={item.title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105 pointer-events-none"
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(95deg, rgba(10, 15, 29, 0.94) 0%, rgba(15, 23, 42, 0.84) 55%, rgba(15, 23, 42, 0.45) 100%)',
            }}
          />
          <div className="relative z-10 max-w-2xl space-y-3 text-white">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span
                style={{
                  backgroundColor: badgeBg,
                  color: badgeColor,
                  fontSize: '12px',
                  fontWeight: 700,
                  padding: '4px 12px',
                  borderRadius: '20px',
                }}
              >
                {badgeText}
              </span>
              {item.coupon_code && (
                <button
                  type="button"
                  onClick={(e) => handleCopyPromoCode(e, item)}
                  className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-white/15 hover:bg-white/25 border border-dashed border-amber-300/80 text-amber-300 cursor-pointer transition-all"
                >
                  {isCopied ? `✓ COPIED: ${item.coupon_code}` : `🎟️ CODE: ${item.coupon_code} (Copy)`}
                </button>
              )}
            </div>
            <h3
              className="text-2xl sm:text-3xl font-black tracking-tight leading-tight"
              style={{ color: '#ffffff' }}
            >
              {item.title}
            </h3>
            {item.subtitle && (
              <p className="text-xs sm:text-sm font-semibold text-sky-300">{item.subtitle}</p>
            )}
            <div
              className="text-sm text-white/85 leading-relaxed max-w-xl"
              dangerouslySetInnerHTML={{ __html: item.content }}
            />
            <div className="pt-2 flex items-center gap-5 flex-wrap">
              {(oldPrice || newPrice) && (
                <div className="flex items-baseline gap-2">
                  {oldPrice && (
                    <span className="text-xs text-white/60 line-through">{oldPrice}</span>
                  )}
                  {newPrice && (
                    <span className="text-xl font-bold text-white">
                      {newPrice}
                      <span className="text-xs font-normal text-white/75 ml-1">{priceUnit}</span>
                    </span>
                  )}
                </div>
              )}
              <Link
                href={ctaHref}
                target={linkTarget}
                onClick={(e) => handleActionClick(e, item)}
                style={{
                  backgroundColor: buttonBg,
                  color: '#ffffff',
                  borderRadius: '20px',
                  padding: '9px 26px',
                  fontSize: '14px',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
                className="inline-flex items-center gap-2 hover:opacity-95 active:scale-95 transition-all shadow-md"
              >
                <span>{isCopied ? 'Code Copied! ✓' : ctaText}</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      );
    }

    // 3. Adobe Clean White Card ('adobe_light_card') OR 4. Adobe Premium Background Image Card ('adobe_image_card')
    const isImageCard = design === 'adobe_image_card';
    const bgImg =
      item.image_url || '/images/experiments/red-chemiluminescence.jpg';

    return (
      <div
        className="group relative overflow-hidden h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(0,0,0,0.16)]"
        style={{
          background: isImageCard ? '#0f172a' : item.bg_color || '#ffffff',
          border: `1px solid ${borderColor}`,
          borderRadius: '14px',
          padding: '18px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '215px',
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        }}
      >
        {/* Optional Full-Bleed Premium Background Image */}
        {isImageCard && (
          <>
            <img
              src={bgImg}
              alt={item.title}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 pointer-events-none"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(160deg, rgba(10, 15, 28, 0.88) 0%, rgba(15, 23, 42, 0.78) 55%, rgba(10, 15, 28, 0.92) 100%)',
              }}
            />
          </>
        )}

        {/* Header Row: Icon + Title + Pill Badge */}
        <div
          className="relative z-10"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
            {item.icon_url ? (
              <img
                src={item.icon_url}
                alt={item.title}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  objectFit: 'contain',
                  flexShrink: 0,
                }}
              />
            ) : (
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: `linear-gradient(135deg, ${borderColor} 0%, ${buttonBg} 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <FallbackIcon className="w-4 h-4 text-white" />
              </div>
            )}
            <h3
              className="truncate"
              style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: 700,
                color: isImageCard ? '#ffffff' : '#2c2c2c',
                letterSpacing: '-0.2px',
              }}
            >
              {item.title}
            </h3>
          </div>

          <div
            style={{
              backgroundColor: badgeBg,
              color: badgeColor,
              fontSize: '12px',
              fontWeight: 600,
              padding: '4px 10px',
              borderRadius: '20px',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            {badgeText}
          </div>
        </div>

        {/* Body Description + Underlined See terms + Promo Code Pill */}
        <div
          className="relative z-10"
          style={{
            fontSize: '14px',
            lineHeight: 1.5,
            color: isImageCard ? 'rgba(255,255,255,0.92)' : '#222222',
            marginBottom: '18px',
          }}
        >
          <div
            style={{ margin: '0 0 10px 0' }}
            dangerouslySetInnerHTML={{ __html: item.content }}
          />
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <Link
              href={termsHref}
              target={linkTarget}
              style={{
                color: isImageCard ? '#ffffff' : '#000000',
                textDecoration: 'underline',
                fontWeight: 500,
                fontSize: '13px',
              }}
            >
              {termsText}
            </Link>
            {item.coupon_code && (
              <button
                type="button"
                onClick={(e) => handleCopyPromoCode(e, item)}
                title="Click to copy promo code"
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md border border-dashed text-[11px] font-mono font-bold cursor-pointer transition-all active:scale-95 ${
                  isImageCard
                    ? 'bg-white/15 hover:bg-white/25 text-amber-300 border-amber-300/70'
                    : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-400'
                }`}
              >
                <Tag size={10} className="shrink-0" />
                <span>
                  {isCopied ? `✓ COPIED: ${item.coupon_code}` : `CODE: ${item.coupon_code}`}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Footer with Price & Pill Button */}
        <div
          className="relative z-10"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 'auto',
            gap: '8px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '8px',
              flexWrap: 'wrap',
            }}
          >
            {oldPrice && (
              <span
                style={{
                  fontSize: '13px',
                  color: isImageCard ? 'rgba(255,255,255,0.62)' : '#717171',
                  textDecoration: 'line-through',
                }}
              >
                {oldPrice}
              </span>
            )}
            {newPrice && (
              <span
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: isImageCard ? '#ffffff' : '#111111',
                }}
              >
                {newPrice}
                {priceUnit && (
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: 400,
                      color: isImageCard ? 'rgba(255,255,255,0.78)' : '#4b5563',
                      marginLeft: '2px',
                    }}
                  >
                    {priceUnit}
                  </span>
                )}
              </span>
            )}
          </div>

          <Link
            href={ctaHref}
            target={linkTarget}
            onClick={(e) => handleActionClick(e, item)}
            style={{
              backgroundColor: buttonBg,
              color: '#ffffff',
              border: 'none',
              borderRadius: '20px',
              padding: '8px 24px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
            className="hover:opacity-90 active:scale-95 transition-all"
          >
            {isCopied ? (
              <>
                <Check size={14} />
                <span>Copied</span>
              </>
            ) : (
              <span>{ctaText}</span>
            )}
          </Link>
        </div>
      </div>
    );
  };

  const spv = settings.slides_per_view || 3;

  return (
    <section
      id={`cseel-ad-slot-${slotId}`}
      data-slot-id={slotId}
      aria-label={settings.section_badge || 'Special Offers & Events'}
      className={`py-7 bg-white border-b border-slate-200/80 overflow-hidden ${className}`}
    >
      <div className="container mx-auto px-4 max-w-[1240px]">
        {/* Optional Header Row with Swiper Arrows */}
        {(settings.show_section_header || settings.show_arrows) && (
          <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
            {settings.show_section_header ? (
              <div className="flex items-center gap-2">
                <Tag size={17} className="text-[#ea3829]" />
                <p className="text-xs font-bold text-primary uppercase tracking-widest">
                  {settings.section_badge || 'Special Offers & Events'}
                </p>
              </div>
            ) : (
              <div />
            )}

            {settings.show_arrows && activeItems.length > 1 && (
              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  aria-label="Previous offer slide"
                  className={`${prevBtnClass} w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs`}
                >
                  <ChevronLeft size={17} />
                </button>
                <button
                  type="button"
                  aria-label="Next offer slide"
                  className={`${nextBtnClass} w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs`}
                >
                  <ChevronRight size={17} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Swiper Carousel */}
        <Swiper
          key={`swiper-${slotId}-${spv}-${settings.autoplay}-${activeItems.length}`}
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={20}
          slidesPerView={1}
          speed={550}
          loop={activeItems.length > spv}
          autoplay={
            settings.autoplay
              ? {
                  delay: settings.autoplay_delay || 4500,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }
              : false
          }
          navigation={
            settings.show_arrows
              ? {
                  prevEl: `.${prevBtnClass}`,
                  nextEl: `.${nextBtnClass}`,
                }
              : false
          }
          pagination={
            settings.show_dots
              ? {
                  clickable: true,
                  el: `.${paginationClass}`,
                  bulletClass:
                    'inline-block w-2 h-2 bg-slate-300 rounded-full cursor-pointer transition-all duration-300 mx-1',
                  bulletActiveClass: '!bg-[#0063eb] !w-6',
                }
              : false
          }
          breakpoints={{
            640: { slidesPerView: Math.min(2, spv), spaceBetween: 18 },
            1024: { slidesPerView: spv, spaceBetween: 22 },
          }}
          className="w-full overflow-hidden py-1"
        >
          {activeItems.map((item, idx) => (
            <SwiperSlide key={item.id} className="!h-auto">
              {renderCardByDesign(item, idx)}
            </SwiperSlide>
          ))}
        </Swiper>

        {settings.show_dots && activeItems.length > 1 && (
          <div className={`${paginationClass} !flex !justify-center !items-center !gap-1 !mt-6`} />
        )}
      </div>

      {/* Action-Triggered Popup Modal */}
      {popupPromo && (
        <div
          className="fixed inset-0 z-[99999] bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setPopupPromo(null)}
        >
          <div
            className="relative w-full max-w-[440px]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPopupPromo(null)}
              className="absolute -top-3 -right-3 z-30 w-8 h-8 rounded-full bg-slate-900 text-white border border-white/20 flex items-center justify-center shadow-lg cursor-pointer"
            >
              <X size={16} />
            </button>
            {renderCardByDesign(
              { ...popupPromo, action_type: 'navigate' },
              0
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default OffersSection;
