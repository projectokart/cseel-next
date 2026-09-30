import {
  renderSeoHead,
  renderFloatingDrawerHandle,
  renderNavDrawerSheet,
  renderBottomNavDock,
  renderImagePreviewModal,
  renderVideoPlayerModal,
  renderSharedThemeCss,
  renderSharedHeader,
  renderSharedFooter,
  renderSharedScripts,
  renderCommonStyles,
  renderCommonScripts
} from './facultyComponents';
import { FacultyProfile } from './facultyProfiles';

/**
 * Generates an Access Denied / Security Shield page when an invalid key is provided,
 * preventing scrapers and crawlers from indexing faculty profiles.
 */
export function generateAccessDeniedHtml(reason: string = 'Invalid or missing anti-scraping access key.'): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="robots" content="noindex, nofollow, noarchive, nosnippet" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Protected Faculty Profile — Access Denied</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 16px; }
    .card { background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 32px 24px; max-width: 480px; width: 100%; text-align: center; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); }
    .icon { width: 64px; height: 64px; background: rgba(239, 68, 68, 0.15); color: #ef4444; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 28px; margin-bottom: 20px; }
    h1 { font-size: 1.35rem; font-weight: 700; margin-bottom: 10px; color: #fff; }
    p { font-size: 0.9rem; color: #94a3b8; line-height: 1.5; margin-bottom: 24px; }
    .badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(59, 130, 246, 0.15); color: #60a5fa; font-size: 0.8rem; padding: 6px 14px; border-radius: 9999px; margin-bottom: 20px; font-family: monospace; }
    .btn { display: inline-flex; align-items: center; gap: 8px; background: #2563eb; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-size: 0.88rem; font-weight: 600; transition: background 0.2s; }
    .btn:hover { background: #1d4ed8; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon"><i class="fa-solid fa-shield-halved"></i></div>
    <h1>Anti-Scraping Shield Active</h1>
    <div class="badge"><i class="fa-solid fa-lock"></i> Token Verification Required</div>
    <p>${reason}</p>
    <a href="/users" class="btn"><i class="fa-solid fa-user-gear"></i> Faculty Portal / Users Login</a>
  </div>
</body>
</html>`;
}

/**
 * Generates a personalized "Pending Verification / Under Review" page
 */
export function generatePendingVerificationHtml(faculty: FacultyProfile, fullUrl: string = ''): string {
  const adminWhatsApp = '918683979659';
  const facultyCode = faculty.facultyCode || '';
  const name = faculty.name || 'Educator';
  const phone = faculty.phone || '';
  const email = faculty.email || '';
  const subject = faculty.subject || 'Faculty';
  const title = faculty.title || `${subject} Faculty`;
  const experience = faculty.experience || '';
  const photoUrl = faculty.photoUrl || '/images/dev-sharma.jpg';
  const address = faculty.address || faculty.location || '';
  const qualification = faculty.resumeData?.qualifications?.[0]?.degree || '';

  const rawMsg = `Dear Sir,
This side ${name}${facultyCode ? ` (Faculty ID: ${facultyCode})` : ''}.
Contact: ${phone}
Email: ${email}
${qualification ? `Qualification: ${qualification}` : ''}
${experience ? `Experience: ${experience}` : ''}
${address ? `Address: ${address}` : ''}
Profile URL: ${fullUrl || 'https://resumes.cseel.org'}

Please review and verify my faculty profile. Thank you!`;

  const waUrl = `https://wa.me/${adminWhatsApp}?text=${encodeURIComponent(rawMsg)}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="robots" content="noindex, nofollow, noarchive" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
  <title>Verification Pending — ${name} | CSEEL Resumes</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
  <style>
    ${renderSharedThemeCss()}
    .pending-wrapper {
      max-width: 680px;
      margin: 40px auto;
      background: #ffffff;
      border: 1.5px solid var(--border-color);
      border-radius: 20px;
      padding: 32px 24px;
      box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
      text-align: center;
    }
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #fef3c7;
      color: #b45309;
      border: 1px solid #fde68a;
      padding: 6px 16px;
      border-radius: 9999px;
      font-size: 0.82rem;
      font-weight: 700;
      margin-bottom: 20px;
    }
    .faculty-id-pill {
      display: inline-block;
      background: #e8f0fe;
      color: #1a73e8;
      font-family: monospace;
      font-size: 0.95rem;
      font-weight: 800;
      padding: 4px 12px;
      border-radius: 8px;
      margin-top: 8px;
    }
    .btn-wa-admin {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      background: #25D366;
      color: #ffffff;
      font-weight: 700;
      font-size: 0.95rem;
      padding: 14px 24px;
      border-radius: 12px;
      text-decoration: none;
      box-shadow: 0 4px 14px rgba(37, 211, 102, 0.35);
      margin-top: 24px;
      transition: all 0.2s;
    }
    .btn-wa-admin:hover {
      background: #1eb857;
      transform: translateY(-2px);
    }
  </style>
</head>
<body>
  ${renderFloatingDrawerHandle(photoUrl, name)}
  ${renderSharedHeader(faculty, 'resume')}

  <main class="container">
    <div class="pending-wrapper">
      <div class="status-badge">
        <i class="fa-solid fa-clock-rotate-left"></i> Verification Under Review
      </div>

      <h1 style="font-size: 1.5rem; font-weight: 800; color: #0f172a; margin-bottom: 8px;">
        Dear ${name}, Your Profile is Under Review
      </h1>
      
      ${facultyCode ? `<div><span class="faculty-id-pill">Faculty ID: ${facultyCode}</span></div>` : ''}

      <p style="font-size: 0.92rem; color: #475569; line-height: 1.6; margin-top: 18px;">
        Your faculty profile has been submitted successfully and is currently being verified by the CSEEL administration. 
        Once approved by the admin team, your profile will be public and visible to schools, institutions, and recruiters across India.
      </p>

      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin: 24px 0; text-align: left;">
        <div style="font-size: 0.82rem; font-weight: 700; color: #0f172a; margin-bottom: 8px; text-transform: uppercase;">
          <i class="fa-solid fa-circle-info" style="color:#2563eb;"></i> Profile Summary Details
        </div>
        <div style="font-size: 0.85rem; color: #334155; line-height: 1.6;">
          &bull; <strong>Name:</strong> ${name}<br />
          &bull; <strong>Subject / Title:</strong> ${title}<br />
          ${phone ? `&bull; <strong>Contact Number:</strong> ${phone}<br />` : ''}
          ${email ? `&bull; <strong>Email:</strong> ${email}<br />` : ''}
          ${qualification ? `&bull; <strong>Qualification:</strong> ${qualification}<br />` : ''}
          ${address ? `&bull; <strong>Address:</strong> ${address}` : ''}
        </div>
      </div>

      <a href="${waUrl}" target="_blank" class="btn-wa-admin">
        <i class="fa-brands fa-whatsapp" style="font-size: 1.3rem;"></i>
        Send Verification Request to Admin WhatsApp
      </a>
    </div>
  </main>

  ${renderSharedFooter(faculty)}
  ${renderBottomNavDock(faculty, 'resume')}
  ${renderNavDrawerSheet(faculty, 'resume')}
</body>
</html>`;
}

/**
 * Generates the Videos Search & Play Page
 */
export function generateGoogleVideosHtml(faculty: FacultyProfile, keyPrefix: string = ''): string {
  const name = faculty.name || 'Faculty';
  const cleanSlug = faculty.slug;
  const photoUrl = faculty.photoUrl || '/images/dev-sharma.jpg';
  const phone = faculty.phone || '';
  const cleanPhone = phone.replace(/[^0-9+]/g, '');
  const facultyCode = faculty.facultyCode || '';
  const subject = faculty.subject || 'Faculty';
  const title = faculty.title || `${subject} Faculty`;

  const resumeHref = keyPrefix ? `${keyPrefix}/${cleanSlug}.html` : `${cleanSlug}.html`;
  const videosHref = keyPrefix ? `${keyPrefix}/${cleanSlug}-videos.html` : `${cleanSlug}-videos.html`;
  const galleryHref = keyPrefix ? `${keyPrefix}/${cleanSlug}-gallery.html` : `${cleanSlug}-gallery.html`;

  let displayVideos = (faculty.videos && Array.isArray(faculty.videos) && faculty.videos.length > 0)
    ? faculty.videos
    : [];

  // Fallback: check sections if videos array was empty
  if (displayVideos.length === 0 && Array.isArray(faculty.sections)) {
    const vidSec = faculty.sections.find((s: any) => s.id === 'sec-videos' || s.type === 'demo_videos');
    if (vidSec?.data?.items && Array.isArray(vidSec.data.items) && vidSec.data.items.length > 0) {
      displayVideos = vidSec.data.items;
    }
  }

  // Fallback: check faculty.videoLink
  if (displayVideos.length === 0 && faculty.videoLink) {
    displayVideos = [
      {
        title: `${name} — Laboratory Experiment & Classroom Lecture Demonstration`,
        url: faculty.videoLink,
        category: `${subject} Demonstration`,
        duration: 'Full Session',
        description: 'Comprehensive experiential laboratory demonstration and classroom lecture session.'
      }
    ];
  }

  let videoCardsHtml = '';
  if (displayVideos.length > 0) {
    displayVideos.forEach((v: any, idx: number) => {
      const rawUrl = (v.url || v.driveUrl || '').trim();
      let ytId = '';
      let driveId = '';
      let driveFolderId = '';
      let isDrive = false;
      let isDriveFolder = false;

      if (rawUrl) {
        const ytMatch = rawUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/i);
        if (ytMatch) ytId = ytMatch[1];

        const driveMatch = rawUrl.match(/(?:drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=)|lh3\.googleusercontent\.com\/d\/)([\w-]+)/i);
        if (driveMatch) {
          isDrive = true;
          driveId = driveMatch[1];
        }

        const folderMatch = rawUrl.match(/drive\.google\.com\/drive\/folders\/([\w-]+)/i);
        if (folderMatch) {
          isDriveFolder = true;
          driveFolderId = folderMatch[1];
        }
      }

      const isMp4 = rawUrl && (rawUrl.toLowerCase().includes('.mp4') || rawUrl.includes('/storage/v1/object/public/'));
      const duration = v.duration || (isDriveFolder ? 'Folder' : '15:00');
      const category = v.category || `${subject} Demonstration`;
      const description = v.description || 'Hands-on experiential demonstration and classroom lecture session.';

      let embedUrl = rawUrl;
      if (ytId) {
        embedUrl = `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0`;
      } else if (isDrive && driveId) {
        embedUrl = `https://drive.google.com/file/d/${driveId}/preview`;
      } else if (isDriveFolder && driveFolderId) {
        embedUrl = `https://drive.google.com/embeddedfolderview?id=${driveFolderId}#grid`;
      }

      let thumbHtml = '';
      if (v.thumbnailUrl) {
        thumbHtml = `<img src="${v.thumbnailUrl}" alt="${(v.title || '').replace(/"/g, '&quot;')}" class="video-thumb-img" loading="lazy" onerror="this.onerror=null;this.src='${photoUrl}';" />`;
      } else if (isMp4) {
        thumbHtml = `<video preload="metadata" src="${rawUrl}#t=0.5" class="video-thumb-img" muted playsinline style="object-fit:cover; width:100%; height:100%;"></video>`;
      } else if (ytId) {
        thumbHtml = `<img src="https://img.youtube.com/vi/${ytId}/hqdefault.jpg" alt="${(v.title || '').replace(/"/g, '&quot;')}" class="video-thumb-img" loading="lazy" onerror="this.onerror=null;this.src='${photoUrl}';" />`;
      } else if (isDrive && driveId) {
        const driveThumb1 = `https://lh3.googleusercontent.com/d/${driveId}=w640`;
        const driveThumb2 = `https://drive.google.com/thumbnail?id=${driveId}&sz=w640`;
        thumbHtml = `
          <img src="${driveThumb1}" alt="${(v.title || '').replace(/"/g, '&quot;')}" class="video-thumb-img" loading="lazy" referrerpolicy="no-referrer" onerror="this.onerror=null; this.src='${driveThumb2}'; this.onerror=function(){ this.style.display='none'; if(this.nextElementSibling) { this.nextElementSibling.style.display='flex'; } };" />
          <div class="drive-thumb-poster" style="display:none; width:100%; height:100%; background:linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0369a1 100%); flex-direction:column; align-items:center; justify-content:center; gap:8px; color:#fff; padding:12px; text-align:center;">
            <i class="fa-brands fa-google-drive" style="font-size:2.2rem; color:#38bdf8;"></i>
            <span style="font-size:0.75rem; font-weight:800; letter-spacing:0.05em; text-transform:uppercase; color:#bae6fd;">Google Drive Video</span>
          </div>`;
      } else if (isDriveFolder) {
        thumbHtml = `
          <div class="drive-thumb-poster" style="width:100%; height:100%; background:linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0369a1 100%); display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px; color:#fff; padding:12px; text-align:center;">
            <i class="fa-brands fa-google-drive" style="font-size:2.2rem; color:#38bdf8;"></i>
            <span style="font-size:0.75rem; font-weight:800; letter-spacing:0.05em; text-transform:uppercase; color:#bae6fd;">Google Drive Folder</span>
          </div>`;
      } else {
        thumbHtml = `<img src="${photoUrl}" alt="${(v.title || '').replace(/"/g, '&quot;')}" class="video-thumb-img" loading="lazy" />`;
      }

      videoCardsHtml += `
        <div class="video-card-row" data-cat="${category.toLowerCase()}">
          <div class="video-thumb-container" onclick="openVideoPlayer('${embedUrl}', '${(v.title || '').replace(/'/g, "\\'")}', '${rawUrl}')">
            ${thumbHtml}
            <div class="play-overlay"><i class="fa-solid fa-play text-white text-lg"></i></div>
            <span class="video-duration-badge"><i class="fa-solid fa-clock" style="font-size:9px; margin-right:3px;"></i>${duration}</span>
          </div>
          <div class="video-card-content">
            <div>
              <div class="video-sub-line">
                <span class="badge-cat"><i class="fa-solid fa-flask" style="font-size:9px; margin-right:4px;"></i>${category}</span>
                <span>&bull;</span>
                <span>${name}</span>
              </div>
              <h3 class="video-card-title" onclick="openVideoPlayer('${embedUrl}', '${(v.title || '').replace(/'/g, "\\'")}', '${rawUrl}')">
                ${v.title}
              </h3>
              <p style="font-size:0.8rem; color:#64748b; line-height:1.45; margin:6px 0 12px 0; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">
                ${description}
              </p>
            </div>
            <div class="video-card-actions">
              <button class="card-btn-open" onclick="openVideoPlayer('${embedUrl}', '${(v.title || '').replace(/'/g, "\\'")}', '${rawUrl}')">
                <i class="fa-solid fa-play"></i> Watch Video
              </button>
              <a href="${rawUrl}" target="_blank" class="card-btn-icon" title="Open in Google Drive / Direct Link">
                <i class="fa-solid fa-arrow-up-right-from-square text-blue-600"></i>
              </a>
            </div>
          </div>
        </div>`;
    });
  } else {
    videoCardsHtml = `
      <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:16px; padding:48px 20px; text-align:center; grid-column:1/-1;">
        <i class="fa-solid fa-video-slash" style="font-size:2.5rem; color:#94a3b8; margin-bottom:12px; display:inline-block;"></i>
        <h3 style="font-size:1.1rem; font-weight:700; color:#1e293b; margin-bottom:4px;">No Demonstration Videos Uploaded Yet</h3>
        <p style="font-size:0.88rem; color:#64748b; max-width:400px; margin:0 auto;">This educator has not added video links yet. Use the editor to add YouTube or Drive links.</p>
      </div>`;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
  ${renderSeoHead(faculty, 'videos')}

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />

  <style>
    ${renderSharedThemeCss()}
    .videos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    .video-card-row {
      background: #ffffff;
      border: 1px solid var(--border-color);
      border-radius: 16px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .video-card-row:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 24px rgba(15, 23, 42, 0.09);
    }
    .video-thumb-container {
      position: relative;
      width: 100%;
      aspect-ratio: 16 / 9;
      background: #0f172a;
      cursor: pointer;
      overflow: hidden;
    }
    .video-thumb-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
    }
    .video-card-row:hover .video-thumb-img {
      transform: scale(1.04);
    }
    .play-overlay {
      position: absolute;
      inset: 0;
      background: rgba(15, 23, 42, 0.35);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    }
    .play-overlay i {
      width: 46px;
      height: 46px;
      background: #dc2626;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(220, 38, 38, 0.5);
    }
    .video-duration-badge {
      position: absolute;
      bottom: 8px;
      right: 8px;
      background: rgba(15, 23, 42, 0.85);
      color: #ffffff;
      font-size: 0.72rem;
      font-weight: 700;
      padding: 3px 7px;
      border-radius: 6px;
    }
    .video-card-content {
      padding: 16px;
      display: flex;
      flex-direction: column;
      flex: 1;
      justify-content: space-between;
    }
    .video-card-title {
      font-size: 0.92rem;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.4;
      margin-bottom: 8px;
      cursor: pointer;
    }
    .video-sub-line {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.78rem;
      color: var(--text-muted);
      margin-bottom: 14px;
    }
    .badge-cat {
      background: #f1f5f9;
      color: #475569;
      padding: 2px 8px;
      border-radius: 6px;
      font-weight: 600;
    }
    .video-card-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      border-top: 1px solid #f1f5f9;
      padding-top: 12px;
    }
    .card-btn-open {
      flex: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      background: #eff6ff;
      color: #2563eb;
      font-size: 0.82rem;
      font-weight: 700;
      padding: 8px 12px;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      transition: background 0.15s;
    }
    .card-btn-open:hover { background: #dbeafe; }
    .card-btn-icon {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
    }
  </style>
</head>
<body>
  ${renderFloatingDrawerHandle(photoUrl, name)}
  ${renderSharedHeader(faculty, 'videos', keyPrefix)}

  <main class="container">
    <div style="margin-top: 24px;">
      <h1 style="font-size: 1.4rem; font-weight: 800; color: #0f172a; margin-bottom: 4px;">
        <i class="fa-solid fa-play text-red-600" style="margin-right: 8px;"></i>
        ${name} — Video Lectures & Lab Demonstrations
      </h1>
      <p style="font-size: 0.88rem; color: #64748b;">
        Verified video recordings and classroom lectures (${displayVideos.length} total)
      </p>
    </div>

    <div class="videos-grid">
      ${videoCardsHtml}
    </div>
  </main>

  ${renderVideoPlayerModal()}
  ${renderSharedFooter(faculty, keyPrefix)}
  ${renderBottomNavDock(faculty, 'videos', keyPrefix)}
  ${renderNavDrawerSheet(faculty, 'videos', keyPrefix)}

  <script>
    ${renderSharedScripts(name)}
  </script>
</body>
</html>`;
}

/**
 * Generates the Photo Showcase Gallery Page
 */
export function generateGoogleGalleryHtml(faculty: FacultyProfile, keyPrefix: string = ''): string {
  const name = faculty.name || 'Faculty';
  const cleanSlug = faculty.slug;
  const photoUrl = faculty.photoUrl || '/images/dev-sharma.jpg';
  const phone = faculty.phone || '';
  const facultyCode = faculty.facultyCode || '';
  const subject = faculty.subject || 'Faculty';
  const title = faculty.title || `${subject} Faculty`;

  const resumeHref = keyPrefix ? `${keyPrefix}/${cleanSlug}.html` : `${cleanSlug}.html`;
  const videosHref = keyPrefix ? `${keyPrefix}/${cleanSlug}-videos.html` : `${cleanSlug}-videos.html`;
  const galleryHref = keyPrefix ? `${keyPrefix}/${cleanSlug}-gallery.html` : `${cleanSlug}-gallery.html`;

  const displayImages = (faculty.galleryImages && Array.isArray(faculty.galleryImages)) ? faculty.galleryImages : [];

  let galleryCardsHtml = '';
  if (displayImages.length > 0) {
    displayImages.forEach((img: any, idx: number) => {
      const imgUrl = img.url || photoUrl;
      const imgTitle = (img.title || `${name} — Photo ${idx + 1}`).replace(/"/g, '&quot;');
      const imgSub = (img.subtitle || 'Verified Profile').replace(/"/g, '&quot;');
      const imgCat = img.category || 'all';
      const imgDims = img.dims || 'High-Resolution';

      galleryCardsHtml += `
        <div class="g-image-card" data-cat="${imgCat}" onclick="openPreview('${imgUrl}', '${imgTitle.replace(/'/g, "\'")}', '${imgDims}', '${imgSub.replace(/'/g, "\'")}')">
          <div class="g-img-wrap">
            <img src="${imgUrl}" alt="${imgTitle}" loading="lazy" onerror="this.src='${photoUrl}'" />
          </div>
          <div class="g-card-footer">
            <span class="g-card-domain">${imgSub}</span>
            <h3 class="g-card-title">${imgTitle}</h3>
          </div>
        </div>`;
    });
  } else {
    galleryCardsHtml = `
      <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:16px; padding:48px 20px; text-align:center; grid-column:1/-1;">
        <i class="fa-regular fa-image" style="font-size:2.5rem; color:#94a3b8; margin-bottom:12px; display:inline-block;"></i>
        <h3 style="font-size:1.1rem; font-weight:700; color:#1e293b; margin-bottom:4px;">No Photo Showcase Images Available</h3>
        <p style="font-size:0.88rem; color:#64748b; max-width:400px; margin:0 auto;">This educator has not uploaded classroom or lab photos yet.</p>
      </div>`;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
  ${renderSeoHead(faculty, 'gallery')}

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />

  <style>
    ${renderSharedThemeCss()}
    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 16px;
      margin-top: 20px;
    }
    .g-image-card {
      background: #ffffff;
      border: 1px solid var(--border-color);
      border-radius: 12px;
      overflow: hidden;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .g-image-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);
    }
    .g-img-wrap {
      width: 100%;
      aspect-ratio: 4 / 3;
      overflow: hidden;
      background: #0f172a;
    }
    .g-img-wrap img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
    }
    .g-image-card:hover .g-img-wrap img {
      transform: scale(1.04);
    }
    .g-card-footer {
      padding: 12px;
    }
    .g-card-domain {
      font-size: 0.72rem;
      font-weight: 600;
      color: #64748b;
      display: block;
      margin-bottom: 3px;
    }
    .g-card-title {
      font-size: 0.85rem;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.35;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  </style>
</head>
<body>
  ${renderFloatingDrawerHandle(photoUrl, name)}
  ${renderSharedHeader(faculty, 'gallery', keyPrefix)}

  <main class="container">
    <div style="margin-top: 24px;">
      <h1 style="font-size: 1.4rem; font-weight: 800; color: #0f172a; margin-bottom: 4px;">
        <i class="fa-solid fa-images text-blue-600" style="margin-right: 8px;"></i>
        ${name} — Photo Showcase Gallery
      </h1>
      <p style="font-size: 0.88rem; color: #64748b;">
        Classroom, lab setups and workshops (${displayImages.length} photos)
      </p>
    </div>

    <div class="gallery-grid">
      ${galleryCardsHtml}
    </div>
  </main>

  ${renderImagePreviewModal(faculty, keyPrefix)}
  ${renderSharedFooter(faculty, keyPrefix)}
  ${renderBottomNavDock(faculty, 'gallery', keyPrefix)}
  ${renderNavDrawerSheet(faculty, 'gallery', keyPrefix)}

  <script>
    ${renderSharedScripts(name)}
  </script>
</body>
</html>`;
}

