const fs = require('fs');
const path = require('path');

// CSEEL Locked Master 4-Color Palette:
// 1. Sky Blue:      #00A3FF (Top-Left)
// 2. Flame Red:     #EA4335 (Top-Right - High Priority / Material Flame)
// 3. Solar Gold:    #FFB703 (Bottom-Left)
// 4. Pine Green:    #007F5F (Bottom-Right)
// 5. Charcoal Atom: #202124 (Light Mode) / #FFFFFF (Dark Mode / Favicon)

const baseSvgPath = path.join(__dirname, '../../public/images/cseel-emblem.svg');
let svg = fs.readFileSync(baseSvgPath, 'utf8');

// Top-Left -> Sky Blue #00A3FF
svg = svg.replace(/fill="#4B89EE"/gi, 'fill="#00A3FF"');
svg = svg.replace(/fill="#4285F4"/gi, 'fill="#00A3FF"');

// Top-Right -> Material Flame Red #EA4335
svg = svg.replace(/fill="#003566"/gi, 'fill="#EA4335"');
svg = svg.replace(/fill="#FF4500"/gi, 'fill="#EA4335"');
svg = svg.replace(/fill="#E63946"/gi, 'fill="#EA4335"');
svg = svg.replace(/fill="#E84B3F"/gi, 'fill="#EA4335"');
svg = svg.replace(/fill="#C1121F"/gi, 'fill="#EA4335"');

// Bottom-Left -> Solar Gold #FFB703
svg = svg.replace(/fill="#F7C127"/gi, 'fill="#FFB703"');
svg = svg.replace(/fill="#F7C123"/gi, 'fill="#FFB703"');
svg = svg.replace(/fill="#F7C022"/gi, 'fill="#FFB703"');
svg = svg.replace(/fill="#F7C223"/gi, 'fill="#FFB703"');
svg = svg.replace(/fill="#FBBC04"/gi, 'fill="#FFB703"');
svg = svg.replace(/fill="#FFC300"/gi, 'fill="#FFB703"');

// Bottom-Right -> Pine Green #007F5F
svg = svg.replace(/fill="#2FA160"/gi, 'fill="#007F5F"');
svg = svg.replace(/fill="#34A853"/gi, 'fill="#007F5F"');

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

console.log('Successfully locked and applied Master Palette with Flame Red #EA4335!');
