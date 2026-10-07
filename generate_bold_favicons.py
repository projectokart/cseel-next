import subprocess
import os
import numpy as np
from PIL import Image

NAVY = "#003C6E"       # Deep Navy Blue
GOLD = "#F8A130"       # Vibrant CSEEL Golden Amber
WHITE = "#FFFFFF"

# ── High-Visibility Scalable SVG with Bold Elements & Large Golden Nucleus ──
# ViewBox: 1000 x 1000
# Thin outer border: rect at 20, 20 with width 960, height 960, stroke 12
# Orbits: bold stroke 22
# Nucleus: radius 80 (diameter 160) - huge, bright golden core!
svg_bold = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <!-- Ultra-thin subtle white container with minimal padding so icon fills 95% of space -->
  <rect x="24" y="24" width="952" height="952" rx="270" fill="{WHITE}" stroke="#E2E8F0" stroke-width="12" />

  <!-- ── 4 Bold Deep Navy Corner Quadrants (Filling space, minimal outer gap) ── -->
  <!-- Top-Left: Deep Navy -->
  <path d="M 465 75 L 340 75 A 265 265 0 0 0 75 340 L 75 465 L 225 465 L 225 340 A 115 115 0 0 1 340 225 L 465 225 Z" fill="{NAVY}" />

  <!-- Top-Right: Deep Navy -->
  <path d="M 535 75 L 660 75 A 265 265 0 0 1 925 340 L 925 465 L 775 465 L 775 340 A 115 115 0 0 0 660 225 L 535 225 Z" fill="{NAVY}" />

  <!-- Bottom-Left: Deep Navy -->
  <path d="M 75 535 L 75 660 A 265 265 0 0 0 340 925 L 465 925 L 465 775 L 340 775 A 115 115 0 0 1 225 660 L 225 535 Z" fill="{NAVY}" />

  <!-- Bottom-Right: Deep Navy -->
  <path d="M 925 535 L 925 660 A 265 265 0 0 1 660 925 L 535 925 L 535 775 L 660 775 A 115 115 0 0 0 775 660 L 775 535 Z" fill="{NAVY}" />

  <!-- ── Central Science Atom: Bold Orbits & Prominent Golden Nucleus ── -->
  <g id="atom-group" transform="translate(500, 500)">
    <!-- Orbit 1 (Horizontal / -15 deg) - Thick 22px stroke for favicon visibility -->
    <ellipse cx="0" cy="0" rx="180" ry="82" transform="rotate(-15)" fill="none" stroke="{NAVY}" stroke-width="22" stroke-linecap="round" />
    
    <!-- Orbit 2 (Tilted 48 deg) -->
    <ellipse cx="0" cy="0" rx="180" ry="82" transform="rotate(48)" fill="none" stroke="{NAVY}" stroke-width="22" stroke-linecap="round" />

    <!-- Orbit 3 (Tilted 112 deg) -->
    <ellipse cx="0" cy="0" rx="180" ry="82" transform="rotate(112)" fill="none" stroke="{NAVY}" stroke-width="22" stroke-linecap="round" />

    <!-- Electron Nodes (Bold 24px radius) -->
    <circle cx="-168" cy="-56" r="24" fill="{NAVY}" />
    <circle cx="120" cy="-130" r="24" fill="{NAVY}" />
    <circle cx="-18" cy="164" r="24" fill="{NAVY}" />
    <circle cx="-16" cy="-164" r="24" fill="{NAVY}" />

    <!-- Central Solid Core Nucleus: HUGE 80px radius (160px diameter) in CSEEL Golden Amber -->
    <circle cx="0" cy="0" r="82" fill="{GOLD}" stroke="{WHITE}" stroke-width="6" />
  </g>
</svg>'''

# Save master SVG
with open('public/images/cseel-emblem.svg', 'w', encoding='utf-8') as f:
    f.write(svg_bold)
with open('public/favicon.svg', 'w', encoding='utf-8') as f:
    f.write(svg_bold)

artifact_dir = r'C:\Users\DEVENDER\.gemini\antigravity\brain\2dd31d9b-3f2c-4247-9319-6d3e04e1b616'
with open(os.path.join(artifact_dir, 'cseel-emblem-bold.svg'), 'w', encoding='utf-8') as f:
    f.write(svg_bold)

# Render 1024x1024 master PNG using Chrome headless
chrome_path = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
html_file = os.path.abspath('temp_render_bold.html')
with open(html_file, 'w', encoding='utf-8') as f:
    f.write(f'<!DOCTYPE html><html><body style="margin:0;padding:0;overflow:hidden;background:transparent;width:1000px;height:1000px;">{svg_bold}</body></html>')

master_png = os.path.abspath('public/images/cseel_logo_variants/cseel_bold_emblem_1024.png')
cmd = [
    chrome_path,
    '--headless',
    '--disable-gpu',
    '--window-size=1000,1000',
    '--default-background-color=00000000',
    f'--screenshot={master_png}',
    html_file
]
subprocess.run(cmd, check=True)
print("Master 1024px PNG rendered!")

# Generate all favicon sizes using PIL high-quality Lanczos resampling
base_im = Image.open(master_png).convert('RGBA')

# 1. 512x512 App Icon
im_512 = base_im.resize((512, 512), Image.Resampling.LANCZOS)
im_512.save('src/app/icon.png')
im_512.save('public/icon.png')

# 2. 180x180 Apple Touch Icon
im_180 = base_im.resize((180, 180), Image.Resampling.LANCZOS)
im_180.save('src/app/apple-icon.png')
im_180.save('public/apple-touch-icon.png')

# 3. 32x32 Favicon
im_32 = base_im.resize((32, 32), Image.Resampling.LANCZOS)
im_32.save('public/favicon-32x32.png')

# 4. 16x16 Favicon
im_16 = base_im.resize((16, 16), Image.Resampling.LANCZOS)
im_16.save('public/favicon-16x16.png')

# 5. Multi-size favicon.ico (16, 32, 48, 64)
base_im.save('public/favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
base_im.save('src/app/favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
im_32.save('public/favicon.png')

# Copy to artifacts for inspection
base_im.save(os.path.join(artifact_dir, 'cseel_bold_emblem_preview.png'))
im_32.save(os.path.join(artifact_dir, 'favicon_32_preview.png'))

# ── Update public/images/logo.png with the Bold Emblem ──
orig_banner = Image.open('public/images/logo_backup.png').convert('RGBA')
orig_w, orig_h = orig_banner.size
right_part = orig_banner.crop((290, 0, orig_w, orig_h))

emblem_size = 285 # Larger emblem in the banner (was 260)
resized_emblem = base_im.resize((emblem_size, emblem_size), Image.Resampling.LANCZOS)

final_logo = Image.new('RGBA', (orig_w, orig_h), (255, 255, 255, 255))
emblem_x = (290 - emblem_size) // 2
emblem_y = (orig_h - emblem_size) // 2
final_logo.paste(resized_emblem, (emblem_x, emblem_y), resized_emblem)
final_logo.paste(right_part, (290, 0), right_part)

final_logo.convert('RGB').save('public/images/logo.png')
final_logo.save(os.path.join(artifact_dir, 'cseel_final_bold_logo.png'))

print("All favicons and primary logo.png updated with bold, high-visibility design!")
