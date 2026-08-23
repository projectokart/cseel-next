import { NextRequest, NextResponse } from 'next/server';

/**
 * CSEEL.org — Edge Router
 *
 * Subdomain routing is ONLY active for admin & login paths:
 *   material.cseel.org/admin   → renders /admin (material dept dashboard)
 *   careers.cseel.org/admin    → renders /admin (careers dept dashboard)
 *   material.cseel.org/login   → renders /login
 *   (any other subdomain path) → 301 redirect to www.cseel.org/<equivalent-path>
 *
 * All public-facing pages use folder-based URLs on the main domain:
 *   cseel.org/materials
 *   cseel.org/hands-on-experiments
 *   cseel.org/edu-network
 *   cseel.org/careers
 *   ... etc.
 */

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico
     * - public assets with extensions
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js|woff|woff2|ttf|ico)$).*)',
  ],
};

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';
  const pathname = url.pathname;

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'cseel.org';

  // Extract subdomain
  const currentHost =
    process.env.NODE_ENV === 'production'
      ? hostname
          .replace(`.${rootDomain}`, '')
          .replace('.vercel.app', '')
          .replace(`www.${rootDomain}`, '')
          .replace(rootDomain, '')
      : hostname
          .replace('.localhost:3000', '')
          .replace('.localhost:3001', '')
          .replace('localhost:3000', '')
          .replace('localhost:3001', '');

  // Map subdomain → department admin route & main-domain public folder
  const subdomainConfig: Record<string, { adminPath: string; publicFolder: string }> = {
    material: { adminPath: '/materials/admin', publicFolder: '/materials' },
    materials: { adminPath: '/materials/admin', publicFolder: '/materials' },
    careers: { adminPath: '/careers/admin', publicFolder: '/careers' },
    network: { adminPath: '/edu-network/admin', publicFolder: '/edu-network' },
    training: { adminPath: '/teacher-training/admin', publicFolder: '/teacher-training' },
    events: { adminPath: '/events/admin', publicFolder: '/events' },
    support: { adminPath: '/get-support/admin', publicFolder: '/get-support' },
    content: { adminPath: '/admin', publicFolder: '/hands-on-experiments' },
    blog: { adminPath: '/admin', publicFolder: '/blog' },
    marketing: { adminPath: '/marketing/admin', publicFolder: '/why-cseel' },
  };

  // 1. Dedicated Admin Subdomain: admin.cseel.org
  if (currentHost === 'admin' || currentHost === 'superadmin' || currentHost === 'portal') {
    if (pathname === '/' || pathname === '' || pathname === '/login') {
      url.pathname = '/admin';
      return NextResponse.rewrite(url);
    }
    // If accessing any department admin route on admin.cseel.org (e.g. /materials/admin or /marketing/admin)
    if (pathname.includes('/admin')) {
      return NextResponse.rewrite(url);
    }
    // Default fallback on admin.cseel.org
    url.pathname = '/admin';
    return NextResponse.rewrite(url);
  }

  // 2. Dedicated Public User Login Subdomain: login.cseel.org
  if (currentHost === 'login' || currentHost === 'auth') {
    if (pathname === '/' || pathname === '' || pathname === '/login') {
      url.pathname = '/login';
      return NextResponse.rewrite(url);
    }
    return NextResponse.redirect(new URL(pathname, `https://www.${rootDomain}`), { status: 301 });
  }

  // 3. Any other old subdomains (material, careers, marketing, etc.) -> 301 redirect permanently to main domain folders
  if (currentHost && currentHost !== '' && currentHost !== 'www') {
    const legacyFolderMap: Record<string, string> = {
      material: '/materials',
      materials: '/materials',
      careers: '/careers',
      network: '/edu-network',
      training: '/teacher-training',
      events: '/events',
      support: '/get-support',
      content: '/hands-on-experiments',
      blog: '/blog',
      marketing: '/why-cseel',
    };

    const targetFolder = legacyFolderMap[currentHost] || (pathname !== '/' ? pathname : '/');
    return NextResponse.redirect(new URL(targetFolder, `https://www.${rootDomain}`), { status: 301 });
  }

  return NextResponse.next();
}
