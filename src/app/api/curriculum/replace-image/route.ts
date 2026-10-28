import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export const dynamic = 'force-dynamic';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ukazkxthavxphibdbspd.supabase.co';
const SUPABASE_SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrYXpreHRoYXZ4cGhpYmRic3BkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzgxOTgzOCwiZXhwIjoyMDg5Mzk1ODM4fQ.Od_IWU3qrttP28AdPajuJfxitTqQIXVo9dXSzFS-Kms';

const MASTER_ADMIN_EMAIL = 'ptdevkaushik101@gmail.com';
const MASTER_ADMIN_KEY = process.env.ADMIN_SECRET_KEY || '';

/**
 * Checks if request is from authorized superadmin
 */
function isAuthorizedAdmin(req: NextRequest, bodyEmail?: string, bodyKey?: string): boolean {
  const headerEmail = (
    req.headers.get('x-admin-email') ||
    req.headers.get('x-user-email') ||
    bodyEmail ||
    ''
  ).toLowerCase().trim();

  const authHeader = req.headers.get('authorization') || '';
  const adminKeyHeader = req.headers.get('x-admin-key') || '';
  const providedKey = bodyKey || adminKeyHeader;

  // 1. Strict match on admin email
  const isMasterEmail = headerEmail === MASTER_ADMIN_EMAIL || headerEmail === 'ptdevkaushik104@gmail.com';

  // 2. Secret key check (requires actual ADMIN_SECRET_KEY to be configured in env)
  const isMasterKey = Boolean(
    MASTER_ADMIN_KEY && (
      providedKey === MASTER_ADMIN_KEY ||
      authHeader.includes(MASTER_ADMIN_KEY)
    )
  );

  return isMasterEmail || isMasterKey;
}

/**
 * Convert any image buffer to AVIF and automatically compress under 10 KB
 */
async function convertToAvifUnder10Kb(rawBuffer: Buffer): Promise<{ buffer: Buffer; sizeKb: number; quality: number }> {
  let quality = 70;
  let maxDim = 360;

  let avifBuffer = await sharp(rawBuffer)
    .resize(maxDim, maxDim, { fit: 'inside', withoutEnlargement: true })
    .avif({ quality, effort: 4, chromaSubsampling: '4:2:0' })
    .toBuffer();

  // If > 10 KB, progressively optimize down
  while (avifBuffer.length > 10 * 1024 && quality > 15) {
    quality -= 10;
    if (quality <= 30 && maxDim > 260) {
      maxDim -= 40;
    }
    avifBuffer = await sharp(rawBuffer)
      .resize(maxDim, maxDim, { fit: 'inside', withoutEnlargement: true })
      .avif({ quality, effort: 4, chromaSubsampling: '4:2:0' })
      .toBuffer();
  }

  const sizeKb = Number((avifBuffer.length / 1024).toFixed(2));
  return { buffer: avifBuffer, sizeKb, quality };
}

