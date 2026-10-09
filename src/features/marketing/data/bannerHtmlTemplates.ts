export interface BannerHtmlTemplatePreset {
  id: string;
  name: string;
  subtitle: string;
  previewImage: string;
  html: string;
}

export const BANNER_1_SCIENCE_KIDS_HTML = `<div class="cseel-tpl-1">
  <style>
    .cseel-tpl-1 {
      width: 100%;
      min-height: 245px;
      max-height: 265px;
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      display: flex;
      flex-direction: row;
      box-shadow: 0 6px 24px rgba(15,23,42,0.07);
      border: 1px solid #e2e8f0;
      position: relative;
      font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .cseel-tpl-1__left {
      flex: 1 1 54%;
      background: #ffffff;
      position: relative;
      display: flex;
      align-items: center;
      padding: 20px 20px 20px 38px;
      box-sizing: border-box;
    }
    .cseel-tpl-1__bar {
      position: absolute;
      left: 0;
      top: 28%;
      width: 18px;
      height: 88px;
      background-color: #f0c50d;
    }
    .cseel-tpl-1__right {
      flex: 1 1 46%;
      min-height: 245px;
      max-height: 265px;
      position: relative;
      background-color: #8c9aa5;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      overflow: hidden;
    }
    .cseel-tpl-1__img {
      width: 100%;
      height: 100%;
      min-height: 245px;
      max-height: 265px;
      object-fit: cover;
      object-position: top center;
      display: block;
    }
    @media (max-width: 767px) {
      .cseel-tpl-1 {
        flex-direction: column;
        min-height: auto;
        max-height: none;
      }
      .cseel-tpl-1__left {
        padding: 18px 16px 14px 24px;
      }
      .cseel-tpl-1__bar {
        top: 20px;
        width: 10px;
        height: 64px;
      }
      .cseel-tpl-1__right {
        min-height: 175px;
        max-height: 185px;
        height: 180px;
        width: 100%;
      }
      .cseel-tpl-1__img {
        min-height: 175px;
        max-height: 185px;
        height: 180px;
        object-fit: contain;
        object-position: bottom center;
      }
    }
  </style>
  <div class="cseel-tpl-1__left">
    <div class="cseel-tpl-1__bar"></div>
    <div style="max-width: 320px; text-align: left;">
      <p style="margin: 0 0 4px 0; font-size: 10.5px; font-weight: 600; letter-spacing: 1.8px; color: #333333; text-transform: uppercase;">SCIENCE LEARNING</p>
      <h2 style="margin: 0 0 8px 0; font-size: clamp(20px, 2.2vw, 27px); font-weight: 800; line-height: 1.1; color: #111111 !important; letter-spacing: -0.3px;">Science<br/>for Kids</h2>
      <p style="margin: 0 0 8px 0; font-size: 12.5px; line-height: 1.5; color: #444444; font-weight: 400; font-family: 'Open Sans', Arial, sans-serif; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">Hands-on virtual science experiments and interactive STEM labs designed for curious young learners.</p>
      <p style="margin: 0 0 12px 0; font-size: 11px; color: #666666; font-family: 'Open Sans', Arial, sans-serif;">Images from <a href="/domain/science" style="color: #444444; text-decoration: underline; text-underline-offset: 2px;">Freepik</a></p>
      <a href="/domain/science" style="display: inline-block; background-color: #061a9b; color: #ffffff; font-size: 11px; font-weight: 700; letter-spacing: 1.3px; text-transform: uppercase; padding: 9px 22px; text-decoration: none; border-radius: 0px;">READ MORE</a>
    </div>
  </div>
  <div class="cseel-tpl-1__right">
    <img class="cseel-tpl-1__img" src="/images/banners/banner-1-science-kid.webp" alt="Science for Kids" />
  </div>
</div>`;

