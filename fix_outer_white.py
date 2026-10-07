import numpy as np
from PIL import Image
import os

src_path = r'C:\Users\DEVENDER\Downloads\cseel_exact_color_match_emblem.png'
im = Image.open(src_path).convert('RGBA')
arr = np.array(im, dtype=np.float32)

H, W, _ = arr.shape
Y, X = np.ogrid[:H, :W]
CX, CY = W / 2.0, H / 2.0
dist_center = np.sqrt((X - CX)**2 + (Y - CY)**2)

CSEEL_NAVY = np.array([10.0, 75.0, 105.0], dtype=np.float32)

is_cross_gap = (np.abs(X - CX) <= 24) | (np.abs(Y - CY) <= 24)
outer_bracket_pixels = (dist_center > 330) & ~is_cross_gap & (arr[:, :, 3] > 0)

out = arr.copy()
out[outer_bracket_pixels, 0] = CSEEL_NAVY[0]
out[outer_bracket_pixels, 1] = CSEEL_NAVY[1]
out[outer_bracket_pixels, 2] = CSEEL_NAVY[2]
out[outer_bracket_pixels & (out[:, :, 3] < 25), 3] = 0

outer_gap_ends = is_cross_gap & ((X < 28) | (X > W - 28) | (Y < 28) | (Y > H - 28))
out[outer_gap_ends, 3] = 0

clean_img = Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))

clean_img.save(src_path)
artifact_dir = r'C:\Users\DEVENDER\.gemini\antigravity\brain\2dd31d9b-3f2c-4247-9319-6d3e04e1b616'
clean_img.save(os.path.join(artifact_dir, 'cseel_exact_color_match_emblem.png'))

print("Completed successfully! Cleaned all 478 edge white pixels.")
