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

  // Map subdomain → main-domain base path (used for redirect only)
  const subdomainToPath: Record<string, string> = {
    material: '/materials',
    materials: '/materials',
    careers: '/careers',
    network: '/edu-network',
    training: '/teacher-training',
    events: '/events',
    support: '/get-support',
    content: '/hands-on-experiments',
    blog: '/blog',
    login: '',
    auth: '',
  };

  // Only act if we're on a known subdomain
  if (currentHost && subdomainToPath[currentHost] !== undefined) {
    const isAdminPath = pathname.startsWith('/admin');
    const isLoginPath = pathname === '/login' || pathname.startsWith('/login');

    // ✅ ALLOW: admin & login paths on subdomains — pass through as-is
    // This lets material.cseel.org/admin serve the material dept admin panel
    if (isAdminPath || isLoginPath) {
      return NextResponse.next();
    }

    // 🔄 REDIRECT: everything else → main domain equivalent
    // e.g. material.cseel.org/anything → www.cseel.org/materials (or /materials/anything)
    const targetBase = subdomainToPath[currentHost];
    const redirectPath =
      pathname === '/' || pathname === ''
        ? targetBase || '/'
        : targetBase + pathname;

    const redirectUrl = new URL(
      redirectPath || '/',
      `https://www.${rootDomain}`
    );

    return NextResponse.redirect(redirectUrl, { status: 301 });
  }

  return NextResponse.next();
}
