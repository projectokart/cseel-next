import { FacultyProfile } from './facultyProfiles';

export type ResumePageTab = 'resume' | 'videos' | 'gallery';

/**
 * Shared Theme CSS for all Resumes Subdomain Pages:
 * - Resume Page
 * - Photo Gallery Page
 * - Demo Videos Page
 * - Pending Verification Page
 */
export function renderSharedThemeCss(): string {
  return `
    :root {
      --primary: #1e3a8a;
      --primary-dark: #0f172a;
      --primary-light: #2563eb;
      --accent-blue: #1a73e8;
      --accent-teal: #0d9488;
      --accent-amber: #d97706;
      --success: #16a34a;
      --bg-slate: #f8fafc;
      --bg-card: #ffffff;
      --text-dark: #0f172a;
      --text-muted: #475569;
      --text-light: #64748b;
      --border-color: #e2e8f0;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: var(--bg-slate);
      color: var(--text-dark);
      line-height: 1.5;
      padding-bottom: 74px;
      -webkit-font-smoothing: antialiased;
    }
    .container {
      width: 100%;
      max-width: 1240px;
      margin: 0 auto;
      padding: 0 16px;
    }

    /* ============================================================ */
    /* SHARED TOP NAVIGATION TABS BAR */
    /* ============================================================ */
    .nav-tabs-bar {
      background: #ffffff;
      border-bottom: 1.5px solid var(--border-color);
      position: sticky;
      top: 0;
      z-index: 90;
      box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
      padding: 0;
    }
    .tabs-scroller {
      display: flex;
      align-items: center;
      gap: 8px;
      overflow-x: auto;
      padding: 8px 12px;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
    }
    .tabs-scroller::-webkit-scrollbar { display: none; }
    .drawer-trigger-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #e8f0fe;
      color: var(--primary-light);
      border: 1px solid #d2e3fc;
      padding: 5px 12px 5px 6px;
      border-radius: 24px;
      font-size: 0.82rem;
      font-weight: 700;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s ease;
      flex-shrink: 0;
    }
    .drawer-trigger-btn:hover {
      background: #d2e3fc;
      color: var(--primary);
    }
    .menu-btn-avatar {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      object-fit: cover;
      border: 1.5px solid var(--primary-light);
      display: inline-block;
      flex-shrink: 0;
    }
    .tab-btn {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 6px 16px;
      font-size: 0.84rem;
      font-weight: 700;
      color: var(--text-muted);
      text-decoration: none;
      border-radius: 24px;
      white-space: nowrap;
      border: 1px solid var(--border-color);
      background: #f8fafc;
      transition: all 0.2s ease;
      flex-shrink: 0;
    }
    .tab-btn:hover {
      background: #f1f5f9;
      color: var(--primary);
      border-color: #cbd5e1;
    }
    .tab-btn.active {
      background: var(--primary);
      color: #ffffff;
      border-color: var(--primary);
      box-shadow: 0 2px 6px rgba(30, 58, 138, 0.25);
    }

    /* Hide Top Tabs on Mobile (<768px), Show on Desktop */
    @media (max-width: 768px) {
      .nav-tabs-bar { display: none !important; }
    }
    @media (min-width: 769px) {
      .nav-tabs-bar { display: block !important; }
      .tabs-scroller { display: flex !important; }
    }

    /* ============================================================ */
    /* SHARED FLOATING LEFT-EDGE MENU TOGGLE (AVATAR + 3 BARS) */
    /* ============================================================ */
    .floating-drawer-handle {
      position: fixed;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      background: #1e40af;
      color: #ffffff;
      padding: 8px 6px 7px 5px;
      border-radius: 0 14px 14px 0;
      box-shadow: 2px 4px 14px rgba(15, 23, 42, 0.35);
      z-index: 9999;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .floating-drawer-handle:hover {
      background: #2563eb;
      padding-left: 9px;
      transform: translateY(-50%) scale(1.04);
    }
    .floating-handle-avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #ffffff;
      display: block;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25);
    }
    .floating-handle-bars {
      display: flex;
      flex-direction: column;
      gap: 2.5px;
      padding-top: 1px;
    }
    .floating-handle-bars span {
      display: block;
      width: 16px;
      height: 2px;
      background: #ffffff;
      border-radius: 2px;
    }

    /* ============================================================ */
    /* SHARED SLIDE-OUT NAVIGATION DRAWER */
    /* ============================================================ */
    .drawer-backdrop {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(4px);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 99998;
    }
    .drawer-backdrop.active {
      opacity: 1;
      pointer-events: auto;
    }
    .nav-drawer-sheet {
      position: fixed;
      top: 0; bottom: 0; left: 0;
      width: 310px;
      max-width: 86vw;
      background: #ffffff;
      box-shadow: 6px 0 30px rgba(15, 23, 42, 0.25);
      transform: translateX(-100%);
      transition: transform 0.32s cubic-bezier(0.16, 1, 0.3, 1);
      z-index: 99999;
      display: flex;
      flex-direction: column;
      border-right: 1px solid var(--border-color);
    }
    .nav-drawer-sheet.active {
      transform: translateX(0);
    }
    .drawer-header {
      background: #0f172a;
      color: #ffffff;
      padding: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #1e293b;
    }
    .drawer-avatar-wrap {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .drawer-avatar {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #38bdf8;
    }
    .drawer-name {
      font-size: 0.94rem;
      font-weight: 700;
      color: #ffffff;
    }
    .drawer-tagline {
      font-size: 0.72rem;
      color: #94a3b8;
      margin-top: 2px;
    }
    .drawer-close-btn {
      background: none;
      border: none;
      color: #94a3b8;
      font-size: 1.6rem;
      line-height: 1;
      cursor: pointer;
      padding: 4px 8px;
    }
    .drawer-scroll-body {
      flex: 1;
      overflow-y: auto;
      padding: 12px 10px;
    }
    .drawer-sec-heading {
      font-size: 0.68rem;
      font-weight: 800;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      padding: 6px 8px;
    }
    .drawer-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      border-radius: 8px;
      color: #1e293b;
      text-decoration: none;
      font-size: 0.84rem;
      font-weight: 600;
      transition: all 0.15s;
    }
    .drawer-item i { width: 20px; text-align: center; }
    .drawer-item:hover { background: #f1f5f9; color: var(--primary-light); }
    .drawer-item.active { background: #e8f0fe; color: var(--primary); font-weight: 700; }
    .drawer-bottom-actions {
      padding: 12px;
      border-top: 1px solid var(--border-color);
      display: flex;
      gap: 8px;
    }
    .drawer-cta-btn {
      flex: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 9px;
      border-radius: 8px;
      font-size: 0.78rem;
      font-weight: 700;
      text-decoration: none;
      color: #ffffff;
      transition: opacity 0.15s;
    }
    .drawer-cta-btn.call { background: var(--primary-light); }
    .drawer-cta-btn.wa { background: #16a34a; }

    /* ============================================================ */
    /* SHARED MOBILE BOTTOM NAVIGATION DOCK */
    /* ============================================================ */
    .g-bottom-nav {
      position: fixed;
      bottom: 0; left: 0; right: 0;
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border-top: 1px solid var(--border-color);
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 6px 0 7px;
      z-index: 1000;
      box-shadow: 0 -2px 10px rgba(0,0,0,0.06);
    }
    .g-nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #64748b;
      text-decoration: none;
      font-size: 0.68rem;
      font-weight: 600;
      background: none;
      border: none;
      cursor: pointer;
      padding: 2px 4px;
      flex: 1;
      max-width: 75px;
      transition: all 0.15s ease;
    }
    .g-nav-icon {
      font-size: 1.05rem;
      margin-bottom: 2px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .g-nav-avatar {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      object-fit: cover;
      border: 1.5px solid var(--primary-light);
    }
    .g-nav-item.active {
      color: var(--primary);
      font-weight: 700;
    }
    .g-nav-item.active .g-nav-icon {
      color: var(--primary);
      transform: scale(1.08);
    }
    .g-nav-item.resume .g-nav-icon { color: var(--primary); }
    .g-nav-item.videos .g-nav-icon { color: #ea4335; }
    .g-nav-item.gallery .g-nav-icon { color: var(--primary-light); }
    .g-nav-item.wa .g-nav-icon { color: #16a34a; }

    @media (min-width: 769px) {
      .g-bottom-nav { display: none !important; }
      body { padding-bottom: 24px !important; }
    }

    /* ============================================================ */
    /* SHARED STANDARDIZED PORTAL FOOTER */
    /* ============================================================ */
    .portal-footer {
      background: #0f172a;
      color: #94a3b8;
      padding: 26px 16px;
      margin-top: 40px;
      font-size: 0.82rem;
      border-top: 1px solid #1e293b;
    }
    .portal-footer-inner {
      max-width: 1240px;
      margin: 0 auto;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 14px;
    }
    .portal-footer-brand {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .portal-footer-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
      border: 1.5px solid #38bdf8;
    }
    .portal-footer-links {
      display: flex;
      flex-wrap: wrap;
      gap: 14px;
    }
    .portal-footer-links a {
      color: #cbd5e1;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.15s;
    }
    .portal-footer-links a:hover {
      color: #38bdf8;
    }

    /* ============================================================ */
    /* SHARED REUSABLE IMAGE PREVIEW LIGHTBOX MODAL */
    /* ============================================================ */
    .g-preview-modal {
      display: none;
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(15, 23, 42, 0.95);
      backdrop-filter: blur(8px);
      z-index: 99999;
      align-items: center;
      justify-content: center;
      padding: 12px;
    }
    .g-preview-modal.active { display: flex; }
    .g-preview-box {
      max-width: 900px;
      width: 100%;
      background: #202124;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 25px 60px rgba(0,0,0,0.8);
      display: flex;
      flex-direction: column;
      position: relative;
      border: 1px solid rgba(255,255,255,0.12);
    }
    .g-preview-img-container {
      width: 100%;
      max-height: 70vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #000000;
      padding: 8px;
    }
    .g-preview-img {
      max-width: 100%;
      max-height: 68vh;
      object-fit: contain;
      border-radius: 8px;
    }
    .g-preview-meta {
      padding: 14px 18px;
      background: #202124;
      color: #f8fafc;
      display: flex;
      flex-direction: column;
      gap: 7px;
    }
    .g-preview-title { font-size: 0.94rem; font-weight: 600; color: #ffffff; }
    .g-preview-details-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 8px;
      font-size: 0.78rem;
      color: #9aa0a6;
    }
    .g-preview-actions { display: flex; align-items: center; gap: 8px; margin-top: 4px; }
    .btn-g-action {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 7px 14px;
      border-radius: 20px;
      font-size: 0.80rem;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.15s;
      border: none;
    }
    .btn-g-visit { background: #1a73e8; color: #ffffff; }
    .btn-g-visit:hover { background: #1557b0; }
    .btn-g-share { background: rgba(255,255,255,0.12); color: #ffffff; border: 1px solid rgba(255,255,255,0.2); }
    .btn-g-share:hover { background: rgba(255,255,255,0.22); }
    .g-preview-close {
      position: absolute;
      top: 12px; right: 12px;
      background: rgba(0,0,0,0.6);
      color: #ffffff;
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 50%;
      width: 34px; height: 34px;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.1rem; cursor: pointer; z-index: 10;
    }

    /* ============================================================ */
    /* SHARED REUSABLE VIDEO PLAYER MODAL */
    /* ============================================================ */
    .video-modal {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(15, 23, 42, 0.95);
      backdrop-filter: blur(8px);
      z-index: 99999;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }
    .video-modal.active { display: flex; }
    .video-modal-box {
      background: #0f172a;
      border-radius: 14px;
      border: 1px solid #334155;
      width: 100%;
      max-width: 860px;
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.75);
    }
    .video-modal-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background: #1e293b;
      color: #f8fafc;
      font-size: 0.9rem;
      border-bottom: 1px solid #334155;
    }
    .video-modal-close {
      background: none;
      border: none;
      color: #94a3b8;
      font-size: 1.4rem;
      cursor: pointer;
      line-height: 1;
    }
    .video-modal-wrap {
      position: relative;
      padding-bottom: 56.25%;
      height: 0;
      background: #000;
    }
    .video-modal-wrap iframe {
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      border: none;
    }
  `;
}

