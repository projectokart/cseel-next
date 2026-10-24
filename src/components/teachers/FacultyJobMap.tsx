'use client';

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FacultyJobItem, VerifiedFacultyItem, getJobFacilityTags, getJobRequirementTags, getMinExperience } from '@/data/facultyJobsData';
import {
  ExternalLink, MapPin, Share2, Navigation, Crosshair, ChevronLeft, ChevronRight,
  X, Briefcase, IndianRupee, ShieldCheck, Mail, Sliders, CheckCheck, Compass, Sparkles,
  Plus, Minus, Maximize2, List, Columns2, ChevronUp, ChevronDown, Bookmark, CheckCircle2, Globe
} from 'lucide-react';
import Link from 'next/link';
import { formatStructuredAddress, formatCleanSalary, getSourceDisplayName, getSourceBadgeColor, getGoogleMapsSearchUrl } from '@/lib/jobCardUtils';

// Helper to format ultra-compact salary for 2-line map badges
function getBadgeSalaryShort(raw?: string | null): string {
  if (!raw || raw === '---' || raw.toLowerCase().includes('not disclosed')) {
    return '₹ Norms';
  }
  const s = raw.trim();
  const mMatch = s.match(/(\d+)\s*k?\s*[-–—to]*\s*(\d*)\s*k?\s*\/\s*mo/i);
  if (mMatch) {
    if (mMatch[2] && mMatch[1] !== mMatch[2]) return `₹${mMatch[1]}-${mMatch[2]}k/mo`;
    return `₹${mMatch[1]}k/mo`;
  }
  const lMatch = s.match(/([\d\.]+)\s*[-–—to]*\s*([\d\.]*)\s*(?:lpa|lakhs?|lacs?)/i);
  if (lMatch) {
    if (lMatch[2] && lMatch[1] !== lMatch[2]) return `₹${lMatch[1]}-${lMatch[2]} LPA`;
    return `₹${lMatch[1]} LPA`;
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
  const [activeOpportunityIndex, setActiveOpportunityIndex] = useState<number | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  // Mobile sheet drawer state: 'peek' (58px) | 'half' (50vh) | 'full' (86vh)
  const [mobileSheetState, setMobileSheetState] = useState<'peek' | 'half' | 'full'>('peek');

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
        autoPan: true
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

  // Dynamic offset calculation based on mobile sheet state & screen size (School directory style)
  const getOffsetLatLng = useCallback((lat: number, lng: number, zoom?: number) => {
    if (!mapInstanceRef.current || !mapContainerRef.current) return [lat, lng] as [number, number];

    const currentZoom = zoom ?? mapInstanceRef.current.getZoom();
    const containerHeight = mapContainerRef.current.clientHeight;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    let offsetY = 0;

    if (isMobile) {
      if (mobileSheetState === 'half') {
        // Visible upper half is 0 to 50vh (middle is 25vh).
        // Screen center is at 50vh. Distance from 50vh to 28.5vh is ~21.5% of container height.
        offsetY = Math.round(containerHeight * 0.215);
      } else if (mobileSheetState === 'full') {
        offsetY = Math.round(containerHeight * 0.36);
      } else {
        // 'peek' mode (58px bottom sheet, ~60px floating top bar)
        offsetY = 12;
      }
    }

    // Convert target lat/lng to container pixel point at current zoom
    const targetPoint = mapInstanceRef.current.project([lat, lng], currentZoom);
    // Applying offset: shifting center down (targetPoint.y + offsetY) so marker appears higher up in visible area!
    const newCenterPoint = L.point(targetPoint.x, targetPoint.y + offsetY);
    // Convert back to LatLng
    const newCenterLatLng = mapInstanceRef.current.unproject(newCenterPoint, currentZoom);

    return [newCenterLatLng.lat, newCenterLatLng.lng] as [number, number];
  }, [mobileSheetState]);

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

  return (
    <div className={`relative w-full h-full min-h-0 overflow-hidden bg-slate-100 flex flex-col select-none ${className}`}>
      {/* Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-0 flex-1 min-h-0" />

      {/* ── Top Bar Mode Toggle: Points vs Badges (Floating on map) ── */}
      <div className="absolute top-3 left-3 z-10 hidden sm:flex items-center bg-white/95 backdrop-blur-md rounded-xl border border-slate-200 p-0.5 shadow-md">
        <button
          type="button"
          onClick={() => setDisplayMode('points')}
          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            displayMode === 'points'
              ? 'bg-[#ef4444] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          title="Compact red dot view (prevents map clutter)"
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
          title="Detailed badge cards"
        >
          <span>🏷️</span>
          <span>Badges</span>
        </button>
      </div>

      {/* ── Right-Side Floating Map Controls & Vertical Distance Range Bar (School Directory Style) ── */}
      <div className="absolute top-20 sm:top-24 right-2.5 sm:right-3 md:top-auto md:bottom-6 md:right-4 z-10 flex flex-col items-center gap-2 select-none">
        {/* Zoom & GPS Stack */}
        <div className="flex flex-col shadow-[0_2px_8px_rgba(60,64,67,0.25)] rounded-2xl overflow-hidden bg-white/95 backdrop-blur-md border border-[#dadce0]">
          <button
            type="button"
            onClick={handleZoomIn}
            className="w-9 h-9 sm:w-10 sm:h-10 hover:bg-[#f8f9fa] text-[#3c4043] flex items-center justify-center border-b border-[#dadce0] transition-colors active:bg-slate-100 cursor-pointer"
            title="Zoom In"
            aria-label="Zoom In"
          >
            <Plus size={16} />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="w-9 h-9 sm:w-10 sm:h-10 hover:bg-[#f8f9fa] text-[#3c4043] flex items-center justify-center transition-colors active:bg-slate-100 cursor-pointer"
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <Minus size={16} />
          </button>
          <button
            type="button"
            onClick={fitToCurrentRadius}
            className="w-9 h-9 sm:w-10 sm:h-10 hover:bg-[#f8f9fa] text-[#5f6368] hover:text-[#006FCC] flex items-center justify-center border-t border-[#dadce0] transition-colors active:bg-slate-100 cursor-pointer"
            title="Fit View to Search Radius Area"
            aria-label="Fit View"
          >
            <Maximize2 size={15} />
          </button>
          <button
            type="button"
            onClick={handleLocateMe}
            disabled={isLocating}
            className="w-9 h-9 sm:w-10 sm:h-10 hover:bg-[#f8f9fa] text-[#006FCC] flex items-center justify-center border-t border-[#dadce0] transition-colors active:bg-slate-100 cursor-pointer disabled:opacity-60"
            title="Locate Current Position"
            aria-label="My Location"
          >
            <Crosshair size={16} className={isLocating ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Vertical Distance Range Bar (0 to 200 km) */}
        <div className="flex flex-col items-center bg-white/95 backdrop-blur-md border border-[#dadce0] rounded-2xl py-2 px-1 shadow-[0_2px_8px_rgba(60,64,67,0.25)]">
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

          {/* Compass icon at bottom */}
          <Compass className="w-3.5 h-3.5 text-slate-400 mt-1.5" />
        </div>
      </div>

      {/* ── Active Opportunity Detail Card for Desktop ── */}
      {activeOpportunityIndex !== null && (activeJob || activeFaculty) && (
        <div className="hidden md:block absolute bottom-6 left-6 z-20 w-88 bg-white/98 backdrop-blur-md rounded-2xl border border-slate-200 p-4 shadow-xl space-y-2.5">
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border truncate ${
              activeJob
                ? getSourceBadgeColor(activeJob.source)
                : 'bg-[#EDF5FA] text-[#005689] border-[#005689]/20'
            }`}>
              {activeJob ? getSourceDisplayName(activeJob.source) : `${activeFaculty?.designation} · ${activeFaculty?.subject}`}
            </span>
            <button
              type="button"
              onClick={() => setActiveOpportunityIndex(null)}
              className="w-6 h-6 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition cursor-pointer"
            >
              <X size={13} />
            </button>
          </div>

          {activeJob && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-[#003c6e] line-clamp-1">{activeJob.jobPostName}</h4>
              <div className="text-[11px] font-medium text-slate-700 truncate">{activeJob.organisationName}</div>
              <div className="text-[10.5px] text-slate-500 flex items-center gap-1 min-w-0">
                <MapPin size={11} className="text-amber-600 shrink-0" />
                <span className="truncate">{formatStructuredAddress(activeJob)}</span>
              </div>
              <div className="text-xs font-bold text-emerald-700 pt-0.5">{formatCleanSalary(activeJob.salary, true)}</div>
              <div className="flex items-center gap-2 pt-1">
                <a
                  href={activeJob.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-1.5 px-3 bg-[#006FCC] hover:bg-[#005399] text-white rounded-xl text-[11px] font-bold text-center transition flex items-center justify-center gap-1"
                >
                  <span>Apply</span>
                  <ExternalLink size={11} />
                </a>
                <Link
                  href={`/edu-network/teachers/job/${activeJob.id}`}
                  className="py-1.5 px-3 bg-[#EDF5FA] hover:bg-[#DDF0FC] text-[#006FCC] rounded-xl text-[11px] font-bold text-center border border-[#006FCC]/30 transition"
                >
                  Details
                </Link>
              </div>
            </div>
          )}

          {activeFaculty && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <img src={activeFaculty.avatar} alt={activeFaculty.name} className="w-8 h-8 rounded-lg object-cover" />
                <div>
                  <h4 className="text-xs font-bold text-[#003c6e]">
                    <Link href={`/edu-network/teachers/${activeFaculty.id}`} className="hover:underline">
                      {activeFaculty.name}
                    </Link>
                  </h4>
                  <p className="text-[10px] text-slate-500">{activeFaculty.currentInstitute}</p>
                </div>
              </div>
              <div className="text-[10.5px] text-slate-500">{activeFaculty.city} • {activeFaculty.experienceYears}+ Yrs Exp</div>
              <div className="text-xs font-bold text-emerald-700">Exp: {activeFaculty.expectedSalary}</div>
              <div className="flex items-center gap-1.5 pt-1">
                <Link
                  href={`/edu-network/teachers/${activeFaculty.id}`}
                  className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-[11px] font-bold text-center transition flex items-center justify-center gap-1"
                >
                  <span>View Profile</span>
                </Link>
                <button
                  type="button"
                  onClick={() => onOpenConnect && onOpenConnect(activeFaculty)}
                  className="flex-1 py-1.5 px-2 bg-[#006FCC] hover:bg-[#005399] text-white rounded-xl text-[11px] font-bold text-center transition flex items-center justify-center gap-1"
                >
                  <Mail size={11} />
                  <span>Connect</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── MOBILE BOTTOM DRAWER / SHEET (Schools Directory Style) ─── */}
      <div
        style={isDraggingSheet ? {
          transform: `translateY(${Math.max(Math.min(dragDeltaY, 200), -200)}px)`,
          transition: 'none'
        } : undefined}
        className={`md:hidden absolute inset-x-0 bottom-0 z-30 bg-white/95 backdrop-blur-xl border-t border-gray-200/90 shadow-[0_-8px_30px_rgba(0,0,0,0.18)] flex flex-col transition-all duration-300 ease-in-out ${
          mobileSheetState === 'peek'
            ? 'h-[58px]'
            : mobileSheetState === 'half'
            ? 'h-[50vh]'
            : 'h-[86vh]'
        }`}
      >
        {/* Visual drag pill handle with interactive Touch & Pointer drag gestures */}
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

        {/* Header Strip: Up/Down arrow + Toggle Points/Badges + Total count number + Plus button */}
        <div className="w-full px-3 py-1.5 flex items-center justify-between gap-2 border-b border-gray-100 shrink-0 bg-white/95 backdrop-blur-xs">
          {/* Left: Up/Down Drawer Resize Arrows + Points/Badges Switch + Count Number */}
          <div className="flex items-center gap-2">
            {/* Up/Down Drawer Resize Control */}
            <div className="flex items-center bg-gray-100 p-0.5 rounded-lg border border-slate-200/80 shadow-2xs">
              <button
                type="button"
                onClick={() => {
                  if (mobileSheetState === 'peek') setMobileSheetState('half');
                  else if (mobileSheetState === 'half') setMobileSheetState('full');
                }}
                disabled={mobileSheetState === 'full'}
                className="w-7 h-7 rounded-md flex items-center justify-center text-slate-600 hover:text-blue-600 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                title="Expand list drawer (Up)"
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
                className="w-7 h-7 rounded-md flex items-center justify-center text-slate-600 hover:text-blue-600 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                title="Collapse list drawer (Down)"
              >
                <ChevronDown size={16} strokeWidth={2.5} />
              </button>
            </div>

            {/* Points vs Badges Toggle Pill */}
            <div className="flex items-center bg-gray-100 p-0.5 rounded-lg border border-slate-200/80 shadow-2xs text-xs font-bold">
              <button
                type="button"
                onClick={() => setDisplayMode('points')}
                className={`px-2 py-1 rounded-md transition flex items-center gap-1 cursor-pointer text-[11px] ${
                  displayMode === 'points'
                    ? 'bg-[#ef4444] text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Point view (compact dots)"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                <span>Points</span>
              </button>
              <button
                type="button"
                onClick={() => setDisplayMode('badges')}
                className={`px-2 py-1 rounded-md transition flex items-center gap-1 cursor-pointer text-[11px] ${
                  displayMode === 'badges'
                    ? 'bg-[#005689] text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Badge view (small labels)"
              >
                <span>Badges</span>
              </button>
            </div>

            {/* Total Vacancies / Faculty Just Number */}
            <div
              className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200/80 text-[#005689] font-black text-xs shadow-2xs"
              title={`${totalJobsCount || filteredItems.length} total vacancies`}
            >
              {totalJobsCount || filteredItems.length}
            </div>
          </div>

          {/* Right: Circular Blue Action Button (+) */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => {
                if (activeTab === 'jobs' && onPostJob) onPostJob();
                else if (activeTab === 'faculty' && onListTeacher) onListTeacher();
              }}
              className="w-8 h-8 rounded-full bg-[#006FCC] hover:bg-[#005399] text-white flex items-center justify-center shadow-md active:scale-95 transition cursor-pointer"
              title={activeTab === 'jobs' ? "+ Post Vacancy" : "+ List as Faculty"}
            >
              <Plus size={16} strokeWidth={2.8} />
            </button>
          </div>
        </div>

        {/* Drawer Scrollable Feed (Shown in Half & Full mode) */}
        {mobileSheetState !== 'peek' && (
          <>
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar bg-slate-50/50">
            {filteredItems.map((item: any, idx: number) => {
              if (activeTab === 'jobs') {
                const job = item as FacultyJobItem;
                const isSaved = savedJobIds.includes(job.id);
                const isSelected = activeOpportunityIndex === idx;
                const structuredAddress = formatStructuredAddress(job);
                const sourceDisplayName = getSourceDisplayName(job.source);
                const sourceBadgeColor = getSourceBadgeColor(job.source);
                const cardTags = [job.designation, job.subject, job.board, job.roleType].filter(Boolean);
                const mapLink = job.mapUrl || (job.coordinates?.lat && job.coordinates?.lng ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(job.organisationName + ', ' + structuredAddress)}` : null);
                const websiteLink = job.websiteUrl || job.website;

                return (
                  <div
                    key={job.id}
                    onClick={() => handleSelectCard(idx)}
                    className={`p-3.5 bg-white border rounded-2xl transition-all shadow-2xs space-y-2.5 cursor-pointer ${
                      isSelected ? 'border-[#006FCC] ring-1 ring-[#006FCC]/40 bg-blue-50/20' : 'border-[#dadce0] hover:border-[#006FCC]'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-xl border border-slate-200 bg-white p-1 shrink-0 flex items-center justify-center overflow-hidden shadow-2xs">
                        <img
                          src={job.organisationLogo || "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=80&auto=format&fit=crop&q=80"}
                          alt={job.organisationName}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="min-w-0 flex-1 space-y-1">
                        <h4 className="font-['Montserrat',sans-serif] font-bold text-[14px] text-slate-900 hover:text-[#0A66C2] line-clamp-1 block">
                          {job.jobPostName}
                        </h4>
                        
                        {/* School Name + Very small source tag */}
                        <div className="flex items-center gap-1.5 flex-wrap text-xs text-slate-700">
                          <span className="font-semibold text-slate-800 truncate" title={job.organisationName}>
                            {job.organisationName}
                          </span>
                          <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${sourceBadgeColor}`}>
                            {sourceDisplayName}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Parameters with Icons & Vertical Lines */}
                    <div className="flex items-center gap-2 text-slate-600 text-[11.5px] font-medium flex-wrap pt-0.5">
                      <div className="flex items-center gap-1 shrink-0">
                        <Briefcase size={12} className="text-slate-400 shrink-0" />
                        <span>{job.minExperience ? `${job.minExperience}` : '0-3 Yrs'}</span>
                      </div>
                      <span className="text-slate-300">|</span>
                      <div className="flex items-center gap-1 shrink-0">
                        <IndianRupee size={11} className="text-slate-400 shrink-0" />
                        <span className={job.salary && job.salary !== '---' && job.salary !== 'Not Disclosed' ? 'font-semibold text-slate-800' : 'text-slate-400'}>
                          {formatCleanSalary(job.salary, false)}
                        </span>
                      </div>
                      <span className="text-slate-300">|</span>
                      <div className="flex items-center gap-1 min-w-0 flex-1 truncate">
                        <MapPin size={12} className="text-slate-400 shrink-0" />
                        <span className="truncate" title={structuredAddress}>{structuredAddress}</span>
                      </div>
                    </div>

                    {/* Short Description */}
                    {job.shortDescription && (
                      <div className="flex items-start gap-1.5 text-slate-500 text-[11px] leading-snug line-clamp-1">
                        <span className="truncate">{job.shortDescription}</span>
                      </div>
                    )}

                    {/* Dot-separated clean tags */}
                    {cardTags.length > 0 && (
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium flex-wrap">
                        {cardTags.map((tag, tIdx, arr) => (
                          <React.Fragment key={tIdx}>
                            <span>{tag}</span>
                            {tIdx < arr.length - 1 && <span className="text-slate-300">•</span>}
                          </React.Fragment>
                        ))}
                      </div>
                    )}

                    {/* Action Buttons Row: Like, Share, Map, Website, Details, Apply (NO description) */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* Bookmark */}
                        <button
                          type="button"
                          onClick={() => toggleSaveJob && toggleSaveJob(job.id)}
                          className={`h-7.5 w-7.5 rounded-lg border flex items-center justify-center transition cursor-pointer ${
                            isSaved ? 'bg-[#EDF5FA] text-[#006FCC] border-[#006FCC]/40' : 'bg-[#F7F8F8] text-slate-600 border-[#E8E9E9]'
                          }`}
                          title="Like / Save"
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-[#006FCC]' : ''}`} />
                        </button>
                        {/* Share Button */}
                        <button
                          type="button"
                          onClick={() => onCopyJobUrl && onCopyJobUrl(job)}
                          className="h-7.5 w-7.5 rounded-lg border border-[#E8E9E9] bg-[#F7F8F8] text-slate-600 hover:text-[#006FCC] flex items-center justify-center transition cursor-pointer"
                          title="Share"
                        >
                          {copiedJobId === job.id ? <CheckCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                        </button>
                        {/* Map Location */}
                        {mapLink && (
                          <a
                            href={mapLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-7.5 w-7.5 rounded-lg border border-[#E8E9E9] bg-[#F7F8F8] hover:bg-amber-50 text-slate-600 hover:text-amber-600 flex items-center justify-center transition cursor-pointer"
                            title="View Map Location"
                            aria-label="View Map Location"
                          >
                            <MapPin size={12} className="text-amber-600" />
                          </a>
                        )}
                        {/* School Website */}
                        {websiteLink && (
                          <a
                            href={websiteLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-7.5 w-7.5 rounded-lg border border-[#E8E9E9] bg-[#F7F8F8] hover:bg-[#EDF5FA] text-slate-600 hover:text-[#006FCC] flex items-center justify-center transition cursor-pointer"
                            title="Visit School Website"
                            aria-label="Visit School Website"
                          >
                            <Globe size={12} className="text-[#006FCC]" />
                          </a>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/edu-network/teachers/job/${job.id}`}
                          className="h-7.5 px-3 rounded-lg border border-slate-200 bg-[#F7F8F8] text-[#003C6E] text-[11px] font-bold flex items-center justify-center"
                        >
                          Details
                        </Link>
                        <a
                          href={job.originalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-7.5 px-3.5 rounded-lg bg-[#006FCC] text-white text-[11px] font-bold flex items-center justify-center gap-1"
                        >
                          <span>Apply</span>
                          <ExternalLink size={10} />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              } else {
                const fac = item as VerifiedFacultyItem;
                const isSelected = activeOpportunityIndex === idx;

                return (
                  <div
                    key={fac.id}
                    onClick={() => handleSelectCard(idx)}
                    className={`p-3 bg-white border rounded-xl transition-all shadow-2xs space-y-2 cursor-pointer ${
                      isSelected ? 'border-[#006FCC] ring-1 ring-[#006FCC]/40 bg-blue-50/20' : 'border-[#dadce0] hover:border-[#006FCC]'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <img src={fac.avatar} alt={fac.name} className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0 shadow-2xs" />
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <h4>
                          <Link
                            href={`/edu-network/teachers/${fac.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="font-bold text-[13.5px] text-[#0A66C2] hover:underline truncate block"
                          >
                            {fac.name}
                          </Link>
                        </h4>
                        <div className="text-[12px] font-medium text-slate-800 truncate">{fac.currentInstitute}</div>
                        <div className="text-[11px] text-slate-500 truncate">{fac.city} • {fac.qualification}</div>
                        <div className="flex items-center gap-2 pt-0.5">
                          <span className="font-bold text-emerald-600 text-[12px]">
                            Exp: {fac.expectedSalary}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-[11px] font-semibold text-[#006FCC]">{fac.experienceYears}+ Yrs</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                      <span className="text-[10.5px] font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 size={12} />
                        <span>Verified</span>
                      </span>
                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/edu-network/teachers/${fac.id}`}
                          className="h-7.5 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold flex items-center justify-center transition"
                        >
                          Profile
                        </Link>
                        <button
                          type="button"
                          onClick={() => onOpenConnect && onOpenConnect(fac)}
                          className="h-7.5 px-3 rounded-lg bg-[#006FCC] hover:bg-[#005399] text-white text-[11px] font-bold flex items-center gap-1 transition"
                        >
                          <Mail size={11} />
                          <span>Connect</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }
            })}
          </div>
          {totalPages > 1 && onPageChange && (
            <div className="sticky bottom-0 bg-white/95 backdrop-blur-xs p-2.5 border-t border-slate-200/90 flex items-center justify-between gap-2 shadow-xs z-10 shrink-0">
              <button
                type="button"
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage <= 1}
                className="h-7.5 px-3 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft size={13} />
                <span>Prev</span>
              </button>
              <span className="text-[11px] font-bold text-slate-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage >= totalPages}
                className="h-7.5 px-3 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center gap-1 cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight size={13} />
              </button>
            </div>
          )}
          </>
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