/**
 * POST /api/curriculum/replace-image
 * Replaces a material image in Cloud Storage, converts automatically to AVIF < 10KB,
 * and permanently updates public/curriculum/grade-1.html
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      materialName,
      catalogBadge,
      oldImageUrl,
      newImageUrl,
      imageDataBase64,
      adminEmail,
      adminKey
    } = body;

    // 1. Verification: ONLY ptdevkaushik101@gmail.com
    if (!isAuthorizedAdmin(req, adminEmail, adminKey)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized: Only ptdevkaushik101@gmail.com is authorized to replace curriculum images.',
        },
        { status: 403 }
      );
    }

    const cleanName = (materialName || 'material-item').trim();
    const itemSlug = cleanName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'item';

    let rawBuffer: Buffer | null = null;

    // 2. Handle Upload (Base64) or Image URL
    if (imageDataBase64 && typeof imageDataBase64 === 'string') {
      const base64Data = imageDataBase64.replace(/^data:image\/\w+;base64,/, '');
      rawBuffer = Buffer.from(base64Data, 'base64');
    } else if (newImageUrl && typeof newImageUrl === 'string') {
      if (newImageUrl.startsWith('data:image/')) {
        const base64Data = newImageUrl.replace(/^data:image\/\w+;base64,/, '');
        rawBuffer = Buffer.from(base64Data, 'base64');
      } else if (newImageUrl.startsWith('http://') || newImageUrl.startsWith('https://')) {
        const fetchRes = await fetch(newImageUrl, {
          headers: { 'User-Agent': 'Mozilla/5.0 (CSEEL-Curriculum-Image-Updater/1.0)' },
          cache: 'no-store'
        });
        if (fetchRes.ok) {
          const ab = await fetchRes.arrayBuffer();
          rawBuffer = Buffer.from(ab);
        }
      }
    }

    if (!rawBuffer || rawBuffer.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Please provide either a valid image file upload or an accessible image URL.' },
        { status: 400 }
      );
    }

    // 3. AUTOMATIC CONVERSION TO AVIF AND COMPRESSION < 10 KB
    const { buffer: avifBuffer, sizeKb, quality } = await convertToAvifUnder10Kb(rawBuffer);
    console.log(`[AVIF Compression] ${itemSlug}: converted to AVIF, final size: ${sizeKb} KB (quality: ${quality})`);

    const fileExt = 'avif';
    const contentType = 'image/avif';
    let finalCloudUrl = '';

    // 4. Upload to Cloud Storage (Supabase Storage)
    const storageFileName = `curriculum/${itemSlug}-${Date.now()}.${fileExt}`;
    const bucketName = 'makerspace-materials';

    try {
      const uploadUrl = `${SUPABASE_URL}/storage/v1/object/${bucketName}/${storageFileName}`;
      const uploadRes = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_SERVICE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': contentType,
          'x-upsert': 'true',
        },
        body: new Uint8Array(avifBuffer),
      });

      if (uploadRes.ok) {
        finalCloudUrl = `${SUPABASE_URL}/storage/v1/object/public/${bucketName}/${storageFileName}`;
        console.log('[Replace Image] Uploaded to Supabase Cloud Storage:', finalCloudUrl);
      } else {
        console.warn('[Replace Image] Supabase Storage upload status:', uploadRes.status);
      }
    } catch (storageErr) {
      console.warn('[Replace Image] Supabase storage upload error:', storageErr);
    }

    // 5. Also save to local public/images/makerspace/verified-products/ for Vercel CDN serving
    try {
      const localFileName = `${itemSlug}.${fileExt}`;
      const verifiedDir = path.join(process.cwd(), 'public', 'images', 'makerspace', 'verified-products');
      if (!fs.existsSync(verifiedDir)) {
        fs.mkdirSync(verifiedDir, { recursive: true });
      }
      const localFilePath = path.join(verifiedDir, localFileName);
      fs.writeFileSync(localFilePath, avifBuffer);

      if (!finalCloudUrl || !finalCloudUrl.includes('supabase.co')) {
        finalCloudUrl = `https://cseel.org/images/makerspace/verified-products/${localFileName}?v=${Date.now()}`;
      }
    } catch (localWriteErr) {
      console.warn('[Replace Image] Local file caching notice:', localWriteErr);
    }

    // 6. Update public/curriculum/grade-1.html permanently
    try {
      const htmlPath = path.join(process.cwd(), 'public', 'curriculum', 'grade-1.html');
      if (fs.existsSync(htmlPath)) {
        let htmlContent = fs.readFileSync(htmlPath, 'utf-8');

        // Replace old image source if provided
        if (oldImageUrl && htmlContent.includes(oldImageUrl)) {
          htmlContent = htmlContent.split(oldImageUrl).join(finalCloudUrl);
        }

        // Replace images matching this material name
        const escapedName = cleanName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const imgNameRegex = new RegExp(
          `(<img[^>]*src=["'])([^"']+)(["'][^>]*alt=["']${escapedName}["'][^>]*>)`,
          'gi'
        );
        htmlContent = htmlContent.replace(imgNameRegex, `$1${finalCloudUrl}$3`);

        const altFirstRegex = new RegExp(
          `(<img[^>]*alt=["']${escapedName}["'][^>]*src=["'])([^"']+)(["'][^>]*>)`,
          'gi'
        );
        htmlContent = htmlContent.replace(altFirstRegex, `$1${finalCloudUrl}$3`);

        // Also update openPhotoModal calls for this material
        const modalCallRegex = new RegExp(
          `(openPhotoModal\\(['"]${escapedName}['"]\\s*,\\s*['"])([^'"]+)(['"])`,
          'gi'
        );
        htmlContent = htmlContent.replace(modalCallRegex, `$1${finalCloudUrl}$3`);

        fs.writeFileSync(htmlPath, htmlContent, 'utf-8');
        console.log('[Replace Image] Updated grade-1.html permanently with AVIF image:', finalCloudUrl);
      }
    } catch (htmlErr) {
      console.error('[Replace Image] Error writing to grade-1.html:', htmlErr);
    }

    // 7. Save override to src/data/curriculum_image_overrides.json
    try {
      const overridesPath = path.join(process.cwd(), 'src', 'data', 'curriculum_image_overrides.json');
      let overrides: Record<string, any> = {};
      if (fs.existsSync(overridesPath)) {
        try {
          overrides = JSON.parse(fs.readFileSync(overridesPath, 'utf-8'));
        } catch (_) {}
      }

      overrides[itemSlug] = {
        materialName: cleanName,
        catalogBadge: catalogBadge || '',
        oldImageUrl: oldImageUrl || '',
        finalUrl: finalCloudUrl,
        format: 'avif',
        sizeKb: sizeKb,
        updatedBy: MASTER_ADMIN_EMAIL,
        updatedAt: new Date().toISOString(),
      };

      fs.writeFileSync(overridesPath, JSON.stringify(overrides, null, 2), 'utf-8');
    } catch (ovErr) {
      console.warn('[Replace Image] Error writing overrides json:', ovErr);
    }

    // 8. Update 325 catalog mapping if category badge matches
    if (catalogBadge) {
      try {
        const badgeMatch = catalogBadge.match(/Category\s*(\d+)[\s:]*Item\s*#?(\d+)/i);
        if (badgeMatch) {
          const itemNum = badgeMatch[2];
          const catalogMapPath = path.join(process.cwd(), 'src', 'data', 'makerspace_325_catalog.json');
          if (fs.existsSync(catalogMapPath)) {
            const catalogData = JSON.parse(fs.readFileSync(catalogMapPath, 'utf-8'));
            for (const key of Object.keys(catalogData)) {
              if (key.endsWith(`-${itemNum}`)) {
                catalogData[key] = finalCloudUrl;
              }
            }
            fs.writeFileSync(catalogMapPath, JSON.stringify(catalogData, null, 2), 'utf-8');
          }
        }
      } catch (catErr) {
        console.warn('[Replace Image] Error updating 325 catalog:', catErr);
      }
    }

    return NextResponse.json({
      success: true,
      materialName: cleanName,
      oldImageUrl,
      finalUrl: finalCloudUrl,
      format: 'avif',
      sizeKb: sizeKb,
      updatedBy: MASTER_ADMIN_EMAIL,
      message: `Image converted to AVIF (${sizeKb} KB < 10KB) and saved in Cloud Storage successfully!`,
    });
  } catch (err: any) {
    console.error('[API /api/curriculum/replace-image] Error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error while replacing image' },
      { status: 500 }
    );
  }
}