/**
 * Shared Top Navigation Tabs Bar
 * Clean, branded with faculty avatar + menu, Full Resume, Demo Videos, Photo Gallery, PDF
 */
export function renderSharedHeader(faculty: FacultyProfile, activeTab: ResumePageTab, keyPrefix: string = ''): string {
  const cleanSlug = faculty.slug;
  const photoUrl = faculty.photoUrl || '/images/dev-sharma.jpg';
  const resumeHref = keyPrefix ? `${keyPrefix}/${cleanSlug}.html` : `${cleanSlug}.html`;
  const videosHref = keyPrefix ? `${keyPrefix}/${cleanSlug}-videos.html` : `${cleanSlug}-videos.html`;
  const galleryHref = keyPrefix ? `${keyPrefix}/${cleanSlug}-gallery.html` : `${cleanSlug}-gallery.html`;

  const videoCount = (faculty.videos || []).length || 6;
  const galleryCount = (faculty.galleryImages || []).length || 8;

  return `
  <!-- Shared Top Navigation Tabs with Left Sections Drawer Button -->
  <header class="nav-tabs-bar">
    <div class="container tabs-scroller">
      <button type="button" class="drawer-trigger-btn" onclick="openNavDrawer()" title="Open Section Navigator">
        <img src="${photoUrl}" alt="Menu" class="menu-btn-avatar" onerror="this.src=\'/images/dev-sharma.jpg\'" />
        <i class="fa-solid fa-bars-staggered"></i> <span>Menu</span>
      </button>
      <a href="${resumeHref}" class="tab-btn ${activeTab === 'resume' ? 'active' : ''}">
        <i class="fa-solid fa-file-lines"></i> Full Resume
      </a>
      <a href="${videosHref}" class="tab-btn ${activeTab === 'videos' ? 'active' : ''}">
        <i class="fa-solid fa-play"></i> Demo Videos (${videoCount})
      </a>
      <a href="${galleryHref}" class="tab-btn ${activeTab === 'gallery' ? 'active' : ''}">
        <i class="fa-solid fa-images"></i> Photo Gallery (${galleryCount})
      </a>
      <a href="/Devender_Resume.pdf" download class="tab-btn">
        <i class="fa-solid fa-file-pdf" style="color:#ea4335;"></i> Download PDF
      </a>
    </div>
  </header>`;
}

