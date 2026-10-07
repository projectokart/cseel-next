import numpy as np
from PIL import Image, ImageDraw, ImageFilter
import os
import shutil

src_path = r'C:\Users\DEVENDER\.gemini\antigravity\brain\2dd31d9b-3f2c-4247-9319-6d3e04e1b616\.user_uploaded\media_1791024642916.png'
base_img = Image.open(src_path).convert('RGBA')
arr = np.array(base_img, dtype=np.float32)

H, W, _ = arr.shape
Y, X = np.ogrid[:H, :W]

# Center of brackets in media_1791024642916.png: cx = 510, cy = 502
CX, CY = 510.0, 502.0
dist_center = np.sqrt((X - CX)**2 + (Y - CY)**2)

CSEEL_NAVY = np.array([10, 75, 105, 255], dtype=np.uint8)   # #0A4B69
CSEEL_GOLD = np.array([248, 161, 48, 255], dtype=np.uint8)  # #F8A130
PURE_WHITE = np.array([255, 255, 255, 255], dtype=np.uint8)

# 1. Bracket mask (outside center atom radius 240, not white in original)
is_bracket = (dist_center > 240) & (arr[:, :, 3] > 80) & ~(
    (arr[:, :, 0] > 230) & (arr[:, :, 1] > 230) & (arr[:, :, 2] > 230)
) & (X >= 72) & (X <= 948) & (Y >= 90) & (Y <= 914)

# 2. Atom Orbits (radius 82 to 250, not white in original)
is_atom = (dist_center >= 82) & (dist_center <= 250) & (arr[:, :, 3] > 80) & ~(
    (arr[:, :, 0] > 230) & (arr[:, :, 1] > 230) & (arr[:, :, 2] > 230)
)

# 3. Central Nucleus (enlarged: radius <= 82)
is_nucleus = (dist_center <= 82) & (arr[:, :, 3] > 100) & ~(
    (arr[:, :, 0] > 245) & (arr[:, :, 1] > 245) & (arr[:, :, 2] > 245) & (dist_center > 72)
)

# 4. Inner white area between brackets and atom
inner_white = (dist_center <= 240) & ~is_atom & ~is_nucleus & (arr[:, :, 3] > 80)

# 5. Gaps between brackets (vertical and horizontal white divider lines)
gap_white = (dist_center > 240) & (arr[:, :, 3] > 80) & (X >= 72) & (X <= 948) & (Y >= 90) & (Y <= 914) & (
    (arr[:, :, 0] > 220) & (arr[:, :, 1] > 220) & (arr[:, :, 2] > 220)
)

# Initialize clean image
clean_img = np.zeros((H, W, 4), dtype=np.uint8)
clean_img[inner_white | gap_white] = PURE_WHITE
clean_img[is_bracket | is_atom] = CSEEL_NAVY
clean_img[is_nucleus] = CSEEL_GOLD

# ── Create a mathematically smooth, ultra-thin pure-white outer border ──
# Measure the outer boundary of the 4 brackets:
# Left: 72, Right: 947, Top: 90, Bottom: 914
# Radius of outer rounded corners of brackets is ~250px.
# We build a high-resolution 4x supersampled mask for the smooth squircle border:
SCALE = 4
SH, SW = H * SCALE, W * SCALE

# Scaled coordinates
s_box = [int(70 * SCALE), int(88 * SCALE), int(950 * SCALE), int(916 * SCALE)]
s_radius = int(250 * SCALE)

# Thin white border expands by only 7px (scaled by 4 = 28px)
BORDER_THICKNESS = 7
s_outer_box = [
    s_box[0] - int(BORDER_THICKNESS * SCALE),
    s_box[1] - int(BORDER_THICKNESS * SCALE),
    s_box[2] + int(BORDER_THICKNESS * SCALE),
    s_box[3] + int(BORDER_THICKNESS * SCALE)
]
s_outer_radius = s_radius + int(BORDER_THICKNESS * SCALE)

# Draw supersampled outer squircle mask
supersampled_mask = Image.new('L', (SW, SH), 0)
s_draw = ImageDraw.Draw(supersampled_mask)
s_draw.rounded_rectangle(s_outer_box, radius=s_outer_radius, fill=255)

# Downsample mask back to 1024x1024 with high-quality anti-aliasing
smooth_card_mask = supersampled_mask.resize((W, H), Image.Resampling.LANCZOS)
smooth_card_arr = np.array(smooth_card_mask)

# Inside the smooth card mask:
# Everywhere that is currently transparent (where brackets haven't drawn), fill with pure white!
empty_in_card = (smooth_card_arr > 128) & (clean_img[:, :, 3] == 0)
clean_img[empty_in_card] = PURE_WHITE

# Set the alpha channel to the smooth card mask for razor-sharp, ultra-clean outer edges
clean_img[:, :, 3] = np.minimum(clean_img[:, :, 3], smooth_card_arr)

# Convert to PIL Image
emblem_final = Image.fromarray(clean_img)

# Crop tightly to the smooth white border
y_nz, x_nz = np.where(clean_img[:, :, 3] > 10)
pad = 2
crop_box = (max(0, x_nz.min() - pad), max(0, y_nz.min() - pad), min(W, x_nz.max() + pad), min(H, y_nz.max() + pad))
cropped = emblem_final.crop(crop_box)
cw, ch = cropped.size

# Place on a balanced square canvas
max_dim = max(cw, ch)
square_emblem = Image.new('RGBA', (max_dim, max_dim), (255, 255, 255, 0))
square_emblem.paste(cropped, ((max_dim - cw) // 2, (max_dim - ch) // 2))

# Save the polished thin pure-white border emblem
artifact_dir = r'C:\Users\DEVENDER\.gemini\antigravity\brain\2dd31d9b-3f2c-4247-9319-6d3e04e1b616'
os.makedirs('public/images/cseel_logo_variants', exist_ok=True)
square_emblem.save('public/images/cseel_logo_variants/cseel_thin_pure_white_emblem.png')
square_emblem.save(os.path.join(artifact_dir, 'cseel_thin_pure_white_emblem.png'))
square_emblem.save('public/images/cseel-emblem.png')
square_emblem.save(os.path.join(artifact_dir, 'cseel-emblem.png'))

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
final_logo.save(os.path.join(artifact_dir, 'cseel_final_perfect_logo.png'))

# ── Update All Favicons ──
square_emblem.resize((512, 512), Image.Resampling.LANCZOS).save('public/icon.png')
square_emblem.resize((512, 512), Image.Resampling.LANCZOS).save('src/app/icon.png')
square_emblem.resize((180, 180), Image.Resampling.LANCZOS).save('public/apple-touch-icon.png')
square_emblem.resize((180, 180), Image.Resampling.LANCZOS).save('src/app/apple-icon.png')
square_emblem.resize((32, 32), Image.Resampling.LANCZOS).save('public/favicon-32x32.png')
square_emblem.resize((16, 16), Image.Resampling.LANCZOS).save('public/favicon-16x16.png')
square_emblem.save('public/favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
square_emblem.save('src/app/favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])

print("Successfully generated mathematically smooth thin white border logo and all assets!")
