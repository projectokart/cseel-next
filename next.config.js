const path = require('path');

// Strictly normalize Windows drive letter to uppercase so Webpack never generates duplicate module entries
if (process.platform === 'win32') {
  const cwd = process.cwd();
  if (cwd && cwd.length >= 2 && cwd[1] === ':') {
    const normalizedCwd = cwd[0].toUpperCase() + cwd.slice(1);
    if (cwd !== normalizedCwd) {
      try {
        process.chdir(normalizedCwd);
      } catch (e) {}
    }
  }
}

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
      script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://www.youtube.com https://s.ytimg.com https://cdn.jsdelivr.net https://static.cloudflareinsights.com https://www.clarity.ms https://*.clarity.ms https://apis.google.com https://accounts.google.com https://*.firebaseapp.com https://*.firebase.com https://*.google.com https://*.googlesyndication.com https://pagead2.googlesyndication.com https://tpc.googlesyndication.com https://*.doubleclick.net https://googleads.g.doubleclick.net https://*.adtrafficquality.google https://ep1.adtrafficquality.google https://ep2.adtrafficquality.google https://ep1.adtrafficquality.google.com https://ep2.adtrafficquality.google.com https://*.adservice.google.com https://*.googleadservices.com https://fundingchoicesmessages.google.com https://*.gstatic.com;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com;
      img-src 'self' data: blob: https: https://ukazkxthavxphibdbspd.supabase.co https://cdn.sanity.io https://images.unsplash.com https://cdn.prod.website-files.com https://www.cseel.org https://i.ytimg.com https://*.googleusercontent.com https://lh3.googleusercontent.com https://*.googlesyndication.com https://pagead2.googlesyndication.com https://*.doubleclick.net https://googleads.g.doubleclick.net;
      font-src 'self' data: https://fonts.gstatic.com;
      frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://accounts.google.com https://*.firebaseapp.com https://*.google.com https://www.google.com https://*.googlesyndication.com https://tpc.googlesyndication.com https://googleads.g.doubleclick.net https://*.doubleclick.net https://*.adtrafficquality.google https://ep1.adtrafficquality.google https://ep2.adtrafficquality.google https://ep1.adtrafficquality.google.com https://ep2.adtrafficquality.google.com https://fundingchoicesmessages.google.com;
      child-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://*.google.com https://*.googlesyndication.com https://tpc.googlesyndication.com https://googleads.g.doubleclick.net https://*.doubleclick.net https://*.adtrafficquality.google;
      connect-src 'self' https://cdn.jsdelivr.net https://raw.githubusercontent.com https://ukazkxthavxphibdbspd.supabase.co https://*.api.sanity.io https://www.google-analytics.com https://vitals.vercel-insights.com https://ipapi.co https://ipwhois.app https://*.openstreetmap.org https://*.clarity.ms https://cloudflareinsights.com https://*.cloudflareinsights.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://accounts.google.com https://*.firebaseio.com https://*.googleapis.com https://*.firebase.com https://*.google.com https://*.googlesyndication.com https://pagead2.googlesyndication.com https://tpc.googlesyndication.com https://*.doubleclick.net https://googleads.g.doubleclick.net https://*.adtrafficquality.google https://ep1.adtrafficquality.google https://ep2.adtrafficquality.google https://ep1.adtrafficquality.google.com https://ep2.adtrafficquality.google.com https://*.adservice.google.com https://*.googleadservices.com https://fundingchoicesmessages.google.com https://csi.gstatic.com https://*.gstatic.com;
    `.replace(/\s{2,}/g, ' ').trim(),
  },
];

const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.resolve(__dirname).replace(/^[a-z]:/i, m => m.toUpperCase()),
  typescript: { ignoreBuildErrors: true },
  poweredByHeader: false,
  compress: true,
  
  
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
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
      { source: '/register', destination: '/edu-network/teachers/register', permanent: false },
      { source: '/my-projects', destination: '/user/projects', permanent: true },
      { source: '/my-selections', destination: '/user/selections', permanent: true },
      { source: '/profile', destination: '/profile/setup', permanent: false },
      { source: '/settings', destination: '/user/settings', permanent: true },
      { source: '/searchschool', destination: '/school-finder', permanent: true },
      { source: '/schoolsearch', destination: '/school-finder', permanent: true },
      { source: '/school-search', destination: '/school-finder', permanent: true },
      { source: '/projectokart', destination: 'https://projectokart.com', permanent: true },
      { source: '/projectocart', destination: 'https://projectokart.com', permanent: true },
      { source: '/subject', destination: '/domain/science', permanent: false },
      { source: '/contact', destination: '/contact-us', permanent: true },
      { source: '/about-us', destination: '/about', permanent: true },
      { source: '/about-experiential-lab', destination: '/about', permanent: true },
      { source: '/match-your-syllabus', destination: '/materials', permanent: true },
      { source: '/composite-skill-lab', destination: '/composite-lab', permanent: true },
      { source: '/edu-network', destination: '/schools', permanent: true },
      { source: '/edu-network/schools', destination: '/schools', permanent: true },
      { source: '/edu-network/schools/:slug*', destination: '/schools', permanent: true },
      { source: '/edu-network/school/:slug*', destination: '/schools', permanent: true },
      { source: '/edu-network/organisation/:slug*', destination: '/schools', permanent: true },
      { source: '/edu-network/jobs', destination: '/edu-network/jobs/manage', permanent: false },
      { source: '/edu-network/teacher-jobs', destination: '/careers', permanent: true },
      { source: '/makerspace/curriculam', destination: '/makerspace/curriculum', permanent: false },
    ];
  },
  async rewrites() {
    return [
      { source: '/freelancers', destination: '/freelancers/index.html' },
      { source: '/freelancers/', destination: '/freelancers/index.html' },
      { source: '/makerspace/curriculum/grade-1', destination: '/curriculum/grade-1.html' },
      { source: '/makerspace/curriculum/grade-1/', destination: '/curriculum/grade-1.html' },
      { source: '/makerspace/curriculam/grade-1', destination: '/curriculum/grade-1.html' },
      { source: '/makerspace/curriculam/grade-1/', destination: '/curriculum/grade-1.html' },
      { source: '/makerspace/curriculum/grade-2', destination: '/curriculum/grade-2.html' },
      { source: '/makerspace/curriculum/grade-2/', destination: '/curriculum/grade-2.html' },
      { source: '/makerspace/curriculum/grade-3', destination: '/curriculum/grade-3.html' },
      { source: '/makerspace/curriculum/grade-3/', destination: '/curriculum/grade-3.html' },
      { source: '/makerspace/curriculum/grade-4', destination: '/curriculum/grade-4.html' },
      { source: '/makerspace/curriculum/grade-5', destination: '/curriculum/grade-5.html' },
      { source: '/makerspace/curriculum/grade-6', destination: '/curriculum/grade-6.html' },
      { source: '/makerspace/curriculum/grade-7', destination: '/curriculum/grade-7.html' },
      { source: '/makerspace/curriculum/grade-8', destination: '/curriculum/grade-8.html' },
    ];
  },
  async headers() {
    const isDev = process.env.NODE_ENV !== 'production';
    if (isDev) {
      return [
        {
          source: '/(.*)',
          headers: [
            ...securityHeaders,
            {
              key: 'Cache-Control',
              value: 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
            },
          ],
        },
      ];
    }
    return [
      {
        source: '/school/:path*',
        headers: [
          ...securityHeaders,
          {
            key: 'Cache-Control',
            value: 'public, max-age=604800, s-maxage=604800, stale-while-revalidate=2592000',
          },
        ],
      },
      {
        source: '/edu-network/:path*',
        headers: [
          ...securityHeaders,
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        source: '/jobs/:path*',
        headers: [
          ...securityHeaders,
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
          },
        ],
      },
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
  turbopack: {},
  webpack: (config, { webpack }) => {
    const path = require('path');
    const normalizedDirname = __dirname.replace(/^[a-z]:/i, m => m.toUpperCase());
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'lucide-react': path.resolve(normalizedDirname, 'src/lib/icons/googleMaterialIcons.tsx'),
    };
    if (process.platform === 'win32' && webpack) {
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(/^[a-z]:/i, (resource) => {
          if (resource.request && /^[a-z]:/i.test(resource.request)) {
            resource.request = resource.request[0].toUpperCase() + resource.request.slice(1);
          }
        })
      );
    }
    return config;
  },
};

module.exports = nextConfig;
