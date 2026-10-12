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
      min-height: 220px;
      max-height: 248px;
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      display: flex;
      flex-direction: row;
      box-shadow: 0 4px 20px rgba(15,23,42,0.06);
      border: 1px solid #e2e8f0;
      position: relative;
      font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .cseel-tpl-1__left {
      flex: 1 1 56%;
      background: #ffffff;
      position: relative;
      display: flex;
      align-items: center;
      padding: 18px 20px 18px 32px;
      box-sizing: border-box;
    }
    .cseel-tpl-1__bar {
      position: absolute;
      left: 0;
      top: 24%;
      width: 14px;
      height: 84px;
      background-color: #f0c50d;
      border-radius: 0 4px 4px 0;
    }
    .cseel-tpl-1__right {
      flex: 1 1 44%;
      min-height: 220px;
      max-height: 248px;
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
      min-height: 220px;
      max-height: 248px;
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
        padding: 16px 16px 14px 22px;
      }
      .cseel-tpl-1__bar {
        top: 18px;
        width: 8px;
        height: 60px;
      }
      .cseel-tpl-1__right {
        min-height: 160px;
        max-height: 175px;
        height: 165px;
        width: 100%;
      }
      .cseel-tpl-1__img {
        min-height: 160px;
        max-height: 175px;
        height: 165px;
        object-fit: contain;
        object-position: bottom center;
      }
    }
  </style>
  <div class="cseel-tpl-1__left">
    <div class="cseel-tpl-1__bar"></div>
    <div style="max-width: 340px; text-align: left;">
      <p style="margin: 0 0 4px 0; font-size: 10px; font-weight: 700; letter-spacing: 1.6px; color: #005689; text-transform: uppercase;">EXPERIENTIAL STEM LABS</p>
      <h2 style="margin: 0 0 6px 0; font-size: clamp(19px, 2.1vw, 25px); font-weight: 800; line-height: 1.15; color: #111111 !important; letter-spacing: -0.3px;">Hands-on Science<br/>for Curious Minds</h2>
      <p style="margin: 0 0 10px 0; font-size: 12px; line-height: 1.45; color: #475569; font-weight: 400; font-family: 'Open Sans', Arial, sans-serif; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">NEP 2020 aligned interactive experiments, virtual simulations and tactile learning modules for school learners.</p>
      <a href="/domain/science" aria-label="Explore hands-on science experiments for schools" style="display: inline-block; background-color: #005689; color: #ffffff; font-size: 11px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; padding: 8px 22px; text-decoration: none; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,86,137,0.25);">EXPLORE LABS →</a>
    </div>
  </div>
  <div class="cseel-tpl-1__right">
    <img class="cseel-tpl-1__img" src="/images/banners/banner-1-science-kid.webp" alt="Hands-on Science Student Conducting Experiments" width="300" height="248" loading="lazy" decoding="async" />
  </div>