export const BANNER_2_VR_IMMERSIVE_HTML = `<div class="cseel-tpl-2">
  <style>
    .cseel-tpl-2 {
      width: 100%;
      min-height: 245px;
      max-height: 265px;
      border-radius: 16px;
      overflow: hidden;
      position: relative;
      display: flex;
      align-items: center;
      background-color: #4780ab;
      background-image: url('/images/banners/banner-2-vr-clean-bg.webp');
      background-size: cover;
      background-position: center right;
      box-shadow: 0 6px 24px rgba(15,23,42,0.07);
      font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .cseel-tpl-2__content {
      position: relative;
      z-index: 2;
      max-width: 58%;
      padding: 20px 18px 20px 26px;
      box-sizing: border-box;
      text-align: left;
    }
    .cseel-tpl-2__mobile-img-wrap {
      display: none;
    }
    @media (max-width: 767px) {
      .cseel-tpl-2 {
        flex-direction: column;
        min-height: auto;
        max-height: none;
        background-image: linear-gradient(180deg, #5676a9 0%, #3d719f 100%);
      }
      .cseel-tpl-2__content {
        max-width: 100%;
        padding: 18px 18px 12px 18px;
      }
      .cseel-tpl-2__mobile-img-wrap {
        display: block;
        width: 100%;
        height: 175px;
        overflow: hidden;
        position: relative;
      }
      .cseel-tpl-2__mobile-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: right center;
        display: block;
      }
    }
  </style>
  <div class="cseel-tpl-2__content">
    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px;">
      <div style="width: 44px; height: 44px; border-radius: 50%; background-color: #ffffff; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 4px 12px rgba(0,0,0,0.12);">
        <span style="font-size: 24px; font-weight: 800; color: #ef6c24; font-family: 'Montserrat', Arial, sans-serif; line-height: 1;">A</span>
      </div>
      <p style="margin: 0; font-size: 12px; font-style: italic; line-height: 1.4; color: rgba(255,255,255,0.95); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">Immersive 3D Virtual Reality Science Labs for interactive classroom learning.</p>
    </div>
    <p style="margin: 0 0 10px 0; font-size: 12.5px; font-weight: 700; line-height: 1.5; color: #ffffff; max-width: 320px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">Article evident arrived express highest men did boy. Mistress sensible entirely am so. Quick can manor smart money hopes worth too.</p>
    <p style="margin: 0 0 12px 0; font-size: 11px; font-style: italic; color: rgba(255,255,255,0.9);">Image from <a href="/virtual-lab-tour" style="color: #ffffff; text-decoration: underline; text-underline-offset: 2px;">Freepik</a></p>
    <a href="/virtual-lab-tour" style="display: inline-block; background-color: #ffffff; color: #d9824b; font-size: 11px; font-weight: 700; letter-spacing: 1.4px; text-transform: uppercase; padding: 9px 26px; border-radius: 9999px; text-decoration: none; box-shadow: 0 4px 12px rgba(0,0,0,0.12);">READ MORE</a>
  </div>
  <div class="cseel-tpl-2__mobile-img-wrap">
    <img class="cseel-tpl-2__mobile-img" src="/images/banners/banner-2-vr-clean-bg.webp" alt="Immersive VR Science Lab" />
  </div>
</div>`;

