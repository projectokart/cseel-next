import subprocess
import os
from PIL import Image

NAVY = "#0A4B69"       # Exact CSEEL Navy from website text
GOLD = "#F8A130"       # Exact CSEEL Golden Amber
WHITE = "#FFFFFF"

# ── 100% Vector SVG: Pristine Mathematical Geometry ──
# ViewBox: 0 0 1000 1000
# Center: 500, 500
# 4 Brackets: from 80 to 920 (width 840, height 840)
# Outer corner radius: 220, inner radius: 80, thickness: 140
# Gaps: 36px (from 482 to 518)
# Thin pure white outer border: 8px stroke around squircle
svg_vector = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <defs>
    <filter id="crisp-render" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-opacity="0.04" />
    </filter>
  </defs>

  <!-- Solid pure white inner background inside squircle -->
  <path d="M 500 70 L 700 70 A 230 230 0 0 1 930 300 L 930 700 A 230 230 0 0 1 700 930 L 300 930 A 230 230 0 0 1 70 700 L 70 300 A 230 230 0 0 1 300 70 Z" fill="{WHITE}" />

  <!-- Thin pure white outer border stroke (6px) -->
  <path d="M 500 70 L 700 70 A 230 230 0 0 1 930 300 L 930 700 A 230 230 0 0 1 700 930 L 300 930 A 230 230 0 0 1 70 700 L 70 300 A 230 230 0 0 1 300 70 Z" fill="none" stroke="{WHITE}" stroke-width="8" />

  <!-- ── 4 Razor-Sharp Deep Navy Corner Brackets ── -->
  <!-- Top-Left -->
  <path d="M 482 76 L 300 76 A 224 224 0 0 0 76 300 L 76 482 L 226 482 L 226 300 A 74 74 0 0 1 300 226 L 482 226 Z" fill="{NAVY}" />

  <!-- Top-Right -->
  <path d="M 518 76 L 700 76 A 224 224 0 0 1 924 300 L 924 482 L 774 482 L 774 300 A 74 74 0 0 0 700 226 L 518 226 Z" fill="{NAVY}" />

  <!-- Bottom-Left -->
  <path d="M 76 518 L 76 700 A 224 224 0 0 0 300 924 L 482 924 L 482 774 L 300 774 A 74 74 0 0 1 226 700 L 226 518 Z" fill="{NAVY}" />

  <!-- Bottom-Right -->
  <path d="M 924 518 L 924 700 A 224 224 0 0 1 700 924 L 518 924 L 518 774 L 700 774 A 74 74 0 0 0 774 700 L 774 518 Z" fill="{NAVY}" />

  <!-- ── Central Science Atom: Pure Vectors ── -->
  <g id="atom-group" transform="translate(500, 500)">
    <!-- Orbit 1: Horizontal / -12 deg (Smooth ellipse, 16px stroke) -->
    <ellipse cx="0" cy="0" rx="162" ry="70" transform="rotate(-12)" fill="none" stroke="{NAVY}" stroke-width="16" stroke-linecap="round" />
    
    <!-- Orbit 2: Tilted 48 deg -->
    <ellipse cx="0" cy="0" rx="162" ry="70" transform="rotate(48)" fill="none" stroke="{NAVY}" stroke-width="16" stroke-linecap="round" />

    <!-- Orbit 3: Tilted 108 deg -->
    <ellipse cx="0" cy="0" rx="162" ry="70" transform="rotate(108)" fill="none" stroke="{NAVY}" stroke-width="16" stroke-linecap="round" />

    <!-- Electron Nodes (Spheres on Orbits) -->
    <circle cx="-148" cy="-52" r="18" fill="{NAVY}" />
    <circle cx="108" cy="-116" r="18" fill="{NAVY}" />
    <circle cx="-16" cy="148" r="18" fill="{NAVY}" />
    <circle cx="-14" cy="-148" r="18" fill="{NAVY}" />

    <!-- Central Solid Core Nucleus: Large, vibrant CSEEL Golden Amber circle -->
    <circle cx="0" cy="0" r="58" fill="{GOLD}" />
  </g>
