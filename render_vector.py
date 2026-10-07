import subprocess
import os

chrome_path = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
artifact_dir = r'C:\Users\DEVENDER\.gemini\antigravity\brain\2dd31d9b-3f2c-4247-9319-6d3e04e1b616'

with open('public/images/cseel-emblem-2color.svg', 'r', encoding='utf-8') as f:
    svg_data = f.read()

html_content = f'''<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:transparent;overflow:hidden;width:1000px;height:1000px;">
{svg_data}
</body>
</html>'''

with open('public/images/temp_render.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

out_png = os.path.abspath('public/images/cseel-emblem-2color-vector.png')
cmd = [
    chrome_path,
    '--headless',
    '--disable-gpu',
    '--window-size=1000,1000',
    '--default-background-color=00000000',
    f'--screenshot={out_png}',
    os.path.abspath('public/images/temp_render.html')
]
subprocess.run(cmd, check=True)

import shutil
shutil.copyfile(out_png, os.path.join(artifact_dir, 'cseel-emblem-2color-vector.png'))
print('Vector rendered to PNG!')