/**
 * Shared Floating Left-Edge Handle (Avatar + 3 Bars)
 */
export function renderFloatingDrawerHandle(photoUrl: string = '/images/dev-sharma.jpg', name: string = 'Menu'): string {
  return `
  <!-- Shared Floating Left Edge Drawer Handle (Avatar + 3 Bars Toggle) -->
  <div class="floating-drawer-handle" onclick="openNavDrawer()" title="Open Navigation Menu" role="button" aria-label="Open Navigation Drawer" tabindex="0">
    <img src="${photoUrl}" class="floating-handle-avatar" alt="${name}" onerror="this.src=\'/images/dev-sharma.jpg\'" />
    <div class="floating-handle-bars">
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>`;
}

/**
 * Shared Slide-Out Navigation Drawer Sheet + Backdrop
 */
export function renderNavDrawerSheet(faculty: FacultyProfile, activeTab: ResumePageTab, keyPrefix: string = ''): string {
  const name = faculty.name || 'Faculty';
  const cleanSlug = faculty.slug;
  const facultyCode = faculty.facultyCode || 'AA001';
  const subject = faculty.subject || 'Physics';
  const title = faculty.title || `${subject} Faculty`;
  const photoUrl = faculty.photoUrl || '/images/dev-sharma.jpg';
  const phone = faculty.phone || '+918683979659';
  const cleanPhone = phone.replace(/[^0-9+]/g, '');
  const privacy = faculty.privacy || { showPhone: true, showAltPhone: true, showEmail: true, showAddress: true };

  const resumeHref = keyPrefix ? `${keyPrefix}/${cleanSlug}.html` : `${cleanSlug}.html`;
  const videosHref = keyPrefix ? `${keyPrefix}/${cleanSlug}-videos.html` : `${cleanSlug}-videos.html`;
  const galleryHref = keyPrefix ? `${keyPrefix}/${cleanSlug}-gallery.html` : `${cleanSlug}-gallery.html`;

  const videoCount = (faculty.videos || []).length || 6;
  const galleryCount = (faculty.galleryImages || []).length || 8;

  return `
  <!-- Shared Side Sheet Navigation Drawer Backdrop -->
  <div class="drawer-backdrop" id="drawerBackdrop" onclick="closeNavDrawer()"></div>

  <!-- Shared Side Sheet Navigation Drawer -->
  <aside class="nav-drawer-sheet" id="navDrawerSheet" aria-label="Faculty Profile Navigation">
    <div class="drawer-header">
      <div class="drawer-avatar-wrap">
        <img src="${photoUrl}" alt="${name}" class="drawer-avatar" onerror="this.src=\'/images/dev-sharma.jpg\'" />
        <div>
          <div class="drawer-name">${name}</div>
          <div class="drawer-tagline">${title} &bull; ID: ${facultyCode}</div>
        </div>
      </div>
      <button type="button" class="drawer-close-btn" onclick="closeNavDrawer()" aria-label="Close Navigation Menu">&times;</button>
    </div>

    <div class="drawer-scroll-body">
      <div class="drawer-sec-heading">Main Portfolio Views</div>
      <a href="${resumeHref}" class="drawer-item ${activeTab === 'resume' ? 'active' : ''}">
        <i class="fa-solid fa-file-lines" style="color:#1e3a8a;"></i>
        <span>Full Resume</span>
      </a>
      <a href="${videosHref}" class="drawer-item ${activeTab === 'videos' ? 'active' : ''}">
        <i class="fa-solid fa-play" style="color:#ea4335;"></i>
        <span>Demo Videos (${videoCount})</span>
      </a>
      <a href="${galleryHref}" class="drawer-item ${activeTab === 'gallery' ? 'active' : ''}">
        <i class="fa-solid fa-images" style="color:#1a73e8;"></i>
        <span>Photo Gallery (${galleryCount})</span>
      </a>
      <a href="/Devender_Resume.pdf" download class="drawer-item">
        <i class="fa-solid fa-file-pdf" style="color:#ea4335;"></i>
        <span>Download PDF Resume</span>
      </a>

      <div class="drawer-sec-heading" style="margin-top:14px;">Quick Resume Sections</div>
      <a href="${resumeHref}#sec-profile" class="drawer-item" onclick="closeNavDrawer()">
        <i class="fa-solid fa-user" style="color:#1e3a8a;"></i>
        <span>Profile Summary &amp; Bio</span>
      </a>
      <a href="${resumeHref}#sec-details" class="drawer-item" onclick="closeNavDrawer()">
        <i class="fa-solid fa-id-card" style="color:#0d9488;"></i>
        <span>Verified Faculty Details</span>
      </a>
      <a href="${resumeHref}#sec-metrics" class="drawer-item" onclick="closeNavDrawer()">
        <i class="fa-solid fa-chart-simple" style="color:#2563eb;"></i>
        <span>Faculty Highlights</span>
      </a>
      <a href="${resumeHref}#sec-pedagogy" class="drawer-item" onclick="closeNavDrawer()">
        <i class="fa-solid fa-lightbulb" style="color:#d97706;"></i>
        <span>Pedagogy &amp; Composite Lab</span>
      </a>
      <a href="${resumeHref}#sec-experience" class="drawer-item" onclick="closeNavDrawer()">
        <i class="fa-solid fa-briefcase" style="color:#16a34a;"></i>
        <span>Professional Experience</span>
      </a>
      <a href="${resumeHref}#sec-education" class="drawer-item" onclick="closeNavDrawer()">
        <i class="fa-solid fa-graduation-cap" style="color:#6366f1;"></i>
        <span>Academic Qualifications</span>
      </a>
      <a href="${resumeHref}#sec-certifications" class="drawer-item" onclick="closeNavDrawer()">
        <i class="fa-solid fa-stamp" style="color:#dc2626;"></i>
        <span>GATE &amp; CTET Certifications</span>
      </a>
    </div>

    <div class="drawer-bottom-actions">
      ${privacy.showPhone && cleanPhone ? `
      <a href="tel:${cleanPhone}" class="drawer-cta-btn call">
        <i class="fa-solid fa-phone"></i> Call
      </a>` : ''}
      ${privacy.showAltPhone && cleanPhone ? `
      <a href="https://wa.me/${cleanPhone.replace('+', '')}?text=Hello%20${encodeURIComponent(name)}%20Sir%2C%20reviewed%20your%20verified%20profile%20on%20CSEEL." target="_blank" class="drawer-cta-btn wa">
        <i class="fa-brands fa-whatsapp"></i> WhatsApp
      </a>` : ''}
    </div>
  </aside>`;
}