</div>`;

export const BANNER_2_VR_IMMERSIVE_HTML = `<div class="cseel-tpl-2">
  <style>
    .cseel-tpl-2 {
      width: 100%;
      min-height: 220px;
      max-height: 248px;
      border-radius: 16px;
      overflow: hidden;
      position: relative;
      display: flex;
      align-items: center;
      background-color: #3b6b94;
      background-image: url('/images/banners/banner-2-vr-clean-bg.webp');
      background-size: cover;
      background-position: center right;
      box-shadow: 0 4px 20px rgba(15,23,42,0.06);
      font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .cseel-tpl-2__content {
      position: relative;
      z-index: 2;
      max-width: 58%;
      padding: 18px 18px 18px 24px;
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
        background-image: linear-gradient(180deg, #4780ab 0%, #2f5f88 100%);
      }
      .cseel-tpl-2__content {
        max-width: 100%;
        padding: 16px 18px 12px 18px;
      }
      .cseel-tpl-2__mobile-img-wrap {
        display: block;
        width: 100%;
        height: 160px;
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
    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
      <div style="width: 34px; height: 34px; border-radius: 50%; background-color: #ffffff; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
        <span style="font-size: 14px; font-weight: 900; color: #ef6c24; font-family: 'Montserrat', Arial, sans-serif; line-height: 1;">3D</span>
      </div>
      <p style="margin: 0; font-size: 11px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; color: #fde047;">CSEEL VIRTUAL LAB TOUR</p>
    </div>
    <h2 style="margin: 0 0 6px 0; font-size: clamp(18px, 2vw, 24px); font-weight: 800; line-height: 1.18; color: #ffffff !important; letter-spacing: -0.3px;">Immersive Virtual<br/>Reality Science Labs</h2>
    <p style="margin: 0 0 12px 0; font-size: 12px; line-height: 1.45; color: rgba(255,255,255,0.92); max-width: 330px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">Step inside photorealistic 3D interactive labs. Conduct risk-free physics and chemistry experiments on any device.</p>
    <a href="/virtual-lab-tour" aria-label="Take immersive 3D virtual science lab tour" style="display: inline-block; background-color: #ffffff; color: #023858; font-size: 11px; font-weight: 800; letter-spacing: 1.2px; text-transform: uppercase; padding: 8px 22px; border-radius: 8px; text-decoration: none; box-shadow: 0 4px 12px rgba(0,0,0,0.18);">START LAB TOUR →</a>
  </div>
  <div class="cseel-tpl-2__mobile-img-wrap">
    <img class="cseel-tpl-2__mobile-img" src="/images/banners/banner-2-vr-clean-bg.webp" alt="Student using Virtual Reality Laboratory" width="400" height="160" loading="lazy" decoding="async" />
  </div>
</div>`;

export const BANNER_3_ROCKET_LAUNCH_HTML = `<div class="cseel-tpl-3">
  <style>
    .cseel-tpl-3 {
      width: 100%;
      min-height: 220px;
      max-height: 248px;
      border-radius: 16px;
      overflow: hidden;
      position: relative;
      display: flex;
      flex-direction: row;
      align-items: center;
      background: linear-gradient(135deg, #5b21b6 0%, #4c1d95 60%, #311042 100%);
      box-shadow: 0 4px 20px rgba(15,23,42,0.08);
      font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .cseel-tpl-3__left {
      flex: 1 1 42%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px;
      box-sizing: border-box;
    }
    .cseel-tpl-3__img {
      width: 100%;
      max-width: 195px;
      height: auto;
      max-height: 195px;
      object-fit: contain;
      display: block;
    }
    .cseel-tpl-3__right {
      flex: 1 1 58%;
      padding: 18px 22px 18px 10px;
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
        max-height: 140px;
      }
      .cseel-tpl-3__right {
        width: 100%;
        padding: 10px 18px 18px 18px;
      }
    }
  </style>
  <div class="cseel-tpl-3__left">
    <img class="cseel-tpl-3__img" src="/images/banners/banner-3-rocket-3d.webp" alt="3D Rocket Launch Innovation" width="195" height="195" loading="lazy" decoding="async" />
  </div>
  <div class="cseel-tpl-3__right">
    <p style="margin: 0 0 4px 0; font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #fde047;">ATL 2.0 &amp; ROBOTICS</p>
    <h2 style="margin: 0 0 6px 0; font-size: clamp(18px, 2vw, 24px); font-weight: 800; line-height: 1.15; color: #ffffff !important; letter-spacing: -0.3px;">Launch Your School's<br/>STEM Innovation Lab</h2>
    <p style="margin: 0 0 12px 0; font-size: 12px; line-height: 1.45; color: rgba(255,255,255,0.9); max-width: 330px; font-family: 'Open Sans', Arial, sans-serif; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">Atal Tinkering Lab packages, robotics kits &amp; AI curriculum with turnkey NITI Aayog compliance.</p>
    <a href="/compare-plans" aria-label="View Institutional School Plans and Setup Kits" style="display: inline-block; background-color: #eed151; color: #3b0764; font-size: 11px; font-weight: 800; letter-spacing: 1.3px; text-transform: uppercase; padding: 8px 22px; border-radius: 8px; text-decoration: none; box-shadow: 0 4px 14px rgba(0,0,0,0.22);">VIEW SCHOOL PLANS →</a>
  </div>
</div>`;

export const BANNER_4_LIBRARY_EDUCATION_HTML = `<div class="cseel-tpl-4">
  <style>
    .cseel-tpl-4 {
      width: 100%;
      min-height: 220px;
      max-height: 248px;
      border-radius: 16px;
      overflow: hidden;
      position: relative;
      display: flex;
      align-items: center;
      background-color: #02657e;
      background-image: url('/images/banners/banner-4-library-clean-bg.webp');
      background-size: cover;
      background-position: center right;
      box-shadow: 0 4px 20px rgba(15,23,42,0.06);
      font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .cseel-tpl-4__content {
      width: 56%;
      padding: 18px 16px 18px 26px;
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
        background-image: linear-gradient(145deg, #017796 0%, #008182 50%, #5d753b 100%);
      }
      .cseel-tpl-4__content {
        width: 100%;
        padding: 16px 18px 10px 18px;
      }
      .cseel-tpl-4__mobile-img-wrap {
        display: block;
        width: 100%;
        height: 155px;
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
    <p style="margin: 0 0 4px 0; font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #a3e635;">TEACHER &amp; STUDENT PORTAL</p>
    <h2 style="margin: 0 0 6px 0; font-size: clamp(18px, 2vw, 24px); font-weight: 800; line-height: 1.15; color: #ffffff !important; letter-spacing: -0.3px;">Digital STEM &amp; Lab<br/>Curriculum Library</h2>
    <p style="margin: 0 0 12px 0; font-size: 12px; line-height: 1.45; color: #e2e8f0; max-width: 320px; font-family: 'Open Sans', Arial, sans-serif; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">Access thousands of NEP 2020 experiment lesson plans, teacher manuals &amp; worksheets in one portal.</p>
    <a href="/materials" aria-label="Explore STEM Lab Materials and Teaching Modules" style="display: inline-block; background-color: #a3e635; color: #14532d; font-size: 11px; font-weight: 800; letter-spacing: 1.2px; text-transform: uppercase; padding: 8px 22px; border-radius: 8px; text-decoration: none; box-shadow: 0 2px 10px rgba(0,0,0,0.18);">EXPLORE MODULES →</a>
  </div>
  <div class="cseel-tpl-4__mobile-img-wrap">
    <img class="cseel-tpl-4__mobile-img" src="/images/banners/banner-4-library-books.webp" alt="Digital STEM Education Library Books" width="400" height="155" loading="lazy" decoding="async" />
  </div>
</div>`;

export const BANNER_5_VIDEO_PROMO_JS_HTML = `<div class="cseel-tpl-5" style="width:100%;min-height:220px;max-height:248px;border-radius:16px;overflow:hidden;position:relative;display:flex;align-items:center;background:#0b1120;border:1px solid rgba(56,189,248,0.35);box-shadow:0 6px 22px rgba(2,6,23,0.18);font-family:'Montserrat',sans-serif;">
  <img src="/images/banners/banner-2-vr-clean-bg.webp" alt="Video Lab" width="800" height="248" loading="lazy" decoding="async" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:right center;opacity:0.45;" />
  <div style="position:absolute;inset:0;background:linear-gradient(95deg,#090d16 0%,rgba(15,23,42,0.88) 55%,rgba(15,23,42,0.35) 100%);"></div>
  <div style="position:relative;z-index:2;padding:18px 22px;width:100%;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;">
    <div style="max-width:350px;text-align:left;">
      <span style="display:inline-block;background:#0284c7;color:#fff;font-size:10px;font-weight:800;letter-spacing:1.2px;padding:3px 10px;border-radius:999px;text-transform:uppercase;margin-bottom:6px;">🎬 INTERACTIVE LAB TOUR</span>
      <h2 style="margin:0 0 6px 0;font-size:clamp(18px,2vw,24px);font-weight:800;color:#ffffff !important;line-height:1.15;">3D Virtual Science Lab Demo</h2>
      <p style="margin:0 0 12px 0;font-size:12px;color:rgba(255,255,255,0.88);line-height:1.45;">Watch the interactive experiential lab walkthrough and copy your school trial pass code below.</p>
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
        <button type="button" onclick="window.CSEELAdSDK && window.CSEELAdSDK.openVideoModal('https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1','CSEEL 3D Virtual Lab Demo')" style="background:#ef4444;color:#fff;border:none;border-radius:999px;padding:8px 18px;font-size:11px;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:6px;">▶ Watch Demo</button>
        <button type="button" onclick="window.CSEELAdSDK && window.CSEELAdSDK.copyCode('{{COUPON_CODE}}' || 'VRLAB50', this)" style="background:rgba(255,255,255,0.12);color:#fde047;border:1px dashed #fde047;border-radius:999px;padding:7px 14px;font-size:11px;font-family:monospace;font-weight:700;cursor:pointer;">🎟️ Copy: {{COUPON_CODE}}</button>
      </div>
    </div>
  </div>
</div>`;

export const BANNER_6_COUNTDOWN_JS_HTML = `<div class="cseel-tpl-6" style="width:100%;min-height:220px;max-height:248px;border-radius:16px;overflow:hidden;position:relative;display:flex;align-items:center;background:linear-gradient(135deg,#311042 0%,#1e1b4b 55%,#0f172a 100%);border:1px solid rgba(244,114,182,0.35);padding:18px 24px;box-sizing:border-box;font-family:'Montserrat',sans-serif;">
  <div style="position:relative;z-index:2;width:100%;text-align:left;">
    <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px;flex-wrap:wrap;">
      <span style="background:#ec4899;color:#fff;font-size:10px;font-weight:800;padding:3px 10px;border-radius:999px;letter-spacing:1px;">⚡ INSTITUTIONAL SCHOLARSHIP</span>
      <span data-cseel-timer="{{PROMO_ID}}" style="font-family:monospace;font-size:12px;font-weight:800;color:#fde047;background:rgba(0,0,0,0.35);padding:4px 10px;border-radius:8px;border:1px solid rgba(253,224,71,0.3);">⏳ 04h : 59m : 42s</span>
    </div>
    <h2 style="margin:0 0 6px 0;font-size:clamp(18px,2vw,24px);font-weight:800;color:#ffffff !important;line-height:1.15;">Save 55% on School STEM Lab Setup</h2>
    <p style="margin:0 0 12px 0;font-size:12px;color:rgba(255,255,255,0.85);max-width:400px;line-height:1.45;">Special introductory pricing for educational institutions &amp; early partner schools across India.</p>
    <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
      <button type="button" onclick="window.CSEELAdSDK && window.CSEELAdSDK.copyCode('{{COUPON_CODE}}' || 'FLASH55', this)" style="background:#fde047;color:#0f172a;border:none;border-radius:8px;padding:8px 18px;font-size:11px;font-weight:800;cursor:pointer;">📋 Copy Code: {{COUPON_CODE}}</button>
      <a href="/compare-plans" aria-label="Claim CSEEL Institutional Discount" style="color:#38bdf8;font-size:12px;font-weight:700;text-decoration:underline;">Claim Offer →</a>
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
    name: 'Banner #1: Science for Kids (Experiential STEM Labs)',
    subtitle: 'White left panel with yellow accent bar & royal blue button + student lab photo',
    previewImage: '/images/banners/banner-1-science-kid.webp',
    html: BANNER_1_SCIENCE_KIDS_HTML,
  },
  {
    id: 'tpl-vr-immersive',
    name: 'Banner #2: VR Immersive Lab (3D Simulation Tour)',
    subtitle: 'Steel-blue VR headset scene with 3D circle badge & white pill CTA button',
    previewImage: '/images/banners/banner-2-vr-clean-bg.webp',
    html: BANNER_2_VR_IMMERSIVE_HTML,
  },
  {
    id: 'tpl-rocket-covered',
    name: 'Banner #3: Launch School STEM Lab (3D Rocket + ATL Setup)',
    subtitle: 'Vibrant purple banner with 3D rocket launch on left & yellow rounded CTA',
    previewImage: '/images/banners/banner-3-rocket-clean-bg.webp',
    html: BANNER_3_ROCKET_LAUNCH_HTML,
  },
  {
    id: 'tpl-library-education',
    name: 'Banner #4: Digital Curriculum Library (3D Floating Books)',
    subtitle: 'Deep teal banner with 3D floating books on right + lime green CTA button',
    previewImage: '/images/banners/banner-4-library-clean-bg.webp',
    html: BANNER_4_LIBRARY_EDUCATION_HTML,
  },
  {
    id: 'tpl-video-promo-js',
    name: 'Banner #5: Interactive Video Modal + Copy Promo Code',
    subtitle: 'Opens video popup player & copies promo code via window.CSEELAdSDK',
    previewImage: '/images/banners/banner-2-vr-clean-bg.webp',
    html: BANNER_5_VIDEO_PROMO_JS_HTML,
  },
  {
    id: 'tpl-countdown-js',
    name: 'Banner #6: Live JS Countdown Timer + Instant Code Copy',
    subtitle: 'Executes embedded countdown timer inside the slot + 1-click coupon copy',
    previewImage: '/images/banners/banner-3-rocket-clean-bg.webp',
    html: BANNER_6_COUNTDOWN_JS_HTML,
  },
];
