import numpy as np
from PIL import Image
import os
import shutil

src_path = r'C:\Users\DEVENDER\.gemini\antigravity\brain\2dd31d9b-3f2c-4247-9319-6d3e04e1b616\.user_uploaded\media_1791082509157.png'
base_img = Image.open(src_path).convert('RGBA')
arr = np.array(base_img, dtype=np.uint8)

H, W, _ = arr.shape
Y, X = np.ogrid[:H, :W]

# Center of brackets in this image:
# x in [98, 922] -> cx = 510
# y in [117, 888] -> cy = 502.5
CX, CY = 510.0, 502.5
dist_center = np.sqrt((X - CX)**2 + (Y - CY)**2)

# Navy pixels (brackets + atom)
is_navy = (arr[:, :, 3] > 80) & (arr[:, :, 0] < 50) & (arr[:, :, 1] < 120) & (arr[:, :, 2] > 70)

# Golden Nucleus pixels
is_gold = (dist_center <= 85) & (arr[:, :, 0] > 180) & (arr[:, :, 1] > 100) & (arr[:, :, 2] < 90)

# Outer limits of the navy brackets:
# Top edge: y = 117, Bottom edge: y = 888
# Left edge: x = 98, Right edge: x = 922
# And outside the rounded corners:
# Outer corner radius is ~220px from corner centers:
# Top-Left corner center: (318, 337), dist > 220
# Top-Right corner center: (702, 337), dist > 220
# Bottom-Left corner center: (318, 668), dist > 220
# Bottom-Right corner center: (702, 668), dist > 220

# Let's create an exact outer mask of the 4 brackets:
# Outside the bounding box: definitely exterior
is_exterior = (X < 98) | (X > 922) | (Y < 117) | (Y > 888)

# Outside the 4 rounded corners:
# TL corner:
is_exterior |= (X < 318) & (Y < 337) & (np.sqrt((X - 318)**2 + (Y - 337)**2) > 220)
# TR corner:
is_exterior |= (X > 702) & (Y < 337) & (np.sqrt((X - 702)**2 + (Y - 337)**2) > 220)
# BL corner:
is_exterior |= (X < 318) & (Y > 668) & (np.sqrt((X - 318)**2 + (Y - 668)**2) > 220)
# BR corner:
is_exterior |= (X > 702) & (Y > 668) & (np.sqrt((X - 702)**2 + (Y - 668)**2) > 220)

# Build pristine emblem array
out_arr = arr.copy()

# Everything in exterior is set to 100% transparent!
out_arr[is_exterior, 3] = 0

# Also, right at the boundary edge (within 3px of is_exterior), remove any faint grey fringe
# by making any non-navy, non-gold pixel transparent
edge_zone = (X >= 95) & (X <= 925) & (Y >= 114) & (Y <= 891) & ~is_exterior
# If it's outside the brackets and near the exterior, ensure it's not a dirty fringe
# White inside the brackets is preserved!
# Inner white is inside dist_center < 320
# Gaps are inside X in [480, 540] and Y in [470, 530]

clean_emblem = Image.fromarray(out_arr)

# Crop tightly to the navy brackets: x in [98, 922], y in [117, 888]
cropped = clean_emblem.crop((97, 116, 923, 889))
cw, ch = cropped.size

# Square canvas for balanced emblem
max_dim = max(cw, ch)
square_emblem = Image.new('RGBA', (max_dim, max_dim), (255, 255, 255, 0))
square_emblem.paste(cropped, ((max_dim - cw) // 2, (max_dim - ch) // 2))

# Save the emblem with NO outer white boundary
artifact_dir = r'C:\Users\DEVENDER\.gemini\antigravity\brain\2dd31d9b-3f2c-4247-9319-6d3e04e1b616'
os.makedirs('public/images/cseel_logo_variants', exist_ok=True)
square_emblem.save('public/images/cseel_logo_variants/cseel_no_outer_boundary.png')
square_emblem.save(os.path.join(artifact_dir, 'cseel_no_outer_boundary.png'))
square_emblem.save('public/images/cseel-emblem.png')

# ── Update public/images/logo.png (Main Website Logo Banner) ──
orig_banner = Image.open('public/images/logo_backup.png').convert('RGBA')
orig_w, orig_h = orig_banner.size
right_part = orig_banner.crop((290, 0, orig_w, orig_h))

# In the banner, make the icon large: 274px tall
TARGET_SIZE = 274
icon_large = square_emblem.resize((TARGET_SIZE, TARGET_SIZE), Image.Resampling.LANCZOS)

final_logo = Image.new('RGBA', (orig_w, orig_h), (255, 255, 255, 255))
icon_x = (292 - TARGET_SIZE) // 2
icon_y = (orig_h - TARGET_SIZE) // 2

final_logo.paste(icon_large, (icon_x, icon_y), icon_large)
final_logo.paste(right_part, (290, 0), right_part)

final_logo.convert('RGB').save('public/images/logo.png')
final_logo.save(os.path.join(artifact_dir, 'cseel_final_logo_no_outer_boundary.png'))

# ── Update Favicons ──
square_emblem.resize((512, 512), Image.Resampling.LANCZOS).save('public/icon.png')
square_emblem.resize((512, 512), Image.Resampling.LANCZOS).save('src/app/icon.png')
square_emblem.resize((180, 180), Image.Resampling.LANCZOS).save('public/apple-touch-icon.png')
square_emblem.resize((180, 180), Image.Resampling.LANCZOS).save('src/app/apple-icon.png')
square_emblem.resize((32, 32), Image.Resampling.LANCZOS).save('public/favicon-32x32.png')
square_emblem.resize((16, 16), Image.Resampling.LANCZOS).save('public/favicon-16x16.png')
square_emblem.save('public/favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
square_emblem.save('src/app/favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])

print("Outer white boundary completely removed! Saved emblem, logo.png, and favicons.")
