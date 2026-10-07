import numpy as np
from PIL import Image
import os
import shutil

src_path = r'C:\Users\DEVENDER\.gemini\antigravity\brain\2dd31d9b-3f2c-4247-9319-6d3e04e1b616\.user_uploaded\media_1791024642916.png'
base_img = Image.open(src_path).convert('RGBA')
arr = np.array(base_img, dtype=np.float32)

H, W, _ = arr.shape
Y, X = np.ogrid[:H, :W]

# Masks for regions in the image:
# 1. Top-Left quadrant (Blue in source)
mask_tl = (X < 512) & (Y < 512) & (arr[:, :, 2] > 140) & (arr[:, :, 0] < 120)

# 2. Top-Right quadrant (Red in source)
mask_tr = (X > 512) & (Y < 512) & (arr[:, :, 0] > 140) & (arr[:, :, 1] < 100)

# 3. Bottom-Left quadrant (Yellow in source)
mask_bl = (X < 512) & (Y > 512) & (arr[:, :, 0] > 180) & (arr[:, :, 1] > 120) & (arr[:, :, 2] < 80)

# 4. Bottom-Right quadrant (Green in source)
mask_br = (X > 512) & (Y > 512) & (arr[:, :, 1] > 100) & (arr[:, :, 0] < 100) & (arr[:, :, 2] < 120)

# 5. Center Nucleus (Dark circle around 512, 512)
dist_center = np.sqrt((X - 512)**2 + (Y - 512)**2)
mask_nucleus = (dist_center < 70) & (arr[:, :, 0] < 80) & (arr[:, :, 1] < 100) & (arr[:, :, 2] < 110) & (arr[:, :, 3] > 200)

# 6. Atom Orbits and electron dots (dark blue strokes in center area)
mask_atom = (dist_center < 260) & ~mask_nucleus & (arr[:, :, 0] < 80) & (arr[:, :, 1] < 140) & (arr[:, :, 2] > 80)

def hex_to_rgb(hex_str):
    hex_str = hex_str.lstrip('#')
    return np.array([int(hex_str[i:i+2], 16) for i in (0, 2, 4)], dtype=np.float32)

def recolor_image(tl_hex, tr_hex, bl_hex, br_hex, nucleus_hex, atom_hex=None):
    out = arr.copy()
    
    tl_rgb = hex_to_rgb(tl_hex)
    tr_rgb = hex_to_rgb(tr_hex)
    bl_rgb = hex_to_rgb(bl_hex)
    br_rgb = hex_to_rgb(br_hex)
    nuc_rgb = hex_to_rgb(nucleus_hex)
    
    # Recolor with anti-aliasing / luminosity preservation
    # For quadrants:
    for mask, target_rgb, src_channel in [
        (mask_tl, tl_rgb, 2), # Blue channel guided
        (mask_tr, tr_rgb, 0), # Red channel guided
        (mask_bl, bl_rgb, 0), # Red channel guided
        (mask_br, br_rgb, 1), # Green channel guided
    ]:
        weight = np.clip(arr[mask, src_channel] / 240.0, 0.0, 1.0)[:, None]
        out[mask, :3] = target_rgb * weight + out[mask, :3] * (1.0 - weight)

    # Recolor nucleus
    nuc_weight = np.clip((70 - dist_center[mask_nucleus]) / 15.0, 0.0, 1.0)[:, None]
    out[mask_nucleus, :3] = nuc_rgb

    # Recolor atom orbits if specified
    if atom_hex:
        atom_rgb = hex_to_rgb(atom_hex)
        out[mask_atom, :3] = atom_rgb

    return Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))

os.makedirs('public/images/cseel_logo_variants', exist_ok=True)
artifact_dir = r'C:\Users\DEVENDER\.gemini\antigravity\brain\2dd31d9b-3f2c-4247-9319-6d3e04e1b616'

# ── VARIATION 1: CSEEL Core Dual-Tone (Signature Deep Petrol Navy + Amber Gold Nucleus) ──
# Top-Left: Deep Petrol Blue (#0B4C6A), Top-Right: Ocean Teal (#0878A8)
# Bottom-Left: Warm Amber Gold (#F8A130), Bottom-Right: Deep Navy (#003C6E)
# Nucleus: Warm Amber Gold (#F8A130)
v1 = recolor_image(
    tl_hex="#0B4C6A",
    tr_hex="#0878A8",
    bl_hex="#F8A130",
    br_hex="#003C6E",
    nucleus_hex="#F8A130",
    atom_hex="#0B4C6A"
)
v1.save('public/images/cseel_logo_variants/cseel_theme_signature.png')
v1.save(os.path.join(artifact_dir, 'cseel_theme_signature.png'))

# ── VARIATION 2: CSEEL Full Scientific Gradient (Navy to Bright Cyan + Golden Core) ──
# Top-Left: Deep Navy (#0D4979), Top-Right: Brand Blue (#005689)
# Bottom-Left: Ocean Teal (#0878A8), Bottom-Right: Electric Cyan (#00A3CC)
# Nucleus: Warm Amber Gold (#F8A130)
v2 = recolor_image(
    tl_hex="#0D4979",
    tr_hex="#005689",
    bl_hex="#0878A8",
    br_hex="#00A3CC",
    nucleus_hex="#F8A130",
    atom_hex="#005689"
)
v2.save('public/images/cseel_logo_variants/cseel_theme_gradient_blue.png')
v2.save(os.path.join(artifact_dir, 'cseel_theme_gradient_blue.png'))

# ── VARIATION 3: CSEEL Dual-Color Minimalist (Official 2-Tone Navy & Gold) ──
# Top-Left & Bottom-Right: CSEEL Deep Brand Blue (#005689)
# Top-Right & Bottom-Left: CSEEL Warm Gold (#F8A130)
# Nucleus: Warm Amber Gold (#F8A130), Atom: Deep Brand Blue (#005689)
v3 = recolor_image(
    tl_hex="#005689",
    tr_hex="#F8A130",
    bl_hex="#F8A130",
    br_hex="#005689",
    nucleus_hex="#F8A130",
    atom_hex="#005689"
)
v3.save('public/images/cseel_logo_variants/cseel_theme_two_tone.png')
v3.save(os.path.join(artifact_dir, 'cseel_theme_two_tone.png'))

# ── VARIATION 4: CSEEL 4 Domains Theme (Science, Tech, Art/Innovation, Growth) ──
# Top-Left (Science): CSEEL Deep Blue (#005689)
# Top-Right (Technology/Engineering): CSEEL Cyan (#00A3CC)
# Bottom-Left (Art & Creativity): CSEEL Amber Gold (#F8A130)
# Bottom-Right (Growth & Sustainability): CSEEL Emerald Green (#10B981)
# Nucleus: Amber Gold (#F8A130)
v4 = recolor_image(
    tl_hex="#005689",
    tr_hex="#00A3CC",
    bl_hex="#F8A130",
    br_hex="#10B981",
    nucleus_hex="#F8A130",
    atom_hex="#005689"
)
v4.save('public/images/cseel_logo_variants/cseel_theme_4domains.png')
v4.save(os.path.join(artifact_dir, 'cseel_theme_4domains.png'))

print("All 4 CSEEL theme variations successfully generated and saved!")