export const BANNER_3_ROCKET_LAUNCH_HTML = `<div class="cseel-tpl-3">
  <style>
    .cseel-tpl-3 {
      width: 100%;
      min-height: 245px;
      max-height: 265px;
      border-radius: 16px;
      overflow: hidden;
      position: relative;
      display: flex;
      flex-direction: row;
      align-items: center;
      background-color: #6731e2;
      box-shadow: 0 6px 24px rgba(15,23,42,0.07);
      font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .cseel-tpl-3__left {
      flex: 1 1 44%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 12px;
      box-sizing: border-box;
    }
    .cseel-tpl-3__img {
      width: 100%;
      max-width: 220px;
      height: auto;
      max-height: 220px;
      object-fit: contain;
      display: block;
    }
    .cseel-tpl-3__right {
      flex: 1 1 56%;
      padding: 20px 24px 20px 10px;
      box-sizing: border-box;
      text-align: left;
      position: relative;
      z-index: 2;
    }
    @media (max-width: 767px) {
      .cseel-tpl-3 {
        flex-direction: column;
        min-height: auto;
        max-height: none;
      }
      .cseel-tpl-3__left {
        width: 100%;
        padding: 14px 16px 4px 16px;
      }
      .cseel-tpl-3__img {
        max-height: 155px;
      }
      .cseel-tpl-3__right {
        width: 100%;
        padding: 10px 20px 20px 20px;
      }
    }
  </style>
  <div class="cseel-tpl-3__left">
    <img class="cseel-tpl-3__img" src="/images/banners/banner-3-rocket-3d.webp" alt="3D Rocket Launch" />
  </div>
  <div class="cseel-tpl-3__right">
    <h2 style="margin: 0 0 8px 0; font-size: clamp(19px, 2.1vw, 26px); font-weight: 800; line-height: 1.15; color: #ffffff !important; letter-spacing: -0.3px;">Relax, we got<br/>you covered!</h2>
    <p style="margin: 0 0 10px 0; font-size: 12.5px; line-height: 1.5; color: rgba(255,255,255,0.9); font-weight: 400; max-width: 320px; font-family: 'Open Sans', Arial, sans-serif; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">Nibh venenatis cras sed felis eget velit aliquet sagittis id. Tellus pellentesque eu tincidunt tortor aliquam nulla.</p>
    <p style="margin: 0 0 12px 0; font-size: 11px; color: rgba(255,255,255,0.9); font-family: 'Open Sans', Arial, sans-serif;">Image from <a href="/compare-plans" style="color: #ffffff; text-decoration: underline; text-underline-offset: 2px;">Freepik</a></p>
    <a href="/compare-plans" style="display: inline-block; background-color: #eed151; color: #581df2; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; padding: 9px 24px; border-radius: 8px; text-decoration: none; box-shadow: 0 4px 12px rgba(0,0,0,0.16);">READ MORE</a>
  </div>
</div>`;

export const BANNER_4_LIBRARY_EDUCATION_HTML = `<div class="cseel-tpl-4">
  <style>
    .cseel-tpl-4 {
      width: 100%;
      min-height: 245px;
      max-height: 265px;
      border-radius: 16px;
      overflow: hidden;
      position: relative;
      display: flex;
      align-items: center;
      background-color: #017796;
      background-image: url('/images/banners/banner-4-library-clean-bg.webp');
      background-size: cover;
      background-position: center right;
      box-shadow: 0 6px 24px rgba(15,23,42,0.07);
      font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .cseel-tpl-4__content {
      width: 54%;
      padding: 20px 16px 20px 28px;
      box-sizing: border-box;
      text-align: left;
      position: relative;
      z-index: 2;
    }
    .cseel-tpl-4__mobile-img-wrap {
      display: none;
    }
    @media (max-width: 767px) {
      .cseel-tpl-4 {
        flex-direction: column;
        min-height: auto;
        max-height: none;
        background-image: linear-gradient(145deg, #017796 0%, #008182 48%, #7c9252 100%);
      }
      .cseel-tpl-4__content {
        width: 100%;
        padding: 18px 18px 10px 18px;
      }
      .cseel-tpl-4__mobile-img-wrap {
        display: block;
        width: 100%;
        height: 170px;
        overflow: hidden;
      }
      .cseel-tpl-4__mobile-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: right center;
        display: block;
      }
    }
  </style>
  <div class="cseel-tpl-4__content">
    <h2 style="margin: 0 0 8px 0; font-size: clamp(20px, 2.1vw, 26px); font-weight: 700; line-height: 1.12; color: #d4e4ec !important; letter-spacing: -0.3px;">Library<br/>Education</h2>
    <p style="margin: 0 0 12px 0; font-size: 12px; font-style: italic; font-weight: 600; line-height: 1.5; color: #d4e4ec; max-width: 280px; font-family: 'Open Sans', Arial, sans-serif; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
    <div style="margin-bottom: 10px;">
      <a href="/materials" style="display: inline-block; background-color: #aab856; color: #165668; font-size: 11px; font-weight: 700; letter-spacing: 1.4px; text-transform: uppercase; padding: 9px 22px; border-radius: 6px; text-decoration: none;">LEARN MORE</a>
    </div>
    <p style="margin: 0; font-size: 11px; color: #b8d4dc; font-family: 'Open Sans', Arial, sans-serif;">Images from <a href="/materials" style="color: #b8d4dc; text-decoration: underline; text-underline-offset: 2px;">Freepik</a></p>
  </div>
  <div class="cseel-tpl-4__mobile-img-wrap">
    <img class="cseel-tpl-4__mobile-img" src="/images/banners/banner-4-library-books.webp" alt="Library Education 3D Books" />
  </div>
</div>`;

