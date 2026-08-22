import { NextRequest, NextResponse } from 'next/server';

/**
 * CSEEL.org — Dynamic Subdomain & Microservices Edge Router
 * 
 * Supports multi-tenant routing across 10 department subdomains:
 * - login.cseel.org / auth.cseel.org  -> /login
 * - material.cseel.org / materials.cseel.org -> /materials
 * - careers.cseel.org                 -> /careers
 * - network.cseel.org                 -> /edu-network
 * - training.cseel.org                -> /teacher-training
 * - events.cseel.org                  -> /events
 * - support.cseel.org                 -> /get-support
 * - content.cseel.org                 -> /hands-on-experiments
 * - blog.cseel.org                    -> /blog
 * - api.cseel.org                     -> /api
 */

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public asset folder files with extensions (.svg, .png, .jpg, .css, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js|woff|woff2|ttf|ico)$).*)',
  ],
};

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';
  const pathname = url.pathname;

  // Extract subdomain (e.g. login from login.cseel.org or login.localhost:3000)
  const currentHost = process.env.NODE_ENV === 'production'
    ? hostname.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'cseel.org'}`, '').replace('.vercel.app', '')
    : hostname.replace('.localhost:3000', '').replace('.localhost:3001', '').replace('localhost:3000', '');

  // Subdomain mapping table
  const subdomainRoutes: Record<string, string> = {
    login: '/login',
    auth: '/login',
    material: '/materials',
    materials: '/materials',
    careers: '/careers',
    network: '/edu-network',
    training: '/teacher-training',
    events: '/events',
    support: '/get-support',
    content: '/hands-on-experiments',
    blog: '/blog',
    api: '/api',
  };

  // If request is on a recognized department subdomain
  if (currentHost && subdomainRoutes[currentHost]) {
    const targetBase = subdomainRoutes[currentHost];

    // If accessing root of subdomain, rewrite to target base
    if (pathname === '/' || pathname === '') {
      url.pathname = targetBase;
      return NextResponse.rewrite(url);
    }

    // If pathname doesn't already start with the target base or /api
    if (!pathname.startsWith(targetBase) && !pathname.startsWith('/api')) {
      url.pathname = `${targetBase}${pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}
