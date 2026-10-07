import subprocess
import os
from PIL import Image

chrome = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
svg_path = os.path.abspath(r"C:\Users\DEVENDER\Downloads\logo.svg")
temp_html = os.path.abspath(r"C:\Users\DEVENDER\.gemini\antigravity\brain\2dd31d9b-3f2c-4247-9319-6d3e04e1b616\render_emblem.html")

html_content = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * {{ margin: 0; padding: 0; box-sizing: border-box; }}
  html, body {{ width: 848px; height: 848px; margin: 0; padding: 0; overflow: hidden; background: transparent; }}
  img {{ display: block; width: 848px; height: 848px; }}
</style>
</head>
<body>
  <img src="file:///{svg_path.replace(os.sep, '/')}" width="848" height="848" />
</body>
</html>"""

with open(temp_html, "w", encoding="utf-8") as f:
    f.write(html_content)

out_png = r"C:\Users\DEVENDER\Downloads\cseel_exact_color_match_emblem.png"
cmd = [
    chrome,
    "--headless",
    "--disable-gpu",
    "--default-background-color=00000000",
    "--window-size=848,848",
    f"--screenshot={out_png}",
    f"file:///{temp_html.replace(os.sep, '/')}"
]

res = subprocess.run(cmd, capture_output=True, text=True)
print("Chrome exit code:", res.returncode)
print("Output PNG size:", os.path.getsize(out_png))

# Let's inspect the colors of this freshly rendered PNG
im = Image.open(out_png).convert("RGBA")
print("Rendered PNG dimensions:", im.size)
colors = im.getcolors(maxcolors=1000000)
print(f"Total distinct colors: {len(colors)}")