/**
 * Shared Standardized Portal Footer
 */
export function renderSharedFooter(faculty: FacultyProfile, keyPrefix: string = ''): string {
  const name = faculty.name || 'Faculty';
  const cleanSlug = faculty.slug;
  const facultyCode = faculty.facultyCode || 'AA001';
  const subject = faculty.subject || 'Physics';
  const title = faculty.title || `${subject} Faculty`;
  const photoUrl = faculty.photoUrl || '/images/dev-sharma.jpg';
  const phone = faculty.phone || '+918683979659';
  const cleanPhone = phone.replace(/[^0-9+]/g, '');

  const resumeHref = keyPrefix ? `${keyPrefix}/${cleanSlug}.html` : `${cleanSlug}.html`;
  const videosHref = keyPrefix ? `${keyPrefix}/${cleanSlug}-videos.html` : `${cleanSlug}-videos.html`;
  const galleryHref = keyPrefix ? `${keyPrefix}/${cleanSlug}-gallery.html` : `${cleanSlug}-gallery.html`;

  const videoCount = (faculty.videos || []).length || 6;
  const galleryCount = (faculty.galleryImages || []).length || 8;

  return `
  <!-- Shared Standardized Portal Footer -->
  <footer class="portal-footer">
    <div class="portal-footer-inner">
      <div class="portal-footer-brand">
        <img src="${photoUrl}" alt="${name}" class="portal-footer-avatar" onerror="this.src=\'/images/dev-sharma.jpg\'" />
        <div>
          <div style="font-weight:700; color:#f8fafc; font-size:0.9rem;">${name}</div>
          <div style="font-size:0.75rem; color:#38bdf8;">${title} &bull; ID: ${facultyCode}</div>
        </div>
      </div>
      <div class="portal-footer-links">
        <a href="${resumeHref}">Resume</a>
        <a href="${videosHref}">Videos (${videoCount})</a>
        <a href="${galleryHref}">Gallery (${galleryCount})</a>
        <a href="/Devender_Resume.pdf" download>PDF Resume</a>
        ${cleanPhone ? `<a href="tel:${cleanPhone}">Call</a>` : ''}
        ${cleanPhone ? `<a href="https://wa.me/${cleanPhone.replace('+', '')}?text=Hello%20${encodeURIComponent(name)}%20Sir" target="_blank">WhatsApp</a>` : ''}
      </div>
      <div style="font-size:0.75rem; color:#64748b; width:100%; text-align:center; margin-top:6px; border-top:1px solid #1e293b; padding-top:8px;">
        &copy; 2026 CSEEL Verified Faculty Network &bull; Prakash Vihar Colony, Palwal, Haryana &bull; All Rights Reserved
      </div>
    </div>
  </footer>`;
}

