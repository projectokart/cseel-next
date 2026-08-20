/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
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
      {
        source: '/my-projects',
        destination: '/user/projects',
        permanent: true,
      },
      {
        source: '/my-selections',
        destination: '/user/selections',
        permanent: true,
      },
      {
        source: '/profile',
        destination: '/user/profile',
        permanent: true,
      },
      {
        source: '/settings',
        destination: '/user/settings',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png|webp|avif|ico|css|js)',
        locale: false,
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
