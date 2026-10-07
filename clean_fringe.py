import numpy as np
from PIL import Image, ImageFilter
import os

src_path = r'C:\Users\DEVENDER\Downloads\cseel_exact_color_match_emblem.png'
im = Image.open(src_path).convert('RGBA')
arr = np.array(im, dtype=np.float32)

H, W, _ = arr.shape
Y, X = np.ogrid[:H, :W]
CX, CY = W / 2.0, H / 2.0
dist_center = np.sqrt((X - CX)**2 + (Y - CY)**2)

CSEEL_NAVY = np.array([10.0, 75.0, 105.0], dtype=np.float32)
CSEEL_GOLD = np.array([248.0, 161.0, 48.0], dtype=np.float32)
WHITE = np.array([255.0, 255.0, 255.0], dtype=np.float32)

# In this image:
# Center atom is inside dist_center <= 250
# Brackets are outside dist_center > 250
# The outer edge of the brackets has a white/light fringe where alpha > 10,
# but the RGB has high values due to blending with the former white background!

# 1. First, find all pixels belonging to the 4 navy brackets (outside dist_center > 250)
bracket_zone = dist_center > 250

# In bracket_zone:
# Notice there is the white cross gap in the middle (X near CX or Y near CY) and inner white bed (dist_center near 250..320)
# Brackets are the navy blocks.
# Any pixel in bracket_zone that is NOT inner white bed:
# Inner white bed is inside dist_center <= 320
# Gaps are where (abs(X - CX) < 30) or (abs(Y - CY) < 30)

is_inner_white = (dist_center <= 325) & (arr[:, :, 0] > 200) & (arr[:, :, 1] > 200) & (arr[:, :, 2] > 200)
is_cross_gap = ((np.abs(X - CX) < 28) | (np.abs(Y - CY) < 28)) & (arr[:, :, 0] > 200) & (arr[:, :, 1] > 200) & (arr[:, :, 2] > 200)

# The brackets themselves are everything else in bracket_zone that has alpha > 20
is_bracket_region = bracket_zone & ~is_inner_white & ~is_cross_gap & (arr[:, :, 3] > 20)

# Look at the pixels in is_bracket_region:
# Their true color should be 100% CSEEL_NAVY [10, 75, 105]!
# Any brightness/whiteness in these pixels is the FRINGE from the white background!
# If we set their RGB strictly to CSEEL_NAVY, and calculate their alpha based on how solid the navy was:
out = arr.copy()

# For all bracket pixels, fix the RGB to pure CSEEL_NAVY:
# Calculate the alpha falloff at the outer edge:
# Distance from white (whiteness measure)
whiteness = arr[is_bracket_region, :3].mean(axis=1) # 0 to 255
# In the solid navy interior, whiteness is ~63 (mean of 10, 75, 105 is 63.3)
# At the white fringe edge, whiteness increases to 100, 150, 200, 240!
# We can calculate the true navy coverage (alpha) as:
# If whiteness is near 63 -> 100% solid navy (alpha = 255)
# As whiteness increases towards 255 -> alpha decreases towards 0!
navy_coverage = np.clip((255.0 - whiteness) / (255.0 - 63.3), 0.0, 1.0)

# Apply to bracket pixels:
out[is_bracket_region, 0] = CSEEL_NAVY[0]
out[is_bracket_region, 1] = CSEEL_NAVY[1]
out[is_bracket_region, 2] = CSEEL_NAVY[2]
# Modulate alpha so the outer edge fades cleanly into transparency with ZERO white!
out[is_bracket_region, 3] = np.clip(arr[is_bracket_region, 3] * navy_coverage, 0.0, 255.0)

# Erode any tiny 1px stray isolated floating pixels outside the brackets (where alpha < 40)
out[is_bracket_region & (out[:, :, 3] < 35), 3] = 0

# Convert to image
clean_img = Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))

# Save the defringed image
clean_img.save(r'C:\Users\DEVENDER\Downloads\cseel_exact_color_match_emblem.png')

artifact_dir = r'C:\Users\DEVENDER\.gemini\antigravity\brain\2dd31d9b-3f2c-4247-9319-6d3e04e1b616'
clean_img.save(os.path.join(artifact_dir, 'cseel_defringed_emblem.png'))

print("Defringing complete! Cleaned all white halo pixels.")
