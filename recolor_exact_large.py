import numpy as np
from PIL import Image
import os
import shutil

src_path = r'C:\Users\DEVENDER\.gemini\antigravity\brain\2dd31d9b-3f2c-4247-9319-6d3e04e1b616\.user_uploaded\media_1791024642916.png'
base_img = Image.open(src_path).convert('RGBA')
arr = np.array(base_img, dtype=np.float32)

H, W, _ = arr.shape
Y, X = np.ogrid[:H, :W]

# Center of image is (512, 512)
dist_center = np.sqrt((X - 512)**2 + (Y - 512)**2)

# Colors from CSEEL official logo
# Text color: #0A4B69
CSEEL_NAVY = np.array([10, 75, 105], dtype=np.float32)   # #0A4B69
CSEEL_GOLD = np.array([248, 161, 48], dtype=np.float32)  # #F8A130
WHITE = np.array([255, 255, 255], dtype=np.float32)

# 1. Four outer brackets in media_1791024642916.png
# Outside center atom (dist_center > 265), has opacity, and is not white
is_bracket = (dist_center > 265) & (arr[:, :, 3] > 100) & (
    (arr[:, :, 0] < 235) | (arr[:, :, 1] < 235) | (arr[:, :, 2] < 235)
)

# 2. Central Nucleus in media_1791024642916.png
# Inside center (dist_center < 70), dark color (R < 80, G < 100, B < 110)
is_nucleus = (dist_center < 70) & (arr[:, :, 3] > 180) & (
    (arr[:, :, 0] < 80) & (arr[:, :, 1] < 100) & (arr[:, :, 2] < 110)
)

# 3. Atom Orbits and electron dots in media_1791024642916.png
# Between radius 70 and 265, dark blue lines
is_atom = (dist_center >= 70) & (dist_center <= 265) & (arr[:, :, 3] > 100) & (
    (arr[:, :, 0] < 80) & (arr[:, :, 1] < 140) & (arr[:, :, 2] > 80)
)

out = arr.copy()

# Recolor brackets to Deep Navy:
# For smooth edges, use luminosity / darkness ratio
bracket_darkness = np.clip(1.0 - (arr[is_bracket, :3].mean(axis=1) / 255.0) * 0.4, 0.0, 1.0)[:, None]
# Calculate intensity from source color saturation/alpha
out[is_bracket, :3] = CSEEL_NAVY

# Recolor atom orbits to exact CSEEL Navy:
out[is_atom, :3] = CSEEL_NAVY

# Recolor nucleus to exact CSEEL Gold:
out[is_nucleus, :3] = CSEEL_GOLD

recolored_img = Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))

# ── Crop tightly to the emblem (remove outer transparent padding) ──
# Bounding box of the emblem is roughly x: 72 to 948, y: 90 to 914
# Let's add 4px margin around it for a clean border
crop_box = (68, 86, 952, 918) # 884 x 832
cropped_emblem = recolored_img.crop(crop_box)
cw, ch = cropped_emblem.size

# Make it square by pasting centered on a square transparent canvas
max_dim = max(cw, ch)
square_emblem = Image.new('RGBA', (max_dim, max_dim), (255, 255, 255, 0))
square_emblem.paste(cropped_emblem, ((max_dim - cw) // 2, (max_dim - ch) // 2))

# Save the high-res square emblem
artifact_dir = r'C:\Users\DEVENDER\.gemini\antigravity\brain\2dd31d9b-3f2c-4247-9319-6d3e04e1b616'
square_emblem.save('public/images/cseel_logo_variants/cseel_exact_tight_emblem.png')
square_emblem.save(os.path.join(artifact_dir, 'cseel_exact_tight_emblem.png'))

# ── Composite into the main logo banner (public/images/logo.png) ──
orig_banner = Image.open('public/images/logo_backup.png').convert('RGBA')
orig_w, orig_h = orig_banner.size
right_part = orig_banner.crop((290, 0, orig_w, orig_h))

# In original logo.png:
# Vertical bar is at x=297 to 306, y=26 to 298 (height = 272)
# We want the icon to match this height: 272px!
TARGET_SIZE = 272
icon_large = square_emblem.resize((TARGET_SIZE, TARGET_SIZE), Image.Resampling.LANCZOS)

final_logo = Image.new('RGBA', (orig_w, orig_h), (255, 255, 255, 255))

# Position the icon:
# x from ~10 to 282 (centered in 0 to 292, right before the vertical line at 297)
icon_x = (292 - TARGET_SIZE) // 2
# y vertically aligned with the vertical line (y=27)
icon_y = (orig_h - TARGET_SIZE) // 2

final_logo.paste(icon_large, (icon_x, icon_y), icon_large)
final_logo.paste(right_part, (290, 0), right_part)

# Save final logo.png
final_logo.convert('RGB').save('public/images/logo.png')
final_logo.save(os.path.join(artifact_dir, 'cseel_exact_large_logo.png'))

# ── Update Favicons with the tight, large emblem ──
square_emblem.resize((512, 512), Image.Resampling.LANCZOS).save('public/icon.png')
square_emblem.resize((512, 512), Image.Resampling.LANCZOS).save('src/app/icon.png')
square_emblem.resize((180, 180), Image.Resampling.LANCZOS).save('public/apple-touch-icon.png')
square_emblem.resize((180, 180), Image.Resampling.LANCZOS).save('src/app/apple-icon.png')
square_emblem.resize((32, 32), Image.Resampling.LANCZOS).save('public/favicon-32x32.png')
square_emblem.resize((16, 16), Image.Resampling.LANCZOS).save('public/favicon-16x16.png')
square_emblem.save('public/favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
square_emblem.save('src/app/favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])

print("Successfully recolored exact design, cropped tightly, and scaled up to 272px!")
