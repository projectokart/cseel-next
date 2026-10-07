import numpy as np
from PIL import Image
import os
import shutil

# Load original logo
orig = Image.open('public/images/logo.png').convert('RGBA')
orig_w, orig_h = orig.size

# Back up original logo just in case
if not os.path.exists('public/images/logo_backup.png'):
    shutil.copyfile('public/images/logo.png', 'public/images/logo_backup.png')

# Right side: from x = 295 to 965 (contains the vertical line and text)
# Left side: from x = 0 to 295 (will be replaced with our new emblem)
right_part = orig.crop((290, 0, orig_w, orig_h))

# New emblem options:
# 1. Badge version (with rounded square card)
emblem_badge = Image.open('public/images/cseel_logo_variants/cseel_navy_golden_nucleus_badge.png').convert('RGBA')

# 2. Transparent version (no outer square card, just the 4 brackets + atom)
emblem_trans = Image.open('public/images/cseel_logo_variants/cseel_navy_golden_nucleus_transparent.png').convert('RGBA')

def composite_logo(emblem_img, out_path, bg_color=(255, 255, 255, 255), emblem_size=260):
    # Create new canvas with exact same height (326) and width (965)
    canvas = Image.new('RGBA', (orig_w, orig_h), bg_color)
    
    # Resize emblem with high quality Lanczos filter
    resized_emblem = emblem_img.resize((emblem_size, emblem_size), Image.Resampling.LANCZOS)
    
    # Position emblem centered in x: [0, 290] and vertically in [0, 326]
    emblem_x = (290 - emblem_size) // 2
    emblem_y = (orig_h - emblem_size) // 2
    
    # Paste emblem using alpha mask
    canvas.paste(resized_emblem, (emblem_x, emblem_y), resized_emblem)
    
    # Paste right side (vertical line + CSEEL text + tagline)
    canvas.paste(right_part, (290, 0), right_part)
    
    canvas.save(out_path)
    return canvas

artifact_dir = r'C:\Users\DEVENDER\.gemini\antigravity\brain\2dd31d9b-3f2c-4247-9319-6d3e04e1b616'

# Generate Version 1: Clean Transparent Icon (seamlessly integrates with the text)
v1_white = composite_logo(emblem_trans, 'public/images/logo_replaced_transparent_icon.png', bg_color=(255, 255, 255, 255), emblem_size=265)
v1_white.save(os.path.join(artifact_dir, 'logo_replaced_transparent_icon.png'))

# Generate Version 2: App Badge Icon (with subtle white/grey card container)
v2_badge = composite_logo(emblem_badge, 'public/images/logo_replaced_badge_icon.png', bg_color=(255, 255, 255, 255), emblem_size=265)
v2_badge.save(os.path.join(artifact_dir, 'logo_replaced_badge_icon.png'))

# Also create true transparent versions for dark or colored backgrounds
v1_alpha = composite_logo(emblem_trans, 'public/images/logo_replaced_transparent_bg.png', bg_color=(255, 255, 255, 0), emblem_size=265)
v1_alpha.save(os.path.join(artifact_dir, 'logo_replaced_transparent_bg.png'))

print("Composite logo variations generated successfully!")
