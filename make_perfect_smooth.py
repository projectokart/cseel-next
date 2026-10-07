import numpy as np
from PIL import Image, ImageDraw, ImageFilter
import os
import shutil

src_path = r'C:\Users\DEVENDER\.gemini\antigravity\brain\2dd31d9b-3f2c-4247-9319-6d3e04e1b616\.user_uploaded\media_1791024642916.png'
base_img = Image.open(src_path).convert('RGBA')
arr = np.array(base_img, dtype=np.float32)

H, W, _ = arr.shape
Y, X = np.ogrid[:H, :W]
dist_center = np.sqrt((X - 512)**2 + (Y - 512)**2)

CSEEL_NAVY = np.array([10, 75, 105], dtype=np.float32)   # #0A4B69
CSEEL_GOLD = np.array([248, 161, 48], dtype=np.float32)  # #F8A130
WHITE = np.array([255, 255, 255], dtype=np.float32)

# Build base image with pure solid white background inside a smooth rounded card:
# Perfect rounded rectangle (squircle) from x=75 to 949, y=75 to 949 with radius 260
card_mask = Image.new('L', (W, H), 0)
draw = ImageDraw.Draw(card_mask)
# Draw smooth rounded rectangle
draw.rounded_rectangle([75, 75, 949, 949], radius=260, fill=255)

card_arr = np.array(card_mask) > 0

# Start with empty canvas
final_arr = np.zeros((H, W, 4), dtype=np.uint8)

# Fill card interior with pure white
final_arr[card_arr] = [255, 255, 255, 255]

# Identify navy elements (brackets and atom) from source
is_navy = (arr[:, :, 3] > 80) & (arr[:, :, 0] < 50) & (arr[:, :, 1] < 120) & (arr[:, :, 2] > 70)
# Make sure any colored bracket pixel outside center is navy
is_bracket = (dist_center > 240) & (arr[:, :, 3] > 80) & ~(
    (arr[:, :, 0] > 230) & (arr[:, :, 1] > 230) & (arr[:, :, 2] > 230)
)
# Atom orbits
is_atom = (dist_center >= 82) & (dist_center <= 250) & (arr[:, :, 3] > 80) & ~(
    (arr[:, :, 0] > 230) & (arr[:, :, 1] > 230) & (arr[:, :, 2] > 230)
)
# Apply Navy strictly inside the card
final_arr[(is_bracket | is_navy | is_atom) & card_arr] = [10, 75, 105, 255]

# Center Nucleus (enlarged, golden)
mask_nucleus = (dist_center <= 82) & (arr[:, :, 3] > 100) & ~(
    (arr[:, :, 0] > 245) & (arr[:, :, 1] > 245) & (arr[:, :, 2] > 245) & (dist_center > 72)
)
final_arr[mask_nucleus & card_arr] = [248, 161, 48, 255]

# Smooth the outer edge of the card with supersampling / anti-aliasing
alpha_mask = card_mask.filter(ImageFilter.GaussianBlur(0.8))
final_arr[:, :, 3] = np.array(alpha_mask)

# Convert to image
emblem_img = Image.fromarray(final_arr)

# Crop tightly to the rounded card (x: 73 to 951, y: 73 to 951)
crop_box = (70, 70, 954, 954)
cropped = emblem_img.crop(crop_box)
cw, ch = cropped.size

max_dim = max(cw, ch)
square_emblem = Image.new('RGBA', (max_dim, max_dim), (255, 255, 255, 0))
square_emblem.paste(cropped, ((max_dim - cw) // 2, (max_dim - ch) // 2))

# Save square emblem
artifact_dir = r'C:\Users\DEVENDER\.gemini\antigravity\brain\2dd31d9b-3f2c-4247-9319-6d3e04e1b616'
square_emblem.save('public/images/cseel_logo_variants/cseel_perfect_smooth_emblem.png')
square_emblem.save(os.path.join(artifact_dir, 'cseel_perfect_smooth_emblem.png'))

# ── Update public/images/logo.png (the main website logo banner) ──
orig_banner = Image.open('public/images/logo_backup.png').convert('RGBA')
orig_w, orig_h = orig_banner.size
right_part = orig_banner.crop((290, 0, orig_w, orig_h))

# Large size: 276px tall, matching the vertical line height
TARGET_SIZE = 276
icon_large = square_emblem.resize((TARGET_SIZE, TARGET_SIZE), Image.Resampling.LANCZOS)

final_logo = Image.new('RGBA', (orig_w, orig_h), (255, 255, 255, 255))
icon_x = (292 - TARGET_SIZE) // 2
icon_y = (orig_h - TARGET_SIZE) // 2

final_logo.paste(icon_large, (icon_x, icon_y), icon_large)
final_logo.paste(right_part, (290, 0), right_part)

final_logo.convert('RGB').save('public/images/logo.png')
final_logo.save(os.path.join(artifact_dir, 'cseel_final_smooth_logo.png'))

# ── Update Favicons with the clean smooth emblem ──
square_emblem.resize((512, 512), Image.Resampling.LANCZOS).save('public/icon.png')
square_emblem.resize((512, 512), Image.Resampling.LANCZOS).save('src/app/icon.png')
square_emblem.resize((180, 180), Image.Resampling.LANCZOS).save('public/apple-touch-icon.png')
square_emblem.resize((180, 180), Image.Resampling.LANCZOS).save('src/app/apple-icon.png')
square_emblem.resize((32, 32), Image.Resampling.LANCZOS).save('public/favicon-32x32.png')
square_emblem.resize((16, 16), Image.Resampling.LANCZOS).save('public/favicon-16x16.png')
square_emblem.save('public/favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
square_emblem.save('src/app/favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])

print("Perfect smooth squircle emblem and logo generated!")