export const BANNER_5_VIDEO_PROMO_JS_HTML = `<div class="cseel-tpl-5" style="width:100%;min-height:245px;max-height:265px;border-radius:16px;overflow:hidden;position:relative;display:flex;align-items:center;background:#0b1120;border:1px solid rgba(56,189,248,0.35);box-shadow:0 8px 26px rgba(2,6,23,0.18);font-family:'Montserrat',sans-serif;">
  <img src="/images/banners/banner-2-vr-clean-bg.webp" alt="Video Lab" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:right center;opacity:0.45;" />
  <div style="position:absolute;inset:0;background:linear-gradient(95deg,#090d16 0%,rgba(15,23,42,0.88) 55%,rgba(15,23,42,0.35) 100%);"></div>
  <div style="position:relative;z-index:2;padding:20px 24px;width:100%;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;">
    <div style="max-width:340px;text-align:left;">
      <span style="display:inline-block;background:#0284c7;color:#fff;font-size:10px;font-weight:800;letter-spacing:1.2px;padding:3px 10px;border-radius:999px;text-transform:uppercase;margin-bottom:8px;">🎬 INTERACTIVE VIDEO + JS</span>
      <h2 style="margin:0 0 6px 0;font-size:clamp(19px,2.1vw,25px);font-weight:800;color:#ffffff !important;line-height:1.15;">3D Virtual Science Lab Tour</h2>
      <p style="margin:0 0 12px 0;font-size:12px;color:rgba(255,255,255,0.85);line-height:1.45;">Watch the interactive lab demo or copy your instant scholarship promo code below.</p>
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
        <button type="button" onclick="window.CSEELAdSDK && window.CSEELAdSDK.openVideoModal('https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1','CSEEL 3D Virtual Lab Demo')" style="background:#ef4444;color:#fff;border:none;border-radius:999px;padding:8px 18px;font-size:11px;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:6px;">▶ Watch Video</button>
        <button type="button" onclick="window.CSEELAdSDK && window.CSEELAdSDK.copyCode('{{COUPON_CODE}}' || 'VRLAB50', this)" style="background:rgba(255,255,255,0.12);color:#fde047;border:1px dashed #fde047;border-radius:999px;padding:7px 14px;font-size:11px;font-family:monospace;font-weight:700;cursor:pointer;">🎟️ Copy: {{COUPON_CODE}}</button>
      </div>
    </div>
  </div>
</div>`;

