'use client';

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FacultyJobItem, VerifiedFacultyItem, getJobFacilityTags, getJobRequirementTags, getMinExperience } from '@/data/facultyJobsData';
import {
  ExternalLink, MapPin, Share2, Navigation, Crosshair, ChevronLeft, ChevronRight,
  X, Briefcase, IndianRupee, ShieldCheck, Mail, Sliders, CheckCheck, Compass, Sparkles,
  Plus, Minus, Maximize2, Minimize2, List, Columns2, ChevronUp, ChevronDown, Bookmark, CheckCircle2, Globe, Search
} from 'lucide-react';
import Link from 'next/link';
import { formatStructuredAddress, formatCleanSalary, getSourceDisplayName, getSourceBadgeColor, getGoogleMapsSearchUrl } from '@/lib/jobCardUtils';

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
  className = "h-[calc(100dvh-200px)] min-h-[460px] max-h-[700px] md:h-[620px] w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative",
}: FacultyJobMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const circleLayerRef = useRef<L.Circle | null>(null);
  const centerMarkerRef = useRef<L.Marker | null>(null);

  const [isLocating, setIsLocating] = useState(false);
  const [displayMode, setDisplayMode] = useState<'points' | 'badges'>('points');
  // Range: 0 to 200 km (default 50 km)
  const [distanceRadius, setDistanceRadius] = useState<number>(50);
  const [isDesktopSheetMinimized, setIsDesktopSheetMinimized] = useState(false);
  const [isDesktopSheetWide, setIsDesktopSheetWide] = useState(false);
  const [isDesktopSheetHidden, setIsDesktopSheetHidden] = useState(false);
  const [mapDisplayMode, setMapDisplayMode] = useState<'page' | 'accumulate' | 'all_dots'>('page');
  const [mapListSearch, setMapListSearch] = useState('');
  const [activeOpportunityIndex, setActiveOpportunityIndex] = useState<number | null>(null);
  const mapWrapperRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDesktopSheetOpen, setIsDesktopSheetOpen] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  // Mobile sheet drawer state: 'peek' (58px) | 'half' (50vh) | 'full' (86vh)
  const [mobileSheetState, setMobileSheetState] = useState<'peek' | 'half' | 'full'>('peek');

  // Drag handling state for mobile bottom drawer
  const dragStartYRef = useRef<number | null>(null);
  const dragCurrentYRef = useRef<number | null>(null);
  const [isDraggingSheet, setIsDraggingSheet] = useState(false);
  const [dragDeltaY, setDragDeltaY] = useState(0);
  // Fullscreen change listener for Esc / F11 sync
  useEffect(() => {
    const handleFsChange = () => {
      const fs = !!document.fullscreenElement;
      setIsFullscreen(fs);
      setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 150);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    const el = mapWrapperRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      if (el.requestFullscreen) {
        el.requestFullscreen().catch(() => {
          setIsFullscreen((prev) => !prev);
        });
      } else {
        setIsFullscreen((prev) => !prev);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
    setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 150);
    setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 400);
  };


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
    
    // Dragged UP by more than 35px
    if (diffY < -35) {
      if (mobileSheetState === 'peek') {
        setMobileSheetState('half');
      } else if (mobileSheetState === 'half') {
        setMobileSheetState('full');
      }
    } 
    // Dragged DOWN by more than 35px
    else if (diffY > 35) {
      if (mobileSheetState === 'full') {
        setMobileSheetState('half');
      } else if (mobileSheetState === 'half') {
        setMobileSheetState('peek');
      }
    } 
    // Small tap (less than 10px movement)
    else if (Math.abs(diffY) <= 10) {
      setMobileSheetState((prev) => (prev === 'peek' ? 'half' : prev === 'half' ? 'full' : 'peek'));
    }

    dragStartYRef.current = null;
    dragCurrentYRef.current = null;
    setIsDraggingSheet(false);
    setDragDeltaY(0);
  };

  // Active center coordinate: live GPS, or selected city, or default Delhi NCR
  const currentCenter = useMemo(() => {
    if (userLocation) return userLocation;
    if (selectedCity && CITY_COORDS[selectedCity]) {
      return CITY_COORDS[selectedCity];
    }
    return { lat: 28.6139, lng: 77.2090 }; // Default Delhi NCR
  }, [userLocation, selectedCity]);

  // Filter items by distance if distanceRadius > 0
  const filteredItems = useMemo(() => {
    const rawList = activeTab === 'jobs' ? jobs : faculty;

    if (distanceRadius === 0) {
      return rawList;
    }

    const withDist = rawList.filter((item) => {
      if (!item.coordinates || !item.coordinates.lat || !item.coordinates.lng) return false;
      const d = getDistanceKm(
        currentCenter.lat,
        currentCenter.lng,
        item.coordinates.lat,
        item.coordinates.lng
      );
      return d <= distanceRadius;
    });

    return withDist.length > 0 ? withDist : rawList;
  }, [activeTab, jobs, faculty, distanceRadius, currentCenter]);

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

  const handleFlyToPin = (item: any, idx: number) => {
    setActiveOpportunityIndex(idx);
    if (item.coordinates && mapInstanceRef.current) {
      const zoom = 13;
      const offsetLatLng = getOffsetLatLng(item.coordinates.lat, item.coordinates.lng, zoom);
      mapInstanceRef.current.flyTo(offsetLatLng, zoom, { duration: 0.8 });
    }
  };

  // Reset active index if out of range
  useEffect(() => {
    if (activeOpportunityIndex !== null && activeOpportunityIndex >= filteredItems.length) {
      setActiveOpportunityIndex(filteredItems.length > 0 ? 0 : null);
    }
  }, [filteredItems, activeOpportunityIndex]);

  // Auto-detect user's high-precision live GPS location on mount (School directory style)
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          if (latitude && longitude) {
            setUserLocation({ lat: latitude, lng: longitude });
            if (mapInstanceRef.current) {
              mapInstanceRef.current.setView([latitude, longitude], 11);
            }
          }
        },
        () => {},
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
      );
    }
  }, []);

  // Window resize & orientation change handler to prevent map clipping
  useEffect(() => {
    const handleResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [currentCenter.lat, currentCenter.lng],
      zoom: 9,
      zoomControl: false,
      attributionControl: false,
      maxZoom: 18,
      minZoom: 4,
    });

    // Clean OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors · CSEEL',
    }).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;
    mapInstanceRef.current = map;

    // Multi-stage invalidateSize to ensure 0 layout shift
    setTimeout(() => map.invalidateSize(), 80);
    setTimeout(() => map.invalidateSize(), 300);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update center marker & radius circle on map (SchoolFinderMap radar style)
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

    if (distanceRadius > 0) {
      // Draw Radius Circle (School page style: blue/sky filled circle)
      const circle = L.circle([currentCenter.lat, currentCenter.lng], {
        radius: distanceRadius * 1000,
        color: '#005689',
        weight: 1.5,
        dashArray: '5, 5',
        fillColor: '#005689',
        fillOpacity: 0.08,
      }).addTo(map);

      circleLayerRef.current = circle;

      // SchoolFinderMap Red Pin with Blue Radar Pulse Rings
      const centerPinHtml = `
        <div style="position: relative; display: flex; align-items: center; justify-content: center; cursor: pointer;">
          <div class="live-gps-radar-ring" style="position: absolute; width: 40px; height: 40px; border-radius: 9999px; background: rgba(0, 111, 204, 0.28); border: 1.5px solid #006FCC;"></div>
          <div style="width: 14px; height: 14px; background: #EA4335; border: 2.5px solid #ffffff; border-radius: 9999px; box-shadow: 0 2px 8px rgba(234,67,53,0.5); z-index: 2;"></div>
        </div>
      `;
      const centerIcon = L.divIcon({
        className: 'center-radar-pin',
        html: centerPinHtml,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      const centerMarker = L.marker([currentCenter.lat, currentCenter.lng], { icon: centerIcon })
        .bindTooltip(userLocation ? 'My Current Location' : (selectedCity || 'Search Center'), {
          direction: 'top',
          offset: [0, -18],
        })
        .addTo(map);

      centerMarkerRef.current = centerMarker;

      // Smooth auto-fit to circle bounds when radius changes (accounting for bottom sheet height on mobile)
      if (activeOpportunityIndex === null) {
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
        const containerHeight = mapContainerRef.current?.clientHeight || (typeof window !== 'undefined' ? window.innerHeight : 800);
        let paddingTop = 40;
        let paddingBottom = 40;
        if (isMobile && mobileSheetState === 'half') {
          paddingTop = 75; // clears floating search bar at top
          paddingBottom = Math.round(containerHeight * 0.50) + 15; // clears bottom half drawer
        } else if (isMobile && mobileSheetState === 'full') {
          paddingTop = 75;
          paddingBottom = Math.round(containerHeight * 0.86) + 15;
        }

        map.fitBounds(circle.getBounds(), {
          paddingTopLeft: [30, paddingTop],
          paddingBottomRight: [30, paddingBottom],
          maxZoom: 14,
          animate: true,
        });
      }
    }
  }, [currentCenter, distanceRadius, userLocation, selectedCity, activeOpportunityIndex, mobileSheetState]);

  // Update Opportunity Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();
    const bounds = L.latLngBounds([]);
    const coordCounts: Record<string, number> = {};

    filteredItems.forEach((item: any, index: number) => {
      if (!item.coordinates || !item.coordinates.lat || !item.coordinates.lng) return;

      let { lat, lng } = item.coordinates;
      const key = `${lat.toFixed(3)},${lng.toFixed(3)}`;
      const offsetIndex = coordCounts[key] || 0;
      coordCounts[key] = offsetIndex + 1;

      if (offsetIndex > 0) {
        // Natural micro-offset within ~50 to 100 meters (golden angle) - keeps markers precisely at school campus, never shoots across districts!
        const angle = offsetIndex * 2.399963;
        const microRadius = 0.0006 * Math.sqrt(offsetIndex);
        lat += microRadius * Math.cos(angle);
        lng += microRadius * Math.sin(angle);
      }

      bounds.extend([lat, lng]);
      const isSelected = activeOpportunityIndex === index;

      let icon: L.DivIcon;

      if (displayMode === 'points') {
        // MODE 1: RED DOT POINT VIEW (Minimal, prevents map clutter)
        const dotHtml = `
          <div style="position: relative; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.25)'" onmouseout="this.style.transform='scale(1)'">
            <div style="
              width: ${isSelected ? '18px' : '11px'};
              height: ${isSelected ? '18px' : '11px'};
              background: ${isSelected ? '#dc2626' : '#ef4444'};
              border: ${isSelected ? '2.5px solid #ffffff' : '1.5px solid #ffffff'};
              border-radius: 9999px;
              box-shadow: ${isSelected ? '0 0 0 4px rgba(220,38,38,0.35), 0 3px 8px rgba(0,0,0,0.3)' : '0 2px 5px rgba(239,68,68,0.4), 0 1px 2px rgba(0,0,0,0.2)'};
            "></div>
          </div>
        `;

        icon = L.divIcon({
          className: `map-dot-${item.id}`,
          html: dotHtml,
          iconSize: isSelected ? [22, 22] : [14, 14],
          iconAnchor: isSelected ? [11, 11] : [7, 7],
        });
      } else {
        // MODE 2: 2-LINE SMALL POST BADGE (Line 1: Post like PGT Physics, Line 2: Salary with ₹ icon)
        let line1 = '';
        let line2 = '';

        if (activeTab === 'jobs') {
          const j = item as FacultyJobItem;
          const des = j.designation || '';
          const sub = j.subject ? j.subject.split(' ')[0] : '';
          line1 = des && sub ? `${des} ${sub}` : (j.jobPostName || 'Teaching Job');
          if (line1.length > 18) line1 = line1.slice(0, 16) + '..';
          line2 = getBadgeSalaryShort(j.salary);
        } else {
          const f = item as VerifiedFacultyItem;
          line1 = `${f.name.split(' ')[0]} (${f.designation})`;
          line2 = `₹ ${f.expectedSalary || 'Exp'}`;
        }

        const pinHtml = `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer; transition: transform 0.15s;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
            <div style="background: ${isSelected ? '#00284d' : '#004c7d'}; color: #ffffff; padding: 2px 5.5px; border-radius: 6px; border: 1.5px solid #ffffff; box-shadow: 0 3px 8px rgba(0, 20, 45, 0.35); display: flex; flex-direction: column; align-items: center; text-align: center; line-height: 1.15; white-space: nowrap;">
              <div style="font-size: 8.5px; font-weight: 800; letter-spacing: 0.1px; max-width: 95px; overflow: hidden; text-overflow: ellipsis;">${line1}</div>
              <div style="font-size: 8px; font-weight: 700; color: #4ade80; margin-top: 1px;">${line2}</div>
            </div>
            <div style="width: 0; height: 0; border-left: 3.5px solid transparent; border-right: 3.5px solid transparent; border-top: 4px solid ${isSelected ? '#00284d' : '#004c7d'}; margin-top: -1px;"></div>
          </div>
        `;

        icon = L.divIcon({
          className: `map-marker-${item.id}`,
          html: pinHtml,
          iconSize: [75, 28],
          iconAnchor: [37.5, 28],
        });
      }

      const marker = L.marker([lat, lng], { icon });

      // Generate Rich Hover/Click Information Popup right ABOVE pointer
      let popupContent = '';
      if (activeTab === 'jobs') {
        const j = item as FacultyJobItem;
        const orgName = (j.organisationName || 'School').replace(/"/g, '&quot;');
        const postName = (j.jobPostName || 'Teaching Faculty').replace(/"/g, '&quot;');
        const salaryClean = formatCleanSalary(j.salary, false);
        const addrClean = formatStructuredAddress(j).replace(/"/g, '&quot;');
        const gMapsUrl = getGoogleMapsSearchUrl(j);
        const applyUrl = j.applyUrl || j.originalUrl;
        const logoUrl = j.organisationLogo || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=80&auto=format&fit=crop&q=80';
        const srcName = getSourceDisplayName(j.source);

        popupContent = `
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
        popupContent = `
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

      marker.bindPopup(popupContent, {
        offset: displayMode === 'points' ? [0, -8] : [0, -24],
        closeButton: true,
        autoPan: true,
        autoPanPaddingTopLeft: [24, 130],
        autoPanPaddingBottomRight: [24, 80],
        autoPanPadding: [24, 130]
      });

      marker.on('mouseover', () => {
        marker.openPopup();
      });

      marker.on('click', () => {
        handleSelectCard(index);
        marker.openPopup();
      });

      markersGroup.addLayer(marker);
    });

    if (distanceRadius === 0 && bounds.isValid() && activeOpportunityIndex === null) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 11 });
    }
  }, [filteredItems, displayMode, activeOpportunityIndex, distanceRadius, activeTab]);

  // Dynamic offset calculation ensuring popups NEVER touch the top header or right-side sheet
  const getOffsetLatLng = useCallback((lat: number, lng: number, zoom?: number) => {
    if (!mapInstanceRef.current || !mapContainerRef.current) return [lat, lng] as [number, number];

    const currentZoom = zoom ?? mapInstanceRef.current.getZoom();
    const containerHeight = mapContainerRef.current.clientHeight;
    const containerWidth = mapContainerRef.current.clientWidth;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    let offsetY = 0;
    let offsetX = 0;

    if (isMobile) {
      if (mobileSheetState === 'half') {
        // Leave comfortable headroom for popup card (~120px) under top header
        offsetY = Math.round(containerHeight * 0.10);
      } else if (mobileSheetState === 'full') {
        offsetY = Math.round(containerHeight * 0.22);
      } else {
        // peek mode: shift center slightly down so popup has clearance below header
        offsetY = -20;
      }
    } else {
      // Desktop: if right sheet is open (410px), shift center to the right so marker displays in left visible zone
      if (isDesktopSheetOpen) {
        offsetX = 120;
      }
      // Top header clearance
      offsetY = -15;
    }

    // Convert target lat/lng to container pixel point at current zoom
    const targetPoint = mapInstanceRef.current.project([lat, lng], currentZoom);
    const newCenterPoint = L.point(targetPoint.x + offsetX, targetPoint.y + offsetY);
    const newCenterLatLng = mapInstanceRef.current.unproject(newCenterPoint, currentZoom);

    return [newCenterLatLng.lat, newCenterLatLng.lng] as [number, number];
  }, [mobileSheetState, isDesktopSheetOpen]);

  // Auto-center shift: smoothly re-center when mobileSheetState changes (e.g. user toggles Split / Half / Peek)
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const target = (activeOpportunityIndex !== null && filteredItems[activeOpportunityIndex]?.coordinates)
      ? { lat: Number(filteredItems[activeOpportunityIndex].coordinates.lat), lng: Number(filteredItems[activeOpportunityIndex].coordinates.lng) }
      : currentCenter;

    if (target && target.lat && target.lng) {
      const zoom = mapInstanceRef.current.getZoom();
      const offsetLatLng = getOffsetLatLng(target.lat, target.lng, zoom);
      mapInstanceRef.current.flyTo(offsetLatLng, zoom, { duration: 0.45 });
    }
  }, [mobileSheetState, getOffsetLatLng]);

  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  const fitToCurrentRadius = useCallback(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const containerHeight = mapContainerRef.current?.clientHeight || (typeof window !== 'undefined' ? window.innerHeight : 800);

    let paddingTop = 40;
    let paddingBottom = 40;

    if (isMobile && mobileSheetState === 'half') {
      paddingTop = 75; // clears floating search bar at top
      paddingBottom = Math.round(containerHeight * 0.50) + 15; // clears bottom half drawer
    } else if (isMobile && mobileSheetState === 'full') {
      paddingTop = 75;
      paddingBottom = Math.round(containerHeight * 0.86) + 15;
    }

    if (circleLayerRef.current) {
      map.fitBounds(circleLayerRef.current.getBounds(), {
        paddingTopLeft: [30, paddingTop],
        paddingBottomRight: [30, paddingBottom],
        maxZoom: 14,
        animate: true,
      });
    } else {
      const zoom = 9;
      const offsetLatLng = getOffsetLatLng(currentCenter.lat, currentCenter.lng, zoom);
      map.flyTo(offsetLatLng, zoom, { duration: 0.5 });
    }
  }, [currentCenter, mobileSheetState, getOffsetLatLng]);

  const handleLocateMe = () => {
    if (!navigator.geolocation || !mapInstanceRef.current) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        const map = mapInstanceRef.current;
        if (map) {
          const zoom = 11;
          const offsetLatLng = getOffsetLatLng(latitude, longitude, zoom);
          map.flyTo(offsetLatLng, zoom, { duration: 1.2 });
        }
      },
      () => {
        setIsLocating(false);
      },
      { timeout: 8000 }
    );
  };

  const handleSelectCard = (idx: number) => {
    setActiveOpportunityIndex(idx);
    const item: any = filteredItems[idx];
    if (item && item.coordinates && mapInstanceRef.current) {
      const zoom = Math.max(mapInstanceRef.current.getZoom(), 12);
      const offsetLatLng = getOffsetLatLng(item.coordinates.lat, item.coordinates.lng, zoom);
      mapInstanceRef.current.flyTo(offsetLatLng, zoom, { duration: 0.8 });
    }
  };

  const activeJob =
    activeTab === 'jobs' && activeOpportunityIndex !== null
      ? (filteredItems[activeOpportunityIndex] as FacultyJobItem)
      : null;
  const activeFaculty =
    activeTab === 'faculty' && activeOpportunityIndex !== null
      ? (filteredItems[activeOpportunityIndex] as VerifiedFacultyItem)
      : null;

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
        {/* Compact Logo / Thumbnail */}
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
      {/* ─── DESKTOP SIDE SHEET (Left side of map, collapsible, pullable, minimizable) ─── */}
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
          {/* Minimized Vertical Bar */}
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
                <span>Batch {currentPage}/{totalPages || 1}</span>
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
            /* Expanded Desktop Sheet */
            <div className="flex flex-col h-full overflow-hidden">
              {/* Sheet Header */}
              <div className="p-3.5 border-b border-gray-200 bg-slate-50/70 shrink-0 space-y-2.5">
                {/* Title & Action Handles */}
                <div className="flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                      {displayedListItems.length}
                    </div>
                    <div className="truncate">
                      <h3 className="text-xs font-bold text-gray-900 truncate">
                        {activeTab === 'jobs' ? 'Jobs on Map' : 'Faculty on Map'}
                      </h3>
                      <p className="text-[10px] text-gray-500 truncate">
                        {totalJobsCount || filteredItems.length} total • {distanceRadius}km radius
                      </p>
                    </div>
                  </div>

                  {/* Sheet Window Controls */}
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
                      title={isDesktopSheetWide ? 'Narrow Sheet' : 'Widen Sheet (Pull)'}
                    >
                      <Columns2 size={13} className={isDesktopSheetWide ? 'rotate-90' : ''} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsDesktopSheetMinimized(true)}
                      className="w-7 h-7 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-600 flex items-center justify-center transition cursor-pointer"
                      title="Minimize to side strip"
                    >
                      <Minus size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsDesktopSheetHidden(true)}
                      className="w-7 h-7 rounded-lg border border-gray-200 hover:bg-rose-50 hover:text-rose-600 text-gray-400 flex items-center justify-center transition cursor-pointer"
                      title="Hide Sheet"
                    >
                      <X size={13} />
                    </button>
                  </div>
                </div>

                {/* Compact Control Row 1: Display Mode & Batch Info */}
                <div className="flex items-center justify-between gap-1.5 flex-wrap">
                  <div className="flex items-center bg-gray-200/80 p-0.5 rounded-lg text-[10px] font-bold">
                    <button
                      type="button"
                      onClick={() => setMapDisplayMode('page')}
                      className={`px-2 py-0.5 rounded-md transition cursor-pointer ${
                        mapDisplayMode === 'page'
                          ? 'bg-white text-blue-600 shadow-2xs'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                      title="Show current page 50 vacancies"
                    >
                      50 Page
                    </button>
                    <button
                      type="button"
                      onClick={() => setMapDisplayMode('accumulate')}
                      className={`px-2 py-0.5 rounded-md transition cursor-pointer ${
                        mapDisplayMode === 'accumulate'
                          ? 'bg-white text-emerald-600 shadow-2xs'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                      title="Accumulate points on map"
                    >
                      +Add ({displayedListItems.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setMapDisplayMode('all_dots')}
                      className={`px-2 py-0.5 rounded-md transition cursor-pointer ${
                        mapDisplayMode === 'all_dots'
                          ? 'bg-[#EA4335] text-white shadow-2xs'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                      title="Show all jobs as red dots"
                    >
                      All Dots
                    </button>
                  </div>

                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">
                    50 pts / batch
                  </span>
                </div>

                {/* Compact Control Row 2: In-list search & Radius */}
                <div className="flex items-center gap-1.5">
                  <div className="relative flex-1 min-w-0">
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

                  <div className="flex items-center gap-0.5 shrink-0 bg-white p-0.5 rounded-lg border border-gray-200">
                    {[5, 10, 25, 50, 0].map((km) => (
                      <button
                        key={km}
                        type="button"
                        onClick={() => setDistanceRadius(km)}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
                          distanceRadius === km
                            ? 'bg-gray-900 text-white shadow-2xs'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                        title={km === 0 ? 'All India' : `${km} km radius`}
                      >
                        {km === 0 ? 'All' : `${km}k`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Scrollable Job Cards List */}
              <div className="flex-1 overflow-y-auto p-2.5 space-y-2 custom-scrollbar">
                {displayedListItems.length > 0 ? (
                  displayedListItems.map((item: any, idx: number) => renderMapCard(item, idx))
                ) : (
                  <div className="p-8 text-center text-gray-400 text-xs">
                    No vacancies match &quot;{mapListSearch}&quot;
                  </div>
                )}
              </div>

              {/* Sheet Bottom Footer: Add Next 20 Points on Map */}
              {totalPages > 1 && onPageChange && (
                <div className="p-2.5 border-t border-gray-200 bg-slate-50 shrink-0 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs text-gray-600 font-medium">
                    <span>
                      Map Points: <strong className="text-gray-900">{displayedListItems.length}</strong> of{' '}
                      <strong className="text-gray-900">{totalJobsCount || filteredItems.length}</strong>
                    </span>
                    <span className="text-[11px] text-emerald-700 font-semibold">
                      (+50 pts / page)
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                      disabled={currentPage <= 1}
                      className="flex-1 py-1.5 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 disabled:opacity-40 transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <ChevronLeft size={13} />
                      <span>Prev</span>
                    </button>
                    <span className="text-xs font-mono font-bold text-slate-700 px-2">
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      type="button"
                      onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage >= totalPages}
                      className="flex-1 py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold disabled:opacity-40 transition flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                    >
                      <span>Next 50</span>
                      <ChevronRight size={13} />
                    </button>
                  </div>
                </div>
              )}
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
        <div ref={mapContainerRef} className="w-full h-full z-0 flex-1 min-h-0" />

        {/* Floating Points vs Badges toggle on map */}
        <div className="absolute top-3.5 right-16 z-20 hidden sm:flex items-center bg-white/95 backdrop-blur-md rounded-xl border border-slate-200 p-0.5 shadow-md">
          <button
            type="button"
            onClick={() => setDisplayMode('points')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              displayMode === 'points'
                ? 'bg-[#ef4444] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Points view (red dots)"
          >
            <span className="w-2 h-2 rounded-full bg-current" />
            <span>Points</span>
          </button>
          <button
            type="button"
            onClick={() => setDisplayMode('badges')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              displayMode === 'badges'
                ? 'bg-[#005689] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Badge view"
          >
            <span>🏷️</span>
            <span>Badges</span>
          </button>
        </div>

        {/* Right-Side Floating Map Controls (Zoom, Fullscreen, Fit Radius, GPS) - Top Placed */}
        <div className="absolute top-16 right-3 md:top-3.5 md:right-3.5 z-20 flex flex-col items-center gap-2 select-none">
          <div className="flex flex-col shadow-[0_2px_8px_rgba(60,64,67,0.25)] rounded-2xl overflow-hidden bg-white/95 backdrop-blur-md border border-[#dadce0]">
            <button
              type="button"
              onClick={handleZoomIn}
              className="w-9 h-9 sm:w-10 sm:h-10 hover:bg-[#f8f9fa] text-[#3c4043] flex items-center justify-center border-b border-[#dadce0] transition-colors active:bg-slate-100 cursor-pointer"
              title="Zoom In"
            >
              <Plus size={16} />
            </button>
            <button
              type="button"
              onClick={handleZoomOut}
              className="w-9 h-9 sm:w-10 sm:h-10 hover:bg-[#f8f9fa] text-[#3c4043] flex items-center justify-center transition-colors active:bg-slate-100 cursor-pointer"
              title="Zoom Out"
            >
              <Minus size={16} />
            </button>
            <button
              type="button"
              onClick={toggleFullscreen}
              className="w-9 h-9 sm:w-10 sm:h-10 hover:bg-[#f8f9fa] text-[#5f6368] hover:text-[#006FCC] flex items-center justify-center border-t border-[#dadce0] transition-colors active:bg-slate-100 cursor-pointer"
              title={isFullscreen ? "Exit Fullscreen" : "Full Screen View"}
            >
              {isFullscreen ? <Minimize2 size={16} className="text-[#006FCC]" /> : <Maximize2 size={15} />}
            </button>
            <button
              type="button"
              onClick={fitToCurrentRadius}
              className="w-9 h-9 sm:w-10 sm:h-10 hover:bg-[#f8f9fa] text-[#5f6368] hover:text-[#006FCC] flex items-center justify-center border-t border-[#dadce0] transition-colors active:bg-slate-100 cursor-pointer"
              title="Fit View to Search Radius Area"
            >
              <svg className="w-4 h-4 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M3 7V5a2 2 0 0 1 2-2h2" />
                <path d="M17 3h2a2 2 0 0 1 2 2v2" />
                <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
                <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleLocateMe}
              disabled={isLocating}
              className="w-9 h-9 sm:w-10 sm:h-10 hover:bg-[#f8f9fa] text-[#006FCC] flex items-center justify-center border-t border-[#dadce0] transition-colors active:bg-slate-100 cursor-pointer disabled:opacity-60"
              title="Locate Current Position"
            >
              <Crosshair size={16} className={isLocating ? 'animate-spin' : ''} />
            </button>
          </div>

          {/* Vertical Distance Range Bar (0 to 200 km) */}
          <div className="flex flex-col items-center bg-white/95 backdrop-blur-md border border-[#dadce0] rounded-2xl py-2 px-1.5 shadow-[0_2px_8px_rgba(60,64,67,0.25)] select-none">
            {/* Value badge at top */}
            <span className="text-[9.5px] font-extrabold text-[#006FCC] bg-[#eef3fc] px-1 py-0.5 rounded font-mono mb-1.5 whitespace-nowrap">
              {distanceRadius === 0 ? 'All' : `${distanceRadius}k`}
            </span>

            {/* Vertical Hairline Slider Track */}
            <div className="relative h-22 sm:h-26 flex items-center justify-center">
              <input
                type="range"
                min="0"
                max="200"
                step="5"
                value={distanceRadius}
                onChange={(e) => setDistanceRadius(Number(e.target.value))}
                className="h-22 sm:h-26 w-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-[#006FCC]"
                style={{
                  writingMode: 'vertical-lr',
                  WebkitAppearance: 'slider-vertical',
                  direction: 'rtl',
                }}
                title={`Search Radius: ${distanceRadius === 0 ? 'All India' : distanceRadius + ' km'}`}
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
          onPointerDown={(e) => {
            (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
            handleDragStart(e.clientY);
          }}
          onPointerMove={(e) => {
            if (isDraggingSheet) handleDragMove(e.clientY);
          }}
          onPointerUp={handleDragEnd}
          title="Drag up/down or tap to resize drawer"
        >
          <div className="w-14 h-1.5 bg-gray-300/90 group-hover:bg-gray-400 group-active:bg-[#006FCC] rounded-full transition-colors" />
        </div>

        {/* Header Strip */}
        <div className="w-full px-3 py-1.5 flex items-center justify-between gap-2 border-b border-gray-100 shrink-0 bg-white/95">
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-gray-100 p-0.5 rounded-lg border border-slate-200/80 shadow-2xs">
              <button
                type="button"
                onClick={() => {
                  if (mobileSheetState === 'peek') setMobileSheetState('half');
                  else if (mobileSheetState === 'half') setMobileSheetState('full');
                }}
                disabled={mobileSheetState === 'full'}
                className="w-7 h-7 rounded-md flex items-center justify-center text-slate-600 disabled:opacity-30 transition cursor-pointer"
              >
                <ChevronUp size={16} strokeWidth={2.5} />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (mobileSheetState === 'full') setMobileSheetState('half');
                  else if (mobileSheetState === 'half') setMobileSheetState('peek');
                }}
                disabled={mobileSheetState === 'peek'}
                className="w-7 h-7 rounded-md flex items-center justify-center text-slate-600 disabled:opacity-30 transition cursor-pointer"
              >
                <ChevronDown size={16} strokeWidth={2.5} />
              </button>
            </div>

            <div className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200/80 text-[#005689] font-black text-xs shadow-2xs">
              {displayedListItems.length} {activeTab === 'jobs' ? 'Jobs' : 'Faculty'}
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                if (activeTab === 'jobs' && onPostJob) onPostJob();
                else if (activeTab === 'faculty' && onListTeacher) onListTeacher();
              }}
              className="w-7.5 h-7.5 rounded-full bg-[#006FCC] hover:bg-[#005399] text-white flex items-center justify-center shadow-md active:scale-95 transition cursor-pointer"
              title={activeTab === 'jobs' ? "+ Post Vacancy" : "+ List as Faculty"}
            >
              <Plus size={15} strokeWidth={2.8} />
            </button>
          </div>
        </div>

        {/* Mobile Scrollable Feed */}
        {mobileSheetState !== 'peek' && (
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar bg-slate-50/50">
            {displayedListItems.map((item: any, idx: number) => renderMapCard(item, idx))}
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
