const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function processUserLogoIntoRoundedWhiteBox() {
  const uploadedPath = 'C:/Users/DEVENDER/.gemini/antigravity/brain/2dd31d9b-3f2c-4247-9319-6d3e04e1b616/.user_uploaded/media_1790768765999.png';
  
  const { data, info } = await sharp(uploadedPath).raw().toBuffer({ resolveWithObject: true });
  const width = info.width;
  const height = info.height;
  
  // Step 1: Cleanly extract the emblem by making all checkerboard/background pixels fully transparent
  const cleanData = Buffer.from(data);
  for (let i = 0; i < cleanData.length; i += 4) {
    const r = cleanData[i];
    const g = cleanData[i+1];
    const b = cleanData[i+2];
    
    // Is it emblem color?
    // Teal/Navy 'C' and loops: b > r + 30 && g > r + 15
    // Orange nucleus: r > 170 && g > 90 && b < 110 && r > g + 20
    // Sparkle / highlights: b > r + 25 && g > r + 10
    const isTeal = (b > r + 25 && g > r + 10);
    const isOrange = (r > 165 && g > 85 && b < 120 && r > g + 15);
    const isSparkle = (b > r + 20 && g > r + 8 && (r < 180 || g < 200 || b < 220));
    
    if (!isTeal && !isOrange && !isSparkle) {
      cleanData[i+3] = 0; // Transparent checkerboard
    }
  }

  // Step 2: Create pristine transparent emblem buffer
  const emblemCleanBuffer = await sharp(cleanData, {
    raw: { width, height, channels: 4 }
  })
  .png()
  .toBuffer();

  // Save clean emblem for high-res assets
  fs.writeFileSync('public/images/cseel-emblem-clean.png', emblemCleanBuffer);

  // Step 3: Create Rounded Corner White Box (Squircle)
  // Target: 512x512 with transparent canvas outside the rounded white box
  const targetSize = 512;
  const boxPadding = 8;
  const boxSize = targetSize - (boxPadding * 2); // 496x496
  const borderRadius = 96; // Smooth modern squircle radius

  const whiteBoxSvg = Buffer.from(`
    <svg width="${targetSize}" height="${targetSize}" viewBox="0 0 ${targetSize} ${targetSize}" xmlns="http://www.w3.org/2000/svg">
      <!-- High-contrast rounded corner white box -->
      <rect x="${boxPadding}" y="${boxPadding}" width="${boxSize}" height="${boxSize}" rx="${borderRadius}" fill="#ffffff" stroke="#cbd5e1" stroke-width="3" />
    </svg>
  `);

  const whiteBoxBase = await sharp(whiteBoxSvg).png().toBuffer();

  // Resize emblem to be AS BIG AS POSSIBLE inside the rounded white box (460x460)
  const emblemMaxDim = 460;
  const resizedEmblem = await sharp(emblemCleanBuffer)
    .resize(emblemMaxDim, emblemMaxDim, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  const resizedMeta = await sharp(resizedEmblem).metadata();
  const leftOffset = Math.round((targetSize - resizedMeta.width) / 2);
  const topOffset = Math.round((targetSize - resizedMeta.height) / 2);

  // Composite the maximum size emblem on top of the rounded white box
  const masterIcon = await sharp(whiteBoxBase)
    .composite([{ input: resizedEmblem, top: topOffset, left: leftOffset }])
    .png()
    .toBuffer();

  // Save all favicon sizes
  fs.writeFileSync(path.join(process.cwd(), 'public/icon.png'), masterIcon);
  fs.writeFileSync(path.join(process.cwd(), 'public/favicon.png'), masterIcon);
  fs.writeFileSync(path.join(process.cwd(), 'src/app/icon.png'), masterIcon);
  fs.writeFileSync(path.join(process.cwd(), 'src/app/apple-icon.png'), masterIcon);

  const icon180 = await sharp(masterIcon).resize(180, 180).png().toBuffer();
  fs.writeFileSync(path.join(process.cwd(), 'public/apple-touch-icon.png'), icon180);

  const icon48 = await sharp(masterIcon).resize(48, 48).png().toBuffer();
  fs.writeFileSync(path.join(process.cwd(), 'public/favicon.ico'), icon48);

  const icon32 = await sharp(masterIcon).resize(32, 32).png().toBuffer();
  fs.writeFileSync(path.join(process.cwd(), 'public/favicon-32x32.png'), icon32);

  const icon16 = await sharp(masterIcon).resize(16, 16).png().toBuffer();
  fs.writeFileSync(path.join(process.cwd(), 'public/favicon-16x16.png'), icon16);

  console.log('✅ Generated Maximum-Sized User Logo in Rounded White Box Favicon successfully!');
}

processUserLogoIntoRoundedWhiteBox().catch(console.error);
