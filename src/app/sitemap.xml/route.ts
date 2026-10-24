import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 86400; // 24 hours

export async function GET() {
  const baseUrl = 'https://www.cseel.org';
  const today = new Date().toISOString().split('T')[0];

  const sitemaps = [
    `${baseUrl}/sitemaps/static.xml`,
    `${baseUrl}/sitemaps/jobs.xml`,
    `${baseUrl}/sitemaps/materials.xml`,
    `${baseUrl}/sitemaps/schools-1.xml`,
    `${baseUrl}/sitemaps/schools-2.xml`,
    `${baseUrl}/sitemaps/schools-3.xml`,
    `${baseUrl}/sitemaps/schools-4.xml`,
    `${baseUrl}/sitemaps/schools-5.xml`,
    `${baseUrl}/sitemaps/schools-6.xml`,
    `${baseUrl}/sitemaps/schools-7.xml`,
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps
  .map(
    (loc) => `  <sitemap>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
  </sitemap>`
  )
  .join('\n')}
</sitemapindex>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
    },
  });
}
