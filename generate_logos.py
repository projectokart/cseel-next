import os
import subprocess
import math

# Google Brand Colors
GOOGLE_BLUE = "#4285F4"
GOOGLE_RED = "#EA4335"
GOOGLE_YELLOW = "#FBBC05"
GOOGLE_GREEN = "#34A853"
DARK_SLATE = "#283035"

def make_svg(bg="white", atom_style="slate"):
    """
    Generates SVG logo with Google 4-color squircle frame and central atom.
    bg: 'white' or 'none' (transparent)
    atom_style: 'slate' (like Image 1) or 'google_colors' (like Image 2 multicolor)
    """
    
    bg_rect = f'<rect width="1000" height="1000" fill="{bg}" />' if bg != "none" else ''
    
    if atom_style == "slate":
        orbit1_stroke = DARK_SLATE
        orbit2_stroke = DARK_SLATE
        orbit3_stroke = DARK_SLATE
        dot1_fill = DARK_SLATE
        dot2_fill = DARK_SLATE
        dot3_fill = DARK_SLATE
        dot4_fill = DARK_SLATE
        nucleus_fill = DARK_SLATE
    else:
        # Google colored atom (Blue horizontal, Red vertical, etc.)
        orbit1_stroke = GOOGLE_BLUE
        orbit2_stroke = GOOGLE_RED
        orbit3_stroke = GOOGLE_GREEN
        dot1_fill = GOOGLE_BLUE
        dot2_fill = GOOGLE_RED
        dot3_fill = GOOGLE_GREEN
        dot4_fill = GOOGLE_YELLOW
        nucleus_fill = "#202124"

    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  {bg_rect}

  <!-- ── Four Google Quadrant Brackets ── -->
  <!-- Top-Left: Google Blue -->
  <path d="M 465 130 L 350 130 A 220 220 0 0 0 130 350 L 130 465 L 255 465 L 255 350 A 95 95 0 0 1 350 255 L 465 255 Z" fill="{GOOGLE_BLUE}" />

  <!-- Top-Right: Google Red -->
  <path d="M 535 130 L 650 130 A 220 220 0 0 1 870 350 L 870 465 L 745 465 L 745 350 A 95 95 0 0 0 650 255 L 535 255 Z" fill="{GOOGLE_RED}" />

  <!-- Bottom-Left: Google Yellow -->
  <path d="M 130 535 L 130 650 A 220 220 0 0 0 350 870 L 465 870 L 465 745 L 350 745 A 95 95 0 0 1 255 650 L 255 535 Z" fill="{GOOGLE_YELLOW}" />

  <!-- Bottom-Right: Google Green -->
  <path d="M 870 535 L 870 650 A 220 220 0 0 1 650 870 L 535 870 L 535 745 L 650 745 A 95 95 0 0 0 745 650 L 745 535 Z" fill="{GOOGLE_GREEN}" />

  <!-- ── Central Science Atom ── -->
  <g id="atom-group" transform="translate(500, 500)">
    <!-- Orbit 1 (tilted ~-15 deg) -->
    <ellipse cx="0" cy="0" rx="160" ry="68" transform="rotate(-15)" fill="none" stroke="{orbit1_stroke}" stroke-width="14" stroke-linecap="round" />
    
    <!-- Orbit 2 (tilted ~48 deg) -->
    <ellipse cx="0" cy="0" rx="160" ry="68" transform="rotate(48)" fill="none" stroke="{orbit2_stroke}" stroke-width="14" stroke-linecap="round" />

    <!-- Orbit 3 (tilted ~112 deg) -->
    <ellipse cx="0" cy="0" rx="160" ry="68" transform="rotate(112)" fill="none" stroke="{orbit3_stroke}" stroke-width="14" stroke-linecap="round" />

    <!-- Electron Sphere Nodes -->
    <!-- Node on Orbit 1 -->
    <circle cx="-146" cy="-48" r="16" fill="{dot1_fill}" />

    <!-- Node on Orbit 2 -->
    <circle cx="106" cy="-114" r="16" fill="{dot2_fill}" />

    <!-- Node on Orbit 3 (bottom-left) -->
    <circle cx="-16" cy="144" r="16" fill="{dot3_fill}" />

    <!-- Node on Orbit 3 (top-left) -->
    <circle cx="-14" cy="-144" r="16" fill="{dot4_fill}" />

    <!-- Central Solid Core Nucleus -->
    <circle cx="0" cy="0" r="50" fill="{nucleus_fill}" />
  </g>
</svg>'''
    return svg

def render_to_png(svg_path, png_path, size=1024):
    html_content = f'''<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body, html {{
      margin: 0;
      padding: 0;
      width: {size}px;
      height: {size}px;
      overflow: hidden;
      background: transparent;
    }}
    svg {{
      width: {size}px;
      height: {size}px;
      display: block;
    }}
  </style>
</head>
<body>
  {open(svg_path, 'r', encoding='utf-8').read()}
</body>
</html>'''
    html_path = svg_path.replace('.svg', '.html')
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html_content)

    chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    if not os.path.exists(chrome_path):
        chrome_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

    cmd = [
        chrome_path,
        "--headless",
        "--disable-gpu",
        f"--window-size={size},{size}",
        "--default-background-color=00000000",
        f"--screenshot={os.path.abspath(png_path)}",
        os.path.abspath(html_path)
    ]
    subprocess.run(cmd, check=True)
    print(f"Rendered: {png_path}")

os.makedirs('temp_logos', exist_ok=True)

# Generate variations:
# 1. Slate Atom (Exact Image 1 layout with Google colors) - White BG
svg1 = make_svg(bg="white", atom_style="slate")
with open('temp_logos/cseel_logo_google_white.svg', 'w', encoding='utf-8') as f:
    f.write(svg1)
render_to_png('temp_logos/cseel_logo_google_white.svg', 'temp_logos/cseel_logo_google_white.png')

# 2. Slate Atom - Transparent BG
svg2 = make_svg(bg="none", atom_style="slate")
with open('temp_logos/cseel_logo_google_transparent.svg', 'w', encoding='utf-8') as f:
    f.write(svg2)
render_to_png('temp_logos/cseel_logo_google_transparent.svg', 'temp_logos/cseel_logo_google_transparent.png')

# 3. Google Colored Atom (Multicolor orbits like Image 2) - Transparent BG
svg3 = make_svg(bg="none", atom_style="google_colors")
with open('temp_logos/cseel_logo_multicolor_transparent.svg', 'w', encoding='utf-8') as f:
    f.write(svg3)
render_to_png('temp_logos/cseel_logo_multicolor_transparent.svg', 'temp_logos/cseel_logo_multicolor_transparent.png')

# 4. Google Colored Atom - White BG
svg4 = make_svg(bg="white", atom_style="google_colors")
with open('temp_logos/cseel_logo_multicolor_white.svg', 'w', encoding='utf-8') as f:
    f.write(svg4)
render_to_png('temp_logos/cseel_logo_multicolor_white.svg', 'temp_logos/cseel_logo_multicolor_white.png')

print("All logos generated successfully!")