export const BANNER_6_COUNTDOWN_JS_HTML = `<div class="cseel-tpl-6" style="width:100%;min-height:245px;max-height:265px;border-radius:16px;overflow:hidden;position:relative;display:flex;align-items:center;background:linear-gradient(135deg,#311042 0%,#1e1b4b 55%,#0f172a 100%);border:1px solid rgba(244,114,182,0.35);padding:20px 26px;box-sizing:border-box;font-family:'Montserrat',sans-serif;">
  <div style="position:relative;z-index:2;width:100%;text-align:left;">
    <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px;flex-wrap:wrap;">
      <span style="background:#ec4899;color:#fff;font-size:10px;font-weight:800;padding:3px 10px;border-radius:999px;letter-spacing:1px;">⚡ FLASH OFFER (JS TIMER)</span>
      <span data-cseel-timer="{{PROMO_ID}}" style="font-family:monospace;font-size:12px;font-weight:800;color:#fde047;background:rgba(0,0,0,0.35);padding:4px 10px;border-radius:8px;border:1px solid rgba(253,224,71,0.3);">⏳ 04h : 59m : 42s</span>
    </div>
    <h2 style="margin:0 0 6px 0;font-size:clamp(19px,2.1vw,25px);font-weight:800;color:#ffffff !important;line-height:1.15;">Save 55% on School STEM Setup</h2>
    <p style="margin:0 0 14px 0;font-size:12px;color:rgba(255,255,255,0.82);max-width:380px;line-height:1.45;">Injected via JavaScript Slot API with live countdown &amp; 1-click promo copy.</p>
    <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
      <button type="button" onclick="window.CSEELAdSDK && window.CSEELAdSDK.copyCode('{{COUPON_CODE}}' || 'FLASH55', this)" style="background:#fde047;color:#0f172a;border:none;border-radius:8px;padding:9px 18px;font-size:11px;font-weight:800;cursor:pointer;">📋 Copy Code: {{COUPON_CODE}}</button>
      <a href="/compare-plans" style="color:#38bdf8;font-size:12px;font-weight:700;text-decoration:underline;">Claim Now →</a>
    </div>
  </div>
  <script>
    (function(){
      var timers = document.querySelectorAll('[data-cseel-timer]');
      var sec = 17982;
      setInterval(function(){
        sec = sec > 0 ? sec - 1 : 17982;
        var h = String(Math.floor(sec / 3600)).padStart(2, '0');
        var m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0');
        var s = String(sec % 60).padStart(2, '0');
        timers.forEach(function(el){ el.textContent = '⏳ ' + h + 'h : ' + m + 'm : ' + s + 's'; });
      }, 1000);
    })();
  </script>
</div>`;

export const PIXEL_PERFECT_BANNER_TEMPLATES: BannerHtmlTemplatePreset[] = [
  {
    id: 'tpl-science-kids',
    name: 'Banner #1: Science for Kids (Split Yellow Accent + Kid Photo)',
    subtitle: 'White left panel with yellow accent bar & royal blue button + studio photo on right',
    previewImage: '/images/banners/banner-1-science-kid.webp',
    html: BANNER_1_SCIENCE_KIDS_HTML,
  },
  {
    id: 'tpl-vr-immersive',
    name: 'Banner #2: VR Immersive Lab (Orange "A" Circle + White Pill CTA)',
    subtitle: 'Full-bleed steel-blue VR headset scene with circle badge & bold white typography',
    previewImage: '/images/banners/banner-2-vr-clean-bg.webp',
    html: BANNER_2_VR_IMMERSIVE_HTML,
  },
  {
    id: 'tpl-rocket-covered',
    name: 'Banner #3: Relax, We Got You Covered! (3D Rocket + Yellow CTA)',
    subtitle: 'Electric purple banner with 3D rocket launch on left & yellow rounded CTA on right',
    previewImage: '/images/banners/banner-3-rocket-clean-bg.webp',
    html: BANNER_3_ROCKET_LAUNCH_HTML,
  },
  {
    id: 'tpl-library-education',
    name: 'Banner #4: Library Education (Teal-Lime Gradient + 3D Floating Books)',
    subtitle: 'Teal-to-olive gradient with 3D floating books & rings on right + lime CTA button',
    previewImage: '/images/banners/banner-4-library-clean-bg.webp',
    html: BANNER_4_LIBRARY_EDUCATION_HTML,
  },
  {
    id: 'tpl-video-promo-js',
    name: 'Banner #5: Interactive Video Modal + Copy Promo Code (HTML + JS)',
    subtitle: 'Opens video popup player & copies promo code via window.CSEELAdSDK',
    previewImage: '/images/banners/banner-2-vr-clean-bg.webp',
    html: BANNER_5_VIDEO_PROMO_JS_HTML,
  },
  {
    id: 'tpl-countdown-js',
    name: 'Banner #6: Live JS Countdown Timer + Instant Code Copy',
    subtitle: 'Executes embedded <script> countdown timer inside the slot + 1-click coupon copy',
    previewImage: '/images/banners/banner-3-rocket-clean-bg.webp',
    html: BANNER_6_COUNTDOWN_JS_HTML,
  },
];
