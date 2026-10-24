import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const revalidate = 86400; // 24 hours

function slugify(text: string): string {
  return String(text || '')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[-\s]+/g, '-')
    .trim();
}

export async function GET(
  request: Request,
  { params }: { params: { segment: string } }
) {
  const { segment } = params;
  const match = segment.match(/^schools-(\d+)\.xml$/i);

  if (!match) {
    return new NextResponse('Sitemap segment not found', { status: 404 });
  }

  const partNum = parseInt(match[1], 10);
  if (partNum < 1 || partNum > 10) {
    return new NextResponse('Invalid sitemap part number', { status: 404 });
  }

  const CHUNK_SIZE = 5000;
  const startIdx = (partNum - 1) * CHUNK_SIZE;
  const endIdx = startIdx + CHUNK_SIZE;

  let allSchools: any[] = [];
  try {
    const dbPath = path.join(process.cwd(), 'src', 'data', 'schools_database.json');
    if (fs.existsSync(dbPath)) {
      allSchools = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    }
  } catch (err) {
    console.error('Error reading schools database for sitemap:', err);
    return new NextResponse('Internal error loading school database', { status: 500 });
  }

  const chunk = allSchools.slice(startIdx, endIdx);
  if (chunk.length === 0) {
    return new NextResponse('Empty sitemap segment', { status: 404 });
  }

  const baseUrl = 'https://www.cseel.org';
  const today = new Date().toISOString().split('T')[0];

  const urls = chunk.map((s) => {
    const stateSlug = slugify(s.state_name || 'india') || 'india';
    const distSlug = slugify(s.district_name || 'school') || 'district';
    const schoolSlug = s.school_slug || `${slugify(s.school_name)}-${s.affiliation_number || s.udise_code}`;
    const loc = `${baseUrl}/school/${stateSlug}/${distSlug}/campus/${encodeURIComponent(schoolSlug)}`;

    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
    },
  });
}