/**
 * Shared Mobile Bottom Navigation Dock
 */
export function renderBottomNavDock(faculty: FacultyProfile, activeTab: ResumePageTab, keyPrefix: string = ''): string {
  const cleanSlug = faculty.slug;
  const name = faculty.name || 'Faculty';
  const photoUrl = faculty.photoUrl || '/images/dev-sharma.jpg';
  const phone = faculty.phone || '+918683979659';
  const cleanPhone = phone.replace(/[^0-9+]/g, '');

  const resumeHref = keyPrefix ? `${keyPrefix}/${cleanSlug}.html` : `${cleanSlug}.html`;
  const videosHref = keyPrefix ? `${keyPrefix}/${cleanSlug}-videos.html` : `${cleanSlug}-videos.html`;
  const galleryHref = keyPrefix ? `${keyPrefix}/${cleanSlug}-gallery.html` : `${cleanSlug}-gallery.html`;

  return `
  <!-- Shared Standardized Mobile Bottom Navigation Dock -->
  <nav class="g-bottom-nav">
    <button type="button" onclick="openNavDrawer()" class="g-nav-item menu" title="Open Navigation Menu">
      <div class="g-nav-icon"><img src="${photoUrl}" class="g-nav-avatar" alt="Menu" onerror="this.src=\'/images/dev-sharma.jpg\'" /></div>
      <span>Menu</span>
    </button>
    <a href="${resumeHref}" class="g-nav-item resume ${activeTab === 'resume' ? 'active' : ''}" title="Full Resume Profile">
      <div class="g-nav-icon"><i class="fa-solid fa-file-lines"></i></div>
      <span>Resume</span>
    </a>
    <a href="${videosHref}" class="g-nav-item videos ${activeTab === 'videos' ? 'active' : ''}" title="Demo Video Lectures">
      <div class="g-nav-icon"><i class="fa-solid fa-play"></i></div>
      <span>Videos</span>
    </a>
    <a href="${galleryHref}" class="g-nav-item gallery ${activeTab === 'gallery' ? 'active' : ''}" title="Photo Gallery">
      <div class="g-nav-icon"><i class="fa-solid fa-images"></i></div>
      <span>Gallery</span>
    </a>
    ${cleanPhone ? `
    <a href="https://wa.me/${cleanPhone.replace('+', '')}?text=Hello%20${encodeURIComponent(name)}%20Sir%2C%20reviewed%20your%20profile%20on%20resumes.cseel.org." target="_blank" class="g-nav-item wa" title="WhatsApp Message">
      <div class="g-nav-icon"><i class="fa-brands fa-whatsapp"></i></div>
      <span>WhatsApp</span>
    </a>` : ''}
  </nav>`;
}

