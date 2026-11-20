'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Crosshair, Maximize2, Navigation } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

export interface SchoolFooterMapProps {
  displayName: string;
  displayAddress: string;
  lat: number;
  lng: number;
  campusPhoto?: string;
}

export default function SchoolFooterMap({
  displayName,
  displayAddress,
  lat,
  lng,
  campusPhoto,
}: SchoolFooterMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [mapMode, setMapMode] = useState<'osm' | 'satellite' | 'google'>('osm');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const mapLat = typeof lat === 'number' && !isNaN(lat) && lat !== 0 ? lat : 28.3182;
  const mapLng = typeof lng === 'number' && !isNaN(lng) && lng !== 0 ? lng : 76.6191;

  useEffect(() => {
    let isMounted = true;
    if (typeof window === 'undefined') return;

    const initMap = async () => {
      const L = (await import('leaflet')).default;
      if (!isMounted || !mapContainerRef.current) return;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      const map = L.map(mapContainerRef.current, {
        center: [mapLat, mapLng],
        zoom: 14,
        zoomControl: false,
        scrollWheelZoom: false,
      });

      // Shift zoom +/- buttons to bottom-right and keep them compact so they never overlap satellite/mode toggles
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      const tileUrls = {
        osm: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        google: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
      };

      L.tileLayer(tileUrls[mapMode], {
        attribution: mapMode === 'osm' ? '© OSM' : mapMode === 'satellite' ? '© Esri' : '© Google',
        maxZoom: 19,
      }).addTo(map);

      const customPin = L.divIcon({
        className: 'custom-school-map-pin',
        html: `
          <div style="position:relative;display:flex;align-items:center;justify-content:center;width:36px;height:36px;">
            <div style="width:28px;height:28px;background:#006FCC;border:3px solid #ffffff;border-radius:50%;box-shadow:0 3px 10px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;color:#ffffff;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker([mapLat, mapLng], { icon: customPin }).addTo(map);
      marker.bindPopup(`
        <div style="font-family:system-ui,sans-serif;padding:3px;min-width:170px;max-width:230px;">
          ${campusPhoto ? `<img src="${campusPhoto}" alt="${displayName}" style="width:100%;height:75px;object-fit:cover;border-radius:6px;margin-bottom:6px;display:block;" />` : ''}
          <strong style="color:#003C6E;font-size:12px;display:block;line-height:1.25;margin-bottom:3px;">${displayName}</strong>
          ${displayAddress ? `<span style="color:#475569;font-size:10.5px;display:block;line-height:1.3;margin-bottom:6px;">${displayAddress}</span>` : ''}
          <a href="https://www.google.com/maps/dir/?api=1&destination=${mapLat},${mapLng}" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:4px;background:#006FCC;color:#ffffff;padding:3.5px 9px;border-radius:6px;font-size:10px;font-weight:700;text-decoration:none;">
            Get Directions →
          </a>
        </div>
      `);

      mapInstanceRef.current = map;
    };

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapLat, mapLng, mapMode, displayName, displayAddress, campusPhoto]);

  return (
    <div className="relative isolate z-0 w-full">
      <div
        className={`relative overflow-hidden border border-white/20 bg-slate-900 shadow-lg ${
          isFullscreen ? 'fixed inset-3 z-[9999] rounded-2xl' : 'h-[210px] sm:h-[235px] w-full rounded-xl isolate relative z-0'
        } [&_.leaflet-control-zoom]:!border-0 [&_.leaflet-control-zoom]:!shadow-md [&_.leaflet-control-zoom_a]:!w-6 [&_.leaflet-control-zoom_a]:!h-6 [&_.leaflet-control-zoom_a]:!leading-[24px] [&_.leaflet-control-zoom_a]:!text-xs [&_.leaflet-control-zoom_a]:!rounded-md`}
      >
        {/* Top Overlay Controls */}
        <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1 bg-slate-950/85 backdrop-blur-md p-1 rounded-lg border border-white/15 pointer-events-auto">
            {(['osm', 'satellite', 'google'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setMapMode(mode)}
                className={`px-2 py-0.5 text-[10px] font-bold rounded capitalize cursor-pointer transition ${
                  mapMode === mode ? 'bg-[#006FCC] text-white' : 'text-slate-200 hover:bg-white/10'
                }`}
              >
                {mode === 'osm' ? 'Map' : mode}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 pointer-events-auto">
            <button
              type="button"
              onClick={() => mapInstanceRef.current?.setView([mapLat, mapLng], 15)}
              title="Center on School"
              className="w-7 h-7 rounded-lg bg-slate-950/85 text-white hover:bg-[#006FCC] border border-white/15 flex items-center justify-center cursor-pointer transition"
            >
              <Crosshair className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setIsFullscreen((prev) => !prev)}
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Map'}
              className="w-7 h-7 rounded-lg bg-slate-950/85 text-white hover:bg-[#006FCC] border border-white/15 flex items-center justify-center cursor-pointer transition"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div ref={mapContainerRef} className="w-full h-full" />
      </div>
    </div>
  );
}