</svg>'''

# Save vector SVG
os.makedirs('public/images/cseel_logo_variants', exist_ok=True)
with open('public/images/cseel-emblem.svg', 'w', encoding='utf-8') as f:
    f.write(svg_vector)
with open('public/favicon.svg', 'w', encoding='utf-8') as f:
    f.write(svg_vector)

artifact_dir = r'C:\Users\DEVENDER\.gemini\antigravity\brain\2dd31d9b-3f2c-4247-9319-6d3e04e1b616'
with open(os.path.join(artifact_dir, 'cseel_vector_emblem.svg'), 'w', encoding='utf-8') as f:
    f.write(svg_vector)

# Render 1024x1024 master PNG using Chrome Headless for sub-pixel anti-aliasing
chrome_path = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
html_path = os.path.abspath('temp_vector_render.html')
with open(html_path, 'w', encoding='utf-8') as f:
    f.write(f'<!DOCTYPE html><html><body style="margin:0;padding:0;background:transparent;overflow:hidden;width:1000px;height:1000px;">{svg_vector}</body></html>')

master_png = os.path.abspath('public/images/cseel_logo_variants/cseel_vector_emblem_1024.png')
cmd = [
    chrome_path,
    '--headless',
    '--disable-gpu',
    '--window-size=1000,1000',
    '--default-background-color=00000000',
    f'--screenshot={master_png}',
    html_path
]
subprocess.run(cmd, check=True)

emblem_im = Image.open(master_png).convert('RGBA')

# Crop tightly to the outer squircle (x: 66 to 934, y: 66 to 934)
crop_box = (64, 64, 936, 936)
cropped_emblem = emblem_im.crop(crop_box)
cw, ch = cropped_emblem.size

square_emblem = Image.new('RGBA', (cw, ch), (255, 255, 255, 0))
square_emblem.paste(cropped_emblem, (0, 0))
square_emblem.save('public/images/cseel-emblem.png')
square_emblem.save(os.path.join(artifact_dir, 'cseel_vector_cropped.png'))

# ── Update public/images/logo.png (Main Website Logo Banner) ──
orig_banner = Image.open('public/images/logo_backup.png').convert('RGBA')
orig_w, orig_h = orig_banner.size
right_part = orig_banner.crop((290, 0, orig_w, orig_h))

# Large size: 274px tall
TARGET_SIZE = 274
icon_large = square_emblem.resize((TARGET_SIZE, TARGET_SIZE), Image.Resampling.LANCZOS)

final_logo = Image.new('RGBA', (orig_w, orig_h), (255, 255, 255, 255))
icon_x = (292 - TARGET_SIZE) // 2
icon_y = (orig_h - TARGET_SIZE) // 2

final_logo.paste(icon_large, (icon_x, icon_y), icon_large)
final_logo.paste(right_part, (290, 0), right_part)

final_logo.convert('RGB').save('public/images/logo.png')
final_logo.save(os.path.join(artifact_dir, 'cseel_final_vector_logo.png'))

# ── Update All Favicons ──
square_emblem.resize((512, 512), Image.Resampling.LANCZOS).save('public/icon.png')
square_emblem.resize((512, 512), Image.Resampling.LANCZOS).save('src/app/icon.png')
square_emblem.resize((180, 180), Image.Resampling.LANCZOS).save('public/apple-touch-icon.png')
square_emblem.resize((180, 180), Image.Resampling.LANCZOS).save('src/app/apple-icon.png')
square_emblem.resize((32, 32), Image.Resampling.LANCZOS).save('public/favicon-32x32.png')
square_emblem.resize((16, 16), Image.Resampling.LANCZOS).save('public/favicon-16x16.png')
square_emblem.save('public/favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
square_emblem.save('src/app/favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])

print("Vector logo and emblem rendered with pristine mathematical quality!")