/**
 * Shared Image Preview Lightbox Modal
 */
export function renderImagePreviewModal(faculty: FacultyProfile, keyPrefix: string = ''): string {
  const cleanSlug = faculty.slug;
  const resumeHref = keyPrefix ? `${keyPrefix}/${cleanSlug}.html` : `${cleanSlug}.html`;

  return `
  <!-- Shared Reusable Image Preview Lightbox Modal -->
  <div class="g-preview-modal" id="previewModal" onclick="closePreview()">
    <div class="g-preview-box" onclick="event.stopPropagation()">
      <button type="button" class="g-preview-close" onclick="closePreview()" aria-label="Close Preview">&times;</button>
      <div class="g-preview-img-container">
        <img src="" alt="" class="g-preview-img" id="previewImg" />
      </div>
      <div class="g-preview-meta">
        <h3 class="g-preview-title" id="previewTitle"></h3>
        <div class="g-preview-details-row">
          <span id="previewSub"></span>
          <span id="previewDims" style="font-family:monospace;"></span>
        </div>
        <div class="g-preview-actions">
          <a href="${resumeHref}" class="btn-g-action btn-g-visit">
            <i class="fa-solid fa-file-lines"></i> Visit Full Resume
          </a>
          <button type="button" class="btn-g-action btn-g-share" onclick="shareCurrentPhoto()">
            <i class="fa-solid fa-share-nodes"></i> Share Photo
          </button>
        </div>
      </div>
    </div>
  </div>`;
}

/**
 * Shared Video Player Modal
 */
export function renderVideoPlayerModal(): string {
  return `
  <!-- Shared Reusable Responsive Video Player Modal (HTML5 + Embed) -->
  <div class="video-modal" id="videoModal" onclick="closeVideoModal()">
    <div class="video-modal-box" onclick="event.stopPropagation()">
      <div class="video-modal-top">
        <div style="display:flex; align-items:center; gap:8px; overflow:hidden; flex:1; padding-right:12px;">
          <i class="fa-solid fa-circle-play text-red-500"></i>
          <span id="modalVideoTitle" style="font-weight:700; font-size:0.92rem; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">Demo Video</span>
        </div>
        <button type="button" class="video-modal-close" onclick="closeVideoModal()" aria-label="Close Video">&times;</button>
      </div>
      <div class="video-modal-wrap" id="videoModalWrap">
        <video id="modalHtml5Video" controls autoplay playsinline preload="auto" style="display:none; position:absolute; top:0; left:0; width:100%; height:100%; object-fit:contain; background:#000;"></video>
        <iframe id="modalVideoFrame" src="" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowfullscreen style="position:absolute; top:0; left:0; width:100%; height:100%; border:none;"></iframe>
      </div>
      <div id="modalDriveNote" style="display:none; padding:8px 14px; background:#0f172a; color:#cbd5e1; font-size:0.75rem; border-top:1px solid #334155; text-align:center;">
        <i class="fa-brands fa-google-drive" style="color:#38bdf8; margin-right:4px;"></i> Playing via Google Drive. If video doesn't play directly, click <strong style="color:#38bdf8;">"Open Direct"</strong> below.
      </div>
      <div class="video-modal-bottom" style="padding:10px 14px; background:#1e293b; display:flex; justify-content:space-between; align-items:center; border-top:1px solid #334155;">
        <span id="modalVideoCat" style="font-size:0.75rem; color:#38bdf8; font-weight:600;">CSEEL Verified Demonstration Video</span>
        <div style="display:flex; align-items:center; gap:8px;">
          <a id="modalVideoDirectLink" href="#" target="_blank" class="btn-g-action" style="padding:5px 12px; font-size:0.75rem; background:#38bdf8; color:#0f172a; font-weight:700; text-decoration:none; border-radius:6px; display:inline-flex; align-items:center; gap:5px;">
            <i class="fa-solid fa-arrow-up-right-from-square"></i> Open Direct
          </a>
          <button type="button" class="btn-g-action btn-g-share" onclick="shareCurrentVideo()" style="padding:5px 12px; font-size:0.75rem; background:#334155; color:#fff; border-radius:6px; display:inline-flex; align-items:center; gap:5px;">
            <i class="fa-solid fa-share-nodes"></i> Share
          </button>
        </div>
      </div>
    </div>
  </div>`;
}

