const fs = require('fs');
const path = require('path');

// Authentic Google Material Design Palette:
// 1. Google Blue:   #4285F4 (Top-Left)
// 2. Google Red:    #EA4335 (Top-Right)
// 3. Google Yellow: #FBBC04 (Bottom-Left)
// 4. Google Green:  #34A853 (Bottom-Right)
// 5. Central Atom:  #202124 (Light Mode) / #FFFFFF (Dark Mode / Favicon)

const baseSvgPath = path.join(__dirname, '../../public/images/cseel-emblem.svg');
let svg = fs.readFileSync(baseSvgPath, 'utf8');

// Top-Left -> Google Blue #4285F4
svg = svg.replace(/fill="#00A3FF"/gi, 'fill="#4285F4"');
svg = svg.replace(/fill="#4B89EE"/gi, 'fill="#4285F4"');

// Top-Right -> Google Red #EA4335
svg = svg.replace(/fill="#003566"/gi, 'fill="#EA4335"');
svg = svg.replace(/fill="#FF4500"/gi, 'fill="#EA4335"');
svg = svg.replace(/fill="#E63946"/gi, 'fill="#EA4335"');
svg = svg.replace(/fill="#E84B3F"/gi, 'fill="#EA4335"');
svg = svg.replace(/fill="#C1121F"/gi, 'fill="#EA4335"');

// Bottom-Left -> Google Yellow #FBBC04
svg = svg.replace(/fill="#FFB703"/gi, 'fill="#FBBC04"');
svg = svg.replace(/fill="#F7C127"/gi, 'fill="#FBBC04"');
svg = svg.replace(/fill="#F7C123"/gi, 'fill="#FBBC04"');
svg = svg.replace(/fill="#F7C022"/gi, 'fill="#FBBC04"');
svg = svg.replace(/fill="#F7C223"/gi, 'fill="#FBBC04"');
svg = svg.replace(/fill="#FFC300"/gi, 'fill="#FBBC04"');

// Bottom-Right -> Google Green #34A853
svg = svg.replace(/fill="#007F5F"/gi, 'fill="#34A853"');
svg = svg.replace(/fill="#2FA160"/gi, 'fill="#34A853"');

// 1. UI Emblem (Dark Charcoal #202124 Atom)
const uiSvg = svg.replace(/<style>[\s\S]*?<\/style>/i, `<style>
  .cseel-atom {
    fill: #202124 !important;
  }
</style>`);

fs.writeFileSync(baseSvgPath, uiSvg, 'utf8');
fs.writeFileSync(path.join(__dirname, '../../public/images/logo.svg'), uiSvg, 'utf8');
fs.writeFileSync(path.join(__dirname, '../../public/images/cseel-logo.svg'), uiSvg, 'utf8');

// 2. Favicon (Pure White #FFFFFF Atom for dark tabs)
const faviconSvg = svg.replace(/<style>[\s\S]*?<\/style>/i, `<style>
  .cseel-atom {
    fill: #FFFFFF !important;
  }
</style>`);

fs.writeFileSync(path.join(__dirname, '../../public/favicon.svg'), faviconSvg, 'utf8');
fs.writeFileSync(path.join(__dirname, '../../public/icon.svg'), faviconSvg, 'utf8');

console.log('Successfully updated to Authentic Google Material Palette (#4285F4, #EA4335, #FBBC04, #34A853)!');
