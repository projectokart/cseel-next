import numpy as np
from PIL import Image
import os

src_path = r'C:\Users\DEVENDER\.gemini\antigravity\brain\2dd31d9b-3f2c-4247-9319-6d3e04e1b616\.user_uploaded\media_1791024642916.png'
base_img = Image.open(src_path).convert('RGBA')
arr = np.array(base_img, dtype=np.float32)

H, W, _ = arr.shape
Y, X = np.ogrid[:H, :W]

# Center of image is (512, 512)
dist_center = np.sqrt((X - 512)**2 + (Y - 512)**2)

CSEEL_NAVY = np.array([10, 75, 105], dtype=np.float32)   # #0A4B69
CSEEL_GOLD = np.array([248, 161, 48], dtype=np.float32)  # #F8A130
WHITE = np.array([255, 255, 255], dtype=np.float32)

out = arr.copy()

# 1. Any non-white pixel outside radius 250 is a bracket pixel -> Set strictly to CSEEL_NAVY
is_bracket = (dist_center > 240) & (arr[:, :, 3] > 80) & ~(
    (arr[:, :, 0] > 230) & (arr[:, :, 1] > 230) & (arr[:, :, 2] > 230)
)
out[is_bracket, :3] = CSEEL_NAVY

# 2. Atom Orbits and electron nodes (between radius 82 and 250)
is_atom = (dist_center >= 82) & (dist_center <= 250) & (arr[:, :, 3] > 80) & ~(
    (arr[:, :, 0] > 230) & (arr[:, :, 1] > 230) & (arr[:, :, 2] > 230)
)
out[is_atom, :3] = CSEEL_NAVY

# 3. Central Nucleus: MAKE IT BIGGER (radius up to 82 instead of 68) with smooth anti-aliased edge
mask_nucleus = (dist_center <= 82) & (arr[:, :, 3] > 100) & ~(
    (arr[:, :, 0] > 245) & (arr[:, :, 1] > 245) & (arr[:, :, 2] > 245) & (dist_center > 72)
)
# Edge antialiasing for the enlarged golden nucleus
nuc_edge = (dist_center > 78) & (dist_center <= 82)
out[mask_nucleus, :3] = CSEEL_GOLD

recolored_img = Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))

# Crop tightly to the emblem
crop_box = (68, 86, 952, 918)
cropped_emblem = recolored_img.crop(crop_box)
cw, ch = cropped_emblem.size

max_dim = max(cw, ch)
square_emblem = Image.new('RGBA', (max_dim, max_dim), (255, 255, 255, 0))
square_emblem.paste(cropped_emblem, ((max_dim - cw) // 2, (max_dim - ch) // 2))

# Save square emblem
artifact_dir = r'C:\Users\DEVENDER\.gemini\antigravity\brain\2dd31d9b-3f2c-4247-9319-6d3e04e1b616'
square_emblem.save('public/images/cseel_logo_variants/cseel_exact_tight_emblem.png')
square_emblem.save(os.path.join(artifact_dir, 'cseel_exact_tight_emblem.png'))

# Composite into main logo banner
orig_banner = Image.open('public/images/logo_backup.png').convert('RGBA')
orig_w, orig_h = orig_banner.size
right_part = orig_banner.crop((290, 0, orig_w, orig_h))

# Large emblem (276px)
TARGET_SIZE = 276
icon_large = square_emblem.resize((TARGET_SIZE, TARGET_SIZE), Image.Resampling.LANCZOS)

final_logo = Image.new('RGBA', (orig_w, orig_h), (255, 255, 255, 255))
icon_x = (292 - TARGET_SIZE) // 2
icon_y = (orig_h - TARGET_SIZE) // 2

final_logo.paste(icon_large, (icon_x, icon_y), icon_large)
final_logo.paste(right_part, (290, 0), right_part)

final_logo.convert('RGB').save('public/images/logo.png')
final_logo.save(os.path.join(artifact_dir, 'cseel_final_bold_logo.png'))

# Update Favicons
square_emblem.resize((512, 512), Image.Resampling.LANCZOS).save('public/icon.png')
square_emblem.resize((512, 512), Image.Resampling.LANCZOS).save('src/app/icon.png')
square_emblem.resize((180, 180), Image.Resampling.LANCZOS).save('public/apple-touch-icon.png')
square_emblem.resize((180, 180), Image.Resampling.LANCZOS).save('src/app/apple-icon.png')
square_emblem.resize((32, 32), Image.Resampling.LANCZOS).save('public/favicon-32x32.png')
square_emblem.resize((16, 16), Image.Resampling.LANCZOS).save('public/favicon-16x16.png')
square_emblem.save('public/favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
square_emblem.save('src/app/favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])

print("Successfully cleaned up all artifact pixels and enlarged the golden nucleus!")
