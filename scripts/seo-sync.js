const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const keyPath = path.join(__dirname, 'gsc_service_account.json');
if (!fs.existsSync(keyPath)) {
  console.error('Service account key file not found at:', keyPath);
  process.exit(1);
}

const key = JSON.parse(fs.readFileSync(keyPath, 'utf8'));

function createJWT(saKey, scopes) {
  const header = { alg: 'RS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: saKey.client_email,
    scope: scopes.join(' '),
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  };

  const b64 = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url');
  const unsignedToken = b64(header) + '.' + b64(claim);

  const sign = crypto.createSign('RSA-SHA256');
  sign.update(unsignedToken);
  const signature = sign.sign(saKey.private_key, 'base64url');

  return unsignedToken + '.' + signature;
}

async function getAccessToken() {
  const jwt = createJWT(key, [
    'https://www.googleapis.com/auth/webmasters',
    'https://www.googleapis.com/auth/indexing'
  ]);

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt
    })
  });

  const data = await res.json();
  if (data.access_token) {
    return data.access_token;
  } else {
    throw new Error('OAuth Error: ' + JSON.stringify(data));
  }
}

const SITE_URL = 'https://www.cseel.org/';
const SITEMAP_URL = 'https://www.cseel.org/sitemap.xml';

async function runSEO() {
  console.log('====================================================');
  console.log('🤖 CSEEL Automated Search Console & Indexing Manager');
  console.log('====================================================');
  console.log('🔑 Authenticating Service Account:', key.client_email);

  try {
    const token = await getAccessToken();
    console.log('✅ Google Cloud Authentication SUCCESSFUL!\n');

    // 1. Check Sites
    console.log('📡 Checking Search Console Properties...');
    const sitesRes = await fetch('https://www.googleapis.com/webmasters/v3/sites', {
      headers: { Authorization: 'Bearer ' + token }
    });
    const sitesData = await sitesRes.json();

    if (sitesData.error) {
      console.log('⚠️ API Message:', sitesData.error.message);
      return;
    }

    const sites = sitesData.siteEntry || [];
    console.log(`Found ${sites.length} verified properties:`);
    sites.forEach(s => console.log(` - ${s.siteUrl} (Permission: ${s.permissionLevel})`));

    // 2. Submit Sitemap
    console.log(`\n🗺️ Submitting Sitemap: ${SITEMAP_URL} for site: ${SITE_URL}`);
    const encodedSite = encodeURIComponent(SITE_URL);
    const encodedSitemap = encodeURIComponent(SITEMAP_URL);

    const sitemapRes = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${encodedSite}/sitemaps/${encodedSitemap}`, {
      method: 'PUT',
      headers: { Authorization: 'Bearer ' + token }
    });

    if (sitemapRes.status === 204 || sitemapRes.status === 200) {
      console.log('✅ Sitemap submitted to Google successfully!');
    } else {
      const sitemapErr = await sitemapRes.text();
      console.log('Sitemap submission response:', sitemapRes.status, sitemapErr);
    }

    // 3. Request Google Indexing for Key Pages
    const priorityPages = [
      'https://www.cseel.org/',
      'https://www.cseel.org/simulations',
      'https://www.cseel.org/hands-on-experiments',
      'https://www.cseel.org/edu-network',
      'https://www.cseel.org/edu-network/jobs',
      'https://www.cseel.org/seminars',
      'https://www.cseel.org/projects',
      'https://www.cseel.org/materials',
      'https://www.cseel.org/compare-plans',
      'https://www.cseel.org/demo'
    ];

    console.log('\n🚀 Triggering Google Indexing API for Priority Pages:');
    for (const url of priorityPages) {
      try {
        const idxRes = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            url: url,
            type: 'URL_UPDATED'
          })
        });
        const idxData = await idxRes.json();
        if (idxData.urlNotificationMetadata) {
          console.log(`  ✅ Indexed: ${url} (Time: ${idxData.urlNotificationMetadata.latestUpdate.notifyTime})`);
        } else {
          console.log(`  ℹ️ ${url}:`, idxData.error?.message || JSON.stringify(idxData));
        }
      } catch (err) {
        console.log(`  ❌ ${url}:`, err.message);
      }
    }

  } catch (err) {
    console.error('Error running SEO sync:', err.message);
  }
}

runSEO();
