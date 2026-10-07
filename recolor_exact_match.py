import numpy as np
from PIL import Image
import os
import shutil

src_path = r'C:\Users\DEVENDER\.gemini\antigravity\brain\2dd31d9b-3f2c-4247-9319-6d3e04e1b616\.user_uploaded\media_1791082509157.png'
base_img = Image.open(src_path).convert('RGBA')
arr = np.array(base_img, dtype=np.float32)

H, W, _ = arr.shape
Y, X = np.ogrid[:H, :W]

CX, CY = 510.0, 502.5
dist_center = np.sqrt((X - CX)**2 + (Y - CY)**2)

# EXACT CSEEL BRAND COLORS FROM LOGO_BACKUP.PNG:
# CSEEL Wordmark Navy: RGB (10, 75, 105) -> #0A4B69
CSEEL_NAVY = np.array([10.0, 75.0, 105.0], dtype=np.float32)
# CSEEL Golden Amber Nucleus: RGB (248, 161, 48) -> #F8A130
CSEEL_GOLD = np.array([248.0, 161.0, 48.0], dtype=np.float32)
WHITE = np.array([255.0, 255.0, 255.0], dtype=np.float32)

# Identify regions:
# 1. Navy pixels in media_1791082509157.png (brackets + atom orbits + electron dots)
is_navy = (arr[:, :, 3] > 60) & (arr[:, :, 0] < 80) & (arr[:, :, 1] < 140) & (arr[:, :, 2] > 60)

# 2. Golden Nucleus in center (radius <= 85)
is_gold = (dist_center <= 85) & (arr[:, :, 0] > 180) & (arr[:, :, 1] > 100) & (arr[:, :, 2] < 90)

# 3. Outer exterior (outside the 4 brackets):
is_exterior = (X < 98) | (X > 922) | (Y < 117) | (Y > 888)
# Outside the 4 rounded corners:
is_exterior |= (X < 318) & (Y < 337) & (np.sqrt((X - 318)**2 + (Y - 337)**2) > 220)
is_exterior |= (X > 702) & (Y < 337) & (np.sqrt((X - 702)**2 + (Y - 337)**2) > 220)
is_exterior |= (X < 318) & (Y > 668) & (np.sqrt((X - 318)**2 + (Y - 668)**2) > 220)
is_exterior |= (X > 702) & (Y > 668) & (np.sqrt((X - 702)**2 + (Y - 668)**2) > 220)

out = arr.copy()

# Recolor all navy pixels to EXACT CSEEL_NAVY [10, 75, 105] with antialiasing preservation
# For smooth transition on edges:
# Calculate darkness relative to white
darkness = np.clip((255.0 - arr[is_navy, :3].mean(axis=1)) / 180.0, 0.0, 1.0)[:, None]
out[is_navy, :3] = darkness * CSEEL_NAVY + (1.0 - darkness) * WHITE

# Recolor gold nucleus to EXACT CSEEL_GOLD [248, 161, 48]
gold_darkness = np.clip((arr[is_gold, 0] - 80.0) / 160.0, 0.0, 1.0)[:, None]
out[is_gold, :3] = gold_darkness * CSEEL_GOLD + (1.0 - gold_darkness) * WHITE

# Make exterior 100% transparent (no outer white boundary)
out[is_exterior, 3] = 0

# Clean up any faint fringe right at the exterior boundary
edge_fringe = ~is_exterior & (
    (X <= 101) | (X >= 919) | (Y <= 120) | (Y >= 885)
) & ~is_navy
out[edge_fringe, 3] = 0

clean_img = Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))

# Crop tightly to the 4 navy brackets: x in [98, 922], y in [117, 888]
cropped = clean_img.crop((97, 116, 923, 889))
cw, ch = cropped.size

# Square canvas
max_dim = max(cw, ch)
square_emblem = Image.new('RGBA', (max_dim, max_dim), (255, 255, 255, 0))
square_emblem.paste(cropped, ((max_dim - cw) // 2, (max_dim - ch) // 2))

# Save the exact matched emblem
artifact_dir = r'C:\Users\DEVENDER\.gemini\antigravity\brain\2dd31d9b-3f2c-4247-9319-6d3e04e1b616'
os.makedirs('public/images/cseel_logo_variants', exist_ok=True)

square_emblem.save('public/images/cseel_logo_variants/cseel_exact_color_match_emblem.png')
square_emblem.save(os.path.join(artifact_dir, 'cseel_exact_color_match_emblem.png'))
square_emblem.save('public/images/cseel-emblem.png')
square_emblem.save(os.path.join(artifact_dir, 'cseel-emblem.png'))

# ── Update public/images/logo.png with the exact color matched emblem ──
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
final_logo.save(os.path.join(artifact_dir, 'cseel_final_exact_color_logo.png'))

# ── Update Favicons ──
square_emblem.resize((512, 512), Image.Resampling.LANCZOS).save('public/icon.png')
square_emblem.resize((512, 512), Image.Resampling.LANCZOS).save('src/app/icon.png')
square_emblem.resize((180, 180), Image.Resampling.LANCZOS).save('public/apple-touch-icon.png')
square_emblem.resize((180, 180), Image.Resampling.LANCZOS).save('src/app/apple-icon.png')
square_emblem.resize((32, 32), Image.Resampling.LANCZOS).save('public/favicon-32x32.png')
square_emblem.resize((16, 16), Image.Resampling.LANCZOS).save('public/favicon-16x16.png')
square_emblem.save('public/favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
square_emblem.save('src/app/favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])

print("Color exact match completed! Emblem RGB = (10, 75, 105), matching CSEEL text!")
