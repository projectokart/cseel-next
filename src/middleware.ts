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
    login: { adminPath: '/admin', publicFolder: '/login' },
    auth: { adminPath: '/admin', publicFolder: '/login' },
  };

  // Only act if we're on a known subdomain
  if (currentHost && subdomainConfig[currentHost] !== undefined) {
    const config = subdomainConfig[currentHost];
    const isAdminPath = pathname === '/admin' || pathname.startsWith('/admin/');
    const isLoginPath = pathname === '/login' || pathname.startsWith('/login/');

    // 1. If visiting /admin on subdomain -> rewrite to department admin page
    if (isAdminPath) {
      if (pathname === '/admin' && config.adminPath) {
        url.pathname = config.adminPath;
        return NextResponse.rewrite(url);
      }
      return NextResponse.next();
    }

    // 2. If visiting /login on subdomain -> allow
    if (isLoginPath) {
      return NextResponse.next();
    }

    // 3. For homepage of subdomain (e.g. material.cseel.org/) -> redirect to main domain folder (e.g. www.cseel.org/materials)
    if (pathname === '/' || pathname === '') {
      return NextResponse.redirect(new URL(config.publicFolder, `https://www.${rootDomain}`), { status: 301 });
    }

    // 4. For any other path (e.g. material.cseel.org/hands-on-experiments) -> redirect directly to www.cseel.org/hands-on-experiments
    return NextResponse.redirect(new URL(pathname, `https://www.${rootDomain}`), { status: 301 });
  }

  return NextResponse.next();
}
