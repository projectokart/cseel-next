import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // 1 hour

export async function GET() {
  const baseUrl = 'https://www.cseel.org';
  const today = new Date().toISOString().split('T')[0];

  let jobs: any[] = [];
  try {
    const jobsPath = path.join(process.cwd(), 'src', 'data', 'aggregated_jobs.json');
    if (fs.existsSync(jobsPath)) {
      jobs = JSON.parse(fs.readFileSync(jobsPath, 'utf8'));
    }
  } catch (err) {
    console.error('Error loading jobs for sitemap:', err);
  }

  const validUrls = jobs
    .map((j) => {
      const jobId = (j.id || j.slug || j.source_id || '').trim();
      if (!jobId || jobId === 'undefined' || jobId === 'null') return null;
      const loc = `${baseUrl}/edu-network/teachers/job/${encodeURIComponent(jobId)}`;
      const lastmod = j.openingDate && /^\d{4}-\d{2}-\d{2}$/.test(j.openingDate) ? j.openingDate : today;
      return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`;
    })
    .filter(Boolean);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${validUrls.join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
