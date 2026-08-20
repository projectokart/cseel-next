import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/user/', '/student/', '/teacher/', '/org/', '/my-project/'],
      },
    ],
    sitemap: 'https://www.cseel.org/sitemap.xml',
    host: 'https://www.cseel.org',
  };
}
