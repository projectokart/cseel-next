import numpy as np
from PIL import Image
import os
import subprocess

src_path = r'C:\Users\DEVENDER\.gemini\antigravity\brain\2dd31d9b-3f2c-4247-9319-6d3e04e1b616\.user_uploaded\media_1791024642916.png'
base_img = Image.open(src_path).convert('RGBA')
arr = np.array(base_img, dtype=np.float32)

H, W, _ = arr.shape
Y, X = np.ogrid[:H, :W]

# Masks for regions in the image:
mask_tl = (X < 512) & (Y < 512) & (arr[:, :, 2] > 140) & (arr[:, :, 0] < 120)
mask_tr = (X > 512) & (Y < 512) & (arr[:, :, 0] > 140) & (arr[:, :, 1] < 100)
mask_bl = (X < 512) & (Y > 512) & (arr[:, :, 0] > 180) & (arr[:, :, 1] > 120) & (arr[:, :, 2] < 80)
mask_br = (X > 512) & (Y > 512) & (arr[:, :, 1] > 100) & (arr[:, :, 0] < 100) & (arr[:, :, 2] < 120)

dist_center = np.sqrt((X - 512)**2 + (Y - 512)**2)
mask_nucleus = (dist_center < 70) & (arr[:, :, 0] < 80) & (arr[:, :, 1] < 100) & (arr[:, :, 2] < 110) & (arr[:, :, 3] > 200)
mask_atom = (dist_center < 260) & ~mask_nucleus & (arr[:, :, 0] < 80) & (arr[:, :, 1] < 140) & (arr[:, :, 2] > 80)

def hex_to_rgb(hex_str):
    hex_str = hex_str.lstrip('#')
    return np.array([int(hex_str[i:i+2], 16) for i in (0, 2, 4)], dtype=np.float32)

def recolor_all(navy_hex):
    """Recolors all 4 brackets and the central atom + nucleus into pure Deep Navy Blue"""
    out = arr.copy()
    navy_rgb = hex_to_rgb(navy_hex)
    
    # 4 Quadrants
    for mask, src_channel in [
        (mask_tl, 2),
        (mask_tr, 0),
        (mask_bl, 0),
        (mask_br, 1),
    ]:
        weight = np.clip(arr[mask, src_channel] / 240.0, 0.0, 1.0)[:, None]
        out[mask, :3] = navy_rgb * weight + out[mask, :3] * (1.0 - weight)

    # Nucleus & Atom
    out[mask_nucleus, :3] = navy_rgb
    out[mask_atom, :3] = navy_rgb
    
    return Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))

artifact_dir = r'C:\Users\DEVENDER\.gemini\antigravity\brain\2dd31d9b-3f2c-4247-9319-6d3e04e1b616'
os.makedirs('public/images/cseel_logo_variants', exist_ok=True)

# ── 1. CSEEL Ink Deep Navy (#0D4979) on White / Transparent ──
img_navy1 = recolor_all("#0D4979")
img_navy1.save('public/images/cseel_logo_variants/cseel_2color_navy_0D4979.png')
img_navy1.save(os.path.join(artifact_dir, 'cseel_2color_navy_0D4979.png'))

# ── 2. CSEEL Deep Brand Navy (#003C6E) on White / Transparent ──
img_navy2 = recolor_all("#003C6E")
img_navy2.save('public/images/cseel_logo_variants/cseel_2color_navy_003C6E.png')
img_navy2.save(os.path.join(artifact_dir, 'cseel_2color_navy_003C6E.png'))

# ── 3. CSEEL Official Logo Blue-Navy (#0B4C6A) on White / Transparent ──
img_navy3 = recolor_all("#0B4C6A")
img_navy3.save('public/images/cseel_logo_variants/cseel_2color_navy_0B4C6A.png')
img_navy3.save(os.path.join(artifact_dir, 'cseel_2color_navy_0B4C6A.png'))

# ── 4. Inverted Dark Mode / App Icon: Deep Navy Background (#0D4979) with Pure White Logo ──
arr_inv = arr.copy()
white_rgb = np.array([255, 255, 255], dtype=np.float32)
navy_bg = hex_to_rgb("#0D4979")

# Inner white background becomes navy
# Where arr is white/near-white inside (arr[:, :, :3] > 240) and alpha > 200
inner_white = (arr[:, :, 0] > 230) & (arr[:, :, 1] > 230) & (arr[:, :, 2] > 230) & (arr[:, :, 3] > 200)

out_inv = arr.copy()
out_inv[inner_white, :3] = navy_bg
for mask in [mask_tl, mask_tr, mask_bl, mask_br, mask_nucleus, mask_atom]:
    out_inv[mask, :3] = white_rgb

img_inv = Image.fromarray(np.clip(out_inv, 0, 255).astype(np.uint8))
img_inv.save('public/images/cseel_logo_variants/cseel_2color_inverted_tile.png')
img_inv.save(os.path.join(artifact_dir, 'cseel_2color_inverted_tile.png'))

print("All 2-color Deep Navy Blue & White logos generated!")
