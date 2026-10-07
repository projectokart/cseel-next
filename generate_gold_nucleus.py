import numpy as np
from PIL import Image
import os
import shutil

src_path = r'C:\Users\DEVENDER\.gemini\antigravity\brain\2dd31d9b-3f2c-4247-9319-6d3e04e1b616\.user_uploaded\media_1791024642916.png'
base_img = Image.open(src_path).convert('RGBA')
arr = np.array(base_img, dtype=np.float32)

H, W, _ = arr.shape
Y, X = np.ogrid[:H, :W]

# Distances from center
dist_center = np.sqrt((X - 512)**2 + (Y - 512)**2)

# Central Nucleus: exact circle in center (radius ~65)
mask_nucleus = (dist_center <= 68) & (arr[:, :, 3] > 180) & ~(
    (arr[:, :, 0] > 235) & (arr[:, :, 1] > 235) & (arr[:, :, 2] > 235)
)

# Atom Orbits and electron dots (excluding the center nucleus circle)
mask_atom = (dist_center <= 270) & (dist_center > 68) & (arr[:, :, 3] > 180) & ~(
    (arr[:, :, 0] > 235) & (arr[:, :, 1] > 235) & (arr[:, :, 2] > 235)
)

# 4 Quadrant Brackets
mask_quadrants = (dist_center > 270) & (arr[:, :, 3] > 180) & ~(
    (arr[:, :, 0] > 235) & (arr[:, :, 1] > 235) & (arr[:, :, 2] > 235)
)

def hex_to_rgb(hex_str):
    hex_str = hex_str.lstrip('#')
    return np.array([int(hex_str[i:i+2], 16) for i in (0, 2, 4)], dtype=np.float32)

# Colors
NAVY_RGB = hex_to_rgb("#003C6E")        # Deep Navy Blue
GOLD_RGB = hex_to_rgb("#F8A130")        # CSEEL Official Logo Golden Amber
WHITE_RGB = np.array([255, 255, 255], dtype=np.float32)

out = arr.copy()

# 1. Apply Deep Navy Blue to 4 Quadrants
color_dist_q = np.sqrt(
    (255 - arr[mask_quadrants, 0])**2 + 
    (255 - arr[mask_quadrants, 1])**2 + 
    (255 - arr[mask_quadrants, 2])**2
) / 441.67
factor_q = np.clip(color_dist_q * 1.5, 0.0, 1.0)[:, None]
out[mask_quadrants, :3] = factor_q * NAVY_RGB + (1.0 - factor_q) * WHITE_RGB

# 2. Apply Deep Navy Blue to Atom Orbits and Electron Nodes
color_dist_a = np.sqrt(
    (255 - arr[mask_atom, 0])**2 + 
    (255 - arr[mask_atom, 1])**2 + 
    (255 - arr[mask_atom, 2])**2
) / 441.67
factor_a = np.clip(color_dist_a * 1.5, 0.0, 1.0)[:, None]
out[mask_atom, :3] = factor_a * NAVY_RGB + (1.0 - factor_a) * WHITE_RGB

# 3. Apply CSEEL Golden Amber to Central Nucleus
color_dist_n = np.sqrt(
    (255 - arr[mask_nucleus, 0])**2 + 
    (255 - arr[mask_nucleus, 1])**2 + 
    (255 - arr[mask_nucleus, 2])**2
) / 441.67
factor_n = np.clip(color_dist_n * 1.5, 0.0, 1.0)[:, None]
out[mask_nucleus, :3] = factor_n * GOLD_RGB + (1.0 - factor_n) * WHITE_RGB

img_badge = Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))

# Save badge PNG
artifact_dir = r'C:\Users\DEVENDER\.gemini\antigravity\brain\2dd31d9b-3f2c-4247-9319-6d3e04e1b616'
os.makedirs('public/images/cseel_logo_variants', exist_ok=True)

img_badge.save('public/images/cseel_logo_variants/cseel_navy_golden_nucleus_badge.png')
img_badge.save(os.path.join(artifact_dir, 'cseel_navy_golden_nucleus_badge.png'))
img_badge.save('public/images/cseel-emblem-gold-nucleus.png')
img_badge.save(os.path.join(artifact_dir, 'cseel-emblem-gold-nucleus.png'))

# Save transparent version (no outer white card)
arr_trans = out.copy()
white_mask = (out[:, :, 0] > 230) & (out[:, :, 1] > 230) & (out[:, :, 2] > 230)
arr_trans[white_mask, 3] = 0
semi_white = (out[:, :, 0] > 180) & (out[:, :, 1] > 180) & (out[:, :, 2] > 180) & ~white_mask
factor_t = 1.0 - (out[semi_white, :3].mean(axis=1) - 180) / (255 - 180)
arr_trans[semi_white, 3] = np.clip(arr_trans[semi_white, 3] * factor_t, 0, 255)

img_trans = Image.fromarray(arr_trans.astype(np.uint8))
img_trans.save('public/images/cseel_logo_variants/cseel_navy_golden_nucleus_transparent.png')
img_trans.save(os.path.join(artifact_dir, 'cseel_navy_golden_nucleus_transparent.png'))
img_trans.save('public/images/cseel-emblem-gold-nucleus-transparent.png')

# ── Update Vector SVG with Golden Nucleus ──
svg_content = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
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

  <!-- ── Central Science Atom: Deep Navy Orbits with CSEEL Golden Nucleus (#F8A130) ── -->
  <g id="atom-group" transform="translate(500, 500)">
    <!-- Orbit 1 (Horizontal / -15 deg) -->
    <ellipse cx="0" cy="0" rx="160" ry="68" transform="rotate(-15)" fill="none" stroke="#003C6E" stroke-width="15" stroke-linecap="round" />
    
    <!-- Orbit 2 (Tilted 48 deg) -->
    <ellipse cx="0" cy="0" rx="160" ry="68" transform="rotate(48)" fill="none" stroke="#003C6E" stroke-width="15" stroke-linecap="round" />

    <!-- Orbit 3 (Tilted 112 deg) -->
    <ellipse cx="0" cy="0" rx="160" ry="68" transform="rotate(112)" fill="none" stroke="#003C6E" stroke-width="15" stroke-linecap="round" />

    <!-- Electron Nodes (Nodes on orbits) in Deep Navy -->
    <circle cx="-146" cy="-48" r="17" fill="#003C6E" />
    <circle cx="106" cy="-114" r="17" fill="#003C6E" />
    <circle cx="-16" cy="144" r="17" fill="#003C6E" />
    <circle cx="-14" cy="-144" r="17" fill="#003C6E" />

    <!-- Central Solid Core Nucleus in Official CSEEL Golden Amber (#F8A130) -->
    <circle cx="0" cy="0" r="54" fill="#F8A130" />
  </g>
</svg>'''

with open('public/images/cseel-emblem.svg', 'w', encoding='utf-8') as f:
    f.write(svg_content)
with open(os.path.join(artifact_dir, 'cseel-emblem.svg'), 'w', encoding='utf-8') as f:
    f.write(svg_content)

print("Golden nucleus logo successfully generated and saved!")
