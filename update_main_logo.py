import numpy as np
from PIL import Image
import os
import shutil

src_path = r'C:\Users\DEVENDER\.gemini\antigravity\brain\2dd31d9b-3f2c-4247-9319-6d3e04e1b616\.user_uploaded\media_1791024642916.png'
base_img = Image.open(src_path).convert('RGBA')
arr = np.array(base_img, dtype=np.float32)

H, W, _ = arr.shape
Y, X = np.ogrid[:H, :W]

dist_center = np.sqrt((X - 512)**2 + (Y - 512)**2)

mask_nucleus = (dist_center <= 68) & (arr[:, :, 3] > 180) & ~(
    (arr[:, :, 0] > 235) & (arr[:, :, 1] > 235) & (arr[:, :, 2] > 235)
)

mask_atom = (dist_center <= 270) & (dist_center > 68) & (arr[:, :, 3] > 180) & ~(
    (arr[:, :, 0] > 235) & (arr[:, :, 1] > 235) & (arr[:, :, 2] > 235)
)

mask_quadrants = (dist_center > 270) & (arr[:, :, 3] > 180) & ~(
    (arr[:, :, 0] > 235) & (arr[:, :, 1] > 235) & (arr[:, :, 2] > 235)
)

def hex_to_rgb(hex_str):
    hex_str = hex_str.lstrip('#')
    return np.array([int(hex_str[i:i+2], 16) for i in (0, 2, 4)], dtype=np.float32)

# Exact colors from CSEEL logo.png text & original nucleus:
CSEEL_NAVY_RGB = hex_to_rgb("#0A4B69")   # Exact navy of 'CSEEL' letters
CSEEL_GOLD_RGB = hex_to_rgb("#F8A130")   # Exact golden amber of original nucleus
WHITE_RGB = np.array([255, 255, 255], dtype=np.float32)

out = arr.copy()

# 1. Quadrants in CSEEL exact Navy
color_dist_q = np.sqrt(
    (255 - arr[mask_quadrants, 0])**2 + 
    (255 - arr[mask_quadrants, 1])**2 + 
    (255 - arr[mask_quadrants, 2])**2
) / 441.67
factor_q = np.clip(color_dist_q * 1.5, 0.0, 1.0)[:, None]
out[mask_quadrants, :3] = factor_q * CSEEL_NAVY_RGB + (1.0 - factor_q) * WHITE_RGB

# 2. Orbits & Nodes in CSEEL exact Navy
color_dist_a = np.sqrt(
    (255 - arr[mask_atom, 0])**2 + 
    (255 - arr[mask_atom, 1])**2 + 
    (255 - arr[mask_atom, 2])**2
) / 441.67
factor_a = np.clip(color_dist_a * 1.5, 0.0, 1.0)[:, None]
out[mask_atom, :3] = factor_a * CSEEL_NAVY_RGB + (1.0 - factor_a) * WHITE_RGB

# 3. Nucleus in CSEEL exact Golden Amber
color_dist_n = np.sqrt(
    (255 - arr[mask_nucleus, 0])**2 + 
    (255 - arr[mask_nucleus, 1])**2 + 
    (255 - arr[mask_nucleus, 2])**2
) / 441.67
factor_n = np.clip(color_dist_n * 1.5, 0.0, 1.0)[:, None]
out[mask_nucleus, :3] = factor_n * CSEEL_GOLD_RGB + (1.0 - factor_n) * WHITE_RGB

emblem_exact = Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))

# Load original logo banner
orig = Image.open('public/images/logo_backup.png').convert('RGBA')
orig_w, orig_h = orig.size
right_part = orig.crop((290, 0, orig_w, orig_h))

# Composite into final logo.png
emblem_size = 265
resized_emblem = emblem_exact.resize((emblem_size, emblem_size), Image.Resampling.LANCZOS)

final_logo = Image.new('RGBA', (orig_w, orig_h), (255, 255, 255, 255))
emblem_x = (290 - emblem_size) // 2
emblem_y = (orig_h - emblem_size) // 2
final_logo.paste(resized_emblem, (emblem_x, emblem_y), resized_emblem)
final_logo.paste(right_part, (290, 0), right_part)

# Save as primary public/images/logo.png
final_logo.convert('RGB').save('public/images/logo.png')

# Save to artifacts directory
artifact_dir = r'C:\Users\DEVENDER\.gemini\antigravity\brain\2dd31d9b-3f2c-4247-9319-6d3e04e1b616'
final_logo.save(os.path.join(artifact_dir, 'cseel_final_updated_logo.png'))

print("Primary logo.png updated with exact color harmony!")
