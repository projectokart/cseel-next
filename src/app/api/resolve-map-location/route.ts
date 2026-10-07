import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function extractCoordinatesFromText(text: string): { latitude: number; longitude: number } | null {
  if (!text) return null;

  // 1. Check for @lat,lng
  const atMatch = text.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (atMatch) {
    const lat = parseFloat(atMatch[1]);
    const lon = parseFloat(atMatch[2]);
    if (!isNaN(lat) && !isNaN(lon)) return { latitude: lat, longitude: lon };
  }

  // 2. Check for !3dlat!4dlng (Google Maps protobuf parameters)
  const protoMatch = text.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  if (protoMatch) {
    const lat = parseFloat(protoMatch[1]);
    const lon = parseFloat(protoMatch[2]);
    if (!isNaN(lat) && !isNaN(lon)) return { latitude: lat, longitude: lon };
  }

  // 3. Check for ?q=lat,lng or &q=lat,lng
  const qMatch = text.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (qMatch) {
    const lat = parseFloat(qMatch[1]);
    const lon = parseFloat(qMatch[2]);
    if (!isNaN(lat) && !isNaN(lon)) return { latitude: lat, longitude: lon };
  }

  // 4. Check for ll=lat,lng
  const llMatch = text.match(/[?&]ll=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (llMatch) {
    const lat = parseFloat(llMatch[1]);
    const lon = parseFloat(llMatch[2]);
    if (!isNaN(lat) && !isNaN(lon)) return { latitude: lat, longitude: lon };
  }

  // 5. Check for center=lat,lng
  const centerMatch = text.match(/[?&]center=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (centerMatch) {
    const lat = parseFloat(centerMatch[1]);
    const lon = parseFloat(centerMatch[2]);
    if (!isNaN(lat) && !isNaN(lon)) return { latitude: lat, longitude: lon };
  }

  // 6. Check for raw lat,lng string
  const rawMatch = text.trim().match(/^(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)$/);
  if (rawMatch) {
    const lat = parseFloat(rawMatch[1]);
    const lon = parseFloat(rawMatch[2]);
    if (!isNaN(lat) && !isNaN(lon) && Math.abs(lat) <= 90 && Math.abs(lon) <= 180) {
      return { latitude: lat, longitude: lon };
    }
  }

  return null;
}

async function searchNominatim(query: string): Promise<{ latitude: number; longitude: number; displayName: string } | null> {
  try {
    const encoded = encodeURIComponent(query);
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encoded}&limit=1`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'CSEEL-Platform/1.0 (info@cseel.org)'
      }
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      const item = data[0];
      const lat = parseFloat(item.lat);
      const lon = parseFloat(item.lon);
      if (!isNaN(lat) && !isNaN(lon)) {
        return { latitude: lat, longitude: lon, displayName: item.display_name };
      }
    }
    return null;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url, address, localAddress, district, state, pincode, latitude, longitude } = body;

    // 1. If explicit latitude & longitude provided
    if (latitude !== undefined && longitude !== undefined && latitude !== null && longitude !== null && latitude !== '' && longitude !== '') {
      const lat = Number(latitude);
      const lon = Number(longitude);
      if (!isNaN(lat) && !isNaN(lon)) {
        return NextResponse.json({
          success: true,
          source: 'coordinates',
          latitude: lat,
          longitude: lon,
          googleMapUrl: `https://maps.google.com/?q=${lat.toFixed(6)},${lon.toFixed(6)}`
        });
      }
    }

    // 2. If URL provided (e.g. maps.app.goo.gl or standard Google Maps link)
    if (url && typeof url === 'string' && url.trim()) {
      const trimmedUrl = url.trim();

      // Check if it already has coordinates directly in string
      const directCoords = extractCoordinatesFromText(trimmedUrl);
      if (directCoords && !trimmedUrl.includes('goo.gl') && !trimmedUrl.includes('maps.app')) {
        return NextResponse.json({
          success: true,
          source: 'url_direct',
          latitude: directCoords.latitude,
          longitude: directCoords.longitude,
          resolvedUrl: trimmedUrl,
          googleMapUrl: `https://maps.google.com/?q=${directCoords.latitude.toFixed(6)},${directCoords.longitude.toFixed(6)}`
        });
      }

      // If it's a shortened URL or needs redirect resolution
      if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
        try {
          const resp = await fetch(trimmedUrl, {
            redirect: 'follow',
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
          });
          const finalUrl = resp.url || trimmedUrl;
          const bodyText = await resp.text();

          // Try parsing coordinates from final URL
          let coords = extractCoordinatesFromText(finalUrl);

          // If not found in URL, search in body text
          if (!coords) {
            coords = extractCoordinatesFromText(bodyText);
          }

          if (coords) {
            return NextResponse.json({
              success: true,
              source: 'url_redirect',
              latitude: coords.latitude,
              longitude: coords.longitude,
              resolvedUrl: finalUrl,
              googleMapUrl: `https://maps.google.com/?q=${coords.latitude.toFixed(6)},${coords.longitude.toFixed(6)}`
            });
          }
        } catch (fetchErr: any) {
          console.error('Failed to resolve short URL:', fetchErr);
        }
      }
    }

    // 3. If Address / Village / District / State / Pincode provided for geocoding
    const candidates: string[] = [];

    if (address && typeof address === 'string' && address.trim()) {
      candidates.push(address.trim() + ', India');
    }

    const parts = [localAddress, district, state, pincode].map(s => (s || '').trim()).filter(Boolean);
    if (parts.length > 0) {
      candidates.push(parts.join(', ') + ', India');
      if (district && state) candidates.push(`${district}, ${state}, ${pincode || ''}, India`.trim());
      if (pincode) candidates.push(`${pincode}, India`);
      if (district && state) candidates.push(`${district}, ${state}, India`);
    }

    for (const q of candidates) {
      const geo = await searchNominatim(q);
      if (geo) {
        return NextResponse.json({
          success: true,
          source: 'geocoding',
          query: q,
          latitude: geo.latitude,
          longitude: geo.longitude,
          resolvedAddress: geo.displayName,
          googleMapUrl: `https://maps.google.com/?q=${geo.latitude.toFixed(6)},${geo.longitude.toFixed(6)}`
        });
      }
    }

    return NextResponse.json({
      success: false,
      error: 'Could not resolve coordinates from the provided Google Maps URL or address components. Please check the URL or enter Latitude / Longitude directly.'
    }, { status: 400 });

  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message || 'Internal server error while resolving location'
    }, { status: 500 });
  }
}
