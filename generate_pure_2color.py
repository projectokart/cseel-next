import numpy as np
from PIL import Image
import os
import subprocess

src_path = r'C:\Users\DEVENDER\.gemini\antigravity\brain\2dd31d9b-3f2c-4247-9319-6d3e04e1b616\.user_uploaded\media_1791024642916.png'
base_img = Image.open(src_path).convert('RGBA')
arr = np.array(base_img, dtype=np.float32)

H, W, _ = arr.shape
Y, X = np.ogrid[:H, :W]

# All 4 colored quadrant blocks:
# Everything that is NOT white (R<230 or G<230 or B<230) and has high opacity (A>150)
# And is OUTSIDE the central atom area (dist_center > 270)
dist_center = np.sqrt((X - 512)**2 + (Y - 512)**2)

# Quadrant pixels
is_quadrant = (dist_center > 270) & (arr[:, :, 3] > 180) & ~(
    (arr[:, :, 0] > 235) & (arr[:, :, 1] > 235) & (arr[:, :, 2] > 235)
)

# Central atom lines + nucleus
is_atom = (dist_center <= 270) & (arr[:, :, 3] > 180) & ~(
    (arr[:, :, 0] > 235) & (arr[:, :, 1] > 235) & (arr[:, :, 2] > 235)
)

def hex_to_rgb(hex_str):
    hex_str = hex_str.lstrip('#')
    return np.array([int(hex_str[i:i+2], 16) for i in (0, 2, 4)], dtype=np.float32)

def generate_pure_2color(navy_hex, filename):
    out = arr.copy()
    navy_rgb = hex_to_rgb(navy_hex)
    
    # Anti-aliasing edge blend:
    # Measure darkness of source pixel relative to white (255 - avg_color) / 255
    # For quadrant pixels:
    for mask in [is_quadrant, is_atom]:
        # Darkness factor (0 = pure white, 1 = fully colored/black)
        color_dist = np.sqrt(
            (255 - arr[mask, 0])**2 + 
            (255 - arr[mask, 1])**2 + 
            (255 - arr[mask, 2])**2
        ) / 441.67 # max sqrt(3 * 255^2)
        
        # Smooth alpha blend with navy
        factor = np.clip(color_dist * 1.5, 0.0, 1.0)[:, None]
        out[mask, :3] = factor * navy_rgb + (1.0 - factor) * np.array([255, 255, 255], dtype=np.float32)

    img_out = Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))
    img_out.save(filename)
    return img_out

artifact_dir = r'C:\Users\DEVENDER\.gemini\antigravity\brain\2dd31d9b-3f2c-4247-9319-6d3e04e1b616'

# 1. Pure Uniform Deep Navy (#0D4979) + White
generate_pure_2color("#0D4979", "public/images/cseel_logo_variants/cseel_pure_2color_navy_0D4979.png")
generate_pure_2color("#0D4979", os.path.join(artifact_dir, "cseel_pure_2color_navy_0D4979.png"))

# 2. Pure Uniform CSEEL Heading Blue (#003C6E) + White
generate_pure_2color("#003C6E", "public/images/cseel_logo_variants/cseel_pure_2color_navy_003C6E.png")
generate_pure_2color("#003C6E", os.path.join(artifact_dir, "cseel_pure_2color_navy_003C6E.png"))

# 3. Pure Uniform CSEEL Brand Navy (#005689) + White
generate_pure_2color("#005689", "public/images/cseel_logo_variants/cseel_pure_2color_navy_005689.png")
generate_pure_2color("#005689", os.path.join(artifact_dir, "cseel_pure_2color_navy_005689.png"))

# 4. Pure Vector SVG version (Infinite scalable resolution, zero compression)
svg_2color = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <!-- Outer Rounded White Card / Badge -->
  <rect x="50" y="50" width="900" height="900" rx="280" fill="#FFFFFF" stroke="#F1F5F9" stroke-width="6" />

  <!-- ── Four Symmetrical Deep Navy Squircle Segments (#003C6E) ── -->
  <!-- Top-Left -->
  <path d="M 465 130 L 350 130 A 220 220 0 0 0 130 350 L 130 465 L 255 465 L 255 350 A 95 95 0 0 1 350 255 L 465 255 Z" fill="#003C6E" />

  <!-- Top-Right -->
  <path d="M 535 130 L 650 130 A 220 220 0 0 1 870 350 L 870 465 L 745 465 L 745 350 A 95 95 0 0 0 650 255 L 535 255 Z" fill="#003C6E" />

  <!-- Bottom-Left -->
  <path d="M 130 535 L 130 650 A 220 220 0 0 0 350 870 L 465 870 L 465 745 L 350 745 A 95 95 0 0 1 255 650 L 255 535 Z" fill="#003C6E" />

  <!-- Bottom-Right -->
  <path d="M 870 535 L 870 650 A 220 220 0 0 1 650 870 L 535 870 L 535 745 L 650 745 A 95 95 0 0 0 745 650 L 745 535 Z" fill="#003C6E" />

  <!-- ── Central Science Atom in Deep Navy (#003C6E) ── -->
  <g id="atom-group" transform="translate(500, 500)">
    <!-- Orbit 1 (Horizontal / -15 deg) -->
    <ellipse cx="0" cy="0" rx="160" ry="68" transform="rotate(-15)" fill="none" stroke="#003C6E" stroke-width="15" stroke-linecap="round" />
    
    <!-- Orbit 2 (Tilted 48 deg) -->
    <ellipse cx="0" cy="0" rx="160" ry="68" transform="rotate(48)" fill="none" stroke="#003C6E" stroke-width="15" stroke-linecap="round" />

    <!-- Orbit 3 (Tilted 112 deg) -->
    <ellipse cx="0" cy="0" rx="160" ry="68" transform="rotate(112)" fill="none" stroke="#003C6E" stroke-width="15" stroke-linecap="round" />

    <!-- Electron Nodes (Nodes on orbits) -->
    <circle cx="-146" cy="-48" r="17" fill="#003C6E" />
    <circle cx="106" cy="-114" r="17" fill="#003C6E" />
    <circle cx="-16" cy="144" r="17" fill="#003C6E" />
    <circle cx="-14" cy="-144" r="17" fill="#003C6E" />

    <!-- Central Solid Core Nucleus -->
    <circle cx="0" cy="0" r="52" fill="#003C6E" />
  </g>
</svg>'''

with open("public/images/cseel-emblem-2color.svg", "w", encoding="utf-8") as f:
    f.write(svg_2color)
with open(os.path.join(artifact_dir, "cseel-emblem-2color.svg"), "w", encoding="utf-8") as f:
    f.write(svg_2color)

# Also create transparent background SVG (no outer white rect)
svg_transparent = svg_2color.replace('<rect x="50" y="50" width="900" height="900" rx="280" fill="#FFFFFF" stroke="#F1F5F9" stroke-width="6" />', '')
with open("public/images/cseel-emblem-2color-transparent.svg", "w", encoding="utf-8") as f:
    f.write(svg_transparent)
with open(os.path.join(artifact_dir, "cseel-emblem-2color-transparent.svg"), "w", encoding="utf-8") as f:
    f.write(svg_transparent)

print("Pure 2-color logos generated successfully!")
