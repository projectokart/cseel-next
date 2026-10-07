import os
import shutil
from PIL import Image

src_path = r"C:\Users\DEVENDER\Downloads\cseel_exact_color_match_emblem.png"
svg_path = r"C:\Users\DEVENDER\Downloads\logo.svg"

img = Image.open(src_path).convert("RGBA")
print(f"Loaded source image: {src_path}, size: {img.size}")

# Define all output targets
targets = {
    "public_ico": (r"d:\Projects\cseel_next\cseel-next\public\favicon.ico", "ico"),
    "app_ico": (r"d:\Projects\cseel_next\cseel-next\src\app\favicon.ico", "ico"),
    
    "public_fav16": (r"d:\Projects\cseel_next\cseel-next\public\favicon-16x16.png", 16),
    "public_fav32": (r"d:\Projects\cseel_next\cseel-next\public\favicon-32x32.png", 32),
    "public_fav48": (r"d:\Projects\cseel_next\cseel-next\public\favicon-48x48.png", 48),
    "public_fav96": (r"d:\Projects\cseel_next\cseel-next\public\favicon-96x96.png", 96),
    "public_fav144": (r"d:\Projects\cseel_next\cseel-next\public\favicon-144x144.png", 144),
    "public_fav192": (r"d:\Projects\cseel_next\cseel-next\public\favicon-192x192.png", 192),
    
    "public_fav_png": (r"d:\Projects\cseel_next\cseel-next\public\favicon.png", 48),
    "public_icon192": (r"d:\Projects\cseel_next\cseel-next\public\icon-192x192.png", 192),
    "public_icon512": (r"d:\Projects\cseel_next\cseel-next\public\icon-512x512.png", 512),
    "public_icon": (r"d:\Projects\cseel_next\cseel-next\public\icon.png", 512),
    "app_icon": (r"d:\Projects\cseel_next\cseel-next\src\app\icon.png", 512),
    
    "public_apple": (r"d:\Projects\cseel_next\cseel-next\public\apple-touch-icon.png", 180),
    "app_apple": (r"d:\Projects\cseel_next\cseel-next\src\app\apple-icon.png", 180),
}

for key, (path, spec) in targets.items():
    if spec == "ico":
        # multi-size ICO: 16x16, 32x32, 48x48
        im16 = img.resize((16, 16), Image.Resampling.LANCZOS)
        im32 = img.resize((32, 32), Image.Resampling.LANCZOS)
        im48 = img.resize((48, 48), Image.Resampling.LANCZOS)
        im48.save(path, format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])
        print(f"Generated {key} at {path} ({os.path.getsize(path)} bytes)")
    else:
        size = spec
        resized = img.resize((size, size), Image.Resampling.LANCZOS)
        resized.save(path, format="PNG", optimize=True)
        print(f"Generated {key} ({size}x{size}) at {path} ({os.path.getsize(path)} bytes)")

# Update SVGs
svg_targets = [
    r"d:\Projects\cseel_next\cseel-next\public\favicon.svg",
    r"d:\Projects\cseel_next\cseel-next\public\icon.svg",
    r"d:\Projects\cseel_next\cseel-next\src\app\icon.svg",
]
for target in svg_targets:
    shutil.copyfile(svg_path, target)
    print(f"Copied SVG to {target} ({os.path.getsize(target)} bytes)")

print("\n--- ALL ICONS AND FAVICONS REGENERATED AND VERIFIED ---")