/**
 * Shared JavaScript logic for Navigation Drawer, Modals, and Sharing
 */
export function renderSharedScripts(facultyName: string = 'Faculty'): string {
  return `
    let currentPhotoUrl = '';
    let currentPhotoTitle = '';
    let currentVideoUrl = '';
    let currentVideoTitle = '';

    function openNavDrawer() {
      const backdrop = document.getElementById('drawerBackdrop') || document.getElementById('navDrawerBackdrop');
      const sheet = document.getElementById('navDrawerSheet');
      if (backdrop) backdrop.classList.add('active');
      if (sheet) sheet.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeNavDrawer() {
      const backdrop = document.getElementById('drawerBackdrop') || document.getElementById('navDrawerBackdrop');
      const sheet = document.getElementById('navDrawerSheet');
      if (backdrop) backdrop.classList.remove('active');
      if (sheet) sheet.classList.remove('active');
      document.body.style.overflow = '';
    }

    function openPreview(url, title, dims, sub) {
      currentPhotoUrl = url;
      currentPhotoTitle = title;
      const modal = document.getElementById('previewModal');
      const img = document.getElementById('previewImg');
      const titleEl = document.getElementById('previewTitle');
      const dimsEl = document.getElementById('previewDims');
      const subEl = document.getElementById('previewSub');

      if (img) img.src = url;
      if (titleEl) titleEl.innerText = title;
      if (dimsEl) dimsEl.innerText = dims || 'High-Resolution';
      if (subEl) subEl.innerText = sub || 'Verified Faculty Record';
      if (modal) modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closePreview() {
      const modal = document.getElementById('previewModal');
      if (modal) modal.classList.remove('active');
      document.body.style.overflow = '';
    }

    function parseToEmbedUrl(raw) {
      if (!raw) return '';
      const url = String(raw).trim();

      // 1. Google Drive File
      const driveMatch = url.match(/(?:drive\\.google\\.com\\/(?:file\\/d\\/|open\\?id=|uc\\?id=)|lh3\\.googleusercontent\\.com\\/d\\/)([\\w-]+)/i);
      if (driveMatch) {
        return {
          embed: 'https://drive.google.com/file/d/' + driveMatch[1] + '/preview',
          isDrive: true,
          direct: url
        };
      }

      // 2. Google Drive Folder
      const folderMatch = url.match(/drive\\.google\\.com\\/drive\\/folders\\/([\\w-]+)/i);
      if (folderMatch) {
        return {
          embed: 'https://drive.google.com/embeddedfolderview?id=' + folderMatch[1] + '#grid',
          isDrive: true,
          direct: url
        };
      }

      // 3. YouTube
      const ytMatch = url.match(/(?:youtu\\.be\\/|youtube\\.com\\/(?:embed\\/|v\\/|watch\\?v=|watch\\?.+&v=))([\\w-]{11})/i);
      if (ytMatch) {
        return {
          embed: 'https://www.youtube-nocookie.com/embed/' + ytMatch[1] + '?autoplay=1&rel=0',
          isDrive: false,
          direct: 'https://www.youtube.com/watch?v=' + ytMatch[1]
        };
      }

      // 4. Vimeo
      const vimeoMatch = url.match(/vimeo\\.com\\/(?:video\\/)?(\\d+)/i);
      if (vimeoMatch) {
        return {
          embed: 'https://player.vimeo.com/video/' + vimeoMatch[1] + '?autoplay=1',
          isDrive: false,
          direct: url
        };
      }

      return {
        embed: url,
        isDrive: false,
        direct: url
      };
    }

    function openVideoModal(previewUrl, title, driveUrl) {
      const rawUrl = (previewUrl || driveUrl || '').trim();
      currentVideoUrl = rawUrl;
      currentVideoTitle = title || 'Demo Video';
      const modal = document.getElementById('videoModal');
      const frame = document.getElementById('modalVideoFrame');
      const html5Video = document.getElementById('modalHtml5Video');
      const titleEl = document.getElementById('modalVideoTitle');
      const directLink = document.getElementById('modalVideoDirectLink');
      const driveNote = document.getElementById('modalDriveNote');

      if (titleEl) titleEl.innerText = currentVideoTitle;
      
      const parsed = parseToEmbedUrl(rawUrl);

      if (directLink) {
        directLink.href = parsed.direct || rawUrl;
        directLink.style.display = (parsed.direct || rawUrl) ? 'inline-flex' : 'none';
      }

      if (driveNote) {
        driveNote.style.display = parsed.isDrive ? 'block' : 'none';
      }

      const isMp4 = rawUrl && (rawUrl.toLowerCase().includes('.mp4') || rawUrl.includes('/storage/v1/object/public/'));
      if (isMp4 && html5Video) {
        if (frame) { frame.style.display = 'none'; frame.src = ''; }
        html5Video.style.display = 'block';
        html5Video.src = rawUrl;
        html5Video.play().catch(function() {});
      } else if (frame) {
        if (html5Video) { html5Video.pause(); html5Video.style.display = 'none'; html5Video.src = ''; }
        frame.style.display = 'block';
        frame.src = parsed.embed;
      }

      if (modal) modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    const openVideoPlayer = openVideoModal;

    function closeVideoModal() {
      const modal = document.getElementById('videoModal');
      const frame = document.getElementById('modalVideoFrame');
      const html5Video = document.getElementById('modalHtml5Video');
      if (html5Video) { html5Video.pause(); html5Video.src = ''; }
      if (frame) frame.src = '';
      if (modal) modal.classList.remove('active');
      document.body.style.overflow = '';
    }

    function shareCurrentPhoto() {
      const shareData = {
        title: currentPhotoTitle || '${facultyName} Photo',
        text: (currentPhotoTitle || 'Photo') + ' — ${facultyName}',
        url: window.location.href
      };
      if (navigator.share) {
        navigator.share(shareData).catch(function() {});
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href);
        alert('Photo link copied to clipboard!');
      }
    }

    function shareCurrentVideo() {
      const shareData = {
        title: currentVideoTitle || '${facultyName} Demonstration Video',
        text: 'Watch ' + (currentVideoTitle || 'Demo Video') + ' by ${facultyName}',
        url: currentVideoUrl || window.location.href
      };
      if (navigator.share) {
        navigator.share(shareData).catch(function() {});
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(currentVideoUrl || window.location.href);
        alert('Video link copied to clipboard!');
      }
    }

    function shareCurrentProfile() {
      const shareData = {
        title: '${facultyName} — Verified Faculty Portfolio',
        text: 'Review Verified Faculty Profile of ${facultyName}:',
        url: window.location.href
      };
      if (navigator.share) {
        navigator.share(shareData).catch(function() {});
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href);
        alert('Profile link copied to clipboard!');
      }
    }

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closePreview();
        closeVideoModal();
        closeNavDrawer();
      }
    });
  `;
}

