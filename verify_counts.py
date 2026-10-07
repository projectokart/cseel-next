import json
import re

with open('items60_raw.json', 'r', encoding='utf-8') as f:
    items60 = json.load(f)
with open('items90_raw.json', 'r', encoding='utf-8') as f:
    items90 = json.load(f)

print(f'60 count: {len(items60)}, 90 count: {len(items90)}')
