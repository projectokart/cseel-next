import numpy as np
from PIL import Image
import os

artifact_dir = r'C:\Users\DEVENDER\.gemini\antigravity\brain\2dd31d9b-3f2c-4247-9319-6d3e04e1b616'

for fname in ['cseel_theme_signature.png', 'cseel_theme_gradient_blue.png', 'cseel_theme_two_tone.png', 'cseel_theme_4domains.png']:
    src_f = os.path.join('public/images/cseel_logo_variants', fname)
    im = Image.open(src_f).convert('RGBA')
    arr = np.array(im)
    
    # Outer background: outside the squircle, alpha is 0 or very low, or near white outside
    # Let's inspect edges: (x < 30 or x > 994 or y < 30 or y > 994)
    # The existing image has transparent background outside the sticker border (arr[:, :, 3] == 0)
    # Let's also save to public/images/ as default cseel emblem
    if fname == 'cseel_theme_4domains.png':
        im.save('public/images/cseel-emblem-new.png')
        im.save(os.path.join(artifact_dir, 'cseel-emblem-new.png'))
    if fname == 'cseel_theme_signature.png':
        im.save('public/images/cseel-emblem-signature.png')
        im.save(os.path.join(artifact_dir, 'cseel-emblem-signature.png'))

print('Saved variants!')
