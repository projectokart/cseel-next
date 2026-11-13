'use client';

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FacultyJobItem, VerifiedFacultyItem } from '@/data/facultyJobsData';
import {
  Navigation, Crosshair, ChevronLeft, ChevronRight,
  X, Briefcase, Plus, Minus, Maximize2, Minimize2, List, Columns2,
  ChevronUp, ChevronDown, Search, Layers, RotateCcw
} from 'lucide-react';
import Link from 'next/link';
import { formatStructuredAddress, formatCleanSalary, getSourceDisplayName, getGoogleMapsSearchUrl } from '@/lib/jobCardUtils';

// Helper to format ultra-compact per-month salary for 2-line map badges
function getBadgeSalaryShort(raw?: string | null): string {
  if (!raw || raw === '---' || raw.toLowerCase().includes('not disclosed')) {
    return '₹ Norms';
  }
  let s = raw.trim();

  // If long description passed, extract salary segment
  if (s.length > 50) {
    const payMatch = s.match(/(?:pay|salary|ctc|stipend)?\s*[:\-–]?\s*(₹?\s*[\d\.,]+\s*(?:k|lpa|lacs?|lakhs?|per\s*(?:month|year)|p\.?a\.?|\/\s*(?:mo|month|yr))?(?:\s*[-–—to]+\s*₹?\s*[\d\.,]+)?)/i);
    if (payMatch) s = payMatch[1];
    else return '₹ Norms';
  }

  // 1. Convert LPA to per-month short (e.g. 3-5 LPA -> ₹25-42k/mo)
  const lMatch = s.match(/([\d\.]+)\s*(?:lpa|lakhs?|lacs?)?\s*[-–—to]*\s*([\d\.]*)\s*(?:lpa|lakhs?|lacs?)/i);
  if (lMatch) {
    const v1 = parseFloat(lMatch[1]);
    const v2 = lMatch[2] ? parseFloat(lMatch[2]) : null;
    if (!isNaN(v1) && v1 < 100) {
      const k1 = Math.round((v1 * 100) / 12);
      if (v2 && !isNaN(v2) && v2 < 100 && v1 !== v2) {
        const k2 = Math.round((v2 * 100) / 12);
        return `₹${k1}-${k2}k/mo`;
      }
      return `₹${k1}k/mo`;
    }
  }

  // 2. Monthly k match (e.g. 25k - 40k/mo)
  const mMatch = s.match(/(\d+)\s*k?\s*[-–—to]*\s*(\d*)\s*k?\s*(?:\/\s*mo|\/\s*month|per\s*month)?/i);
  if (mMatch) {
    let k1 = parseInt(mMatch[1], 10);
    let k2 = mMatch[2] ? parseInt(mMatch[2], 10) : null;
    if (k1 >= 1000) k1 = Math.round(k1 / 1000);
    if (k2 && k2 >= 1000) k2 = Math.round(k2 / 1000);
    if (k2 && k1 !== k2) return `₹${k1}-${k2}k/mo`;
    return `₹${k1}k/mo`;
  }

  return s.length > 11 ? s.slice(0, 10) : s;
}

interface FacultyJobMapProps {
  activeTab: 'jobs' | 'faculty';
  jobs: FacultyJobItem[];
  faculty: VerifiedFacultyItem[];
  selectedCity?: string;
  currentPage?: number;
  totalPages?: number;
  totalJobsCount?: number;
  onPageChange?: (page: number) => void;
  onSelectJob?: (job: FacultyJobItem) => void;
  onSelectFaculty?: (faculty: VerifiedFacultyItem) => void;
  onPostJob?: () => void;
  onListTeacher?: () => void;
  savedJobIds?: string[];
  toggleSaveJob?: (id: string) => void;
  onCopyJobUrl?: (job: FacultyJobItem) => void;
  copiedJobId?: string | null;
  onOpenConnect?: (faculty: VerifiedFacultyItem) => void;
  className?: string;
  latestUpdatedDate?: string;
}

const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  Delhi: { lat: 28.6139, lng: 77.2090 },
  'Delhi NCR': { lat: 28.6139, lng: 77.2090 },
  Gurugram: { lat: 28.4595, lng: 77.0266 },
  Noida: { lat: 28.5355, lng: 77.3910 },
  Mumbai: { lat: 19.0760, lng: 72.8777 },
  Pune: { lat: 18.5204, lng: 73.8567 },
  Bengaluru: { lat: 12.9716, lng: 77.5946 },
  Hyderabad: { lat: 17.3850, lng: 78.4867 },
  Jaipur: { lat: 26.9124, lng: 75.7873 },
  Chandigarh: { lat: 30.7333, lng: 76.7794 },
  Kolkata: { lat: 22.5726, lng: 88.3639 },
  Chennai: { lat: 13.0827, lng: 80.2707 },
  Ahmedabad: { lat: 23.0225, lng: 72.5714 },
};

