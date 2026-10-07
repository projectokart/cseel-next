import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 86400; // 24 hours

export async function GET(request: Request) {
  const host = request.headers.get('host') || 'schoolsearch.cseel.org';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const baseUrl = host.includes('cseel.org') ? 'https://schoolsearch.cseel.org' : protocol + '://' + host;

  const sitemaps = [
    baseUrl + '/sitemaps-sec-98a7f/hierarchy-main.xml',
    baseUrl + '/sitemaps-sec-98a7f/hierarchy-intent.xml',
    baseUrl + '/sitemaps-sec-98a7f/part1.xml',
    baseUrl + '/sitemaps-sec-98a7f/part2.xml',
    baseUrl + '/sitemaps-sec-98a7f/part3.xml',
    baseUrl + '/sitemaps-sec-98a7f/part4.xml',
    baseUrl + '/sitemaps-sec-98a7f/part5.xml',
    baseUrl + '/sitemaps-sec-98a7f/part6.xml',
    baseUrl + '/sitemaps-sec-98a7f/part7.xml',
    baseUrl + '/sitemaps-sec-98a7f/part8.xml',
  ];

  const today = new Date().toISOString().split('T')[0];

  const xml = '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    sitemaps
      .map(
        (loc) =>
          '  <sitemap>\n' +
          '    <loc>' + loc + '</loc>\n' +
          '    <lastmod>' + today + '</lastmod>\n' +
          '  </sitemap>'
      )
      .join('\n') +
    '\n</sitemapindex>';

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400',
    },
  });
}