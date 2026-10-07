import { NextRequest, NextResponse } from 'next/server';
import { getFacultyBySlug, getFacultyByAccessKey, getAllFacultyProfiles } from '@/lib/facultyProfiles';
import {
  generateGoogleVideosHtml,
  generateGoogleGalleryHtml,
  generateGoogleResumeHtml,
  generateAccessDeniedHtml,
  generatePendingVerificationHtml
} from '@/lib/facultyHtmlGenerators';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  request: NextRequest,
  context: { params: { subject: string; pathSegments: string[] } }
) {
  try {
    const { subject, pathSegments } = context.params;
    if (!pathSegments || pathSegments.length === 0) {
      return NextResponse.redirect(new URL('/users', request.url));
    }

    let key: string | null = null;
    let filename = '';

    if (pathSegments.length === 1) {
      // 1-segment format: /best-Teacherfaculty/physics/AmitKumar.html
      filename = pathSegments[0];
    } else if (pathSegments.length >= 2) {
      // 2-segment format: /best-Teacherfaculty/physics/<accessKey>/AmitKumar.html
      key = pathSegments[0];
      filename = pathSegments[1];
    }

    // Clean filename and extract slug
    const cleanFilename = filename.toLowerCase();
    let cleanSlug = filename
      .replace(/\.html$/i, '')
      .replace(/-videos$/i, '')
      .replace(/-gallery$/i, '');

    // 1. If key is provided and looks like an access key, lookup by key first
    let faculty = null;
    if (key && key.length >= 15) {
      faculty = await getFacultyByAccessKey(key);
    }

    // 2. If not found, lookup by slug
    if (!faculty) {
      faculty = await getFacultyBySlug(cleanSlug);
    }

    // 3. Fallback: check accessKey in filename or query all
    if (!faculty) {
      faculty = await getFacultyByAccessKey(cleanSlug);
    }
    if (!faculty) {
      const allFaculty = await getAllFacultyProfiles();
      faculty = allFaculty.find(
        (f) =>
          f.slug.toLowerCase() === cleanSlug.toLowerCase() ||
          f.altSlug?.toLowerCase() === cleanSlug.toLowerCase() ||
          f.name.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanSlug.toLowerCase().replace(/[^a-z0-9]/g, '')
      ) || null;
    }

    if (!faculty) {
      return new Response(
        `<!DOCTYPE html>
        <html>
        <head><title>Faculty Profile Not Found</title></head>
        <body style="font-family: sans-serif; text-align: center; padding: 50px; background: #0f172a; color: #fff;">
          <h2>Faculty Profile Not Found</h2>
          <p>The faculty profile for "${cleanSlug}" could not be located.</p>
          <a href="/users" style="color: #60a5fa;">Go to Faculty Resumes Dashboard</a>
        </body>
        </html>`,
        {
          status: 404,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'no-cache, no-store, must-revalidate'
          }
        }
      );
    }

    // If profile is unverified, show pending verification page
    if (faculty.status !== 'verified' && !faculty.isVerified) {
      const currentUrl = request.url || `https://resumes.cseel.org/best-Teacherfaculty/${subject}/${key ? key + '/' : ''}${filename}`;
      return new Response(generatePendingVerificationHtml(faculty, currentUrl), {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'X-Robots-Tag': 'noindex, nofollow, noarchive',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
    }

    const keyPrefix = `/best-Teacherfaculty/${subject}${faculty.accessKey ? '/' + faculty.accessKey : ''}`;

    // Videos Page
    if (cleanFilename.includes('-videos')) {
      const html = generateGoogleVideosHtml(faculty, keyPrefix);
      return new Response(html, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'X-Robots-Tag': 'noindex, nofollow, noarchive',
          'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate'
        }
      });
    }

    // Gallery Page
    if (cleanFilename.includes('-gallery')) {
      const html = generateGoogleGalleryHtml(faculty, keyPrefix);
      return new Response(html, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'X-Robots-Tag': 'noindex, nofollow, noarchive',
          'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate'
        }
      });
    }

    // Dynamic Google Resume HTML (Always renders live updated sections without stale disk bypass)
    const html = generateGoogleResumeHtml(faculty, keyPrefix);
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Robots-Tag': 'noindex, nofollow, noarchive',
        'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate'
      }
    });

  } catch (error: any) {
    return new Response(`Server Error: ${error.message}`, {
      status: 500,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  }
}
