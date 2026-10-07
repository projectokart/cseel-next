import numpy as np
from PIL import Image
import os

artifact_dir = r'C:\Users\DEVENDER\.gemini\antigravity\brain\2dd31d9b-3f2c-4247-9319-6d3e04e1b616'

# Load the pure 2-color navy image
im = Image.open('public/images/cseel_logo_variants/cseel_pure_2color_navy_003C6E.png').convert('RGBA')
arr = np.array(im)

# The navy color is roughly #003C6E: R < 30, G in [40, 80], B in [90, 130]
# Everything that is white/near-white inside (R > 230, G > 230, B > 230) -> make alpha = 0 for transparent version
arr_trans = arr.copy()
white_mask = (arr[:, :, 0] > 230) & (arr[:, :, 1] > 230) & (arr[:, :, 2] > 230)
arr_trans[white_mask, 3] = 0

# Smooth anti-aliased edge transition
semi_white = (arr[:, :, 0] > 180) & (arr[:, :, 1] > 180) & (arr[:, :, 2] > 180) & ~white_mask
# Reduce alpha proportionally for edge pixels
factor = 1.0 - (arr[semi_white, :3].mean(axis=1) - 180) / (255 - 180)
arr_trans[semi_white, 3] = np.clip(arr_trans[semi_white, 3] * factor, 0, 255)

im_trans = Image.fromarray(arr_trans.astype(np.uint8))
im_trans.save('public/images/cseel_logo_variants/cseel_2color_navy_transparent.png')
im_trans.save(os.path.join(artifact_dir, 'cseel_2color_navy_transparent.png'))

# Also save the badge version as the primary emblem
im.save('public/images/cseel_logo_variants/cseel_2color_navy_badge.png')
im.save(os.path.join(artifact_dir, 'cseel_2color_navy_badge.png'))

# Copy to main public/images/ as cseel-emblem.png and cseel-emblem-2color.png
im.save('public/images/cseel-emblem-2color.png')
im_trans.save('public/images/cseel-emblem-2color-transparent.png')

print('Transparent and Badge 2-color logos saved!')
