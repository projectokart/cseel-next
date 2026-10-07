import numpy as np
from PIL import Image, ImageFilter
import os
import shutil

src_path = r'C:\Users\DEVENDER\.gemini\antigravity\brain\2dd31d9b-3f2c-4247-9319-6d3e04e1b616\.user_uploaded\media_1791024642916.png'
base_img = Image.open(src_path).convert('RGBA')
arr = np.array(base_img, dtype=np.float32)

H, W, _ = arr.shape
Y, X = np.ogrid[:H, :W]
dist_center = np.sqrt((X - 512)**2 + (Y - 512)**2)

CSEEL_NAVY = np.array([10, 75, 105, 255], dtype=np.uint8)   # #0A4B69
CSEEL_GOLD = np.array([248, 161, 48, 255], dtype=np.uint8)  # #F8A130
PURE_WHITE = np.array([255, 255, 255, 255], dtype=np.uint8)

# 1. Bracket mask (outside radius 240, not white in original)
is_bracket = (dist_center > 240) & (arr[:, :, 3] > 80) & ~(
    (arr[:, :, 0] > 230) & (arr[:, :, 1] > 230) & (arr[:, :, 2] > 230)
)

# 2. Atom Orbits (radius 82 to 250, not white in original)
is_atom = (dist_center >= 82) & (dist_center <= 250) & (arr[:, :, 3] > 80) & ~(
    (arr[:, :, 0] > 230) & (arr[:, :, 1] > 230) & (arr[:, :, 2] > 230)
)

# 3. Center Nucleus (radius <= 82)
is_nucleus = (dist_center <= 82) & (arr[:, :, 3] > 100) & ~(
    (arr[:, :, 0] > 245) & (arr[:, :, 1] > 245) & (arr[:, :, 2] > 245) & (dist_center > 72)
)

# 4. Inner White space: inside the squircle hole (dist_center <= 240) where it's not atom/nucleus
inner_white = (dist_center <= 240) & ~is_atom & ~is_nucleus & (arr[:, :, 3] > 80)

# 5. Separation gaps between the 4 brackets:
# Gaps are where arr[:, :, 3] > 80 and original was white
in_emblem_area = (X >= 74) & (X <= 945) & (Y >= 92) & (Y <= 911)
gap_white = in_emblem_area & (dist_center > 240) & (arr[:, :, 3] > 80) & (
    (arr[:, :, 0] > 220) & (arr[:, :, 1] > 220) & (arr[:, :, 2] > 220)
)

# Build pristine raster
clean_img = np.zeros((H, W, 4), dtype=np.uint8)
clean_img[inner_white | gap_white] = PURE_WHITE
clean_img[is_bracket | is_atom] = CSEEL_NAVY
clean_img[is_nucleus] = CSEEL_GOLD

# Now, create a THIN PURE WHITE outer border:
# Mask of all emblem pixels
emblem_mask = (clean_img[:, :, 3] > 0)
mask_img = Image.fromarray(emblem_mask.astype(np.uint8) * 255)

# Expand by 8 pixels to create an ultra-thin 8px white boundary around the brackets
dilated = mask_img.filter(ImageFilter.MaxFilter(9))
dilated_mask = np.array(dilated) > 0

# The thin border region
thin_border = dilated_mask & ~emblem_mask
clean_img[thin_border] = PURE_WHITE

# Smooth the very outer 1px edge for crisp anti-aliasing against any background
outer_edge_alpha = Image.fromarray(clean_img[:, :, 3]).filter(ImageFilter.GaussianBlur(0.6))
clean_img[:, :, 3] = np.array(outer_edge_alpha)

# Crop tightly to the thin white border
y_idx, x_idx = np.where(clean_img[:, :, 3] > 10)
crop_box = (x_idx.min() - 2, y_idx.min() - 2, x_idx.max() + 2, y_idx.max() + 2)
cropped = Image.fromarray(clean_img).crop(crop_box)
cw, ch = cropped.size

max_dim = max(cw, ch)
square_emblem = Image.new('RGBA', (max_dim, max_dim), (255, 255, 255, 0))
square_emblem.paste(cropped, ((max_dim - cw) // 2, (max_dim - ch) // 2))

# Save thin pure-white border emblem
artifact_dir = r'C:\Users\DEVENDER\.gemini\antigravity\brain\2dd31d9b-3f2c-4247-9319-6d3e04e1b616'
square_emblem.save('public/images/cseel_logo_variants/cseel_thin_pure_white_emblem.png')
square_emblem.save(os.path.join(artifact_dir, 'cseel_thin_pure_white_emblem.png'))

# ── Update public/images/logo.png ──
orig_banner = Image.open('public/images/logo_backup.png').convert('RGBA')
orig_w, orig_h = orig_banner.size
right_part = orig_banner.crop((290, 0, orig_w, orig_h))

TARGET_SIZE = 276
icon_large = square_emblem.resize((TARGET_SIZE, TARGET_SIZE), Image.Resampling.LANCZOS)

final_logo = Image.new('RGBA', (orig_w, orig_h), (255, 255, 255, 255))
icon_x = (292 - TARGET_SIZE) // 2
icon_y = (orig_h - TARGET_SIZE) // 2

final_logo.paste(icon_large, (icon_x, icon_y), icon_large)
final_logo.paste(right_part, (290, 0), right_part)

final_logo.convert('RGB').save('public/images/logo.png')
final_logo.save(os.path.join(artifact_dir, 'cseel_final_perfect_logo.png'))

# ── Update Favicons with this thin pure white border emblem ──
square_emblem.resize((512, 512), Image.Resampling.LANCZOS).save('public/icon.png')
square_emblem.resize((512, 512), Image.Resampling.LANCZOS).save('src/app/icon.png')
square_emblem.resize((180, 180), Image.Resampling.LANCZOS).save('public/apple-touch-icon.png')
square_emblem.resize((180, 180), Image.Resampling.LANCZOS).save('src/app/apple-icon.png')
square_emblem.resize((32, 32), Image.Resampling.LANCZOS).save('public/favicon-32x32.png')
square_emblem.resize((16, 16), Image.Resampling.LANCZOS).save('public/favicon-16x16.png')
square_emblem.save('public/favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
square_emblem.save('src/app/favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])

print("Successfully created emblem with pure white thin border and zero artifacts!")
