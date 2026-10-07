import re

with open(r"d:\Projects\cseel_next\cseel-next\src\app\(public)\Client.tsx", "r", encoding="utf-8") as f:
    text = f.read()

links = set(re.findall(r'href=[\"\'](/[^\"\'\s#\?]*)[\"\']', text))
print("Homepage links count:", len(links))
for l in sorted(links):
    if not l.startswith("/images"):
        print(l)
