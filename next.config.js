/** @type {import('next').NextConfig} */
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(self), interest-cohort=()',
  },
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://www.youtube.com https://s.ytimg.com https://cdn.jsdelivr.net;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      img-src 'self' data: blob: https: https://ukazkxthavxphibdbspd.supabase.co https://images.unsplash.com https://cdn.prod.website-files.com https://www.cseel.org https://i.ytimg.com;
      font-src 'self' data: https://fonts.gstatic.com;
      frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com;
      connect-src 'self' https://ukazkxthavxphibdbspd.supabase.co https://www.google-analytics.com https://vitals.vercel-insights.com;
    `.replace(/\s{2,}/g, ' ').trim(),
  },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ukazkxthavxphibdbspd.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'www.cseel.org',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.prod.website-files.com',
      },
    ],
  },
  async redirects() {
    return [
      { source: '/my-projects', destination: '/user/projects', permanent: true },
      { source: '/my-selections', destination: '/user/selections', permanent: true },
      { source: '/profile', destination: '/user/profile', permanent: true },
      { source: '/settings', destination: '/user/settings', permanent: true },
      { source: '/searchschool', destination: '/school-finder', permanent: true },
      { source: '/schoolsearch', destination: '/school-finder', permanent: true },
      { source: '/school-search', destination: '/school-finder', permanent: true },
      { source: '/projectokart', destination: 'https://projectokart.com', permanent: true },
      { source: '/projectocart', destination: 'https://projectokart.com', permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/image/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