/**
 * Generates Schema.org JSON-LD Structured Data & OpenGraph SEO tags
 */
export function renderSeoHead(faculty: FacultyProfile, pageType: ResumePageTab, fullUrl: string = ''): string {
  const name = faculty.name || 'Faculty';
  const subject = faculty.subject || 'Physics';
  const title = faculty.title || `${subject} Faculty`;
  const facultyCode = faculty.facultyCode || 'AA001';
  const photoUrl = faculty.photoUrl || '/images/dev-sharma.jpg';
  const district = faculty.addressDetails?.district || 'Palwal';
  const state = faculty.addressDetails?.state || 'Haryana';

  let pageTitle = `${name} — ${title} | Verified Profile`;
  let metaDescription = `Official verified profile and portfolio of ${name} (${title}, ID: ${facultyCode}). Experiential pedagogy, composite science lab architecture, video demonstrations, and qualifications.`;

  if (pageType === 'gallery') {
    pageTitle = `Photo Gallery — ${name} | CSEEL Resumes`;
    metaDescription = `Official photo gallery of ${name} (${title}). High-resolution photos of classroom lectures, STEM lab setups, and teacher training workshops.`;
  } else if (pageType === 'videos') {
    pageTitle = `Demo Videos — ${name} | CSEEL Resumes`;
    metaDescription = `Interactive demo lecture videos and composite STEM lab setups by ${name} (${title}, ID: ${facultyCode}). High-definition classroom problem-solving and teacher training.`;
  }

  const canonicalUrl = fullUrl || `https://resumes.cseel.org/best-Teacherfaculty/${(subject || 'physics').toLowerCase()}/${faculty.slug}${pageType === 'resume' ? '.html' : `-${pageType}.html`}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    'mainEntity': {
      '@type': 'Person',
      'name': name,
      'jobTitle': title,
      'description': metaDescription,
      'image': photoUrl.startsWith('http') ? photoUrl : `https://resumes.cseel.org${photoUrl}`,
      'identifier': facultyCode,
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': district,
        'addressRegion': state,
        'addressCountry': 'IN'
      },
      'worksFor': {
        '@type': 'Organization',
        'name': 'CSEEL Verified Faculty Network',
        'url': 'https://cseel.org'
      },
      'url': canonicalUrl
    }
  };

  return `
  <!-- Primary Meta Tags -->
  <title>${pageTitle}</title>
  <meta name="title" content="${pageTitle}" />
  <meta name="description" content="${metaDescription}" />
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
  <link rel="canonical" href="${canonicalUrl}" />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="profile" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:title" content="${pageTitle}" />
  <meta property="og:description" content="${metaDescription}" />
  <meta property="og:image" content="${photoUrl.startsWith('http') ? photoUrl : `https://resumes.cseel.org${photoUrl}`}" />
  <meta property="og:site_name" content="CSEEL Verified Resumes" />

  <!-- Twitter Cards -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="${canonicalUrl}" />
  <meta name="twitter:title" content="${pageTitle}" />
  <meta name="twitter:description" content="${metaDescription}" />
  <meta name="twitter:image" content="${photoUrl.startsWith('http') ? photoUrl : `https://resumes.cseel.org${photoUrl}`}" />

  <!-- Schema.org JSON-LD Structured Data -->
  <script type="application/ld+json">
    ${JSON.stringify(jsonLd, null, 2)}
  </script>`;
}

export const renderCommonStyles = renderSharedThemeCss;
export const renderCommonScripts = renderSharedScripts;
