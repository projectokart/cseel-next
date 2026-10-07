import { NextRequest, NextResponse } from 'next/server';

/**
 * CSEEL.org — Edge Router
 *
 * Active Subdomains:
 *   1. admin.cseel.org        → /admin (Governance Console)
 *   2. design.cseel.org       → /design (Design & Creative Studio)
 *   3. resumes.cseel.org      → /best-Teacherfaculty/physics/[filename] & /users (Faculty Portal)
 *   4. schoolsearch.cseel.org  → /school-finder (School Directory & Interactive GIS Map)
 *
 * All public departments use standard folder-based URLs on the main domain (cseel.org).
 */

export const config = {
  matcher: [
    /*
     * Match all request paths except static files & images
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:xml|txt|svg|png|jpg|jpeg|gif|webp|css|js|woff|woff2|ttf|ico)$).*)',
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

  // 1. Dedicated Admin Subdomain: admin.cseel.org
  if (currentHost === 'admin') {
    const isEditMode = url.searchParams.get('edit') === 'true' || url.searchParams.get('editMode') === 'true' || url.searchParams.get('live') === 'true';

    // If edit mode is requested on admin.cseel.org, serve live website pages directly!
    if (isEditMode) {
      if (pathname === '/admin') {
        url.pathname = '/';
        return NextResponse.rewrite(url);
      }
      return NextResponse.next();
    }

    if (pathname === '/' || pathname === '' || pathname === '/login') {
      url.pathname = '/admin';
      return NextResponse.rewrite(url);
    }
    if (pathname.startsWith('/admin')) {
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  // Redirect public /admin or /faculty-admin hits to dedicated admin subdomains (Production only)
  if (process.env.NODE_ENV === 'production' && (currentHost === '' || currentHost === 'www')) {
    if (pathname === '/admin' || pathname.startsWith('/admin/')) {
      return NextResponse.redirect('https://admin.cseel.org', 308);
    }
  }

  // 2. Dedicated Design Subdomain: design.cseel.org
  if (currentHost === 'design') {
    if (pathname === '/' || pathname === '') {
      url.pathname = '/design';
      return NextResponse.rewrite(url);
    }
    if (pathname.startsWith('/design')) {
      return NextResponse.rewrite(url);
    }
    url.pathname = `/design${pathname.startsWith('/') ? pathname : `/${pathname}`}`;
    return NextResponse.rewrite(url);
  }

  // 3. Dedicated Resumes Subdomain: resumes.cseel.org
  if (currentHost === 'resumes') {
    // Dedicated Faculty Admin Portal
    if (pathname === '/admin' || pathname === '/faculty-admin') {
      url.pathname = '/faculty-admin';
      return NextResponse.rewrite(url);
    }
    // Dedicated Faculty Resumes Dashboard (/user, /users, /dashboard)
    if (pathname === '/user' || pathname === '/user/' || pathname === '/dashboard' || pathname === '/users' || pathname === '/users/') {
      url.pathname = '/users';
      return NextResponse.rewrite(url);
    }
    // Resume Studio Editor paths (/user/editor, /users/editor)
    if (pathname === '/user/editor' || pathname === '/users/editor') {
      url.pathname = '/users/editor';
      return NextResponse.rewrite(url);
    }
    // Allow API routes to pass through
    if (pathname.startsWith('/api/')) {
      return NextResponse.next();
    }
    // Root-level single file HTML (e.g. /DevSharma.html) -> rewrite to /best-Teacherfaculty/physics/[filename]
    const rootHtmlMatch = pathname.match(/^\/([a-zA-Z0-9_-]+(?:\.html|-videos\.html|-gallery\.html))$/i);
    if (rootHtmlMatch) {
      url.pathname = `/best-Teacherfaculty/physics/${rootHtmlMatch[1]}`;
      return NextResponse.rewrite(url);
    }

    // Allow videos, gallery, images, and static html pages
    if (pathname.includes('-videos') || pathname.includes('-gallery') || pathname.endsWith('.html') || pathname.startsWith('/images/')) {
      return NextResponse.next();
    }
    // Support without .html extension - redirect cleanly to static .html
    if (pathname.startsWith('/best-Teacherfaculty/') || pathname.startsWith('/best-physics-faculty/')) {
      return NextResponse.redirect(new URL(`${pathname}.html`, request.url), { status: 301 });
    }
    if (pathname === '/' || pathname === '') {
      url.pathname = '/users';
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  // 4. Dedicated School Finder Subdomain: schoolsearch.cseel.org
  if (currentHost === 'schoolsearch') {
    if (pathname === '/' || pathname === '') {
      url.pathname = '/school-finder';
      return NextResponse.rewrite(url);
    }
    if (pathname.startsWith('/school') || pathname.startsWith('/school-profile') || pathname.startsWith('/school-finder') || pathname.startsWith('/schoolsearch') || pathname.startsWith('/api/') || pathname.startsWith('/auth/')) {
      return NextResponse.next();
    }
    return NextResponse.next();
  }

  // 5. Dynamic /org/org-school-${school_id} routing
  if (pathname.startsWith('/org/org-school-')) {
    const orgId = pathname.replace('/org/', '');
    url.pathname = `/edu-network/org/${orgId}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}
