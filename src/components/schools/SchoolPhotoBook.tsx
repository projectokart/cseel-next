'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Sparkles,
  GraduationCap,
  RotateCcw,
  ChevronRight,
  CheckCircle2,
  BookOpen,
  Award,
  ShieldCheck,
  Edit3,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Upload,
  X,
  Check,
  Image as ImageIcon,
  ChevronLeft,
  Volume2,
  VolumeX,
  Video
} from 'lucide-react';

import { useOptionalSchoolTemplate, FlipbookSlideItem } from './template/SchoolTemplateContext';
import { compressImageUnder50KB } from './template/EditableImage';

interface SchoolPhotoBookProps {
  displayName: string;
  board?: string;
  primaryImage?: string;
  logoUrl?: string;
  slides?: FlipbookSlideItem[];
  onApplyClick?: () => void;
  onTabSwitch?: (tabId: string) => void;
}

const STANDARD_TAB_IDS = [
  'about',
  'facilities',
  'academics',
  'extracurricular',
  'admissions',
  'faculty',
  'gallery',
  'awards',
  'contact',
];

const TAB_OPTIONS = [
  { label: 'About School', value: 'about' },
  { label: 'Facilities & Labs', value: 'facilities' },
  { label: 'Academics & Pedagogy', value: 'academics' },
  { label: 'Sports & Extracurricular', value: 'extracurricular' },
  { label: 'Admissions & Fees', value: 'admissions' },
  { label: 'Faculty & Mentors', value: 'faculty' },
  { label: 'Campus Gallery', value: 'gallery' },
  { label: 'Awards & Honors', value: 'awards' },
  { label: 'Contact Us', value: 'contact' },
  { label: '🔗 Other / Custom Link...', value: 'custom' },
];

const DEFAULT_SLIDES: FlipbookSlideItem[] = [
  {
    id: 'fb-0',
    image: '/images/schools/edunova-hero-students.jpg',
    title: 'Main Academic Campus & Life',
    desc: 'Inspiring architecture with lush green surroundings and modern classrooms.',
    buttonText: 'Explore Campus',
    actionTab: 'about'
  },
  {
    id: 'fb-1',
    image: '/images/schools/hero-school-1.png',
    title: 'Advanced Science Practical Labs',
    desc: 'Hands-on chemistry, physics and biology labs with individual workstations.',
    buttonText: 'View Labs',
    actionTab: 'facilities'
  },
  {
    id: 'fb-2',
    image: '/images/schools/hero-school-2.jpg',
    title: 'Interactive Smart Classrooms',
    desc: 'Digital multimedia boards, audio-visual learning & dedicated teacher guidance.',
    buttonText: 'Academics & Pedagogy',
    actionTab: 'academics'
  },
  {
    id: 'fb-3',
    image: '/images/schools/hero-school-3.jpg',
    title: 'Sports Complex & Athletic Grounds',
    desc: 'Dedicated football pitch, basketball court, athletics track and trained sports coaches.',
    buttonText: 'Sports Academies',
    actionTab: 'extracurricular'
  },
  {
    id: 'fb-4',
    image: '/images/schools/hero-school-4.png',
    title: 'Central Library & Reading Halls',
    desc: 'Over 10,000 curriculum and reference books, quiet study pods & digital archives.',
    buttonText: 'Admissions & Inquiries',
    actionTab: 'admissions'
  }
];

/**
 * Extract 11-character YouTube video ID from various URL formats
 * (e.g. youtu.be/xxx, youtube.com/watch?v=xxx, youtube.com/shorts/xxx, embed/xxx)
 */
function extractYouTubeId(url?: string | null): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|live\/))([a-zA-Z0-9_-]{11})/);
  if (match && match[1]) return match[1];
  const secondary = url.match(/^([a-zA-Z0-9_-]{11})$/);
  if (secondary && secondary[1]) return secondary[1];
  return null;
}

/**
 * Standard HQ thumbnail for any YouTube video ID
 */
function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

/**
 * 100% Natural Physical Paper Flip Sound (Zero "cut-cut" clicks / No mechanical impacts)
 * Smooth continuous acoustic paper friction rustle that sweeps gently like turning a real book page.
 */
function playNaturalPageFlipSound() {
  try {
    if (typeof window === 'undefined') return;
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const rate = ctx.sampleRate;
    const now = ctx.currentTime;
    const duration = 0.38;
    const len = Math.ceil(rate * duration);
    const buffer = ctx.createBuffer(1, len, rate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < len; i++) {
      const t = i / rate;
      const progress = t / duration;
      // Smooth bell envelope (no sharp onset pop/click, gentle swell, soft decay)
      const envelope = Math.sin(Math.PI * progress) * Math.exp(-progress * 1.5);
      // Soft continuous paper fiber friction noise
      const noise = (Math.random() * 2 - 1) + (Math.random() * 0.4 - 0.2);
      data[i] = noise * envelope * 0.16;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    // Smooth acoustic resonance bandpass filter sweeping from 1250Hz down to 450Hz
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1250, now);
    filter.frequency.exponentialRampToValueAtTime(450, now + duration);
    filter.Q.value = 1.35;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.005, now + duration);

    source.connect(filter).connect(gain).connect(ctx.destination);
    source.start(now);
  } catch (_) {}
}

/**
/**
 * User's Exact 3D Metallic Spiral Spine & Rings
 * Pure CSS with cylindrical linear gradient, inner/outer depth shadows and 3D loop slit.
 */
function MetallicSpiralSpine({
  count = 15,
  isCenter = true,
  className = ''
}: {
  count?: number;
  isCenter?: boolean;
  className?: string;
}) {
  const prefix = isCenter ? 'c' : 'm';
  return (
    <div
      className={`spiral-spine flex flex-col justify-between pointer-events-none select-none ${
        isCenter ? 'w-[45px] h-full py-3.5' : 'w-[24px] h-full py-4'
      } ${className}`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          id={`metallic-ring-${prefix}-${i}`}
          className={`ring ${!isCenter ? 'ring-mobile' : ''} transition-[clip-path]`}
        />
      ))}
    </div>
  );
}