/**
 * Generates the unified, authentic Tailwind Resume HTML.
 * Renders ONLY the user's actual entered data without fake/dummy fallbacks!
 */
/**
 * Generates the unified, authentic Tailwind Resume HTML.
 * EXACT match to DevSharma.html styling, container, and alternating sections.
 * Renders ONLY the user's actual entered data without fake/dummy fallbacks!
 */
export function generateGoogleResumeHtml(faculty: FacultyProfile, keyPrefix: string = ''): string {
  const name = faculty.name || 'Faculty Member';
  const subject = faculty.subject || 'Faculty';
  const cleanSubject = subject.toLowerCase().replace(/[^a-z0-9]/g, '');
  const cleanSlug = faculty.slug;
  const photoUrl = faculty.photoUrl || '/images/dev-sharma.jpg';
  const phone = faculty.phone || '';
  const altPhone = faculty.altPhone || '';
  const email = faculty.email || '';
  const facultyCode = faculty.facultyCode || '';
  const title = faculty.title || `${subject} Faculty`;
  const cleanPhone = phone.replace(/[^0-9+]/g, '');
  const waPhone = cleanPhone.replace(/\+/g, '') || '918683979659';

  // Format public location
  const publicLocation = faculty.addressDetails?.district && faculty.addressDetails?.state
    ? `${faculty.addressDetails.district}, ${faculty.addressDetails.state}`
    : (faculty.location || faculty.address || '').replace(/https?:\/\/[^\s]+/g, '');

  const fullAddress = faculty.address || (faculty.addressDetails ? `${faculty.addressDetails.localAddress || ''}, ${faculty.addressDetails.district || ''}, ${faculty.addressDetails.state || ''} - ${faculty.addressDetails.pincode || ''}` : '');

  const resumeHref = keyPrefix ? `${keyPrefix}/${cleanSlug}.html` : `${cleanSlug}.html`;
  const videosHref = keyPrefix ? `${keyPrefix}/${cleanSlug}-videos.html` : `${cleanSlug}-videos.html`;
  const galleryHref = keyPrefix ? `${keyPrefix}/${cleanSlug}-gallery.html` : `${cleanSlug}-gallery.html`;

  const privacy = faculty.privacy || { showPhone: true, showAltPhone: true, showEmail: true, showAddress: true };
  const sections: any[] = faculty.sections || [];
  const hasSectionsArray = Array.isArray(faculty.sections) && faculty.sections.length > 0;

  // Extract from sections
  const heroSec = sections.find((s: any) => s.type === 'header_hero');
  const metricsSec = sections.find((s: any) => s.type === 'metrics_strip');
  const advSec = sections.find((s: any) => s.type === 'advantage_box');
  const expSec = sections.find((s: any) => s.type === 'experience_timeline');
  const expCardsSec = sections.find((s: any) => s.type === 'areas_of_expertise');
  const qualSec = sections.find((s: any) => s.type === 'qualifications_table');
  const certSec = sections.find((s: any) => s.type === 'certifications_box');
  const rigsSec = sections.find((s: any) => s.type === 'experiments_section');
  const personalSec = sections.find((s: any) => s.type === 'personal_details');

  const resumeData = faculty.resumeData || {};

  // If user has customized sections array, ONLY use what is currently in sections (deleted sections stay deleted!)
  const bio = heroSec ? (heroSec.data?.bio || '') : (hasSectionsArray ? '' : (resumeData.objective || ''));
  const experienceBadge = heroSec ? (heroSec.data?.experienceBadge || '') : (hasSectionsArray ? '' : (faculty.experience || ''));

  // 1. Metrics Strip Items (Only if metrics section exists and has items)
  const metricsList = metricsSec ? (metricsSec.data?.metrics || []) : (hasSectionsArray ? [] : ((resumeData as any)?.metrics || []));

  // 2. Experience Items (Only if experience section exists)
  const experienceItems = expSec ? (expSec.data?.items || []) : (hasSectionsArray ? [] : (resumeData.experienceList || []));

  // 3. Qualifications Items (Only if qualifications section exists)
  const qualItems = qualSec ? (qualSec.data?.items || []) : (hasSectionsArray ? [] : (resumeData.qualifications || []));

  // 4. Certifications Items (Only if certifications section exists)
  const certItems = certSec ? (certSec.data?.items || []) : (hasSectionsArray ? [] : (resumeData.certifications || []));

  // 5. Areas of Expertise Cards (Only if expertise section exists)
  const expertiseCards = expCardsSec ? (expCardsSec.data?.cards || []) : (hasSectionsArray ? [] : ((resumeData as any)?.areasOfExpertise || []));

  // 6. Signature Experiments / Lab Rigs (Only if rigs section exists)
  const demoRigs = rigsSec ? (rigsSec.data?.items || []) : (hasSectionsArray ? [] : ((resumeData as any)?.demoRigs || []));

  // 7. Personal Details (Only if personal section exists)
  const pData = personalSec ? (personalSec.data || {}) : (hasSectionsArray ? {} : ((resumeData as any)?.personalDetails || {}));

  const videoCount = (faculty.videos && Array.isArray(faculty.videos)) ? faculty.videos.length : 0;
  const photoCount = (faculty.galleryImages && Array.isArray(faculty.galleryImages)) ? faculty.galleryImages.length : 0;

  const waMessage = encodeURIComponent(`Hello ${name}, I viewed your verified ${subject} Faculty profile on CSEEL.`);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
  
  <!-- Primary Meta Tags -->
  <title>${name} — Best ${subject} Faculty | Verified Profile</title>
  <meta name="title" content="${name} — Best ${subject} Faculty | Verified Profile" />
  <meta name="description" content="${title} • Verified Faculty Profile on CSEEL." />

  <!-- Open Graph / WhatsApp / Facebook Rich Preview -->
  <meta property="og:type" content="profile" />
  <meta property="og:url" content="https://resumes.cseel.org/best-Teacherfaculty/${cleanSubject}/${cleanSlug}.html" />
  <meta property="og:title" content="${name} — Best ${subject} Faculty | Verified Profile" />
  <meta property="og:description" content="${title} • Verified Faculty Profile." />
  <meta property="og:image" content="${photoUrl}" />
  <meta property="og:image:secure_url" content="${photoUrl}" />
  <meta property="og:site_name" content="CSEEL Resumes &amp; Verified Faculty Network" />

  <!-- Twitter / X Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${name} — Best ${subject} Faculty | Verified Profile" />
  <meta name="twitter:description" content="${title} • Verified Faculty Profile." />
  <meta name="twitter:image" content="${photoUrl}" />

  <!-- Tailwind CSS & Fonts & Icons -->
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />

  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['"Plus Jakarta Sans"', 'sans-serif'],
            heading: ['"Space Grotesk"', 'sans-serif']
          }
        }
      }
    }
  </script>

  <style>
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      -webkit-font-smoothing: antialiased;
      background-color: #f8fafc;
      color: #0f172a;
    }
    @media print {
      body { background-color: #ffffff !important; padding: 0 !important; }
      .no-print { display: none !important; }
      .print-shadow-none { box-shadow: none !important; border: none !important; }
      .page-break { page-break-before: always; }
    }
  </style>
</head>
<body class="min-h-screen pb-20 md:pb-10">

  <!-- ============================================================ -->
  <!-- FLOATING LEFT-EDGE HANDLE (AVATAR + 3 BARS) -->
  <!-- ============================================================ -->
  <aside onclick="toggleDrawer()" class="no-print fixed left-0 top-1/2 -translate-y-1/2 z-40 bg-blue-700 hover:bg-blue-600 text-white pl-1.5 pr-2 py-2.5 rounded-r-xl shadow-xl cursor-pointer flex flex-col items-center gap-1 transition-transform hover:scale-105" title="Quick Navigation Menu">
    <img src="${photoUrl}" alt="${name}" class="w-6 h-6 rounded-full object-cover border-2 border-white" onerror="this.src='/images/dev-sharma.jpg'" />
    <div class="flex flex-col gap-0.5 pt-0.5">
      <span class="w-3.5 h-0.5 bg-white rounded-full"></span>
      <span class="w-3.5 h-0.5 bg-white rounded-full"></span>
      <span class="w-3.5 h-0.5 bg-white rounded-full"></span>
    </div>
  </aside>

  <!-- ============================================================ -->
  <!-- SLIDE-OUT NAVIGATION DRAWER -->
  <!-- ============================================================ -->
  <div id="drawer-backdrop" onclick="toggleDrawer()" class="no-print fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 opacity-0 pointer-events-none transition-opacity duration-300"></div>
  <nav id="nav-drawer" class="no-print fixed top-0 bottom-0 left-0 w-80 max-w-[85vw] bg-white z-50 shadow-2xl -translate-x-full transition-transform duration-300 flex flex-col border-r border-slate-200">
    <div class="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
      <div class="flex items-center gap-3">
        <img src="${photoUrl}" alt="${name}" class="w-11 h-11 rounded-full object-cover border-2 border-teal-400" onerror="this.src='/images/dev-sharma.jpg'" />
        <div>
          <h4 class="font-bold text-sm text-white leading-tight">${name}</h4>
          <p class="text-[11px] text-teal-300 font-medium">${subject} Faculty</p>
        </div>
      </div>
      <button onclick="toggleDrawer()" class="text-slate-400 hover:text-white text-xl p-1">&times;</button>
    </div>

    <div class="flex-1 overflow-y-auto p-3 space-y-1 text-xs">
      <div class="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2 py-1">Dedicated Pages</div>
      <a href="${videosHref}" class="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-red-50 text-red-700 font-bold hover:bg-red-100 transition border border-red-200">
        <i class="fa-solid fa-play text-red-600 w-4 text-center"></i>
        <span>Demo Video Lectures (${videoCount}) ➔</span>
      </a>
      <a href="${galleryHref}" class="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-blue-50 text-blue-700 font-bold hover:bg-blue-100 transition border border-blue-200">
        <i class="fa-solid fa-images text-blue-600 w-4 text-center"></i>
        <span>Photo Showcase Gallery (${photoCount}) ➔</span>
      </a>

      <div class="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2 pt-3 pb-1">Resume Sections</div>
      <a href="#sec-hero" onclick="toggleDrawer()" class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-700 font-semibold transition">
        <i class="fa-solid fa-user text-blue-600 w-4 text-center"></i>
        <span>Hero Header</span>
      </a>
      ${metricsList.length > 0 ? `
      <a href="#sec-metrics" onclick="toggleDrawer()" class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-700 font-semibold transition">
        <i class="fa-solid fa-chart-line text-teal-600 w-4 text-center"></i>
        <span>Impact Track Record</span>
      </a>` : ''}
      <a href="#sec-profile" onclick="toggleDrawer()" class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-700 font-semibold transition">
        <i class="fa-solid fa-id-card text-emerald-600 w-4 text-center"></i>
        <span>Profile Details (Verified)</span>
      </a>
      ${advSec ? `
      <a href="#sec-advantage" onclick="toggleDrawer()" class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-700 font-semibold transition">
        <i class="fa-solid fa-bolt text-amber-500 w-4 text-center"></i>
        <span>Pedagogical Advantage</span>
      </a>` : ''}
      ${experienceItems.length > 0 ? `
      <a href="#sec-experience" onclick="toggleDrawer()" class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-700 font-semibold transition">
        <i class="fa-solid fa-briefcase text-blue-600 w-4 text-center"></i>
        <span>Professional Experience</span>
      </a>` : ''}
      ${expertiseCards.length > 0 ? `
      <a href="#sec-expertise" onclick="toggleDrawer()" class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-700 font-semibold transition">
        <i class="fa-solid fa-microscope text-purple-600 w-4 text-center"></i>
        <span>Key Areas of Expertise</span>
      </a>` : ''}
      ${qualItems.length > 0 ? `
      <a href="#sec-qualifications" onclick="toggleDrawer()" class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-700 font-semibold transition">
        <i class="fa-solid fa-graduation-cap text-indigo-600 w-4 text-center"></i>
        <span>Academic Qualifications</span>
      </a>` : ''}
      ${certItems.length > 0 ? `
      <a href="#sec-certifications" onclick="toggleDrawer()" class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-700 font-semibold transition">
        <i class="fa-solid fa-award text-emerald-600 w-4 text-center"></i>
        <span>National Certifications</span>
      </a>` : ''}
      ${demoRigs.length > 0 ? `
      <a href="#sec-experiments" onclick="toggleDrawer()" class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-700 font-semibold transition">
        <i class="fa-solid fa-flask text-teal-600 w-4 text-center"></i>
        <span>Signature Demonstrations &amp; Rigs</span>
      </a>` : ''}
      ${(pData.dob || pData.dateOfBirth || pData.fatherName || pData.nationality || pData.languages || pData.languagesKnown || pData.declarationText) ? `
      <a href="#sec-personal" onclick="toggleDrawer()" class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-700 font-semibold transition">
        <i class="fa-solid fa-user-check text-slate-600 w-4 text-center"></i>
        <span>Personal Details &amp; Declaration</span>
      </a>` : ''}
    </div>

    <div class="p-3 border-t border-slate-200 bg-slate-50 flex gap-2">
      ${phone ? `
      <a href="tel:${cleanPhone}" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg text-center text-xs flex items-center justify-center gap-1.5">
        <i class="fa-solid fa-phone"></i>
        <span>Call</span>
      </a>` : ''}
      <a href="https://wa.me/${waPhone}?text=${waMessage}" target="_blank" class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-lg text-center text-xs flex items-center justify-center gap-1.5">
        <i class="fa-brands fa-whatsapp"></i>
        <span>WhatsApp</span>
      </a>
    </div>
  </nav>

  <!-- ============================================================ -->
  <!-- MAIN RESUME CONTAINER (DevSharma exact matching white sheet) -->
  <!-- ============================================================ -->
  <main class="max-w-4xl mx-auto my-4 sm:my-8 px-2 sm:px-4">
    <div class="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 print-shadow-none">

      <!-- 1. HERO HEADER SECTION -->
      <section id="sec-hero" class="relative bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#0d9488] text-white p-4 sm:p-6 md:p-8 overflow-hidden">
        <div class="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-4 sm:gap-6">
          <!-- Avatar with Ribbon Badge -->
          <div class="flex-shrink-0 flex flex-col items-center">
            <div class="relative">
              <img
                src="${photoUrl}"
                alt="${name}"
                class="w-[115px] h-[115px] sm:w-[135px] sm:h-[135px] rounded-[18px] sm:rounded-[20px] object-cover border-[3px] sm:border-[3.5px] border-white shadow-xl bg-slate-800"
                onerror="this.src='/images/dev-sharma.jpg'"
              />
              <div class="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-[#16a34a] text-white text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider px-2.5 sm:px-3 py-0.5 rounded-full shadow-md whitespace-nowrap border border-white/40 flex items-center gap-1">
                <span>★ VERIFIED FACULTY</span>
              </div>
            </div>
          </div>

          <!-- Hero Bio & Details -->
          <div class="flex-1 text-center md:text-left space-y-2 w-full">
            <div class="flex flex-wrap items-center justify-center md:justify-start gap-1.5 sm:gap-2">
              <span class="bg-white/15 backdrop-blur-xs text-white text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 sm:py-1 rounded-full border border-white/20">
                ${subject} Faculty
              </span>
              <span class="bg-emerald-500/20 text-emerald-300 text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 sm:py-1 rounded-full border border-emerald-400/30 flex items-center gap-1">
                <i class="fa-solid fa-shield-halved text-[11px]"></i>
                <span>Document Verified</span>
              </span>
            </div>

            <h1 class="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              ${name}
            </h1>

            <p class="text-xs sm:text-sm md:text-base font-semibold text-teal-200">
              ${title}
            </p>

            ${bio ? `
            <p class="text-xs sm:text-[13px] text-slate-200 leading-relaxed max-w-2xl pt-0.5">
              ${bio}
            </p>` : ''}

            <!-- Contact Details -->
            <div class="flex flex-wrap items-center justify-center md:justify-start gap-1.5 sm:gap-2 pt-1.5">
              ${(phone && privacy.showPhone) ? `
              <a
                href="tel:${cleanPhone}"
                class="inline-flex items-center gap-1.5 bg-black/35 backdrop-blur-xs text-white hover:text-emerald-300 text-[10px] sm:text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-white/10 transition"
              >
                <i class="fa-solid fa-phone text-emerald-400"></i>
                <span>${phone}</span>
                <span class="bg-emerald-500/30 text-emerald-300 text-[9px] px-1.5 py-0.2 rounded">Verified</span>
              </a>` : ''}

              ${(email && privacy.showEmail) ? `
              <a
                href="mailto:${email}"
                class="inline-flex items-center gap-1.5 bg-black/35 backdrop-blur-xs text-white hover:text-teal-200 text-[10px] sm:text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-white/10 transition"
              >
                <i class="fa-solid fa-envelope text-blue-300"></i>
                <span>${email}</span>
                <span class="bg-blue-500/30 text-blue-200 text-[9px] px-1.5 py-0.2 rounded">Verified</span>
              </a>` : ''}

              ${(publicLocation || fullAddress) ? `
              <span class="inline-flex items-center gap-1.5 bg-black/35 backdrop-blur-xs text-white text-[10px] sm:text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-white/10">
                <i class="fa-solid fa-location-dot text-teal-300"></i>
                <span>${publicLocation || fullAddress}</span>
              </span>` : ''}
            </div>
          </div>
        </div>
      </section>

      <!-- 2. IMPACT TRACK RECORD METRICS STRIP -->
      ${metricsList.length > 0 ? `
      <section id="sec-metrics" class="bg-[#1e293b] text-white p-3 sm:p-5 border-b border-slate-700">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
          ${metricsList.map((m: any) => `
            <div class="text-center p-2.5 rounded-xl bg-slate-800/70 border border-slate-700/60 shadow-xs">
              <div class="text-base sm:text-lg md:text-xl font-extrabold text-teal-400">${m.value || m.val || ''}</div>
              <div class="text-[10px] sm:text-[11px] text-slate-300 font-semibold mt-0.5">${m.label || m.lbl || ''}</div>
            </div>
          `).join('')}
        </div>
      </section>` : ''}

      <!-- 3. PROFILE DETAILS CARD (VERIFIED FACULTY) -->
      <section id="sec-profile" class="p-4 sm:p-6 md:p-8 space-y-3 bg-slate-50/70 border-b border-slate-100">
        <div class="flex items-center justify-between border-b border-slate-200 pb-2">
          <h3 class="text-xs sm:text-sm font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-2">
            <i class="fa-solid fa-id-card text-emerald-600"></i>
            <span>Profile Details</span>
          </h3>
          <span class="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-300">
            <i class="fa-solid fa-check-circle text-emerald-600"></i>
            <span>Verified Faculty</span>
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200 shadow-2xs text-xs">
          <div class="flex items-start gap-2">
            <span class="font-bold text-slate-500 w-16 sm:w-20 flex-shrink-0">Name:</span>
            <span class="font-bold text-slate-900">${name}</span>
          </div>
          ${(phone && privacy.showPhone) ? `
          <div class="flex items-start gap-2 min-w-0">
            <span class="font-bold text-slate-500 w-16 sm:w-20 flex-shrink-0">Number:</span>
            <a href="tel:${cleanPhone}" class="font-semibold text-blue-700 hover:underline flex flex-wrap items-center gap-1.5 break-all min-w-0">
              <span class="break-all">${phone}</span>
              <span class="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded shrink-0 inline-flex items-center gap-0.5"><i class="fa-solid fa-check text-[8px]"></i> Verified</span>
            </a>
          </div>` : ''}
          ${(email && privacy.showEmail) ? `
          <div class="flex items-start gap-2 min-w-0">
            <span class="font-bold text-slate-500 w-16 sm:w-20 flex-shrink-0">Email:</span>
            <a href="mailto:${email}" class="font-semibold text-blue-700 hover:underline flex flex-wrap items-center gap-1.5 break-all min-w-0">
              <span class="break-all">${email}</span>
              <span class="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded shrink-0 inline-flex items-center gap-0.5"><i class="fa-solid fa-check text-[8px]"></i> Verified</span>
            </a>
          </div>` : ''}
          ${(fullAddress || publicLocation) ? `
          <div class="flex items-start gap-2">
            <span class="font-bold text-slate-500 w-16 sm:w-20 flex-shrink-0">Address:</span>
            <span class="font-medium text-slate-800">${fullAddress || publicLocation}</span>
          </div>` : ''}
          ${(experienceBadge || faculty.experience) ? `
          <div class="md:col-span-2 flex items-start gap-2 pt-2 border-t border-slate-100">
            <span class="font-bold text-slate-500 w-16 sm:w-20 flex-shrink-0">Experience:</span>
            <span class="font-semibold text-slate-800 leading-relaxed">${experienceBadge || faculty.experience}</span>
          </div>` : ''}
        </div>
      </section>

      <!-- 4. DEDICATED SEPARATE PAGES TEASER CARDS (VIDEOS & GALLERY) -->
      <section class="no-print p-4 sm:p-6 bg-gradient-to-r from-blue-50 via-indigo-50 to-teal-50 border-b border-slate-200">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <!-- Video Lectures Teaser Card -->
          <a href="${videosHref}" class="group bg-white rounded-xl p-4 border border-red-200 hover:border-red-500 shadow-2xs hover:shadow-md transition flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-11 h-11 rounded-xl bg-red-100 group-hover:bg-red-600 text-red-600 group-hover:text-white flex items-center justify-center text-lg transition">
                <i class="fa-solid fa-video"></i>
              </div>
              <div>
                <h4 class="font-extrabold text-xs sm:text-sm text-slate-900 group-hover:text-red-600 transition">
                  Demo Video Lectures (${videoCount} Sessions)
                </h4>
                <p class="text-[11px] text-slate-500">Video Demonstrations &amp; Lectures</p>
              </div>
            </div>
            <span class="text-xs font-bold text-red-600 flex items-center gap-1 group-hover:translate-x-0.5 transition">
              <span>Watch</span>
              <i class="fa-solid fa-arrow-right text-[10px]"></i>
            </span>
          </a>

          <!-- Photo Gallery Teaser Card -->
          <a href="${galleryHref}" class="group bg-white rounded-xl p-4 border border-blue-200 hover:border-blue-500 shadow-2xs hover:shadow-md transition flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-11 h-11 rounded-xl bg-blue-100 group-hover:bg-blue-600 text-blue-600 group-hover:text-white flex items-center justify-center text-lg transition">
                <i class="fa-solid fa-images"></i>
              </div>
              <div>
                <h4 class="font-extrabold text-xs sm:text-sm text-slate-900 group-hover:text-blue-600 transition">
                  Photo Showcase Gallery (${photoCount} Photos)
                </h4>
                <p class="text-[11px] text-slate-500">Labs, Workshops &amp; Activities</p>
              </div>
            </div>
            <span class="text-xs font-bold text-blue-600 flex items-center gap-1 group-hover:translate-x-0.5 transition">
              <span>View</span>
              <i class="fa-solid fa-arrow-right text-[10px]"></i>
            </span>
          </a>
        </div>
      </section>

      <!-- 5. PEDAGOGICAL ADVANTAGE -->
      ${advSec ? `
      <section id="sec-advantage" class="p-4 sm:p-6 md:p-8 space-y-4 bg-gradient-to-r from-blue-50 to-teal-50 border-t border-slate-100">
        <div class="text-center max-w-2xl mx-auto space-y-1">
          <span class="bg-blue-600 text-white text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider">
            ${advSec.data?.pillText || 'Pedagogical Advantage'}
          </span>
          <h3 class="text-sm sm:text-base font-extrabold text-slate-900 pt-1">
            ${advSec.data?.headline || 'Why Experiential Learning? (Audio-Visual + Hands-On = 90% Retention)'}
          </h3>
          ${advSec.data?.description ? `
          <p class="text-xs text-slate-600 leading-relaxed">
            ${advSec.data.description}
          </p>` : ''}
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 pt-2">
          <!-- Card 1: Traditional -->
          <div class="rounded-xl p-4 border shadow-2xs space-y-2 bg-rose-50/50 border-rose-300">
            <div class="flex items-center justify-between">
              <span class="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-rose-600 text-white">
                Traditional Rote Method
              </span>
            </div>
            <h4 class="text-xs sm:text-sm font-bold text-slate-900">10% - 20% Retention</h4>
            <ul class="text-xs text-slate-700 space-y-1.5">
              <li class="flex items-start gap-1.5">
                <span class="mt-0.5 text-rose-600 font-bold">✗</span>
                <span class="flex-1">Passive listening and memorizing derivations without physical context.</span>
              </li>
              <li class="flex items-start gap-1.5">
                <span class="mt-0.5 text-rose-600 font-bold">✗</span>
                <span class="flex-1">Abstract and intimidating theoretical lectures.</span>
              </li>
              <li class="flex items-start gap-1.5">
                <span class="mt-0.5 text-rose-600 font-bold">✗</span>
                <span class="flex-1">High exam stress when facing complex numerical problems.</span>
              </li>
            </ul>
          </div>

          <!-- Card 2: Experiential -->
          <div class="rounded-xl p-4 border shadow-2xs space-y-2 bg-emerald-50/50 border-emerald-300">
            <div class="flex items-center justify-between">
              <span class="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                Experiential Active Method
              </span>
            </div>
            <h4 class="text-xs sm:text-sm font-bold text-slate-900">75% - 90% Retention</h4>
            <ul class="text-xs text-slate-700 space-y-1.5">
              <li class="flex items-start gap-1.5">
                <span class="mt-0.5 text-emerald-600 font-bold">✓</span>
                <span class="flex-1">Dual-Coding Theory: Audio + Visual + Hands-on active engagement.</span>
              </li>
              <li class="flex items-start gap-1.5">
                <span class="mt-0.5 text-emerald-600 font-bold">✓</span>
                <span class="flex-1">Live Apparatus Proofs: Concepts verified with real-world demonstration models.</span>
              </li>
              <li class="flex items-start gap-1.5">
                <span class="mt-0.5 text-emerald-600 font-bold">✓</span>
                <span class="flex-1">Effortless Recall: Students recall live experiments naturally during exams.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>` : ''}

      <!-- 6. PROFESSIONAL EXPERIENCE -->
      ${experienceItems.length > 0 ? `
      <section id="sec-experience" class="p-4 sm:p-6 md:p-8 space-y-5 bg-white border-t border-slate-100">
        <div class="flex items-center justify-between border-b border-[#e2e8f0] pb-2">
          <h3 class="text-xs sm:text-sm font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-2">
            <i class="fa-solid fa-briefcase text-[#2563eb]"></i>
            <span>Professional Experience</span>
          </h3>
          ${(experienceBadge || faculty.experience) ? `<span class="text-xs text-[#64748b] font-semibold">${experienceBadge || faculty.experience} Total Experience</span>` : ''}
        </div>

        <div class="relative border-l-2 border-[#93c5fd] ml-3 sm:ml-4 space-y-6 sm:space-y-8">
          ${experienceItems.map((item: any) => `
            <div class="relative pl-5 sm:pl-6 space-y-1.5">
              <div class="absolute -left-[29px] sm:-left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-[#2563eb] border-2 border-white shadow-2xs"></div>
              <div class="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2">
                <h4 class="text-xs sm:text-sm font-bold text-[#0f172a]">
                  ${item.role || ''} ${item.organization || item.institution ? `— <span class="text-blue-700 font-semibold">${item.organization || item.institution}</span>` : ''}
                </h4>
                ${(item.period || item.tenure) ? `
                <span class="bg-[#dbeafe] text-[#1d4ed8] text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                  ${item.period || item.tenure}
                </span>` : ''}
              </div>
              ${Array.isArray(item.points) ? `
              <ul class="text-xs text-[#475569] space-y-1 pt-1.5">
                ${item.points.map((pt: string) => `
                  <li class="flex items-start gap-1.5 leading-relaxed">
                    <span class="text-[#2563eb] font-bold flex-shrink-0">•</span>
                    <span>${pt}</span>
                  </li>
                `).join('')}
              </ul>` : (item.details ? `<p class="text-xs text-[#475569] pt-1.5 leading-relaxed">${item.details}</p>` : '')}
            </div>
          `).join('')}
        </div>
      </section>` : ''}

      <!-- 7. KEY AREAS OF EXPERTISE -->
      ${expertiseCards.length > 0 ? `
      <section id="sec-expertise" class="p-4 sm:p-6 md:p-8 space-y-4 bg-slate-50/70 border-t border-slate-100">
        <div class="flex items-center justify-between border-b border-[#e2e8f0] pb-2">
          <h3 class="text-xs sm:text-sm font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-2">
            <i class="fa-solid fa-microscope text-purple-600"></i>
            <span>Key Areas of Expertise</span>
          </h3>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          ${expertiseCards.map((card: any, idx: number) => {
            const colors = [
              { bg: 'bg-blue-50', text: 'text-blue-600' },
              { bg: 'bg-indigo-50', text: 'text-indigo-600' },
              { bg: 'bg-teal-50', text: 'text-teal-600' },
              { bg: 'bg-amber-50', text: 'text-amber-600' },
            ];
            const cTheme = colors[idx % colors.length];
            return `
            <div class="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs flex items-start gap-3">
              <div class="w-9 h-9 rounded-lg ${cTheme.bg} ${cTheme.text} flex items-center justify-center text-lg flex-shrink-0">
                ${card.icon || '🔬'}
              </div>
              <div>
                <h4 class="text-xs font-bold text-slate-900">${card.title || ''}</h4>
                <p class="text-[11px] text-slate-600 mt-0.5 leading-relaxed">${card.desc || card.description || ''}</p>
              </div>
            </div>`;
          }).join('')}
        </div>
      </section>` : ''}

      <!-- 8. ACADEMIC QUALIFICATIONS -->
      ${qualItems.length > 0 ? `
      <section id="sec-qualifications" class="p-4 sm:p-6 md:p-8 space-y-3 bg-white border-t border-slate-100">
        <div class="flex items-center justify-between border-b border-[#e2e8f0] pb-2">
          <h3 class="text-xs sm:text-sm font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-2">
            <i class="fa-solid fa-graduation-cap text-[#2563eb]"></i>
            <span>Academic Qualifications</span>
          </h3>
        </div>

        <div class="overflow-x-auto rounded-xl border border-[#cbd5e1] shadow-2xs bg-white">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-[#1e3a8a] text-white font-bold text-[11px] uppercase tracking-wider">
                <th class="p-2.5 sm:p-3 border border-blue-900/40">Course / Degree</th>
                <th class="p-2.5 sm:p-3 border border-blue-900/40 text-center">Score / Grade</th>
                <th class="p-2.5 sm:p-3 border border-blue-900/40">Board / University</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 text-slate-700">
              ${qualItems.map((q: any) => `
                <tr class="hover:bg-blue-50/40 transition">
                  <td class="p-2.5 font-bold text-slate-900 border-r border-slate-200">${q.degree || q.course || ''}</td>
                  <td class="p-2.5 text-center font-bold text-emerald-700 border-r border-slate-200">${q.percentage || q.score || q.division || ''}</td>
                  <td class="p-2.5 text-slate-800">${q.board || q.institute || ''}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </section>` : ''}

      <!-- 9. NATIONAL CERTIFICATIONS -->
      ${certItems.length > 0 ? `
      <section id="sec-certifications" class="p-4 sm:p-6 md:p-8 space-y-3 bg-slate-50 border-t border-slate-100">
        <div class="flex items-center justify-between border-b border-[#e2e8f0] pb-2">
          <h3 class="text-xs sm:text-sm font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-2">
            <i class="fa-solid fa-award text-[#16a34a]"></i>
            <span>National Certifications</span>
          </h3>
          <span class="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-300">
            ${certItems.length}x Certified
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          ${certItems.map((c: any) => `
            <div class="bg-white rounded-xl p-3.5 border-l-4 border-emerald-600 border-y border-r border-slate-200 shadow-2xs space-y-1">
              <div class="flex items-center justify-between">
                <h4 class="text-xs font-bold text-[#0f172a]">${c.name || ''}</h4>
                <span class="bg-emerald-600 text-white font-extrabold text-[9px] px-2 py-0.5 rounded-full uppercase">
                  ${c.status || c.score || 'QUALIFIED'}
                </span>
              </div>
              <p class="text-[11px] text-slate-600">${c.org || c.regNo || ''}</p>
            </div>
          `).join('')}
        </div>
      </section>` : ''}

      <!-- 10. SIGNATURE DEMONSTRATIONS & LAB RIGS -->
      ${demoRigs.length > 0 ? `
      <section id="sec-experiments" class="p-4 sm:p-6 md:p-8 space-y-3 sm:space-y-4 bg-slate-50 border-t border-slate-100">
        <div class="flex items-center justify-between border-b border-[#e2e8f0] pb-2">
          <h3 class="text-xs sm:text-sm font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-2">
            <i class="fa-solid fa-flask text-[#2563eb]"></i>
            <span>Signature Demonstrations &amp; Lab Rigs Built</span>
          </h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          ${demoRigs.map((rig: any) => `
            <div class="bg-white border border-slate-200 rounded-xl p-3.5 sm:p-4 space-y-1.5 shadow-2xs">
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-bold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">${rig.badge || 'Laboratory Rig'}</span>
              </div>
              <h4 class="text-xs font-bold text-slate-800">${rig.title || ''}</h4>
              ${rig.apparatus ? `<p class="text-[11px] text-slate-600"><strong>Apparatus:</strong> ${rig.apparatus}</p>` : ''}
              ${rig.concept ? `<p class="text-[11px] text-slate-600"><strong>Concept:</strong> ${rig.concept}</p>` : ''}
            </div>
          `).join('')}
        </div>
      </section>` : ''}

      <!-- 11. PERSONAL DETAILS & DECLARATION -->
      ${(pData.dob || pData.dateOfBirth || pData.fatherName || pData.nationality || pData.languages || pData.languagesKnown || pData.declarationText) ? `
      <section id="sec-personal" class="p-4 sm:p-6 md:p-8 space-y-4 bg-white border-t border-slate-100">
        <div>
          <h3 class="text-xs sm:text-sm font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-2 border-b border-[#e2e8f0] pb-2 mb-3">
            <i class="fa-solid fa-user text-[#2563eb]"></i>
            <span>Personal Details</span>
          </h3>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 rounded-xl p-4 border border-slate-200">
            ${(pData.dob || pData.dateOfBirth) ? `
            <div class="flex items-center gap-2 text-xs">
              <span class="font-bold text-slate-600 w-32">Date of Birth:</span>
              <span class="text-slate-900 font-semibold">${pData.dob || pData.dateOfBirth}</span>
            </div>` : ''}
            ${pData.fatherName ? `
            <div class="flex items-center gap-2 text-xs">
              <span class="font-bold text-slate-600 w-32">Father's Name:</span>
              <span class="text-slate-900 font-semibold">${pData.fatherName}</span>
            </div>` : ''}
            ${pData.nationality ? `
            <div class="flex items-center gap-2 text-xs">
              <span class="font-bold text-slate-600 w-32">Nationality:</span>
              <span class="text-slate-900 font-semibold">${pData.nationality}</span>
            </div>` : ''}
            ${(pData.languages || pData.languagesKnown) ? `
            <div class="flex items-center gap-2 text-xs">
              <span class="font-bold text-slate-600 w-32">Languages Known:</span>
              <span class="text-slate-900 font-semibold">${pData.languages || pData.languagesKnown}</span>
            </div>` : ''}
          </div>
        </div>

        ${pData.declarationText ? `
        <div class="pt-2 border-t border-slate-100 space-y-1.5">
          <h4 class="text-xs font-bold text-[#0f172a] uppercase tracking-wider mb-1">Declaration</h4>
          <p class="text-xs text-slate-600 italic">
            "${pData.declarationText}"
          </p>
        </div>` : ''}
      </section>` : ''}

      <!-- 12. CALL TO ACTION / CONTACT BANNER -->
      <section class="p-6 sm:p-8 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white text-center space-y-4 border-t border-slate-800">
        <h3 class="text-base sm:text-xl font-extrabold tracking-tight">
          Looking for a Visionary ${subject} Faculty?
        </h3>
        <p class="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
          Available for Senior Secondary teaching, STEM &amp; Composite Lab installations, and faculty development workshops across premier institutions pan-India.
        </p>
        <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
          ${phone ? `
          <a
            href="tel:${cleanPhone}"
            class="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition shadow-lg inline-flex items-center gap-2"
          >
            <i class="fa-solid fa-phone"></i>
            <span>Call ${phone}</span>
          </a>` : ''}
          <a
            href="https://wa.me/${waPhone}?text=${waMessage}"
            target="_blank"
            class="bg-[#25d366] hover:bg-emerald-500 text-slate-950 font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition shadow-lg inline-flex items-center gap-2"
          >
            <i class="fa-brands fa-whatsapp text-base"></i>
            <span>Chat on WhatsApp</span>
          </a>
          ${email ? `
          <a
            href="mailto:${email}"
            class="bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition border border-white/20 inline-flex items-center gap-2"
          >
            <i class="fa-solid fa-envelope"></i>
            <span>Send Email</span>
          </a>` : ''}
        </div>
      </section>

    </div>
  </main>

  <!-- ============================================================ -->
  <!-- MOBILE 5-ITEM BOTTOM STICKY DOCK -->
  <!-- ============================================================ -->
  <footer class="no-print md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl flex items-center justify-around py-2 px-1">
    ${phone ? `
    <a href="tel:${cleanPhone}" class="flex flex-col items-center gap-0.5 text-slate-700 hover:text-blue-600 font-bold text-[10px]">
      <i class="fa-solid fa-phone text-sm text-emerald-600"></i>
      <span>Call</span>
    </a>` : ''}
    <a href="https://wa.me/${waPhone}?text=${waMessage}" target="_blank" class="flex flex-col items-center gap-0.5 text-slate-700 hover:text-emerald-600 font-bold text-[10px]">
      <i class="fa-brands fa-whatsapp text-sm text-emerald-600"></i>
      <span>WhatsApp</span>
    </a>
    <a href="${videosHref}" class="flex flex-col items-center gap-0.5 text-slate-700 hover:text-red-600 font-bold text-[10px]">
      <i class="fa-solid fa-play text-sm text-red-600"></i>
      <span>Videos (${videoCount})</span>
    </a>
    <a href="${galleryHref}" class="flex flex-col items-center gap-0.5 text-slate-700 hover:text-blue-600 font-bold text-[10px]">
      <i class="fa-solid fa-images text-sm text-blue-600"></i>
      <span>Gallery (${photoCount})</span>
    </a>
    <button onclick="toggleDrawer()" class="flex flex-col items-center gap-0.5 text-slate-700 hover:text-blue-600 font-bold text-[10px]">
      <i class="fa-solid fa-bars text-sm text-slate-800"></i>
      <span>Menu</span>
    </button>
  </footer>

  <!-- ============================================================ -->
  <!-- GLOBAL DRAWER JAVASCRIPT -->
  <!-- ============================================================ -->
  <script>
    function toggleDrawer() {
      const drawer = document.getElementById('nav-drawer');
      const backdrop = document.getElementById('drawer-backdrop');
      if (!drawer || !backdrop) return;
      const isOpen = drawer.classList.contains('translate-x-0');
      if (isOpen) {
        drawer.classList.remove('translate-x-0');
        drawer.classList.add('-translate-x-full');
        backdrop.classList.remove('opacity-100', 'pointer-events-auto');
        backdrop.classList.add('opacity-0', 'pointer-events-none');
      } else {
        drawer.classList.remove('-translate-x-full');
        drawer.classList.add('translate-x-0');
        backdrop.classList.remove('opacity-0', 'pointer-events-none');
        backdrop.classList.add('opacity-100', 'pointer-events-auto');
      }
    }
  </script>
</body>
</html>`;
}
