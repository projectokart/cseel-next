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

interface FacultyJobMapProps {
  activeTab: 'jobs' | 'faculty';
  jobs: FacultyJobItem[];
  faculty: VerifiedFacultyItem[];
  selectedCity?: string;
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
        const angle = (offsetIndex * (2 * Math.PI)) / 6;
        const radius = 0.02 * offsetIndex;
        lat += radius * Math.cos(angle);
        lng += radius * Math.sin(angle);
      }

      bounds.extend([lat, lng]);
      const isSelected = activeOpportunityIndex === index;

      let icon: L.DivIcon;

      if (displayMode === 'points') {
        // MODE 1: RED DOT POINT VIEW (Minimal, prevents map clutter)
        const dotHtml = `
          <div style="position: relative; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">
            <div style="
              width: ${isSelected ? '20px' : '13px'};
              height: ${isSelected ? '20px' : '13px'};
              background: ${isSelected ? '#dc2626' : '#ef4444'};
              border: ${isSelected ? '3px solid #ffffff' : '2px solid #ffffff'};
              border-radius: 9999px;
              box-shadow: ${isSelected ? '0 0 0 5px rgba(220,38,38,0.35), 0 3px 10px rgba(0,0,0,0.3)' : '0 2px 6px rgba(239,68,68,0.45), 0 1px 3px rgba(0,0,0,0.2)'};
            "></div>
          </div>
        `;

        icon = L.divIcon({
          className: `map-dot-${item.id}`,
          html: dotHtml,
          iconSize: isSelected ? [24, 24] : [16, 16],
          iconAnchor: isSelected ? [12, 12] : [8, 8],
        });
      } else {
        // MODE 2: BADGE VIEW (Rich designation + subject pill)
        const label = activeTab === 'jobs' ? (item.designation || 'Job') : item.name.split(' ')[0];
        const sub = activeTab === 'jobs' ? item.subject.split(' ')[0] : item.subject;

        const pinHtml = `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.08)'" onmouseout="this.style.transform='scale(1)'">
            <div style="background: ${isSelected ? '#003c6e' : '#005689'}; color: #ffffff; padding: 3px 8px; border-radius: 9999px; font-size: 11px; font-weight: 800; border: 2px solid #ffffff; box-shadow: 0 4px 12px rgba(0, 30, 60, 0.28); display: flex; align-items: center; gap: 4px; white-space: nowrap;">
              <span>${label}</span>
              <span style="background: rgba(255,255,255,0.25); padding: 1px 4px; border-radius: 4px; font-size: 9px; font-weight: 700;">${sub}</span>
            </div>
            <div style="width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 6px solid ${isSelected ? '#003c6e' : '#005689'}; margin-top: -1px;"></div>
          </div>
        `;

        icon = L.divIcon({
          className: `map-marker-${item.id}`,
          html: pinHtml,
          iconSize: [84, 32],
          iconAnchor: [42, 32],
        });
      }

      const marker = L.marker([lat, lng], { icon });
      marker.on('click', () => {
        handleSelectCard(index);
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
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EDF5FA] text-[#005689] border border-[#005689]/20 truncate">
              {activeJob ? `${activeJob.designation} · ${activeJob.subject}` : `${activeFaculty?.designation} · ${activeFaculty?.subject}`}
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
              <div className="text-[11px] font-medium text-slate-700">{activeJob.organisationName}</div>
              <div className="text-[10.5px] text-slate-500 flex items-center gap-1">
                <MapPin size={11} className="text-amber-600" />
                <span>{[activeJob.state, activeJob.city, activeJob.address].filter(Boolean).join(', ')}</span>
              </div>
              <div className="text-xs font-bold text-emerald-700 pt-0.5">{activeJob.salary}</div>
              <div className="flex items-center gap-2 pt-1">
                <a
                  href={activeJob.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-1.5 px-3 bg-[#006FCC] hover:bg-[#005399] text-white rounded-xl text-[11px] font-bold text-center transition flex items-center justify-center gap-1"
                >
                  <span>Apply on {activeJob.source}</span>
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

        {/* Header Strip with Segmented Tabs & Action Button */}
        <div className="w-full px-3 py-1 flex items-center justify-between gap-2 border-b border-gray-100 shrink-0 bg-white/90">
          {/* Segmented View Switcher: Map (0/Peek), Split (Half), Vacancies/Faculty (Full) */}
          <div className="flex items-center bg-gray-100 p-0.5 rounded-lg text-xs font-bold shadow-2xs">
            <button
              type="button"
              onClick={() => setMobileSheetState('peek')}
              className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 cursor-pointer ${
                mobileSheetState === 'peek'
                  ? 'bg-white text-blue-600 shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Map View (Collapse Sheet)"
            >
              <MapPin size={12} className="text-amber-600" />
              <span>Map</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileSheetState('half')}
              className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 cursor-pointer ${
                mobileSheetState === 'half'
                  ? 'bg-white text-blue-600 shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Split View (Half Screen)"
            >
              <Columns2 size={12} className="rotate-90 text-blue-600" />
              <span>Split</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileSheetState('full')}
              className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 cursor-pointer ${
                mobileSheetState === 'full'
                  ? 'bg-white text-blue-600 shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Full List View"
            >
              <List size={12} className="text-emerald-600" />
              <span>{activeTab === 'jobs' ? `Vacancies (${filteredItems.length})` : `Faculty (${filteredItems.length})`}</span>
            </button>
          </div>

          {/* Right: Circular Blue Action Button (+) - Fits perfectly on mobile without cut-off */}
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
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar bg-slate-50/50">
            {filteredItems.map((item: any, idx: number) => {
              if (activeTab === 'jobs') {
                const job = item as FacultyJobItem;
                const isSaved = savedJobIds.includes(job.id);
                const isSelected = activeOpportunityIndex === idx;
                const fullAddress = [job.state, job.city, job.address].filter(Boolean).join(', ');
                const mapLink = job.mapUrl || (job.coordinates?.lat && job.coordinates?.lng ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(job.organisationName + ', ' + fullAddress)}` : null);
                const websiteLink = job.websiteUrl || job.website;

                return (
                  <div
                    key={job.id}
                    onClick={() => handleSelectCard(idx)}
                    className={`p-3 bg-white border rounded-xl transition-all shadow-2xs space-y-2 cursor-pointer ${
                      isSelected ? 'border-[#006FCC] ring-1 ring-[#006FCC]/40 bg-blue-50/20' : 'border-[#dadce0] hover:border-[#006FCC]'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-xl border border-slate-200 bg-white p-1 shrink-0 flex items-center justify-center overflow-hidden shadow-2xs">
                        <img
                          src={job.organisationLogo || "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=80&auto=format&fit=crop&q=80"}
                          alt={job.organisationName}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <h4 className="font-['Montserrat',sans-serif] font-bold text-[13.5px] text-[#0A66C2] hover:underline line-clamp-1 block">
                          {job.jobPostName}
                        </h4>
                        {/* Full School Name */}
                        <div className="text-[12px] font-medium text-slate-800 break-words leading-tight" title={job.organisationName}>
                          {job.organisationName}
                        </div>
                        {/* Full Address: Max 2 lines */}
                        <div className="text-[11px] text-slate-500 flex items-start gap-1 font-['Montserrat',sans-serif] leading-snug">
                          <MapPin size={11} className="text-amber-600 shrink-0 mt-0.5" />
                          <span className="line-clamp-2 break-words">{fullAddress}</span>
                        </div>

                        {/* Salary (Green) & Subject (Blue) - Clean Inline Text, NO Clunky Boxes */}
                        <div className="flex items-center gap-1.5 pt-0.5 flex-wrap">
                          <span className="font-bold text-emerald-600 text-[12px] sm:text-[12.5px]">
                            {job.salary}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="font-semibold text-[#006FCC] text-[11px] sm:text-[11.5px]">
                            {job.designation ? `${job.designation} · ` : ''}{job.subject}
                          </span>
                        </div>

                        {/* Opening Date & Due Date (ALWAYS SHOW BOTH) */}
                        <div className="text-[9.5px] text-slate-500 font-medium font-mono flex items-center gap-1.5 pt-0.5">
                          <span>Posted: {job.openingDate}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-amber-700 font-semibold">Due: {job.lastDate}</span>
                        </div>

                        {/* Tags: Light highlighter tint, NO borders, compact */}
                        <div className="flex items-center gap-1 flex-wrap pt-0.5">
                          {/* Requirement / Experience Tags */}
                          {getJobRequirementTags(job).map((req, rIdx) => (
                            <span
                              key={`req-${rIdx}`}
                              className="text-[9.5px] px-1.5 py-0.5 rounded bg-blue-50/90 text-[#005689] font-medium whitespace-nowrap"
                            >
                              {req}
                            </span>
                          ))}
                          {/* School Teacher Facilities / Allowances: Soft Purple Highlighter Tint (NO Green, NO borders) */}
                          {getJobFacilityTags(job).map((facility, fIdx) => (
                            <span
                              key={`fac-${fIdx}`}
                              className="text-[9.5px] px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 font-medium whitespace-nowrap"
                            >
                              {facility}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

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
