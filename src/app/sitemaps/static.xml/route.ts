import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 86400;

export async function GET() {
  const baseUrl = 'https://www.cseel.org';
  const today = new Date().toISOString().split('T')[0];

  const staticRoutes = [
    { url: '', priority: '1.0', changefreq: 'daily' },
    { url: '/edu-network/teachers', priority: '1.0', changefreq: 'hourly' },
    { url: '/schools', priority: '0.95', changefreq: 'daily' },
    { url: '/school-finder', priority: '0.9', changefreq: 'weekly' },
    { url: '/materials', priority: '0.95', changefreq: 'daily' },
    { url: '/makerspace', priority: '0.9', changefreq: 'weekly' },
    { url: '/domain/science', priority: '0.9', changefreq: 'weekly' },
    { url: '/domain/engineering', priority: '0.9', changefreq: 'weekly' },
    { url: '/domain/art', priority: '0.9', changefreq: 'weekly' },
    { url: '/composite-lab', priority: '0.9', changefreq: 'weekly' },
    { url: '/steam-lab', priority: '0.9', changefreq: 'weekly' },
    { url: '/simulations', priority: '0.85', changefreq: 'weekly' },
    { url: '/hands-on-experiments', priority: '0.85', changefreq: 'weekly' },
    { url: '/projects', priority: '0.85', changefreq: 'weekly' },
    { url: '/blog', priority: '0.9', changefreq: 'daily' },
    { url: '/info/jigyasu-scam-review-truth', priority: '0.98', changefreq: 'daily' },
    { url: '/info/companies', priority: '0.95', changefreq: 'weekly' },
    { url: '/info/companies/steamrobo', priority: '0.95', changefreq: 'weekly' },
    { url: '/info/companies/avishkaar', priority: '0.9', changefreq: 'weekly' },
    { url: '/info/companies/tinkerly', priority: '0.9', changefreq: 'weekly' },
    { url: '/info/companies/robokart', priority: '0.9', changefreq: 'weekly' },
    { url: '/why-cseel', priority: '0.8', changefreq: 'monthly' },
    { url: '/about', priority: '0.8', changefreq: 'monthly' },
    { url: '/team', priority: '0.8', changefreq: 'monthly' },
    { url: '/our-story', priority: '0.8', changefreq: 'monthly' },
    { url: '/teacher-training', priority: '0.85', changefreq: 'weekly' },
    { url: '/workshops', priority: '0.8', changefreq: 'weekly' },
    { url: '/seminars', priority: '0.8', changefreq: 'weekly' },
    { url: '/events/upcoming', priority: '0.8', changefreq: 'weekly' },
    { url: '/careers', priority: '0.8', changefreq: 'weekly' },
    { url: '/compare-plans', priority: '0.75', changefreq: 'monthly' },
    { url: '/demo', priority: '0.75', changefreq: 'monthly' },
    { url: '/contact-us', priority: '0.7', changefreq: 'monthly' },
    { url: '/terms', priority: '0.5', changefreq: 'monthly' },
    { url: '/privacy', priority: '0.5', changefreq: 'monthly' },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticRoutes
  .map(
    (r) => `  <url>
    <loc>${baseUrl}${r.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
  )
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