export default function SchoolPhotoBook({
  displayName,
  board,
  primaryImage,
  logoUrl,
  slides,
  onApplyClick,
  onTabSwitch
}: SchoolPhotoBookProps) {
  const displayBoardLabel = board
    ? (board.length > 25 ? (board.split('(')[0]?.trim() || board) : board)
    : 'CBSE';

  const templateCtx = useOptionalSchoolTemplate();
  const isEditMode = templateCtx?.isEditMode ?? false;

  const effectiveLogo = logoUrl || templateCtx?.data?.logoImage || templateCtx?.data?.imageOverrides?.['school_logo'] || primaryImage || '';

  const fallbackSchoolSlides: FlipbookSlideItem[] = [
    {
      id: 'fb-0',
      image: primaryImage || '/images/schools/edunova-hero-students.jpg',
      title: `${displayName.slice(0, 24)} Campus Quad`,
      desc: 'Inspiring architecture with lush green surroundings and modern classrooms.',
      buttonText: 'Explore Campus',
      actionTab: 'about'
    },
    {
      id: 'fb-1',
      image: primaryImage || '/images/schools/edunova-hero-students.jpg',
      title: 'Advanced Science Practical Labs',
      desc: 'Hands-on chemistry, physics and biology labs with individual workstations.',
      buttonText: 'View Labs',
      actionTab: 'facilities'
    },
    {
      id: 'fb-2',
      image: primaryImage || '/images/schools/edunova-hero-students.jpg',
      title: 'Interactive Smart Classrooms',
      desc: 'Digital multimedia boards, audio-visual learning & dedicated teacher guidance.',
      buttonText: 'Academics & Pedagogy',
      actionTab: 'academics'
    }
  ];

  const slidesToUse: FlipbookSlideItem[] = (slides && slides.length > 0)
    ? slides
    : ((templateCtx?.data?.flipbookSlides && templateCtx.data.flipbookSlides.length > 0)
      ? templateCtx.data.flipbookSlides
      : fallbackSchoolSlides);

  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const activeUploadSlideIdxRef = useRef<number | null>(null);

  const handleAddNewPage = useCallback(() => {
    if (slidesToUse.length >= 10) {
      alert('Photo Book me maximum 10 pages add kar sakte hain.');
      return;
    }
    const newIndex = slidesToUse.length;
    const newSlide: FlipbookSlideItem = {
      id: `fb-${Date.now()}`,
      mediaType: 'image',
      image: '',
      title: `Campus Feature #${newIndex + 1}`,
      desc: 'Write a short description about this campus lab, classroom, or activity.',
      buttonText: 'Explore More',
      actionTab: 'facilities',
    };
    const updated = [...slidesToUse, newSlide];
    templateCtx?.updateFlipbookSlides(updated);
    setTimeout(() => {
      if (pageFlipRef.current) {
        try {
          pageFlipRef.current.turnToPage(newIndex + 1);
        } catch (_) {}
      }
    }, 120);
  }, [slidesToUse, templateCtx]);

  const handleDeletePage = useCallback((index: number) => {
    if (slidesToUse.length <= 1) {
      alert('Photo Book me kam se kam 1 page hona zaroori hai.');
      return;
    }
    if (confirm(`Slide #${index + 1} ko delete karein?`)) {
      const updated = slidesToUse.filter((_, i) => i !== index);
      templateCtx?.updateFlipbookSlides(updated);
    }
  }, [slidesToUse, templateCtx]);

  const handleUpdateSlide = useCallback((index: number, partial: Partial<FlipbookSlideItem>) => {
    const updated = [...slidesToUse];
    if (!updated[index]) return;
    updated[index] = { ...updated[index], ...partial };
    templateCtx?.updateFlipbookSlides(updated);
  }, [slidesToUse, templateCtx]);

  const handleAddNewPageRef = useRef(handleAddNewPage);
  handleAddNewPageRef.current = handleAddNewPage;

  const handleUpdateSlideRef = useRef(handleUpdateSlide);
  handleUpdateSlideRef.current = handleUpdateSlide;

  const handleDeletePageRef = useRef(handleDeletePage);
  handleDeletePageRef.current = handleDeletePage;


  const [currentPage, setCurrentPage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const bookMountRef = useRef<HTMLDivElement>(null);
  const templateRef = useRef<HTMLDivElement>(null);
  const pageFlipRef = useRef<any>(null);
  const currentPageRef = useRef<number>(0);
  const onTabSwitchRef = useRef(onTabSwitch);
  const onApplyClickRef = useRef(onApplyClick);

  useEffect(() => {
    onTabSwitchRef.current = onTabSwitch;
    onApplyClickRef.current = onApplyClick;
  }, [onTabSwitch, onApplyClick]);

  const slidesKey = JSON.stringify(slidesToUse);
  const hasAddPageSlide = isEditMode && slidesToUse.length < 10;
  const totalPages = 1 + slidesToUse.length + (hasAddPageSlide ? 1 : 0) + 1; // Cover + Slides + Add Page + Thank You

  // Initialize PageFlip with pure cloned template DOM nodes (prevents React DOM mutation bugs)
  useEffect(() => {
    let isMounted = true;
    let animId = 0;

    async function loadBook() {
      if (typeof window === 'undefined' || !containerRef.current || !bookMountRef.current || !templateRef.current) return;

      try {
        const { PageFlip } = await import('page-flip');
        if (!isMounted || !containerRef.current || !bookMountRef.current || !templateRef.current) return;

        const w = containerRef.current.clientWidth || 560;
        const h = containerRef.current.clientHeight || 400;
        const mobile = window.innerWidth < 640;
        setIsMobile(mobile);

        // Clear previous mount children safely
        if (pageFlipRef.current) {
          try { pageFlipRef.current.destroy(); } catch (_) {}
          pageFlipRef.current = null;
        }
        bookMountRef.current.innerHTML = '';

        // Create independent host node that PageFlip owns completely
        const host = document.createElement('div');
        host.style.width = '100%';
        host.style.height = '100%';

        const handleHostClick = (e: Event) => {
          const target = (e.target as HTMLElement | null);
          if (!target) return;

          // Sound Toggle Button (Mute / Unmute video audio for HTML5 video & YouTube iframe)
          const soundTarget = target.closest('[data-sound-toggle="true"]') as HTMLElement | null;
          if (soundTarget) {
            e.preventDefault();
            e.stopPropagation();
            const pageContainer = soundTarget.closest('.pf-template-page') || soundTarget.parentElement;
            if (pageContainer) {
              const fgVideo = pageContainer.querySelector('video[data-book-video="true"]') as HTMLVideoElement | null;
              const fgIframe = pageContainer.querySelector('iframe[data-book-iframe="true"]') as HTMLIFrameElement | null;

              let isMuted = true;

              if (fgVideo) {
                fgVideo.muted = !fgVideo.muted;
                isMuted = fgVideo.muted;
              } else if (fgIframe && fgIframe.contentWindow) {
                const curMuted = soundTarget.getAttribute('data-is-muted') !== 'false';
                isMuted = !curMuted;
                soundTarget.setAttribute('data-is-muted', String(isMuted));
                if (isMuted) {
                  fgIframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'mute', args: [] }), '*');
                } else {
                  fgIframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'unMute', args: [] }), '*');
                  fgIframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'setVolume', args: [100] }), '*');
                }
              }

              const mutedIcons = soundTarget.querySelectorAll('.sound-icon-muted');
              const unmutedIcons = soundTarget.querySelectorAll('.sound-icon-unmuted');
              mutedIcons.forEach((el) => {
                if (isMuted) {
                  el.classList.remove('hidden');
                  el.classList.add('flex');
                } else {
                  el.classList.add('hidden');
                  el.classList.remove('flex');
                }
              });
              unmutedIcons.forEach((el) => {
                if (isMuted) {
                  el.classList.add('hidden');
                  el.classList.remove('flex');
                } else {
                  el.classList.remove('hidden');
                  el.classList.add('flex');
                }
              });
            }
            return;
          }

          // Reset to first page
          const resetTarget = target.closest('[data-reset-action]');
          if (resetTarget) {
            e.preventDefault();
            e.stopPropagation();
            handleResetToFirst();
            return;
          }

          // Apply button
          const applyTarget = target.closest('[data-apply-action]');
          if (applyTarget) {
            e.preventDefault();
            e.stopPropagation();
            onApplyClickRef.current?.();
            return;
          }

          // Add Page action (inside the book)
          const addPageTarget = target.closest('[data-add-page-action]');
          if (addPageTarget) {
            e.preventDefault();
            e.stopPropagation();
            handleAddNewPageRef.current();
            return;
          }

          // Edit Button clicked -> toggle 2-line mini popover right above button
          const editBtnTarget = target.closest('[data-edit-button]');
          if (editBtnTarget) {
            e.preventDefault();
            e.stopPropagation();
            const relIdx = editBtnTarget.getAttribute('data-edit-button');
            const popover = host.querySelector(`#btn-popover-${relIdx}`) as HTMLElement | null;
            if (popover) {
              const isHidden = popover.classList.contains('hidden');
              // Close all other open popovers
              host.querySelectorAll('[id^="btn-popover-"]').forEach((p) => p.classList.add('hidden'));
              if (isHidden) {
                popover.classList.remove('hidden');
                const slide = slidesToUse[parseInt(relIdx || '0', 10)];
                const tabSelect = popover.querySelector('.btn-tab-select') as HTMLSelectElement | null;
                const customBox = popover.querySelector('.btn-custom-url-box') as HTMLElement | null;
                const customInput = popover.querySelector('.btn-custom-url-input') as HTMLInputElement | null;
                if (slide && tabSelect && customBox && customInput) {
                  const currentLink = slide.actionTab || 'about';
                  if (STANDARD_TAB_IDS.includes(currentLink)) {
                    tabSelect.value = currentLink;
                    customBox.classList.add('hidden');
                  } else {
                    tabSelect.value = 'custom';
                    customBox.classList.remove('hidden');
                    customInput.value = currentLink;
                  }
                }
                const firstInput = popover.querySelector('input') as HTMLInputElement | null;
                if (firstInput) setTimeout(() => firstInput.focus(), 50);
              }
            }
            return;
          }

          // Save Button in 2-line mini popover
          const btnSaveTarget = target.closest('[data-btn-save]');
          if (btnSaveTarget) {
            e.preventDefault();
            e.stopPropagation();
            const relIdx = parseInt(btnSaveTarget.getAttribute('data-btn-save') || '0', 10);
            const popover = host.querySelector(`#btn-popover-${relIdx}`) as HTMLElement | null;
            if (popover) {
              const labelInput = popover.querySelector('.btn-label-input') as HTMLInputElement | null;
              const tabSelect = popover.querySelector('.btn-tab-select') as HTMLSelectElement | null;
              const customInput = popover.querySelector('.btn-custom-url-input') as HTMLInputElement | null;
              const newLabel = labelInput ? labelInput.value.trim() : '';
              let finalLink = tabSelect ? tabSelect.value : 'about';
              if (finalLink === 'custom') {
                finalLink = customInput ? customInput.value.trim() : '';
                if (!finalLink) finalLink = 'about';
              }
              handleUpdateSlideRef.current(relIdx, { buttonText: newLabel, actionTab: finalLink });
              popover.classList.add('hidden');
            }
            return;
          }

          // Close Button in 2-line mini popover
          const btnCloseTarget = target.closest('[data-btn-close]');
          if (btnCloseTarget) {
            e.preventDefault();
            e.stopPropagation();
            const relIdx = btnCloseTarget.getAttribute('data-btn-close');
            const popover = host.querySelector(`#btn-popover-${relIdx}`) as HTMLElement | null;
            if (popover) popover.classList.add('hidden');
            return;
          }

          // Upload photo trigger directly on book page (auto-clears any previous video)
          const uploadImgTarget = target.closest('[data-choose-image-upload]');
          if (uploadImgTarget) {
            e.preventDefault();
            e.stopPropagation();
            const slideIdx = parseInt(uploadImgTarget.getAttribute('data-choose-image-upload') || '0', 10);
            activeUploadSlideIdxRef.current = slideIdx;
            fileInputRef.current?.click();
            return;
          }

          // Exclusive Media Mode Tab Switcher: Photo vs Video
          const switchTabTarget = target.closest('[data-switch-media-tab]');
          if (switchTabTarget) {
            e.preventDefault();
            e.stopPropagation();
            const tabType = switchTabTarget.getAttribute('data-switch-media-tab'); // 'photo' or 'video'
            const container = switchTabTarget.closest('.media-mode-container');
            if (container) {
              const photoBtn = container.querySelector('[data-switch-media-tab="photo"]') as HTMLElement | null;
              const videoBtn = container.querySelector('[data-switch-media-tab="video"]') as HTMLElement | null;
              const photoPanel = container.querySelector('[data-media-panel="photo"]') as HTMLElement | null;
              const videoPanel = container.querySelector('[data-media-panel="video"]') as HTMLElement | null;

              if (tabType === 'photo') {
                photoBtn?.classList.remove('text-slate-300', 'bg-transparent');
                photoBtn?.classList.add('bg-blue-600', 'text-white', 'shadow-sm');
                videoBtn?.classList.remove('bg-amber-500', 'text-slate-950', 'shadow-sm');
                videoBtn?.classList.add('text-slate-300', 'bg-transparent');
                photoPanel?.classList.remove('hidden');
                videoPanel?.classList.add('hidden');
                const pIn = photoPanel?.querySelector('input');
                if (pIn) setTimeout(() => pIn.focus(), 50);
              } else {
                videoBtn?.classList.remove('text-slate-300', 'bg-transparent');
                videoBtn?.classList.add('bg-amber-500', 'text-slate-950', 'shadow-sm');
                photoBtn?.classList.remove('bg-blue-600', 'text-white', 'shadow-sm');
                photoBtn?.classList.add('text-slate-300', 'bg-transparent');
                videoPanel?.classList.remove('hidden');
                photoPanel?.classList.add('hidden');
                const vIn = videoPanel?.querySelector('input');
                if (vIn) setTimeout(() => vIn.focus(), 50);
              }
            }
            return;
          }

          // Save Media URL directly on page: MAX 1 ITEM GUARANTEE
          const saveMediaUrlTarget = target.closest('[data-save-media-url]');
          if (saveMediaUrlTarget) {
            e.preventDefault();
            e.stopPropagation();
            const slideIdx = parseInt(saveMediaUrlTarget.getAttribute('data-save-media-url') || '0', 10);
            const mediaKind = saveMediaUrlTarget.getAttribute('data-media-kind');
            const panel = saveMediaUrlTarget.closest('[data-media-panel]') || saveMediaUrlTarget.parentElement;
            const input = (panel?.querySelector('input') || host.querySelector(`#url-input-${mediaKind}-${slideIdx}`)) as HTMLInputElement | null;
            if (input && input.value.trim()) {
              if (mediaKind === 'video') {
                const videoUrl = input.value.trim();
                const ytId = extractYouTubeId(videoUrl);
                const autoThumb = ytId ? getYouTubeThumbnail(ytId) : '';
                // Guaranteed max 1 item: auto-attach YouTube thumbnail for preview/backdrop
                handleUpdateSlideRef.current(slideIdx, {
                  mediaType: 'video',
                  videoUrl,
                  image: autoThumb || ''
                });
              } else {
                // Guaranteed max 1 item: wipe video
                handleUpdateSlideRef.current(slideIdx, {
                  mediaType: 'image',
                  image: input.value.trim(),
                  videoUrl: ''
                });
              }
            }
            return;
          }

          // Replace Media picker toggle on page
          const replaceMediaTarget = target.closest('[data-replace-media]');
          if (replaceMediaTarget) {
            e.preventDefault();
            e.stopPropagation();
            const slideIdx = parseInt(replaceMediaTarget.getAttribute('data-replace-media') || '0', 10);
            const picker = host.querySelector(`#media-picker-${slideIdx}`) as HTMLElement | null;
            if (picker) {
              picker.classList.toggle('hidden');
            }
            return;
          }

          // Delete Slide directly from page toolbar
          const deletePageTarget = target.closest('[data-delete-page]');
          if (deletePageTarget) {
            e.preventDefault();
            e.stopPropagation();
            const slideIdx = parseInt(deletePageTarget.getAttribute('data-delete-page') || '0', 10);
            handleDeletePageRef.current(slideIdx);
            return;
          }

          // Action Tab / Custom Link (Public/Preview mode)
          const tabTarget = target.closest('[data-action-tab]');
          if (tabTarget) {
            e.preventDefault();
            e.stopPropagation();
            const tab = tabTarget.getAttribute('data-action-tab');
            if (tab) {
              if (tab.startsWith('http://') || tab.startsWith('https://')) {
                window.open(tab, '_blank', 'noopener,noreferrer');
              } else if (tab.startsWith('/') || tab.startsWith('mailto:') || tab.startsWith('tel:')) {
                window.location.href = tab;
              } else if (onTabSwitchRef.current) {
                onTabSwitchRef.current(tab);
              }
            }
            return;
          }
        };

        // Listen for dropdown changes (e.g., selecting 'custom' in destination link)
        const handleHostChange = (e: Event) => {
          const target = e.target as HTMLElement | null;
          if (!target) return;
          const selectTarget = target.closest('.btn-tab-select') as HTMLSelectElement | null;
          if (selectTarget) {
            const popover = selectTarget.closest('[id^="btn-popover-"]');
            if (popover) {
              const customBox = popover.querySelector('.btn-custom-url-box') as HTMLElement | null;
              if (customBox) {
                if (selectTarget.value === 'custom') {
                  customBox.classList.remove('hidden');
                  const inEl = customBox.querySelector('input');
                  if (inEl) inEl.focus();
                } else {
                  customBox.classList.add('hidden');
                }
              }
            }
          }
        };

        // Inline Text Commit on Blur (Heading & Description)
        const handleHostBlur = (e: FocusEvent) => {
          const target = e.target as HTMLElement | null;
          if (!target) return;

          const headingIdx = target.getAttribute('data-edit-heading');
          if (headingIdx !== null) {
            const idx = parseInt(headingIdx, 10);
            const newTitle = target.innerText.trim();
            if (newTitle && newTitle !== slidesToUse[idx]?.title) {
              handleUpdateSlideRef.current(idx, { title: newTitle });
            }
            return;
          }

          const captionIdx = target.getAttribute('data-edit-caption');
          if (captionIdx !== null) {
            const idx = parseInt(captionIdx, 10);
            const newDesc = target.innerText.trim();
            if (newDesc !== slidesToUse[idx]?.desc) {
              handleUpdateSlideRef.current(idx, { desc: newDesc });
            }
            return;
          }
        };

        const handleHostKeyDown = (e: KeyboardEvent) => {
          const target = e.target as HTMLElement | null;
          if (!target) return;
          if (e.key === 'Enter' && target.hasAttribute('data-edit-heading')) {
            e.preventDefault();
            target.blur();
          }
        };

        // Stop propagation of all mouse/touch/pointer gestures on interactive elements
        // This 100% isolates all clicks, typing, and dropdown selects from triggering PageFlip!
        const handleHostCapture = (e: Event) => {
          const target = e.target as HTMLElement | null;
          if (!target) return;
          if (
            target.closest(
              'button, input, textarea, select, [contenteditable="true"], [data-interactive="true"], [data-sound-toggle], [data-action-tab], [data-reset-action], [data-apply-action], [data-add-page-action], [data-edit-button], [data-btn-save], [data-btn-close], [data-choose-image-upload], [data-switch-media-tab], [data-save-media-url], [data-replace-media], [data-delete-page], .btn-tab-select, .btn-custom-url-input'
            )
          ) {
            e.stopPropagation();
          }
        };

        host.addEventListener('click', handleHostClick);
        host.addEventListener('change', handleHostChange);
        host.addEventListener('touchend', handleHostClick);
        host.addEventListener('focusout', handleHostBlur);
        host.addEventListener('keydown', handleHostKeyDown);
        host.addEventListener('pointerdown', handleHostCapture, { capture: true });
        host.addEventListener('mousedown', handleHostCapture, { capture: true });
        host.addEventListener('touchstart', handleHostCapture, { capture: true });
        host.addEventListener('pointerup', handleHostCapture, { capture: true });
        host.addEventListener('mouseup', handleHostCapture, { capture: true });
        host.addEventListener('mousemove', handleHostCapture, { capture: true });

        bookMountRef.current.appendChild(host);

        // Helper to sync video autoplay on visible book pages (both HTML5 <video> and YouTube <iframe>)
        const syncHostVideos = (pageIndex: number, isLandscape: boolean) => {
          const visiblePages = isLandscape
            ? [pageIndex, pageIndex + 1]
            : [pageIndex];

          const allPages = host.querySelectorAll('.pf-template-page');
          allPages.forEach((pageEl, idx) => {
            const isVisible = visiblePages.includes(idx);

            // HTML5 videos
            const videos = pageEl.querySelectorAll('video');
            videos.forEach((vid) => {
              if (isVisible) {
                const playPromise = vid.play();
                if (playPromise !== undefined) {
                  playPromise.catch(() => {});
                }
              } else {
                vid.pause();
              }
            });

            // YouTube iframes
            const iframes = pageEl.querySelectorAll('iframe[data-book-iframe="true"]');
            iframes.forEach((ifr) => {
              const cw = (ifr as HTMLIFrameElement).contentWindow;
              if (cw) {
                if (isVisible) {
                  const sendPlay = () => {
                    try {
                      cw.postMessage(JSON.stringify({ event: 'command', func: 'playVideo', args: [] }), '*');
                    } catch (_) {}
                  };
                  sendPlay();
                  setTimeout(sendPlay, 350);
                  setTimeout(sendPlay, 900);
                } else {
                  try {
                    cw.postMessage(JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }), '*');
                  } catch (_) {}
                }
              }
            });
          });
        };

        // Clone templates from hidden React DOM
        const templateNodes = templateRef.current.querySelectorAll('.pf-template-page');
        const clonedPages: HTMLElement[] = [];
        templateNodes.forEach((node) => {
          const clone = node.cloneNode(true) as HTMLElement;
          clone.classList.add('pf-page', 'cursor-pointer');
          clone.style.display = 'block';
          clonedPages.push(clone);
        });

        const targetPageW = mobile ? w : Math.round(w / 2);
        const targetPageH = h;

        const pf = new PageFlip(host, {
          width: targetPageW,
          height: targetPageH,
          size: 'stretch',
          autoSize: false,
          minWidth: mobile ? Math.max(100, Math.round(w * 0.6)) : 200,
          maxWidth: 2000,
          minHeight: 180,
          maxHeight: 2000,
          maxShadowOpacity: 0.7,
          showCover: false,
          flippingTime: isEditMode ? 450 : 950,
          usePortrait: mobile,
          startPage: currentPageRef.current || 0,
          drawShadow: true,
          showPageCorners: false,
          useMouseEvents: !isEditMode,
          mobileScrollSupport: false,
          disableFlipByClick: true,
        });

        // Bulletproof protection: Override PageFlip UI target checker so clicks/taps on buttons, links, inputs, and text NEVER flip!
        // In edit mode: absolutely NO drag/mouse flipping on canvas (flips ONLY happen via arrow buttons).
        // In public mode: clicks on buttons/links execute cleanly without page turning; dragging empty background turns page.
        try {
          const ui = (pf as any).getUI ? (pf as any).getUI() : (pf as any).ui;
          if (ui) {
            ui.checkTarget = function (target: HTMLElement) {
              if (!target) return false;
              if (isEditMode) return false;
              if (
                target.closest(
                  'button, a, input, textarea, select, [contenteditable], [data-interactive], [data-sound-toggle], [data-action-tab], [data-reset-action], [data-apply-action], [data-add-page-action], [data-edit-button], [data-btn-save], [data-btn-close], [data-choose-image-upload], [data-switch-media-tab], [data-save-media-url], [data-replace-media], [data-delete-page], iframe, [data-book-iframe="true"]'
                ) || target.isContentEditable
              ) {
                return false;
              }
              return true;
            };
          }
        } catch (_) {}

        pf.loadFromHTML(clonedPages);

        pf.on('flip', (e: { data: number }) => {
          if (!isMounted) return;
          currentPageRef.current = e.data;
          setCurrentPage(e.data);
          playNaturalPageFlipSound();
          syncHostVideos(e.data, !mobile);
        });

        // Trigger autoplay for initial visible video if any
        setTimeout(() => {
          if (isMounted) {
            syncHostVideos(currentPageRef.current || 0, !mobile);
          }
        }, 150);

        pageFlipRef.current = pf;
        setIsReady(true);
        if (typeof window !== 'undefined') (window as any).__PAGEFLIP_STATUS__ = 'SUCCESS';

        // Real Physics: dynamic angle-based spiral coil occlusion synchronized with 3D page turn

        function updateSpiralOcclusion() {
          if (!isMounted) return;
          const pfInstance = pageFlipRef.current;
          if (pfInstance) {
            const flipCtrl = pfInstance.getFlipController();
            const state = pfInstance.getState();
            const isFlipping = state === 'flipping' || state === 'user_fold';

            if (isFlipping && flipCtrl) {
              const calc = (flipCtrl as any).calc;
              let progress = 0;

              if (calc && typeof calc.getFlippingProgress === 'function') {
                progress = Math.max(0, Math.min(1, calc.getFlippingProgress() / 100));
              } else {
                const el = containerRef.current?.querySelector('.stf__item[style*="clip-path"]') as HTMLElement;
                if (el && el.style.transform) {
                  const match = el.style.transform.match(/translate3d\(([-\d.]+)px/);
                  if (match) {
                    const tx = parseFloat(match[1]);
                    const totalW = containerRef.current?.clientWidth || 560;
                    progress = Math.max(0, Math.min(1, 1 - tx / totalW));
                  }
                }
              }

              // Base angle: 0° (flat on right) -> 90° (vertical center) -> 180° (flat on left)
              const baseAngle = progress * 180;

              // Desktop center metallic rings (count: 15)
              for (let i = 0; i < 15; i++) {
                const ring = document.getElementById(`metallic-ring-c-${i}`);
                if (!ring) continue;

                // 3D diagonal curl physics: bottom corner curls first, so bottom rings lead
                const verticalLag = 0.72 + 0.45 * (i / 14);
                const ringAngle = Math.max(0, Math.min(180, baseAngle * verticalLag));

                if (ringAngle <= 1 || ringAngle >= 179) {
                  ring.style.clipPath = 'none';
                } else if (ringAngle <= 90) {
                  // Lifting page on right occludes right portion of the ring
                  const rad = (ringAngle * Math.PI) / 180;
                  const cutRightPct = (1 - (0.5 + 0.45 * Math.cos(rad))) * 100;
                  ring.style.clipPath = `inset(0 ${cutRightPct.toFixed(1)}% 0 0)`;
                } else {
                  // Descending page on left occludes left portion of the ring
                  const rad = (ringAngle * Math.PI) / 180;
                  const cutLeftPct = (0.5 + 0.45 * Math.cos(rad)) * 100;
                  ring.style.clipPath = `inset(0 0 0 ${cutLeftPct.toFixed(1)}%)`;
                }
              }

              // Mobile left edge metallic rings (count: 13)
              for (let i = 0; i < 13; i++) {
                const ring = document.getElementById(`metallic-ring-m-${i}`);
                if (!ring) continue;
                const ringAngle = Math.max(0, Math.min(180, baseAngle * (0.8 + 0.4 * (i / 12))));
                if (ringAngle <= 35 || ringAngle >= 165) {
                  ring.style.clipPath = 'none';
                } else {
                  const cutRightPct = Math.min(80, 85 * Math.sin((ringAngle * Math.PI) / 180));
                  ring.style.clipPath = `inset(0 ${cutRightPct.toFixed(1)}% 0 0)`;
                }
              }
            } else {
              // Idle state: all spiral rings 100% visible
              for (let i = 0; i < 15; i++) {
                const ring = document.getElementById(`metallic-ring-c-${i}`);
                if (ring && ring.style.clipPath && ring.style.clipPath !== 'none') {
                  ring.style.clipPath = 'none';
                }
              }
              for (let i = 0; i < 13; i++) {
                const ring = document.getElementById(`metallic-ring-m-${i}`);
                if (ring && ring.style.clipPath && ring.style.clipPath !== 'none') {
                  ring.style.clipPath = 'none';
                }
              }
            }
          }
          animId = requestAnimationFrame(updateSpiralOcclusion);
        }

        animId = requestAnimationFrame(updateSpiralOcclusion);
      } catch (err: any) {
        console.warn('PageFlip init:', err);
        if (typeof window !== 'undefined') (window as any).__PAGEFLIP_STATUS__ = 'ERROR: ' + (err?.message || String(err));
      }
    }

    const timer = setTimeout(loadBook, 50);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (animId) cancelAnimationFrame(animId);
      if (pageFlipRef.current) {
        try { pageFlipRef.current.destroy(); } catch (_) {}
        pageFlipRef.current = null;
      }
    };
  }, [displayName, displayBoardLabel, slidesKey, isEditMode]);

  const handleFlipPrev = useCallback(() => {
    if (pageFlipRef.current) {
      try {
        pageFlipRef.current.flipPrev();
        return;
      } catch (_) {}
    }
    setCurrentPage((prev) => Math.max(0, prev - 1));
    playNaturalPageFlipSound();
  }, []);

  const handleFlipNext = useCallback(() => {
    if (pageFlipRef.current) {
      try {
        pageFlipRef.current.flipNext();
        return;
      } catch (_) {}
    }
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
    playNaturalPageFlipSound();
  }, [totalPages]);

  const handleDotClick = useCallback((index: number) => {
    if (pageFlipRef.current) {
      try {
        if (Math.abs(index - currentPage) <= 2) {
          pageFlipRef.current.flip(index);
        } else {
          pageFlipRef.current.turnToPage(index);
        }
        return;
      } catch (_) {}
    }
    setCurrentPage(index);
    playNaturalPageFlipSound();
  }, [currentPage]);

  const handleResetToFirst = useCallback(() => {
    if (pageFlipRef.current) {
      try {
        pageFlipRef.current.flip(0);
        return;
      } catch (_) {}
    }
    setCurrentPage(0);
    playNaturalPageFlipSound();
  }, []);

  // Synchronize video playback when currentPage changes
  useEffect(() => {
    if (!isReady || !bookMountRef.current) return;
    const host = bookMountRef.current.firstElementChild || bookMountRef.current;
    const visiblePages = !isMobile
      ? [currentPage, currentPage + 1]
      : [currentPage];

    const allPages = host.querySelectorAll('.pf-template-page');
    allPages.forEach((pageEl, idx) => {
      const isVisible = visiblePages.includes(idx);
      const videos = pageEl.querySelectorAll('video');
      videos.forEach((vid) => {
        if (isVisible) {
          const p = vid.play();
          if (p !== undefined) p.catch(() => {});
        } else {
          vid.pause();
        }
      });
    });
  }, [currentPage, isReady, isMobile]);


  return (
    <div
      ref={containerRef}
      className="relative w-full h-full select-none"
    >
      {/* Hidden file input for auto-compressed image upload directly from page */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          const slideIdx = activeUploadSlideIdxRef.current;
          if (!file || slideIdx === null) return;
          setIsCompressing(true);
          try {
            const res = await compressImageUnder50KB(file);
            handleUpdateSlide(slideIdx, { mediaType: 'image', image: res.dataUrl, videoUrl: '' });
          } catch (_) {
            alert('Image compression failed. Please try another image.');
          } finally {
            setIsCompressing(false);
            if (e.target) e.target.value = '';
          }
        }}
      />


      {/* ========================================================================= */}
      {/* 1. SPIRAL BINDING RINGS:
             - Desktop: In center spine between left and right pages
             - Mobile: On the left edge
      */}
      {/* ========================================================================= */}
      {/* 3D METALLIC SPIRAL BINDING RINGS: Only on Mobile view (left edge) */}
      <div className="sm:hidden">
        {currentPage > 0 && (
          <div
            className="absolute inset-y-1.5 -left-3 z-30 w-3.5 rounded-l-full bg-gradient-to-r from-slate-300 via-white to-slate-400 shadow-[-3px_0_6px_rgba(0,0,0,0.35)] border-l border-slate-300 pointer-events-none"
          />
        )}
        <div className="absolute inset-y-1.5 -left-2.5 z-40 pointer-events-none">
          <MetallicSpiralSpine count={12} isCenter={false} className="h-full" />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN BOOK CONTAINER:
             - 100% full bleed, zero black gaps
             - Left corners slightly rounded (rounded-l-lg), right corners round (rounded-r-3xl)
             - Thin left border
      */}
      {/* ========================================================================= */}
      <div className="relative w-full h-full rounded-l-lg rounded-r-3xl border-l border-slate-300/80 shadow-2xl overflow-hidden bg-transparent">
        
        {/* Dynamic Host Mount for StPageFlip Engine */}
        <div
          ref={bookMountRef}
          className="w-full h-full"
        />

        {/* SSR / Initial Preview before PageFlip interactive mount (zero layout shift) */}
        {!isReady && (
          <div className="absolute inset-0 w-full h-full flex rounded-l-lg rounded-r-3xl overflow-hidden pointer-events-none">
            {/* Left Page (Desktop only: Elegant Cover Page) */}
            <div 
              className="hidden sm:flex w-1/2 h-full relative overflow-hidden text-[#002B49] p-3.5 sm:p-5 pb-10 flex-col justify-between border-r border-[#002B49]/20 shadow-2xl"
              style={{
                background: 'radial-gradient(ellipse 90% 80% at 50% 36%, #FFFFFF 0%, #FAF8F5 55%, #F0ECE1 100%)',
              }}
            >
              {/* Authentic Luxury Laid Paper / Vellum Texture */}
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.035]"
                style={{
                  backgroundImage: `
                    repeating-linear-gradient(0deg, rgba(0,43,73,0.8) 0px, rgba(0,43,73,0.8) 1px, transparent 1px, transparent 4px),
                    repeating-linear-gradient(90deg, rgba(0,43,73,0.8) 0px, rgba(0,43,73,0.8) 1px, transparent 1px, transparent 4px)
                  `,
                  backgroundSize: '4px 4px'
                }}
              />
              <div className="absolute -top-14 -left-14 w-52 h-52 rounded-full bg-[#002B49]/[0.03] blur-3xl pointer-events-none" />
              <div className="absolute -bottom-14 -right-14 w-52 h-52 rounded-full bg-[#002B49]/[0.04] blur-3xl pointer-events-none" />
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle 170px at 50% 36%, rgba(0, 43, 73, 0.035) 0%, transparent 75%)',
                }}
              />

              {/* Deep Navy Borders */}
              <div className="absolute inset-2 border-2 border-[#002B49]/35 rounded-xl pointer-events-none shadow-[inset_0_0_12px_rgba(0,43,73,0.04),0_0_8px_rgba(0,43,73,0.04)]" />
              <div className="absolute inset-3 border border-[#002B49]/20 rounded-lg pointer-events-none" />

              {/* Corner Filigree Accents */}
              <div className="absolute top-2.5 left-2.5 text-[#002B49]/60 text-[11px] font-serif select-none pointer-events-none">✦</div>
              <div className="absolute top-2.5 right-2.5 text-[#002B49]/60 text-[11px] font-serif select-none pointer-events-none">✦</div>
              <div className="absolute bottom-2.5 left-2.5 text-[#002B49]/60 text-[11px] font-serif select-none pointer-events-none">✦</div>
              <div className="absolute bottom-2.5 right-2.5 text-[#002B49]/60 text-[11px] font-serif select-none pointer-events-none">✦</div>

              {/* Realistic 3D Spine Crease Valley & Curvature on Left Page */}
              <div 
                className="hidden sm:block absolute inset-y-0 right-0 w-16 pointer-events-none z-20"
                style={{
                  background: 'linear-gradient(to left, rgba(0,0,0,0.50) 0%, rgba(0,0,0,0.32) 12%, rgba(0,0,0,0.18) 28%, rgba(0,0,0,0.08) 50%, rgba(0,0,0,0.02) 75%, transparent 100%)'
                }}
              />
              <div className="hidden sm:block absolute inset-y-0 right-0 w-[1.5px] bg-black/60 pointer-events-none z-20" />
              <div 
                className="hidden sm:block absolute inset-y-0 right-10 sm:right-12 w-8 pointer-events-none z-20 opacity-30"
                style={{
                  background: 'linear-gradient(to left, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)',
                  mixBlendMode: 'overlay'
                }}
              />
              <div className="relative z-10 flex items-center justify-center pt-1.5 text-center shrink-0">
                <span className="text-[8.5px] font-bold text-[#002B49] tracking-[0.25em] uppercase">
                  ✦ ACADEMIC SESSION 2026 – 2027 ✦
                </span>
              </div>
              <div className="relative z-10 text-center my-auto space-y-2 px-2">
                <div className="max-w-[150px] max-h-[55px] sm:max-w-[180px] sm:max-h-[65px] min-h-[44px] mx-auto flex items-center justify-center bg-transparent">
                  {effectiveLogo ? (
                    <img
                      src={effectiveLogo}
                      alt={displayName}
                      className="max-w-full max-h-[55px] sm:max-h-[65px] w-auto h-auto object-contain drop-shadow-xs"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-xl bg-[#002B49] text-white font-serif font-black text-base flex items-center justify-center">
                      {displayName ? displayName.charAt(0).toUpperCase() : 'S'}
                    </div>
                  )}
                </div>
                <h2 className="text-base sm:text-lg font-black font-serif text-[#002B49] tracking-tight leading-snug drop-shadow-2xs">{displayName}</h2>
                <p className="text-[9.5px] text-[#002B49]/80 line-clamp-3 max-w-xs mx-auto leading-relaxed">Nurturing curiosity, values & leadership through experiential practical learning.</p>
                <div className="flex items-center justify-center gap-1.5 text-[8px] text-[#002B49]">
                  <span className="bg-[#002B49]/[0.08] px-2 py-0.5 rounded-full border border-[#002B49]/20 font-medium">{displayBoardLabel} Aligned</span>
                  <span className="bg-[#002B49]/[0.08] px-2 py-0.5 rounded-full border border-[#002B49]/20 font-medium">NEP 2020 Aligned</span>
                </div>
              </div>
              <div className="h-2 shrink-0 pointer-events-none" />
            </div>

            {/* Right Page (Desktop: Page 1 photo, Mobile: Cover Page) */}
            <div className="w-full sm:w-1/2 h-full relative overflow-hidden bg-slate-900">
              {/* Desktop image/video: Page 1 media */}
              <div className="hidden sm:block w-full h-full relative">
                {(slidesToUse[0] || DEFAULT_SLIDES[0]).mediaType === 'video' && (slidesToUse[0] || DEFAULT_SLIDES[0]).videoUrl ? (() => {
                  const s0 = slidesToUse[0] || DEFAULT_SLIDES[0];
                  const ytId = extractYouTubeId(s0.videoUrl);
                  const thumb = s0.image || (ytId ? getYouTubeThumbnail(ytId) : '');
                  return (
                    <div className="w-full h-full relative flex items-center justify-center overflow-hidden bg-black">
                      {thumb && (
                        <img
                          src={thumb}
                          alt=""
                          aria-hidden="true"
                          className="absolute inset-0 w-full h-full object-cover filter blur-2xl scale-125 opacity-60 pointer-events-none brightness-75 select-none"
                        />
                      )}
                      {ytId ? (
                        <div className="relative z-10 w-full aspect-video max-h-full flex items-center justify-center overflow-hidden rounded-xl shadow-2xl pointer-events-none select-none">
                          <div className="relative w-full h-full overflow-hidden">
                            <iframe
                              src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&playsinline=1&controls=0&rel=0&showinfo=0&iv_load_policy=3&cc_load_policy=0&cc_lang_pref=none&modestbranding=1&disablekb=1&fs=0&enablejsapi=1`}
                              title={s0.title || 'Video'}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              className="absolute border-0 pointer-events-none select-none"
                              style={{
                                width: '124%',
                                height: '148%',
                                top: '-24%',
                                left: '-12%',
                                pointerEvents: 'none',
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <video
                          src={s0.videoUrl}
                          poster={thumb}
                          muted
                          autoPlay
                          loop
                          playsInline
                          className="relative z-10 max-w-full max-h-full w-auto h-auto object-contain pointer-events-none shadow-2xl"
                        />
                      )}
                    </div>
                  );
                })() : (
                  <img src={(slidesToUse[0] || DEFAULT_SLIDES[0]).image} alt={(slidesToUse[0] || DEFAULT_SLIDES[0]).title} className="w-full h-full object-cover" />
                )}
                {/* Realistic 3D Spine Crease Valley & Curvature on Right Page */}
                <div 
                  className="hidden sm:block absolute inset-y-0 left-0 w-16 pointer-events-none z-20"
                  style={{
                    background: 'linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.52) 12%, rgba(0,0,0,0.28) 28%, rgba(0,0,0,0.12) 50%, rgba(0,0,0,0.03) 75%, transparent 100%)'
                  }}
                />
                <div className="hidden sm:block absolute inset-y-0 left-0 w-[1.5px] bg-black/85 pointer-events-none z-20" />
                <div 
                  className="hidden sm:block absolute inset-y-0 left-10 sm:left-12 w-8 pointer-events-none z-20 opacity-35"
                  style={{
                    background: 'linear-gradient(to right, transparent 0%, rgba(255,255,255,0.22) 50%, transparent 100%)',
                    mixBlendMode: 'overlay'
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-3 sm:p-4 pb-7 text-white z-20">
                  <h4 className="text-xs sm:text-sm font-black text-white">{(slidesToUse[0] || DEFAULT_SLIDES[0]).title}</h4>
                  <p className="text-[10px] sm:text-[11px] text-slate-200 mt-0.5 line-clamp-1">{(slidesToUse[0] || DEFAULT_SLIDES[0]).desc}</p>
                </div>
              </div>

              {/* Mobile: Cover Page preview */}
              <div 
                className="sm:hidden w-full h-full relative text-[#002B49] p-3.5 pb-10 flex flex-col justify-between overflow-hidden shadow-2xl"
                style={{
                  background: 'radial-gradient(ellipse 90% 80% at 50% 36%, #FFFFFF 0%, #FAF8F5 55%, #F0ECE1 100%)',
                }}
              >
                {/* Paper Texture */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-[0.035]"
                  style={{
                    backgroundImage: `
                      repeating-linear-gradient(0deg, rgba(0,43,73,0.8) 0px, rgba(0,43,73,0.8) 1px, transparent 1px, transparent 4px),
                      repeating-linear-gradient(90deg, rgba(0,43,73,0.8) 0px, rgba(0,43,73,0.8) 1px, transparent 1px, transparent 4px)
                    `,
                    backgroundSize: '4px 4px'
                  }}
                />
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle 140px at 50% 36%, rgba(0, 43, 73, 0.035) 0%, transparent 75%)',
                  }}
                />
                <div className="absolute inset-2 border-2 border-[#002B49]/35 rounded-xl pointer-events-none shadow-[inset_0_0_12px_rgba(0,43,73,0.04)]" />
                <div className="relative z-10 flex items-center justify-center pt-1.5 text-center shrink-0">
                  <span className="text-[8px] font-bold text-[#002B49] tracking-[0.25em] uppercase">
                    ✦ ACADEMIC SESSION 2026 – 2027 ✦
                  </span>
                </div>
                <div className="relative z-10 text-center my-auto space-y-2 px-2">
                  <div className="max-w-[140px] max-h-[50px] min-h-[40px] mx-auto flex items-center justify-center bg-transparent">
                    {effectiveLogo ? (
                      <img
                        src={effectiveLogo}
                        alt={displayName}
                        className="max-w-full max-h-[50px] w-auto h-auto object-contain drop-shadow-xs"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-[#002B49] text-white font-serif font-black text-sm flex items-center justify-center">
                        {displayName ? displayName.charAt(0).toUpperCase() : 'S'}
                      </div>
                    )}
                  </div>
                  <h2 className="text-base font-black font-serif text-[#002B49] tracking-tight leading-snug drop-shadow-2xs">{displayName}</h2>
                  <p className="text-[9.5px] text-[#002B49]/80 line-clamp-3 max-w-xs mx-auto leading-relaxed">Nurturing curiosity, values & leadership through experiential practical learning.</p>
                  <div className="flex items-center justify-center gap-1 text-[8px] text-[#002B49]">
                    <span className="bg-[#002B49]/[0.08] px-2 py-0.5 rounded-full border border-[#002B49]/20 font-medium">{displayBoardLabel} Aligned</span>
                    <span className="bg-[#002B49]/[0.08] px-2 py-0.5 rounded-full border border-[#002B49]/20 font-medium">NEP 2020 Aligned</span>
                  </div>
                </div>
                <div className="h-2 shrink-0 pointer-events-none" />
              </div>
            </div>
          </div>
        )}

        {/* Navigation Arrow: Previous Page (ONLY in Edit Mode) */}
        {isEditMode && currentPage > 0 && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleFlipPrev();
            }}
            className="absolute left-1.5 sm:left-2 top-1/2 -translate-y-1/2 z-50 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#002B49]/85 hover:bg-[#002B49] text-white backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95 cursor-pointer pointer-events-auto"
            title="Previous Page"
            aria-label="Previous Page"
          >
            <ChevronLeft className="w-4 h-4 text-white stroke-[2.5]" />
          </button>
        )}

        {/* Navigation Arrow: Next Page (ONLY in Edit Mode) */}
        {isEditMode && currentPage < totalPages - 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleFlipNext();
            }}
            className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 z-50 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#002B49]/85 hover:bg-[#002B49] text-white backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95 cursor-pointer pointer-events-auto"
            title="Next Page"
            aria-label="Next Page"
          >
            <ChevronRight className="w-4 h-4 text-white stroke-[2.5]" />
          </button>
        )}

        {/* Floating Bottom Dots (ONLY DOTS, NO BACKGROUND) */}
        <div
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 select-none pointer-events-auto"
        >
          {Array.from({ length: totalPages }).map((_, idx) => {
            const isActive = isMobile
              ? currentPage === idx
              : (currentPage === 0 && idx === 0) || (currentPage > 0 && currentPage === idx);
            const isThankYou = idx === totalPages - 1;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleDotClick(idx)}
                aria-label={`Jump to page ${idx + 1}`}
                className={`transition-all rounded-full cursor-pointer drop-shadow-md ${
                  isActive
                    ? isThankYou
                      ? 'w-6 h-2 bg-[#002B49] shadow-[0_0_8px_rgba(0,43,73,0.5)] scale-105'
                      : 'w-6 h-2 bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)] scale-105'
                    : isThankYou
                    ? 'w-2 h-2 bg-[#002B49]/40 hover:bg-[#002B49]/70 hover:scale-125'
                    : 'w-2 h-2 bg-white/80 ring-1 ring-black/25 hover:bg-white hover:scale-125'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. HIDDEN TEMPLATE PAGES (React renders these; PageFlip clones them cleanly) */}
      {/* ========================================================================= */}
      <div ref={templateRef} style={{ display: 'none' }}>
        {/* PAGE 0: ELEGANT DECORATED INSTITUTIONAL COVER PAGE */}
        <div
          className="pf-template-page pf-cover-page relative w-full h-full overflow-hidden select-none cursor-pointer text-[#002B49] p-3.5 sm:p-5 pb-10 sm:pb-10 flex flex-col justify-between shadow-2xl bg-[#FAF8F5]"
          data-density="hard"
          style={{
            backgroundColor: '#FAF8F5',
            background: 'radial-gradient(ellipse 90% 80% at 50% 36%, #FFFFFF 0%, #FAF8F5 55%, #F0ECE1 100%)',
          }}
        >
          {/* Authentic Luxury Laid Paper / Vellum Texture */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.035]"
            style={{
              backgroundImage: `
                repeating-linear-gradient(0deg, rgba(0,43,73,0.8) 0px, rgba(0,43,73,0.8) 1px, transparent 1px, transparent 4px),
                repeating-linear-gradient(90deg, rgba(0,43,73,0.8) 0px, rgba(0,43,73,0.8) 1px, transparent 1px, transparent 4px)
              `,
              backgroundSize: '4px 4px'
            }}
          />
          <div className="absolute -top-14 -left-14 w-52 h-52 rounded-full bg-[#002B49]/[0.03] blur-3xl pointer-events-none" />
          <div className="absolute -bottom-14 -right-14 w-52 h-52 rounded-full bg-[#002B49]/[0.04] blur-3xl pointer-events-none" />
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle 170px at 50% 36%, rgba(0, 43, 73, 0.035) 0%, transparent 75%)',
            }}
          />

          {/* Double Navy Decorative Border with Corner Ornaments */}
          <div className="absolute inset-2 sm:inset-3 border-2 border-[#002B49]/35 rounded-xl sm:rounded-2xl pointer-events-none shadow-[inset_0_0_12px_rgba(0,43,73,0.04),0_0_10px_rgba(0,43,73,0.04)]" />
          <div className="absolute inset-3 sm:inset-4.5 border border-[#002B49]/20 rounded-lg sm:rounded-xl pointer-events-none" />
          
          {/* Corner Filigree Accents */}
          <div className="absolute top-3 left-3 text-[#002B49]/60 text-[11px] sm:text-xs font-serif select-none pointer-events-none">✦</div>
          <div className="absolute top-3 right-3 text-[#002B49]/60 text-[11px] sm:text-xs font-serif select-none pointer-events-none">✦</div>
          <div className="absolute bottom-3 left-3 text-[#002B49]/60 text-[11px] sm:text-xs font-serif select-none pointer-events-none">✦</div>
          <div className="absolute bottom-3 right-3 text-[#002B49]/60 text-[11px] sm:text-xs font-serif select-none pointer-events-none">✦</div>

          {/* Realistic 3D Spine Crease Valley & Curvature on Left Page */}
          <div 
            className="hidden sm:block absolute inset-y-0 right-0 w-16 pointer-events-none z-20"
            style={{
              background: 'linear-gradient(to left, rgba(0,0,0,0.50) 0%, rgba(0,0,0,0.32) 12%, rgba(0,0,0,0.18) 28%, rgba(0,0,0,0.08) 50%, rgba(0,0,0,0.02) 75%, transparent 100%)'
            }}
          />
          <div className="hidden sm:block absolute inset-y-0 right-0 w-[1.5px] bg-black/60 pointer-events-none z-20" />
          <div 
            className="hidden sm:block absolute inset-y-0 right-10 sm:right-12 w-8 pointer-events-none z-20 opacity-30"
            style={{
              background: 'linear-gradient(to left, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)',
              mixBlendMode: 'overlay'
            }}
          />

          {/* Top Banner: Elegant Session Tag */}
          <div className="relative z-10 flex items-center justify-center pt-1.5 sm:pt-2 text-center shrink-0">
            <span className="inline-flex items-center gap-1.5 text-[8.5px] sm:text-[9.5px] font-bold text-[#002B49] tracking-[0.25em] uppercase">
              <Sparkles className="w-2.5 h-2.5 text-[#002B49] fill-[#002B49]" />
              <span>ACADEMIC SESSION 2026 – 2027</span>
              <Sparkles className="w-2.5 h-2.5 text-[#002B49] fill-[#002B49]" />
            </span>
          </div>

          {/* Center Showcase: Decorated Emblem + School Name + Description Paragraph */}
          <div className="relative z-10 text-center px-2 py-1 space-y-2 sm:space-y-2.5 my-auto">
            {/* School Emblem / Actual Logo */}
            <div className="max-w-[160px] max-h-[60px] sm:max-w-[200px] sm:max-h-[75px] min-h-[48px] mx-auto flex items-center justify-center bg-transparent relative shrink-0">
              {effectiveLogo ? (
                <img
                  src={effectiveLogo}
                  alt={displayName}
                  className="max-w-full max-h-[60px] sm:max-h-[75px] w-auto h-auto object-contain drop-shadow-xs"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-[#002B49] text-white font-serif font-black text-lg flex items-center justify-center">
                  {displayName ? displayName.charAt(0).toUpperCase() : 'S'}
                </div>
              )}
            </div>

            {/* Sub-tagline */}
            <div className="inline-flex items-center gap-1.5 text-[8px] sm:text-[9px] font-bold tracking-[0.25em] uppercase text-[#002B49]/80">
              <span className="w-3.5 h-[1px] bg-[#002B49]/40 inline-block" />
              <span>CENTRE OF EXCELLENCE</span>
              <span className="w-3.5 h-[1px] bg-[#002B49]/40 inline-block" />
            </div>

            {/* School Name in High-Impact Serif Typography */}
            <h2 className="text-base xs:text-lg sm:text-xl lg:text-[23px] font-black font-serif tracking-tight text-[#002B49] leading-snug px-1 max-w-[92%] mx-auto">
              {displayName}
            </h2>

            {/* Description Paragraph */}
            <p className="text-[9.5px] sm:text-[11px] text-[#002B49]/80 leading-relaxed font-normal max-w-xs sm:max-w-sm mx-auto line-clamp-3">
              Nurturing intellectual curiosity, ethical character, and innovative leadership through experiential learning, world-class laboratory infrastructure, and holistic sports coaching.
            </p>

            {/* 2 Key Quality Badges */}
            <div className="pt-1 flex items-center justify-center gap-1.5 sm:gap-2 text-[8px] sm:text-[9px] text-[#002B49] font-medium">
              <span className="inline-flex items-center gap-1 bg-[#002B49]/[0.07] px-2.5 py-0.5 rounded-full border border-[#002B49]/20 shadow-2xs">
                <ShieldCheck className="w-2.5 h-2.5 text-[#002B49]" /> {displayBoardLabel} Aligned
              </span>
              <span className="inline-flex items-center gap-1 bg-[#002B49]/[0.07] px-2.5 py-0.5 rounded-full border border-[#002B49]/20 shadow-2xs">
                <Award className="w-2.5 h-2.5 text-[#002B49]" /> NEP 2020 Aligned
              </span>
            </div>
          </div>

          {/* Bottom Clear Buffer: Prevents any overlap with bottom border or navigation dots */}
          <div className="h-2.5 sm:h-3 shrink-0 pointer-events-none" />
        </div>

        {/* PAGES 1 to N: PHOTO PAGES (UP TO 10 SLIDES) */}
        {slidesToUse.map((page, relIdx) => {
          const index = relIdx + 1;
          const isLeft = index % 2 === 0;
          return (
            <div
              key={page.id || relIdx}
              className="pf-template-page pf-photo-page relative w-full h-full overflow-hidden select-none cursor-pointer bg-slate-900"
              data-density="soft"
            >
              {(!page.image && !page.videoUrl) ? (
                /* INLINE EMPTY MEDIA PLACEHOLDER DIRECTLY ON THE BOOK PAGE */
                <div className="relative w-full h-full bg-gradient-to-b from-slate-900 via-slate-800 to-black flex flex-col items-center justify-center p-5 text-center text-white select-none">
                  <div className="relative z-10 w-full max-w-xs space-y-2">
                    <div className="w-11 h-11 mx-auto rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-amber-400 shadow-xl mb-1">
                      <Sparkles className="w-5 h-5" />
                    </div>

                    <div>
                      <h3 className="text-sm font-black text-white">Add Photo OR Video</h3>
                      <p className="text-[10px] text-slate-300">
                        Is page par sirf 1 photo ya 1 video rahegi (max 1 item):
                      </p>
                    </div>

                    {/* Exclusive Segmented Switcher: Photo vs Video */}
                    <div className="media-mode-container w-full pt-1.5 flex flex-col items-center">
                      <div className="flex items-center justify-center p-1 bg-white/10 rounded-xl border border-white/20 mb-2.5 w-full" data-interactive="true">
                        <button
                          type="button"
                          data-switch-media-tab="photo"
                          data-slide-index={relIdx}
                          data-interactive="true"
                          className="flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-white bg-blue-600 shadow-sm cursor-pointer"
                        >
                          📷 Photo (Image)
                        </button>
                        <button
                          type="button"
                          data-switch-media-tab="video"
                          data-slide-index={relIdx}
                          data-interactive="true"
                          className="flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-slate-300 hover:text-white cursor-pointer bg-transparent"
                        >
                          🎬 Video Tour
                        </button>
                      </div>

                      {/* Photo Section */}
                      <div data-media-panel="photo" className="w-full space-y-2" data-interactive="true">
                        <button
                          type="button"
                          data-choose-image-upload={relIdx}
                          data-interactive="true"
                          className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Upload Photo (&lt; 50KB Auto-compress)</span>
                        </button>

                        <div className="flex items-center gap-2 my-1 text-[9px] text-slate-400 font-semibold uppercase tracking-wider">
                          <div className="flex-1 h-px bg-white/20"></div>
                          <span>Ya Photo URL Daalein</span>
                          <div className="flex-1 h-px bg-white/20"></div>
                        </div>

                        <div className="flex gap-1.5">
                          <input
                            id={`url-input-image-${relIdx}`}
                            type="text"
                            placeholder="https://... photo URL"
                            data-interactive="true"
                            className="flex-1 px-2.5 py-1.5 text-xs bg-white text-slate-900 rounded-lg focus:outline-none"
                          />
                          <button
                            type="button"
                            data-save-media-url={relIdx}
                            data-media-kind="image"
                            data-interactive="true"
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg cursor-pointer shrink-0"
                          >
                            ✓ Save
                          </button>
                        </div>
                      </div>

                      {/* Video Section */}
                      <div data-media-panel="video" className="hidden w-full space-y-2 text-left" data-interactive="true">
                        <p className="text-[10px] text-slate-300">
                          YouTube link ya Direct Video URL (.mp4):
                        </p>
                        <div className="flex gap-1.5">
                          <input
                            id={`url-input-video-${relIdx}`}
                            type="text"
                            placeholder="https://youtu.be/... ya video.mp4"
                            data-interactive="true"
                            className="flex-1 px-2.5 py-1.5 text-xs bg-white text-slate-900 rounded-lg focus:outline-none"
                          />
                          <button
                            type="button"
                            data-save-media-url={relIdx}
                            data-media-kind="video"
                            data-interactive="true"
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg cursor-pointer shrink-0"
                          >
                            ✓ Save
                          </button>
                        </div>
                        <p className="text-[9.5px] text-slate-400">
                          ✨ YouTube &amp; MP4 dono supported! Auto-thumbnail and ambient blur fill rahega.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : page.mediaType === 'video' && page.videoUrl ? (() => {
                const ytId = extractYouTubeId(page.videoUrl);
                const videoThumb = page.image || (ytId ? getYouTubeThumbnail(ytId) : '');
                return (
                  <div className="relative w-full h-full overflow-hidden bg-black flex items-center justify-center">
                    {/* Blurred Background Layer fills empty pillarbox/letterbox space */}
                    {ytId ? (
                      videoThumb ? (
                        <img
                          src={videoThumb}
                          alt=""
                          aria-hidden="true"
                          className="absolute inset-0 w-full h-full object-cover filter blur-2xl scale-125 opacity-65 pointer-events-none brightness-75 select-none"
                        />
                      ) : null
                    ) : (
                      <>
                        <video
                          src={page.videoUrl}
                          poster={videoThumb}
                          muted
                          loop
                          playsInline
                          aria-hidden="true"
                          className="absolute inset-0 w-full h-full object-cover filter blur-2xl scale-125 opacity-60 pointer-events-none brightness-75 select-none"
                        />
                        {videoThumb && (
                          <img
                            src={videoThumb}
                            alt=""
                            aria-hidden="true"
                            className="absolute inset-0 w-full h-full object-cover filter blur-2xl scale-125 opacity-40 pointer-events-none brightness-75 select-none"
                          />
                        )}
                      </>
                    )}

                    {/* Vignette shadow */}
                    <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/75 pointer-events-none z-10" />

                    {/* Foreground Video: 100% Clean without YouTube text or logo */}
                    {ytId ? (
                      <div className="relative z-10 w-full aspect-video max-h-full flex items-center justify-center overflow-hidden rounded-xl shadow-2xl pointer-events-none select-none">
                        <div className="relative w-full h-full overflow-hidden">
                          <iframe
                            src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&playsinline=1&controls=0&rel=0&showinfo=0&iv_load_policy=3&cc_load_policy=0&cc_lang_pref=none&modestbranding=1&disablekb=1&fs=0&enablejsapi=1`}
                            title={page.title || 'School Video'}
                            data-book-iframe="true"
                            data-yt-id={ytId}
                            data-slide-page={index}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            className="absolute border-0 pointer-events-none select-none"
                            style={{
                              width: '124%',
                              height: '148%',
                              top: '-24%',
                              left: '-12%',
                              pointerEvents: 'none',
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <video
                        src={page.videoUrl}
                        poster={videoThumb}
                        muted
                        loop
                        playsInline
                        preload="auto"
                        data-book-video="true"
                        data-slide-page={index}
                        className="relative z-10 max-w-full max-h-full w-auto h-auto object-contain pointer-events-none shadow-2xl"
                      />
                    )}

                    {/* ONLY 1 BUTTON: Sound On / Off Control (Centered horizontally, away from corners to prevent page flip) */}
                    <button
                      type="button"
                      data-sound-toggle="true"
                      data-is-muted="true"
                      data-slide-page={index}
                      data-interactive="true"
                      className="absolute top-3 left-1/2 -translate-x-1/2 z-30 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/80 hover:bg-black/95 text-white backdrop-blur-md border border-white/25 text-[10px] font-bold shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer pointer-events-auto select-none"
                      title="Click to Turn Sound On / Off"
                      aria-label="Click to Turn Sound On / Off"
                    >
                      <span className="sound-icon-muted flex items-center gap-1.5 text-slate-200">
                        <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                        <span>Sound: OFF</span>
                      </span>
                      <span className="sound-icon-unmuted hidden items-center gap-1.5 text-emerald-300">
                        <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Sound: ON</span>
                      </span>
                    </button>
                  </div>
                );
              })() : (
                <img
                  src={page.image}
                  alt={page.title}
                  className="w-full h-full object-cover object-center pointer-events-none block"
                  onError={(e) => {
                    e.currentTarget.src = '/images/schools/hero-brightfuture.jpg';
                  }}
                />
              )}

              {/* In-Page Top Toolbar in Edit Mode: Slide Badge + Replace Media + Delete Page */}
              {isEditMode && (
                <div className="absolute top-2.5 inset-x-2.5 z-30 flex items-center justify-between pointer-events-auto" data-interactive="true">
                  <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold border border-white/20 shadow-xs">
                    Slide #{relIdx + 1}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      data-replace-media={relIdx}
                      data-interactive="true"
                      className="inline-flex items-center gap-1 bg-black/65 hover:bg-black/85 text-white backdrop-blur-md border border-white/25 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                      title="Replace photo or video directly"
                    >
                      <Edit3 className="w-2.5 h-2.5 text-amber-400" />
                      <span>Replace Media</span>
                    </button>
                    {slidesToUse.length > 1 && (
                      <button
                        type="button"
                        data-delete-page={relIdx}
                        data-interactive="true"
                        className="inline-flex items-center gap-1 bg-rose-600/80 hover:bg-rose-600 text-white backdrop-blur-md border border-white/25 text-[10px] font-bold px-2 py-1 rounded-full shadow-md transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                        title="Delete this slide"
                      >
                        <Trash2 className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Inline Replace Media Box Popover: EXCLUSIVE PHOTO VS VIDEO MODE */}
              {isEditMode && (
                <div
                  id={`media-picker-${relIdx}`}
                  className="hidden absolute inset-2.5 z-40 bg-black/95 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center justify-center text-center text-white border border-white/20 animate-in fade-in"
                  data-interactive="true"
                >
                  <div className="w-full flex justify-end mb-0.5">
                    <button
                      type="button"
                      data-replace-media={relIdx}
                      data-interactive="true"
                      className="p-1 hover:bg-white/20 rounded-lg text-slate-300 hover:text-white cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <h4 className="text-xs font-black text-white mb-0.5">Replace Media for Slide #{relIdx + 1}</h4>
                  <p className="text-[10px] text-slate-300 mb-2">Max 1 item allowed (Photo OR Video):</p>

                  <div className="media-mode-container w-full max-w-xs flex flex-col items-center">
                    {/* Segmented Mode Tabs */}
                    <div className="flex items-center justify-center p-1 bg-white/10 rounded-xl border border-white/20 mb-2.5 w-full" data-interactive="true">
                      <button
                        type="button"
                        data-switch-media-tab="photo"
                        data-slide-index={relIdx}
                        data-interactive="true"
                        className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          page.mediaType !== 'video'
                            ? 'text-white bg-blue-600 shadow-sm'
                            : 'text-slate-300 hover:text-white bg-transparent'
                        }`}
                      >
                        📷 Photo (Image)
                      </button>
                      <button
                        type="button"
                        data-switch-media-tab="video"
                        data-slide-index={relIdx}
                        data-interactive="true"
                        className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          page.mediaType === 'video'
                            ? 'text-slate-950 bg-amber-500 shadow-sm'
                            : 'text-slate-300 hover:text-white bg-transparent'
                        }`}
                      >
                        🎬 Video Tour
                      </button>
                    </div>

                    {/* Photo Panel */}
                    <div
                      data-media-panel="photo"
                      className={`w-full space-y-2 ${page.mediaType === 'video' ? 'hidden' : ''}`}
                      data-interactive="true"
                    >
                      <button
                        type="button"
                        data-choose-image-upload={relIdx}
                        data-interactive="true"
                        className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Upload Photo (&lt; 50KB Auto-compress)</span>
                      </button>

                      <div className="flex items-center gap-2 my-1 text-[9px] text-slate-400 font-semibold uppercase tracking-wider">
                        <div className="flex-1 h-px bg-white/20"></div>
                        <span>Ya Photo URL Daalein</span>
                        <div className="flex-1 h-px bg-white/20"></div>
                      </div>

                      <div className="flex gap-1.5">
                        <input
                          id={`url-input-image-${relIdx}`}
                          type="text"
                          placeholder="https://... photo URL"
                          defaultValue={page.mediaType !== 'video' ? page.image || '' : ''}
                          data-interactive="true"
                          className="flex-1 px-2.5 py-1.5 text-xs bg-white text-slate-900 rounded-lg focus:outline-none"
                        />
                        <button
                          type="button"
                          data-save-media-url={relIdx}
                          data-media-kind="image"
                          data-interactive="true"
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg cursor-pointer shrink-0"
                        >
                          ✓ Save
                        </button>
                      </div>
                    </div>

                    {/* Video Panel */}
                    <div
                      data-media-panel="video"
                      className={`w-full space-y-2 text-left ${page.mediaType === 'video' ? '' : 'hidden'}`}
                      data-interactive="true"
                    >
                      <p className="text-[10px] text-slate-300">
                        YouTube link ya Direct Video URL (.mp4):
                      </p>
                      <div className="flex gap-1.5">
                        <input
                          id={`url-input-video-${relIdx}`}
                          type="text"
                          placeholder="https://youtu.be/... ya video.mp4"
                          defaultValue={page.mediaType === 'video' ? page.videoUrl || '' : ''}
                          data-interactive="true"
                          className="flex-1 px-2.5 py-1.5 text-xs bg-white text-slate-900 rounded-lg focus:outline-none"
                        />
                        <button
                          type="button"
                          data-save-media-url={relIdx}
                          data-media-kind="video"
                          data-interactive="true"
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg cursor-pointer shrink-0"
                        >
                          ✓ Save
                        </button>
                      </div>
                      <p className="text-[9.5px] text-slate-400">
                        ✨ YouTube &amp; MP4 dono supported! Auto-thumbnail and ambient blur fill rahega.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Realistic 3D Spine Crease Valley & Curvature */}
              <div 
                className={`hidden sm:block absolute inset-y-0 ${
                  isLeft ? 'right-0' : 'left-0'
                } w-16 pointer-events-none z-20`}
                style={{
                  background: isLeft
                    ? 'linear-gradient(to left, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.52) 12%, rgba(0,0,0,0.28) 28%, rgba(0,0,0,0.12) 50%, rgba(0,0,0,0.03) 75%, transparent 100%)'
                    : 'linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.52) 12%, rgba(0,0,0,0.28) 28%, rgba(0,0,0,0.12) 50%, rgba(0,0,0,0.03) 75%, transparent 100%)'
                }}
              />
              <div className={`hidden sm:block absolute inset-y-0 ${
                isLeft ? 'right-0' : 'left-0'
              } w-[1.5px] bg-black/85 pointer-events-none z-20`} />
              <div 
                className={`hidden sm:block absolute inset-y-0 ${
                  isLeft ? 'right-10 sm:right-12' : 'left-10 sm:left-12'
                } w-8 pointer-events-none z-20 opacity-35`}
                style={{
                  background: isLeft
                    ? 'linear-gradient(to left, transparent 0%, rgba(255,255,255,0.22) 50%, transparent 100%)'
                    : 'linear-gradient(to right, transparent 0%, rgba(255,255,255,0.22) 50%, transparent 100%)',
                  mixBlendMode: 'overlay'
                }}
              />

              {/* Bottom Caption Banner with DIRECT IN-PAGE EDITABLE TEXT + 2-LINE BUTTON FORM */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/65 to-transparent p-3 sm:p-4 pb-7 sm:pb-8 pt-7 text-white z-20 flex flex-col justify-end">
                {/* Heading: Directly editable on click */}
                <h4
                  contentEditable={isEditMode}
                  suppressContentEditableWarning={true}
                  data-edit-heading={relIdx}
                  data-interactive="true"
                  className={`text-xs sm:text-sm font-black tracking-tight text-white leading-tight drop-shadow-sm transition-all ${
                    isEditMode
                      ? 'hover:ring-1 hover:ring-amber-400/80 focus:ring-2 focus:ring-amber-400 focus:outline-none rounded px-1 -mx-1 cursor-text bg-black/35 select-text'
                      : ''
                  }`}
                  title={isEditMode ? 'Click to edit heading directly on page' : undefined}
                >
                  {page.title || (isEditMode ? 'Click to type Heading' : '')}
                </h4>

                {/* Short Paragraph / Caption: Directly editable on click */}
                <p
                  contentEditable={isEditMode}
                  suppressContentEditableWarning={true}
                  data-edit-caption={relIdx}
                  data-interactive="true"
                  className={`text-[10px] sm:text-[11px] text-slate-200 mt-1 drop-shadow-sm transition-all ${
                    isEditMode
                      ? 'hover:ring-1 hover:ring-amber-400/80 focus:ring-2 focus:ring-amber-400 focus:outline-none rounded px-1 -mx-1 cursor-text bg-black/35 select-text'
                      : 'line-clamp-1'
                  }`}
                  title={isEditMode ? 'Click to edit description directly on page' : undefined}
                >
                  {page.desc || (isEditMode ? 'Click to type description' : '')}
                </p>

                {/* Action Button & 2-Line Mini Popover Form with OTHER/CUSTOM URL Option */}
                <div className="relative mt-2 flex items-center">
                  {isEditMode ? (
                    <>
                      {/* Button in Edit Mode: Clicking opens 2-line mini form */}
                      <button
                        type="button"
                        data-edit-button={relIdx}
                        data-interactive="true"
                        className="inline-flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold px-3 py-1 rounded-full text-[10px] shadow-sm pointer-events-auto cursor-pointer transition-transform hover:scale-105 active:scale-95 border border-amber-500/30"
                        title="Click to edit button text & linked tab/custom URL"
                      >
                        <span>{page.buttonText || 'Explore More'}</span>
                        <Edit3 className="w-2.5 h-2.5 stroke-[2.5] text-slate-700" />
                      </button>

                      {/* 2-Line Mini Inline Form Popover right above the button */}
                      <div
                        id={`btn-popover-${relIdx}`}
                        className="hidden absolute bottom-full mb-2 left-0 w-72 sm:w-80 bg-white/95 backdrop-blur-md rounded-xl p-3 shadow-2xl border border-slate-300 text-slate-800 z-50 text-[11px]"
                        data-interactive="true"
                      >
                        {/* Line 1: Button Label Input */}
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0 w-12">Label:</span>
                          <input
                            type="text"
                            defaultValue={page.buttonText || ''}
                            placeholder="e.g. Explore Campus"
                            data-interactive="true"
                            className="btn-label-input flex-1 px-2.5 py-1 text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006FCC] text-slate-900"
                          />
                        </div>

                        {/* Line 2: Destination Link (Tab dropdown or Custom Link) */}
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0 w-12">Link:</span>
                          <select
                            defaultValue={STANDARD_TAB_IDS.includes(page.actionTab || '') ? page.actionTab : 'custom'}
                            data-interactive="true"
                            className="btn-tab-select flex-1 px-1.5 py-1 text-[11px] font-semibold bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006FCC] text-slate-800 cursor-pointer"
                          >
                            {TAB_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            data-btn-save={relIdx}
                            data-interactive="true"
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg shadow-sm flex items-center gap-1 shrink-0 cursor-pointer"
                            title="Save changes"
                          >
                            <Check className="w-3 h-3 stroke-[3]" />
                            <span>Save</span>
                          </button>
                          <button
                            type="button"
                            data-btn-close={relIdx}
                            data-interactive="true"
                            className="p-1 hover:bg-slate-200 text-slate-400 hover:text-slate-700 rounded-md shrink-0 cursor-pointer"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Line 2b: Custom URL Input Box (Shown if 'custom' is selected or actionTab is non-standard) */}
                        <div
                          className={`btn-custom-url-box mt-2 pt-2 border-t border-slate-200 ${
                            STANDARD_TAB_IDS.includes(page.actionTab || '') ? 'hidden' : 'flex items-center gap-2'
                          }`}
                        >
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0 w-12">URL:</span>
                          <input
                            type="text"
                            placeholder="https://... or /contact or tel:..."
                            defaultValue={STANDARD_TAB_IDS.includes(page.actionTab || '') ? '' : page.actionTab || ''}
                            data-interactive="true"
                            className="btn-custom-url-input flex-1 px-2 py-1 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006FCC] text-slate-900"
                          />
                        </div>
                      </div>
                    </>
                  ) : page.buttonText ? (
                    <button
                      type="button"
                      data-action-tab={page.actionTab || 'about'}
                      data-interactive="true"
                      className="inline-flex items-center gap-1 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold px-2.5 py-0.5 rounded-full text-[9.5px] shadow-sm pointer-events-auto cursor-pointer transition-transform hover:scale-105 active:scale-95"
                    >
                      <span>{page.buttonText}</span>
                      <ChevronRight className="w-2.5 h-2.5 stroke-[3]" />
                    </button>
                  ) : null}
                </div>
              </div>

              {/* Turn Page hint on right pages (or all pages on mobile) - Only in public mode */}
              {!isEditMode && (!isLeft || isMobile) && (
                <div className="absolute bottom-2.5 right-2.5 z-30 pointer-events-none opacity-85">
                  <span className="inline-flex items-center gap-1 text-[8.5px] font-bold text-white bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20 shadow-sm">
                    <span>Turn Page</span>
                    <ChevronRight className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                </div>
              )}
            </div>
          );
        })}

        {/* OPTIONAL/EDITABLE: "+ ADD PAGE" TEMPLATE PAGE */}
        {hasAddPageSlide && (
          <div
            className="pf-template-page pf-addpage-page relative w-full h-full bg-[#FAF8F5] border-l border-[#E2DDD0] p-5 sm:p-7 flex flex-col justify-between text-[#002B49] overflow-hidden select-none cursor-pointer shadow-inner"
            style={{ backgroundColor: '#FAF8F5' }}
            data-density="soft"
          >
            {/* Real Paper Texture Overlay */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.055] mix-blend-multiply z-10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paperNoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paperNoise)'/%3E%3C/svg%3E")`
              }}
            />

            <div className="relative z-20 m-auto w-full max-w-xs border-2 border-dashed border-[#002B49]/35 hover:border-[#006FCC] rounded-2xl p-6 text-center bg-white/75 backdrop-blur-xs transition-colors group">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#EDF5FA] border border-[#D6EDFF] flex items-center justify-center text-[#006FCC] group-hover:scale-110 transition-transform mb-3 shadow-sm">
                <Plus className="w-7 h-7 stroke-[2.5]" />
              </div>

              <h4 className="text-base font-black text-[#002B49] tracking-tight">
                + Add New Campus Page
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 mb-4 leading-relaxed">
                Insert a new visual page into this book. Add image or video, heading, caption and button.
              </p>

              <button
                type="button"
                data-add-page-action="true"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#006FCC] hover:bg-[#005499] text-white text-xs font-bold rounded-xl shadow-md transition-transform hover:scale-105 active:scale-95 cursor-pointer pointer-events-auto"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Add Page #{slidesToUse.length + 1}</span>
              </button>

              <div className="mt-3 text-[10px] text-slate-400 font-semibold">
                {slidesToUse.length} / 10 Pages Used
              </div>
            </div>
          </div>
        )}

        {/* Page 6 Template: Concluding "Thank You" Page with Authentic Physical Book Paper Texture */}
        <div
          className="pf-template-page pf-thankyou-page relative w-full h-full bg-[#FAF8F5] border-l border-[#E2DDD0] p-5 sm:p-6 flex flex-col justify-between text-[#002B49] overflow-hidden select-none shadow-inner"
          style={{ backgroundColor: '#FAF8F5' }}
          data-density="soft"
        >
          {/* Authentic Real Book Paper Fiber / Grain Texture Overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.055] mix-blend-multiply z-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paperNoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paperNoise)'/%3E%3C/svg%3E")`
            }}
          />

          {/* Realistic 3D Spine Crease Valley & Curvature on Thank You Page */}
          <div 
            className="hidden sm:block absolute inset-y-0 left-0 w-16 pointer-events-none z-20"
            style={{
              background: 'linear-gradient(to right, rgba(0,0,0,0.50) 0%, rgba(0,0,0,0.32) 12%, rgba(0,0,0,0.18) 28%, rgba(0,0,0,0.08) 50%, rgba(0,0,0,0.02) 75%, transparent 100%)'
            }}
          />
          <div className="hidden sm:block absolute inset-y-0 left-0 w-[1.5px] bg-black/60 pointer-events-none z-20" />
          <div 
            className="hidden sm:block absolute inset-y-0 left-10 sm:left-12 w-8 pointer-events-none z-20 opacity-25"
            style={{
              background: 'linear-gradient(to right, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
              mixBlendMode: 'overlay'
            }}
          />

          {/* Paper Punch Holes: only on mobile matching the left edge spiral */}
          <div className="sm:hidden flex absolute inset-y-0 left-1 w-2 flex-col justify-between py-2 pointer-events-none z-20">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#001524]/70 shadow-inner border border-slate-400/30" />
            ))}
          </div>

          {/* Ambient Paper Depth Blobs */}
          <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-[#005689]/[0.035] blur-2xl pointer-events-none" />
          <div className="absolute -bottom-14 -left-14 w-40 h-40 rounded-full bg-amber-600/[0.03] blur-xl pointer-events-none" />

          {/* Header Badge */}
          <div className="relative z-20 flex items-center justify-start sm:pl-3">
            <span className="inline-flex items-center gap-1.5 bg-[#002B49]/[0.07] backdrop-blur-sm px-2.5 py-0.5 rounded-full text-[10px] font-bold text-[#002B49] uppercase tracking-wider border border-[#002B49]/15 shadow-sm">
              <Sparkles className="w-3 h-3 text-[#005689] fill-[#005689]" />
              <span>Campus Tour Complete</span>
            </span>
          </div>

          {/* Body Content */}
          <div className="relative z-20 text-center my-auto space-y-2 py-1 sm:pl-2">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#002B49]/[0.08] border border-[#002B49]/15 mx-auto flex items-center justify-center shadow-sm">
              <GraduationCap className="w-7 h-7 sm:w-8 sm:h-8 text-[#002B49] stroke-[2]" />
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-[#002B49] tracking-tight">
              Thank You!
            </h3>

            <p className="text-[11px] sm:text-xs text-[#002B49]/80 font-medium max-w-xs mx-auto leading-relaxed">
              We look forward to welcoming you to {displayName}. Visit our campus to experience our academic culture and world-class facilities in person.
            </p>

            <div className="pt-0.5 flex flex-wrap items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#002B49] bg-[#002B49]/[0.06] border border-[#002B49]/20 px-2.5 py-0.5 rounded-full shadow-xs">
                <CheckCircle2 className="w-3 h-3 text-[#005689]" />
                Admissions Open 2026-27
              </span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="relative z-20 flex items-center justify-between pt-2 border-t border-[#E2DDD0] sm:pl-2">
            <button
              type="button"
              data-reset-action="true"
              onClick={handleResetToFirst}
              className="inline-flex items-center gap-1.5 bg-[#002B49] hover:bg-[#001D32] text-white font-bold px-3 py-1.5 rounded-xl text-[11px] shadow-sm transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3 stroke-[2.5]" />
              <span>Start Again ↺</span>
            </button>

            {onApplyClick && (
              <button
                type="button"
                data-apply-action="true"
                onClick={onApplyClick}
                className="inline-flex items-center gap-1 bg-[#006FCC] hover:bg-[#005499] text-white font-bold px-3 py-1.5 rounded-xl text-[11px] shadow-sm transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>Apply Now</span>
                <ChevronRight className="w-3 h-3 stroke-[2.5]" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Global CSS Overrides for PageFlip container: fills 100% with realistic 3D curl perspective & shadows */}
      <style jsx global>{`
        .stf__parent {
          position: relative !important;
          width: 100% !important;
          height: 100% !important;
          background: transparent !important;
          box-sizing: border-box !important;
          transform: translateZ(0);
          touch-action: pan-y;
        }
        .stf__wrapper {
          position: relative !important;
          width: 100% !important;
          height: 100% !important;
          background: transparent !important;
          box-sizing: border-box !important;
        }
        .stf__block {
          position: absolute !important;
          width: 100% !important;
          height: 100% !important;
          box-sizing: border-box !important;
          perspective: 2400px !important;
        }
        .stf__item {
          box-sizing: border-box !important;
          transform-style: preserve-3d !important;
          backface-visibility: hidden !important;
          -webkit-backface-visibility: hidden !important;
        }
        .stf__item.pf-cover-page,
        .pf-cover-page {
          background-color: #FAF8F5 !important;
          background: radial-gradient(ellipse 90% 80% at 50% 36%, #FFFFFF 0%, #FAF8F5 55%, #F0ECE1 100%) !important;
          color: #002B49 !important;
        }
        .stf__item.pf-photo-page,
        .pf-photo-page {
          background-color: #0f172a !important;
        }
        .stf__item.pf-thankyou-page,
        .pf-thankyou-page {
          background-color: #FAF8F5 !important;
          color: #002B49 !important;
        }
        .stf__item img {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          display: block !important;
        }
        .stf__item video[data-book-video="true"] {
          max-width: 100% !important;
          max-height: 100% !important;
          width: auto !important;
          height: auto !important;
          object-fit: contain !important;
          display: block !important;
          margin: auto !important;
        }
        .stf__item video[aria-hidden="true"] {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          display: block !important;
        }
        .stf__outerShadow,
        .stf__innerShadow,
        .stf__hardShadow,
        .stf__hardInnerShadow {
          position: absolute !important;
          left: 0 !important;
          top: 0 !important;
          pointer-events: none !important;
        }

        /* User's Exact 3D Metallic Spiral Spine & Rings */
        .spiral-spine {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .ring {
          width: 100%;
          height: 16px;
          background: linear-gradient(90deg, #6b7280, #f3f4f6, #4b5563, #1f2937);
          border-radius: 10px;
          box-shadow: 
            0 4px 6px rgba(0, 0, 0, 0.4),
            inset 0 2px 3px rgba(255, 255, 255, 0.8),
            inset 0 -2px 3px rgba(0, 0, 0, 0.6);
          position: relative;
        }

        .ring::before {
          content: '';
          position: absolute;
          top: 3px;
          left: 10px;
          right: 10px;
          height: 4px;
          background: rgba(0, 0, 0, 0.4);
          border-radius: 2px;
        }

        .ring.ring-mobile {
          height: 13px;
          border-radius: 8px;
        }

        .ring.ring-mobile::before {
          top: 2px;
          left: 5px;
          right: 5px;
          height: 3px;
        }
      `}</style>

    </div>
  );
}
