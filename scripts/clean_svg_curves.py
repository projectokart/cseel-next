import glob
import re
import os
from playwright.sync_api import sync_playwright
from PIL import Image

DIR = 'cseel-next/public/email_assets/school_template'
svg_files = glob.glob(f'{DIR}/*.svg')

patterns = [
    r'<path[^>]*d="M70 120 q-14 18 0 40"[^>]*/>\s*',
    r'<path[^>]*d="M450 120 q14 18 0 40"[^>]*/>\s*',
    r'<path[^>]*d="M60 110 q-22 28 0 60"[^>]*/>\s*',
    r'<path[^>]*d="M460 110 q22 28 0 60"[^>]*/>\s*'
]

modified = []
for sf in svg_files:
    with open(sf, 'r', encoding='utf-8') as f:
        content = f.read()
    orig = content
    for p in patterns:
        content = re.sub(p, '', content)
    if content != orig:
        with open(sf, 'w', encoding='utf-8') as f:
            f.write(content)
        modified.append(sf)

print(f"Cleaned {len(modified)} SVGs on disk: {[os.path.basename(s) for s in modified]}")

if modified:
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1040, "height": 520}, device_scale_factor=2)
        for sf in modified:
            with open(sf, 'r', encoding='utf-8') as f:
                svg_content = f.read()
            html_content = f"""<!DOCTYPE html>
<html>
<head>
  <style>
    body {{ margin: 0; padding: 0; background: transparent; overflow: hidden; }}
    svg {{ width: 100vw; height: 100vh; display: block; }}
  </style>
</head>
<body>
  {svg_content}
</body>
</html>"""
            page.set_content(html_content)
            page.wait_for_timeout(250)
            png_path = sf.replace('.svg', '.png')
            page.screenshot(path=png_path, omit_background=True)
            print(f"Re-rendered clean PNG: {os.path.basename(png_path)}")
        browser.close()

# Re-generate preview collage
files = [
    'hero-offline.png', 'error-02-not-found.png', 'error-03-social-only.png',
    'error-04-no-ssl.png', 'error-05-single-page.png', 'error-06-slow-updates.png',
    'restore-live.png', 'agency-cost.png', 'direct-benefits.png',
    'cbse-compliance.png', 'virtual-tour-360.png', 'zero-risk-guarantee.png'
]

w, h = 1040, 520
grid_w, grid_h = 3, 4
collage = Image.new('RGB', (w * grid_w, h * grid_h), (255, 255, 255))

for i, fn in enumerate(files):
    img_path = os.path.join(DIR, fn)
    if os.path.exists(img_path):
        im = Image.open(img_path).convert('RGBA')
        if im.size != (w, h):
            im = im.resize((w, h), Image.Resampling.LANCZOS)
        bg = Image.new('RGBA', im.size, (255, 255, 255))
        bg.paste(im, (0, 0), im)
        col = i % grid_w
        row = i // grid_w
        collage.paste(bg.convert('RGB'), (col * w, row * h))

out_path = r'C:\Users\DEVENDER\.gemini\antigravity\brain\2dd31d9b-3f2c-4247-9319-6d3e04e1b616\all_illustrations_preview.png'
collage.save(out_path)
print("Updated all_illustrations_preview.png saved successfully!")
