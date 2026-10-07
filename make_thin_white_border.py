import numpy as np
from PIL import Image, ImageFilter
import os
import shutil

src_path = r'C:\Users\DEVENDER\.gemini\antigravity\brain\2dd31d9b-3f2c-4247-9319-6d3e04e1b616\.user_uploaded\media_1791025950352.png'
base_img = Image.open(src_path).convert('RGBA')
arr = np.array(base_img, dtype=np.float32)

H, W, _ = arr.shape
Y, X = np.ogrid[:H, :W]
dist_center = np.sqrt((X - 512)**2 + (Y - 512)**2)

CSEEL_NAVY = np.array([10, 75, 105], dtype=np.float32)   # #0A4B69
CSEEL_GOLD = np.array([248, 161, 48], dtype=np.float32)  # #F8A130
WHITE = np.array([255, 255, 255], dtype=np.float32)

# Find the Navy elements (brackets + atom)
is_navy = (arr[:, :, 3] > 80) & (arr[:, :, 0] < 50) & (arr[:, :, 1] < 120) & (arr[:, :, 2] > 70)

# Find the Golden Nucleus in center
is_gold = (dist_center <= 85) & (arr[:, :, 0] > 180) & (arr[:, :, 1] > 100) & (arr[:, :, 2] < 90)

# Build a pristine image from ground up:
# 1. Start with completely transparent canvas
clean_arr = np.zeros((H, W, 4), dtype=np.uint8)

# 2. Inside the inner squircle hole: pure solid white background
# Inner hole is inside dist_center < 320, where original was white
inner_white = (dist_center <= 330) & (arr[:, :, 3] > 100) & (arr[:, :, 0] > 200) & (arr[:, :, 1] > 200) & (arr[:, :, 2] > 200)
clean_arr[inner_white] = [255, 255, 255, 255]

# The white cross gaps between the 4 brackets:
# Vertical gap: X in [475, 549]
# Horizontal gap: Y in [475, 549]
v_gap = (X >= 475) & (X <= 549) & (arr[:, :, 3] > 100)
h_gap = (Y >= 475) & (Y <= 549) & (arr[:, :, 3] > 100)
clean_arr[v_gap | h_gap] = [255, 255, 255, 255]

# 3. Navy Brackets and Atom
clean_arr[is_navy] = [10, 75, 105, 255]

# 4. Golden Nucleus
clean_arr[is_gold] = [248, 161, 48, 255]

# 5. Now create a THIN, PURE WHITE outer boundary around the 4 brackets:
# Binary mask of the whole icon (where anything is drawn)
icon_mask = (clean_arr[:, :, 3] > 0)
mask_img = Image.fromarray(icon_mask.astype(np.uint8) * 255)

# Dilate mask by a THIN amount (e.g. 10 pixels for a clean, crisp thin white border)
# Using MaxFilter to expand outward smoothly
dilated_mask = mask_img.filter(ImageFilter.MaxFilter(21)) # radius ~10px
dilated_arr = np.array(dilated_mask) > 0

# Apply pure white to the thin outer border
# Outside the icon itself, but inside the dilated mask
thin_white_border = dilated_arr & ~icon_mask
clean_arr[thin_white_border] = [255, 255, 255, 255]

# Slight Gaussian antialiasing on alpha channel edge only for butter-smooth rendering
alpha_channel = Image.fromarray(clean_arr[:, :, 3])
alpha_smooth = alpha_channel.filter(ImageFilter.GaussianBlur(1.0))
clean_arr[:, :, 3] = np.array(alpha_smooth)

final_emblem = Image.fromarray(clean_arr)

# Crop tightly to the thin white border
y_nz, x_nz = np.where(clean_arr[:, :, 3] > 20)
crop_box = (x_nz.min() - 4, y_nz.min() - 4, x_nz.max() + 4, y_nz.max() + 4)
cropped = final_emblem.crop(crop_box)
cw, ch = cropped.size

max_dim = max(cw, ch)
square_emblem = Image.new('RGBA', (max_dim, max_dim), (255, 255, 255, 0))
square_emblem.paste(cropped, ((max_dim - cw) // 2, (max_dim - ch) // 2))

# Save thin-border emblem
artifact_dir = r'C:\Users\DEVENDER\.gemini\antigravity\brain\2dd31d9b-3f2c-4247-9319-6d3e04e1b616'
square_emblem.save('public/images/cseel_logo_variants/cseel_thin_white_border_emblem.png')
square_emblem.save(os.path.join(artifact_dir, 'cseel_thin_white_border_emblem.png'))

# ── Update public/images/logo.png (the main website logo banner) ──
orig_banner = Image.open('public/images/logo_backup.png').convert('RGBA')
orig_w, orig_h = orig_banner.size
right_part = orig_banner.crop((290, 0, orig_w, orig_h))

# Large size: 276px tall, perfectly centered
TARGET_SIZE = 276
icon_large = square_emblem.resize((TARGET_SIZE, TARGET_SIZE), Image.Resampling.LANCZOS)

final_logo = Image.new('RGBA', (orig_w, orig_h), (255, 255, 255, 255))
icon_x = (292 - TARGET_SIZE) // 2
icon_y = (orig_h - TARGET_SIZE) // 2

final_logo.paste(icon_large, (icon_x, icon_y), icon_large)
final_logo.paste(right_part, (290, 0), right_part)

final_logo.convert('RGB').save('public/images/logo.png')
final_logo.save(os.path.join(artifact_dir, 'cseel_thin_border_main_logo.png'))

# ── Update Favicons with the clean thin-border emblem ──
square_emblem.resize((512, 512), Image.Resampling.LANCZOS).save('public/icon.png')
square_emblem.resize((512, 512), Image.Resampling.LANCZOS).save('src/app/icon.png')
square_emblem.resize((180, 180), Image.Resampling.LANCZOS).save('public/apple-touch-icon.png')
square_emblem.resize((180, 180), Image.Resampling.LANCZOS).save('src/app/apple-icon.png')
square_emblem.resize((32, 32), Image.Resampling.LANCZOS).save('public/favicon-32x32.png')
square_emblem.resize((16, 16), Image.Resampling.LANCZOS).save('public/favicon-16x16.png')
square_emblem.save('public/favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
square_emblem.save('src/app/favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])

print("Successfully created thin, pure-white outer border emblem!")
