import { NextResponse } from 'next/server';
import { ALL_INDIA_STATES_DATA } from '@/integrations/supabase/schoolsHierarchyDb';
import { PRECOMPUTED_STATE_DISTRICTS } from '@/data/schoolsLocationHierarchyData';
import { DISTRICT_25_CATEGORIES } from '@/lib/schoolsSeoParser';

const SUPABASE_STORAGE_BASE =
  'https://ukazkxthavxphibdbspd.supabase.co/storage/v1/object/public/sitemaps';

const STORAGE_PARTS = new Set([
  'part1.xml',
  'part2.xml',
  'part3.xml',
  'part4.xml',
  'part5.xml',
  'part6.xml',
  'part7.xml',
  'part8.xml',
]);

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { part: string } }
) {
  const part = params.part;
  const today = new Date().toISOString().split('T')[0];
  const baseUrl = 'https://www.cseel.org';

  // 1. Dynamic Sitemap Part: Hierarchy Main (Country, 32 States & ~786 Districts)
  if (part === 'hierarchy-main.xml') {
    const urls: { loc: string; lastmod: string; changefreq: string; priority: string }[] = [];

    // Root India Country Directory
    urls.push({
      loc: `${baseUrl}/school/india`,
      lastmod: today,
      changefreq: 'daily',
      priority: '1.0'
    });

    // 32 States and their Districts
    for (const state of ALL_INDIA_STATES_DATA) {
      urls.push({
        loc: `${baseUrl}/school/india/${state.slug}`,
        lastmod: today,
        changefreq: 'daily',
        priority: '0.9'
      });

      const districts = PRECOMPUTED_STATE_DISTRICTS[state.slug] || [];
      for (const dist of districts) {
        urls.push({
          loc: `${baseUrl}/school/india/${state.slug}/${dist.slug}`,
          lastmod: today,
          changefreq: 'weekly',
          priority: '0.85'
        });
      }
    }

    const xml =
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
      urls
        .map(
          (u) =>
            '  <url>\n' +
            `    <loc>${u.loc}</loc>\n` +
            `    <lastmod>${u.lastmod}</lastmod>\n` +
            `    <changefreq>${u.changefreq}</changefreq>\n` +
            `    <priority>${u.priority}</priority>\n` +
            '  </url>'
        )
        .join('\n') +
      '\n</urlset>';

    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400',
      },
    });
  }

  // 2. Dynamic Sitemap Part: Hierarchy Intent (~18,000 High-Intent District Query URLs)
  if (part === 'hierarchy-intent.xml') {
    const urls: { loc: string; lastmod: string; changefreq: string; priority: string }[] = [];

    for (const state of ALL_INDIA_STATES_DATA) {
      const districts = PRECOMPUTED_STATE_DISTRICTS[state.slug] || [];
      for (const dist of districts) {
        for (const cat of DISTRICT_25_CATEGORIES) {
          const intentSlug = `${cat.prefix}-${dist.slug}`;
          urls.push({
            loc: `${baseUrl}/school/india/${state.slug}/${dist.slug}/${intentSlug}`,
            lastmod: today,
            changefreq: 'weekly',
            priority: '0.8'
          });
        }
      }
    }

    const xml =
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
      urls
        .map(
          (u) =>
            '  <url>\n' +
            `    <loc>${u.loc}</loc>\n` +
            `    <lastmod>${u.lastmod}</lastmod>\n` +
            `    <changefreq>${u.changefreq}</changefreq>\n` +
            `    <priority>${u.priority}</priority>\n` +
            '  </url>'
        )
        .join('\n') +
      '\n</urlset>';

    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400',
      },
    });
  }

  // 3. Supabase Storage Sitemaps (Part 1 - Part 8 School Profile Pages)
  if (!STORAGE_PARTS.has(part)) {
    return new NextResponse('Sitemap part not found', { status: 404 });
  }

  const supabaseUrl = SUPABASE_STORAGE_BASE + '/schoolsearch-sitemap-' + part;

  try {
    const response = await fetch(supabaseUrl, {
      next: { revalidate: 86400 },
    });

    if (!response.ok) {
      return new NextResponse('Error fetching sitemap from storage: ' + response.statusText, {
        status: response.status,
      });
    }

    const xmlText = await response.text();

    return new NextResponse(xmlText, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400',
      },
    });
  } catch (err: any) {
    return new NextResponse('Internal Server Error: ' + err.message, {
      status: 500,
    });
  }
}