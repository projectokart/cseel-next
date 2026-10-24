import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const revalidate = 86400;

export async function GET() {
  const baseUrl = 'https://www.cseel.org';
  const today = new Date().toISOString().split('T')[0];

  let materials: any[] = [];
  try {
    const matPath = path.join(process.cwd(), 'src', 'data', 'physics_materials_954.json');
    if (fs.existsSync(matPath)) {
      materials = JSON.parse(fs.readFileSync(matPath, 'utf8'));
    }
  } catch (err) {
    console.error('Error loading materials for sitemap:', err);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${materials
  .map((m) => {
    const slug = m.slug || m.sku || m.id;
    const loc = `${baseUrl}/materials/${encodeURIComponent(slug)}`;
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>`;
  })
  .join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
    },
  });
}
