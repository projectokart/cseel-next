import { NextRequest } from 'next/server';
import https from 'node:https';
import prebuiltPagesJson from '../prebuiltPages.json';

const prebuiltPages: Record<string, string> = prebuiltPagesJson as Record<string, string>;

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function fetchViaHttps(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const options = {
      hostname: parsed.hostname,
      port: 443,
      path: parsed.pathname + parsed.search,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://morweb.org/',
      },
    };

    const req = https.request(options, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (redirectUrl.startsWith('/')) {
          redirectUrl = `https://morweb.org${redirectUrl}`;
        }
        return fetchViaHttps(redirectUrl).then(resolve).catch(reject);
      }

      let data = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve(data);
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timed out'));
    });

    req.end();
  });
}

function transformHtml(html: string): string {
  if (!html) return html;

  // 1. Remove base tags completely
  html = html.replace(/<base\s+[^>]*href=["']https?:\/\/(?:www\.)?morweb\.org\/?[^"']*["'][^>]*>/gi, '');
  html = html.replace(/<base\s+[^>]*>/gi, '');

  // 2. Fix images: <img ... src="/..." ...> -> https://morweb.org/...
  html = html.replace(/<img\s+([^>]*\s+)?src=["']([^"']+)["']([^>]*)>/gi, (match, p1, src, p2) => {
    if (src.startsWith('data:') || src.startsWith('http://') || src.startsWith('https://') || src.startsWith('//')) {
      return match;
    }
    const lead = p1 || '';
    const trail = p2 || '';
    const newSrc = src.startsWith('/') ? `https://morweb.org${src}` : `https://morweb.org/${src}`;
    return `<img ${lead}src="${newSrc}"${trail}>`;
  });

  // 3. Fix <source ... srcset="/..." ...>
  html = html.replace(/<source\s+([^>]*\s+)?srcset=["']([^"']+)["']([^>]*)>/gi, (match, p1, srcset, p2) => {
    const lead = p1 || '';
    const trail = p2 || '';
    const parts = srcset.split(',');
    const newParts = parts.map((part: string) => {
      const p = part.trim();
      if (!p) return p;
      const pieces = p.split(/\s+/);
      let url = pieces[0];
      if (!url.startsWith('data:') && !url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('//')) {
        url = url.startsWith('/') ? `https://morweb.org${url}` : `https://morweb.org/${url}`;
      }
      pieces[0] = url;
      return pieces.join(' ');
    });
    return `<source ${lead}srcset="${newParts.join(', ')}"${trail}>`;
  });

  // 4. Fix <link ... href="/..." ...> for stylesheets, favicons, rss
  html = html.replace(/<link\s+([^>]*\s+)?href=["']([^"']+)["']([^>]*)>/gi, (match, p1, href, p2) => {
    if (href.startsWith('data:') || href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//')) {
      return match;
    }
    const lead = p1 || '';
    const trail = p2 || '';
    const newHref = href.startsWith('/') ? `https://morweb.org${href}` : `https://morweb.org/${href}`;
    return `<link ${lead}href="${newHref}"${trail}>`;
  });

  // 5. Fix <script ... src="/..." ...>
  html = html.replace(/<script\s+([^>]*\s+)?src=["']([^"']+)["']([^>]*)>/gi, (match, p1, src, p2) => {
    if (src.startsWith('data:') || src.startsWith('http://') || src.startsWith('https://') || src.startsWith('//')) {
      return match;
    }
    const lead = p1 || '';
    const trail = p2 || '';
    const newSrc = src.startsWith('/') ? `https://morweb.org${src}` : `https://morweb.org/${src}`;
    return `<script ${lead}src="${newSrc}"${trail}>`;
  });

  // 6. Fix CSS url(/...) in style tags or inline style attributes
  html = html.replace(/url\(\s*['"]?(\/(?!\/)[^'")]+)['"]?\s*\)/gi, (match, path) => {
    return `url('https://morweb.org${path}')`;
  });

  // 7. Convert ANY absolute morweb.org links into internal relative links so navigation stays on design.cseel.org
  html = html.replace(/href=["']https?:\/\/(?:www\.)?morweb\.org\/([^"']*)["']/gi, 'href="/$1"');
  html = html.replace(/href=["']https?:\/\/(?:www\.)?morweb\.org["']/gi, 'href="/"');

  // 8. Add FontAwesome CDN if not present
  if (!html.includes('font-awesome') && html.includes('</head>')) {
    html = html.replace('</head>', '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossorigin="anonymous" referrerpolicy="no-referrer" />\n</head>');
  }

  // 9. Client-Side Link Interceptor Script
  const interceptorScript = `
<script>
(function() {
  function fixLinks() {
    var links = document.querySelectorAll('a[href]');
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      var href = a.getAttribute('href');
      if (!href) continue;
      if (href.indexOf('morweb.org') !== -1) {
        try {
          var u = new URL(href, window.location.origin);
          if (u.hostname.indexOf('morweb.org') !== -1) {
            a.setAttribute('href', u.pathname + u.search + u.hash);
          }
        } catch(e) {}
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixLinks);
  } else {
    fixLinks();
  }

  // Intercept any click event dynamically
  document.addEventListener('click', function(e) {
    var target = e.target.closest('a');
    if (target && target.href) {
      try {
        var u = new URL(target.href);
        if (u.hostname.indexOf('morweb.org') !== -1) {
          e.preventDefault();
          window.location.href = u.pathname + u.search + u.hash;
        }
      } catch(err) {}
    }
  }, true);
})();
</script>
`;
  if (!html.includes('fixLinks')) {
    if (html.includes('</body>')) {
      html = html.replace('</body>', `${interceptorScript}\n</body>`);
    } else {
      html += interceptorScript;
    }
  }

  // 10. Inject Dev Sharma Floating WhatsApp Widget
  const whatsappWidget = `
<!-- Sticky Floating WhatsApp Widget for Dev Sharma -->
<div id="dev-whatsapp-float" style="position: fixed; bottom: 25px; right: 25px; z-index: 999999; display: flex; align-items: center; gap: 10px;">
  <div style="background: #ffffff; color: #1e293b; padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; box-shadow: 0 4px 15px rgba(0,0,0,0.15); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; align-items: center; gap: 6px;">
    <span style="display: inline-block; width: 8px; height: 8px; background: #22c55e; border-radius: 50%;"></span>
    Chat with Dev Sharma
  </div>
  <a href="https://wa.me/919050778830?text=Hi%20dev%20sharma%20i%20find%20you%20on%20my%20on%20web%20i%20wanted%20to%20make%20website" target="_blank" rel="noopener noreferrer" style="width: 60px; height: 60px; background: #25D366; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4); text-decoration: none; color: #ffffff; font-size: 32px; transition: transform 0.2s ease;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
    <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
    </svg>
  </a>
</div>
`;
  if (!html.includes('dev-whatsapp-float')) {
    if (html.includes('</body>')) {
      html = html.replace('</body>', `${whatsappWidget}\n</body>`);
    } else {
      html += whatsappWidget;
    }
  }

  return html;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug?: string[] } }
) {
  const slugArray = params.slug || [];
  const slugPath = slugArray.join('/');
  const key = slugPath.toLowerCase().replace(/^\/+|\/+$/g, '');
  const search = request.nextUrl.search || '';
  const targetUrl = `https://morweb.org/${slugPath}${search}`;

  try {
    let html = prebuiltPages[key] || '';

    if (!html) {
      try {
        const res = await fetch(targetUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
          },
        });
        if (res.ok) {
          html = await res.text();
        }
      } catch {}

      if (!html) {
        html = await fetchViaHttps(targetUrl);
      }
    }

    html = transformHtml(html);

    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate',
      },
    });
  } catch (error) {
    return new Response(`Error loading page: ${String(error)}`, { status: 500 });
  }
}