function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Generate Rich Hover/Click Information Popup right ABOVE point
function generatePopupHtml(item: any, activeTab: 'jobs' | 'faculty'): string {
  if (activeTab === 'jobs') {
    const j = item as FacultyJobItem;
    const orgName = (j.organisationName || 'School').replace(/"/g, '&quot;');
    const postName = (j.jobPostName || 'Teaching Faculty').replace(/"/g, '&quot;');
    const salaryClean = formatCleanSalary(j.salary, false);
    const addrClean = formatStructuredAddress(j).replace(/"/g, '&quot;');
    const gMapsUrl = getGoogleMapsSearchUrl(j);
    const applyUrl = j.applyUrl || j.originalUrl || `/edu-network/teachers/job/${j.id}`;
    const logoUrl = j.organisationLogo || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=80&auto=format&fit=crop&q=80';
    const srcName = getSourceDisplayName(j.source);

    return `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; min-width: 210px; max-width: 240px; padding: 2px;">
        <div style="display: flex; align-items: center; gap: 7px; margin-bottom: 5px;">
          <img src="${logoUrl}" style="width: 30px; height: 30px; border-radius: 7px; object-fit: contain; border: 1px solid #e2e8f0; background: #fff; padding: 2px; shrink: 0;" alt="" />
          <div style="flex: 1; min-width: 0;">
            <div style="font-weight: 700; font-size: 12px; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${orgName}</div>
            <div style="font-size: 9.5px; color: #0284c7; font-weight: 700;">${srcName} Verified</div>
          </div>
        </div>
        <div style="font-size: 12px; font-weight: 800; color: #003c6e; margin-bottom: 3px; line-height: 1.25; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${postName}</div>
        <div style="font-size: 11px; color: #16a34a; font-weight: 800; margin-bottom: 4px;">${salaryClean}</div>
        <div style="display: flex; align-items: flex-start; gap: 4px; font-size: 10px; color: #64748b; margin-bottom: 7px; line-height: 1.3;">
          <span style="color: #ef4444; font-size: 11px; line-height: 1;">📍</span>
          <span style="overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">${addrClean}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 5px; padding-top: 5px; border-top: 1px solid #f1f5f9;">
          <a href="${gMapsUrl}" target="_blank" rel="noopener noreferrer" style="flex: 1; text-align: center; background: #f8fafc; border: 1px solid #cbd5e1; color: #334155; text-decoration: none; padding: 4px 0; border-radius: 5px; font-size: 10px; font-weight: 700;">Maps ↗</a>
          <a href="${applyUrl}" target="_blank" rel="noopener noreferrer" style="flex: 1.2; text-align: center; background: #0A66C2; color: #fff; text-decoration: none; padding: 4px 0; border-radius: 5px; font-size: 10px; font-weight: 700;">Apply ↗</a>
        </div>
      </div>
    `;
  } else {
    const f = item as VerifiedFacultyItem;
    return `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; min-width: 200px; padding: 2px;">
        <div style="display: flex; align-items: center; gap: 7px; margin-bottom: 4px;">
          <img src="${f.avatar}" style="width: 32px; height: 32px; border-radius: 8px; object-fit: cover; border: 1px solid #e2e8f0;" alt="" />
          <div>
            <div style="font-weight: 800; font-size: 12.5px; color: #003c6e;">${f.name}</div>
            <div style="font-size: 10px; color: #64748b;">${f.designation} • ${f.subject}</div>
          </div>
        </div>
        <div style="font-size: 10.5px; color: #475569; margin-bottom: 6px;">${f.city} • ${f.experienceYears}+ Yrs Exp</div>
        <a href="/edu-network/teachers/${f.id}" style="display: block; text-align: center; background: #005689; color: #fff; text-decoration: none; padding: 4px 0; border-radius: 6px; font-size: 10.5px; font-weight: 700;">View Profile</a>
      </div>
    `;
  }
}

const getPointLat = (item: any): number => {
  if (item?.coordinates && typeof item.coordinates.lat === 'number') return item.coordinates.lat;
  if (typeof item?.lat === 'number') return item.lat;
  if (typeof item?.latitude === 'number') return item.latitude;
  if (typeof item?.coordinates?.lat === 'string') return parseFloat(item.coordinates.lat) || 0;
  return 0;
};

const getPointLng = (item: any): number => {
  if (item?.coordinates && typeof item.coordinates.lng === 'number') return item.coordinates.lng;
  if (typeof item?.lng === 'number') return item.lng;
  if (typeof item?.longitude === 'number') return item.longitude;
  if (typeof item?.coordinates?.lng === 'string') return parseFloat(item.coordinates.lng) || 0;
  return 0;
};

export default function FacultyJobMap({
  activeTab,
  jobs,
  faculty,
  selectedCity,
  currentPage = 1,
  totalPages = 1,
  totalJobsCount = 0,
  onPageChange,
  onSelectJob,
  onSelectFaculty,
  onPostJob,
  onListTeacher,
  savedJobIds = [],
  toggleSaveJob,
  onCopyJobUrl,
  copiedJobId,
  onOpenConnect,
  latestUpdatedDate,
  className = "h-[calc(100dvh-200px)] min-h-[460px] max-h-[700px] md:h-[620px] w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative",
}: FacultyJobMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const canvasRendererRef = useRef<L.Canvas | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const circleLayerRef = useRef<L.Circle | null>(null);
  const centerMarkerRef = useRef<L.Marker | null>(null);
  const mountedMarkersRef = useRef<Map<string, L.CircleMarker>>(new Map());

  const [isLocating, setIsLocating] = useState(false);
  const [displayMode, setDisplayMode] = useState<'points' | 'badges'>('points');

  // STRICT REQUIREMENT: Radius limit is strictly 1 to 50 km (default 25km). NO ZERO (All India dump removed)!
  const [distanceRadius, setDistanceRadius] = useState<number>(25);

  // Pagination / Batch Rendering State: Default batch size is 25 points
  const MAP_BATCH_SIZE = 25;
  const [visibleBatchCount, setVisibleBatchCount] = useState<number>(25);

  // Custom User Location Pin dropped by tapping anywhere on map
  const [customPin, setCustomPin] = useState<{ lat: number; lng: number } | null>(null);

  const [isDesktopSheetMinimized, setIsDesktopSheetMinimized] = useState(false);
  const [isDesktopSheetWide, setIsDesktopSheetWide] = useState(false);
  const [isDesktopSheetHidden, setIsDesktopSheetHidden] = useState(false);
  const [mapListSearch, setMapListSearch] = useState('');
  const [activeOpportunityIndex, setActiveOpportunityIndex] = useState<number | null>(null);
  const mapWrapperRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Mobile sheet drawer state: 'peek' (58px) | 'half' (50vh) | 'full' (86vh)
  const [mobileSheetState, setMobileSheetState] = useState<'peek' | 'half' | 'full'>('half');

  // Active center coordinate: Priority -> Custom Tapped Pin > GPS Live Location > Selected City > Default Delhi NCR
  const currentCenter = useMemo(() => {
    if (customPin) return customPin;
    if (userLocation) return userLocation;
    if (selectedCity && CITY_COORDS[selectedCity]) {
      return CITY_COORDS[selectedCity];
    }
    return { lat: 28.6139, lng: 77.2090 }; // Default Delhi NCR
  }, [customPin, userLocation, selectedCity]);

  // Dynamic offset calculation ensuring popups NEVER touch the top header or bottom sheet
  const getOffsetLatLng = useCallback((lat: number, lng: number, zoom?: number) => {
    if (!mapInstanceRef.current || !mapContainerRef.current) return [lat, lng] as [number, number];

    const currentZoom = zoom ?? mapInstanceRef.current.getZoom();
    const containerHeight = mapContainerRef.current.clientHeight;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    let offsetY = 0;
    let offsetX = 0;

    if (isMobile) {
      if (mobileSheetState === 'half') {
        offsetY = Math.round(containerHeight * 0.12);
      } else if (mobileSheetState === 'full') {
        offsetY = Math.round(containerHeight * 0.25);
      } else {
        offsetY = -15;
      }
    } else {
      if (!isDesktopSheetHidden) {
        offsetX = isDesktopSheetWide ? 200 : 140;
      }
      offsetY = -15;
    }

    const targetPoint = mapInstanceRef.current.project([lat, lng], currentZoom);
    const newCenterPoint = L.point(targetPoint.x + offsetX, targetPoint.y + offsetY);
    const newCenterLatLng = mapInstanceRef.current.unproject(newCenterPoint, currentZoom);

    return [newCenterLatLng.lat, newCenterLatLng.lng] as [number, number];
  }, [mobileSheetState, isDesktopSheetHidden, isDesktopSheetWide]);

  // Auto Live Location on initial mount (High accuracy)
  useEffect(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        if (latitude && longitude) {
          setUserLocation({ lat: latitude, lng: longitude });
        }
      },
      (err) => {
        console.log('[FacultyJobMap] Auto-geolocation notice:', err.message);
      },
      { timeout: 8000, enableHighAccuracy: true, maximumAge: 60000 }
    );
  }, []);

  // Filter items within distanceRadius (Max 70 km from center)
  const inRadiusItems = useMemo(() => {
    const rawList = activeTab === 'jobs' ? jobs : faculty;
    // Capped at 70km per user directive
    const safeRadius = Math.min(Math.max(distanceRadius || 25, 1), 70);

    return rawList.filter((item) => {
      const lat = getPointLat(item);
      const lng = getPointLng(item);
      if (!lat || !lng || isNaN(lat) || isNaN(lng) || lat < 5) return false;
      const d = getDistanceKm(
        currentCenter.lat,
        currentCenter.lng,
        lat,
        lng
      );
      return d <= safeRadius;
    });
  }, [activeTab, jobs, faculty, distanceRadius, currentCenter]);

  // Batch rendering pagination: Limit visible items on map to visibleBatchCount (starts at 25)
  const filteredItems = useMemo(() => {
    return inRadiusItems.slice(0, visibleBatchCount);
  }, [inRadiusItems, visibleBatchCount]);

  // Filtered by in-list search term (Filter role, subject, school...)
  const displayedListItems = useMemo(() => {
    if (!mapListSearch.trim()) return filteredItems;
    const q = mapListSearch.toLowerCase().trim();
    return filteredItems.filter((item: any) => {
      const title = (item.jobPostName || item.name || '').toLowerCase();
      const school = (item.organisationName || item.currentInstitute || '').toLowerCase();
      const loc = (item.city || item.state || '').toLowerCase();
      const subj = (item.subject || '').toLowerCase();
      return title.includes(q) || school.includes(q) || loc.includes(q) || subj.includes(q);
    });
  }, [filteredItems, mapListSearch]);

  // Reset batch count when center or radius changes
  useEffect(() => {
    setVisibleBatchCount(25);
    setActiveOpportunityIndex(null);
  }, [distanceRadius, customPin]);

  const handleSelectCard = useCallback((idx: number) => {
    setActiveOpportunityIndex(idx);
    const item: any = filteredItems[idx];
    if (item && item.coordinates && mapInstanceRef.current) {
      const zoom = Math.max(mapInstanceRef.current.getZoom(), 12);
      const offsetLatLng = getOffsetLatLng(item.coordinates.lat, item.coordinates.lng, zoom);
      mapInstanceRef.current.flyTo(offsetLatLng, zoom, { duration: 0.8 });
    }
  }, [filteredItems, getOffsetLatLng]);

  const handleFlyToPin = (item: any, idx: number) => {
    handleSelectCard(idx);
  };

  // Drag handling state for mobile bottom drawer
  const dragStartYRef = useRef<number | null>(null);
  const dragCurrentYRef = useRef<number | null>(null);
  const [isDraggingSheet, setIsDraggingSheet] = useState(false);
  const [dragDeltaY, setDragDeltaY] = useState(0);

  const handleDragStart = (clientY: number) => {
    dragStartYRef.current = clientY;
    dragCurrentYRef.current = clientY;
    setIsDraggingSheet(true);
    setDragDeltaY(0);
  };

  const handleDragMove = (clientY: number) => {
    if (dragStartYRef.current === null) return;
    dragCurrentYRef.current = clientY;
    setDragDeltaY(clientY - dragStartYRef.current);
  };

  const handleDragEnd = () => {
    if (dragStartYRef.current === null || dragCurrentYRef.current === null) {
      setIsDraggingSheet(false);
      setDragDeltaY(0);
      return;
    }

    const diffY = dragCurrentYRef.current - dragStartYRef.current;
    if (diffY < -35) {
      if (mobileSheetState === 'peek') setMobileSheetState('half');
      else if (mobileSheetState === 'half') setMobileSheetState('full');
    } else if (diffY > 35) {
      if (mobileSheetState === 'full') setMobileSheetState('half');
      else if (mobileSheetState === 'half') setMobileSheetState('peek');
    } else if (Math.abs(diffY) <= 10) {
      setMobileSheetState((prev) => (prev === 'peek' ? 'half' : prev === 'half' ? 'full' : 'peek'));
    }

    dragStartYRef.current = null;
    dragCurrentYRef.current = null;
    setIsDraggingSheet(false);
    setDragDeltaY(0);
  };

  // Fullscreen change listener
  useEffect(() => {
    const handleFsChange = () => {
      const fs = !!document.fullscreenElement;
      setIsFullscreen(fs);
      setTimeout(() => mapInstanceRef.current?.invalidateSize(), 150);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    const el = mapWrapperRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().catch(() => setIsFullscreen((prev) => !prev));
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
    setTimeout(() => mapInstanceRef.current?.invalidateSize(), 150);
  };

  // Window resize & orientation change handler
  useEffect(() => {
    const handleResize = () => {
      mapInstanceRef.current?.invalidateSize();
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // Initialize Map with Hardware-Accelerated Canvas Renderer & Click-to-Drop Pin
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Use Canvas renderer with padding to eliminate DOM overhead completely (supports 10,000+ points at 60fps)
    const canvasRenderer = L.canvas({ padding: 0.5 });
    canvasRendererRef.current = canvasRenderer;

    const map = L.map(mapContainerRef.current, {
      center: [currentCenter.lat, currentCenter.lng],
      zoom: 11,
      zoomControl: false,
      attributionControl: false,
      maxZoom: 18,
      minZoom: 4,
      renderer: canvasRenderer,
      preferCanvas: true,
    });

    // Clean OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors · CSEEL',
    }).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;
    mapInstanceRef.current = map;

    // USER DIRECTIVE: Touch or Click anywhere on the map to drop a custom pin & draw radius circle!
    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      setCustomPin({ lat, lng });
      setVisibleBatchCount(25);
      setActiveOpportunityIndex(null);
    });

    setTimeout(() => map.invalidateSize(), 80);
    setTimeout(() => map.invalidateSize(), 300);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      mountedMarkersRef.current.clear();
    };
  }, []);

  // Update Center Marker & Radius Circle (Radar Ring) around currentCenter
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear previous circle & center marker
    if (circleLayerRef.current) {
      map.removeLayer(circleLayerRef.current);
      circleLayerRef.current = null;
    }
    if (centerMarkerRef.current) {
      map.removeLayer(centerMarkerRef.current);
      centerMarkerRef.current = null;
    }

    const safeRadius = Math.min(Math.max(distanceRadius || 25, 1), 70);

    // Draw Radius Circle (Blue dashed boundary ring)
    const circle = L.circle([currentCenter.lat, currentCenter.lng], {
      radius: safeRadius * 1000,
      color: '#005689',
      weight: 1.75,
      dashArray: '6, 6',
      fillColor: '#006FCC',
      fillOpacity: 0.07,
    }).addTo(map);

    circleLayerRef.current = circle;

    // Pin with Radar Pulse Ring at Center
    const centerPinHtml = `
      <div style="position: relative; display: flex; align-items: center; justify-content: center; cursor: pointer;">
        <div class="live-gps-radar-ring" style="position: absolute; width: 44px; height: 44px; border-radius: 9999px; background: rgba(0, 111, 204, 0.28); border: 1.5px solid #006FCC;"></div>
        <div style="width: 14px; height: 14px; background: #EA4335; border: 2.5px solid #ffffff; border-radius: 9999px; box-shadow: 0 2px 8px rgba(234,67,53,0.5); z-index: 2;"></div>
      </div>
    `;
    const centerIcon = L.divIcon({
      className: 'center-radar-pin',
      html: centerPinHtml,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
    });

    const tooltipLabel = customPin
      ? `Selected Pin (${safeRadius}km)`
      : userLocation
      ? `My Location (${safeRadius}km)`
      : `${selectedCity || 'Search Center'} (${safeRadius}km)`;

    const centerMarker = L.marker([currentCenter.lat, currentCenter.lng], { icon: centerIcon })
      .bindTooltip(tooltipLabel, { direction: 'top', offset: [0, -18] })
      .addTo(map);

    centerMarkerRef.current = centerMarker;

    // Smooth auto-fit to circle bounds when center or radius changes
    if (activeOpportunityIndex === null) {
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
      const containerHeight = mapContainerRef.current?.clientHeight || 800;
      let paddingTop = 50;
      let paddingBottom = 40;
      if (isMobile && mobileSheetState === 'half') {
        paddingTop = 60;
        paddingBottom = Math.round(containerHeight * 0.50) + 10;
      } else if (isMobile && mobileSheetState === 'full') {
        paddingTop = 60;
        paddingBottom = Math.round(containerHeight * 0.86) + 10;
      }

      map.fitBounds(circle.getBounds(), {
        paddingTopLeft: [25, paddingTop],
        paddingBottomRight: [25, paddingBottom],
        maxZoom: 13,
        animate: true,
      });
    }
  }, [currentCenter, distanceRadius, customPin, userLocation, selectedCity, mobileSheetState]);

  // High-Performance Hardware-Accelerated Canvas Rendering of all In-Radius Vacancies
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (markersLayerRef.current) {
      map.removeLayer(markersLayerRef.current);
      markersLayerRef.current = null;
    }

    const canvasRenderer = canvasRendererRef.current || L.canvas({ padding: 0.5, tolerance: 8 });
    const layerGroup = L.layerGroup();
    const coordCounts: Record<string, number> = {};

    filteredItems.forEach((item: any, idx: number) => {
      let lat = getPointLat(item);
      let lng = getPointLng(item);
      if (!lat || !lng || isNaN(lat) || isNaN(lng) || lat < 5) return;

      const coordKey = `${lat.toFixed(3)},${lng.toFixed(3)}`;
      const offsetIndex = coordCounts[coordKey] || 0;
      coordCounts[coordKey] = offsetIndex + 1;

      if (offsetIndex > 0) {
        const angle = offsetIndex * 2.399963;
        const microRadius = 0.0006 * Math.sqrt(offsetIndex);
        lat += microRadius * Math.cos(angle);
        lng += microRadius * Math.sin(angle);
      }

      const isSelected = activeOpportunityIndex === idx;

      const circleMarker = L.circleMarker([lat, lng], {
        renderer: canvasRenderer,
        radius: isSelected ? 8.5 : 6,
        fillColor: isSelected ? '#b91c1c' : '#ea4335',
        color: '#ffffff',
        weight: isSelected ? 2.5 : 1.8,
        opacity: 1,
        fillOpacity: isSelected ? 1 : 0.95,
      });

      const title = item.jobPostName || item.name || 'Opportunity';
      const org = item.organisationName || item.currentInstitute || 'Institution';
      const sal = item.salary ? formatCleanSalary(item.salary, true) : item.expectedSalary || '';

      circleMarker.bindTooltip(
        `<div style="font-family: system-ui, -apple-system, sans-serif; font-size: 11px; font-weight: 600; color: #1e293b; padding: 2px 4px;">
          <div style="font-weight: 700; color: #004A75; font-size: 12px; line-height: 1.2;">${title}</div>
          <div style="color: #64748b; font-size: 10px; margin-top: 2px;">${org}</div>
          ${sal ? `<div style="color: #137333; font-weight: 700; font-size: 10px; margin-top: 2px;">${sal}</div>` : ''}
        </div>`,
        { direction: 'top', offset: [0, -6] }
      );

      const popupContent = generatePopupHtml(item, activeTab);
      circleMarker.bindPopup(popupContent, {
        offset: [0, -6],
        closeButton: true,
        autoPan: true,
        autoPanPadding: [24, 130]
      });

      circleMarker.on('click', (ev) => {
        L.DomEvent.stopPropagation(ev);
        handleSelectCard(idx);
        circleMarker.openPopup();
      });

      layerGroup.addLayer(circleMarker);
    });

    layerGroup.addTo(map);
    markersLayerRef.current = layerGroup;
  }, [filteredItems, activeOpportunityIndex, activeTab, handleSelectCard]);

  // Handle batch increment / decrement
  const handleLoadNextBatch = () => {
    setVisibleBatchCount((prev) => Math.min(prev + MAP_BATCH_SIZE, inRadiusItems.length));
  };

  const handlePrevBatch = () => {
    setVisibleBatchCount((prev) => Math.max(MAP_BATCH_SIZE, prev - MAP_BATCH_SIZE));
  };

  const handleShowAllInRadius = () => {
    setVisibleBatchCount(Math.min(inRadiusItems.length, 3000));
  };

  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();

  const fitToCurrentRadius = useCallback(() => {
    if (!mapInstanceRef.current || !circleLayerRef.current) return;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const containerHeight = mapContainerRef.current?.clientHeight || 800;
    let paddingTop = 50;
    let paddingBottom = 40;
    if (isMobile && mobileSheetState === 'half') {
      paddingTop = 60;
      paddingBottom = Math.round(containerHeight * 0.50) + 10;
    }
    mapInstanceRef.current.fitBounds(circleLayerRef.current.getBounds(), {
      paddingTopLeft: [25, paddingTop],
      paddingBottomRight: [25, paddingBottom],
      maxZoom: 13,
      animate: true,
    });
  }, [mobileSheetState]);

  const handleLocateMe = () => {
    if (!navigator.geolocation || !mapInstanceRef.current) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setCustomPin(null); // Reset any custom pin to live GPS
        setVisibleBatchCount(25);
        const map = mapInstanceRef.current;
        if (map) {
          const zoom = 11;
          const offsetLatLng = getOffsetLatLng(latitude, longitude, zoom);
          map.flyTo(offsetLatLng, zoom, { duration: 1.2 });
        }
      },
      () => setIsLocating(false),
      { timeout: 8000 }
    );
  };

  const renderMapCard = (item: any, idx: number) => {
    const isJob = activeTab === 'jobs';
    const job = isJob ? (item as FacultyJobItem) : null;
    const fac = !isJob ? (item as VerifiedFacultyItem) : null;
    const isSelected = activeOpportunityIndex === idx;

    const title = job ? job.jobPostName : fac?.name;
    const subTitle = job ? (job.organisationName || 'School') : fac?.currentInstitute;
    const locationStr = job ? formatStructuredAddress(job) : fac?.city;
    const logoImg = job ? job.organisationLogo : fac?.avatar;
    const salaryStr = job ? formatCleanSalary(job.salary, true) : fac?.expectedSalary;
    const boardStr = job?.board || 'CBSE';
    const subjectStr = job?.subject || fac?.subject;

    return (
      <div
        key={`map-card-${item.id || idx}`}
        onClick={() => handleSelectCard(idx)}
        className={`p-2.5 rounded-2xl border transition-all duration-200 cursor-pointer flex gap-2.5 text-left group ${
          isSelected
            ? 'bg-[#EDF5FA] border-[#006FCC] shadow-xs ring-2 ring-[#006FCC]/20'
            : 'bg-white border-[#E8E9E9] hover:border-[#006FCC]/50 hover:bg-[#F7F8F8] shadow-2xs'
        }`}
      >
        {/* Compact Logo */}
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-[10px] overflow-hidden bg-slate-50 border border-slate-100 shrink-0 relative flex items-center justify-center">
          {logoImg ? (
            <img
              src={logoImg}
              alt={title || ''}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
                const fb = (e.target as HTMLElement).parentElement?.querySelector('.monogram-map') as HTMLElement;
                if (fb) fb.style.display = 'flex';
              }}
            />
          ) : null}
          <div
            className={`monogram-map w-full h-full rounded-[10px] bg-blue-50 text-[#006FCC] font-black text-xs items-center justify-center uppercase select-none ${logoImg ? 'hidden' : 'flex'}`}
          >
            {(subTitle || 'SC').slice(0, 2)}
          </div>
          {job?.rating && (
            <div className="absolute bottom-0.5 left-0.5 bg-black/75 backdrop-blur-xs text-amber-300 text-[9px] font-bold px-1 rounded flex items-center gap-0.5 leading-tight">
              <span>★</span>
              <span>{job.rating}</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <div>
            <div className="flex items-center justify-between gap-1">
              <h4 className="text-[12.5px] font-bold text-[#003C6E] truncate group-hover:text-[#006FCC] leading-tight font-['Montserrat',sans-serif]">
                {title}
              </h4>
              {salaryStr && (
                <span className="text-[9.5px] font-bold text-[#137333] bg-[#E6F4EA] px-1.5 py-0.2 rounded-full shrink-0">
                  {salaryStr}
                </span>
              )}
            </div>

            <p className="text-[10.5px] text-slate-500 truncate mt-0.5 leading-tight">
              {locationStr}
            </p>

            <div className="flex items-center gap-1 mt-1 flex-wrap">
              {boardStr && (
                <span className="text-[9.5px] font-bold text-[#006FCC] bg-[#EDF5FA] px-1.5 py-0.2 rounded-[6px]">
                  {boardStr}
                </span>
              )}
              {subjectStr && (
                <span className="text-[9.5px] font-medium text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded-[6px] truncate max-w-[130px]">
                  {subjectStr}
                </span>
              )}
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-[#E8E9E9] gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleFlyToPin(item, idx);
              }}
              className="h-6 px-2.5 rounded-[8px] bg-[#EDF5FA] hover:bg-[#DDF0FC] text-[#006FCC] text-[10.5px] font-bold flex items-center gap-1 transition cursor-pointer"
            >
              <Navigation size={10} className="fill-[#006FCC] rotate-45" />
              <span>Fly to Pin</span>
            </button>

            {job ? (
              <Link
                href={`/edu-network/teachers/job/${job.id}`}
                onClick={(e) => e.stopPropagation()}
                className="h-6 px-3 rounded-[8px] bg-[#006FCC] hover:bg-[#005399] text-white text-[10.5px] font-bold inline-flex items-center gap-1 transition shadow-2xs"
              >
                <span>Details</span>
                <ChevronRight size={11} />
              </Link>
            ) : fac ? (
              <Link
                href={`/edu-network/teachers/${fac.id}`}
                onClick={(e) => e.stopPropagation()}
                className="h-6 px-3 rounded-[8px] bg-[#006FCC] hover:bg-[#005399] text-white text-[10.5px] font-bold inline-flex items-center gap-1 transition shadow-2xs"
              >
                <span>Profile</span>
                <ChevronRight size={11} />
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      ref={mapWrapperRef}
      className={`relative w-full h-full min-h-0 overflow-hidden bg-slate-50 flex flex-col md:flex-row select-none ${
        isFullscreen ? 'fixed inset-0 z-[9999] w-screen h-screen rounded-none max-h-none h-screen' : ''
      } ${className}`}
    >
      {/* ─── DESKTOP SIDE SHEET (Left side of map) ─── */}
      {!isDesktopSheetHidden && (
        <div
          className={`hidden md:flex flex-col bg-white/95 backdrop-blur-xl border-r border-slate-200 shadow-xl transition-all duration-300 z-20 shrink-0 h-full relative rounded-l-3xl overflow-hidden ${
            isDesktopSheetMinimized
              ? 'w-14'
              : isDesktopSheetWide
              ? 'w-[480px]'
              : 'w-[320px] lg:w-[380px]'
          }`}
        >
          {isDesktopSheetMinimized ? (
            <div className="flex flex-col items-center py-4 h-full justify-between">
              <button
                type="button"
                onClick={() => setIsDesktopSheetMinimized(false)}
                className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition shadow-2xs group relative cursor-pointer"
                title="Expand Results"
              >
                <ChevronRight size={18} className="group-hover:scale-110 transition-transform" />
                <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-[11px] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-30">
                  Show Results List ({displayedListItems.length})
                </span>
              </button>

              <div className="[writing-mode:vertical-rl] rotate-180 text-xs font-bold text-gray-500 tracking-wider flex items-center gap-2">
                <span>{displayedListItems.length} Points</span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span>{distanceRadius}km Radius</span>
              </div>

              <button
                type="button"
                onClick={() => setIsDesktopSheetHidden(true)}
                className="w-8 h-8 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 flex items-center justify-center transition cursor-pointer"
                title="Close Sheet"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col h-full overflow-hidden">
              {/* Sheet Header */}
              <div className="p-3.5 border-b border-gray-200 bg-slate-50/70 shrink-0 space-y-2.5">
                <div className="flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                      {displayedListItems.length}
                    </div>
                    <div className="truncate">
                      <h3 className="text-xs font-bold text-gray-900 truncate">
                        {activeTab === 'jobs' ? 'Vacancies on Map' : 'Faculty on Map'}
                      </h3>
                      <p className="text-[10px] text-gray-500 truncate">
                        {inRadiusItems.length} available within {distanceRadius}km
                      </p>
                    </div>
                  </div>

                  {/* Window Controls */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={toggleFullscreen}
                      className="w-7 h-7 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-600 flex items-center justify-center transition cursor-pointer"
                      title={isFullscreen ? 'Restore View' : 'Expand Fullscreen'}
                    >
                      {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsDesktopSheetWide(!isDesktopSheetWide)}
                      className="w-7 h-7 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-600 flex items-center justify-center transition cursor-pointer"
                      title={isDesktopSheetWide ? 'Narrow Sheet' : 'Widen Sheet'}
                    >
                      <Columns2 size={13} className={isDesktopSheetWide ? 'rotate-90' : ''} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsDesktopSheetMinimized(true)}
                      className="w-7 h-7 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-600 flex items-center justify-center transition cursor-pointer"
                      title="Minimize"
                    >
                      <Minus size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsDesktopSheetHidden(true)}
                      className="w-7 h-7 rounded-lg border border-gray-200 hover:bg-rose-50 hover:text-rose-600 text-gray-400 flex items-center justify-center transition cursor-pointer"
                      title="Hide"
                    >
                      <X size={13} />
                    </button>
                  </div>
                </div>

                {/* Batch Progress & Radius Options (5k, 10k, 25k, 50k - Strictly max 50km, NO 0) */}
                <div className="flex items-center justify-between gap-1.5 flex-wrap">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-bold text-slate-500">Radius:</span>
                    <div className="flex items-center bg-white p-0.5 rounded-lg border border-gray-200">
                      {[5, 10, 25, 50].map((km) => (
                        <button
                          key={km}
                          type="button"
                          onClick={() => setDistanceRadius(km)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
                            distanceRadius === km
                              ? 'bg-[#004A75] text-white shadow-2xs'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {km}k
                        </button>
                      ))}
                    </div>
                  </div>

                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">
                    25 pts / batch
                  </span>
                </div>

                {/* In-list Search Filter */}
                <div className="relative w-full">
                  <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={mapListSearch}
                    onChange={(e) => setMapListSearch(e.target.value)}
                    placeholder="Filter role, subject, school..."
                    className="w-full pl-7 pr-6 py-1 bg-white border border-gray-200 rounded-lg text-xs placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  {mapListSearch && (
                    <button
                      type="button"
                      onClick={() => setMapListSearch('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      <X size={11} />
                    </button>
                  )}
                </div>
              </div>

              {/* Scrollable Job Cards List */}
              <div className="flex-1 overflow-y-auto p-2.5 space-y-2 custom-scrollbar">
                {displayedListItems.length > 0 ? (
                  displayedListItems.map((item: any, idx: number) => renderMapCard(item, idx))
                ) : (
                  <div className="p-8 text-center text-gray-400 text-xs">
                    No vacancies found within {distanceRadius}km. Tap map to check another area.
                  </div>
                )}
              </div>

              {/* Sheet Bottom Footer: Batch Add Points */}
              <div className="p-2.5 border-t border-gray-200 bg-slate-50 shrink-0 flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs text-gray-600 font-medium">
                  <span>
                    Showing <strong className="text-gray-900">{displayedListItems.length}</strong> of{' '}
                    <strong className="text-gray-900">{inRadiusItems.length}</strong> points
                  </span>
                  {inRadiusItems.length > visibleBatchCount && (
                    <button
                      type="button"
                      onClick={handleShowAllInRadius}
                      className="text-[11px] text-blue-600 hover:underline font-bold cursor-pointer"
                    >
                      +Add All ({inRadiusItems.length})
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handlePrevBatch}
                    disabled={visibleBatchCount <= MAP_BATCH_SIZE}
                    className="flex-1 py-1.5 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 disabled:opacity-40 transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <ChevronLeft size={13} />
                    <span>Prev</span>
                  </button>
                  <span className="text-xs font-mono font-bold text-slate-700 px-2">
                    {Math.min(visibleBatchCount, inRadiusItems.length)} / {inRadiusItems.length}
                  </span>
                  <button
                    type="button"
                    onClick={handleLoadNextBatch}
                    disabled={visibleBatchCount >= inRadiusItems.length}
                    className="flex-1 py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold disabled:opacity-40 transition flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                  >
                    <span>Next Vacancies</span>
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Re-open Button if Desktop Sheet is Hidden */}
      {isDesktopSheetHidden && (
        <button
          type="button"
          onClick={() => setIsDesktopSheetHidden(false)}
          className="hidden md:flex absolute top-4 left-4 z-30 items-center gap-2 px-3 py-2 bg-white/95 backdrop-blur-md rounded-full border border-gray-200 shadow-md hover:bg-white text-xs font-bold text-blue-600 transition cursor-pointer"
        >
          <List size={14} />
          <span>Show Jobs List ({displayedListItems.length})</span>
        </button>
      )}

      {/* ─── MAP CANVAS (Right side) ─── */}
      <div className="flex-1 h-full relative min-w-0 rounded-none md:rounded-r-3xl md:rounded-l-none overflow-hidden">
        <div ref={mapContainerRef} className="w-full h-full z-0 flex-1 min-h-0 cursor-crosshair" />

        {/* Floating Custom Pin Indicator with Reset to GPS Button */}
        {customPin && (
          <div className="absolute top-2.5 left-2.5 sm:left-4 z-20 bg-white/95 backdrop-blur-md border border-[#006FCC]/40 rounded-xl px-2.5 py-1.5 shadow-md flex items-center gap-2 text-xs font-semibold text-slate-800 animate-in fade-in">
            <div className="w-2 h-2 rounded-full bg-[#EA4335] shrink-0" />
            <span className="truncate max-w-[170px] sm:max-w-xs text-[11px] sm:text-xs">
              Pin ({customPin.lat.toFixed(2)}, {customPin.lng.toFixed(2)}) • {inRadiusItems.length} jobs
            </span>
            <button
              type="button"
              onClick={() => {
                setCustomPin(null);
                setVisibleBatchCount(25);
              }}
              className="inline-flex items-center gap-1 text-[10.5px] font-bold text-[#006FCC] hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded-md cursor-pointer transition shrink-0"
              title="Reset center to live GPS"
            >
              <RotateCcw size={10} />
              <span>Reset GPS</span>
            </button>
          </div>
        )}

        {/* Right-Side Floating Map Controls (Zoom, Fullscreen, Fit Radius, GPS) */}
        <div className="absolute top-20 right-2 sm:right-3.5 z-20 flex flex-col items-center gap-1.5 select-none pointer-events-auto">
          <div className="flex flex-col shadow-[0_2px_8px_rgba(60,64,67,0.25)] rounded-2xl overflow-hidden bg-white/95 backdrop-blur-md border border-[#dadce0]">
            <button
              type="button"
              onClick={handleZoomIn}
              className="w-8 h-8 sm:w-9 sm:h-9 hover:bg-[#f8f9fa] text-[#3c4043] flex items-center justify-center border-b border-[#dadce0] transition-colors active:bg-slate-100 cursor-pointer"
              title="Zoom In"
            >
              <Plus size={15} />
            </button>
            <button
              type="button"
              onClick={handleZoomOut}
              className="w-8 h-8 sm:w-9 sm:h-9 hover:bg-[#f8f9fa] text-[#3c4043] flex items-center justify-center transition-colors active:bg-slate-100 cursor-pointer"
              title="Zoom Out"
            >
              <Minus size={15} />
            </button>
            <button
              type="button"
              onClick={toggleFullscreen}
              className="w-8 h-8 sm:w-9 sm:h-9 hover:bg-[#f8f9fa] text-[#5f6368] hover:text-[#006FCC] flex items-center justify-center border-t border-[#dadce0] transition-colors active:bg-slate-100 cursor-pointer"
              title={isFullscreen ? "Exit Fullscreen" : "Full Screen View"}
            >
              {isFullscreen ? <Minimize2 size={15} className="text-[#006FCC]" /> : <Maximize2 size={14} />}
            </button>
            <button
              type="button"
              onClick={fitToCurrentRadius}
              className="w-8 h-8 sm:w-9 sm:h-9 hover:bg-[#f8f9fa] text-[#5f6368] hover:text-[#006FCC] flex items-center justify-center border-t border-[#dadce0] transition-colors active:bg-slate-100 cursor-pointer"
              title="Fit View to Search Radius Area"
            >
              <Crosshair size={14} />
            </button>
            <button
              type="button"
              onClick={handleLocateMe}
              disabled={isLocating}
              className="w-8 h-8 sm:w-9 sm:h-9 hover:bg-[#f8f9fa] text-[#006FCC] flex items-center justify-center border-t border-[#dadce0] transition-colors active:bg-slate-100 cursor-pointer disabled:opacity-60"
              title="Locate Current Position"
            >
              <Navigation size={14} className={isLocating ? 'animate-spin' : ''} />
            </button>
          </div>

          {/* Vertical Distance Range Bar (1 to 70 km - Max 70km) */}
          <div className="flex flex-col items-center bg-white/95 backdrop-blur-md border border-[#dadce0] rounded-2xl py-1.5 px-1 sm:py-2 sm:px-1.5 shadow-[0_2px_8px_rgba(60,64,67,0.25)] select-none">
            <span className="text-[9.5px] font-extrabold text-[#006FCC] bg-[#eef3fc] px-1 py-0.5 rounded font-mono mb-1.5 whitespace-nowrap">
              {distanceRadius}k
            </span>

            <div className="relative h-20 sm:h-24 flex items-center justify-center">
              <input
                type="range"
                min="1"
                max="70"
                step="1"
                value={distanceRadius}
                onChange={(e) => setDistanceRadius(Number(e.target.value))}
                className="h-20 sm:h-24 w-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-[#006FCC]"
                style={{
                  writingMode: 'vertical-lr',
                  WebkitAppearance: 'slider-vertical',
                  direction: 'rtl',
                }}
                title={`Radius: ${distanceRadius} km (Max 70 km)`}
              />
            </div>

            <span className="text-[8px] font-bold text-slate-400 mt-1 uppercase tracking-tight">km</span>
          </div>
        </div>
      </div>

      {/* ─── MOBILE BOTTOM DRAWER (< 768px) ─── */}
      <div
        style={isDraggingSheet ? {
          transform: `translateY(${Math.max(Math.min(dragDeltaY, 200), -200)}px)`,
          transition: 'none'
        } : undefined}
        className={`md:hidden absolute z-30 inset-x-0 bottom-0 bg-white/95 backdrop-blur-xl border-t border-gray-200/90 shadow-[0_-8px_30px_rgba(0,0,0,0.18)] transition-all duration-300 ease-in-out flex flex-col ${
          mobileSheetState === 'peek' ? 'h-[58px]' : mobileSheetState === 'half' ? 'h-[50vh]' : 'h-[86vh]'
        }`}
      >
        {/* Visual drag pill handle */}
        <div
          className="w-full pt-2 pb-1.5 px-4 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing select-none touch-none shrink-0 group"
          onTouchStart={(e) => handleDragStart(e.touches[0].clientY)}
          onTouchMove={(e) => handleDragMove(e.touches[0].clientY)}
          onTouchEnd={handleDragEnd}
          title="Drag up/down or tap to resize drawer"
        >
          <div className="w-14 h-1.5 bg-gray-300/90 group-hover:bg-gray-400 group-active:bg-[#006FCC] rounded-full transition-colors" />
        </div>

        {/* Header Strip with Radius Pills, Vacancy Count & Next School Stepper */}
        <div className="w-full px-2.5 py-1.5 flex items-center justify-between gap-1.5 border-b border-gray-100 shrink-0 bg-white/95">
          {/* Left: Vacancy Count + Radius */}
          <div className="flex flex-col min-w-0 pr-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 leading-tight">
              <span className="font-extrabold text-[#004A75]">
                {displayedListItems.length} of {inRadiusItems.length} {activeTab === 'jobs' ? 'Jobs' : 'Faculty'}
              </span>
              <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded font-mono">
                {distanceRadius}km
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium truncate">
              {customPin ? 'Tap map to move pin' : 'Around your location'}
            </div>
          </div>

          {/* Radius Quick Pills (10k, 25k, 50k, 70k) */}
          <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-lg border border-slate-200 shrink-0">
            {[10, 25, 50, 70].map((km) => (
              <button
                key={km}
                type="button"
                onClick={() => setDistanceRadius(km)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
                  distanceRadius === km
                    ? 'bg-[#004A75] text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {km}k
              </button>
            ))}
          </div>

          {/* Drawer Resize Controls */}
          <div className="flex items-center bg-gray-100 p-0.5 rounded-lg border border-slate-200/80 ml-0.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                if (mobileSheetState === 'peek') setMobileSheetState('half');
                else if (mobileSheetState === 'half') setMobileSheetState('full');
              }}
              disabled={mobileSheetState === 'full'}
              className="w-6 h-6 rounded flex items-center justify-center text-slate-600 disabled:opacity-30 transition cursor-pointer"
            >
              <ChevronUp size={14} strokeWidth={2.5} />
            </button>
            <button
              type="button"
              onClick={() => {
                if (mobileSheetState === 'full') setMobileSheetState('half');
                else if (mobileSheetState === 'half') setMobileSheetState('peek');
              }}
              disabled={mobileSheetState === 'peek'}
              className="w-6 h-6 rounded flex items-center justify-center text-slate-600 disabled:opacity-30 transition cursor-pointer"
            >
              <ChevronDown size={14} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Mobile Scrollable Feed */}
        {mobileSheetState !== 'peek' && (
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar bg-slate-50/50">
            {displayedListItems.length > 0 ? (
              displayedListItems.map((item: any, idx: number) => renderMapCard(item, idx))
            ) : (
              <div className="p-8 text-center text-gray-400 text-xs">
                No vacancies found within {distanceRadius}km. Tap anywhere on the map to inspect another region.
              </div>
            )}
          </div>
        )}

        {/* Mobile Bottom Footer: Next Vacancies / Next School Batch Button */}
        {mobileSheetState !== 'peek' && (
          <div className="p-2.5 border-t border-gray-200 bg-white shrink-0 flex items-center justify-between gap-2 shadow-xs">
            <button
              type="button"
              onClick={handlePrevBatch}
              disabled={visibleBatchCount <= MAP_BATCH_SIZE}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold disabled:opacity-40 transition flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft size={13} />
              <span>Back</span>
            </button>

            <span className="text-[11px] font-mono font-bold text-slate-600">
              {Math.min(visibleBatchCount, inRadiusItems.length)} / {inRadiusItems.length}
            </span>

            <button
              type="button"
              onClick={handleLoadNextBatch}
              disabled={visibleBatchCount >= inRadiusItems.length}
              className="px-3.5 py-1.5 rounded-xl bg-[#004A75] hover:bg-[#003859] text-white text-xs font-bold disabled:opacity-40 transition flex items-center gap-1 cursor-pointer shadow-xs"
              title="Next batch of 25 vacancies"
            >
              <span>Next Vacancies</span>
              <ChevronRight size={13} />
            </button>
          </div>
        )}
      </div>

      {/* Radar Ring Animation Styles */}
      <style>{`
        @keyframes liveGpsRadarPulse {
          0% {
            transform: scale(0.85);
            opacity: 0.85;
          }
          70% {
            transform: scale(2.4);
            opacity: 0;
          }
          100% {
            transform: scale(2.6);
            opacity: 0;
          }
        }
        .live-gps-radar-ring {
          animation: liveGpsRadarPulse 2s cubic-bezier(0.2, 0.6, 0.35, 1) infinite;
        }
      `}</style>
    </div>
  );
}
