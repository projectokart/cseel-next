import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/user/',
          '/student/',
          '/teacher/',
          '/org/',
          '/my-project/',
          '/admin/',
          '/system-admin-portal/',
          '/api/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/user/',
          '/student/',
          '/teacher/',
          '/org/',
          '/my-project/',
          '/admin/',
          '/system-admin-portal/',
          '/api/',
        ],
      },
    ],
    sitemap: 'https://www.cseel.org/sitemap.xml',
    host: 'https://www.cseel.org',
  };
}
