import subprocess
import os
import numpy as np
from PIL import Image

NAVY = "#0A4B69"       # Exact CSEEL Wordmark Navy: RGB (10, 75, 105)
GOLD = "#F8A130"       # Exact CSEEL Golden Amber: RGB (248, 161, 48)
WHITE = "#FFFFFF"

# ── Pure Vector SVG: Mathematically Flawless Curves, ZERO White Outer Halo ──
# ViewBox: 0 0 1000 1000
# Center: (500, 500)
# Outer bounds of brackets: from 80 to 920 (width = 840, height = 840)
# Corner outer radius: R_out = 224
# Corner inner radius: R_in = 74
# Band thickness: 224 - 74 = 150
# Center cross gaps: width 36px (from 482 to 518)
# Notice: Outside the brackets is completely transparent (<svg> has NO outer white rect).
# Only the inner opening behind the atom has a pure white fill!

svg_flawless = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <defs>
    <!-- Inner rounded white bed behind the atom -->
    <!-- Inner square opening is from 226 to 774 with corner radius 74 -->
    <clipPath id="inner-bed-clip">
      <path d="M 482 226 L 300 226 A 74 74 0 0 0 226 300 L 226 700 A 74 74 0 0 0 300 774 L 700 774 A 74 74 0 0 0 774 700 L 774 300 A 74 74 0 0 0 700 226 Z" />
    </clipPath>
  </defs>

  <!-- ── 1. Pure White Bed Inside the Squircle (Behind the atom and in the cross gaps) ── -->
  <!-- Cross gaps: vertical (482 to 518) and horizontal (482 to 518) inside the brackets -->
  <rect x="480" y="76" width="40" height="848" fill="{WHITE}" />
  <rect x="76" y="480" width="848" height="40" fill="{WHITE}" />
  <!-- Inner squircle opening -->
  <path d="M 500 226 L 700 226 A 74 74 0 0 1 774 300 L 774 700 A 74 74 0 0 1 700 774 L 300 774 A 74 74 0 0 1 226 700 L 226 300 A 74 74 0 0 1 300 226 Z" fill="{WHITE}" />

  <!-- ── 2. The 4 Symmetrical Deep Navy Brackets (Concentric Arcs, ZERO White Outer Halo) ── -->
  <!-- Top-Left Bracket -->
  <path d="M 482 76 L 300 76 A 224 224 0 0 0 76 300 L 76 482 L 226 482 L 226 300 A 74 74 0 0 1 300 226 L 482 226 Z" fill="{NAVY}" />

  <!-- Top-Right Bracket -->
  <path d="M 518 76 L 700 76 A 224 224 0 0 1 924 300 L 924 482 L 774 482 L 774 300 A 74 74 0 0 0 700 226 L 518 226 Z" fill="{NAVY}" />

  <!-- Bottom-Left Bracket -->
  <path d="M 76 518 L 76 700 A 224 224 0 0 0 300 924 L 482 924 L 482 774 L 300 774 A 74 74 0 0 1 226 700 L 226 518 Z" fill="{NAVY}" />

  <!-- Bottom-Right Bracket -->
  <path d="M 924 518 L 924 700 A 224 224 0 0 1 700 924 L 518 924 L 518 774 L 700 774 A 74 74 0 0 0 774 700 L 774 518 Z" fill="{NAVY}" />

  <!-- ── 3. Central Science Atom: Pure Geometric Curves ── -->
  <g id="atom-group" transform="translate(500, 500)">
    <!-- Orbit 1: Horizontal / -12 deg -->
    <ellipse cx="0" cy="0" rx="164" ry="72" transform="rotate(-12)" fill="none" stroke="{NAVY}" stroke-width="16" stroke-linecap="round" />
    
    <!-- Orbit 2: Tilted 48 deg -->
    <ellipse cx="0" cy="0" rx="164" ry="72" transform="rotate(48)" fill="none" stroke="{NAVY}" stroke-width="16" stroke-linecap="round" />

    <!-- Orbit 3: Tilted 108 deg -->
    <ellipse cx="0" cy="0" rx="164" ry="72" transform="rotate(108)" fill="none" stroke="{NAVY}" stroke-width="16" stroke-linecap="round" />

    <!-- Electron Nodes (Nodes on Orbits) -->
    <circle cx="-150" cy="-54" r="18" fill="{NAVY}" />
    <circle cx="110" cy="-118" r="18" fill="{NAVY}" />
    <circle cx="-16" cy="150" r="18" fill="{NAVY}" />
    <circle cx="-14" cy="-150" r="18" fill="{NAVY}" />

    <!-- Central Solid Core Nucleus in Official CSEEL Golden Amber (#F8A130) -->
    <circle cx="0" cy="0" r="58" fill="{GOLD}" />
  </g>
</svg>'''

# Save vector SVG
os.makedirs('public/images/cseel_logo_variants', exist_ok=True)
with open('public/images/cseel-emblem.svg', 'w', encoding='utf-8') as f:
    f.write(svg_flawless)
with open('public/favicon.svg', 'w', encoding='utf-8') as f:
    f.write(svg_flawless)

artifact_dir = r'C:\Users\DEVENDER\.gemini\antigravity\brain\2dd31d9b-3f2c-4247-9319-6d3e04e1b616'
with open(os.path.join(artifact_dir, 'cseel_flawless_vector.svg'), 'w', encoding='utf-8') as f:
    f.write(svg_flawless)

# Render master 2048x2048 PNG with Chrome Headless for perfect anti-aliasing
chrome_path = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
html_path = os.path.abspath('temp_vector_render2.html')
with open(html_path, 'w', encoding='utf-8') as f:
    f.write(f'''<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:transparent;overflow:hidden;width:2048px;height:2048px;">
<div style="width:2048px;height:2048px;">
{svg_flawless.replace('width="1000" height="1000"', 'width="2048" height="2048"')}
</div>
</body>
</html>''')

master_2048 = os.path.abspath('public/images/cseel_logo_variants/master_2048.png')
cmd = [
    chrome_path,
    '--headless',
    '--disable-gpu',
    '--window-size=2048,2048',
    '--default-background-color=00000000',
    f'--screenshot={master_2048}',
    html_path
]
subprocess.run(cmd, check=True)

# Downscale from 2048x2048 to 1024x1024 with Lanczos for sub-pixel anti-aliasing
img_2048 = Image.open(master_2048).convert('RGBA')
img_1024 = img_2048.resize((1024, 1024), Image.Resampling.LANCZOS)

# Crop tightly to the brackets (x from 74 to 926, y from 74 to 926)
crop_box = (74, 74, 926, 926)
cropped = img_1024.crop(crop_box)
cw, ch = cropped.size

# Square canvas with transparent background
square_emblem = Image.new('RGBA', (cw, ch), (255, 255, 255, 0))
square_emblem.paste(cropped, (0, 0))

# Save emblem
square_emblem.save('public/images/cseel_logo_variants/cseel_flawless_smooth_emblem.png')
square_emblem.save(os.path.join(artifact_dir, 'cseel_flawless_smooth_emblem.png'))
square_emblem.save('public/images/cseel-emblem.png')

# ── Update public/images/logo.png (Main Website Logo Banner) ──
orig_banner = Image.open('public/images/logo_backup.png').convert('RGBA')
orig_w, orig_h = orig_banner.size
right_part = orig_banner.crop((290, 0, orig_w, orig_h))

TARGET_SIZE = 274
icon_large = square_emblem.resize((TARGET_SIZE, TARGET_SIZE), Image.Resampling.LANCZOS)

final_logo = Image.new('RGBA', (orig_w, orig_h), (255, 255, 255, 255))
icon_x = (292 - TARGET_SIZE) // 2
icon_y = (orig_h - TARGET_SIZE) // 2

final_logo.paste(icon_large, (icon_x, icon_y), icon_large)
final_logo.paste(right_part, (290, 0), right_part)

final_logo.convert('RGB').save('public/images/logo.png')
final_logo.save(os.path.join(artifact_dir, 'cseel_final_flawless_logo.png'))

# ── Update All Favicons ──
square_emblem.resize((512, 512), Image.Resampling.LANCZOS).save('public/icon.png')
square_emblem.resize((512, 512), Image.Resampling.LANCZOS).save('src/app/icon.png')
square_emblem.resize((180, 180), Image.Resampling.LANCZOS).save('public/apple-touch-icon.png')
square_emblem.resize((180, 180), Image.Resampling.LANCZOS).save('src/app/apple-icon.png')
square_emblem.resize((32, 32), Image.Resampling.LANCZOS).save('public/favicon-32x32.png')
square_emblem.resize((16, 16), Image.Resampling.LANCZOS).save('public/favicon-16x16.png')
square_emblem.save('public/favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
square_emblem.save('src/app/favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])

print("Flawless vector curves generated with 0 white edge halo!")
